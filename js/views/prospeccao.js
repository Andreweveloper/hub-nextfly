/* ── SETOR 03 · PROSPECÇÃO — o que o Cais 47 encontrou ────── */

(function () {
  'use strict';

  var CICLO = ['novo', 'enviado', 'respondeu', 'fechado'];
  var NOME_SITUACAO = {
    novo: 'novo',
    enviado: 'enviado',
    respondeu: 'respondeu',
    fechado: 'fechado'
  };

  function proxima(situacao) {
    var i = CICLO.indexOf(situacao);
    return CICLO[(i + 1) % CICLO.length];
  }

  Rotas.registrar({
    id: 'prospeccao',
    cod: '03',
    nome: 'Prospecção',

    desenhar: function (raiz) {
      var cidades = Dados.cidades();
      var leads = Dados.leads();

      var total = cidades.reduce(function (t, c) { return t + c.leads; }, 0);
      var semSite = cidades.reduce(function (t, c) { return t + c.semSite; }, 0);

      raiz.appendChild(U.montar(Pecas.proa({
        etiqueta: 'Setor 03 · caça de lead',
        titulo: 'Prospecção',
        legenda: 'Comércios que atendem hoje, aparecem no Google Maps e não têm site. ' +
                 'O prospector-local varre a matriz nicho × cidade e o Cais 47 é onde a ' +
                 'situação de cada um é marcada.',
        acoes: '<a class="botao" href="http://localhost:8003" target="_blank" rel="noopener">Abrir Cais 47</a>' +
               '<button type="button" class="botao botao--acento" data-varrer>Nova varredura</button>'
      })));

      raiz.appendChild(U.montar('' +
        '<div class="grade">' +
          Pecas.instrumento({ rotulo: 'Comércios varridos', valor: U.num(total), nota: '5 cidades do litoral' }) +
          Pecas.instrumento({ rotulo: 'Sem site', valor: U.num(semSite), nota: U.pct(semSite, total) + '% do total', acento: true }) +
          Pecas.instrumento({ rotulo: 'Abordados', valor: '218', nota: 'mensagem enviada' }) +
          Pecas.instrumento({ rotulo: 'Responderam', valor: '74', nota: '34% dos abordados' }) +
        '</div>'));

      /* ── Placar de leads + mapa das cidades ─────────────── */

      var corpo = U.montar('' +
        '<div class="grade grade--larga">' +
          '<section class="baia">' +
            '<div class="baia__topo">' +
              '<h2 class="baia__rotulo">Leads recentes</h2>' +
              '<div class="barra-filtro">' +
                '<label class="busca">' +
                  '<span class="so-leitor">Buscar lead</span>' +
                  '<svg class="busca__icone" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
                    '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/>' +
                  '</svg>' +
                  '<input class="campo" type="search" placeholder="nome, ramo ou cidade" data-busca>' +
                '</label>' +
              '</div>' +
            '</div>' +
            '<div class="placar-envelope">' +
              '<table class="placar">' +
                '<thead><tr>' +
                  '<th>Comércio</th><th>Ramo</th><th>Cidade</th><th>Telefone</th><th>Situação</th>' +
                '</tr></thead>' +
                '<tbody data-corpo></tbody>' +
              '</table>' +
              '<p class="placar__vazio" data-vazio hidden>Nenhum lead com esse termo.</p>' +
            '</div>' +
          '</section>' +

          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Cidades</h2></div>' +
            '<div class="placa">' +
              '<div class="mapa-cidades">' +
                cidades.map(function (c) {
                  return '<div class="cidade">' +
                    '<div>' +
                      '<div class="cidade__nome">' + U.esc(c.nome) + '</div>' +
                      '<div class="trilho" style="--cor-trilho:var(--magenta)">' +
                        '<span style="width:' + U.pct(c.semSite, c.leads) + '%"></span>' +
                      '</div>' +
                      '<div class="etiqueta" style="margin-top:5px">' +
                        U.num(c.semSite) + ' sem site de ' + U.num(c.leads) +
                      '</div>' +
                    '</div>' +
                    '<div class="cidade__num">' + U.pct(c.semSite, c.leads) + '%</div>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>');

      var tbody = U.el('[data-corpo]', corpo);
      var vazio = U.el('[data-vazio]', corpo);
      var busca = U.el('[data-busca]', corpo);

      function pintar(termo) {
        var filtro = (termo || '').trim().toLowerCase();
        var visiveis = leads.filter(function (l) {
          if (!filtro) { return true; }
          return (l.nome + ' ' + l.ramo + ' ' + l.cidade).toLowerCase().indexOf(filtro) !== -1;
        });

        tbody.innerHTML = visiveis.map(function (l) {
          var situacao = Estado.situacaoLead(l.nome, l.estado);
          return '<tr>' +
            '<td class="forte">' + U.esc(l.nome) + '</td>' +
            '<td class="discreto">' + U.esc(l.ramo) + '</td>' +
            '<td class="discreto">' + U.esc(l.cidade) + '</td>' +
            '<td class="num discreto">' + U.esc(l.fone) + '</td>' +
            '<td>' +
              '<button type="button" class="estado-lead" data-e="' + U.esc(situacao) + '" ' +
                'data-lead="' + U.esc(l.nome) + '" ' +
                'title="Clique para avançar a situação">' +
                U.esc(NOME_SITUACAO[situacao] || situacao) +
              '</button>' +
            '</td>' +
          '</tr>';
        }).join('');

        vazio.hidden = visiveis.length > 0;

        U.els('[data-lead]', tbody).forEach(function (botao) {
          botao.addEventListener('click', function () {
            var nome = botao.getAttribute('data-lead');
            var lead = leads.filter(function (l) { return l.nome === nome; })[0];
            var nova = proxima(Estado.situacaoLead(nome, lead.estado));
            Estado.definirLead(nome, nova);
            botao.setAttribute('data-e', nova);
            botao.textContent = NOME_SITUACAO[nova];
            U.aviso(nome + ' → ' + NOME_SITUACAO[nova]);
          });
        });
      }

      pintar('');
      busca.addEventListener('input', function () { pintar(busca.value); });

      raiz.appendChild(corpo);

      var botaoVarrer = U.el('[data-varrer]', raiz);
      if (botaoVarrer) {
        botaoVarrer.addEventListener('click', function () {
          U.copiar(
            'Use o agente prospector-local para varrer [NICHO] em [CIDADE] e publicar no Cais 47.',
            'Comando de varredura copiado'
          );
        });
      }

      raiz.appendChild(U.montar(Pecas.nota(
        '<b>A situação de cada lead já é sua e fica salva</b> nesta máquina. ' +
        'A varredura de verdade ainda roda pelo prospector-local no Claude Code — o botão ' +
        'copia o comando. Ligar o disparo direto do Hub exige o painel em ' +
        '<code>localhost:8003</code> no ar.'
      )));
    }
  });
})();
