# Contributing

Issues, content and code contributions are all very appreciated. We ask that you read the relevant sections of this document before contributing.


## Issues

When creating issues, please add as much information as you can and try to split it up into readable sections.

Some example sections to include:
 - Short summary
 - Steps taken to produce the issue
 - Current and expected result
 - A screenshot to demonstrate the issue


## Pull requests

Please try to create simple commits with readable commit messages. Do split the work into smaller pull requests, rather than one big pull request.

Some sections to include when creating a PR:
 - Short summary of the work completed
 - Steps to view and test visual or code changes
 - Links to any relevant issues
 - Screenshots to demonstrate the work


## Tutorial content

We have created a [guidelines document](https://docs.google.com/document/d/1u5qmSNIcE8SjuAg6aKjTxOBGWIjBW0kYf01t4Dfw6-U/edit) which contains details on our practices and conventions.

We support Google Docs as a source for our Tutorials but want to use Markdown content moving forward.


### Markdown

_If you find any bugs in Markdown rendering, please report them to [Ubuntu tutorial deployment repository](https://github.com/ubuntu/tutorial-deployment)_

Our [Ubuntu tutorial guidelines](./examples/guidelines-snap-tutorials.md) markdown tutorial is inside the `examples` folder. This contains useful information and resources to creating new tutorials. You can view this tutorial in full by running the local server with example data and can use the source as a template to create new content.

The markdown is rendered by [Google's claat markdown parser](https://github.com/googlecodelabs/tools/tree/master/claat/parser/md). More information can be found on their github page.

#### Where should I save the file?

Please save new markdown files in a folder inside `./tutorials`, and save images in an `images` subfolder.
```
.
└── tutorials
    └── new-tutorial-name
        ├── images
            └── example-image.png
        └── new-tutorial-name.md
```

We are working on adding external repository support for Canonical maintained repositories.


### Google Doc

While Google Doc tutorials are being deprecated for this project, instructions on how to create these documents are available at [googlecodelabs/tools repository](https://github.com/googlecodelabs/tools). You can also visit the [official Codelab Formatting Guide](https://docs.google.com/document/d/18dnMdUJQaGKY1Tit_-fO1YOpOpAbA4hh0YDXQlCEjvA/edit?ts=574ec5d9), once you have joined [Google's Codelab Authors group](https://groups.google.com/forum/#!forum/codelab-authors).
