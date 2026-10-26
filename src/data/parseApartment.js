/**
 * parseApartment.js — Função utilitária única para converter
 * o número do apartamento em { andar, posição }.
 *
 * Convenção: os dois últimos dígitos são a posição; o restante é o andar.
 *   "101"  → andar 1, posição 01
 *   "304"  → andar 3, posição 04
 *   "1002" → andar 10, posição 02
 *
 * A posição sempre usa 2 dígitos (01–04 para 4 apartamentos por andar).
 *
 * Usada tanto pelo site quanto pelo script de validação.
 */

import { BUILDING } from '../config.js';

/**
 * @param {string} apt — Número do apartamento (ex.: "101", "1002")
 * @returns {{ floor: number, position: number } | null}
 */
export function parseApartment(apt) {
  if (typeof apt !== 'string' || !/^\d{3,}$/.test(apt)) return null;

  // Sempre 2 dígitos para a posição
  const floor = parseInt(apt.slice(0, -2), 10);
  const position = parseInt(apt.slice(-2), 10);

  if (
    isNaN(floor) || isNaN(position) ||
    floor < 1 || floor > BUILDING.floors ||
    position < 1 || position > BUILDING.unitsPerFloor
  ) {
    return null;
  }

  return { floor, position };
}
