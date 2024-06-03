// Script para el quiz multimodal usando Socket.io y manejar la comunicación entre el cliente y el servidor

    const socket = io();
    var connUser = document.getElementById("con-user");
    var form = document.getElementById("usernameForm");
    var input = document.getElementById("usernameInput");
    var roomsList = document.getElementById("rooms");
    var username;

    // Botones de unirse a sala
    var tokyoQuiz = document.querySelector(".tokyo-room-btn");
    var osakaQuiz = document.querySelector(".osaka-room-btn");
    var kyotoQuiz = document.querySelector(".kyoto-room-btn");
    var fukuokaQuiz = document.querySelector(".fukuoka-room-btn");

    // Numero de jugadores en la sala
    var nPlayersTokyo = document.getElementById("nPlayers-tokyo");
    var nPlayersOsaka = document.getElementById("nPlayers-osaka");
    var nPlayersKyoto = document.getElementById("nPlayers-kyoto");
    var nPlayersFukuoka = document.getElementById("nPlayers-fukuoka");

    // Jugadores en la sala
    var playersTokyo = document.getElementById("players-tokyo");
    var playersOsaka = document.getElementById("players-osaka");
    var playersKyoto = document.getElementById("players-kyoto");
    var playersFukuoka = document.getElementById("players-fukuoka");

    // Puntos de los jugadores
    var pointsTokyo = document.getElementById("points-tokyo");
    var pointsOsaka = document.getElementById("points-osaka");
    var pointsKyoto = document.getElementById("points-kyoto");
    var pointsFukuoka = document.getElementById("points-fukuoka");

    // Rondas
    var roundTokyo = document.getElementById("round-tokyo");
    var roundOsaka = document.getElementById("round-osaka");
    var roundKyoto = document.getElementById("round-kyoto");
    var roundFukuoka = document.getElementById("round-fukuoka");

    // Salas de juego
    var tokyoRoom = document.getElementById("tokyo-room");
    var osakaRoom = document.getElementById("osaka-room");
    var kyotoRoom = document.getElementById("kyoto-room");
    var fukuokaRoom = document.getElementById("fukuoka-room");

    var salas = [tokyoRoom, osakaRoom, kyotoRoom, fukuokaRoom];
    var nJugSalas = new Map();
    nJugSalas.set("Quiz de Tokyo", nPlayersTokyo);
    nJugSalas.set("Quiz de Osaka", nPlayersOsaka);
    nJugSalas.set("Quiz de Kyoto", nPlayersKyoto);
    nJugSalas.set("Quiz de Fukuoka", nPlayersFukuoka);

    var quizzes = new Map();
    quizzes.set("Quiz de Tokyo", tokyoRoom);
    quizzes.set("Quiz de Osaka", osakaRoom);
    quizzes.set("Quiz de Kyoto", kyotoRoom);
    quizzes.set("Quiz de Fukuoka", fukuokaRoom);

    var rounds = new Map();
    rounds.set("Quiz de Tokyo", roundTokyo);
    rounds.set("Quiz de Osaka", roundOsaka);
    rounds.set("Quiz de Kyoto", roundKyoto);
    rounds.set("Quiz de Fukuoka", roundFukuoka);

    var players = new Map();
    players.set("Quiz de Tokyo", playersTokyo);
    players.set("Quiz de Osaka", playersOsaka);
    players.set("Quiz de Kyoto", playersKyoto);
    players.set("Quiz de Fukuoka", playersFukuoka);

    var pointsRoom = new Map();
    pointsRoom.set("Quiz de Tokyo", pointsTokyo);
    pointsRoom.set("Quiz de Osaka", pointsOsaka);
    pointsRoom.set("Quiz de Kyoto", pointsKyoto);
    pointsRoom.set("Quiz de Fukuoka", pointsFukuoka);

    form.addEventListener("submit", function(e){
        e.preventDefault();
        username = input.value;

        connUser.append(`Te has registrado como ${username}`);

        connUser.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })

        form.style.display = "none";
    })

    tokyoQuiz.addEventListener("click", function(){
        if(!usernameInput.value){
            alert("¡Debes registrarte primero!");
            return;
        }
        showRoom(1);
        joinRoom("Quiz de Tokyo");
    })

    osakaQuiz.addEventListener("click", function(){
        if(!username){
            alert("¡Debes registrarte primero!");
            return;
        }
        showRoom(2);
        joinRoom("Quiz de Osaka");
    })

    kyotoQuiz.addEventListener("click", function(){
        if(!username){
            alert("¡Debes registrarte primero!");
            return;
        }
        showRoom(3);
        joinRoom("Quiz de Kyoto");
    })

    fukuokaQuiz.addEventListener("click", function(){
        if(!username){
            alert("¡Debes registrarte primero!");
            return;
        }
        showRoom(4);
        joinRoom("Quiz de Fukuoka");
    })


    socket.on("joinedRoom", (room) =>{
        alert(`Te has unido a la sala ${room}`);
    })

    socket.on("updateRoomCount", (data) =>{
        var nPlayers = nJugSalas.get(data.room);
        nPlayers.innerHTML = data.count;
    })

    socket.on("leftRoom", (data) => {
        var sala = quizzes.get(data.currentRoom);
        var jugador = sala.children[0].children[0].children[data.count];
        var nPlayers = nJugSalas.get(data.currentRoom);

        jugador.remove();

        alert(`El jugador ${data.playerName} ha abandonado la sala ${data.currentRoom}`);
        nPlayers.innerHTML = data.count;
    } )

    socket.on("error", (msg) => {
        var sala = quizzes.get(msg.room);
        sala.style.display = "none";
        alert(`Limite de jugadores superado: ${msg.count}`);
        return;
    })

    socket.on("newPlayer", (data) => {
        var jugadores = players.get(data.room);
        var puntos = pointsRoom.get(data.room);
        
        var connectedUsers = document.createElement("div");
        connectedUsers.append(data.playerName);

        var pointsUsers = document.createElement("div");
        pointsUsers.append(0);

        jugadores.append(connectedUsers);
        puntos.append(pointsUsers);

        alert(`Nuevo jugador en la sala ${data.room}: ${data.playerName}`);
    })

    socket.on("newQuestion", (data) =>{
        var sala = quizzes.get(data.room);
        var quiz = sala.children[0].children[1];
        var round = rounds.get(data.room);

        var questionsDiv = document.createElement("div");
        questionsDiv.style.display = "grid";
        questionsDiv.style.gridTemplateColumns ="repeat(2,1fr)"
        questionsDiv.style.gap = "0.1em";
        questionsDiv.style.justifyItems = "center";
        questionsDiv.style.alignItems = "center";
        questionsDiv.style.textAlign = "center";
        questionsDiv.style.marginTop = "1em";
        questionsDiv.id = data.round;

        var question = document.createElement("span");
        question.id = `question_${data.round}`;
        question.append(data.question);

        for(let i=0 ; i < data.options.length; i++){
            var optDiv = document.createElement("div");
            optDiv.style.width = "90%";
            optDiv.style.marginBottom = "0.5em";
            optDiv.style.backgroundColor = "white";
            optDiv.style.borderRadius = "2px"

            var option = document.createElement("input");
            option.type = "checkbox";
            option.style.appearance = "none";
            option.id = data.options[i]

            option.addEventListener("click", function(e){
                var options = document.querySelectorAll('input[type="checkbox"]');

                // El cliente envia su respuesta al servidor para que la procese
                socket.emit("sendAnswer", {answer: e.target.id,
                                           correctAnswer: data.correct,
                                           room: data.room,
                                           username : data.username});

                for(var i=0; i < options.length; i++){
                    options[i].disabled = true;
                }
            })

            var label = document.createElement("label")
            label.style.fontSize = "14px";
            label.style.cursor = "pointer";
            label.style.color = "black";
            label.innerHTML = data.options[i];

            label.appendChild(option);
            optDiv.appendChild(label);
            questionsDiv.appendChild(optDiv);
        }

        if(data.round != 0){
            setTimeout(function(){
                round.innerHTML = "";
                quiz.append(question);
                quiz.append(questionsDiv);
                round.append(data.round + 1 );
            }, 1000)
        }
        else{
            quiz.append(question);
            quiz.append(questionsDiv);
            round.append(data.round + 1);
        }

    })

    socket.on("checkAnswer", (data) =>{
        var option = document.getElementById(data.answer);
        var optDiv = document.getElementById(data.curRound);
        var question = document.getElementById(`question_${data.curRound}`);

        var points = data.points;
        var currentRound = data.curRound;
        console.log(currentRound)

        if(data.answer == data.correctAnswer){
            option.parentElement.parentElement.style.backgroundColor = "#4cf5c2";
            points++;

        }
        else{
            option.parentElement.parentElement.style.backgroundColor = "#df2b3f";
            var rightAnswer = document.createElement("p");
            rightAnswer.innerHTML = `Respuesta correcta: ${data.correctAnswer}`;
            rightAnswer.style.marginLeft = "0.55em"
            option.parentElement.parentElement.parentElement.parentElement.appendChild(rightAnswer);
        }

        setTimeout(function(){
            if(rightAnswer){
                rightAnswer.style.display = "none";
            }
            question.style.display = "none";
            optDiv.style.display = "none";
        }, 1000)

        
        // Ver si el jugador ha acabado la partida
        if(currentRound == 9){
            socket.emit("quizEnded", {room: data.room, username: data.username, points})
        }
        else{
            currentRound++;
            socket.emit("checkAnswer", {room: data.room, username: data.username, points, currentRound})
        }
    })

    socket.on("updateScore", (data) => {
        var pointsPlayer = pointsRoom.get(data.room);

        pointsPlayer.children[data.index + 1].innerHTML = "";
        pointsPlayer.children[data.index + 1].innerHTML = data.score;
    })

    socket.on("quizEnded", (data) => {
        alert(`El jugador ${data.username} ha finalizado en la sala ${data.room}`);
    })

    socket.on("showScore", (data) => {
        alert(`Tu puntuación es de ${data.score}. ¡Bien jugado!`);
    })

    function joinRoom(room){
        // El cliente envia una peticion de unirse a sala al servidor
        if(username){
            socket.emit('joinRoom', {room, username});
        }
    }

    function showQuiz(){
        var rooms = document.getElementById("rooms");
        rooms.style.display = "block";
        rooms.style.animation = "fadeUp 1s ease-in";
    }

    function showRoom(num){
        switch(num){
            case 1: if(salas[0].style.display == "none"){
                        salas[0].style.display = "block";
                        for(let i=1; i < salas.length - 1; i++){
                            salas[i].style.display = "none";
                        }
                    }
                    break;

            case 2: if(salas[1].style.display == "none"){
                        salas[1].style.display = "block";
                        for(let i=0; i < salas.length; i++){
                            if(i!=1){
                                salas[i].style.display = "none";
                            }
                        }
                    }
                    break;

            case 3:  if(salas[2].style.display == "none"){
                        salas[2].style.display = "block";
                        for(let i=0; i < salas.length; i++){
                            if(i!=2){
                                salas[i].style.display = "none";
                            }
                        }
                    }
                    break;

            case 4:  if(salas[3].style.display == "none"){
                        salas[3].style.display = "block";
                        for(let i=0; i < salas.length - 1; i++){
                            salas[i].style.display = "none";
                        }
                    }
                    break;
        }
    }

