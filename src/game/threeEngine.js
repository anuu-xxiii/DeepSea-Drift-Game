// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — 3D WebGL Engine (Three.js)
//  Continuous side coral reef walls, lane-blocking reefs,
//  fish shoals, 3D player, Bruce the Shark, and lighting.
// ─────────────────────────────────────────────

import * as THREE from 'three';
import {
  LANE_CENTERS,
  LANE_WIDTH,
  PLAYER_Y,
  SHARK_FOLLOW_Y,
  SHARK_ATTACK_Y,
  DIVE_SCALE,
  GIANT_SCALE,
  PALETTE,
} from './constants.js';

export function createThreeScene(canvas) {
  // ── 1. Renderer ────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setSize(canvas.width, canvas.height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ── 2. Scene & Fog ─────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#020914');
  scene.fog = new THREE.FogExp2('#04162c', 0.0018);

  // ── 3. High-Angle Camera ───────────────────────
  const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 1, 2000);
  // High-angle position looking down the endless trench
  camera.position.set(CANVAS_W_3D / 2, 620, 520);
  camera.lookAt(CANVAS_W_3D / 2, 280, -400);

  // ── 4. Lights ──────────────────────────────────
  const ambientLight = new THREE.AmbientLight('#0d5c75', 1.4);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight('#00f5d4', 2.2);
  sunLight.position.set(CANVAS_W_3D / 2, 800, 200);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  // ── 5. Trench Floor & Tracks ───────────────────
  const floorGeo = new THREE.PlaneGeometry(800, 3000);
  const floorMat = new THREE.MeshStandardMaterial({
    color: '#04162c',
    roughness: 0.8,
    metalness: 0.2,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(CANVAS_W_3D / 2, -40, -500);
  floor.receiveShadow = true;
  scene.add(floor);

  // ── 6. Continuous Side Coral Reef Walls ────────
  const leftWallGroup = new THREE.Group();
  const rightWallGroup = new THREE.Group();
  scene.add(leftWallGroup);
  scene.add(rightWallGroup);

  const wallMat = new THREE.MeshStandardMaterial({
    color: '#083344',
    roughness: 0.7,
    emissive: '#042f2e',
    emissiveIntensity: 0.4,
  });

  // Build continuous coral reef blocks along the sides
  for (let z = -1200; z <= 1200; z += 180) {
    // Left Coral Reef Wall Block
    const leftReef = createReefBlockMesh(wallMat, true);
    leftReef.position.set(LANE_CENTERS_3D[0] - 130, 0, z);
    leftWallGroup.add(leftReef);

    // Right Coral Reef Wall Block
    const rightReef = createReefBlockMesh(wallMat, false);
    rightReef.position.set(LANE_CENTERS_3D[2] + 130, 0, z);
    rightWallGroup.add(rightReef);
  }

  // ── 7. Dynamic Entities Containers ─────────────
  const playerMeshGroup = create3DPlayerMesh();
  scene.add(playerMeshGroup);

  const sharkMeshGroup = create3DSharkMesh();
  scene.add(sharkMeshGroup);

  const activeObstacleMeshes = new Map();
  const activeCollectibleMeshes = new Map();
  const activePowerupMeshes = new Map();

  return {
    renderer,
    scene,
    camera,
    leftWallGroup,
    rightWallGroup,
    playerMeshGroup,
    sharkMeshGroup,
    activeObstacleMeshes,
    activeCollectibleMeshes,
    activePowerupMeshes,
  };
}

const CANVAS_W_3D = 480;
const LANE_CENTERS_3D = [125, 240, 355];

function createReefBlockMesh(material, isLeft) {
  const group = new THREE.Group();

  // Base Coral Rock Base
  const baseGeo = new THREE.DodecahedronGeometry(65 + Math.random() * 20, 1);
  const baseMesh = new THREE.Mesh(baseGeo, material);
  baseMesh.scale.set(1, 1.6, 1.2);
  group.add(baseMesh);

  // Bioluminescent Coral Spikes / Anemones
  const spikeMat = new THREE.MeshStandardMaterial({
    color: isLeft ? '#f97316' : '#c084fc',
    emissive: isLeft ? '#ea580c' : '#a855f7',
    emissiveIntensity: 0.8,
    roughness: 0.4,
  });

  for (let i = 0; i < 4; i++) {
    const spikeGeo = new THREE.ConeGeometry(14, 55, 6);
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(
      (Math.random() - 0.5) * 40,
      20 + Math.random() * 30,
      (Math.random() - 0.5) * 40
    );
    spike.rotation.z = (Math.random() - 0.5) * 0.5;
    group.add(spike);
  }

  return group;
}

function create3DPlayerMesh() {
  const group = new THREE.Group();

  // Body Ellipsoid
  const bodyGeo = new THREE.SphereGeometry(22, 16, 16);
  bodyGeo.scale(0.8, 0.6, 1.4);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#00f5d4',
    emissive: '#0284c7',
    emissiveIntensity: 0.6,
    roughness: 0.3,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  group.add(body);

  // Glowing Fin
  const finGeo = new THREE.ConeGeometry(10, 24, 4);
  const finMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
  const fin = new THREE.Mesh(finGeo, finMat);
  fin.position.set(0, 14, -6);
  fin.rotation.x = -0.5;
  group.add(fin);

  return group;
}

function create3DSharkMesh() {
  const group = new THREE.Group();

  // Shark Body
  const bodyGeo = new THREE.ConeGeometry(32, 110, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.5,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI / 2;
  group.add(body);

  // Dorsal Fin
  const finGeo = new THREE.ConeGeometry(12, 38, 4);
  const fin = new THREE.Mesh(finGeo, bodyMat);
  fin.position.set(0, 24, 0);
  group.add(fin);

  return group;
}

export function create3DSchoolOfFishMesh() {
  const group = new THREE.Group();
  const fishMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#00f5d4',
    emissiveIntensity: 0.9,
  });

  // Create a shoal of 8 small swimming fish
  for (let i = 0; i < 8; i++) {
    const fGeo = new THREE.ConeGeometry(6, 20, 4);
    const fish = new THREE.Mesh(fGeo, fishMat);
    fish.rotation.x = Math.PI / 2;
    fish.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 40
    );
    group.add(fish);
  }

  return group;
}
