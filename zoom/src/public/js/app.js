const socket = io(); // io() 알아서 socket.io를 실행하는 서버 찾음

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
// 음소거, 화면 켜짐 여부를 추적할 boolean 변수
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
    try {
        // 컴퓨터에 연결된 장치들을 확인하는 함수
        const devices = await navigator.mediaDevices.enumerateDevices();
        // 연결된 장치 중 카메라만(device.kind === "videoinput") 선별
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        // 여기가 좀 신기함
        // 위의 cameras 목록의 camera를 가져오고
        // option 태그를 생성해준 후 각 카메라의 id와 이름을 담아서 선택지(option)로 추가(appendChild)
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label == camera.label) {
                option.selected = true;
            }; // stream의 현재 카메라를 알려줌
            camerasSelect.appendChild(option);
        });
    } catch (e) {
        console.log(e);
    }
};

async function getMedia(deviceId) {
    // deviceId가 없는 경우
    const initialConstaraints = {
        audio: true,
        video: { facingMode: "user" },
    };
    // deviceId를 정해준 경우
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };

    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstaraints
        );
        myStream.srcObject = myStream;
        if (!deviceId) {
            await getCameras();
        }
        await getCameras();
    } catch (e) {
        console.log(e);
    }
};

function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if (!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    };
}

function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if (cameraOff) {
        cameraBtn.innerText = "Turn camera off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn camera on";
        cameraOff = true;
    }
};

// 여러 카메라 handling
async function handleCameraChange() {
    await getMedia(camerasSelect.value);
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
            .getSenders() // sender는 peer로 보내진 media stream track을 컨트롤
            .find(sender => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
    }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

// 기존의 방 입력 form은 hide하고
// 회의방은 보이도록
async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value); // 회의방에 들어감
    roomName = input.value;
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// offer를 주고 받기 위해서는 서버가 필요..
// Socket Code
// localdescription & remotedescription

socket.on("welcome", async () => {
    // 다른 브라우저가 참석할 수 있도록 '초대장'을 만드는 것..(흠..?)
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName); // 다른 브라우저를 초대..roomName으로 초대
});

socket.on("offer", async (offer) => {
    console.log("received the offer")
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer); // answer로 응답
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
});

socket.on("answer", answer => {
    console.log("received the answer");
    myPeerConnection.setLocalDescription(answer);
});

// RTC code

function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        // google의 stun 서버 사용...
        // 하지만 실제 애플리케이션 제작을 위해서는 개인의 stun server 사용 필요
        // stun 서버는 본인의 장치에 공용 주소를 알려주는 서버임
        // 그래야 다른 네트워크에 있는 기기가 서로를 find
        // 그니까...공용 주소를 알아내기 위해 stun server를 사용!!
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ]
            }
        ]
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream)); // video와 audio tracks를 connection에 입력
}

socket.on("ice", ice => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
});

function handleIce(data) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
};

function handleAddStream(data) {
    const peersFace = document.getElementById("peersFace");
    peersFace.srcObject = data.stream;
};