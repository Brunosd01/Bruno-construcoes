# AGENTS.md — Regras para IAs neste projeto

Projeto: **Site do Prédio 3D em Linhas Brancas** (Vite + Three.js + JavaScript puro).
Objetivo real: a turma aprende Git contribuindo com um JSON por morador. Mantenha tudo simples.

## Antes de qualquer coisa

1. Leia `HANDOFF.md` (especificação) e `PROGRESSO.md` (estado atual e decisões).
2. Leia `DIVISAO.md` e confirme qual é a **sua tarefa** e quais arquivos são **seus**.
3. Se algo na tarefa conflitar com o HANDOFF, o HANDOFF vence. Se o HANDOFF for ambíguo, adote o padrão da seção 10 e registre no `PROGRESSO.md`.

## Regras de trabalho

- **Uma fase por vez**, na ordem da seção 9B do HANDOFF. Não adiante fases.
- **Uma tarefa por vez.** Faça só o que a tarefa pede. Nada de refatoração "de brinde".
- **Mexa apenas nos arquivos da sua tarefa.** Se precisar tocar em outro arquivo, pare e avise no relatório final em vez de editar.
- `src/main.js` é ponto de conflito. Só edite se a tarefa disser explicitamente. Prefira colocar a lógica no seu próprio módulo e expor uma função pequena para o `main.js` chamar.
- Trabalhe **na branch indicada** na tarefa. Nunca faça commit direto na `main`.
- Commits pequenos, mensagem em português, no imperativo ("Corrige updateScreenPos na linha-guia").
- Sem novas dependências sem pedir. Sem TypeScript, sem frameworks.
- Não altere versões fixadas (Node 24.20.0, Vite 8.3.5, Three ~0.175.0) nem o `package-lock.json`, salvo se a tarefa pedir.

## Regras técnicas do projeto (resumo do HANDOFF)

- Estética: só linhas finas brancas, com brilho suave. Cores extras permitidas: luz dos quartos, lixeira verde, luz dos postes, vaga-lume.
- Animações com easing, reversíveis e **independentes de FPS** (use delta de tempo).
- Respeitar `prefers-reduced-motion`.
- A conversão `apartamento -> (andar, posição)` existe **em um único lugar**: `src/data/parseApartment.js`. Site e `scripts/validate.js` devem usar essa mesma função.
- `parseApartment.js` deve ser JS puro (sem `import.meta`, sem DOM), para rodar em Node.
- Configurações ajustáveis ficam em `src/config.js`, não espalhadas pelo código.
- Mensagens de validação e de console em português.
- O site nunca pode quebrar por dado inválido: ignore e avise no console.

## Antes de dizer que terminou

Rode e confirme que passam:

```
npm run validate
npm run build
```

Se mexeu em algo visual ou interativo, rode `npm run dev` e descreva o que testou.

## Relatório final (obrigatório)

Termine sempre com:

1. **O que mudou** (lista de arquivos e o que foi feito em cada um).
2. **O que testei** e como.
3. **O que NÃO consegui testar** ou ficou incerto.
4. **Riscos / pontos para a revisão.**
5. Atualize o `PROGRESSO.md` (status da tarefa e decisões novas).

## Proibido

- Dizer que "está funcionando" sem ter rodado o build.
- Apagar arquivos que não sejam da sua tarefa.
- Inventar funções que não existem: antes de chamar um método, confira se ele existe no arquivo (esse foi um bug real: `guideLine.updateScreenPos`).
