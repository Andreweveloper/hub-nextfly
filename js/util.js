/* ── Utilitários: DOM, formatação, avisos ─────────────────────────── */

window.U = (function () {
  'use strict';

  function esc(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function el(seletor, raiz) {
    return (raiz || document).querySelector(seletor);
  }

  function els(seletor, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor));
  }

  /* transforma uma string de HTML no elemento correspondente */
  function montar(html) {
    var molde = document.createElement('template');
    molde.innerHTML = String(html).trim();
    return molde.content.firstElementChild;
  }

  function num(valor) {
    return Number(valor).toLocaleString('pt-BR');
  }

  function moeda(valor) {
    return 'R$ ' + Number(valor).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function pct(parte, total) {
    if (!total) { return 0; }
    return Math.round((parte / total) * 100);
  }

  /* ── Aviso flutuante ────────────────────────────
     Um só na tela por vez. O texto diz o que aconteceu, no
     passado, com o mesmo verbo do botão que o disparou.        */

  var relogioAviso = null;

  function aviso(texto) {
    var caixa = el('#aviso');
    if (!caixa) { return; }
    caixa.textContent = texto;
    caixa.setAttribute('data-visivel', 'sim');
    if (relogioAviso) { clearTimeout(relogioAviso); }
    relogioAviso = setTimeout(function () {
      caixa.setAttribute('data-visivel', 'nao');
    }, 2200);
  }

  /* ── Copiar para a área de transferência ────────────────
     A API moderna exige contexto seguro; abrindo o Hub por
     file:// ela não existe. O fallback cobre esse caso.        */

  function copiar(texto, mensagem) {
    var ok = function () { aviso(mensagem || 'Copiado'); };
    var falhou = function () { aviso('Não deu para copiar — selecione e use Ctrl+C'); };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(ok, falhou);
      return;
    }

    try {
      var area = document.createElement('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var deu = document.execCommand('copy');
      document.body.removeChild(area);
      if (deu) { ok(); } else { falhou(); }
    } catch (erro) {
      console.error('Falha ao copiar:', erro);
      falhou();
    }
  }

  /* ── Encaixe escalonado das tiras na baia ─────────── */

  function encaixar(raiz) {
    els('.tira', raiz).forEach(function (tira, i) {
      tira.style.setProperty('--i', i);
      tira.classList.add('tira--encaixando');
    });
  }

  return {
    esc: esc,
    el: el,
    els: els,
    montar: montar,
    num: num,
    moeda: moeda,
    pct: pct,
    aviso: aviso,
    copiar: copiar,
    encaixar: encaixar
  };
})();
