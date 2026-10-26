/**
 * building.js — Cria o prédio 3D em wireframe (somente arestas brancas).
 *
 * Estrutura: andares × apartamentos, fachada com janelas e entrada unificada no térreo.
 * O prédio exibe apenas as arestas do volume externo para um visual limpo e encorpado.
 * No 1º andar, as janelas centrais se unem em uma fachada envidraçada integrada à porta.
 * Janelas selecionadas contam com cortinas delicadas em linhas.
 * Cada quarto possui uma luminária pendente de teto em linhas brancas e halo de luz.
 */

import * as THREE from 'three';
import { BUILDING, COLORS } from '../config.js';

/**
 * Cria cortinas em linhas brancas para uma janela.
 * @param {number} winW - Largura da janela
 * @param {number} winH - Altura da janela
 * @param {THREE.Material} lineMat - Material base de linha
 * @returns {THREE.LineSegments}
 */
function createCurtains(winW, winH, lineMat) {
  const points = [];
  const halfW = winW / 2;
  const halfH = winH / 2;

  // Trilho superior da cortina
  points.push(
    new THREE.Vector3(-halfW - 0.05, halfH + 0.03, 0),
    new THREE.Vector3(halfW + 0.05, halfH + 0.03, 0)
  );

  // Cortina esquerda (drapeado e abraçadeira)
  const leftGatherX = -halfW + 0.12;
  const gatherY = 0;
  // Borda externa
  points.push(
    new THREE.Vector3(-halfW + 0.03, halfH, 0),
    new THREE.Vector3(leftGatherX, gatherY, 0),
    new THREE.Vector3(leftGatherX, gatherY, 0),
    new THREE.Vector3(-halfW + 0.18, -halfH, 0)
  );
  // Dobra interna
  points.push(
    new THREE.Vector3(-halfW + winW * 0.38, halfH, 0),
    new THREE.Vector3(leftGatherX + 0.08, gatherY, 0),
    new THREE.Vector3(leftGatherX + 0.08, gatherY, 0),
    new THREE.Vector3(-halfW + 0.28, -halfH, 0)
  );
  // Abraçadeira / laço
  points.push(
    new THREE.Vector3(-halfW, gatherY + 0.03, 0),
    new THREE.Vector3(leftGatherX + 0.1, gatherY - 0.02, 0)
  );

  // Cortina direita (drapeado e abraçadeira)
  const rightGatherX = halfW - 0.12;
  // Borda externa
  points.push(
    new THREE.Vector3(halfW - 0.03, halfH, 0),
    new THREE.Vector3(rightGatherX, gatherY, 0),
    new THREE.Vector3(rightGatherX, gatherY, 0),
    new THREE.Vector3(halfW - 0.18, -halfH, 0)
  );
  // Dobra interna
  points.push(
    new THREE.Vector3(halfW - winW * 0.38, halfH, 0),
    new THREE.Vector3(rightGatherX - 0.08, gatherY, 0),
    new THREE.Vector3(rightGatherX - 0.08, gatherY, 0),
    new THREE.Vector3(halfW - 0.28, -halfH, 0)
  );
  // Abraçadeira / laço
  points.push(
    new THREE.Vector3(halfW, gatherY + 0.03, 0),
    new THREE.Vector3(rightGatherX - 0.1, gatherY - 0.02, 0)
  );

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = lineMat.clone();
  mat.opacity = lineMat.opacity * 0.8;
  return new THREE.LineSegments(geo, mat);
}

/**
 * Cria a geometria da luminária pendente de teto para um quarto.
 * @param {number} x - Posição X no quarto
 * @param {number} ceilingY - Altura do teto do andar
 * @param {number} z - Posição Z dentro do quarto
 * @param {THREE.Material} lineMat - Material base de linha
 * @param {THREE.Texture} lampTex - Textura para o halo de luz
 */
function createRoomLamp(x, ceilingY, z, lineMat, lampTex) {
  const points = [];
  const dropLen = 0.48;
  const shadeTopY = ceilingY - dropLen;
  const shadeH = 0.15;
  const shadeBotY = shadeTopY - shadeH;
  const shadeTopHalfW = 0.05;
  const shadeBotHalfW = 0.15;

  // 1. Fio pendente descendo do teto
  points.push(
    new THREE.Vector3(x, ceilingY, z),
    new THREE.Vector3(x, shadeTopY, z)
  );

  // 2. Cúpula do abajur pendente
  points.push(
    new THREE.Vector3(x - shadeTopHalfW, shadeTopY, z),
    new THREE.Vector3(x + shadeTopHalfW, shadeTopY, z),
    new THREE.Vector3(x - shadeBotHalfW, shadeBotY, z),
    new THREE.Vector3(x + shadeBotHalfW, shadeBotY, z),
    new THREE.Vector3(x - shadeTopHalfW, shadeTopY, z),
    new THREE.Vector3(x - shadeBotHalfW, shadeBotY, z),
    new THREE.Vector3(x + shadeTopHalfW, shadeTopY, z),
    new THREE.Vector3(x + shadeBotHalfW, shadeBotY, z)
  );

  // 3. Bulbo da lâmpada
  const bulbCenterY = shadeBotY - 0.05;
  const bulbR = 0.04;
  points.push(
    new THREE.Vector3(x, bulbCenterY + bulbR, z),
    new THREE.Vector3(x + bulbR, bulbCenterY, z),
    new THREE.Vector3(x + bulbR, bulbCenterY, z),
    new THREE.Vector3(x, bulbCenterY - bulbR, z),
    new THREE.Vector3(x, bulbCenterY - bulbR, z),
    new THREE.Vector3(x - bulbR, bulbCenterY, z),
    new THREE.Vector3(x - bulbR, bulbCenterY, z),
    new THREE.Vector3(x, bulbCenterY + bulbR, z)
  );

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = lineMat.clone();
  mat.opacity = 0.65;
  const lines = new THREE.LineSegments(geo, mat);

  // Halo suave para quando a lâmpada acender
  const glowMat = new THREE.SpriteMaterial({
    map: lampTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
    color: 0xffffff,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(0.9, 0.9, 1);
  glow.position.set(x, bulbCenterY, z + 0.01);

  return { lines, glow, glowMat, bulbPos: new THREE.Vector3(x, bulbCenterY, z) };
}

/**
 * Cria e retorna o grupo do prédio com todas as arestas, janelas, lâmpadas e hitboxes.
 * @returns {{ group: THREE.Group, apartments: Map<string, object>, doorLines: THREE.Object3D, doorHitbox: THREE.Mesh, totalWidth: number, totalHeight: number }}
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
  const frontZ = unitDepth / 2;

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

  // Textura compartilhada de halo para as lâmpadas dos quartos
  const lampCanvas = document.createElement('canvas');
  lampCanvas.width = 64;
  lampCanvas.height = 64;
  const lampCtx = lampCanvas.getContext('2d');
  const lampGrad = lampCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  lampGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  lampGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.45)');
  lampGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
  lampGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  lampCtx.fillStyle = lampGrad;
  lampCtx.fillRect(0, 0, 64, 64);
  const lampTex = new THREE.CanvasTexture(lampCanvas);

  // ─── Contorno externo do prédio (somente as arestas do prédio) ───
  const outerGeo = new THREE.BoxGeometry(totalWidth, totalHeight, unitDepth);
  const outerEdges = new THREE.EdgesGeometry(outerGeo);
  const outerLines = new THREE.LineSegments(outerEdges, lineMat);
  outerLines.position.set(0, totalHeight / 2, 0);
  group.add(outerLines);

  // ─── Apartamentos (janelas na fachada frontal + lâmpadas + hitboxes) ──
  const winW = unitWidth * 0.6;
  const winH = floorHeight * 0.55;

  // Função auxiliar para determinar se o apartamento tem cortinas
  const hasCurtains = (f, u) => {
    // Não colocar cortinas na entrada unificada do 1º andar
    if (f === 1 && (u === 2 || u === 3)) return false;
    return (f * 3 + u) % 4 === 1 || (f + u * 2) % 5 === 0;
  };

  // 1. Andares 2 a 10: janelas padrão em todas as posições
  // 2. Andar 1: posições 1 e 4 têm janelas padrão; posições 2 e 3 unem-se na entrada com a porta
  for (let f = 1; f <= floors; f++) {
    for (let u = 1; u <= unitsPerFloor; u++) {
      const x = -totalWidth / 2 + (u - 0.5) * unitWidth;
      const y = (f - 0.5) * floorHeight;
      const ceilingY = f * floorHeight;
      const key = `${f}-${u}`;

      // No 1º andar, posições 2 e 3 formam a entrada unificada integrada à porta
      if (f === 1 && (u === 2 || u === 3)) {
        continue;
      }

      // Janela padrão
      const winGeo = new THREE.PlaneGeometry(winW, winH);
      const winEdges = new THREE.EdgesGeometry(winGeo);
      const winLines = new THREE.LineSegments(winEdges, lineMat.clone());
      winLines.position.set(x, y, frontZ + 0.01);
      winLines.userData = { type: 'window', key, floor: f, position: u };
      group.add(winLines);

      // Cortinas em apartamentos selecionados
      if (hasCurtains(f, u)) {
        const curtains = createCurtains(winW, winH, lineMat);
        curtains.position.set(x, y, frontZ + 0.02);
        group.add(curtains);
      }

      // Lâmpada do quarto pendurada do teto
      const roomLamp = createRoomLamp(x, ceilingY, frontZ - 0.25, lineMat, lampTex);
      group.add(roomLamp.lines);
      group.add(roomLamp.glow);

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
        lampLines: roomLamp.lines,
        lampGlow: roomLamp.glow,
        lampGlowMat: roomLamp.glowMat,
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

  // ─── 1º Andar: Entrada Unificada (une as janelas 102 e 103 à porta) ───
  // A fachada central do 1º andar forma uma grande vitrine arquitetônica envidraçada
  // com a porta no centro, eliminando qualquer sobreposição visual.
  const entranceWidth = unitWidth * 1.6; // ~4.8m de largura
  const entranceHeight = doorHeight;     // ~2.2m de altura
  const halfEntW = entranceWidth / 2;
  const halfDoorW = doorWidth / 2;

  const entrancePoints = [];

  // Contorno da grande vitrine unificada
  entrancePoints.push(
    // Linha superior da vitrine
    new THREE.Vector3(-halfEntW, entranceHeight, 0),
    new THREE.Vector3(halfEntW, entranceHeight, 0),
    // Laterais externas
    new THREE.Vector3(-halfEntW, 0, 0),
    new THREE.Vector3(-halfEntW, entranceHeight, 0),
    new THREE.Vector3(halfEntW, 0, 0),
    new THREE.Vector3(halfEntW, entranceHeight, 0),
    // Base inferior
    new THREE.Vector3(-halfEntW, 0, 0),
    new THREE.Vector3(-halfDoorW, 0, 0),
    new THREE.Vector3(halfDoorW, 0, 0),
    new THREE.Vector3(halfEntW, 0, 0),
  );

  // Painéis de vidro laterais (flanqueando a porta central)
  // Travessa horizontal intermediária nos vidros laterais
  entrancePoints.push(
    new THREE.Vector3(-halfEntW, entranceHeight * 0.5, 0),
    new THREE.Vector3(-halfDoorW, entranceHeight * 0.5, 0),
    new THREE.Vector3(halfDoorW, entranceHeight * 0.5, 0),
    new THREE.Vector3(halfEntW, entranceHeight * 0.5, 0)
  );

  // Montantes da porta central
  entrancePoints.push(
    new THREE.Vector3(-halfDoorW, 0, 0),
    new THREE.Vector3(-halfDoorW, entranceHeight, 0),
    new THREE.Vector3(halfDoorW, 0, 0),
    new THREE.Vector3(halfDoorW, entranceHeight, 0),
    // Costura central (porta dupla)
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, entranceHeight, 0),
    // Puxadores
    new THREE.Vector3(-0.08, entranceHeight * 0.45, 0),
    new THREE.Vector3(-0.08, entranceHeight * 0.55, 0),
    new THREE.Vector3(0.08, entranceHeight * 0.45, 0),
    new THREE.Vector3(0.08, entranceHeight * 0.55, 0)
  );

  const entranceGeo = new THREE.BufferGeometry().setFromPoints(entrancePoints);
  const entranceLines = new THREE.LineSegments(entranceGeo, lineMat.clone());
  entranceLines.position.set(0, 0, frontZ + 0.01);
  entranceLines.userData = { type: 'entrance' };
  group.add(entranceLines);

  // Hitbox da porta (para abrir ao clicar)
  const doorHitGeo = new THREE.PlaneGeometry(doorWidth * 1.1, doorHeight * 1.05);
  const doorHitbox = new THREE.Mesh(doorHitGeo, hitboxMat.clone());
  doorHitbox.position.set(0, doorHeight / 2, frontZ + 0.05);
  doorHitbox.userData = { type: 'door' };
  group.add(doorHitbox);

  // Registrar as duas metades como apartamentos 1-2 e 1-3
  // Lâmpada para o hall 1-2
  const apt12X = -unitWidth / 2; // -1.5
  const lamp12 = createRoomLamp(apt12X, floorHeight, frontZ - 0.25, lineMat, lampTex);
  group.add(lamp12.lines);
  group.add(lamp12.glow);

  const apt12Hit = new THREE.Mesh(
    new THREE.PlaneGeometry(halfEntW - halfDoorW + 0.3, entranceHeight * 0.9),
    hitboxMat
  );
  apt12Hit.position.set(apt12X, entranceHeight / 2, frontZ + 0.05);
  apt12Hit.userData = { type: 'apartment', key: '1-2', floor: 1, position: 2 };
  group.add(apt12Hit);

  const apt12GlowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const apt12Glow = new THREE.Mesh(
    new THREE.PlaneGeometry(halfEntW - halfDoorW, entranceHeight * 0.95),
    apt12GlowMat
  );
  apt12Glow.position.set(-(halfEntW + halfDoorW) / 2, entranceHeight / 2, frontZ + 0.005);
  group.add(apt12Glow);

  apartments.set('1-2', {
    winLines: entranceLines,
    hitbox: apt12Hit,
    glow: apt12Glow,
    glowMat: apt12GlowMat,
    lampLines: lamp12.lines,
    lampGlow: lamp12.glow,
    lampGlowMat: lamp12.glowMat,
    floor: 1,
    position: 2,
    x: apt12X,
    y: entranceHeight / 2,
    lit: false,
    color: null,
    targetOpacity: 0,
    currentOpacity: 0,
    morador: null,
  });

  // Lâmpada para o hall 1-3
  const apt13X = unitWidth / 2; // +1.5
  const lamp13 = createRoomLamp(apt13X, floorHeight, frontZ - 0.25, lineMat, lampTex);
  group.add(lamp13.lines);
  group.add(lamp13.glow);

  const apt13Hit = new THREE.Mesh(
    new THREE.PlaneGeometry(halfEntW - halfDoorW + 0.3, entranceHeight * 0.9),
    hitboxMat
  );
  apt13Hit.position.set(apt13X, entranceHeight / 2, frontZ + 0.05);
  apt13Hit.userData = { type: 'apartment', key: '1-3', floor: 1, position: 3 };
  group.add(apt13Hit);

  const apt13GlowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const apt13Glow = new THREE.Mesh(
    new THREE.PlaneGeometry(halfEntW - halfDoorW, entranceHeight * 0.95),
    apt13GlowMat
  );
  apt13Glow.position.set((halfEntW + halfDoorW) / 2, entranceHeight / 2, frontZ + 0.005);
  group.add(apt13Glow);

  apartments.set('1-3', {
    winLines: entranceLines,
    hitbox: apt13Hit,
    glow: apt13Glow,
    glowMat: apt13GlowMat,
    lampLines: lamp13.lines,
    lampGlow: lamp13.glow,
    lampGlowMat: lamp13.glowMat,
    floor: 1,
    position: 3,
    x: apt13X,
    y: entranceHeight / 2,
    lit: false,
    color: null,
    targetOpacity: 0,
    currentOpacity: 0,
    morador: null,
  });

  return {
    group,
    apartments,
    doorLines: entranceLines,
    doorHitbox,
    totalWidth,
    totalHeight,
  };
}
