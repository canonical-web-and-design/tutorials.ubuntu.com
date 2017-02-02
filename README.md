# tutorials.ubuntu.com


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

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

The information presented on <https://tutorials.ubuntu.com> is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/). The codebase of the tutorials application is licensed under the [LGPLv3](http://opensource.org/licenses/lgpl-3.0.html) by [Canonical Ltd](http://www.canonical.com/).

This code is based on [ubuntu/codelabs-source](https://github.com/ubuntu/codelabs-source) (by [@didrocks](https://github.com/didrocks)), which is in turn based on [googlecodelabs/codelab-components](https://github.com/googlecodelabs/codelab-components). Codelab-components is licensed with the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0).

