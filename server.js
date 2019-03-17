/**
 * This file is modified from Polymer's prpl-server project. The original file
 * can be found at:
 * https://github.com/Polymer/prpl-server-node/blob/master/src/cli.ts
 *
 * This file is licensed under a BSD license from Polymer:
 *
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

"use strict";

let compression = require('compression')
let express = require('express');
let fs = require('fs');
let path = require('path');

let prpl = require('prpl-server');

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const ansi = require('ansi-escape-sequences');
const cheerio     = require('cheerio');
const interceptor = require('express-interceptor');
const redirect = require('express-redirect');
const rendertron = require('rendertron-middleware');
const sitemap = require('sitemap');

const redirectsConfig = require('./redirects.json');

const argDefs = [
  {
    name: 'help',
    type: Boolean,
    description: 'Print this help text.',
  },
  {
    name: 'version',
    type: Boolean,
    description: 'Print the installed version.',
  },
  {
    name: 'host',
    type: String,
    defaultValue: '127.0.0.1',
    description: 'Listen on this hostname (default 127.0.0.1).',
  },
  {
    name: 'port',
    type: Number,
    defaultValue: 8080,
    description: 'Listen on this port; 0 for random (default 8080).'
  },
  {
    name: 'root',
    type: String,
    defaultValue: '.',
    description: 'Serve files relative to this directory (default ".").',
  },
  {
    name: 'config',
    type: String,
    description:
        'JSON configuration file (default "<root>/polymer.json" if exists).',
  },
  {
    name: 'https-redirect',
    type: Boolean,
    description:
        'Redirect HTTP requests to HTTPS with a 301. Assumes same hostname ' +
        'and default port (443). Trusts X-Forwarded-* headers for detecting ' +
        'protocol and hostname.',
  },
  {
    name: 'bot-proxy',
    type: String,
    description: 'Proxy requests from bots/crawlers to this URL. See ' +
        'https://github.com/GoogleChrome/rendertron for more details.',
  },
  {
    name: 'cache-control',
    type: String,
    description:
        'The Cache-Control header to send for all requests except the ' +
        'entrypoint (default from config file or "max-age=60").',
  },
];


const args = commandLineArgs(argDefs);

if (args.help) {
  console.log(commandLineUsage([
    {
      header: `[magenta]{prpl-server}`,
      content: 'https://github.com/Polymer/prpl-server-node',
    },
    {
      header: `Options`,
      optionList: argDefs,
    }
  ]));
  return;
}

if (args.version) {
  console.log(require('../package.json').version);
  return;
}

if (!args.host) {
  throw new Error('invalid --host');
}
if (isNaN(args.port)) {
  throw new Error('invalid --port');
}
if (!args.root) {
  throw new Error('invalid --root');
}

// If specified explicitly, a missing config file will error. Otherwise, try
// the default location and only warn when it's missing.
if (!args.config) {
  const p = path.join(args.root, 'polymer.json');
  if (fs.existsSync(p)) {
    args.config = p;
  } else {
    console.warn('WARNING: No config found.');
  }
}
let config = {};
if (args.config) {
  console.info(`Loading config from "${args.config}".`);
  config = JSON.parse(fs.readFileSync(args.config, 'utf8'));
}

if (args['cache-control']) {
  config.cacheControl = args['cache-control'];
};

// Route prpl-server errors back to Express
config.forwardErrors = true;

const hostname = 'https://tutorials.ubuntu.com';
const tutorialBasePath= `/tutorial`;
const tutorialBaseURL = `${hostname}${tutorialBasePath}`;

const siteTitle = 'Ubuntu tutorials'
const siteDescription = 'Ubuntu Tutorials are just like learning from pair programming except you can do it on your own. They provide a step-by-step process to doing development and devops activities with Ubuntu, on servers, clouds or devices.';

const tutorialsAPIPath = path.join(__dirname, 'api', 'codelabs.json');
const tutorialsData = require(tutorialsAPIPath).codelabs;

function generateSitemap() {
   let tutorialsSitemap = sitemap.createSitemap ({
    hostname: hostname,
    cacheTime: 600000
  });

  // Add root path
  tutorialsSitemap.add({url: '/'});

  // Add an item for each tutorial
  tutorialsData.forEach(function(tutorial) {
    if (tutorial.tags.indexOf('hidden') !== -1) {
      return;
    }
    let tutorialURL = tutorialBasePath + '/' + tutorial.id
    tutorialsSitemap.add(tutorialURL);
  });

  return tutorialsSitemap;
}

const app = express();

// Trust X-Forwarded-* headers so that when we are behind a reverse proxy,
// our connection information is that of the original client (according to
// the proxy), not of the proxy itself. We need this for HTTPS redirection
// and bot rendering.
app.set('trust proxy', true);

app.set('env', 'production')

if (args['https-redirect']) {
  console.info(`Redirecting HTTP requests to HTTPS.`);
  app.use((req, res, next) => {
    if (req.secure) {
      next();
      return;
    }
    res.redirect(301, `https://${req.hostname}${req.url}`);
  });
}

function setCanonicalURL($document, $head, url) {
  let $canonicalURL = $document(`link[rel="canonical"]`);
  if ($canonicalURL.length === 0) {
    $canonicalURL = $document(`<link rel="canonical">`);
    $head.append($canonicalURL);
  }
  $canonicalURL.attr('href', url);
}

function setMetaTag($document, $head, name, content) {
  let $metaTag = $document(`meta[name="${name}"]`);
  if ($metaTag.length === 0) {
    $metaTag = $document(`<meta name="${name}">`);
    $head.append($metaTag);
  }
  $metaTag.attr('content', content);
}

function mapTutorialMetadata(tutorialMetadata, HTMLMeta) {
  const metadataMap = {
    author: ['author', 'article:author'],
    image: ['og:image'],
    published: ['article:published_time'],
    summary: ['description', 'og:description'],
  }
  for (let key in metadataMap) {
    if (tutorialMetadata[key] !== undefined) {
      metadataMap[key].forEach(function(metaName) {
        HTMLMeta[metaName] = tutorialMetadata[key];
      });
    }
  }
  return HTMLMeta;
}

const applyMetadata = interceptor(function(req, res){
  return {
    // Only HTML responses will be intercepted
    isInterceptable: function(){
      const isHTML = /text\/html/.test(res.get('Content-Type'));
      return !res.locals.isError && !res.locals.isFileRequest && isHTML;
    },
    // Appends a paragraph at the end of the response body
    intercept: function(body, send) {
      const $document = cheerio.load(body);
      const $head = $document('head');
      let title = siteTitle;
      let url = false;
      let HTMLMeta = {
        description: siteDescription,
      };

      if (res.locals.isTutorial && res.locals.tutorialMetadata) {
        title = `${res.locals.tutorialMetadata.title} | ${title}`;
        url = `${tutorialBaseURL}/${res.locals.tutorialMetadata.id}`;
        HTMLMeta['og:title'] = title;
        HTMLMeta['og:type'] = 'article';
        HTMLMeta['og:url'] = url;

        HTMLMeta = mapTutorialMetadata(res.locals.tutorialMetadata, HTMLMeta);
      }

      for(let key in HTMLMeta) {
        setMetaTag($document, $head, key, HTMLMeta[key]);
      }

      if (url) {
        setCanonicalURL($document, $head, url);
        setMetaTag($document, $head, 'og:url', url);
      }

      $document('title').text(title);
      send($document.html());
    }
  };
})

app.use(function(req, res, next){
  res.locals.isError = false;
  res.locals.isTutorial = false;
  res.locals.isFileRequest = false;
  res.locals.tutorialMetadata = false;
  next();
});

app.use(compression());

// Add the interceptor middleware
app.use(applyMetadata);

// Handle redirects
redirect(app);

Object.keys(redirectsConfig).forEach(function (key) {
  app.redirect(
    key,
    redirectsConfig[key],
    302, true
  );
});

if (args['bot-proxy']) {
  console.info(`Proxying bots to "${args['bot-proxy']}".`);
  app.use(rendertron.makeMiddleware({
    proxyUrl: args['bot-proxy'],
    injectShadyDom: true,
  }));
}

app.use('*.html', function(req, res, next) {
  // If the path ends with .html, it is a direct file request
  // and we should avoid modifying the output
  res.locals.isFileRequest = true;
  next()
});

// Serve API folder directly
app.use('/api', express.static(
  path.join(__dirname, 'api'),
  {
    // Return a 404 if api file does not exist
    fallthrough: false,
  }
));

// If a tutorial does not exist, return a 404 header
app.use('/tutorial/:id', function(req, res, next){
  const id = req.params.id;
  res.locals.isTutorial = true;
  res.locals.tutorialMetadata = tutorialsData.filter(function(data) {
    return data.id === id;
  })[0];
  if (!res.locals.tutorialMetadata) {
    res.locals.isError = true;
    res.status(404);
  }
  next()
});

const tutorialsSitemap = generateSitemap();
app.get('/sitemap.xml', function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.send( tutorialsSitemap.toString() );
});

app.use('/', prpl.makeHandler(args.root, config));

app.use(function errorHandler(req, res, next){
  res.locals.isError = true;
  next();
});

const server = app.listen(args.port, args.host, () => {
  const addr = server.address();
  let urlHost = addr.address;
  if (addr.family === 'IPv6') {
    urlHost = '[' + urlHost + ']';
  }
  console.log();
  console.log(ansi.format('[magenta bold]{prpl-server} listening'));
  console.log(ansi.format(`[blue]{http://${urlHost}:${addr.port}}`));
  console.log();
});
