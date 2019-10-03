const loadEventPage = (eventName) => {
    window.location.href = `/event?name=${eventName}`;
}

// TODO replace alert's with animations
// TODO searchbar animation
window.onload = () => {
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

    // Search
    const searchbar = document.querySelector("#search-bar");
    const events = document.querySelector("#events");
    const searchButton = document.querySelector("#search-button");
    const searchWrapper = document.querySelector(".search-wrapper");


    searchButton.onclick = () => {
        if (searchWrapper.style.display === "block") {
            main.classList = [];
            searchWrapper.style.display = "none";
        } else {
            main.classList = ['blur'];
            searchWrapper.style.display = "block";
        }
    };

    searchbar.oninput = e => {
        if (!searchbar.value) {
            return;
        }
        events.innerHTML = "";
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/search?name=${searchbar.value}`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = () => {
            const responseJSON = JSON.parse(xhr.response);
            if (responseJSON.length === 0) {
                return;
            }
            let divs = '';
            for (let response of responseJSON) {
                divs += `
                <div class="event" onclick="loadEventPage('${response.name}')">
                    <h3>${response.name}</h3>
                    <p>${response.description}</p>
                </div>
                `;
            }
            events.innerHTML = divs;
        };
        xhr.send();
    };

};