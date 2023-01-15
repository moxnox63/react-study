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


const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000, handleListen);