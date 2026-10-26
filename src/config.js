/**
 * config.js — Constantes ajustáveis do projeto Prédio 3D.
 * Altere os valores aqui para personalizar o prédio, câmera, cores e comportamentos.
 */

// ─── Prédio ────────────────────────────────────────────────────
export const BUILDING = {
  floors: 10,             // Quantidade de andares
  unitsPerFloor: 4,       // Apartamentos por andar (fachada frontal)
  floorHeight: 2.4,       // Altura de cada andar (unidades 3D)
  unitWidth: 3.0,         // Largura de cada apartamento
  unitDepth: 4.0,         // Profundidade do prédio
  wallThickness: 0.15,    // Espessura das paredes (visual)
  windowInset: 0.3,       // Recuo da janela em relação à fachada
  doorWidth: 1.8,         // Largura da porta (térreo, centro)
  doorHeight: 2.2,        // Altura da porta
};

// ─── Câmera ────────────────────────────────────────────────────
export const CAMERA = {
  fov: 45,
  near: 0.1,
  far: 500,
  initialDistance: 35,     // Distância inicial da câmera ao prédio
  initialAngleY: 0.25,    // Ângulo vertical inicial (rad)
  orbitDamping: 0.08,     // Inércia/damping da órbita
  orbitMaxPolar: Math.PI * 0.48,   // Não passa abaixo do chão
  orbitMinPolar: Math.PI * 0.05,   // Não vai reto para cima
  orbitMaxAzimuth: Math.PI * (80 / 180), // ±80° da frente
  zoomMin: 15,
  zoomMax: 60,
  autoRotate: false,      // Rotação automática (padrão: desligada)
  autoRotateSpeed: 0.1,   // Velocidade se ligada
  entryAnimDuration: 2.0, // Duração da animação de entrada (s)
};

// ─── Cores ─────────────────────────────────────────────────────
export const COLORS = {
  background: 0x050510,       // Fundo azul-noite muito escuro
  wireframe: 0xffffff,        // Linhas do prédio
  wireframeOpacity: 0.7,      // Opacidade das linhas
  defaultLight: '#fff5e0',    // Cor padrão se corLuz do JSON for inválida
  postLight: '#fff0d0',       // Luz quente dos postes
  postLightIntensity: 0.6,
  firefly: '#c8e550',         // Vaga-lume (amarelo-esverdeado suave)
  fireflyIntensity: 0.8,
  trashcan: '#4a9e5c',        // Lixeira (verde suave)
  moonGlow: 0xeeeeff,         // Brilho da lua
};

// ─── Estrelas ──────────────────────────────────────────────────
export const STARS = {
  count: 1200,                // Quantidade de estrelas
  countLite: 400,             // Modo leve (celular)
  radius: 180,                // Raio do domo
  minSize: 0.3,
  maxSize: 1.5,
  twinkleSpeed: 0.5,          // Velocidade da cintilação
};

// ─── Lua ───────────────────────────────────────────────────────
export const MOON = {
  radius: 6,
  position: { x: 60, y: 70, z: -80 },
  breatheSpeed: 0.15,         // Velocidade do "respirar" do brilho
  breatheAmount: 0.15,        // Intensidade da variação
};

// ─── Vaga-lume ─────────────────────────────────────────────────
export const FIREFLY = {
  lerpSpeed: 0.06,            // Suavidade do seguir (0–1)
  oscillation: 0.8,           // Amplitude da oscilação orgânica
  oscillationSpeed: 2.0,
  trailLength: 8,             // Número de pontos do rastro
  trailFade: 0.85,            // Velocidade do fade do rastro
  pulseSpeed: 0.8,            // Velocidade do pulso de brilho
  pulseAmount: 0.3,           // Amplitude do pulso
  proximityRadius: 8,         // Raio de iluminação das linhas próximas
  clickPulseScale: 2.0,       // Escala do pulso ao clicar
};

// ─── Linha-guia (hover) ───────────────────────────────────────
export const GUIDE_LINE = {
  straightLength: 3.5,        // Comprimento do primeiro trecho reto (unidades 3D)
  bendAngle: 35,              // Ângulo da inclinação (graus)
  bendLength: 1.5,            // Comprimento do trecho inclinado
  finalLength: 4.0,           // Comprimento do trecho reto final
  drawDuration: 400,          // Duração da animação de traçar (ms)
  fadeInDuration: 300,        // Fade-in do nome (ms)
  fadeOutDuration: 250,       // Fade-out de tudo (ms)
  fontSize: '14px',
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  letterSpacing: '0.12em',
};

// ─── Calçada / Postes / Lixeira ───────────────────────────────
export const SIDEWALK = {
  width: 4.0,                 // Largura da calçada
  length: 12.0,               // Comprimento para frente do prédio
  height: 0.15,               // Espessura do meio-fio
};

export const POSTS = {
  height: 4.5,                // Altura dos postes
  armLength: 1.0,             // Comprimento do braço curvo
  offsetX: 2.5,               // Distância lateral do centro da porta
  haloRadius: 3.0,            // Raio do halo de luz
};

export const TRASHCAN = {
  width: 0.6,
  height: 1.0,
  depth: 0.5,
  offsetX: 2.0,               // Distância lateral da porta (lado oposto ao poste mais perto, ou ao lado)
  lidOpenAngle: Math.PI * 0.15, // Ângulo da tampa ao hover
  lidFullAngle: Math.PI * 0.6,  // Ângulo da tampa ao clique
  autoCloseDelay: 3000,       // Ms para fechar sozinha
};

// ─── Pessoinha ─────────────────────────────────────────────────
export const PERSON = {
  heightRatio: 0.6,           // Proporção da altura da pessoa vs. altura do quarto
  breatheSpeed: 0.8,          // Velocidade da "respiração"
  breatheAmount: 0.03,        // Amplitude do balanço
  fadeInDelay: 300,            // Atraso após a luz acender (ms)
  fadeInDuration: 500,         // Duração do fade-in (ms)
};

// ─── Animações (durações em ms) ───────────────────────────────
export const ANIM = {
  hoverFade: 350,
  doorOpen: 700,
  doorClose: 1200,
  lidOpen: 500,
  lidClose: 800,
  lightStagger: 120,          // Escalonamento entre quartos ao carregar
  entryDuration: 2000,        // Animação de entrada da cena
};

// ─── Celular ──────────────────────────────────────────────────
export const MOBILE = {
  zoomDuration: 800,          // Duração do zoom ao apartamento (ms)
  touchHitboxPadding: 6,      // Px extras para área de toque
  maxDpr: 1.5,                // devicePixelRatio máximo no celular
  reducedStars: true,
  reducedTrail: true,
};

// ─── Modo leve ────────────────────────────────────────────────
export const LITE_MODE = {
  enabled: false,             // Liga automaticamente em celular
  maxDpr: 1.5,
  disableTrail: true,
  disableBloom: true,
  reducedStarCount: 400,
};
