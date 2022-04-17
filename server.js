const http = require('http');
const fs = require('fs');
const path = require('path');
const lookup = require('mime-types').lookup;

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
  const requestedPath = path.join(__dirname, 'public', pathToJoin);
  console.log('pathname created = ', requestedPath);
  return path.join(requestedPath);
}

const server = http.createServer((req, res) => {
  console.log('req.url = ', req.url);

  // remove leading and trailing slashes
  let resourceUrl = req.url.replace(/^\/+|\/+$/g, '');

  // setting base url to index.html
  if (resourceUrl === '') {
    resourceUrl = 'index.html';
  }

  let filePath = createPathName(resourceUrl);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log('sending a 404');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return fs.createReadStream(createPathName('404.html')).pipe(res);
    } else {
      let mime = lookup(filePath);
      console.log('returning %s of type %s', filePath, mime);

      // if mime-type known, set header; otherwise, do not use Content-type header
      if (mime) {
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
      } else {
        res.statusCode = 200;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log('Server running on port %s', PORT);
});
