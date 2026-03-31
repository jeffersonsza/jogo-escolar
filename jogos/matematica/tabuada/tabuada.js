function carregarCSSTabuada() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/tabuada/tabuada.css';
    document.head.appendChild(link);
}

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let baseTimeLimit = 26;
let correctAnswer = null;
let currentLevel = 1;
let currentMultiplier = 2;
let currentValue = null;
let gameActive = false;
let remainingCards = 20;
let remainingTime = null;
let score = 0;
let timeLimit = 26;
let timerInterval = null;
let totalQuestions = 20;
let nivelConfigurado = 1;
let tempoConfigurado = 26;
let pageVisible = true;
let timeWhenHidden = 0;
let abaTrocada = false;
const SAVE_KEY = 'tabuada_game_state';
const STATS_KEY = 'tabuada_statistics';
const MAX_HISTORICO = 100;
const MIN_RESPOSTAS_PARA_SALVAR = 10;

// Variáveis de estatísticas
let questionStartTime = null;
let questionStats = [];
let currentQuestionNumber = 0;

// Variáveis de identificação do aluno
let alunoAno = null;
let alunoLetra = null;
let alunoNumero = null;
const ANOS = ['6º', '7º', '8º', '9º'];
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const NUMEROS = Array.from({ length: 40 }, (_, i) => (i + 1).toString());

// ============================================
// CONSTANTES PARA RECUPERAÇÃO DE JOGO
// ============================================
const TEMPO_MAXIMO_RECUPERACAO = 7 * 60 * 1000; // 3 minutos em milissegundos

// Elementos do DOM
let elements = null;
let levelConfigs = null;



// ============================================
// CONFIGURAÇÕES DE NÍVEL
// ============================================
function configurarNiveis() {
    levelConfigs = {
        1: { multipliers: [2], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 2" },
        2: { multipliers: [3], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 3" },
        3: { multipliers: [4], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 4" },
        4: { multipliers: [6], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 6" },
        5: { multipliers: [7], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 7" },
        6: { multipliers: [8], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 8" },
        7: { multipliers: [9], totalCards: 20, timeMultiplier: 1, description: "Tabuada do 9" },
        8: { multipliers: [2, 3, 4], totalCards: 40, timeMultiplier: 2, description: "Tabuadas do 2, 3 e 4" },
        9: { multipliers: [6, 7, 8], totalCards: 40, timeMultiplier: 2, description: "Tabuadas do 6, 7 e 8" },
        10: { multipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], totalCards: 50, timeMultiplier: 2.5, description: "Todas as tabuadas" }
    };
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================
export function iniciarJogoTabuada() {
    carregarCSSTabuada();
    
    document.body.innerHTML = ` 
    <div class="jogo-container">
        <div class="btncontainer">
            <button id="restart-btn" class="btn btn-warning hidden">🔄 Reiniciar</button>
            <button id="vptabuada-btn" class="btn btn-warning hidden">Voltar para tabuada</button>
            <button class="voltar menor">Voltar para jogos</button>
        </div>
        
        <div class="container">
            <!-- TELA DE BOAS-VINDAS COM IDENTIFICAÇÃO -->
            <div class="screen" id="welcome-screen">
                <h1>Bem vindo ao jogo da tabuada</h1>
                
                <!-- IDENTIFICAÇÃO DO ALUNO -->
                <div class="aluno-identificacao">
                    <h3>📋 Identifique-se</h3>
                    
                    <div class="selector-row">
                        <div class="selector-group">
                            <label>Ano:</label>
                            <div class="selector-buttons" id="ano-selector">
                                ${ANOS.map(ano => `<button class="ano-btn" data-ano="${ano}">${ano}</button>`).join('')}
                            </div>
                        </div>
                        
                        <div class="selector-group">
                            <label>Turma:</label>
                            <div class="selector-buttons" id="letra-selector" style="display: none;">
                                ${LETRAS.map(letra => `<button class="letra-btn" data-letra="${letra}">${letra}</button>`).join('')}
                            </div>
                        </div>
                        
                        <div class="selector-group">
                            <label>N° Chamada:</label>
                            <div class="selector-buttons" id="numero-selector" style="display: none;">
                                <div class="numero-grid">
                                    ${NUMEROS.map(num => `<button class="numero-btn" data-numero="${num}">${num}</button>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="aluno-info" class="aluno-info" style="display: none;">
                        ✅ Aluno: <span id="aluno-ano-display"></span> <span id="aluno-letra-display"></span> - N° <span id="aluno-numero-display"></span>
                    </div>
                </div>
                
                <div class="instructions">
                    <p>Acerte as tabuadas antes que o tempo acabe e passe de nível</p>
                    <p>Vai aparecer a tabuada correspondente ao nível do lado esquerdo e no lado direito a carta que o baralho irá virar</p>
                    <p>Abaixo, escolha a alternativa correta</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
                    <button class="btn" id="start-btn">Começar</button>
                    <button class="btn btn-config" id="config-btn">⚙️ Configurar</button>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
                    <button class="btn btn-stats" id="view-stats-btn">📊 Ver Estatísticas</button>
                </div>
                
                <div id="config-indicator" style="display: none; color: #28a745; font-weight: bold; margin-top: 10px;">
                    Nível: <span id="selected-level">1</span> | 
                    Tempo: <span id="selected-time">26</span>s por questão
                </div>
            </div>
            
            <!-- TELA DO JOGO -->
            <div class="screen hidden" id="game-screen">
                <div class="game-info">
                    <div class="info-box">
                        <div class="info-label">Acertos</div>
                        <div class="info-value" id="score">0/20</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">Tempo</div>
                        <div class="info-value" id="time">25s</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">Nível</div>
                        <div class="info-value" id="level-display">1</div>
                    </div>
                </div>
                
                <div class="timer">
                    <div class="timer-progress" id="timer-progress"></div>
                </div>
                
                <p class="info-label" id="level-description">Nível 1: Tabuada do 2</p>
                
                <div class="game-area">
                    <div class="fixed-card" id="fixed-card">2</div>
                    <div class="operation">×</div>
                    <div class="current-card" id="current-number">?</div>
                    <div class="operation">=</div>
                    <div class="current-card" id="result">?</div>
                    
                    <div class="deck-container">
                        <div class="deck" id="deck">
                            <div>20</div>
                        </div>
                    </div>
                </div>
                
                <div class="options" id="options"></div>
            </div>

            <!-- TELA DE RESULTADO -->
            <div class="screen hidden" id="result-screen">
                <h2 class="result-title" id="result-message">Parabéns!</h2>
                <p class="result-stats" id="result-stats">Você acertou 20 de 20 cartas!</p>
                <div class="result-buttons">
                    <button class="btn" id="play-again">Jogar Novamente</button>
                    <button class="btn btn-success" id="next-level">Próximo Nível</button>
                    <button class="btn btn-stats" id="view-level-stats">📊 Estatísticas deste jogo</button>
                </div>
            </div>
            
            <!-- TELA DE ESTATÍSTICAS DO JOGO -->
            <div class="screen hidden" id="stats-screen">
                <h2 class="stats-title">📊 Estatísticas do Nível <span id="stats-level">1</span></h2>
                
                <div class="stats-summary">
                    <div class="stats-box">
                        <div class="stats-label">Total de Questões</div>
                        <div class="stats-value" id="stats-total">20</div>
                    </div>
                    <div class="stats-box">
                        <div class="stats-label">Acertos</div>
                        <div class="stats-value" id="stats-correct">15</div>
                    </div>
                    <div class="stats-box">
                        <div class="stats-label">Erros</div>
                        <div class="stats-value" id="stats-wrong">5</div>
                    </div>
                    <div class="stats-box">
                        <div class="stats-label">Tempo Médio</div>
                        <div class="stats-value" id="stats-avg-time">1.2s</div>
                    </div>
                </div>
                
                <div class="stats-legend">
                    <div class="legend-item"><div class="legend-color" style="background: #28a745;"></div><span>Acerto rápido</span></div>
                    <div class="legend-item"><div class="legend-color" style="background: #17a2b8;"></div><span>Acerto médio</span></div>
                    <div class="legend-item"><div class="legend-color" style="background: #ffc107;"></div><span>Acerto lento</span></div>
                    <div class="legend-item"><div class="legend-color" style="background: #dc3545;"></div><span>Erro</span></div>
                </div>
                
                <div class="stats-list" id="stats-list"></div>
                
                <div class="stats-buttons">
                    <button class="btn" id="back-to-result-stats">← Voltar para Resultado</button>
                    <button class="btn" id="back-to-history-stats">← Voltar para Histórico</button>
                </div>
            </div>
            
            <!-- TELA DE HISTÓRICO COMPLETO -->
            <div class="screen hidden" id="history-screen">
                <h2 class="stats-title">📚 Histórico de Jogos</h2>
                
                <div class="history-list" id="history-list"></div>
                
                <div class="stats-buttons">
                    <button class="btn" id="back-to-welcome">Voltar ao Menu</button>
                    <button class="btn btn-warning" id="clear-history-btn">🗑️ Limpar Histórico</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL PARA SENHA -->
    <div id="password-modal" class="modal hidden">
        <div class="modal-content">
            <h3>🔒 Configurações Especiais</h3>
            <p>Digite a senha para acessar as configurações:</p>
            <input type="password" id="password-input" placeholder="Digite a senha" class="password-input">
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button class="btn" id="confirm-password">Confirmar</button>
                <button class="btn btn-warning" id="cancel-password">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- MODAL PARA CONFIGURAÇÕES -->
    <div id="config-modal" class="modal hidden">
        <div class="modal-content" style="max-width: 500px;">
            <h3>⚙️ Configurações do Jogo</h3>
            
            <div style="margin: 20px 0;">
                <h4 style="margin-bottom: 10px;">Selecionar Nível Inicial (1-10):</h4>
                <div class="level-buttons">
                    ${Array.from({ length: 10 }, (_, i) => `
                        <button class="level-btn" data-level="${i + 1}">${i + 1}</button>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin: 20px 0;">
                <h4 style="margin-bottom: 10px;">Configurar Tempo por Questão:</h4>
                <div style="display: flex; align-items: center; gap: 15px; justify-content: center;">
                    <button id="decrease-time" class="time-control-btn">-</button>
                    <input type="number" id="time-input" min="5" max="120" value="26" class="time-input">
                    <button id="increase-time" class="time-control-btn">+</button>
                    <span style="font-size: 16px; color: #666;">segundos</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; margin: 25px 0 10px;">
                <button class="btn btn-success" id="apply-config">Aplicar Configurações</button>
                <button class="btn btn-warning" id="cancel-config">Cancelar</button>
            </div>
        </div>
    </div>
    `;

    setTimeout(() => { init(); }, 100);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
function init() {
    configurarNiveis();
    configurarElementosDOM();
    configurarEventListeners();
    configurarSeletoresAluno();
    setupVisibilityDetection();
    window.tabuada = { currentLevel, score, remainingTime, gameActive };
}

function configurarElementosDOM() {
    elements = {
        welcomeScreen: document.getElementById('welcome-screen'),
        gameScreen: document.getElementById('game-screen'),
        resultScreen: document.getElementById('result-screen'),
        statsScreen: document.getElementById('stats-screen'),
        historyScreen: document.getElementById('history-screen'),
        scoreElement: document.getElementById('score'),
        timeElement: document.getElementById('time'),
        levelDisplay: document.getElementById('level-display'),
        levelDescription: document.getElementById('level-description'),
        timerProgress: document.getElementById('timer-progress'),
        currentNumber: document.getElementById('current-number'),
        resultElement: document.getElementById('result'),
        fixedCard: document.getElementById('fixed-card'),
        deck: document.getElementById('deck'),
        optionsContainer: document.getElementById('options'),
        resultMessage: document.getElementById('result-message'),
        resultStats: document.getElementById('result-stats'),
        nextLevelBtn: document.getElementById('next-level'),
        playAgainBtn: document.getElementById('play-again'),
        startBtn: document.getElementById('start-btn'),
        restartBtn: document.getElementById('restart-btn'),
        vptabuadaBtn: document.getElementById('vptabuada-btn'),
        voltarBtn: document.querySelector('.voltar'),
        backToResultStats: document.getElementById('back-to-result-stats'),
        backToHistoryStats: document.getElementById('back-to-history-stats'),
        viewStatsBtn: document.getElementById('view-stats-btn'),
        viewLevelStats: document.getElementById('view-level-stats'),
        viewSessionHistory: document.getElementById('view-session-history'),
        backToWelcome: document.getElementById('back-to-welcome'),
       
        
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        statsLevel: document.getElementById('stats-level'),
        statsTotal: document.getElementById('stats-total'),
        statsCorrect: document.getElementById('stats-correct'),
        statsWrong: document.getElementById('stats-wrong'),
        statsAvgTime: document.getElementById('stats-avg-time'),
        statsList: document.getElementById('stats-list'),
        historyList: document.getElementById('history-list'),
        configBtn: document.getElementById('config-btn'),
        configIndicator: document.getElementById('config-indicator'),
        selectedLevel: document.getElementById('selected-level'),
        selectedTime: document.getElementById('selected-time'),
        passwordModal: document.getElementById('password-modal'),
        configModal: document.getElementById('config-modal'),
        passwordInput: document.getElementById('password-input'),
        confirmPassword: document.getElementById('confirm-password'),
        cancelPassword: document.getElementById('cancel-password'),
        cancelConfig: document.getElementById('cancel-config'),
        applyConfig: document.getElementById('apply-config'),
        decreaseTime: document.getElementById('decrease-time'),
        increaseTime: document.getElementById('increase-time'),
        timeInput: document.getElementById('time-input'),
    };
}

function configurarEventListeners() {
    if (elements.startBtn) elements.startBtn.addEventListener('click', startGame);
    if (elements.playAgainBtn) elements.playAgainBtn.addEventListener('click', startGame);
    if (elements.nextLevelBtn) elements.nextLevelBtn.addEventListener('click', nextLevel);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', reiniciarJogo);
    if (elements.vptabuadaBtn) elements.vptabuadaBtn.addEventListener('click', retornarparatabuada);
    if (elements.voltarBtn) elements.voltarBtn.addEventListener('click', () => location.reload());
    if (elements.viewStatsBtn) elements.viewStatsBtn.addEventListener('click', mostrarHistoricoDaSessao);
    if (elements.viewLevelStats) elements.viewLevelStats.addEventListener('click', () => mostrarEstatisticasAtuais('result'));
    if (elements.viewSessionHistory) elements.viewSessionHistory.addEventListener('click', mostrarHistoricoDaSessao);
    if (elements.backToResultStats) elements.backToResultStats.addEventListener('click', () => {
        elements.statsScreen.classList.add('hidden');
        elements.resultScreen.classList.remove('hidden');
    });
    if (elements.backToHistoryStats) elements.backToHistoryStats.addEventListener('click', () => {
        elements.statsScreen.classList.add('hidden');
        elements.historyScreen.classList.remove('hidden');
    });
    if (elements.backToWelcome) elements.backToWelcome.addEventListener('click', () => {
        elements.historyScreen.classList.add('hidden');
        elements.welcomeScreen.classList.remove('hidden');
    });
    if (elements.clearHistoryBtn) elements.clearHistoryBtn.addEventListener('click', limparHistorico);
    
    // Configuração
    if (elements.configBtn) elements.configBtn.addEventListener('click', abrirModalSenha);
    if (elements.confirmPassword) elements.confirmPassword.addEventListener('click', verificarSenha);
    if (elements.cancelPassword) elements.cancelPassword.addEventListener('click', fecharModalSenha);
    if (elements.cancelConfig) elements.cancelConfig.addEventListener('click', fecharModalConfig);
    if (elements.applyConfig) elements.applyConfig.addEventListener('click', aplicarConfiguracoes);
    
    // Controles de tempo
    if (elements.decreaseTime) elements.decreaseTime.addEventListener('click', () => {
        let valor = parseInt(elements.timeInput.value) || 26;
        valor = Math.max(5, valor - 1);
        elements.timeInput.value = valor;
    });
    if (elements.increaseTime) elements.increaseTime.addEventListener('click', () => {
        let valor = parseInt(elements.timeInput.value) || 26;
        valor = Math.min(120, valor + 1);
        elements.timeInput.value = valor;
    });
    if (elements.timeInput)elements.timeInput.addEventListener('change', () => {
            let valor = parseInt(elements.timeInput.value) || 26;
            valor = Math.min(120, Math.max(5, valor));
            elements.timeInput.value = valor;
    });
    
    // Opções do jogo
    if (elements.optionsContainer) {
        elements.optionsContainer.addEventListener('click', (e) => {
            if (gameActive && e.target.classList.contains('option')) {
                checkAnswer(parseInt(e.target.textContent));
            }
        });
    }
    
    document.addEventListener('click', (e) => {
    if (e.target.classList.contains('level-btn')) {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.classList.add('selected');
    }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModalSenha();
            fecharModalConfig();
        }
    });
}

// ============================================
// FUNÇÕES DE IDENTIFICAÇÃO DO ALUNO
// ============================================
function configurarSeletoresAluno() {
    // Ano selector
    document.querySelectorAll('.ano-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.ano-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            alunoAno = e.target.dataset.ano;
            document.getElementById('letra-selector').style.display = 'flex';
            document.getElementById('numero-selector').style.display = 'none';
            document.getElementById('aluno-info').style.display = 'none';
            alunoLetra = null;
            alunoNumero = null;
        });
    });
    
    // Letra selector
    document.querySelectorAll('.letra-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.letra-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            alunoLetra = e.target.dataset.letra;
            document.getElementById('numero-selector').style.display = 'flex';
            alunoNumero = null;
        });
    });
    
    // Número selector
    document.querySelectorAll('.numero-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.numero-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            alunoNumero = e.target.dataset.numero;
            document.getElementById('aluno-ano-display').textContent = alunoAno;
            document.getElementById('aluno-letra-display').textContent = alunoLetra;
            document.getElementById('aluno-numero-display').textContent = alunoNumero;
            document.getElementById('aluno-info').style.display = 'block';
        });
    });
}

// ============================================
// FUNÇÕES DE ESTATÍSTICAS
// ============================================
function iniciarNovasEstatisticas() {
    questionStats = [];
    currentQuestionNumber = 0;
}

function iniciarTempoQuestao() {
    questionStartTime = Date.now();
    currentQuestionNumber++;
}

function registrarResposta(acertou) {
    if (!questionStartTime) return;
    const tempoResposta = (Date.now() - questionStartTime) / 1000;
    questionStats.push({
        numero: currentQuestionNumber,
        multiplicador: currentMultiplier,
        valor: currentValue,
        resposta: correctAnswer,
        acertou: acertou,
        tempo: tempoResposta,
        nivel: currentLevel
    });
    questionStartTime = null;
}

function calcularMediaTempo() {
    if (questionStats.length === 0) return 0;
    const soma = questionStats.reduce((acc, stat) => acc + stat.tempo, 0);
    return soma / questionStats.length;
}

function salvarEstatisticas() {
    if (questionStats.length < MIN_RESPOSTAS_PARA_SALVAR) {
        console.log(`⏭️ Partida ignorada (apenas ${questionStats.length} respostas)`);
        return;
    }
    
    if (!alunoAno || !alunoLetra || !alunoNumero) {
        alert('⚠️ Por favor, identifique-se antes de jogar!');
        return;
    }
    
    let historico = [];
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    if (historicoSalvo) {
        try { historico = JSON.parse(historicoSalvo); } catch (e) { historico = []; }
    }
    
    const registro = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        dataTimestamp: Date.now(),
        aluno: { ano: alunoAno, letra: alunoLetra, numero: alunoNumero },
        nivel: currentLevel,
        stats: [...questionStats],
        total: questionStats.length,
        acertos: questionStats.filter(s => s.acertou).length,
        mediaTempo: calcularMediaTempo(),
        tempoTotal: timeLimit,
        tempoRestante: remainingTime
    };
    
    historico.push(registro);
    if (historico.length > MAX_HISTORICO) historico = historico.slice(-MAX_HISTORICO);
    localStorage.setItem(STATS_KEY, JSON.stringify(historico));
    console.log(`✅ Partida de ${alunoAno}${alunoLetra} N°${alunoNumero} salva`);
}

function mostrarEstatisticasAtuais(origem) {
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.welcomeScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.statsScreen.classList.remove('hidden');
    
    elements.backToResultStats.style.display = (origem === 'result') ? 'inline-block' : 'none';
    elements.backToHistoryStats.style.display = (origem === 'history') ? 'inline-block' : 'none';
    
    elements.statsLevel.textContent = currentLevel;
    elements.statsTotal.textContent = questionStats.length;
    elements.statsCorrect.textContent = questionStats.filter(s => s.acertou).length;
    elements.statsWrong.textContent = questionStats.filter(s => !s.acertou).length;
    elements.statsAvgTime.textContent = calcularMediaTempo().toFixed(1) + 's';
    
    elements.statsList.innerHTML = '';
    questionStats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'stats-item';
        if (!stat.acertou) item.classList.add('wrong');
        else if (stat.tempo < calcularMediaTempo() * 0.8) item.classList.add('fast-correct');
        else if (stat.tempo > calcularMediaTempo() * 1.2) item.classList.add('slow-correct');
        else item.classList.add('normal-correct');
        
        item.innerHTML = `
            <div class="stats-number">#${stat.numero}</div>
            <div class="stats-question">${stat.multiplicador} × ${stat.valor} = ${stat.resposta}</div>
            <div class="stats-time">${stat.tempo.toFixed(1)}s</div>
            <div class="stats-result">${stat.acertou ? '✅' : '❌'}</div>
        `;
        elements.statsList.appendChild(item);
    });
}

function mostrarHistoricoDaSessao() {
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.remove('hidden');
    
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    let historico = [];
    if (historicoSalvo) {
        try { historico = JSON.parse(historicoSalvo); } catch (e) { historico = []; }
    }
    
    elements.historyList.innerHTML = '';
    
    if (historico.length === 0) {
        elements.historyList.innerHTML = '<p style="text-align: center; padding: 40px;">Nenhuma estatística salva ainda.</p>';
        return;
    }
    
    // Resumo por aluno
    const alunosMap = new Map();
    historico.forEach(reg => {
        const chave = `${reg.aluno.ano}-${reg.aluno.letra}-${reg.aluno.numero}`;
        if (!alunosMap.has(chave)) {
            alunosMap.set(chave, { aluno: reg.aluno, partidas: 0, questoes: 0, acertos: 0, tempoTotal: 0 });
        }
        const stat = alunosMap.get(chave);
        stat.partidas++;
        stat.questoes += reg.total;
        stat.acertos += reg.acertos;
        stat.tempoTotal += reg.mediaTempo * reg.total;
    });
    
    const resumoDiv = document.createElement('div');
    resumoDiv.className = 'stats-summary';
    resumoDiv.innerHTML = '<h3 style="grid-column: 1/-1; text-align: center;">📋 Resumo por Aluno</h3>';
    
    alunosMap.forEach(stat => {
        const percentual = Math.round((stat.acertos / stat.questoes) * 100) || 0;
        const mediaAluno = (stat.tempoTotal / stat.questoes).toFixed(1);
        const card = document.createElement('div');
        card.className = 'stats-box';
        card.innerHTML = `
            <div class="stats-label">${stat.aluno.ano}${stat.aluno.letra} N°${stat.aluno.numero}</div>
            <div class="stats-value" style="font-size: 20px;">${stat.partidas} jogos</div>
            <div style="font-size: 14px;">✅ ${percentual}% | ⏱️ ${mediaAluno}s</div>
        `;
        resumoDiv.appendChild(card);
    });
    
    elements.historyList.appendChild(resumoDiv);
    
    // Histórico detalhado
    const detalhesDiv = document.createElement('div');
    detalhesDiv.innerHTML = '<h3 style="text-align: center; margin: 20px 0;">📝 Últimas Partidas</h3>';
    elements.historyList.appendChild(detalhesDiv);
    
    historico.reverse().forEach(registro => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // Verificar se a partida é recuperável (últimos 3 minutos E acertos = total)
// Calcular tempo da partida (já existente)
        const agora = Date.now();
        const tempoPartida = registro.dataTimestamp || registro.id;
        const diferenca = agora - tempoPartida;
        const ehRecente = diferenca <= TEMPO_MAXIMO_RECUPERACAO; // 3 minutos

        const percentual = Math.round((registro.acertos / registro.total) * 100);
        const dataObj = new Date(registro.data);
        const hora = dataObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Determinar o nível para jogar baseado no resultado
        // Determinar o nível para jogar baseado no resultado
        let nivelParaJogar;
        let textoBotao;

      let totalEsperado;

        if (registro.nivel >= 1 && registro.nivel <= 7) {
            totalEsperado = 20;
        } else if (registro.nivel >= 8 && registro.nivel <= 9) {
            totalEsperado = 40;
        } else if (registro.nivel === 10) {
            totalEsperado = 50;
        }

        if (registro.acertos === totalEsperado) {
            // VENCEU - acertou todas as questões do nível
            nivelParaJogar = Math.min(registro.nivel + 1, 10);
            textoBotao = `▶️ Jogar Nível ${nivelParaJogar} (próximo)`;
        } else {
            // NÃO VENCEU - acertou menos que o total necessário
            nivelParaJogar = registro.nivel;
            textoBotao = `▶️ Jogar Nível ${nivelParaJogar} (mesmo nível)`;
        }
        // Só mostra o botão se for recente (até 3 minutos)
        item.innerHTML = `
            <div class="history-header">
                <span>🕒 ${hora}</span>
                <span>👤 ${registro.aluno.ano}${registro.aluno.letra} N°${registro.aluno.numero}</span>
                <span>🎮 Nível ${registro.nivel}</span>
            </div>
            <div class="history-stats">
                <span>✅ ${registro.acertos}/${registro.total}</span>
                <span>📊 ${percentual}%</span>
                <span>⏱️ ${registro.mediaTempo.toFixed(1)}s</span>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                <button class="history-view-btn" data-id="${registro.id}">Ver Detalhes</button>
                ${ehRecente ? `
                    <button class="history-recover-btn" 
                            data-nivel-original="${registro.nivel}" 
                            data-nivel-jogar="${nivelParaJogar}"
                            data-aluno='${JSON.stringify(registro.aluno)}'
                            data-venceu="${registro.acertos === registro.total}"
                            style="background: #28a745; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                        ${textoBotao}
                    </button>
                ` : ''}
            </div>
        `;
        
        elements.historyList.appendChild(item);
    });
    

    document.querySelectorAll('.history-recover-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nivelJogar = parseInt(e.target.dataset.nivelJogar);
            const nivelOriginal = parseInt(e.target.dataset.nivelOriginal);
            const venceu = e.target.dataset.venceu === 'true';
            const aluno = JSON.parse(e.target.dataset.aluno);
            
            // Restaurar identificação do aluno
            alunoAno = aluno.ano;
            alunoLetra = aluno.letra;
            alunoNumero = aluno.numero;
            
            // Atualizar display
            document.getElementById('aluno-ano-display').textContent = alunoAno;
            document.getElementById('aluno-letra-display').textContent = alunoLetra;
            document.getElementById('aluno-numero-display').textContent = alunoNumero;
            document.getElementById('aluno-info').style.display = 'block';
            
            // Marcar botões como selecionados
            document.querySelectorAll('.ano-btn').forEach(btn => {
                if (btn.dataset.ano === alunoAno) btn.classList.add('selected');
            });
            document.querySelectorAll('.letra-btn').forEach(btn => {
                if (btn.dataset.letra === alunoLetra) btn.classList.add('selected');
            });
            document.querySelectorAll('.numero-btn').forEach(btn => {
                if (btn.dataset.numero === alunoNumero) btn.classList.add('selected');
            });
            
            // Configurar nível
            nivelConfigurado = nivelJogar;
            currentLevel = nivelJogar;
            
            // ATUALIZAR LOCALSTORAGE
            const hoje = new Date().toDateString();
            const estado = {
                currentLevel: nivelJogar,
                data: hoje,
                timestamp: Date.now()
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
            
            // Voltar para tela inicial e começar
            elements.historyScreen.classList.add('hidden');
            elements.welcomeScreen.classList.remove('hidden');
            
            // Iniciar jogo automaticamente
            setTimeout(() => startGame(), 100);
        });
    });
    
    document.querySelectorAll('.history-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const registro = historico.find(r => r.id === id);
            if (registro) {
                questionStats = registro.stats;
                currentLevel = registro.nivel;
                elements.historyScreen.classList.add('hidden');
                mostrarEstatisticasAtuais('history');
                
                const info = document.createElement('div');
                info.className = 'aluno-info';
                info.style.margin = '10px 0 20px';
                info.innerHTML = `👤 Aluno: ${registro.aluno.ano}${registro.aluno.letra} - N° ${registro.aluno.numero} | ${registro.data}`;
                elements.statsList.insertBefore(info, elements.statsList.firstChild);
            }
        });
    });
}

function limparHistorico() {
    if (confirm('Tem certeza que deseja limpar TODO o histórico?')) {
        localStorage.removeItem(STATS_KEY);
        mostrarHistoricoDaSessao();
    }
}

// ============================================
// FUNÇÕES DO JOGO
// ============================================
function startGame(reiniciado) {
    if (!alunoAno || !alunoLetra || !alunoNumero) {
        alert('⚠️ Identifique-se primeiro: Ano → Turma → Número da Chamada');
        return;
    }
    
    limparTimer();
    
    // Lógica de recuperação de jogo salvo
    if (reiniciado !== "sim") {
        const nivelSalvo = verificarJogoSalvo();
        if (nivelSalvo) {
            if (confirm(`🎮 Continuar nível ${nivelSalvo}?`)) {
                // USUÁRIO QUIS CONTINUAR - usa o nível salvo
                iniciarJogoNoNivel(nivelSalvo);
                return;
            } else {
                // USUÁRIO CANCELOU - FORÇA NÍVEL 1 (regra principal)
                nivelConfigurado = 1;
                currentLevel = 1;
                // NÃO remove o localStorage, pois o professor pode ter configurado
                // Apenas ignora para esta partida
            }
        }
    }
    
    // Iniciar jogo (agora nivelConfigurado é 1 se cancelou)
    gameActive = true;
    abaTrocada = false;
    iniciarNovasEstatisticas();
    
    // NÃO REMOVER O SAVE_KEY aqui! (já que pode ter configuração do professor)
    // localStorage.removeItem(SAVE_KEY); ← COMENTADO
    
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    if (elements.vptabuadaBtn) elements.vptabuadaBtn.classList.remove('hidden');
    
    const config = levelConfigs[nivelConfigurado];
    currentLevel = nivelConfigurado;
    totalQuestions = config.totalCards;
    timeLimit = Math.floor(baseTimeLimit * config.timeMultiplier);
    score = 0;
    remainingCards = totalQuestions;
    remainingTime = timeLimit;
    
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingCards;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    
    updateLevelInfo();
    generateQuestion();
    startTimer();
    
    // Salvar estado atual (agora é o nível que realmente começou)
    salvarEstadoJogo();
}

function generateQuestion() {
    const config = levelConfigs[currentLevel];
    if (config.multipliers.length > 1) {
        const randomIndex = Math.floor(Math.random() * config.multipliers.length);
        currentMultiplier = config.multipliers[randomIndex];
        elements.fixedCard.textContent = currentMultiplier;
    }
    currentValue = Math.floor(Math.random() * 8) + 2;
    correctAnswer = currentMultiplier * currentValue;
    elements.currentNumber.textContent = currentValue;
    elements.resultElement.textContent = '?';
    generateOptions();
    iniciarTempoQuestao();
}

function generateOptions() {
    elements.optionsContainer.innerHTML = '';
    let options = [correctAnswer];
    let range = correctAnswer > 50 ? 10 : 4;
    
    while (options.length < 6) {
        let option;
        let attempts = 0;
        do {
            const variation = Math.floor(Math.random() * (range * 2 + 1)) - range;
            option = correctAnswer + variation;
            attempts++;
            if (attempts > 20) break;
        } while (option <= 0 || options.includes(option));
        if (!options.includes(option) && option > 0) options.push(option);
    }
    
    shuffleArray(options).forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        elements.optionsContainer.appendChild(button);
    });
}

function checkAnswer(answer) {
    if (!gameActive) return;
    
    const acertou = (answer === correctAnswer);
    registrarResposta(acertou);
    desabilitarOpcoes(elements.optionsContainer);
    
    if (acertou) {
        score++;
        remainingCards--;
        elements.scoreElement.textContent = `${score}/${totalQuestions}`;
        elements.resultElement.textContent = correctAnswer;
        
        // Bônus diferenciado
        if (currentLevel >= 8 && currentLevel <= 10) {
            remainingTime += 1.7;
        } else {
            remainingTime += 1.5;
        }
    } else {
        remainingTime = Math.max(0.1, remainingTime - 2);
        elements.resultElement.textContent = correctAnswer;
    }
    
    elements.deck.querySelector('div').textContent = remainingCards;
    remainingTime = Math.round(remainingTime * 10) / 10;
    updateTimeDisplay();
    atualizarTimerVisual((remainingTime / timeLimit) * 100);
    
    if (score >= totalQuestions || remainingCards <= 0 || remainingTime <= 0.1) {
        setTimeout(() => { limparTimer(); endGame(); }, 800);
        return;
    }
    
    setTimeout(() => { if (gameActive) generateQuestion(); }, 800);
}

function reiniciarJogo() { limparTimer(); gameActive = false; startGame("sim"); }
function limparTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
function updateTimeDisplay() { elements.timeElement.textContent = `${remainingTime.toFixed(1)}s`; }

function nextLevel() {
    currentLevel = currentLevel < 10 ? currentLevel + 1 : 1;
    nivelConfigurado = currentLevel;
    startGame();
}

function updateLevelInfo() {
    const config = levelConfigs[currentLevel];
    elements.levelDisplay.textContent = currentLevel;
    elements.levelDescription.textContent = `Nível ${currentLevel}: ${config.description}`;
    if (config.multipliers.length === 1) {
        elements.fixedCard.textContent = config.multipliers[0];
        currentMultiplier = config.multipliers[0];
    } else {
        elements.fixedCard.textContent = "?";
    }
}

function startTimer() {
    limparTimer();
    timerInterval = setInterval(() => {
        if (!gameActive) { limparTimer(); return; }
        remainingTime = Math.max(0, remainingTime - 0.1);
        remainingTime = Math.round(remainingTime * 10) / 10;
        updateTimeDisplay();
        const percentage = (remainingTime / timeLimit) * 100;
        atualizarTimerVisual(percentage);
        if (remainingTime <= 0.1) { limparTimer(); endGame(); }
    }, 100);
}

function atualizarTimerVisual(percentage) {
    elements.timerProgress.style.width = `${percentage}%`;
    if (percentage <= 25) elements.timerProgress.style.backgroundColor = '#dc3545';
    else if (percentage <= 50) elements.timerProgress.style.backgroundColor = '#ffc107';
    else elements.timerProgress.style.backgroundColor = '#20c997';
}

function desabilitarOpcoes(container) {
    container.querySelectorAll('.option').forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function endGame() {
    gameActive = false;
    limparTimer();
    salvarEstatisticas();
    
    if (score >= totalQuestions || remainingTime <= 0.1) localStorage.removeItem(SAVE_KEY);
    
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.add('hidden');
    if (elements.vptabuadaBtn) elements.vptabuadaBtn.classList.add('hidden');
    
    const venceu = score >= totalQuestions;
    if (venceu) {
        elements.resultMessage.textContent = 'Parabéns!';
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} questões!`;
    } else {
        elements.resultMessage.textContent = 'Tempo esgotado!';
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} questões.`;
    }
    
    if (elements.nextLevelBtn) elements.nextLevelBtn.style.display = venceu && currentLevel < 10 ? 'block' : 'none';
    if (elements.viewLevelStats) elements.viewLevelStats.style.display = questionStats.length > 0 ? 'inline-block' : 'none';
}

// ============================================
// SISTEMA ANTI-BURLA
// ============================================
function setupVisibilityDetection() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', () => handleVisibilityChangeHidden());
    window.addEventListener('focus', () => handleVisibilityChangeVisible());
    window.addEventListener('pagehide', () => handleVisibilityChangeHidden());
    window.addEventListener('pageshow', (event) => { if (event.persisted) handleVisibilityChangeVisible(); });
}

function handleVisibilityChange() {
    if (document.hidden) handleVisibilityChangeHidden();
    else handleVisibilityChangeVisible();
}

function handleVisibilityChangeHidden() {
    if (!gameActive) return;
    timeWhenHidden = Date.now();
    abaTrocada = true;
}

function handleVisibilityChangeVisible() {
    if (!gameActive || !abaTrocada) return;
    const tempoAusente = (Date.now() - timeWhenHidden) / 1000;
    console.log(`🔄 Aluno voltou após ${tempoAusente.toFixed(1)}s - REINICIANDO NÍVEL`);
    reiniciarNivelAtual();
    abaTrocada = false;
}

function reiniciarNivelAtual() { gameActive = false; limparTimer(); iniciarNivelAtual(); }

function iniciarNivelAtual() {
    gameActive = true;
    iniciarNovasEstatisticas();
    abaTrocada = false;
    const config = levelConfigs[currentLevel];
    totalQuestions = config.totalCards;
    timeLimit = Math.floor(baseTimeLimit * config.timeMultiplier);
    score = 0;
    remainingCards = totalQuestions;
    remainingTime = timeLimit;
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingCards;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    updateLevelInfo();
    generateQuestion();
    startTimer();
}

function salvarEstadoJogo() {
    if (!gameActive) return;
    const estado = { currentLevel: currentLevel, data: new Date().toDateString(), timestamp: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
}

function verificarJogoSalvo() {
    const savedState = localStorage.getItem(SAVE_KEY);
    if (!savedState) return false;
    try {
        const estado = JSON.parse(savedState);
        if (estado.data === new Date().toDateString()) return estado.currentLevel;
        else { localStorage.removeItem(SAVE_KEY); return false; }
    } catch (e) { return false; }
}

function iniciarJogoNoNivel(nivel) {

    gameActive = true;
    iniciarNovasEstatisticas();
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    if (elements.vptabuadaBtn) elements.vptabuadaBtn.classList.remove('hidden');
    
    const config = levelConfigs[nivel];
    currentLevel = nivel;
    nivelConfigurado = nivel;
    totalQuestions = config.totalCards;
    timeLimit = Math.floor(baseTimeLimit * config.timeMultiplier);
    score = 0;
    remainingCards = totalQuestions;
    remainingTime = timeLimit;
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingCards;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    updateLevelInfo();
    generateQuestion();
    startTimer();
    salvarEstadoJogo();
}

function retornarparatabuada() {
    gameActive = false;
    limparTimer();
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.welcomeScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.add('hidden');
    if (elements.vptabuadaBtn) elements.vptabuadaBtn.classList.add('hidden');
}

// ============================================
// FUNÇÕES DOS MODAIS
// ============================================
function abrirModalSenha() { elements.passwordModal.classList.remove('hidden'); elements.passwordInput.value = ''; elements.passwordInput.focus(); }
function fecharModalSenha() { elements.passwordModal.classList.add('hidden'); }
function fecharModalConfig() { elements.configModal.classList.add('hidden'); }

function verificarSenha() {
    const senhaDigitada = elements.passwordInput.value;
    const hoje = new Date();
    const d = hoje.getDate().toString().padStart(2, '0');
    if (senhaDigitada === "52" + d + "60") {
        fecharModalSenha();
        abrirModalConfig();
    } else {
        alert('❌ Senha incorreta!');
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
    }
}

function abrirModalConfig() {
    elements.timeInput.value = tempoConfigurado;
    document.querySelectorAll('.level-btn').forEach(btn => {
        if (parseInt(btn.dataset.level) === nivelConfigurado) btn.classList.add('selected');
        else btn.classList.remove('selected');
    });
    elements.configModal.classList.remove('hidden');
}

function aplicarConfiguracoes() {
    const nivelSelecionadoElem = document.querySelector('.level-btn.selected');
    const nivelSelecionado = nivelSelecionadoElem ? parseInt(nivelSelecionadoElem.dataset.level) : nivelConfigurado;
    const tempoSelecionado = parseInt(elements.timeInput.value) || 26;
    
    nivelConfigurado = nivelSelecionado;
    currentLevel = nivelSelecionado;
    tempoConfigurado = tempoSelecionado;
    baseTimeLimit = tempoSelecionado;
    
    // SOBRESCREVER localStorage com o nível configurado
    const hoje = new Date().toDateString();
    const estado = {
        currentLevel: nivelSelecionado,
        data: hoje,
        timestamp: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
    
    elements.selectedLevel.textContent = nivelSelecionado;
    elements.selectedTime.textContent = tempoSelecionado;
    elements.configIndicator.style.display = 'block';
    
    alert(`✅ Configurações aplicadas: Nível ${nivelSelecionado} | Tempo ${tempoSelecionado}s`);
    fecharModalConfig();
}

// ============================================
// SALVAR AO FECHAR
// ============================================
window.addEventListener('beforeunload', () => { if (gameActive) salvarEstadoJogo(); });
