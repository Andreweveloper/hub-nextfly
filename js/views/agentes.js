/* ── SETOR 02 · AGENTES — as quatro tiras, puxadas ──────────── */

(function () {
  'use strict';

  /* A gaveta é o que a tira revela quando é puxada do rack:
     o que o agente entrega, como decide, e o comando pronto
     para colar no Claude Code. */
  function gaveta(a) {
    var pontos = a.pontos.map(function (p) {
      return '<li><span><b>' + U.esc(p[0]) + '</b> — ' + U.esc(p[1]) + '</span></li>';
    }).join('');

    var ferramentas = a.ferramentas.map(function (f) {
      return '<span class="ferramenta">' + U.esc(f) + '</span>';
    }).join('');

    return '' +
      '<div class="gaveta" data-gaveta="' + U.esc(a.id) + '">' +
        '<div class="gaveta__bloco">' +
          '<span class="gaveta__titulo">O que entrega</span>' +
          '<p>' + U.esc(a.entrega) + '</p>' +
          '<span class="gaveta__titulo" style="margin-top:var(--u2)">Como decide</span>' +
          '<ul class="lista-tracos">' + pontos + '</ul>' +
        '</div>' +
        '<div class="gaveta__bloco">' +
          '<span class="gaveta__titulo">Pede antes de começar</span>' +
          '<p style="font-size:13px">' + U.esc(a.pedeAntes) + '</p>' +

          '<span class="gaveta__titulo" style="margin-top:var(--u2)">Chamar agora</span>' +
          '<div class="comando">' +
            '<code>' + U.esc(a.comando) + '</code>' +
            '<button type="button" class="botao" data-copiar="' + U.esc(a.id) + '">Copiar</button>' +
          '</div>' +

          '<span class="gaveta__titulo" style="margin-top:var(--u2)">Ferramentas</span>' +
          '<div class="agente-ferramentas">' + ferramentas + '</div>' +

          '<div style="margin-top:var(--u3)">' +
            '<button type="button" class="botao" data-ligar="' + U.esc(a.id) + '"></button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  Rotas.registrar({
    id: 'agentes',
    cod: '02',
    nome: 'Agentes',

    desenhar: function (raiz) {
      var agentes = Dados.agentes();

      raiz.appendChild(U.montar(Pecas.proa({
        etiqueta: 'Setor 02 · tripulação',
        titulo: 'Agentes',
        legenda: 'Os quatro agentes que já rodam no Claude Code desta máquina, ' +
                 'lidos de ~/.claude/agents. Puxe uma tira para ver o que o agente entrega, ' +
                 'como ele decide e o comando pronto para colar.'
      })));

      var corpo = U.montar('<section class="baia"><div class="rack" id="rack-agentes"></div></section>');
      var rack = U.el('#rack-agentes', corpo);

      agentes.forEach(function (a) {
        var ligado = Estado.agenteLigado(a.id);

        rack.appendChild(U.montar(Tiras.tira({
          botao: true,
          estado: ligado ? a.estado : 'parado',
          codigo: a.codigo,
          codigoSub: a.modelo,
          titulo: a.nome + ' · ' + a.papel,
          tituloSub: ligado ? a.tarefa : 'desligado',
          campos: [
            { valor: a.metrica, rotulo: 'leitura', classe: 'tira__campo--largo' },
            { valor: a.tempo, rotulo: 'em curso', classe: 'tira__campo--tempo' }
          ],
          attrs: ' data-agente="' + U.esc(a.id) + '" aria-expanded="false"' +
                 ' aria-controls="gaveta-' + U.esc(a.id) + '"'
        })));

        var painel = U.montar(gaveta(a));
        painel.id = 'gaveta-' + a.id;
        painel.hidden = true;
        rack.appendChild(painel);
      });

      /* uma gaveta aberta por vez — o rack fica legível */
      U.els('.tira[data-agente]', rack).forEach(function (tira) {
        tira.addEventListener('click', function () {
          var id = tira.getAttribute('data-agente');
          var painel = U.el('#gaveta-' + id, rack);
          var abrindo = painel.hidden;

          U.els('.gaveta', rack).forEach(function (g) { g.hidden = true; });
          U.els('.tira[data-agente]', rack).forEach(function (t) {
            t.setAttribute('aria-expanded', 'false');
          });

          painel.hidden = !abrindo;
          tira.setAttribute('aria-expanded', abrindo ? 'true' : 'false');
        });
      });

      /* copiar o comando do agente */
      U.els('[data-copiar]', rack).forEach(function (botao) {
        botao.addEventListener('click', function (evento) {
          evento.stopPropagation();
          var agente = Dados.agentePorId(botao.getAttribute('data-copiar'));
          if (agente) { U.copiar(agente.comando, 'Comando copiado'); }
        });
      });

      /* ligar e desligar — muda o quadro da Torre também */
      U.els('[data-ligar]', rack).forEach(function (botao) {
        var id = botao.getAttribute('data-ligar');
        var pintar = function () {
          var ligado = Estado.agenteLigado(id);
          botao.textContent = ligado ? 'Desligar agente' : 'Ligar agente';
          botao.setAttribute('aria-pressed', ligado ? 'true' : 'false');
        };
        pintar();
        botao.addEventListener('click', function (evento) {
          evento.stopPropagation();
          var ligado = Estado.alternarAgente(id);
          pintar();
          var tira = U.el('.tira[data-agente="' + id + '"]', rack);
          var agente = Dados.agentePorId(id);
          if (tira && agente) {
            tira.setAttribute('data-estado', ligado ? agente.estado : 'parado');
            var sub = U.els('.tira__sub', tira)[1];
            if (sub) { sub.textContent = ligado ? agente.tarefa : 'desligado'; }
          }
          U.aviso(ligado ? agente.nome + ' ligado' : agente.nome + ' desligado');
        });
      });

      raiz.appendChild(corpo);

      raiz.appendChild(U.montar(Pecas.nota(
        '<b>Ligar e desligar já funciona</b> e fica salvo nesta máquina — o quadro da Torre ' +
        'reflete a mudança. Disparar o agente de verdade a partir do Hub entra quando houver ' +
        'servidor: hoje o botão entrega o comando pronto para colar no Claude Code.'
      )));
    }
  });
})();
