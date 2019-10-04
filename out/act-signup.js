window.addEventListener('load', () => {
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
        xhr.open('POST', `/add-act?name=${eventName}`);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 201) {
                actForm.style.display = "none";
                thanks.style.display = "block";
            } else {
                alert("Something went wrong...");
            }
        };
        xhr.send(JSON.stringify({
            name: actName.value
        }));
    };
});