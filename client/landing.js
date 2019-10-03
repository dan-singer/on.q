// TODO replace alerts with animations
// TODO searchbar animation
window.addEventListener('load', () => {
    const makeEventButton = document.querySelector("#make-event");
    const eventIntroWrapper = document.querySelector("#event-intro-wrapper");
    const eventForm = document.querySelector("#event-form");
    const createEvent = document.querySelector("#create-event");
    const main = document.querySelector("#main");

    main.classList = [];

    makeEventButton.onclick = () => {
        eventIntroWrapper.style.display = "none";
        eventForm.style.display = "block";
    };

    createEvent.onclick = () => {
        const name = document.querySelector("#name");
        const description = document.querySelector("#description");
        const theme = document.querySelector("#theme");

        if (!name.value || !description.value) {
            alert("Missing name and description");
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/create-event');

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
            if (xhr.status === 201) {
                loadEventPage(name.value);
            } else if (xhr.status === 400) {
                alert("Event already exists");
            }
        };
        let body = JSON.stringify({ 
            name: name.value,
            description: description.value,
            theme: theme.value
        });
        xhr.send(body);
    };
});