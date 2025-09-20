function carregarCSSTabuada() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/tabuada/tabuada.css';
    document.head.appendChild(link);
}

// Variáveis globais
let baseTimeLimit = 25;
let correctAnswer = null;
let currentLevel = 1;
let currentMultiplier = 2;
let currentValue = null;
let gameActive = false;
let remainingCards = 20;
let remainingTime = null;
let score = 0;
let timeLimit = 25;
let timerInterval = null;
let totalQuestions = 20;

// Elementos do DOM
let elements = null;
let levelConfigs = null;

// Configurações de nível


// Função de inicialização

// Função principal exportada
export function iniciarJogoTabuada() {
    carregarCSSTabuada();
    
    document.body.innerHTML = ` 
    <div class="jogo-container">
        <button id="restart-btn" class="btn btn-warning hidden">🔄 Reiniciar</button>
        
        <div class="container">
            <div class="screen" id="welcome-screen">
                <h1>Bem vindo ao jogo da tabuada</h1>
                <div class="instructions">
                    <p>Acerte as tabuadas antes que o tempo acabe e passe de nível</p>
                    <p>Vai aparecer a tabuada correspondente ao nível do lado esquerdo e no lado direito a carta que o baralho irá virar</p>
                    <p>Abaixo, escolha a alternativa correta</p>
                    <p>Pense rápido ou o tempo irá acabar</p>
                </div>
                <button class="btn" id="start-btn">Começar</button>
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

            <button class="voltar btn">Voltar para o menu</button>

            <div class="screen hidden" id="result-screen">
                <h2 class="result-title" id="result-message">Parabéns!</h2>
                <p class="result-stats" id="result-stats">Você acertou 20 de 20 cartas!</p>
                <div class="result-buttons">
                    <button class="btn" id="play-again">Jogar Novamente</button>
                    <button class="btn btn-success" id="next-level">Próximo Nível</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Inicializar o jogo
    setTimeout(() => {
        init();
    }, 100);
}

function init() {
    configurarNiveis();
    configurarElementosDOM();
    configurarEventListeners();
    window.tabuada = { currentLevel, score, remainingTime, gameActive };
}

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

function configurarElementosDOM() {
    elements = {
        welcomeScreen: document.getElementById('welcome-screen'),
        gameScreen: document.getElementById('game-screen'),
        resultScreen: document.getElementById('result-screen'),
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
        startBtn: document.getElementById('start-btn'),
        playAgainBtn: document.getElementById('play-again'),
        restartBtn: document.getElementById('restart-btn'),
        voltarBtn: document.querySelector('.voltar')
    };
}

function configurarEventListeners() {
    if (elements.startBtn) elements.startBtn.addEventListener('click', startGame);
    if (elements.playAgainBtn) elements.playAgainBtn.addEventListener('click', startGame);
    if (elements.nextLevelBtn) elements.nextLevelBtn.addEventListener('click', nextLevel);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', reiniciarJogo);
    if (elements.voltarBtn) elements.voltarBtn.addEventListener('click', () => location.reload());
    
    // Event delegation para as opções
    if (elements.optionsContainer) {
        elements.optionsContainer.addEventListener('click', (e) => {
            if (gameActive && e.target.classList.contains('option')) {
                checkAnswer(parseInt(e.target.textContent));
            }
        });
    }

    if (elements.deck) {
        elements.deck.addEventListener('click', () => {
            if (gameActive) {
                generateQuestion();
            }
        });
    }

    // Atalhos de teclado para debug
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey) {
            if (e.key >= '1' && e.key <= '9') {
                currentLevel = parseInt(e.key);
                startGame();
            } else if (e.key === '0') {
                currentLevel = 10;
                startGame();
            }
        }
    });
}

function startGame() {
    limparTimer();
    gameActive = true;
    
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    
    const config = levelConfigs[currentLevel];
    totalQuestions = config.totalCards;
    timeLimit = Math.floor(baseTimeLimit * config.timeMultiplier);
    
    score = 0;
    remainingCards = totalQuestions;
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingCards;
    remainingTime = timeLimit;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    
    updateLevelInfo();
    generateQuestion();
    startTimer();
}

function reiniciarJogo() {
    if (confirm('Reiniciar o jogo? Seu progresso será perdido.')) {
        limparTimer();
        gameActive = false;
        startGame();
    }
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

function generateQuestion() {
    const config = levelConfigs[currentLevel];
    
    if (config.multipliers.length > 1) {
        const randomIndex = Math.floor(Math.random() * config.multipliers.length);
        currentMultiplier = config.multipliers[randomIndex];
        elements.fixedCard.textContent = currentMultiplier;
    }
    
    currentValue = Math.floor(Math.random() * 10) + 1;
    correctAnswer = currentMultiplier * currentValue;
    
    elements.currentNumber.textContent = currentValue;
    elements.resultElement.textContent = '?';
    
    generateOptions();
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
        
        options.push(option);
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
    
    desabilitarOpcoes(elements.optionsContainer);
    
    // CORREÇÃO: Só diminui cartas se acertar!
    if (answer === correctAnswer) {
        score++;
        remainingCards--; // SÓ DIMINUI CARTAS SE ACERTAR
        elements.scoreElement.textContent = `${score}/${totalQuestions}`;
        elements.resultElement.textContent = correctAnswer;
        remainingTime += currentLevel === 10 ? 2.5 : 1.5;
    } else {
        // Se errar, só penaliza o tempo
        remainingTime = Math.max(0.1, remainingTime - 2);
        elements.resultElement.textContent = correctAnswer;
    }
    
    elements.deck.querySelector('div').textContent = remainingCards;
    
    // Arredondar tempo
    remainingTime = Math.round(remainingTime * 10) / 10;
    
    updateTimeDisplay();
    atualizarTimerVisual((remainingTime / timeLimit) * 100);
    
    // Verificar condições de término
    if (score >= totalQuestions) {
        setTimeout(() => {
            limparTimer();
            endGame();
        }, 800);
        return;
    }
    
    if (remainingCards <= 0) {
        setTimeout(() => {
            limparTimer();
            endGame();
        }, 800);
        return;
    }
    
    if (remainingTime <= 0.1) {
        setTimeout(() => {
            limparTimer();
            endGame();
        }, 800);
        return;
    }
    
    // Continuar o jogo
    setTimeout(() => {
        if (gameActive) {
            generateQuestion();
        }
    }, 1000);
}

function desabilitarOpcoes(container) {
    container.querySelectorAll('.option').forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function endGame() {
    gameActive = false;
    limparTimer();
    
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.add('hidden');
    
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
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
