import "./style.css";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";

// 定数の定義
const CANVAS_SELECTOR = "#webgl";
const BACKGROUND_TEXTURE = "./scene-bg.jpg";
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;
const INITIAL_CAMERA_POSITION = { x: 0, y: 1, z: 10 };
const BOX_GEOMETRY_SIZE = { width: 5, height: 5, depth: 5, segments: 10 };
const TORUS_GEOMETRY_PARAMS = { radius: 8, tube: 2, radialSegments: 16, tubularSegments: 100 };
const SCROLL_ANIMATION_RANGES = {
  range1: { start: 0, end: 40 },
  range2: { start: 40, end: 60 },
  range3: { start: 60, end: 80 },
  range4: { start: 80, end: 101 },
};

// サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// CanvasとSceneのセットアップ
const canvas = document.querySelector(CANVAS_SELECTOR);
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(BACKGROUND_TEXTURE);

// Cameraのセットアップ
const camera = new THREE.PerspectiveCamera(CAMERA_FOV, sizes.width / sizes.height, CAMERA_NEAR, CAMERA_FAR);
camera.position.set(INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z);
scene.add(camera);

// Rendererのセットアップ
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Postprocessingセットアップ
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);

// オブジェクトの作成関数
const createBox = () => {
  const geometry = new THREE.BoxGeometry(
    BOX_GEOMETRY_SIZE.width,
    BOX_GEOMETRY_SIZE.height,
    BOX_GEOMETRY_SIZE.depth,
    BOX_GEOMETRY_SIZE.segments
  );
  const textureLoader = new THREE.TextureLoader();
  const textures = [
    textureLoader.load("./diamondpushup.jpg"),
    textureLoader.load("./latissimustraining2.jpg"),
    textureLoader.load("./tex1.jpg"),
    textureLoader.load("./tex2.jpg"),
    textureLoader.load("./tex3.jpg"),
    textureLoader.load("./2020.1.29-1.jpg"),
  ];
  const materials = textures.map(
    (texture) => new THREE.MeshBasicMaterial({ map: texture })
  );

  const box = new THREE.Mesh(geometry, materials);
  box.position.set(0, 0.5, -15);
  box.rotation.set(1, 1, 0);
  return box;
};

const createTorus = () => {
  const geometry = new THREE.TorusGeometry(
    TORUS_GEOMETRY_PARAMS.radius,
    TORUS_GEOMETRY_PARAMS.tube,
    TORUS_GEOMETRY_PARAMS.radialSegments,
    TORUS_GEOMETRY_PARAMS.tubularSegments
  );
  const material = new THREE.MeshNormalMaterial();
  const torus = new THREE.Mesh(geometry, material);
  torus.position.set(0, 1, 10);
  return torus;
};

const box = createBox();
const torus = createTorus();
scene.add(box, torus);

const createImagePlane = () => {
  const texture = textureLoader.load('./last.jpg', (loadedTexture) => {
    const aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
    const planeHeight = 10;
    const planeWidth = planeHeight * aspectRatio;

    imagePlane.scale.set(planeWidth, planeHeight, 1);
  });

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 0);
  plane.visible = false;
  return plane;
};

const imagePlane = createImagePlane();
scene.add(imagePlane);

// 線形補間関数
const lerp = (x, y, a) => (1 - a) * x + a * y;

// 補間率計算
const scalePercent = (start, end) => (scrollPercent - start) / (end - start);

// スクロールアニメーション設定
const animationScripts = [
  {
    start: SCROLL_ANIMATION_RANGES.range1.start,
    end: SCROLL_ANIMATION_RANGES.range1.end,
    function() {
      camera.lookAt(box.position);
      camera.position.set(INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z);
      box.position.z = lerp(-15, 2, scalePercent(SCROLL_ANIMATION_RANGES.range1.start, SCROLL_ANIMATION_RANGES.range1.end));
      torus.position.z = lerp(10, -20, scalePercent(SCROLL_ANIMATION_RANGES.range1.start, SCROLL_ANIMATION_RANGES.range1.end));
      box.visible = true;
      torus.visible = true;
      imagePlane.visible = false;
    },
  },
  {
    start: SCROLL_ANIMATION_RANGES.range2.start,
    end: SCROLL_ANIMATION_RANGES.range2.end,
    function() {
      camera.lookAt(box.position);
      box.rotation.z = lerp(2, Math.PI, scalePercent(SCROLL_ANIMATION_RANGES.range2.start, SCROLL_ANIMATION_RANGES.range2.end));
      box.visible = true;
      torus.visible = true;
      imagePlane.visible = false;
    },
  },
  {
    start: SCROLL_ANIMATION_RANGES.range3.start,
    end: SCROLL_ANIMATION_RANGES.range3.end,
    function() {
      camera.lookAt(box.position);
      camera.position.x = lerp(0, -15, scalePercent(SCROLL_ANIMATION_RANGES.range3.start, SCROLL_ANIMATION_RANGES.range3.end));
      camera.position.y = lerp(1, 15, scalePercent(SCROLL_ANIMATION_RANGES.range3.start, SCROLL_ANIMATION_RANGES.range3.end));
      camera.position.z = lerp(10, 25, scalePercent(SCROLL_ANIMATION_RANGES.range3.start, SCROLL_ANIMATION_RANGES.range3.end));
      box.visible = true;
      torus.visible = true;
      imagePlane.visible = false;
    },
  },
  {
    start: SCROLL_ANIMATION_RANGES.range4.start,
    end: SCROLL_ANIMATION_RANGES.range4.end,
    function() {
      camera.lookAt(imagePlane.position);
      camera.position.set(0, 0, 10);
      box.visible = false;
      torus.visible = false;
      imagePlane.visible = true;
    },
  },
];

// スクロールアニメーション処理
let scrollPercent = 0;

document.body.onscroll = () => {
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
    100;
};

const playScrollAnimation = () => {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent < animation.end) {
      animation.function();
    }
  });
};

// アニメーション
const tick = () => {
  playScrollAnimation();
  composer.render();
  window.requestAnimationFrame(tick);
};
tick();

// リサイズ対応
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  composer.setSize(sizes.width, sizes.height);
});

// スクロール初期化
window.scrollTo({ top: 0, behavior: "smooth" });
