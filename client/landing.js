import { searchInit } from "./search.js";
import { loadEventPage } from "./utils.js";
import anime from "animejs";
import Swal from "sweetalert2";

/**
 * Generates a splash animation using anime.js
 */
const generateSplashAnimation = () => {
    document.querySelector("#splash").style.display = 'block';
    // Splash animation
    let duration = 2000;
    let timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration
    });
    timeline.add({
        targets: "#splash h1",
        translateX: ['60vw', '0'],
        delay: anime.stagger(duration / 4)
    });
    timeline.add({
        targets: '#splash p',
        translateX: ['1000%', '-50%'],
    });
    timeline.add({
        targets: '#splash > div',
        top: ['50%', '2%']
    });
    timeline.add({
        targets: '#splash > p',
        top: ['50%', '2.5%']
    }, `-=${duration}`);
    timeline.add({
        targets: "#splash",
        backgroundColor: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)']
    });
}

window.addEventListener('load', () => {

    generateSplashAnimation();
    searchInit();

    const makeEventButton = document.querySelector("#make-event");
    const eventIntroWrapper = document.querySelector("#event-intro-wrapper");
    const eventForm = document.querySelector("#event-form");
    const createEvent = document.querySelector("#create-event");
    const main = document.querySelector("#main");

    main.classList = [];

    makeEventButton.onclick = () => {
        anime({
            targets: "#event-intro-wrapper",
            opacity: 0
        });
        anime({
            targets: "#event-form",
            opacity: [0, 1]
        });
        eventForm.style.display = "block";
    };

    createEvent.onclick = () => {
        const name = document.querySelector("#name");
        const description = document.querySelector("#description");
        const password = document.querySelector("#password");

        if (!name.value || !description.value || !password.value) {
            Swal.fire("All form values must be filled out");
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
                Swal.fire("Event already exists");
            }
        };
        let body = JSON.stringify({ 
            name: name.value.trim(),
            description: description.value.trim(),
            password: password.value.trim()
        });
        xhr.send(body);
    };
});