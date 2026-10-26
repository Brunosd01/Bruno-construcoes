# Prédio 3D em Linhas Brancas 🏢✨

Um prédio 3D colaborativo em wireframe, onde cada pessoa acende uma luz ao enviar seu Pull Request. Projeto educacional para aprender Git na prática.

![Prédio 3D](https://img.shields.io/badge/3D-Three.js-blue) ![Vite](https://img.shields.io/badge/Build-Vite-646CFF) ![Node](https://img.shields.io/badge/Node-v24-green)

## 🎯 O que é

- Um site com um **prédio 3D** desenhado apenas com linhas brancas sobre fundo noturno
- Cada **apartamento** pode ser aceso por um participante, criando seu arquivo JSON por Pull Request
- O objetivo é **aprender Git** (clone, branch, commit, push, PR e pull) de forma visual e divertida

## 🚀 Como participar

Leia o [**CONTRIBUTING.md**](CONTRIBUTING.md) — lá tem o passo a passo completo para quem nunca usou Git.

## 💻 Rodar localmente (opcional)

```bash
# Use a versão de Node correta (veja .nvmrc)
nvm use             # ou instale a versão indicada no .nvmrc

# Instale as dependências
npm ci

# Rode o servidor de desenvolvimento
npm run dev
```

O site abre em `http://localhost:5173`. Alterações nos JSONs de `apartamentos/` aparecem automaticamente (hot reload).

### Validar dados

```bash
npm run validate
```

## 🛠️ Versões utilizadas

| Ferramenta | Versão                  |
| ---------- | ----------------------- |
| Node.js    | v24.20.0 (ver `.nvmrc`) |
| npm        | 11.x                    |
| Vite       | ~6.x                    |
| Three.js   | ~0.175.x                |

> Validado em outubro/2026.

## 📁 Estrutura de pastas

```
/apartamentos          → JSONs dos moradores (um por pessoa)
  /_modelo             → Exemplo para copiar (ignorado pelo site)
  /hiago           → Pasta de um morador
    hiago.json
/.github
  pull_request_template.md
  /workflows
    validate.yml       → CI: valida dados em todo PR
/scripts
  validate.js          → Script de validação (Node nativo)
/src
  main.js              → Ponto de entrada
  config.js            → Constantes ajustáveis
  /scene               → Prédio, chão, calçada, postes, lixeira, céu, lua, pessoinha
  /fx                  → Vaga-lume
  /mobile              → Detecção de toque, câmera fixa, zoom
  /data                → Carga de moradores, parser de apartamento
  /ui                  → Linha-guia, overlay de nomes
index.html
```

## ⚙️ Configurações do dono do repositório

Estas configurações precisam ser feitas **manualmente** no GitHub e na Vercel:

### GitHub — Proteção da branch `main`

Vá em **Settings → Branches → Add rule** para a branch `main`:

- [x] **Require a pull request before merging** (exigir PR)
- [x] **Require approvals** — 1 aprovação
- [x] **Require status checks to pass** — adicionar o check "Validar dados dos moradores"
- [x] **Require branches to be up to date before merging** — ⚠️ importante! Evita dois PRs com o mesmo apartamento
- [x] **Do not allow bypassing the above settings**
- [ ] **Allow force pushes** — desmarcar

### GitHub — Actions em PRs de fork

O primeiro PR de alguém que nunca contribuiu precisa que o dono aprove a execução do Actions:

- Vá em **Settings → Actions → General → Fork pull request workflows**
- Selecione **"Require approval for first-time contributors"**

### Vercel

1. Conecte o repositório na Vercel (plano Hobby é suficiente)
2. Framework preset: **Vite**
3. Build command: `npm run build` (a validação roda automaticamente como `prebuild`)
4. Output directory: `dist`
5. Os **previews por PR** são gerados automaticamente — ótimo para a turma ver o resultado antes do merge

> ⚠️ PRs vindos de forks podem precisar de aprovação na Vercel para gerar preview

### Ao final do projeto

1. Avise a turma que o repositório será apagado
2. Apague o projeto na Vercel (Dashboard → Settings → Delete)
3. Apague o repositório no GitHub (Settings → Danger Zone → Delete)
4. Os forks dos participantes continuam existindo

## 📄 Licença

Projeto educacional. Use à vontade.

# predio
