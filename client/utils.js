/**
 * Loads an event page
 * @param {String} eventName Name of event
 */
const loadEventPage = (eventName) => {
    window.location.href = `/event?name=${eventName}`;
}

export {loadEventPage};