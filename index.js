document.addEventListener("keypress", () => {onClick(document.getElementById("keyboard").children[Math.floor(Math.random() * 8)])});

async function getDogsong() {
    let data = await fetch("dogsong.mp3");
    const dataBuffer = await data.arrayBuffer();
    data = await audio.decodeAudioData(dataBuffer);
    return data;
}

async function getMaltigiScream() {
    let data = await fetch("maltigi.mp3");
    const dataBuffer = await data.arrayBuffer();
    data = await audio.decodeAudioData(dataBuffer);
    return data;
}

async function getFriend() {
    let data = await fetch("friend.mp3");
    const dataBuffer = await data.arrayBuffer();
    data = await audio.decodeAudioData(dataBuffer);
    return data;
}

let bouncingDog = {
    top: 0,
    left: 0,
    topDirection: 1,
    leftDirection: 1,
    speed: 0.1,
    rotation: 0
};

let bouncingDogElement = document.getElementById("bouncer");

function spawnRandomMaltigi() {
    let x = Math.random() * 100;
    let y = Math.random() * 100;
    console.log(x);
    let background = document.getElementsByTagName("html")[0];
    let maltigi = document.createElement("div");
    background.appendChild(maltigi);
    maltigi.style.top = y.toString() + "%";
    maltigi.classList.add("maltigi");
    maltigi.style.left = x.toString() + "%";
    doMaltigiScream();
}

bouncingDogElement.onclick = () => {spawnRandomMaltigi(); bouncingDog.speed *= 1.1;};

setInterval(() => {
    bouncingDogElement.style.top = bouncingDog.top.toString() + "%";
    bouncingDogElement.style.left = bouncingDog.left.toString() + "%";
    bouncingDog.top += bouncingDog.topDirection * bouncingDog.speed * window.innerWidth / window.innerHeight;
    bouncingDog.left += bouncingDog.leftDirection * bouncingDog.speed;
    bouncingDogElement.style.transform = "rotate(" + bouncingDog.rotation.toString() + "deg)";
    bouncingDog.rotation += 0.8;
    if (bouncingDog.top >= 100) {
        bouncingDog.top = 100;
        bouncingDog.topDirection *= -1;
    }
    if (bouncingDog.left >= 100) {
        bouncingDog.left = 100;
        bouncingDog.leftDirection *= -1;
    }
    if (bouncingDog.top <= 0) {
        bouncingDog.top = 0;
        bouncingDog.topDirection *= -1;
    }
    if (bouncingDog.left <= 0) {
        bouncingDog.left = 0;
        bouncingDog.leftDirection *= -1;
    }
})

let audio = new AudioContext();
let player = audio.createBufferSource();
let analyser = audio.createAnalyser();
analyser.connect(audio.destination);

let startTime = 0;
let playbackDuration = 0;
let rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"];
let dogsong = getDogsong();
let maltigiScream = getMaltigiScream();
let friend = getFriend();
(async () => {dogsong = await dogsong; Object.freeze(dogsong);})()

async function playDogsongClip(start, duration) {
    await dogsong;
    let player = audio.createBufferSource();
    player.buffer = dogsong;
    player.connect(analyser);
    player.start(0, start);
    setTimeout(() => {player.stop()}, duration);
}

async function onClick(key) {
    let original = key.style.backgroundColor;
    let color = window.getComputedStyle(key).backgroundColor.slice(4, -1).split(", ");
    let darker = [...color];
    for (let j = 0; j < 3; j++) {
        darker[j] = parseInt(color[j]) - 30;
        if (darker[j] < 0) darker[j] = 0;
    }
    key.style.backgroundColor = "#" + darker.map(x => x.toString(16).padStart(2, "0")).join("");
    console.log(key.style.backgroundColor);
    setTimeout(() => {key.style.backgroundColor = original; console.log(color)}, 100);
    await playDogsongClip(playbackDuration, 300);
    playbackDuration += 1 / 1000 * 300;
    if (playbackDuration >= dogsong.length / dogsong.sampleRate) playbackDuration = 0;
}

async function doMaltigiScream() {
    maltigiScream = await maltigiScream;
    let player = audio.createBufferSource();
    player.buffer = maltigiScream;
    player.connect(analyser);
    player.start(0);
}

async function doFriend() {
    friend = await friend;
    let player = audio.createBufferSource();
    player.buffer = friend;
    player.connect(analyser);
    player.start(0);
    let opacity = 0;
    let opacityDirection = 1;
    let ID = setInterval(
        () => {
            document.getElementById("friend").style.opacity = opacity.toString() + "%";
            if (opacity > 20) opacityDirection *= -1;
            opacity += opacityDirection;
        }, 30
    );
    setTimeout(() => {
        clearInterval(ID);
        document.getElementById("friend").style.opacity = "0%";
    }, 2000)
}

function arrangeKeyboard() {
    let container = document.getElementById("keyboard")
    console.log(container);
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    for (let i = 0; i < 8; i++) {
        let key = container.children[i];
        key.onclick = () => {
            onClick(key);
        };
        key.style.backgroundColor = rainbow[i];
    }
}

arrangeKeyboard();
setInterval(doFriend, 30 * 1000);
