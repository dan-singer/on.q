window.addEventListener('load', () => {
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
        new QRCode(document.querySelector("#main"), {
            text: tempA.href,
            width: 128,
            height: 128
        });

        if (responseJSON.acts.length > 0) {
            let divs = "";
            for (let act of responseJSON.acts) {
                divs += `
                <div class="act">
                    <p class="act-name">${act.name}</p>
                    <p class="close">X</p>
                </div>
                `;
            }
            actsWrapper.innerHTML = divs;
        }
        document.querySelectorAll(".close").forEach(el => {
            el.onclick = () => {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', `remove-act?name=${responseJSON.name}`);
                xhr.onload = () => {
                    if (xhr.status === 201) {
                        el.parentElement.remove();
                    }
                };
                xhr.send(JSON.stringify({
                    name: el.parentElement.querySelector(".act-name").textContent
                }));
            };
        });
    };
    xhr.send();
});