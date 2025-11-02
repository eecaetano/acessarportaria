const video = document.getElementById('video');
const status = document.getElementById('status');

async function startVideo() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch(err) {
    alert("Erro ao acessar a câmera: " + err);
  }
}

async function registerUser() {
  const username = document.getElementById('username').value;
  if (!username) return alert("Digite o nome do usuário!");

  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detections) return alert("Rosto não detectado, tente novamente.");

  const faceData = detections.descriptor;
  await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, descriptor: Array.from(faceData) })
  });

  alert("Usuário cadastrado com sucesso!");
}

async function recognizeFace() {
  const response = await fetch('/users');
  const users = await response.json();

  const displaySize = { width: video.width, height: video.height };

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const labeledDescriptors = users.map(user => 
      new faceapi.LabeledFaceDescriptors(user.username, user.descriptors.map(d => new Float32Array(d)))
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    resizedDetections.forEach(detection => {
      const match = faceMatcher.findBestMatch(detection.descriptor);
      if (match.label !== 'unknown') {
        status.innerText = `USUÁRIO RECONHECIDO: NOME: ${match.label}; Entrada autorizada!`;
        new Audio('/sounds/success.mp3').play();
      }
    });
  }, 1000);
}

document.getElementById('registerBtn').addEventListener('click', registerUser);

startVideo().then(recognizeFace);
