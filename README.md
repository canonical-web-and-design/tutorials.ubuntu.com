# tutorials.ubuntu.com

The Polymer application that runs <https://tutorials.ubuntu.com>.

For guidelines and help on how to build tutorial content, go to [CONTRIBUTING.md](CONTRIBUTING.md)

For more in depth information on how the site works, go to [HACKING.md](HACKING.md)

## Local development

You can run this project locally with [Polymer CLI](https://www.npmjs.com/package/polymer-cli).

### Dependencies

``` bash
npm install -g polymer-cli bower  # Install Polymer and Bower
bower install                     # Pull down Bower dependencies
```

## Viewing Your Application

```
$ polymer serve
```

## Importing Codelabs

Upon loading the website initially, you will likely be met with example content.
To import live content, you will need to run:

```
$ ./bin/build-tutorials
```

This will import the defined Google Doc IDs from the config folder.

If you encounter an auth error, trying to import with this command should give you instructions on getting the token.

```
$ ./tools/codelabs add [GOOGLE_DOC_ID]
```


## Building Your Application

```
$ polymer build
```

This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

You can serve the built versions by giving `polymer serve` a folder to serve
from:

```
$ polymer serve build/bundled/app
```

---

The information presented on <https://tutorials.ubuntu.com> is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/). The codebase of the tutorials application is licensed under the [LGPLv3](http://opensource.org/licenses/lgpl-3.0.html) by [Canonical Ltd](http://www.canonical.com/).

This code is based on [ubuntu/codelabs-source](https://github.com/ubuntu/codelabs-source) (by [@didrocks](https://github.com/didrocks)), which is in turn based on [googlecodelabs/codelab-components](https://github.com/googlecodelabs/codelab-components). Codelab-components is licensed with the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0).
