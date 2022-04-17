const http = require('http');
const fs = require('fs');
const path = require('path');
const lookup = require('mime-types').lookup;

const PORT = 8080;

// process.cwd is root of where the Node process starts; dirname is the name of directory of the file
// change from where you call node server.js and these two will differ (bcs process.cwd will change)
// uncomment the 2 console.logs below to see this in action :)
// console.log('process.cwd = ', process.cwd());
// console.log('__dirname = ', __dirname);

// send in a fileToRead in format of dirname+filename
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

  promisifiedFileReading(filePath)
    .then((content) => {
      let mime = lookup(filePath);
      console.log('returning %s of type %s', filePath, mime);

      // if mime-type known, set header; otherwise, do not use Content-type header as per best practices
      if (mime) {
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
      } else {
        res.statusCode = 200;
      }
    })
    .catch((error) => {
      console.log('sending a 404; error = ', error);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      fs.createReadStream(createPathName('404.html')).pipe(res);
    });
});

server.listen(PORT, () => {
  console.log('Server running on port %s', PORT);
});
