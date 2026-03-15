function carregarCSSTabuada() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/tabuada/tabuada.css';
    document.head.appendChild(link);
}

// Variáveis globais
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

// NOVAS VARIÁVEIS PARA ESTATÍSTICAS
let questionStartTime = null;
let questionStats = [];
let currentQuestionNumber = 0;

// Elementos do DOM
let elements = null;
let levelConfigs = null;

// Configurações de nível
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

// Função principal exportada
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
            <div class="screen" id="welcome-screen">
                <h1>Bem vindo ao jogo da tabuada</h1>
                <div class="instructions">
                    <p>Acerte as tabuadas antes que o tempo acabe e passe de nível</p>
                    <p>Vai aparecer a tabuada correspondente ao nível do lado esquerdo e no lado direito a carta que o baralho irá virar</p>
                    <p>Abaixo, escolha a alternativa correta</p>
                </div>
                
                <!-- Botão de configuração ao lado do Começar -->
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
                    <button class="btn" id="start-btn">Começar</button>
                    <button class="btn btn-config" id="config-btn">⚙️ Configurar</button>
                </div>
                
                <!-- Botão para ver estatísticas salvas -->
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
                    <button class="btn btn-stats" id="view-stats-btn">📊 Ver Estatísticas</button>
                </div>
                
                <!-- Indicador de nível e tempo configurados -->
                <div id="config-indicator" style="display: none; color: #28a745; font-weight: bold; margin-top: 10px;">
                    Nível: <span id="selected-level">1</span> | 
                    Tempo: <span id="selected-time">26</span>s por questão
                </div>
            </div>
            
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
                
                <div class="options" id="options">
                    <!-- As opções serão geradas pelo JavaScript -->
                </div>
            </div>

            <div class="screen hidden" id="result-screen">
                <h2 class="result-title" id="result-message">Parabéns!</h2>
                <p class="result-stats" id="result-stats">Você acertou 20 de 20 cartas!</p>
                <div class="result-buttons">
                    <button class="btn" id="play-again">Jogar Novamente</button>
                    <button class="btn btn-success" id="next-level">Próximo Nível</button>
                    <button class="btn btn-stats" id="view-level-stats">📊 Ver Estatísticas do Nível</button>
                </div>
            </div>
            
            <!-- TELA: Estatísticas do Nível -->
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
                    <div class="legend-item">
                        <div class="legend-color" style="background: #28a745;"></div>
                        <span>Acerto (mais rápido que a média)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #17a2b8;"></div>
                        <span>Acerto (dentro da média)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #ffc107;"></div>
                        <span>Acerto (mais lento que a média)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #dc3545;"></div>
                        <span>Erro</span>
                    </div>
                </div>
                
                <div class="stats-list" id="stats-list">
                    <!-- As estatísticas serão inseridas aqui -->
                </div>
                
                <div class="stats-buttons">
                    <button class="btn" id="back-to-result-stats">← Voltar para Resultado</button>
                    <button class="btn" id="back-to-history-stats">← Voltar para Histórico</button>
                    <button class="btn btn-stats" id="save-stats-btn">💾 Salvar Estatísticas</button>
                    <button class="btn btn-warning" id="clear-stats-btn">🗑️ Limpar</button>
                </div>
            </div>
            
            <!-- TELA: Histórico de Estatísticas -->
            <div class="screen hidden" id="history-screen">
                <h2 class="stats-title">📚 Histórico de Jogos</h2>
                
                <div class="history-list" id="history-list">
                    <!-- O histórico será inserido aqui -->
                </div>
                
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

    <!-- MODAL PARA CONFIGURAÇÕES (NÍVEL E TEMPO) -->
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
                <p style="font-size: 14px; color: #666; margin-top: 10px;">
                    Valor recomendado: 26s (padrão) | Mínimo: 5s | Máximo: 120s
                </p>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; margin: 25px 0 10px;">
                <button class="btn btn-success" id="apply-config">Aplicar Configurações</button>
                <button class="btn btn-warning" id="cancel-config">Cancelar</button>
            </div>
        </div>
    </div>
    `;

    // Adicionar CSS adicional para os modais e estatísticas
    const style = document.createElement('style');
    style.textContent = `
        .btn-config, .btn-stats {
            background: linear-gradient(145deg, #6c5ce7, #a463f5);
            color: white;
        }

        .btn-stats {
            background: linear-gradient(145deg, #00b894, #00cec9);
        }

        .btn-config:hover, .btn-stats:hover {
            transform: translateY(-2px);
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .modal .modal-content {
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .password-input {
            width: 100%;
            padding: 12px;
            margin: 15px 0;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            text-align: center;
        }

        .level-buttons {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin: 20px 0;
        }

        .level-btn {
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            background: linear-gradient(145deg, #3498db, #2980b9);
            color: white;
            cursor: pointer;
            transition: all 0.3s;
        }

        .level-btn:hover {
            transform: scale(1.05);
            background: linear-gradient(145deg, #2980b9, #3498db);
        }
        
        .level-btn.selected {
            background: linear-gradient(145deg, #27ae60, #2ecc71);
            box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
        }

        .time-control-btn {
            width: 40px;
            height: 40px;
            font-size: 24px;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            background: linear-gradient(145deg, #6c5ce7, #a463f5);
            color: white;
            cursor: pointer;
            transition: all 0.3s;
        }

        .time-control-btn:hover {
            transform: scale(1.1);
        }

        .time-input {
            width: 80px;
            height: 40px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 5px;
        }

        .time-input:focus {
            outline: none;
            border-color: #6c5ce7;
        }

        .modal.hidden {
            display: none;
        }

        /* Estilos para estatísticas */
        .stats-title {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 28px;
        }

        .stats-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        .stats-box {
            background: linear-gradient(145deg, #f8f9fa, #e9ecef);
            padding: 15px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .stats-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }

        .stats-value {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
        }

        .stats-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 5px;
        }

        .stats-list {
            max-height: 400px;
            overflow-y: auto;
            margin: 20px 0;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            padding: 10px;
        }

        .stats-item {
            display: grid;
            grid-template-columns: 80px 1fr 80px 100px;
            gap: 10px;
            padding: 12px;
            margin: 5px 0;
            border-radius: 8px;
            font-size: 16px;
            align-items: center;
        }

        .stats-item.fast-correct {
            background: rgba(40, 167, 69, 0.2);
            border-left: 5px solid #28a745;
        }

        .stats-item.normal-correct {
            background: rgba(23, 162, 184, 0.1);
            border-left: 5px solid #17a2b8;
        }

        .stats-item.slow-correct {
            background: rgba(255, 193, 7, 0.2);
            border-left: 5px solid #ffc107;
        }

        .stats-item.wrong {
            background: rgba(220, 53, 69, 0.1);
            border-left: 5px solid #dc3545;
        }

        .stats-number {
            font-weight: bold;
            color: #2c3e50;
        }

        .stats-question {
            font-family: monospace;
            font-size: 18px;
        }

        .stats-time {
            font-family: monospace;
            text-align: right;
        }

        .stats-result {
            text-align: center;
            font-weight: bold;
        }

        .stats-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        .history-item {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 15px;
            margin: 10px 0;
            border-left: 5px solid #6c5ce7;
        }

        .history-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-weight: bold;
            color: #2c3e50;
        }

        .history-stats {
            display: flex;
            gap: 15px;
            color: #666;
            font-size: 14px;
        }

        .history-view-btn {
            background: #6c5ce7;
            color: white;
            border: none;
            padding: 5px 15px;
            border-radius: 5px;
            cursor: pointer;
        }

        .history-view-btn:hover {
            background: #5b4bc4;
        }
    `;
    document.head.appendChild(style);

    // Inicializar o jogo
    setTimeout(() => {
        init();
    }, 100);
}

function init() {
    configurarNiveis();
    configurarElementosDOM();
    configurarEventListeners();
    
    
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
        backToResult: document.getElementById('back-to-result'),
        backToWelcome: document.getElementById('back-to-welcome'),
        saveStatsBtn: document.getElementById('save-stats-btn'),
        clearStatsBtn: document.getElementById('clear-stats-btn'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        statsLevel: document.getElementById('stats-level'),
        statsTotal: document.getElementById('stats-total'),
        statsCorrect: document.getElementById('stats-correct'),
        statsWrong: document.getElementById('stats-wrong'),
        statsAvgTime: document.getElementById('stats-avg-time'),
        statsList: document.getElementById('stats-list'),
        historyList: document.getElementById('history-list'),
        // Elementos de configuração
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
    
    // NOVOS EVENT LISTENERS PARA ESTATÍSTICAS
    if (elements.viewStatsBtn) {
        elements.viewStatsBtn.addEventListener('click', mostrarHistorico);
    }
    
    if (elements.viewLevelStats) {
        elements.viewLevelStats.addEventListener('click', function() {
            console.log("📊 Botão Ver Estatísticas do Nível clicado!");
            mostrarEstatisticasAtuais('result'); // ← PASSA 'result' COMO ORIGEM
        });
    }
    
    if (elements.backToResult) {
        elements.backToResult.addEventListener('click', () => {
            elements.statsScreen.classList.add('hidden');
            elements.resultScreen.classList.remove('hidden');
        });
    }
    
    if (elements.backToWelcome) {
        elements.backToWelcome.addEventListener('click', () => {
            elements.historyScreen.classList.add('hidden');
            elements.welcomeScreen.classList.remove('hidden');
        });
    }
    
        // Botão voltar para tela de resultado (quando veio do parabéns)
    if (elements.backToResultStats) {
        elements.backToResultStats.addEventListener('click', () => {
            elements.statsScreen.classList.add('hidden');
            elements.resultScreen.classList.remove('hidden');
        });
    }

    // Botão voltar para histórico (quando veio do menu)
    if (elements.backToHistoryStats) {
        elements.backToHistoryStats.addEventListener('click', () => {
            elements.statsScreen.classList.add('hidden');
            elements.historyScreen.classList.remove('hidden');
        });
    }

    if (elements.saveStatsBtn) {
        elements.saveStatsBtn.addEventListener('click', salvarEstatisticas);
    }
    
    if (elements.clearStatsBtn) {
        elements.clearStatsBtn.addEventListener('click', limparEstatisticasAtuais);
    }
    
    if (elements.clearHistoryBtn) {
        elements.clearHistoryBtn.addEventListener('click', limparHistorico);
    }
    
    // Event listeners para configuração
    if (elements.configBtn) {
        elements.configBtn.addEventListener('click', abrirModalSenha);
    }
    
    if (elements.confirmPassword) {
        elements.confirmPassword.addEventListener('click', verificarSenha);
    }
    
    if (elements.cancelPassword) {
        elements.cancelPassword.addEventListener('click', fecharModalSenha);
    }
    
    if (elements.cancelConfig) {
        elements.cancelConfig.addEventListener('click', fecharModalConfig);
    }
    
    if (elements.applyConfig) {
        elements.applyConfig.addEventListener('click', aplicarConfiguracoes);
    }
    
    // Controles de tempo
    if (elements.decreaseTime) {
        elements.decreaseTime.addEventListener('click', () => {
            let valor = parseInt(elements.timeInput.value) || 26;
            valor = Math.max(5, valor - 1);
            elements.timeInput.value = valor;
        });
    }
    
    if (elements.increaseTime) {
        elements.increaseTime.addEventListener('click', () => {
            let valor = parseInt(elements.timeInput.value) || 26;
            valor = Math.min(120, valor + 1);
            elements.timeInput.value = valor;
        });
    }
    
    if (elements.timeInput) {
        elements.timeInput.addEventListener('change', () => {
            let valor = parseInt(elements.timeInput.value) || 26;
            valor = Math.min(120, Math.max(5, valor));
            elements.timeInput.value = valor;
        });
    }
    
    // Event delegation para as opções
    if (elements.optionsContainer) {
        elements.optionsContainer.addEventListener('click', (e) => {
            if (gameActive && e.target.classList.contains('option')) {
                checkAnswer(parseInt(e.target.textContent));
            }
        });
    }
    
    // Event delegation para os botões de nível
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('level-btn')) {
            document.querySelectorAll('.level-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            e.target.classList.add('selected');
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModalSenha();
            fecharModalConfig();
        }
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
    
    const tempoResposta = (Date.now() - questionStartTime) / 1000; // em segundos
    
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

function mostrarEstatisticasAtuais(origem) {
    console.log("📊 Mostrando estatísticas atuais. Origem:", origem);
    
    // Esconder outras telas
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.welcomeScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    
    // Mostrar tela de estatísticas
    elements.statsScreen.classList.remove('hidden');
    
    // Controlar visibilidade dos botões baseado na origem
    if (origem === 'result') {
        // Veio da tela de parabéns
        elements.backToResultStats.style.display = 'inline-block';
        elements.backToHistoryStats.style.display = 'none';
        elements.saveStatsBtn.style.display = 'inline-block'; // pode salvar
    } else {
        // Veio do histórico
        elements.backToResultStats.style.display = 'none';
        elements.backToHistoryStats.style.display = 'inline-block';
        elements.saveStatsBtn.style.display = 'none'; // já está salvo, não precisa salvar de novo
    }
    
    // Atualizar informações
    elements.statsLevel.textContent = currentLevel;
    
    const totalQuestoes = questionStats.length;
    const acertos = questionStats.filter(s => s.acertou).length;
    const erros = totalQuestoes - acertos;
    const mediaTempo = calcularMediaTempo();
    
    elements.statsTotal.textContent = totalQuestoes;
    elements.statsCorrect.textContent = acertos;
    elements.statsWrong.textContent = erros;
    elements.statsAvgTime.textContent = mediaTempo.toFixed(1) + 's';
    
    // Gerar lista detalhada
    elements.statsList.innerHTML = '';
    
    questionStats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'stats-item';
        
        if (!stat.acertou) {
            item.classList.add('wrong');
        } else {
            if (stat.tempo < mediaTempo * 0.8) {
                item.classList.add('fast-correct');
            } else if (stat.tempo > mediaTempo * 1.2) {
                item.classList.add('slow-correct');
            } else {
                item.classList.add('normal-correct');
            }
        }
        
        const tempoFormatado = stat.tempo.toFixed(1) + 's';
        const resultado = stat.acertou ? '✅' : '❌';
        
        item.innerHTML = `
            <div class="stats-number">#${stat.numero}</div>
            <div class="stats-question">${stat.multiplicador} × ${stat.valor} = ${stat.resposta}</div>
            <div class="stats-time">${tempoFormatado}</div>
            <div class="stats-result">${resultado}</div>
        `;
        
        elements.statsList.appendChild(item);
    });
}

function salvarEstatisticas() {
    // Carregar histórico existente
    let historico = [];
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    
    if (historicoSalvo) {
        try {
            historico = JSON.parse(historicoSalvo);
        } catch (e) {
            historico = [];
        }
    }
    
    // Criar novo registro
    const registro = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        nivel: currentLevel,
        stats: [...questionStats],
        total: questionStats.length,
        acertos: questionStats.filter(s => s.acertou).length,
        mediaTempo: calcularMediaTempo()
    };
    
    // Adicionar ao histórico
    historico.push(registro);
    
    // Limitar histórico a 50 itens
    if (historico.length > 50) {
        historico = historico.slice(-50);
    }
    
    // Salvar
    localStorage.setItem(STATS_KEY, JSON.stringify(historico));
    
    alert('✅ Estatísticas salvas com sucesso!');
}

function mostrarHistorico() {
    // Esconder outras telas
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    
    // Mostrar tela de histórico
    elements.historyScreen.classList.remove('hidden');
    
    // Carregar histórico
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    let historico = [];
    
    if (historicoSalvo) {
        try {
            historico = JSON.parse(historicoSalvo);
        } catch (e) {
            historico = [];
        }
    }
    
    // Gerar lista
    elements.historyList.innerHTML = '';
    
    if (historico.length === 0) {
        elements.historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Nenhuma estatística salva ainda.</p>';
        return;
    }
    
    // Mostrar do mais recente para o mais antigo
    historico.reverse().forEach(registro => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const percentual = Math.round((registro.acertos / registro.total) * 100);
        
        item.innerHTML = `
            <div class="history-header">
                <span>📅 ${registro.data}</span>
                <span>🎮 Nível ${registro.nivel}</span>
            </div>
            <div class="history-stats">
                <span>✅ ${registro.acertos}/${registro.total}</span>
                <span>📊 ${percentual}%</span>
                <span>⏱️ Média: ${registro.mediaTempo.toFixed(1)}s</span>
            </div>
            <div style="text-align: right; margin-top: 10px;">
                <button class="history-view-btn" data-id="${registro.id}">Ver Detalhes</button>
            </div>
        `;
        
        elements.historyList.appendChild(item);
    });
    
    // Adicionar event listeners aos botões de visualização
    document.querySelectorAll('.history-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            verDetalhesHistorico(id);
        });
    });
}

function verDetalhesHistorico(id) {
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    if (!historicoSalvo) return;
    
    const historico = JSON.parse(historicoSalvo);
    const registro = historico.find(r => r.id === id);
    
    if (!registro) return;
    
    // Temporariamente usar estas estatísticas
    questionStats = registro.stats;
    currentLevel = registro.nivel;
    
    // Mostrar tela de estatísticas
    elements.historyScreen.classList.add('hidden');
    mostrarEstatisticasAtuais('history');
    
    // Esconder botão de salvar (já está salvo)
    if (elements.saveStatsBtn) {
        elements.saveStatsBtn.style.display = 'none';
    }
}

function limparEstatisticasAtuais() {
    if (confirm('Tem certeza que deseja limpar as estatísticas atuais?')) {
        questionStats = [];
        mostrarEstatisticasAtuais();
    }
}

function limparHistorico() {
    if (confirm('Tem certeza que deseja limpar TODO o histórico de estatísticas?')) {
        localStorage.removeItem(STATS_KEY);
        mostrarHistorico();
    }
}

// ============================================
// FUNÇÕES DOS MODAIS
// ============================================

function abrirModalSenha() {
    elements.passwordModal.classList.remove('hidden');
    elements.passwordInput.value = '';
    elements.passwordInput.focus();
}

function fecharModalSenha() {
    elements.passwordModal.classList.add('hidden');
}

function fecharModalConfig() {
    elements.configModal.classList.add('hidden');
}

function verificarSenha() {
    const senhaDigitada = elements.passwordInput.value;
    
    const hoje = new Date();
    const d = hoje.getDate().toString().padStart(2, '0');
    
    const correctanswer = d + "5260";
    
    if (senhaDigitada === correctanswer) {
        fecharModalSenha();
        abrirModalConfig();
    } else {
        alert('❌ Senha incorreta! Tente novamente.');
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
    }
}

function abrirModalConfig() {
    elements.timeInput.value = tempoConfigurado;
    
    document.querySelectorAll('.level-btn').forEach(btn => {
        const nivel = parseInt(btn.dataset.level);
        if (nivel === nivelConfigurado) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    elements.configModal.classList.remove('hidden');
}

function aplicarConfiguracoes() {
    let nivelSelecionado = nivelConfigurado;
    const nivelSelecionadoElem = document.querySelector('.level-btn.selected');
    if (nivelSelecionadoElem) {
        nivelSelecionado = parseInt(nivelSelecionadoElem.dataset.level);
    }
    
    const tempoSelecionado = parseInt(elements.timeInput.value) || 26;
    
    nivelConfigurado = nivelSelecionado;
    currentLevel = nivelSelecionado;
    tempoConfigurado = tempoSelecionado;
    baseTimeLimit = tempoSelecionado;
    
    elements.selectedLevel.textContent = nivelSelecionado;
    elements.selectedTime.textContent = tempoSelecionado;
    elements.configIndicator.style.display = 'block';
    
    alert(`✅ Configurações aplicadas:\nNível: ${nivelSelecionado}\nTempo: ${tempoSelecionado}s por questão`);
    
    fecharModalConfig();
}

// ============================================
// FUNÇÕES DO JOGO
// ============================================

function startGame(reiniciado) {
    limparTimer();

    if (reiniciado === "sim" ){

    }else{ 
    const nivelSalvo = verificarJogoSalvo();
    
    if (nivelSalvo) {
        if (confirm(`🎮 Você tem um jogo do dia de hoje no nível ${nivelSalvo}.\n\nDeseja começar um novo jogo no nível ${nivelSalvo}?`)) {
            iniciarJogoNoNivel(nivelSalvo);
        }
    }
    }

    gameActive = true;
    abaTrocada = false;
    
    // Iniciar estatísticas
    iniciarNovasEstatisticas();
    
    localStorage.removeItem(SAVE_KEY);
    
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    if (elements.vptabuadaBtn) elements. vptabuadaBtn.classList.remove('hidden');

    
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
    
    // Iniciar contagem de tempo para esta questão
    iniciarTempoQuestao();
}

// FUNÇÃO QUE ESTAVA FALTANDO - ESSENCIAL!
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
        
        if (!options.includes(option) && option > 0) {
            options.push(option);
        }
    }
    
    // Embaralhar opções
    options = shuffleArray(options);
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        elements.optionsContainer.appendChild(button);
    });
}

function checkAnswer(answer) {
    if (!gameActive) return;
    
    const acertou = (answer === correctAnswer);
    
    // Registrar resposta com tempo
    registrarResposta(acertou);
    
    desabilitarOpcoes(elements.optionsContainer);
    
    if (acertou) {
        score++;
        remainingCards--;
        elements.scoreElement.textContent = `${score}/${totalQuestions}`;
        elements.resultElement.textContent = correctAnswer;
        
        // Bônus diferenciado por nível
        if (currentLevel >= 8 && currentLevel <= 10) {
            remainingTime += 1.7; // Níveis 8, 9 e 10 ganham 1,7s
        } else {
            remainingTime += 1.5; // Demais níveis ganham 1,5s
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
        setTimeout(() => {
            limparTimer();
            endGame();
        }, 800);
        return;
    }
    
    setTimeout(() => {
        if (gameActive) {
            generateQuestion();
        }
    }, 800);
}

function reiniciarJogo() {
    limparTimer();
    gameActive = false;
    startGame("sim");

}

function limparTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimeDisplay() {
    elements.timeElement.textContent = `${remainingTime.toFixed(1)}s`;
}

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
        if (!gameActive) {
            limparTimer();
            return;
        }
        
        remainingTime = Math.max(0, remainingTime - 0.1);
        remainingTime = Math.round(remainingTime * 10) / 10;
        
        updateTimeDisplay();
        
        const percentage = (remainingTime / timeLimit) * 100;
        atualizarTimerVisual(percentage);
        
        if (remainingTime <= 0.1) {
            limparTimer();
            endGame();
        }
    }, 100);
}

function atualizarTimerVisual(percentage) {
    elements.timerProgress.style.width = `${percentage}%`;
    
    if (percentage <= 25) {
        elements.timerProgress.style.backgroundColor = '#dc3545';
    } else if (percentage <= 50) {
        elements.timerProgress.style.backgroundColor = '#ffc107';
    } else {
        elements.timerProgress.style.backgroundColor = '#20c997';
    }
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
    
    if (score >= totalQuestions || remainingTime <= 0.1) {
        localStorage.removeItem(SAVE_KEY);
    }
    
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.add('hidden');
    if (elements.vptabuadaBtn) elements.vptabuadaBtn.classList.add('hidden');
    
    const venceu = score >= totalQuestions;
    const tempoEsgotado = remainingTime <= 0.1;
    
    if (venceu) {
        elements.resultMessage.textContent = 'Parabéns!';
        elements.resultMessage.classList.remove('lose');
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} questões!`;
    } else if (tempoEsgotado) {
        elements.resultMessage.textContent = 'Tempo esgotado!';
        elements.resultMessage.classList.add('lose');
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} questões.`;
    } else {
        elements.resultMessage.textContent = 'Fim do jogo!';
        elements.resultMessage.classList.add('lose');
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} questões.`;
    }
    
    if (elements.nextLevelBtn) {
        elements.nextLevelBtn.style.display = venceu && currentLevel < 10 ? 'block' : 'none';
    }
    
    // Mostrar botão de estatísticas se houver dados
    if (elements.viewLevelStats) {
        elements.viewLevelStats.style.display = questionStats.length > 0 ? 'inline-block' : 'none';
    }
}

// Detectar quando a página fica visível ou escondida
function setupVisibilityDetection() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', () => handleVisibilityChangeHidden());
    window.addEventListener('focus', () => handleVisibilityChangeVisible());
    window.addEventListener('pagehide', () => handleVisibilityChangeHidden());
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            handleVisibilityChangeVisible();
        }
    });
    
    console.log('✅ Sistema anti-burla ativado (reinício silencioso)');
}

function handleVisibilityChange() {
    if (document.hidden) {
        handleVisibilityChangeHidden();
    } else {
        handleVisibilityChangeVisible();
    }
}

function handleVisibilityChangeHidden() {
    if (!gameActive) return;
    
    console.log('⚠️ Aluno trocou de aba - marcando para reinício');
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

function reiniciarNivelAtual() {
    gameActive = false;
    limparTimer();
    iniciarNivelAtual();
}

function iniciarNivelAtual() {
    gameActive = true;
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
    
    const hoje = new Date().toDateString();
    
    const estado = {
        currentLevel: currentLevel,
        data: hoje,
        timestamp: Date.now()
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
    console.log('💾 Nível salvo para referência:', estado);
}

function verificarJogoSalvo() {
    const savedState = localStorage.getItem(SAVE_KEY);
    if (!savedState) return false;
    
    try {
        const estado = JSON.parse(savedState);
        const hoje = new Date().toDateString();
        
        if (estado.data === hoje) {
            return estado.currentLevel;
        } else {
            localStorage.removeItem(SAVE_KEY);
            return false;
        }
    } catch (e) {
        return false;
    }
}

function iniciarJogoNoNivel(nivel) {
    gameActive = true;
    
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

function retornarparatabuada(){
    console.log("🏠 Voltando para tela inicial da tabuada");
    
    // Parar o jogo
    gameActive = false;
    limparTimer();
    
    // Esconder todas as telas do jogo
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
   
    
    // Mostrar a tela de boas-vindas
    elements.welcomeScreen.classList.remove('hidden');
    
    // Esconder botão de reiniciar
    if (elements.restartBtn) {
        elements.restartBtn.classList.add('hidden');
       
    }

    if (elements.vptabuadaBtn) {
        elements.vptabuadaBtn.classList.add('hidden');
       
    }
    
}

window.addEventListener('beforeunload', () => {
    if (gameActive) {
        salvarEstadoJogo();
    }
});
