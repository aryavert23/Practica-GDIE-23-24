
function showCards(){
    var x = document.getElementById("cards");
    if(x.style.opacity == "0"){
        x.style.opacity = "1";
        x.style.animation = "fadeUp 0.75s ease-in";
    }
}

function showPlaces(num){
    var x = document.getElementById("places-tokyo");
    var y = document.getElementById("places-osaka");

    if(num == 1){
        y.style.display = "none";
        x.style.display = "block";
        x.style.animation = "fadeUp 0.75s ease-in";
    }
    else if(num == 2){
        x.style.display = "none";
        y.style.display = "block";
        y.style.animation = "fadeUp 0.75s ease-in";
    }
}

function changeVideo(num){
    var x = document.getElementById("video-tokyo");
    var y = document.getElementById("video-osaka");
    var z = document.getElementById("info-tokyo");
    var a = document.getElementById("info-osaka");
    var b = document.getElementById("places-tokyo");
    var c = document.getElementById("places-osaka");

    x.pause();
    y.pause();
    
    x.currentTime = 0;
    y.currentTime = 0;
    
    if(num == 1){  // Tokyo
        y.style.display = "none";
        a.style.display = "none";
        c.style.display = "none";
        x.style.display = "block";
        z.style.display = "block";
        x.style.animation = "fadeLeft 1s ease-in";
        z.style.animation = "fadeUp 1s ease-in";
    }
    else if(num == 2){
        x.style.display = "none";
        z.style.display = "none";
        b.style.display = "none";
        y.style.display = "block";
        a.style.display = "block";
        y.style.animation = "fadeLeft 1s ease-in";
        a.style.animation = "fadeUp 1s ease-in";
    // Osaka
    }
}

function selectVideoTokyo(num){
    x = document.getElementById("video-tokyo");

    switch(num){
        case 1: x.currentTime = 0; // Akihabara
                break;
        case 2: x.currentTime = 2 * 60 + 9; // Templo Senso-ji
                break;
        case 3: x.currentTime = 4 * 60 + 2; // Tokyo Tower
                break;
        case 4: x.currentTime = 6 * 60; // Cruce de Shibuya
                break;
    }
}

function selectVideoOsaka(num){
    x = document.getElementById("video-osaka");

    switch(num){
        case 1: x.currentTime = 0; // Dotonbori
                break;
        case 2: x.currentTime = 2 * 60 + 7; // Castillo Osaka
                break;
        case 3: x.currentTime = 4 * 60 + 12; // Shinsekai
                break;
        case 4: x.currentTime = 6 * 60 + 19; // Mercado Kuromon
                break;
    }
}