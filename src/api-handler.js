const fs = require('fs');

const eventPath = `${__dirname}/../data/events.json`;

/**
 * Responds with a 200-family status code as JSON
 */
const respond2xx = (request, response, statusCode, message) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ message }));
  response.end();
};

/**
 * Responds with a 400-family status code as JSON
 */
const respond4xx = (request, response, statusCode, message, id) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ message, id }));
  response.end();
};


/**
 * Returns the event data as a JSON object. Access it as payload in the callback
 * @param {Function} callback
 */
const getEventData = (callback) => {
  fs.readFile(eventPath, 'utf8', (err, data) => {
    callback(JSON.parse(data));
  });
};

/**
 * Set the event data by saving it to the events.json file
 * @param {any} data
 * @param {Function} callback Called after writing completed. Optional
 */
const setEventData = (data, callback) => {
  fs.writeFile(eventPath, JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    }
    if (callback) {
      callback();
    }
  });
};

/**
 * Returns a detailed JSON object of the event
 */
const getEvent = (request, response, filePath, queryParams, body, method) => {
  if (method === 'HEAD') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
  } else {
    // Check if query parameters are valid
    if (!queryParams.name) {
      respond4xx(request, response, 400, 'Missing required name query parameter', 'missing-name');
      return;
    }
    getEventData((eventData) => {
      if (!eventData[queryParams.name]) {
        respond4xx(request, response, 400, 'Event does not exist', 'event-does-not-exist');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(eventData[queryParams.name]));
      response.end();
    });
  }
};

/**
 * Creates an event on the server
 */
const createEvent = (request, response, filePath, queryParams, body) => {
  getEventData((eventData) => {
    const newEventData = eventData;
    if (newEventData[body.name]) {
      respond4xx(request, response, 400, 'event already exists', 'event-already-exists');
    } else {
      newEventData[body.name] = {
        name: body.name,
        description: body.description,
        theme: body.theme,
        acts: [],
      };
      setEventData(newEventData, null);
      respond2xx(request, response, 201, 'Event successfully created');
    }
  });
};

/**
 * Adds an act to a specified event
 */
const addAct = (request, response, filePath, queryParams, body) => {
  // Check if query parameters are valid
  if (!queryParams.name) {
    respond4xx(request, response, 400, 'Missing required name query parameter', 'missing-name');
    return;
  }

  getEventData((eventData) => {
    // Check if event doesn't exist
    if (!eventData[queryParams.name]) {
      respond4xx(request, response, 400, 'Event does not exist', 'no-event');
      return;
    }
    // Check if act already exists
    const event = eventData[queryParams.name];
    for (let i = 0; i < event.acts.length; ++i) {
      const act = event.acts[i];
      if (act.name === body.name) {
        respond4xx(request, response, 400, 'Act already exists', 'act-already-exists');
        return;
      }
    }
    // Then add the act
    event.acts.push({
      name: body.name,
    });
    setEventData(eventData, null);
    respond2xx(request, response, 201, 'Act added to event');
  });
};

/**
 * Adds an act to a specified event
 */
const removeAct = (request, response, filePath, queryParams, body) => {
  // Check if query parameters are valid
  if (!queryParams.name) {
    respond4xx(request, response, 400, 'Missing required name query parameter', 'missing-name');
    return;
  }

  getEventData((eventData) => {
    // Check if event doesn't exist
    if (!eventData[queryParams.name]) {
      respond4xx(request, response, 400, 'Event does not exist', 'no-event');
      return;
    }
    // Check if act already exists
    const event = eventData[queryParams.name];
    for (let i = 0; i < event.acts.length; ++i) {
      const act = event.acts[i];
      if (act.name === body.name) {
        // Then remove the act
        event.acts.splice(i, 1);
        setEventData(eventData, null);
        respond2xx(request, response, 201, 'Act removed from event');
        return;
      }
    }
    // The act does not exist, so this is a bad request
    respond4xx(request, response, 400, 'Act does not exist', 'act-does-not-exist');
  });
};

/**
 * Returns a JSON array of the events based on the search query
 */
const search = (request, response, filePath, queryParams, body, method) => {
  if (method === 'HEAD') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
  } else {
    // Check if query parameters are valid
    if (!queryParams.name) {
      respond4xx(request, response, 400, 'Missing required name query parameter', 'missing-name');
      return;
    }
    getEventData((eventData) => {
      const results = [];
      const eventNames = Object.keys(eventData);
      for (let i = 0; i < eventNames.length; ++i) {
        const eventName = eventNames[i];
        if (eventName.includes(queryParams.name) || queryParams.name === '*') {
          results.push(eventData[eventName]);
        }
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(results));
      response.end();
    });
  }
};

module.exports = {
  createEvent,
  addAct,
  removeAct,
  search,
  getEvent,
};
