# image-list-generator
Generates webcomic-style HTML pages from a list of images. Pages contain a title, image, navigation with first/previous/next/latest page buttons, and an optional description.

WIP. May be wonky, certainly isn't pretty, but it'll do what it's meant to. Play about with it!

How to use:
* Edit template-page.html and style.css in the input folder to your liking.
* Don't remove the comments containing IMG, PREVIOUS, NEXT, LATEST and DESC as the generator uses these to place those items.
* Populate images.json with the images you want to use in the order you want them to display. "img" and "title" are mandatory, "desc" is optional and can contain HTML.
* Run the script: node gen.js
* Sit back and relax as (hopefully) the script spits out numbered, navigable static pages that you can upload to a host of your choice.
* If not, yell at me. Nicely.
