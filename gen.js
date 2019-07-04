"use strict";
const fs = require("fs");

let pageTemplate, archiveTemplate, indexTemplate, numImg;

console.log("starting generator...");

console.log("reading page template...");
fs.readFile("input/template-page.html", "utf8", function(err, contents) {
  if (err) throw err;
  pageTemplate = contents;
  console.log("loading image list...");
  fs.readFile("input/images.json", "utf8", function(err, images) {
    if (err) throw err;
    images = JSON.parse(images);

    //set last page buttons on template
    numImg = images.length;
    pageTemplate = writeLatest(pageTemplate, "<!-- LATEST -->");

    //write individual pages
    console.log("parsing images...");
    let archiveList = [];
    images.forEach(function(img) {
      let imgPos = images.indexOf(img) + 1;
      //don't write a page for the last image (index)
      if (imgPos < numImg) {
        //write pages and copy images
        fs.writeFileSync(`output/${imgPos}.html`, writePage(img, imgPos));
        console.log(`created page ${imgPos} of ${images.length}`);
        fs.copyFileSync(`input/img/${img.img}`, `output/img/${img.img}`);
        console.log(`copied over image ${imgPos} of ${images.length}`);
        //push to list for later archive page
        archiveList.push(`<li><a href="${imgPos}.html">${img.title}</a></li>`);
      }
    });

    //write archive page
    console.log("reading archive template...");
    fs.readFile("input/template-archive.html", "utf8", function(err, contents) {
      if (err) throw err;
      archiveTemplate = contents;
      console.log("creating archive list...");
      archiveTemplate = insertContent(
        archiveTemplate,
        "<!-- ARCHIVE -->",
        archiveList.join("")
      );
      fs.writeFileSync(`output/archive.html`, archiveTemplate);
    });

    //write index page
    console.log("reading index template...");
    fs.readFile("input/template-index.html", "utf8", function(err, contents) {
      if (err) throw err;
      indexTemplate = contents;
      console.log("creating index page...");
      indexTemplate = writeLatest(indexTemplate, "<!-- LATEST -->");
      fs.writeFileSync(
        `output/index.html`,
        writePage(images[numImg - 1], numImg, true)
      );
    });

    //copy over the stylesheet
    fs.copyFile("input/style.css", "output/style.css", function(err) {
      if (err) throw err;
      console.log("copied over stylesheet");
    });
  });
});

function writePage(img, index, isIndexPage) {
  let page = isIndexPage ? indexTemplate : pageTemplate;
  //insert title and image
  page = insertContent(page, "<!-- TITLE -->", img.title);
  page = insertContent(page, "<!-- IMG -->", `<img src="img/${img.img}">`);
  //set previous button
  let prevPage = index === 1 ? 1 : index - 1;
  page = insertContent(
    page,
    "<!-- PREVIOUS -->",
    `<a href="${prevPage}.html"><button>&lt; Previous</button></a>`
  );
  //set next button
  if (isIndexPage || index === numImg - 1) {
    //current or penultimate page
    page = writeLatest(page, "<!-- NEXT -->");
  } else {
    //any other page
    let nextPage = index + 1;
    page = insertContent(
      page,
      "<!-- NEXT -->",
      `<a href="${nextPage}.html"><button>Next &gt;</button></a>`
    );
  }
  //check for desc and render if present
  if (img.desc) {
    page = insertContent(page, "<!-- DESC -->", img.desc);
  }
  return page;
}

function writeLatest(template, breakpoint) {
  return insertContent(
    template,
    breakpoint,
    `<a href="index.html"><button>Latest &gt;&gt;</button></a>`
  );
}

function insertContent(page, breakpoint, content) {
  page = page.split(breakpoint);
  return page[0] + content + page[1];
}
