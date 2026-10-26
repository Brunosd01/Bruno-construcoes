/**
 * person.js — Moradores em linhas brancas (pessoinhas em diferentes atividades).
 *
 * Suporta três poses:
 * - 'computer': bixinho mexendo no computador / mesa de trabalho
 * - 'bed': bixinho deitado confortavelmente na cama
 * - 'standing': pessoinha em pé contemplando a janela
 *
 * Billboard suave para encarar a câmera e brilho na cor de luz do morador.
 */

import * as THREE from 'three';
import { PERSON, BUILDING } from '../config.js';

/**
 * Cria a geometria da pessoinha em pé.
 */
function createStandingGeometry(h) {
  const headR = h * 0.15;
  const neckY = h - headR * 2;
  const bodyY = h * 0.4;
  const armY = neckY - h * 0.05;
  const armW = h * 0.22;
  const legW = h * 0.15;

  const points = [];

  // Cabeça (círculo em segmentos)
  const headSegs = 16;
  const headCx = 0;
  const headCy = h - headR;
  for (let i = 0; i < headSegs; i++) {
    const a1 = (i / headSegs) * Math.PI * 2;
    const a2 = ((i + 1) / headSegs) * Math.PI * 2;
    points.push(
      new THREE.Vector3(headCx + Math.cos(a1) * headR, headCy + Math.sin(a1) * headR, 0),
      new THREE.Vector3(headCx + Math.cos(a2) * headR, headCy + Math.sin(a2) * headR, 0)
    );
  }

  // Pescoço → corpo
  points.push(
    new THREE.Vector3(0, neckY, 0),
    new THREE.Vector3(0, bodyY, 0)
  );

  // Braços
  points.push(
    new THREE.Vector3(-armW, armY - h * 0.12, 0),
    new THREE.Vector3(0, armY, 0),
    new THREE.Vector3(0, armY, 0),
    new THREE.Vector3(armW, armY - h * 0.12, 0)
  );

  // Pernas
  points.push(
    new THREE.Vector3(-legW, 0, 0),
    new THREE.Vector3(0, bodyY, 0),
    new THREE.Vector3(0, bodyY, 0),
    new THREE.Vector3(legW, 0, 0)
  );

  return new THREE.BufferGeometry().setFromPoints(points);
}

/**
 * Cria a geometria do bixinho mexendo no computador.
 */
function createComputerGeometry(h) {
  const points = [];

  // 1. Mesa de trabalho
  points.push(
    // Tampo da mesa
    new THREE.Vector3(-0.45, h * 0.44, 0),
    new THREE.Vector3(0.42, h * 0.44, 0),
    // Perna esquerda
    new THREE.Vector3(-0.40, h * 0.44, 0),
    new THREE.Vector3(-0.40, 0, 0),
    // Perna direita
    new THREE.Vector3(0.38, h * 0.44, 0),
    new THREE.Vector3(0.38, 0, 0)
  );

  // 2. Computador / Monitor & Teclado
  points.push(
    // Base do monitor
    new THREE.Vector3(0.06, h * 0.44, 0),
    new THREE.Vector3(0.28, h * 0.44, 0),
    // Haste
    new THREE.Vector3(0.17, h * 0.44, 0),
    new THREE.Vector3(0.17, h * 0.52, 0),
    // Tela retangular
    new THREE.Vector3(0.06, h * 0.52, 0),
    new THREE.Vector3(0.30, h * 0.52, 0),
    new THREE.Vector3(0.30, h * 0.52, 0),
    new THREE.Vector3(0.30, h * 0.80, 0),
    new THREE.Vector3(0.30, h * 0.80, 0),
    new THREE.Vector3(0.06, h * 0.80, 0),
    new THREE.Vector3(0.06, h * 0.80, 0),
    new THREE.Vector3(0.06, h * 0.52, 0),
    // Teclado
    new THREE.Vector3(-0.16, h * 0.45, 0),
    new THREE.Vector3(0.02, h * 0.45, 0)
  );

  // 3. Cadeira
  points.push(
    // Assento
    new THREE.Vector3(-0.38, h * 0.30, 0),
    new THREE.Vector3(-0.12, h * 0.30, 0),
    // Encosto
    new THREE.Vector3(-0.38, h * 0.30, 0),
    new THREE.Vector3(-0.38, h * 0.65, 0),
    // Pés da cadeira
    new THREE.Vector3(-0.35, h * 0.30, 0),
    new THREE.Vector3(-0.35, 0, 0),
    new THREE.Vector3(-0.15, h * 0.30, 0),
    new THREE.Vector3(-0.15, 0, 0)
  );

  // 4. Bixinho sentado
  const headR = h * 0.12;
  const headCx = -0.18;
  const headCy = h * 0.74;
  const headSegs = 14;
  for (let i = 0; i < headSegs; i++) {
    const a1 = (i / headSegs) * Math.PI * 2;
    const a2 = ((i + 1) / headSegs) * Math.PI * 2;
    points.push(
      new THREE.Vector3(headCx + Math.cos(a1) * headR, headCy + Math.sin(a1) * headR, 0),
      new THREE.Vector3(headCx + Math.cos(a2) * headR, headCy + Math.sin(a2) * headR, 0)
    );
  }

  // Tronco inclinado para frente (focado na tela)
  points.push(
    new THREE.Vector3(-0.18, h * 0.62, 0),
    new THREE.Vector3(-0.24, h * 0.30, 0)
  );

  // Braços digitando no teclado
  points.push(
    new THREE.Vector3(-0.20, h * 0.50, 0),
    new THREE.Vector3(-0.05, h * 0.46, 0)
  );

  // Pernas sentadas (coxa horizontal, panturrilha vertical)
  points.push(
    new THREE.Vector3(-0.24, h * 0.30, 0),
    new THREE.Vector3(-0.06, h * 0.30, 0),
    new THREE.Vector3(-0.06, h * 0.30, 0),
    new THREE.Vector3(-0.06, 0, 0)
  );

  return new THREE.BufferGeometry().setFromPoints(points);
}

/**
 * Cria a geometria do bixinho deitado na cama.
 */
function createBedGeometry(h) {
  const points = [];

  // 1. Cama
  points.push(
    // Cabeceira (esquerda)
    new THREE.Vector3(-0.62, 0, 0),
    new THREE.Vector3(-0.62, h * 0.48, 0),
    // Peseira (direita)
    new THREE.Vector3(0.62, 0, 0),
    new THREE.Vector3(0.62, h * 0.26, 0),
    // Estrutura / colchão
    new THREE.Vector3(-0.62, h * 0.18, 0),
    new THREE.Vector3(0.62, h * 0.18, 0),
    // Pés
    new THREE.Vector3(-0.58, h * 0.18, 0),
    new THREE.Vector3(-0.58, 0, 0),
    new THREE.Vector3(0.58, h * 0.18, 0),
    new THREE.Vector3(0.58, 0, 0),
    // Travesseiro
    new THREE.Vector3(-0.56, h * 0.28, 0),
    new THREE.Vector3(-0.34, h * 0.28, 0),
    new THREE.Vector3(-0.56, h * 0.18, 0),
    new THREE.Vector3(-0.56, h * 0.28, 0),
    new THREE.Vector3(-0.34, h * 0.18, 0),
    new THREE.Vector3(-0.34, h * 0.28, 0),
    // Coberta aconchegante
    new THREE.Vector3(-0.18, h * 0.26, 0),
    new THREE.Vector3(0.60, h * 0.26, 0),
    new THREE.Vector3(-0.18, h * 0.18, 0),
    new THREE.Vector3(-0.18, h * 0.26, 0)
  );

  // 2. Bixinho deitado
  const headR = h * 0.11;
  const headCx = -0.44;
  const headCy = h * 0.29;
  const headSegs = 14;
  for (let i = 0; i < headSegs; i++) {
    const a1 = (i / headSegs) * Math.PI * 2;
    const a2 = ((i + 1) / headSegs) * Math.PI * 2;
    points.push(
      new THREE.Vector3(headCx + Math.cos(a1) * headR, headCy + Math.sin(a1) * headR, 0),
      new THREE.Vector3(headCx + Math.cos(a2) * headR, headCy + Math.sin(a2) * headR, 0)
    );
  }

  // Corpo estendido sob a coberta
  points.push(
    new THREE.Vector3(-0.33, h * 0.22, 0),
    new THREE.Vector3(0.48, h * 0.22, 0)
  );

  // Braço relaxado por cima da coberta
  points.push(
    new THREE.Vector3(-0.24, h * 0.22, 0),
    new THREE.Vector3(-0.06, h * 0.26, 0)
  );

  return new THREE.BufferGeometry().setFromPoints(points);
}

/**
 * Cria um morador (bixinho) com pose e atividade definida dentro do apartamento.
 *
 * @param {number} x — posição X do centro do apartamento
 * @param {number} floorIndex — número do andar (1-based)
 * @param {string} color — cor da luz (#hex)
 * @param {number} phase — fase da animação de respiração (0–2π)
 * @param {'standing' | 'computer' | 'bed' | 'auto'} activity — pose do morador
 * @returns {{ group: THREE.Group, lineMesh: THREE.LineSegments, glow: THREE.Sprite, floorIndex: number }}
 */
export function createPerson(x, floorIndex, color, phase = 0, activity = 'auto') {
  const group = new THREE.Group();
  const h = BUILDING.floorHeight * PERSON.heightRatio;

  // Determinar atividade caso seja auto
  let act = activity;
  if (act === 'auto') {
    if (floorIndex % 3 === 1) act = 'computer';
    else if (floorIndex % 3 === 2) act = 'bed';
    else act = 'standing';
  }

  let geo;
  if (act === 'computer') {
    geo = createComputerGeometry(h);
  } else if (act === 'bed') {
    geo = createBedGeometry(h);
  } else {
    geo = createStandingGeometry(h);
  }

  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0, // Começa invisível (fade-in)
  });
  const lineMesh = new THREE.LineSegments(geo, mat);
  group.add(lineMesh);

  // Brilho ao redor do morador (na cor da luz)
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const col = new THREE.Color(color);
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
  gradient.addColorStop(0.6, `rgba(${r},${g},${b},0.08)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const glowTex = new THREE.CanvasTexture(canvas);
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(h * 2.2, h * 2.2, 1);
  glow.position.y = h * 0.45;
  group.add(glow);

  // Posicionamento no apartamento
  const baseY = (floorIndex - 1) * BUILDING.floorHeight + 0.05;
  const frontZ = BUILDING.unitDepth / 2 - 0.25;
  group.position.set(x, baseY, frontZ);

  group.userData = {
    activity: act,
    phase,
    time: 0,
    targetOpacity: 0,
    currentOpacity: 0,
    mat,
    glowMat,
    baseY,
    update: (time, delta) => {
      group.userData.time += delta;
      const t = group.userData.time;
      if (act === 'computer') {
        // Leve movimento de digitar e balançar a cabeça
        const bob = Math.sin(t * 3.5 + phase) * 0.012;
        group.position.y = baseY + bob;
      } else if (act === 'bed') {
        // Respiração suave ao dormir
        const heave = Math.sin(t * 1.2 + phase) * 0.01;
        group.position.y = baseY + heave;
      } else {
        // Respiração em pé
        const breathe = Math.sin(t * PERSON.breatheSpeed + phase) * PERSON.breatheAmount;
        group.position.y = baseY + breathe;
      }
    },
  };

  return { group, lineMesh, glow, floorIndex };
}
