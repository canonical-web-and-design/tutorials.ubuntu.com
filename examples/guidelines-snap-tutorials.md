# Example snap tutorial

// id is used as tutorial url
id: example-snap-tutorial
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
It should have a step duration, following immediately the step. The total tutorial time would then be computed automatically. Then, a h3 or empty line will break into the step content

### Mission of tutorials
Tutorials provide step by step guides aimed at developers and technical users/admins. This didactic approach of our tutorials is key, and so, you should always structure them around some very practical area.

Each tutorial should:
* be oriented on one topic or a very small group of related topics. Keep it *simple*! People who want to learn multiple subjects will take multiple tutorials.
* produce a tangible result. The feature is demonstrated via *practical (small) project* and not only in theory or hello world example. The tutorial attendee will come out with a working example on his environment.
* be short. An estimated 60 minutes for a tutorial is an absolute maximum. Most tutorials should be in the range of 15 - 30 minutes.
* divided in short steps. Each step is practical and ends up in some user-visible progress.
* be entertaining! Try to have a fun project to work on, even if useless!

### Tone
The tone of tutorial should be friendly. Really make the attendee feel he’s part of building and learning something together. Put him on your side and create some connivance with him.

Also, be conscient that we want all tutorials to feel the same, cross-topics. This is why you should perform one or two tutorials first before starting writing it, to get this tone feeling we are trying to establish.

In short, this isn’t a teacher/student paradigm, but rather friends sharing some time together. Thus, should use the term **we** as much as possible, like **we have just seen**, **we now understand that…**. However **you** can be use for demonstrating things in the user’s context, like: **edit your `file`**, **your `directory` should look like this:**, **your system** or **you will note**. Prefer the **we** as much as possible though.

And now, let's see the first required step!

## Overview
Duration: 2:00

This is the **Overview** step. It should be the first step of every tutorials. This first paragraph is a general summary of the tutorial goal, stating what the user will learn by taking this course, and what outcome he will gather from it. An image can be included as well as [external links](https://tutorial.ubuntu.com).
![Ubuntu logo](./ubuntu-logo.svg)

### What you'll learn

- This section layouts in few bullet points what each step will teach to the attendee.
- It is important to state clearly what we people can expect from a tutorial to ensure it answers their intents.
- As you can see this is presented as a task list bullets.

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

This will give great insights on our audience. Remember that the survey is optional to take (and tracked through google analytics).

Let's chain with general tutorials **dos** and **don'ts** recommendations.


## Dos and Don'ts
Duration: 10:00

### Running and working on a tutorial

From the this tutorial directory, you can iterate manually on a markdown file via: `bin/serve /path/to_your_file.md`. This will create a temporary web server, pointing by default at [http://localhost:8080](http://localhost:8080). Each save to this file or any assets related to it will trigger a webpage refresh if you are looking at the currently modified tutorial.

### Advice and general rules

In addition to the previous points on what a tutorial should be and what is mandatory, you should take special attention to some points:

#### Each step should be concise, but don’t be too short
Pay special attention to the step size. They shouldn’t take more than 7 minutes each. Don’t make them too short either (like a few lines to read). Of course, some steps will be shorter than others like first and last ones.

#### Prefer dividing tutorials if too long
Tutorials are self-sufficient, but they can build upon each other. One tutorial could require another tutorial to be completed first. If you are reusing the same code, ensure you provide as well a repository as a starting point.
If a tutorial is too long, prefer thus dividing them. However, ensure each tutorials present a different facet of expertise.

#### Don’t have too many steps
All of those are linked of course. Steps should be concise and tutorials should be rather short. Consequently, you shouldn’t have too many steps in your tutorial, while will make the attendee desperate by the number of remaining steps before tutorial completion.

#### Each step should be rewarding
On the general tone theme, we need to keep the attendee entertained at each step. This is achieved how we divide each step. Each step should ends up on a concrete advancement towards the general tutorial’s goal. It should be, if possible, tangible and interactive. That way, the user familiarize himself with the step underlined notion.

Also, if you can finish a step on a cliffhanger, you will get bonus attendee commitment points!

#### Make mistake during tutorials!
This could seem counter-intuitive at first. However, learning by fire (or rather, by error here) is a key way of learning new things. Executing, erroring, analyzing and fixing has multiple benefits:
* The user will be familiar with a particular error, and even if he didn’t remember explicitly how to fix it, the next time he encounters it, he will have some clue and some deja-vu feeling which will guide his resolution.
* Providing the perfect answer from the start hides complexity and a lot of non-formally written subtleties. Forcing the attendee to face them will ensure as well that the tutorial written don’t take them as a given, which won’t be the case for a newcomer.

Some concrete example of this is how we introduce building a snap. After creating the parts, we immediately build the snap and install it. Then, we try to execute one of the snap binary, but no such command is found! That way, we can introduce the fact (in the following step) that binaries are not exposed by default as part of the snap. We can then introduce command namespacing, renaming, exposure…

#### External links in tutorials
Links to external website are forbidden during a tutorial. We don’t want people to divert them from the current tutorial they are learning (which emphasize the fact that each step should have enough knowledge to be self-sufficient). In particular, do not link the attendee to the reference documentation. We want to keep the user’s attention on the current task only. Download links are allowed though.

As previously written, the first and last steps only can (and probably should) link to external documentations, for prerequisites or learning more on a particular topic. The same rule apply for external websites for used libraries (like tensorflow.org).

The only exception where external links during a tutorial (from step 2 to step N-1) is allowed is for external source code link (see next point).

If course, this doesn’t concern when some key tutorial actions are happening on a given website, like launchpad, snapweb, juju charm UI…

#### Provide regularly code “checkpoints”
This is mostly for developer’s oriented tutorials. If similar rule can apply for more admin/advanced users orientated ones, please do so!

The advice is to have regular checkpoints where people can sync back, in particular at a start of a given step. Remember that the attendee can resume a tutorial, and he may not have the source code from previous steps anymore. Consequently, even if previous step had no code change, please do provide back the same link at the start of the following step.

You can refer to it as “If you want to ensure you have all the needed bits we saw together to the previous steps…“ and point to an external repository on github, launchpad or others… This element should be in a green note like:

Positive
: **Lost or starting from here?**
Check or download [here](http://link/torepo/directory) to see what your current directory should look like.

<here> being a link to a subdirectory from a git repository. Try to gather similar tutorials in the same repository.

The end of N-1 step should give a quick way to experience the final tutorial result, being entirety of code or demo.

#### Do not separate exercise and answer
In general, try to avoid tone like “try now to…”. Tutorials aren’t a class/lesson or a test to pass with some exercise to proceed. Indeed, supposedly, the user is learning new concepts.

In particular, to avoid a teacher/student relationship, do not separate questions and answers (apart from cliffhanger as previously stated, but the question is more rhetorical in that case!) with actionable attendee’s expectation in different steps. The question/answer (command line or code snippet) should be on the same page. That way, the answer is always in the context of the given question.

#### Do not repeat the setup/install phase for each tutorial
Avoid repetitive setup or installation phase, in particular if the tutorial isn’t a beginner one. Beginner tutorials should contain a setup phase, other more advanced tutorials should reference as prerequisites other beginner tutorials directly.

#### Command lines

One or multiple command lines starts directly with a prompt, we never show the PS1 content for inline command: `foo/something --bar`.

It can be as well multiple lines, in that case, we always starts with *$*, without directory location:
```
$ cat my_file
Awesome my_file content
on multiple lines
$ rm my_file
```

Finally, if we read follow the "code boxes" (command and code to write), the tutorial should be self-sufficient. It means we don't expect people to have to do actions outside of the code boxes, and only typing and executing their content should lead us to the desired state.

## Syntax
Duration: 0:03

Syntax is regular [markdown syntax](https://guides.github.com/features/mastering-markdown/), as you saw in the previous steps, some notes though:

### Text
For coherence in text inside code snippet, notes and survey with paragraphs, each end of line is reflected. A single end of line create a line return (*br*), while a end of line followed by an empty line will delimit pagraphs.

Blocks are delimited as well by an empty line.

### Images
They can be local or remote. The tutorial generator will fetch remote images and cache them locally.

### Info Boxes

Info boxes are colored callouts that enclose special information in codelabs. Positive info boxes should contain positive information like best practices and time-saving tips. Negative infoboxes should contain information like warnings and API usage restriction. To create an infobox, put the type of infobox on a line by itself, then begin the next line with a colon.

Positive
: This will appear in a positive info box.

Another one:

Negative
: This will appear in a negative info box.
It can as well be multi-lines like this.

### Fenced Code and Language Hints

Code blocks may be declared by placing them between two lines containing just three backticks (fenced code blocks). The codelab renderer will attempt to perform syntax highlighting on code blocks, but it is not always effective at guessing the language to highlight in. Put the name of the code language after the first fence to explicitly specify which highlighting plan to use.

``` go
This block will be highlighted as Go source code.
```

Let's see what the last keeps us to sum that all up!

## Easy, wasn't it?
Duration: 1:00

Congratulations! You made it! Remember the attendee to have reached his goal and has grown some skills, ensure you keep here a friendly title. “That’s all folk” is one example of such one.

Positive
: **Final code**
Your final code directory should now look like [this](https://tutorials.ubuntu.com). Do not hesitate to download and build your snap from it if you only read it through! It's important to have this final code so that people who couldn't follow live can check the final result. Check section  on “Provide regularly code “checkpoints”” for more guidelines on this.

By now you should successfully have understood all what's needed to create a successful tutorial, what the recommendations are, how the syntax is working . You should as well be a master in the recommended and required steps for the special markdown format. Keep in mind that this is a “rewarding step”. Congratulate the users, while recapping (quicker than in the overview step) what he just learn. That way, the attendee reflects the various steps and new domain knowledge he just acquired. After writing your first tutorial, it should become second nature to you.

### Next steps
* Guide the attendee from where to go from now on. This could be other codelabs being the “next logical ones”, mailing list, communication channels… For instance:
* You can have a look at "[https://tutorials.ubuntu.com/tutorial/advanced-snap-usage](advanced snap usage)" which is one of such tutorials following all our good practices in term of chaining and logical flow.
* Learn some more advanced techniques on how to phrase our own tutorial looking for [our others ones](https://tutorial.ubuntu.com)!
* Join the snapcraft.io community on the snapcraft forum for instance!

### Further readings
* Contrary to previous point, this is how to get more info related to the current topic and knowledge learnt. Those would be mostly links to documentation (it’s the only other place where external links are allowed). For instance:
* [Snapcraft.io documentation](http://snapcraft.io/docs/) is a good place to start reading the whole snap and snapcraft documentation.
* [Snapcraft syntax reference](http://snapcraft.io/docs/build-snaps/syntax), covering various available options like the daemon ones.
* Check how you can [contact us and the broader community](http://snapcraft.io/community/).
