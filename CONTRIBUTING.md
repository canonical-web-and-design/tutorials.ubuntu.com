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

Please try to create simple commits with readable commit messages. Do split the work into smaller pull requests, rather than one big pull request, unless you are proposing a new tutorial.

Some sections to include when creating a PR:
 - Short summary of the work completed
 - Steps to view and test visual or code changes
 - Links to any relevant issues
 - Screenshots to demonstrate the work


## Tutorial content

We support Markdown as a source for our tutorials.

### Markdown

_If you find any bugs in Markdown rendering, please report them to [Ubuntu tutorial deployment repository](https://github.com/ubuntu/tutorial-deployment)_

Our [Ubuntu tutorial guidelines](./examples/guidelines-snap-tutorials.md) markdown tutorial is inside the `examples` folder. This contains useful information and resources for creating new tutorials, including documentation on custom markdown tags used in this project. You can view this tutorial in full by running the local server and can use the source as a template to create new content.

The markdown is rendered by [Google's claat markdown parser](https://github.com/googlecodelabs/tools/tree/master/claat/parser/md). More information can be found on their github page.

#### Where should I save the file?

The build tool allows files to be saved in a single folder. We have best practices in our repository to maintain consistency.

Please save new markdown files in a folder inside `./tutorials/<category>/`, and save images in an `images` subfolder.
```
.
└── tutorials
    └── new-tutorial-name
        ├── images
            └── example-image.png
        └── new-tutorial-name.md
```

We are working on adding external repository support for Canonical maintained repositories.
