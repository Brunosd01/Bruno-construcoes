/**
 * sky.js — Céu noturno com estrelas cintilantes e lua em linhas brancas.
 */

import * as THREE from 'three';
import { STARS, MOON, COLORS } from '../config.js';

/**
 * Cria as estrelas (Points) em uma esfera ao redor da cena.
 */
export function createStars(isLite = false) {
  const count = isLite ? STARS.countLite : STARS.count;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count); // Fases para cintilação

  for (let i = 0; i < count; i++) {
    // Distribuir na superfície de uma esfera
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = STARS.radius * (0.9 + Math.random() * 0.2);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    // Distribui o céu um pouco mais baixo para melhor enquadramento com a lua
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.65;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    sizes[i] = STARS.minSize + Math.random() * (STARS.maxSize - STARS.minSize);
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTwinkleSpeed: { value: STARS.twinkleSpeed },
      uBrightness: { value: STARS.brightness },
      uSizeScale: { value: STARS.sizeScale },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      uniform float uTwinkleSpeed;
      uniform float uSizeScale;
      varying float vAlpha;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = aSize * (uSizeScale / -mvPosition.z);

        // Cintilação
        float twinkle = sin(uTime * uTwinkleSpeed + aPhase) * 0.2 + 0.8;
        vAlpha = twinkle;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      uniform float uBrightness;

      void main() {
        // Ponto circular suave
        float dist = length(gl_PointCoord - 0.5);
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * uBrightness;
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  return points;
}

/**
 * Cria a lua em linhas brancas (contorno + crateras).
 */
export function createMoon() {
  const group = new THREE.Group();
  const { radius, position } = MOON;

  // Contorno circular da lua
  const moonCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
  const moonPoints = moonCurve.getPoints(64);
  const moonGeo = new THREE.BufferGeometry().setFromPoints(moonPoints);
  const moonMat = new THREE.LineBasicMaterial({
    color: COLORS.moonGlow,
    transparent: true,
    opacity: 0.85,
  });
  const moonLine = new THREE.Line(moonGeo, moonMat);
  group.add(moonLine);

  // Crateras (círculos menores)
  const craters = [
    { x: -1.5, y: 1.0, r: 1.2 },
    { x: 1.8, y: -0.5, r: 0.8 },
    { x: 0.3, y: -1.8, r: 1.0 },
    { x: -0.8, y: -0.3, r: 0.6 },
  ];

  const craterMat = new THREE.LineBasicMaterial({
    color: COLORS.moonGlow,
    transparent: true,
    opacity: 0.3,
  });

  for (const c of craters) {
    const curve = new THREE.EllipseCurve(c.x, c.y, c.r, c.r, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(32);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(geo, craterMat));
  }

  // Halo suave (sprite aditivo)
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(230,230,255,0.25)');
  gradient.addColorStop(0.5, 'rgba(230,230,255,0.05)');
  gradient.addColorStop(1, 'rgba(230,230,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const haloTex = new THREE.CanvasTexture(canvas);
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(radius * 4, radius * 4, 1);
  group.add(halo);

  // A lua sempre olha para a câmera (billboard)
  group.position.set(position.x, position.y, position.z);

  return { group, moonMat, halo, haloMat };
}
