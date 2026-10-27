/**
 * ============================================================================
 * CATÁLOGO INTERATIVO DE PRODUTOS
 * Trabalho Acadêmico de Programação Web
 * 
 * Arquivo: js/script.js
 * Descrição: Lógica client-side em JavaScript puro (ES6+).
 *             Consumo da API DummyJSON, manipulação dinâmica do DOM,
 *             gerenciamento de estado, modal de detalhes e persistência
 *             de favoritos no localStorage.
 * ============================================================================
 */

// Executa o script apenas após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. CONSTANTES E ESTADO DA APLICAÇÃO (STATE MANAGEMENT)
     ========================================================================== */
  
  // Endpoints da API DummyJSON
  const API_CONFIG = {
    BASE_URL: 'https://dummyjson.com/products',
    SEARCH_URL: 'https://dummyjson.com/products/search',
    DEFAULT_LIMIT: 30
  };

  // Chave utilizada para persistência no localStorage do navegador
  const STORAGE_KEY = 'catalogo_produtos_favoritos_v1';

  // Imagem de fallback caso alguma URL da API falhe
  const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F200%2Fsvg%22%3E%3Crect%20fill%3D%22%23e2e8f0%22%20width%3D%22200%22%20height%3D%22200%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ESem%20Imagem%3C%2Ftext%3E%3C%2Fsvg%3E';

  // Objeto de estado da aplicação em memória
  const AppState = {
    products: [],          // Lista de produtos atualmente carregados da API
    favorites: [],         // Lista de objetos favoritados pelo usuário
    currentFilter: 'all',  // Modo de exibição: 'all' ou 'favorites'
    searchQuery: '',       // Termo da busca atual
    isLoading: false,      // Flag de carregamento
    selectedProduct: null  // Produto aberto no modal de detalhes
  };

  /* ==========================================================================
     2. SELETORES DO DOM (ELEMENTOS DA INTERFACE)
     ========================================================================== */
  
  // Formulário e Busca
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const btnResetSearch = document.getElementById('btn-reset-search');

  // Grades e Cabeçalho de Seção
  const productsGrid = document.getElementById('products-grid');
  const sectionHeading = document.getElementById('section-heading');
  const resultsCount = document.getElementById('results-count');

  // Abas de Filtro
  const tabAllProducts = document.getElementById('tab-all-products');
  const tabOnlyFavorites = document.getElementById('tab-only-favorites');
  const tabFavCount = document.getElementById('tab-fav-count');

  // Painéis de Feedback
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const errorDetail = document.getElementById('error-detail');
  const btnRetryFetch = document.getElementById('btn-retry-fetch');
  const emptyState = document.getElementById('empty-state');
  const emptyDetail = document.getElementById('empty-detail');

  // Painel Lateral (Drawer) de Favoritos
  const btnOpenFavorites = document.getElementById('btn-open-favorites');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const favoritesDrawer = document.getElementById('favorites-drawer');
  const favoritesOverlay = document.getElementById('favorites-overlay');
  const favoritesContainer = document.getElementById('favorites-items-container');
  const drawerEmptyState = document.getElementById('drawer-empty-state');
  const favCountBadge = document.getElementById('fav-count-badge');
  const drawerBadgeCount = document.getElementById('drawer-badge-count');
  const drawerTotalPrice = document.getElementById('drawer-total-price');
  const btnClearAllFavorites = document.getElementById('btn-clear-all-favorites');

  // Modal de Detalhes
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  /* ==========================================================================
     3. FUNÇÕES AUXILIARES E FORMATAÇÃO (HELPERS)
     ========================================================================== */

  /**
   * Formata número decimal para moeda (Dólar americano formatado em pt-BR)
   * @param {number} value - Valor numérico
   * @returns {string} String formatada, ex: "US$ 19,99"
   */
  function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) return 'US$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  /**
   * Exibe mensagens temporárias de feedback (Toast Notification)
   * @param {string} message - Mensagem a ser exibida
   * @param {'success'|'danger'|'info'} type - Tipo do toast
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Ícone do toast baseado no tipo
    const icon = type === 'success' ? '✅' : type === 'danger' ? '🗑️' : 'ℹ️';
    toast.innerHTML = `<span aria-hidden="true">${icon}</span><span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    // Remove do DOM após a animação de saída (3 segundos)
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  /* ==========================================================================
     4. PERSISTÊNCIA COM LOCALSTORAGE (REQUISITO 5)
     ========================================================================== */

  /**
   * Recupera a lista de favoritos do localStorage com tratamento defensivo
   * contra dados nulos ou JSON corrompido.
   * @returns {Array<Object>} Lista de objetos favoritos
   */
  function loadFavoritesFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      // Garante que o retorno seja sempre um array válido
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Aviso: Erro ao ler favoritos do localStorage. Redefinindo.', error);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  /**
   * Salva a lista de favoritos no localStorage
   * @param {Array<Object>} favorites - Array de produtos favoritos
   */
  function saveFavoritesToStorage(favorites) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage:', error);
      showToast('Espaço de armazenamento cheio ou indisponível.', 'danger');
    }
  }

  /**
   * Verifica se determinado produto já consta nos favoritos
   * @param {number} productId - ID do produto
   * @returns {boolean}
   */
  function isProductFavorite(productId) {
    return AppState.favorites.some(item => item.id === productId);
  }

  /**
   * Atualiza todos os contadores visuais de favoritos na interface
   */
  function updateFavoriteBadges() {
    const count = AppState.favorites.length;
    favCountBadge.textContent = count;
    drawerBadgeCount.textContent = count;
    tabFavCount.textContent = count;

    // Calcula o total monetário estimado dos favoritos
    const total = AppState.favorites.reduce((acc, item) => acc + (item.price || 0), 0);
    drawerTotalPrice.textContent = formatCurrency(total);
  }

  /**
   * Alterna o estado de favorito de um produto (Adiciona ou Remove)
   * Cria o objeto JavaScript conforme especificado no Requisito 3.
   * @param {Object} product - Objeto do produto retornado pela API
   */
  function toggleFavorite(product) {
    const index = AppState.favorites.findIndex(item => item.id === product.id);

    if (index > -1) {
      // Remove do array de favoritos
      AppState.favorites.splice(index, 1);
      showToast(`"${product.title}" removido dos favoritos.`, 'danger');
    } else {
      // Criação de objeto JavaScript estruturado para representar o favorito (Requisito 3)
      const favoriteItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || FALLBACK_IMAGE,
        category: product.category || 'Geral',
        brand: product.brand || 'Não informada',
        rating: product.rating || 0,
        stock: product.stock || 0,
        description: product.description || ''
      };

      AppState.favorites.push(favoriteItem);
      showToast(`"${product.title}" adicionado aos favoritos!`, 'success');
    }

    // Persiste no localStorage
    saveFavoritesToStorage(AppState.favorites);

    // Atualiza badges e listas
    updateFavoriteBadges();
    renderFavoritesDrawer();
    updateCardFavoriteIcons(product.id);

    // Se estiver na aba "Apenas Favoritos", re-renderiza o catálogo
    if (AppState.currentFilter === 'favorites') {
      renderProducts(AppState.favorites);
    }

    // Atualiza botão dentro do modal se ele estiver aberto com este produto
    updateModalFavoriteButton(product.id);
  }

  /**
   * Atualiza a aparência do botão de favorito nos cartões da grade
   * @param {number} productId - ID do produto alterado
   */
  function updateCardFavoriteIcons(productId) {
    const cards = productsGrid.querySelectorAll(`.product-card[data-id="${productId}"]`);
    cards.forEach(card => {
      const favBtn = card.querySelector('.btn-favorite-card');
      if (favBtn) {
        const isFav = isProductFavorite(productId);
        favBtn.classList.toggle('is-favorite', isFav);
        favBtn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
        favBtn.setAttribute('title', isFav ? 'Remover dos favoritos' : 'Favoritar produto');
        favBtn.innerHTML = isFav ? '❤️' : '🤍';
      }
    });
  }

  /* ==========================================================================
     5. CONSUMO DA API DUMMYJSON COM FETCH / ASYNC / AWAIT (REQUISITO 4)
     ========================================================================== */

  /**
   * Busca produtos da API DummyJSON com validação de status HTTP e try/catch
   * @param {string} [query=''] - Termo de busca opcional
   */
  async function fetchProducts(query = '') {
    // Atualiza estado de carregamento
    setLoading(true);
    hideError();
    hideEmpty();

    AppState.searchQuery = query.trim();

    try {
      // Monta URL conforme a presença ou não do parâmetro de busca ?q=
      let url = `${API_CONFIG.BASE_URL}?limit=${API_CONFIG.DEFAULT_LIMIT}`;
      if (AppState.searchQuery.length > 0) {
        url = `${API_CONFIG.SEARCH_URL}?q=${encodeURIComponent(AppState.searchQuery)}`;
      }

      // Executa requisição HTTP com fetch() e método GET
      const response = await fetch(url, { method: 'GET' });

      // Verificação de response.ok conforme Requisito 4
      if (!response.ok) {
        throw new Error(`Erro na requisição: HTTP ${response.status} - ${response.statusText}`);
      }

      // Converte resposta JSON
      const data = await response.json();

      // Validação defensiva do array de produtos
      if (!data || !Array.isArray(data.products)) {
        throw new Error('Formato de resposta inesperado da API.');
      }

      // Atualiza o estado da aplicação
      AppState.products = data.products;

      // Se a aba atual for 'favorites', prioriza exibição de favoritos
      if (AppState.currentFilter === 'favorites') {
        renderProducts(AppState.favorites);
      } else {
        renderProducts(AppState.products);
      }

      // Atualiza contadores e títulos da interface
      updateViewHeaders(data.total !== undefined ? data.total : data.products.length);

    } catch (error) {
      console.error('Falha na comunicação com a API:', error);
      showError(error.message || 'Falha de conexão com a API.');
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================================
     6. CRIAÇÃO DINÂMICA DE ELEMENTOS COM DOM (REQUISITO 1 E 2)
     ========================================================================== */

  /**
   * Constrói dinamicamente um cartão de produto (<article>) utilizando
   * exclusivamente document.createElement, atributos e listeners de eventos.
   * @param {Object} product - Dados do produto
   * @returns {HTMLElement} Elemento <article class="product-card">
   */
  function createProductCard(product) {
    const isFav = isProductFavorite(product.id);

    // 1. Elemento principal: <article class="product-card">
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('data-id', product.id);

    // 2. Container da imagem e badges: <div class="card-media">
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'card-media';

    // Imagem do produto com fallback seguro para erros de carregamento
    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = product.thumbnail || FALLBACK_IMAGE;
    img.alt = product.title || 'Imagem do produto';
    img.loading = 'lazy';
    img.onerror = () => { img.src = FALLBACK_IMAGE; };

    // Badge de categoria
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'badge-category';
    categoryBadge.textContent = product.category || 'Geral';

    // Botão flutuante de favoritar no card
    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = `btn-favorite-card ${isFav ? 'is-favorite' : ''}`;
    favBtn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    favBtn.setAttribute('title', isFav ? 'Remover dos favoritos' : 'Favoritar produto');
    favBtn.innerHTML = isFav ? '❤️' : '🤍';

    // Evento de clique para favoritar
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Impede outros cliques acidentais
      toggleFavorite(product);
    });

    mediaDiv.appendChild(img);
    mediaDiv.appendChild(categoryBadge);
    mediaDiv.appendChild(favBtn);

    // 3. Corpo do cartão: <div class="card-body">
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'card-body';

    // Linha de metadados: Avaliação e Estoque
    const metaDiv = document.createElement('div');
    metaDiv.className = 'card-meta';

    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'card-rating';
    ratingSpan.innerHTML = `★ ${Number(product.rating || 0).toFixed(1)}`;

    const stockSpan = document.createElement('span');
    const stockQty = product.stock || 0;
    stockSpan.className = `card-stock ${stockQty <= 10 ? 'low-stock' : ''}`;
    stockSpan.textContent = stockQty > 0 ? `${stockQty} em estoque` : 'Esgotado';

    metaDiv.appendChild(ratingSpan);
    metaDiv.appendChild(stockSpan);

    // Título do produto (<h3>)
    const titleH3 = document.createElement('h3');
    titleH3.className = 'card-title';
    titleH3.textContent = product.title || 'Produto sem título';
    titleH3.title = product.title || '';

    // Marca do produto
    const brandP = document.createElement('p');
    brandP.className = 'card-brand';
    brandP.textContent = product.brand ? `Marca: ${product.brand}` : 'Marca: Genérica';

    // Linha de Preço e Desconto
    const priceRow = document.createElement('div');
    priceRow.className = 'card-price-row';

    const priceSpan = document.createElement('span');
    priceSpan.className = 'card-price';
    priceSpan.textContent = formatCurrency(product.price);

    priceRow.appendChild(priceSpan);

    if (product.discountPercentage && product.discountPercentage > 0) {
      const discountSpan = document.createElement('span');
      discountSpan.className = 'card-discount';
      discountSpan.textContent = `-${Math.round(product.discountPercentage)}%`;
      priceRow.appendChild(discountSpan);
    }

    // Ações do cartão: Botão "Ver Detalhes"
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';

    const btnDetails = document.createElement('button');
    btnDetails.type = 'button';
    btnDetails.className = 'btn-card-details';
    btnDetails.textContent = 'Ver Detalhes';
    btnDetails.addEventListener('click', () => {
      openProductModal(product);
    });

    actionsDiv.appendChild(btnDetails);

    // Montagem do card
    bodyDiv.appendChild(metaDiv);
    bodyDiv.appendChild(titleH3);
    bodyDiv.appendChild(brandP);
    bodyDiv.appendChild(priceRow);
    bodyDiv.appendChild(actionsDiv);

    article.appendChild(mediaDiv);
    article.appendChild(bodyDiv);

    return article;
  }

  /**
   * Renderiza a lista de produtos na grade usando laço forEach
   * @param {Array<Object>} productsList - Lista de produtos a renderizar
   */
  function renderProducts(productsList) {
    // Limpa a grade atual
    productsGrid.innerHTML = '';

    // Verifica se a lista está vazia (caso limite de busca ou favoritos vazios)
    if (!productsList || productsList.length === 0) {
      if (AppState.currentFilter === 'favorites') {
        showEmpty('Você ainda não tem nenhum produto adicionado aos favoritos.');
      } else if (AppState.searchQuery.length > 0) {
        showEmpty(`Nenhum resultado para a busca "${AppState.searchQuery}". Tente outros termos.`);
      } else {
        showEmpty('Nenhum produto disponível no momento.');
      }
      return;
    }

    hideEmpty();

    // Cria e anexa cada cartão dinamicamente (Requisito 2 e 3)
    const fragment = document.createDocumentFragment();
    productsList.forEach(product => {
      const card = createProductCard(product);
      fragment.appendChild(card);
    });

    productsGrid.appendChild(fragment);
  }

  /**
   * Atualiza os títulos de seção e quantidade de resultados
   * @param {number} totalCount - Quantidade total
   */
  function updateViewHeaders(totalCount) {
    if (AppState.currentFilter === 'favorites') {
      sectionHeading.textContent = 'Meus Favoritos';
      resultsCount.textContent = `${AppState.favorites.length} produto(s) salvo(s)`;
    } else if (AppState.searchQuery.length > 0) {
      sectionHeading.textContent = `Resultados para "${AppState.searchQuery}"`;
      resultsCount.textContent = `${totalCount} produto(s) encontrado(s)`;
    } else {
      sectionHeading.textContent = 'Todos os Produtos';
      resultsCount.textContent = `${totalCount} produtos em catálogo`;
    }
  }

  /* ==========================================================================
     7. MODAL DE DETALHES DO PRODUTO (FUNCIONALIDADE MÍNIMA)
     ========================================================================== */

  /**
   * Abre o modal com informações completas e ricas do produto
   * @param {Object} product - Objeto do produto selecionado
   */
  function openProductModal(product) {
    AppState.selectedProduct = product;
    const isFav = isProductFavorite(product.id);

    // Monta a estrutura interna do modal via createElement e templates organizados
    modalContent.innerHTML = '';

    const modalGrid = document.createElement('div');
    modalGrid.className = 'modal-grid';

    // Coluna 1: Galeria de Imagens
    const mediaCol = document.createElement('div');
    mediaCol.className = 'modal-media-col';

    const mainImgBox = document.createElement('div');
    mainImgBox.className = 'modal-main-img-box';

    const mainImg = document.createElement('img');
    mainImg.className = 'modal-main-img';
    mainImg.src = product.thumbnail || FALLBACK_IMAGE;
    mainImg.alt = product.title || 'Foto do produto';
    mainImg.onerror = () => { mainImg.src = FALLBACK_IMAGE; };
    mainImgBox.appendChild(mainImg);
    mediaCol.appendChild(mainImgBox);

    // Miniaturas extras se houver mais de uma imagem
    if (Array.isArray(product.images) && product.images.length > 1) {
      const thumbsContainer = document.createElement('div');
      thumbsContainer.className = 'modal-thumbnails';

      product.images.slice(0, 5).forEach((imgUrl, index) => {
        const thumb = document.createElement('img');
        thumb.className = `modal-thumb ${index === 0 ? 'active' : ''}`;
        thumb.src = imgUrl;
        thumb.alt = `Miniatura ${index + 1}`;
        thumb.addEventListener('click', () => {
          mainImg.src = imgUrl;
          thumbsContainer.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        thumbsContainer.appendChild(thumb);
      });
      mediaCol.appendChild(thumbsContainer);
    }

    // Coluna 2: Informações Detalhadas
    const infoCol = document.createElement('div');
    infoCol.className = 'modal-info-col';

    // Badges de topo
    const badgeGroup = document.createElement('div');
    badgeGroup.className = 'modal-badge-group';
    badgeGroup.innerHTML = `
      <span class="modal-badge">${product.category ? product.category.toUpperCase() : 'GERAL'}</span>
      <span class="modal-badge">SKU: ${product.sku || 'N/A'}</span>
    `;
    infoCol.appendChild(badgeGroup);

    // Título
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.id = 'modal-product-title';
    title.textContent = product.title;
    infoCol.appendChild(title);

    // Preço e Desconto
    const priceBox = document.createElement('div');
    priceBox.className = 'modal-price-box';
    priceBox.innerHTML = `
      <span class="modal-price">${formatCurrency(product.price)}</span>
      ${product.discountPercentage ? `<span class="modal-discount-tag">${product.discountPercentage}% de desconto</span>` : ''}
    `;
    infoCol.appendChild(priceBox);

    // Descrição
    const descTitle = document.createElement('h3');
    descTitle.className = 'modal-description-title';
    descTitle.textContent = 'Descrição do Produto';
    infoCol.appendChild(descTitle);

    const desc = document.createElement('p');
    desc.className = 'modal-description';
    desc.textContent = product.description || 'Nenhuma descrição fornecida pelo fabricante.';
    infoCol.appendChild(desc);

    // Especificações Adicionais (Marca, Avaliação, Estoque, Garantia, Envio)
    const specsList = document.createElement('div');
    specsList.className = 'modal-specs-list';
    specsList.innerHTML = `
      <div class="spec-item">
        <strong>Marca:</strong>
        <span>${product.brand || 'Não informada'}</span>
      </div>
      <div class="spec-item">
        <strong>Avaliação:</strong>
        <span>★ ${Number(product.rating || 0).toFixed(2)} / 5.00</span>
      </div>
      <div class="spec-item">
        <strong>Estoque:</strong>
        <span>${product.stock || 0} unidades (${product.availabilityStatus || 'Disponível'})</span>
      </div>
      <div class="spec-item">
        <strong>Garantia:</strong>
        <span>${product.warrantyInformation || 'Garantia legal padrão'}</span>
      </div>
      <div class="spec-item">
        <strong>Envio:</strong>
        <span>${product.shippingInformation || 'Consulte o prazo'}</span>
      </div>
      <div class="spec-item">
        <strong>Devolução:</strong>
        <span>${product.returnPolicy || '30 dias para troca'}</span>
      </div>
    `;
    infoCol.appendChild(specsList);

    // Rodapé de Ações do Modal
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';

    const btnFavModal = document.createElement('button');
    btnFavModal.type = 'button';
    btnFavModal.id = 'btn-modal-favorite';
    btnFavModal.className = `btn-modal-fav ${isFav ? 'active' : ''}`;
    btnFavModal.innerHTML = isFav 
      ? '<span>❤️</span> Remover dos Favoritos' 
      : '<span>⭐</span> Adicionar aos Favoritos';

    btnFavModal.addEventListener('click', () => {
      toggleFavorite(product);
    });

    const btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn btn-secondary';
    btnClose.textContent = 'Fechar';
    btnClose.addEventListener('click', closeProductModal);

    modalActions.appendChild(btnFavModal);
    modalActions.appendChild(btnClose);
    infoCol.appendChild(modalActions);

    modalGrid.appendChild(mediaCol);
    modalGrid.appendChild(infoCol);
    modalContent.appendChild(modalGrid);

    // Abre o modal
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Evita scroll de fundo
  }

  /**
   * Fecha o modal de detalhes
   */
  function closeProductModal() {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    AppState.selectedProduct = null;
  }

  /**
   * Atualiza o botão de favorito do modal caso ele esteja aberto
   * @param {number} productId - ID do produto
   */
  function updateModalFavoriteButton(productId) {
    if (!AppState.selectedProduct || AppState.selectedProduct.id !== productId) return;
    const btn = document.getElementById('btn-modal-favorite');
    if (!btn) return;

    const isFav = isProductFavorite(productId);
    btn.classList.toggle('active', isFav);
    btn.innerHTML = isFav 
      ? '<span>❤️</span> Remover dos Favoritos' 
      : '<span>⭐</span> Adicionar aos Favoritos';
  }

  /* ==========================================================================
     8. PAINEL LATERAL (DRAWER) DE FAVORITOS (REQUISITO 5)
     ========================================================================== */

  /**
   * Renderiza a lista de itens favoritos no painel lateral
   */
  function renderFavoritesDrawer() {
    favoritesContainer.innerHTML = '';

    if (AppState.favorites.length === 0) {
      drawerEmptyState.classList.remove('hidden');
      btnClearAllFavorites.disabled = true;
      btnClearAllFavorites.style.opacity = '0.5';
      btnClearAllFavorites.style.pointerEvents = 'none';
      return;
    }

    drawerEmptyState.classList.add('hidden');
    btnClearAllFavorites.disabled = false;
    btnClearAllFavorites.style.opacity = '1';
    btnClearAllFavorites.style.pointerEvents = 'auto';

    const fragment = document.createDocumentFragment();

    AppState.favorites.forEach(item => {
      const row = document.createElement('div');
      row.className = 'fav-item';

      // Thumbnail
      const thumb = document.createElement('img');
      thumb.className = 'fav-item-thumb';
      thumb.src = item.thumbnail || FALLBACK_IMAGE;
      thumb.alt = item.title;
      thumb.onerror = () => { thumb.src = FALLBACK_IMAGE; };

      // Informações
      const info = document.createElement('div');
      info.className = 'fav-item-info';

      const title = document.createElement('h4');
      title.className = 'fav-item-title';
      title.textContent = item.title;
      title.title = 'Clique para ver detalhes';
      title.addEventListener('click', () => {
        closeFavoritesDrawer();
        openProductModal(item);
      });

      const price = document.createElement('span');
      price.className = 'fav-item-price';
      price.textContent = formatCurrency(item.price);

      const actions = document.createElement('div');
      actions.className = 'fav-item-actions';

      const btnView = document.createElement('button');
      btnView.type = 'button';
      btnView.className = 'btn-fav-view';
      btnView.textContent = 'Ver detalhes';
      btnView.addEventListener('click', () => {
        closeFavoritesDrawer();
        openProductModal(item);
      });

      const btnRemove = document.createElement('button');
      btnRemove.type = 'button';
      btnRemove.className = 'btn-fav-remove';
      btnRemove.textContent = 'Remover';
      btnRemove.addEventListener('click', () => {
        toggleFavorite(item);
      });

      actions.appendChild(btnView);
      actions.appendChild(btnRemove);

      info.appendChild(title);
      info.appendChild(price);
      info.appendChild(actions);

      row.appendChild(thumb);
      row.appendChild(info);

      fragment.appendChild(row);
    });

    favoritesContainer.appendChild(fragment);
  }

  function openFavoritesDrawer() {
    renderFavoritesDrawer();
    favoritesDrawer.classList.remove('hidden');
    favoritesOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeFavoritesDrawer() {
    favoritesDrawer.classList.add('hidden');
    favoritesOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     9. CONTROLE DE ESTADOS DA INTERFACE (FEEDBACK VISUAL)
     ========================================================================== */

  function setLoading(isLoading) {
    AppState.isLoading = isLoading;
    if (isLoading) {
      loadingState.classList.remove('hidden');
      productsGrid.classList.add('hidden');
    } else {
      loadingState.classList.add('hidden');
      productsGrid.classList.remove('hidden');
    }
  }

  function showError(message) {
    errorDetail.textContent = message;
    errorState.classList.remove('hidden');
    productsGrid.classList.add('hidden');
    resultsCount.textContent = 'Erro ao carregar';
  }

  function hideError() {
    errorState.classList.add('hidden');
  }

  function showEmpty(message) {
    emptyDetail.textContent = message;
    emptyState.classList.remove('hidden');
  }

  function hideEmpty() {
    emptyState.classList.add('hidden');
  }

  /* ==========================================================================
     10. REGISTRO DE EVENTOS (EVENT LISTENERS)
     ========================================================================== */

  /**
   * Configura todos os eventos de formulário, botões, modais e teclado
   */
  function setupEventListeners() {
    
    // 1. Evento de submissão do formulário de busca (Requisito 2 e Funcionalidade Mínima)
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Impede o recarregamento padrão da página

      const query = searchInput.value.trim();
      AppState.currentFilter = 'all';
      updateFilterTabsUI();

      fetchProducts(query);
    });

    // 2. Monitoramento do campo de busca para exibir/ocultar botão "X" (Limpar)
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim().length > 0) {
        btnClearSearch.classList.remove('hidden');
      } else {
        btnClearSearch.classList.add('hidden');
      }
    });

    // 3. Botão "X" dentro do input de busca
    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      btnClearSearch.classList.add('hidden');
      searchInput.focus();

      if (AppState.searchQuery.length > 0) {
        fetchProducts('');
      }
    });

    // 4. Botão "Voltar ao Catálogo Completo" da tela de busca vazia
    btnResetSearch.addEventListener('click', () => {
      searchInput.value = '';
      btnClearSearch.classList.add('hidden');
      AppState.currentFilter = 'all';
      updateFilterTabsUI();
      fetchProducts('');
    });

    // 5. Botão "Tentar Novamente" em caso de erro de rede da API
    btnRetryFetch.addEventListener('click', () => {
      fetchProducts(AppState.searchQuery);
    });

    // 6. Abas de alternância de filtro ("Todos os Produtos" vs "Apenas Favoritos")
    tabAllProducts.addEventListener('click', () => {
      AppState.currentFilter = 'all';
      updateFilterTabsUI();
      renderProducts(AppState.products);
      updateViewHeaders(AppState.products.length);
    });

    tabOnlyFavorites.addEventListener('click', () => {
      AppState.currentFilter = 'favorites';
      updateFilterTabsUI();
      renderProducts(AppState.favorites);
      updateViewHeaders(AppState.favorites.length);
    });

    // 7. Abertura e fechamento do painel lateral de favoritos
    btnOpenFavorites.addEventListener('click', openFavoritesDrawer);
    btnCloseDrawer.addEventListener('click', closeFavoritesDrawer);
    favoritesOverlay.addEventListener('click', closeFavoritesDrawer);

    // 8. Botão "Limpar Todos os Favoritos"
    btnClearAllFavorites.addEventListener('click', () => {
      if (AppState.favorites.length === 0) return;

      const confirmed = window.confirm('Deseja realmente remover todos os produtos dos favoritos?');
      if (confirmed) {
        AppState.favorites = [];
        saveFavoritesToStorage(AppState.favorites);
        updateFavoriteBadges();
        renderFavoritesDrawer();
        
        // Atualiza todos os cartões na grade
        productsGrid.querySelectorAll('.btn-favorite-card').forEach(btn => {
          btn.classList.remove('is-favorite');
          btn.innerHTML = '🤍';
        });

        if (AppState.currentFilter === 'favorites') {
          renderProducts(AppState.favorites);
        }

        showToast('Todos os favoritos foram removidos.', 'info');
      }
    });

    // 9. Fechamento do Modal de Detalhes
    btnCloseModal.addEventListener('click', closeProductModal);
    
    // Fechar ao clicar fora do conteúdo do modal (overlay)
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeProductModal();
      }
    });

    // 10. Acessibilidade: Fechar modal e drawer ao pressionar tecla ESC
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (!modalOverlay.classList.contains('hidden')) {
          closeProductModal();
        } else if (!favoritesDrawer.classList.contains('hidden')) {
          closeFavoritesDrawer();
        }
      }
    });
  }

  /**
   * Atualiza a estilização das abas ativas
   */
  function updateFilterTabsUI() {
    if (AppState.currentFilter === 'all') {
      tabAllProducts.classList.add('active');
      tabOnlyFavorites.classList.remove('active');
    } else {
      tabAllProducts.classList.remove('active');
      tabOnlyFavorites.classList.add('active');
    }
  }

  /* ==========================================================================
     11. INICIALIZAÇÃO DA APLICAÇÃO (BOOTSTRAP)
     ========================================================================== */

  /**
   * Função principal de inicialização da página
   */
  function initApp() {
    // 1. Carrega favoritos salvos no localStorage (Requisito 5)
    AppState.favorites = loadFavoritesFromStorage();
    updateFavoriteBadges();

    // 2. Configura todos os ouvintes de evento
    setupEventListeners();

    // 3. Executa a primeira requisição à API DummyJSON (Requisito 4)
    fetchProducts('');
  }

  // Dispara a inicialização
  initApp();
});

