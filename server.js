const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// process.cwd is root of where the Node process starts; dirname is the name of directory of the file
// change from where you call node server.js and these two will differ (bcs process.cwd will change)
console.log('process.cwd = ', process.cwd());
console.log('__dirname = ', __dirname);

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
  return path.join(__dirname, pathToJoin);
}

const server = http.createServer((req, res) => {
  console.log('req.url = ', req.url);

  if (req.url === '/dl.html') {
    const dlpath = createPathName('dl.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(dlpath).pipe(res);
  }

  // TODO: create transform stream/ data processing stream

  // read the file and set the header to Content-Disposition so client can download the file
  if (req.url === '/files/somefile.txt') {
    const rs = fs.createReadStream('./files/somefile.txt');
    res.setHeader('Content-Disposition', 'attachment; filename=verynice.txt');
    rs.pipe(res);
  }

  // this will let the client download that which is in the res.end function
  if (req.url === '/send-greetings') {
    res.statusCode = 200;
    res.setHeader('Content-Disposition', 'attachment; filename="greetings.txt"');
    res.end('hello');
  }

  if (req.url === '/') {
    const homepath = createPathName('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(homepath).pipe(res);
  }

  // create a default (index or 404 ?)
  else {
    console.log('landed in default, thus 404');
    const oopsPath = createPathName('404.html');
    res.writeHead(404, { 'Content-Type': 'text/html' });
    fs.createReadStream(oopsPath).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log('Server running on port %s', PORT);
});
