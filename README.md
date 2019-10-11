# on-q
on-q is an event-organizing tool mostly geared towards open mics. Its main purpose is displaying the order that acts will perform for an event, and making it easy for acts to add themselves to an event.

## API and page documentation
### Pages
- `/`
  - Homepage. Also includes create event form.
- `/event?name="event id"`
  - Responds with the event page based on the ID
  - Response Codes: `200 OK` or `404 Not Found`
- `/signup?name="event id"`
  - Responds with event sign-up page
  - Response Codes: `200 OK` or `404 Not Found`
### API
- `/get-event?name="event id"`
  - Returns a detailed JSON object of the event with the id
  - Methods: `HEAD` or `GET`
  - Response Codes: `200 OK` or `400 Bad Request`
  ```javascript
  {
    name: "name",
    description: "description",
    acts: [
      {
        name: "amazing act"
      },
      {
        name: "another amazing act"
      }
    ]
  }
  ```
- `/create-event`
  - Creates an event on the server
  - Method: `POST`
  - Response Codes: `201 Created` `400 Bad Request` <-- if event already exists 
```javascript
// Example Body
{
  name: "Jam-Club-Open-Mic",
  description: "Yo wut up",
  password: "abc1234"
}
```
- `/add-act`
  - Adds an act to an event on the server
  - Method: `POST`
  - Response Codes: `204 No Content` `400 Bad Request` <-- If event doesn't exist
```javascript
// Example Body
{
  eventName: "Open Mic",
  actName: "Tech Diff"
}
```
- `/search?name="event name"`
  - Searches the "database" of events for anything matching the query and returns a JSON object containing those results
  - name is optional. If excluded, returns all events.
  - Methods: `HEAD` or `GET`
  - Response codes: `200 OK` or `400 bad request`
- `/validate?name="event name"&password="password"`
  - Returns either `200 OK` or `400 bad request` based on if the password is correct
  - Methods: `HEAD` or `GET`, but both return the same thing
- `/remove-act`
  - Removes an act attached to an event
  - Methods: `POST`
```js
// Example Body
{
  eventName: "Open Mic",
  actName: "Tech Diff"
}
```
## What went right?
The app is fully functional and has a clean design. Webpack integration went smoothly.
## What went wrong?
The app is not very secure and has some vulnerabilities in the front-end.
## Improvements for the future
- Use a database rather than a json file
- Improve application security on the front-end
## Above and Beyond
- Used Webpack and Babel for the client-side to allow ES5 compatibility and for the use of ES6 modules.
- Stored data in a json file rather than in RAM
- Implemented animations on the front-end with anime.js
## Resources used
- anime.js for client-side animations
- webpack for module bundling
- sweetalert2 for fancy pop-up animations