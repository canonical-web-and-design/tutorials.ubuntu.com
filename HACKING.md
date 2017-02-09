# Ubuntu tutorials

## Technology

tutorials.ubuntu.com is built with Google's Polymer, using web components. You can find information about these at the following links:

- https://www.polymer-project.org/1.0/
- https://www.webcomponents.org/community/articles/why-web-components


## Adding tutorials
Tutorials are built via Google Docs and we will be adding markdown support.

### `codelabs` command

We are using a binary built from the ubuntu/codelabs repository. This wraps Google's `claat` command (Look below for more information). The source code is at: https://github.com/ubuntu/codelabs/tree/master/tools/codelabs

To add a new document, use this command:
```
./codelab add [GOOGLE_DOC_ID]
```
Or it can update previously imported documents with:
```
./codelab update
```

### Google's claat

Underneath the `codelabs` command, we are using [Google's `claat`](https://github.com/googlecodelabs/tools/tree/master/claat). In that repository, you will find information on the tool and how to download it.

Here is an example command to run from inside the `tools` folder. It will fetch and generate the Basic snap usage tutorial. It will generate the tutorial page itself but will not update the index listing.
```
./claat-linux-amd64 export -f ubuntu-template.html -o "../src/codelabs" --prefix "../../.." "10jai4vAduTxF0RQMUs-pqIRbMM9TXv9dgxjNDGkxduo"
```
