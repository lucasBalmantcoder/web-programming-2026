\ufeff# PJNPA

## Visão geral

O PJNPA é uma aplicação web educativa sobre produtos naturais da Amazônia e sua relação com a química. O projeto foi construído com HTML, CSS e JavaScript puro, sem dependências externas ou banco de dados.

## Como o projeto funciona

Ao abrir o arquivo `index.html`, o navegador monta a interface, carrega os estilos de `estilo.css` e executa as interações definidas em `script.js`. Os dados usados pela página ficam em listas dentro do próprio JavaScript, portanto a aplicação funciona localmente e não precisa consultar uma API.

O fluxo principal da aplicação é:

```text
Usuário → Interface → Lógica da aplicação → Dados/recursos → Resultado na interface
```

1. O usuário informa seu nome e recebe uma saudação personalizada.
2. O botão de modo escuro alterna a aparência da página.
3. A seção de detalhes pode ser expandida ou recolhida.
4. O botão de curiosidades percorre uma lista de informações e atualiza o contador.
5. O quiz verifica a alternativa escolhida e libera a próxima pergunta.
6. O formulário valida o e-mail e a mensagem e mostra o resultado na própria página.

Essa separação facilita a manutenção do código e permite evoluir cada parte do projeto sem comprometer as demais.

## Estrutura do projeto

```text
pjnpa/
├── index.html       # Estrutura e conteúdo da página
├── estilo.css       # Estilos, cores e layout
├── script.js        # Interações, dados locais, quiz e validações
├── README.md        # Documentação do projeto
└── .gitignore       # Arquivos ignorados pelo Git
```

## Pré-requisitos

- Um navegador atualizado;
- Um editor de código, caso queira alterar o projeto.

Não é necessário instalar Node.js, npm ou outras dependências para executar a versão atual.

## Execução

1. Abra a pasta do projeto no computador.
2. Abra o arquivo `index.html` diretamente no navegador.

Como alternativa, no VS Code, use a extensão **Live Server**, clique com o botão direito em `index.html` e selecione **Open with Live Server**.

Depois de abrir a página, teste o nome, o modo escuro, as curiosidades, o quiz e o formulário.

## Desenvolvimento

As alterações podem ser feitas diretamente nos arquivos:

- Edite a estrutura e os textos em `index.html`.
- Edite o visual em `estilo.css`.
- Edite as regras e os dados da aplicação em `script.js`.

## Fluxo de desenvolvimento

1. Crie uma branch para sua alteração.
2. Implemente a funcionalidade ou correção.
3. Teste a aplicação localmente.
4. Revise as alterações e faça um commit descritivo.

## Status

Projeto em desenvolvimento.

## Licença

Nenhuma licença foi definida até o momento.
