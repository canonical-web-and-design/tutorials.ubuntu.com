---
id: firefox-for-web-developers
summary: Learn how to access the Firefox web developer tools, and how to install the Firefox Developer Edition
categories: desktop
tags: tutorial, desktop, web, developer, Firefox
difficulty: 2
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2018-06-27
author: Canonical Web Team <webteam@canonical.com>

---

# Firefox for web developers

## Overview
Duration: 1:00

In this tutorial you will learn how to access the web development tools that are built into every copy of Firefox. You will also learn how to install the Firefox Developer Edition alongside your normal Firefox installation, allowing you to keep development work separate from your normal day-to-day browsing.


### What you'll learn
* How to access the developer tools
* How to configure the user interface to show the tools you want
* Why you might wish to install a second browser for development
* How to install Firefox Developer Edition


### What you'll need
* A computer running Ubuntu 16.04 or above
* The Firefox web browser (installed by default in Ubuntu desktop systems)


negative
: **Breaking things is easy… but so is fixing them**
Using the developer tools can render a web page unusable. Don't worry if you do break something, just refresh the browser by pressing ***F5*** to reload the page in its original state.


## Opening the developer tools
Duration: 5:00

Every copy of Firefox has a suite of developer tools built right into the browser (as do Chrome, Safari, Edge and most other modern browsers). There's nothing you need to add, no extensions to download, no hidden preferences to change. That's one of the things that makes web development so compelling — you've already got everything you need to get started!

First of all you need to be running Firefox. If you're already using it to read this tutorial, that's great. But if you're using a different browser you should start Firefox now. You can use the developer tools to inspect any web page, but for now let's take a look at the main page of Canonical's tutorials site. If you're reading this in Firefox, **right-click** on the link below, and select **Open Link in New Window** from the context menu. If you're using another browser, copy the link address below and paste it into the address bar of your Firefox window.

[https://tutorials.ubuntu.com/](https://tutorials.ubuntu.com/)

There are several ways to access the developer tools, and which you use is largely down to personal preference. Let's start with the most obvious and discoverable: via the menu.

### The Web Developer menu ###
Open the main Firefox menu via the button at the top right of the window. Towards the bottom of the menu you should see an entry labelled **Web Developer**. Clicking this will open the menu that holds a list of all the developer tools.

The most useful are those in the top section of the menu, but the only one you really need to use is the first, **Toggle Tools**. Select this menu entry and the developer tools panel will open — usually at the bottom of the browser window, but it could be at the side, or even in a separate window, depending on your settings. You can switch between all three options using the buttons at the top right. For now we'll work with the tools docked to the bottom of the window, so your browser should look something like this:

![Firefox with the developer tools open](images/developer_tools.png)

As you can see there are several tabs along the top edge of the developer tools panel. Each tab contains different tools, each focusing on a slightly different aspect of web development. The **Toggle Tools** menu entry just opens the panel in the same state that it was in when you last closed it. The other entries in the top section of the **Web Developer** menu are just shortcuts to open the panel with a particular tab already selected.

If you move your mouse to the top of the developer tools panel you should find that the cursor changes to a double-headed arrow. When it's in this state you can click and hold the mouse button then drag up and down to adjust the split between the web page and the panel. During development you sometimes need to see more of the web page, and sometimes want to have more content visible in the tools, so don't be afraid to dynamically change the height of the panel whenever you want.

Let's close the panel and look at the second way of opening it. Open the main Firefox menu, navigate to the **Web Developer** submenu and click the **Toggle Tools** option again. As the name suggests this will toggle the state of the panel, opening it if it's currently closed, and closing it if it's currently open. There's also a close button at the top right of the developer tools panel.


### Using the keyboard ###
If you return to the **Web Developer** menu you'll notice that each tool has an associated keyboard shortcut. If you find yourself frequently using one particular tool, it might be worth learning the shortcut to jump straight to it.

The **Toggle Tools** entry has a shortcut of **Ctrl-Shift-I**. Go on, give it a try. Each time you press it, the panel will be opened or closed, depending on its previous state. For historical reasons there's also another shortcut that will do the same thing, and which is often easier to use if you have a full-sized keyboard: the **F12** key. Pressing **F12** then selecting a particular tool with the mouse is usually faster than navigating directly to it using the **Web Developer** menu, hence why most of the entries in that menu are rarely used.


### Using the context menu ###
There is a third way to open the developer tools. This is not a toggle, as it always switches to a specific tab, but is a very common approach when you want to take a closer look at a specific element on the web page. If you open the context menu on something in the page, typically by right-clicking on it, you'll find an entry labelled **Inspect Element** towards the bottom of the menu. You can select this to open the developer tools with the **Inspector** tab active and the element in question already highlighted within the panel. Let's give it a try:

1. Right click on the "Do more with Ubuntu!" heading near the top of the web page.
2. Select **Inspect Element** from the context menu.
3. The developer tools should open with the Inspector tab selected and the <h1> element highlighted.

![Inspecting the page heading](images/inspector.png)

As you can see, this method cuts right through the layers of HTML content to highlight the specific element that you right-clicked on, making this a very convenient way to open the tools if you need to work on a particular part of the page.


## The inspector##
Duration: 10:00

All the tabs in the developer tools panel have their uses, but for beginners to web development — or anyone who is simply curious about how a web page works — you only really need to use the **Inspector** and the **Console**. This section and the next will describe them in a little more detail.

The inspector lets you look at the details of the web page's "Document Object Model" (DOM). This is the browser's internal version of the page structure, and the inspector exposes it in a way that makes it look similar to the HTML that was used to create the page. Be clear, though, that although the DOM is initially created from the HTML, it's not quite the same thing. The DOM is a live representation of the page structure, so if the page content has been dynamically modified by some JavaScript code, the changes will be reflected in the DOM, and hence in the inspector. Of course, the live nature of the DOM also means that you can change things in the inspector and see the results in real-time on the page — ideal for interactively tweaking the design of your page.

Let's play around with the Ubuntu Tutorials page a little. Don't worry, nothing you do in the inspector can be saved back to the Ubuntu servers, so your changes will only last until you reload the page and won't affect anyone else. Begin by right-clicking on the "Do more with Ubuntu!" heading and selecting **Inspect Element** from the context menu to highlight the `<h1>` element in the inspector (you might already be in this position from the previous section, but it won't hurt to do it again to be sure). As a reminder, here's how the developer tools should look at this point:

![Inspecting the page heading](images/inspector.png)

The inspector is divided into two main sections. The large area on the left shows the DOM as a tree structure. Each HTML element is represented as a line in the tree, indented to show it's position in the page structure. Container elements are marked with a triangle to the left which can be clicked to hide or reveal the child nodes within them in the DOM. The smaller section on the right contains further details about the CSS rules applied to the element that is currently highlighted in the main section. This section also has several tabs presenting different views of, and tools for modifying, the CSS rules.

Without clicking any buttons, move your mouse up and down the DOM tree in the main section. Notice how the elements in the web page are highlighted as you move over the corresponding entry in the DOM. Clicking on a DOM entry will select it, updating the section on the right to show the CSS rules that now apply.

With the `<h1>` selected again, take a closer look at its entry in the DOM. Notice that the content of the heading is visible within the inspector. Double click on the content and you are able to edit it to say something different. Let's change it to read "Do more with the developer tools!", then press Enter to finish editing. Immediately the web page updates:

![After editing the heading](images/edited_h1.png)

There are more editing options available from the context menu. Right-click on the `<h1>` element in the DOM tree and select **Duplicate Node**. As you might expect this duplicates the current node so we end up with two identical headings. Double-click on the `<h1>` tag at the start of the new element and change it to `<h2>`, then edit the content to read "Developer tools are cool!".

Our edited page is looking good, but there's a bit too much of a gap between the new `<h2>` and the paragraph below it. With the `<h2>` selected in the DOM tree, take a look at the **Rules** tab in the right-hand section:

![CSS rules for the <h2> element](images/rules_panel.png)

The CSS rules include an entry that's setting the `margin-bottom` property to `2.25em`. Move the mouse over any rule and you'll see that checkboxes appear, letting you turn individual rules on and off wihout having to edit them. Turn off the `margin-bottom` rule to see what effect it's having on your heading. Turning it off completely makes the spacing a little too tight. Double-click on the value to change it to `1em` instead.

Finally let's give our element a bit of colour by adding a new rule. First we need to choose a colour to use and, as we want our changes to fit in with the rest of the page, it seems appropriate to use the same shade of orange that's in the page header. But what shade is that, exactly? Fortunately the inspector has an eyedropper tool that will let us pick the colour of any pixel in our web page. It's up at the top right of the DOM section, next to the search field. Just click the button and move your mouse back into the page area, where you'll discover the pointer has changed into a magnifying loupe that makes it easy to pick a specific pixel. Click in the orange header and the hexadecimal colour value will be copied to your clipboard.

Now to apply that value to our heading. With the `<h2>` still selected in the DOM panel, move to the CSS rules section on the right. Towards the top is an empty rules section labelled "element". Click on the blank white space in that section and a text entry cursor will appear. To add a new CSS rule you simply have to enter the name of the rule (`color` in this case — note the American spelling), then press Enter or Tab to enter the value. In this case we're pasting the value from the clipboard, so just press Ctrl-V.

If everything went well your website now looks something like this:

![The web page after editing in the inspector](images/edited page.png)

We're going to do one last thing in the inspector: delete something. Right-click on the `<h2>` element in the DOM list and select **Delete Node** from the menu. The element is immediately removed from the page. Have you ever been annoyed when printing a web page only to find that your toner or ink is wasted on advertisements, logos or other parts that weren't necessary. Now you know how to remove unwanted content from the page before you print.

There's lots more that you can do in the inspector. If you're learning to write HTML it can be invaluable to help understand how other pages are put together, and if you're trying to design a page being able to see the effects of CSS changes immediately is a huge benefit. Play around and don't be afraid to break things — **F5** will soon get you back to the original page.


