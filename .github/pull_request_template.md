## Checklist do Pull Request

Antes de enviar, confira:

- [ ] Criei a pasta `apartamentos/<meu-nome>/` com meu nome em slug (minúsculas, sem acentos, sem espaços, hífens entre palavras).
- [ ] Dentro da pasta, o arquivo JSON tem **exatamente o mesmo nome** da pasta + `.json` (ex.: `ana-souza/ana-souza.json`).
- [ ] Os três campos estão preenchidos: `nome`, `apartamento`, `corLuz`.
- [ ] O `apartamento` é um número válido (ex.: `101` = andar 1, posição 1) e **não está ocupado** por outra pessoa.
- [ ] A `corLuz` é uma cor hex válida (ex.: `#ff6600` ou `#f60`).
- [ ] Rodei `npm run validate` localmente e **passou sem erros**.
- [ ] Não alterei arquivos fora da minha pasta.
