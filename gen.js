'use strict'
const fs = require('fs');

let pageTemplate,
    archiveTemplate,
    numImg;

console.log('starting generator...');

console.log('reading page template...')
fs.readFile('input/template-page.html', 'utf8', function(err, contents) {
  if (err) throw err
  pageTemplate = contents;
  console.log('loading image list...');
  fs.readFile('input/images.json', 'utf8', function(err, images) {
    if (err) throw err;
    images = JSON.parse(images);

    //set last page buttons on template
    numImg = images.length;
    pageTemplate = insertContent(
      pageTemplate,
      '<!-- LATEST -->',
      `<a href="${numImg}.html"><button>Latest &gt;&gt;</button></a>`
    );

    //write individual pages
    console.log('parsing images...')
    let archiveList = [];
    images.forEach(function(img) {
      let imgPos = images.indexOf(img) + 1;
      //write pages and copy images
      fs.writeFileSync(`output/${imgPos}.html`, writePage(img, imgPos));
      console.log(`created page ${imgPos} of ${images.length}`);
      fs.copyFileSync(`input/img/${img.img}`, `output/img/${img.img}`);
      console.log(`copied over image ${imgPos} of ${images.length}`);
      //push to list for later archive page
      archiveList.push(`<li><a href="${imgPos}.html">${img.title}</a></li>`)
    });

    //write archive page
    console.log('reading archive template...')
    fs.readFile('input/template-archive.html', 'utf8', function(err, contents) {
      if (err) throw err
      archiveTemplate = contents;
      console.log('creating archive list...')
      archiveTemplate = insertContent(
        archiveTemplate,
        '<!-- ARCHIVE -->',
        archiveList.join('')
      );
      fs.writeFileSync(`output/archive.html`, archiveTemplate);
    });

    //copy over the stylesheet
    fs.copyFile('input/style.css', 'output/style.css', function(err) {
      if (err) throw err;
      console.log('copied over stylesheet');
    });
  });
});

function writePage(img, index) {
  let page = pageTemplate;
  //insert title and image
  page = insertContent(page, '<!-- TITLE -->', img.title);
  page = insertContent(page, '<!-- IMG -->', `<img src="img/${img.img}">`);
  //set previous button
  let prevPage = index === 1 ? 1 : index - 1;
  page = insertContent(
    page,
    '<!-- PREVIOUS -->',
    `<a href="${prevPage}.html"><button>&lt; Previous</button></a>`
  );
  //set next button
  let nextPage = index === numImg ? index : index + 1;
  page = insertContent(
    page,
    '<!-- NEXT -->',
    `<a href="${nextPage}.html"><button>Next &gt;</button></a>`
  );
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
