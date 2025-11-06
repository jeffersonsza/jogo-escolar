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
let currentLevel = 10;
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
        6: { 
            totalCards: 13, 
            timeLimit: 110,
            description: "Variáveis em ambos os lados com frações" 
        },
        7: { 
            totalCards: 11, 
            timeLimit: 160,
            description: "Uso de parênteses para agrupamento" 
        },
        8: { 
            totalCards: 10, 
            timeLimit: 230,
            description: "Combinação de frações, decimais e parênteses" 
        },
        9: { 
            totalCards: 10, 
            timeLimit: 230,
            description: "Problemas complexos com múltiplos elementos" 
        },
        10: { 
            totalCards: 10, 
            timeLimit: 260,
            description: "Desafio final - Todas as complexidades" 
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
export function iniciarJogoEquacoesNivel6a10() {
    carregarCSSEquacoes();
    
    document.body.innerHTML = ` 
    <div class="jogo-container">
        <button id="restart-btn" class="btn btn-warning hidden">🔄 Reiniciar</button>
        
        <div class="container">
            <div class="screen" id="welcome-screen">
                <h1>Bem-vindo ao Jogo de Equações de 1º Grau - Níveis Avançados</h1>
                <div class="instructions">
                    <p>Resolva equações complexas antes que o tempo acabe</p>
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
                        <div class="info-value" id="level-display">6</div>
                    </div>
                </div>
                
                <div class="timer">
                    <div class="timer-progress" id="timer-progress"></div>
                </div>
                
                <p class="info-label" id="level-description">Nível 6: Variáveis em ambos os lados com frações</p>
                
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



    // Atalhos de teclado para debug
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey) {
            if (e.key >= '6' && e.key <= '9') {
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
    currentLevel = currentLevel < 10 ? currentLevel + 1 : 6;
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
        case 6:
            // Variáveis em ambos os lados com frações
            let tentativasNivel6 = 0;
            let equacaoValidaN6 = false;
            
            while (!equacaoValidaN6 && tentativasNivel6 < 10) {
                if (Math.random() > 0.5) {
                    let a11 = Math.floor(Math.random() * 5) + 2;
                    let b11 = Math.floor(Math.random() * 5) + 1;
                    let c11 = Math.floor(Math.random() * 4) + 1;
                    let d11 = Math.floor(Math.random() * 5) + 1;
                    
                    // VERIFICAR SE A SOMA DOS COEFICIENTES DE X NÃO É ZERO
                    if (a11 - c11 !== 0) {
                        equation = `${a11}x + ${b11} = ${c11}x + ${d11}`;
                        // Solução: (d11 - b11) / (a11 - c11)
                        const numerador = d11 - b11;
                        const denominador = a11 - c11;
                        const fracao = simplificarFracao(numerador, denominador);
                        solution = numerador / denominador;
                        correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                        equacaoValidaN6 = true;
                    }
                } else {
                    let a12 = Math.floor(Math.random() * 5) + 2;
                    let b12 = Math.floor(Math.random() * 5) + 1;
                    let c12 = Math.floor(Math.random() * 4) + 1;
                    let d12 = Math.floor(Math.random() * 5) + 1;
                    
                    // VERIFICAR SE A SOMA DOS COEFICIENTES DE X NÃO É ZERO
                    if (a12 + c12 !== 0) {
                        equation = `${a12}x - ${b12} = -${c12}x + ${d12}`;
                        // Solução: (d12 + b12) / (a12 + c12)
                        const numerador = d12 + b12;
                        const denominador = a12 + c12;
                        const fracao = simplificarFracao(numerador, denominador);
                        solution = numerador / denominador;
                        correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                        equacaoValidaN6 = true;
                    }
                }
                tentativasNivel6++;
            }
            
            // Fallback se não conseguir gerar equação válida
            if (!equacaoValidaN6) {
                equation = `3x + 2 = x + 6`;
                const fracao = simplificarFracao(4, 2);
                solution = 2;
                correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
            }
            break;

        case 7:
            // Uso de parênteses para agrupamento
            let tentativasNivel7 = 0;
            let equacaoValidaN7 = false;
            
            while (!equacaoValidaN7 && tentativasNivel7 < 10) {
                if (Math.random() > 0.5) {
                    let a13 = Math.floor(Math.random() * 4) + 2;
                    let b13 = Math.floor(Math.random() * 5) + 1;
                    let c13 = Math.floor(Math.random() * 8) + 1;
                    equation = `${a13}(x + ${b13}) = ${c13}`;
                    // Esta equação sempre é válida (não tem risco de 0)
                    const passo1 = simplificarFracao(c13, a13);
                    const passo2Numerador = passo1.numerador - (b13 * passo1.denominador);
                    const fracao = simplificarFracao(passo2Numerador, passo1.denominador);
                    solution = passo2Numerador / passo1.denominador;
                    correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                    equacaoValidaN7 = true;
                } else {
                    let a14 = Math.floor(Math.random() * 4) + 2;
                    let b14 = Math.floor(Math.random() * 5) + 1;
                    let c14 = Math.floor(Math.random() * 5) + 1;
                    let d14 = Math.floor(Math.random() * 8) + 1;
                    
                    // VERIFICAR SE A SOMA DOS COEFICIENTES DE X NÃO É ZERO
                    if (a14 - c14 !== 0) {
                        equation = `${a14}(x - ${b14}) = ${c14}x + ${d14}`;
                        // Solução: (a14*b14 + d14) / (a14 - c14)
                        const numerador = (a14 * b14) + d14;
                        const denominador = a14 - c14;
                        const fracao = simplificarFracao(numerador, denominador);
                        solution = numerador / denominador;
                        correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                        equacaoValidaN7 = true;
                    }
                }
                tentativasNivel7++;
            }
            
            if (!equacaoValidaN7) {
                equation = `2(x - 3) = x + 4`;
                const fracao = simplificarFracao(10, 1);
                solution = 10;
                correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
            }
            break;

        case 8:
            // Combinação de frações, decimais e parênteses
            const tipo8 = Math.floor(Math.random() * 3);
            let tentativasNivel8 = 0;
            let equacaoValidaN8 = false;
            
            while (!equacaoValidaN8 && tentativasNivel8 < 10) {
                if (tipo8 === 0) {
                    // Fração com parênteses (sempre válida)
                    let a15 = Math.floor(Math.random() * 4) + 2;
                    let b15 = Math.floor(Math.random() * 5) + 1;
                    let c15 = Math.floor(Math.random() * 8) + 1;
                    equation = `(${a15}/${b15})(x + ${c15}) = 2`;
                    const passo1 = simplificarFracao(2 * b15, a15);
                    const passo2Numerador = passo1.numerador - (c15 * passo1.denominador);
                    const fracao = simplificarFracao(passo2Numerador, passo1.denominador);
                    solution = passo2Numerador / passo1.denominador;
                    correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                    equacaoValidaN8 = true;
                } else if (tipo8 === 1) {
                    // Decimal com parênteses (sempre válida)
                    const decimal = [0.2, 0.25, 0.5, 0.75][Math.floor(Math.random() * 4)];
                    let b16 = Math.floor(Math.random() * 4) + 1;
                    let c16 = Math.floor(Math.random() * 6) + 1;
                    equation = `${decimal}(x + ${b16}) = ${c16}`;
                    const decimalNumerador = decimal * 100;
                    const passo1 = simplificarFracao(c16 * 100, decimalNumerador);
                    const passo2Numerador = passo1.numerador - (b16 * passo1.denominador);
                    const fracao = simplificarFracao(passo2Numerador, passo1.denominador);
                    solution = passo2Numerador / passo1.denominador;
                    correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                    equacaoValidaN8 = true;
                } else {
                    // Equação com frações em ambos os lados
                    let a17 = Math.floor(Math.random() * 3) + 2;
                    let b17 = Math.floor(Math.random() * 4) + 1;
                    let c17 = Math.floor(Math.random() * 3) + 2;
                    let d17 = Math.floor(Math.random() * 4) + 1;
                    
                    // VERIFICAR SE OS COEFICIENTES NÃO SÃO PROPORCIONAIS (evitar 0)
                    if (a17 * d17 !== c17 * b17) {
                        equation = `(${a17}/${b17})x = (${c17}/${d17})`;
                        const numerador = c17 * b17;
                        const denominador = a17 * d17;
                        const fracao = simplificarFracao(numerador, denominador);
                        solution = numerador / denominador;
                        correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                        equacaoValidaN8 = true;
                    }
                }
                tentativasNivel8++;
            }
            
            if (!equacaoValidaN8) {
                equation = `(2/3)x = (1/4)`;
                const fracao = simplificarFracao(3, 8);
                solution = 3/8;
                correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
            }
            break;

        case 9:
            // Problemas complexos com múltiplos elementos
            const tipo9 = Math.floor(Math.random() * 2);
            let tentativasNivel9 = 0;
            let equacaoValidaN9 = false;
            
            while (!equacaoValidaN9 && tentativasNivel9 < 10) {
                if (tipo9 === 0) {
                    let a18 = Math.floor(Math.random() * 3) + 2;
                    let b18 = Math.floor(Math.random() * 4) + 1;
                    let c18 = Math.floor(Math.random() * 3) + 2;
                    let d18 = Math.floor(Math.random() * 4) + 1;
                    let e18 = Math.floor(Math.random() * 5) + 1;
                    
                    // VERIFICAR SE A DIFERENÇA DOS COEFICIENTES NÃO É ZERO
                    const numeradorCoef = (a18 * e18) - (d18 * b18);
                    if (numeradorCoef !== 0) {
                        equation = `(${a18}/${b18})x + ${c18} = (${d18}/${e18})x - ${b18}`;
                        // Solução: (-b18 - c18) / (a18/b18 - d18/e18)
                        const denominadorComum = b18 * e18;
                        const numeradorEsquerdo = a18 * e18;
                        const numeradorDireito = d18 * b18;
                        const numeradorTotal = (-b18 - c18) * denominadorComum;
                        const denominadorTotal = numeradorEsquerdo - numeradorDireito;
                        const fracao = simplificarFracao(numeradorTotal, denominadorTotal);
                        solution = numeradorTotal / denominadorTotal;
                        correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                        equacaoValidaN9 = true;
                    }
                } else {
                    // Esta equação sempre é válida
                    let a19 = Math.floor(Math.random() * 3) + 2;
                    let b19 = Math.floor(Math.random() * 4) + 1;
                    let c19 = Math.floor(Math.random() * 3) + 2;
                    equation = `(x + ${a19})/${b19} = ${c19}`;
                    // Solução: c19 * b19 - a19
                    const numerador = (c19 * b19) - a19;
                    solution = numerador;
                    correctAnswerFraction = numerador.toString();
                    equacaoValidaN9 = true;
                }
                tentativasNivel9++;
            }
            
            // Fallback se não conseguir gerar equação válida
            if (!equacaoValidaN9) {
                equation = `(2/3)x + 1 = (1/2)x - 3`;
                const fracao = simplificarFracao(-24, 1);
                solution = -24;
                correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
            }
            break;
            
        case 10:
            // Desafio final - Todas as complexidades
            const tipo10 = Math.floor(Math.random() * 2);
            let tentativasNivel10 = 0;
            let equacaoValidaN10 = false;
            
            while (!equacaoValidaN10 && tentativasNivel10 < 10) {
                if (tipo10 === 0) {
                    let a20 = Math.floor(Math.random() * 3) + 2;
                    let b20 = Math.floor(Math.random() * 4) + 1;
                    let c20 = Math.floor(Math.random() * 3) + 2;
                    let d20 = Math.floor(Math.random() * 4) + 1;
                    let e20 = Math.floor(Math.random() * 3) + 1;
                    
                    // VERIFICAR SE A DIFERENÇA DOS COEFICIENTES NÃO É ZERO
                    const diferencaCoef = (a20 * a20) - (c20 * d20);
                    if (diferencaCoef !== 0) {
                        equation = `(${a20}x + ${b20})/${c20} = (${d20}x - ${e20})/${a20}`;
                        const numerador = -(c20 * e20 + a20 * b20);
                        const denominador = (a20 * a20) - (c20 * d20);
                        const fracao = simplificarFracao(numerador, denominador);
                        solution = numerador / denominador;
                        correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                        equacaoValidaN10 = true;
                    }
                } else {
                    // Esta equação sempre é válida
                    let a21 = Math.floor(Math.random() * 3) + 2;
                    let b21 = Math.floor(Math.random() * 4) + 1;
                    let c21 = Math.floor(Math.random() * 3) + 2;
                    let d21 = Math.floor(Math.random() * 4) + 1;
                    equation = `${a21}(x/${b21} + ${c21}) = ${d21}`;
                    const numerador = (d21 - a21 * c21) * b21;
                    const denominador = a21;
                    const fracao = simplificarFracao(numerador, denominador);
                    solution = numerador / denominador;
                    correctAnswerFraction = `${fracao.numerador}/${fracao.denominador}`;
                    equacaoValidaN10 = true;
                }
                tentativasNivel10++;
            }
            
            // Fallback se não conseguir gerar equação válida
            if (!equacaoValidaN10) {
                equation = `(2x + 3)/4 = (x - 1)/2`;
                solution = 5;
                correctAnswerFraction = `5`;
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
    
    // Para níveis 6+, sempre usar frações
    const deveSerFracao = true;
    
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
        elements.nextLevelBtn.style.display = venceu && currentLevel < 10 ? 'block' : 'none';
    }
}
