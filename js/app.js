/* ────────────────────────────────────────────────
   Partida do Hub. Monta a coluna de setores a partir do que cada
   setor registrou, liga o relógio e o tema, e entrega o comando
   para o roteador.
   ──────────────────────────────────────────────── */

(function () {
  'use strict';

  var NOME_TEMA = { auto: 'auto', claro: 'claro', escuro: 'escuro' };

  function montarSetores() {
    var coluna = U.el('#setores');
    if (!coluna) { return; }

    Rotas.lista().forEach(function (setor) {
      var botao = U.montar('' +
        '<button type="button" class="setor" data-ir="' + U.esc(setor.id) + '">' +
          '<span class="setor__cod leitura">' + U.esc(setor.cod) + '</span>' +
          '<span class="setor__nome">' + U.esc(setor.nome) + '</span>' +
        '</button>');

      botao.addEventListener('click', function () { Rotas.ir(setor.id); });
      coluna.insertBefore(botao, U.el('.setores__rodape', coluna));
    });
  }

  /* O relógio da torre. Segundos importam porque a tela é de
     operação — quem olha quer saber se o dado é de agora. */
  function ligarRelogio() {
    var caixa = U.el('#relogio');
    if (!caixa) { return; }

    var dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

    function bater() {
      var agora = new Date();
      var dois = function (n) { return n < 10 ? '0' + n : String(n); };

      caixa.innerHTML =
        '<span class="relogio__data">' +
          dias[agora.getDay()] + ' ' + dois(agora.getDate()) + '/' + dois(agora.getMonth() + 1) +
          ' · ' +
        '</span>' +
        '<b>' + dois(agora.getHours()) + ':' + dois(agora.getMinutes()) + ':' + dois(agora.getSeconds()) + '</b>' +
        ' local';
    }

    bater();
    setInterval(bater, 1000);
  }

  function ligarTema() {
    var botao = U.el('#tema');
    if (!botao) { return; }

    function pintar() {
      botao.textContent = 'Tema · ' + NOME_TEMA[Estado.tema()];
    }

    Estado.aplicarTema();
    pintar();

    botao.addEventListener('click', function () {
      var novo = Estado.girarTema();
      pintar();
      U.aviso('Tema ' + NOME_TEMA[novo]);
    });
  }

  /* A Torre precisa refletir agente ligado ou desligado sem F5 */
  function ligarSincronia() {
    Estado.aoMudar(function () {
      if (Rotas.atual() === 'torre') { Rotas.redesenhar(); }
    });
  }

  function partir() {
    montarSetores();
    ligarRelogio();
    ligarTema();
    ligarSincronia();
    Rotas.iniciar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', partir);
  } else {
    partir();
  }
})();
