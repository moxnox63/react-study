import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/")); // 이상한 주소가 들어오면 전부 home으로 redirect


// 같은 서버에서 http와 websocket을 동작시키기 위한 작업
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer); // http 서버에 socketio 얹어주기


wsServer.on("connection", socket => {
    socket["nickname"] = "Anon";
    // socket.onAny((event) => {
    //     console.log(`Socket Event: ${event}`);
    // })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); // join에 room이름을 작성
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    }); // socket.on("여기에 원하는 event를 넣어 처리")
    // socket.on("disconnecting", () => {
    //     socket.rooms.forEach((room) =>
    //  socket.to(room).emit("bye", socket.nickname));
    // });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done(); // 백엔드에서 작동 X...
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname);
});


/*
// Websocket

const wss = new WebSocket.Server({ server });
const sockets = []; // connections를 저장

// on connection, socket으로 즉시 'hello!'라는 메세지 전송
wss.on("connection", (socket) => { // connection을 통해 socket을 알아내고
    sockets.push(socket); // socket을 저장해두면 나중에 이것을 이용해 다른 browser에도 msg 전달 가능
    socket["nickname"] = "Anon";
    console.log("Connected to Browser💪");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`)); // sockets에 저장된 다른 socket에 msg 전달
                case "nickname":
                    socket["nickname"] = message.payload;
                }
            });
        });
*/

const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000, handleListen);