const loadEventPage = eventName => {
    window.location.href = `/event?name=${eventName}`;
};

window.addEventListener('load', () => {
    const main = document.querySelector("#main");
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
});