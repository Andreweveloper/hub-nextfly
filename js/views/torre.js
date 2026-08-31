/* ── SETOR 01 · TORRE — o quadro vivo da operação ─────────── */

(function () {
  'use strict';

  function leitura(rotulo, valor) {
    return '<div class="leitura-torre__item">' +
      '<span class="etiqueta">' + U.esc(rotulo) + '</span>' +
      '<span class="leitura-torre__valor">' + U.esc(valor) + '</span>' +
    '</div>';
  }

  function pendencia(nome, detalhe, acao) {
    return '<li class="mini-lista__item">' +
      '<div class="mini-lista__topo">' +
        '<span class="mini-lista__nome">' + U.esc(nome) + '</span>' +
        '<span class="selo selo--liso selo--acento">' + U.esc(acao) + '</span>' +
      '</div>' +
      '<span class="mini-lista__valor">' + U.esc(detalhe) + '</span>' +
    '</li>';
  }

  Rotas.registrar({
    id: 'torre',
    cod: '01',
    nome: 'Torre',

    desenhar: function (raiz) {
      var agentes = Dados.agentes();
      var cidades = Dados.cidades();
      var campanhas = Dados.campanhas();
      var funil = Dados.funil();

      var ligados = agentes.filter(function (a) { return Estado.agenteLigado(a.id); });
      var ativos = ligados.filter(function (a) { return a.estado === 'ativo'; });
      var semSite = cidades.reduce(function (t, c) { return t + c.semSite; }, 0);
      var gasto = campanhas.reduce(function (t, c) { return t + c.gasto; }, 0);
      var fechado = funil[funil.length - 1];

      var tiras = ligados.map(function (a) {
        return Tiras.tira({
          botao: true,
          estado: a.estado,
          codigo: a.codigo,
          codigoSub: a.modelo,
          titulo: a.tarefa,
          tituloSub: a.nome + ' · ' + a.papel,
          campos: [
            { valor: a.metrica, rotulo: 'leitura', classe: 'tira__campo--largo' },
            { valor: a.tempo, rotulo: 'em curso', classe: 'tira__campo--tempo' }
          ],
          attrs: ' data-agente="' + U.esc(a.id) + '"'
        });
      }).join('');

      var quadro = tiras
        ? '<div class="baia">' +
            '<div class="baia__topo">' +
              '<h2 class="baia__rotulo">Baia A · agentes</h2>' +
              '<span class="selo selo--acento">ao vivo</span>' +
            '</div>' +
            '<div class="rack">' + tiras + '</div>' +
          '</div>'
        : '<div class="rack"><p class="discreto" style="padding:var(--u4);font-size:13px">' +
          'Nenhum agente ligado. Ligue um no setor <b>Agentes</b>.</p></div>';

      var patio = U.montar('' +
        '<div class="patio">' +
          '<div class="patio__principal">' +
            '<div class="patio__chamada">' +
              '<span class="etiqueta">Nextfly · centro de operações · litoral de SC</span>' +
              '<h1>Tudo que a operação faz <em>agora</em></h1>' +
              '<p>Os agentes, a máquina de prospecção e as campanhas no mesmo quadro. ' +
              'Cada tira é um trabalho em andamento — puxe uma para ver o que ela está fazendo.</p>' +
            '</div>' +

            '<div class="leitura-torre">' +
              leitura('Agentes no ar', ativos.length + ' / ' + ligados.length) +
              leitura('Leads sem site', U.num(semSite)) +
              leitura('Contratos fechados', U.num(fechado.qtd)) +
              leitura('Gasto no período', U.moeda(gasto)) +
            '</div>' +

            quadro +
          '</div>' +

          '<aside class="patio__lateral">' +
            '<div>' +
              '<span class="etiqueta">Exige decisão</span>' +
              '<ul class="mini-lista" style="margin-top:var(--u3)">' +
                pendencia('Pet shops Navegantes', 'CPA R$ 200,80 · 4× a meta', 'matar') +
                pendencia('3 leads responderam', 'sem retorno há 2 dias', 'responder') +
                pendencia('Página /orçamento', 'fora do ar', 'publicar') +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<span class="etiqueta">Cidades varridas</span>' +
              '<ul class="mini-lista" style="margin-top:var(--u3)">' +
                cidades.slice(0, 4).map(function (c) {
                  return '<li class="mini-lista__item">' +
                    '<div class="mini-lista__topo">' +
                      '<span class="mini-lista__nome">' + U.esc(c.nome) + '</span>' +
                      '<span class="mini-lista__valor">' + U.num(c.semSite) + '</span>' +
                    '</div>' +
                    '<div class="trilho"><span style="width:' + U.pct(c.semSite, c.leads) + '%"></span></div>' +
                  '</li>';
                }).join('') +
              '</ul>' +
            '</div>' +
          '</aside>' +
        '</div>');

      U.els('.tira[data-agente]', patio).forEach(function (t) {
        t.addEventListener('click', function () {
          var alvo = t.getAttribute('data-agente');
          Rotas.ir('agentes');
          setTimeout(function () {
            var destino = U.el('.tira[data-agente="' + alvo + '"]');
            if (destino) {
              destino.click();
              destino.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          }, 70);
        });
      });

      raiz.appendChild(patio);

      var maisBarata = campanhas.slice().sort(function (a, b) { return a.cpa - b.cpa; })[0];

      raiz.appendChild(U.montar('' +
        '<section class="baia">' +
          '<div class="baia__topo"><h2 class="baia__rotulo">Leitura do período</h2></div>' +
          '<div class="grade">' +
            Pecas.instrumento({ rotulo: 'Leads no CRM', valor: U.num(funil[0].qtd), nota: 'em 5 cidades' }) +
            Pecas.instrumento({ rotulo: 'Taxa de resposta', valor: U.pct(funil[2].qtd, funil[1].qtd), unidade: '%', nota: 'sobre os abordados' }) +
            Pecas.instrumento({ rotulo: 'Melhor CPA', valor: U.moeda(Math.round(maisBarata.cpa)), nota: maisBarata.nome, acento: true }) +
            Pecas.instrumento({ rotulo: 'Receita fechada', valor: U.moeda(fechado.valor), nota: fechado.qtd + ' contratos' }) +
          '</div>' +
        '</section>'));

      raiz.appendChild(U.montar(Pecas.nota(
        '<b>Os números desta tela são de demonstração.</b> A casca visual está pronta; ' +
        'a ligação com o banco e com os agentes entra na próxima etapa, toda pelo arquivo <code>js/data.js</code>.'
      )));
    }
  });
})();
