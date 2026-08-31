/* ── Peças reutilizadas pelos setores ─────────────── */

window.Pecas = (function () {
  'use strict';

  /* Instrumento: um número grande com a etiqueta gravada em cima.
     O acento fica reservado para o número que importa na tela. */
  function instrumento(o) {
    return '<div class="instrumento' + (o.acento ? ' instrumento--acento' : '') + '">' +
      '<span class="etiqueta">' + U.esc(o.rotulo) + '</span>' +
      '<span class="instrumento__valor">' + U.esc(o.valor) +
        (o.unidade ? '<span class="instrumento__unidade">' + U.esc(o.unidade) + '</span>' : '') +
      '</span>' +
      (o.nota
        ? '<span class="instrumento__nota"' + (o.sinal ? ' data-sinal="' + U.esc(o.sinal) + '"' : '') + '>' +
            U.esc(o.nota) +
          '</span>'
        : '') +
    '</div>';
  }

  function proa(o) {
    return '<header class="proa">' +
      '<div class="proa__texto">' +
        '<span class="etiqueta">' + U.esc(o.etiqueta) + '</span>' +
        '<h1>' + U.esc(o.titulo) + '</h1>' +
        '<p class="proa__legenda">' + U.esc(o.legenda) + '</p>' +
      '</div>' +
      (o.acoes ? '<div class="proa__acoes">' + o.acoes + '</div>' : '') +
    '</header>';
  }

  function selo(texto, variante) {
    return '<span class="selo selo--' + U.esc(variante || 'liso') + '">' + U.esc(texto) + '</span>';
  }

  /* O aviso de que a tela ainda é casca. Um por setor, no rodapé,
     dizendo exatamente onde a integração entra. */
  function nota(html) {
    return '<p class="nota-integracao">' + html + '</p>';
  }

  return { instrumento: instrumento, proa: proa, selo: selo, nota: nota };
})();
