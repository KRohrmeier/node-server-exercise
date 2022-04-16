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

  // TODO: create transform stream/ data processing stream

  // read the file and set the header to Content-Disposition so client can download the file
  if (req.url === '/files/somefile.txt') {
    const rs = fs.createReadStream(createPathName('files/somefile.txt'));
    res.setHeader('Content-Disposition', 'attachment; filename=verynice.txt');
    return rs.pipe(res);
  }

  if (req.url === '/dl.html') {
    const dlpath = createPathName('dl.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return fs.createReadStream(dlpath).pipe(res);
  }

  if (req.url === '/readFile') {
    // readFile() reads the full contents of the file, and invokes the callback function when it's done
    fs.readFile(createPathName('/files/readFile.txt'), (err, data) => {
      if (err) {
        return console.log('ERROR reading the /readFile path: ', err);
      }
      return res.end(data);
    });
  }

  // this will let the client download that which is in the res.end function
  if (req.url === '/send-greetings') {
    res.statusCode = 200;
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="greetings.txt"'
    );
    return res.end('hello');
  }

  if (req.url === '/') {
    const homepath = createPathName('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return fs.createReadStream(homepath).pipe(res);
  }

  // create a default (index or 404 ?)
  else {
    console.log('landed in default - req.url = ', req.url);
    const oopsPath = createPathName('404.html');
    res.writeHead(404, { 'Content-Type': 'text/html' });
    fs.createReadStream(oopsPath).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log('Server running on port %s', PORT);
});
