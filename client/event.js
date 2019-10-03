window.addEventListener('load', () => {
    const actsWrapper = document.querySelector("#acts");
    // Get the events based on the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get("name");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/get-event?name=${eventName}`);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
        let responseJSON = JSON.parse(xhr.response);
        if (responseJSON.acts.length > 0) {
            let divs = "";
            for (let act of responseJSON.acts) {
                divs += `
                <div class="act">
                    <p>${act.name}</p>
                </div>
                `;
            }
            actsWrapper.innerHTML = divs;
        }
    }
    xhr.send();
});