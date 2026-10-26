/**
 * guideLine.js — Linha-guia SVG que aparece ao hover em um quarto aceso (desktop).
 *
 * Trajeto: reta → inclinação → reta, com nome sobre o trecho final.
 */

import { GUIDE_LINE, BUILDING } from '../config.js';

export class GuideLine {
  constructor(container) {
    this.container = container;
    this.active = false;
    this.currentKey = null;
    this.animProgress = 0;
    this.fadeOut = 0;
    this.targetData = null;

    // SVG overlay
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 500;
      overflow: visible;
    `;
    this.container.appendChild(this.svg);

    // Path element
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', 'rgba(255,255,255,0.7)');
    this.path.setAttribute('stroke-width', '1');
    this.path.style.filter = 'drop-shadow(0 0 3px rgba(255,255,255,0.3))';
    this.svg.appendChild(this.path);

    // Text element
    this.text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.text.setAttribute('fill', 'rgba(255,255,255,0.9)');
    this.text.setAttribute('font-family', GUIDE_LINE.fontFamily);
    this.text.setAttribute('font-size', GUIDE_LINE.fontSize);
    this.text.setAttribute('letter-spacing', GUIDE_LINE.letterSpacing);
    this.text.setAttribute('font-weight', '300');
    this.text.style.opacity = '0';
    this.svg.appendChild(this.text);
  }

  /**
   * Mostra a linha-guia para um apartamento.
   * @param {object} screenPos — { x, y } posição na tela do centro do quarto
   * @param {string} nome — nome do morador
   * @param {number} floor — andar (1-based)
   * @param {string} key — chave do apartamento
   */
  show(screenPos, nome, floor, key) {
    if (this.currentKey === key && this.active) return;

    this.currentKey = key;
    this.active = true;
    this.animProgress = 0;
    this.fadeOut = 0;

    // Decidir direção: quartos na metade inferior inclinam para baixo
    const midFloor = BUILDING.floors / 2;
    const goDown = floor <= midFloor;
    const bendDir = goDown ? 1 : -1; // 1 = para baixo na tela (y positivo)

    // Decidir lado: sair pela direita
    const sideDir = screenPos.x < window.innerWidth / 2 ? 1 : -1;

    const { straightLength, bendAngle, bendLength, finalLength } = GUIDE_LINE;
    const angleRad = (bendAngle * Math.PI) / 180;
    const scale = 30; // pixels per unit

    // Pontos da linha-guia
    const p0 = { x: screenPos.x, y: screenPos.y };
    const p1 = {
      x: p0.x + sideDir * straightLength * scale,
      y: p0.y,
    };
    const p2 = {
      x: p1.x + sideDir * Math.cos(angleRad) * bendLength * scale,
      y: p1.y + bendDir * Math.sin(angleRad) * bendLength * scale,
    };
    const p3 = {
      x: p2.x + sideDir * finalLength * scale,
      y: p2.y,
    };

    this.targetData = { p0, p1, p2, p3, nome, sideDir };
  }

  hide() {
    if (!this.active) return;
    this.active = false;
    this.fadeOut = 1;
    this.currentKey = null;
  }

  /**
   * Atualizar a cada frame.
   * @param {number} dt — delta time em segundos
   */
  update(dt) {
    if (!this.targetData && this.fadeOut <= 0) return;

    if (this.active && this.targetData) {
      // Animar progresso de traçar
      this.animProgress = Math.min(1, this.animProgress + dt / (GUIDE_LINE.drawDuration / 1000));
      this._drawPath(this.animProgress);

      // Fade-in do nome
      const nameAlpha = Math.max(0, (this.animProgress - 0.7) / 0.3);
      this.text.style.opacity = `${nameAlpha}`;
    } else if (this.fadeOut > 0) {
      // Fade-out
      this.fadeOut = Math.max(0, this.fadeOut - dt / (GUIDE_LINE.fadeOutDuration / 1000));
      this.path.style.opacity = `${this.fadeOut}`;
      this.text.style.opacity = `${this.fadeOut * 0.8}`;
      if (this.fadeOut <= 0) {
        this.path.setAttribute('d', '');
        this.text.textContent = '';
        this.targetData = null;
      }
    }
  }

  _drawPath(progress) {
    if (!this.targetData) return;
    const { p0, p1, p2, p3, nome, sideDir } = this.targetData;

    // Calcular o comprimento total
    const seg1 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const seg2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const seg3 = Math.hypot(p3.x - p2.x, p3.y - p2.y);
    const total = seg1 + seg2 + seg3;
    const drawn = total * progress;

    let d = `M ${p0.x} ${p0.y}`;

    if (drawn <= seg1) {
      const t = drawn / seg1;
      const ex = p0.x + (p1.x - p0.x) * t;
      const ey = p0.y + (p1.y - p0.y) * t;
      d += ` L ${ex} ${ey}`;
    } else if (drawn <= seg1 + seg2) {
      d += ` L ${p1.x} ${p1.y}`;
      const t = (drawn - seg1) / seg2;
      const ex = p1.x + (p2.x - p1.x) * t;
      const ey = p1.y + (p2.y - p1.y) * t;
      d += ` L ${ex} ${ey}`;
    } else {
      d += ` L ${p1.x} ${p1.y}`;
      d += ` L ${p2.x} ${p2.y}`;
      const t = Math.min(1, (drawn - seg1 - seg2) / seg3);
      const ex = p2.x + (p3.x - p2.x) * t;
      const ey = p2.y + (p3.y - p2.y) * t;
      d += ` L ${ex} ${ey}`;
    }

    this.path.setAttribute('d', d);
    this.path.style.opacity = '1';

    // Texto sobre o trecho final
    this.text.textContent = nome;
    const textX = sideDir > 0 ? p2.x + 8 : p3.x + 8;
    const textY = p2.y - 6;
    this.text.setAttribute('x', textX);
    this.text.setAttribute('y', textY);
    if (sideDir < 0) {
      this.text.setAttribute('text-anchor', 'end');
      this.text.setAttribute('x', p2.x - 8);
    } else {
      this.text.setAttribute('text-anchor', 'start');
    }
  }

  /**
   * Atualiza a posição da linha-guia quando a câmera se move.
   */
  updateScreenPos(screenPos, nome, floor, key) {
    if (this.active && this.currentKey === key) {
      this.show(screenPos, nome, floor, key);
      // Keep current animation progress
      this.animProgress = Math.min(1, this.animProgress);
    }
  }

  dispose() {
    this.svg.remove();
  }
}
