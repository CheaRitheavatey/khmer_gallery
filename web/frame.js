const camera = document.getElementById('camera');

let posZ = 0;      // forward/back
let rotY = 0;      // turn left/right
let rotX = 0;      // look up/down

// Mouse movement controls rotation
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;

  rotY = x * 60; // rotate up to 60 degrees
  rotX = -y * 30; // look up/down
  updateCamera();
});

// Keyboard movement (W/S)
document.addEventListener('keydown', (e) => {
  if (e.key === 'w' || e.key === 'ArrowUp') posZ += 10;
  if (e.key === 's' || e.key === 'ArrowDown') posZ -= 10;
  updateCamera();
});

function updateCamera() {
  camera.style.transform = `
    rotateX(${rotX}deg)
    rotateY(${rotY}deg)
    translateZ(${posZ}px)
  `;
}
