# Ubuntu tutorial guidelines

// id is used as tutorial url
id: tutorial-guidelines
summary: A summary tutorial description. Remember the content of it (as the title) is searchable. It should be around 26 words.
// Categories correspond to one or multiple area of the developer site
categories: snapcraft
// Remember that tags are searchable as well.
tags: tutorial,guidelines,snap
// Beginners without previous knowledge from a topic should be able to take and understands tutorials from level 1 without any other prerequisites.
// Difficulty spans from 1 to 5
difficulty: 2
status: Published

Tutorial title is 5 words maximum.

## General guidelines
Duration: 2:00
Each step is delimited by a second level title.
It should have a step duration, following immediately the step. The total tutorial time will then be computed automatically. A h3 or empty line will break into the step content.

### Mission of tutorials

Tutorials provide step by step guides aimed at developers and technical users/admins. This didactic approach of our tutorials is key, and so, you should always structure them around some very practical areas.

Each tutorial should:
* be oriented on one topic or a very small group of related topics. Keep it *simple*! People who want to learn multiple subjects will take multiple tutorials.
* produce a tangible result. The topic is demonstrated with a *practical (small) project* and not only in theory or a hello world example. The tutorial attendee will come out of it with a working example on his environment.
* be short. An estimated 60 minutes for a tutorial is an absolute maximum. Most tutorials should be in the range of 15 - 30 minutes.
* divided in short steps. Each step is practical and ends up in some user-visible progress.
* be entertaining! Try to have a fun project to work on, even if useless!

### Tone

The tone of your tutorial should be friendly. Really make the attendee feel he’s part of building and learning something together. Put him or her on your side and try to build a rapport.

Also, be conscious that we want all tutorials to feel the same, cross-topics. This is why you should perform one or two tutorials first before starting writing one, to match the tone we are trying to establish.

In short, this isn’t a teacher/student paradigm, but rather friends sharing some time together. Thus, should use the term **we** as much as possible, like **we have just seen**, **we now understand that…**. However **you** can be use for demonstrating things in the user’s context, like: **edit your `file`**, **your `directory` should look like this:**, **your system** or **you will note**. Prefer the **we** as much as possible though.

And now, let's see the first required step!

## Overview
Duration: 2:00

This is the **Overview** step. It should be the first step of every tutorials. This first paragraph is a general summary of the tutorial goal, stating what users will learn by taking this course, and what outcome they will gather from it. An image can be included, as well as [external links](https://tutorial.ubuntu.com).
![Ubuntu logo](./ubuntu-logo.svg)

### What you'll learn

- This section layouts in a few bullet points what each step will teach to the attendee.
- It is important to state clearly what we think people can expect from a tutorial to ensure it matches their intents.
- As you can see, this is presented as task list bullets.

### What you'll need

* The needs are the prerequisites presented as bullet points.
* Those can be hardware/software/sensors/account prerequisites.
* It can be as well some more technical knowledge. For those, links to documentation and [to other tutorials](https://tutorial.ubuntu.com) are allowed at this step, with a very strong preference for the latter.

A survey. You can include more questions as part of your survey, but don’t include too much of them. For statistical purpose, and help making the tutorials better, you should include the following survey at the minimum:

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience working with your domain?
 - Novice
 - Intermediate
 - Proficient

This will give great insights on our audience. Remember that the survey is optional to take (and tracked through Google Analytics).

Let's continue with general tutorials **dos** and **don'ts** recommendations.

## Dos and Don'ts
Duration: 10:00

### Running and working on a tutorial

From the tutorial directory, you can iterate manually on a markdown file using: `bin/serve /path/to_your_file.md`. This will create a temporary web server, pointing by default at [http://localhost:8080](http://localhost:8080). Each save to this file or any assets related to it will trigger a web page refresh on this server.

### Advice and general rules

In addition to the previous points on what a tutorial should be and what is mandatory, you should take special attention to some points:

#### Each step should be concise, but not too short

Pay special attention to the step size. They shouldn’t take more than 7 minutes each. Don’t make them too short either (like a few lines to read). Of course, some steps will be shorter than others like first and last ones.

#### If too long, prefer dividing the tutorial

Tutorials are self-sufficient, but they can build upon each other. One tutorial could require another tutorial to be completed first. If you are reusing the same code, ensure you provide a repository as a starting point.
If a tutorial is too long, prefer thus dividing it. However, ensure each tutorials present a different facet of expertise.

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

Avoid repetitive setups or installation phases, in particular if the tutorial isn’t a beginner one. Beginner tutorials should contain a setup phase, other more advanced tutorials should reference as prerequisites other beginner tutorials directly.

#### Command lines

We never show the PS1 content for inline commands: `foo/something --bar`.

For multiple lines, we always starts with *$*, without directory location:

```
$ cat my_file
Awesome my_file content
on multiple lines
$ rm my_file
```

Finally, the code blocks (commands and code to write) of the tutorial should be self-sufficient. It means that we don't expect people to have to do actions outside of the code blocks, and only typing and executing their content should lead them to the desired state.

## Syntax
Duration: 0:03

Syntax is regular [markdown syntax](https://guides.github.com/features/mastering-markdown/), as you saw in the previous steps if you are reading the markdown source of this guide. Some notes though:

### Text

For coherence in text inside code snippets, notes and survey with paragraphs, each end of line is reflected. A single end of line create a line return (*br*), while an end of line followed by an empty line will delimit pagraphs.

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
