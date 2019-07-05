"use strict";
const fs = require("fs");
const { performance } = require("perf_hooks");

let t0 = performance.now();

console.log("starting generator...");

//load all required templates and image list
console.log("reading page templates...");
let pageTemplate = fs.readFileSync("input/template-page.html", "utf8");
let archiveTemplate = fs.readFileSync("input/template-archive.html", "utf8");
let indexTemplate = fs.readFileSync("input/template-index.html", "utf8");

console.log("loading image list...");
let images = JSON.parse(fs.readFileSync("input/images.json", "utf8"));
let numImg = images.length;

//write individual pages and archive list
console.log("parsing images...");
let archiveList = [];
images.forEach(function(img) {
  let imgPos = images.indexOf(img) + 1;
  //don't write a page for the last image (index)
  if (imgPos < numImg) {
    //write pages and copy images
    fs.writeFileSync(`output/pages/${imgPos}.html`, writePage(img, imgPos));
    console.log(`created page ${imgPos} of ${images.length}`);
    //push to archive list for later
    archiveList.push(
      `<li><a href="pages/${imgPos}.html">${img.title}</a></li>`
    );
  }
  //copy images
  fs.copyFileSync(`input/img/${img.img}`, `output/img/${img.img}`);
  console.log(`copied over image ${imgPos} of ${images.length}`);
});

//write archive page
console.log("writing archive page...");
archiveTemplate = insertContent(
  archiveTemplate,
  "<!-- ARCHIVE -->",
  archiveList.join("")
);
fs.writeFileSync(`output/archive.html`, archiveTemplate);

//write index page
console.log("writing index page...");
fs.writeFileSync(
  `output/index.html`,
  writePage(images[numImg - 1], numImg, true)
);

//copy stylesheet
fs.copyFileSync("input/style.css", "output/style.css");
console.log("copied over stylesheet");

let t1 = performance.now();
console.log(`All files generated in ${t1 - t0} ms!`);

function writePage(img, index, isIndexPage) {
  let page = isIndexPage ? indexTemplate : pageTemplate;

  //insert title and image
  let imgPath = isIndexPage ? `img/${img.img}` : `../img/${img.img}`;
  page = insertContent(page, "<!-- TITLE -->", img.title);
  page = insertContent(page, "<!-- IMG -->", `<img src="${imgPath}">`);

  //set previous button
  let prevPage;
  if (isIndexPage) {
    prevPage = `pages/${index - 1}`;
  } else if (index === 1) {
    prevPage = 1;
  } else {
    prevPage = index - 1;
  }
  page = insertContent(
    page,
    "<!-- PREVIOUS -->",
    `<a href="${prevPage}.html"><button>&lt; Previous</button></a>`
  );

  //set next button
  let nextPage;
  if (isIndexPage) {
    nextPage = "index";
  } else if (index === numImg - 1) {
    nextPage = "../index";
  } else {
    nextPage = index + 1;
  }
  page = insertContent(
    page,
    "<!-- NEXT -->",
    `<a href="${nextPage}.html"><button>Next &gt;</button></a>`
  );

  //check for desc and render if present
  let description = img.desc
    ? `<div class="description"><p>${img.desc}</p><div>`
    : "";
  page = insertContent(page, "<!-- DESC -->", description);

  return page;
}

function insertContent(page, breakpoint, content) {
  page = page.split(breakpoint);
  return page[0] + content + page[1];
}
