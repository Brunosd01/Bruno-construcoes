#!/usr/bin/env node

/**
 * validate.js — Script de validação dos apartamentos.
 *
 * Usado localmente (npm run validate), no CI (GitHub Actions)
 * e antes do build (prebuild).
 *
 * Usa apenas módulos nativos do Node. Sem dependências.
 *
 * Mensagens de erro em português.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const APTS_DIR = join(ROOT, 'apartamentos');

// ─── Configuração (deve bater com config.js) ─────────────────
const FLOORS = 10;
const UNITS_PER_FLOOR = 4;

// ─── Convenção de numeração (mesma lógica de parseApartment) ──
function parseApartment(apt) {
  if (typeof apt !== 'string' || !/^\d{3,}$/.test(apt)) return null;
  // Sempre 2 dígitos para a posição
  const floor = parseInt(apt.slice(0, -2), 10);
  const position = parseInt(apt.slice(-2), 10);
  if (
    isNaN(floor) || isNaN(position) ||
    floor < 1 || floor > FLOORS ||
    position < 1 || position > UNITS_PER_FLOOR
  ) return null;
  return { floor, position };
}


// ─── Regex helpers ────────────────────────────────────────────
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HEX_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const CAMPOS_OBRIGATORIOS = ['nome', 'apartamento', 'corLuz'];
const CAMPOS_PERMITIDOS = new Set(CAMPOS_OBRIGATORIOS);

// ─── Validação ────────────────────────────────────────────────
const erros = [];
const ocupados = new Map(); // apartamento → slug (primeiro a ocupar)

async function validate() {
  let entries;
  try {
    entries = await readdir(APTS_DIR);
  } catch {
    console.log('ℹ️  Pasta "apartamentos/" não encontrada. Nenhum morador para validar.');
    process.exit(0);
  }

  for (const entry of entries) {
    // Ignorar pastas que começam com _
    if (entry.startsWith('_')) continue;

    const folderPath = join(APTS_DIR, entry);
    const folderStat = await stat(folderPath);
    if (!folderStat.isDirectory()) continue;

    // 1. Nome da pasta é slug válido?
    if (!SLUG_RE.test(entry)) {
      erros.push(
        `❌ Pasta "${entry}": o nome deve ser em minúsculas, sem acentos, sem espaços, separado por hífens (slug). Exemplo: "ana-souza".`
      );
      continue;
    }

    // 2. Listar arquivos .json dentro da pasta
    const files = await readdir(folderPath);
    const jsonFiles = files.filter(f => extname(f) === '.json');

    if (jsonFiles.length === 0) {
      erros.push(`❌ Pasta "${entry}": nenhum arquivo .json encontrado.`);
      continue;
    }

    if (jsonFiles.length > 1) {
      erros.push(
        `❌ Pasta "${entry}": encontrados ${jsonFiles.length} arquivos .json (${jsonFiles.join(', ')}). Só é permitido um.`
      );
      continue;
    }

    const jsonFile = jsonFiles[0];
    const expectedName = `${entry}.json`;

    // 3. Nome do arquivo bate com o da pasta?
    if (jsonFile !== expectedName) {
      erros.push(
        `❌ Pasta "${entry}": o arquivo deveria se chamar "${expectedName}", mas encontrei "${jsonFile}".`
      );
      continue;
    }

    // 4. Ler e parsear o JSON
    const filePath = join(folderPath, jsonFile);
    let raw;
    try {
      raw = await readFile(filePath, 'utf-8');
    } catch (err) {
      erros.push(`❌ Pasta "${entry}": erro ao ler "${jsonFile}": ${err.message}`);
      continue;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      erros.push(`❌ Pasta "${entry}": JSON inválido em "${jsonFile}": ${err.message}`);
      continue;
    }

    // 5. Verificar campos obrigatórios
    for (const campo of CAMPOS_OBRIGATORIOS) {
      if (!(campo in data)) {
        erros.push(`❌ Pasta "${entry}": campo obrigatório "${campo}" está faltando.`);
      }
    }

    // 6. Verificar campos desconhecidos
    for (const campo of Object.keys(data)) {
      if (!CAMPOS_PERMITIDOS.has(campo)) {
        erros.push(`❌ Pasta "${entry}": campo desconhecido "${campo}". Campos permitidos: ${CAMPOS_OBRIGATORIOS.join(', ')}.`);
      }
    }

    if (!data.nome || !data.apartamento || !data.corLuz) continue;

    // 7. corLuz é hex válido?
    if (!HEX_RE.test(data.corLuz)) {
      erros.push(
        `❌ Pasta "${entry}": "corLuz" deve ser uma cor hexadecimal (ex.: "#ff6600" ou "#f60"), mas recebi "${data.corLuz}".`
      );
    }

    // 8. Apartamento existe no prédio?
    const parsed = parseApartment(data.apartamento);
    if (!parsed) {
      erros.push(
        `❌ Pasta "${entry}": apartamento "${data.apartamento}" não existe no prédio (${FLOORS} andares, ${UNITS_PER_FLOOR} por andar). Use um número como "101" (andar 1, posição 1) até "${FLOORS}0${UNITS_PER_FLOOR}" (andar ${FLOORS}, posição ${UNITS_PER_FLOOR}).`
      );
    }

    // 9. Apartamento já ocupado?
    if (ocupados.has(data.apartamento)) {
      const outro = ocupados.get(data.apartamento);
      erros.push(
        `❌ Pasta "${entry}": apartamento "${data.apartamento}" já está ocupado por "${outro}". Escolha outro apartamento.`
      );
    } else {
      ocupados.set(data.apartamento, entry);
    }
  }

  // ─── Resultado ────────────────────────────────────────────────
  if (erros.length > 0) {
    console.error('\n🚨 Validação falhou!\n');
    for (const erro of erros) {
      console.error(erro);
    }
    console.error(`\n${erros.length} erro(s) encontrado(s).\n`);
    process.exit(1);
  } else {
    const total = ocupados.size;
    console.log(`\n✅ Validação OK! ${total} morador(es) encontrado(s).\n`);
    process.exit(0);
  }
}

validate().catch(err => {
  console.error('Erro inesperado na validação:', err);
  process.exit(1);
});
