# Como Participar — Prédio 3D 🏢✨

Bem-vindo(a)! Este guia explica, passo a passo, como adicionar o seu quarto ao prédio 3D colaborativo. Não precisa saber programar — o objetivo é **aprender Git** na prática.

---

## ⚠️ Aviso de Privacidade

Este repositório é **público**. Qualquer pessoa na internet pode ver o que está aqui. Por isso:

- No campo `nome` do seu JSON, use um **apelido ou primeiro nome**. Não coloque nome completo, telefone ou dados pessoais.
- Os **commits do Git registram seu e-mail**. Para manter seu e-mail pessoal privado, use o e-mail `noreply` do GitHub:
  1. Vá em [github.com/settings/emails](https://github.com/settings/emails).
  2. Marque **"Keep my email addresses private"**.
  3. Copie o e-mail que aparece (algo como `12345678+seu-usuario@users.noreply.github.com`).
  4. Configure no Git:
     ```bash
     git config --global user.email "12345678+seu-usuario@users.noreply.github.com"
     ```

---

## 1. Preparação (uma vez só)

### 1.1. Instalar o Git

- **Windows:** Baixe em [git-scm.com](https://git-scm.com) e instale com as opções padrão.
- **Mac:** Abra o Terminal e rode `xcode-select --install`.
- **Linux:** `sudo apt install git` (Ubuntu/Debian) ou `sudo dnf install git` (Fedora).

### 1.2. Configurar seu nome e e-mail no Git

O Git precisa saber quem é você para registrar nos commits:

```bash
# Define seu nome (aparece nos commits)
git config --global user.name "Seu Apelido"

# Define seu e-mail (use o noreply do GitHub — veja o aviso acima)
git config --global user.email "12345678+seu-usuario@users.noreply.github.com"
```

### 1.3. Autenticação no GitHub

Para enviar código ao GitHub, você precisa se autenticar. Escolha **uma** opção:

**Opção A — GitHub Desktop (mais fácil)**
1. Baixe em [desktop.github.com](https://desktop.github.com).
2. Faça login com sua conta do GitHub.
3. Pronto! O app cuida da autenticação.

**Opção B — GitHub CLI (`gh`)**
1. Instale: [cli.github.com](https://cli.github.com).
2. Rode: `gh auth login` e siga as instruções.

**Opção C — Token pessoal**
1. Vá em [github.com/settings/tokens](https://github.com/settings/tokens).
2. Gere um token com permissão `repo`.
3. Quando o Git pedir sua senha, cole o token no lugar.

---

## 2. Fork e clone

Como você provavelmente **não tem permissão de escrita** no repositório original, precisa fazer um **fork** (cópia para sua conta):

```bash
# 1. No GitHub, clique no botão "Fork" no canto superior direito da página do repositório.

# 2. Clone o SEU fork (troque SEU-USUARIO pelo seu nome de usuário no GitHub):
git clone https://github.com/SEU-USUARIO/predio.git
# ↑ Isso baixa uma cópia completa do repositório para o seu computador.

# 3. Entre na pasta do projeto:
cd predio
```

---

## 3. Criar uma branch

Branches são como "rascunhos" separados. Você trabalha na sua branch sem afetar a versão principal.

```bash
# Primeiro, garanta que está na branch principal e atualizada:
git switch main
# ↑ Troca para a branch principal (main).

git pull
# ↑ Baixa as alterações mais recentes do GitHub para o seu computador.

# Crie sua branch (troque "ana-souza" pelo seu nome em slug):
git switch -c morador/ana-souza
# ↑ Cria uma nova branch chamada "morador/ana-souza" e já entra nela.
```

---

## 4. Adicionar seu apartamento

### 4.1. Escolher um apartamento livre

O prédio tem **10 andares** e **4 apartamentos por andar**. O número do apartamento segue a regra: **andar + posição**.

| Andar | Posição 1 | Posição 2 | Posição 3 | Posição 4 |
|-------|-----------|-----------|-----------|-----------|
| 1     | 101       | 102       | 103       | 104       |
| 2     | 201       | 202       | 203       | 204       |
| ...   | ...       | ...       | ...       | ...       |
| 10    | 1001      | 1002      | 1003      | 1004      |

Para ver quais apartamentos já estão ocupados, olhe a pasta `apartamentos/` ou rode `npm run validate`.

### 4.2. Criar sua pasta e arquivo

Dentro da pasta `apartamentos/`, crie uma pasta com seu nome em **slug** (minúsculas, sem acentos, hífens entre palavras):

```
apartamentos/
  ana-souza/          ← pasta com seu nome em slug
    ana-souza.json    ← arquivo com EXATAMENTE o mesmo nome da pasta
```

### 4.3. Preencher o JSON

Copie o modelo de `apartamentos/_modelo/_modelo.json` e preencha:

```json
{
  "nome": "Ana Souza",
  "apartamento": "101",
  "corLuz": "#ffcc66"
}
```

| Campo | O que colocar |
|---|---|
| `nome` | Seu nome ou apelido (pode ter acentos e espaços) |
| `apartamento` | Número do apartamento escolhido (ex.: `"101"`) |
| `corLuz` | Cor da luz do seu quarto em hexadecimal (ex.: `"#ff6600"`) |

> 💡 **Dica:** Escolha sua cor favorita em [htmlcolorcodes.com](https://htmlcolorcodes.com/color-picker/).

### 4.4. Validar (opcional, mas recomendado)

```bash
npm run validate
# ↑ Verifica se seu JSON está correto e se o apartamento está livre.
```

---

## 5. Commit e push

```bash
# 1. Veja o que mudou:
git status
# ↑ Mostra os arquivos que foram criados ou alterados.

# 2. Adicione seus arquivos ao próximo commit:
git add apartamentos/ana-souza/
# ↑ Marca a pasta inteira para ser incluída no commit.

# 3. Faça o commit (salva suas alterações no histórico do Git):
git commit -m "feat: adiciona morador Ana Souza (apt 101)"
# ↑ A mensagem entre aspas descreve o que você fez.

# 4. Envie para o GitHub:
git push -u origin morador/ana-souza
# ↑ Envia sua branch para o seu fork no GitHub.
#    O "-u origin" diz ao Git para lembrar de onde enviar no futuro.
```

---

## 6. Abrir o Pull Request

1. Vá até o **seu fork** no GitHub (github.com/SEU-USUARIO/predio).
2. Você verá um banner amarelo dizendo que sua branch foi enviada. Clique em **"Compare & pull request"**.
3. Preencha o checklist do PR.
4. Clique em **"Create pull request"**.

O **CI (validação automática)** vai rodar e verificar se tudo está certo. Se passar, a **Vercel** gera um **link de preview** onde você já pode ver seu quarto aceso! 🎉

---

## 7. Depois que o PR for aprovado

Quando o dono do repositório aprovar e fizer o merge:

```bash
# 1. Volte para a branch principal:
git switch main
# ↑ Sai da sua branch e volta para a main.

# 2. Sincronize seu fork com o repositório original:
#    No GitHub, vá ao seu fork e clique em "Sync fork" → "Update branch".

# 3. Baixe as mudanças para o seu computador:
git pull
# ↑ Agora seu computador tem a versão mais recente, incluindo seu quarto!
```

Acesse o site publicado e veja o seu quarto aceso no prédio! 🏢✨

---

## Dúvidas?

- **Erro na validação?** Leia a mensagem de erro — ela explica o que está errado.
- **Apartamento ocupado?** Escolha outro número e atualize seu JSON.
- **Conflito no PR?** Sincronize seu fork, atualize sua branch com `git merge main` e resolva.
- **Erro de autenticação?** Revise a seção 1.3 acima.
