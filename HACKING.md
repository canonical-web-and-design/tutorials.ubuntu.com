# Ubuntu tutorials

## Running this site

There are two primary ways to run this website locally. We recommend using the `./run` command, which runs the site through Docker. The site can also run directly on the system with our build tools and Polymer.


### `./run` command

We also make use of a `./run` script that we generate with our [generator-canonical-webteam Yeoman generator](https://github.com/canonical-webteam/generator-canonical-webteam).

#### Dependencies

- Latest version of Docker


#### Usage

- `./run`: Run local server with example content.
- `./run serve [file or folder]`: Run server and watch a local file or folder.
- `./run help`: Print help.

NPM/Yarn scripts:
- `./run exec yarn run serve-live`: Run local server with live content.
- `./run exec yarn run build-all`: Generate live tutorials and build live site.
- `./run exec yarn run build-site`: Build site to `build` folder.
- `./run exec yarn run build-tutorials`: Generate live tutorials.
- `./run exec yarn run start-server`: Start sever with production config.
- `./run exec yarn run polymer [args]`: Run a command through Polymer.


### Running without Docker


#### Dependencies

- Yarn or NPM
- Bower

(`npm` can be used in place of `yarn` in this document.)

Install NPM and Bower dependencies:
``` bash
$ yarn install
$ bower install
```


#### Quick start

Start up a local server which watches the `examples` folder:

``` bash
$ yarn run serve ./examples
```

The `./examples` in the command can be replaced with another path.


#### Usage

Scripts are set up through the `package.json` file and run through Yarn:

- `yarn run serve [file or folder]`: Run server and watch a local file or folder.
- `yarn run build`: Generate Tutorials and build live site.
- `yarn run serve-live`: Run local server with live content.
- `yarn run build-site`: Build site to `build` folder.
- `yarn run build-tutorials`: Generate live tutorials.
- `yarn run start-server`: Generate live tutorials.
- `yarn run polymer [args]`: Run a command through Polymer.


## Building Your Application

Running the build command will generate a `build/` folder with `bundled/` and `unbundled/` sub-folders containing bundled (Vulcanized) and unbundled builds. These builds are run through HTML, CSS, and JS optimizers.


## Dependency management

We use Yarn and Bower to manage the project dependencies. Yarn manages back end tools, while Bower managed front end libraries.

When updating NPM packages, please use `yarn add` rather than `npm install`. As this updates the `yarn.lock` file which we rely upon.


## Technology


### Build tools

The build tool for Tutorials is managed in the [ubuntu/tutorial-deployment](https://github.com/ubuntu/tutorial-deployment) repository. This is used to convert the markdown source files into HTML during the build step, using [Google's `claat`](https://github.com/googlecodelabs/tools/tree/master/claat). It is also used to run a development server which automatically rebuilds tutorials as you work on them.

### API
The `api` folder contains static json metadata which is created during build.

This `tutorial-deployment` tool creates `./api/codelabs.json` which contains json metadata for all the tutorials. During the build step, some smaller API files are generated with `./bin/build-api-feeds`. These files list recent tutorials by category.

### Website

tutorials.ubuntu.com is built with Google's Polymer, using web components. You can find information about these at the following links:

 - https://www.polymer-project.org/1.0/docs/
 - https://www.webcomponents.org/community/articles/why-web-components

The website app has a primary entrypoint at `./src/ubuntu-tutorials-app.html`. All traffic to the app is routed through this file and it manages the routing and state. When the website is loaded the primary `api/codelabs.json` is loaded and used to provide metadata to the website components.

Tutorials are loaded via AJAX and pushed into the page as required. It loads them via URL, which are served as files from this website. These sources could be moved to a seperate server as needed, being wary of [cross origin policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

During the build step, the website is compiled and built into the `build` folder. This folder contains multiple builds for different browser compatibilities which can be customised in the `./polymer.json` file. The Polymer server serves the best version depending on the browser. For example, if the browser does not support the latest ES6 features Polymer will serve the bundle with polyfills to support it.
