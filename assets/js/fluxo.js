// Navega Seguro — fluxograma "Recebi algo suspeito".
// Os dados vêm de window.FLUXO, window.CENAS, window.ICONES e window.FICHAS (e-agora.html).
(function () {
  var F = window.FLUXO || {};
  var caixa = document.getElementById('fluxo');
  var trilha = document.getElementById('fluxo-trilha');
  if (!caixa || !F.inicio) return;

  var caminho = []; // [{no, resposta}]

  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto) e.textContent = texto;
    return e;
  }
  function svg(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }

  function desenharTrilha(atual) {
    trilha.innerHTML = '';
    var ol = el('ol', { 'class': 'trilha' });
    caminho.forEach(function (passo, i) {
      var li = el('li', { 'class': 'trilha-passo feito' });
      li.appendChild(el('span', { 'class': 'trilha-pergunta' }, F[passo.no].pergunta));
      var b = el('button', { type: 'button', 'class': 'trilha-resposta', 'aria-label': 'Voltar e mudar a resposta: ' + passo.resposta });
      b.textContent = passo.resposta;
      b.addEventListener('click', function () { caminho = caminho.slice(0, i); mostrar(passo.no); });
      li.appendChild(b);
      ol.appendChild(li);
    });
    var agora = el('li', { 'class': 'trilha-passo agora' + (F[atual].titulo ? ' fim' : '') });
    agora.appendChild(el('span', { 'class': 'trilha-pergunta' }, F[atual].titulo ? 'O que fazer' : 'Agora'));
    ol.appendChild(agora);
    trilha.appendChild(ol);
  }

  function mostrar(id) {
    var no = F[id];
    desenharTrilha(id);
    caixa.innerHTML = '';
    var cartao = el('div', { 'class': 'fluxo-cartao' + (no.titulo ? ' resultado' : '') });

    if (no.pergunta) {
      var h = el('h2', { tabindex: '-1' }, no.pergunta);
      cartao.appendChild(h);
      if (no.lista) {
        var ul = el('ul', { 'class': 'fluxo-sinais' });
        no.lista.forEach(function (t) { ul.appendChild(el('li', null, t)); });
        cartao.appendChild(ul);
      }
      var ops = el('div', { 'class': 'fluxo-opcoes' + (no.opcoes[0][1] ? ' com-icone' : '') });
      no.opcoes.forEach(function (op) {
        var b = el('button', { type: 'button', 'class': 'fluxo-opcao' });
        if (op[1] && window.ICONES[op[1]]) b.appendChild(svg(window.ICONES[op[1]]));
        b.appendChild(el('span', null, op[0]));
        b.addEventListener('click', function () { caminho.push({ no: id, resposta: op[0] }); mostrar(op[2]); });
        ops.appendChild(b);
      });
      cartao.appendChild(ops);
    } else {
      var topo = el('div', { 'class': 'fluxo-res-topo' });
      if (no.cena && window.CENAS[no.cena]) topo.appendChild(svg(window.CENAS[no.cena]));
      var h2 = el('h2', { tabindex: '-1' }, no.titulo);
      topo.appendChild(h2);
      cartao.appendChild(topo);
      var ol = el('ol', { 'class': 'fluxo-passos' });
      no.passos.forEach(function (t) { ol.appendChild(el('li', null, t)); });
      cartao.appendChild(ol);
      if (no.fichas.length) {
        var p = el('p', { 'class': 'fluxo-base' }, 'Veja também: ');
        no.fichas.forEach(function (n, i) {
          p.appendChild(el('a', { href: 'pessoa-idosa.html#ficha-' + n }, 'Ficha ' + n + ' – ' + window.FICHAS[n]));
          if (i < no.fichas.length - 1) p.appendChild(document.createTextNode('; '));
        });
        cartao.appendChild(p);
      }
      if (no.ajuda) {
        var pa = el('p', { 'class': 'fluxo-base' });
        pa.appendChild(document.createTextNode('Telefones e canais oficiais: '));
        pa.appendChild(el('a', { href: 'ajuda.html' }, 'Onde buscar ajuda'));
        pa.appendChild(document.createTextNode('.'));
        cartao.appendChild(pa);
      }
      cartao.appendChild(el('p', { 'class': 'fluxo-acolhe' }, 'Golpes acontecem com pessoas de todas as idades. Pedir ajuda é o caminho certo.'));
      var acoes = el('div', { 'class': 'fluxo-acoes' });
      var de = el('button', { type: 'button', 'class': 'botao cheio' }, 'Começar de novo');
      de.addEventListener('click', function () { caminho = []; mostrar('inicio'); });
      acoes.appendChild(de);
      cartao.appendChild(acoes);
    }

    if (caminho.length) {
      var volta = el('button', { type: 'button', 'class': 'botao fluxo-voltar' }, 'Voltar');
      volta.addEventListener('click', function () { var ult = caminho.pop(); mostrar(ult.no); });
      cartao.appendChild(volta);
    }
    caixa.appendChild(cartao);
    var foco = cartao.querySelector('h2');
    if (caminho.length || id !== 'inicio') foco.focus();
  }

  mostrar('inicio');
})();
