let elementos = {};
let tempoRestante = 30;
let jogoAtivo = false;
let intervaloTempo = null;

let num1 = 0, den1 = 0;
let num2 = 0, den2 = 0;

let originalDen1 = den1; 
let originalDen2 = den2;

let originalNum1 = num1; 
let originalNum2 = num2;

let currentDenoms = [den1, den2];

let operacaoSimbolo;

const precisaMMC = (d1, d2) => {
        return d1 !== d2;
    };

let fatoresUsados = [];
let lcmAtual = null;

let multiploSelecionado1 = null;
let multiploSelecionado2 = null;
let ultimoMultiplo1 = originalDen1;
let ultimoMultiplo2 = originalDen2;

function carregarcssfracao() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/fracoes/fracoes.css';
    document.head.appendChild(link);
}

export function iniciarJogoDeOperacoesComFracoes() {

    carregarcssfracao()

    setTimeout(()=>{

        ` <div class="jogo-container">

           
            <div id="area-jogo-fracoes"> `

    },100);


    document.body.innerHTML = 

    ` <div class="jogo-container">

           
            <div id="area-jogo-fracoes"> `

    const areadojogodefracoes = document.getElementById('area-jogo-fracoes');

    areadojogodefracoes.innerHTML = 

    `
    <div id="tempo" class="tempo" style="display: none;">30s</div>
    
    <div class="container">
        <!-- Tela de Menu -->
        <div id="tela-menu" class="tela ativa">
            <h1>Bem-vindo ao jogo sobre operações com frações</h1>
            
            <div class="botoes-metodo">
                <button id="btn-soma-subtracao" class="btn">Soma e subtração de frações</button>
                <button id="btn-multiplicacao-divisao" class="btn btn-desabilitado">Multiplicação e divisão de frações</button>
                <button id="btn-todas-operacoes" class="btn btn-desabilitado">Todas as operações</button>
            </div>
            
            <div class="botoes-metodo">
                <button id="btn-comecar" class="btn btn-verde">Começar</button>
            </div>
        </div>
        
        <!-- Tela de Jogo -->
        <div id="tela-jogo" class="tela">
            <h2 id="titulo-operacao">Soma e Subtração de Frações</h2>
            
            <div class="instrucao">
                <p id="texto-tempo">Você tem 30s para terminar</p>
            </div>
            
            <div class="divisao">
                <div class="operacao" id="operacao-atual"></div>
            </div>
            
            <!-- Quiz -->
            <div id="quiz-container" class="quiz">
                <p>Devemos fazer MMC nessa operação?</p>
                <div class="alternativas">
                    <div class="alternativa" data-resposta="sim">Sim</div>
                    <div class="alternativa" data-resposta="nao">Não</div>
                </div>
            </div>
            
            <!-- Mensagem de feedback do quiz -->
            <div id="mensagem-quiz" class="mensagem" style="display: none;"></div>
            
            <!-- Botão de entendimento após erro -->
            <div id="btn-entendeu-container" class="botoes-metodo" style="display: none;">
                <button id="btn-entendeu" class="btn">Entendeu</button>
            </div>
            
            <!-- Operação sem MMC -->
            <div id="operacao-sem-mmc" style="display: none;">
                <div class="operacao-completa">
                    <div class="fracao">
                        <div class="numerador" id="num1-sem-mmc"></div>
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="den1-sem-mmc"></div>
                    </div>
                    
                    <span id="operador-sem-mmc"></span>
                    
                    <div class="fracao">
                        <div class="numerador" id="num2-sem-mmc"></div>
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="den2-sem-mmc"></div>
                    </div>
                    
                    <span>=</span>
                    
                    <div class="fracao">
                        <input type="number" class="input-fracao" id="resposta-sem-mmc">
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="den-comum-sem-mmc"></div>
                    </div>
                </div>
                
                <div class="botoes-metodo">
                    <button id="btn-enviar-sem-mmc" class="btn">Enviar</button>
                </div>
                
                <div id="mensagem-sem-mmc" class="mensagem" style="display: none;"></div>
            </div>
            
            <!-- Escolha do método MMC -->
            <div id="escolha-metodo" style="display: none;">
                <h3>Qual método para achar o MMC você gostaria de utilizar?</h3>
                
                <div class="botoes-metodo">
                    <button id="btn-fatoracao" class="btn">Fatoração simultânea</button>
                    <button id="btn-multiplos" class="btn">Método dos múltiplos</button>
                </div>
                
                <div class="mensagem sucesso">
                    <p>Você ganhou mais 30s!</p>
                </div>
            </div>
            
            <!-- Método de Fatoração -->
            <div id="metodo-fatoracao" style="display: none;">
                <h3>Método de Fatoração Simultânea</h3>
                
                <div class="instrucao">
                    <p>Agora digite um número que divida pelo menos um dos dois denominadores</p>
                </div>
                
                <div class="fatoracao-container">
                    <div class="linha-fatoracao">
                        <div class="numeros-esquerda">
                            <div class="numero-circulo" id="denom-1"></div>
                            <div class="numero-circulo" id="denom-2"></div>
                        </div>
                        <div class="linha-divisoria"></div>
                        <div class="input-container">
                            <input type="number" class="input-numero" min="2" id="input-fator-0">
                            <button class="btn-ir" id="btn-ir-0">Ir</button>
                        </div>
                    </div>
                    <div id="linhas-adicionais"></div>
                </div>
                
                <div id="pergunta-multiplicacao" class="pergunta-multiplicacao" style="display: none;">
                    <h3>O que fazemos agora?</h3>
                    <div class="alternativas">
                        <div class="alternativa" data-acao="somar">Somamos os valores à direita</div>
                        <div class="alternativa" data-acao="multiplicar">Multiplicamos os valores à direita</div>
                        <div class="alternativa" data-acao="subtrair">Subtraímos os valores à direita</div>
                        <div class="alternativa" data-acao="dividir">Dividimos os valores à direita</div>
                    </div>
                </div>
                
                <div id="input-multiplicacao-container" style="display: none; text-align: center;">
                    <p>Agora multiplique os fatores e digite o resultado:</p>
                    <input type="number" class="input-multiplicacao" id="input-multiplicacao">
                    <div class="botoes-metodo">
                        <button id="btn-verificar-multiplicacao" class="btn">Verificar</button>
                    </div>
                </div>
                
                <div id="mensagem-fatoracao" class="mensagem" style="display: none;"></div>
            </div>
            
            <!-- Método dos Múltiplos -->
            <div id="metodo-multiplos" style="display: none;">
                <h3>Método dos Múltiplos</h3>
                
                <div class="multiplos-container">
                    <!-- Coluna Denominador A -->
                    <div class="coluna-multiplos">
                        <h3>Denominador A = <span id="valor-denom-1"></span></h3>
                        
                        <!-- Linhas dos múltiplos serão geradas dinamicamente via JavaScript -->
                        <div id="linhas-multiplos-1" class="linhas-multiplos"></div>
                    </div>
                    
                    <!-- Coluna Denominador B -->
                    <div class="coluna-multiplos">
                        <h3>Denominador B = <span id="valor-denom-2"></span></h3>
                        
                        <!-- Linhas dos múltiplos serão geradas dinamicamente via JavaScript -->
                        <div id="linhas-multiplos-2" class="linhas-multiplos"></div>
                    </div>
                </div>
                <button id="btn-proximo-multiplo" class="btn">Mais um linha</button>
                <div class="botoes-metodo">
                    <button id="btn-verificar-multiplos" class="btn btn-verificar-multiplos">Verificar MMC</button>
                </div>
                
                <div id="mensagem-multiplos" class="mensagem" style="display: none;"></div>
                
            </div>

            
            <!-- Nova operação com denominador comum -->
            <div id="nova-operacao" style="display: none;">
                <h3>Agora complete a operação com o novo denominador</h3>
                
                <div class="operacao-completa">
                    <div class="fracao">
                        <input type="number" class="input-fracao" id="novo-num1" placeholder="">
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="novo-den"></div>
                    </div>
                    
                    <span id="novo-operador"></span>
                    
                    <div class="fracao">
                        <input type="number" class="input-fracao" id="novo-num2" placeholder="">
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="novo-den2"></div>
                    </div>
                    
                    <span>=</span>
                    
                    <div class="fracao">
                        <div class="input-fracao" id="resultado-final"></div>
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="den-final"></div>
                    </div>
                </div>
                
                <div class="flexas-container">
                    <div class="flexa">
                        <div class="seta">↑</div>
                        <div class="explicacao"><span id="multiplicador1"></span></div>
                        <div class="seta">↑</div>
                        <div class="explicacao"><span id="divisor1"></span></div>
              
                    </div>
                    <div class="flexa">
                        <div class="seta">↑</div>
                        <div class="explicacao"><span id="multiplicador2"></span></div>
                        <div class="seta">↑</div>
                        <div class="explicacao"><span id="divisor2"></span></div>
                       
                    </div>
                </div>
                
                <div class="botoes-metodo">
                    <button id="btn-verificar-numeradores" class="btn">Verificar os novos numeradores</button>
                </div>
                
                <div id="mensagem-nova-operacao" class="mensagem" style="display: none;"></div>
            </div>
            
            <!-- Resultado Final -->
            <div id="resultado-final-container" style="display: none;">
                <div class="operacao-completa">
                    <div class="fracao">
                        <div class="numerador" id="final-num1"></div>
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="final-den1"></div>
                    </div>
                    
                    <span id="final-operador"></span>
                    
                    <div class="fracao">
                        <div class="numerador" id="final-num2"></div>
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="final-den2"></div>
                    </div>
                    
                    <span>=</span>
                    
                    <div class="fracao">
                        <input type="number" class="input-fracao" id="resposta-final">
                        <div class="linha-fracao"></div>
                        <div class="denominador" id="denresultado"></div>
                    </div>
                </div>
                
                <div class="botoes-metodo">
                    <button id="btn-enviar-final" class="btn">Enviar</button>
                </div>
                
                <div id="mensagem-final" class="mensagem" style="display: none;"></div>
            </div>
            
            <!-- Tela de tempo esgotado -->
            <div id="tempo-esgotado" class="tela-final" style="display: none;">
                <h2>Tempo Esgotado!</h2>
                <p>Você não conseguiu terminar a tempo.</p>
                <div class="botoes-metodo">
                    <button id="btn-jogar-novamente" class="btn">Jogar Novamente</button>
                    <button id="btn-voltar-menu" class="btn btn-vermelho">Voltar ao Menu</button>
                </div>
            </div>
            
            <!-- Tela de parabéns -->
            <div id="parabens" class="tela-final" style="display: none;">
                <h2>Parabéns!</h2>
                <p>Você completou a operação corretamente!</p>
                <div class="botoes-metodo">
                    <button id="btn-novo-jogo" class="btn">Jogar Novamente</button>
                    <button id="btn-menu-final" class="btn">Voltar ao Menu</button>
                </div>
            </div>
        </div>
    </div>
    `
    elementos = {}

    elementos.tela =  {
        telaMenu: document.getElementById('tela-menu'),
        telaJogo: document.getElementById('tela-jogo'),
        tempoEsgotado: document.getElementById('tempo-esgotado'),
        tempoDisplay: document.getElementById('tempo'),
        parabens: document.getElementById('parabens'),
        operacaoSemMmc: document.getElementById('operacao-sem-mmc')
    };

    elementos.botoes = {
        btnComecar: document.getElementById('btn-comecar'),
        btnSomaSub: document.getElementById('btn-soma-subtracao'),
        btnEntendeu: document.getElementById('btn-entendeu'),
        btnJogarNovamente: document.getElementById('btn-jogar-novamente'),
        btnVoltarMenu: document.getElementById('btn-voltar-menu'),
        btnNovoJogo: document.getElementById('btn-novo-jogo'),
        btnMenuFinal: document.getElementById('btn-menu-final'),
        btnIr0: document.getElementById('btn-ir-0'),
        todoBotoes: document.querySelectorAll('button')
};

    elementos.quiz = {
        quizAlternativas: document.querySelectorAll('#quiz-container .alternativa'),
        mensagemQuiz: document.getElementById('mensagem-quiz'),
        btnEntendeuContainer: document.getElementById('btn-entendeu-container'),
        quizContainer: document.getElementById('quiz-container')  
    };

    elementos.metodo = {
        escolhaMetodo: document.getElementById('escolha-metodo'),
        btnFatoracao: document.getElementById('btn-fatoracao'),
        btnMultiplos: document.getElementById('btn-multiplos')
    };


    elementos.fatoracao = {
        metodoFator: document.getElementById('metodo-fatoracao'),
        linhasAdicionais: document.getElementById('linhas-adicionais'),
        denom1Circulo: document.getElementById('denom-1'),
        denom2Circulo: document.getElementById('denom-2'),
        perguntaMultiplicacao: document.getElementById('pergunta-multiplicacao'),
        inputMultiplicacaoContainer: document.getElementById('input-multiplicacao-container'),
        inputMultiplicacao: document.getElementById('input-multiplicacao'),
        btnVerificarMultiplicacao: document.getElementById('btn-verificar-multiplicacao'),
        mensagemFatoracao: document.getElementById('mensagem-fatoracao'),
        input: document.querySelectorAll('input')
    };

    elementos.multiplos = {
        
        titulo1: document.getElementById('titulo-denom-1'),
        titulo2: document.getElementById('titulo-denom-2'),
        metodoMultiplos: document.getElementById('metodo-multiplos'),
        multiplosDenom1: document.getElementById('multiplos-denom-1'),
        multiplosDenom2: document.getElementById('multiplos-denom-2'),
        input1: document.getElementById('input-multiplo-1'),
        input2: document.getElementById('input-multiplo-2'),
        btnAdicionar1: document.getElementById('btn-adicionar-1'),
        btnAdicionar2: document.getElementById('btn-adicionar-2'),
        btnVerificarMultiplos: document.getElementById('btn-verificar-multiplos'),
        mensagemMultiplos: document.getElementById('mensagem-multiplos'),
        
     
        valorDenom1: document.getElementById('valor-denom-1'),
        valorDenom2: document.getElementById('valor-denom-2'),
        linhasMultiplos1: document.getElementById('linhas-multiplos-1'),
        linhasMultiplos2: document.getElementById('linhas-multiplos-2')
    };

    elementos.novaOperacao = {
        operacaoAtual: document.getElementById('operacao-atual'),
        novaOperacao: document.getElementById('nova-operacao'),
        novoDen: document.getElementById('novo-den'),
        novoDen2: document.getElementById('novo-den2'),
        novoNum1: document.getElementById('novo-num1'),
        novoNum2: document.getElementById('novo-num2'),
        resultadoFinal: document.getElementById('resultado-final'),
        divisor1Span: document.getElementById('divisor1'),
        divisor2Span: document.getElementById('divisor2'),
        multiplicador1Span: document.getElementById('multiplicador1'),
        multiplicador2Span: document.getElementById('multiplicador2'),
        btnVerificarNumeradores: document.getElementById('btn-verificar-numeradores'),
        mensagemNovaOperacao: document.getElementById('mensagem-nova-operacao'),
        denFinal: document.getElementById('den-final')
    };

    elementos.resultadoFinal = {
        resultadoFinalContainer: document.getElementById('resultado-final-container'),
        respostaFinalInput: document.getElementById('resposta-final'),
        btnEnviarFinal: document.getElementById('btn-enviar-final'),
        mensagemFinal: document.getElementById('mensagem-final'),
        resultadoFinalInput: document.getElementById('resultado-final')

    };

    elementos.outros = {
        finalNum1: document.getElementById('final-num1'),
        finalNum2: document.getElementById('final-num2'),
        finalDen1: document.getElementById('final-den1'),
        finalDen2: document.getElementById('final-den2')
       
    };

     elementos.botoes.btnComecar.addEventListener('click', () => {
        elementos.tela.telaMenu.classList.remove('ativa');
        elementos.tela.telaJogo.classList.add('ativa');
       
        iniciarJogo();                     
    });

    elementos.botoes.btnJogarNovamente.addEventListener('click', () => { 
     
        iniciarJogo(); 
        elementos.tela.tempoEsgotado.style.display = 'none';
    });

    elementos.botoes.btnVoltarMenu.addEventListener('click', () => {
        elementos.tela.telaJogo.classList.remove('ativa');
        elementos.tela.telaMenu.classList.add('ativa');
        jogoAtivo = false;
        if (intervaloTempo) clearInterval(intervaloTempo);
        elementos.tela.tempoDisplay.style.display = 'none';   
        elementos.botoes.btnComecar.classList.remove('btn-desabilitado');
        elementos.botoes.btnComecar.disabled = false;
    });


    elementos.botoes.btnMenuFinal.addEventListener('click', () => {
        elementos.tela.parabens.style.display = 'none';
        elementos.tela.telaJogo.classList.remove('ativa');
        elementos.tela.telaMenu.classList.add('ativa');
        jogoAtivo = false;
        if (intervaloTempo) clearInterval(intervaloTempo);
        elementos.tela.tempoDisplay.style.display = 'none';
        elementos.botoes.btnComecar.classList.remove('btn-desabilitado');
        elementos.botoes.btnComecar.disabled = false;
    });

    elementos.quiz.quizAlternativas.forEach(alt => {
        alt.addEventListener('click', (e) => {
            if (!jogoAtivo) return;
            const resposta = alt.getAttribute('data-resposta');
            const precisa = precisaMMC(den1, den2);
            if ((resposta === 'sim' && precisa) || (resposta === 'nao' && !precisa)) {
                // correto
                elementos.quiz.mensagemQuiz.style.display = 'block';
                elementos.quiz.mensagemQuiz.className = 'mensagem sucesso';
                elementos.quiz.mensagemQuiz.textContent = 'Correto! Vamos para a próxima etapa.';

                // destacar alternativa
                alt.classList.add('correta');
                // se precisa de MMC: mostrar escolha do método (+30s)
                setTimeout(() => {
                    document.getElementById('quiz-container').style.display = 'none';
                    if (precisa) {
                        elementos.metodo.escolhaMetodo.style.display = 'block';
                        adicionarTempo(30); // ganhou +30s
                        // prepare denomos
                        elementos.fatoracao.denom1Circulo.textContent = originalDen1;
                        elementos.fatoracao.denom2Circulo.textContent = originalDen2;
                    } else {
                        // operação sem mmc
                        document.getElementById('operacao-sem-mmc').style.display = 'block';
                        document.getElementById('num1-sem-mmc').textContent = num1;
                        document.getElementById('num2-sem-mmc').textContent = num2;
                        document.getElementById('den1-sem-mmc').textContent = den1;
                        document.getElementById('den2-sem-mmc').textContent = den2;
                        document.getElementById('den-comum-sem-mmc').textContent = den1;
                        document.getElementById('operador-sem-mmc').textContent = operacaoSimbolo;
                        document.getElementById('mensagem-sem-mmc').style.display = 'none';
                    }
                }, 800);
            } else {
                // incorreto
                elementos.quiz.mensagemQuiz.style.display = 'block';
                elementos.quiz.mensagemQuiz.className = 'mensagem erro';
                elementos.quiz.mensagemQuiz.textContent = 'Incorreto. Explicação: se os denominadores são diferentes, precisamos encontrar um denominador comum (MMC).';
                alt.classList.add('incorreta');
                elementos.quiz.btnEntendeuContainer.style.display = 'flex';
            }
        });
    });

    elementos.botoes.btnEntendeu.addEventListener('click', () => {
        elementos.quiz.btnEntendeuContainer.style.display = 'none';
        elementos.quiz.mensagemQuiz.style.display = 'none';
        // após entender, leva para escolha de metodo (não dar bonus)
        document.getElementById('quiz-container').style.display = 'none';
        elementos.metodo.escolhaMetodo.style.display = 'block';
    });

    elementos.metodo.btnFatoracao.addEventListener('click', () => {
        elementos.metodo.escolhaMetodo.style.display = 'none';
        elementos.fatoracao.metodoFator.style.display = 'block';
        // inicializar os elementos
        elementos.fatoracao.denom1Circulo.textContent = currentDenoms[0];
        elementos.fatoracao.denom2Circulo.textContent = currentDenoms[1];
    });

    elementos.metodo.btnMultiplos.addEventListener('click', () => {
        elementos.metodo.escolhaMetodo.style.display = 'none';
        elementos.multiplos.metodoMultiplos.style.display = 'block';
        inicializarMultiplos();
    });

    elementos.botoes.btnIr0.addEventListener('click', () => {
        const val = parseInt(document.getElementById('input-fator-0').value, 10);
        handleFator(val, 0);

    });

    elementos.fatoracao.metodoFator.querySelectorAll('.pergunta-multiplicacao .alternativa, #pergunta-multiplicacao .alternativa').forEach(alt => {
        alt.addEventListener('click', (e) => {
            if (!jogoAtivo) return;
            const acao = alt.getAttribute('data-acao');
            if (acao === 'multiplicar') {
                // correto
                elementos.fatoracao.perguntaMultiplicacao.style.display = 'none';
                elementos.fatoracao.inputMultiplicacaoContainer.style.display = 'block';
            } else {
                // incorreto -> pedir para tentar novamente
                elementos.fatoracao.mensagemFatoracao.className = 'mensagem erro';
                elementos.fatoracao.mensagemFatoracao.textContent = 'Resposta incorreta. Tente novamente: devemos multiplicar os fatores à direita.';
                elementos.fatoracao.mensagemFatoracao.style.display = 'block';
            }
        });   
    });

    elementos.fatoracao.btnVerificarMultiplicacao.addEventListener('click', () => {
        const val = parseInt(elementos.fatoracao.inputMultiplicacao.value, 10);
        if (!val) {
            elementos.fatoracao.mensagemFatoracao.className = 'mensagem erro';
            elementos.fatoracao.mensagemFatoracao.textContent = 'Digite o resultado da multiplicação.';
            elementos.fatoracao.mensagemFatoracao.style.display = 'block';
            return;
        }
     // lcm calculado a partir dos denominadores originais
        const esperado = lcm(originalDen1, originalDen2);
        if (val === esperado) {
            // acertou -> mostrar nova operação (com denominador comum)
            elementos.fatoracao.inputMultiplicacaoContainer.style.display = 'none';
            elementos.fatoracao.mensagemFatoracao.className = 'mensagem sucesso';
            elementos.fatoracao.mensagemFatoracao.textContent = 'Correto! Vamos montar a nova operação com o denominador comum.';
            elementos.fatoracao.mensagemFatoracao.style.display = 'block';
            adicionarTempo(0); // já adicionado 30 no quiz; per instructions: +30s se fez tudo sem errar (já dado)
            // configurar nova operação
            setTimeout(() => {
                elementos.fatoracao.mensagemFatoracao.style.display = 'none';
                lcmAtual = esperado;
                prepararNovaOperacaoComDenominador(lcmAtual);
            }, 800);
        } else {
            elementos.fatoracao.mensagemFatoracao.className = 'mensagem erro';
            elementos.fatoracao.mensagemFatoracao.textContent = `Valor incorreto. O MMC esperado é ${esperado}. Tente novamente.`;
            elementos.fatoracao.mensagemFatoracao.style.display = 'block';
        }
    });    

    elementos.multiplos.btnVerificarMultiplos.addEventListener('click', () => {
        // Buscar múltiplos selecionados em ambas as colunas
        const multiplo1 = elementos.multiplos.linhasMultiplos1.querySelector('.numero-multiplo.selecionado');
        const multiplo2 = elementos.multiplos.linhasMultiplos2.querySelector('.numero-multiplo.selecionado');
        
        if (!multiplo1 || !multiplo2) {
            elementos.multiplos.mensagemMultiplos.className = 'mensagem erro';
            elementos.multiplos.mensagemMultiplos.textContent = 'Selecione um múltiplo em cada coluna antes de verificar.';
            elementos.multiplos.mensagemMultiplos.style.display = 'block';
            return;
        }
        
        const valor1 = parseInt(multiplo1.dataset.valor);
        const valor2 = parseInt(multiplo2.dataset.valor);
        
        if (valor1 === valor2) {
            // MMC encontrado!
            elementos.multiplos.mensagemMultiplos.className = 'mensagem sucesso';
            elementos.multiplos.mensagemMultiplos.textContent = `MMC encontrado: ${valor1}`;
            elementos.multiplos.mensagemMultiplos.style.display = 'block';
            
            lcmAtual = valor1;
            setTimeout(() => {
                elementos.multiplos.mensagemMultiplos.style.display = 'none';
                prepararNovaOperacaoComDenominador(lcmAtual);
            }, 800);
        } else {
            elementos.multiplos.mensagemMultiplos.className = 'mensagem erro';
            elementos.multiplos.mensagemMultiplos.textContent = 'Os múltiplos selecionados são diferentes. Selecione o mesmo valor em ambas as colunas.';
            elementos.multiplos.mensagemMultiplos.style.display = 'block';
        }
    });

    elementos.multiplos.linhasMultiplos1.addEventListener('click', (e) => {
        if (e.target.classList.contains('numero-multiplo')) {
            const valor = parseInt(e.target.dataset.valor);
            selecionarMultiplo(1, valor);
            e.target.classList.add('selecionado');
        }
    });

    elementos.multiplos.linhasMultiplos2.addEventListener('click', (e) => {
        if (e.target.classList.contains('numero-multiplo')) {
            const valor = parseInt(e.target.dataset.valor);
            selecionarMultiplo(2, valor);
            e.target.classList.add('selecionado');
        }
    });

    elementos.novaOperacao.btnVerificarNumeradores.addEventListener('click', () => {
        const v1 = parseInt(elementos.novaOperacao.novoNum1.value, 10);
        const v2 = parseInt(elementos.novaOperacao.novoNum2.value, 10);
       
        if (!v1 || !v2) {
            elementos.novaOperacao.mensagemNovaOperacao.className = 'mensagem erro';
            elementos.novaOperacao.mensagemNovaOperacao.textContent = 'Você deve preencher os dois novos numeradores.';
            elementos.novaOperacao.mensagemNovaOperacao.style.display = 'block';
            return;
        }
        const mult1 = lcmAtual / originalDen1; // Calcula o multiplicador 1
        const mult2 = lcmAtual / originalDen2; // Calcula o multiplicador 2
        
        const esperado1 = originalNum1 * mult1;
        const esperado2 = originalNum2 * mult2;
     
        if (v1 === esperado1 && v2 === esperado2) {
            elementos.novaOperacao.mensagemNovaOperacao.className = 'mensagem sucesso';
            elementos.novaOperacao.mensagemNovaOperacao.textContent = 'Numeradores corretos! Você ganhou +15s.';
            elementos.novaOperacao.mensagemNovaOperacao.style.display = 'block';
            adicionarTempo(15);
            // preparar tela de resultado final - bloquear outros botões
            setTimeout(() => {
                elementos.novaOperacao.mensagemNovaOperacao.style.display = 'none';
                // preencher resultado final dos numeradores (mostra os numeros para o usuário confirmar)
                document.getElementById('final-num1').textContent = esperado1;
                document.getElementById('final-num2').textContent = esperado2;
                document.getElementById('final-den1').textContent = lcmAtual;
                document.getElementById('final-den2').textContent = lcmAtual;
                document.getElementById('denresultado').textContent = lcmAtual;
                // esconder a área de novaOperacao e mostrar resultado final
                elementos.novaOperacao.novaOperacao.style.display = 'none';
                elementos.resultadoFinal.resultadoFinalContainer.style.display = 'block';
                // desabilitar outros inputs para evitar confusão
                let botaox = document.querySelectorAll('button');
                disableAllExceptFinal(botaox);
            }, 900);
        } else {
            elementos.novaOperacao.mensagemNovaOperacao.className = 'mensagem erro';
            elementos.novaOperacao.mensagemNovaOperacao.textContent = 'Numeradores incorretos. Tente novamente.';
            elementos.novaOperacao.mensagemNovaOperacao.style.display = 'block';
        }
    });

elementos.resultadoFinal.btnEnviarFinal.addEventListener('click', () => {
    const resposta = parseInt(elementos.resultadoFinal.respostaFinalInput.value, 10);
    if (!resposta && resposta !== 0) {
        elementos.resultadoFinal.mensagemFinal.className = 'mensagem erro';
        elementos.resultadoFinal.mensagemFinal.textContent = 'Digite um número antes de enviar.';
        elementos.resultadoFinal.mensagemFinal.style.display = 'block';
        return;
    }
    
    // CORREÇÃO: Verificar o símbolo da operação
    let esperado;
    if (operacaoSimbolo === '+') {
        esperado = (originalNum1 * (lcmAtual / originalDen1)) + (originalNum2 * (lcmAtual / originalDen2));
    } else {
        esperado = (originalNum1 * (lcmAtual / originalDen1)) - (originalNum2 * (lcmAtual / originalDen2));
    }
    
    if (resposta === esperado) {
        elementos.resultadoFinal.mensagemFinal.className = 'mensagem sucesso';
        elementos.resultadoFinal.mensagemFinal.textContent = 'Parabéns! Você terminou corretamente.';
        elementos.resultadoFinal.mensagemFinal.style.display = 'block';
        jogoAtivo = false;
        elementos.tela.tempoDisplay.style.display = 'none';
        setTimeout(() => {
            elementos.resultadoFinal.resultadoFinalContainer.style.display = 'none';
            elementos.tela.parabens.style.display = 'block';
        }, 800);
    } else {
        elementos.resultadoFinal.mensagemFinal.className = 'mensagem erro';
        elementos.resultadoFinal.mensagemFinal.textContent = 'Resposta errada. Tente novamente.';
        elementos.resultadoFinal.mensagemFinal.style.display = 'block';
    }
});


document.getElementById('btn-enviar-sem-mmc').addEventListener('click', () => {
    const v = document.getElementById('resposta-sem-mmc').value;
    if (!v) {
        document.getElementById('mensagem-sem-mmc').className = 'mensagem erro';
        document.getElementById('mensagem-sem-mmc').textContent = 'Erro: você precisa digitar um valor.';
        document.getElementById('mensagem-sem-mmc').style.display = 'block';
        return;
    }
    // verificar
    // se não precisa de mmc denominadores são iguais e o denominador comum é original den
    const denomComum = (den1 === den2) ? den1 : null;
    if (denomComum === null) {
        document.getElementById('mensagem-sem-mmc').className = 'mensagem erro';
        document.getElementById('mensagem-sem-mmc').textContent = 'Essa operação na verdade exige denominador comum. Volte e tente MMC.';
        document.getElementById('mensagem-sem-mmc').style.display = 'block';
        return;
    }
    
    // CORREÇÃO: Verificar o símbolo da operação
    let esperado;
    if (operacaoSimbolo === '+') {
        esperado = originalNum1 + originalNum2;
    } else {
        esperado = originalNum1 - originalNum2;
    }
    
    if (parseInt(v, 10) === esperado) {
        elementos.resultadoFinal.mensagemFinal.className = 'mensagem sucesso';
        elementos.resultadoFinal.mensagemFinal.textContent = 'Parabéns! Você terminou corretamente.';
        elementos.resultadoFinal.mensagemFinal.style.display = 'block';
        jogoAtivo = false;
        elementos.tela.tempoDisplay.style.display = 'none';
        setTimeout(() => {
            elementos.tela.operacaoSemMmc.style.display = 'none';
            elementos.tela.parabens.style.display = 'block';
        }, 800);

    } else {
        document.getElementById('mensagem-sem-mmc').className = 'mensagem erro';
        document.getElementById('mensagem-sem-mmc').textContent = 'Resposta errada. Tente novamente.';
        document.getElementById('mensagem-sem-mmc').style.display = 'block';
    }
});

    elementos.botoes.btnNovoJogo.addEventListener('click', () => {
        // restaurar menu do jogo
        elementos.tela.parabens.style.display = 'none';
        iniciarJogo();
    });




    elementos.botoes.btnSomaSub.classList.add('btn-verde');

    window.addEventListener('beforeunload', () => {
        if (intervaloTempo) clearInterval(intervaloTempo);
    });

    document.getElementById('btn-proximo-multiplo').addEventListener('click', () => {
    // Encontrar o último multiplicador usado em cada coluna
    const ultimoMultiplicador1 = elementos.multiplos.linhasMultiplos1.children.length;
    const ultimoMultiplicador2 = elementos.multiplos.linhasMultiplos2.children.length;
    
    // Criar próxima linha para ambas as colunas
    criarLinhaMultiplo(1, ultimoMultiplicador1 + 1, originalDen1);
    criarLinhaMultiplo(2, ultimoMultiplicador2 + 1, originalDen2);
});

    
}


function iniciarJogo() {

        resetTudo();
        jogoAtivo = true;
        tempoRestante = 60;
        mostrarTempo();
        iniciarTemporizador();
    };

function resetTudo() {
    gerarFracao();

    originalDen1 = den1; 
    originalDen2 = den2;
    originalNum1 = num1; 
    originalNum2 = num2;

    // Reset das variáveis de controle
    currentDenoms = [originalDen1, originalDen2];
    fatoresUsados = [];
    lcmAtual = null;
    multiploSelecionado1 = originalDen1;
    multiploSelecionado2 = originalDen2;
    ultimoMultiplo1 = originalDen1;
    ultimoMultiplo2 = originalDen2;

    // Esconder todas as telas internas
    elementos.quiz.mensagemQuiz.style.display = 'none';
    elementos.quiz.btnEntendeuContainer.style.display = 'none';
    elementos.tela.operacaoSemMmc.style.display = 'none';
    elementos.metodo.escolhaMetodo.style.display = 'none';
    elementos.fatoracao.metodoFator.style.display = 'none';
    elementos.multiplos.metodoMultiplos.style.display = 'none';
    elementos.novaOperacao.novaOperacao.style.display = 'none';
    elementos.resultadoFinal.resultadoFinalContainer.style.display = 'none';
    elementos.tela.tempoEsgotado.style.display = 'none';
    elementos.tela.parabens.style.display = 'none';
    elementos.fatoracao.mensagemFatoracao.style.display = 'none';
    elementos.multiplos.mensagemMultiplos.style.display = 'none';
    elementos.novaOperacao.mensagemNovaOperacao.style.display = 'none';
    elementos.resultadoFinal.mensagemFinal.style.display = 'none';
    elementos.fatoracao.perguntaMultiplicacao.style.display = 'none';
    elementos.fatoracao.inputMultiplicacaoContainer.style.display = 'none';
    elementos.quiz.quizContainer.style.display = 'block';

    // Reset da fatoração
    elementos.novaOperacao.operacaoAtual.textContent = `${originalNum1} / ${originalDen1} ${operacaoSimbolo} ${originalNum2} / ${originalDen2}`;
    elementos.fatoracao.linhasAdicionais.innerHTML = '';
    elementos.fatoracao.denom1Circulo.textContent = originalDen1;
    elementos.fatoracao.denom2Circulo.textContent = originalDen2;

    elementos.multiplos.valorDenom1.textContent = originalDen1;
    elementos.multiplos.valorDenom2.textContent = originalDen2;
    elementos.multiplos.linhasMultiplos1.innerHTML = '';
    elementos.multiplos.linhasMultiplos2.innerHTML = '';
    
    // Recriar as linhas iniciais dos múltiplos
    for (let i = 1; i <= 2; i++) {
        criarLinhaMultiplo(1, i, originalDen1);
        criarLinhaMultiplo(2, i, originalDen2);
    }

    // Reset da nova operação
    elementos.novaOperacao.novoDen.textContent = '';
    elementos.novaOperacao.novoDen2.textContent = '';
    elementos.novaOperacao.divisor1Span.textContent = originalDen1;
    elementos.novaOperacao.divisor2Span.textContent = originalDen2;
    elementos.novaOperacao.multiplicador1Span.textContent = '';
    elementos.novaOperacao.multiplicador2Span.textContent = '';
    elementos.novaOperacao.novoNum1.value = '';
    elementos.novaOperacao.novoNum2.value = '';
    elementos.resultadoFinal.resultadoFinalInput.value = '';

    // Reset do resultado final
    elementos.outros.finalDen1.textContent = '';
    elementos.outros.finalDen2.textContent = '';
    elementos.outros.finalNum1.textContent = '';
    elementos.outros.finalNum2.textContent = '';
    elementos.resultadoFinal.respostaFinalInput.value = '';

    elementos.botoes.todoBotoes.forEach(botao => {
        botao.disabled = false;
        botao.classList.remove('btn-desabilitado');
    });

    elementos.fatoracao.input.forEach(input => {
        input.disabled = false;
        input.value = '';
   });
}
function gerarFracao() {
    const denominadoresValidos = [2,3,4,5,6,7,8,9,10,12]; // exclui 7 e 11
    const sinais = ['+', '-']; // sinais possíveis
    den1 = denominadoresValidos[Math.floor(Math.random() * denominadoresValidos.length)];
    den2 = denominadoresValidos[Math.floor(Math.random() * denominadoresValidos.length)];
    num1 = Math.floor(Math.random() * (den1 - 1)) + 1; // menor que denominador
    num2 = Math.floor(Math.random() * (den1 - 1)) + 1; // menor que denominador
    operacaoSimbolo = sinais[Math.floor(Math.random() * sinais.length)];
    document.getElementById('novo-operador').textContent = operacaoSimbolo;
    document.getElementById('final-operador').textContent = operacaoSimbolo;
    document.getElementById('operador-sem-mmc').textContent = operacaoSimbolo;
    
}
function mostrarTempo() {
        elementos.tela.tempoDisplay.style.display = 'block';
        elementos.tela.tempoDisplay.textContent = `${tempoRestante}s`;
}    

function iniciarTemporizador() {
    if (intervaloTempo) clearInterval(intervaloTempo);
    mostrarTempo();
    intervaloTempo = setInterval(() => {
        if (!jogoAtivo) return;
        tempoRestante--;
        mostrarTempo();
        if (tempoRestante <= 0) {
            clearInterval(intervaloTempo);
            fimPorTempo(); 
        }
    }, 1000);
}

function adicionarTempo(segundos) {
    tempoRestante += segundos;
    mostrarTempo();
}

function fimPorTempo() {
    jogoAtivo = false;
    elementos.tela.tempoDisplay.style.display = 'none';
    // hide main content areas and show tempo esgotado
    elementos.tela.operacaoSemMmc.style.display = 'none';
    elementos.quiz.quizContainer.style.display = 'none';
    elementos.quiz.mensagemQuiz.style.display = 'none';
    elementos.metodo.escolhaMetodo.style.display = 'none';
    elementos.fatoracao.metodoFator.style.display = 'none';
    elementos.multiplos.metodoMultiplos.style.display = 'none';
    elementos.novaOperacao.novaOperacao.style.display = 'none';
    elementos.resultadoFinal.resultadoFinalContainer.style.display = 'none';
    elementos.tela.tempoEsgotado.style.display = 'block';
}



function handleFator(valor, linhaIdx) {
    let numeros = 1;
    elementos.fatoracao.mensagemFatoracao.style.display = 'none';
    if (!valor || valor < 2) {
        elementos.fatoracao.mensagemFatoracao.className = 'mensagem erro';
        elementos.fatoracao.mensagemFatoracao.textContent = 'Digite um número válido (>=2).';
        elementos.fatoracao.mensagemFatoracao.style.display = 'block';
        return;
    }

    // verificar se divide pelo menos um dos denominadores atuais (currentDenoms)
    const divides0 = (currentDenoms[0] % valor === 0);
    const divides1 = (currentDenoms[1] % valor === 0);
    if (!divides0 && !divides1) {
        elementos.fatoracao.mensagemFatoracao.className = 'mensagem erro';
        elementos.fatoracao.mensagemFatoracao.textContent = 'Número inválido: não divide nenhum dos denominadores à esquerda.';
        elementos.fatoracao.mensagemFatoracao.style.display = 'block';
        return;
    }

    // aplicar divisão onde possível
    if (divides0) currentDenoms[0] = currentDenoms[0] / valor;
    if (divides1) currentDenoms[1] = currentDenoms[1] / valor;

    // registrar fator usado (para LCM provocaremos produto por fatores únicos, mas aqui guardamos para multiplicar depois)
    fatoresUsados.push(valor);

    // Atualizar a última linha (desativar o botão dessa linha)
    const btnIr = document.getElementById(`btn-ir-${linhaIdx}`);
    const inputF = document.getElementById(`input-fator-${linhaIdx}`);
    if (btnIr) {
        btnIr.disabled = true;
        btnIr.classList.add('btn-desabilitado');
    }
    
    if (inputF) inputF.disabled = true;

    // Atualizar os círculos que mostram os denominadores
    if (linhaIdx === 0) {
        elementos.fatoracao.denom1Circulo.textContent = currentDenoms[0];
        elementos.fatoracao.denom2Circulo.textContent = currentDenoms[1];
    } else {
        // se for linha adicional, atualizamos o último bloco visível
        
        if (numeros.length >= 2) {
            numeros[numeros.length - 2].textContent = currentDenoms[0];
            numeros[numeros.length - 1].textContent = currentDenoms[1];
        }
    }

    // Se ambos deram 1 -> final da fatoração
    if (currentDenoms[0] === 1 && currentDenoms[1] === 1) {
        // mostrar pergunta sobre o que fazer agora
        elementos.fatoracao.perguntaMultiplicacao.style.display = 'block';
        // desabilitar mais inputs
        // exibir ação esperada: multiplicar (usuário deve selecionar)
        return;
    }

    // Caso contrário, criar nova linha para continuar fatorando
    const novoIdx = linhaIdx + 1;
    const linha = criarLinhaFatoracao(novoIdx, currentDenoms[0], currentDenoms[1]);
    elementos.fatoracao.linhasAdicionais.appendChild(linha);

    // adicionar listener para o novo botão "Ir"
    const btnNovo = document.getElementById(`btn-ir-${novoIdx}`);
    btnNovo.addEventListener('click', () => {
        const val = parseInt(document.getElementById(`input-fator-${novoIdx}`).value, 10);
        handleFator(val, novoIdx);
        numeros ++;
    });
}

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
}

function criarLinhaFatoracao(idx, d1, d2) {
    const linha = document.createElement('div');
    linha.className = 'linha-fatoracao';
    linha.innerHTML = `
        <div class="numeros-esquerda">
            <div class="numero-circulo">${d1}</div>
            <div class="numero-circulo">${d2}</div>
        </div>
        <div class="linha-divisoria"></div>
        <div class="input-container">
            <input type="number" class="input-numero" min="2" id="input-fator-${idx}">
            <button class="btn-ir" id="btn-ir-${idx}">Ir</button>
        </div>
    `;
    return linha;
}

function prepararNovaOperacaoComDenominador(lcmValor) {
        // preencher nova operacao UI
        elementos.fatoracao.metodoFator.style.display = 'none';
        elementos.multiplos.metodoMultiplos.style.display = 'none';
        elementos.novaOperacao.novaOperacao.style.display = 'block';

        elementos.novaOperacao.novoDen.textContent = lcmValor;
        elementos.novaOperacao.novoDen2.textContent = lcmValor;
        elementos.novaOperacao.denFinal.textContent = lcmValor;


        
        elementos.novaOperacao.multiplicador1Span.textContent = `2º Multiplique o resultado pelo numerador velho "${originalNum1}"`;
        elementos.novaOperacao.multiplicador2Span.textContent = `2º Multiplique o resultado pelo numerador velho "${originalNum2}"`;

        elementos.novaOperacao.divisor1Span.textContent = `1º Divida o denominador novo "${lcmValor }" pelo denominador velho "${originalDen1}"`;
        elementos.novaOperacao.divisor2Span.textContent = `1º Divida o denominador novo "${lcmValor }" pelo denominador velho "${originalDen2}"`;

        // multiplicadores
  

        // deixar campos para o aluno digitar os novos numeradores
        elementos.novaOperacao.novoNum1.value = '';
        elementos.novaOperacao.novoNum2.value = '';
        elementos.resultadoFinal.resultadoFinalInput.value = '';
    }
function disableAllExceptFinal(botaox) {
        // desabilitar botões e inputs relevantes
        botaox.forEach(b => {
            // deixar enabled apenas btn-enviar-final e btn-voltar-menu etc
            // aqui vamos apenas desabilitar método de fatoração/múltiplos para simplificar
            if (![elementos.resultadoFinal.btnEnviarFinal, elementos.botoes.btnVoltarMenu, elementos.botoes.btnJogarNovamente, elementos.botoes.btnNovoJogo, elementos.botoes.btnMenuFinal].includes(b)) {
                try { b.disabled = true; b.classList.add('btn-desabilitado'); } catch(e){}
            }
        });
        // esconder timer não
    }

function inicializarMultiplos() {
    elementos.multiplos.valorDenom1.textContent = originalDen1;
    elementos.multiplos.valorDenom2.textContent = originalDen2;
    
    elementos.multiplos.linhasMultiplos1.innerHTML = '';
    elementos.multiplos.linhasMultiplos2.innerHTML = '';
    
    // ✅ CORREÇÃO: Criar apenas 2 linhas (×1 e ×2)
    for (let i = 1; i <= 2; i++) {
        criarLinhaMultiplo(1, i, originalDen1);
        criarLinhaMultiplo(2, i, originalDen2);
    }
    
    multiploSelecionado1 = originalDen1;
    multiploSelecionado2 = originalDen2;
}
function criarLinhaMultiplo(coluna, multiplicador, denominador) {
    const calculo = `${denominador} × ${multiplicador} =`;
    const valorEsperado = denominador * multiplicador;
    
    const linha = document.createElement('div');
    linha.className = 'linha-multiplo';
    
    // ✅ CORREÇÃO: Primeira linha mostra resultado, demais mostram input
    if (multiplicador === 1) {
        // Primeira linha: mostra o resultado (já calculado)
        linha.innerHTML = `
            <span class="calculo-multiplo">${calculo}</span>
            <div class="numero-multiplo selecionado" 
                 data-valor="${valorEsperado}">${valorEsperado}</div>
        `;
        
        // Adicionar event listener para seleção
        const numeroElement = linha.querySelector('.numero-multiplo');
        numeroElement.addEventListener('click', () => {
            selecionarMultiplo(coluna, valorEsperado);
            // Remover seleção anterior e selecionar este
            if (coluna === 1) {
                elementos.multiplos.linhasMultiplos1.querySelectorAll('.numero-multiplo.selecionado').forEach(el => {
                    el.classList.remove('selecionado');
                });
            } else {
                elementos.multiplos.linhasMultiplos2.querySelectorAll('.numero-multiplo.selecionado').forEach(el => {
                    el.classList.remove('selecionado');
                });
            }
            numeroElement.classList.add('selecionado');
        });
    } else {
        // Demais linhas: mostram input para o aluno preencher
        linha.innerHTML = `
            <span class="calculo-multiplo">${calculo}</span>
            <input type="number" class="input-multiplo" id="input-${coluna}-${multiplicador}" placeholder="?">
            <button class="btn-adicionar-multiplo" data-coluna="${coluna}" data-multiplicador="${multiplicador}">✓</button>
        `;
        
        // Adicionar event listener para o botão
        const btn = linha.querySelector('.btn-adicionar-multiplo');
        btn.addEventListener('click', () => {
            verificarMultiplo(coluna, multiplicador, denominador);
        });
    }
    
    if (coluna === 1) {
        elementos.multiplos.linhasMultiplos1.appendChild(linha);
    } else {
        elementos.multiplos.linhasMultiplos2.appendChild(linha);
    }
}

function verificarMultiplo(coluna, multiplicador, denominador) {
    const input = document.getElementById(`input-${coluna}-${multiplicador}`);
    const valor = parseInt(input.value);
    const valorEsperado = denominador * multiplicador;
    
    if (valor === valorEsperado) {
        // ✅ CORREÇÃO: Só substituir o input pelo número, NÃO criar nova linha
        const linha = input.parentElement;
        linha.innerHTML = `
            <span class="calculo-multiplo">${denominador} × ${multiplicador} =</span>
            <div class="numero-multiplo" data-valor="${valorEsperado}">${valorEsperado}</div>
        `;
        
        const numeroElement = linha.querySelector('.numero-multiplo');
        numeroElement.addEventListener('click', () => {
            selecionarMultiplo(coluna, valorEsperado);
        });
        
        // ✅ REMOVIDO: A criação automática de nova linha
        // NÃO criar próxima linha automaticamente
        
    } else {
        alert(`Erro! O múltiplo correto de ${denominador} × ${multiplicador} é ${valorEsperado}`);
    }
}

function selecionarMultiplo(coluna, valor) {
    if (coluna === 1) {
        // Remover seleção anterior da coluna 1
        elementos.multiplos.linhasMultiplos1.querySelectorAll('.numero-multiplo.selecionado').forEach(el => {
            el.classList.remove('selecionado');
        });
        multiploSelecionado1 = valor;
    } else {
        // Remover seleção anterior da coluna 2
        elementos.multiplos.linhasMultiplos2.querySelectorAll('.numero-multiplo.selecionado').forEach(el => {
            el.classList.remove('selecionado');
        });
        multiploSelecionado2 = valor;
    }
}
