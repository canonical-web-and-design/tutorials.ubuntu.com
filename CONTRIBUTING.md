# How to contribute

Issues, tutorials requests, new tutorials, content fixes and code contributions are all very much appreciated. We ask that you read the relevant sections of this document before contributing.

## Contributing a content fix

Have you spotted a typo? A screenshot that needs updating? A nonsensical sentence? While we strive to foster and maintain quality content, mistakes happen. If you have the time, please open a new Pull Request, propose a fix and add the "Tutorials Content" label to it, it will be reviewed quickly.

## Contributing a new tutorial

See our [writing guide](https://tutorials.ubuntu.com/?q=tutorial+guidelines) for extensive documentation on writing and publishing a new tutorial. It contains step-by-step documentation, content guidelines and examples to help you make the best of this platform. 

All tutorials are reviewed and merged by the Canonical Docs team in order to maintain content consistency. You can get in touch with us on Freenode IRC, in [#ubuntu-doc](http://webchat.freenode.net/?channels=ubuntu-doc).

### New tutorial FAQ

#### What's the format of a tutorial?

Each tutorial is a single Markdown file, placed inside the `tutorials` folder of this repository.

#### Where are images hosted?

Images can be placed inside this repository, alongside a tutorial in an `images` folder.

Note that some tutorials use `assets.ubuntu.com` for image hosting: it's an access-controlled file hosting service used by the Canonical Web team to host images for Ubuntu related websites. If you open a pull request containing images, there is a chance that your reviewer will upload your images there in order to control the size of the repository.

#### Where should I save a new tutorial?

Please save new markdown files in a folder inside `./tutorials/<category>/`, and save images in an `images` subfolder.

```
.
└── tutorials
    └── <category>
        └── new-tutorial-name
            ├── images
                └── image-01.png
            └── new-tutorial-name.md
```

#### A Markdown paragraph is not rendering correctly, why?

The Markdown is rendered by [Google's claat markdown parser](https://github.com/googlecodelabs/tools/tree/master/claat/parser/md), with some custom additions documented in [the writing guide](https://tutorials.ubuntu.com/tutorial/tutorial-guidelines#6).

Most Markdown features are supported, however, if you find any bugs in the rendering, please report them in the [Ubuntu tutorial deployment repository](https://github.com/ubuntu/tutorial-deployment).

## Opening a pull request

Please try to create simple commits with readable commit messages. When possible, split the work into smaller pull requests, rather than one big pull request, unless you are proposing a new tutorial.

Some sections to include when creating a PR:
 - Short summary of the work completed
 - Steps to view and test visual or code changes
 - Links to any relevant issues
 - If applicable, screenshots to demonstrate the work. Note that in most cases, a reviewer will launch an online demo of your PR so that other reviewers and yourself can quickly see how it renders on the site.

## Opening an issue

When opening issues, please add as much information as you can and try to split it up into readable sections.

Some sections to include:
 - Short summary
 - Steps taken to produce the issue
 - Current and expected result
 - If applicable, a screenshot to demonstrate the issue
