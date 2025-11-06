function carregarCSSEquacoes() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/equacoes/equacoes.css';
    document.head.appendChild(link);
}

// Variáveis globais
let baseTimeLimit = 40;
let correctAnswer = null;
let correctAnswerFraction = null;
let currentLevel = 1;
let currentEquation = null;
let gameActive = false;
let remainingEquations = 20;
let remainingTime = null;
let score = 0;
let timeLimit = 40;
let timerInterval = null;
let totalQuestions = 20;
let errorCount = 0;

// Elementos do DOM
let elements = null;
let levelConfigs = null;

// Configurações de nível
function configurarNiveis() {
    levelConfigs = {
        1: { 
            totalCards: 20, 
            timeLimit: 40,
            description: "Equações básicas com adição e subtração" 
        },
        2: { 
            totalCards: 20, 
            timeLimit: 30,
            description: "Coeficiente inteiro multiplicando a variável" 
        },
        3: { 
            totalCards: 18, 
            timeLimit: 55,
            description: "Combinação de adição/subtração com coeficiente" 
        },
        4: { 
            totalCards: 18, 
            timeLimit: 80,
            description: "Variáveis em ambos os lados e coeficientes negativos" 
        },
        5: { 
            totalCards: 16, 
            timeLimit: 70,
            description: "Coeficientes fracionários e decimais" 
        }
    };
}

// Função MDC (Máximo Divisor Comum)
function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

// Função para simplificar fração
function simplificarFracao(numerador, denominador) {
    const divisor = gcd(numerador, denominador);
    return {
        numerador: numerador / divisor,
        denominador: denominador / divisor
    };
}

// Função principal exportada
export function iniciarJogoEquacoesNivel1a5() {
    carregarCSSEquacoes();
    
    document.body.innerHTML = ` 
    <div class="jogo-container">
        <button id="restart-btn" class="btn btn-warning hidden">🔄 Reiniciar</button>
        
        <div class="container">
            <div class="screen" id="welcome-screen">
                <h1>Bem-vindo ao Jogo de Equações de 1º Grau</h1>
                <div class="instructions">
                    <p>Resolva as equações antes que o tempo acabe e passe de nível</p>
                    <p>Será apresentada uma equação de primeiro grau que você precisa resolver</p>
                    <p>Abaixo, escolha a alternativa correta para o valor de x</p>
                    <p>Pense rápido ou o tempo irá acabar!</p>
                    <p>Dica: Use operações inversas para isolar a variável x</p>
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
                        <div class="info-value" id="time">30s</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">Nível</div>
                        <div class="info-value" id="level-display">1</div>
                    </div>
                </div>
                
                <div class="timer">
                    <div class="timer-progress" id="timer-progress"></div>
                </div>
                
                <p class="info-label" id="level-description">Nível 1: Equações básicas</p>
                
                <div class="equation-display" id="equation-display">
                    <!-- A equação será exibida aqui -->
                </div>
                
                <div class="deck-container">
                    <div class="deck" id="deck">
                        <div>20</div>
                    </div>
                </div>
                
                <div class="options" id="options">
                    <!-- As opções serão geradas pelo JavaScript -->
                </div>
            </div>

            <button class="voltar btn">Voltar para o menu</button>

            <div class="screen hidden" id="result-screen">
                <h2 class="result-title" id="result-message">Parabéns!</h2>
                <p class="result-stats" id="result-stats">Você acertou 20 de 20 equações!</p>
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
        equationDisplay: document.getElementById('equation-display'),
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
                checkAnswer(e.target.textContent);
            }
        });
    }

    if (elements.deck) {
        elements.deck.addEventListener('click', () => {
            if (gameActive) {
                generateEquation();
            }
        });
    }

    // Atalhos de teclado para debug
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey) {
            if (e.key >= '1' && e.key <= '5') {
                currentLevel = parseInt(e.key);
                startGame();
            }
        }
    });
}

function startGame() {
    limparTimer();
    gameActive = true;
    errorCount = 0;
    
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    
    const config = levelConfigs[currentLevel];
    totalQuestions = config.totalCards;
    timeLimit = config.timeLimit;
    
    score = 0;
    remainingEquations = totalQuestions;
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingEquations;
    remainingTime = timeLimit;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    
    updateLevelInfo();
    generateEquation();
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
    currentLevel = currentLevel < 5 ? currentLevel + 1 : 1;
    startGame();
}

function updateLevelInfo() {
    const config = levelConfigs[currentLevel];
    
    elements.levelDisplay.textContent = currentLevel;
    elements.levelDescription.textContent = `Nível ${currentLevel}: ${config.description}`;
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

function generateEquation() {
    let equation = "";
    let solution = 0;
    correctAnswerFraction = null;
    
    // Gerar equações baseadas no nível atual
    switch(currentLevel) {
        case 1:
            // x + a = b ou x - a = b
            if (Math.random() > 0.5) {
                let a1 = Math.floor(Math.random() * 15) + 1;
                let b1 = Math.floor(Math.random() * 15) - 5;
                equation = `x + ${a1} = ${b1}`;
                solution = b1 - a1;
            } else {
                let a2 = Math.floor(Math.random() * 15) + 1;
                let b2 = Math.floor(Math.random() * 15) - 5;
                equation = `x - ${a2} = ${b2}`;
                solution = b2 + a2;
            }
            break;
            
        case 2:
            // a*x = b
            let a3 = Math.floor(Math.random() * 8) + 2;
            let b3 = a3 * (Math.floor(Math.random() * 10) - 3);
            equation = `${a3}x = ${b3}`;
            solution = b3 / a3;
            break;
            
        case 3:
            // a*x + b = c ou a*x - b = c
            if (Math.random() > 0.5) {
                let a4 = Math.floor(Math.random() * 5) + 2;
                let b4 = Math.floor(Math.random() * 10) + 1;
                let c4 = a4 * (Math.floor(Math.random() * 10) - 3) + b4;
                equation = `${a4}x + ${b4} = ${c4}`;
                solution = (c4 - b4) / a4;
            } else {
                let a5 = Math.floor(Math.random() * 5) + 2;
                let b5 = Math.floor(Math.random() * 10) + 1;
                let c5 = a5 * (Math.floor(Math.random() * 10) - 3) - b5;
                equation = `${a5}x - ${b5} = ${c5}`;
                solution = (c5 + b5) / a5;
            }
            break;
            
        case 4:
            // Variáveis em ambos os lados
            const type4 = Math.floor(Math.random() * 3);
            if (type4 === 0) {
                let a6 = Math.floor(Math.random() * 15) - 2;
                let b6 = Math.floor(Math.random() * 10) + 1;
                equation = `${a6} = x + ${b6}`;
                solution = a6 - b6;
            } else if (type4 === 1) {
                let a7 = Math.floor(Math.random() * 5) + 2;
                let b7 = a7 * (Math.floor(Math.random() * 10) - 3);
                equation = `-${a7}x = ${b7}`;
                solution = -b7 / a7;
            } else {
                let a8 = Math.floor(Math.random() * 20) - 5;
                let b8 = Math.floor(Math.random() * 4) + 2;
                let c8 = Math.floor(Math.random() * 8) + 1;
                equation = `${a8} = ${b8}x - ${c8}`;
                solution = (a8 + c8) / b8;
            }
            break;
            
        case 5:
            if (Math.random() > 0.5) {
                // Coeficiente fracionário: (a/b)x = c
                let a, b;
                do {
                    a = Math.floor(Math.random() * 8) + 2;
                    b = Math.floor(Math.random() * 8) + 2;
                } while (a === b);
                
                const c = Math.floor(Math.random() * 8) + 1;
                
                equation = `(${a}/${b})x = ${c}`;
                // Solução: x = (c * b) / a
                const fracao = simplificarFracao(c * b, a);
                solution = (c * b) / a;
                correctAnswerFraction = fracao.denominador === 1 ? 
                    fracao.numerador.toString() : 
                    `${fracao.numerador}/${fracao.denominador}`;
            } else {
                // Coeficiente decimal - ELIMINAR DECIMAIS MULTIPLICANDO AMBOS OS LADOS
                const decimais = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
                const decimal = decimais[Math.floor(Math.random() * decimais.length)];
                const c = Math.floor(Math.random() * 8) + 1;
                
                equation = `${decimal}x = ${c}`;
                
                // MULTIPLICAR AMBOS OS LADOS POR 10 PARA ELIMINAR DECIMAL
                // decimal * x = c  →  (decimal * 10) * x = c * 10
                const coeficienteInteiro = decimal * 10;
                const termoDireito = c * 10;
                
                // Simplificar se possível
                const divisorComum = gcd(coeficienteInteiro, termoDireito);
                const coefSimplificado = coeficienteInteiro / divisorComum;
                const termoSimplificado = termoDireito / divisorComum;
                
                if (coefSimplificado === 1) {
                    // Caso: 1x = N
                    solution = termoSimplificado;
                    correctAnswerFraction = solution.toString();
                } else {
                    // Caso: Ax = B → x = B/A
                    const fracao = simplificarFracao(termoSimplificado, coefSimplificado);
                    solution = termoSimplificado / coefSimplificado;
                    correctAnswerFraction = fracao.denominador === 1 ? 
                        fracao.numerador.toString() : 
                        `${fracao.numerador}/${fracao.denominador}`;
                }
            }
            break;
            
        default:
            // Fallback para qualquer caso inesperado
            let baseA = Math.floor(Math.random() * 5) + 2;
            let baseB = Math.floor(Math.random() * 10) - 2;
            equation = `${baseA}x + ${baseB} = ${baseA * 2 + baseB}`;
            solution = 2;
    }
    
    currentEquation = equation;
    correctAnswer = solution;
    
    elements.equationDisplay.textContent = equation;
    generateOptions();
}

function generateOptions() {
    elements.optionsContainer.innerHTML = '';
    
    // SEMPRE usar a fração exata quando disponível
    const respostaCorreta = correctAnswerFraction !== null ? 
        correctAnswerFraction : correctAnswer.toString();
    
    // Para níveis 5+, usar frações quando disponível
    const deveSerFracao = currentLevel >= 5 || (correctAnswerFraction !== null && correctAnswerFraction.includes('/'));
    
    let options = [respostaCorreta];
    
    // Converter resposta correta para valor numérico para cálculos
    let valorCorretoNumerico;
    if (respostaCorreta.includes('/')) {
        const [num, den] = respostaCorreta.split('/').map(Number);
        valorCorretoNumerico = num / den;
    } else {
        valorCorretoNumerico = parseFloat(respostaCorreta);
    }
    
    // Estratégia mais robusta: gerar opções de forma determinística
    const offsets = [-3, -2, -1, 1, 2, 3];
    let opcoesGeradas = 0;
    
    // Primeira tentativa: usar offsets simples
    for (let offset of offsets) {
        if (opcoesGeradas >= 5) break; // Já temos opções suficientes
        
        let option;
        if (deveSerFracao) {
            // Para frações, usar denominadores fixos e aplicar offset
            const denominadores = [2, 3, 4, 5, 6, 8];
            const den = denominadores[opcoesGeradas % denominadores.length];
            
            let valorOpcao = valorCorretoNumerico + (offset * 0.5);
            let num = Math.round(valorOpcao * den);
            
            // Garantir que não seja zero quando a resposta não é zero
            if (num === 0 && valorCorretoNumerico !== 0) {
                num = offset > 0 ? 1 : -1;
            }
            
            const fracao = simplificarFracao(num, den);
            option = `${fracao.numerador}/${fracao.denominador}`;
        } else {
            // Para números inteiros ou decimais
            if (Number.isInteger(valorCorretoNumerico)) {
                option = (valorCorretoNumerico + offset).toString();
            } else {
                let optionValue = valorCorretoNumerico + (offset * 0.5);
                optionValue = Math.round(optionValue * 100) / 100;
                option = optionValue.toString();
            }
        }
        
        // Verificar se a opção é única e diferente da resposta correta
        if (option && option !== respostaCorreta && !options.includes(option)) {
            options.push(option);
            opcoesGeradas++;
        }
    }
    
    // Segunda estratégia: se ainda não temos opções suficientes, usar multiplicadores
    let multiplicador = 2;
    while (options.length < 6 && multiplicador <= 10) {
        let option;
        
        if (deveSerFracao) {
            if (respostaCorreta.includes('/')) {
                // Manipular a fração original
                const [num, den] = respostaCorreta.split('/').map(Number);
                const novoNum = num + (multiplicador % 2 === 0 ? multiplicador : -multiplicador);
                const fracao = simplificarFracao(novoNum, den);
                option = `${fracao.numerador}/${fracao.denominador}`;
            } else {
                // Criar fração a partir do valor numérico
                const den = [2, 3, 4, 5][multiplicador % 4];
                const num = Math.round((valorCorretoNumerico + multiplicador * 0.3) * den);
                const fracao = simplificarFracao(num, den);
                option = `${fracao.numerador}/${fracao.denominador}`;
            }
        } else {
            // Para números não fracionários
            const variacao = multiplicador * (Math.random() > 0.5 ? 1 : -1);
            if (Number.isInteger(valorCorretoNumerico)) {
                option = (valorCorretoNumerico + variacao).toString();
            } else {
                let optionValue = valorCorretoNumerico + variacao;
                optionValue = Math.round(optionValue * 100) / 100;
                option = optionValue.toString();
            }
        }
        
        if (option && option !== respostaCorreta && !options.includes(option)) {
            options.push(option);
        }
        
        multiplicador++;
        
        // Prevenir loop infinito absoluto
        if (multiplicador > 20) break;
    }
    
    // Terceira estratégia: fallback absoluto
    const fallbacksFracao = ["1/2", "2/3", "3/4", "4/5", "5/6", "7/8", "2/1", "3/2", "4/3", "5/4"];
    const fallbacksInteiro = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    
    while (options.length < 6) {
        let fallbackOption;
        const indice = options.length - 1;
        
        if (deveSerFracao) {
            fallbackOption = fallbacksFracao[indice % fallbacksFracao.length];
            // Modificar ligeiramente para evitar duplicatas
            if (options.includes(fallbackOption)) {
                fallbackOption = fallbacksFracao[(indice + 5) % fallbacksFracao.length];
            }
        } else {
            fallbackOption = fallbacksInteiro[indice % fallbacksInteiro.length];
            if (options.includes(fallbackOption)) {
                fallbackOption = fallbacksInteiro[(indice + 5) % fallbacksInteiro.length];
            }
        }
        
        if (!options.includes(fallbackOption) && fallbackOption !== respostaCorreta) {
            options.push(fallbackOption);
        }
        
        // Última proteção contra loop infinito
        if (options.length < 2 && indice > 10) {
            options.push("1");
            options.push("2");
            options.push("3");
            options.push("1/2");
            options.push("2/3");
            break;
        }
    }
    
    // Embaralhar e criar botões
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        elements.optionsContainer.appendChild(button);
    });
}

function checkAnswer(answerText) {
    if (!gameActive) return;
    
    desabilitarOpcoes(elements.optionsContainer);
    
    // Converter a resposta para número
    let userAnswer;
    if (answerText.includes('/')) {
        const [num, den] = answerText.split('/').map(Number);
        userAnswer = num / den;
    } else {
        userAnswer = parseFloat(answerText);
    }
    
    // Verificar se está correto
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    
    if (isCorrect) {
        score++;
        remainingEquations--;
        elements.scoreElement.textContent = `${score}/${totalQuestions}`;
        remainingTime += 3;
        errorCount = 0;
    } else {
        const penalty = 2 * Math.pow(2, errorCount);
        remainingTime = Math.max(0.1, remainingTime - penalty);
        errorCount++;
    }
    
    elements.deck.querySelector('div').textContent = remainingEquations;
    remainingTime = Math.round(remainingTime * 10) / 10;
    updateTimeDisplay();
    atualizarTimerVisual((remainingTime / timeLimit) * 100);
    
    // Verificar fim do jogo
    if (score >= totalQuestions || remainingEquations <= 0 || remainingTime <= 0.1) {
        setTimeout(() => {
            limparTimer();
            endGame();
        }, 800);
        return;
    }
    
    setTimeout(() => {
        if (gameActive) generateEquation();
    }, 800);
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
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} equações!`;
    } else if (tempoEsgotado) {
        elements.resultMessage.textContent = 'Tempo esgotado!';
        elements.resultMessage.classList.add('lose');
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} equações.`;
    } else {
        elements.resultMessage.textContent = 'Fim do jogo!';
        elements.resultMessage.classList.add('lose');
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} equações.`;
    }
    
    if (elements.nextLevelBtn) {
        elements.nextLevelBtn.style.display = venceu && currentLevel < 5 ? 'block' : 'none';
    }
}