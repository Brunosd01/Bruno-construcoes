# HANDOFF — Site do Prédio 3D em Linhas Brancas

> Documento de passagem de bastão para a IA do IDE.
> Leia tudo antes de começar. Este arquivo descreve **o que** construir e **como deve parecer/se comportar**. As decisões de implementação estão sugeridas, mas você pode ajustá-las desde que o resultado visual e comportamental seja respeitado.

---

## 1. Visão geral

Um site de página única com uma cena 3D contendo:

- Um **prédio** em wireframe (somente linhas brancas suaves), fixado em um chão plano.
- Um **céu noturno** com muitas estrelas e uma lua, também desenhados em linhas/pontos brancos.
- Cada **apartamento** do prédio é um cômodo cuja janela/quarto pode **acender** com uma cor de luz definida pelo usuário.
- Os dados dos moradores vêm de **arquivos JSON individuais**, um por pessoa, dentro da pasta `apartamentos/` do repositório. O site lê esses arquivos e acende o quarto certo, no andar certo, com a cor informada.
- Novos moradores entram no prédio por **Pull Request**: a pessoa clona o repositório, cria uma branch, adiciona a própria pasta e abre um PR para o dono do projeto aprovar.
- Na frente do prédio, na porta, há uma **calçada** com **dois postes de luz** e uma **lixeira verde** ao lado da porta.
- Cada apartamento aceso mostra uma **pessoinha** (figura simples em linhas) que **aparece quando a luz acende**.
- No **celular** o prédio fica **estático**, de frente para o observador, sem arrastar nem pinçar. Dá para **tocar** em um apartamento: a câmera faz **zoom** nele e mostra o **nome da pessoa dentro do apartamento**.
- No **computador** o prédio é orbitável e o **mouse é um vaga-lume**: uma pequena luz que voa suavemente atrás do cursor, ilumina o que está perto e interage com os objetos da cena (no celular, aparece no ponto do toque).
- Todas as animações são **suaves** (easing, inércia, fades) e há **objetos interativos** (postes, lixeira, porta, quartos).
- Ao **passar o mouse (o vaga-lume)** sobre um quarto aceso, surge suavemente uma **linha-guia** que sai do quarto, segue reta, faz uma leve inclinação (para cima ou para baixo) e volta a seguir reta. Sobre o trecho reto final aparece o **nome da pessoa**.

---

## 2. Estética (regra mais importante)

- **Tudo é linha branca.** Nenhuma superfície preenchida, nenhuma textura.
- **Exceções controladas** (únicas cores permitidas além do branco):
  1. A **cor da luz dos quartos** (vem do JSON), incluindo o brilho colorido ao redor da pessoinha. A pessoinha em si é desenhada em linhas brancas.
  2. A **lixeira verde** ao lado da porta (linhas verdes suaves, mesmo estilo de linha fina e brilho discreto).
  3. A **luz quente dos postes** (um branco levemente amarelado) e a **cor do vaga-lume** (amarelo-esverdeado suave).
- Linhas **finas e suaves**, com leve transparência (opacidade em torno de 0.6–0.9) e um brilho discreto (halo). Nada agressivo ou estourado.
- Fundo **escuro** (preto ou azul-noite muito escuro) para as linhas se destacarem.
- Iluminação **suave**: o brilho dos quartos, dos postes e do vaga-lume deve parecer um halo delicado, nunca uma lâmpada forte.
- **Movimento suave em tudo:** nada aparece, some ou se move de forma brusca (ver seção 6B).
- Estilo geral: minimalista, limpo, contemplativo, noturno.

---

## 3. Elementos da cena

### 3.1 Prédio
- Modelo **3D** (volume real, câmera pode orbitar), desenhado apenas com as **arestas** (wireframe).
- Estrutura em **andares** e **apartamentos por andar**, formando uma grade regular na fachada.
- Cada apartamento mostra suas arestas de forma discreta; quando aceso, o interior ganha a cor da luz.
- Valores iniciais sugeridos (configuráveis em `config.js`):
  - 10 andares
  - 4 apartamentos por andar, todos na **fachada frontal** (a que tem a porta). Isso simplifica o hover e a leitura do nome.
- O prédio é **fixo no chão**: a base encosta no plano, sem flutuar nem afundar.
- A **porta** fica no centro do térreo, na fachada frontal.

### 3.2 Chão
- **Plano e vazio.** Sem grade e sem objetos, **exceto** a calçada, os postes e a lixeira descritos em 3.5.
- Pode ter um fade-out suave nas bordas para se fundir ao fundo.

### 3.3 Céu
- **Muitas estrelas**, como pontos brancos pequenos, com tamanhos e brilhos variados e **cintilação sutil** em parte delas.
- Uma **lua** em linhas brancas (contorno circular e poucas linhas de crateras), com brilho suave que "respira" bem devagar.
- As estrelas ficam distantes (domo/esfera ao redor da cena) e não são afetadas pelo zoom de forma estranha.

### 3.4 Câmera
- Câmera com **órbita** (arrastar para girar, scroll para zoom) com **inércia/damping**, de modo que o movimento desacelere suavemente.
- Limites: não passar abaixo do chão, não entrar no prédio, zoom mínimo e máximo. A órbita horizontal fica **limitada a um arco em torno da frente** (padrão ±80°, configurável), já que quartos, pessoinhas e a porta ficam só na fachada frontal.
- Posição inicial: de frente para a fachada com a porta, mostrando prédio, calçada e céu. Ao carregar, uma **entrada de câmera lenta** (leve aproximação) é bem-vinda.
- Rotação automática bem lenta quando ninguém interage (opcional, desligável).
- **Em celular a câmera é fixa**, sem órbita nem zoom por gesto. Ver seção 6D.

### 3.5 Calçada, postes e lixeira (frente do prédio)

Tudo em **linhas finas**, no mesmo estilo do prédio.

- **Calçada:** faixa retangular rasa e levemente elevada (contorno de meio-fio) que vai da **porta do prédio até a frente da cena**. Apenas o contorno e, no máximo, poucas linhas transversais discretas para sugerir placas de concreto.
- **Dois postes de luz:** um de cada lado da calçada, na altura da porta. Poste fino com braço curvo e uma lâmpada no topo.
  - Cada poste emite um **halo suave** de luz quente e um leve cone de luz no chão (em linhas ou degradê muito sutil).
  - **Interativo:** a luz **intensifica** quando o vaga-lume se aproxima e, ao clicar, o poste **pisca/liga-desliga** com transição suave.
- **Lixeira verde:** ao lado da porta, encostada na fachada. Contorno em **verde suave**, com tampa e, se possível, duas rodinhas.
  - **Interativo:** ao passar o vaga-lume, a tampa **abre um pouco**; ao clicar, abre por completo e fecha sozinha depois de alguns segundos, tudo com animação suave.
- **Porta:** contorno discreto no térreo.
  - **Interativo (opcional):** ao clicar, a porta **abre levemente** e uma luz quente suave aparece por dentro, e depois fecha devagar.
- As proporções devem ser coerentes entre si (postes um pouco mais altos que a porta, lixeira na altura da cintura de uma pessoa), sem pessoas na calçada (as únicas pessoas da cena ficam dentro dos apartamentos, ver 3.6).

---

### 3.6 Pessoinhas nos apartamentos

- Cada apartamento **aceso** mostra uma **pessoinha**: figura simples e simpática em **linhas finas brancas** (cabeça em círculo, tronco, braços e pernas em traços), no mesmo estilo do prédio. Sem rosto detalhado, sem preenchimento.
- Ela fica **dentro do quarto**, em pé, perto da janela, com cerca de 55–65% da altura do quarto.
- **Aparecimento:** quando a luz acende, primeiro o brilho do quarto sobe, e logo depois (atraso de ~200–400 ms) a pessoinha surge com **fade-in suave** (pode subir uns poucos pixels ao aparecer). Se o morador é removido, ela some com fade junto com a luz.
- **Quarto apagado = sem pessoinha.**
- **Vida sutil:** leve movimento de respiração/balanço contínuo, com fase diferente em cada pessoinha para não ficarem sincronizadas. Opcional: acenar quando o vaga-lume se aproxima (desktop) ou quando o apartamento é tocado e recebe zoom (celular).
- Todas usam a **mesma figura base**; só variam a fase da animação (e, opcionalmente, pequenas variações, ver pontos em aberto).
- Como a figura é plana, ela deve **girar em torno do eixo vertical para encarar a câmera** (billboard no eixo Y) para não aparecer de lado quando a câmera orbita.
- Desempenho: desenhar todas as pessoinhas com **uma geometria compartilhada e instâncias** (ou uma geometria única mesclada). Nada de criar objetos separados pesados por pessoa.
- A cor do **brilho** ao redor segue `corLuz` do morador.

---

## 4. Dados dos moradores (um JSON por pessoa)

### 4.1 Estrutura de pastas

Na raiz do repositório existe a pasta `apartamentos/`. Dentro dela, **uma pasta por pessoa**, e dentro de cada pasta **um arquivo `.json` com o mesmo nome da pasta**.

```
apartamentos/
  ana-souza/
    ana-souza.json
  bruno-lima/
    bruno-lima.json
  carla-dias/
    carla-dias.json
```

Regras de nomenclatura (a validação deve exigir):
- Nome da pasta em **minúsculas, sem acentos, sem espaços**, separado por hífen (slug). Ex.: "Ana Souza" → `ana-souza`.
- O arquivo dentro da pasta tem **exatamente o mesmo nome da pasta** + `.json`.
- Apenas **um arquivo `.json` por pasta**.
- Existe uma pasta **`apartamentos/_modelo/`** com um `_modelo.json` de exemplo para a pessoa copiar. **Pastas que começam com `_` são ignoradas** pelo site e pela validação.

### 4.2 Campos do JSON

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `nome` | texto | sim | Nome exibido na linha-guia ao passar o mouse (pode ter acentos e espaços) |
| `apartamento` | texto | sim | Identifica andar e posição do quarto |
| `corLuz` | texto | sim | Cor da luz do quarto em hex (ex.: `#ffcc66`) |

Exemplo (`apartamentos/ana-souza/ana-souza.json`):

```json
{
  "nome": "Ana Souza",
  "apartamento": "101",
  "corLuz": "#ffcc66"
}
```

Cada pessoa ocupa **um único apartamento** e cada apartamento pertence a **uma única pessoa**.

### 4.3 Convenção de numeração (assumida)
- O número do apartamento é **andar + posição**. O último dígito (ou os dois últimos, se houver mais de 9 apartamentos por andar) indica a posição no andar; o restante indica o andar.
  - `101` → andar 1, posição 01
  - `304` → andar 3, posição 04
  - `1002` → andar 10, posição 02
- Isolar essa regra em **uma única função utilitária** `apartamento → (andar, posição)`, fácil de trocar. A mesma função deve ser usada pelo site e pelo script de validação.

### 4.4 Como o site lê as pastas (ponto crítico)

Um site estático **não consegue listar o conteúdo de uma pasta** em tempo de execução. Portanto, a leitura de `apartamentos/*/*.json` deve acontecer **no build**, não no navegador. Opções, em ordem de preferência:

1. **Vite `import.meta.glob`** apontando para `apartamentos/*/*.json`: o Vite embute todos os JSON no bundle durante o build e no servidor de desenvolvimento. Simples e sem script extra.
2. **Script de build** que varre `apartamentos/`, valida e gera um único `moradores.json` (índice) em `public/data/`, executado antes do `dev` e do `build`.

Em qualquer opção, o resultado final é a lista de moradores que o restante do app consome (ver seção 5).

### 4.5 Validação (script compartilhado)

Criar um script de validação (ex.: `npm run validate`) usado **localmente e no CI**, e também executado **antes do `npm run build`**, para que dados inválidos nunca cheguem à publicação na Vercel. Ele deve falhar, com mensagem clara em português, quando:
- A pasta não segue o padrão de nome (slug) ou o arquivo não tem o mesmo nome da pasta.
- Há mais de um `.json` na pasta ou o JSON é inválido/malformado.
- Falta algum campo obrigatório ou há campos desconhecidos.
- `corLuz` não é um hex válido (`#rgb` ou `#rrggbb`).
- `apartamento` não existe no prédio (fora do número de andares/posições configurados).
- **Dois moradores usam o mesmo apartamento** (o segundo PR a chegar falha e a pessoa precisa escolher outro).
- O PR altera arquivos fora da pasta do próprio morador (aviso ou falha, ver seção 6).

### 4.6 Robustez no site
Mesmo com a validação, o site não pode quebrar:
- Apartamento inexistente ou duplicado: ignorar o registro e avisar no console.
- Cor inválida: usar um branco quente padrão e avisar no console.
- Nenhum morador encontrado: prédio todo apagado, sem erro visível.
- Quartos sem morador ficam **apagados** (somente linhas brancas).

---

## 4B. Fluxo de contribuição (clone → branch → Pull Request → pull)

O objetivo do projeto é que a turma **aprenda Git na prática**. Cada pessoa tem um quarto no prédio, e o dono do repositório aprova.

1. **Clonar** o repositório (`git clone`). Quem não tiver permissão de escrita faz primeiro um **fork** e clona o fork.
2. **Atualizar a `main`** (`git pull`) antes de começar, para pegar o estado mais recente.
3. **Criar uma branch** própria (`git switch -c morador/ana-souza`).
4. **Criar a pasta** `apartamentos/ana-souza/` com o arquivo `ana-souza.json` preenchido (nome, apartamento, corLuz).
5. **Commit e push** da branch (`git add`, `git commit`, `git push`).
6. **Abrir o Pull Request** para a `main`.
7. O **CI** roda a validação e a **Vercel gera um link de preview** do PR, onde a pessoa já vê o quarto aceso.
8. O dono **revisa e aprova** o PR e faz o merge.
9. A pessoa volta para a `main` (`git switch main`), faz **`git pull`** (ou "Sync fork" se usou fork) e vê o próprio quarto aceso no site publicado. Fechamento do ciclo.

### Arquivos a criar para suportar o fluxo
- **`CONTRIBUTING.md`**: passo a passo acima em linguagem simples para iniciantes, com cada comando acompanhado de **uma linha explicando o que ele faz**, um exemplo de JSON para copiar, a regra de nomes (slug), como escolher um apartamento livre e um **guia de autenticação** (`git config user.name` e `user.email`, e login por GitHub Desktop, `gh auth login` ou token), que é onde iniciantes mais travam. Incluir também um **aviso de privacidade**: o repositório é público, então o `nome` deve ser um apelido ou primeiro nome, sem dados pessoais, e o **e-mail dos commits fica público**, por isso orientar o uso do e-mail `noreply` do GitHub (Settings → Emails).
- **`.github/pull_request_template.md`**: checklist curto (pasta e arquivo com o nome certo, apartamento livre, cor em hex, validação passou).
- **`.github/workflows/validate.yml`**: roda a validação em todo PR.
- **`README.md`**: o que é o projeto, como rodar localmente (opcional) e as instruções de configuração do dono.

### Deploy: Vercel
- O deploy é feito pela **Vercel conectada ao repositório**, que publica a cada merge na `main`. **Não é necessário** workflow de deploy no GitHub Actions.
- Sem `base` especial no Vite (a Vercel serve na raiz do domínio).
- Os **previews por PR** são um recurso ótimo para o aprendizado. Atenção: PRs vindos de fork podem exigir aprovação do dono na Vercel para gerar o preview. Documentar no README.

### Configurações manuais do dono (a IA do IDE não consegue fazer)
- **Proteção da `main`** no GitHub: exigir Pull Request, exigir 1 aprovação, exigir que o check de validação passe, **exigir que a branch esteja atualizada com a `main` antes do merge** e bloquear push direto. Essa exigência evita dois PRs com o mesmo apartamento passarem juntos e ainda ensina a turma a atualizar a própria branch.
- **Actions em PRs de fork:** o primeiro PR de quem nunca contribuiu precisa da aprovação do dono para o Actions rodar.
- **Conectar o repositório na Vercel** (Hobby é suficiente para uso pessoal/educacional).
- Ao final do projeto, apagar o repositório (Settings → Danger Zone) e o projeto na Vercel. Avisar a turma antes, pois os forks continuam existindo.

---

## 5. Comportamento da luz dos quartos

- Cada quarto que possui um morador (um JSON em `apartamentos/`) **acende com a cor informada**.
- Aparência: brilho suave dentro do volume do quarto e um halo delicado em volta da janela/arestas. As linhas do quarto aceso podem assumir levemente a cor da luz, mas o prédio como um todo continua predominantemente branco.
- Sequência ao acender um quarto: brilho sobe → pessoinha aparece (ver 3.6).
- Os quartos acesos têm uma **pulsação muito sutil** de brilho (quase imperceptível), para a cena parecer viva.
- Entrada com **fade-in suave** ao carregar a página (pode ser escalonado, um quarto após o outro, de forma sutil).
- Como os dados são embutidos no build, novos moradores aparecem após o merge do PR e a republicação do site. Em desenvolvimento local, o hot reload deve refletir mudanças nas pastas.

---

## 6. Interação de hover (linha-guia + nome)

**Somente desktop (com mouse).** No celular não existe hover nem linha-guia: ver 6D. Ao passar o mouse (o vaga-lume) sobre um quarto **aceso**:

1. A linha **nasce na borda do quarto** e é desenhada com animação suave (efeito de "traçar" a linha, ~300–500 ms).
2. Trajeto da linha, nesta ordem:
   1. **Trecho reto** saindo do quarto (para fora da fachada / horizontalmente na tela).
   2. **Leve inclinação** para cima ou para baixo (ângulo pequeno, em torno de 30–45°, curta).
   3. **Novo trecho reto**, horizontal.
3. **Em cima do trecho reto final** aparece o **nome da pessoa**, apoiado sobre a linha (como um texto sublinhado pela própria linha). Aparece com fade-in suave.
4. Ao tirar o mouse, linha e nome **desaparecem suavemente** (fade-out).

Detalhes:
- A linha é branca, fina, com o mesmo brilho suave do resto. O nome em branco, fonte leve e elegante (sans-serif fina, com um pouco de espaçamento entre letras).
- **Direção da inclinação** (para cima ou para baixo): escolha uma regra consistente. Sugestão: quartos na metade inferior do prédio inclinam para baixo; os da metade superior, para cima — assim a linha nunca cobre outros quartos. Documente a regra escolhida.
- **Lado de saída** (esquerda/direita): sair pelo lado mais próximo da borda do prédio visível na tela, para o texto nunca ser cortado.
- A linha-guia e o texto devem **acompanhar a câmera** (se o usuário girar o prédio enquanto o hover estiver ativo, a linha segue o quarto). O texto deve permanecer **legível** (sempre de frente para a tela, sem perspectiva distorcida).
- Apenas **uma linha-guia por vez**.
- Em dispositivos de toque esta linha-guia **não é usada**; vale o comportamento de 6D.

---

## 6B. O mouse como vaga-lume

- O cursor padrão do sistema fica **oculto sobre a cena** e é substituído por um **vaga-lume**: um pequeno ponto de luz amarelo-esverdeado suave, com halo delicado.
- **Movimento:** o vaga-lume **não gruda no cursor**. Ele o segue com atraso e suavidade (lerp/inércia) e tem uma **leve oscilação** orgânica, como se estivesse voando. Também deixa um **rastro curto** que se dissolve rapidamente.
- **Brilho** que pulsa bem devagar, como um vaga-lume real.
- **Ilumina o ambiente:** ao se aproximar, aumenta suavemente o brilho das linhas próximas (prédio, calçada, postes, lixeira). Basta um efeito sutil de "luz passando", sem cálculo de iluminação real.
- **Interage com os objetos** da seção 3.5 e com os quartos (hover da seção 6). O hover é calculado a partir da posição do vaga-lume/cursor.
- **Clique:** aciona o objeto sob o vaga-lume (poste, lixeira, porta). Ao clicar, o vaga-lume dá um pequeno "pulso" de luz.
- **Fora da cena** (mouse fora da janela ou sobre elementos de interface), o vaga-lume desaparece com fade e o cursor normal volta.
- **Toque/celular:** não há cursor para seguir. O vaga-lume **aparece no ponto do toque**, dá um pequeno pulso de luz, paira ali por alguns segundos e desaparece com fade.
- **Acessibilidade:** respeitar `prefers-reduced-motion` (reduzir oscilação, rastro e pulsações). Garantir que a página continue utilizável se o efeito falhar.

## 6C. Animações e interações (princípios)

- **Toda transição usa easing** (ease-in-out ou suavização exponencial). Nada de mudanças instantâneas.
- Durações de referência: hover e fades de 250–500 ms; abertura da lixeira e da porta de 500–800 ms; entrada inicial da cena de 1,5–2,5 s (com quartos acendendo escalonados).
- **Estados reversíveis e interrompíveis:** se o usuário sair e voltar rápido, a animação reverte de onde estava, sem salto.
- Animações **independentes do FPS** (usar o tempo decorrido entre frames, não passos fixos).
- **Objetos interativos:** quartos (linha-guia e nome), postes (luz intensifica e liga/desliga), lixeira (tampa), porta (abre e fecha) e a lua (leve brilho extra ao passar o vaga-lume, opcional).
- Evitar excesso: no máximo poucos elementos animando de forma chamativa ao mesmo tempo, para a cena continuar contemplativa.

---

## 6D. Modo celular (câmera fixa + toque)

**Detecção:** usar `matchMedia('(pointer: coarse)')` / `(hover: none)`, não o tamanho da tela nem o user agent. Reavaliar ao girar o aparelho.

**Câmera e gestos**
- O prédio fica **estático e parado, de frente para o observador**, sem órbita, sem arrastar e sem zoom por pinça. O ajuste de câmera é automático para **enquadrar o prédio inteiro** (e a calçada) na tela, em retrato ou paisagem.
- A página **não deve rolar nem dar zoom nativo** sobre a cena (`touch-action` apropriado e `viewport` sem zoom do usuário só na área da cena). Evitar prender o usuário: não bloquear gestos do sistema.
- O céu, as estrelas, a lua, as pessoinhas e as luzes continuam animando normalmente (movimento de elementos, não de câmera).

**Toque em um apartamento aceso**
1. A câmera faz **zoom suave** (≈ 700–900 ms, com easing) até o apartamento tocado, que passa a ocupar boa parte da tela.
2. A **pessoinha** fica em destaque (e pode acenar) e o **nome da pessoa aparece dentro do apartamento**, em texto branco, centralizado, perto da pessoinha, com fade-in. Não usar a linha-guia do desktop.
3. Os outros apartamentos **escurecem levemente** durante o zoom, para dar foco (opcional).
4. Para **sair do zoom**: tocar fora do apartamento, ou em um botão discreto "voltar"/"×". A câmera volta suavemente ao enquadramento original. Tocar em outro apartamento aceso troca o zoom direto para ele, também com transição suave.

**Outros toques**
- Apartamento **apagado**: só o pulso do vaga-lume, sem zoom.
- Postes, lixeira e porta funcionam por toque, **sem zoom**, apenas com as animações de 3.5.
- Fora de tudo: nada além do pulso do vaga-lume.

**Alvo de toque**
- Os apartamentos devem ter **área de toque confortável** (meta: ~40–44 px). As hitboxes podem ser ligeiramente **maiores que o desenho**. Se o prédio ficar pequeno demais no retrato, reduzir apartamentos por andar ou o número de andares (configurável).

**Desempenho no celular:** `devicePixelRatio` limitado a 1.5–2, **modo leve** automático (menos estrelas, sem rastro do vaga-lume, halos simplificados) e `prefers-reduced-motion` respeitado.

---

## 7. Stack e sugestão técnica

Projeto simples, para ensinar Git. Prefira o mínimo de dependências e de ferramentas.

- **Vite + Three.js + JavaScript puro** (sem TypeScript, sem frameworks).
- **Linhas:** `EdgesGeometry` + `LineSegments` com `LineBasicMaterial` transparente (linha fina nativa já combina com o estilo; não usar bibliotecas de linhas grossas).
- **Brilho suave:** começar com **halos** (sprites com textura radial e blending aditivo) e opacidade das linhas. Usar **bloom** (`UnrealBloomPass`) apenas se o resultado ficar sem graça, e de forma discreta.
- **Estrelas:** `Points` com tamanho e brilho variáveis, distribuídos em esfera grande; cintilação sutil via atributo/shader simples.
- **Vaga-lume:** elemento 2D (canvas ou elementos HTML/CSS) sobre a cena seguindo o mouse com lerp; o brilho nos objetos próximos pode ser feito com um uniform de posição ou apenas aumentando a opacidade dos objetos mais próximos.
- **Hover e cliques:** **raycasting** contra hitboxes invisíveis (quartos, porta, postes, lixeira).
- **Linha-guia e nome:** calcular o ponto do quarto projetado na tela e desenhar a polilinha (reta → inclinação → reta) em **overlay SVG** atualizado a cada frame; o nome em elemento SVG/HTML sobre o trecho final.
- **Animações:** helpers próprios de interpolação (lerp/damp com easing). Uma biblioteca como GSAP é opcional.
- **Dados:** `apartamentos/*/*.json` lidos **no build** (ver 4.4).
- **Desempenho:** limitar `devicePixelRatio` (máx. 2), pausar o render com a aba oculta, reaproveitar geometrias e materiais.
- **Config central:** `config.js` com andares, apartamentos por andar, intensidades de brilho, cores (poste, vaga-lume, lixeira) e durações.
- **Pessoinha:** uma geometria de linhas pequena (poucos segmentos) compartilhada por instâncias (`InstancedMesh`/mesclada); billboard no eixo Y; animação de respiração por um uniform de tempo com fase por instância.
- **Zoom no celular:** animar a posição/`lookAt` da câmera até o apartamento com easing; o nome é um elemento **HTML posicionado sobre o apartamento** projetado na tela, atualizado a cada frame durante a transição.
- **Modo leve:** flag em `config.js`, ativada automaticamente em celular, que reduz estrelas, desliga rastro e simplifica halos.
- **Acessibilidade:** além da cena, manter no HTML uma **lista oculta visualmente** (`sr-only`) com nome e apartamento de cada morador, e uma mensagem amigável se o WebGL não estiver disponível.
- **Deploy:** Vercel (ver 4B).

---
## 8. Estrutura de pastas sugerida

```
/apartamentos
  /_modelo           (exemplo para copiar; ignorado pelo site)
    _modelo.json
  /ana-souza
    ana-souza.json
  /...
/.github
  pull_request_template.md
  /workflows
    validate.yml
/scripts
  validate.js        (validação compartilhada, ver 4.5; sem dependências)
/src
  main.js            (ponto de entrada)
  config.js          (constantes ajustáveis)
  /scene             (prédio, porta, chão, calçada, postes, lixeira, pessoinhas, céu, lua, câmera)
  /fx                (vaga-lume, halos, animações/easing)
  /mobile            (detecção de toque, câmera fixa, zoom no apartamento)
  /data              (carga dos moradores, conversão de apartamento)
  /ui                (linha-guia, nome, overlay)
index.html
README.md
CONTRIBUTING.md
```

---

## 9. Critérios de aceite

**Visual**
- [ ] Visual todo em linhas finas brancas com brilho suave, fundo escuro; únicas cores extras são a luz dos quartos, a lixeira verde, a luz dos postes e o vaga-lume.
- [ ] Prédio 3D, orbitável (com inércia), fixo em um chão plano e vazio.
- [ ] Céu com muitas estrelas e uma lua em linhas.
- [ ] Calçada na frente da porta, dois postes de luz e uma lixeira verde ao lado da porta.

**Interação e animação**
- [ ] O mouse é um vaga-lume que segue com suavidade, oscila levemente, deixa rastro curto e ilumina as linhas próximas.
- [ ] Postes intensificam a luz com a aproximação do vaga-lume e ligam/desligam ao clique.
- [ ] A tampa da lixeira abre com a aproximação e abre por completo ao clique, fechando sozinha depois.
- [ ] Todas as animações usam easing, são reversíveis e não dependem do FPS.
- [ ] `prefers-reduced-motion` é respeitado.
- [ ] Hover em quarto aceso mostra a linha: reta → leve inclinação → reta, com o nome sobre o trecho final, com fade suave de entrada e saída.

**Pessoinhas e modo celular**
- [ ] Cada apartamento aceso mostra uma pessoinha em linhas brancas, que surge com fade logo após a luz acender; apartamento apagado não tem pessoinha.
- [ ] As pessoinhas encaram a câmera e têm uma animação sutil e dessincronizada.
- [ ] No celular o prédio é estático e de frente; não há órbita, arrasto nem zoom por gesto.
- [ ] No celular, tocar em um apartamento aceso dá zoom suave nele e mostra o nome **dentro do apartamento**; tocar fora ou em "voltar" retorna suavemente.
- [ ] No celular, a área de toque dos apartamentos é confortável e o prédio inteiro cabe na tela em retrato e em paisagem.
- [ ] No desktop continuam valendo a órbita, o vaga-lume e a linha-guia com o nome.

**Dados e Git**
- [ ] Adicionar `apartamentos/<nome>/<nome>.json` acende o quarto correto na cor correta (em dev e no build).
- [ ] Quartos sem morador permanecem apagados.
- [ ] Existe `apartamentos/_modelo/` ignorada pelo site e pela validação.
- [ ] O `build` roda a validação antes de gerar o site.
- [ ] A validação detecta pasta/arquivo com nome errado, apartamento inexistente, apartamento duplicado e cor inválida, com mensagens em português.
- [ ] O CI roda a validação em todo PR e a Vercel gera preview do PR.
- [ ] `CONTRIBUTING.md` explica clone, branch, push, PR **e pull** para quem nunca usou Git.
- [ ] README documenta as configurações manuais do dono (proteção da `main` com branch atualizada, Vercel, Actions em PRs de fork).
- [ ] `CONTRIBUTING.md` traz o aviso de privacidade (apelido, e-mail `noreply`).
- [ ] JSON inválido ou apartamento duplicado não quebra o site.

**Qualidade**
- [ ] Desempenho fluido (meta: 60 fps em notebook comum).
- [ ] Configurações principais em `config.js`.

---

## 9B. Ordem de entrega sugerida (fases)

O objetivo do projeto é ensinar Git. Por isso, entregar em fases curtas para a turma poder **começar a contribuir cedo**, e só depois caprichar nos efeitos.

1. **Base e fluxo Git:** prédio em linhas, chão, céu com estrelas e lua, leitura de `apartamentos/`, quartos acendendo com a cor, validação, CI, Vercel, `CONTRIBUTING.md`, template de PR e `_modelo`. Já dá para a turma começar a mandar PRs.
2. **Moradores vivos:** pessoinhas, hover com linha-guia e nome (desktop) e **modo celular** com zoom e nome no apartamento.
3. **Cenário interativo:** porta, calçada, postes e lixeira com suas interações.
4. **Magia final:** vaga-lume, animações de polimento, modo leve, bloom (se necessário) e acessibilidade.

Cada fase deve terminar com o site funcionando e publicado.

---

## 10. Pontos em aberto (perguntar ao usuário se necessário)

1. Quantos andares e quantos apartamentos por andar o prédio final deve ter? (padrão: 10 e 4)
2. A convenção de numeração (andar + posição) está correta?
3. O nome da pasta usa o nome da pessoa (slug) ou o **usuário do GitHub**? (padrão: nome em slug)
4. Os contribuidores serão **colaboradores** ou usarão **fork**? (padrão: fork. Só colaboradores podem criar branch direto no repositório, mesmo ele sendo público.)
5. A rotação automática da câmera vem ligada ou desligada? (padrão: desligada)
6. A porta deve abrir ao clique? (padrão: sim, de forma discreta)
7. No **desktop**, clicar em um apartamento também deve dar zoom e mostrar o nome dentro dele, como no celular? (padrão: não; desktop usa a linha-guia)
8. As pessoinhas são **todas iguais** ou devem ter pequenas variações (altura, cabelo, chapéu)? (padrão: todas iguais, só a animação varia)
9. A órbita no desktop deve ser limitada à frente do prédio (±80°) ou livre em 360°? (padrão: limitada)

Enquanto não houver resposta, **adote os padrões indicados** e deixe tudo configurável.
