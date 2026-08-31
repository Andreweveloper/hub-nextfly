/* ────────────────────────────────────────────────
   A tira — o flight strip da torre.

   Uma tira é sempre: suporte de cor · código · o que é ·
   campos de leitura · farol de estado. Todo setor do Hub que
   mostra "algo em andamento" usa esta mesma peça, para que a
   operação inteira se leia do mesmo jeito.
   ──────────────────────────────────────────────── */

window.Tiras = (function () {
  'use strict';

  /* opcoes:
       estado    'ativo' | 'espera' | 'parado' | 'erro' | 'marcado'
       codigo    identificador curto, monoespaçado (SPY-01)
       codigoSub linha fina sob o código
       titulo    o que está acontecendo
       tituloSub contexto do título
       campos    [{ rotulo, valor, classe }]
       botao     true → a tira é clicável e abre gaveta
       attrs     atributos extras, já escapados pelo chamador
  */
  function tira(opcoes) {
    var o = opcoes || {};
    var tag = o.botao ? 'button' : 'div';
    var tipo = o.botao ? ' type="button"' : '';

    var campos = (o.campos || []).map(function (campo) {
      return '' +
        '<span class="tira__campo tira__campo--dado ' + (campo.classe || '') + '">' +
          '<span class="tira__forte">' + U.esc(campo.valor) + '</span>' +
          (campo.rotulo ? '<span class="tira__sub">' + U.esc(campo.rotulo) + '</span>' : '') +
        '</span>';
    }).join('');

    return '' +
      '<' + tag + tipo + ' class="tira" data-estado="' + U.esc(o.estado || 'parado') + '"' +
        (o.attrs || '') + '>' +
        '<span class="tira__suporte" aria-hidden="true"></span>' +
        '<span class="tira__campo tira__campo--cod">' +
          '<span>' + U.esc(o.codigo || '') + '</span>' +
          (o.codigoSub ? '<span class="tira__sub">' + U.esc(o.codigoSub) + '</span>' : '') +
        '</span>' +
        '<span class="tira__campo tira__campo--titulo">' +
          '<span class="tira__corte">' + U.esc(o.titulo || '') + '</span>' +
          (o.tituloSub ? '<span class="tira__sub tira__corte">' + U.esc(o.tituloSub) + '</span>' : '') +
        '</span>' +
        campos +
        '<span class="tira__farol" aria-hidden="true"><i></i></span>' +
      '</' + tag + '>';
  }

  /* Um rack é a baia física: as tiras encaixadas com as travessas
     do fundo aparecendo entre elas. */
  function rack(rotulo, conteudoHtml, extraHtml) {
    return '' +
      '<section class="baia">' +
        '<div class="baia__topo">' +
          '<h2 class="baia__rotulo">' + U.esc(rotulo) + '</h2>' +
          (extraHtml || '') +
        '</div>' +
        '<div class="rack">' + conteudoHtml + '</div>' +
      '</section>';
  }

  return { tira: tira, rack: rack };
})();
