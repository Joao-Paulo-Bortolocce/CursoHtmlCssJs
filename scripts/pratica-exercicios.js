/* ==========================================================================
   FUNDAMENTOS.WEB — Exercícios do modo prática
   --------------------------------------------------------------------------
   Cada bloco de código das aulas vira um exercício com dois arquivos:
   index.html (já ligado ao style.css) e style.css. O código exibido na aula
   é sempre o ponto de partida; este arquivo só complementa cada exemplo.

   A chave de cada exercício é o nome mostrado no topo do bloco de código
   (por exemplo, "cores.css"). Campos disponíveis:

   desafio  Texto do painel "Desafio" (aceita HTML simples).
   body     HTML do <body>. Necessário nos exemplos só de CSS, que não têm
            marcação própria. Nos exemplos HTML, o código da aula é usado.
   head     Conteúdo extra do <head> (por exemplo, links do Google Fonts).
   base     CSS de apoio que monta o cenário. Fica no início do style.css,
            antes do código da aula, que continua podendo sobrescrevê-lo.
   trocas   Pares [de, para] aplicados ao código da aula. Servem para
            trocar imagens fictícias ("imagem.jpg") por imagens reais.
   html     index.html completo (substitui head e body).
   css      style.css completo (substitui base e código da aula).
   blocos   Ids de scripts/pratica-blocos.js para a paleta do modo
            "Arrastar e soltar" (substitui o kit definido lá).
   estilos  Idem, para os blocos de CSS da paleta.

   A chave "exercicio" configura o botão do exercício de fechamento.
   Um bloco de código novo nas aulas ganha o botão "Praticar" sozinho,
   mesmo sem entrada aqui.
   ========================================================================== */

window.PRATICA_EXERCICIOS = {
  /* ========================================================================
     MÓDULO 01 · FUNDAMENTOS DE HTML
     ======================================================================== */
  "01-fundamentos-html.html": {
    "estrutura-base.html": {
      desafio: `
        Troque o texto do <code>&lt;h1&gt;</code> e do <code>&lt;title&gt;</code> e
        acrescente um parágrafo com o seu nome. Repare: o <code>&lt;title&gt;</code>
        não aparece no resultado, ele vai para a aba do navegador (teste com o botão ↗).`,
    },

    "texto-e-quebras.html": {
      desafio: `
        Apague os <code>&lt;br&gt;</code> do endereço e veja as linhas se juntarem.
        Depois aperte Enter várias vezes no meio do primeiro parágrafo: o navegador
        respeita essas quebras?`,
    },

    "entidades.html": {
      desafio: `
        Adicione o símbolo de marca comercial (<code>&amp;trade;</code>) e um coração
        (<code>&amp;#x2764;</code>). Depois faça a tag <code>&lt;h1&gt;</code> aparecer
        como texto na página usando <code>&amp;lt;</code> e <code>&amp;gt;</code>.`,
    },

    "hierarquia-de-titulos.html": {
      desafio: `
        No <code>style.css</code>, crie uma regra que deixe o <code>h6</code> maior que
        o <code>h1</code>. O tamanho muda, mas a importância semântica continua a mesma:
        quem define o nível é a tag, não o visual.`,
    },

    "semantica-textual.html": {
      desafio: `
        Destaque um trecho seu com <code>&lt;mark&gt;</code>, crie outro preço riscado com
        <code>&lt;del&gt;</code> e <code>&lt;ins&gt;</code> e adicione a sigla CSS com
        <code>&lt;abbr title&gt;</code>. Passe o mouse sobre ela no resultado.`,
    },

    "listas.html": {
      desafio: `
        Mude a lista ordenada para <code>type="a"</code> e <code>start="1"</code>,
        adicione uma ferramenta à lista não ordenada e um novo termo ao glossário
        (<code>&lt;dt&gt;</code> + <code>&lt;dd&gt;</code>).`,
    },

    "links.html": {
      desafio: `
        No final do código, crie <code>&lt;h2 id="rodape"&gt;Rodapé&lt;/h2&gt;</code>
        (com alguns parágrafos antes, para ter rolagem) e um link no topo com
        <code>href="#rodape"</code>. Clique nele no resultado.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
          line-height: 1.6;
        }

        /* Cada link em uma linha, para facilitar a leitura */
        a {
          display: block;
          margin-block: 10px;
        }`,
    },

    "imagens.html": {
      desafio: `
        Troque <code>paisagem-html</code> por outra palavra nos endereços das imagens
        (ex.: <code>praia</code>) para receber uma foto nova e atualize o <code>alt</code>.
        Depois arraste a divisória: o <code>&lt;picture&gt;</code> troca de imagem
        conforme a largura.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        /* A imagem nunca fica maior que a área disponível */
        img {
          max-width: 100%;
          height: auto;
        }

        figure {
          margin: 0 0 24px;
        }

        figcaption {
          color: #5f6b7d;
          font-size: 14px;
        }`,
    },

    "midias.html": {
      desafio: `
        Remova o atributo <code>controls</code> do vídeo e veja o que acontece. Depois
        troque o <code>poster</code> por
        <code>https://picsum.photos/seed/meu-poster/1200/675</code>.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        audio,
        video,
        iframe {
          display: block;
          max-width: 100%;
          margin-bottom: 20px;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 02 · FUNDAMENTOS DE CSS
     ======================================================================== */
  "02-css-fundamentos.html": {
    "formas-de-aplicar.html": {
      desafio: `
        Adicione a classe <code>destaque-externo</code> ao primeiro parágrafo (o que tem
        <code>style</code>). Qual cor vence: a inline ou a do arquivo externo? Depois apague
        o <code>&lt;link&gt;</code> do head e veja o CSS externo parar de funcionar.`,
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prática · formas de aplicar CSS</title>

          <!-- 2. INTERNO: bloco <style> no head, válido só para esta página -->
          <style>
            .destaque-interno {
              color: #0f766e;
              font-weight: 700;
            }
          </style>

          <!-- 3. EXTERNO: arquivo separado (style.css), ligado com <link> -->
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <!-- 1. INLINE: estilo no próprio elemento (use com moderação) -->
          <p style="color: #4f46e5; font-weight: 700;">
            Texto com estilo inline.
          </p>

          <!-- 2. INTERNO: a classe é estilizada pelo <style> do head -->
          <p class="destaque-interno">
            Texto com estilo interno.
          </p>

          <!-- 3. EXTERNO: a classe é estilizada no arquivo style.css -->
          <p class="destaque-externo">
            Texto com estilo externo.
          </p>
        </body>
        </html>`,
      css: `
        /* 3. EXTERNO: este arquivo é ligado ao index.html pela tag <link>
           e pode ser compartilhado por todas as páginas do site. */

        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .destaque-externo {
          color: #e11d48;
          font-weight: 700;
        }`,
    },

    "cores.css": {
      desafio: `
        Crie uma quinta amostra com a classe <code>minha-cor</code> e defina a cor dela em
        <code>hsl()</code>. Depois altere só a luminosidade (o terceiro valor) e compare
        os tons.`,
      body: `
        <h1>Modelos de cor</h1>

        <div class="amostras">
          <div class="amostra nome">tomato</div>
          <div class="amostra hex">#4f46e5</div>
          <div class="amostra rgb">rgb(15 118 110)</div>
          <div class="amostra hsl">hsl(38 92% 45%)</div>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
          color: #142033;
        }

        .amostras {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .amostra {
          padding: 36px 12px;
          border-radius: 12px;
          font-family: monospace;
          font-weight: 700;
          text-align: center;
        }`,
    },

    "gradientes.css": {
      desafio: `
        Mude o ângulo do <code>linear-gradient</code> para <code>90deg</code> e acrescente
        uma quarta cor. No radial, troque <code>circle</code> por <code>ellipse</code> e
        mova o ponto focal. Role o resultado para ver o fundo fixo.`,
      body: `
        <div class="cartao linear">
          <h2>linear-gradient()</h2>
          <p>Transição em linha reta, com ângulo de 135°.</p>
        </div>

        <div class="cartao radial">
          <h2>radial-gradient()</h2>
          <p>Transição circular a partir de um ponto focal.</p>
        </div>

        <section class="hero-fundo">
          <h2>Fundo em duas camadas</h2>
          <p>Role o resultado: com background-attachment: fixed, a imagem fica parada.</p>
        </section>

        <p class="espaco">Continue rolando para ver o fundo fixo em ação. ↓</p>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .cartao,
        .hero-fundo {
          margin-bottom: 16px;
          padding: 28px;
          border-radius: 16px;
          color: #ffffff;
        }

        .cartao h2,
        .hero-fundo h2 {
          margin: 0 0 6px;
        }

        .hero-fundo {
          display: grid;
          min-height: 300px;
          place-content: center;
          text-align: center;
        }

        .espaco {
          min-height: 600px;
          color: #5f6b7d;
        }`,
      trocas: [['url("imagem.jpg")', 'url("https://picsum.photos/seed/fundo-fixo/1600/1000")']],
    },

    "tipografia.html + tipografia.css": {
      desafio: `
        Troque a pilha de fontes do <code>body</code> por <code>Georgia, serif</code> e
        compare. Depois mude o <code>font-size</code> do <code>html</code> para
        <code>125%</code>: tudo que usa <code>rem</code> cresce junto.`,
      head: `
        <!-- Fontes externas do Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Kaushan+Script&family=Work+Sans:wght@400;700&display=swap"
          rel="stylesheet">`,
      body: `
        <h1>Tipografia na Web</h1>

        <article class="artigo">
          <p>
            A tipografia define o ritmo da leitura. Uma pilha de fontes bem
            escolhida, tamanhos em rem e uma altura de linha confortável deixam
            o texto respirar em qualquer tela.
          </p>
          <p>
            Este parágrafo usa recuo na primeira linha com text-indent e
            alinhamento justificado com text-align: justify.
          </p>
        </article>

        <p class="script">Escrita com personalidade</p>
        <p class="display">Títulos de impacto</p>`,
      base: `
        body {
          margin: 24px;
          color: #142033;
        }

        .artigo {
          max-width: 62ch;
        }

        .script,
        .display {
          margin: 18px 0 0;
          font-size: 2.2rem;
          line-height: 1.1;
        }`,
    },

    "seletores.css": {
      desafio: `
        Troque <code>.lista &gt; li</code> por <code>.lista li</code> e observe o item
        aninhado ganhar borda. Depois crie uma regra com pseudo-classe, como
        <code>.lista li:first-child</code>, e mude a cor do primeiro item.`,
      body: `
        <h1 id="titulo-principal">Seletores CSS</h1>

        <p>
          Uma <span class="destaque">classe</span> pode ser reutilizada em vários
          elementos, como <span class="destaque">neste outro</span>.
        </p>

        <h2>Lista de tarefas</h2>
        <ul class="lista">
          <li>Estudar seletores</li>
          <li>
            Praticar especificidade
            <ul>
              <li>Item aninhado: não é filho direto de .lista</li>
            </ul>
          </li>
          <li>Revisar o box model</li>
        </ul>

        <article class="artigo">
          <h3>Descendentes</h3>
          <p>Todo <strong>strong</strong> dentro de .artigo fica verde, mesmo <span>dentro de um <strong>span</strong></span>.</p>
        </article>

        <p>Fora do artigo, o <strong>strong</strong> mantém a cor padrão.</p>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
          line-height: 1.6;
        }

        .lista li {
          padding: 4px 0;
        }`,
    },

    "estados-e-pseudo-elementos.css": {
      desafio: `
        Crie um estado <code>.botao:focus-visible</code> com um <code>outline</code>
        (use a tecla Tab para testar) e troque a estrela do <code>::before</code> por
        outro símbolo ou emoji.`,
      body: `
        <button class="botao" type="button">Passe o mouse e clique</button>

        <p>
          <a class="link" href="https://developer.mozilla.org/pt-BR/" target="_blank">
            Link visitado muda de cor (MDN)
          </a>
        </p>

        <p class="card">Pseudo-elementos criam conteúdo decorativo</p>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .botao {
          border: 0;
          font: inherit;
          cursor: pointer;
        }

        .card {
          display: inline-block;
          padding: 14px 18px;
          border: 1px solid #e1e7f0;
          border-radius: 10px;
        }`,
    },

    "especificidade.css": {
      desafio: `
        Mova a regra do <code>#mensagem-principal</code> para o início do arquivo: a cor
        muda? (Não: especificidade vence a ordem.) Agora adicione
        <code>style="color: tomato"</code> no último parágrafo. Quem vence?`,
      body: `
        <p>Parágrafo comum: cor do seletor de tipo.</p>

        <p class="texto-especial">Parágrafo com classe: a classe vence o tipo.</p>

        <!-- O ID vence, mesmo que a classe apareça depois no arquivo. -->
        <p id="mensagem-principal" class="texto-especial">
          Qual cor será aplicada?
        </p>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 03 · CAIXAS, FUNDOS E SEMÂNTICA
     ======================================================================== */
  "03-layout-caixas-fundos.html": {
    "box-model.css": {
      desafio: `
        Comente a regra do <code>box-sizing</code> (selecione e use <kbd>Ctrl</kbd> +
        <kbd>/</kbd>) e veja a caixa crescer. Depois aumente o <code>padding</code>
        e a borda: com <code>border-box</code>, a largura total continua 300px.`,
      body: `
        <div class="caixa">
          <strong>.caixa</strong>
          <p>
            300px de largura, padding de 20px na vertical e 24px na horizontal,
            borda laranja e margem automática nas laterais.
          </p>
        </div>`,
      base: `
        body {
          margin: 0;
          padding: 24px;
          background: #f6f8fc;
          font-family: system-ui, sans-serif;
        }

        .caixa {
          background: #fff7ed;
        }

        .caixa p {
          margin: 6px 0 0;
        }`,
    },

    "efeitos-visuais.css": {
      desafio: `
        Crie uma sombra dupla em <code>.cartao</code> separando dois valores de
        <code>box-shadow</code> por vírgula. Depois transforme o cartão em um círculo:
        largura e altura iguais e <code>border-radius: 50%</code>.`,
      body: `
        <button class="foco" type="button">Outline com afastamento</button>

        <div class="cartao">
          <h2 class="titulo">Cartão com sombra</h2>
          <p>Cantos arredondados, borda suave e box-shadow.</p>
        </div>`,
      base: `
        body {
          margin: 0;
          padding: 32px;
          background: #f6f8fc;
          font-family: system-ui, sans-serif;
        }

        .foco {
          margin-bottom: 36px;
          padding: 10px 16px;
          border-radius: 8px;
          background: #ffffff;
          font: inherit;
        }

        .cartao {
          max-width: 360px;
          padding: 24px;
          background: #ffffff;
        }

        .titulo {
          margin: 0 0 8px;
          font-size: 1.8rem;
        }`,
    },

    "block-inline.css": {
      desafio: `
        Tente dar <code>width: 300px</code> e <code>height: 60px</code> à
        <code>.linha</code>: funciona? Depois troque o <code>display</code> dela para
        <code>inline-block</code> e repita a experiência.`,
      body: `
        <div class="bloco">.bloco — ocupa a linha inteira</div>
        <div class="bloco">.bloco — e começa em uma nova linha</div>

        <p>
          Texto com <span class="linha">.linha</span> no meio: o elemento inline
          acompanha o fluxo do texto <span class="linha">sem quebrar a linha</span>.
        </p>

        <span class="etiqueta">.etiqueta</span>
        <span class="etiqueta">inline-block</span>
        <span class="etiqueta">aceita width</span>`,
      base: `
        * {
          box-sizing: border-box;
        }

        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
          line-height: 1.8;
        }

        .bloco {
          border: 1px solid #c7d2fe;
          background: #eef2ff;
        }

        .linha {
          background: #fef3c7;
        }

        .etiqueta {
          border-radius: 8px;
          background: #ccfbf1;
        }`,
    },

    "estrutura-semantica.html": {
      desafio: `
        Crie uma <code>&lt;section id="contato"&gt;</code> com um título e um parágrafo
        dentro do <code>&lt;main&gt;</code>. Depois clique em “Contato” no menu do
        resultado: o link leva até a nova seção.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        /* Contorno e etiqueta para enxergar cada região semântica */
        header,
        nav,
        main,
        section,
        article,
        aside,
        footer {
          position: relative;
          margin: 10px 0;
          padding: 28px 14px 12px;
          border: 2px dashed #94a3b8;
          border-radius: 10px;
        }

        header::before,
        nav::before,
        main::before,
        section::before,
        article::before,
        aside::before,
        footer::before {
          position: absolute;
          top: 5px;
          left: 12px;
          color: #475569;
          font: 700 11px monospace;
        }

        header::before { content: "<header>"; }
        nav::before { content: "<nav>"; }
        main::before { content: "<main>"; }
        section::before { content: "<section>"; }
        article::before { content: "<article>"; }
        aside::before { content: "<aside>"; }
        footer::before { content: "<footer>"; }

        header { border-color: #6366f1; }
        main { border-color: #0f766e; }
        aside { border-color: #f59e0b; }
        footer { border-color: #e11d48; }

        h1,
        h2,
        p {
          margin: 0 0 6px;
        }`,
    },

    "fundos.css": {
      desafio: `
        Troque <code>cover</code> por <code>contain</code> (e vice-versa) e mude o
        <code>background-position</code> para <code>top left</code>. No primeiro bloco,
        experimente <code>background-repeat: repeat-x</code>.`,
      body: `
        <div class="amostras">
          <div class="amostra repeat"><span>repeat</span></div>
          <div class="amostra cover"><span>cover</span></div>
          <div class="amostra contain"><span>contain</span></div>
          <div class="amostra canto"><span>right bottom</span></div>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .amostras {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }

        .amostra {
          min-height: 190px;
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background-color: #f1f5f9;
        }

        .amostra span {
          padding: 2px 8px;
          border-radius: 6px;
          background: #ffffff;
          font: 700 13px monospace;
        }`,
      trocas: [
        ['url("padrao.jpg")', 'url("https://picsum.photos/seed/padrao/200/128")'],
        ['url("paisagem.jpg")', 'url("https://picsum.photos/seed/paisagem-css/1200/700")'],
        ['url("logo.png")', 'url("https://picsum.photos/seed/logo-css/300/160")'],
      ],
    },

    "centralizacao-absoluta.css": {
      desafio: `
        Remova o <code>transform</code> do <code>.centro</code>: por que ele sai do
        centro? Depois tire o <code>position: relative</code> do <code>.palco</code> e
        descubra em relação a quem o filho passa a ser posicionado.`,
      body: `
        <div class="palco">
          <div class="centro">Centralizado com position: absolute</div>
        </div>

        <div class="palco-flex">
          <div class="cartao">Centralizado com Flexbox</div>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .palco,
        .palco-flex {
          margin-bottom: 16px;
          border: 2px dashed #94a3b8;
          border-radius: 12px;
          background: #f8fafc;
        }

        .centro,
        .cartao {
          padding: 16px;
          border-radius: 10px;
          background: #4f46e5;
          color: #ffffff;
          text-align: center;
        }

        .cartao {
          width: 230px;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 04 · TABELAS E IFRAMES
     ======================================================================== */
  "04-tabelas-iframes.html": {
    "tabela-semantica.html": {
      desafio: `
        Adicione uma linha ao <code>&lt;tbody&gt;</code> com o seu nome e notas. Depois
        crie a coluna “Frequência”: lembre-se de ajustar o <code>colspan</code> do
        rodapé.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        table {
          min-width: 420px;
          border-collapse: collapse;
        }

        caption {
          margin-bottom: 8px;
          font-weight: 700;
          text-align: left;
        }

        th,
        td {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          text-align: left;
        }

        thead th {
          background: #0b1324;
          color: #ffffff;
        }

        tfoot td {
          background: #eef2ff;
          font-weight: 700;
        }`,
    },

    "acessibilidade-colgroup.html": {
      desafio: `
        Mude o <code>span</code> do <code>&lt;col class="destaque"&gt;</code> para
        <code>1</code>. Depois adicione a coluna “Quarta” (cabeçalho e célula) e faça o
        destaque cobrir as três colunas de dias.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        table {
          min-width: 360px;
          border-collapse: collapse;
        }

        caption {
          margin-bottom: 8px;
          font-weight: 700;
          text-align: left;
        }

        th,
        td {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          text-align: left;
        }`,
    },

    "tabela-avancada.html + CSS": {
      desafio: `
        Arraste a divisória para estreitar o resultado e veja a rolagem horizontal.
        Depois faça “Laboratório integrado” ocupar as três colunas
        (<code>colspan="3"</code>) e remova a célula que sobrou.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        caption {
          margin-bottom: 8px;
          font-weight: 700;
          text-align: left;
        }

        th,
        td {
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          text-align: left;
        }`,
    },

    "iframes.html": {
      desafio: `
        Troque o <code>src</code> do primeiro iframe para
        <code>07-flexbox-layout.html</code> e aumente a altura do mapa
        (<code>height</code>) para <code>450</code>.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        iframe {
          display: block;
          margin-bottom: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
        }`,
    },

    "frames-nomeados.html": {
      desafio: `
        Clique nos links e veja as aulas abrirem dentro do frame. Depois adicione um
        quarto link que abra o módulo 05 (<code>05-formularios-avancados.html</code>)
        no mesmo <code>frame-demo</code>.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 16px;
          margin-bottom: 12px;
        }

        iframe {
          display: block;
          margin-bottom: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 05 · FORMULÁRIOS AVANÇADOS
     ======================================================================== */
  "05-formularios-avancados.html": {
    "formulario-acessivel.html": {
      desafio: `
        Clique em “Enviar cadastro” com os campos vazios e veja a validação nativa.
        Depois adicione um campo de telefone com <code>&lt;label&gt;</code> ligado pelo
        atributo <code>for</code>.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
          color: #142033;
        }

        form {
          display: grid;
          max-width: 420px;
          gap: 14px;
        }

        .campo {
          display: grid;
          gap: 4px;
        }

        label {
          font-weight: 600;
        }

        input {
          padding: 9px 11px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font: inherit;
        }

        input:focus {
          border-color: #4f46e5;
          outline: 3px solid #c7d2fe;
        }

        button {
          padding: 10px 16px;
          border: 0;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }`,
    },

    "tipos-de-input.html": {
      desafio: `
        Troque o <code>type</code> de alguns campos (<code>date</code> →
        <code>time</code>, <code>range</code> → <code>number</code>) e compare os
        controles. No celular, repare no teclado que aparece em cada tipo.`,
      base: `
        body {
          display: grid;
          max-width: 420px;
          gap: 4px;
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        label {
          margin-top: 10px;
          font-weight: 600;
        }

        input {
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font: inherit;
        }

        input[type="color"],
        input[type="range"] {
          padding: 0;
          border: 0;
        }`,
    },

    "restricoes.html": {
      desafio: `
        Mude o <code>pattern</code> do CEP para aceitar também o formato sem hífen
        (<code>[0-9]{5}-?[0-9]{3}</code>) e teste os dois formatos ao salvar.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        form {
          display: grid;
          max-width: 420px;
          gap: 6px;
        }

        label {
          margin-top: 8px;
          font-weight: 600;
        }

        input {
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font: inherit;
        }

        /* Depois que a pessoa interage, o campo mostra se está válido */
        input:user-invalid {
          border-color: #e11d48;
          background: #fff1f2;
        }

        input:user-valid {
          border-color: #16a34a;
        }

        button {
          margin-top: 12px;
          padding: 10px 16px;
          border: 0;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }`,
    },

    "agrupamentos.html": {
      desafio: `
        Adicione um terceiro plano (“Intensivo”) no grupo de rádio e a opção
        “JavaScript” no <code>&lt;optgroup&gt;</code> Front-end.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        form {
          display: grid;
          max-width: 440px;
          gap: 8px;
        }

        fieldset {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
        }

        legend {
          padding: 0 6px;
          font-weight: 700;
        }

        form > label {
          margin-top: 6px;
          font-weight: 600;
        }

        select,
        input[list],
        textarea {
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font: inherit;
        }

        button {
          margin-top: 8px;
          padding: 10px 16px;
          border: 0;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }`,
    },

    "output-dinamico.html": {
      desafio: `
        Mostre o valor com o símbolo de porcentagem (“50%”) alterando a linha
        <code>saida.value = volume.value;</code>. Depois mude o <code>max</code> do range
        para <code>200</code>.`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        input[type="range"] {
          width: min(280px, 100%);
          vertical-align: middle;
        }

        output {
          display: inline-block;
          min-width: 3.5ch;
          margin-left: 10px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eef2ff;
          color: #3730a3;
          font-weight: 700;
          text-align: center;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 06 · RESPONSIVIDADE E MEDIA QUERIES
     ======================================================================== */
  "06-responsividade-media-queries.html": {
    "mobile-first.html + CSS": {
      desafio: `
        Arraste a divisória entre o código e o resultado e acompanhe a faixa escura no
        topo. Depois crie um breakpoint em <code>1200px</code> com quatro colunas.`,
      body: `
        <section class="cards">
          <article class="card">
            <h2>HTML</h2>
            <p>Estrutura e semântica.</p>
          </article>
          <article class="card">
            <h2>CSS</h2>
            <p>Cores, tipografia e layout.</p>
          </article>
          <article class="card">
            <h2>Flexbox</h2>
            <p>Alinhamento em uma direção.</p>
          </article>
          <article class="card">
            <h2>Grid</h2>
            <p>Layouts em duas dimensões.</p>
          </article>
          <article class="card">
            <h2>Acessibilidade</h2>
            <p>Interfaces para todo mundo.</p>
          </article>
          <article class="card">
            <h2>Projetos</h2>
            <p>Tudo junto na prática.</p>
          </article>
        </section>`,
      base: `
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
        }

        /* Indicador da faixa de largura atual */
        body::before {
          display: block;
          padding: 8px 16px;
          background: #0b1324;
          color: #99f6e4;
          font: 700 12px monospace;
          content: "base · menos de 600px · 1 coluna";
        }

        @media (min-width: 600px) {
          body::before {
            content: "≥ 600px · 2 colunas";
          }
        }

        @media (min-width: 900px) {
          body::before {
            content: "≥ 900px · 3 colunas";
          }
        }

        .card {
          padding: 18px;
          border: 1px solid #c7d2fe;
          border-radius: 12px;
          background: #eef2ff;
        }

        .card h2 {
          margin: 0 0 4px;
          font-size: 1.1rem;
        }

        .card p {
          margin: 0;
        }`,
    },

    "media-types.css": {
      desafio: `
        Arraste a divisória até o resultado ficar mais alto que largo: o aviso muda para
        “Modo retrato”. Para testar o <code>@media print</code>, abra o resultado em nova
        aba (botão ↗) e pressione <kbd>Ctrl</kbd> + <kbd>P</kbd>.`,
      body: `
        <header class="site-header">Cabeçalho do site</header>

        <nav class="menu">
          <a href="#">Início</a>
          <a href="#">Contato</a>
        </nav>

        <main>
          <p class="aviso"></p>
          <p>
            Leia a <a href="https://developer.mozilla.org/pt-BR/docs/Web/CSS/@media">documentação de @media</a>
            para conhecer outros tipos de mídia.
          </p>
        </main>

        <footer class="site-footer">Rodapé do site</footer>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .site-header,
        .site-footer {
          padding: 12px 16px;
          border-radius: 8px;
          background: #0b1324;
          color: #ffffff;
        }

        .menu {
          display: flex;
          gap: 16px;
          margin: 12px 0;
        }

        .aviso {
          padding: 14px;
          border-radius: 8px;
          background: #fef3c7;
          font-weight: 700;
        }`,
    },

    "breakpoints.css": {
      desafio: `
        Acompanhe a largura do resultado no topo do painel e arraste a divisória para
        cruzar cada breakpoint. Depois adicione um breakpoint em <code>1200px</code> com
        quatro colunas.`,
      body: `
        <section class="hero">
          <h1>Breakpoints</h1>
          <p>Arraste a divisória entre o código e o resultado.</p>
        </section>

        <div class="container">
          <div class="grid">
            <article class="item">1</article>
            <article class="item">2</article>
            <article class="item">3</article>
            <article class="item">4</article>
            <article class="item">5</article>
            <article class="item">6</article>
          </div>
        </div>`,
      base: `
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
        }

        /* Indicador do breakpoint ativo */
        body::before {
          display: block;
          padding: 8px 16px;
          background: #0b1324;
          color: #99f6e4;
          font: 700 12px monospace;
          content: "menos de 480px";
        }

        @media (min-width: 480px) { body::before { content: "≥ 480px · mobile amplo"; } }
        @media (min-width: 768px) { body::before { content: "≥ 768px · tablet"; } }
        @media (min-width: 1024px) { body::before { content: "≥ 1024px · desktop"; } }

        .hero {
          padding: 28px 16px;
          background: linear-gradient(135deg, #4f46e5, #0f766e);
          background-size: cover;
          color: #ffffff;
        }

        .hero h1 {
          margin: 0;
        }

        .container {
          padding: 16px 12px;
        }

        .grid {
          display: grid;
          gap: 12px;
        }

        .item {
          display: grid;
          min-height: 90px;
          place-items: center;
          border-radius: 12px;
          background: #eef2ff;
          color: #3730a3;
          font-size: 1.4rem;
          font-weight: 800;
        }`,
      trocas: [['url("hero@2x.jpg")', 'url("https://picsum.photos/seed/hero-2x/2400/900")']],
    },

    "imagens-fluidas.html + CSS": {
      desafio: `
        Remova o <code>max-width: 100%</code> da regra <code>img</code> e estreite o
        resultado: o que acontece? Depois mude o breakpoint do
        <code>.media-object</code> para <code>500px</code>.`,
      body: `
        <article class="media-object">
          <img
            src="https://picsum.photos/seed/imagem-fluida/600/400"
            srcset="https://picsum.photos/seed/imagem-fluida/600/400 600w,
                    https://picsum.photos/seed/imagem-fluida/1200/800 1200w"
            sizes="(min-width: 700px) 260px, 100vw"
            alt="Paisagem usada como exemplo de imagem fluida"
            width="1200"
            height="800"
            loading="lazy">

          <div>
            <h2>Imagem fluida</h2>
            <p>
              Com max-width: 100% e height: auto, a imagem nunca passa da largura do
              contêiner e mantém a proporção. Arraste a divisória para ver o componente
              mudar de uma para duas colunas em 700px.
            </p>
          </div>
        </article>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        .media-object {
          padding: 16px;
          border: 1px solid #e1e7f0;
          border-radius: 14px;
        }

        .media-object img {
          border-radius: 10px;
        }

        .media-object h2 {
          margin: 0 0 6px;
        }`,
    },

    "menu-hamburguer.html + CSS": {
      desafio: `
        Estreite o resultado para menos de 640px e clique em “☰ Menu”. Depois dê um fundo
        diferente aos links quando o menu estiver aberto, usando o seletor
        <code>.menu-toggle:checked ~ .menu-links</code>.`,
      base: `
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
        }

        .mobile-nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #0b1324;
        }

        /* Esconde o checkbox visualmente; ele continua funcionando */
        .menu-toggle {
          position: absolute;
          opacity: 0;
        }

        .menu-toggle:focus-visible + .menu-button {
          outline: 2px solid #99f6e4;
          outline-offset: 4px;
        }

        .menu-button {
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
        }

        .menu-links {
          width: 100%;
          gap: 14px;
        }

        .menu-links a {
          color: #99f6e4;
          text-decoration: none;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 07 · FLEXBOX NA PRÁTICA
     ======================================================================== */
  "07-flexbox-layout.html": {
    "eixos.css": {
      desafio: `
        Troque <code>row</code> por <code>row-reverse</code> e <code>column</code> por
        <code>column-reverse</code>. Depois adicione <code>justify-content: center</code>
        nos dois contêineres: em qual eixo cada um centraliza?`,
      body: `
        <h2>flex-direction: row</h2>
        <div class="container">
          <div class="caixa">1</div>
          <div class="caixa">2</div>
          <div class="caixa">3</div>
        </div>

        <h2>flex-direction: column</h2>
        <div class="container-coluna">
          <div class="caixa">1</div>
          <div class="caixa">2</div>
          <div class="caixa">3</div>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        h2 {
          margin: 18px 0 8px;
          font: 700 14px monospace;
        }

        .container,
        .container-coluna {
          gap: 8px;
          padding: 10px;
          border: 2px dashed #a5b4fc;
          border-radius: 10px;
        }

        .caixa {
          display: grid;
          min-width: 56px;
          min-height: 56px;
          place-items: center;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font-weight: 700;
        }`,
    },

    "container-flex.css": {
      desafio: `
        Remova o <code>flex-wrap</code> da regra <code>.wrap</code> e estreite o resultado:
        as caixas encolhem em vez de quebrar. Depois experimente a shorthand
        <code>flex-flow: column wrap</code>.`,
      body: `
        <h2>.container.row</h2>
        <div class="container row">
          <div class="caixa">1</div>
          <div class="caixa">2</div>
          <div class="caixa">3</div>
        </div>

        <h2>.container.column</h2>
        <div class="container column">
          <div class="caixa">1</div>
          <div class="caixa">2</div>
          <div class="caixa">3</div>
        </div>

        <h2>.container.wrap (estreite o resultado)</h2>
        <div class="container wrap">
          <div class="caixa">1</div>
          <div class="caixa">2</div>
          <div class="caixa">3</div>
          <div class="caixa">4</div>
          <div class="caixa">5</div>
          <div class="caixa">6</div>
          <div class="caixa">7</div>
          <div class="caixa">8</div>
        </div>

        <h2>.container.wrap-reverse</h2>
        <div class="container wrap-reverse">
          <div class="caixa">1</div>
          <div class="caixa">2</div>
          <div class="caixa">3</div>
          <div class="caixa">4</div>
          <div class="caixa">5</div>
          <div class="caixa">6</div>
          <div class="caixa">7</div>
          <div class="caixa">8</div>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        h2 {
          margin: 18px 0 8px;
          font: 700 14px monospace;
        }

        .container {
          padding: 10px;
          border: 2px dashed #a5b4fc;
          border-radius: 10px;
        }

        .caixa {
          display: grid;
          width: 90px;
          min-height: 50px;
          place-items: center;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font-weight: 700;
        }`,
    },

    "justify-align.css": {
      desafio: `
        Crie a classe <code>.end</code> com <code>justify-content: flex-end</code> e
        aplique em uma nova linha. Depois teste <code>align-items: baseline</code> em
        caixas com tamanhos de fonte diferentes.`,
      body: `
        <h2>justify-content (eixo principal)</h2>

        <p class="rotulo">.start</p>
        <div class="linha start">
          <span class="caixa">1</span> <span class="caixa">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.center</p>
        <div class="linha center">
          <span class="caixa">1</span> <span class="caixa">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.between</p>
        <div class="linha between">
          <span class="caixa">1</span> <span class="caixa">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.around</p>
        <div class="linha around">
          <span class="caixa">1</span> <span class="caixa">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.evenly</p>
        <div class="linha evenly">
          <span class="caixa">1</span> <span class="caixa">2</span> <span class="caixa">3</span>
        </div>

        <h2>align-items (eixo transversal)</h2>

        <p class="rotulo">.alinhamento-top</p>
        <div class="alinhamento alinhamento-top">
          <span class="caixa">1</span> <span class="caixa alta">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.alinhamento (center)</p>
        <div class="alinhamento">
          <span class="caixa">1</span> <span class="caixa alta">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.alinhamento-bottom</p>
        <div class="alinhamento alinhamento-bottom">
          <span class="caixa">1</span> <span class="caixa alta">2</span> <span class="caixa">3</span>
        </div>

        <p class="rotulo">.alinhamento-stretch</p>
        <div class="alinhamento alinhamento-stretch">
          <span class="caixa">1</span> <span class="caixa alta">2</span> <span class="caixa">3</span>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        h2 {
          margin: 22px 0 4px;
          font-size: 1.05rem;
        }

        .rotulo {
          margin: 10px 0 4px;
          color: #475569;
          font: 700 12px monospace;
        }

        .linha,
        .alinhamento {
          padding: 6px;
          border: 2px dashed #a5b4fc;
          border-radius: 10px;
          background: #f5f3ff;
        }

        .caixa {
          display: grid;
          min-width: 44px;
          padding: 8px 12px;
          place-items: center;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font-weight: 700;
        }

        .alta {
          padding-block: 22px;
        }`,
    },

    "itens-flex.css": {
      desafio: `
        Mude o <code>flex</code> do <code>.item-b</code> para <code>3 1 90px</code> e
        observe a proporção. Depois dê <code>order: -2</code> ao item 1 para levá-lo ao
        início da segunda linha.`,
      body: `
        <h2>flex-grow: o item B cresce o dobro do A</h2>
        <div class="linha">
          <div class="caixa item-a">A · flex: 1</div>
          <div class="caixa item-b">B · flex: 2</div>
          <div class="caixa item-c">C · 150px</div>
        </div>

        <h2>align-self e order</h2>
        <div class="linha linha-alta">
          <div class="caixa">1</div>
          <div class="caixa item-destaque">2 · align-self</div>
          <div class="caixa item-ultimo">3 · order: 2</div>
          <div class="caixa item-primeiro">4 · order: -1</div>
        </div>`,
      base: `
        body {
          margin: 24px;
          font-family: system-ui, sans-serif;
        }

        h2 {
          margin: 20px 0 8px;
          font-size: 1.05rem;
        }

        .linha {
          display: flex;
          gap: 8px;
          padding: 8px;
          border: 2px dashed #a5b4fc;
          border-radius: 10px;
        }

        .linha-alta {
          min-height: 150px;
          align-items: flex-start;
        }

        .caixa {
          padding: 14px 10px;
          border-radius: 8px;
          background: #4f46e5;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
        }`,
    },

    "centralizacao-flex.css": {
      desafio: `
        Troque <code>min-height: 100vh</code> por <code>300px</code> e veja o cartão
        continuar centralizado. Depois role até a versão com Grid e mude
        <code>place-items</code> para <code>end</code>.`,
      body: `
        <main class="palco">
          <div class="cartao">
            <h1>Centralizado</h1>
            <p>Flexbox: align-items + justify-content.</p>
          </div>
        </main>

        <section class="palco-grid">
          <div class="cartao">
            <h2>Também centralizado</h2>
            <p>Grid: place-items: center.</p>
          </div>
        </section>`,
      base: `
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
        }

        .palco {
          background: #eef2ff;
        }

        .palco-grid {
          background: #ecfdf5;
        }

        .cartao {
          padding: 24px 28px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
          text-align: center;
        }

        .cartao h1,
        .cartao h2 {
          margin: 0 0 6px;
        }

        .cartao p {
          margin: 0;
          color: #5f6b7d;
        }`,
    },
  },

  /* ========================================================================
     MÓDULO 08 · PROJETOS INTEGRADORES
     ======================================================================== */
  "08-projetos-integradores.html": {
    "perfil.html + perfil.css": {
      desafio: `
        Troque nome, profissão e iniciais do avatar pelos seus dados. Depois mude o
        gradiente da capa (<code>.perfil-capa</code>) para as suas cores favoritas.`,
      base: `
        body {
          margin: 0;
          padding: 24px;
          background: #f6f8fc;
          font-family: system-ui, sans-serif;
          color: #142033;
        }

        .perfil-cabecalho h3 {
          margin: 12px 0 0;
          font-size: 1.4rem;
        }

        .perfil-cabecalho p,
        .meta {
          margin: 0;
          color: #5f6b7d;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          background: #dcfce7;
          color: #166534;
          font-size: 12px;
          font-weight: 700;
        }

        .meta,
        .numeros {
          padding: 0;
          list-style: none;
        }

        .redes svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: #4f46e5;
          stroke-width: 2;
        }

        .numeros {
          margin: 18px 0 0;
          padding-top: 14px;
        }

        .numeros strong {
          display: block;
          font-size: 1.4rem;
        }

        .numeros span {
          color: #5f6b7d;
          font-size: 13px;
        }`,
    },

    "galeria.html + galeria.css": {
      desafio: `
        Clique nas miniaturas para trocar o vídeo do palco. Depois adicione uma terceira
        miniatura: copie um <code>&lt;a&gt;</code> e troque o código do vídeo (o trecho
        depois de <code>/embed/</code> e de <code>/vi/</code>).`,
      base: `
        body {
          margin: 0;
          padding: 24px;
          background: #f6f8fc;
          font-family: system-ui, sans-serif;
        }

        .galeria {
          display: grid;
          max-width: 720px;
          gap: 12px;
        }

        .miniaturas a {
          display: grid;
          gap: 6px;
          color: #142033;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .miniaturas img {
          border-radius: 8px;
        }`,
    },

    "mini-site.html + mini-site.css": {
      desafio: `
        Mude só a variável <code>--verde</code> no <code>:root</code> (ex.:
        <code>#60a5fa</code>) e veja o mascote e o site trocarem de cor. Depois use
        <code>var(--raio)</code> no <code>border-radius</code> do <code>.card</code>.`,
      head: `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Kaushan+Script&display=swap" rel="stylesheet">`,
      body: `
        <header class="hero">
          <div>
            <p class="kicker">Aprenda com o mascote</p>
            <h1>Código<br><em>com alma.</em></h1>
            <p>
              Uma escola fictícia para praticar HTML, CSS e acessibilidade
              com projetos pequenos e cheios de personalidade.
            </p>
          </div>

          <svg class="mascote" viewBox="0 0 240 260" role="img" aria-label="Mascote robô verde sorridente">
            <line class="antena" x1="80" y1="54" x2="64" y2="22" />
            <line class="antena" x1="160" y1="54" x2="176" y2="22" />
            <circle class="corpo" cx="64" cy="18" r="9" />
            <circle class="corpo" cx="176" cy="18" r="9" />
            <rect class="corpo" x="34" y="54" width="172" height="132" rx="66" />
            <circle class="olho" cx="92" cy="112" r="10" />
            <circle class="olho" cx="148" cy="112" r="10" />
            <path class="boca" d="M98 142c12 12 32 12 44 0" />
            <rect class="detalhe" x="16" y="104" width="16" height="54" rx="8" />
            <rect class="detalhe" x="208" y="104" width="16" height="54" rx="8" />
            <rect class="detalhe" x="74" y="186" width="24" height="52" rx="12" />
            <rect class="detalhe" x="142" y="186" width="24" height="52" rx="12" />
          </svg>
        </header>

        <section class="cards">
          <article class="card">
            <h2>HTML semântico</h2>
            <p>Estrutura que faz sentido para pessoas e máquinas.</p>
          </article>
          <article class="card">
            <h2>CSS autoral</h2>
            <p>Tipografia, cor e layout com identidade própria.</p>
          </article>
          <article class="card">
            <h2>Acessibilidade</h2>
            <p>Interfaces que funcionam para todo mundo.</p>
          </article>
        </section>`,
      base: `
        body {
          margin: 0;
          background: var(--creme);
          color: var(--tinta);
          font-family: system-ui, sans-serif;
        }

        .kicker {
          margin: 0 0 10px;
          color: var(--verde-escuro);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 0;
          font-weight: 400;
        }

        .mascote {
          width: min(240px, 100%);
          justify-self: center;
        }

        /* O mascote usa as variáveis: troque --verde e ele muda junto */
        .mascote .corpo { fill: var(--verde); }
        .mascote .detalhe { fill: var(--verde-escuro); }
        .mascote .olho { fill: var(--tinta); }

        .mascote .antena,
        .mascote .boca {
          fill: none;
          stroke: var(--verde-escuro);
          stroke-linecap: round;
          stroke-width: 7;
        }

        .mascote .boca {
          stroke: var(--tinta);
        }

        .card h2 {
          margin: 0 0 6px;
          font-family: var(--display);
          font-size: 1.6rem;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .card p {
          margin: 0;
        }`,
    },

    "parallax.html + parallax.css": {
      desafio: `
        Role o resultado para ver o efeito. Depois troque
        <code>background-attachment: fixed</code> por <code>scroll</code> e compare.
        Que tal uma terceira faixa com outra imagem?`,
      base: `
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
        }

        .faixa h3 {
          margin: 0 0 6px;
          font-size: 2.4rem;
        }

        .faixa p,
        .texto p {
          margin: 0;
        }

        /* Espaço extra para ter rolagem dentro do resultado */
        .texto {
          min-height: 70vh;
        }`,
      trocas: [
        ['url("montanha.jpg")', 'url("https://picsum.photos/seed/montanha/1600/1000")'],
        ['url("floresta.jpg")', 'url("https://picsum.photos/seed/floresta/1600/1000")'],
      ],
    },
  },
};
