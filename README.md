# image-list-generator

Generates webcomic-style HTML pages from a list of images. Pages contain a title, image, navigation with first/previous/next/latest page buttons, and an optional description.

May be wonky, certainly isn't pretty, but it'll do what it's meant to. Play about with it!

## How to use:

- Edit template-page.html, template-archive.html, and style.css in the input folder to your liking.
- Don't remove the comments containing IMG, PREVIOUS, NEXT, LATEST and DESC as the generator uses these to place those items.
- Place the images you want to use in input/img
- Populate images.json with the images you want to use in the order you want them to display. "img" and "title" are mandatory, "desc" is optional and can contain HTML. (Anything in the desc property will be placed inside a paragraph tag.)
- Run the script: node gen.js
- Sit back and relax as (hopefully) the script spits out numbered, navigable static pages that you can upload to a host of your choice.
- If not, yell at me. Nicely.

The cats featured in the sample images are some of the lovely residents of [Mog on the Tyne, Newcastle](https://www.mogonthetyne.com/).
