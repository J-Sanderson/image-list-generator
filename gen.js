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
    //split in readiness for image insertion
    template = template.split('<!-- IMG -->')
    console.log('parsing images...')
    //write individual pages
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
  page = page[0] + `<h2>${index}: ${img.title}</h2><img src="${img.img}">` + page[1];
  //set previous button
  page = page.split('<!-- PREVIOUS -->');
  let prevPage = index === 1 ? 1 : index - 1;
  page = page[0] + `${prevPage}.html` + page[1];
  //set next button
  page = page.split('<!-- NEXT -->');
  let nextPage = index === numImg ? index : index + 1;
  page = page[0] + `${nextPage}.html` + page[1];
  //check for desc and render it if present
  return page;
}
