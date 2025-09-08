function carregarCSSTabuada() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/tabuada/tabuada.css';
    document.head.appendChild(link);
}

// Variáveis globais do jogo
const tabuadaFuncoes = {
    // Variáveis de estado
    baseTimeLimit: 25,
    correctAnswer: null,
    currentLevel: 1,
    currentMultiplier: 2,
    currentValue: null, 
    gameActive: false,
    remainingCards: 20,
    remainingTime: null,
    score: 0,
    timeLimit: 25,
    timerInterval: null,
    totalQuestions: 20,

    // Elementos do DOM (serão configurados depois)
    elements: null,
    levelConfigs: null,

    // Configurações de nível
    configurarNiveis: function() {
        this.levelConfigs = {
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
    },

    // Função de inicialização
    init: function() {
        this.configurarNiveis();
        this.configurarElementosDOM();
        this.configurarEventListeners();
    },

    configurarElementosDOM: function() {
        this.elements = {
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
            playAgainBtn: document.getElementById('play-again')
        };
    },

    configurarEventListeners: function() {
        const { startBtn, playAgainBtn, nextLevelBtn, deck } = this.elements;
        
        startBtn.addEventListener('click', () => this.startGame());
        playAgainBtn.addEventListener('click', () => this.startGame());
        nextLevelBtn.addEventListener('click', () => this.nextLevel());
        
        deck.addEventListener('click', () => {
            if (this.gameActive) {
                this.generateQuestion();
            }
        });
    },

    startGame: function() {
        const { welcomeScreen, resultScreen, gameScreen, scoreElement, deck } = this.elements;
        
        welcomeScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        const config = this.levelConfigs[this.currentLevel];
        this.totalQuestions = config.totalCards;
        this.timeLimit = Math.floor(this.baseTimeLimit * config.timeMultiplier);
        
        this.score = 0;
        this.remainingCards = this.totalQuestions;
        scoreElement.textContent = `${this.score}/${this.totalQuestions}`;
        deck.querySelector('div').textContent = this.remainingCards;
        this.remainingTime = this.timeLimit;
        this.updateTimeDisplay();
        this.elements.timerProgress.style.width = '100%';
        this.elements.timerProgress.style.backgroundColor = '#20c997';
        
        this.updateLevelInfo();
        this.generateQuestion();
        this.startTimer();
        
        this.gameActive = true;
    },

    updateTimeDisplay: function() {
        this.elements.timeElement.textContent = `${this.remainingTime.toFixed(1)}s`;
    },

    nextLevel: function() {
        if (this.currentLevel < 10) {
            this.currentLevel++;
            this.startGame();
        } else {
            this.currentLevel = 1;
            this.startGame();
        }
    },
    
    updateLevelInfo: function() {
        const { levelDisplay, levelDescription, fixedCard } = this.elements;
        const config = this.levelConfigs[this.currentLevel];
        
        levelDisplay.textContent = this.currentLevel;
        levelDescription.textContent = `Nível ${this.currentLevel}: ${config.description}`;
        
        if (config.multipliers.length === 1) {
            fixedCard.textContent = config.multipliers[0];
            this.currentMultiplier = config.multipliers[0];
        } else {
            fixedCard.textContent = "?";
        }
    },

    startTimer: function() {
        clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            this.remainingTime -= 0.1;
            if (this.remainingTime < 0) this.remainingTime = 0;
            
            this.updateTimeDisplay();
            
            const percentage = (this.remainingTime / this.timeLimit) * 100;
            this.elements.timerProgress.style.width = `${percentage}%`;
            
            if (percentage <= 25) {
                this.elements.timerProgress.style.backgroundColor = '#dc3545';
            } else if (percentage <= 50) {
                this.elements.timerProgress.style.backgroundColor = '#ffc107';
            }
            
            if (this.remainingTime <= 0) {
                clearInterval(this.timerInterval);
                this.endGame();
            }
        }, 100);
    },

    generateQuestion: function() {
        const config = this.levelConfigs[this.currentLevel];
        const { fixedCard, currentNumber, resultElement } = this.elements;
        
        if (config.multipliers.length > 1) {
            const randomIndex = Math.floor(Math.random() * config.multipliers.length);
            this.currentMultiplier = config.multipliers[randomIndex];
            fixedCard.textContent = this.currentMultiplier;
        }
        
        this.currentValue = Math.floor(Math.random() * 10) + 1;
        this.correctAnswer = this.currentMultiplier * this.currentValue;
        
        currentNumber.textContent = this.currentValue;
        resultElement.textContent = '?';
        
        this.generateOptions();
    },

    generateOptions: function() {
        const { optionsContainer } = this.elements;
        optionsContainer.innerHTML = '';
        
        let options = [this.correctAnswer];
        while (options.length < 6) {
            let option;
            do {
                const variation = Math.floor(Math.random() * 9) - 4;
                option = this.correctAnswer + variation;
            } while (option <= 0 || options.includes(option));
            
            options.push(option);
        }
        
        options = this.shuffleArray(options);
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => {
                if (!this.gameActive) return;
                this.checkAnswer(parseInt(button.textContent));
            });
            optionsContainer.appendChild(button);
        });
    },

    checkAnswer: function(answer) {
        const { scoreElement, deck, resultElement } = this.elements;
        
        this.remainingCards--;
        deck.querySelector('div').textContent = this.remainingCards;
        
        if (answer === this.correctAnswer) {
            this.score++;
            scoreElement.textContent = `${this.score}/${this.totalQuestions}`;
            resultElement.textContent = this.correctAnswer;
            this.remainingTime += 1.5;
        } else {
            this.remainingTime -= 1;
            if (this.remainingTime < 0) this.remainingTime = 0;
            resultElement.textContent = this.correctAnswer;
        }
        
        this.updateTimeDisplay();
        const percentage = (this.remainingTime / this.timeLimit) * 100;
        this.elements.timerProgress.style.width = `${percentage}%`;
        
        if (this.score >= this.totalQuestions || this.remainingCards <= 0 || this.remainingTime <= 0) {
            clearInterval(this.timerInterval);
            this.endGame();
            return;
        }
        
        setTimeout(() => this.generateQuestion(), 1000);
    },

    endGame: function() {
        const { gameScreen, resultScreen, resultMessage, resultStats, nextLevelBtn } = this.elements;
        
        this.gameActive = false;
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        if (this.score >= this.totalQuestions) {
            resultMessage.textContent = 'Parabéns!';
            resultMessage.classList.remove('lose');
            resultStats.textContent = `Você acertou ${this.score} de ${this.totalQuestions} questões!`;
            nextLevelBtn.style.display = this.currentLevel < 10 ? 'block' : 'none';
        } else {
            resultMessage.textContent = 'Tempo esgotado!';
            resultMessage.classList.add('lose');
            resultStats.textContent = `Você acertou ${this.score} de ${this.totalQuestions} questões. Tente novamente!`;
            nextLevelBtn.style.display = 'none';
        }
    },

    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Função principal exportada
export function iniciarJogoTabuada() {
    carregarCSSTabuada();
    
    // HTML do jogo
    document.body.innerHTML = ` 
        <div class="jogo-container">
            <div class="container">
                <!-- Tela Inicial -->
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
                
                <!-- Tela de Jogo -->
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

                <div>
                <button class="voltar btn">Voltar para o menu</button>
                </div>


                <!-- Tela de Resultado -->
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
    const assBotaoDeVoltar = document.querySelectorAll('.voltar');
    
    assBotaoDeVoltar.forEach(voltar=> {
    voltar.addEventListener('click', () => {
        location.reload();
    });
});
    
    // Inicializar o jogo após o HTML ser renderizado
    setTimeout(() => {
        tabuadaFuncoes.init();
    }, 100);
}