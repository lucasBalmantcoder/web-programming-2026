// =====================================================
// DADOS LOCAIS (listas fixas, sem uso de fetch/API externa)
// =====================================================

const curiosidades = [
    // lista de curiosidades exibidas uma a uma pelo botão "Nova curiosidade"
    "A Amazônia abriga mais de 40 mil espécies de plantas conhecidas.",
    "Muitos remédios modernos, como alguns anticancerígenos, tiveram origem em compostos de plantas tropicais.",
    "O InChIKey é um código único que identifica uma estrutura química, útil para evitar compostos duplicados em bases de dados.",
    "Pesquisadores usam técnicas como cromatografia e espectrometria de massa para identificar novas moléculas.",
    "Estima-se que boa parte da biodiversidade amazônica ainda não foi estudada quimicamente."
];

const perguntasQuiz = [
    // lista de perguntas do quiz, cada uma com três alternativas e o índice da correta
    {
        pergunta: "Qual técnica é comumente usada para identificar a estrutura de um composto natural?",
        opcoes: ["Espectrometria de massa", "Impressão 3D", "Compilação de código"],
        correta: 0
    },
    {
        pergunta: "O que é um produto natural, em química?",
        opcoes: ["Um material sintético de laboratório", "Uma molécula produzida por um ser vivo", "Um tipo de solo amazônico"],
        correta: 1
    },
    {
        pergunta: "Para que serve o InChIKey de um composto?",
        opcoes: ["Definir seu preço de mercado", "Identificar de forma única sua estrutura química", "Indicar sua cor"],
        correta: 1
    }
];

// =====================================================
// SELEÇÃO DOS ELEMENTOS DA PÁGINA
// =====================================================

const botaoModoEscuro = document.getElementById("botaoModoEscuro");
// botão que alterna entre modo claro e escuro
const corpoPagina = document.querySelector("body");
// seleciona o <body> inteiro, para aplicar a classe do modo claro

const campoNome = document.getElementById("campoNome");
// campo onde o usuário digita o próprio nome
const botaoSaudar = document.getElementById("botaoSaudar");
// botão que dispara a saudação personalizada
const mensagemSaudacao = document.getElementById("mensagemSaudacao");
// parágrafo onde a saudação será escrita

const botaoDetalhes = document.getElementById("botaoDetalhes");
// botão que mostra/esconde os detalhes extras
const detalhesExtra = document.getElementById("detalhesExtra");
// bloco de detalhes que será mostrado ou escondido

const textoCuriosidade = document.getElementById("textoCuriosidade");
// parágrafo que exibe a curiosidade atual
const botaoCuriosidade = document.getElementById("botaoCuriosidade");
// botão que avança para a próxima curiosidade
const contadorCuriosidades = document.getElementById("contadorCuriosidades");
// elemento que mostra quantas curiosidades já foram vistas

const perguntaQuiz = document.getElementById("perguntaQuiz");
// parágrafo que exibe a pergunta atual do quiz
const opcaoA = document.getElementById("opcaoA");
// botão da alternativa A
const opcaoB = document.getElementById("opcaoB");
// botão da alternativa B
const opcaoC = document.getElementById("opcaoC");
// botão da alternativa C
const resultadoQuiz = document.getElementById("resultadoQuiz");
// parágrafo que mostra se a resposta está certa ou errada
const botaoProximaPergunta = document.getElementById("botaoProximaPergunta");
// botão que avança para a próxima pergunta

const formularioInscricao = document.getElementById("formularioInscricao");
// formulário de interesse em receber novidades
const campoEmail = document.getElementById("campoEmail");
// campo de e-mail do formulário
const campoMensagem = document.getElementById("campoMensagem");
// campo de mensagem (textarea) do formulário
const mensagemFormulario = document.getElementById("mensagemFormulario");
// parágrafo que mostrará o resultado do envio do formulário

// =====================================================
// VARIÁVEIS DE ESTADO
// =====================================================
let indiceCuriosidade = -1;
// guarda o índice da última curiosidade exibida (-1 = nenhuma ainda)
let totalCuriosidadesVistas = 0;
// conta quantas curiosidades já foram exibidas
let indicePergunta = 0;
// guarda o índice da pergunta atual do quiz
let quizRespondido = false;
// controla se a pergunta atual já foi respondida (evita clique duplo)

// =====================================================
// EVENTO 1: CLIQUE NO BOTÃO DE MODO ESCURO/CLARO
// =====================================================
botaoModoEscuro.addEventListener("click", function () {
    // função executada a cada clique no botão

    corpoPagina.classList.toggle("modo-claro");
    // adiciona a classe se não existir, ou remove se já existir

    const estaClaro = corpoPagina.classList.contains("modo-claro");
    // verifica se o modo claro está ativo neste momento

    if (estaClaro) {
        botaoModoEscuro.textContent = "🌞 Modo Claro";
        // atualiza o texto do botão para oferecer voltar ao escuro
    } else {
        botaoModoEscuro.textContent = "🌙 Modo Escuro";
        // volta o texto original do botão
    }
});

// =====================================================
// EVENTO 2: CLIQUE NO BOTÃO "COMEÇAR" (saudação)
// =====================================================
botaoSaudar.addEventListener("click", function () {
    // função executada ao clicar em "Começar"

    const nomeDigitado = campoNome.value.trim();
    // .value lê o texto digitado; trim() remove espaços em branco nas pontas

    if (nomeDigitado === "") {
        mensagemSaudacao.textContent = "Digite um nome antes de começar! 😉";
        // aviso amigável quando o campo está vazio
        mensagemSaudacao.style.color = "#ef476f";
        // cor vermelha, indicando atenção
    } else {
        mensagemSaudacao.textContent = "Boas descobertas, " + nomeDigitado + "! 🌳";
        // saudação personalizada usando o nome digitado
        mensagemSaudacao.style.color = "#7ee8a7";
        // cor verde, indicando sucesso
    }
});

// =====================================================
// EVENTO 3: TECLA PRESSIONADA NO CAMPO DE NOME (keydown)
// Destaca visualmente o campo enquanto o usuário digita.
// =====================================================
campoNome.addEventListener("keydown", function () {
    // função executada a cada tecla pressionada dentro do campo

    campoNome.classList.add("campo-ativo");
    // adiciona a classe que muda a cor da borda via CSS
});

campoNome.addEventListener("blur", function () {
    // função executada quando o campo perde o foco

    campoNome.classList.remove("campo-ativo");
    // remove o destaque, voltando a borda ao normal
});

// =====================================================
// EVENTO 4: CLIQUE NO BOTÃO "VER MAIS DETALHES"
// =====================================================
botaoDetalhes.addEventListener("click", function () {
    // função executada ao clicar no botão de detalhes

    const estaEscondido = detalhesExtra.classList.contains("escondido");
    // verifica se o bloco está atualmente escondido

    if (estaEscondido) {
        detalhesExtra.classList.remove("escondido");
        // mostra o bloco, removendo a classe que aplica display:none
        botaoDetalhes.textContent = "Ver menos detalhes";
        // atualiza o texto do botão
    } else {
        detalhesExtra.classList.add("escondido");
        // esconde novamente o bloco
        botaoDetalhes.textContent = "Ver mais detalhes";
        // volta o texto original do botão
    }
});

// =====================================================
// EVENTO 5: CLIQUE NO BOTÃO "NOVA CURIOSIDADE"
// Avança circularmente pela lista de curiosidades.
// =====================================================
botaoCuriosidade.addEventListener("click", function () {
    // função executada a cada clique no botão de curiosidade

    indiceCuriosidade = (indiceCuriosidade + 1) % curiosidades.length;
    // avança o índice e volta ao início ao chegar no final da lista (efeito circular)

    textoCuriosidade.textContent = curiosidades[indiceCuriosidade];
    // exibe o texto da curiosidade atual

    totalCuriosidadesVistas = totalCuriosidadesVistas + 1;
    // soma 1 ao total de curiosidades já vistas

    contadorCuriosidades.textContent = totalCuriosidadesVistas;
    // atualiza o contador exibido na tela
});

// =====================================================
// FUNÇÃO AUXILIAR: CARREGAR UMA PERGUNTA DO QUIZ NA TELA
// (não é um evento, mas é usada por eventos abaixo)
// =====================================================
function carregarPergunta() {
    // função que exibe a pergunta atual e suas alternativas

    const perguntaAtual = perguntasQuiz[indicePergunta];
    // pega o objeto da pergunta atual na lista

    perguntaQuiz.textContent = perguntaAtual.pergunta;
    // exibe o texto da pergunta

    opcaoA.textContent = "A) " + perguntaAtual.opcoes[0];
    // define o texto do botão A com a primeira alternativa
    opcaoB.textContent = "B) " + perguntaAtual.opcoes[1];
    // define o texto do botão B com a segunda alternativa
    opcaoC.textContent = "C) " + perguntaAtual.opcoes[2];
    // define o texto do botão C com a terceira alternativa

    resultadoQuiz.textContent = "";
    // limpa o feedback da pergunta anterior
    opcaoA.classList.remove("opcao-selecionada");
    opcaoB.classList.remove("opcao-selecionada");
    opcaoC.classList.remove("opcao-selecionada");
    // remove qualquer destaque de seleção deixado pela pergunta anterior

    botaoProximaPergunta.classList.add("escondido");
    // esconde o botão de "próxima pergunta" até que esta seja respondida

    quizRespondido = false;
    // libera a pergunta atual para ser respondida
}

// =====================================================
// FUNÇÃO AUXILIAR: VERIFICAR A RESPOSTA ESCOLHIDA
// =====================================================
function verificarResposta(indiceEscolhido, botaoClicado) {
    // recebe o índice da alternativa escolhida e o botão correspondente

    if (quizRespondido) {
        // se a pergunta já foi respondida, ignora novos cliques
        return;
    }

    quizRespondido = true;
    // marca a pergunta atual como respondida

    botaoClicado.classList.add("opcao-selecionada");
    // destaca visualmente o botão que foi clicado

    const perguntaAtual = perguntasQuiz[indicePergunta];
    // pega o objeto da pergunta atual

    if (indiceEscolhido === perguntaAtual.correta) {
        resultadoQuiz.textContent = "Certinho! Resposta correta. ✅";
        // mensagem de acerto
        resultadoQuiz.style.color = "#7ee8a7";
        // cor verde para indicar sucesso
    } else {
        resultadoQuiz.textContent = "Não foi dessa vez. Tente a próxima! ❌";
        // mensagem de erro
        resultadoQuiz.style.color = "#ef476f";
        // cor vermelha para indicar erro
    }

    botaoProximaPergunta.classList.remove("escondido");
    // exibe o botão para avançar para a próxima pergunta
}

// =====================================================
// EVENTO 6, 7 e 8: CLIQUE EM CADA ALTERNATIVA DO QUIZ
// =====================================================
opcaoA.addEventListener("click", function () {
    // função executada ao clicar na alternativa A
    verificarResposta(0, opcaoA);
    // chama a verificação passando o índice 0 (primeira alternativa)
});

opcaoB.addEventListener("click", function () {
    // função executada ao clicar na alternativa B
    verificarResposta(1, opcaoB);
    // chama a verificação passando o índice 1 (segunda alternativa)
});

opcaoC.addEventListener("click", function () {
    // função executada ao clicar na alternativa C
    verificarResposta(2, opcaoC);
    // chama a verificação passando o índice 2 (terceira alternativa)
});

// =====================================================
// EVENTO 9: CLIQUE NO BOTÃO "PRÓXIMA PERGUNTA"
// =====================================================
botaoProximaPergunta.addEventListener("click", function () {
    // função executada ao clicar em "Próxima pergunta"

    indicePergunta = (indicePergunta + 1) % perguntasQuiz.length;
    // avança para a próxima pergunta, voltando ao início ao chegar no final

    carregarPergunta();
    // recarrega a pergunta na tela com os novos dados
});

// =====================================================
// EVENTO 10: ENVIO DO FORMULÁRIO DE INTERESSE (submit)
// =====================================================
formularioInscricao.addEventListener("submit", function (evento) {
    // função executada quando o formulário é enviado

    evento.preventDefault();
    // impede o recarregamento padrão da página ao enviar o formulário

    const email = campoEmail.value.trim();
    // lê e limpa o valor digitado no campo de e-mail
    const mensagem = campoMensagem.value.trim();
    // lê e limpa o valor digitado no campo de mensagem

    const emailValido = email.includes("@") && email.includes(".");
    // validação simples: o e-mail deve conter "@" e um "."

    if (email === "" || mensagem === "") {
        mensagemFormulario.textContent = "Preencha o e-mail e a mensagem antes de enviar.";
        // aviso pedindo o preenchimento completo
        mensagemFormulario.style.color = "#ef476f";
        // cor vermelha, indicando erro
    } else if (!emailValido) {
        mensagemFormulario.textContent = "Digite um e-mail válido, por favor.";
        // aviso específico sobre o formato do e-mail
        mensagemFormulario.style.color = "#ef476f";
        // cor vermelha, indicando erro
    } else {
        mensagemFormulario.textContent = "Interesse registrado com sucesso! Obrigado por participar. 🌿";
        // mensagem de sucesso
        mensagemFormulario.style.color = "#7ee8a7";
        // cor verde, indicando sucesso

        formularioInscricao.reset();
        // limpa os campos do formulário após o envio bem-sucedido
    }
});

// =====================================================
// INICIALIZAÇÃO DA PÁGINA
// Carrega a primeira pergunta do quiz assim que o script roda.
// =====================================================
carregarPergunta();
// exibe a primeira pergunta do quiz ao carregar a página
