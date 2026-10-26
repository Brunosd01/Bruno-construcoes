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
  controls.enablePan = false;

  // Limites de zoom
  controls.minDistance = CAMERA.zoomMin;
  controls.maxDistance = CAMERA.zoomMax;

  // Limites polares (não ir abaixo do chão nem reto para cima)
  controls.minPolarAngle = CAMERA.orbitMinPolar;
  controls.maxPolarAngle = CAMERA.orbitMaxPolar;

  // Limites azimutais (frente ±80°)
  controls.minAzimuthAngle = -CAMERA.orbitMaxAzimuth;
  controls.maxAzimuthAngle = CAMERA.orbitMaxAzimuth;

  // Auto-rotate
  controls.autoRotate = CAMERA.autoRotate;
  controls.autoRotateSpeed = CAMERA.autoRotateSpeed;

  controls.update();

  return { camera, controls };
}
