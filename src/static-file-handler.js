const fs = require('fs');
const path = require('path');

/**
 * Serves a static file
 * @param {*String} filePath path relative to the server's dist folder
 */
const serveStaticFile = (request, response, filePath, contentType) => {
  const file = path.resolve(`${__dirname}/../dist/`, filePath.substring(1)); // Trim off the leading '/'
  if (!fs.existsSync(file)) {
    serveStaticFile(request, response, '/not-found.html', 'text/html');
    return;
  }
  response.writeHead(200, { 'Content-Type': contentType });
  const stream = fs.createReadStream(file);
  stream.on('open', () => {
    stream.pipe(response);
  });
};

module.exports = { serveStaticFile };
