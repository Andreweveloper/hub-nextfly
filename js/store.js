/* ────────────────────────────────────────────────
   Estado do Hub.

   Tudo que o usuário decide (tema, situação de um lead, agente
   ligado ou desligado) vive aqui e sobrevive ao fechar a aba.
   Quando houver banco, troque ler/gravar por chamadas de API —
   a superfície de Estado.* continua a mesma.
   ──────────────────────────────────────────────── */

window.Estado = (function () {
  'use strict';

  var CHAVE = 'nextfly.torre.v1';

  var padrao = {
    tema: 'auto',
    leads: {},          // nome do lead → situação
    agentesLigados: {}  // id do agente → true/false
  };

  var atual = ler();
  var ouvintes = [];

  /* localStorage falha em aba anônima e com cookies bloqueados.
     O Hub precisa abrir mesmo assim, só sem lembrar nada. */

  function ler() {
    try {
      var cru = localStorage.getItem(CHAVE);
      if (!cru) { return clonar(padrao); }
      var salvo = JSON.parse(cru);
      return {
        tema: salvo.tema || padrao.tema,
        leads: salvo.leads || {},
        agentesLigados: salvo.agentesLigados || {}
      };
    } catch (erro) {
      console.warn('Estado não pôde ser lido, começando do zero:', erro);
      return clonar(padrao);
    }
  }

  function gravar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(atual));
    } catch (erro) {
      console.warn('Estado não pôde ser gravado:', erro);
    }
  }

  function clonar(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function avisar() {
    ouvintes.forEach(function (fn) { fn(atual); });
  }

  /* ── Leitura ───────────────────────────── */

  function tema() { return atual.tema; }

  function situacaoLead(nome, padraoLead) {
    return Object.prototype.hasOwnProperty.call(atual.leads, nome)
      ? atual.leads[nome]
      : padraoLead;
  }

  function agenteLigado(id) {
    return atual.agentesLigados[id] !== false;
  }

  /* ── Escrita — sempre substituindo, nunca mutando ───────── */

  /* Tema não avisa os ouvintes de propósito: trocar tema não deve
     redesenhar um setor e perder a gaveta que o usuário abriu. */
  function definirTema(valor) {
    atual = Object.assign({}, atual, { tema: valor });
    aplicarTema();
    gravar();
  }

  function girarTema() {
    var ordem = ['auto', 'claro', 'escuro'];
    var proximo = ordem[(ordem.indexOf(atual.tema) + 1) % ordem.length];
    definirTema(proximo);
    return proximo;
  }

  function aplicarTema() {
    var raiz = document.documentElement;
    if (atual.tema === 'auto') {
      raiz.removeAttribute('data-tema');
    } else {
      raiz.setAttribute('data-tema', atual.tema);
    }
  }

  function definirLead(nome, situacao) {
    var leads = Object.assign({}, atual.leads);
    leads[nome] = situacao;
    atual = Object.assign({}, atual, { leads: leads });
    gravar();
    avisar();
  }

  function alternarAgente(id) {
    var mapa = Object.assign({}, atual.agentesLigados);
    mapa[id] = !agenteLigado(id);
    atual = Object.assign({}, atual, { agentesLigados: mapa });
    gravar();
    avisar();
    return mapa[id];
  }

  function aoMudar(fn) { ouvintes = ouvintes.concat(fn); }

  return {
    tema: tema,
    definirTema: definirTema,
    girarTema: girarTema,
    aplicarTema: aplicarTema,
    situacaoLead: situacaoLead,
    definirLead: definirLead,
    agenteLigado: agenteLigado,
    alternarAgente: alternarAgente,
    aoMudar: aoMudar
  };
})();
