/**
 * ground.js — Chão plano e calçada com postes e lixeira.
 */

import * as THREE from 'three';
import { BUILDING, COLORS, SIDEWALK, POSTS, TRASHCAN } from '../config.js';

/**
 * Cria o chão com fade-out sutil nas bordas.
 */
export function createGround() {
  const size = 120;
  const geo = new THREE.PlaneGeometry(size, size);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(COLORS.wireframe) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        // Fade-out nas bordas
        vec2 center = vUv - 0.5;
        float dist = length(center) * 2.0;
        float alpha = smoothstep(1.0, 0.3, dist) * 0.08;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  return ground;
}

/**
 * Cria a calçada em linhas (contorno + linhas transversais de placas).
 */
export function createSidewalk() {
  const group = new THREE.Group();
  const { width, length, height } = SIDEWALK;
  const frontZ = BUILDING.unitDepth / 2;

  const mat = new THREE.LineBasicMaterial({
    color: COLORS.wireframe,
    transparent: true,
    opacity: 0.5,
  });

  // Contorno da calçada (retângulo 3D elevado)
  const halfW = width / 2;
  const points = [
    new THREE.Vector3(-halfW, 0, frontZ),
    new THREE.Vector3(halfW, 0, frontZ),
    new THREE.Vector3(halfW, 0, frontZ + length),
    new THREE.Vector3(-halfW, 0, frontZ + length),
    new THREE.Vector3(-halfW, 0, frontZ),
    // Parte de cima do meio-fio
    new THREE.Vector3(-halfW, height, frontZ),
    new THREE.Vector3(halfW, height, frontZ),
    new THREE.Vector3(halfW, height, frontZ + length),
    new THREE.Vector3(-halfW, height, frontZ + length),
    new THREE.Vector3(-halfW, height, frontZ),
  ];
  const contourGeo = new THREE.BufferGeometry().setFromPoints(points);
  group.add(new THREE.Line(contourGeo, mat));

  // Arestas verticais do meio-fio
  const corners = [
    [-halfW, frontZ], [halfW, frontZ],
    [halfW, frontZ + length], [-halfW, frontZ + length],
  ];
  for (const [x, z] of corners) {
    const vertGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, z),
      new THREE.Vector3(x, height, z),
    ]);
    group.add(new THREE.Line(vertGeo, mat));
  }

  // Linhas transversais (placas de concreto)
  const slabCount = 5;
  for (let i = 1; i < slabCount; i++) {
    const z = frontZ + (length / slabCount) * i;
    const slabGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-halfW, height + 0.001, z),
      new THREE.Vector3(halfW, height + 0.001, z),
    ]);
    const slabMat = new THREE.LineBasicMaterial({
      color: COLORS.wireframe,
      transparent: true,
      opacity: 0.2,
    });
    group.add(new THREE.Line(slabGeo, slabMat));
  }

  return group;
}

/**
 * Cria um poste de luz em uma dada posição Z.
 * @param {number} side - Lado da calçada (-1 para esquerda, 1 para direita)
 * @param {number} zOffset - Distância para frente a partir da fachada (frontZ + zOffset)
 */
export function createPost(side = 1, zOffset = 3.0) {
  const group = new THREE.Group();
  const { height, armLength } = POSTS;
  const frontZ = BUILDING.unitDepth / 2;
  const x = POSTS.offsetX * side;

  const mat = new THREE.LineBasicMaterial({
    color: COLORS.wireframe,
    transparent: true,
    opacity: 0.65,
  });

  // Poste vertical
  const poleGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, height, 0),
  ]);
  group.add(new THREE.Line(poleGeo, mat));

  // Braço curvo (curva de Bézier apontando para dentro da calçada)
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, height, 0),
    new THREE.Vector3(0, height + 0.3, 0),
    new THREE.Vector3(-side * armLength, height - 0.2, 0),
  );
  const armPts = curve.getPoints(12);
  const armGeo = new THREE.BufferGeometry().setFromPoints(armPts);
  group.add(new THREE.Line(armGeo, mat));

  // Lâmpada (pequeno losango no topo com material próprio)
  const lampY = height - 0.2;
  const lampX = -side * armLength;
  const lampGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(lampX, lampY, 0),
    new THREE.Vector3(lampX - 0.1, lampY - 0.2, 0),
    new THREE.Vector3(lampX, lampY - 0.35, 0),
    new THREE.Vector3(lampX + 0.1, lampY - 0.2, 0),
    new THREE.Vector3(lampX, lampY, 0),
  ]);
  const lampMat = new THREE.LineBasicMaterial({
    color: 0xfff0d0,
    transparent: true,
    opacity: 0.95,
  });
  const lampLines = new THREE.Line(lampGeo, lampMat);
  group.add(lampLines);

  // Halo de luz (sprite)
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,240,208,0.5)');
  gradient.addColorStop(0.35, 'rgba(255,240,208,0.18)');
  gradient.addColorStop(0.7, 'rgba(255,240,208,0.04)');
  gradient.addColorStop(1, 'rgba(255,240,208,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const haloTex = new THREE.CanvasTexture(canvas);
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: COLORS.postLightIntensity,
  });
  const haloSprite = new THREE.Sprite(haloMat);
  haloSprite.scale.set(POSTS.haloRadius * 2, POSTS.haloRadius * 2, 1);
  haloSprite.position.set(lampX, lampY - 0.15, 0);
  group.add(haloSprite);

  // Posicionar o poste avançado para a frente da fachada
  group.position.set(x, 0, frontZ + zOffset);

  // Hitbox ampla: cobre tanto o mastro vertical quanto a cabeça com o halo de luz
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false,
    side: THREE.DoubleSide,
  });

  const poleHitbox = new THREE.Mesh(
    new THREE.CylinderGeometry(POSTS.hitboxRadius, POSTS.hitboxRadius, height, 8),
    hitMat
  );
  poleHitbox.position.set(0, height / 2, 0);

  const lampHitbox = new THREE.Mesh(
    new THREE.SphereGeometry(POSTS.lampHitboxRadius, 8, 8),
    hitMat
  );
  lampHitbox.position.set(lampX, lampY - 0.15, 0);

  const postObj = {
    group,
    haloMat,
    haloSprite,
    lampMat,
    lampLines,
    hitbox: poleHitbox,
    hitboxes: [poleHitbox, lampHitbox],
    on: true,
    side,
    zOffset,
  };

  poleHitbox.userData = { type: 'post', post: postObj, side, zOffset };
  lampHitbox.userData = { type: 'post', post: postObj, side, zOffset };
  group.add(poleHitbox);
  group.add(lampHitbox);

  return postObj;
}

/**
 * Cria todos os 3 pares de postes (6 postes no total) ao longo da calçada.
 */
export function createAllPosts() {
  const zOffsets = [2.5, 6.5, 10.5];
  const posts = [];
  zOffsets.forEach((zOff) => {
    posts.push(createPost(-1, zOff));
    posts.push(createPost(1, zOff));
  });
  return posts;
}

/**
 * Cria a lixeira verde em linhas.
 */
export function createTrashcan() {
  const group = new THREE.Group();
  const { width, height, depth } = TRASHCAN;
  const frontZ = BUILDING.unitDepth / 2;

  const mat = new THREE.LineBasicMaterial({
    color: COLORS.trashcan,
    transparent: true,
    opacity: 0.6,
  });

  // Corpo (caixa em linhas verdes)
  const bodyGeo = new THREE.BoxGeometry(width, height * 0.85, depth);
  const bodyEdges = new THREE.EdgesGeometry(bodyGeo);
  const bodyLines = new THREE.LineSegments(bodyEdges, mat);
  bodyLines.position.y = (height * 0.85) / 2;
  group.add(bodyLines);

  // Tampa (caixa fina que gira)
  const lidGeo = new THREE.BoxGeometry(width * 1.05, height * 0.08, depth * 1.05);
  const lidEdges = new THREE.EdgesGeometry(lidGeo);
  const lidLines = new THREE.LineSegments(lidEdges, mat.clone());

  // Pivô da tampa
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, height * 0.85, -depth / 2);
  lidLines.position.set(0, height * 0.04, depth / 2);
  lidPivot.add(lidLines);
  group.add(lidPivot);

  // Rodinhas (dois pequenos círculos)
  const wheelMat = new THREE.LineBasicMaterial({
    color: COLORS.trashcan,
    transparent: true,
    opacity: 0.4,
  });
  for (const side of [-1, 1]) {
    const curve = new THREE.EllipseCurve(0, 0, 0.08, 0.08, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(12);
    const wheelGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const wheel = new THREE.Line(wheelGeo, wheelMat);
    wheel.position.set(side * (width / 2 - 0.12), 0.08, depth / 2 - 0.05);
    group.add(wheel);
  }

  group.position.set(TRASHCAN.offsetX, 0, frontZ + 0.3);

  // Hitbox
  const hitGeo = new THREE.BoxGeometry(width * 1.5, height * 1.2, depth * 1.5);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(hitGeo, hitMat);
  hitbox.position.y = height / 2;
  hitbox.userData = { type: 'trashcan' };
  group.add(hitbox);

  return { group, lidPivot, hitbox, lidAngle: 0, targetLidAngle: 0, autoCloseTimer: null };
}
