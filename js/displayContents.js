// Script para las animaciones de display de la página

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

