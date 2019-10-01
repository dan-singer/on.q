const http = require('http');
const url = require('url');
const query = require('querystring');
const staticFileHandler = require('./static-file-handler.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const router = {
  patterns: {
    '.html': (request, response, relativePath) => staticFileHandler.serveStaticFile(request, response, relativePath, 'text/html'),
    '.js': (request, response, relativePath) => staticFileHandler.serveStaticFile(request, response, relativePath, 'application/javascript'),
    '.css': (request, response, relativePath) => staticFileHandler.serveStaticFile(request, response, relativePath, 'text/css'),
    '.png': (request, response, relativePath) => staticFileHandler.serveStaticFile(request, response, relativePath, 'image/png'),
  },
  exact: {
    '/': (request, response) => staticFileHandler.serveStaticFile(request, response, '/landing.html', 'text/html'),
    '/event': (request, response) => staticFileHandler.serveStaticFile(request, response, '/event.html', 'text/html'),
    '/signup': (request, response) => staticFileHandler.serveStaticFile(request, response, '/signup.html', 'text/html'),
  },
  notFound: (request, response) => staticFileHandler.serveStaticFile(request, response, '/not-found.html', 'text/html'),

};

const parseBody = (request, callback) => {
  const body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    if (body.length === 0) {
      callback(null);
      return;
    }
    const bodyString = Buffer.concat(body).toString();
    let bodyJSON;
    try {
      bodyJSON = JSON.parse(bodyString);
      callback(bodyJSON);
    } catch (e) {
      callback(null);
    }
  });
};

http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url);
  const queryParams = query.parse(parsedUrl.query);
  parseBody(request, (body) => {
    // First check if any of the regex patterns match the path
    const patterns = Object.keys(router.patterns);
    for (let i = 0; i < patterns.length; ++i) {
      const route = patterns[i];
      const regex = new RegExp(route);
      if (regex.test(parsedUrl.pathname)) {
        router.patterns[route](request, response, parsedUrl.pathname, queryParams, body);
        return;
      }
    }
    // If not, check for exact matches
    if (router.exact[parsedUrl.pathname]) {
      router.exact[parsedUrl.pathname](request, response, parsedUrl.pathname, queryParams, body);
    } else {
      router.notFound(request, response, parsedUrl.pathname, queryParams, body);
    }
  });
}).listen(PORT);
