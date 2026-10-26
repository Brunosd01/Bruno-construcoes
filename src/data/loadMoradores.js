/**
 * loadMoradores.js — Carrega os JSONs de apartamentos no build via import.meta.glob.
 * O Vite embute todos os arquivos em tempo de build / dev.
 */

const HEX_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

/**
 * Carrega e valida todos os moradores.
 * @returns {Array<{ nome: string, apartamento: string, corLuz: string, slug: string }>}
 */
export function loadMoradores() {
  // import.meta.glob — lê em build time
  const modules = import.meta.glob('/apartamentos/*/*.json', { eager: true });
  const moradores = [];
  const seen = new Set();

  for (const [path, mod] of Object.entries(modules)) {
    // Ignorar pastas que começam com _
    const parts = path.split('/');
    const folder = parts[parts.length - 2];
    if (folder.startsWith('_')) continue;

    const data = mod.default || mod;

    // Validar campos obrigatórios
    if (!data.nome || !data.apartamento || !data.corLuz) {
      console.warn(`[predio] Campos faltando em ${path}, ignorando.`);
      continue;
    }

    // Validar cor
    let cor = data.corLuz;
    if (!HEX_RE.test(cor)) {
      console.warn(`[predio] Cor inválida "${cor}" em ${path}, usando padrão.`);
      cor = '#fff5e0';
    }

    // Apartamento duplicado
    if (seen.has(data.apartamento)) {
      console.warn(`[predio] Apartamento ${data.apartamento} duplicado em ${path}, ignorando.`);
      continue;
    }
    seen.add(data.apartamento);

    moradores.push({
      nome: data.nome,
      apartamento: data.apartamento,
      corLuz: cor,
      slug: folder,
    });
  }

  return moradores;
}
