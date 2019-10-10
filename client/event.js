import { searchInit } from "./search.js";
import { loadEventPage } from "./utils";
import qrcode from "qrcode-generator";
import Swal from "sweetalert2";

const removeAct = (act, el) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `remove-act?name=${act}`);
    xhr.onload = () => {
        if (xhr.status === 201) {
            el.parentElement.remove();
        }
    }
    xhr.send(JSON.stringify({
        name: el.parentElement.querySelector(".act-name").textContent
    }))
}

window.addEventListener('load', () => {

    let isAdmin = false; // Yes, this is terribly insecure...should make this better in the future!
    
    searchInit();

    const actsWrapper = document.querySelector("#acts");
    const eventHeader = document.querySelector("#event-name");
    // Get the events based on the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get("name");

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/get-event?name=${eventName}`);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
        let responseJSON = JSON.parse(xhr.response);
        eventHeader.textContent = responseJSON.name;

        // Generate a QR code for the sign up page
        let tempA = document.createElement('a'); // necessary to get an absolute path
        tempA.href = `/signup?name=${responseJSON.name}`;
        let qr = qrcode(4, 'L');
        qr.addData(tempA.href);
        qr.make();
        let doc = new DOMParser().parseFromString(qr.createImgTag(), 'text/html');
        document.querySelector(".center").appendChild(doc.body.firstChild);


        if (responseJSON.acts.length > 0) {
            let divs = "";
            for (let act of responseJSON.acts) {
                divs += `
                <div class="act">
                    <p class="act-name">${act.name}</p>
                    <p class="remove-act">X</p>
                </div>
                `;
            }
            actsWrapper.innerHTML = divs;
        }
        document.querySelectorAll(".remove-act").forEach(el => {
            el.onclick = () => {
                if (isAdmin) {
                    removeAct(responseJSON.name, el);
                } else {
                    Swal.fire({
                        title: 'Please enter the event password',
                        input: 'text',
                        inputAttributes: {
                            autocapitalize: false
                        },
                        showCancelButton: true,
                        showLoaderOnConfirm: true,
                        confirmButtonText: 'Confirm',
                        preConfirm: (password) => {
                            // We need to use promises here - so we'll use fetch instead of XHR
                            return fetch(`/validate?name=${eventName}&password=${password}`);
                        },
                        allowOutsideClick: () => !Swal.isLoading()

                    }).then((response) => {
                        if (response.value.status === 200) {
                            removeAct(responseJSON.name, el);
                            isAdmin = true;
                        } else {
                            Swal.fire("Invalid password");
                        }
                    });
                }
            };
        });
    }
    xhr.send();


});