/* ==========================================================================
   FUNDAMENTOS.WEB — Modo "Arrastar e soltar" da prática
   --------------------------------------------------------------------------
   O aluno arrasta blocos (elementos HTML ou estilos CSS) da paleta até a
   tela. Enquanto arrasta, o bloco aparece no lugar exato onde vai entrar;
   ao soltar, o código é digitado no editor ao lado, com destaque e um
   balão explicando o que mudou. Na tela também dá para clicar em um
   elemento (o código dele é destacado), arrastá-lo para outro lugar ou
   removê-lo.

   O código do aluno nunca é regerado do zero: cada ação vira uma edição
   pontual no texto (inserir, mover, remover, adicionar classe ou regra),
   preservando a formatação, os comentários e as entidades.

   Os blocos disponíveis ficam em scripts/pratica-blocos.js.

   Sumário
   01. Regras do HTML e utilitários
   02. Leitura do código com posições (HTML e CSS)
   03. Edições no código
   04. Blocos da paleta
   05. Prévias e realce de código dos cartões
   06. Script da tela (roda dentro do resultado)
   07. Interface: paleta, ferramentas, balão e dicas
   08. Arrastar da paleta até a tela
   09. Executar ações e animar o editor
   10. Seleção, passos e desfazer
   11. API usada pelo pratica.js
   ========================================================================== */

(function () {
  "use strict";

  window.PraticaMontar = { criar: criar };

  function criar(api) {
    /* ----------------------------------------------------------------------
       01. REGRAS DO HTML E UTILITÁRIOS
       ---------------------------------------------------------------------- */
    const DADOS = Object.assign(
      { tags: {}, propriedades: {}, elementos: {}, estilos: {}, grupos: {}, kits: {} },
      window.PRATICA_BLOCOS || {}
    );
    const VAZIOS = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
    const BRUTOS = new Set(["script", "style", "textarea", "title"]);
    const FECHAM_P = new Set(
      "address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr main menu nav ol p pre section table ul".split(" ")
    );
    const IMPLICITOS = {
      li: ["li"],
      dt: ["dt", "dd"],
      dd: ["dt", "dd"],
      option: ["option"],
      optgroup: ["option", "optgroup"],
      tr: ["td", "th", "tr"],
      td: ["td", "th"],
      th: ["td", "th"],
      thead: ["tr", "td", "th", "thead", "tbody", "tfoot"],
      tbody: ["tr", "td", "th", "thead", "tbody", "tfoot"],
      tfoot: ["tr", "td", "th", "thead", "tbody", "tfoot"],
    };
    const DE_LINHA = new Set(
      "a abbr audio b bdi bdo br button canvas cite code data datalist del dfn em embed i iframe img input ins kbd label mark meter object output picture progress q s samp select small span strong sub sup svg textarea time u var video wbr #texto".split(" ")
    );
    const PROPS_FLEX = new Set(["flex-direction", "flex-wrap", "flex-flow", "justify-content", "align-items", "align-content", "gap", "row-gap", "column-gap", "place-content"]);
    const PROPS_GRID = new Set(["grid-template-columns", "grid-template-rows", "grid-template-areas", "place-items", "grid-auto-flow"]);
    const PROPS_ITEM = new Set(["flex", "flex-grow", "flex-shrink", "flex-basis", "order", "align-self"]);
    const PROPS_TEXTO = /^(color|font|line-height|letter-spacing|word-spacing|text-|white-space|content$)/;
    const NOME_CLASSE = {
      p: "paragrafo", div: "caixa", span: "trecho", h1: "titulo", h2: "subtitulo", h3: "titulo",
      ul: "lista", ol: "lista", li: "item", a: "link", img: "imagem", button: "botao", section: "secao",
      article: "artigo", header: "cabecalho", footer: "rodape", nav: "menu", main: "principal",
      aside: "lateral", form: "formulario", label: "rotulo", input: "campo", table: "tabela", figure: "figura",
    };
    const UNIDADE = "  ";

    const esc = api.escapeHtml;
    const espera = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

    function inicioDaLinha(s, pos) {
      return s.lastIndexOf("\n", pos - 1) + 1;
    }

    function fimDaLinha(s, pos) {
      const fim = s.indexOf("\n", pos);
      return fim < 0 ? s.length : fim;
    }

    function recuoEm(s, pos) {
      return s.slice(inicioDaLinha(s, pos)).match(/^[ \t]*/)[0];
    }

    function soEspacoAntes(s, pos) {
      return /^[ \t]*$/.test(s.slice(inicioDaLinha(s, pos), pos));
    }

    function soEspacoDepois(s, pos) {
      return /^[ \t]*$/.test(s.slice(pos, fimDaLinha(s, pos)));
    }

    function recuar(trecho, pad) {
      return api
        .dedent(trecho)
        .replace(/^\n+|\s+$/g, "")
        .split("\n")
        .map((linha) => (linha.trim() ? pad + linha : ""))
        .join("\n");
    }

    function aplicarEdicao(texto, e) {
      return texto.slice(0, e.inicio) + e.texto + texto.slice(e.fim);
    }

    function contarLinhas(texto) {
      return texto ? texto.split("\n").length : 0;
    }

    function rotuloTag(tag) {
      return tag === "#texto" ? "texto" : "<" + tag + ">";
    }

    /* ----------------------------------------------------------------------
       02. LEITURA DO CÓDIGO COM POSIÇÕES
       Um leitor tolerante de HTML que guarda onde cada elemento começa e
       termina no texto. O número de cada elemento (pn) liga a tela ao código.
       ---------------------------------------------------------------------- */
    const cacheArvore = { src: null, arvore: null };

    function lerHtml(src) {
      if (cacheArvore.src === src) return cacheArvore.arvore;
      const nos = [];
      const raiz = { tag: "#documento", filhos: [], pai: null };
      const pilha = [raiz];
      const reAbre = /<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/y;
      const reFecha = /<\/([a-zA-Z][\w:-]*)\s*>/y;
      const fechar = (no, inicioFecho, fim, temFecho) => {
        no.inicioFecho = inicioFecho;
        no.fim = fim;
        no.temFecho = temFecho;
      };

      let i = 0;
      while (i < src.length) {
        const lt = src.indexOf("<", i);
        if (lt < 0) break;
        if (src.startsWith("<!--", lt)) {
          const fim = src.indexOf("-->", lt + 4);
          i = fim < 0 ? src.length : fim + 3;
          continue;
        }
        const prox = src.charAt(lt + 1);
        if (prox === "!" || prox === "?") {
          const fim = src.indexOf(">", lt);
          i = fim < 0 ? src.length : fim + 1;
          continue;
        }
        if (prox === "/") {
          reFecha.lastIndex = lt;
          const m = reFecha.exec(src);
          if (!m) {
            i = lt + 2;
            continue;
          }
          const nome = m[1].toLowerCase();
          let k = pilha.length - 1;
          while (k > 0 && pilha[k].tag !== nome) k -= 1;
          if (k > 0) {
            while (pilha.length - 1 > k) fechar(pilha.pop(), lt, lt, false);
            fechar(pilha.pop(), lt, lt + m[0].length, true);
          }
          i = lt + m[0].length;
          continue;
        }

        reAbre.lastIndex = lt;
        const m = reAbre.exec(src);
        if (!m) {
          i = lt + 1;
          continue;
        }
        const nome = m[1].toLowerCase();
        const fechaAntes = IMPLICITOS[nome] || (FECHAM_P.has(nome) ? ["p"] : null);
        if (fechaAntes) {
          while (pilha.length > 1 && fechaAntes.indexOf(pilha[pilha.length - 1].tag) >= 0) fechar(pilha.pop(), lt, lt, false);
        }

        const pai = pilha[pilha.length - 1];
        const no = {
          pn: nos.length,
          tag: nome,
          inicio: lt,
          fimNome: lt + 1 + m[1].length,
          fimAbertura: lt + m[0].length,
          pai: pai,
          filhos: [],
        };
        nos.push(no);
        pai.filhos.push(no);

        if (VAZIOS.has(nome) || m[3] === "/") {
          no.vazio = true;
          fechar(no, no.fimAbertura, no.fimAbertura, false);
          i = no.fimAbertura;
          continue;
        }
        if (BRUTOS.has(nome)) {
          const re = new RegExp("</" + nome + "\\s*>", "ig");
          re.lastIndex = no.fimAbertura;
          const fecho = re.exec(src);
          if (fecho) fechar(no, fecho.index, fecho.index + fecho[0].length, true);
          else fechar(no, src.length, src.length, false);
          i = no.fim;
          continue;
        }
        pilha.push(no);
        i = no.fimAbertura;
      }
      while (pilha.length > 1) fechar(pilha.pop(), src.length, src.length, false);

      const arvore = {
        src: src,
        nos: nos,
        corpo: nos.find((n) => n.tag === "body") || null,
        cabeca: nos.find((n) => n.tag === "head") || null,
      };
      cacheArvore.src = src;
      cacheArvore.arvore = arvore;
      return arvore;
    }

    function dentroDe(no, ancestral) {
      for (let atual = no; atual; atual = atual.pai) if (atual === ancestral) return true;
      return false;
    }

    function dentroDeSvg(no) {
      for (let atual = no.pai; atual; atual = atual.pai) if (atual.tag === "svg") return true;
      return false;
    }

    function classesDoNo(src, no) {
      const abertura = src.slice(no.inicio, no.fimAbertura);
      const m = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i.exec(abertura);
      const valor = m ? m[1] || m[2] || m[3] || "" : "";
      return valor.split(/\s+/).filter(Boolean);
    }

    // Trecho de um elemento, sem o recuo que ele tinha no arquivo.
    function trechoDoNo(src, no) {
      const prefixo = soEspacoAntes(src, no.inicio) ? recuoEm(src, no.inicio) : "";
      return api.dedent(prefixo + src.slice(no.inicio, no.fim).replace(/\s+$/, "")).replace(/^\n+/, "");
    }

    // Versão da página para a tela: cada elemento do <body> ganha data-pn.
    function marcarParaTela(arvore) {
      const src = arvore.src;
      let saida = "";
      let ultimo = 0;
      arvore.nos.forEach((no) => {
        if (no.tag === "html" || no.tag === "head" || (arvore.cabeca && dentroDe(no, arvore.cabeca))) return;
        if (no.tag === "script" || no.tag === "style") return;
        saida += src.slice(ultimo, no.fimNome) + ' data-pn="' + no.pn + '"';
        ultimo = no.fimNome;
      });
      return saida + src.slice(ultimo);
    }

    /* Leitura do CSS: blocos do nível atual (regras e @media) com posições */
    function mascararComentarios(texto) {
      return texto.replace(/\/\*[\s\S]*?(\*\/|$)/g, (m) => m.replace(/[^\n]/g, " "));
    }

    function blocosCss(css, de, ate) {
      const inicio = de || 0;
      const fim = ate == null ? css.length : ate;
      const limpo = mascararComentarios(css);
      const blocos = [];
      let profundidade = 0;
      let inicioSegmento = inicio;
      let abre = -1;
      for (let i = inicio; i < fim; i += 1) {
        const c = limpo[i];
        if (c === '"' || c === "'") {
          let j = i + 1;
          while (j < fim && limpo[j] !== c) j += limpo[j] === "\\" ? 2 : 1;
          i = j;
          continue;
        }
        if (c === "{") {
          if (profundidade === 0) abre = i;
          profundidade += 1;
        } else if (c === "}") {
          profundidade -= 1;
          if (profundidade === 0 && abre >= 0) {
            blocos.push({ prelude: limpo.slice(inicioSegmento, abre).trim(), abre: abre, fecha: i });
            inicioSegmento = i + 1;
            abre = -1;
          }
          if (profundidade < 0) profundidade = 0;
        } else if (c === ";" && profundidade === 0) {
          inicioSegmento = i + 1;
        }
      }
      return blocos;
    }

    function normalizar(seletor) {
      return seletor.replace(/\s+/g, " ").replace(/\s*([>+~,(:])\s*/g, "$1").replace(/\s*\)/g, ")").trim().toLowerCase();
    }

    function declaracoes(corpo) {
      const limpo = mascararComentarios(corpo);
      const lista = [];
      let atual = "";
      let parenteses = 0;
      for (const c of limpo) {
        if (c === "(") parenteses += 1;
        if (c === ")") parenteses -= 1;
        if (c === ";" && parenteses <= 0) {
          lista.push(atual);
          atual = "";
        } else {
          atual += c;
        }
      }
      lista.push(atual);
      return lista
        .map((d) => {
          const i = d.indexOf(":");
          return i < 0 ? null : [d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()];
        })
        .filter((d) => d && d[0] && d[1] && /^[a-z-]+$/.test(d[0]));
    }

    /* ----------------------------------------------------------------------
       03. EDIÇÕES NO CÓDIGO
       Cada função devolve uma edição { inicio, fim, texto } sobre o texto.
       ---------------------------------------------------------------------- */

    // Onde e como inserir um trecho dentro de "pai", antes de "antes".
    function calcularInsercao(arvore, pai, antes, trecho, emLinha) {
      const s = arvore.src;
      if (!pai) {
        const fimHtml = s.search(/<\/html\s*>/i);
        const pos = fimHtml >= 0 ? inicioDaLinha(s, fimHtml) : s.length;
        return { inicio: pos, fim: pos, texto: recuar(trecho, UNIDADE) + "\n", deslocamento: UNIDADE.length };
      }

      // Elementos de linha que dividem a linha com irmãos (ex.: <span> <span>) entram na mesma linha.
      const umaLinha = trecho.indexOf("\n") < 0;
      if (antes) {
        const dividindoLinha = emLinha && umaLinha && !soEspacoDepois(s, antes.fim);
        if (soEspacoAntes(s, antes.inicio) && !dividindoLinha) {
          const pad = recuoEm(s, antes.inicio);
          const pos = inicioDaLinha(s, antes.inicio);
          return { inicio: pos, fim: pos, texto: recuar(trecho, pad) + "\n", deslocamento: pad.length };
        }
        const linha = recuar(trecho, "");
        return { inicio: antes.inicio, fim: antes.inicio, texto: linha + " ", deslocamento: 0 };
      }

      const fecho = pai.inicioFecho;
      const ultimo = pai.filhos[pai.filhos.length - 1];
      if (emLinha && umaLinha && ultimo && !soEspacoAntes(s, ultimo.inicio) && soEspacoDepois(s, ultimo.fim)) {
        return { inicio: ultimo.fim, fim: ultimo.fim, texto: " " + recuar(trecho, ""), deslocamento: 1 };
      }
      if (soEspacoAntes(s, fecho) && inicioDaLinha(s, fecho) > pai.inicio) {
        const pad =
          ultimo && soEspacoAntes(s, ultimo.inicio) && ultimo.inicio > pai.fimAbertura
            ? recuoEm(s, ultimo.inicio)
            : recuoEm(s, fecho) + UNIDADE;
        const pos = inicioDaLinha(s, fecho);
        return { inicio: pos, fim: pos, texto: recuar(trecho, pad) + "\n", deslocamento: pad.length };
      }

      // O fechamento está na mesma linha do conteúdo (ex.: <p>Texto</p>).
      const interno = s.slice(pai.fimAbertura, fecho);
      if (emLinha) {
        const anterior = s.charAt(fecho - 1);
        const separador = !interno.trim() || /\s/.test(anterior) ? "" : " ";
        return { inicio: fecho, fim: fecho, texto: separador + recuar(trecho, ""), deslocamento: separador.length };
      }
      const base = recuoEm(s, pai.inicio);
      return {
        inicio: fecho,
        fim: fecho,
        texto: "\n" + recuar(trecho, base + UNIDADE) + "\n" + base,
        deslocamento: 1 + (base + UNIDADE).length,
      };
    }

    function calcularRemocao(s, no) {
      let inicio = no.inicio;
      let fim = no.fim;
      if (soEspacoAntes(s, inicio) && soEspacoDepois(s, fim)) {
        inicio = inicioDaLinha(s, inicio);
        fim = fimDaLinha(s, fim);
        if (fim < s.length) fim += 1;
      } else if (s.charAt(fim) === " ") {
        fim += 1;
      } else if (s.charAt(inicio - 1) === " ") {
        inicio -= 1;
      }
      return { inicio: inicio, fim: fim, texto: "" };
    }

    function adicionarClasse(s, no, classe) {
      const abertura = s.slice(no.inicio, no.fimAbertura);
      const m = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i.exec(abertura);
      if (!m) return { inicio: no.fimNome, fim: no.fimNome, texto: ' class="' + classe + '"' };
      const valor = m[1] != null ? m[1] : m[2] != null ? m[2] : m[3];
      if (m[3] != null) {
        const ini = no.inicio + m.index;
        return { inicio: ini, fim: ini + m[0].length, texto: ' class="' + valor + " " + classe + '"' };
      }
      const fimValor = no.inicio + m.index + m[0].length - 1;
      return { inicio: fimValor, fim: fimValor, texto: (valor.trim() ? " " : "") + classe };
    }

    // Ids repetidos ganham um número: dois blocos iguais não colidem.
    function idsUnicos(trecho, src) {
      const existentes = new Set();
      src.replace(/\bid\s*=\s*["']([^"']+)["']/gi, (m, id) => existentes.add(id));
      let resultado = trecho;
      const doTrecho = [];
      trecho.replace(/\bid\s*=\s*["']([^"']+)["']/gi, (m, id) => doTrecho.push(id));
      doTrecho.forEach((id) => {
        if (!existentes.has(id)) return;
        let n = 2;
        while (existentes.has(id + "-" + n)) n += 1;
        const novo = id + "-" + n;
        existentes.add(novo);
        const re = new RegExp("\\b(id|for|list)(\\s*=\\s*[\"'])" + id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([\"'])", "g");
        resultado = resultado.replace(re, "$1$2" + novo + "$3");
      });
      return resultado;
    }

    function todasAsClasses(src) {
      const classes = new Set();
      src.replace(/\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/gi, (m, a, b) => {
        (a || b || "").split(/\s+/).filter(Boolean).forEach((c) => classes.add(c));
      });
      return classes;
    }

    function anexarNoFim(texto, novo) {
      const semFim = texto.replace(/\s*$/, "");
      return { inicio: semFim.length, fim: texto.length, texto: (semFim ? "\n\n" : "") + novo };
    }

    function declaracaoNaRegra(texto, regra, prop, valor) {
      const ini = regra.abre + 1;
      const corpo = texto.slice(ini, regra.fecha);
      const limpo = mascararComentarios(corpo);
      const re = new RegExp("(^|[;{\\s])(" + prop.replace(/[-]/g, "\\-") + ")\\s*:", "ig");
      let achou = null;
      let m;
      while ((m = re.exec(limpo))) achou = m;

      if (achou) {
        const inicioValor = achou.index + achou[0].length;
        let j = inicioValor;
        let parenteses = 0;
        while (j < limpo.length) {
          const c = limpo[j];
          if (c === "(") parenteses += 1;
          else if (c === ")") parenteses -= 1;
          else if (c === ";" && parenteses <= 0) break;
          j += 1;
        }
        let fimValor = j;
        while (fimValor > inicioValor && /\s/.test(corpo[fimValor - 1])) fimValor -= 1;
        return { inicio: ini + inicioValor, fim: ini + fimValor, texto: " " + valor };
      }

      const semFinal = limpo.replace(/\s+$/, "");
      const precisaPontoVirgula = semFinal.trim().length > 0 && !/;$/.test(semFinal.trim());
      if (corpo.indexOf("\n") >= 0) {
        const recuoDecl = (corpo.match(/\n([ \t]+)\S/) || [null, recuoEm(texto, regra.abre) + UNIDADE])[1];
        const recuoFecho = soEspacoAntes(texto, regra.fecha) ? texto.slice(inicioDaLinha(texto, regra.fecha), regra.fecha) : "";
        return {
          inicio: ini + semFinal.length,
          fim: regra.fecha,
          texto: (precisaPontoVirgula ? ";" : "") + "\n" + recuoDecl + prop + ": " + valor + ";\n" + recuoFecho,
        };
      }
      return {
        inicio: ini + semFinal.length,
        fim: regra.fecha,
        texto: (precisaPontoVirgula ? ";" : "") + " " + prop + ": " + valor + "; ",
      };
    }

    // Cria ou atualiza a regra "seletor" (dentro do @media, se houver).
    function aplicarRegra(css, seletor, decls, midia) {
      const edicoes = [];
      let texto = css;
      const aplicar = (e) => {
        edicoes.push(e);
        texto = aplicarEdicao(texto, e);
      };
      const acharMidia = () =>
        midia ? blocosCss(texto).filter((b) => normalizar(b.prelude) === normalizar("@media " + midia)).pop() : null;
      const corpoDecl = (pad) => decls.map((d) => pad + UNIDADE + d[0] + ": " + d[1] + ";").join("\n");

      let blocoMidia = acharMidia();
      if (midia && !blocoMidia) {
        aplicar(anexarNoFim(texto, "@media " + midia + " {\n" + UNIDADE + seletor + " {\n" + corpoDecl(UNIDADE) + "\n" + UNIDADE + "}\n}\n"));
        return { css: texto, edicoes: edicoes, criada: true };
      }

      const acharRegra = () => {
        blocoMidia = acharMidia();
        const de = blocoMidia ? blocoMidia.abre + 1 : 0;
        const ate = blocoMidia ? blocoMidia.fecha : texto.length;
        return blocosCss(texto, de, ate).filter((b) => normalizar(b.prelude) === normalizar(seletor)).pop();
      };

      if (!acharRegra()) {
        const pad = blocoMidia ? UNIDADE : "";
        const novo = pad + seletor + " {\n" + corpoDecl(pad) + "\n" + pad + "}\n";
        if (blocoMidia) {
          const pos = soEspacoAntes(texto, blocoMidia.fecha) ? inicioDaLinha(texto, blocoMidia.fecha) : blocoMidia.fecha;
          aplicar({ inicio: pos, fim: pos, texto: "\n" + novo });
        } else {
          aplicar(anexarNoFim(texto, novo));
        }
        return { css: texto, edicoes: edicoes, criada: true };
      }

      decls.forEach((d) => aplicar(declaracaoNaRegra(texto, acharRegra(), d[0], d[1])));
      return { css: texto, edicoes: edicoes, criada: false };
    }

    /* ----------------------------------------------------------------------
       04. BLOCOS DA PALETA
       ---------------------------------------------------------------------- */
    let contadorUid = 0;

    function tagDoHtml(html) {
      const m = /^\s*<([a-zA-Z][\w-]*)/.exec(html);
      return m ? m[1].toLowerCase() : "#texto";
    }

    function blocoElemento(def, extra) {
      if (!def || !def.html) return null;
      const html = api.dedent(def.html).replace(/^\n+|\s+$/g, "");
      const tag = tagDoHtml(html);
      return Object.assign(
        {
          uid: "b" + (contadorUid += 1),
          tipo: "elemento",
          nome: def.nome || rotuloTag(tag),
          html: html,
          tag: tag,
          emLinha: def.emLinha != null ? def.emLinha : DE_LINHA.has(tag),
          info: def.info || DADOS.tags[tag] || "",
          amostra: def.amostra || null,
          origem: "biblioteca",
        },
        extra || {}
      );
    }

    function blocoEstilo(def, extra) {
      if (!def || !def.css || !def.css.length) return null;
      const primeira = def.css[0][0];
      let info = def.info || DADOS.propriedades[primeira] || "";
      if (!def.info && def.sufixo && /^:(hover|active|focus)/.test(def.sufixo)) info += " Vale quando o elemento está em " + def.sufixo + ".";
      if (!def.info && def.midia) info += " Só em telas " + def.midia + ".";
      return Object.assign(
        {
          uid: "b" + (contadorUid += 1),
          tipo: "estilo",
          nome: def.nome || def.css.map((d) => d[0] + ": " + d[1]).join("; "),
          css: def.css,
          sufixo: def.sufixo || "",
          midia: def.midia || "",
          info: info.trim(),
          origem: "biblioteca",
        },
        extra || {}
      );
    }

    // Elementos com classe do HTML inicial viram "componentes da aula".
    function componentesDaAula(html) {
      const arvore = lerHtml(html);
      if (!arvore.corpo) return [];
      const lista = [];
      const vistos = new Set();
      for (const no of arvore.nos) {
        if (no === arvore.corpo || !dentroDe(no, arvore.corpo) || no.tag === "script" || no.tag === "style") continue;
        if (dentroDeSvg(no)) continue;
        const classes = classesDoNo(html, no);
        if (!classes.length) continue;
        const assinatura = no.tag + "." + classes.slice().sort().join(".");
        if (vistos.has(assinatura)) continue;
        vistos.add(assinatura);
        const trecho = trechoDoNo(html, no);
        if (trecho.split("\n").length > 16 || trecho.length > 900) continue;
        const bloco = blocoElemento(
          { html: trecho, nome: "." + classes.join("."), info: "Componente desta aula. " + (DADOS.tags[no.tag] || "") },
          { origem: "componente" }
        );
        if (bloco) lista.push(bloco);
        if (lista.length >= 8) break;
      }
      return lista;
    }

    // Cada declaração do CSS da aula vira um bloco de estilo.
    function estilosDaAula(css) {
      if (!css) return [];
      const lista = [];
      const vistos = new Set();
      const visitar = (de, ate, midia) => {
        blocosCss(css, de, ate).forEach((b) => {
          if (/^@media/i.test(b.prelude)) {
            visitar(b.abre + 1, b.fecha, b.prelude.replace(/^@media\s*/i, ""));
            return;
          }
          if (b.prelude.charAt(0) === "@" || /:root/.test(b.prelude)) return;
          let sufixo = null;
          b.prelude.split(",").some((sel) => {
            const m = sel.trim().match(/^(?:[a-z][\w-]*|\*|[.#][\w-]+)(?:[.#][\w-]+)*((?:::?[\w-]+(?:\([^)]*\))?)*)$/i);
            if (m) sufixo = m[1] || "";
            return Boolean(m);
          });
          if (sufixo == null) return;
          declaracoes(css.slice(b.abre + 1, b.fecha)).forEach((d) => {
            if (d[0].indexOf("--") === 0) return;
            const chave = d[0] + ":" + d[1] + "|" + sufixo + "|" + (midia || "");
            if (vistos.has(chave)) return;
            vistos.add(chave);
            const bloco = blocoEstilo({ css: [d], sufixo: sufixo, midia: midia || "" }, { origem: "aula" });
            bloco.nome = d[0] + ": " + d[1];
            bloco.info = (DADOS.propriedades[d[0]] || "Propriedade usada na aula.") + " Na aula: " + b.prelude.replace(/\s+/g, " ");
            lista.push(bloco);
          });
        });
      };
      visitar(0, css.length, null);
      return lista.slice(0, 14);
    }

    function expandirIds(ids) {
      const lista = [];
      (ids || []).forEach((id) => {
        if (id.charAt(0) === "@") (DADOS.grupos[id.slice(1)] || []).forEach((g) => lista.push(g));
        else lista.push(id);
      });
      return Array.from(new Set(lista));
    }

    function mesmaDeclaracao(a, b) {
      return JSON.stringify(a.css) === JSON.stringify(b.css) && a.sufixo === b.sufixo && a.midia === b.midia;
    }

    function secoesDaPaleta(ex) {
      const kitsPagina = DADOS.kits[api.PAGE] || {};
      const kit = Object.assign({}, kitsPagina[ex.isFinal ? "exercicio" : ex.title] || {});
      if (ex.data.blocos) kit.blocos = ex.data.blocos;
      if (ex.data.estilos) kit.estilos = ex.data.estilos;

      const inicial = api.starterFor(ex);
      const componentes = componentesDaAula(inicial["index.html"]);
      let elementos = (kit.blocos || []).map((id) => blocoElemento(DADOS.elementos[id])).filter(Boolean);
      if (!elementos.length && !componentes.length) {
        elementos = ["titulo-h2", "paragrafo", "caixa", "lista-ul", "imagem"].map((id) => blocoElemento(DADOS.elementos[id])).filter(Boolean);
      }
      const daAula = estilosDaAula(ex.lessonCss || "");
      let extras = expandirIds(kit.estilos).map((id) => blocoEstilo(DADOS.estilos[id])).filter(Boolean);
      extras = extras.filter((b) => !daAula.some((a) => mesmaDeclaracao(a, b)));
      if (!daAula.length && !extras.length) extras = expandirIds(["@texto", "@caixa"]).map((id) => blocoEstilo(DADOS.estilos[id]));

      return [
        { titulo: "Componentes da aula", dica: "Peças do exemplo desta aula", blocos: componentes },
        { titulo: "Elementos HTML", dica: "Tags para montar a página", blocos: elementos },
        { titulo: "Estilos da aula", dica: "Declarações do CSS desta aula", blocos: daAula },
        { titulo: "Mais estilos", dica: "Arraste até um elemento da tela", blocos: extras },
      ].filter((s) => s.blocos.length);
    }

    /* ----------------------------------------------------------------------
       05. PRÉVIAS E REALCE DE CÓDIGO DOS CARTÕES
       ---------------------------------------------------------------------- */
    function realcarTag(t) {
      const m = /^<(\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?)>$/.exec(t);
      if (!m) return esc(t);
      const atributos = m[3].replace(
        /(\s+)|([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+))?/g,
        (todo, espaco, nome, igual, valor) => {
          if (espaco) return espaco;
          return '<span class="cm-attribute">' + esc(nome) + "</span>" + (igual ? esc(igual) + '<span class="cm-string">' + esc(valor) + "</span>" : "");
        }
      );
      return (
        '<span class="cm-bracket">&lt;' + m[1] + '</span><span class="cm-tag">' + esc(m[2]) + "</span>" +
        atributos + '<span class="cm-bracket">' + m[4] + "&gt;</span>"
      );
    }

    function realcarHtml(src) {
      let saida = "";
      let i = 0;
      const re = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|&[#a-zA-Z0-9]+;/g;
      let m;
      while ((m = re.exec(src))) {
        saida += esc(src.slice(i, m.index));
        const t = m[0];
        if (t.indexOf("<!--") === 0) saida += '<span class="cm-comment">' + esc(t) + "</span>";
        else if (t.charAt(0) === "&") saida += '<span class="cm-atom">' + esc(t) + "</span>";
        else saida += realcarTag(t);
        i = m.index + t.length;
      }
      return saida + esc(src.slice(i));
    }

    function realcarCss(texto) {
      return texto
        .split("\n")
        .map((linha) => {
          const m = /^(\s*)([\w-]+)(\s*:\s*)(.*?)(;?)$/.exec(linha);
          if (m && !/[{}]/.test(linha)) {
            return m[1] + '<span class="cm-property">' + esc(m[2]) + "</span>" + esc(m[3]) + '<span class="cm-atom">' + esc(m[4]) + "</span>" + m[5];
          }
          return esc(linha).replace(/^(\s*)([^{]+)\{/, '$1<span class="cm-qualifier">$2</span>{').replace(/^(\s*)(@media)/, '$1<span class="cm-def">$2</span>');
        })
        .join("\n");
    }

    function codigoDoEstilo(bloco, seletor) {
      const sel = (seletor || "") + bloco.sufixo;
      const pad = bloco.midia ? UNIDADE : "";
      let texto = bloco.css.map((d) => pad + (sel ? UNIDADE : "") + d[0] + ": " + d[1] + ";").join("\n");
      if (sel) texto = pad + sel + " {\n" + texto + "\n" + pad + "}";
      if (bloco.midia) texto = "@media " + bloco.midia + " {\n" + texto + "\n}";
      return texto;
    }

    function cssDaPrevia() {
      return (api.state.files ? api.state.files["style.css"] : "")
        .replace(/@import[^;]+;/g, "")
        .replace(/:root\b/g, ":host")
        .replace(/(^|[\s,{}>+~])(html|body)(?=[\s,{.:#[>+~]|$)/g, "$1.pv-body");
    }

    const PREVIA_BASE =
      ":host{all:initial;display:block;height:100%;overflow:hidden;}" +
      ".pv-zoom{zoom:.5;width:200%;height:200%;pointer-events:none;}" +
      ".pv-body{box-sizing:border-box;min-height:100%;padding:16px 20px;background:#fff;color:#142033;font:16px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;}" +
      ".pv-body img{max-width:100%;height:auto;}" +
      ".pv-texto{font-size:30px;}" +
      ".pv-midia{display:grid;place-items:center;height:130px;border-radius:12px;background:#0b1220;color:#99f6e4;font:700 24px system-ui,sans-serif;}" +
      ".pv-tela{height:auto;aspect-ratio:16/9;}.pv-yt{background:#b91c1c;color:#fff;}" +
      ".pv-mapa{background:#d1fae5;color:#065f46;}.pv-pagina{background:#eef2ff;color:#3730a3;}";
    const PREVIA_FIM = ".pv-body{margin:0!important;min-height:100%!important;}";

    const AMOSTRA_BASE =
      ":host{all:initial;display:block;height:100%;overflow:hidden;}" +
      ".pv-area{box-sizing:border-box;display:flex;height:100%;padding:8px 12px;align-items:center;justify-content:center;gap:6px;background:#fff;color:#142033;font:13px/1.4 system-ui,sans-serif;}" +
      ".pv-caixa{box-sizing:border-box;width:86px;padding:8px;border:1px solid #c7d2fe;background:#eef2ff;color:#3730a3;font-weight:700;text-align:center;}" +
      ".pv-fundo{width:120px;height:52px;background-color:#eef2ff;background-image:url('https://picsum.photos/seed/amostra-fundo/120/80');background-size:auto;}" +
      ".pv-flex,.pv-grade,.pv-palco{box-sizing:border-box;width:100%;min-height:56px;padding:4px;border:1px dashed #a5b4fc;border-radius:6px;}" +
      ".pv-flex{display:flex;gap:4px;}.pv-grade{display:grid;gap:4px;}.pv-palco{position:relative;}" +
      ".pv-flex i,.pv-grade i{display:block;min-width:20px;padding:3px 6px;border-radius:4px;background:#4f46e5;color:#fff;font:700 11px/16px system-ui,sans-serif;font-style:normal;text-align:center;}" +
      ".pv-flex i:nth-child(2){padding-block:9px;}" +
      ".pv-palco .pv-caixa{width:auto;padding:3px 8px;}" +
      ".pv-texto-amostra{margin:0;font-size:15px;}" +
      ".pv-lista{margin:0;padding-left:18px;font-size:12px;}" +
      ".pv-vizinho{padding:4px 6px;border-radius:4px;background:#f1f5f9;color:#64748b;font-size:11px;}";

    function variaveisDaPagina() {
      const css = api.state.files ? api.state.files["style.css"] : "";
      return (css.match(/:root\s*\{[^}]*\}/g) || []).join("").replace(/:root/g, ":host");
    }

    function amostraDeEstilo(bloco) {
      const props = bloco.css.map((d) => d[0]);
      const valorDisplay = (bloco.css.find((d) => d[0] === "display") || [])[1] || "";
      const regra = ".pv-alvo" + bloco.sufixo + "{" + bloco.css.map((d) => d[0] + ":" + d[1] + "!important;").join("") + "}";
      let html;
      if (props.some((p) => PROPS_ITEM.has(p))) {
        html = '<div class="pv-flex" style="align-items:flex-start"><i>1</i><i class="pv-alvo">2</i><i>3</i></div>';
      } else if (props.some((p) => PROPS_GRID.has(p)) || /grid/.test(valorDisplay)) {
        html = '<div class="pv-grade pv-alvo" style="display:block"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i></div>';
      } else if (props.some((p) => PROPS_FLEX.has(p)) || /flex/.test(valorDisplay)) {
        html = '<div class="pv-flex pv-alvo"' + (/flex/.test(valorDisplay) ? ' style="display:block"' : "") + "><i>1</i><i>2</i><i>3</i></div>";
      } else if (props.some((p) => p === "position" || p === "top" || p === "left")) {
        html = '<div class="pv-palco"><div class="pv-caixa pv-alvo">Aa</div></div>';
      } else if (props.some((p) => /^list-style/.test(p))) {
        html = '<ul class="pv-lista pv-alvo"><li>Item um</li><li>Item dois</li></ul>';
      } else if (props.some((p) => p === "display")) {
        html = '<span class="pv-vizinho">antes</span><div class="pv-caixa pv-alvo">Aa</div><span class="pv-vizinho">depois</span>';
      } else if (props.every((p) => PROPS_TEXTO.test(p))) {
        html = '<p class="pv-texto-amostra pv-alvo">Texto de exemplo</p>';
      } else if (props.some((p) => /^background-(size|position|repeat|attachment)/.test(p))) {
        html = '<div class="pv-fundo pv-alvo"></div>';
      } else {
        html = '<div class="pv-caixa pv-alvo">Aa</div>';
      }
      return { html: '<div class="pv-area">' + html + "</div>", css: AMOSTRA_BASE + variaveisDaPagina() + regra };
    }

    function renderizarPrevia(host, bloco) {
      const raiz = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
      if (bloco.tipo === "estilo") {
        const amostra = amostraDeEstilo(bloco);
        raiz.innerHTML = "<style>" + amostra.css + "</style>" + amostra.html;
        return;
      }
      const conteudo = bloco.amostra || (bloco.tag === "#texto" ? '<span class="pv-texto">' + bloco.html + "</span>" : bloco.html);
      raiz.innerHTML =
        "<style>" + PREVIA_BASE + cssDaPrevia() + PREVIA_FIM + "</style>" +
        '<div class="pv-zoom"><div class="pv-body">' + conteudo.replace(/<script[\s\S]*?<\/script>/gi, "") + "</div></div>";
    }

    /* ----------------------------------------------------------------------
       06. SCRIPT DA TELA (roda dentro do resultado)
       Desenha os realces, calcula onde o bloco vai entrar e mostra a prévia.
       Escrito sem comentários de linha: é convertido em uma linha só.
       ---------------------------------------------------------------------- */
    function telaHelper(cfg) {
      var NS = "http://www.w3.org/1999/xhtml";
      var VAZIO = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, track: 1, wbr: 1 };
      var FRASE = { p: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, span: 1, a: 1, strong: 1, em: 1, b: 1, i: 1, u: 1, s: 1, small: 1, mark: 1, del: 1, ins: 1, q: 1, abbr: 1, code: 1, label: 1, button: 1, legend: 1, dt: 1, pre: 1, sub: 1, sup: 1, cite: 1, time: 1, output: 1, summary: 1 };
      var LINHA = { a: 1, abbr: 1, audio: 1, b: 1, br: 1, button: 1, cite: 1, code: 1, del: 1, em: 1, i: 1, iframe: 1, img: 1, input: 1, ins: 1, label: 1, mark: 1, output: 1, picture: 1, q: 1, s: 1, select: 1, small: 1, span: 1, strong: 1, sub: 1, sup: 1, svg: 1, textarea: 1, time: 1, u: 1, video: 1 };
      var SO = { ul: ["li"], ol: ["li"], menu: ["li"], dl: ["dt", "dd", "div"], table: ["caption", "colgroup", "thead", "tbody", "tfoot", "tr"], thead: ["tr"], tbody: ["tr"], tfoot: ["tr"], tr: ["td", "th"], select: ["option", "optgroup"], optgroup: ["option"], datalist: ["option"], colgroup: ["col"], picture: ["source", "img"] };
      var PRECISA = { li: ["ul", "ol"], dt: ["dl"], dd: ["dl"], tr: ["table", "thead", "tbody", "tfoot"], td: ["tr"], th: ["tr"], thead: ["table"], tbody: ["table"], tfoot: ["table"], caption: ["table"], colgroup: ["table"], option: ["select", "datalist", "optgroup"], optgroup: ["select"], legend: ["fieldset"], figcaption: ["figure"], source: ["picture", "video", "audio"], summary: ["details"] };
      var ESTILO = ".b{position:fixed;display:none;box-sizing:border-box;pointer-events:none;}" +
        ".hover{border:1px solid rgba(79,70,229,.85);background:rgba(79,70,229,.05);}" +
        ".sel{border:2px solid #4f46e5;box-shadow:0 0 0 3px rgba(79,70,229,.18);}" +
        ".alvo{border:2px dashed #0d9488;background:rgba(153,246,228,.10);border-radius:4px;}" +
        ".alvo.erro{border-color:#e11d48;background:rgba(225,29,72,.07);}" +
        ".linha{background:#0d9488;border-radius:3px;box-shadow:0 0 0 3px rgba(13,148,136,.25);}" +
        ".prev{border:0;}" +
        ".novo{border:2px solid #14b8a6;border-radius:4px;animation:pulso 1.8s ease-out forwards;}" +
        ".multi{border:2px solid #f59e0b;background:rgba(245,158,11,.10);border-radius:3px;}" +
        "@keyframes pulso{0%{box-shadow:0 0 0 0 rgba(20,184,166,.7);opacity:1}60%{box-shadow:0 0 0 16px rgba(20,184,166,0);opacity:1}100%{box-shadow:0 0 0 16px rgba(20,184,166,0);opacity:0}}" +
        ".b span{position:absolute;left:-2px;bottom:100%;margin-bottom:2px;padding:2px 7px;border-radius:5px;font:600 11px/16px ui-monospace,Consolas,monospace;white-space:nowrap;color:#fff;background:#4f46e5;}" +
        ".b.dentro span{bottom:auto;top:2px;left:2px;}" +
        ".alvo span{background:#0d9488;}.alvo.erro span{background:#e11d48;}" +
        ".prev span,.novo span{background:#0f766e;}.multi span{display:none;}" +
        ".hover span{background:rgba(79,70,229,.92);}" +
        ".vazio{position:fixed;inset:14px;display:none;place-content:center;gap:8px;border:2px dashed #a5b4fc;border-radius:16px;background:rgba(238,242,255,.65);color:#4f46e5;font:600 15px/1.5 system-ui,sans-serif;text-align:center;pointer-events:none;}" +
        ".vazio b{font-size:30px;}";

      var raiz, caixas = {}, multis = [];
      var bloco = null, alvo = null, previas = [], estiloEl = null, estiloOriginal = null;
      var selEl = null, hoverEl = null, movendo = null, toque = null, marcados = null, estiloOk = null;

      function send(msg) {
        msg.__pratica = true;
        msg.id = cfg.id;
        try { window.parent.postMessage(msg, "*"); } catch (e) { return; }
      }

      function camada() {
        var host = document.createElement("pratica-camada");
        host.setAttribute("style", "all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block;");
        raiz = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
        raiz.innerHTML = "<style>" + ESTILO + "</style>";
        ["hover", "sel", "alvo", "linha", "prev", "novo"].forEach(function (nome) {
          var d = document.createElement("div");
          d.className = "b " + nome;
          d.appendChild(document.createElement("span"));
          raiz.appendChild(d);
          caixas[nome] = d;
        });
        var vazio = document.createElement("div");
        vazio.className = "vazio";
        vazio.innerHTML = "<b>✥</b><span>Arraste blocos da paleta para cá</span>";
        raiz.appendChild(vazio);
        caixas.vazio = vazio;
        document.documentElement.appendChild(host);
      }

      function poe(nome, r, texto) {
        var d = caixas[nome];
        if (!r) { d.style.display = "none"; return; }
        d.style.display = "block";
        d.style.left = r.left + "px";
        d.style.top = r.top + "px";
        d.style.width = Math.max(r.width, 2) + "px";
        d.style.height = Math.max(r.height, 2) + "px";
        d.classList.toggle("dentro", r.top < 22);
        d.firstChild.textContent = texto || "";
        d.firstChild.style.display = texto ? "" : "none";
      }

      function some(nome) { caixas[nome].style.display = "none"; }

      function pn(el) { return el && el.getAttribute ? el.getAttribute("data-pn") : null; }

      function no(el) {
        while (el && el !== document.documentElement) {
          if (el.nodeType === 1 && (el.hasAttribute("data-pn") || el === document.body)) return el;
          el = el.parentElement;
        }
        return document.body;
      }

      function rotulo(el) {
        if (!el) return "";
        var t = el.tagName.toLowerCase(), r = "<" + t;
        if (el.id) r += " id=\"" + el.id + "\"";
        var c = Array.prototype.filter.call(el.classList, function (x) { return x.indexOf("__") !== 0; });
        if (c.length) r += " class=\"" + c.join(" ") + "\"";
        r += ">";
        return r.length > 46 ? r.slice(0, 44) + "…>" : r;
      }

      function caixaDe(el) {
        if (!el || !el.getBoundingClientRect) return null;
        var r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, width: r.width, height: r.height };
      }

      function uniao(els) {
        var r = null;
        els.forEach(function (el) {
          var c = el.nodeType === 1 ? el.getBoundingClientRect() : null;
          if (!c || (!c.width && !c.height)) return;
          if (!r) { r = { left: c.left, top: c.top, right: c.right, bottom: c.bottom }; return; }
          r.left = Math.min(r.left, c.left); r.top = Math.min(r.top, c.top);
          r.right = Math.max(r.right, c.right); r.bottom = Math.max(r.bottom, c.bottom);
        });
        return r ? { left: r.left, top: r.top, width: r.right - r.left, height: r.bottom - r.top } : null;
      }

      function lista(a) { return a.map(function (x) { return "<" + x + ">"; }).join(" ou "); }

      function recusa(pai, b) {
        var p = pai.tagName.toLowerCase(), t = b.tag;
        if (pai.namespaceURI !== NS) return "<" + p + "> é um desenho SVG: não recebe HTML dentro.";
        if (VAZIO[p]) return "<" + p + "> é vazio: não aceita nada dentro.";
        if (p === "script" || p === "style" || p === "textarea" || p === "iframe" || p === "html" || p === "head" || p === "video" || p === "audio") return "<" + p + "> não recebe elementos aqui.";
        if (PRECISA[t] && PRECISA[t].indexOf(p) < 0) return "<" + t + "> precisa ficar dentro de " + lista(PRECISA[t]) + ".";
        if (SO[p] && SO[p].indexOf(t) < 0) return "<" + p + "> só aceita " + lista(SO[p]) + " como filho direto.";
        if (FRASE[p] && !b.emLinha) return "<" + p + "> só aceita texto e elementos de linha, e <" + t + "> é um bloco.";
        if ((p === "a" || p === "button") && (t === "a" || t === "button" || t === "input" || t === "select" || t === "textarea")) return "Não coloque elementos clicáveis dentro de <" + p + ">.";
        return "";
      }

      function filhos(c) {
        return Array.prototype.filter.call(c.children, function (k) {
          return k.hasAttribute("data-pn") && k !== movendo && !k.hasAttribute("data-pr-previa") && k.getClientRects().length > 0;
        });
      }

      function referencia(ks, x, y, c) {
        if (!ks.length) return { antes: null, horiz: false };
        var horiz = false;
        if (ks.length > 1) {
          var a = ks[0].getBoundingClientRect(), b = ks[1].getBoundingClientRect();
          horiz = b.top < a.bottom - 4 && (b.left > a.left + 4 || b.right < a.right - 4);
        } else {
          var cs = getComputedStyle(c);
          horiz = (/flex/.test(cs.display) && cs.flexDirection.indexOf("row") === 0) || /inline/.test(getComputedStyle(ks[0]).display);
        }
        for (var i = 0; i < ks.length; i++) {
          var r = ks[i].getBoundingClientRect();
          if (horiz) {
            if (y < r.top) return { antes: ks[i], horiz: horiz };
            if (y <= r.bottom && x < r.left + r.width / 2) return { antes: ks[i], horiz: horiz };
          } else if (y < r.top + r.height / 2) {
            return { antes: ks[i], horiz: horiz };
          }
        }
        return { antes: null, horiz: horiz };
      }

      function containerPara(el, b, porPonteiro) {
        var c = el, motivo = "";
        /* Com o ponteiro sobre um elemento simples da mesma tag (ex.: <span> sobre <span>), o bloco vai ao lado dele. */
        if (porPonteiro && c && c !== document.body && c.tagName.toLowerCase() === b.tag && !filhos(c).length) c = no(c.parentElement);
        while (c) {
          var r = recusa(c, b);
          if (!r) return { c: c, motivo: motivo };
          if (!motivo) motivo = r;
          c = c === document.body ? null : no(c.parentElement);
        }
        return { c: null, motivo: motivo };
      }

      function infoDe(el) {
        var t = el.tagName.toLowerCase();
        var classes = Array.prototype.filter.call(el.classList, function (x) { return x.indexOf("__") !== 0; }).map(function (nome) {
          var q = 0;
          try { q = document.querySelectorAll("." + CSS_escape(nome)).length; } catch (e) { q = 2; }
          return { nome: nome, qtd: q };
        });
        return {
          tag: t, id: el.id || "", classes: classes,
          qtdTag: document.getElementsByTagName(t).length,
          display: getComputedStyle(el).display,
          displayPai: el.parentElement ? getComputedStyle(el.parentElement).display : ""
        };
      }

      function CSS_escape(v) { return window.CSS && window.CSS.escape ? window.CSS.escape(v) : v.replace(/[^\w-]/g, "\\$&"); }

      function calcular(x, y) {
        var el = document.elementFromPoint(x, y);
        var alvoEl = no(el);
        if (bloco.tipo === "estilo") {
          var antigo = alvo && alvo.ok ? alvo : null;
          if (antigo && antigo.caixaOriginal && !antigo.el.contains(alvoEl)) {
            var c = antigo.caixaOriginal;
            if (x >= c.left && x <= c.left + c.width && y >= c.top && y <= c.top + c.height) return antigo;
          }
          return { ok: true, el: alvoEl, alvo: pn(alvoEl), rotulo: rotulo(alvoEl), info: infoDe(alvoEl), caixaOriginal: caixaDe(alvoEl) };
        }
        if (movendo && (alvoEl === movendo || movendo.contains(alvoEl))) alvoEl = no(movendo.parentElement);
        var r = containerPara(alvoEl, bloco, true);
        if (!r.c) return { ok: false, motivo: r.motivo || "Não dá para soltar aqui.", el: alvoEl };
        var ref = referencia(filhos(r.c), x, y, r.c);
        return {
          ok: true, el: r.c, elAntes: ref.antes, horiz: ref.horiz,
          pai: pn(r.c), antes: ref.antes ? pn(ref.antes) : null,
          rotulo: rotulo(r.c), aviso: r.c !== alvoEl && r.motivo ? r.motivo : ""
        };
      }

      function tirarPrevia() {
        previas.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
        previas = [];
        if (estiloEl) {
          if (estiloOriginal == null) estiloEl.removeAttribute("style"); else estiloEl.setAttribute("style", estiloOriginal);
          estiloEl = null;
        }
        some("prev");
      }

      function porPrevia(a) {
        var tpl = document.createElement("template");
        tpl.innerHTML = bloco.tag === "#texto" ? "<span>" + bloco.html + "</span>" : bloco.html;
        var nos = Array.prototype.slice.call(tpl.content.childNodes);
        if (bloco.emLinha && !a.elAntes && FRASE[a.el.tagName.toLowerCase()]) nos.unshift(document.createTextNode(" "));
        nos.forEach(function (n) {
          if (n.nodeType === 1) {
            n.setAttribute("data-pr-previa", "");
            n.style.setProperty("outline", "2px dashed #0d9488", "important");
            n.style.setProperty("outline-offset", "2px", "important");
            n.style.setProperty("pointer-events", "none", "important");
            if (n.animate) n.animate([{ opacity: 0, transform: "scale(.97)" }, { opacity: 0.88, transform: "none" }], { duration: 180, fill: "forwards" });
            else n.style.opacity = "0.88";
          }
          a.el.insertBefore(n, a.elAntes || null);
          previas.push(n);
        });
        poe("prev", uniao(previas), "novo " + (bloco.tag === "#texto" ? "texto" : "<" + bloco.tag + ">") + " aqui");
      }

      function estiloTemporario(el) {
        if (bloco.sufixo || bloco.midia) return;
        estiloEl = el;
        estiloOriginal = el.getAttribute("style");
        bloco.css.forEach(function (d) {
          var valor = d[1].replace(/\s*!important\s*$/, "");
          if ((d[0] === "display" && valor === "none") || (d[0] === "visibility" && valor === "hidden")) {
            el.style.setProperty("opacity", "0.25", "important");
            return;
          }
          el.style.setProperty(d[0], valor);
        });
      }

      function mesmaPosicao(a, b) {
        return a && b && a.ok && b.ok && a.el === b.el && a.elAntes === b.elAntes;
      }

      function mostrar(a) {
        if (!a.ok) {
          tirarPrevia();
          some("linha");
          poe("alvo", caixaDe(a.el), "✗ não cabe aqui");
          caixas.alvo.classList.add("erro");
          alvo = a;
          return;
        }
        caixas.alvo.classList.remove("erro");
        if (bloco.tipo === "estilo") {
          if (!alvo || alvo.el !== a.el) { tirarPrevia(); estiloTemporario(a.el); }
          poe("alvo", caixaDe(a.el), (bloco.sufixo ? bloco.sufixo + " em " : "aplicar em ") + a.rotulo);
          alvo = a;
          return;
        }
        if (!mesmaPosicao(alvo, a)) {
          tirarPrevia();
          if (!movendo) porPrevia(a);
        }
        poe("alvo", caixaDe(a.el), "dentro de " + a.rotulo);
        if (movendo) desenharLinha(a); else some("linha");
        alvo = a;
      }

      function desenharLinha(a) {
        var ks = filhos(a.el), r;
        if (a.elAntes) {
          var c = a.elAntes.getBoundingClientRect();
          r = a.horiz ? { left: c.left - 3, top: c.top, width: 3, height: c.height } : { left: c.left, top: c.top - 3, width: c.width, height: 3 };
        } else if (ks.length) {
          var u = ks[ks.length - 1].getBoundingClientRect();
          r = a.horiz ? { left: u.right + 1, top: u.top, width: 3, height: u.height } : { left: u.left, top: u.bottom + 1, width: u.width, height: 3 };
        } else {
          var p = a.el.getBoundingClientRect();
          r = { left: p.left + 6, top: p.top + 6, width: Math.max(p.width - 12, 20), height: 3 };
        }
        poe("linha", r, "");
      }

      function responder(a, seq, extra) {
        var ponto = previas.length ? uniao(previas) : caixaDe(a.el);
        var msg = {
          tipo: "dnd-alvo", seq: seq, ok: a.ok, motivo: a.motivo || "", aviso: a.aviso || "",
          pai: a.pai == null ? null : a.pai, antes: a.antes == null ? null : a.antes, alvo: a.alvo == null ? null : a.alvo,
          rotulo: a.rotulo || "", info: a.info || null,
          ponto: ponto ? { x: ponto.left + Math.min(ponto.width, 240) / 2, y: ponto.top + Math.min(ponto.height, 80) / 2 } : null
        };
        if (extra) for (var k in extra) msg[k] = extra[k];
        send(msg);
      }

      function marcarValidos() {
        marcados = [];
        if (bloco.tipo !== "elemento") return;
        Array.prototype.forEach.call(document.querySelectorAll("[data-pn]"), function (el) {
          if (el === document.body || el === movendo || (movendo && movendo.contains(el))) return;
          if (!recusa(el, bloco)) { el.setAttribute("data-pr-ok", ""); marcados.push(el); }
        });
        estiloOk = document.createElement("style");
        estiloOk.textContent = "[data-pr-ok]{outline:1px dashed rgba(13,148,136,.55)!important;outline-offset:-1px!important;}";
        document.head.appendChild(estiloOk);
      }

      function desmarcar() {
        (marcados || []).forEach(function (el) { el.removeAttribute("data-pr-ok"); });
        marcados = null;
        if (estiloOk && estiloOk.parentNode) estiloOk.parentNode.removeChild(estiloOk);
        estiloOk = null;
      }

      function limpar() {
        tirarPrevia();
        some("alvo"); some("linha");
        caixas.alvo.classList.remove("erro");
        alvo = null;
      }

      function encerrar() {
        limpar();
        desmarcar();
        bloco = null;
        verificarVazio();
      }

      function rolarPerto(y) {
        if (y < 40) window.scrollBy(0, -14);
        else if (y > window.innerHeight - 40) window.scrollBy(0, 14);
      }

      function selecionar(el, silencioso, inicial) {
        selEl = el;
        poe("sel", el ? caixaDe(el) : null, el ? rotulo(el) : "");
        if (silencioso || !el) return;
        var caminho = [], atual = el;
        while (atual && atual !== document.documentElement) {
          if (atual === document.body || atual.hasAttribute("data-pn")) caminho.unshift({ pn: pn(atual), rotulo: atual.tagName.toLowerCase() + (atual.classList.length ? "." + atual.classList[0] : "") });
          if (atual === document.body) break;
          atual = atual.parentElement;
        }
        send({ tipo: "selecionar", pn: pn(el), rotulo: rotulo(el), caminho: caminho, corpo: el === document.body, inicial: !!inicial });
      }

      function realcarVarios(els) {
        multis.forEach(function (d) { d.parentNode.removeChild(d); });
        multis = [];
        els.slice(0, 60).forEach(function (el) {
          var d = document.createElement("div");
          d.className = "b multi";
          d.appendChild(document.createElement("span"));
          raiz.appendChild(d);
          var r = caixaDe(el);
          d.style.display = "block";
          d.style.left = r.left + "px"; d.style.top = r.top + "px";
          d.style.width = r.width + "px"; d.style.height = r.height + "px";
          multis.push(d);
        });
      }

      function verificarVazio() {
        var tem = Array.prototype.some.call(document.body.children, function (k) {
          return k.tagName !== "SCRIPT" && k.tagName !== "STYLE" && k.tagName !== "PRATICA-CAMADA" && k.getClientRects().length > 0;
        });
        caixas.vazio.style.display = tem || bloco ? "none" : "grid";
      }

      function redesenhar() {
        if (selEl) poe("sel", caixaDe(selEl), rotulo(selEl));
        if (hoverEl) poe("hover", caixaDe(hoverEl), rotulo(hoverEl));
        if (previas.length) poe("prev", uniao(previas), caixas.prev.firstChild.textContent);
        if (alvo && alvo.el) poe("alvo", caixaDe(alvo.el), caixas.alvo.firstChild.textContent);
      }

      function bloquear(e) { e.preventDefault(); e.stopPropagation(); }

      document.addEventListener("click", bloquear, true);
      document.addEventListener("dblclick", bloquear, true);
      document.addEventListener("submit", bloquear, true);
      document.addEventListener("dragstart", bloquear, true);
      document.addEventListener("mousedown", function (e) { e.preventDefault(); }, true);

      document.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        toque = { el: no(e.target), x: e.clientX, y: e.clientY };
        try { document.documentElement.setPointerCapture(e.pointerId); } catch (erro) { toque.semCaptura = true; }
      }, true);

      document.addEventListener("pointermove", function (e) {
        if (toque && !movendo && toque.el && toque.el !== document.body && Math.abs(e.clientX - toque.x) + Math.abs(e.clientY - toque.y) > 7) {
          movendo = toque.el;
          bloco = { tipo: "elemento", tag: movendo.tagName.toLowerCase(), emLinha: !!LINHA[movendo.tagName.toLowerCase()] };
          movendo.setAttribute("data-pr-original", movendo.getAttribute("style") || "");
          movendo.style.setProperty("opacity", "0.35", "important");
          some("hover"); hoverEl = null;
          marcarValidos();
          send({ tipo: "mover-inicio", rotulo: rotulo(movendo) });
        }
        if (movendo) {
          rolarPerto(e.clientY);
          mostrar(calcular(e.clientX, e.clientY));
          send({ tipo: "mover-status", ok: alvo && alvo.ok, rotulo: alvo ? alvo.rotulo : "", motivo: alvo && alvo.motivo || "" });
          return;
        }
        if (!bloco) {
          var el = no(e.target);
          hoverEl = el === document.body ? null : el;
          poe("hover", hoverEl ? caixaDe(hoverEl) : null, hoverEl ? rotulo(hoverEl) + "  " + Math.round(hoverEl.offsetWidth || 0) + "×" + Math.round(hoverEl.offsetHeight || 0) : "");
        }
      }, true);

      document.addEventListener("pointerup", function () {
        if (movendo) {
          var original = movendo.getAttribute("data-pr-original");
          if (original) movendo.setAttribute("style", original); else movendo.removeAttribute("style");
          movendo.removeAttribute("data-pr-original");
          var a = alvo, origem = pn(movendo);
          movendo = null;
          encerrar();
          if (a && a.ok) send({ tipo: "mover", pn: origem, pai: a.pai, antes: a.antes, rotulo: a.rotulo });
          else send({ tipo: "mover-cancelado", motivo: a && a.motivo || "" });
        } else if (toque) {
          selecionar(toque.el);
        }
        toque = null;
      }, true);

      document.documentElement.addEventListener("mouseleave", function () { some("hover"); hoverEl = null; });
      document.addEventListener("keydown", function (e) {
        if ((e.key === "Delete" || e.key === "Backspace") && selEl && selEl !== document.body) {
          e.preventDefault();
          send({ tipo: "remover-selecionado" });
        } else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
          e.preventDefault();
          send({ tipo: "desfazer" });
        }
      }, true);
      window.addEventListener("scroll", function () { window.requestAnimationFrame(redesenhar); }, { passive: true });
      window.addEventListener("resize", function () { window.requestAnimationFrame(redesenhar); });

      window.addEventListener("message", function (e) {
        var d = e.data;
        if (!d || d.__pratica !== true || d.id !== cfg.id) return;
        if (d.tipo === "dnd-inicio") {
          bloco = d.bloco; alvo = null;
          some("hover"); hoverEl = null;
          caixas.vazio.style.display = "none";
          marcarValidos();
        } else if (d.tipo === "dnd-sobre" && bloco) {
          rolarPerto(d.y);
          var a = calcular(d.x, d.y);
          mostrar(a);
          responder(a, d.seq);
        } else if (d.tipo === "dnd-sair") {
          limpar();
        } else if (d.tipo === "dnd-fim") {
          encerrar();
          realcarVarios([]);
        } else if (d.tipo === "selecionar") {
          var alvoSel = d.pn == null ? null : document.querySelector("[data-pn=\"" + d.pn + "\"]");
          selecionar(alvoSel, true);
        } else if (d.tipo === "realcar") {
          var els = [];
          try {
            if (d.seletor) els = Array.prototype.slice.call(document.querySelectorAll(d.seletor));
            else if (d.pn != null) els = [document.querySelector("[data-pn=\"" + d.pn + "\"]")].filter(Boolean);
          } catch (erro) { els = []; }
          realcarVarios(els);
        } else if (d.tipo === "alvo-para") {
          bloco = d.bloco;
          var base = d.pn == null ? document.body : document.querySelector("[data-pn=\"" + d.pn + "\"]") || document.body;
          var achado = containerPara(base, bloco), r;
          if (!achado.c) {
            r = { ok: false, motivo: achado.motivo, el: base };
          } else {
            var antes = null;
            if (achado.c !== base) {
              var filho = base;
              while (filho && filho.parentElement !== achado.c) filho = filho.parentElement;
              antes = filho ? filho.nextElementSibling : null;
              while (antes && !antes.hasAttribute("data-pn")) antes = antes.nextElementSibling;
            }
            r = { ok: true, el: achado.c, elAntes: antes, pai: pn(achado.c), antes: antes ? pn(antes) : null, rotulo: rotulo(achado.c) };
          }
          responder(r, null, { req: d.req });
          bloco = null;
        } else if (d.tipo === "info-para") {
          var elInfo = d.pn == null ? document.body : document.querySelector("[data-pn=\"" + d.pn + "\"]") || document.body;
          send({ tipo: "info-resposta", req: d.req, alvo: pn(elInfo), rotulo: rotulo(elInfo), info: infoDe(elInfo), ponto: null });
        }
      });

      document.addEventListener("DOMContentLoaded", function () {
        camada();
        verificarVazio();
        if (cfg.selecionado != null) {
          var s = document.querySelector("[data-pn=\"" + cfg.selecionado + "\"]");
          if (s) selecionar(s, false, true);
        }
        if (cfg.destacar != null) {
          var n = document.querySelector("[data-pn=\"" + cfg.destacar + "\"]");
          if (n) {
            var r = n.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) n.scrollIntoView({ block: "center" });
            window.requestAnimationFrame(function () {
              poe("novo", caixaDe(n), cfg.textoDestaque || "novo");
              var rotuloSel = caixas.sel.firstChild;
              if (selEl === n) rotuloSel.style.visibility = "hidden";
              setTimeout(function () { some("novo"); rotuloSel.style.visibility = ""; }, 1900);
              if (selEl) poe("sel", caixaDe(selEl), rotulo(selEl));
            });
          }
        }
      });
    }

    const TELA_FONTE = "(" + telaHelper.toString().replace(/\s*\n\s*/g, " ") + ")";

    /* ----------------------------------------------------------------------
       07. INTERFACE: PALETA, FERRAMENTAS, BALÃO E DICAS
       ---------------------------------------------------------------------- */
    let ui = null;
    const dnd = {
      ativo: false,
      ex: null,
      blocos: new Map(),
      telas: new Map(),
      selecionado: null,
      caminho: [],
      destacar: null,
      textoDestaque: "",
      historico: [],
      passos: [],
      arraste: null,
      fila: Promise.resolve(),
      pular: false,
      marcaSelecao: null,
      pedidos: new Map(),
      pedidoSeq: 0,
      balaoTimer: 0,
    };

    function construir(refs) {
      ui = refs;

      const paleta = document.createElement("div");
      paleta.className = "dnd-paleta";
      paleta.innerHTML =
        '<div class="dnd-paleta-topo">' +
          '<h3 class="practice-sidebar-title">Blocos</h3>' +
          '<label class="dnd-busca"><span class="visually-hidden">Buscar bloco</span>' +
            '<input type="search" placeholder="Buscar bloco…" autocomplete="off" data-dnd-busca></label>' +
          '<p class="dnd-paleta-dica">Arraste para a tela ou clique para adicionar.</p>' +
        "</div>" +
        '<div class="dnd-secoes" data-dnd-secoes></div>' +
        '<section class="dnd-rodape" aria-label="Passos realizados">' +
          '<div class="dnd-rodape-topo"><h3 class="practice-sidebar-title">Passos <span data-dnd-qtd></span></h3>' +
            '<button type="button" class="dnd-mini" data-dnd="limpar" title="Esvaziar o <body> para montar do zero">Limpar tela</button></div>' +
          '<ol class="dnd-passos" data-dnd-passos></ol>' +
        "</section>";
      ui.palette.appendChild(paleta);
      ui.dndSecoes = paleta.querySelector("[data-dnd-secoes]");
      ui.dndPassos = paleta.querySelector("[data-dnd-passos]");
      ui.dndQtd = paleta.querySelector("[data-dnd-qtd]");
      paleta.querySelector("[data-dnd-busca]").addEventListener("input", (e) => filtrar(e.target.value));

      const ferramentas = document.createElement("div");
      ferramentas.className = "dnd-ferramentas";
      ferramentas.innerHTML =
        '<nav class="dnd-caminho" aria-label="Elemento selecionado" data-dnd-caminho>' +
          '<span class="dnd-caminho-dica">Clique num elemento para selecionar · arraste para mover</span></nav>' +
        '<button type="button" class="practice-tool" data-dnd="remover" title="Remover o elemento selecionado (Delete)" hidden>' +
          api.icon("trash") + "<span>Remover</span></button>" +
        '<button type="button" class="practice-tool" data-dnd="desfazer" title="Desfazer a última ação" disabled>' +
          api.icon("undo") + "<span>Desfazer</span></button>";
      ui.previewHead.insertBefore(ferramentas, ui.size);
      ui.dndCaminho = ferramentas.querySelector("[data-dnd-caminho]");
      ui.dndRemover = ferramentas.querySelector('[data-dnd="remover"]');
      ui.dndDesfazer = ferramentas.querySelector('[data-dnd="desfazer"]');

      const balao = document.createElement("div");
      balao.className = "dnd-balao";
      balao.setAttribute("role", "status");
      balao.setAttribute("aria-live", "polite");
      ui.previewPane.appendChild(balao);
      ui.dndBalao = balao;
      balao.addEventListener("mouseenter", () => window.clearTimeout(dnd.balaoTimer));
      balao.addEventListener("mouseleave", () => agendarFimDoBalao(2500));

      const dica = document.createElement("div");
      dica.className = "dnd-dica";
      dica.hidden = true;
      dica.innerHTML =
        '<div class="dnd-dica-cartao" role="dialog" aria-label="Como usar o arrastar e soltar">' +
          '<p class="dnd-dica-titulo">Monte a página arrastando blocos</p>' +
          '<ol class="dnd-dica-passos">' +
            '<li><b>1</b><span>Escolha um bloco na paleta à esquerda. Cada cartão mostra o que ele coloca.</span></li>' +
            '<li><b>2</b><span>Arraste até a tela: ele aparece no lugar exato antes de você soltar.</span></li>' +
            '<li><b>3</b><span>Solte e veja o código sendo escrito no editor, com a explicação.</span></li>' +
          "</ol>" +
          '<div class="dnd-dica-anim" aria-hidden="true"><span class="dnd-dica-bloco">&lt;li&gt;</span></div>' +
          '<button type="button" class="dnd-dica-ok" data-dnd="dica-ok">Entendi, vamos lá</button>' +
        "</div>";
      ui.previewPane.appendChild(dica);
      ui.dndDica = dica;

      ui.root.addEventListener("click", (e) => {
        const alvo = e.target.closest("[data-dnd]");
        if (!alvo || !ui.root.contains(alvo)) return;
        const acao = alvo.dataset.dnd;
        if (acao === "remover") removerSelecionado();
        else if (acao === "desfazer") desfazer();
        else if (acao === "limpar") limparTela();
        else if (acao === "dica-ok") fecharDica();
        else if (acao === "balao-fechar") esconderBalao();
        else if (acao === "caminho") selecionarPn(alvo.dataset.pn === "" ? null : Number(alvo.dataset.pn), true);
      });
    }

    function filtrar(termo) {
      const t = termo.trim().toLowerCase();
      ui.dndSecoes.querySelectorAll(".dnd-card").forEach((card) => {
        card.hidden = Boolean(t) && card.textContent.toLowerCase().indexOf(t) < 0;
      });
      ui.dndSecoes.querySelectorAll(".dnd-secao").forEach((secao) => {
        secao.hidden = !secao.querySelector(".dnd-card:not([hidden])");
      });
    }

    function etiquetaDo(bloco) {
      if (bloco.tipo === "estilo") return bloco.midia ? "@media" : bloco.sufixo || "CSS";
      return rotuloTag(bloco.tag);
    }

    function codigoDoBloco(bloco) {
      return bloco.tipo === "estilo" ? realcarCss(codigoDoEstilo(bloco, "")) : realcarHtml(bloco.html);
    }

    function criarCartao(bloco) {
      const card = document.createElement("div");
      card.className = "dnd-card dnd-card-" + bloco.tipo + " dnd-card-" + bloco.origem;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        (bloco.tipo === "estilo" ? "Estilo " : "Bloco ") + bloco.nome + ". Arraste até a tela ou pressione Enter para adicionar."
      );
      card.innerHTML =
        '<div class="dnd-card-previa"></div>' +
        '<div class="dnd-card-cabeca"><span class="dnd-card-nome">' + esc(bloco.nome) + "</span>" +
          '<span class="dnd-card-tag">' + esc(etiquetaDo(bloco)) + "</span></div>" +
        (bloco.info ? '<p class="dnd-card-info">' + esc(bloco.info) + "</p>" : "") +
        '<pre class="dnd-card-codigo cm-s-pratica"><code>' + codigoDoBloco(bloco) + "</code></pre>" +
        '<span class="dnd-card-alca" aria-hidden="true">⠿</span>';
      renderizarPrevia(card.querySelector(".dnd-card-previa"), bloco);
      ligarArraste(card, bloco);
      return card;
    }

    function montarPaleta(ex) {
      dnd.blocos.clear();
      ui.dndSecoes.textContent = "";
      secoesDaPaleta(ex).forEach((secao) => {
        const el = document.createElement("details");
        el.className = "dnd-secao";
        el.open = true;
        el.innerHTML =
          '<summary><span class="dnd-secao-titulo">' + esc(secao.titulo) + "</span>" +
          '<span class="dnd-secao-qtd">' + secao.blocos.length + "</span></summary>" +
          '<p class="dnd-secao-dica">' + esc(secao.dica) + "</p>";
        const grade = document.createElement("div");
        grade.className = "dnd-cartoes";
        secao.blocos.forEach((bloco) => {
          dnd.blocos.set(bloco.uid, bloco);
          grade.appendChild(criarCartao(bloco));
        });
        el.appendChild(grade);
        ui.dndSecoes.appendChild(el);
      });
      const busca = ui.palette.querySelector("[data-dnd-busca]");
      if (busca) busca.value = "";
    }

    function agendarFimDoBalao(ms) {
      window.clearTimeout(dnd.balaoTimer);
      dnd.balaoTimer = window.setTimeout(esconderBalao, ms);
    }

    function esconderBalao() {
      ui.dndBalao.classList.remove("is-visible");
    }

    // Balão explicativo: o que foi feito, o porquê e o código inserido.
    function mostrarBalao(m) {
      if (!m) return;
      const arquivos = (m.arquivos || [])
        .map((a) => '<span class="dnd-balao-arquivo dnd-balao-' + (a.arquivo.endsWith(".css") ? "css" : "html") + '">' + esc(a.arquivo) + " · " + esc(a.texto) + "</span>")
        .join("");
      ui.dndBalao.className = "dnd-balao dnd-balao-" + (m.tipo || "ok");
      ui.dndBalao.innerHTML =
        '<span class="dnd-balao-icone" aria-hidden="true">' + (m.tipo === "erro" ? "!" : m.tipo === "remover" ? "−" : "✓") + "</span>" +
        '<div class="dnd-balao-corpo">' +
          '<p class="dnd-balao-titulo">' + m.titulo + "</p>" +
          (m.texto ? '<p class="dnd-balao-texto">' + m.texto + "</p>" : "") +
          (m.codigo ? '<pre class="dnd-balao-codigo cm-s-pratica"><code>' + m.codigo + "</code></pre>" : "") +
          (arquivos ? '<p class="dnd-balao-arquivos">' + arquivos + "</p>" : "") +
        "</div>" +
        '<button type="button" class="dnd-balao-fechar" data-dnd="balao-fechar" aria-label="Fechar explicação">×</button>';
      void ui.dndBalao.offsetWidth;
      ui.dndBalao.classList.add("is-visible");
      agendarFimDoBalao(m.tipo === "erro" ? 5000 : 8000);
    }

    function mostrarDica() {
      if (api.prefs.dicaMontar) return;
      ui.dndDica.hidden = false;
    }

    function fecharDica() {
      ui.dndDica.hidden = true;
      api.prefs.dicaMontar = true;
      api.savePrefs();
    }

    /* ----------------------------------------------------------------------
       08. ARRASTAR DA PALETA ATÉ A TELA
       ---------------------------------------------------------------------- */
    function tela() {
      const frame = api.preview.active;
      return frame && frame.dataset.ready && frame.contentWindow ? frame : null;
    }

    function enviar(msg) {
      const frame = tela();
      if (!frame) return false;
      msg.__pratica = true;
      msg.id = frame.dataset.render;
      frame.contentWindow.postMessage(msg, "*");
      return true;
    }

    function pedir(msg, tipoResposta) {
      return new Promise((resolve) => {
        const req = "q" + (dnd.pedidoSeq += 1);
        dnd.pedidos.set(req, { resolve: resolve, tipo: tipoResposta });
        msg.req = req;
        if (!enviar(msg)) {
          dnd.pedidos.delete(req);
          resolve(null);
          return;
        }
        window.setTimeout(() => {
          if (dnd.pedidos.has(req)) {
            dnd.pedidos.delete(req);
            resolve(null);
          }
        }, 1500);
      });
    }

    function blocoParaTela(bloco) {
      return {
        tipo: bloco.tipo,
        tag: bloco.tag || "",
        emLinha: Boolean(bloco.emLinha),
        html: bloco.html || "",
        css: bloco.css || [],
        sufixo: bloco.sufixo || "",
        midia: bloco.midia || "",
      };
    }

    function ligarArraste(card, bloco) {
      card.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || !dnd.ativo) return;
        const inicio = { x: e.clientX, y: e.clientY };
        let arrastando = false;
        try {
          card.setPointerCapture(e.pointerId);
        } catch (erro) {
          /* Sem captura: o arraste continua pelos eventos do cartão. */
        }

        const mover = (ev) => {
          if (!arrastando) {
            if (Math.abs(ev.clientX - inicio.x) + Math.abs(ev.clientY - inicio.y) < 7) return;
            arrastando = true;
            card.dataset.arrastou = "1";
            comecarArraste(bloco, card, ev);
          }
          moverArraste(ev);
        };
        const desligar = () => {
          card.removeEventListener("pointermove", mover);
          card.removeEventListener("pointerup", soltar);
          card.removeEventListener("pointercancel", cancelar);
        };
        const soltar = (ev) => {
          desligar();
          if (arrastando) soltarArraste(ev);
        };
        const cancelar = () => {
          desligar();
          if (arrastando) cancelarArraste();
        };
        card.addEventListener("pointermove", mover);
        card.addEventListener("pointerup", soltar);
        card.addEventListener("pointercancel", cancelar);
      });

      card.addEventListener("click", () => {
        if (card.dataset.arrastou) {
          delete card.dataset.arrastou;
          return;
        }
        inserirPorClique(bloco, card);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inserirPorClique(bloco, card);
        }
      });
    }

    function comecarArraste(bloco, card, ev) {
      if (api.isMobile() && ui.root.dataset.view !== "preview") api.setView("preview");
      const fantasma = document.createElement("div");
      fantasma.className = "dnd-fantasma dnd-fantasma-" + bloco.tipo;
      fantasma.innerHTML =
        '<span class="dnd-fantasma-tag">' + esc(etiquetaDo(bloco)) + "</span>" +
        '<strong class="dnd-fantasma-nome">' + esc(bloco.nome) + "</strong>" +
        '<span class="dnd-fantasma-status">Arraste até a tela</span>';
      ui.root.appendChild(fantasma);
      card.classList.add("is-origem");
      ui.root.classList.add("is-dragging");
      dnd.arraste = { bloco: bloco, card: card, fantasma: fantasma, seq: 0, resposta: 0, dentro: false, alvo: null, x: 0, y: 0, quadro: 0 };
      esconderBalao();
      enviar({ tipo: "dnd-inicio", bloco: blocoParaTela(bloco) });
      posicionarFantasma(ev.clientX, ev.clientY);
    }

    function posicionarFantasma(x, y) {
      const a = dnd.arraste;
      if (!a) return;
      a.fantasma.style.transform = "translate(" + (x + 14) + "px, " + (y + 14) + "px) rotate(-2deg)";
    }

    function moverArraste(ev) {
      const a = dnd.arraste;
      if (!a) return;
      posicionarFantasma(ev.clientX, ev.clientY);
      const area = ui.frames.getBoundingClientRect();
      const x = ev.clientX - area.left;
      const y = ev.clientY - area.top;
      const dentro = x >= 0 && y >= 0 && x <= area.width && y <= area.height;
      if (!dentro) {
        if (a.dentro) enviar({ tipo: "dnd-sair" });
        a.dentro = false;
        a.alvo = null;
        atualizarStatus(null);
        return;
      }
      a.dentro = true;
      a.x = x;
      a.y = y;
      if (a.quadro) return;
      a.quadro = window.setTimeout(() => {
        a.quadro = 0;
        if (dnd.arraste !== a || !a.dentro) return;
        a.seq += 1;
        enviar({ tipo: "dnd-sobre", x: a.x, y: a.y, seq: a.seq });
      }, 16);
    }

    function atualizarStatus(resposta) {
      const a = dnd.arraste;
      if (!a) return;
      const status = a.fantasma.querySelector(".dnd-fantasma-status");
      a.fantasma.classList.toggle("is-ok", Boolean(resposta && resposta.ok));
      a.fantasma.classList.toggle("is-erro", Boolean(resposta && !resposta.ok));
      if (!resposta) status.textContent = "Arraste até a tela";
      else if (!resposta.ok) status.textContent = "✗ " + resposta.motivo;
      else if (a.bloco.tipo === "estilo") status.textContent = "Soltar para estilizar " + resposta.rotulo;
      else status.textContent = "Soltar dentro de " + resposta.rotulo + (resposta.aviso ? " · " + resposta.aviso : "");
    }

    function removerFantasma(destino) {
      const a = dnd.arraste;
      if (!a) return;
      const f = a.fantasma;
      f.classList.add("is-saindo");
      if (destino) {
        f.style.transform = "translate(" + destino.x + "px, " + destino.y + "px) scale(0.35)";
      }
      f.style.opacity = "0";
      window.setTimeout(() => f.remove(), 280);
      a.card.classList.remove("is-origem");
      ui.root.classList.remove("is-dragging");
      if (a.quadro) window.clearTimeout(a.quadro);
    }

    function cancelarArraste() {
      const a = dnd.arraste;
      if (!a) return;
      const r = a.card.getBoundingClientRect();
      removerFantasma({ x: r.left + 10, y: r.top + 10 });
      enviar({ tipo: "dnd-fim" });
      dnd.arraste = null;
    }

    async function soltarArraste(ev) {
      const a = dnd.arraste;
      if (!a) return;
      // Soltou rápido? Pergunta à tela onde o bloco entra e espera a resposta.
      if (a.dentro && (a.quadro || a.resposta < a.seq || !a.alvo)) {
        if (a.quadro) window.clearTimeout(a.quadro);
        a.quadro = 0;
        a.seq += 1;
        enviar({ tipo: "dnd-sobre", x: a.x, y: a.y, seq: a.seq });
        const limite = Date.now() + 300;
        while (a.resposta < a.seq && Date.now() < limite) await espera(20);
      }
      const alvo = a.dentro ? a.alvo : null;
      if (!alvo || !alvo.ok) {
        if (alvo && !alvo.ok) mostrarBalao({ tipo: "erro", titulo: "Não dá para soltar aí", texto: esc(alvo.motivo) });
        cancelarArraste();
        return;
      }
      const area = ui.frames.getBoundingClientRect();
      const destino = alvo.ponto ? { x: area.left + alvo.ponto.x - 30, y: area.top + alvo.ponto.y - 12 } : { x: ev.clientX, y: ev.clientY };
      removerFantasma(destino);
      dnd.arraste = null;

      if (a.bloco.tipo === "elemento") {
        enviar({ tipo: "dnd-fim" });
        executarElemento(a.bloco, alvo);
        return;
      }
      const escolha = await escolherEscopo(a.bloco, alvo, { x: ev.clientX, y: ev.clientY });
      enviar({ tipo: "dnd-fim" });
      if (escolha) executarEstilo(a.bloco, alvo, escolha);
    }

    async function inserirPorClique(bloco, card) {
      if (!dnd.ativo) return;
      if (bloco.tipo === "elemento") {
        const resposta = await pedir({ tipo: "alvo-para", pn: dnd.selecionado, bloco: blocoParaTela(bloco) }, "dnd-alvo");
        if (!resposta) return;
        if (!resposta.ok) {
          mostrarBalao({ tipo: "erro", titulo: "Não dá para adicionar aí", texto: esc(resposta.motivo) + " Selecione outro elemento na tela." });
          return;
        }
        executarElemento(bloco, resposta);
        return;
      }
      if (dnd.selecionado == null) {
        mostrarBalao({
          tipo: "erro",
          titulo: "Escolha um elemento primeiro",
          texto: "Clique em um elemento da tela para selecioná-lo e depois neste estilo, ou arraste o estilo até o elemento.",
        });
        return;
      }
      const resposta = await pedir({ tipo: "info-para", pn: dnd.selecionado }, "info-resposta");
      if (!resposta) return;
      const r = card.getBoundingClientRect();
      const escolha = await escolherEscopo(bloco, resposta, { x: r.right + 8, y: r.top });
      if (escolha) executarEstilo(bloco, resposta, escolha);
    }

    /* Onde aplicar o estilo: só neste elemento, numa classe ou numa tag */
    function novaClasse(info, src) {
      const existentes = todasAsClasses(src);
      const base = (info.classes[0] && info.classes[0].nome) || NOME_CLASSE[info.tag] || info.tag;
      let n = info.classes[0] ? 2 : 1;
      while (existentes.has(base + "-" + n)) n += 1;
      return base + "-" + n;
    }

    function opcoesDeEscopo(info, src) {
      if (info.tag === "body" || info.tag === "html") {
        return [{ seletor: info.tag, titulo: "A página inteira", detalhe: "regra para o <" + info.tag + ">" }];
      }
      const opcoes = [];
      const unica = info.classes.find((c) => c.qtd === 1);
      if (unica) {
        opcoes.push({ seletor: "." + unica.nome, titulo: "Só este elemento", detalhe: "pela classe ." + unica.nome + ", que só ele tem" });
      } else if (info.id) {
        opcoes.push({ seletor: "#" + info.id, titulo: "Só este elemento", detalhe: "pelo id #" + info.id });
      } else {
        const nova = novaClasse(info, src);
        opcoes.push({ seletor: "." + nova, novaClasse: nova, titulo: "Só este elemento", detalhe: "cria a classe ." + nova + " no HTML" });
      }
      info.classes
        .filter((c) => c.qtd > 1)
        .slice(0, 2)
        .forEach((c) => opcoes.push({ seletor: "." + c.nome, titulo: "Todos com a classe ." + c.nome, detalhe: c.qtd + " elementos" }));
      if (info.qtdTag > 1) {
        opcoes.push({ seletor: info.tag, titulo: "Todas as tags <" + info.tag + ">", detalhe: info.qtdTag + " elementos" });
      }
      return opcoes;
    }

    function escolherEscopo(bloco, alvo, ponto) {
      const opcoes = opcoesDeEscopo(alvo.info, api.state.files["index.html"]);
      if (opcoes.length === 1) return Promise.resolve(opcoes[0]);

      return new Promise((resolve) => {
        const caixa = document.createElement("div");
        caixa.className = "dnd-escopo";
        caixa.setAttribute("role", "dialog");
        caixa.setAttribute("aria-label", "Onde aplicar o estilo");
        caixa.innerHTML =
          '<p class="dnd-escopo-titulo">Aplicar <code>' + esc(bloco.css.map((d) => d[0] + ": " + d[1]).join("; ")) + "</code> em…</p>" +
          opcoes
            .map(
              (o, i) =>
                '<button type="button" class="dnd-escopo-opcao" data-i="' + i + '">' +
                '<code>' + esc(o.seletor + bloco.sufixo) + "</code>" +
                "<span>" + esc(o.titulo) + "</span><small>" + esc(o.detalhe) + "</small></button>"
            )
            .join("") +
          '<p class="dnd-escopo-nota">O seletor escolhido define quantos elementos mudam: passe o mouse para ver na tela.</p>' +
          '<button type="button" class="dnd-escopo-cancelar" data-i="-1">Cancelar</button>';
        ui.root.appendChild(caixa);
        const larg = caixa.offsetWidth;
        const alt = caixa.offsetHeight;
        caixa.style.left = Math.max(8, Math.min(ponto.x + 10, window.innerWidth - larg - 8)) + "px";
        caixa.style.top = Math.max(8, Math.min(ponto.y - 20, window.innerHeight - alt - 8)) + "px";

        const realcar = (o) => {
          if (!o) enviar({ tipo: "realcar", seletor: null, pn: null });
          else if (o.novaClasse) enviar({ tipo: "realcar", pn: alvo.alvo });
          else enviar({ tipo: "realcar", seletor: o.seletor });
        };
        const terminar = (valor) => {
          realcar(null);
          document.removeEventListener("keydown", teclas, true);
          document.removeEventListener("pointerdown", fora, true);
          caixa.classList.add("is-saindo");
          window.setTimeout(() => caixa.remove(), 160);
          resolve(valor);
        };
        const teclas = (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            terminar(null);
          }
        };
        const fora = (e) => {
          if (!caixa.contains(e.target)) terminar(null);
        };
        caixa.addEventListener("click", (e) => {
          const botao = e.target.closest("[data-i]");
          if (!botao) return;
          const i = Number(botao.dataset.i);
          terminar(i >= 0 ? opcoes[i] : null);
        });
        caixa.querySelectorAll(".dnd-escopo-opcao").forEach((botao) => {
          const o = opcoes[Number(botao.dataset.i)];
          botao.addEventListener("pointerenter", () => realcar(o));
          botao.addEventListener("focus", () => realcar(o));
        });
        document.addEventListener("keydown", teclas, true);
        window.setTimeout(() => document.addEventListener("pointerdown", fora, true), 0);
        realcar(opcoes[0]);
        caixa.querySelector(".dnd-escopo-opcao").focus({ preventScroll: true });
      });
    }

    /* ----------------------------------------------------------------------
       09. EXECUTAR AÇÕES E ANIMAR O EDITOR
       ---------------------------------------------------------------------- */
    // Garante que a tela que respondeu ainda mostra o código atual.
    function arvoreDaTela(telaId) {
      const html = api.state.files["index.html"];
      const daTela = dnd.telas.get(telaId);
      if (daTela != null && daTela !== html) {
        mostrarBalao({ tipo: "erro", titulo: "A tela estava se atualizando", texto: "Tente de novo em um instante." });
        api.renderPreview(true);
        return null;
      }
      return lerHtml(html);
    }

    function noPorPn(arvore, pn) {
      if (pn == null) return arvore.corpo;
      return arvore.nos[Number(pn)] || null;
    }

    function noNaPosicao(arvore, inicio) {
      return arvore.nos.find((n) => n.inicio === inicio) || null;
    }

    function rotuloDoNo(src, no) {
      if (!no) return "&lt;body&gt;";
      const classes = classesDoNo(src, no);
      return "<code>&lt;" + esc(no.tag) + (classes.length ? ' class="' + esc(classes.join(" ")) + '"' : "") + "&gt;</code>";
    }

    function executarElemento(bloco, alvo) {
      const arvore = arvoreDaTela(alvo.id);
      if (!arvore) return;
      const src = arvore.src;
      const pai = noPorPn(arvore, alvo.pai);
      const antes = alvo.antes == null ? null : noPorPn(arvore, alvo.antes);
      const trecho = idsUnicos(bloco.html, src);
      const edicao = calcularInsercao(arvore, pai, antes, trecho, bloco.emLinha);
      const html = aplicarEdicao(src, edicao);
      const novaArvore = lerHtml(html);
      const novo = noNaPosicao(novaArvore, edicao.inicio + edicao.deslocamento);
      const paiNovo = pai ? noNaPosicao(novaArvore, pai.inicio) : novaArvore.corpo;
      const linhas = contarLinhas(edicao.texto.replace(/^\n|\n$/g, ""));

      aplicar({
        html: html,
        css: api.state.files["style.css"],
        edicoes: [{ arquivo: "index.html", edicao: edicao }],
        destacar: novo ? novo.pn : paiNovo ? paiNovo.pn : null,
        textoDestaque: "novo " + (bloco.tag === "#texto" ? "texto" : "<" + bloco.tag + ">"),
        selecionar: novo ? novo.pn : null,
        passo: realcarHtml(bloco.tag === "#texto" ? bloco.html : "<" + bloco.tag + ">") + " em " + rotuloDoNo(src, pai).replace(/<\/?code>/g, ""),
        balao: {
          titulo: (bloco.tag === "#texto" ? "Texto " + "<code>" + esc(bloco.html) + "</code>" : "<code>" + esc(rotuloTag(bloco.tag)) + "</code>") +
            " adicionado dentro de " + rotuloDoNo(src, pai),
          texto: esc(bloco.info || ""),
          codigo: realcarHtml(recuar(trecho, "")),
          arquivos: [{ arquivo: "index.html", texto: "+" + linhas + (linhas === 1 ? " linha" : " linhas") }],
        },
      });
    }

    function notasDeRequisito(bloco, info) {
      const props = bloco.css.map((d) => d[0]);
      const temDisplay = props.indexOf("display") >= 0;
      const extras = [];
      const notas = [];
      const ehFlexOuGrid = /flex|grid/.test(info.display || "");
      if (!temDisplay && !ehFlexOuGrid && props.some((p) => PROPS_GRID.has(p))) {
        extras.push(["display", "grid"]);
        notas.push("Essa propriedade só funciona em grid, então <code>display: grid</code> foi adicionado junto.");
      } else if (!temDisplay && !ehFlexOuGrid && props.some((p) => PROPS_FLEX.has(p))) {
        extras.push(["display", "flex"]);
        notas.push("Essa propriedade só funciona em contêiner flex, então <code>display: flex</code> foi adicionado junto.");
      }
      if (props.some((p) => PROPS_ITEM.has(p)) && !/flex|grid/.test(info.displayPai || "")) {
        notas.push("Atenção: o pai deste elemento não é flex. Arraste “Virar flex” até o pai para ver o efeito.");
      }
      if (bloco.css.some((d) => d[0] === "position" && d[1] === "absolute")) {
        notas.push("Com <code>position: absolute</code>, o elemento se posiciona em relação ao ancestral com <code>position: relative</code>.");
      }
      if (/^:(hover|active)/.test(bloco.sufixo)) notas.push("Passe o mouse sobre o elemento na tela para ver o efeito.");
      if (/^:focus/.test(bloco.sufixo)) notas.push("Use a tecla Tab no resultado (botão ↗) para ver o foco.");
      if (bloco.midia) notas.push("Para ver a diferença, arraste a divisória e mude a largura da tela.");
      return { extras: extras, notas: notas };
    }

    function executarEstilo(bloco, alvo, escolha) {
      const arvore = arvoreDaTela(alvo.id);
      if (!arvore) return;
      const src = arvore.src;
      const edicoes = [];
      let html = src;
      const noAlvo = noPorPn(arvore, alvo.alvo);

      if (escolha.novaClasse && noAlvo) {
        const e = adicionarClasse(src, noAlvo, escolha.novaClasse);
        html = aplicarEdicao(src, e);
        edicoes.push({ arquivo: "index.html", edicao: e });
      }
      const requisitos = notasDeRequisito(bloco, alvo.info || {});
      const decls = requisitos.extras.concat(bloco.css);
      const seletor = escolha.seletor + bloco.sufixo;
      const regra = aplicarRegra(api.state.files["style.css"], seletor, decls, bloco.midia);
      regra.edicoes.forEach((e) => edicoes.push({ arquivo: "style.css", edicao: e }));

      const novaArvore = lerHtml(html);
      const alvoNovo = noAlvo ? noNaPosicao(novaArvore, noAlvo.inicio) : novaArvore.corpo;
      const codigoRegra = codigoDoEstilo({ css: decls, sufixo: bloco.sufixo, midia: bloco.midia }, escolha.seletor);

      aplicar({
        html: html,
        css: regra.css,
        edicoes: edicoes,
        destacar: alvoNovo ? alvoNovo.pn : null,
        textoDestaque: bloco.sufixo ? "estilo em " + bloco.sufixo : "estilo aplicado",
        selecionar: alvoNovo ? alvoNovo.pn : null,
        passo: '<span class="cm-property">' + esc(bloco.css[0][0]) + "</span> em <code>" + esc(seletor) + "</code>",
        balao: {
          titulo: "<code>" + esc(bloco.nome) + "</code> aplicado em <code>" + esc(seletor) + "</code>",
          texto: [esc(bloco.info || "")].concat(requisitos.notas).filter(Boolean).join(" "),
          codigo: realcarCss(codigoRegra),
          arquivos: [
            escolha.novaClasse ? { arquivo: "index.html", texto: "classe ." + escolha.novaClasse + " adicionada" } : null,
            { arquivo: "style.css", texto: regra.criada ? "regra " + seletor + " criada" : "regra " + seletor + " atualizada" },
          ].filter(Boolean),
        },
      });
    }

    function executarMover(msg) {
      const arvore = arvoreDaTela(msg.id);
      if (!arvore) return;
      const src = arvore.src;
      const no = noPorPn(arvore, msg.pn);
      const pai = noPorPn(arvore, msg.pai);
      const antes = msg.antes == null ? null : noPorPn(arvore, msg.antes);
      if (!no || no === antes) return;
      const remocao = calcularRemocao(src, no);
      const insercao = calcularInsercao(arvore, pai, antes, trechoDoNo(src, no), DE_LINHA.has(no.tag));
      if (insercao.inicio > remocao.inicio && insercao.inicio < remocao.fim) return;
      const tamanho = remocao.fim - remocao.inicio;
      let edicoes;
      let inicioNovo;
      if (insercao.inicio >= remocao.fim) {
        edicoes = [insercao, remocao];
        inicioNovo = insercao.inicio + insercao.deslocamento - tamanho;
      } else {
        edicoes = [remocao, insercao];
        inicioNovo = insercao.inicio + insercao.deslocamento;
      }
      let html = src;
      edicoes.forEach((e) => (html = aplicarEdicao(html, e)));
      if (html === src) return;
      const novo = noNaPosicao(lerHtml(html), inicioNovo);

      aplicar({
        html: html,
        css: api.state.files["style.css"],
        edicoes: edicoes.map((e) => ({ arquivo: "index.html", edicao: e })),
        semDigitar: true,
        destacar: novo ? novo.pn : null,
        textoDestaque: "movido",
        selecionar: novo ? novo.pn : null,
        passo: "<code>&lt;" + esc(no.tag) + "&gt;</code> movido",
        balao: {
          titulo: rotuloDoNo(src, no) + " movido para dentro de " + rotuloDoNo(src, pai),
          texto: "A ordem no HTML define a ordem na tela: o trecho mudou de lugar no código.",
          codigo: realcarHtml(trechoDoNo(src, no)),
          arquivos: [{ arquivo: "index.html", texto: "trecho movido" }],
        },
      });
    }

    function removerSelecionado() {
      if (dnd.selecionado == null) return;
      const arvore = lerHtml(api.state.files["index.html"]);
      const no = noPorPn(arvore, dnd.selecionado);
      if (!no || no === arvore.corpo || no.tag === "html") return;
      const remocao = calcularRemocao(arvore.src, no);
      const trecho = trechoDoNo(arvore.src, no);
      aplicar({
        html: aplicarEdicao(arvore.src, remocao),
        css: api.state.files["style.css"],
        edicoes: [{ arquivo: "index.html", edicao: remocao }],
        selecionar: null,
        passo: "<code>&lt;" + esc(no.tag) + "&gt;</code> removido",
        balao: {
          tipo: "remover",
          titulo: rotuloDoNo(arvore.src, no) + " removido",
          texto: "O trecho saiu do index.html. Use Desfazer se quiser trazer de volta.",
          codigo: realcarHtml(trecho),
          arquivos: [{ arquivo: "index.html", texto: "−" + contarLinhas(trecho) + " linha(s)" }],
        },
      });
    }

    function limparTela() {
      const arvore = lerHtml(api.state.files["index.html"]);
      const corpo = arvore.corpo;
      if (!corpo || !corpo.temFecho) return;
      const conteudo = arvore.src.slice(corpo.fimAbertura, corpo.inicioFecho);
      if (!conteudo.trim()) return;
      const edicao = { inicio: corpo.fimAbertura, fim: corpo.inicioFecho, texto: "\n" };
      aplicar({
        html: aplicarEdicao(arvore.src, edicao),
        css: api.state.files["style.css"],
        edicoes: [{ arquivo: "index.html", edicao: edicao }],
        selecionar: null,
        passo: "tela limpa",
        balao: {
          tipo: "remover",
          titulo: "Tela limpa: o <code>&lt;body&gt;</code> ficou vazio",
          texto: "O &lt;head&gt; e o style.css continuam iguais. Agora monte a página do zero arrastando blocos.",
        },
      });
    }

    // Registra o estado anterior, atualiza a tela e digita as mudanças.
    function aplicar(op) {
      const anterior = { html: api.state.files["index.html"], css: api.state.files["style.css"] };
      dnd.historico.push({ arquivos: anterior, passo: op.passo });
      if (dnd.historico.length > 40) dnd.historico.shift();

      api.state.files["index.html"] = op.html;
      api.state.files["style.css"] = op.css;
      api.afterExternalEdit();

      dnd.selecionado = op.selecionar == null ? null : op.selecionar;
      dnd.destacar = op.destacar == null ? null : op.destacar;
      dnd.textoDestaque = op.textoDestaque || "";
      api.renderPreview(true);

      registrarPasso(op.passo);
      mostrarBalao(op.balao);
      atualizarFerramentas();

      dnd.pular = true;
      dnd.fila = dnd.fila.then(() => {
        dnd.pular = false;
        return animarNoEditor(anterior, op);
      });
    }

    async function animarNoEditor(anterior, op) {
      const editor = api.editor;
      const visivel = editor.cm && editor.docs && ui.editor.offsetParent !== null;
      if (!editor.cm || !editor.docs) {
        if (editor.textarea) editor.textarea.value = api.state.files[editor.active];
        return;
      }
      const docs = editor.docs;
      const finais = { "index.html": op.html, "style.css": op.css };
      const iniciais = { "index.html": anterior.html, "style.css": anterior.css };
      const sincronizado = docs["index.html"].getValue() === iniciais["index.html"] && docs["style.css"].getValue() === iniciais["style.css"];

      editor.animando = true;
      editor.cm.setOption("readOnly", true);
      try {
        if (!visivel || !sincronizado || op.semDigitar) {
          ["index.html", "style.css"].forEach((arquivo) => {
            if (docs[arquivo].getValue() !== finais[arquivo]) docs[arquivo].setValue(finais[arquivo]);
          });
          if (op.semDigitar && visivel) destacarEdicoesProntas(op);
          return;
        }
        for (const item of op.edicoes) {
          await digitar(item.arquivo, item.edicao);
        }
        ["index.html", "style.css"].forEach((arquivo) => {
          if (docs[arquivo].getValue() !== finais[arquivo]) docs[arquivo].setValue(finais[arquivo]);
        });
      } finally {
        editor.cm.setOption("readOnly", false);
        editor.animando = false;
        marcarSelecaoNoCodigo(false);
      }
    }

    function destacarEdicoesProntas(op) {
      const ultima = op.edicoes.filter((e) => e.edicao.texto).pop();
      if (!ultima) return;
      api.selectFile(ultima.arquivo, true);
      const doc = api.editor.docs[ultima.arquivo];
      const html = op.html;
      const pos = html.indexOf(ultima.edicao.texto.trim());
      if (pos < 0) return;
      const de = doc.posFromIndex(pos);
      const ate = doc.posFromIndex(pos + ultima.edicao.texto.trim().length);
      const marca = doc.markText(de, ate, { className: "cm-pratica-novo" });
      api.editor.cm.scrollIntoView({ from: de, to: ate }, 60);
      window.setTimeout(() => marca.clear(), 2600);
    }

    // Digita a edição no editor, como se alguém estivesse escrevendo.
    async function digitar(arquivo, edicao) {
      const cm = api.editor.cm;
      const doc = api.editor.docs[arquivo];
      if (api.editor.active !== arquivo) api.selectFile(arquivo, true);
      const de = doc.posFromIndex(edicao.inicio);

      if (edicao.fim > edicao.inicio) {
        const marca = doc.markText(de, doc.posFromIndex(edicao.fim), { className: "cm-pratica-removido" });
        cm.scrollIntoView({ from: de, to: doc.posFromIndex(edicao.fim) }, 60);
        if (!dnd.pular) await espera(edicao.texto ? 260 : 420);
        marca.clear();
        doc.replaceRange("", de, doc.posFromIndex(edicao.fim), "+pratica");
      }

      const texto = edicao.texto;
      if (!texto) return;
      const passos = Math.min(36, Math.max(6, Math.ceil(texto.length / 5)));
      const tamanho = Math.ceil(texto.length / passos);
      let feito = 0;
      while (feito < texto.length) {
        const pedaco = dnd.pular ? texto.slice(feito) : texto.slice(feito, feito + tamanho);
        doc.replaceRange(pedaco, doc.posFromIndex(edicao.inicio + feito), null, "+pratica");
        feito += pedaco.length;
        const cursor = doc.posFromIndex(edicao.inicio + feito);
        doc.setCursor(cursor);
        cm.scrollIntoView(cursor, 70);
        if (!dnd.pular) await espera(18);
      }
      const marca = doc.markText(doc.posFromIndex(edicao.inicio), doc.posFromIndex(edicao.inicio + texto.length), {
        className: "cm-pratica-novo",
      });
      window.setTimeout(() => marca.clear(), 2600);
      if (!dnd.pular) await espera(120);
    }

    /* ----------------------------------------------------------------------
       10. SELEÇÃO, PASSOS E DESFAZER
       ---------------------------------------------------------------------- */
    function registrarPasso(html) {
      if (!html) return;
      dnd.passos.push(html);
      renderizarPassos();
    }

    function renderizarPassos() {
      ui.dndPassos.innerHTML = dnd.passos
        .map((p, i) => '<li><span class="dnd-passo-n">' + (i + 1) + '</span><span class="dnd-passo-texto">' + p + "</span></li>")
        .join("");
      ui.dndQtd.textContent = dnd.passos.length ? "(" + dnd.passos.length + ")" : "";
      ui.dndPassos.scrollTop = ui.dndPassos.scrollHeight;
    }

    function desfazer() {
      const ultimo = dnd.historico.pop();
      if (!ultimo) return;
      dnd.pular = true;
      dnd.fila = dnd.fila.then(() => {
        dnd.pular = false;
        api.state.files["index.html"] = ultimo.arquivos.html;
        api.state.files["style.css"] = ultimo.arquivos.css;
        const docs = api.editor.docs;
        if (docs) {
          api.editor.animando = true;
          docs["index.html"].setValue(ultimo.arquivos.html);
          docs["style.css"].setValue(ultimo.arquivos.css);
          api.editor.animando = false;
        } else if (api.editor.textarea) {
          api.editor.textarea.value = api.state.files[api.editor.active];
        }
        api.afterExternalEdit();
        dnd.selecionado = null;
        dnd.destacar = null;
        api.renderPreview(true);
        dnd.passos.pop();
        renderizarPassos();
        atualizarFerramentas();
        mostrarBalao({ tipo: "remover", titulo: "Desfeito", texto: ultimo.passo ? "Voltou para antes de: " + ultimo.passo : "" });
      });
    }

    function atualizarFerramentas() {
      if (!ui) return;
      ui.dndDesfazer.disabled = !dnd.historico.length;
      const temSelecao = dnd.selecionado != null && !(dnd.caminho.length && dnd.caminho[dnd.caminho.length - 1].corpo);
      ui.dndRemover.hidden = !temSelecao;
      if (dnd.selecionado == null || !dnd.caminho.length) {
        ui.dndCaminho.innerHTML = '<span class="dnd-caminho-dica">Clique num elemento para selecionar · arraste para mover</span>';
        return;
      }
      ui.dndCaminho.innerHTML = dnd.caminho
        .map(
          (c, i) =>
            (i ? '<span class="dnd-caminho-sep" aria-hidden="true">›</span>' : "") +
            '<button type="button" class="dnd-caminho-item' + (i === dnd.caminho.length - 1 ? " is-atual" : "") +
            '" data-dnd="caminho" data-pn="' + (c.pn == null ? "" : c.pn) + '">' + esc(c.rotulo) + "</button>"
        )
        .join("");
      ui.dndCaminho.scrollLeft = ui.dndCaminho.scrollWidth;
    }

    function limparMarcaSelecao() {
      if (dnd.marcaSelecao) dnd.marcaSelecao.clear();
      dnd.marcaSelecao = null;
    }

    // Destaca no index.html o trecho do elemento selecionado na tela.
    function marcarSelecaoNoCodigo(rolar) {
      limparMarcaSelecao();
      const editor = api.editor;
      if (dnd.selecionado == null || !editor.cm || !editor.docs || editor.animando) return;
      const arvore = lerHtml(api.state.files["index.html"]);
      const no = noPorPn(arvore, dnd.selecionado);
      if (!no) return;
      const doc = editor.docs["index.html"];
      const de = doc.posFromIndex(no.inicio);
      const ate = doc.posFromIndex(no.fim);
      dnd.marcaSelecao = doc.markText(de, ate, { className: "cm-pratica-sel" });
      if (rolar) {
        if (editor.active !== "index.html") api.selectFile("index.html", true);
        editor.cm.scrollIntoView({ from: de, to: ate }, 80);
      }
    }

    function selecionarPn(pn, avisarTela) {
      dnd.selecionado = pn;
      const i = dnd.caminho.findIndex((c) => String(c.pn) === String(pn));
      if (i >= 0) dnd.caminho = dnd.caminho.slice(0, i + 1);
      if (avisarTela) enviar({ tipo: "selecionar", pn: pn });
      atualizarFerramentas();
      marcarSelecaoNoCodigo(true);
    }

    /* ----------------------------------------------------------------------
       11. API USADA PELO pratica.js
       ---------------------------------------------------------------------- */
    function mensagem(dados, frame) {
      if (dados.req && dnd.pedidos.has(dados.req)) {
        const pedido = dnd.pedidos.get(dados.req);
        dnd.pedidos.delete(dados.req);
        dados.id = frame.dataset.render;
        pedido.resolve(dados);
        return;
      }
      if (frame !== api.preview.active) return;
      dados.id = frame.dataset.render;

      if (dados.tipo === "dnd-alvo" && dnd.arraste) {
        if (dados.seq < dnd.arraste.resposta) return;
        dnd.arraste.resposta = dados.seq;
        if (!dnd.arraste.dentro) return;
        dnd.arraste.alvo = dados;
        atualizarStatus(dados);
      } else if (dados.tipo === "selecionar") {
        dnd.caminho = (dados.caminho || []).map((c) => ({ pn: c.pn == null ? null : Number(c.pn), rotulo: c.rotulo }));
        if (dados.corpo && dnd.caminho.length) dnd.caminho[dnd.caminho.length - 1].corpo = true;
        if (dados.inicial) {
          // Seleção automática após soltar: atualiza a barra sem mexer no editor.
          dnd.selecionado = dados.pn == null ? null : Number(dados.pn);
          atualizarFerramentas();
          marcarSelecaoNoCodigo(false);
          return;
        }
        selecionarPn(dados.pn == null ? null : Number(dados.pn), false);
      } else if (dados.tipo === "mover-inicio") {
        esconderBalao();
      } else if (dados.tipo === "mover") {
        executarMover(dados);
      } else if (dados.tipo === "mover-cancelado" && dados.motivo) {
        mostrarBalao({ tipo: "erro", titulo: "Não dá para mover para lá", texto: esc(dados.motivo) });
      } else if (dados.tipo === "remover-selecionado") {
        removerSelecionado();
      } else if (dados.tipo === "desfazer") {
        desfazer();
      }
    }

    function prepararTela(html, id) {
      dnd.telas.set(id, html);
      if (dnd.telas.size > 6) dnd.telas.delete(dnd.telas.keys().next().value);
      const config = {
        id: id,
        destacar: dnd.destacar,
        textoDestaque: dnd.textoDestaque,
        selecionado: dnd.selecionado,
      };
      dnd.destacar = null;
      return {
        html: marcarParaTela(lerHtml(html)),
        script: "<script>" + TELA_FONTE + "(" + JSON.stringify(config) + ");</script>",
      };
    }

    function reiniciar() {
      dnd.historico = [];
      dnd.passos = [];
      dnd.selecionado = null;
      dnd.caminho = [];
      dnd.destacar = null;
      limparMarcaSelecao();
      if (ui) {
        renderizarPassos();
        atualizarFerramentas();
        esconderBalao();
      }
    }

    return {
      construir: construir,
      ativo: () => dnd.ativo,
      entrar(ex) {
        dnd.ativo = true;
        if (dnd.ex !== ex || !ui.dndSecoes.childElementCount) {
          dnd.ex = ex;
          montarPaleta(ex);
        }
        atualizarFerramentas();
        mostrarDica();
      },
      sair() {
        dnd.ativo = false;
        if (dnd.arraste) cancelarArraste();
        limparMarcaSelecao();
        esconderBalao();
        if (ui) ui.dndDica.hidden = true;
      },
      aoAbrir(ex) {
        reiniciar();
        dnd.ex = null;
        if (dnd.ativo) this.entrar(ex);
      },
      aoFechar() {
        if (dnd.arraste) cancelarArraste();
        reiniciar();
      },
      // O aluno digitou no editor: a seleção antiga deixa de valer.
      aoEditar() {
        if (dnd.selecionado != null) {
          dnd.selecionado = null;
          dnd.caminho = [];
          limparMarcaSelecao();
          atualizarFerramentas();
        }
      },
      aoRestaurar() {
        reiniciar();
      },
      aoMontarEditor() {
        marcarSelecaoNoCodigo(false);
      },
      teclado(e) {
        if (!dnd.ativo || dnd.selecionado == null) return false;
        const noEditor = e.target && e.target.closest && e.target.closest(".CodeMirror, textarea, input");
        if (noEditor || (e.key !== "Delete" && e.key !== "Backspace")) return false;
        removerSelecionado();
        return true;
      },
      prepararTela: prepararTela,
      mensagem: mensagem,
    };
  }
})();
