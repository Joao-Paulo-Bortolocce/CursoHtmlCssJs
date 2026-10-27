/* ==========================================================================
   FUNDAMENTOS.WEB — Blocos do modo "Arrastar e soltar"
   --------------------------------------------------------------------------
   Dentro de cada prática, o aluno arrasta blocos para a tela e o código
   aparece no editor ao lado. Este arquivo define:

   tags          Explicação curta de cada elemento HTML (usada nos cartões,
                 na barra de seleção e no balão que aparece após soltar).
   propriedades  Explicação curta de cada propriedade CSS.
   elementos     Blocos de HTML. Campos: nome, html, info e, se preciso,
                 amostra (prévia leve para mídias pesadas no cartão).
   estilos       Blocos de CSS aplicados sobre um elemento da tela.
                 Campos: nome, css (lista de [propriedade, valor]), info e,
                 opcionalmente, sufixo (":hover", "::before"...) e midia
                 ("(min-width: 600px)").
   grupos        Conjuntos de estilos reutilizados nos kits ("@texto").
   kits          Quais blocos aparecem em cada exercício (a chave é o nome
                 mostrado no topo do bloco de código da aula). "exercicio"
                 é o exercício de fechamento do módulo.

   Além dos kits, cada prática ganha automaticamente:
   - "Componentes da aula": elementos com classe do HTML inicial;
   - "Estilos da aula": as declarações do CSS mostrado na aula.
   ========================================================================== */

window.PRATICA_BLOCOS = {
  /* ------------------------------------------------------------------------
     EXPLICAÇÕES DAS TAGS
     ------------------------------------------------------------------------ */
  tags: {
    html: "Raiz do documento: envolve todo o conteúdo.",
    body: "Corpo da página: tudo o que aparece na tela.",
    header: "Cabeçalho de uma página ou seção (logo, título, menu).",
    nav: "Grupo de links de navegação.",
    main: "Conteúdo principal da página. Use só um.",
    section: "Seção temática, normalmente com um título.",
    article: "Conteúdo independente, como um post ou um cartão.",
    aside: "Conteúdo complementar, ao lado do principal.",
    footer: "Rodapé de uma página ou seção.",
    div: "Caixa genérica, sem significado: serve para agrupar e estilizar.",
    span: "Trecho genérico dentro do texto, para estilizar.",
    h1: "Título principal da página. Use só um.",
    h2: "Subtítulo: divide o conteúdo em seções.",
    h3: "Título de terceiro nível, dentro de uma seção.",
    h4: "Título de quarto nível.",
    h5: "Título de quinto nível.",
    h6: "Título de sexto nível, o menos importante.",
    p: "Parágrafo de texto.",
    br: "Quebra de linha dentro do mesmo bloco de texto.",
    hr: "Separação temática entre assuntos.",
    strong: "Texto importante (aparece em negrito).",
    em: "Ênfase na leitura (aparece em itálico).",
    b: "Negrito sem importância extra.",
    i: "Itálico sem ênfase extra.",
    mark: "Trecho destacado, como um marca-texto.",
    small: "Observação secundária, letras miúdas.",
    del: "Texto removido (aparece riscado).",
    ins: "Texto inserido (aparece sublinhado).",
    code: "Trecho de código.",
    pre: "Texto pré-formatado: mantém espaços e quebras.",
    q: "Citação curta, dentro da frase.",
    abbr: "Abreviação; o title explica a sigla.",
    blockquote: "Citação longa, em bloco.",
    cite: "Título de uma obra citada.",
    ul: "Lista sem ordem (marcadores).",
    ol: "Lista ordenada (números ou letras).",
    li: "Item de lista: sempre dentro de <ul> ou <ol>.",
    dl: "Lista de definições (termos e significados).",
    dt: "Termo de uma lista de definições.",
    dd: "Definição do termo anterior.",
    a: "Link: leva a outra página, a um trecho ou a um e-mail.",
    img: "Imagem. O alt descreve o conteúdo para quem não vê.",
    figure: "Figura independente, como imagem com legenda.",
    figcaption: "Legenda de uma <figure>.",
    picture: "Imagem adaptativa: o navegador escolhe a melhor fonte.",
    source: "Uma fonte alternativa de mídia ou imagem.",
    audio: "Player de áudio nativo.",
    video: "Player de vídeo nativo.",
    iframe: "Janela que mostra outro documento dentro da página.",
    table: "Tabela de dados.",
    caption: "Título da tabela.",
    colgroup: "Grupo de colunas, para estilizar colunas inteiras.",
    col: "Uma coluna (ou várias, com span) da tabela.",
    thead: "Cabeçalho da tabela.",
    tbody: "Corpo da tabela, com as linhas de dados.",
    tfoot: "Rodapé da tabela (totais, médias).",
    tr: "Linha da tabela.",
    th: "Célula de cabeçalho: dá nome a uma linha ou coluna.",
    td: "Célula de dados.",
    form: "Formulário: agrupa campos que serão enviados.",
    label: "Rótulo de um campo. O for liga ao id do campo.",
    input: "Campo de entrada. O type define o tipo de dado.",
    button: "Botão clicável.",
    select: "Lista de opções para escolher.",
    option: "Uma opção do <select> ou do <datalist>.",
    optgroup: "Grupo de opções dentro de um <select>.",
    datalist: "Sugestões para um campo de texto.",
    textarea: "Campo de texto com várias linhas.",
    fieldset: "Agrupa campos relacionados.",
    legend: "Título de um <fieldset>.",
    output: "Mostra o resultado de um cálculo ou ação.",
    details: "Conteúdo que abre e fecha com um clique.",
    summary: "Título clicável de um <details>.",
    svg: "Desenho vetorial feito com código.",
    script: "Código JavaScript.",
    style: "Bloco de CSS dentro do HTML.",
    sub: "Texto subscrito (H₂O).",
    sup: "Texto sobrescrito (x²).",
    time: "Data ou hora legível por máquinas.",
  },

  /* ------------------------------------------------------------------------
     EXPLICAÇÕES DAS PROPRIEDADES CSS
     ------------------------------------------------------------------------ */
  propriedades: {
    color: "Cor do texto.",
    background: "Atalho para todas as propriedades de fundo.",
    "background-color": "Cor de fundo do elemento.",
    "background-image": "Imagem ou gradiente no fundo do elemento.",
    "background-size": "Tamanho da imagem de fundo (cover, contain...).",
    "background-position": "Posição da imagem de fundo.",
    "background-repeat": "Se a imagem de fundo se repete.",
    "background-attachment": "Se o fundo rola junto ou fica fixo na tela.",
    "font-family": "Família da fonte (com alternativas, separadas por vírgula).",
    "font-size": "Tamanho do texto.",
    "font-weight": "Peso do texto (400 normal, 700 negrito).",
    "font-style": "Estilo do texto, como itálico.",
    "line-height": "Altura de cada linha de texto.",
    "letter-spacing": "Espaço entre as letras.",
    "text-align": "Alinhamento horizontal do texto.",
    "text-indent": "Recuo da primeira linha.",
    "text-transform": "Transforma o texto em maiúsculas ou minúsculas.",
    "text-decoration": "Sublinhado, riscado ou nenhum.",
    "text-shadow": "Sombra do texto: x, y, desfoque e cor.",
    width: "Largura do elemento.",
    height: "Altura do elemento.",
    "min-height": "Altura mínima do elemento.",
    "min-width": "Largura mínima do elemento.",
    "max-width": "Largura máxima do elemento.",
    padding: "Espaço interno, entre o conteúdo e a borda.",
    "padding-top": "Espaço interno em cima.",
    "padding-right": "Espaço interno à direita.",
    "padding-bottom": "Espaço interno embaixo.",
    "padding-left": "Espaço interno à esquerda.",
    "padding-inline": "Espaço interno nas laterais.",
    "padding-block": "Espaço interno em cima e embaixo.",
    margin: "Espaço externo, entre o elemento e os vizinhos.",
    "margin-top": "Espaço externo em cima.",
    "margin-right": "Espaço externo à direita.",
    "margin-bottom": "Espaço externo embaixo.",
    "margin-left": "Espaço externo à esquerda.",
    "margin-inline": "Espaço externo nas laterais (auto centraliza).",
    "margin-block": "Espaço externo em cima e embaixo.",
    border: "Borda: espessura, estilo e cor.",
    "border-top": "Borda de cima.",
    "border-right": "Borda da direita.",
    "border-bottom": "Borda de baixo.",
    "border-left": "Borda da esquerda.",
    "border-radius": "Arredonda os cantos.",
    "border-collapse": "Junta as bordas das células da tabela.",
    "box-shadow": "Sombra da caixa: x, y, desfoque e cor.",
    outline: "Contorno fora da borda; não altera o tamanho.",
    "outline-offset": "Distância entre o contorno e a borda.",
    "box-sizing": "Se padding e borda entram na largura declarada.",
    display: "Como o elemento se comporta no layout (block, inline, flex...).",
    position: "Tipo de posicionamento (relative, absolute, fixed, sticky).",
    top: "Distância do topo (com position).",
    left: "Distância da esquerda (com position).",
    right: "Distância da direita (com position).",
    bottom: "Distância de baixo (com position).",
    inset: "Atalho para top, right, bottom e left.",
    transform: "Move, gira ou muda a escala sem afetar os vizinhos.",
    "z-index": "Ordem de empilhamento: quem fica na frente.",
    overflow: "O que fazer com o conteúdo que não cabe.",
    "overflow-x": "O que fazer com o conteúdo que passa da largura.",
    opacity: "Transparência, de 0 a 1.",
    "flex-direction": "Direção do eixo principal do flex (linha ou coluna).",
    "flex-wrap": "Se os itens podem quebrar para outra linha.",
    "flex-flow": "Atalho para direção + quebra.",
    "justify-content": "Distribui os itens no eixo principal.",
    "align-items": "Alinha os itens no eixo transversal.",
    "align-self": "Alinha só este item no eixo transversal.",
    "align-content": "Distribui as linhas quando há quebra.",
    gap: "Espaço entre os itens de um flex ou grid.",
    flex: "Atalho para crescer, encolher e tamanho base do item.",
    "flex-grow": "Quanto o item cresce para ocupar o espaço livre.",
    "flex-shrink": "Quanto o item encolhe quando falta espaço.",
    "flex-basis": "Tamanho inicial do item no eixo principal.",
    order: "Ordem visual do item (menor aparece antes).",
    "grid-template-columns": "Define as colunas do grid.",
    "grid-template-rows": "Define as linhas do grid.",
    "place-items": "Alinha os itens nos dois eixos de uma vez.",
    "place-content": "Distribui o conteúdo nos dois eixos de uma vez.",
    "list-style": "Atalho para o estilo do marcador da lista.",
    "list-style-type": "Tipo de marcador da lista.",
    cursor: "Formato do ponteiro do mouse sobre o elemento.",
    transition: "Anima a mudança de uma propriedade.",
    content: "Conteúdo gerado por ::before e ::after.",
    "aspect-ratio": "Proporção entre largura e altura.",
    "object-fit": "Como a imagem preenche a caixa.",
    "vertical-align": "Alinhamento vertical na linha de texto.",
    "white-space": "Como espaços e quebras são tratados.",
    "scroll-behavior": "Rolagem suave ou instantânea.",
    visibility: "Mostra ou esconde, mantendo o espaço.",
  },

  /* ------------------------------------------------------------------------
     BLOCOS DE HTML
     ------------------------------------------------------------------------ */
  elementos: {
    /* Texto */
    "titulo-h1": { nome: "Título principal", html: "<h1>Título principal</h1>" },
    "titulo-h2": { nome: "Subtítulo", html: "<h2>Subtítulo</h2>" },
    "titulo-h3": { nome: "Título de seção", html: "<h3>Título de seção</h3>" },
    "titulo-h4": { nome: "Título nível 4", html: "<h4>Título nível 4</h4>" },
    "titulo-h5": { nome: "Título nível 5", html: "<h5>Título nível 5</h5>" },
    "titulo-h6": { nome: "Título nível 6", html: "<h6>Título nível 6</h6>" },
    "titulo-ancora": {
      nome: "Título com id",
      html: '<h2 id="rodape">Rodapé</h2>',
      info: "O id transforma o título em destino de um link com href=\"#rodape\".",
    },
    paragrafo: { nome: "Parágrafo", html: "<p>Um novo parágrafo de texto.</p>" },
    "quebra-br": { nome: "Quebra de linha", html: "<br>" },
    "linha-hr": { nome: "Linha divisória", html: "<hr>" },
    forte: { nome: "Importante", html: "<strong>importante</strong>" },
    enfase: { nome: "Ênfase", html: "<em>ênfase</em>" },
    marca: { nome: "Marca-texto", html: "<mark>destaque</mark>" },
    pequeno: { nome: "Letras miúdas", html: "<small>observação</small>" },
    removido: { nome: "Texto removido", html: "<del>R$ 199,00</del>" },
    inserido: { nome: "Texto inserido", html: "<ins>R$ 149,00</ins>" },
    codigo: { nome: "Código no texto", html: "<code>display: flex;</code>" },
    "citacao-curta": { nome: "Citação curta", html: "<q>A Web é para todos.</q>" },
    abreviacao: { nome: "Abreviação", html: '<abbr title="Cascading Style Sheets">CSS</abbr>' },
    "citacao-longa": {
      nome: "Citação longa",
      html: `
        <blockquote>
          <p>A plataforma web é construída sobre padrões abertos.</p>
          <footer>— Documentação da MDN</footer>
        </blockquote>`,
    },
    "bloco-pre": { nome: "Código pré-formatado", html: '<pre><code>console.log("Olá!");</code></pre>' },
    span: { nome: "Trecho (span)", html: '<span class="destaque">trecho</span>' },

    /* Caracteres especiais */
    "ent-copy": { nome: "Copyright ©", html: "&copy;", info: "Entidade &copy; vira o símbolo ©." },
    "ent-reg": { nome: "Marca registrada ®", html: "&reg;", info: "Entidade &reg; vira o símbolo ®." },
    "ent-trade": { nome: "Marca comercial ™", html: "&trade;", info: "Entidade &trade; vira o símbolo ™." },
    "ent-euro": { nome: "Euro €", html: "&euro; 49,90", info: "Entidade &euro; vira o símbolo €." },
    "ent-setas": { nome: "Setas ← ↑ → ↓", html: "&larr; &uarr; &rarr; &darr;", info: "Entidades de setas." },
    "ent-foguete": { nome: "Emoji foguete 🚀", html: "&#x1F680;", info: "Emoji pelo código hexadecimal Unicode." },
    "ent-lampada": { nome: "Emoji lâmpada 💡", html: "&#x1F4A1;", info: "Emoji pelo código hexadecimal Unicode." },
    "ent-coracao": { nome: "Coração ❤", html: "&#x2764;", info: "Símbolo pelo código hexadecimal Unicode." },
    "ent-tag": {
      nome: "Tag como texto",
      html: "&lt;h1&gt;",
      info: "&lt; e &gt; mostram os sinais < e > sem criar uma tag.",
    },
    "ent-amp": { nome: "E comercial &", html: "Aprender &amp; praticar", info: "&amp; mostra o caractere &." },

    /* Listas */
    "lista-ul": {
      nome: "Lista com marcadores",
      html: `
        <ul>
          <li>Primeiro item</li>
          <li>Segundo item</li>
        </ul>`,
    },
    "lista-ol": {
      nome: "Lista numerada",
      html: `
        <ol>
          <li>Passo um</li>
          <li>Passo dois</li>
        </ol>`,
    },
    "lista-ol-letras": {
      nome: "Lista com letras",
      html: `
        <ol type="A" start="3">
          <li>Item C</li>
          <li>Item D</li>
        </ol>`,
      info: "type escolhe a numeração e start define o valor inicial.",
    },
    "item-li": { nome: "Item de lista", html: "<li>Novo item</li>" },
    "lista-dl": {
      nome: "Lista de definições",
      html: `
        <dl>
          <dt>HTML</dt>
          <dd>Estrutura o conteúdo.</dd>
        </dl>`,
    },
    "termo-dt": { nome: "Termo", html: "<dt>Termo</dt>" },
    "definicao-dd": { nome: "Definição", html: "<dd>Definição do termo.</dd>" },

    /* Links */
    "link-externo": {
      nome: "Link externo",
      html: '<a href="https://developer.mozilla.org/pt-BR/" target="_blank" rel="noopener noreferrer">Documentação da MDN</a>',
      info: "Abre outro site em nova aba. rel=\"noopener\" protege a página original.",
    },
    "link-pagina": {
      nome: "Link para outra página",
      html: '<a href="02-css-fundamentos.html">Próximo módulo</a>',
      info: "Caminho relativo: um arquivo do mesmo projeto.",
    },
    "link-interno": {
      nome: "Link para um trecho",
      html: '<a href="#rodape">Ir para o rodapé</a>',
      info: "O # aponta para o id de um elemento da própria página.",
    },
    "link-email": { nome: "Link de e-mail", html: '<a href="mailto:contato@exemplo.com">Enviar e-mail</a>' },
    "link-download": {
      nome: "Link de download",
      html: '<a href="guia.pdf" download>Baixar guia (PDF)</a>',
      info: "O atributo download sugere baixar o arquivo em vez de abrir.",
    },
    "link-frame": {
      nome: "Link para o frame",
      html: '<a href="05-formularios-avancados.html" target="frame-demo">Abrir módulo 05</a>',
      info: "O target com o nome do iframe abre a página dentro dele.",
    },

    /* Imagens e mídia */
    imagem: {
      nome: "Imagem",
      html: '<img src="https://picsum.photos/seed/bloco-imagem/600/360" alt="Paisagem de exemplo" width="600" height="360">',
    },
    figura: {
      nome: "Imagem com legenda",
      html: `
        <figure>
          <img src="https://picsum.photos/seed/bloco-figura/600/360" alt="Paisagem de exemplo" width="600" height="360">
          <figcaption>Legenda da imagem.</figcaption>
        </figure>`,
    },
    "legenda-figcaption": { nome: "Legenda", html: "<figcaption>Legenda da imagem.</figcaption>" },
    picture: {
      nome: "Imagem adaptativa",
      html: `
        <picture>
          <source media="(min-width: 700px)" srcset="https://picsum.photos/seed/bloco-picture/1000/420">
          <img src="https://picsum.photos/seed/bloco-picture/480/360" alt="Paisagem adaptativa" width="480" height="360">
        </picture>`,
    },
    audio: {
      nome: "Áudio",
      html: '<audio controls src="https://www.w3schools.com/html/horse.mp3"></audio>',
      amostra: '<div class="pv-midia">♪ ▶ ━━━━━━━ 0:00</div>',
    },
    video: {
      nome: "Vídeo",
      html: `
        <video controls width="480" poster="https://picsum.photos/seed/bloco-poster/960/540">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        </video>`,
      amostra: '<div class="pv-midia pv-tela">▶</div>',
    },
    "iframe-youtube": {
      nome: "Vídeo do YouTube",
      html: `
        <iframe
          width="480"
          height="270"
          src="https://www.youtube.com/embed/M7lc1UVf-VE"
          title="Vídeo do YouTube"
          allowfullscreen></iframe>`,
      amostra: '<div class="pv-midia pv-tela pv-yt">▶ YouTube</div>',
    },
    "iframe-mapa": {
      nome: "Mapa",
      html: `
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-46.70%2C-23.60%2C-46.60%2C-23.53&layer=mapnik"
          title="Mapa de São Paulo"
          width="100%"
          height="260"></iframe>`,
      amostra: '<div class="pv-midia pv-mapa">⌖ mapa</div>',
    },
    "iframe-pagina": {
      nome: "Página em um iframe",
      html: '<iframe src="01-fundamentos-html.html" name="frame-demo" title="Aula de HTML" width="100%" height="260"></iframe>',
      amostra: '<div class="pv-midia pv-pagina">▤ página</div>',
    },

    /* Estrutura semântica */
    header: {
      nome: "Cabeçalho",
      html: `
        <header>
          <h1>Meu site</h1>
        </header>`,
    },
    nav: {
      nome: "Menu de navegação",
      html: `
        <nav aria-label="Principal">
          <a href="#inicio">Início</a>
          <a href="#contato">Contato</a>
        </nav>`,
    },
    main: {
      nome: "Conteúdo principal",
      html: `
        <main>
          <h2>Conteúdo principal</h2>
        </main>`,
    },
    section: {
      nome: "Seção",
      html: `
        <section>
          <h2>Nova seção</h2>
          <p>Conteúdo da seção.</p>
        </section>`,
    },
    article: {
      nome: "Artigo",
      html: `
        <article>
          <h2>Título do artigo</h2>
          <p>Texto do artigo.</p>
        </article>`,
    },
    aside: {
      nome: "Conteúdo lateral",
      html: `
        <aside>
          <p>Dica: conteúdo complementar.</p>
        </aside>`,
    },
    footer: {
      nome: "Rodapé",
      html: `
        <footer>
          <p>&copy; 2026 Meu site</p>
        </footer>`,
    },
    div: { nome: "Caixa genérica", html: "<div>Uma caixa genérica</div>" },

    /* Componentes com classe */
    caixa: { nome: "Caixa", html: '<div class="caixa">Caixa</div>' },
    cartao: {
      nome: "Cartão",
      html: `
        <div class="cartao">
          <h3>Título do cartão</h3>
          <p>Texto do cartão.</p>
        </div>`,
    },
    "container-flex": {
      nome: "Contêiner com itens",
      html: `
        <div class="container">
          <div class="item">1</div>
          <div class="item">2</div>
          <div class="item">3</div>
        </div>`,
      info: "Um contêiner com três itens: arraste estilos de Flexbox para ele.",
    },
    "item-flex": { nome: "Item", html: '<div class="item">Novo item</div>' },
    botao: { nome: "Botão", html: '<button class="botao" type="button">Clique aqui</button>' },

    /* Tabelas */
    tabela: {
      nome: "Tabela completa",
      html: `
        <table>
          <caption>Título da tabela</caption>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ana</td>
              <td>9,5</td>
            </tr>
          </tbody>
        </table>`,
    },
    "legenda-caption": { nome: "Título da tabela", html: "<caption>Título da tabela</caption>" },
    "cabecalho-thead": {
      nome: "Cabeçalho da tabela",
      html: `
        <thead>
          <tr>
            <th scope="col">Coluna</th>
            <th scope="col">Coluna</th>
          </tr>
        </thead>`,
    },
    "corpo-tbody": {
      nome: "Corpo da tabela",
      html: `
        <tbody>
          <tr>
            <td>Célula</td>
            <td>Célula</td>
          </tr>
        </tbody>`,
    },
    "rodape-tfoot": {
      nome: "Rodapé da tabela",
      html: `
        <tfoot>
          <tr>
            <td>Total</td>
            <td>0</td>
          </tr>
        </tfoot>`,
    },
    "linha-tr": {
      nome: "Linha",
      html: `
        <tr>
          <td>Célula</td>
          <td>Célula</td>
        </tr>`,
    },
    "celula-td": { nome: "Célula", html: "<td>Célula</td>" },
    "cabecalho-th": { nome: "Célula de cabeçalho", html: '<th scope="row">Cabeçalho</th>' },
    "celula-colspan": {
      nome: "Célula larga",
      html: '<td colspan="2">Ocupa duas colunas</td>',
      info: "colspan faz a célula ocupar mais de uma coluna.",
    },
    "celula-rowspan": {
      nome: "Célula alta",
      html: '<td rowspan="2">Ocupa duas linhas</td>',
      info: "rowspan faz a célula ocupar mais de uma linha.",
    },
    colgroup: {
      nome: "Grupo de colunas",
      html: `
        <colgroup>
          <col>
          <col span="2" class="destaque">
        </colgroup>`,
    },

    /* Formulários */
    formulario: {
      nome: "Formulário",
      html: `
        <form action="/enviar" method="post">
          <label for="nome">Nome</label>
          <input type="text" id="nome" name="nome" required>
          <button type="submit">Enviar</button>
        </form>`,
    },
    "campo-texto": {
      nome: "Campo de texto",
      html: `
        <label for="nome">Nome</label>
        <input type="text" id="nome" name="nome" autocomplete="name">`,
    },
    "campo-email": {
      nome: "Campo de e-mail",
      html: `
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" autocomplete="email" required>`,
      info: "type=\"email\" valida o formato e mostra o teclado de e-mail no celular.",
    },
    "campo-senha": {
      nome: "Campo de senha",
      html: `
        <label for="senha">Senha</label>
        <input type="password" id="senha" name="senha" minlength="8">`,
    },
    "campo-telefone": {
      nome: "Campo de telefone",
      html: `
        <label for="telefone">Telefone</label>
        <input type="tel" id="telefone" name="telefone" inputmode="tel">`,
    },
    "campo-numero": {
      nome: "Campo numérico",
      html: `
        <label for="quantidade">Quantidade</label>
        <input type="number" id="quantidade" name="quantidade" min="1" max="10" value="1">`,
    },
    "campo-data": {
      nome: "Campo de data",
      html: `
        <label for="data">Data</label>
        <input type="date" id="data" name="data">`,
    },
    "campo-cor": {
      nome: "Seletor de cor",
      html: `
        <label for="cor">Cor favorita</label>
        <input type="color" id="cor" name="cor" value="#4f46e5">`,
    },
    "campo-intervalo": {
      nome: "Controle deslizante",
      html: `
        <label for="nivel">Nível</label>
        <input type="range" id="nivel" name="nivel" min="0" max="10" value="5">`,
    },
    "campo-arquivo": {
      nome: "Envio de arquivo",
      html: `
        <label for="anexo">Anexo</label>
        <input type="file" id="anexo" name="anexo" accept=".pdf">`,
    },
    "campo-apelido": {
      nome: "Campo com limites",
      html: `
        <label for="apelido">Apelido</label>
        <input type="text" id="apelido" name="apelido" minlength="3" maxlength="18" required>`,
      info: "minlength e maxlength limitam a quantidade de caracteres.",
    },
    "campo-telefone-padrao": {
      nome: "Telefone com pattern",
      html: `
        <label for="celular">Celular</label>
        <input type="tel" id="celular" name="celular" placeholder="11 91234-5678" pattern="[0-9]{2} [0-9]{4,5}-[0-9]{4}">`,
      info: "pattern é uma expressão regular: o valor precisa seguir o formato.",
    },
    "campo-cep": {
      nome: "CEP com pattern",
      html: `
        <label for="cep">CEP</label>
        <input type="text" id="cep" name="cep" placeholder="01000-000" pattern="[0-9]{5}-[0-9]{3}" inputmode="numeric">`,
    },
    "caixa-selecao": {
      nome: "Caixa de seleção",
      html: `
        <label>
          <input type="checkbox" name="interesses" value="html">
          HTML
        </label>`,
      info: "checkbox: a pessoa pode marcar várias opções.",
    },
    "botao-radio": {
      nome: "Opção única (radio)",
      html: `
        <label>
          <input type="radio" name="plano" value="intensivo">
          Intensivo
        </label>`,
      info: "radios com o mesmo name formam um grupo: só um fica marcado.",
    },
    "selecao-select": {
      nome: "Lista de opções",
      html: `
        <label for="trilha">Trilha</label>
        <select id="trilha" name="trilha">
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>`,
    },
    "opcao-option": { nome: "Opção", html: '<option value="js">JavaScript</option>' },
    "grupo-optgroup": {
      nome: "Grupo de opções",
      html: `
        <optgroup label="Complementos">
          <option value="git">Git</option>
        </optgroup>`,
    },
    "campo-sugestoes": {
      nome: "Campo com sugestões",
      html: `
        <label for="linguagem">Linguagem</label>
        <input list="linguagens" id="linguagem" name="linguagem">
        <datalist id="linguagens">
          <option value="HTML"></option>
          <option value="CSS"></option>
        </datalist>`,
    },
    "area-texto": {
      nome: "Texto longo",
      html: `
        <label for="mensagem">Mensagem</label>
        <textarea id="mensagem" name="mensagem" rows="4"></textarea>`,
    },
    "botao-enviar": { nome: "Botão de enviar", html: '<button type="submit">Enviar</button>' },
    "grupo-fieldset": {
      nome: "Grupo de campos",
      html: `
        <fieldset>
          <legend>Grupo de campos</legend>
        </fieldset>`,
    },
    "legenda-legend": { nome: "Título do grupo", html: "<legend>Título do grupo</legend>" },
    "saida-output": { nome: "Saída (output)", html: '<output for="nivel">5</output>' },
  },

  /* ------------------------------------------------------------------------
     BLOCOS DE CSS
     ------------------------------------------------------------------------ */
  estilos: {
    /* Texto */
    "cor-texto": { nome: "Cor do texto", css: [["color", "#e11d48"]] },
    "fonte-grande": { nome: "Texto grande", css: [["font-size", "2rem"]] },
    negrito: { nome: "Negrito", css: [["font-weight", "700"]] },
    italico: { nome: "Itálico", css: [["font-style", "italic"]] },
    "centralizar-texto": { nome: "Centralizar texto", css: [["text-align", "center"]] },
    maiusculas: { nome: "Maiúsculas", css: [["text-transform", "uppercase"]] },
    "espaco-letras": { nome: "Espaço entre letras", css: [["letter-spacing", "0.12em"]] },
    "altura-linha": { nome: "Linhas mais altas", css: [["line-height", "1.9"]] },
    recuo: { nome: "Recuo da 1ª linha", css: [["text-indent", "2em"]] },
    "fonte-serifa": { nome: "Fonte com serifa", css: [["font-family", "Georgia, serif"]] },
    "fonte-mono": { nome: "Fonte monoespaçada", css: [["font-family", '"Courier New", monospace']] },
    "sombra-texto": { nome: "Sombra no texto", css: [["text-shadow", "2px 3px 0 #c7d2fe"]] },
    "sem-sublinhado": { nome: "Sem sublinhado", css: [["text-decoration", "none"]] },

    /* Fundo */
    "cor-fundo": { nome: "Cor de fundo", css: [["background-color", "#eef2ff"]] },
    "fundo-escuro": {
      nome: "Fundo escuro",
      css: [["background-color", "#0b1324"], ["color", "#ffffff"]],
      info: "Fundo escuro com texto claro: sempre confira o contraste.",
    },
    "gradiente-linear": {
      nome: "Gradiente linear",
      css: [["background-image", "linear-gradient(135deg, #4f46e5, #0ea5e9)"], ["color", "#ffffff"]],
    },
    "gradiente-radial": {
      nome: "Gradiente radial",
      css: [["background-image", "radial-gradient(circle at 30% 30%, #fef08a, #fb7185 45%, #4c1d95)"]],
    },
    "fundo-imagem": {
      nome: "Imagem de fundo",
      css: [
        ["background-image", 'url("https://picsum.photos/seed/fundo-bloco/1200/800")'],
        ["background-size", "cover"],
        ["background-position", "center"],
      ],
    },
    "fundo-repetir": { nome: "Repetir na horizontal", css: [["background-repeat", "repeat-x"]] },
    "fundo-contain": { nome: "Fundo inteiro (contain)", css: [["background-size", "contain"]] },
    "fundo-fixo": { nome: "Fundo fixo (parallax)", css: [["background-attachment", "fixed"]] },

    /* Caixa */
    "espaco-interno": { nome: "Espaço interno", css: [["padding", "16px"]] },
    "espaco-externo": { nome: "Espaço externo", css: [["margin", "16px"]] },
    "centralizar-bloco": {
      nome: "Centralizar a caixa",
      css: [["max-width", "420px"], ["margin-inline", "auto"]],
      info: "Com largura máxima, margem automática nas laterais centraliza a caixa.",
    },
    largura: { nome: "Largura fixa", css: [["width", "300px"]] },
    "largura-total": { nome: "Largura total", css: [["width", "100%"]] },
    borda: { nome: "Borda", css: [["border", "2px solid #4f46e5"]] },
    "borda-tracejada": { nome: "Borda tracejada", css: [["border", "2px dashed #94a3b8"]] },
    arredondar: { nome: "Cantos arredondados", css: [["border-radius", "12px"]] },
    circulo: { nome: "Círculo", css: [["border-radius", "50%"]] },
    sombra: { nome: "Sombra", css: [["box-shadow", "0 12px 28px rgba(15, 23, 42, 0.18)"]] },
    contorno: { nome: "Contorno", css: [["outline", "3px dashed #f59e0b"], ["outline-offset", "4px"]] },
    "box-sizing": { nome: "Largura inclui borda", css: [["box-sizing", "border-box"]] },
    opacidade: { nome: "Semitransparente", css: [["opacity", "0.5"]] },
    "imagem-fluida": {
      nome: "Imagem fluida",
      css: [["max-width", "100%"], ["height", "auto"]],
      info: "A imagem nunca passa da largura do contêiner e mantém a proporção.",
    },
    "marcador-quadrado": { nome: "Marcador quadrado", css: [["list-style-type", "square"]] },
    "sem-marcador": { nome: "Sem marcador", css: [["list-style", "none"]] },

    /* Display */
    "display-block": { nome: "display: block", css: [["display", "block"]] },
    "display-inline": { nome: "display: inline", css: [["display", "inline"]] },
    "display-inline-block": { nome: "display: inline-block", css: [["display", "inline-block"]] },
    "display-none": { nome: "Esconder", css: [["display", "none"]] },
    "display-flex": { nome: "Virar flex", css: [["display", "flex"]] },
    "display-grid": { nome: "Virar grid", css: [["display", "grid"]] },

    /* Flexbox */
    "direcao-linha": { nome: "Itens em linha", css: [["flex-direction", "row"]] },
    "direcao-coluna": { nome: "Itens em coluna", css: [["flex-direction", "column"]] },
    "direcao-inversa": { nome: "Linha invertida", css: [["flex-direction", "row-reverse"]] },
    quebrar: { nome: "Quebrar linha", css: [["flex-wrap", "wrap"]] },
    "justificar-inicio": { nome: "Juntar no início", css: [["justify-content", "flex-start"]] },
    "justificar-centro": { nome: "Centralizar itens", css: [["justify-content", "center"]] },
    "justificar-fim": { nome: "Juntar no fim", css: [["justify-content", "flex-end"]] },
    "justificar-entre": { nome: "Espaço entre", css: [["justify-content", "space-between"]] },
    "justificar-ao-redor": { nome: "Espaço ao redor", css: [["justify-content", "space-around"]] },
    "justificar-igual": { nome: "Espaços iguais", css: [["justify-content", "space-evenly"]] },
    "alinhar-inicio": { nome: "Alinhar no topo", css: [["align-items", "flex-start"]] },
    "alinhar-centro": { nome: "Alinhar no meio", css: [["align-items", "center"]] },
    "alinhar-fim": { nome: "Alinhar embaixo", css: [["align-items", "flex-end"]] },
    "alinhar-esticar": { nome: "Esticar itens", css: [["align-items", "stretch"]] },
    "espacamento-gap": { nome: "Espaço entre itens", css: [["gap", "16px"]] },
    crescer: { nome: "Crescer (flex: 1)", css: [["flex", "1"]] },
    "crescer-dobro": { nome: "Crescer o dobro", css: [["flex-grow", "2"]] },
    "base-150": { nome: "Tamanho base 150px", css: [["flex-basis", "150px"]] },
    "ordem-primeiro": { nome: "Ir para o início", css: [["order", "-1"]] },
    "auto-centro": { nome: "Só este no meio", css: [["align-self", "center"]] },
    "centralizar-flex": {
      nome: "Centralizar tudo",
      css: [["display", "flex"], ["justify-content", "center"], ["align-items", "center"]],
      info: "As três linhas clássicas para centralizar nos dois eixos.",
    },

    /* Grid */
    "grid-3-colunas": {
      nome: "Grade de 3 colunas",
      css: [["display", "grid"], ["grid-template-columns", "repeat(3, 1fr)"], ["gap", "12px"]],
    },
    "grid-auto": {
      nome: "Grade automática",
      css: [["display", "grid"], ["grid-template-columns", "repeat(auto-fit, minmax(160px, 1fr))"], ["gap", "12px"]],
      info: "Cria quantas colunas couberem, cada uma com pelo menos 160px.",
    },
    "centraliza-grid": { nome: "Centralizar (grid)", css: [["display", "grid"], ["place-items", "center"]] },
    "altura-tela": { nome: "Altura da tela", css: [["min-height", "100vh"]] },

    /* Posição */
    relativo: { nome: "Referência (relative)", css: [["position", "relative"]] },
    "centro-absoluto": {
      nome: "Centro absoluto",
      css: [["position", "absolute"], ["top", "50%"], ["left", "50%"], ["transform", "translate(-50%, -50%)"]],
      info: "Ancora no centro do pai mais próximo que tenha position: relative.",
    },
    "fixo-topo": { nome: "Grudar no topo", css: [["position", "sticky"], ["top", "0"]] },

    /* Responsivo */
    "duas-colunas-600": {
      nome: "2 colunas a partir de 600px",
      css: [["display", "grid"], ["grid-template-columns", "repeat(2, 1fr)"], ["gap", "12px"]],
      midia: "(min-width: 600px)",
      info: "Só vale quando a tela tem 600px ou mais (mobile-first).",
    },
    "esconder-celular": {
      nome: "Esconder no celular",
      css: [["display", "none"]],
      midia: "(max-width: 600px)",
      info: "Some em telas de até 600px. Arraste a divisória para testar.",
    },

    /* Estados e pseudo-elementos */
    "hover-fundo": {
      nome: "Cor ao passar o mouse",
      css: [["background-color", "#3730a3"], ["color", "#ffffff"]],
      sufixo: ":hover",
    },
    "hover-subir": { nome: "Subir ao passar o mouse", css: [["transform", "translateY(-4px)"]], sufixo: ":hover" },
    "foco-visivel": {
      nome: "Foco visível",
      css: [["outline", "3px solid #4f46e5"]],
      sufixo: ":focus-visible",
      info: "Aparece quando a pessoa navega com a tecla Tab.",
    },
    "antes-estrela": { nome: "Estrela antes", css: [["content", '"★ "'], ["color", "#d97706"]], sufixo: "::before" },
    transicao: { nome: "Transição suave", css: [["transition", "all 0.2s ease"]] },
  },

  /* Conjuntos usados nos kits com "@nome" */
  grupos: {
    texto: ["cor-texto", "fonte-grande", "negrito", "centralizar-texto", "maiusculas", "fonte-serifa"],
    caixa: ["espaco-interno", "borda", "arredondar", "sombra", "cor-fundo", "largura"],
  },

  /* ------------------------------------------------------------------------
     KITS: QUAIS BLOCOS APARECEM EM CADA EXERCÍCIO
     ------------------------------------------------------------------------ */
  kits: {
    "01-fundamentos-html.html": {
      "estrutura-base.html": {
        blocos: ["titulo-h1", "titulo-h2", "paragrafo", "forte", "enfase", "imagem", "link-externo", "linha-hr"],
        estilos: ["@texto"],
      },
      "texto-e-quebras.html": {
        blocos: ["paragrafo", "quebra-br", "linha-hr", "titulo-h2", "forte"],
        estilos: ["altura-linha", "cor-fundo", "espaco-interno"],
      },
      "entidades.html": {
        blocos: ["paragrafo", "ent-copy", "ent-reg", "ent-trade", "ent-euro", "ent-setas", "ent-foguete", "ent-lampada", "ent-coracao", "ent-tag", "ent-amp"],
        estilos: ["fonte-grande", "centralizar-texto"],
      },
      "hierarquia-de-titulos.html": {
        blocos: ["titulo-h1", "titulo-h2", "titulo-h3", "titulo-h4", "titulo-h5", "titulo-h6", "paragrafo"],
        estilos: ["fonte-grande", "cor-texto", "maiusculas"],
      },
      "semantica-textual.html": {
        blocos: ["paragrafo", "forte", "enfase", "marca", "pequeno", "removido", "inserido", "codigo", "citacao-curta", "abreviacao", "citacao-longa", "bloco-pre"],
        estilos: ["cor-fundo", "cor-texto"],
      },
      "listas.html": {
        blocos: ["lista-ul", "lista-ol", "lista-ol-letras", "item-li", "lista-dl", "termo-dt", "definicao-dd", "titulo-h3"],
        estilos: ["marcador-quadrado", "sem-marcador", "espaco-interno"],
      },
      "links.html": {
        blocos: ["link-externo", "link-pagina", "link-interno", "titulo-ancora", "link-email", "link-download", "paragrafo"],
        estilos: ["cor-texto", "sem-sublinhado", "negrito"],
      },
      "imagens.html": {
        blocos: ["imagem", "figura", "legenda-figcaption", "picture", "paragrafo"],
        estilos: ["arredondar", "sombra", "largura-total"],
      },
      "midias.html": {
        blocos: ["audio", "video", "iframe-youtube", "iframe-mapa", "titulo-h3"],
        estilos: ["arredondar", "largura-total"],
      },
      exercicio: {
        blocos: ["titulo-h1", "titulo-h2", "section", "paragrafo", "lista-ul", "item-li", "imagem", "link-email"],
        estilos: ["@texto"],
      },
    },

    "02-css-fundamentos.html": {
      "formas-de-aplicar.html": {
        blocos: ["paragrafo", "titulo-h2", "forte", "span"],
        estilos: ["cor-texto", "negrito", "fonte-grande", "cor-fundo"],
      },
      "cores.css": { blocos: ["caixa"], estilos: ["cor-texto", "cor-fundo", "fundo-escuro", "opacidade"] },
      "gradientes.css": {
        blocos: ["caixa", "cartao"],
        estilos: ["gradiente-linear", "gradiente-radial", "fundo-imagem", "cor-texto"],
      },
      "tipografia.html + tipografia.css": {
        blocos: ["titulo-h1", "titulo-h2", "paragrafo", "citacao-longa"],
        estilos: ["@texto", "altura-linha", "espaco-letras", "recuo", "fonte-mono"],
      },
      "seletores.css": {
        blocos: ["paragrafo", "span", "lista-ul", "item-li", "titulo-h2", "forte"],
        estilos: ["cor-texto", "cor-fundo", "negrito", "arredondar"],
      },
      "estados-e-pseudo-elementos.css": {
        blocos: ["botao", "link-externo", "paragrafo", "cartao"],
        estilos: ["hover-fundo", "hover-subir", "foco-visivel", "antes-estrela", "transicao", "arredondar"],
      },
      "especificidade.css": { blocos: ["paragrafo", "titulo-h2"], estilos: ["cor-texto", "negrito"] },
      exercicio: {
        blocos: ["cartao", "titulo-h2", "paragrafo", "link-externo", "botao"],
        estilos: ["gradiente-linear", "fonte-serifa", "hover-fundo", "arredondar", "espaco-interno"],
      },
    },

    "03-layout-caixas-fundos.html": {
      "box-model.css": {
        blocos: ["caixa", "paragrafo"],
        estilos: ["espaco-interno", "espaco-externo", "borda", "largura", "box-sizing", "centralizar-bloco"],
      },
      "efeitos-visuais.css": {
        blocos: ["caixa", "cartao", "botao"],
        estilos: ["sombra", "contorno", "arredondar", "circulo", "sombra-texto", "borda"],
      },
      "block-inline.css": {
        blocos: ["div", "span", "paragrafo", "caixa"],
        estilos: ["display-block", "display-inline", "display-inline-block", "display-none", "largura", "espaco-interno"],
      },
      "estrutura-semantica.html": {
        blocos: ["header", "nav", "main", "section", "article", "aside", "footer", "div", "titulo-h2", "paragrafo"],
        estilos: ["fundo-escuro", "espaco-interno", "arredondar"],
      },
      "fundos.css": {
        blocos: ["caixa"],
        estilos: ["cor-fundo", "fundo-imagem", "gradiente-linear", "fundo-repetir", "fundo-contain"],
      },
      "centralizacao-absoluta.css": {
        blocos: ["caixa"],
        estilos: ["relativo", "centro-absoluto", "centralizar-flex", "display-flex"],
      },
      exercicio: {
        blocos: ["cartao", "titulo-h2", "paragrafo", "span"],
        estilos: ["espaco-interno", "arredondar", "sombra", "relativo", "centro-absoluto"],
      },
    },

    "04-tabelas-iframes.html": {
      "tabela-semantica.html": {
        blocos: ["tabela", "legenda-caption", "cabecalho-thead", "corpo-tbody", "rodape-tfoot", "linha-tr", "celula-td", "cabecalho-th"],
        estilos: ["cor-fundo", "negrito", "centralizar-texto", "borda"],
      },
      "acessibilidade-colgroup.html": {
        blocos: ["tabela", "colgroup", "linha-tr", "celula-td", "cabecalho-th"],
        estilos: ["cor-fundo"],
      },
      "tabela-avancada.html + CSS": {
        blocos: ["tabela", "linha-tr", "celula-td", "celula-colspan", "celula-rowspan", "cabecalho-th"],
        estilos: ["cor-fundo", "fundo-escuro", "centralizar-texto"],
      },
      "iframes.html": {
        blocos: ["iframe-pagina", "iframe-mapa", "iframe-youtube", "titulo-h3"],
        estilos: ["arredondar", "borda", "largura-total"],
      },
      "frames-nomeados.html": {
        blocos: ["link-frame", "iframe-pagina", "nav", "paragrafo"],
        estilos: ["display-flex", "espacamento-gap"],
      },
      exercicio: {
        blocos: ["tabela", "linha-tr", "celula-td", "celula-colspan", "iframe-mapa", "link-externo"],
        estilos: ["fundo-escuro", "cor-fundo"],
      },
    },

    "05-formularios-avancados.html": {
      "formulario-acessivel.html": {
        blocos: ["formulario", "campo-texto", "campo-email", "campo-senha", "caixa-selecao", "botao-enviar"],
        estilos: ["espaco-interno", "arredondar", "borda", "largura-total"],
      },
      "tipos-de-input.html": {
        blocos: ["campo-texto", "campo-email", "campo-senha", "campo-telefone", "campo-numero", "campo-data", "campo-cor", "campo-intervalo", "campo-arquivo"],
        estilos: ["borda", "arredondar"],
      },
      "restricoes.html": {
        blocos: ["campo-apelido", "campo-telefone-padrao", "campo-cep", "campo-numero", "botao-enviar"],
        estilos: ["borda", "arredondar"],
      },
      "agrupamentos.html": {
        blocos: ["grupo-fieldset", "legenda-legend", "botao-radio", "caixa-selecao", "selecao-select", "opcao-option", "grupo-optgroup", "campo-sugestoes", "area-texto", "botao-enviar"],
        estilos: ["borda", "arredondar", "display-flex"],
      },
      "output-dinamico.html": {
        blocos: ["campo-intervalo", "saida-output", "botao"],
        estilos: ["fonte-grande", "cor-fundo", "arredondar"],
      },
      exercicio: {
        blocos: ["formulario", "campo-texto", "campo-email", "campo-telefone-padrao", "selecao-select", "caixa-selecao", "area-texto", "saida-output", "botao-enviar"],
        estilos: ["espaco-interno", "borda", "arredondar"],
      },
    },

    "06-responsividade-media-queries.html": {
      "mobile-first.html + CSS": {
        blocos: ["cartao"],
        estilos: ["grid-auto", "duas-colunas-600", "esconder-celular", "espaco-interno"],
      },
      "media-types.css": { blocos: ["paragrafo"], estilos: ["esconder-celular", "cor-fundo"] },
      "breakpoints.css": { blocos: ["caixa"], estilos: ["duas-colunas-600", "grid-auto", "esconder-celular"] },
      "imagens-fluidas.html + CSS": {
        blocos: ["imagem", "figura", "paragrafo"],
        estilos: ["imagem-fluida", "arredondar", "largura-total"],
      },
      "menu-hamburguer.html + CSS": {
        blocos: ["link-interno"],
        estilos: ["esconder-celular", "display-flex", "espacamento-gap"],
      },
      exercicio: {
        blocos: ["cartao", "imagem", "nav", "link-interno", "paragrafo"],
        estilos: ["grid-auto", "duas-colunas-600", "imagem-fluida", "esconder-celular"],
      },
    },

    "07-flexbox-layout.html": {
      "eixos.css": {
        blocos: ["container-flex", "item-flex"],
        estilos: ["display-flex", "direcao-linha", "direcao-coluna", "direcao-inversa", "justificar-centro", "alinhar-centro"],
      },
      "container-flex.css": {
        blocos: ["container-flex", "item-flex"],
        estilos: ["display-flex", "direcao-coluna", "quebrar", "espacamento-gap", "direcao-inversa"],
      },
      "justify-align.css": {
        blocos: ["container-flex", "item-flex"],
        estilos: ["justificar-inicio", "justificar-centro", "justificar-fim", "justificar-entre", "justificar-ao-redor", "justificar-igual", "alinhar-inicio", "alinhar-centro", "alinhar-fim", "alinhar-esticar"],
      },
      "itens-flex.css": {
        blocos: ["container-flex", "item-flex"],
        estilos: ["crescer", "crescer-dobro", "base-150", "ordem-primeiro", "auto-centro"],
      },
      "centralizacao-flex.css": {
        blocos: ["cartao", "caixa"],
        estilos: ["centralizar-flex", "centraliza-grid", "altura-tela", "display-flex"],
      },
      exercicio: {
        blocos: ["nav", "link-interno", "botao", "caixa", "container-flex"],
        estilos: ["display-flex", "justificar-entre", "alinhar-centro", "quebrar", "espacamento-gap"],
      },
    },

    "08-projetos-integradores.html": {
      "perfil.html + perfil.css": {
        blocos: ["paragrafo", "link-externo"],
        estilos: ["gradiente-linear", "arredondar", "sombra", "display-flex", "espacamento-gap"],
      },
      "galeria.html + galeria.css": { blocos: ["imagem"], estilos: ["grid-3-colunas", "arredondar", "sombra"] },
      "mini-site.html + mini-site.css": {
        blocos: ["cartao", "paragrafo"],
        estilos: ["arredondar", "sombra", "hover-subir", "transicao"],
      },
      "parallax.html + parallax.css": {
        blocos: ["section", "paragrafo"],
        estilos: ["fundo-imagem", "fundo-fixo", "centralizar-texto"],
      },
    },
  },
};
