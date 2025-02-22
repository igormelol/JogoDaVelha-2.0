(() => {
    const TEXTO_USUARIO_X = '⛹🏾‍♂️ X :  ';
    const TEXTO_USUARIO_O = '⛹🏾‍♀️ O :  ';

    let jogadorAtual = {};
    let jogadas = [];
    let emJogo = false;

    let jogo = {
        jogada1: document.querySelector('.jogo-velha-1'),
        jogada2: document.querySelector('.jogo-velha-2'),
        jogada3: document.querySelector('.jogo-velha-3'),
        jogada4: document.querySelector('.jogo-velha-4'),
        jogada5: document.querySelector('.jogo-velha-5'),
        jogada6: document.querySelector('.jogo-velha-6'),
        jogada7: document.querySelector('.jogo-velha-7'),
        jogada8: document.querySelector('.jogo-velha-8'),
        jogada9: document.querySelector('.jogo-velha-9')
    }

    let jogadorX = {
        nome: '',
        valor: 'X',
        pontos: 0
    }

    let jogadorO = {
        nome: '',
        valor: 'O',
        pontos: 0
    }

    const painel = {
        painelOpcoesJogo: document.querySelector('.painel-opcoes'),
        nomeX: document.getElementById('painel-usuario-x-nome'),
        nomeO: document.getElementById('painel-usuario-o-nome'),
        pontosX: document.getElementById('painel-usuario-x-pontos'),
        pontosO: document.getElementById('painel-usuario-o-pontos'),
        nomeProximoJogador: document.getElementById('proximo-jogador')
    };

    const opcoes = {
        divOpcoesJogo: document.querySelector('.opcoes-jogo'),
        usuarioX: document.getElementById('usuario-x'),
        usuarioO: document.getElementById('usuario-o'),
        btnJogar: document.getElementById('btn-jogar'),
        btnReset: document.getElementById('btn-reset'),
        btnTheme: document.getElementById('btn-theme')
    };

    const modal = {
        overlay: document.querySelector('.modal-overlay'),
        vitoria: document.querySelector('.modal-vitoria'),
        vencedor: document.querySelector('.vencedor-nome'),
        btnContinuar: document.querySelector('.continuar'),
        btnReiniciar: document.querySelector('.reiniciar')
    };

    // Remover as funções duplicadas do modal e manter apenas estas versões
    // Corrigir as funções do modal para usar as referências corretas
    // Remover as funções duplicadas e corrigir as referências
    function confirmarReset() {
        if (confirm('Deseja reiniciar o jogo?')) {
            _resetPontos();
            _reiniciarJogo();
            _voltarTelaInicial();
        }
    }

    // Corrigir as funções do modal
    function mostrarModal(mensagem) {
        modal.vencedor.textContent = mensagem;
        modal.overlay.classList.remove('esconder');
        emJogo = false;
    }

    function continuarJogo() {
        modal.overlay.classList.add('esconder');
        emJogo = true;
        _reiniciarJogo();
    }

    function reiniciarJogoCompleto() {
        modal.overlay.classList.add('esconder');
        _resetPontos();
        _reiniciarJogo();
        _voltarTelaInicial();
    }

    // Event Listeners
    for (let i = 1; i <= 9; i++) {
        jogo[`jogada${i}`].addEventListener('click', (e) => fazerJogada(e, i - 1));
    }

    opcoes.btnJogar.addEventListener('click', iniciarJogo);
    opcoes.btnReset.addEventListener('click', confirmarReset);
    opcoes.btnTheme.addEventListener('click', alternarTema);
    modal.btnContinuar.addEventListener('click', continuarJogo);
    modal.btnReiniciar.addEventListener('click', reiniciarJogoCompleto);

    // Funções principais
    function verificarVitoria() {
        const combinacoes = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
    
        for (let [a, b, c] of combinacoes) {
            if (jogadas[a] && jogadas[a] === jogadas[b] && jogadas[a] === jogadas[c]) {
                _atualizarPainel();
                mostrarModal(`${jogadorAtual.nome} venceu!`);
                emJogo = false; // Encerra o jogo
                return true;
            }
        }
        return false;
    }

    function fazerJogada(e, indice) {
        if (!emJogo || e.target.textContent) return;
    
        e.target.textContent = jogadorAtual.valor;
        e.target.classList.add('jogada');
        jogadas[indice] = jogadorAtual.valor;
    
        if (verificarVitoria()) return;
    
        if (jogadas.filter(Boolean).length === 9) {
            mostrarModal('Deu velha!');
            emJogo = false; // Encerra o jogo em caso de empate
            return;
        }
    
        jogadorAtual = jogadorAtual === jogadorX ? jogadorO : jogadorX;
        painel.nomeProximoJogador.textContent = jogadorAtual.nome;
    }

    // Funções de controle
    function iniciarJogo() {
        if (!validarNomes()) return;
    
        jogadorX.nome = opcoes.usuarioX.value.trim();
        jogadorO.nome = opcoes.usuarioO.value.trim();
        emJogo = true;
        jogadorAtual = jogadorX;
    
        atualizarInterface();
        _reiniciarJogo();
    }

    function alternarTema() {
        const btnTheme = opcoes.btnTheme;
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
        btnTheme.textContent = isLight ? '☀️' : '🌙';
    }

    // Funções auxiliares
    function validarNomes() {
        if (!opcoes.usuarioX.value.trim() || !opcoes.usuarioO.value.trim()) {
            alert('Por favor, insira os nomes dos jogadores!');
            return false;
        }
        return true;
    }

    function alternarJogador() {
        jogadorAtual = jogadorAtual === jogadorX ? jogadorO : jogadorX;
        painel.nomeProximoJogador.textContent = jogadorAtual.nome;
    }

    function atualizarInterface() {
        painel.nomeX.textContent = TEXTO_USUARIO_X + jogadorX.nome;
        painel.nomeO.textContent = TEXTO_USUARIO_O + jogadorO.nome;
        painel.nomeProximoJogador.textContent = jogadorAtual.nome;
        opcoes.divOpcoesJogo.classList.add('esconder');
        painel.painelOpcoesJogo.classList.remove('esconder');
    }

    // Funções internas
    function _reiniciarJogo() {
        jogadas = [];
        for (let i = 1; i <= 9; i++) {
            jogo[`jogada${i}`].textContent = '';
            jogo[`jogada${i}`].classList.remove('jogada');
        }
    }

    function _resetPontos() {
        jogadorX.pontos = 0;
        jogadorO.pontos = 0;
        painel.pontosX.textContent = '0';
        painel.pontosO.textContent = '0';
    }

    function _atualizarPainel() {
        jogadorAtual.pontos += 1;
        if (jogadorAtual.valor === 'X') {
            painel.pontosX.textContent = jogadorAtual.pontos;
        } else {
            painel.pontosO.textContent = jogadorAtual.pontos;
        }
    }

    function _voltarTelaInicial() {
        emJogo = false;
        jogadorAtual = {};
        jogadorX.nome = '';
        jogadorO.nome = '';
        opcoes.usuarioX.value = '';
        opcoes.usuarioO.value = '';
        painel.painelOpcoesJogo.classList.add('esconder');
        opcoes.divOpcoesJogo.classList.remove('esconder');
    }
})();