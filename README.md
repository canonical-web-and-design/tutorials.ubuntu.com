# tutorials.ubuntu.com


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

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

Based on [ubuntu/codelabs-source](https://github.com/ubuntu/codelabs-source) (by [@didrocks](https://github.com/didrocks)), which is in turn based on [googlecodelabs/codelab-components](https://github.com/googlecodelabs/codelab-components).
