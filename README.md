# tutorials.ubuntu.com

The Polymer application that runs <https://tutorials.ubuntu.com>.

For anyone wishing to contribute work or file issues, please read [CONTRIBUTING.md](CONTRIBUTING.md).

For technical details and help, go to [HACKING.md](HACKING.md)


## Running this site

There are two primary ways to run this website locally. We recommend using the `./run` command, which runs the site through Docker. The site can also run directly on the system with our build tools and Polymer.


### `./run` command


#### Dependencies

- Latest version of Docker


#### Quick start

Start up a local server which watches serves content from the `examples` folder:
``` bash
$ ./run
```

 Start up a local server which watches a given file or folder for changes relative to the project root.
``` bash
./run serve [file or folder]
```


#### Usage

- `./run`: Run local server with example content.
- `./run serve [file or folder]`: Run server and watch a local file or folder.
- `./run help`: Print help.

NPM/Yarn scripts:
- `./run yarn serve-live`: Run local server with live content.
- `./run yarn build-all`: Generate live tutorials and build live site.
- `./run yarn build-site`: Build site to `build` folder.
- `./run yarn build-tutorials`: Generate live tutorials.
- `./run yarn polymer [args]`: Run a command through Polymer.


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
$ ./yarn run serve examples
```
The `examples` in the command can be replaced with another path.


#### Usage

Scripts are set up through the `package.json` file and run through Yarn:

- `yarn run serve [file or folder]`: Run server and watch a local file or folder.
- `yarn run build`: Generate Tutorials and build live site.
- `yarn run serve-live`: Run local server with live content.
- `yarn run build-site`: Build site to `build` folder.
- `yarn run build-tutorials`: Generate live tutorials.
- `yarn run polymer [args]`: Run a command through Polymer.


## Building Your Application

Running the build command will generate a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

---

The information presented on <https://tutorials.ubuntu.com> is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/). The codebase of the tutorials application is licensed under the [LGPLv3](http://opensource.org/licenses/lgpl-3.0.html) by [Canonical Ltd](http://www.canonical.com/).

This code is based on [ubuntu/codelabs-source](https://github.com/ubuntu/codelabs-source) (by [@didrocks](https://github.com/didrocks)), which is in turn based on [googlecodelabs/codelab-components](https://github.com/googlecodelabs/codelab-components). Codelab-components is licensed with the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0).
