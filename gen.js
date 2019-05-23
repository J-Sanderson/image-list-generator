'use strict'
const fs = require('fs');

let template,
    numImg;

console.log('starting generator...');

console.log('reading template...')
fs.readFile('input/template-page.html', 'utf8', function(err, contents) {
  if (err) throw err
  template = contents;
  console.log('loading image list...');
  fs.readFile('input/images.json', 'utf8', function(err, images) {
    if (err) throw err;
    images = JSON.parse(images);

    //set last page buttons
    template = template.split('<!-- LATEST -->');
    numImg = images.length;
    template = template[0] + `${numImg}.html` + template[1];

    //write individual pages
    console.log('parsing images...')
    images.forEach(function(img) {
      let imgPos = images.indexOf(img) + 1;
      fs.writeFileSync(`output/${imgPos}.html`, writePage(img, imgPos));
      console.log(`created page ${imgPos} of ${images.length}`);
    });

    //copy over the stylesheet
    fs.copyFile('input/style.css', 'output/style.css', function(err) {
      if (err) throw err;
      console.log('copied over stylesheet')
    });
  });
});

function writePage(img, index) {
  let page = template;
  //insert title and image
  page = insertContent(page, '<!-- IMG -->', `<h2>${index}: ${img.title}</h2><img src="${img.img}">`)
  //set previous button
  let prevPage = index === 1 ? '1.html' : `${index - 1}.html`;
  page = insertContent(page, '<!-- PREVIOUS -->', prevPage);
  //set next button
  let nextPage = index === numImg ? `${index}.html` : `${index + 1}.html`;
  page = insertContent(page, '<!-- NEXT -->', nextPage)
  //check for desc and render if present
  if (img.desc) {
    page = insertContent(page, '<!-- DESC -->', img.desc);
  }
  return page;
}

function insertContent(page, breakpoint, content) {
  page = page.split(breakpoint);
  return page[0] + content + page[1];
}
