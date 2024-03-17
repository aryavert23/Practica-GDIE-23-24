// Script para las funcionalidades relacionadas con los videos

function changeVideo(num){
    var x = document.getElementById("video-tokyo");
    var y = document.getElementById("video-osaka");
    var z = document.getElementById("info-tokyo");
    var a = document.getElementById("info-osaka");
    var b = document.getElementById("places-tokyo");
    var c = document.getElementById("places-osaka");

    // Controles video
    var d = document.querySelector(".chapter-name");
    var e = document.querySelector(".end-time");
    var f = document.querySelector(".current-time");
    var g = document.querySelector(".progress-bar");
    var h = document.querySelector(".video-controls");
    var i = document.querySelector(".play-btn i");

    // Obtener duracion de los videos
    xMin = Math.floor(x.duration / 60);
    xSec = Math.floor(x.duration - (xMin * 60));
    yMin = Math.floor(y.duration / 60);
    ySec = Math.floor(y.duration - (yMin * 60));

    x.pause();
    y.pause();
    
    x.currentTime = 0;
    y.currentTime = 0;

    // Si se cambia de video, reiniciar al boton de play
    if(i.classList.contains("fa-pause")){
        i.classList.replace("fa-pause", "fa-play");
    }

    var speedOpt = document.querySelector(".speed-options");
    speedOpt.addEventListener("click", function(e){
        console.log(e.target);
    })
    
    if(num == 1){  // Tokyo
        y.style.display = "none";
        h.style.display = "block";
        a.style.display = "none";
        c.style.display = "none";
        x.style.display = "block";
        z.style.display = "block";
        x.style.animation = "fadeLeft 1s ease-in";
        h.style.animation = "fadeLeft 1s ease-in";
        z.style.animation = "fadeUp 1s ease-in";
        d.innerHTML = document.getElementById("firstCardTokyo").innerHTML;
        e.innerHTML = returnCurrentTime(xMin, xSec);
        f.innerHTML = returnCurrentTime(0,0);
        updateProgressBar(x, g);
        updateCurrentTime(x, f);
    }
    else if(num == 2){ // Osaka
        x.style.display = "none";
        z.style.display = "none";
        b.style.display = "none";
        y.style.display = "block";
        h.style.display = "block";
        a.style.display = "block";
        y.style.animation = "fadeLeft 1s ease-in";
        h.style.animation = "fadeLeft 1s ease-in";
        a.style.animation = "fadeUp 1s ease-in";
        d.innerHTML = document.getElementById("firstCardOsaka").innerHTML;
        e.innerHTML = returnCurrentTime(yMin, ySec);
        f.innerHTML = returnCurrentTime(0,0);
        updateProgressBar(y, g);
        updateCurrentTime(y, f);
    }
}

function updateProgressBar(vid, bar){
    vid.addEventListener("timeupdate", function(e){
        bar.style.width = `${(e.target.currentTime / vid.duration) * 100}%`;
    })
}

function updateCurrentTime(vid, timer){
    vid.addEventListener("timeupdate", function(e){
        curMin = Math.floor(e.target.currentTime / 60);
        curSec = Math.floor(e.target.currentTime - (curMin * 60));
        timer.innerHTML = returnCurrentTime(curMin, curSec);
    })
}

// function chooseVideo

function selectVideoTokyo(num){
    var x = document.getElementById("video-tokyo");
    var y = document.querySelector(".chapter-name");
    var z = document.querySelector(".current-time");

    switch(num){
        case 1: x.currentTime = 0; // Akihabara
                y.innerHTML = "Akihabara";
                z.innerHTML = returnCurrentTime(0, 0);
                break;
        case 2: x.currentTime = 2 * 60 + 9; // Templo Senso-ji
                y.innerHTML = "Templo Senso-ji";
                z.innerHTML = returnCurrentTime(2, 9);
                break;
        case 3: x.currentTime = 4 * 60 + 2; // Tokyo Tower
                y.innerHTML = "Tokyo Tower";
                z.innerHTML = returnCurrentTime(4, 2);
                break;
        case 4: x.currentTime = 6 * 60; // Cruce de Shibuya
                y.innerHTML = "Cruce de Shibuya";
                z.innerHTML = returnCurrentTime(6, 0);
                break;
    }
}

function selectVideoOsaka(num){
    var x = document.getElementById("video-osaka");
    var y = document.querySelector(".chapter-name");
    var z = document.querySelector(".current-time");

    switch(num){
        case 1: x.currentTime = 0; // Dotonbori
                y.innerHTML = "Dotonbori";
                z.innerHTML = returnCurrentTime(0, 0);
                break;
        case 2: x.currentTime = 2 * 60 + 7; // Castillo Osaka
                y.innerHTML = "Castillo Osaka";
                z.innerHTML = returnCurrentTime(2, 7);
                break;
        case 3: x.currentTime = 4 * 60 + 12; // Shinsekai
                y.innerHTML = "Shinsekai";
                z.innerHTML = returnCurrentTime(4, 11);
                break;
        case 4: x.currentTime = 6 * 60 + 19; // Mercado Kuromon
                y.innerHTML = "Mercado Kuromon";
                z.innerHTML = returnCurrentTime(6, 19);
                break;
    }
}

function returnCurrentTime(min, sec){
    if(min < 10  && sec >= 10){
        return "0"+min + ":" + sec;
    }
    else if(min < 10 && sec < 10){
        return "0"+min + ":" + "0" + sec;
    }
    else{
        return min + ":" + sec;
    }
}

function playVideo(){
    var x = document.getElementById("video-tokyo");
    var y = document.getElementById("video-osaka");
    var z = document.querySelector(".play-btn i")

    if(x.style.display == "block"){
        changePlayPauseBtn(z, x);
    }
    else{
        changePlayPauseBtn(z, y);
    }
}

function changePlayPauseBtn(btn, vid){
    if(btn.classList.contains("fa-play")){
        vid.play();
        btn.classList.replace("fa-play", "fa-pause");
    }
    else{
        vid.pause();
        btn.classList.replace("fa-pause", "fa-play");
    }
}

function forwardVideo(){
    var x = document.getElementById("video-tokyo");
    var y = document.getElementById("video-osaka");

    if(x.style.display == "block"){
        x.currentTime += 5;
    }
    else{
        y.currentTime += 5;
    }
}

function backwardVideo(){
    var x = document.getElementById("video-tokyo");
    var y = document.getElementById("video-osaka");

    if(x.style.display == "block"){
        x.currentTime -= 5;
    }
    else{
        y.currentTime -= 5;
    }
}

function fullscreen(){
    var x = document.getElementById("video-tokyo");
    var y = document.getElementById("video-osaka");

    if (x.requestFullscreen && x.style.display == "block") {
        x.requestFullscreen();
    }
    else if (y.requestFullscreen && y.style.display == "block"){
        y.requestFullscreen();
    }
}