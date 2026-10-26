/**
 * firefly.js — O vaga-lume: cursor customizado que segue o mouse com inércia e oscilação.
 *
 * Renderizado como overlay HTML/CSS para performance.
 */

import { FIREFLY, COLORS } from '../config.js';

export class Firefly {
  constructor(container) {
    this.container = container;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.visible = false;
    this.time = 0;
    this.clickPulse = 0;

    // Trail points
    this.trail = [];
    for (let i = 0; i < FIREFLY.trailLength; i++) {
      this.trail.push({ x: this.x, y: this.y, opacity: 0 });
    }

    // Create DOM elements
    this._createElements();

    // Mouse events
    this._bindEvents();
  }

  _createElements() {
    // Main glow
    this.el = document.createElement('div');
    this.el.className = 'firefly';
    this.el.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 1000;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: radial-gradient(circle, ${COLORS.firefly} 0%, ${COLORS.firefly}66 30%, transparent 70%);
      box-shadow: 0 0 16px 6px ${COLORS.firefly}44, 0 0 40px 12px ${COLORS.firefly}22;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.4s ease;
    `;
    this.container.appendChild(this.el);

    // Trail elements
    this.trailEls = [];
    for (let i = 0; i < FIREFLY.trailLength; i++) {
      const t = document.createElement('div');
      t.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 999;
        width: ${6 - i * 0.5}px;
        height: ${6 - i * 0.5}px;
        border-radius: 50%;
        background: ${COLORS.firefly}44;
        transform: translate(-50%, -50%);
        opacity: 0;
      `;
      this.container.appendChild(t);
      this.trailEls.push(t);
    }
  }

  _bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
      if (!this.visible) {
        this.visible = true;
        this.el.style.opacity = '1';
        // Hide default cursor on scene
        this.container.style.cursor = 'none';
      }
    });

    document.addEventListener('mouseleave', () => {
      this.visible = false;
      this.el.style.opacity = '0';
      this.trailEls.forEach(t => t.style.opacity = '0');
      this.container.style.cursor = '';
    });

    document.addEventListener('mouseenter', () => {
      this.visible = true;
      this.el.style.opacity = '1';
      this.container.style.cursor = 'none';
    });

    document.addEventListener('mousedown', () => {
      this.clickPulse = 1.0;
    });
  }

  /**
   * Atualiza posição e animações. Chamar a cada frame.
   * @param {number} dt — delta time em segundos
   * @returns {{ x: number, y: number }} — posição atual do vaga-lume na tela
   */
  update(dt) {
    this.time += dt;

    // Lerp suave até o alvo
    const lerp = 1 - Math.pow(1 - FIREFLY.lerpSpeed, dt * 60);
    this.x += (this.targetX - this.x) * lerp;
    this.y += (this.targetY - this.y) * lerp;

    // Oscilação orgânica
    const osc = FIREFLY.oscillation;
    const oscX = Math.sin(this.time * FIREFLY.oscillationSpeed * 1.3) * osc;
    const oscY = Math.cos(this.time * FIREFLY.oscillationSpeed * 0.9) * osc * 0.7;

    const finalX = this.x + oscX;
    const finalY = this.y + oscY;

    // Pulse de brilho
    const pulse = Math.sin(this.time * FIREFLY.pulseSpeed) * FIREFLY.pulseAmount + 1;
    const clickScale = 1 + this.clickPulse * FIREFLY.clickPulseScale;
    this.clickPulse *= 0.9;

    // Posicionar elemento
    if (this.visible) {
      this.el.style.left = `${finalX}px`;
      this.el.style.top = `${finalY}px`;
      const scale = pulse * clickScale;
      this.el.style.transform = `translate(-50%, -50%) scale(${scale})`;

      // Trail
      for (let i = this.trail.length - 1; i > 0; i--) {
        this.trail[i].x = this.trail[i - 1].x;
        this.trail[i].y = this.trail[i - 1].y;
        this.trail[i].opacity = this.trail[i - 1].opacity * FIREFLY.trailFade;
      }
      this.trail[0].x = finalX;
      this.trail[0].y = finalY;
      this.trail[0].opacity = 0.6;

      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trailEls[i];
        t.style.left = `${this.trail[i].x}px`;
        t.style.top = `${this.trail[i].y}px`;
        t.style.opacity = `${this.trail[i].opacity}`;
      }
    }

    return { x: finalX, y: finalY };
  }

  /**
   * Mostra um pulso de vaga-lume em um ponto (para toque no celular).
   */
  touchPulse(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.opacity = '1';
    this.clickPulse = 1.5;

    setTimeout(() => {
      this.el.style.opacity = '0';
    }, 1500);
  }

  dispose() {
    this.el.remove();
    this.trailEls.forEach(t => t.remove());
  }
}
