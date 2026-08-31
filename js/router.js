/* ────────────────────────────────────────────────
   Navegação por hash — funciona abrindo o arquivo direto
   (file://), sem servidor. Cada setor se registra e devolve
   o seu próprio HTML.
   ──────────────────────────────────────────────── */

window.Rotas = (function () {
  'use strict';

  var setores = [];
  var atual = null;

  function registrar(setor) {
    setores = setores.concat(setor);
  }

  function lista() { return setores; }

  function porId(id) {
    return setores.filter(function (s) { return s.id === id; })[0] || null;
  }

  function idDoEndereco() {
    var bruto = (window.location.hash || '').replace(/^#\/?/, '').trim();
    return porId(bruto) ? bruto : (setores[0] ? setores[0].id : null);
  }

  function ir(id) {
    window.location.hash = '#/' + id;
  }

  function desenhar() {
    var id = idDoEndereco();
    var setor = porId(id);
    var cabine = U.el('#cabine');
    if (!setor || !cabine) { return; }

    atual = id;
    cabine.innerHTML = '';

    var vista = U.montar('<div class="setor-vista"></div>');
    vista.setAttribute('data-setor', id);
    document.documentElement.setAttribute('data-setor', id);
    setor.desenhar(vista);
    cabine.appendChild(vista);

    U.encaixar(vista);
    marcarNavegacao(id);
    document.title = setor.nome + ' · Nextfly Torre';
    cabine.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function marcarNavegacao(id) {
    U.els('.setor').forEach(function (botao) {
      var ativo = botao.getAttribute('data-ir') === id;
      if (ativo) {
        botao.setAttribute('aria-current', 'page');
      } else {
        botao.removeAttribute('aria-current');
      }
    });
  }

  function iniciar() {
    window.addEventListener('hashchange', desenhar);
    if (!window.location.hash) {
      window.location.replace('#/' + (setores[0] ? setores[0].id : ''));
    }
    desenhar();
  }

  return {
    registrar: registrar,
    lista: lista,
    porId: porId,
    ir: ir,
    atual: function () { return atual; },
    redesenhar: desenhar,
    iniciar: iniciar
  };
})();
