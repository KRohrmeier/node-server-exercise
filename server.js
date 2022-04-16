const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// process.cwd is root of where the Node process starts; dirname is the name of directory of the file
// change from where you call node server.js and these two will differ (bcs process.cwd will change)
console.log('process.cwd = ', process.cwd());
console.log('__dirname = ', __dirname);

// send in a dirname+filename fileToRead
function promisifiedFileReading(fileToRead) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileToRead, (error, fileData) => {
      if (error) {
        reject(error);
      } else {
        resolve(fileData);
      }
    });
  });
}

function createPathName(pathToJoin) {
  console.log('pathname created = ', path.join(__dirname, pathToJoin));
  return path.join(__dirname, pathToJoin);
}

const server = http.createServer((req, res) => {
  console.log('req.url = ', req.url);
  let htmlFile = '';
  let contentType = '';

  switch (req.url) {
    case '/':
      htmlFile = 'index.html';
      contentType = 'text/html';

      break;
    case '/get-some-file':
      htmlFile = 'files/somefile.txt';
      contentType = 'Content-Disposition';
      break;

    case '/download':
      htmlFile = 'dl.html';
      contentType = 'text/html';
      break;

    default:
      htmlFile = '404.html';
      contentType = 'text/html';
      break;
  }

  if (htmlFile) {
    renderResource(res, htmlFile, contentType);
  }

  function renderResource(res, fileToRender = 'index.html', contentType = 'text/html') {
    let contentHeader = {};
    if (contentType === 'Content-Disposition') {
      contentHeader = { 'Content-Type': 'text', 'Content-Disposition': 'attachment' };
    } else {
      contentHeader = { 'Content-Type': 'text/html' };
    }
    res.writeHead(200, contentHeader);
    return fs.createReadStream(createPathName(fileToRender)).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log('Server running on port %s', PORT);
});
