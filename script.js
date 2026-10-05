const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("fname");
const namePrompt = document.getElementById("name-prompt");
const stepName = document.getElementById("step-name");
const stepAsk = document.getElementById("step-ask");
const toName = document.getElementById("to-name");
const photo = document.getElementById("photo");
const lines = document.getElementById("lines");
const choices = document.getElementById("choices");
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const aside = document.getElementById("aside");
const clip = document.getElementById("clip");
const clipVideo = document.getElementById("clip-video");

const HEART = '<svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20 C4 14 2 10 4 6.5 C6 3.5 10 4 12 7.5 C14 4 18 3.5 20 6.5 C22 10 20 14 12 20 Z"/></svg>';

// Each time "No" crosses a threshold, the old question is crossed out and rewritten
const stages = [
    { from: 0, text: "Will you go out with me?", gif: "https://media.giphy.com/media/0kDdAFAELmvvFNUKim/giphy.gif", alt: "A shy animal waiting for an answer" },
    { from: 1, text: "You don't love me?", gif: "https://media.giphy.com/media/hbOgjMOUfLdWV2Ty1j/giphy.gif", alt: "A sad animal" },
    { from: 6, text: "Stop playing with me! Do you love me or not?!", gif: "https://media.giphy.com/media/QuCslOrnS649PSCnn7/giphy.gif", alt: "An annoyed animal" },
    { from: 11, text: "JUST ANSWER IT! DO YOU LOVE ME?!", gif: "https://media.giphy.com/media/8OPf6xrtXi3QEcu5h9/giphy.gif", alt: "A very upset animal" }
];

// Videos played after each answer
const NO_VIDEO = "videos/no.mp4";
const YES_VIDEO = "videos/yes.mp4";

let name = "";
let noCount = 0;
let stage = 0;

nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    name = nameInput.value.trim();

    if (!name) {
        photo.src = "https://media.giphy.com/media/VB3cK9oA48BbQWcObd/giphy.gif";
        photo.alt = "A confused animal";
        namePrompt.textContent = "Write your name on the To: line first!";
        namePrompt.classList.add("error");
        nameInput.focus();
        return;
    }

    toName.textContent = name;
    photo.src = stages[0].gif;
    photo.alt = stages[0].alt;
    stepName.hidden = true;
    stepAsk.hidden = false;
    yesButton.focus();
});

yesButton.addEventListener("click", () => {
    yesButton.classList.add("checked");
    yesButton.disabled = true;
    noButton.disabled = true;

    photo.src = "https://media.giphy.com/media/fHGl1MDMNkO6fOaFDF/giphy.gif";
    photo.alt = "A happy animal celebrating";

    const thanks = document.createElement("p");
    thanks.className = "line ask won";
    thanks.textContent = "Yay! Thank you for loving me, " + name + "!";
    thanks.insertAdjacentHTML("beforeend", HEART);
    lines.appendChild(thanks);
    aside.hidden = true;
    showVideo(YES_VIDEO);
});

noButton.addEventListener("click", () => {
    noCount += 1;

    const next = stages.findLastIndex((s) => noCount >= s.from);
    if (next !== stage) {
        stage = next;
        lines.lastElementChild.classList.add("struck");

        const line = document.createElement("p");
        line.className = "line ask";
        line.dataset.stage = stage;
        line.textContent = stages[stage].text;
        lines.appendChild(line);

        photo.src = stages[stage].gif;
        photo.alt = stages[stage].alt;
    }

    showVideo(NO_VIDEO);
    moveNoButton();
});

// Load a clip into the player, without restarting it if it's already playing
function showVideo(src) {
    if (clipVideo.getAttribute("src") === src) return;
    clipVideo.src = src;
    clip.hidden = false;
    clipVideo.play().catch(() => {});
}

// Hop the "No" box somewhere else in the choices area, never on top of "Yes"
function moveNoButton() {
    const maxX = Math.max(0, choices.clientWidth - noButton.offsetWidth);
    const maxY = Math.max(0, choices.clientHeight - noButton.offsetHeight);
    const yes = {
        left: yesButton.offsetLeft - 8,
        right: yesButton.offsetLeft + yesButton.offsetWidth + 8,
        top: yesButton.offsetTop - 8,
        bottom: yesButton.offsetTop + yesButton.offsetHeight + 8
    };

    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 20; tries++) {
        x = Math.floor(Math.random() * (maxX + 1));
        y = Math.floor(Math.random() * (maxY + 1));
        const overlaps = x < yes.right && x + noButton.offsetWidth > yes.left &&
            y < yes.bottom && y + noButton.offsetHeight > yes.top;
        if (!overlaps) break;
    }

    noButton.style.left = x + "px";
    noButton.style.top = y + "px";
}
