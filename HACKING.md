# Ubuntu tutorials

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
