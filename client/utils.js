const loadEventPage = (eventName) => {
    window.location.href = `/event?name=${eventName}`;
}

export {loadEventPage};