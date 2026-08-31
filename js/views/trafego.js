/* ── SETOR 06 · TRÁFEGO — as campanhas sob as regras do traffic ── */

(function () {
  'use strict';

  var VEREDITO = {
    escalar:  { texto: 'escalar +20%', cor: 'var(--ativo)',   selo: 'ativo'  },
    manter:   { texto: 'manter',       cor: 'var(--azul)',    selo: 'azul'   },
    aguardar: { texto: 'aguardar',     cor: 'var(--espera)',  selo: 'espera' },
    matar:    { texto: 'matar adset',  cor: 'var(--erro)',    selo: 'erro'   }
  };

  var ESTADO_TIRA = {
    escalar: 'ativo', manter: 'ativo', aguardar: 'espera', matar: 'erro'
  };

  /* A base numérica de cada veredito — o traffic nunca decide sem ela */
  function justificar(c) {
    if (c.conv < 50) {
      return c.conv + ' de 50 conversões · abaixo do piso de significância';
    }
    if (c.veredito === 'matar') {
      return 'CPA R$ ' + c.cpa.toFixed(2).replace('.', ',') + ' com ' + c.conv + ' conversões';
    }
    if (c.veredito === 'escalar') {
      return c.conv + ' conversões · CPA R$ ' + c.cpa.toFixed(2).replace('.', ',') + ' · ' + c.dias + ' dias no ar';
    }
    return c.conv + ' conversões · CVR ' + c.cvr.toFixed(1).replace('.', ',') + '%';
  }

  Rotas.registrar({
    id: 'trafego',
    cod: '06',
    nome: 'Tráfego',

    desenhar: function (raiz) {
      var campanhas = Dados.campanhas();
      var regras = Dados.regrasTrafego();

      var gasto = campanhas.reduce(function (t, c) { return t + c.gasto; }, 0);
      var conv = campanhas.reduce(function (t, c) { return t + c.conv; }, 0);
      var cpaMedio = gasto / conv;
      var noPiso = campanhas.filter(function (c) { return c.conv >= 50; }).length;

      raiz.appendChild(U.montar(Pecas.proa({
        etiqueta: 'Setor 06 · mídia paga',
        titulo: 'Tráfego',
        legenda: 'As campanhas passadas pelas regras fixas do agente traffic. ' +
                 'Nenhum veredito aparece aqui sem a conta que o sustenta.'
      })));

      raiz.appendChild(U.montar('' +
        '<div class="grade">' +
          Pecas.instrumento({ rotulo: 'Gasto no período', valor: U.moeda(gasto), nota: campanhas.length + ' campanhas' }) +
          Pecas.instrumento({ rotulo: 'Conversões', valor: U.num(conv), nota: noPiso + ' de ' + campanhas.length + ' acima do piso' }) +
          Pecas.instrumento({ rotulo: 'CPA médio', valor: U.moeda(Math.round(cpaMedio)), nota: 'na conta inteira', acento: true }) +
          Pecas.instrumento({ rotulo: 'Prontas para decisão', valor: noPiso, nota: 'com 50+ conversões' }) +
        '</div>'));

      /* ── Baia das campanhas: cada uma é uma tira ──────────── */

      var tiras = campanhas.map(function (c) {
        return Tiras.tira({
          estado: ESTADO_TIRA[c.veredito],
          codigo: 'R$ ' + U.num(c.gasto),
          codigoSub: c.dias + ' dias',
          titulo: c.nome,
          tituloSub: justificar(c),
          campos: [
            { valor: c.conv + ' conv', rotulo: 'volume', classe: 'tira__campo--tempo' },
            { valor: 'R$ ' + c.cpa.toFixed(2).replace('.', ','), rotulo: 'CPA', classe: 'tira__campo--largo' },
            { valor: VEREDITO[c.veredito].texto, rotulo: 'veredito', classe: 'tira__campo--largo' }
          ]
        });
      }).join('');

      raiz.appendChild(U.montar(Tiras.rack(
        'Baia C · campanhas',
        tiras,
        '<span class="selo selo--liso">Meta Ads</span>'
      )));

      /* ── As regras, expostas ─────────────────── */

      raiz.appendChild(U.montar('' +
        '<div class="grade grade--larga">' +
          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Regras fixas do traffic</h2></div>' +
            '<div class="placa">' +
              regras.map(function (r) {
                return '<div class="regra">' +
                  '<span class="regra__num">' + U.esc(r.n) + '</span>' +
                  '<div>' +
                    '<div class="regra__nome">' + U.esc(r.nome) + '</div>' +
                    '<p class="regra__texto">' + U.esc(r.texto) + '</p>' +
                  '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</section>' +

          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Próximo passo por campanha</h2></div>' +
            '<div class="placa">' +
              campanhas.map(function (c) {
                var v = VEREDITO[c.veredito];
                return '<div class="veredito" style="--cor-veredito:' + v.cor + ';margin-bottom:var(--u2)">' +
                  '<div>' +
                    '<div class="veredito__nome">' + U.esc(c.nome) + '</div>' +
                    '<div class="veredito__base">' + U.esc(justificar(c)) + '</div>' +
                  '</div>' +
                  '<span class="selo selo--' + v.selo + '">' + U.esc(v.texto) + '</span>' +
                '</div>';
              }).join('') +
              '<div class="comando" style="margin-top:var(--u3)">' +
                '<code>Use o agente traffic para revisar todos os adsets da conta e devolver o veredito de cada um.</code>' +
                '<button type="button" class="botao" data-copiar-traffic>Copiar</button>' +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>'));

      var botao = U.el('[data-copiar-traffic]', raiz);
      if (botao) {
        botao.addEventListener('click', function () {
          U.copiar(
            'Use o agente traffic para revisar todos os adsets da conta e devolver o veredito de cada um.',
            'Comando copiado'
          );
        });
      }

      raiz.appendChild(U.montar(Pecas.nota(
        '<b>Os vereditos aqui já seguem as regras reais do agente</b> — piso de 50 conversões, ' +
        'teto de 20% e cooldown de 48h. O que falta é o número vir da API da Meta em vez de ' +
        '<code>js/data.js</code>.'
      )));
    }
  });
})();
