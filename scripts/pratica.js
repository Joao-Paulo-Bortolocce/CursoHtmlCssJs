/* ==========================================================================
   FUNDAMENTOS.WEB — Modo prática (mini editor estilo VS Code)
   --------------------------------------------------------------------------
   Cada bloco de código das aulas (figure.code-window) ganha um botão
   "Praticar". Ele abre uma janela com dois arquivos — index.html, já ligado
   ao style.css por <link>, e style.css — e o resultado ao vivo ao lado.
   Ao voltar, a aula reaparece exatamente na posição em que estava.

   Os arquivos iniciais e os desafios de cada exemplo ficam em
   scripts/pratica-exercicios.js.

   Sumário
   01. Configuração
   02. Utilitários
   03. Montagem dos arquivos iniciais
   04. Leitura dos blocos de código da aula
   05. Preferências e progresso salvos no navegador
   06. Carregamento do editor (CodeMirror via CDN, com plano B)
   07. Interface da janela de prática
   08. Editor
   09. Resultado ao vivo
   10. Abrir, fechar e posição de rolagem
   11. Inicialização
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     01. CONFIGURAÇÃO
     ------------------------------------------------------------------------ */
  const CM_VERSION = "5.65.16";
  const CM_CDN = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/" + CM_VERSION + "/";
  const CM_STYLES = ["codemirror.min.css", "addon/hint/show-hint.min.css"];
  const CM_SCRIPTS = [
    "codemirror.min.js",
    "mode/xml/xml.min.js",
    "mode/javascript/javascript.min.js",
    "mode/css/css.min.js",
    "mode/htmlmixed/htmlmixed.min.js",
    "addon/edit/closetag.min.js",
    "addon/edit/closebrackets.min.js",
    "addon/edit/matchbrackets.min.js",
    "addon/fold/xml-fold.min.js",
    "addon/edit/matchtags.min.js",
    "addon/selection/active-line.min.js",
    "addon/comment/comment.min.js",
    "addon/hint/show-hint.min.js",
    "addon/hint/xml-hint.min.js",
    "addon/hint/html-hint.min.js",
    "addon/hint/css-hint.min.js",
  ];

  const STORAGE_KEY = "fundamentos-web:pratica";
  const PAGE = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const PAGE_DATA = (window.PRATICA_EXERCICIOS || {})[PAGE] || {};
  const FILES = ["index.html", "style.css"];
  const HASH_PREFIX = "#pratica-";
  const NARROW = window.matchMedia("(max-width: 900px)");
  const MOBILE = window.matchMedia("(max-width: 700px)");
  const TOUCH = window.matchMedia("(pointer: coarse)");

  const DEFAULT_CSS = [
    "/* style.css — já está ligado ao index.html pela tag <link>.",
    "   Escreva suas regras aqui e veja o resultado ao lado. */",
    "",
    "body {",
    "  margin: 24px;",
    "  font-family: system-ui, sans-serif;",
    "  line-height: 1.6;",
    "  color: #142033;",
    "}",
  ].join("\n");

  const DEFAULT_CHALLENGE =
    "<p>Altere textos, valores e propriedades e observe o resultado mudar ao lado. " +
    "Se algo quebrar, use <strong>Restaurar</strong> para voltar ao código da aula.</p>";

  const FINAL_EXERCISE = {
    body: "<h1>Meu exercício</h1>\n\n<!-- Escreva o HTML aqui. Os estilos vão na aba style.css. -->",
  };

  const ICONS = {
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    back: '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
    files: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    reload: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>',
    code: '<path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/>',
    blocks: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>',
    trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  };

  function icon(name) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      ICONS[name] +
      "</svg>"
    );
  }

  /* ------------------------------------------------------------------------
     02. UTILITÁRIOS
     ------------------------------------------------------------------------ */

  // Remove o recuo comum a todas as linhas.
  function dedent(text) {
    const lines = String(text).replace(/\r\n?/g, "\n").replace(/\t/g, "  ").split("\n");
    const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length);
    const min = indents.length ? Math.min.apply(null, indents) : 0;
    return lines.map((line) => line.slice(min)).join("\n");
  }

  function indent(text, spaces) {
    const pad = " ".repeat(spaces);
    return text
      .split("\n")
      .map((line) => (line.trim() ? pad + line : ""))
      .join("\n");
  }

  // Tira espaços sobrando no fim das linhas e linhas vazias nas pontas.
  function tidy(text) {
    return String(text)
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\n+|\n+$/g, "");
  }

  function slugify(text) {
    return (
      text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "exemplo"
    );
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  }

  // Impressão digital curta de um texto (detecta se a aula mudou).
  function fingerprint(text) {
    let hash = 5381;
    for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
    return (hash >>> 0).toString(36);
  }

  function countLines(text) {
    return (text.match(/\n/g) || []).length;
  }

  // Rola a página sem a animação suave definida em style.css.
  function instantScroll(action) {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    action();
    root.style.scrollBehavior = previous;
  }

  function whenIdle(callback) {
    if ("requestIdleCallback" in window) window.requestIdleCallback(callback, { timeout: 4000 });
    else window.setTimeout(callback, 1500);
  }

  /* ------------------------------------------------------------------------
     03. MONTAGEM DOS ARQUIVOS INICIAIS
     O código exibido na aula vira o ponto de partida. Exemplos só de CSS
     recebem um HTML de apoio definido em pratica-exercicios.js.
     ------------------------------------------------------------------------ */

  // Separa o trecho da aula em HTML e CSS.
  function splitSnippet(code, lang) {
    const css = [];
    let html = String(code).replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, inner) => {
      css.push(tidy(dedent(inner)));
      return "";
    });

    // Em blocos "CSS" ou "HTML + CSS" sem <style>, cada parágrafo de código
    // (separado por linha vazia) é classificado: tem tags e não tem chaves? HTML.
    if (/css/i.test(lang)) {
      const htmlBlocks = [];
      html.split(/\n[ \t]*\n/).forEach((block) => {
        if (!block.trim()) return;
        const looksLikeHtml = block.split("\n").some((line) => line.trim().startsWith("<")) && !/[{}]/.test(block);
        if (looksLikeHtml) htmlBlocks.push(block);
        else css.push(tidy(block));
      });
      html = htmlBlocks.join("\n\n");
    }

    return { html: tidy(dedent(html)), css: tidy(css.join("\n\n")) };
  }

  function isFullDocument(html) {
    return /<!doctype|<html[\s>]/i.test(html);
  }

  function stripBodyWrapper(html) {
    const match = html.match(/^\s*<body[^>]*>([\s\S]*)<\/body>\s*$/i);
    return match ? tidy(dedent(match[1])) : html;
  }

  function linkStylesheet(doc) {
    if (/href\s*=\s*["']?(\.\/)?style\.css/i.test(doc)) return doc;
    const lines =
      "\n\n$1  <!-- Folha de estilos externa: o arquivo style.css (aba ao lado). -->" +
      '\n$1  <link rel="stylesheet" href="style.css">\n$1</head>';
    return doc.replace(/\n?([ \t]*)<\/head>/i, lines);
  }

  // Plano B para exemplos de CSS sem HTML de apoio: uma div por classe.
  function markupFromCss(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(["'])(?:\\.|(?!\1).)*\1/g, "");
    const classes = Array.from(new Set((clean.match(/\.[a-zA-Z_][\w-]*/g) || []).map((name) => name.slice(1))));
    if (!classes.length) return "<h1>Pratique aqui</h1>\n<p>Escreva o HTML que usa as regras do style.css.</p>";
    return classes.map((name) => '<div class="' + name + '">.' + name + "</div>").join("\n");
  }

  function skeleton(title, head, body) {
    const extraHead = head ? indent(tidy(dedent(head)), 2) + "\n\n" : "";
    return (
      "<!DOCTYPE html>\n" +
      '<html lang="pt-BR">\n' +
      "<head>\n" +
      '  <meta charset="UTF-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      "  <title>" + escapeHtml(title) + "</title>\n\n" +
      extraHead +
      "  <!-- O CSS desta prática fica no arquivo style.css (aba ao lado). -->\n" +
      '  <link rel="stylesheet" href="style.css">\n' +
      "</head>\n" +
      "<body>\n" +
      indent(tidy(dedent(body)), 2) + "\n" +
      "</body>\n" +
      "</html>"
    );
  }

  function banner(text) {
    const line = "-".repeat(56);
    return "/* " + line + "\n   " + text + "\n   " + line + " */";
  }

  function applyReplacements(text, pairs) {
    return (pairs || []).reduce((result, pair) => result.split(pair[0]).join(pair[1]), text);
  }

  function buildStarter(ex) {
    const data = ex.data;
    const parts = ex.snippet ? splitSnippet(ex.snippet, ex.lang) : { html: "", css: "" };
    parts.html = applyReplacements(parts.html, data.trocas);
    parts.css = applyReplacements(parts.css, data.trocas);
    ex.lessonCss = parts.css;

    let html = data.html != null ? tidy(dedent(data.html)) : null;
    if (html == null) {
      let body = data.body;
      if (body == null) {
        if (isFullDocument(parts.html)) html = linkStylesheet(parts.html);
        else body = stripBodyWrapper(parts.html) || markupFromCss(parts.css);
      }
      if (html == null) html = skeleton("Prática · " + ex.title, data.head || "", body);
    }

    let css = data.css != null ? tidy(dedent(data.css)) : null;
    if (css == null) {
      const base = data.base ? tidy(dedent(data.base)) : "";
      if (base && parts.css) {
        css =
          banner("Apoio da prática: só monta o cenário do exemplo.") + "\n\n" + base + "\n\n" +
          banner("Código da aula (" + ex.title + ") — altere à vontade!") + "\n\n" + parts.css;
      } else if (base) {
        css =
          "/* style.css — já está ligado ao index.html pela tag <link>.\n" +
          "   Estes estilos de apoio só deixam o exemplo mais legível.\n" +
          "   Altere à vontade! */\n\n" + base;
      } else if (parts.css) {
        css = banner("Código da aula (" + ex.title + ") — altere à vontade!") + "\n\n" + parts.css;
      } else {
        css = DEFAULT_CSS;
      }
    }

    return { "index.html": tidy(html) + "\n", "style.css": tidy(css) + "\n" };
  }

  function starterFor(ex) {
    if (!ex.starter) {
      ex.starter = buildStarter(ex);
      ex.fingerprint = fingerprint(ex.starter["index.html"] + "\u0000" + ex.starter["style.css"]);
    }
    return ex.starter;
  }

  /* ------------------------------------------------------------------------
     04. LEITURA DOS BLOCOS DE CÓDIGO DA AULA
     ------------------------------------------------------------------------ */
  const exercises = [];
  const exercisesById = new Map();

  function moduleName() {
    const eyebrow = document.querySelector(".lesson-hero .eyebrow");
    const match = eyebrow && eyebrow.textContent.match(/Módulo\s+\d+/i);
    return match ? match[0] : "";
  }

  function uniqueId(base) {
    let id = base;
    let n = 2;
    while (exercisesById.has(id)) id = base + "-" + n++;
    return id;
  }

  function register(ex) {
    exercises.push(ex);
    exercisesById.set(ex.id, ex);
  }

  function collectExercises() {
    const module = moduleName();

    document.querySelectorAll(".lesson-content figure.code-window").forEach((figure) => {
      const caption = figure.querySelector("figcaption");
      const code = figure.querySelector("pre code") || figure.querySelector("pre");
      if (!caption || !code) return;

      const nameEl = caption.querySelector("span:not(.code-dots):not(.code-lang)");
      const title = nameEl ? nameEl.textContent.trim() : "exemplo";
      const langEl = caption.querySelector(".code-lang");
      const heading = figure.closest(".lesson-section") && figure.closest(".lesson-section").querySelector("h2");
      const data = PAGE_DATA[title] || {};

      register({
        id: uniqueId(slugify(title)),
        title: title,
        lang: langEl ? langEl.textContent.trim() : "HTML",
        module: module,
        section: heading ? heading.textContent.trim() : "",
        snippet: code.textContent,
        data: data,
        challenge: data.desafio || DEFAULT_CHALLENGE,
        anchor: figure,
        caption: caption,
        nameEl: nameEl,
      });
    });

    // Exercício de fechamento: o texto do callout vira o desafio.
    document.querySelectorAll(".lesson-content .callout").forEach((callout) => {
      const strong = callout.querySelector("strong");
      if (!strong || !/^exerc[ií]cio/i.test(strong.textContent.trim())) return;
      const paragraph = strong.closest("p") || callout;
      const text = paragraph.innerHTML.replace(/^\s*<strong>[\s\S]*?<\/strong>\s*/i, "");
      const data = PAGE_DATA.exercicio || FINAL_EXERCISE;

      register({
        id: uniqueId("exercicio-do-modulo"),
        title: "Exercício do módulo",
        lang: "HTML",
        module: module,
        section: "Fechamento",
        snippet: "",
        data: data,
        challenge: data.desafio || "<p>" + text + "</p>",
        anchor: callout,
        isFinal: true,
      });
    });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (ignored) {
        copied = false;
      }
      field.remove();
      return copied;
    }
  }

  // Adiciona os botões "Copiar" e "Praticar" em cada bloco de código.
  function decorate(ex) {
    if (ex.isFinal) {
      const actions = document.createElement("p");
      actions.className = "callout-practice";
      actions.innerHTML =
        '<button type="button" class="button button-small">' + icon("play") + "Fazer no modo prática</button>";
      ex.anchor.appendChild(actions);
      ex.opener = actions.querySelector("button");
    } else {
      if (ex.nameEl) ex.nameEl.classList.add("code-name");
      const actions = document.createElement("span");
      actions.className = "code-actions";
      actions.innerHTML =
        '<button type="button" class="code-btn" data-copy aria-label="Copiar código de ' + escapeHtml(ex.title) + '">' +
        icon("copy") + "<span>Copiar</span></button>" +
        '<button type="button" class="code-btn code-btn-practice" aria-label="Praticar: abrir ' +
        escapeHtml(ex.title) + ' no editor">' + icon("play") + "<span>Praticar</span></button>";
      ex.caption.appendChild(actions);
      ex.opener = actions.querySelector(".code-btn-practice");

      const copyButton = actions.querySelector("[data-copy]");
      const copyLabel = copyButton.querySelector("span");
      copyButton.addEventListener("click", async () => {
        const copied = await copyText(ex.snippet);
        copyLabel.textContent = copied ? "Copiado!" : "Não copiou";
        window.setTimeout(() => {
          copyLabel.textContent = "Copiar";
        }, 1600);
      });
    }

    ex.opener.addEventListener("click", () => openPractice(ex));
  }

  /* ------------------------------------------------------------------------
     05. PREFERÊNCIAS E PROGRESSO SALVOS NO NAVEGADOR
     Tudo protegido por try/catch: em janelas anônimas o armazenamento pode
     estar bloqueado e o modo prática continua funcionando sem salvar.
     ------------------------------------------------------------------------ */
  const store = {
    read(key) {
      try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY + ":" + key));
      } catch (error) {
        return null;
      }
    },
    write(key, value) {
      try {
        window.localStorage.setItem(STORAGE_KEY + ":" + key, JSON.stringify(value));
      } catch (error) {
        /* Armazenamento indisponível: segue sem salvar. */
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(STORAGE_KEY + ":" + key);
      } catch (error) {
        /* Armazenamento indisponível. */
      }
    },
  };

  const prefs = Object.assign(
    { split: 50, splitMontar: 42, sidebar: true, wrap: false, modo: "codigo", dicaMontar: false },
    store.read("preferencias")
  );

  function savePrefs() {
    store.write("preferencias", prefs);
  }

  function progressKey(ex) {
    return "progresso:" + PAGE + ":" + ex.id;
  }

  function readProgress(ex) {
    const saved = store.read(progressKey(ex));
    if (!saved || !saved.files) return null;
    starterFor(ex);
    // Se o código da aula mudou desde a última visita, o rascunho antigo é ignorado.
    return saved.base === ex.fingerprint ? saved.files : null;
  }

  function markProgress() {
    exercises.forEach((ex) => {
      if (!ex.isFinal && store.read(progressKey(ex)) && readProgress(ex)) ex.opener.classList.add("has-progress");
    });
  }

  /* ------------------------------------------------------------------------
     06. CARREGAMENTO DO EDITOR (CodeMirror via CDN, com plano B)
     ------------------------------------------------------------------------ */
  let editorLibrary = null;

  function loadEditorLibrary() {
    if (editorLibrary) return editorLibrary;

    editorLibrary = new Promise((resolve) => {
      const files = CM_STYLES.length + CM_SCRIPTS.length;
      let pending = files;
      let failed = false;
      const done = () => {
        pending -= 1;
        if (pending === 0) resolve(!failed && Boolean(window.CodeMirror));
      };

      CM_STYLES.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CM_CDN + href;
        link.onload = done;
        link.onerror = done;
        document.head.appendChild(link);
      });

      // async = false: baixa em paralelo, mas executa na ordem da lista.
      CM_SCRIPTS.forEach((src) => {
        const script = document.createElement("script");
        script.src = CM_CDN + src;
        script.async = false;
        script.onload = done;
        script.onerror = () => {
          failed = true;
          done();
        };
        document.head.appendChild(script);
      });

      window.setTimeout(() => resolve(Boolean(window.CodeMirror)), 15000);
    });

    return editorLibrary;
  }

  /* ------------------------------------------------------------------------
     07. INTERFACE DA JANELA DE PRÁTICA
     ------------------------------------------------------------------------ */
  let ui = null;
  let toastTimer = 0;
  let montar = null; // modo "Arrastar e soltar" (scripts/pratica-montar.js)

  function fileIcon(file) {
    return file.endsWith(".css")
      ? '<span class="file-icon file-icon-css" aria-hidden="true">#</span>'
      : '<span class="file-icon file-icon-html" aria-hidden="true">&lt;&gt;</span>';
  }

  function buildUI() {
    const root = document.createElement("div");
    root.className = "practice";
    root.hidden = true;
    root.dataset.view = "code";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "practice-title");

    const fileRows = FILES.map(
      (file) =>
        "<li>" +
        '<button type="button" class="practice-file" data-file="' + file + '">' +
        fileIcon(file) + "<span>" + file + "</span>" +
        '<span class="practice-file-dot" title="Alterado em relação ao código da aula"></span></button>' +
        '<button type="button" class="practice-file-download" data-download="' + file + '" ' +
        'title="Baixar ' + file + '" aria-label="Baixar ' + file + '">' + icon("download") + "</button>" +
        "</li>"
    ).join("");

    const tabs = FILES.map(
      (file) =>
        '<button type="button" role="tab" class="practice-tab" data-file="' + file + '" aria-selected="false">' +
        fileIcon(file) + "<span>" + file + "</span>" +
        '<span class="practice-file-dot" title="Alterado em relação ao código da aula"></span></button>'
    ).join("");

    root.innerHTML =
      '<header class="practice-titlebar">' +
        '<span class="practice-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<button type="button" class="practice-back" data-action="close" title="Voltar para a aula, no mesmo ponto">' +
          icon("back") + "<span>Voltar à aula</span></button>" +
        '<h2 class="practice-title" id="practice-title"><strong data-ref="title"></strong>' +
          '<span data-ref="subtitle"></span></h2>' +
        '<div class="practice-modes" role="group" aria-label="Modo de prática">' +
          '<button type="button" data-mode-btn="codigo" aria-pressed="true" title="Editar o código à mão">' +
            icon("code") + "<span>Código</span></button>" +
          '<button type="button" data-mode-btn="montar" aria-pressed="false" title="Montar a página arrastando blocos">' +
            icon("blocks") + "<span>Arrastar e soltar</span></button>" +
        "</div>" +
        '<div class="practice-switch" role="group" aria-label="Alternar entre código e resultado">' +
          '<button type="button" data-view-btn="code" aria-pressed="true">Código</button>' +
          '<button type="button" data-view-btn="preview" aria-pressed="false">' +
            '<span class="practice-label-resultado">Resultado</span><span class="practice-label-tela">Tela</span></button>' +
        "</div>" +
        '<div class="practice-titlebar-actions">' +
          '<button type="button" class="practice-tool practice-tool-explorer" data-action="toggle-sidebar" ' +
            'title="Arquivos e desafio" aria-label="Mostrar arquivos e desafio">' + icon("files") + "</button>" +
          '<button type="button" class="practice-tool" data-action="reset" title="Voltar ao código original da aula">' +
            icon("reset") + "<span>Restaurar</span></button>" +
        "</div>" +
      "</header>" +
      '<div class="practice-main">' +
        '<nav class="practice-activity" aria-label="Barra de atividades">' +
          '<button type="button" class="practice-activity-btn" data-activity="codigo" aria-pressed="true" ' +
            'title="Explorador (Ctrl + B)" aria-label="Explorador">' + icon("files") + "</button>" +
          '<button type="button" class="practice-activity-btn" data-activity="montar" aria-pressed="false" ' +
            'title="Blocos para arrastar e soltar" aria-label="Blocos para arrastar e soltar">' + icon("blocks") + "</button>" +
        "</nav>" +
        '<aside class="practice-sidebar" aria-label="Painel lateral">' +
          '<div class="practice-view-explorer">' +
          '<h3 class="practice-sidebar-title">Explorador</h3>' +
          '<p class="practice-folder">' + icon("chevronDown") + '<span data-ref="folder"></span></p>' +
          '<ul class="practice-files">' + fileRows + "</ul>" +
          '<section class="practice-challenge" aria-labelledby="practice-challenge-title">' +
            '<h3 id="practice-challenge-title">💡 Desafio</h3>' +
            '<div class="practice-challenge-text" data-ref="challenge"></div>' +
          "</section>" +
          '<section class="practice-shortcuts" aria-label="Atalhos de teclado">' +
            '<h3 class="practice-sidebar-title">Atalhos</h3>' +
            "<dl>" +
              "<div><dt><kbd>Ctrl</kbd> + <kbd>Espaço</kbd></dt><dd>Sugestões</dd></div>" +
              "<div><dt><kbd>Ctrl</kbd> + <kbd>/</kbd></dt><dd>Comentar linha</dd></div>" +
              "<div><dt><kbd>Ctrl</kbd> + <kbd>Z</kbd></dt><dd>Desfazer</dd></div>" +
              "<div><dt><kbd>Alt</kbd> + <kbd>Z</kbd></dt><dd>Quebra de linha</dd></div>" +
              "<div><dt><kbd>Ctrl</kbd> + <kbd>B</kbd></dt><dd>Mostrar painel</dd></div>" +
            "</dl>" +
          "</section>" +
          "</div>" +
          '<div class="practice-view-blocos" data-ref="palette"></div>' +
        "</aside>" +
        '<div class="practice-workspace" data-ref="workspace">' +
          '<section class="practice-editor-pane" aria-label="Editor de código">' +
            '<div class="practice-tabs" role="tablist" aria-label="Arquivos abertos">' + tabs + "</div>" +
            '<div class="practice-breadcrumbs" aria-hidden="true"><span data-ref="crumb-folder"></span>' +
              icon("chevronRight") + '<span data-ref="crumb-file"></span></div>' +
            '<div class="practice-editor" data-ref="editor" role="tabpanel"></div>' +
          "</section>" +
          '<div class="practice-splitter" data-ref="splitter" role="separator" tabindex="0" ' +
            'aria-orientation="vertical" aria-label="Redimensionar editor e resultado" ' +
            'aria-valuemin="20" aria-valuemax="80" title="Arraste para redimensionar (duplo clique centraliza)"></div>' +
          '<section class="practice-preview-pane" aria-label="Resultado ao vivo" data-ref="preview-pane">' +
            '<div class="practice-preview-head" data-ref="preview-head">' +
              '<span class="practice-preview-label"><span class="practice-live-dot" aria-hidden="true"></span>' +
                '<span class="practice-label-resultado">Resultado</span><span class="practice-label-tela">Tela</span></span>' +
              '<span class="practice-preview-size" data-ref="size" title="Largura × altura da área de resultado"></span>' +
              '<button type="button" class="practice-tool practice-tool-icon" data-action="reload" ' +
                'title="Recarregar resultado" aria-label="Recarregar resultado">' + icon("reload") + "</button>" +
              '<button type="button" class="practice-tool practice-tool-icon" data-action="open-tab" ' +
                'title="Abrir resultado em nova aba" aria-label="Abrir resultado em nova aba">' + icon("external") + "</button>" +
            "</div>" +
            '<p class="practice-notice" data-ref="notice" hidden>⚠ O <code>index.html</code> não está ligado ao ' +
              "<code>style.css</code>. Coloque <code>&lt;link rel=\"stylesheet\" href=\"style.css\"&gt;</code> " +
              "no <code>&lt;head&gt;</code> para o CSS voltar a funcionar.</p>" +
            '<div class="practice-frames" data-ref="frames"></div>' +
          "</section>" +
          '<div class="practice-toast" data-ref="toast" role="status" aria-live="polite"></div>' +
        "</div>" +
      "</div>" +
      '<footer class="practice-status">' +
        '<span class="practice-status-item">⎇ modo treino</span>' +
        '<span class="practice-status-item practice-status-save" data-ref="save"></span>' +
        '<button type="button" class="practice-status-item practice-status-error" data-ref="error" ' +
          'title="Ir para a linha do erro" hidden></button>' +
        '<span class="practice-status-spacer"></span>' +
        '<span class="practice-status-item" data-ref="cursor">Ln 1, Col 1</span>' +
        '<span class="practice-status-item practice-status-optional">Espaços: 2</span>' +
        '<span class="practice-status-item practice-status-optional">UTF-8</span>' +
        '<span class="practice-status-item" data-ref="mode">HTML</span>' +
      "</footer>";

    document.body.appendChild(root);

    const refs = { root: root };
    root.querySelectorAll("[data-ref]").forEach((el) => {
      refs[el.dataset.ref.replace(/-(\w)/g, (m, ch) => ch.toUpperCase())] = el;
    });
    ui = refs;
    root.dataset.mode = "codigo";

    root.addEventListener("click", onUIClick);
    ui.error.addEventListener("click", goToErrorLine);
    ui.workspace.addEventListener("pointerdown", () => {
      // Em telas médias o explorador é uma gaveta; a paleta de blocos fica fixa.
      if (NARROW.matches && root.dataset.mode !== "montar" && !root.classList.contains("is-sidebar-hidden")) setSidebar(false);
    });

    if (montar) montar.construir(ui);
    initSplitter();
    setSplit(prefs.split);

    if ("ResizeObserver" in window) {
      new ResizeObserver(updateSize).observe(ui.frames);
      new ResizeObserver(() => editor.cm && editor.cm.refresh()).observe(ui.editor);
    }
  }

  function onUIClick(event) {
    const target = event.target.closest("[data-action], [data-file], [data-download], [data-view-btn], [data-mode-btn], [data-activity]");
    if (!target || !ui.root.contains(target)) return;

    if (target.dataset.modeBtn) {
      setMode(target.dataset.modeBtn, true);
    } else if (target.dataset.activity) {
      // Como no VS Code: clicar no ícone ativo recolhe o painel; no outro, troca de modo.
      if (ui.root.dataset.mode === target.dataset.activity) setSidebar(ui.root.classList.contains("is-sidebar-hidden"), true);
      else setMode(target.dataset.activity, true);
    } else if (target.dataset.file) {
      if (MOBILE.matches) setView("code");
      selectFile(target.dataset.file);
      if (NARROW.matches && target.classList.contains("practice-file")) setSidebar(false);
    } else if (target.dataset.download) {
      downloadFile(target.dataset.download);
    } else if (target.dataset.viewBtn) {
      setView(target.dataset.viewBtn);
    } else {
      const actions = {
        close: requestClose,
        reset: resetFiles,
        reload: () => renderPreview(true),
        "open-tab": openInNewTab,
        "toggle-sidebar": () => setSidebar(ui.root.classList.contains("is-sidebar-hidden"), true),
      };
      if (actions[target.dataset.action]) actions[target.dataset.action]();
    }
  }

  function setSidebar(show, persist) {
    ui.root.classList.toggle("is-sidebar-hidden", !show);
    ui.root.querySelectorAll("[data-activity]").forEach((button) => {
      button.setAttribute("aria-pressed", String(show && button.dataset.activity === ui.root.dataset.mode));
    });
    if (persist && !NARROW.matches) {
      prefs.sidebar = show;
      savePrefs();
    }
  }

  // Dois modos: "codigo" (editor + resultado) e "montar" (blocos + tela + código).
  function setMode(mode, persist) {
    const next = mode === "montar" && montar ? "montar" : "codigo";
    ui.root.dataset.mode = next;
    ui.root.querySelectorAll("[data-mode-btn]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.modeBtn === next));
    });
    setSplit(next === "montar" ? prefs.splitMontar : prefs.split);
    if (persist) {
      prefs.modo = next;
      savePrefs();
    }
    if (next === "montar") {
      setSidebar(true);
      montar.entrar(state.ex);
    } else {
      setSidebar(NARROW.matches ? false : prefs.sidebar);
      if (montar) montar.sair();
    }
    if (MOBILE.matches) setView(next === "montar" ? "preview" : "code");
    if (state.ex) renderPreview(true);
  }

  function setView(view) {
    ui.root.dataset.view = view;
    ui.root.querySelectorAll("[data-view-btn]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.viewBtn === view));
    });
    if (view === "code" && editor.cm) window.requestAnimationFrame(() => editor.cm.refresh());
  }

  function setSplit(percent) {
    const value = Math.min(80, Math.max(20, Number(percent) || 50));
    if (ui.root.dataset.mode === "montar") prefs.splitMontar = value;
    else prefs.split = value;
    ui.root.style.setProperty("--split", value + "%");
    ui.splitter.setAttribute("aria-valuenow", String(Math.round(value)));
  }

  // Divisória arrastável entre o editor e o resultado (mouse, toque e teclado).
  function initSplitter() {
    const splitter = ui.splitter;

    splitter.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      splitter.setPointerCapture(event.pointerId);
      ui.root.classList.add("is-resizing");
      const area = ui.workspace.getBoundingClientRect();
      // No modo montar o editor fica à direita: a conta é feita a partir da borda direita.
      const fromRight = ui.root.dataset.mode === "montar";

      const move = (moveEvent) =>
        setSplit(((fromRight ? area.right - moveEvent.clientX : moveEvent.clientX - area.left) / area.width) * 100);
      const stop = () => {
        splitter.removeEventListener("pointermove", move);
        splitter.removeEventListener("pointerup", stop);
        splitter.removeEventListener("pointercancel", stop);
        ui.root.classList.remove("is-resizing");
        savePrefs();
      };

      splitter.addEventListener("pointermove", move);
      splitter.addEventListener("pointerup", stop);
      splitter.addEventListener("pointercancel", stop);
    });

    splitter.addEventListener("keydown", (event) => {
      const steps = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 };
      const fromRight = ui.root.dataset.mode === "montar";
      const current = fromRight ? prefs.splitMontar : prefs.split;
      if (event.key in steps) setSplit(current + (fromRight ? -1 : 1) * steps[event.key]);
      else if (event.key === "Enter") setSplit(50);
      else return;
      event.preventDefault();
      savePrefs();
    });

    splitter.addEventListener("dblclick", () => {
      setSplit(50);
      savePrefs();
    });
  }

  function updateSize() {
    const box = ui.frames.getBoundingClientRect();
    ui.size.textContent = box.width ? Math.round(box.width) + " × " + Math.round(box.height) + " px" : "";
  }

  function toast(text) {
    ui.toast.textContent = text;
    ui.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => ui.toast.classList.remove("is-visible"), 3400);
  }

  function updateModified() {
    let anyModified = false;
    FILES.forEach((file) => {
      const modified = state.files[file] !== state.starter[file];
      anyModified = anyModified || modified;
      ui.root.querySelectorAll('[data-file="' + file + '"]').forEach((el) => el.classList.toggle("is-modified", modified));
    });
    ui.save.textContent = anyModified ? "● Editado · salvo neste navegador" : "✓ Código original da aula";
    return anyModified;
  }

  function downloadFile(file) {
    const type = file.endsWith(".css") ? "text/css" : "text/html";
    const url = URL.createObjectURL(new Blob([state.files[file]], { type: type + ";charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = file;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast("Baixando " + file + ". Salve os dois arquivos na mesma pasta para abrir no seu editor.");
  }

  /* ------------------------------------------------------------------------
     08. EDITOR
     Um único CodeMirror com dois documentos (um por arquivo): trocar de aba
     preserva o histórico de desfazer, a seleção e a rolagem de cada arquivo.
     ------------------------------------------------------------------------ */
  const editor = { cm: null, docs: null, textarea: null, active: "index.html", animando: false };

  function modeFor(file) {
    return file.endsWith(".css") ? "css" : "htmlmixed";
  }

  function toggleComment(cm) {
    if (!cm.toggleComment) return window.CodeMirror.Pass;
    cm.toggleComment({ indent: true });
    return undefined;
  }

  // Sugestões: usa as listas de HTML e CSS do CodeMirror e, ao escolher uma
  // propriedade CSS, completa com ": " e já sugere os valores (como no VS Code).
  function hintSource(cm, options) {
    const CodeMirror = window.CodeMirror;
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);
    const inner = CodeMirror.innerMode(cm.getMode(), token.state);
    if (inner.mode.name === "css" && /comment/.test(token.type || "")) return null;

    const helper = cm.getHelpers(cursor, "hint")[0];
    const result = helper ? helper(cm, options) : null;
    const isProperty = inner.mode.name === "css" && /^(block|maybeprop)$/.test(inner.state.state);

    if (result && isProperty) {
      CodeMirror.on(result, "pick", () => {
        const end = cm.getCursor();
        const next = cm.getRange(end, CodeMirror.Pos(end.line, end.ch + 1));
        if (next !== ":") {
          cm.replaceSelection(": ");
          window.setTimeout(() => showHints(cm), 0);
        }
      });
    }
    return result;
  }

  function showHints(cm) {
    if (!cm.showHint) return;
    cm.showHint({ hint: hintSource, completeSingle: false, container: document.body });
  }

  function autoHint(cm, change) {
    if (change.origin !== "+input" || cm.state.completionActive) return;
    const typed = change.text[change.text.length - 1].slice(-1);
    const token = cm.getTokenAt(cm.getCursor());
    const inner = window.CodeMirror.innerMode(cm.getMode(), token.state);

    if (inner.mode.name === "css" && /[a-z-]/i.test(typed)) showHints(cm);
    else if (inner.mode.name === "xml" && (typed === "<" || (typed === " " && inner.state.tagName))) showHints(cm);
  }

  function createCodeMirror() {
    const CodeMirror = window.CodeMirror;
    ui.editor.textContent = "";
    editor.textarea = null;

    editor.cm = CodeMirror(ui.editor, {
      theme: "pratica",
      lineNumbers: true,
      tabSize: 2,
      indentUnit: 2,
      indentWithTabs: false,
      lineWrapping: prefs.wrap || MOBILE.matches,
      autoCloseTags: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      matchTags: { bothTags: true },
      styleActiveLine: true,
      inputStyle: "contenteditable",
      spellcheck: false,
      autocorrect: false,
      autocapitalize: false,
      screenReaderLabel: "Editor de código",
      extraKeys: {
        Tab: (cm) => {
          if (cm.somethingSelected()) cm.indentSelection("add");
          else cm.execCommand("insertSoftTab");
        },
        "Shift-Tab": (cm) => cm.indentSelection("subtract"),
        "Ctrl-Space": showHints,
        "Ctrl-/": toggleComment,
        "Cmd-/": toggleComment,
      },
    });

    editor.cm.on("changes", (cm) => {
      // Durante a animação do modo montar, os arquivos já estão atualizados.
      if (editor.animando) return;
      state.files[editor.active] = cm.getValue();
      onFilesChanged(editor.active);
    });
    editor.cm.on("cursorActivity", updateCursor);
    editor.cm.on("inputRead", autoHint);
  }

  // Plano B: sem internet para o CDN, o aluno ainda edita em um textarea.
  function createTextarea() {
    ui.editor.textContent = "";
    const field = document.createElement("textarea");
    field.className = "practice-textarea";
    field.spellcheck = false;
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("autocomplete", "off");
    field.setAttribute("aria-label", "Editor de código");

    field.addEventListener("input", () => {
      state.files[editor.active] = field.value;
      onFilesChanged(editor.active);
    });
    field.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
      event.preventDefault();
      field.setRangeText("  ", field.selectionStart, field.selectionEnd, "end");
      field.dispatchEvent(new Event("input"));
    });
    ["keyup", "click", "select"].forEach((type) => field.addEventListener(type, updateCursor));

    ui.editor.appendChild(field);
    editor.textarea = field;
  }

  function mountEditor(useCodeMirror) {
    if (useCodeMirror && window.CodeMirror) {
      if (!editor.cm) createCodeMirror();
      editor.docs = {};
      FILES.forEach((file) => {
        editor.docs[file] = window.CodeMirror.Doc(state.files[file], modeFor(file));
      });
      editor.cm.swapDoc(editor.docs[editor.active]);
      editor.cm.setOption("lineWrapping", prefs.wrap || MOBILE.matches);
      editor.cm.refresh();
      if (montar) montar.aoMontarEditor();
    } else {
      if (!editor.textarea) {
        createTextarea();
        toast("Editor simplificado: não foi possível carregar o CodeMirror (verifique a internet).");
      }
      editor.docs = null;
      editor.textarea.value = state.files[editor.active];
    }
    updateCursor();
  }

  function selectFile(file, keepFocus) {
    editor.active = file;
    if (editor.cm && editor.docs) editor.cm.swapDoc(editor.docs[file]);
    else if (editor.textarea) editor.textarea.value = state.files[file];

    ui.root.querySelectorAll(".practice-tab").forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab.dataset.file === file));
    });
    ui.root.querySelectorAll(".practice-file").forEach((row) => row.classList.toggle("is-active", row.dataset.file === file));
    ui.crumbFile.textContent = file;
    ui.mode.textContent = file.endsWith(".css") ? "CSS" : "HTML";
    updateCursor();
    if (!keepFocus) focusEditor();
  }

  // Em telas de toque, o foco automático abriria o teclado sem o aluno pedir.
  function focusEditor() {
    if (TOUCH.matches || ui.root.dataset.view !== "code") return;
    if (editor.cm && editor.docs) editor.cm.focus();
    else if (editor.textarea) editor.textarea.focus();
  }

  function updateCursor() {
    let line = 1;
    let col = 1;
    if (editor.cm && editor.docs) {
      const cursor = editor.cm.getCursor();
      line = cursor.line + 1;
      col = cursor.ch + 1;
    } else if (editor.textarea) {
      const before = editor.textarea.value.slice(0, editor.textarea.selectionStart).split("\n");
      line = before.length;
      col = before[before.length - 1].length + 1;
    }
    ui.cursor.textContent = "Ln " + line + ", Col " + col;
  }

  function toggleWrap() {
    prefs.wrap = !prefs.wrap;
    savePrefs();
    if (editor.cm) editor.cm.setOption("lineWrapping", prefs.wrap || MOBILE.matches);
    toast(prefs.wrap ? "Quebra automática de linha ativada." : "Quebra automática de linha desativada.");
  }

  /* ------------------------------------------------------------------------
     09. RESULTADO AO VIVO
     O index.html é renderizado em um iframe; a tag <link> do style.css é
     trocada pelo conteúdo do arquivo. Mudanças só no CSS são aplicadas sem
     recarregar (o estado da página, como um menu aberto, é mantido).
     ------------------------------------------------------------------------ */
  const preview = { active: null, pending: null, seq: 0, lastHtml: null, linked: false, y: 0, timer: 0, swapTimer: 0, lineMap: null };

  // Roda dentro do iframe do resultado. Escrito sem comentários de linha
  // porque é convertido em uma única linha (preserva a numeração do aluno).
  function previewHelper(cfg) {
    var send = function (msg) {
      msg.__pratica = true;
      msg.id = cfg.id;
      try { window.parent.postMessage(msg, "*"); } catch (e) { /* janela isolada */ }
    };
    var restore = function () { if (cfg.y) window.scrollTo(0, cfg.y); };
    var timer = 0;
    document.addEventListener("DOMContentLoaded", function () { restore(); send({ tipo: "pronto" }); });
    window.addEventListener("load", restore);
    window.addEventListener("scroll", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { send({ tipo: "rolagem", y: window.scrollY }); }, 100);
    }, { passive: true });
    window.addEventListener("error", function (e) { send({ tipo: "erro", texto: e.message, linha: e.lineno }); });
    document.addEventListener("click", function (e) {
      var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!link || e.defaultPrevented) return;
      var href = link.getAttribute("href");
      if (href.charAt(0) === "#") {
        e.preventDefault();
        var alvo = href.length > 1 ? document.getElementById(decodeURIComponent(href.slice(1))) : null;
        if (alvo) alvo.scrollIntoView();
        else if (href === "#" || href === "#top") window.scrollTo(0, 0);
        return;
      }
      if (cfg.standalone || link.target || /^(mailto|tel):/i.test(href)) return;
      e.preventDefault();
      if (/^https?:/i.test(href)) { window.open(link.href, "_blank", "noopener"); return; }
      send({ tipo: "aviso", texto: "Link para “" + href + "”: na prévia, a navegação para outras páginas fica desativada." });
    });
    document.addEventListener("submit", function (e) {
      if (cfg.standalone) return;
      e.preventDefault();
      var action = e.target.getAttribute("action");
      send({ tipo: "aviso", texto: "✓ Formulário válido! Envio simulado" + (action ? " para “" + action + "”" : "") + "." });
    });
    window.addEventListener("message", function (e) {
      var d = e.data;
      if (!d || d.__pratica !== true || d.tipo !== "css" || d.id !== cfg.id) return;
      var estilos = document.querySelectorAll("style[data-pratica-css]");
      for (var i = 0; i < estilos.length; i++) estilos[i].textContent = d.css;
    });
  }

  const HELPER_SOURCE = "(" + previewHelper.toString().replace(/\s*\n\s*/g, " ") + ")";

  // Monta o documento final: CSS embutido no lugar do <link> + script auxiliar.
  function buildDocument(html, css, options) {
    const safeCss = css.replace(/<\/style/gi, "<\\/style");
    const comments = [];
    html.replace(/<!--[\s\S]*?(?:-->|$)/g, (match, offset) => {
      comments.push([offset, offset + match.length]);
      return match;
    });
    const inComment = (index) => comments.some((range) => index >= range[0] && index < range[1]);

    let linked = false;
    let lineMap = null;
    const linkPattern = /<link\b[^>]*\bhref\s*=\s*["']?(?:\.\/)?style\.css(?:[?#][^"'\s>]*)?["']?[^>]*>/gi;
    let doc = html.replace(linkPattern, (tag, offset) => {
      if (inComment(offset) || !/\brel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
      const replacement = '<style data-pratica-css="style.css">' + safeCss + "</style>";
      if (!linked) {
        lineMap = { line: countLines(html.slice(0, offset)) + 1, delta: countLines(replacement) - countLines(tag) };
      }
      linked = true;
      return replacement;
    });

    const config = { id: options.id, y: options.y || 0, standalone: Boolean(options.standalone) };
    let injected = "<script>" + HELPER_SOURCE + "(" + JSON.stringify(config) + ");</script>" + (options.extra || "");
    if (options.standalone) injected = '<base href="' + escapeHtml(new URL(".", location.href).href) + '">' + injected;

    // O script auxiliar entra logo após <head> (sem quebrar linhas).
    const anchors = [/<head\b[^>]*>/i, /<html\b[^>]*>/i, /<!doctype[^>]*>/i];
    const anchor = anchors.map((pattern) => doc.match(pattern)).find(Boolean);
    if (anchor) {
      const at = anchor.index + anchor[0].length;
      doc = doc.slice(0, at) + injected + doc.slice(at);
    } else {
      doc = injected + doc;
    }

    return { doc: doc, linked: linked, lineMap: lineMap };
  }

  function createFrame(id) {
    const frame = document.createElement("iframe");
    frame.className = "practice-frame";
    frame.title = "Resultado do código";
    frame.dataset.render = id;
    frame.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads"
    );
    frame.setAttribute("allow", "fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write");
    frame.setAttribute("allowfullscreen", "");
    return frame;
  }

  function schedulePreview(file) {
    window.clearTimeout(preview.timer);
    preview.timer = window.setTimeout(() => renderPreview(false), file === "style.css" ? 120 : 320);
  }

  function renderPreview(force) {
    if (!state.ex) return;
    const html = state.files["index.html"];
    const css = state.files["style.css"];
    const active = preview.active;

    // Só o CSS mudou: atualiza o <style> da página atual, sem recarregar.
    if (!force && active && !preview.pending && active.dataset.ready && html === preview.lastHtml) {
      if (preview.linked) {
        active.contentWindow.postMessage({ __pratica: true, tipo: "css", id: active.dataset.render, css: css }, "*");
      }
      return;
    }

    preview.seq += 1;
    const id = "r" + preview.seq;
    // No modo montar, cada elemento ganha data-pn e a tela recebe o script de arrastar.
    let pageHtml = html;
    let extra = "";
    if (montar && montar.ativo()) {
      const canvas = montar.prepararTela(html, id);
      pageHtml = canvas.html;
      extra = canvas.script;
    }
    const built = buildDocument(pageHtml, css, { id: id, y: preview.y, extra: extra });
    preview.lastHtml = html;
    preview.linked = built.linked;
    preview.lineMap = built.lineMap;
    ui.notice.hidden = built.linked;
    hideError();

    // Um iframe novo a cada versão: a troca só acontece quando ele está
    // pronto (sem piscar) e o histórico do navegador não é poluído.
    if (preview.pending) preview.pending.remove();
    const frame = createFrame(id);
    frame.srcdoc = built.doc;
    preview.pending = frame;
    ui.frames.appendChild(frame);

    window.clearTimeout(preview.swapTimer);
    preview.swapTimer = window.setTimeout(() => showFrame(frame), 2500);
  }

  function showFrame(frame) {
    if (preview.pending !== frame) return;
    window.clearTimeout(preview.swapTimer);
    frame.classList.add("is-active");
    if (preview.active) preview.active.remove();
    preview.active = frame;
    preview.pending = null;
  }

  function clearFrames() {
    window.clearTimeout(preview.timer);
    window.clearTimeout(preview.swapTimer);
    ui.frames.textContent = "";
    preview.active = null;
    preview.pending = null;
    preview.lastHtml = null;
  }

  function onMessage(event) {
    const data = event.data;
    if (!ui || !data || data.__pratica !== true) return;
    const frame = [preview.active, preview.pending].find((f) => f && f.contentWindow === event.source);
    if (!frame) return;

    if (data.tipo === "pronto") {
      frame.dataset.ready = "1";
      showFrame(frame);
    } else if (data.tipo === "rolagem" && frame === preview.active) {
      preview.y = data.y;
    } else if (data.tipo === "aviso") {
      toast(data.texto);
    } else if (data.tipo === "erro") {
      showError(data.texto, data.linha);
    } else if (montar) {
      montar.mensagem(data, frame);
    }
  }

  // Converte a linha do documento montado para a linha do index.html do aluno.
  function studentLine(line) {
    const map = preview.lineMap;
    if (!line) return 0;
    if (!map || line < map.line) return line;
    return line - map.line <= map.delta ? map.line : line - map.delta;
  }

  function showError(message, line) {
    const studentLineNumber = studentLine(line);
    ui.error.hidden = false;
    ui.error.dataset.line = String(studentLineNumber || "");
    ui.error.textContent =
      "⚠ Erro no JavaScript" + (studentLineNumber ? " (linha " + studentLineNumber + ")" : "") + ": " + message;
  }

  function hideError() {
    ui.error.hidden = true;
    ui.error.textContent = "";
  }

  function goToErrorLine() {
    const line = Number(ui.error.dataset.line);
    selectFile("index.html");
    setView("code");
    if (line && editor.cm && editor.docs) {
      editor.cm.setCursor({ line: line - 1, ch: 0 });
      editor.cm.scrollIntoView(null, 80);
    }
  }

  function openInNewTab() {
    const built = buildDocument(state.files["index.html"], state.files["style.css"], { id: "aba", standalone: true });
    const url = URL.createObjectURL(new Blob([built.doc], { type: "text/html;charset=utf-8" }));
    window.open(url, "_blank");
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  /* ------------------------------------------------------------------------
     10. ABRIR, FECHAR E POSIÇÃO DE ROLAGEM
     A janela é uma camada sobre a aula: a página não sai do lugar. Ainda
     assim, a posição é guardada e restaurada ao voltar, e o botão "voltar"
     do navegador também fecha a prática.
     ------------------------------------------------------------------------ */
  const state = { ex: null, starter: null, files: null, scrollY: 0, opener: null, pushed: false, saveTimer: 0 };
  let unwinding = null;

  function lockPage(lock) {
    document.documentElement.classList.toggle("practice-lock", lock);
    Array.from(document.body.children).forEach((el) => {
      if (el === ui.root || el.tagName === "SCRIPT") return;
      if (lock && !el.inert) {
        el.inert = true;
        el.dataset.practiceInert = "";
      } else if (!lock && "practiceInert" in el.dataset) {
        el.inert = false;
        delete el.dataset.practiceInert;
      }
    });
  }

  function onFilesChanged(file) {
    afterExternalEdit();
    if (montar) montar.aoEditar();
    schedulePreview(file);
  }

  // Arquivos alterados por fora do editor (modo montar): marca e salva.
  function afterExternalEdit() {
    const modified = updateModified();
    if (state.ex.opener && !state.ex.isFinal) state.ex.opener.classList.toggle("has-progress", modified);
    window.clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(saveProgress, 400);
  }

  function saveProgress() {
    window.clearTimeout(state.saveTimer);
    if (!state.ex) return;
    const modified = FILES.some((file) => state.files[file] !== state.starter[file]);
    if (modified) {
      store.write(progressKey(state.ex), { base: state.ex.fingerprint, files: state.files, salvoEm: Date.now() });
    } else {
      store.remove(progressKey(state.ex));
    }
  }

  function resetFiles() {
    if (!editor.docs && !window.confirm("Descartar suas alterações e voltar ao código original da aula?")) return;
    if (montar) montar.aoRestaurar();
    FILES.forEach((file) => {
      state.files[file] = state.starter[file];
      if (editor.docs) editor.docs[file].setValue(state.starter[file]);
    });
    if (editor.textarea) editor.textarea.value = state.files[editor.active];
    preview.y = 0;
    onFilesChanged("index.html");
    toast(editor.docs ? "Código original restaurado. Ctrl + Z desfaz." : "Código original restaurado.");
  }

  function openPractice(ex, options) {
    const opts = options || {};
    if (!ui) buildUI();
    if (state.ex === ex) return;

    const firstOpen = !state.ex;
    if (firstOpen) {
      state.scrollY = window.scrollY;
      state.opener = ex.opener;
    } else {
      saveProgress();
    }

    // Histórico: o botão "voltar" do navegador fecha a prática. A entrada é
    // criada antes de travar a página, para o navegador guardar a posição exata.
    if (opts.fromHistory) {
      state.pushed = true;
    } else if (opts.fromHash) {
      state.pushed = false;
    } else {
      history.pushState({ pratica: ex.id }, "", HASH_PREFIX + ex.id);
      state.pushed = true;
    }

    if (firstOpen) lockPage(true);

    state.ex = ex;
    state.starter = starterFor(ex);
    state.files = Object.assign({}, state.starter, readProgress(ex) || {});
    editor.active = "index.html";
    preview.y = 0;
    preview.lastHtml = null;

    // Cabeçalho, explorador e desafio
    ui.title.textContent = ex.title;
    ui.subtitle.textContent = " — " + [ex.module, ex.section].filter(Boolean).join(" · ");
    ui.folder.textContent = "pratica-" + ex.id;
    ui.crumbFolder.textContent = "pratica-" + ex.id;
    ui.challenge.innerHTML = /^\s*<p[\s>]/i.test(ex.challenge) ? ex.challenge : "<p>" + ex.challenge + "</p>";

    ui.root.hidden = false;
    setView("code");
    selectFile("index.html", true);
    updateModified();
    if (montar) montar.aoAbrir(ex);
    setMode(prefs.modo, false);
    updateSize();

    if (!editor.cm && !editor.textarea) {
      ui.editor.innerHTML = '<div class="practice-loading">Preparando o editor…</div>';
    }
    ui.root.querySelector(".practice-back").focus({ preventScroll: true });

    // Mesmo que algum complemento falhe, o CodeMirror funciona sem ele.
    loadEditorLibrary().then(() => {
      if (state.ex !== ex) return;
      mountEditor(Boolean(window.CodeMirror));
      focusEditor();
    });
  }

  function closePractice() {
    if (!state.ex) return;
    saveProgress();
    if (editor.cm && editor.cm.state.completionActive) editor.cm.closeHint();
    if (montar) montar.aoFechar();

    ui.root.hidden = true;
    clearFrames();
    hideError();
    lockPage(false);
    editor.docs = null;

    const y = state.scrollY;
    const opener = state.opener;
    state.ex = null;
    state.opener = null;

    instantScroll(() => window.scrollTo(0, y));
    if (opener) opener.focus({ preventScroll: true });
  }

  // Botão "Voltar à aula": fecha e desfaz a entrada criada no histórico.
  function requestClose() {
    const ex = state.ex;
    if (!ex) return;
    const ownsEntry = state.pushed && history.state && history.state.pratica === ex.id;
    const y = state.scrollY;
    closePractice();

    if (ownsEntry) {
      unwinding = { id: ex.id, y: y };
      history.back();
    } else if (location.hash.indexOf(HASH_PREFIX) === 0) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function hashId() {
    return location.hash.indexOf(HASH_PREFIX) === 0 ? decodeURIComponent(location.hash.slice(HASH_PREFIX.length)) : "";
  }

  function onPopState() {
    if (unwinding) {
      // Ainda na entrada da prática (ex.: navegação dentro do resultado)? Volta mais uma.
      if (history.state && history.state.pratica === unwinding.id) {
        history.back();
        return;
      }
      const y = unwinding.y;
      unwinding = null;
      instantScroll(() => window.scrollTo(0, y));
      return;
    }

    const ex = exercisesById.get((history.state && history.state.pratica) || hashId());
    if (ex) {
      if (state.ex !== ex) openPractice(ex, { fromHistory: Boolean(history.state && history.state.pratica) });
    } else if (state.ex) {
      const y = state.scrollY;
      closePractice();
      instantScroll(() => window.scrollTo(0, y));
    }
  }

  function onKeyDown(event) {
    if (!state.ex) return;
    const mod = event.ctrlKey || event.metaKey;

    if (mod && !event.altKey && event.code === "KeyS") {
      event.preventDefault();
      saveProgress();
      toast("Tudo certo: suas alterações são salvas automaticamente neste navegador.");
    } else if (mod && !event.altKey && !event.shiftKey && event.code === "KeyB") {
      event.preventDefault();
      setSidebar(ui.root.classList.contains("is-sidebar-hidden"), true);
    } else if (event.altKey && !mod && event.code === "KeyZ") {
      event.preventDefault();
      toggleWrap();
    } else if (montar && montar.teclado(event)) {
      event.preventDefault();
    }
  }

  /* ------------------------------------------------------------------------
     11. INICIALIZAÇÃO
     ------------------------------------------------------------------------ */
  function init() {
    collectExercises();
    if (!exercises.length) return;

    if (window.PraticaMontar) {
      montar = window.PraticaMontar.criar({
        PAGE: PAGE,
        state: state,
        editor: editor,
        preview: preview,
        prefs: prefs,
        savePrefs: savePrefs,
        icon: icon,
        escapeHtml: escapeHtml,
        dedent: dedent,
        starterFor: starterFor,
        renderPreview: renderPreview,
        selectFile: selectFile,
        setView: setView,
        afterExternalEdit: afterExternalEdit,
        isMobile: () => MOBILE.matches,
      });
    }

    exercises.forEach(decorate);
    markProgress();

    window.addEventListener("popstate", onPopState);
    window.addEventListener("message", onMessage);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("pagehide", saveProgress);

    // Link direto (ou recarregar a página) com #pratica-... reabre o exercício.
    const fromHash = exercisesById.get(hashId());
    if (fromHash) {
      instantScroll(() => fromHash.anchor.scrollIntoView({ block: "center" }));
      openPractice(fromHash, { fromHash: true });
    }

    // Baixa o editor com antecedência para o primeiro clique ser instantâneo.
    whenIdle(loadEditorLibrary);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
