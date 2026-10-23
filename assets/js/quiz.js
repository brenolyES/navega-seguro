// Navega Seguro — quiz "Mito ou Verdade?". As perguntas vêm de window.QUIZ (quiz.html).
(function () {
  var dados = window.QUIZ || [];
  var caixa = document.getElementById('quiz');
  if (!caixa || !dados.length) return;

  var atual = 0;
  var acertos = 0;

  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto) e.textContent = texto;
    return e;
  }

  function mostrarPergunta() {
    var q = dados[atual];
    caixa.innerHTML = '';
    caixa.appendChild(el('p', { 'class': 'quiz-progresso' }, 'Pergunta ' + (atual + 1) + ' de ' + dados.length));
    var titulo = el('h2', { 'class': 'quiz-afirmacao', tabindex: '-1' }, q.afirmacao);
    caixa.appendChild(titulo);
    caixa.appendChild(el('p', null, 'Isso é mito ou verdade?'));

    var opcoes = el('div', { 'class': 'quiz-opcoes' });
    ['Mito', 'Verdade'].forEach(function (op) {
      var b = el('button', { type: 'button', 'class': 'b-' + op.toLowerCase() }, op);
      b.addEventListener('click', function () { responder(op, b); });
      opcoes.appendChild(b);
    });
    caixa.appendChild(opcoes);
    caixa.appendChild(el('div', { 'class': 'quiz-retorno', 'aria-live': 'polite' }));
    if (atual > 0) titulo.focus();
  }

  function responder(escolha, botao) {
    var q = dados[atual];
    var certo = escolha === q.resposta;
    if (certo) acertos++;
    caixa.querySelectorAll('.quiz-opcoes button').forEach(function (b) { b.disabled = true; });
    botao.classList.add('escolhida');

    var ret = caixa.querySelector('.quiz-retorno');
    var v = el('p', { 'class': 'veredito ' + (certo ? 'certo' : 'errado') },
      (certo ? 'Isso mesmo! ' : 'Não é bem assim. ') + 'É ' + q.resposta.toLowerCase() + '.');
    ret.appendChild(v);
    ret.appendChild(el('p', null, q.explicacao));
    ret.appendChild(el('p', { 'class': 'quiz-fonte' }, 'Base: ' + q.fonte));

    var ultimo = atual === dados.length - 1;
    var prox = el('button', { type: 'button', 'class': 'botao cheio' }, ultimo ? 'Ver resultado' : 'Próxima pergunta');
    prox.addEventListener('click', function () {
      if (ultimo) mostrarResultado(); else { atual++; mostrarPergunta(); }
    });
    ret.appendChild(prox);
    prox.focus();
  }

  function mostrarResultado() {
    caixa.innerHTML = '';
    var t = el('h2', { 'class': 'quiz-afirmacao', tabindex: '-1' }, 'Você acertou ' + acertos + ' de ' + dados.length + '.');
    caixa.appendChild(t);
    caixa.appendChild(el('p', null, acertos === dados.length
      ? 'Parabéns! Continue atento: os golpes mudam o tempo todo.'
      : 'Leia as dicas do guia e tente de novo quando quiser. Errar aqui faz parte do aprendizado.'));
    var acoes = el('div', { 'class': 'quiz-fim' });
    var de = el('button', { type: 'button', 'class': 'botao cheio' }, 'Fazer de novo');
    de.addEventListener('click', function () { atual = 0; acertos = 0; mostrarPergunta(); caixa.querySelector('h2').focus(); });
    acoes.appendChild(de);
    acoes.appendChild(el('a', { href: 'pessoa-idosa.html', 'class': 'botao' }, 'Ver as dicas'));
    caixa.appendChild(acoes);
    t.focus();
  }

  mostrarPergunta();
})();
