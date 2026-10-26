/**
 * building.js — Cria o prédio 3D em wireframe (somente arestas brancas).
 *
 * Estrutura: andares × apartamentos, porta no centro do térreo.
 * Cada apartamento tem hitbox invisível para raycasting.
 */

import * as THREE from 'three';
import { BUILDING, COLORS } from '../config.js';

/**
 * Cria e retorna o grupo do prédio com todas as arestas e hitboxes.
 * @returns {{ group: THREE.Group, apartments: Map<string, object> }}
 *   apartments: Map de "andar-posição" → { mesh, edges, hitbox, floor, position }
 */
export function createBuilding() {
  const group = new THREE.Group();
  const apartments = new Map();

  const {
    floors, unitsPerFloor, floorHeight, unitWidth, unitDepth,
    doorWidth, doorHeight
  } = BUILDING;

  const totalWidth = unitsPerFloor * unitWidth;
  const totalHeight = floors * floorHeight;

  // Material de linhas brancas
  const lineMat = new THREE.LineBasicMaterial({
    color: COLORS.wireframe,
    transparent: true,
    opacity: COLORS.wireframeOpacity,
  });

  // Material de hitbox invisível
  const hitboxMat = new THREE.MeshBasicMaterial({
    visible: false,
    side: THREE.DoubleSide,
  });

  // ─── Contorno externo do prédio ────────────────────────────
  const outerGeo = new THREE.BoxGeometry(totalWidth, totalHeight, unitDepth);
  const outerEdges = new THREE.EdgesGeometry(outerGeo);
  const outerLines = new THREE.LineSegments(outerEdges, lineMat);
  outerLines.position.set(0, totalHeight / 2, 0);
  group.add(outerLines);

  // ─── Linhas de andar (pisos horizontais) ───────────────────
  for (let f = 1; f <= floors; f++) {
    const y = f * floorHeight;
    const points = [
      new THREE.Vector3(-totalWidth / 2, y, -unitDepth / 2),
      new THREE.Vector3(totalWidth / 2, y, -unitDepth / 2),
      new THREE.Vector3(totalWidth / 2, y, unitDepth / 2),
      new THREE.Vector3(-totalWidth / 2, y, unitDepth / 2),
      new THREE.Vector3(-totalWidth / 2, y, -unitDepth / 2),
    ];
    const floorLineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const floorLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(totalWidth, unitDepth)),
      lineMat
    );
    floorLine.rotation.x = -Math.PI / 2;
    floorLine.position.y = y;
    // Use the polyline instead for cleaner look
    const polyLine = new THREE.Line(floorLineGeo, lineMat);
    group.add(polyLine);
  }

  // ─── Divisórias verticais entre apartamentos (fachada frontal) ───
  const frontZ = unitDepth / 2;
  for (let u = 1; u < unitsPerFloor; u++) {
    const x = -totalWidth / 2 + u * unitWidth;
    const points = [
      new THREE.Vector3(x, 0, frontZ),
      new THREE.Vector3(x, totalHeight, frontZ),
    ];
    const divGeo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(divGeo, lineMat));
  }

  // ─── Divisórias verticais (fachada traseira) ───
  const backZ = -unitDepth / 2;
  for (let u = 1; u < unitsPerFloor; u++) {
    const x = -totalWidth / 2 + u * unitWidth;
    const points = [
      new THREE.Vector3(x, 0, backZ),
      new THREE.Vector3(x, totalHeight, backZ),
    ];
    const divGeo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(divGeo, lineMat));
  }

  // ─── Apartamentos (janelas na fachada frontal + hitboxes) ──
  for (let f = 1; f <= floors; f++) {
    for (let u = 1; u <= unitsPerFloor; u++) {
      const x = -totalWidth / 2 + (u - 0.5) * unitWidth;
      const y = (f - 0.5) * floorHeight;
      const key = `${f}-${u}`;

      // Janela (retângulo recuado na fachada)
      const winW = unitWidth * 0.6;
      const winH = floorHeight * 0.55;
      const winGeo = new THREE.PlaneGeometry(winW, winH);
      const winEdges = new THREE.EdgesGeometry(winGeo);
      const winLines = new THREE.LineSegments(winEdges, lineMat.clone());
      winLines.position.set(x, y, frontZ + 0.01);
      winLines.userData = { type: 'window', key, floor: f, position: u };
      group.add(winLines);

      // Hitbox invisível para raycasting
      const hitGeo = new THREE.PlaneGeometry(unitWidth * 0.9, floorHeight * 0.85);
      const hitbox = new THREE.Mesh(hitGeo, hitboxMat);
      hitbox.position.set(x, y, frontZ + 0.05);
      hitbox.userData = { type: 'apartment', key, floor: f, position: u };
      group.add(hitbox);

      // Luz interior (desligada por padrão)
      const glowGeo = new THREE.PlaneGeometry(winW * 0.95, winH * 0.95);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(x, y, frontZ + 0.005);
      group.add(glow);

      apartments.set(key, {
        winLines,
        hitbox,
        glow,
        glowMat,
        floor: f,
        position: u,
        x, y,
        lit: false,
        color: null,
        targetOpacity: 0,
        currentOpacity: 0,
        morador: null,
      });
    }
  }

  // ─── Porta (centro do térreo) ──────────────────────────────
  const doorGeo = new THREE.PlaneGeometry(doorWidth, doorHeight);
  const doorEdges = new THREE.EdgesGeometry(doorGeo);
  const doorLines = new THREE.LineSegments(doorEdges, lineMat.clone());
  doorLines.position.set(0, doorHeight / 2, frontZ + 0.01);
  doorLines.userData = { type: 'door' };
  group.add(doorLines);

  // Hitbox da porta
  const doorHitGeo = new THREE.PlaneGeometry(doorWidth * 1.1, doorHeight * 1.1);
  const doorHitbox = new THREE.Mesh(doorHitGeo, hitboxMat.clone());
  doorHitbox.position.set(0, doorHeight / 2, frontZ + 0.05);
  doorHitbox.userData = { type: 'door' };
  group.add(doorHitbox);

  return { group, apartments, doorLines, doorHitbox, totalWidth, totalHeight };
}
