/* ── SETOR 04 · SITE — o institucional da Nextfly ─────────── */

(function () {
  'use strict';

  var COR_ESTADO = {
    ativo: 'var(--ativo)',
    espera: 'var(--espera)',
    parado: 'var(--parado)',
    erro: 'var(--erro)'
  };

  var TEXTO_ESTADO = {
    ativo: 'no ar',
    espera: 'em rascunho',
    parado: 'fora do ar',
    erro: 'com erro'
  };

  Rotas.registrar({
    id: 'site',
    cod: '04',
    nome: 'Site',

    desenhar: function (raiz) {
      var site = Dados.site();
      var noAr = site.paginas.filter(function (p) { return p.estado === 'ativo'; }).length;

      raiz.appendChild(U.montar(Pecas.proa({
        etiqueta: 'Setor 04 · vitrine',
        titulo: 'Site',
        legenda: 'O institucional que traz o lead que não veio da varredura. ' +
                 'Hoje roda local; o domínio e a hospedagem entram junto com a VPS.',
        acoes: '<button type="button" class="botao" data-abrir>Abrir local</button>'
      })));

      raiz.appendChild(U.montar('' +
        '<div class="grade">' +
          Pecas.instrumento({ rotulo: 'Domínio', valor: site.dominio, nota: 'ainda não apontado' }) +
          Pecas.instrumento({ rotulo: 'Páginas no ar', valor: noAr + ' / ' + site.paginas.length, nota: 'no ambiente local' }) +
          Pecas.instrumento({ rotulo: 'Hospedagem', valor: 'local', nota: site.hospedagem }) +
          Pecas.instrumento({ rotulo: 'Último deploy', valor: '—', nota: site.ultimoDeploy, acento: true }) +
        '</div>'));

      raiz.appendChild(U.montar('' +
        '<div class="grade grade--larga">' +
          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Páginas</h2></div>' +
            '<div class="placa">' +
              site.paginas.map(function (p) {
                return '<div class="pagina-linha">' +
                  '<span class="pagina-linha__marca" style="--cor-marca:' + COR_ESTADO[p.estado] + '"></span>' +
                  '<span>' +
                    '<span class="pagina-linha__rota">' + U.esc(p.rota) + '</span>' +
                    '<span class="discreto" style="font-size:12px"> · ' + U.esc(p.nome) + '</span>' +
                  '</span>' +
                  '<span class="etiqueta">' + U.esc(TEXTO_ESTADO[p.estado]) + '</span>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</section>' +

          '<section class="baia">' +
            '<div class="baia__topo"><h2 class="baia__rotulo">Para publicar</h2></div>' +
            '<div class="placa">' +
              '<ul class="lista-tracos">' +
                '<li><span><b>VPS contratada</b> — servidor onde o Hub e o site vão morar.</span></li>' +
                '<li><span><b>Domínio apontado</b> — DNS de nextfly.com.br para o IP da VPS.</span></li>' +
                '<li><span><b>Certificado</b> — HTTPS antes de qualquer formulário ir ao ar.</span></li>' +
                '<li><span><b>Banco</b> — para o Hub parar de ler dado fixo e passar a ler o real.</span></li>' +
                '<li><span><b>Página /orçamento</b> — hoje fora do ar, é a que converte.</span></li>' +
              '</ul>' +
            '</div>' +
          '</section>' +
        '</div>'));

      var abrir = U.el('[data-abrir]', raiz);
      if (abrir) {
        abrir.addEventListener('click', function () {
          U.aviso('O site local ainda não tem endereço definido');
        });
      }

      raiz.appendChild(U.montar(Pecas.nota(
        '<b>Esta tela é o painel do site, não o site.</b> Quando a VPS existir, ' +
        'o estado de cada página passa a vir do servidor e o botão de deploy fica de verdade.'
      )));
    }
  });
})();
