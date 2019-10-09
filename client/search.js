import { loadEventPage } from "./utils";

const searchInit = () => {
    const main = document.querySelector("#main");
    const searchbar = document.querySelector("#search-bar");
    const events = document.querySelector("#events");
    const searchButton = document.querySelector("#search-button");
    const searchWrapper = document.querySelector(".search-wrapper");
    const close = document.querySelector("#close");

    searchButton.onclick = () => {
        if (searchWrapper.style.display === "block") {
            main.classList = [];
            searchWrapper.style.display = "none";
            close.style.display = "none";
        } else {
            main.classList = ['blur'];
            searchWrapper.style.display = "block";
            close.style.display = "block";
        }
    };
    
    close.onclick = () => {
        main.classList = [];
        searchWrapper.style.display = "none";
        close.style.display = "none";
    }

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
                <div class="button event">
                    <h3>${response.name}</h3>
                    <p>${response.description}</p>
                </div>
                `;
            }
            events.innerHTML = divs;
            document.querySelectorAll(".event").forEach(el => {
                el.onclick = () => {
                    loadEventPage(el.querySelector("h3").textContent);
                };
            });
        };
        xhr.send();
    };
};

export {searchInit};