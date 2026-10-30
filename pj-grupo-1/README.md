# Catálogo Interativo de Produtos 🛍️

Trabalho prático da disciplina de **Programação Web** (Curso de Ciência da Computação / Engenharia de Software / Sistemas de Informação).

Aplicação web _client-side_ desenvolvida exclusivamente com **HTML5**, **CSS3** e **JavaScript Puro (Vanilla JS)**, sem o uso de bibliotecas, frameworks ou ferramentas de build. A aplicação consome a API pública RESTful **DummyJSON Products**, provendo busca em tempo real, visualização detalhada em modal e persistência de favoritos via `localStorage`.

---

## 👥 Integrantes da Equipe (Grupo 01)

| Nome Completo                     | Matrícula      | E-mail Institucional              |
| :-------------------------------- | :------------- | :-------------------------------- |
| _[Lucas Patrik Lopes dos Santos]_ | _[2021015036]_ | _[lucaspatrickr5@gmail.com]_      |

---

## 🚀 Funcionalidades da Aplicação

### 1. Catálogo e Exibição de Produtos

- Listagem dinâmica em grade responsiva com **30 produtos** carregados da API pública.
- Cada cartão de produto (`<article>`) exibe:
    - Imagem do produto com tratamento de erro (_fallback image_) e _lazy loading_.
    - Título do produto com truncamento inteligente (_line-clamp_).
    - Categoria em destaque e marca do fabricante.
    - Avaliação numérica e estrelas (ex: ★ 4.5).
    - Preço formatado em moeda (`US$ XX,XX`) e percentual de desconto quando aplicável.
    - Indicador de estoque disponível com alerta para estoque baixo.
    - Botão de favoritar rápido com animação e atualização em tempo real.
    - Botão **"Ver Detalhes"**.

### 2. Pesquisa de Produtos por Nome

- Formulário com evento `submit` sem recarregar a página (`event.preventDefault()`).
- Consumo do endpoint oficial de busca da API: `https://dummyjson.com/products/search?q={termo}`.
- Botão interativo de limpar campo (ícone **"&times;"**) exibido automaticamente ao digitar.
- Mensagem informativa de **"Nenhum produto encontrado"** com botão de retorno ao catálogo original.
- Resumo com contagem dinâmica de produtos encontrados.

### 3. Modal de Informações Detalhadas

- Janela modal acessível e responsiva com fundo translúcido (_backdrop blur_).
- Galeria interativa com troca dinâmica de imagem ao clicar nas miniaturas.
- Informações completas do produto:
    - Título completo e categoria.
    - Código identificador (SKU).
    - Preço atual e destaque de desconto promocional.
    - Descrição técnica detalhada.
    - Avaliação com estrelas.
    - Disponibilidade de estoque.
    - Informações de garantia (_Warranty_).
    - Prazo e condições de envio (_Shipping Information_).
    - Política de devoluções (_Return Policy_).
- Botão de favoritar sincronizado diretamente no modal.
- Fechamento facilitado: botão "Fechar", clique no fundo escuro ou tecla **ESC**.

### 4. Gestão e Persistência de Favoritos (`localStorage`)

- **Painel lateral deslizante (_Drawer_)**:
    - Exibe todos os produtos favoritados.
    - Permite remoção direta de cada item.
    - Permite abrir os detalhes do produto diretamente a partir dos favoritos.
    - Totalizador dinâmico de valor estimado de todos os favoritos salvos.
    - Botão de **"Limpar Todos os Favoritos"** com caixa de confirmação.
- **Filtro em Grade**: aba **"Apenas Favoritos"** na barra de ferramentas principal para navegar apenas pelos itens favoritados.
- **Persistência total**: os favoritos continuam salvos e são recarregados mesmo após fechar ou atualizar o navegador (`JSON.stringify` e `JSON.parse`).
- **Tratamento defensivo de erros**: recuperação automática em caso de `localStorage` vazio ou corrompido.

### 5. Feedbacks Visuais e Estados de Interface

- **Carregamento (_Loading Spinner_)**: exibido enquanto a requisição HTTP está em andamento.
- **Tratamento de Erros de Rede**: tela amigável informando falha de comunicação com botão **"Tentar Novamente"**.
- **Notificações Toast**: alertas flutuantes no canto inferior direito ao adicionar ou remover favoritos.

---

## 📁 Estrutura de Arquivos

```text
pj-grupo-1/
├── index.html          # Marcação semântica da aplicação (header, main, sections, modal, aside, footer)
├── css/
│   └── style.css       # Estilização completa, variáveis CSS, grid, flexbox, modal e responsividade
├── js/
│   └── script.js       # Lógica da aplicação, consumo da API, manipulação do DOM e persistência
└── README.md           # Documentação técnica, dados dos integrantes e instruções de entrega
```

---

## 🛠️ Tecnologias e Conceitos Aplicados

- **HTML5 Semântico**: uso correto de `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<nav>`, `<footer>` e atributos de acessibilidade ARIA (`aria-live`, `aria-label`, `role="dialog"`).
- **CSS3 Moderno**: CSS Custom Properties (_Variables_), Grid Layout, Flexbox, Media Queries (Desktop, Tablet e Mobile), Animações CSS (@keyframes).
- **JavaScript Moderno (ES6+)**:
    - Manipulação direta da árvore DOM via `document.createElement`, `appendChild`, `classList`, `setAttribute` e `addEventListener`.
    - Controle de fluxo e estruturas de repetição (`forEach`, `filter`, `find`, `some`, `reduce`).
    - Funções assíncronas com `async/await` e tratamento com bloco `try...catch...finally`.
    - Consumo HTTP via `fetch()` e validação da resposta com `response.ok`.
    - Serialização e desserialização de objetos via `JSON.stringify()` e `JSON.parse()`.
    - Manipulação da Web Storage API (`localStorage`).

---

## 💻 Instruções de Execução

Como a aplicação é estritamente _client-side_, não há necessidade de Node.js, npm, bancos de dados ou servidores backend.

### Opção 1: Abertura Direta no Navegador

1. Navegue até a pasta do projeto.
2. Dê um duplo clique no arquivo `index.html` (ou clique com o botão direito e selecione **"Abrir com"** -> seu navegador preferido: Google Chrome, Firefox, Edge, etc.).

### Opção 2: Servidor Local (Recomendado para simulação de produção)

#### Usando a extensão **Live Server** (VS Code):

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
3. A aplicação abrirá automaticamente em `http://127.0.0.1:5500/index.html`.

#### Usando **Python**:

Abra o terminal na pasta do projeto e execute:

```bash
# Python 3
python -m http.server 8000
```

Em seguida, acesse no navegador: `http://localhost:8000`.

---

## 📦 Orientações para Envio Acadêmico (SIGAA) e GitHub

### 1. Publicação no GitHub

Para disponibilizar o projeto no GitHub e opcionalmente no **GitHub Pages**:

```bash
# 1. Inicialize o repositório git local (se ainda não estiver inicializado)
git init

# 2. Adicione todos os arquivos
git add .

# 3. Realize o commit inicial
git commit -m "feat: implementacao completa do Catalogo Interativo de Produtos - Grupo 01"

# 4. Conecte ao repositório remoto criado no GitHub
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/catalogo-interativo-produtos.git

# 5. Envie os arquivos para o GitHub
git push -u origin main
```

_Dica para hospedar online gratuitamente_: Acesse o repositório no GitHub -> **Settings** -> **Pages** -> em **Branch**, selecione `main` e a pasta `/(root)` -> clique em **Save**. Em instantes o projeto estará acessível publicamente via link HTTPS.

---

### 2. Geração do Arquivo `.zip` para o SIGAA

O trabalho deve ser enviado no SIGAA no formato **`Trabalho_Grupo_01.zip`**.

#### Pelo Windows PowerShell:

No diretório do projeto, execute o comando:

```powershell
Compress-Archive -Path index.html, css, js, README.md -DestinationPath Trabalho_Grupo_01.zip -Force
```

#### Pelo Terminal Linux / macOS:

```bash
zip -r Trabalho_Grupo_01.zip index.html css/ js/ README.md
```

#### Manualmente (Interface Gráfica do Windows):

1. Selecione os arquivos: `index.html`, a pasta `css`, a pasta `js` e o arquivo `README.md`.
2. Clique com o botão direito nos itens selecionados.
3. Escolha **Enviar para** > **Pasta compactada (zipada)** (ou no Windows 11: **Compactar para arquivo ZIP**).
4. Renomeie o arquivo gerado para: **`Trabalho_Grupo_01.zip`**.
5. Submeta o arquivo no portal do SIGAA na atividade correspondente.

---

## ✅ Lista de Verificação e Testes Manuais

Antes de submeter o trabalho, o grupo deve realizar os seguintes testes manuais no navegador:

|   #    | Cenário de Teste                  | Ação a Executar                                                                                 | Resultado Esperado                                                                                                       |
| :----: | :-------------------------------- | :---------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **1**  | **Carregamento Inicial**          | Abrir `index.html` com conexão ativa.                                                           | Spinner de carregamento surge e, em seguida, os cartões com imagem, nome, marca, avaliação e preço são renderizados.     |
| **2**  | **Busca com Sucesso**             | Digitar `"phone"` ou `"perfume"` no campo de busca e pressionar Enter ou clicar em "Buscar".    | Os produtos correspondentes são listados, e o contador exibe o total encontrado. O botão "X" aparece no campo.           |
| **3**  | **Limpeza da Busca**              | Clicar no botão "X" dentro do campo de busca.                                                   | O campo é limpo e a lista completa de produtos é restaurada.                                                             |
| **4**  | **Busca sem Resultados**          | Digitar um termo inexistente (ex: `"xyz987abc"`) e submeter a busca.                            | Exibe a mensagem amigável _"Nenhum produto encontrado"_ com o botão _"Voltar ao Catálogo Completo"_.                     |
| **5**  | **Modal de Detalhes**             | Clicar no botão **"Ver Detalhes"** de qualquer cartão.                                          | O modal abre com título, galeria de imagens, especificações completas (descrição, estoque, garantia, devolução) e preço. |
| **6**  | **Navegação na Galeria do Modal** | Clicar nas diferentes miniaturas dentro do modal.                                               | A imagem principal do modal é atualizada para a miniatura clicada.                                                       |
| **7**  | **Fechamento do Modal**           | Pressionar a tecla **ESC**, clicar no botão **&times;** ou clicar fora do modal.                | O modal é fechado suavemente e o scroll da página é reabilitado.                                                         |
| **8**  | **Adicionar Favorito**            | Clicar no ícone de coração/estrela em um produto da grade ou no botão dentro do modal.          | O ícone muda para preenchido (❤️), a notificação _Toast_ surge e os contadores da barra e do header sobem (+1).          |
| **9**  | **Painel Lateral de Favoritos**   | Clicar no botão **"Favoritos"** no cabeçalho.                                                   | O painel lateral desliza pela direita exibindo a lista dos itens favoritados e o valor total estimado.                   |
| **10** | **Persistência de Dados**         | Adicionar 2 produtos aos favoritos e recarregar a página (**F5**).                              | Os 2 produtos continuam marcados como favoritos, e o contador permanece em 2 após a recarga.                             |
| **11** | **Filtro da Grade por Favoritos** | Clicar na aba **"Apenas Favoritos"**.                                                           | A grade exibe somente os produtos favoritados. Ao desfavoritar um produto nesta aba, ele sai da lista.                   |
| **12** | **Limpar Todos os Favoritos**     | No painel lateral, clicar em **"Limpar Todos os Favoritos"** e confirmar o diálogo.             | Todos os favoritos são removidos, o localStorage é esvaziado e os ícones na grade voltam a branco (🤍).                  |
| **13** | **Responsividade**                | Reduzir a largura da janela para o tamanho de celular (< 480px).                                | Layout se adapta fluentemente em coluna única, cabeçalho se reorganiza e o modal se ajusta à tela.                       |
| **14** | **Tratamento de Falha de Rede**   | Desconectar a internet (ou simular _Offline_ na aba Network do DevTools) e recarregar a página. | Exibe o card de erro de conexão com botão _"Tentar Novamente"_, sem travamento do console.                               |
