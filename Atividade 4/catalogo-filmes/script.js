// ===== 1. CHAVES do localStorage =====
const CHAVE = "catalogo_filmes";
const CHAVE_SEED = "catalogo_filmes_seed"; // flag: já semeamos?

// ===== 2. Dados pré-cadastrados (seed) =====
const FILMES_INICIAIS = [
    {
        titulo: "Cidade de Deus",
        diretor: "Fernando Meirelles",
        ano: 2002,
        genero: "Drama",
    },
    {
        titulo: "Matrix",
        diretor: "Lana Wachowski",
        ano: 1999,
        genero: "Ficção Científica",
    },
    {
        titulo: "Interestelar",
        diretor: "Christopher Nolan",
        ano: 2014,
        genero: "Ficção Científica",
    },
    {
        titulo: "O Auto da Compadecida",
        diretor: "Guel Arraes",
        ano: 2000,
        genero: "Comédia",
    },
    {
        titulo: "Parasita",
        diretor: "Bong Joon-ho",
        ano: 2019,
        genero: "Suspense",
    },
    {
        titulo: "Pulp Fiction",
        diretor: "Quentin Tarantino",
        ano: 1994,
        genero: "Crime",
    },
    {
        titulo: "Tropa de Elite",
        diretor: "José Padilha",
        ano: 2007,
        genero: "Ação",
    },
];

// ===== 3. Referências do DOM =====
const form = document.getElementById("form-filme");
const inputTit = document.getElementById("titulo");
const inputDir = document.getElementById("diretor");
const inputAno = document.getElementById("ano");
const inputGen = document.getElementById("genero");
const lista = document.getElementById("lista-filmes");
const btnLimpar = document.getElementById("btn-limpar");

// ===== 4. Semear dados na primeira execução =====
function semearSeNecessario() {
    const jaSemeou = localStorage.getItem(CHAVE_SEED);
    const temDados = localStorage.getItem(CHAVE);

    // Só semeia se nunca semeou E não há dados salvos
    if (!jaSemeou && !temDados) {
        localStorage.setItem(CHAVE, JSON.stringify(FILMES_INICIAIS));
        localStorage.setItem(CHAVE_SEED, "true");
    }
}

// ===== 5. Recuperar lista do localStorage =====
function carregarFilmes() {
    const texto = localStorage.getItem(CHAVE);
    if (texto === null) return [];
    return JSON.parse(texto);
}

// ===== 6. Salvar array no localStorage =====
function salvarFilmes(filmes) {
    localStorage.setItem(CHAVE, JSON.stringify(filmes));
}

// ===== 7. Renderizar lista no DOM com for...of =====
function renderizar() {
    const filmes = carregarFilmes();
    lista.innerHTML = "";

    if (filmes.length === 0) {
        lista.innerHTML =
            "<li><small>Nenhum filme cadastrado ainda.</small></li>";
        return;
    }

    for (const filme of filmes) {
        const li = document.createElement("li");
        li.innerHTML = `
      <strong>${filme.titulo}</strong> (${filme.ano})<br>
      <small>🎥 ${filme.diretor} — ${filme.genero}</small>
    `;
        lista.appendChild(li);
    }
}

// ===== 8. Submit do formulário =====
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const novoFilme = {
        titulo: inputTit.value.trim(),
        diretor: inputDir.value.trim(),
        ano: Number(inputAno.value),
        genero: inputGen.value.trim(),
    };

    const filmes = carregarFilmes();
    filmes.push(novoFilme);
    salvarFilmes(filmes);
    renderizar();

    form.reset();
    inputTit.focus();
});

// ===== 9. Botão limpar =====
btnLimpar.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todos os filmes?")) {
        localStorage.removeItem(CHAVE);
        // Mantemos CHAVE_SEED para não semear de novo após limpar
        renderizar();
    }
});

// ===== 10. Inicialização =====
semearSeNecessario();
renderizar();
