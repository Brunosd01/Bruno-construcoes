# Instruções para o GitHub Copilot — Prédio 3D

Projeto: site de um prédio 3D em linhas brancas (Vite + Three.js + JavaScript puro). O objetivo real é a turma aprender Git contribuindo com um JSON por morador em `apartamentos/<slug>/<slug>.json`. Mantenha tudo simples.

## Fonte da verdade

`HANDOFF.md` (especificação), `PROGRESSO.md` (estado e decisões) e `DIVISAO.md` (quem faz o quê). Em caso de conflito, o HANDOFF vence.

## Regras

- JavaScript puro. Sem TypeScript, sem frameworks, sem novas dependências.
- Não altere versões fixadas (Node 24.20.0, Vite 8.3.5, Three ~0.175.0) nem o `package-lock.json`.
- A conversão `apartamento -> (andar, posição)` existe só em `src/data/parseApartment.js` (JS puro, sem `import.meta` nem DOM). Site e `scripts/validate.js` usam a mesma função.
- Constantes ajustáveis ficam em `src/config.js`.
- Animações com easing, reversíveis e independentes de FPS (use delta de tempo). Respeitar `prefers-reduced-motion`.
- Estética: só linhas finas brancas com brilho suave. Cores extras permitidas: luz dos quartos, lixeira verde, luz dos postes, vaga-lume.
- Mensagens de validação e de console em português.
- O site nunca quebra por dado inválido: ignorar e avisar no console.
- Confira se uma função existe antes de chamá-la.

## Ao revisar Pull Requests

Revise contra o HANDOFF e aponte, por gravidade:

1. Chamadas a métodos que não existem ou imports quebrados.
2. Lógica duplicada da conversão de apartamento.
3. Animações que dependem de FPS, não são reversíveis ou vazam listeners/objetos.
4. Arquivos alterados fora do escopo da tarefa (veja `DIVISAO.md`).
5. Uso de cores fora da paleta permitida.
6. Mensagens de validação que perderam clareza.
   Não sugira refatorações grandes nem novas dependências.
