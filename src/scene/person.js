/**
 * person.js — Pessoinha em linhas brancas (stick figure simples).
 *
 * Uma geometria base compartilhada, instanciada para cada morador.
 * Billboard no eixo Y para sempre encarar a câmera.
 */

import * as THREE from 'three';
import { PERSON, BUILDING } from '../config.js';

/**
 * Cria a geometria base da pessoinha (linhas).
 * Retorna um BufferGeometry com segmentos de linha.
 */
function createPersonGeometry() {
  const h = BUILDING.floorHeight * PERSON.heightRatio;
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
      new THREE.Vector3(headCx + Math.cos(a2) * headR, headCy + Math.sin(a2) * headR, 0),
    );
  }

  // Pescoço → corpo
  points.push(
    new THREE.Vector3(0, neckY, 0),
    new THREE.Vector3(0, bodyY, 0),
  );

  // Braços
  points.push(
    new THREE.Vector3(-armW, armY - h * 0.12, 0),
    new THREE.Vector3(0, armY, 0),
  );
  points.push(
    new THREE.Vector3(0, armY, 0),
    new THREE.Vector3(armW, armY - h * 0.12, 0),
  );

  // Pernas
  points.push(
    new THREE.Vector3(-legW, 0, 0),
    new THREE.Vector3(0, bodyY, 0),
  );
  points.push(
    new THREE.Vector3(0, bodyY, 0),
    new THREE.Vector3(legW, 0, 0),
  );

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return geo;
}

/**
 * Cria uma pessoinha posicionada dentro de um apartamento.
 *
 * @param {number} x — posição X do centro do apartamento
 * @param {number} floorIndex — número do andar (1-based)
 * @param {string} color — cor da luz (#hex)
 * @param {number} phase — fase da animação de respiração (0–2π)
 * @returns {{ group: THREE.Group, lineMesh: THREE.LineSegments, glow: THREE.Sprite }}
 */
export function createPerson(x, floorIndex, color, phase = 0) {
  const group = new THREE.Group();

  const geo = createPersonGeometry();
  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,    // Começa invisível (fade-in)
  });
  const lineMesh = new THREE.LineSegments(geo, mat);
  group.add(lineMesh);

  // Brilho ao redor da pessoinha (cor do morador)
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const col = new THREE.Color(color);
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
  gradient.addColorStop(0.6, `rgba(${r},${g},${b},0.05)`);
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
  const personH = BUILDING.floorHeight * PERSON.heightRatio;
  glow.scale.set(personH * 2, personH * 2, 1);
  glow.position.y = personH * 0.5;
  group.add(glow);

  // Posicionar no apartamento
  const y = (floorIndex - 1) * BUILDING.floorHeight + 0.05;
  const frontZ = BUILDING.unitDepth / 2 - 0.2;
  group.position.set(x, y, frontZ);

  group.userData = {
    phase,
    time: 0,
    targetOpacity: 0,
    currentOpacity: 0,
    mat,
    glowMat,
  };

  return { group, lineMesh, glow };
}
