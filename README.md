# image-list-generator
Generates webcomic-style HTML pages from a list of images. Pages contain a title, image, navigation with first/previous/next/latest page buttons, and an optional description.

WIP. May be wonky. Play about with it!

How to use:
* Edit template-page.html and style.css in the input folder to your liking.
* Populate images.json with the images you want to use. "img" and "title" are mandatory, "desc" is optional and can contain HTML.
* Don't remove the comments containing IMG, PREVIOUS, NEXT, LATEST and DESC as the generator uses these to place those items.
* Run the script: node gen.js
* Sit back and relax as (hopefully) the script spits out numbered, navigable static pages that you can upload to a host of your choice.
* If not, yell at me. Nicely.
