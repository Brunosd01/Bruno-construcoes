/**
 * cameraSetup.js — Configuração da câmera com OrbitControls e limites.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA, BUILDING } from '../config.js';

/**
 * @param {THREE.WebGLRenderer} renderer
 * @returns {{ camera: THREE.PerspectiveCamera, controls: OrbitControls }}
 */
export function setupCamera(renderer) {
  const camera = new THREE.PerspectiveCamera(
    CAMERA.fov,
    window.innerWidth / window.innerHeight,
    CAMERA.near,
    CAMERA.far
  );

  const totalHeight = BUILDING.floors * BUILDING.floorHeight;
  const targetY = totalHeight * 0.4;

  // Posição inicial: de frente para a fachada frontal
  const frontZ = BUILDING.unitDepth / 2 + CAMERA.initialDistance;
  camera.position.set(0, targetY + CAMERA.initialAngleY * CAMERA.initialDistance, frontZ);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, targetY, 0);
  controls.enableDamping = true;
  controls.dampingFactor = CAMERA.orbitDamping;
  // Movimentação livre (pan) permitida
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.panSpeed = 1.0;

  // Zoom livre
  controls.minDistance = CAMERA.zoomMin;
  controls.maxDistance = CAMERA.zoomMax;

  // Limites polares
  controls.minPolarAngle = CAMERA.orbitMinPolar;
  controls.maxPolarAngle = CAMERA.orbitMaxPolar;

  // Órbita azimutal: livre se infinito
  if (isFinite(CAMERA.orbitMaxAzimuth)) {
    controls.minAzimuthAngle = -CAMERA.orbitMaxAzimuth;
    controls.maxAzimuthAngle = CAMERA.orbitMaxAzimuth;
  }

  // Auto-rotate
  controls.autoRotate = CAMERA.autoRotate;
  controls.autoRotateSpeed = CAMERA.autoRotateSpeed;

  // Suporte a movimentação por teclado (WASD / Setas / Q e E para subir/descer)
  const keys = { w: false, a: false, s: false, d: false, q: false, e: false };
  window.addEventListener('keydown', (ev) => {
    const k = ev.key.toLowerCase();
    if (k in keys) keys[k] = true;
    if (ev.key === 'ArrowUp') keys.w = true;
    if (ev.key === 'ArrowDown') keys.s = true;
    if (ev.key === 'ArrowLeft') keys.a = true;
    if (ev.key === 'ArrowRight') keys.d = true;
  });
  window.addEventListener('keyup', (ev) => {
    const k = ev.key.toLowerCase();
    if (k in keys) keys[k] = false;
    if (ev.key === 'ArrowUp') keys.w = false;
    if (ev.key === 'ArrowDown') keys.s = false;
    if (ev.key === 'ArrowLeft') keys.a = false;
    if (ev.key === 'ArrowRight') keys.d = false;
  });

  controls.updateKeyboard = (delta) => {
    if (!delta) return;
    const speed = 20 * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() > 0.001) forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, camera.up);
    if (right.lengthSq() > 0.001) right.normalize();

    if (keys.w) {
      camera.position.addScaledVector(forward, speed);
      controls.target.addScaledVector(forward, speed);
    }
    if (keys.s) {
      camera.position.addScaledVector(forward, -speed);
      controls.target.addScaledVector(forward, -speed);
    }
    if (keys.a) {
      camera.position.addScaledVector(right, -speed);
      controls.target.addScaledVector(right, -speed);
    }
    if (keys.d) {
      camera.position.addScaledVector(right, speed);
      controls.target.addScaledVector(right, speed);
    }
    if (keys.e) {
      camera.position.y += speed;
      controls.target.y += speed;
    }
    if (keys.q) {
      camera.position.y = Math.max(0.2, camera.position.y - speed);
      controls.target.y = Math.max(0.2, controls.target.y - speed);
    }
  };

  controls.update();

  return { camera, controls };
}
