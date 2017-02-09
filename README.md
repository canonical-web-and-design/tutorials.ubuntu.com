# tutorials.ubuntu.com

The Polymer application that runs <https://tutorials.ubuntu.com>.

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

Based on [ubuntu/codelabs-source](https://github.com/ubuntu/codelabs-source) (by [@didrocks](https://github.com/didrocks)), which is in turn based on [googlecodelabs/codelab-components](https://github.com/googlecodelabs/codelab-components).
