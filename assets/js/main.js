// Navega Seguro — tamanho da letra, alto contraste e impressão.
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');
  var ESCALAS = [87.5, 100, 115, 130, 150];

  var guarda = {
    ler: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    gravar: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } }
  };

  var nivel = parseInt(guarda.ler('ns-letra'), 10);
  if (!(nivel >= 0 && nivel < ESCALAS.length)) nivel = 1;
  var contraste = guarda.ler('ns-contraste') === '1';

  function aplicar() {
    raiz.style.setProperty('--escala', ESCALAS[nivel] + '%');
    if (contraste) raiz.setAttribute('data-tema', 'contraste');
    else raiz.removeAttribute('data-tema');
  }
  aplicar();

  document.addEventListener('DOMContentLoaded', function () {
    var menor = document.getElementById('letra-menor');
    var maior = document.getElementById('letra-maior');
    var btnContraste = document.getElementById('contraste');
    var imprimir = document.getElementById('imprimir');
    var aviso = document.getElementById('aviso-ferramentas');

    function anunciar(txt) { if (aviso) aviso.textContent = txt; }
    function atualizarBotoes() {
      if (menor) menor.disabled = nivel === 0;
      if (maior) maior.disabled = nivel === ESCALAS.length - 1;
      if (btnContraste) btnContraste.setAttribute('aria-pressed', contraste ? 'true' : 'false');
    }
    atualizarBotoes();

    if (menor) menor.addEventListener('click', function () {
      if (nivel > 0) { nivel--; guarda.gravar('ns-letra', nivel); aplicar(); atualizarBotoes(); anunciar('Letra diminuída'); }
    });
    if (maior) maior.addEventListener('click', function () {
      if (nivel < ESCALAS.length - 1) { nivel++; guarda.gravar('ns-letra', nivel); aplicar(); atualizarBotoes(); anunciar('Letra aumentada'); }
    });
    if (btnContraste) btnContraste.addEventListener('click', function () {
      contraste = !contraste; guarda.gravar('ns-contraste', contraste ? '1' : '0'); aplicar(); atualizarBotoes();
      anunciar(contraste ? 'Alto contraste ligado' : 'Alto contraste desligado');
    });
    if (imprimir) imprimir.addEventListener('click', function () { window.print(); });

    var abrir = document.getElementById('abrir-menu');
    var menu = document.getElementById('menu-principal');
    if (abrir && menu) abrir.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      abrir.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      abrir.querySelector('.menu-dica').textContent = aberto ? 'Toque aqui para fechar' : 'Toque aqui para abrir';
    });
  });

  // Na impressão, mostra o conteúdo de todos os "Ver os estudos".
  var fechados = [];
  window.addEventListener('beforeprint', function () {
    fechados = Array.prototype.filter.call(document.querySelectorAll('details'), function (d) { return !d.open; });
    fechados.forEach(function (d) { d.open = true; });
  });
  window.addEventListener('afterprint', function () {
    fechados.forEach(function (d) { d.open = false; });
    fechados = [];
  });
})();
