// Script para las animaciones de display de la página y la muestra de contenido (Curiosidades, Quiz) en función 
// del vídeo mediante metadatos almacenados en ficheros VTT

document.addEventListener("DOMContentLoaded", function(){

    localStorage.setItem("contador", 0);

    var vidTokyo = document.getElementById("video-tokyo");
    var vidOsaka = document.getElementById("video-osaka");
    var chapterName = document.querySelector(".chapter-name");
    var btnTokyo = document.getElementById("tokyo-tour");
    var btnOsaka = document.getElementById("osaka-tour");

    // Tracks
    var factsOsaka = document.getElementById("facts-osaka");
    var factsTokyo = document.getElementById("facts-tokyo");
    var quizOsaka = document.getElementById("quiz-osaka");
    var quizTokyo = document.getElementById("quiz-tokyo");

    // Contenedores
    var divFactsOsaka = document.getElementById("curiosidades-osaka");
    var divFactsTokyo = document.getElementById("curiosidades-tokyo");
    var divQuizOsaka = document.getElementById("preguntas-osaka");
    var divQuizTokyo = document.getElementById("preguntas-tokyo");
    var infoOsaka = document.getElementById("info-osaka");
    var infoTokyo = document.getElementById("info-tokyo");
    var cardsTokyo = document.getElementById("cards-tokyo");
    var cardsOsaka = document.getElementById("cards-osaka");
    var respCorrectas = document.getElementById("preguntas-correctas");
    
    //Para las capturas
    var canvasT = document.getElementById("canvasTokyo");
    var canvasO = document.getElementById("canvasOsaka");
    var captureBtn = document.getElementById("captureBtn");
    var captureContainer = document.getElementById("captureContainer");
    var capturedImage = document.getElementById("capturedImage");
    var timeoutId;
    
    captureBtn.addEventListener("click", function () {
        //VIDEO DE TOKYO
        if (vidOsaka.style.display == "none") {
            var context = canvasT.getContext("2d");
            canvasT.width = vidTokyo.videoWidth;
            canvasT.height = vidTokyo.videoHeight;
            context.drawImage(vidTokyo, 0, 0, canvasT.width, canvasT.height);
            var dataURL = canvasT.toDataURL("image/png");
            capturedImage.src = dataURL;
            captureContainer.style.display = "block";
            //Se reinicia el contador
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                captureContainer.style.display = "none";
            }, 5000); 
        }
        else {
            //VIDEO DE OSAKA
            var context = canvasO.getContext("2d");
            canvasO.width = vidOsaka.videoWidth;
            canvasO.height = vidOsaka.videoHeight;
            context.drawImage(vidOsaka, 0, 0, canvasO.width, canvasO.height);
            var dataURL = canvasO.toDataURL("image/png");
            capturedImage.src = dataURL;
            captureContainer.style.display = "block";
            //Se reinicia el contador
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                captureContainer.style.display = "none";
            }, 5000); 
        }
    });

    btnTokyo.addEventListener("click", function(){
        factsTokyo.addEventListener('cuechange', factsCueChangeTokyo);
        divFactsOsaka.style.display = "none";
        vidTokyo.currentTime = 0;
        console.log(vidTokyo.currentTime)
    })

    btnOsaka.addEventListener("click", function(){
        factsOsaka.addEventListener('cuechange', factsCueChangeOsaka);
        divFactsTokyo.style.display = "none";
        vidOsaka.currentTime = 0;
        console.log(vidOsaka.currentTime)
    })

    function factsCueChangeTokyo(){
        var activeCues = this.track.activeCues[0];
        if(activeCues){
             console.log(activeCues);
            for(var i=0; i < this.track.cues.length; i++){
                if(this.track.cues[i].id != ""){
                    chooseChapter((this.track.cues[i].id - 1), this.track.cues[i].startTime, cardsTokyo, vidTokyo);
                }
            }
            var cuetext = JSON.parse(this.track.activeCues[0].text);
    
            if(cuetext.hasOwnProperty("desc")){
                displayFacts(cuetext, divFactsTokyo, infoTokyo);
            }
            else if(cuetext.hasOwnProperty("title")){
                displayChapter(cuetext, infoTokyo, chapterName)
                divFactsTokyo.style.display = "none";
            }
        }
    }
    
    function factsCueChangeOsaka(){
        var activeCues = this.track.activeCues[0];
        if(activeCues){
            console.log(activeCues);
            for(var i=0; i < this.track.cues.length; i++){
                if(this.track.cues[i].id != ""){
                    chooseChapter((this.track.cues[i].id - 1), this.track.cues[i].startTime, cardsOsaka, vidOsaka);
                }
            }
            var cuetext = JSON.parse(this.track.activeCues[0].text);

            if(cuetext.hasOwnProperty("desc")){
                displayFacts(cuetext, divFactsOsaka, infoOsaka);
            }
            else if(cuetext.hasOwnProperty("title")){
                displayChapter(cuetext, infoOsaka, chapterName)
                divFactsOsaka.style.display = "none";
            }
        }
    }

    quizTokyo.addEventListener("cuechange", function(){
        if(this.track.activeCues[0]){
            displayQuiz(JSON.parse(this.track.activeCues[0].text), divQuizTokyo, vidTokyo, infoTokyo);
        }
        else{
            infoTokyo.style.display = "block";
            divQuizTokyo.style.display = "none";
        }
    })

    quizOsaka.addEventListener("cuechange", function(){
        if(this.track.activeCues[0]){
            displayQuiz(JSON.parse(this.track.activeCues[0].text), divQuizOsaka, vidOsaka, infoOsaka);
        }
        else{
            infoOsaka.style.display = "block";
            divQuizOsaka.style.display = "none";
        }
    })

    vidTokyo.addEventListener("ended", function(){
        infoTokyo.style.display = "none";
        var correctas = document.createElement("h2");
        correctas.innerHTML = "Has acertado " + localStorage.getItem("contador") + " preguntas";
        correctas.color = "white";
        respCorrectas.appendChild(correctas);
    })

    vidOsaka.addEventListener("ended", function(){
        infoOsaka.style.display = "none";
        var correctas = document.createElement("h2");
        correctas.innerHTML = "Has acertado " + localStorage.getItem("contador") + " preguntas";
        correctas.color = "white";
        respCorrectas.appendChild(correctas);
    })
})




function showCards(){
    var x = document.getElementById("cards");
    if(x.style.opacity == "0"){
        x.style.opacity = "1";
        x.style.animation = "fadeUp 0.75s ease-in";
    }
}

function displayChapter(data, x, y){
    x.style.display = "block";
    y.innerHTML = data.title;

    var map = x.querySelector(".gmap_iframe");
    map.setAttribute("src", data.map);
    
}

function chooseChapter(id, startTime, cards, vid){
    var card = cards.children[id];
    card.addEventListener("click", function(){
        if(id == 0){
            vid.currentTime = startTime;
        } else{
            vid.currentTime = startTime + 1;
        }
    })
}

function displayFacts(data, x, y){
    x.innerHTML= "";
    y.style.display = "none";
    
    var title = document.createElement("h2");
    title.innerHTML = "¿Sabías qué? &#129300;";
    title.style.marginBottom = "0.5em";

    var desc = document.createElement("h5");
    desc.innerHTML = data.desc;
    desc.style.marginBottom = "0.75em";

    var moreText = document.createElement("p");
    moreText.innerHTML = data.addText;

    var image = document.createElement("img");
    image.src = data.image;
    image.style.width = "45%";
    image.style.height = "45%";
    image.style.marginLeft = "22%";
    image.style.marginTop = "1em";
    image.style.borderRadius = "10px";
    image.style.boxShadow = "0 0 10px white";
    
    x.appendChild(title);
    x.appendChild(desc);
    x.appendChild(moreText);
    x.appendChild(image);
    x.style.animation = "fadeUp 1s ease-in";
    x.style.display = "block";
}

function displayQuiz(data, x, y, z){
    var playBtn = document.querySelector(".play-btn i");

    x.innerHTML = "";
    y.pause();
    y.style.filter = "brightness(40%)";
    playBtn.classList.replace("fa-pause", "fa-play");
    z.style.display = "none";

    var question = document.createElement("h3");
    question.innerHTML = data.question;
    question.style.marginBottom = "1em";
    x.appendChild(question);

    var questionsDiv = document.createElement("div");
    questionsDiv.style.display = "grid";
    questionsDiv.style.gridTemplateRows ="auto auto auto auto";
    questionsDiv.style.gridTemplateColumns ="auto"
    questionsDiv.style.justifyItems = "center"; 
    questionsDiv.style.alignItems = "center"; 
    questionsDiv.style.textAlign = "center";

    for(var i=0; i < data.answers.length; i++){
        var optDiv = document.createElement("div");
        optDiv.style.width = "50%";
        optDiv.style.marginBottom = "2em";
        optDiv.style.backgroundColor = "white";
        optDiv.style.borderRadius = "2px"

        var option = document.createElement("input");
        option.type = "checkbox";
        option.style.appearance = "none";
        option.id = i;

        option.addEventListener("click", function(e){
            var options = document.querySelectorAll('input[type="checkbox"]');

            if(data.correct == e.target.id){
                (e.target.parentElement).parentElement.style.backgroundColor = "#4cf5c2";
                let count = parseInt(localStorage.getItem("contador"));
                localStorage.setItem("contador", count + 1)
            }
            else{
                (e.target.parentElement).parentElement.style.backgroundColor = "#df2b3f";
                var rightAnswer = document.createElement("p");
                rightAnswer.innerHTML = "Respuesta correcta: "+ options[data.correct].parentElement.innerHTML;
                x.appendChild(rightAnswer);
            }

            for(var i=0; i < options.length; i++){
                options[i].disabled = true;
            }

            y.play();
            y.style.filter = "none";
            playBtn.classList.replace("fa-play", "fa-pause");

            setTimeout(function() {
                x.style.display = "none";
            }, 3000);
        })

        var label = document.createElement("label")
        label.style.fontSize = "20px";
        label.style.cursor = "pointer";
        label.style.color = "black";
        label.innerHTML = data.answers[i];

        label.appendChild(option);
        optDiv.appendChild(label);
        questionsDiv.appendChild(optDiv);
    }
    x.appendChild(questionsDiv);

    x.style.animation = "fadeUp 1s ease-in";
    x.style.display = "block";
}
