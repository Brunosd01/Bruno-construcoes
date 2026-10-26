# PROGRESSO.md

> Toda IA lê este arquivo no início e o atualiza no fim da tarefa.
> Marque: `[ ]` pendente · `[~]` em andamento · `[x]` feito e revisado.

## Fase atual: **1 — Base e fluxo Git**

## Versões fixadas (não mexer sem pedir)

- Node.js 24.20.0 (`.nvmrc` e `engines`)
- Vite 8.3.5
- Three.js ~0.175.0
- `package-lock.json` versionado

## Estado verificado (Etapa 0)

- `npm run validate` OK (3 moradores)
- `npm run dev` sobe sem erros
- `npm run build` OK (prebuild roda a validação)

## Já pronto

- Ambiente isolado (`.nvmrc`, `engines`, lockfile, `.gitignore`)
- `CONTRIBUTING.md`, `README.md`, template de PR, `validate.yml`
- `scripts/validate.js` (slug, JSON, campos, cor, limites, duplicados)
- `src/data/loadMoradores.js` (glob no build, ignora `_`, defensivo)
- `src/config.js` com os padrões da seção 10
- Cena base: prédio, chão com fade, céu com estrelas e lua
- Acessibilidade básica (`sr-only`, `prefers-reduced-motion`)

## Problemas conhecidos

| Item                                                                                                  | Arquivo                              | Fase | Status |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------ | ---- | ------ |
| `validate.js` duplica a conversão de apartamento (deve importar `parseApartment.js`)                  | `scripts/validate.js`                | 1    | [ ]    |
| Resíduos do template Vite em `src/assets/`                                                            | `src/assets/`                        | 1    | [ ]    |
| `guideLine.updateScreenPos` não existe (TypeError ao orbitar com hover)                               | `src/ui/guideLine.js`, `src/main.js` | 2    | [ ]    |
| Zoom mobile: easing aplicado ao delta restante, `lookAt` não atualiza, `updatePosition` nunca chamado | `src/mobile/mobile.js`               | 2    | [ ]    |
| Vaga-lume é só DOM 2D, não ilumina as linhas 3D                                                       | `src/fx/firefly.js`                  | 4    | [ ]    |
| Lixeira e postes só reagem a clique, não à proximidade                                                | `src/main.js` + novos módulos        | 3    | [ ]    |
| Sem animação de entrada da câmera (1,5–2,5 s)                                                         | `src/scene/cameraSetup.js`           | 4    | [ ]    |

## Tarefas (detalhes em `DIVISAO.md`)

- [ ] 1.1 Limpeza de assets e teste de ponta a ponta da validação
- [ ] 1.2 `validate.js` reutiliza `parseApartment.js`
- [ ] 1.R Revisão da Fase 1 e merge
- [ ] 2.1 Zoom mobile + nome no apartamento
- [ ] 2.2 Linha-guia desktop
- [ ] 2.3 Pessoinhas (revisão e ajustes)
- [ ] 2.T Teste visual da Fase 2
- [ ] 3.1 Postes (proximidade + liga/desliga)
- [ ] 3.2 Lixeira, porta e calçada
- [ ] 4.1 Vaga-lume ilumina as linhas 3D
- [ ] 4.2 Entrada da câmera
- [ ] 4.3 Modo leve e reduced-motion
- [ ] 4.4 Acessibilidade e fallback sem WebGL

## Decisões tomadas

- Padrões da seção 10 do HANDOFF adotados: 10 andares × 4 apt, numeração andar+posição, pasta em slug, fork, rotação automática desligada, porta abre ao clique, desktop sem zoom por clique, pessoinhas iguais, órbita ±80°.
- Regra da inclinação da linha-guia: metade inferior do prédio inclina para baixo, metade superior para cima. (Registrar aqui se mudar.)

## Log (mais recente primeiro)

<!-- Formato: AAAA-MM-DD · IA · tarefa · resumo em 1 linha -->
