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
- `./run node yarn run serve-live`: Run local server with live content.
- `./run node yarn run build-all`: Generate live tutorials and build live site.
- `./run node yarn run build-site`: Build site to `build` folder.
- `./run node yarn run build-tutorials`: Generate live tutorials.
- `./run node yarn run polymer [args]`: Run a command through Polymer.


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


## Dependency management

We use Yarn and Bower to manage the project dependencies. Yarn manages back end tools, while Bower managed front end libraries.

When updating NPM packages, please use `yarn add` rather than `npm install`. As this updates the `yarn.lock` file which we rely upon.


## Technology

tutorials.ubuntu.com is built with Google's Polymer, using web components. You can find information about these at the following links:

- https://www.polymer-project.org/1.0/
- https://www.webcomponents.org/community/articles/why-web-components


### Our build tools

Our tooling used to serve and generate this project is available at our [Ubuntu tutorial deployment repository](https://github.com/ubuntu/tutorial-deployment).


### Google's claat

Underneath the `codelabs` command, we are using [Google's `claat`](https://github.com/googlecodelabs/tools/tree/master/claat). In that repository, you will find information on the tool and how to download it.
