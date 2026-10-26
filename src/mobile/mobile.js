/**
 * mobile.js — Detecção de toque, câmera fixa e zoom no apartamento.
 */

import { MOBILE, BUILDING } from '../config.js';

/**
 * Detecta se o dispositivo é de toque (pointer: coarse).
 */
export function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches
    || window.matchMedia('(hover: none)').matches;
}

/**
 * Observa mudanças de modo (ex: girar aparelho com teclado conectado).
 */
export function watchTouchMode(callback) {
  const mq = window.matchMedia('(pointer: coarse)');
  mq.addEventListener('change', () => callback(isTouchDevice()));
}

/**
 * Configura câmera fixa para celular: enquadra o prédio inteiro.
 */
export function setupMobileCamera(camera, controls) {
  const totalHeight = BUILDING.floors * BUILDING.floorHeight;
  const totalWidth = BUILDING.unitsPerFloor * BUILDING.unitWidth;
  const aspect = window.innerWidth / window.innerHeight;

  // Calcular distância necessária para enquadrar tudo
  const fovRad = (camera.fov * Math.PI) / 180;
  const heightDist = (totalHeight * 1.4) / (2 * Math.tan(fovRad / 2));
  const widthDist = (totalWidth * 1.2) / (2 * Math.tan(fovRad / 2) * aspect);
  const dist = Math.max(heightDist, widthDist);

  camera.position.set(0, totalHeight * 0.45, BUILDING.unitDepth / 2 + dist);
  camera.lookAt(0, totalHeight * 0.4, 0);

  if (controls) {
    controls.enabled = false;
  }
}

/**
 * Classe para gerenciar o zoom no apartamento no celular.
 */
export class MobileZoom {
  constructor(camera, apartments, nameOverlay) {
    this.camera = camera;
    this.apartments = apartments;
    this.nameOverlay = nameOverlay;
    this.zoomed = false;
    this.zoomedKey = null;
    this.originalPos = camera.position.clone();
    this.originalTarget = null;
    this.animating = false;
    this.progress = 0;
    this.targetPos = null;
    this.targetLookAt = null;
  }

  /**
   * Zoom em um apartamento.
   */
  zoomTo(key) {
    const apt = this.apartments.get(key);
    if (!apt || !apt.lit) return;

    this.zoomedKey = key;
    this.zoomed = true;
    this.animating = true;
    this.progress = 0;

    // Salvar posição original
    if (!this.originalTarget) {
      this.originalPos = this.camera.position.clone();
      const totalHeight = BUILDING.floors * BUILDING.floorHeight;
      this.originalTarget = { x: 0, y: totalHeight * 0.4, z: 0 };
    }

    // Posição zoom: próxima ao apartamento
    const frontZ = BUILDING.unitDepth / 2;
    this.targetPos = {
      x: apt.x,
      y: apt.y,
      z: frontZ + 6,
    };
    this.targetLookAt = { x: apt.x, y: apt.y, z: 0 };

    // Mostrar nome
    this.nameOverlay.show(apt.morador?.nome || '', apt.x, apt.y);
  }

  /**
   * Voltar ao enquadramento original.
   */
  zoomOut() {
    if (!this.zoomed) return;
    this.zoomed = false;
    this.animating = true;
    this.progress = 0;

    this.targetPos = {
      x: this.originalPos.x,
      y: this.originalPos.y,
      z: this.originalPos.z,
    };
    this.targetLookAt = this.originalTarget;

    this.nameOverlay.hide();
  }

  /**
   * Atualizar a cada frame.
   */
  update(dt) {
    if (!this.animating) return;

    this.progress += dt / (MOBILE.zoomDuration / 1000);
    const t = easeInOutCubic(Math.min(1, this.progress));

    this.camera.position.x += (this.targetPos.x - this.camera.position.x) * t;
    this.camera.position.y += (this.targetPos.y - this.camera.position.y) * t;
    this.camera.position.z += (this.targetPos.z - this.camera.position.z) * t;

    if (this.progress >= 1) {
      this.animating = false;
      if (!this.zoomed) {
        this.zoomedKey = null;
        this.originalTarget = null;
      }
    }
  }
}

/**
 * Overlay para nome dentro do apartamento (mobile).
 */
export class MobileNameOverlay {
  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'mobile-name-overlay';
    this.el.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 600;
      color: white;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 0.1em;
      text-align: center;
      opacity: 0;
      transition: opacity 0.4s ease;
      text-shadow: 0 0 10px rgba(255,255,255,0.3);
    `;
    container.appendChild(this.el);
  }

  show(name) {
    this.el.textContent = name;
    this.el.style.opacity = '1';
    // Position will be updated each frame
  }

  hide() {
    this.el.style.opacity = '0';
  }

  updatePosition(x, y) {
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y + 20}px`;
    this.el.style.transform = 'translateX(-50%)';
  }

  dispose() {
    this.el.remove();
  }
}

// Easing
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
