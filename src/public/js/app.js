// 전에는 sockets.push(socket)을 해야했지만 이제는 자동으로 연결된 socket을 추적
// socketio에는 이미 room 기능도 포함
const socket = io(); // io() 알아서 socket.io를 실행하는 서버 찾음

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
};

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
};

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // 특정한 event를 아무 이름으로 전송, object 전송도 가능. 여러개를 전송 가능
    // 함수(function) 역시 전송이 가능. 단, 끝날 때 실행되는 함수를 넣고싶을 경우, 꼭 argument의 마지막에 작성
    // 여기서 전송하고 server에서 받은 후 사용
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left`);
});

socket.on("new_message", addMessage);