import { searchInit } from "./search.js";
import { loadEventPage } from "./utils.js";
import Swal from "sweetalert2";

window.addEventListener('load', () => {
    searchInit();

    const eventHeader = document.querySelector("#event-name");
    const createAct = document.querySelector("#create-act");
    const actName = document.querySelector("#act-name");
    const actForm = document.querySelector("#act-form");
    const thanks = document.querySelector("#thanks");
    // Get the events based on the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get("name");

    eventHeader.textContent = `${eventName} Signup`;

    createAct.onclick = () => {
        if (!actName.value) {
            alert("Name cannot be blank");
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/add-act');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 201) {
                Swal.fire("Thanks for your entry!")
                    .then(() => {
                        location.reload();
                    });
            } else {
                Swal.fire("Sorry! That act is already taken.");
            }
        };
        xhr.send(JSON.stringify({
            actName: actName.value.trim(),
            eventName: eventName
        }));
    };
});