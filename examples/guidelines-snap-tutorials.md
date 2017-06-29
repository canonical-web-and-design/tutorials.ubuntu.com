---
id: tutorial-guidelines
summary: A summary tutorial description. Remember the content of it (as the title) is searchable. It should be around 26 words.
categories: snapcraft
tags: tutorial,guidelines,snap
difficulty: 2
status: Published
author: Javier Lopez <javier.lopez@example.com>
published: 2017-01-13

---

# Ubuntu tutorial guidelines

## General guidelines
Duration: 2:00

### Mission of tutorials

Tutorials provide step by step guides aimed at developers and technical users/admins. This didactic approach of our tutorials is key, and so, you should always structure them around some very practical areas.

Each tutorial should:
* be oriented on one topic or a very small group of related topics. Keep it *simple*! People who want to learn multiple subjects will take multiple tutorials.
* produce a tangible result. The topic is demonstrated with a *practical (small) project* and not only in theory or a hello world example. The tutorial attendee will come out of it with a working example on his environment.
* be short. An estimated 60 minutes for a tutorial is an absolute maximum. Most tutorials should be in the range of 15 - 30 minutes.
* be divided in short steps. Each step is practical and results in user-visible progress.
* be entertaining! Try to have a fun project to work on, even if useless!

### Tone

The tone of your tutorial should be friendly. Try to make the reader feel that they're building and learning something together with you.

All tutorials should have the same tone, regardless of the topic. This is why you should complete one or two of the existing tutorials before writing your first one.

In short, this isn’t a teacher/student paradigm, but rather friends sharing some time together. Thus, the term **we** should be used as much as possible, like **we have just seen**, **we now understand that…**. However **you** can be used for demonstrating things in the user’s context, like: **edit your `file`**, **your `directory` should look like this:**, **your system** or **you will note**.

And now, let's see the first required step!

## Metadata
Duration: 2:00

Each tutorial source file starts with a set of metadata that will be consumed by tutorials.ubuntu.com for presentation purposes.

For example, at the top of the source file of this tutorial:

```
---
id: tutorial-guidelines
summary: A summary tutorial description. Remember the content of it (and the title) is searchable. It should be around 26 words.
categories: snapcraft
tags: tutorial,guidelines,snap
difficulty: 2
status: Published
author: Javier Lopez <javier.lopez@example.com>
published: 2017-01-13

---
```

 * **id** is used as tutorial url
 * **categories** correspond to one or multiple areas of the developer site
 * Remember that **tags** are searchable


 * **difficulty** spans from 1 to 5. Beginners without previous knowledge of the given topic should be able to follow and understand tutorials from level 1 without any other prerequisite knowledge. As a guide:

     1. Complete beginner with Ubuntu - just about knows how to open a terminal
     * Ubuntu novice - can be trusted to enter commands but experience limited to simple file operations
     * Experienced user - doesn't need explanations about common topics (networking, sudo, services)
     * Advanced user - has experience running Ubuntu for many years, but may be unfamiliar with some sysadmin/programming topics.
     * Ubuntu sysadmin/developer- very familiar with most aspects of the operating system and can be expected to know details about

 * **published** is a date in YYYY-MM-DD format. Update  this after any major updates to the tutorial. As the website sorts by date, your tutorial will appear as one of the first tutorials in the list until new tutorials are added or updated..

### Title

The title should be set as the first heading of your file.

```markdown
# Ubuntu tutorial guidelines
```

Tutorial title should be kept short (5 words as a guide) to not break the design. Try to make the titles concise but also specific where possible, e.g. "Create a bootable USB stick on Windows 10"

### Steps

Each step is delimited by a second level title, for example:

```markdown
## Step title
```

A step **Duration** in the `MM:SS` format should immediately follow the title. The total tutorial time will then be computed automatically. A third level heading or empty line will break into the step content.

```markdown
## Step title
Duration: 2:00

Step content starts here.
```

Let's have a look at the content of your first step.

## Overview
Duration: 2:00

This is the **Overview** step. It should be the first step of every tutorial. This first paragraph is a summary of the tutorial's objectives, stating what the reader will learn by completing it. An image can be included, as well as [external links](https://tutorial.ubuntu.com).
![Ubuntu logo](./ubuntu-logo.svg)

### What you'll learn

- This section includes a list of steps that will be needed to achieve the objective.
- State things clearly so that the reader's expectations and the tutorial objectives correspond.
- As you can see, this is presented as a bullet list.

### What you'll need

* The needs are the prerequisites presented as bullet points.
* Those can be hardware/software/sensors/account prerequisites.
* It can be as well some more technical knowledge. For those, links to documentation and [to other tutorials](https://tutorial.ubuntu.com) are allowed at this step, with a very strong preference for the latter.

A survey. You can include more questions as part of your survey, but don’t include too much of them. For statistical purpose, and help making the tutorials better, you should include the following survey at the minimum:

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

To create a survey, you need to use the following syntax:

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

This will give great insights on our audience. Remember that the survey is optional to take (and tracked through Google Analytics).

Let's continue with general tutorials **dos** and **don'ts** recommendations.

## Dos and Don'ts
Duration: 10:00

### Running and working on a tutorial

From the tutorial directory, you can iterate manually on a markdown file using: `bin/serve /path/to_your_file.md`. This will create a temporary web server, pointing by default at [http://localhost:8080](http://localhost:8080). Each save to this file or any assets related to it will trigger a web page refresh on this server.

### Advice and general rules

In addition to the previous points on what a tutorial should be and what is mandatory, you should  pay special attention to some points:

#### Each step should be concise, but not too short

Be wary of a step's length. Each one shouldn’t take longer than 7 minutes to complete. Don’t make them too short either. Naturally, some steps will be shorter than others (such as the first and last steps).

#### If too long, prefer dividing the tutorial

Tutorials are self-sufficient, but they can nonetheless build upon each other (You can link from the requirements section of the first step, for example). One tutorial could require another tutorial to be completed first. If you are reusing the same code, ensure you provide a repository as a starting point.
If a tutorial is too long, consider breaking it up. However, ensure each tutorial presents a distinct objective.

#### Don’t have too many steps

Steps should be concise and tutorials should be rather short. Consequently, you shouldn’t have too many steps in your tutorial. We don't want to make the attendee desperate by glancing at the number of remaining steps before tutorial completion.

#### Each step should be rewarding

On the general tone theme, we need to keep the attendee entertained at each step and this is achieved by carefully building each one. Each step should end on a concrete advancement towards the general tutorial’s goal. It should be, if possible, tangible and interactive, so that the user can be familiarized with the notion introduced by the step.

Also, if you can finish a step on a cliffhanger, you will get bonus attendee commitment points!

#### Make intentional mistakes

This could seem counter-intuitive at first. However, learning by fire (or rather, by error here) is a key way of learning new things. Executing, erroring, analyzing and fixing has multiple benefits:
* Users will be familiar with a particular error, and even if they don't remember explicitly how to fix it the next time they encounter it, they will have some clue and some deja-vu feeling which will guide its resolution.
* Providing the perfect answer from the start hides complexity and a lot of non-formally written subtleties. Forcing attendees to face them will ensure that the tutorial written doesn’t take these subtleties as a given and will greatly help newcomers.

positive
: A concrete example of this is, in the "Create your first snap" tutorial, how we introduce building a snap. After creating the parts, we immediately build the snap and install it. Then, we try to execute one of the snap binary, but no such command is found! That way, we can introduce the fact (in the following step) that binaries are not exposed by default as part of the snap. We can then introduce command namespacing, renaming, exposure…

#### External links in tutorials

Links to external website are forbidden during a tutorial. We don’t want people's attention diverted from the task they are going through (which emphasize the fact that each step should have enough knowledge to be self-sufficient). In particular, do not link the attendee to the reference documentation. We want to keep the user’s attention on the current task only. Download links are allowed though.

As previously written, only the first and last steps can (and probably should) link to external documentation, for prerequisites or learning more on a particular topic. The same rule applies to external websites for used libraries (like tensorflow.org).

The only exception to this rule is for source code links (see next point).

Of course, this doesn’t concern key tutorial actions happening on a given website, like launchpad, snapweb, juju charm UI…

#### Provide regular code “checkpoints”

This is mostly for developer oriented tutorials, but if this rule can be applied to an admin/advanced users oriented one, please do so!

The advice is to provide regular checkpoints where people can sync back their source code with the tutorial, in particular at the start of a given step. Remember that the attendee can resume a tutorial, and may not have the source code from previous steps anymore. Consequently, even if the previous step had no code change, please do provide back the same link at the start of the following step.

You can refer to it as “If you want to ensure you have all the needed bits we saw together in the previous steps…“ and point to an external repository on github, launchpad or others… This element should be in a note like:

Positive
: **Lost or starting from here?**
Check or download [here](http://link/torepo/directory) to see what your current directory should look like.

\<here\> being a link to a subdirectory from a git repository. Try to gather similar tutorials in the same repository.

The second to last step should give a quick way to experience the final tutorial result, being the entirety of the code or a demo.

#### Do not separate exercises and answers

In general, try to avoid leaving the user hanging for the right answer. Tutorials aren’t a class/lesson or a test to pass with some exercises. Indeed, supposedly, the user is learning new concepts.

In particular, to avoid a teacher/student relationship, do not separate questions and answers (apart from cliffhangers as previously stated, but the question is more rhetorical in that case!) with actionable attendee’s expectation in different steps. The question/answer (command line or code snippet) should be on the same page. That way, the answer is always in the context of the given question.

#### Do not repeat the setup/install phase for each tutorial

Avoid repetitive setups or installation phases, particularly if the tutorial isn’t a beginner one. Beginner tutorials should contain a setup phase, other more advanced tutorials should reference as prerequisites other beginner tutorials directly.

#### Command lines

Inline commands are styled simply by backticks :`foo/something --bar`.


For actual example code we expect people to type in, we do not use the command prompt, and we separate the command from the output. This makes it clearer and unambiguous and also easier to copy and paste. For example:

Run the following...
```bash
cat my_file
```
… to see the contents of the file:

```bash
Awesome my_file content
on multiple lines
```
...before removing it with the command:

```bash
rm my_file
```

Finally, the code blocks (commands and code to write) of the tutorial should be self-sufficient. It means that we don't expect people to have to do actions outside of the code blocks, and only typing and executing their content should lead them to the desired state.

## Syntax
Duration: 0:03

Syntax is regular [markdown syntax](https://guides.github.com/features/mastering-markdown/), as you saw in the previous steps if you are reading the markdown source of this guide. Some notes though:

### Text

To ensure the coherence of text inside code snippets, notes and a survey with paragraphs, how you end a line within these sections will affect the output. A single end of line will create a line return (br), while an end of line followed by an empty line will delimit paragraphs.

Blocks are delimited as well by an empty line.

### Images

They can be local (relatively linked to the markdown source) or remote. The tutorial generator will fetch remote images and cache them locally.

### Info boxes

Info boxes are colored callouts that enclose special information. To create an info box, put the type of info box on a line by itself, then begin the next line with a colon.

A **positive** info box should contain positive information like best practices and time-saving tips.

    positive
    : This appears in a positive info box.

It renders as:

positive
: This appears in a positive info box.

A **negative** info box should contain information like warnings and API usage restrictions.

    negative
    : This appears in a negative info box.
    It can as well be multi-lines like this.

It renders as:

negative
: This appears in a negative info box.
It can as well be multi-lines like this.

### Fenced Code and Language Hints

Code blocks may be declared by placing them between two lines containing just three backticks (fenced code blocks). The tutorial renderer will attempt to perform syntax highlighting on code blocks, but it is not always effective at guessing the language to highlight in.

Put the name of the coding language after the first fence to explicitly specify which highlighting plan to use, like this:

    ``` go
    This block is highlighted as Go source code.
    ```

Which renders as:

``` go
This block is highlighted as Go source code.
```

Let's see what the last keeps us to sum that all up!

## Easy, wasn't it?
Duration: 1:00

Congratulations! You made it! Remember attendees they have reached their goal and have grown some skills, ensure you keep a friendly title for the last step. “That’s all folks!” is used in other tutorials.

Positive
: **Final code**
Your final code directory should now look like [this](https://tutorials.ubuntu.com). Do not hesitate to download and build your snap from it if you only read it through! It's important to have this final code so that people who couldn't follow live can check the final result. Check the section on code checkpoints for more guidelines on this.

By now you should have successfully understood what's needed to create a successful tutorial, what the recommendations are and how the syntax is working. You should as well be a master in the recommended and required steps for the special markdown format. Keep in mind that this is a “rewarding step”. Congratulate users, while recapping (quicker than in the overview step) what they just learnt. That way, attendees can reflect upon the various steps and new acquired knowledge. After writing your first tutorial, it should become a second nature to you.

### Next steps

* Guide the attendee from where to go from now on. This could be other tutorials being the “next logical ones”, mailing list, communication channels… For instance:
* You can have a look at "[advanced snap usage](https://tutorials.ubuntu.com/tutorial/advanced-snap-usage)" which is following all our best practices in term of chaining and logical flow.
* Learn some more advanced techniques on how to phrase your own tutorial by looking through [our others ones](https://tutorial.ubuntu.com)!
* Join the snapcraft.io community on the [snapcraft forum](https://forum.snapcraft.io) for instance!

### Further readings

* Contrary to the previous point, this is how to get more info related to the current topic and knowledge learnt. Those would be mostly links to documentation. For instance:
* [snapcraft.io documentation](http://snapcraft.io/docs/) is a good place to start reading the whole snap and snapcraft documentation.
* [snapcraft syntax reference](http://snapcraft.io/docs/build-snaps/syntax), covering various available options like the daemon ones.
* Check how you can [contact us and the broader community](http://snapcraft.io/community/).
