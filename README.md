# tutorials.ubuntu.com

The Polymer application that runs <https://tutorials.ubuntu.com>.

For anyone wishing to contribute work or file issues, please read [CONTRIBUTING.md](CONTRIBUTING.md).

For technical details and help, go to [HACKING.md](HACKING.md)


## Running this site

The easiest way to get running is to use our `./run` command. This script requires Docker to be installed on your system.
For more advanced usage or information how to run without Docker, read [HACKING.md](HACKING.md).

### Quick start

Start up a local server which watches serves content from the `examples` folder:
``` bash
$ ./run
```

 Start up a local server which watches a given file or folder for changes relative to the project root.
``` bash
./run serve [file or folder]
```


---

The information presented on <https://tutorials.ubuntu.com> is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/). The codebase of the tutorials application is licensed under the [LGPLv3](http://opensource.org/licenses/lgpl-3.0.html) by [Canonical Ltd](http://www.canonical.com/).

This code is based on [ubuntu/codelabs-source](https://github.com/ubuntu/codelabs-source) (by [@didrocks](https://github.com/didrocks)), which is in turn based on [googlecodelabs/codelab-components](https://github.com/googlecodelabs/codelab-components). Codelab-components is licensed with the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0).
