---
id: tutorial-guidelines
summary: Learn how to create, write and publish tutorials on tutorials.ubuntu.com, reaching a wide audience of both beginner and advanced Linux users.
categories: community
tags: tutorial, guidelines, guide, write, contribute
difficulty: 2
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2017-11-23
author: Canonical Web Team <webteam@canonical.com>

---

# How to write a tutorial

## Overview
Duration: 1:00

In this tutorial, you will learn how to write content for tutorials.ubuntu.com and reach a wide audience of both beginner Linux users and advanced users such as developers and system administrators.

We will start by looking at general guidelines, the structure of a tutorial and go through the publication and review process.

### What you'll learn

* How to create and structure a tutorial from a single Markdown file
* How to use the additional Markdown features specific to the engine
* How to render it locally to see what your readers will see
* How to get it ready for review by the Ubuntu Docs team

### What you'll need

* A computer running Ubuntu 16.04 or above
* The `git` command-line client (that you can install by running `sudo apt install git`)
* [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/) to run the website locally
* A [GitHub](https://github.com) account, for the publication and review process

Depending on the topic and your level of experience, writing a tutorial can be a very easy task, but following these guidelines is important to keep the whole set of published tutorials consistent. Let's get started!

## General guidelines
Duration: 1:00

### Mission of tutorials

Tutorials are step by step guides aimed at a very diverse audience. To provide a good learning experience, a consistent and didactic approach is key.

A good tutorial should:

* be focused on one topic or a very small group of related topics. Keep it simple and on point as people who want to learn multiple subjects will take multiple tutorials.
* produce a tangible result. The topic is demonstrated with a *small practical project* and not only a theoretical or "hello world" example. The tutorial reader will come out of it with a working example on their environment.
* be short. An estimated 60 minutes for a tutorial is an absolute maximum. Most tutorials should be in the range of 15 - 30 minutes.
* be divided in short steps. Each step is practical and results in user-visible progress.
* be entertaining! Try to have a fun project to work on, even if it's something impractical!

### Tone

The tone of your tutorial should be friendly. Try to make the reader feel that they're building and learning something together with you.

All tutorials should have the same tone, regardless of the topic. This is why you should complete one or two of the existing tutorials before writing your first one.

In short, this isn’t a teacher/student paradigm, but rather friends sharing some time together. Thus, "**we**" should be used as much as possible, like "**we have just seen**", "**we now understand that…**". However, "**you**" can be used for demonstrating things in the user’s context, like: "**edit your file**", "**your directory should look like this**", "**on your system**", etc.

And now, let's see the first required step!

## Metadata and structure
Duration: 5:00

Each tutorial is built using a single Markdown file.

This file starts with a set of metadata in *Front matter* format to be consumed by the tutorials engine. For example, at the top of the source file of this guidelines tutorial, you will find:

```
---
id: tutorial-guidelines
summary: Learn how to create, write and publish tutorials on tutorials.ubuntu.com, reaching a wide audience of both beginner and advanced Linux users.
categories: community
tags: guidelines, guide, write, contribute
difficulty: 2
status: published
image: https://foo.png
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2017-01-13
author: Canonical Web Team <webteam@canonical.com>

---
```

Let's have a look at each field:

 * **id**: the identifier of the tutorial to be used in the URL. Keep it short but clear.
 * **summary**: a description of the tutorial (10 to 30 words) to be displayed on the frontpage of the site
 * **categories**: any of `cloud`, `community`, `containers`, `desktop`, `iot`,  `packaging` or `server`
 * **tags**: a comma-separated list of tags used by the site search
 * **difficulty**: the scale spans from 1 to 5. Beginners without previous knowledge of the given topic should be able to follow and understand tutorials from level 1 without any other prerequisite knowledge. As a guide:

     * **1**: Complete beginner with Ubuntu - just about knows how to open a terminal
     * **2**: Ubuntu novice - can be trusted to enter commands but experience limited to simple file operations
     * **3**: Experienced user - doesn't need explanations about common topics (networking, sudo, services)
     * **4**: Advanced user - has experience running Ubuntu for many years, but may be unfamiliar with some sysadmin/programming topics
     * **5**: Ubuntu sysadmin/developer- very familiar with most aspects of the operating system and can be expected to know details about its inner workings

 * **status**: `draft` or `published`
 * **image** (optional): an absolute link to an image that will be used when sharing the tutorial on social networks. Preferred dimensions: width should be over 1000px with a 16:9 or 16:10 ratio.
 * **feedback_url**: where to report bugs and give feedback about this tutorial. Unless you have very specific requirements, this should be: `https://github.com/canonical-websites/tutorials.ubuntu.com/issues`.
 * **author**: the name and email address between brackets of the author of the tutorial. If you don't intend to maintain this tutorial after publication, please use `Canonical Web Team <webteam@canonical.com>`
 * **published**: a date in YYYY-MM-DD format, to be updated after any major change to the tutorial

After this metadata section, the tutorial starts.

### Title

The title should be set as the first heading of your file.

```markdown
# Tutorial title
```

The tutorial title should be kept short (3 to 8 words as a guide) to not break the design. Try to make concise titles but also specific when possible, e.g. "Create a bootable USB stick on Windows 10"

### Steps

Each step is delimited by a second level title, for example:

```markdown
## Step title
```

A step **Duration** in the `MM:SS` format should immediately follow the step title. The total tutorial time will then be computed automatically. A third level heading or empty line will break into the step content.

```markdown
## Step title
Duration: 2:00

Step content starts here.
```

### Basic example

If we put these pieces together here is what a very simple tutorial looks like:

```markdown
---
id: my-tutorial
summary: This is my tutorial, there are many like it but this one is mine
categories: community
tags: beginner, some, other, tags
difficulty: 1
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2017-01-13
author: Javier Lopez <javier.lopez@example.com>

---

# My first tutorial

## This is the first step
Duration: 2:00

This is the content of the first step.

## This is the second and final step
Duration: 1:00

Congrats, you made it!

```

Once these structural pieces are out of the way, we can start getting into the most interesting part: the content.

## Introducing your content
Duration: 2:00

First impressions matter and the first page of your tutorial should be welcoming and informative. On tutorials.ubuntu.com, an "Overview" page should be the first step of every tutorial.

The overview contains at least three small parts:
* a summary
* a "What you'll learn" section
* a "What you'll need" section.

### The summary

The first paragraph or parapgraphs of the overview is a summary of the tutorial's objectives, its purpose and why the reader should go through it. An image can be included, as well as external links.

#### Example

```markdown
## Overview
Duration: 1:00

Turning your website into a desktop integrated app is a relatively simple thing to do,
but distributing it as such and making it noticeable in app stores is another story.

This tutorial will show you how to leverage Electron and snaps to create a website-based
desktop app from scratch and publish it on a multi-million user store shared between
many Linux distributions.

For this tutorial, the website we are going to package is
an HTML5 game called [Castle Arena](http://castlearena.io).

![](https://assets.ubuntu.com/v1/7f7e704f-shot.png)
```

### The "What you'll learn" section

This section includes the list of topics covered by your tutorial. It's a way to align readers expectations with the content they are going to read. Topics are presented as bullet points.

#### Example

```markdown
### What you'll learn

- How to create a website-based desktop app using Electron
- How to turn it into a snap package
- How to test it and share it with the world
```

### The "What you'll need" section

This is the list of prerequisites the reader needs to meet before starting the tutorial. If there is a need for specific hardware, software or user accounts, this is the right place to talk about it. If there is a need for specific technical knowledge to go through your tutorial, use this section as an opportunity to link to documentation and other tutorials.

Prerequisites are presented as bullet points.

#### Example

```markdown
### What you'll need

- Ubuntu Desktop 16.04 or above
- Some basic command-line knowledge
```

### Optionally: a survey widget

You can gather some insights on who your readers are by adding a survey widget. Using this widget is not a requirement, but it helps gathering audience statistics and can help making tutorials better as a whole.

If you use this widget, you should include at least the following questions:

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

To create this widget, you need to use the following syntax:

```markdown
Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient
```

Note that Google Analytics is used as the survey backend.

### All the pieces together

When we put all of these pieces together, here's what an Overview step looks like:

```markdown
## Overview
Duration: 1:00

Turning your website into a desktop integrated app is a relatively simple thing to do,
but distributing it as such and making it noticeable in app stores is another story.

This tutorial will show you how to leverage Electron and snaps to create a website-based
desktop app from scratch and publish it on a multi-million user store shared between
many Linux distributions.

For this tutorial, the website we are going to package is
an HTML5 game called [Castle Arena](http://castlearena.io).

![](https://assets.ubuntu.com/v1/7f7e704f-shot.png)

### What you'll learn

- How to create a website-based desktop app using Electron
- How to turn it into a snap package
- How to test it and share it with the world

### What you'll need

- Ubuntu Desktop 16.04 or above
- Some basic command-line knowledge
```

When you are done with your friendly and informative introduction, you can start adding more steps (remember, second level titles are used to declare the start of a step) and build your tutorial story.

To do so, we will now go through some content recommendations.

## Dos and Don'ts
Duration: 5:00

In addition to the previous advice on what a tutorial should be and what is mandatory, you should pay special attention to the following points:

### Each step should be concise, but not too short

Be wary of a step's length. In average, 5 to 10 minutes is more than enough for a single step to complete. Don’t make them too short either. Naturally, some steps will be shorter than others (such as the first and last steps).

### If too long, prefer dividing the tutorial

Tutorials are self-sufficient, but they can nonetheless build upon each other (you can link from the requirements section of the first step, for example). One tutorial could require another tutorial to be completed first. And if you are reusing the same code, ensure you provide a repository as a starting point.

If a tutorial is too long, consider breaking it up into several pieces. However, ensure all tutorials present a distinct objective.

### Don’t have too many steps

Steps should be concise and tutorials should be rather short. Consequently, you shouldn’t have too many steps in your tutorial. We don't want to make the reader desperate by glancing at the number of remaining steps before tutorial completion.

### Each step should be rewarding

As a writer, you should try to keep the reader entertained at each step and this is achieved by careful story building. Each step should end on concrete progress towards the end goal. It should be, if possible, tangible and interactive, so that the reader can be familiarised with notions introduced by the step.

To earn bonus reader commitment points, finish a step on a "cliffhanger"!

### Make intentional mistakes

This could seem counter-intuitive at first. However, learning by fire (or rather, by error here) is a key way of learning new things. Executing, erroring, analyzing and fixing has multiple benefits:

* Users will be familiar with a particular error, and even if they don't remember explicitly how to fix it the next time they encounter it, they will have some clue and some deja-vu feeling which will guide them towards its resolution.
* Providing the perfect answer from the start hides complexity and a lot of non-formally written subtleties. Forcing readers to face them will ensure that the tutorial written doesn’t take these subtleties as a given and will greatly help newcomers.

positive
: A concrete example of this is, in the "Create your first snap" tutorial, how we introduce building a snap. After creating the parts, we immediately build the snap and install it. Then, we try to execute one of the snap binaries, but no such command is found! That way, we can introduce the fact (in the following step) that binaries are not exposed by default as part of the snap. We can use this "mistake" to introduce further concepts.

### External links in tutorials

Links to external website are forbidden during a tutorial. We don’t want people's attention diverted from the task they are going through (which emphasize the fact that each step should have enough knowledge to be self-sufficient). In particular, do not link the reader to the reference documentation. We want to keep the user’s attention on the current task only. Download links are allowed though.

As previously written, only the first and last steps can (and probably should) link to external documentation for prerequisites or learning more on a particular topic. The same rule applies to external websites for libraries or frameworks.

The only exception to this rule is when linking to source code that is being used as a checkpoint in the tutorial (eg. "your code should look like this").

Of course, this doesn’t concern key tutorial actions happening on a given website, like Launchpad, GitHub, login.ubuntu.com, etc.

### Provide regular code “checkpoints”

This is mostly for developer oriented tutorials, but if this rule can be applied to an admin/advanced users oriented one, please do so!

The advice is to provide regular checkpoints where people can sync back their source code with the tutorial, in particular, at the start of a given step. Readers could have stopped then resumed going through a tutorial, and may not have the source code from previous steps anymore. Consequently, in the case of a code-writing tutorial, please try to provide a link to the current state of the code at the start of a step.

You can refer to it as “If you want to ensure you have all the needed bits we saw together in the previous steps…“ and point to an external repository on GitHub, Launchpad or others… This element should be in an admonition:

Positive
: **Lost or starting from here?**
Check or download [here](http://link/torepo/directory) to see what your current directory should look like.

"here" being a link to the code in question.

### Do not separate exercises and answers

In general, try to avoid leaving the user hanging for the right answer. Tutorials aren’t a class/lesson or a test to pass with some exercises.

In particular, to avoid a teacher/student relationship, do not separate questions and answers (apart from cliffhangers as previously stated, but the questions you are asking your audience are more rhetorical in that case!).

### Do not repeat the setup/install phase for each tutorial

Avoid repetitive setups or installation phases, particularly if the tutorial isn’t a beginner one. Beginner tutorials should contain a setup phase while more advanced tutorials should reference other beginner tutorials as prerequisites.

### Command line snippets

Inline commands are styled with single backticks :

For example:

```markdown
`foo/something --bar`
```

Which renders as `foo/something --bar`.


For longer example code we expect people to type in, we do not use the command prompt at the beginning of each line, and we separate the command from the output. This makes the command and outputs clearer and also easier to copy and paste.

#### Example

"
Run the following command:

```bash
cat my_file
```

This will display the content of the file:

```bash
Awesome my_file content
on multiple lines
```
"

Finally, the code blocks (commands and code to write) of the tutorial should be self-sufficient. It means that we don't expect people to write code or run commands outside of what we expose in code blocks, and only typing and executing their content should lead them to the desired state.

You should now have all the cards in hand to provide a rewarding learning experience! It's time we look at how to structure the final page of a tutorial: the "rewarding" step.

## Rewarding your readers
Duration: 2:00

On the last page of a tutorial, the project is finished and you remind readers they have reached their goal and have grown some new skills.

Take one or two paragraphs to remind them of what they went through and what they have achieved. That way, readers can reflect upon the various steps and their newly acquired knowledge. Ensure you use a friendly title for this final step.

For example, as a reader of this tutorial, you should have understood what's needed to create a successful learning experience, what the recommendations are, and how the Markdown syntax works. You now know how to deploy the website locally and how to propose your content for review!

On the last page, make sure you also include at least one of the following sections:

* Next steps
* Further reading

### "Next steps"

With a list of bullet points, offer some guidance on the next steps a reader may want to take. This could be other tutorials being the “next logical ones”, communication channels and places where to get support from.

#### Example

```markdown
### Next steps

* If you need support, the [snapcraft forum](https://forum.snapcraft.io) is the best place to get
  all your questions answered and get in touch with the community.
 ```

### "Further reading"

With another list of bullet points, provide a list of external resources to get more information on the topic. You can link to documentation, related source code, or blog posts that will provide more insights.

#### Example

```markdown
### Further readings

* The snapcraft documention has everything you need if you want to look more
  into [hooks](https://docs.snapcraft.io/build-snaps/hooks)
  and [scriptlets](https://docs.snapcraft.io/build-snaps/scriptlers).
 ```

 To use everything the tutorials engine has to offer, let's look at some syntax tips.

## Syntax tips
Duration: 05:00

The syntax used is by and large regular [Markdown syntax](https://guides.github.com/features/mastering-markdown/), but there are some specificities:

### Line breaks and empty lines

* Paragraphs are delimited by empty lines
* Line breaks will create a new line

In the context of an admonition or a survey widget, using an empty line will close it and go back to text.

### Images

Images can be hosted locally (relatively linked to the markdown source) or remotely. The tutorial engine will fetch remote images and cache them locally.

In Markdown the syntax for an image is the following:

```markdown
![image title](image-path-or-link)
```

### Admonitions

Admonitions are colored blocks that enclose special information, they can be a positive tip or a negative warning. To create an admonition, write its type ("positive" or "negative") on a line by itself, then begin the next line with a colon and a space.

A **positive** admonition should contain positive information like best practices and time-saving tips.

```markdown
positive
: **Eat your vegetables!**
This is a positive message.
```

Which renders as:

positive
: **Eat your vegetables!**
This is a positive message.

A **negative** admonition should contain negative information such as warnings and API usage restrictions.

```markdown
negative
: **Eat your vegetables!**
This is a warning.
It can be multi-lines like this.
```

Which renders as:

negative
: **Eat your vegetables!**
This is a warning.
It can be multi-lines like this.

### Fenced Code and Language Hints

Code blocks are declared by placing them between two lines containing three backticks. The tutorial engine will attempt to perform syntax highlighting on code blocks, but it is not always effective at guessing the language to highlight in.

Put the name of the coding language after the first fence to explicitly specify which highlighting plan to use, like this:

    ```go
    This block is highlighted as Go source code.
    ```

Which renders as:

```go
This block is highlighted as Go source code.
```

These additions to standard Markdown are easy to master and play with, but in case you face unexpected behaviours in the rendering, feel free to reach out to the tutorials maintainers at #ubuntu-doc on Freenode IRC.

## Local rendering
Duration: 1:00

When writing a tutorial, it's extremely useful to see how it will render on the website.

We are going to need a local instance of tutorials.ubuntu.com, which is something we can achieve without any advanced technical knowledge: it takes 5 minutes and a single command handles all the process.

To do so, start by cloning the tutorials git repository:

```bash
git clone https://github.com/canonical-websites/tutorials.ubuntu.com.git
```

Then enter the `tutorials.ubuntu.com` directory and launch the `run` script.

```bash
cd tutorials.ubuntu.com
./run
```

If you have Docker correctly installed, it will build a local tutorials.ubuntu.com instance. The first time (and only the first time) you run this command, it will download all the required dependencies. When the site is ready, a local server starts serving it at `http://localhost:8016`.

By default, the site only displays this how-to tutorial.

The `run serve <path to md file or directory>` command let you choose what to display. For example, to display:

* All available tutorials: `./run serve tutorials`
* Only tutorials in the `tutorials/cloud` directory: `./run serve tutorials/cloud`
* A single tutorial: `./run serve my-tutorial.md`

Other options are available by running `run --help`.

Each time you save a file you are working on, it triggers a page refresh on this local server, allowing for rapid iterations on the content.

Once you can have seen your tutorial in its final form, it's time to share it with the world.

## Review process
Duration: 01:00

The tutorials repository is managed by the Ubuntu Web and Doc teams. A review process is in place to ensure new tutorials are being looked at by writers, engineers and documentation experts.

### Source code structure

The tutorials.ubuntu.com source code contains a `tutorials` directory. Each of its subdirectories matches a tutorial category: `cloud`, `server`, `packaging`, etc. Your tutorial should be included into one of these.

For example:

```bash
-tutorials/
└── server/
    └── my-server-tutorial.md
```

If your tutorial contains locally hosted images, you should create a subdirectory matching your tutorial id and include an `images` directory:

```bash
-tutorials/
└── server/
    └── my-server-tutorial
        ├── images/
        └── my-server-tutorial.md
```

If no category is matching your topic, you can propose a new category by opening an issue on the GitHub page of the project.

Once your tutorial is in the right directory, you can then propose a **pull request** of your changes.

### Making a pull request

If you are not familiar with the `git` command-line, here is how to propose a pull request on the project.

Open a terminal and from the project directory, run the following commands:

Create a new code source branch, parallel to the origin source code:

```bash
git checkout -b <tutorial-id>
```

Add and commit your changes to the branch, with a commit message explaining what you are adding:

```bash
git commit -am "Adding a new tutorial: <title of the tutorial>"
```

Push it to GitHub, as a branch of the project:

```bash
git push -u origin <tutorial-id>
```

You will then be asked to enter your GitHub credentials.

Once your `push` has been processed, open the [GitHub project page](https://github.com/canonical-websites/tutorials.ubuntu.com). You should see a highlighted box near the top of the page with your newly pushed git branch name (the tutorial id) on it. Click on the "Pull Request" button next to it.

Fill up the form with the required information, such as describing your new tutorial and why it would be useful to readers.

When your pull request is submitted, the team of reviewers will receive an email and add it to the review queue. Once they get to it, they will review the content and open a discussion with you on the Pull Request page. At the end of this process, they will either merge your changes into the project or request additional changes.

## That's all folks!
Duration: 01:00

Congrats, you made it! If you have been watching closely, you are now fully equipped to write a compelling tutorial and take your future readers to new heights!

Now you know how to:

* Create a welcoming and informative intro to your content
* Provide an interesting and easy-to-follow learning experience
* Structure your markdown source file
* Render tutorials locally and submit them for publication

There are a lot of topics to write about and if you are looking for ideas, just think about what you master and frequently do on Ubuntu, something that's useful to you, even if it's an arcane topic or a very simple set of tips you think people would benefit from.

### Next steps

* Write your first tutorial on your topic of choice and propose it for publication!
* Pick one of our opened ["Content" issues](https://github.com/canonical-websites/tutorials.ubuntu.com/issues?q=is%3Aissue+is%3Aopen+label%3A"Tutorials+Content") and make your first contribution to the project
* Join the #ubuntu-doc channel on Freenode IRC to chat with the doc team and share your thoughts
* Read other tutorials and help us improving them by opening new issues on GitHub
