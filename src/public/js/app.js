const socket = io(); // io() 알아서 socket.io를 실행하는 서버 찾음

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
// 음소거, 화면 켜짐 여부를 추적할 boolean 변수
let muted = false;
let cameraOff = false;

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

getMedia();

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
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);