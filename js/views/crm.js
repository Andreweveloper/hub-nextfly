/* ── SETOR 05 · CRM — o funil como escada de degraus ──────── */

(function () {
  'use strict';

  /* O funil é uma escada, não um triângulo decorativo: cada degrau
     mostra quantos entraram e quanto sobrou do degrau anterior. */
  function degrau(etapa, topo, anterior) {
    var largura = U.pct(etapa.qtd, topo);
    var retencao = anterior ? U.pct(etapa.qtd, anterior.qtd) : 100;
    var cor = etapa.qtd === 0 ? 'var(--parado)'
            : retencao >= 60 ? 'var(--ativo)'
            : retencao >= 30 ? 'var(--espera)'
            : 'var(--magenta)';

    return '<div class="degrau" style="--cor-degrau:' + cor + '">' +
      '<div>' +
        '<div class="degrau__nome">' + U.esc(etapa.etapa) + '</div>' +
        '<div class="etiqueta">' +
          (anterior ? retencao + '% do degrau acima' : 'topo do funil') +
        '</div>' +
      '</div>' +
      '<div class="degrau__barra"><span style="width:' + largura + '%"></span></div>' +
      '<div class="degrau__valor">' + U.num(etapa.qtd) + '</div>' +
    '</div>';
  }

  Rotas.registrar({
    id: 'crm',
    cod: '05',
    nome: 'CRM',

    desenhar: function (raiz) {
      var funil = Dados.funil();
      var topo = funil[0];
      var fechado = funil[funil.length - 1];
      var emAberto = funil.slice(3, 5).reduce(function (t, e) { return t + e.valor; }, 0);

      raiz.appendChild(U.montar(Pecas.proa({
        etiqueta: 'Setor 05 · funil',
        titulo: 'CRM',
        legenda: 'O caminho de um comércio sem site até virar contrato. ' +
                 'Cada degrau mostra quanto sobrou do degrau acima — é aí que se vê onde o funil vaza.'
      })));

      raiz.appendChild(U.montar('' +
        '<div class="grade">' +
          Pecas.instrumento({ rotulo: 'No funil', valor: U.num(topo.qtd), nota: 'leads encontrados' }) +
          Pecas.instrumento({ rotulo: 'Conversão total', valor: (fechado.qtd / topo.qtd * 100).toFixed(1), unidade: '%', nota: 'do topo ao contrato' }) +
          Pecas.instrumento({ rotulo: 'Em negociação', valor: U.moeda(emAberto), nota: 'reunião + proposta' }) +
          Pecas.instrumento({ rotulo: 'Ticket médio', valor: U.moeda(Math.round(fechado.valor / fechado.qtd)), nota: fechado.qtd + ' contratos', acento: true }) +
        '</div>'));

      raiz.appendChild(U.montar('' +
        '<div class="grade grade--larga">' +
          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Escada do funil</h2></div>' +
            '<div class="escada">' +
              funil.map(function (etapa, i) {
                return degrau(etapa, topo.qtd, i > 0 ? funil[i - 1] : null);
              }).join('') +
            '</div>' +
          '</section>' +

          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Onde vaza</h2></div>' +
            '<div class="placa">' +
              '<ul class="lista-tracos">' +
                '<li><span><b>Encontrado → abordado (42%)</b> — mais da metade dos leads ' +
                  'nunca recebeu mensagem. É o vazamento mais barato de tapar.</span></li>' +
                '<li><span><b>Abordado → respondeu (34%)</b> — dentro do esperado para ' +
                  'WhatsApp frio; mexer na copy por ramo mexe aqui.</span></li>' +
                '<li><span><b>Reunião → proposta (55%)</b> — saudável. Quem senta, ' +
                  'pede proposta.</span></li>' +
                '<li><span><b>Proposta → fechado (53%)</b> — de cada duas propostas, ' +
                  'uma vira contrato de ' + U.moeda(Math.round(fechado.valor / fechado.qtd)) + '.</span></li>' +
              '</ul>' +
              '<div class="veredito" style="--cor-veredito:var(--magenta);margin-top:var(--u3)">' +
                '<div>' +
                  '<div class="veredito__nome">Abordar os 295 leads parados</div>' +
                  '<div class="veredito__base">na taxa atual: ~100 respostas, ~12 contratos</div>' +
                '</div>' +
                '<span class="selo selo--acento">prioridade</span>' +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>'));

      raiz.appendChild(U.montar(Pecas.nota(
        '<b>O funil ainda é um retrato fixo.</b> Com banco, cada degrau passa a contar ' +
        'os leads reais do Cais 47 e a mover sozinho quando você marca uma situação em <b>Prospecção</b>.'
      )));
    }
  });
})();
