let THREE;

const viewer = document.getElementById("viewer");
const dropHint = document.getElementById("dropHint");
const imageInput = document.getElementById("imageInput");
const resetButton = document.getElementById("resetButton");
const shotButton = document.getElementById("shotButton");
const fovInput = document.getElementById("fovInput");
const sizeSelect = document.getElementById("sizeSelect");
const statusText = document.getElementById("status");

loadThree();

async function loadThree() {
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js");
    initViewer();
  } catch (error) {
    console.error(error);
    setStatus("Three.jsの読み込みに失敗しました。ネット接続を確認してください");
  }
}

function initViewer() {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(Number(fovInput.value), 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x15181b);
viewer.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sphereGeometry = new THREE.SphereGeometry(500, 96, 64);
sphereGeometry.scale(-1, 1, 1);

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x2d3033 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

let yaw = 0;
let pitch = 0;
let activePointerId = null;
let dragStart = null;
let currentTexture = null;
let loadedFileName = "";

function resizeRenderer() {
  const width = Math.max(1, viewer.clientWidth);
  const height = Math.max(1, viewer.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  render();
}

function updateCamera() {
  const target = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    -Math.cos(yaw) * Math.cos(pitch)
  );

  camera.lookAt(target);
}

function render() {
  updateCamera();
  renderer.render(scene, camera);
}

function resetView() {
  yaw = 0;
  pitch = 0;
  camera.fov = Number(fovInput.value);
  camera.updateProjectionMatrix();
  render();
}

function setStatus(message) {
  statusText.textContent = message;
}

function loadImageFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setStatus("画像ファイルを選択してください");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const ratio = image.width / image.height;
    const ratioNote = Math.abs(ratio - 2) > 0.08 ? " / 2:1ではない可能性があります" : "";

    textureLoader.load(
      objectUrl,
      texture => {
        if (currentTexture) {
          currentTexture.dispose();
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        currentTexture = texture;
        sphereMaterial.map = texture;
        sphereMaterial.color.set(0xffffff);
        sphereMaterial.needsUpdate = true;

        loadedFileName = file.name.replace(/\.[^.]+$/, "");
        dropHint.classList.add("is-hidden");
        shotButton.disabled = false;
        resetView();
        setStatus(`${file.name} (${image.width} x ${image.height})${ratioNote}`);
        URL.revokeObjectURL(objectUrl);
      },
      undefined,
      () => {
        URL.revokeObjectURL(objectUrl);
        setStatus("画像の読み込みに失敗しました");
      }
    );
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    setStatus("画像の読み込みに失敗しました");
  };

  image.src = objectUrl;
}

function getScreenshotSize() {
  const value = sizeSelect.value;

  if (value === "viewport") {
    return {
      width: renderer.domElement.width,
      height: renderer.domElement.height,
    };
  }

  const [width, height] = value.split("x").map(Number);
  return { width, height };
}

function saveScreenshot() {
  if (!currentTexture) {
    return;
  }

  const originalPixelRatio = renderer.getPixelRatio();
  const originalSize = new THREE.Vector2();
  renderer.getSize(originalSize);
  const originalAspect = camera.aspect;
  const { width, height } = getScreenshotSize();

  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  render();

  renderer.domElement.toBlob(blob => {
    if (!blob) {
      setStatus("スクショ保存に失敗しました");
      restoreRenderer(originalPixelRatio, originalSize, originalAspect);
      return;
    }

    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.href = URL.createObjectURL(blob);
    link.download = `${loadedFileName || "panorama"}-${stamp}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setStatus(`スクショを保存しました (${width} x ${height})`);
    restoreRenderer(originalPixelRatio, originalSize, originalAspect);
  }, "image/png");
}

function restoreRenderer(pixelRatio, size, aspect) {
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(size.x, size.y, false);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  render();
}

function onPointerDown(event) {
  activePointerId = event.pointerId;
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    yaw,
    pitch,
  };
  viewer.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (event.pointerId !== activePointerId || !dragStart) {
    return;
  }

  const deltaX = event.clientX - dragStart.x;
  const deltaY = event.clientY - dragStart.y;
  yaw = dragStart.yaw - deltaX * 0.004;
  pitch = THREE.MathUtils.clamp(dragStart.pitch - deltaY * 0.004, -Math.PI / 2 + 0.02, Math.PI / 2 - 0.02);
  render();
}

function onPointerUp(event) {
  if (event.pointerId !== activePointerId) {
    return;
  }

  activePointerId = null;
  dragStart = null;
  viewer.releasePointerCapture(event.pointerId);
}

function onWheel(event) {
  event.preventDefault();
  const nextFov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.035, 35, 95);
  camera.fov = nextFov;
  fovInput.value = String(Math.round(nextFov));
  camera.updateProjectionMatrix();
  render();
}

imageInput.addEventListener("change", event => {
  loadImageFile(event.target.files[0]);
});

resetButton.addEventListener("click", resetView);
shotButton.addEventListener("click", saveScreenshot);

fovInput.addEventListener("input", () => {
  camera.fov = Number(fovInput.value);
  camera.updateProjectionMatrix();
  render();
});

viewer.addEventListener("pointerdown", onPointerDown);
viewer.addEventListener("pointermove", onPointerMove);
viewer.addEventListener("pointerup", onPointerUp);
viewer.addEventListener("pointercancel", onPointerUp);
viewer.addEventListener("wheel", onWheel, { passive: false });

viewer.addEventListener("dragover", event => {
  event.preventDefault();
});

viewer.addEventListener("drop", event => {
  event.preventDefault();
  loadImageFile(event.dataTransfer.files[0]);
});

window.addEventListener("resize", resizeRenderer);

resizeRenderer();
}
