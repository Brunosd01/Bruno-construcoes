# DIVISAO.md — Quem faz o quê

## Papéis

Ajuste esta tabela se você achar que algum modelo se comporta melhor em outro papel.

| Papel                      | IA               | Ferramenta  | Serve para                                                                  |
| -------------------------- | ---------------- | ----------- | --------------------------------------------------------------------------- |
| **A — Arquiteta/Revisora** | Luna 6           | Codex       | Tarefas difíceis (câmera, matemática 3D, shaders) e revisão de todos os PRs |
| **B — Construtora**        | Terra 5.6        | Codex       | Funcionalidades médias e bem delimitadas                                    |
| **C — Construtora 2**      | Luna 5.6         | Codex       | Funcionalidades médias, em módulos separados de B                           |
| **D — Operária/Testadora** | Gemini 3.8 Flash | Antigravity | Limpeza, texto, testes no navegador, capturas de tela                       |

## Regras de convivência

1. **Uma IA por tarefa, uma branch por tarefa.** Nunca duas IAs na mesma branch.
2. **Só rode em paralelo tarefas que não compartilham arquivos** (veja a coluna "Arquivos" abaixo).
3. `src/main.js` é um gargalo: **só uma tarefa por vez** pode editá-lo. As tarefas listam se precisam dele.
4. Fluxo de cada tarefa: IA trabalha na branch → você abre o PR → **a IA A revisa o diff** (ou D testa, no caso da A) → você faz o merge → só então a próxima tarefa que dependa dela começa.
5. Antes de iniciar uma tarefa nova, **atualize a `main`** (`git switch main && git pull`) e crie a branch a partir dela.
6. Toda IA termina atualizando `PROGRESSO.md`.

---

## FASE 1 — Base e fluxo Git

### 1.1 — Limpeza e teste da validação · **IA D (Gemini Flash)**

- Branch: `fase1/limpeza`
- Arquivos: `src/assets/` (remoção), e relatório de testes. **Não editar** `scripts/validate.js`.
- Precisa do `main.js`? Não.

**Prompt:**

> Leia AGENTS.md/GEMINI.md, HANDOFF.md, PROGRESSO.md e DIVISAO.md. Sua tarefa é a **1.1**, branch `fase1/limpeza`.
>
> 1. Procure em todo o projeto (`src/`, `index.html`, `public/`) se `hero.png`, `javascript.svg` e `vite.svg` de `src/assets/` são importados ou referenciados. Se não forem, apague os três e rode `npm run build` para confirmar. Se algum for usado, não apague e me avise.
> 2. Sem alterar `scripts/validate.js`, teste a validação criando pastas temporárias em `apartamentos/` (não faça commit delas) para cada caso: nome de pasta com espaço/acento, arquivo com nome diferente da pasta, dois `.json` na pasta, JSON malformado, campo faltando, campo desconhecido, `corLuz` inválida, apartamento inexistente (ex.: 1105 e 501), apartamento duplicado. Para cada caso, registre se `npm run validate` falhou e se a mensagem em português está clara. Apague as pastas temporárias no fim.
> 3. Entregue o relatório em tabela (caso · esperado · obtido). Não corrija nada além da remoção dos assets; apenas relate falhas.

### 1.2 — `validate.js` reutiliza `parseApartment.js` · **IA B (Terra 5.6)**

- Branch: `fase1/validate-parse`
- Arquivos: `scripts/validate.js`, `src/data/parseApartment.js` (só se necessário para ficar JS puro)
- Precisa do `main.js`? Não. Pode rodar em paralelo com 1.1.

**Prompt:**

> Leia AGENTS.md, HANDOFF.md, PROGRESSO.md e DIVISAO.md. Sua tarefa é a **1.2**, branch `fase1/validate-parse`.
> O `scripts/validate.js` duplica a lógica de conversão de apartamento. O HANDOFF (4.3) exige uma função única. Faça `scripts/validate.js` importar e usar `src/data/parseApartment.js`, removendo a lógica duplicada. Garanta que `parseApartment.js` seja JS puro (sem `import.meta`, sem DOM) e funcione tanto no Vite quanto no Node. Não mude o comportamento nem as mensagens da validação. Confirme com `npm run validate`, `npm run build` e com um teste manual de um apartamento inválido e de um duplicado. Termine com o relatório do AGENTS.md.

### 1.R — Revisão da Fase 1 · **IA A (Luna 6)**

- Depois que 1.1 e 1.2 estiverem em PR.

**Prompt:**

> Revise criticamente os PRs `fase1/limpeza` e `fase1/validate-parse` contra o HANDOFF.md (seções 4, 4.5, 4B, 9). Procure: lógica duplicada que sobrou, comportamento de validação alterado, mensagens que perderam clareza, arquivos tocados fora do escopo, imports quebrados no build. Liste problemas por gravidade e diga se posso fazer o merge. Não edite código; só relate.

**Quando 1.R aprovar e os dois PRs forem mergeados, a Fase 1 está fechada. Atualize `PROGRESSO.md` para "Fase atual: 2".**

---

## FASE 2 — Moradores vivos

Podem rodar em paralelo: **2.1 (mobile)** e **2.3 (pessoinhas)**. A 2.2 mexe no `main.js`, então rode sozinha ou depois da 2.1 mergeada.

### 2.1 — Zoom mobile + nome dentro do apartamento · **IA A (Luna 6)**

- Branch: `fase2/mobile-zoom`
- Arquivos: `src/mobile/mobile.js`, `src/scene/cameraSetup.js` (se necessário), pequeno trecho no `main.js` para chamar `update()`.
- Precisa do `main.js`? Sim, mínimo.

**Prompt:**

> Leia AGENTS.md, HANDOFF.md (6D e 7), PROGRESSO.md e DIVISAO.md. Sua tarefa é a **2.1**, branch `fase2/mobile-zoom`.
> Bugs conhecidos em `src/mobile/mobile.js`: (a) o easing é aplicado ao delta restante a cada frame em vez de interpolar do estado inicial ao final com um `t` de 0 a 1; (b) o `lookAt` da câmera não é interpolado; (c) `MobileNameOverlay.updatePosition(x, y)` nunca é chamado, então o nome não aparece posicionado.
> Reescreva a transição: guarde posição/alvo iniciais e finais, avance `t` pelo delta de tempo (700–900 ms, independente de FPS), aplique easing ao `t`, interpole posição **e** `lookAt`, e a cada frame projete o ponto do apartamento na tela e chame `updatePosition`. A transição deve ser interrompível e reversível (tocar em outro apartamento troca o alvo a partir do estado atual, sem salto). Tocar fora ou em "voltar" retorna ao enquadramento original. Mantenha: apartamento apagado só dá pulso, sem zoom; hitboxes confortáveis (~40–44 px). Teste em emulação de celular (retrato e paisagem). Se encontrar algo que dependa de outro arquivo, relate em vez de editar.

### 2.2 — Linha-guia no desktop · **IA B (Terra 5.6)**

- Branch: `fase2/guideline`
- Arquivos: `src/ui/guideLine.js` e o trecho de hover no `main.js`.
- Precisa do `main.js`? Sim. **Não rode junto com 2.1.**

**Prompt:**

> Leia AGENTS.md, HANDOFF.md (seção 6), PROGRESSO.md e DIVISAO.md. Sua tarefa é a **2.2**, branch `fase2/guideline`.
> Bug real: `src/main.js` chama `guideLine.updateScreenPos(...)` enquanto a câmera se move, mas esse método não existe em `src/ui/guideLine.js` (TypeError que congela o loop). Implemente o método (ou ajuste a chamada) de modo que a linha-guia **acompanhe o quarto** quando o usuário orbita com o hover ativo. Confira também: traçado animado (300–500 ms), trajeto reta → inclinação 30–45° → reta, nome sobre o trecho final sempre legível e de frente para a tela, fade-in/out, uma linha por vez, lado de saída pelo lado mais próximo da borda visível, regra de inclinação (metade inferior para baixo, superior para cima) documentada em comentário. Em dispositivos de toque, a linha-guia não deve ser usada. Teste orbitando durante o hover.

### 2.3 — Pessoinhas · **IA C (Luna 5.6)**

- Branch: `fase2/pessoinhas`
- Arquivos: `src/scene/person.js` (e `building.js` só se estritamente necessário para o ponto de ancoragem).
- Precisa do `main.js`? Não. Pode rodar em paralelo com 2.1.

**Prompt:**

> Leia AGENTS.md, HANDOFF.md (3.6), PROGRESSO.md e DIVISAO.md. Sua tarefa é a **2.3**, branch `fase2/pessoinhas`.
> Revise `src/scene/person.js` contra o HANDOFF 3.6 e corrija o que faltar: figura em linhas brancas finas (sem preenchimento), 55–65% da altura do quarto, dentro do quarto perto da janela; fade-in 200–400 ms **depois** do brilho do quarto subir; sem pessoinha em quarto apagado; respiração/balanço sutil com fase diferente por pessoinha; billboard no eixo Y (encara a câmera ao orbitar); geometria compartilhada com instâncias, sem um objeto pesado por pessoa; brilho com a `corLuz` do morador. O aceno é opcional: só implemente se couber sem tocar em `main.js`.

### 2.T — Teste visual da Fase 2 · **IA D (Gemini Flash)**

- Depois de 2.1, 2.2 e 2.3 mergeadas.

**Prompt:**

> Rode `npm run dev` e teste no navegador contra os critérios de aceite da seção 9 do HANDOFF (itens de "Pessoinhas e modo celular" e "Interação e animação" ligados à linha-guia). Faça em desktop e em emulação de celular (retrato e paisagem). Para cada item: passou/falhou, com captura de tela quando falhar. Teste em especial: orbitar durante o hover, tocar em apartamento aceso/apagado, tocar fora, tocar em outro apartamento durante o zoom, pessoinhas encarando a câmera. Não corrija código; só relate.

### 2.R — Revisão · **IA A**

> Revise os PRs da Fase 2 contra o HANDOFF (3.6, 6, 6D). Foque em: interrupção/reversão de animações, independência de FPS, vazamento de listeners/objetos, e arquivos tocados fora do escopo. Só relate.

---

## FASE 3 — Cenário interativo

**3.1 e 3.2 mexem em arquivos diferentes, mas ambas precisam de uma pequena integração no `main.js`.** Faça a 3.1, dê merge, depois a 3.2 (ou peça que cada uma exponha o gancho em seu módulo e só uma delas integre).

### 3.1 — Postes · **IA B (Terra 5.6)**

- Branch: `fase3/postes`
- Arquivos: novo `src/scene/streetlights.js` (+ gancho no `main.js`).

**Prompt:**

> Leia AGENTS.md, HANDOFF.md (3.5, 6B, 6C), PROGRESSO.md e DIVISAO.md. Sua tarefa é a **3.1**, branch `fase3/postes`. Dois postes (um de cada lado da calçada, na altura da porta) com braço curvo e lâmpada, halo quente suave e leve cone de luz no chão. A luz **intensifica suavemente com a aproximação do vaga-lume/cursor** e, ao clicar, o poste liga/desliga com transição suave. Animações reversíveis, com easing e independentes de FPS. Crie um módulo próprio e exponha uma função `update(dt, pointerWorldPos)`; integre no `main.js` só com o mínimo necessário. Proporções: poste um pouco mais alto que a porta.

### 3.2 — Lixeira, porta e calçada · **IA C (Luna 5.6)**

- Branch: `fase3/lixeira-porta`
- Arquivos: novo `src/scene/sidewalk.js` / `bin.js` / `door.js` (+ gancho no `main.js`). Rode **depois** do merge da 3.1.

**Prompt:**

> Leia AGENTS.md, HANDOFF.md (3.5, 6B, 6C), PROGRESSO.md e DIVISAO.md. Sua tarefa é a **3.2**, branch `fase3/lixeira-porta`. (a) Calçada: contorno de meio-fio da porta até a frente da cena, com poucas linhas transversais discretas. (b) Lixeira verde ao lado da porta, na altura da cintura, com tampa e duas rodinhas: a tampa **abre um pouco com a aproximação** do vaga-lume e abre totalmente ao clique, fechando sozinha depois de alguns segundos (500–800 ms de animação). (c) Porta: ao clique abre levemente, luz quente por dentro, fecha devagar. Sem pessoas na calçada. Estados interrompíveis e reversíveis, independentes de FPS. Siga o padrão de módulo da 3.1 (`update(dt, pointerWorldPos)`).

### 3.R — Revisão e teste (A revisa, D testa no navegador)

---

## FASE 4 — Magia final

Rode **uma de cada vez**, pois quase todas encostam em `main.js` ou em materiais compartilhados. 4.4 pode rodar em paralelo com qualquer uma.

### 4.1 — Vaga-lume ilumina as linhas 3D · **IA A (Luna 6)**

- Branch: `fase4/firefly-luz`
- Arquivos: `src/fx/firefly.js`, materiais/shaders de prédio, calçada e postes (coordene com o que existir após as Fases 2 e 3).

**Prompt:**

> Leia AGENTS.md, HANDOFF.md (6B, 7), PROGRESSO.md e DIVISAO.md. Sua tarefa é a **4.1**, branch `fase4/firefly-luz`. Hoje o vaga-lume é só um elemento DOM 2D. Faça com que ele **ilumine suavemente as linhas próximas** do prédio, calçada, postes e lixeira, de preferência com um uniform de posição (mundo) compartilhado e um pequeno ajuste de opacidade/brilho por distância, sem iluminação real. Mantenha: atraso e oscilação orgânica, rastro curto, pulso de brilho lento, pulso no clique, desaparece fora da cena, aparece no ponto do toque no celular. Respeitar `prefers-reduced-motion`. Cuide do desempenho (60 fps).

### 4.2 — Entrada da câmera · **IA B (Terra 5.6)**

- Branch: `fase4/entrada-camera` · Arquivos: `src/scene/cameraSetup.js` (+ gancho no `main.js`).
  > Implemente a entrada de câmera lenta (1,5–2,5 s, easing, leve aproximação) ao carregar, sincronizada com os quartos acendendo de forma escalonada. No celular, deve terminar no enquadramento fixo. Interrompível se o usuário interagir no desktop. Respeitar `prefers-reduced-motion`.

### 4.3 — Modo leve e reduced-motion · **IA C (Luna 5.6)**

- Branch: `fase4/modo-leve`
  > Ative automaticamente o modo leve em dispositivo de toque (flag em `config.js`): menos estrelas, sem rastro do vaga-lume, halos simplificados, `devicePixelRatio` limitado a 1.5–2. Confirme que `prefers-reduced-motion` reduz oscilação, rastro e pulsações. Pause o render com a aba oculta. Reavalie a detecção (`pointer: coarse`/`hover: none`) ao girar o aparelho.

### 4.4 — Acessibilidade e fallback · **IA D (Gemini Flash)**

- Branch: `fase4/acessibilidade`
  > Confirme a lista `sr-only` de moradores, adicione mensagem amigável se o WebGL não estiver disponível (simule desativando WebGL), garanta que a página continua utilizável se o efeito do vaga-lume falhar e que o cursor normal volta fora da cena. Teste e relate; corrija somente o que for texto/HTML/CSS.

### 4.R — Revisão final · **IA A**

> Faça a auditoria final contra **toda** a seção 9 (critérios de aceite). Liste cada item como passou/falhou/não verificável, e aponte o que falta antes de publicar.

---

## Quadro de conflitos (resumo)

| Tarefa | Mexe em `main.js`? | Pode rodar junto com |
| ------ | ------------------ | -------------------- |
| 1.1    | não                | 1.2                  |
| 1.2    | não                | 1.1                  |
| 2.1    | pouco              | 2.3                  |
| 2.2    | sim                | — (sozinha)          |
| 2.3    | não                | 2.1                  |
| 3.1    | pouco              | —                    |
| 3.2    | pouco              | — (depois da 3.1)    |
| 4.1    | possivelmente      | 4.4                  |
| 4.2    | pouco              | 4.4                  |
| 4.3    | pouco              | 4.4                  |
| 4.4    | não                | qualquer             |

## Se uma IA travar

Se duas tentativas seguidas não resolverem, **não insista**. Passe a tarefa para a IA A com o relatório do que já foi tentado e o erro exato.
