const fs = require("fs");

const eventPath = `${__dirname}/../data/events.json`;

const respond2xx = (request, response, statusCode, message) => {
    response.writeHead(statusCode, {"Content-Type": "application/json"});
    response.write(JSON.stringify({message}));
    response.end();
}

const respond4xx = (request, response, statusCode, message, id) => {
    response.writeHead(statusCode, {"Content-Type": "application/json"});
    response.write(JSON.stringify({message, id}));
    response.end();
}


/**
 * Returns the event data as a JSON object. Access it as payload in the callback
 * @param {Function} callback 
 */
const getEventData = (callback) => {
    fs.readFile(eventPath, 'utf8', (err, data) => {
        callback(JSON.parse(data));
    });
}

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

const createEvent = (request, response, filePath, queryParams, body) => {
    getEventData((eventData) => {
        if (eventData[body.name]) {
            respond4xx(request, response, 400, "event already exists", "event-already-exists")
        } else {
            eventData[body.name] = {
                name: body.name,
                description: body.description,
                theme: body.theme,
                acts: []
            };
            setEventData(eventData, null);
            respond2xx(request, response, 201, "Event successfully created");
        }
    });
};

const addAct = (request, response, filePath, queryParams, body) => {
    // Check if query parameters are valid
    if (!queryParams.id) {
        return respond4xx(request, response, 400, "Missing required id query parameter", "missing-id");
    }

    getEventData((eventData) => {
        // Check if event doesn't exist
        if (!eventData[queryParams.id]) {
            return respond4xx(request, response, 400, "Event does not exist", "no-event");
        }
        // Check if act already exists
        const event = eventData[queryParams.id];
        for (let i = 0; i < event.acts.length; ++i) {
            let act = event.acts[i];
            if (act.name === body.name) {
                return respond4xx(request, response, 400, "Act already exists", "act-already-exists");
            }
        }
        // Then add the act 
        event.acts.push({
            name: body.name
        }); 
        setEventData(eventData, null);
        return respond2xx(request, response, 201, "Act added to event");
    });
};

module.exports = {
    createEvent,
    addAct
}