const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const MAX_SIZE = 4;

const port = 80;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const questions_files = {
    'Quiz de Tokyo' : "public/assets/JSON/tokyo-quiz.json",
    'Quiz de Osaka' : "public/assets/JSON/osaka-quiz.json",
    'Quiz de Kyoto' : "public/assets/JSON/kyoto-quiz.json",
    'Quiz de Fukuoka' : "public/assets/JSON/fukuoka-quiz.json"
}

const roomSize = {
    'Quiz de Tokyo': 0,
    'Quiz de Osaka': 0,
    'Quiz de Kyoto': 0,
    'Quiz de Fukuoka': 0
};

const playersPoints = {
    'Quiz de Tokyo': {
        users : [],
        points : [],
        currentRound: []
    },
    'Quiz de Osaka': {
        users : [],
        points : [],
        currentRound: []
    },
    'Quiz de Kyoto': {
        users : [],
        points : [],
        currentRound: []
    },
    'Quiz de Fukuoka': {
        users : [],
        points : [],
        currentRound: []
    },
};

//var currentRound = parseInt(localStorage.getItem("currentRound"));

app.use(express.static('public'));


io.on('connection', (socket) => {
    const numPlayers = io.engine.clientsCount;
    console.log("Se ha conectado un usuario con id="+socket.id+". Jugadores = "+numPlayers);
  
    // Gestión petición cliente de unirse a la sala por parte del servidor
    socket.on("joinRoom", ({room, username}) => {

        // Comprobar si el cliente ha salido de una sala para entrar en otra
        if(roomSize[room] == MAX_SIZE){
            socket.emit("error", {count: roomSize[room], room});
        } else{
            const questions = JSON.parse(fs.readFileSync(questions_files[room], "utf-8"));
            const currentRoom = Array.from(socket.rooms).find(r  => r !== socket.id);
            if(currentRoom){
                roomSize[currentRoom]--;
                socket.leave(currentRoom);
                io.emit("leftRoom", {playerName: username, currentRoom, count: roomSize[currentRoom]});
            }

            roomSize[room]++;
            // Añadimos el usuario, su puntuacion y ronda inicial
            playersPoints[room].users.push(username);
            playersPoints[room].points.push(0);
            playersPoints[room].currentRound.push(0);

            const user_index = playersPoints[room].users.indexOf(username);
            console.log(user_index); // Añadir a evento cuando usuario envia su respuesta

            // Unir al cliente a la sala
            socket.join(room);
            //socket.room = room;
            socket.emit("joinedRoom", room);
            io.emit('newPlayer', { playerName: username, room });

            // Enviar la primera pregunta a la sala
            socket.emit("newQuestion", {question: questions.questions[0].question, 
                                        options: questions.questions[0].options, 
                                        correct: questions.questions[0].correct_answer,
                                        round: playersPoints[room].currentRound[user_index],
                                        room, username});

            // Actualizar numero de clientes en la sala
            io.emit("updateRoomCount" , {room, count: roomSize[room]});
        }
    })

    // Gestión envío de respuesta del quiz del cliente al servidor
    socket.on("sendAnswer", ({answer, correctAnswer, room, username})  => {
        console.log(`${answer}, ${correctAnswer}, ${room}`);
        const questions = JSON.parse(fs.readFileSync(questions_files[room], "utf-8"));
        const user_index = playersPoints[room].users.indexOf(username);

        try{
            socket.emit("checkAnswer", {answer, correctAnswer, room, username, 
                                        points: playersPoints[room].points[user_index],
                                        curRound: playersPoints[room].currentRound[user_index]});
        }catch(err){
            console.log(err);
        }
        

    })

    // Gestión comprobación de respuesta del cliente
    socket.on("checkAnswer", ({room, username, points, currentRound})  => {
        const questions = JSON.parse(fs.readFileSync(questions_files[room], "utf-8"));
        const user_index = playersPoints[room].users.indexOf(username);

        // Actualizamos puntuaciones y ronda
        playersPoints[room].points[user_index] = points;
        playersPoints[room].currentRound[user_index] = currentRound;
        var curRound = playersPoints[room].currentRound[user_index];

        console.log(`${playersPoints[room].points}, ${playersPoints[room].currentRound}`)

        // Servidor envia al cliente la siguiente pregunta
        if(curRound != 10){
            socket.emit("newQuestion", {question: questions.questions[curRound].question, 
            options: questions.questions[curRound].options, 
            correct: questions.questions[curRound].correct_answer,
            round: curRound, room, username});
        }

        // Actualizar puntuaciones
        io.emit("updateScore", {score: points, index: user_index, room});
    })

    // Gestión fin de partida 
    socket.on("quizEnded", ({room, username, points}) => {
        // Notificar a todos los jugadores que un jugador ha finalizado
        io.emit("quizEnded", {room, username});
        
        // Enviar puntuacion al jugador
        socket.emit("showScore", {score: points});
        console.log(points);
    } )

    socket.on("disconnect", () => {
        roomSize[socket.room]--;
        console.log("El usuario se ha desconectado. Jugadores = "+numPlayers);
    } )
});

server.listen(port, () => {
console.log(`Example app listening on port
${port}`);
});




