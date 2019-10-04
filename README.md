# on.q
- Event creator will create an event or select an existing event. Events can be searched for and will have unique names
- Once an event is selected, a table of upcoming performances will be displayed along with a QR code to sign up.
- Admins on this page can freely remove and add people
- The QR code directs the user to a sign up - only page. These people can only sign up and not remove people.

## Server Design
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
  theme: "dark"
}
```
- `/add-act?name="event id"`
  - Adds an act to an event on the server
  - Method: `POST`
  - Response Codes: `204 No Content` `400 Bad Request` <-- If event doesn't exist
```javascript
// Example Body
{
  name: "Tech Diff"
}
```
- `/search?name="event name"`
  - Searches the "database" of events for anything matching the query and returns a JSON object containing those results
  - name is optional. If excluded, returns all events.
  - Methods: `HEAD` or `GET`
  - Response codes: `200 OK` or `400 bad request`

## Client Design
We will have different pages for different parts of the app, so we'll need to figure out how to reuse code. I think webpack and ES6 Modules is a good way to go
