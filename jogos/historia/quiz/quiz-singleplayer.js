// quiz-singleplayer.js
export function iniciarJogo(selecao) {
    carregarCSS();
    
document.body.innerHTML = `
    <div class="container">
        <!-- Tela do Jogo -->
        <div id="tela-jogo" class="tela ativa">
            <div class="header">
                <h1>🎯 Quiz Single Player</h1>
                <div class="info-jogo">
                    <span id="info-ano">Ano: ${selecao.ano}</span>
                    <span id="info-questao">Questão: <span id="numero-questao">1</span>/20</span>
                    <span id="info-pontos">Acertos: <span id="pontos-atual">0</span>/16</span>
                </div>
            </div>

            <div class="question-area">
                <div class="question-card">
                    <div class="question-text" id="question-text">
                        Carregando questão...
                    </div>
                    <div class="alternatives" id="alternatives">
                        <!-- Alternativas serão inseridas aqui -->
                    </div>
                </div>
            </div>

            <div class="player-stats">
                <div class="progresso">
                    <div class="barra-progresso">
                        <div class="progresso-interno" id="barra-progresso"></div>
                    </div>
                    <div class="texto-progresso">
                        <span id="texto-progresso">0 de 16 acertos necessários</span>
                    </div>
                </div>
            </div>

            <div class="botoes-acao">
                <button class="botao botao-voltar" id="botao-voltar">Voltar ao Menu</button>
            </div>
        </div>

        <!-- ✅ CORREÇÃO: Tela de resultados SEPARADA -->
        <div id="tela-resultados" class="tela" style="display: none;">
            <div class="resultado-final">
                <h2 id="titulo-resultado">🎉 Parabéns!</h2>
                <div id="mensagem-resultado" class="mensagem-resultado">
                    Você completou o quiz com sucesso!
                </div>
                <div class="estatisticas">
                    <div class="estatistica">
                        <span class="numero" id="total-acertos">0</span>
                        <span class="label">Acertos</span>
                    </div>
                    <div class="estatistica">
                        <span class="numero" id="total-erros">0</span>
                        <span class="label">Erros</span>
                    </div>
                    <div class="estatistica">
                        <span class="numero" id="percentual">0%</span>
                        <span class="label">Desempenho</span>
                    </div>
                </div>
                <div class="botoes-resultado">
                    <button class="botao" id="botao-jogar-novamente">Jogar Novamente</button>
                    <button class="botao botao-voltar" id="botao-voltar-menu">Voltar ao Menu</button>
                </div>
            </div>
        </div>
    </div>
`;

    carregarElementosDOM();
    init(selecao);
}

function carregarCSS() {
    const css = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .tela {
                display: none;
            }

            .tela.ativa {
                display: block;
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                overflow: hidden;
            }

            .header {
                background: #2c3e50;
                color: white;
                padding: 20px;
                text-align: center;
            }

            .header h1 {
                font-size: 2em;
                margin-bottom: 10px;
            }

            .info-jogo {
                display: flex;
                justify-content: space-around;
                font-size: 0.9em;
                margin-top: 10px;
            }

            .info-jogo span {
                background: rgba(255,255,255,0.2);
                padding: 5px 10px;
                border-radius: 15px;
            }

            .question-area {
                padding: 30px;
            }

            .question-card {
                background: white;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                margin-bottom: 20px;
                border: 2px solid #bdc3c7;
            }

            .question-text {
                font-size: 1.4em;
                line-height: 1.6;
                color: #2c3e50;
                margin-bottom: 30px;
                text-align: center;
                font-weight: 500;
            }

            .alternatives {
                display: grid;
                gap: 15px;
            }

            .alternative {
                background: #f8f9fa;
                border: 2px solid #dee2e6;
                border-radius: 10px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1em;
                text-align: left;
            }

            .alternative:hover {
                background: #e9ecef;
                border-color: #adb5bd;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .alternative.selected {
                background: #3498db;
                color: white;
                border-color: #2980b9;
                transform: scale(1.02);
            }

            .alternative.correct {
                background: #27ae60;
                color: white;
                border-color: #219a52;
            }

            .alternative.incorrect {
                background: #e74c3c;
                color: white;
                border-color: #c0392b;
            }

            .player-stats {
                background: #34495e;
                color: white;
                padding: 20px;
            }

            .progresso {
                text-align: center;
            }

            .barra-progresso {
                background: #2c3e50;
                border-radius: 10px;
                height: 20px;
                margin: 10px 0;
                overflow: hidden;
            }

            .progresso-interno {
                background: linear-gradient(90deg, #27ae60, #2ecc71);
                height: 100%;
                width: 0%;
                transition: width 0.5s ease;
                border-radius: 10px;
            }

            .texto-progresso {
                font-size: 0.9em;
                color: #ecf0f1;
            }

            .botoes-acao {
                padding: 20px;
                text-align: center;
                background: #ecf0f1;
            }

            .botao {
                background: #4caf50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                margin: 5px;
                transition: background 0.3s ease;
            }

            .botao:hover {
                background: #45a049;
                transform: translateY(-2px);
            }

            .botao-voltar {
                background: #e74c3c;
            }

            .botao-voltar:hover {
                background: #c0392b;
            }

            .tela {
                display: none;
            }

            .tela.ativa {
                display: block;
            }

            /* Tela de Resultados */
            .resultado-final {
                padding: 40px;
                text-align: center;
            }

            .mensagem-resultado {
                font-size: 1.2em;
                margin: 20px 0;
                color: #2c3e50;
            }

            .estatisticas {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
            }

            .estatistica {
                text-align: center;
            }

            .numero {
                display: block;
                font-size: 2.5em;
                font-weight: bold;
                color: #2c3e50;
            }

            .label {
                font-size: 0.9em;
                color: #7f8c8d;
            }

            .botoes-resultado {
                margin-top: 30px;
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', css);
}

function carregarElementosDOM() {
    window.questionText = document.getElementById('question-text');
    window.alternativesDiv = document.getElementById('alternatives');
    window.numeroQuestao = document.getElementById('numero-questao');
    window.pontosAtual = document.getElementById('pontos-atual');
    window.barraProgresso = document.getElementById('barra-progresso');
    window.textoProgresso = document.getElementById('texto-progresso');
    window.botaoVoltar = document.getElementById('botao-voltar');
    window.telaJogo = document.getElementById('tela-jogo');
    window.telaResultados = document.getElementById('tela-resultados');
    window.tituloResultado = document.getElementById('titulo-resultado');
    window.mensagemResultado = document.getElementById('mensagem-resultado');
    window.totalAcertos = document.getElementById('total-acertos');
    window.totalErros = document.getElementById('total-erros');
    window.percentual = document.getElementById('percentual');
    window.botaoJogarNovamente = document.getElementById('botao-jogar-novamente');
    window.botaoVoltarMenu = document.getElementById('botao-voltar-menu');

        // ✅ Debug: Verificar se elementos foram encontrados
    console.log('🔍 Elementos DOM carregados:', {
        telaJogo: !!telaJogo,
        telaResultados: !!telaResultados,
        botaoJogarNovamente: !!botaoJogarNovamente,
        botaoVoltarMenu: !!botaoVoltarMenu
    });
}

// Sistema do jogo
let questoes = [];
let questaoAtual = 0;
let acertos = 0;
let erros = 0;
let selectedAlternative = null;
let questoesUsadas = new Set();

async function init(selecao) {
    // Carregar banco de questões baseado no ano selecionado
    const bancoQuestoes = await carregarBancoQuestoes(selecao.ano);
    
    // Selecionar 20 questões únicas (1 de cada variante)
    questoes = selecionarQuestoesUnicas(bancoQuestoes, 20);
    
    // Configurar event listeners
    botaoVoltar.addEventListener('click', voltarAoMenu);
    
    // ✅ CORREÇÃO: Resetar estado antes de reiniciar
    botaoJogarNovamente.addEventListener('click', () => {
        resetarEstadoJogo();
        iniciarJogo(selecao);
    });
    
    botaoVoltarMenu.addEventListener('click', voltarAoMenu);
    
    // Iniciar primeira questão
    mostrarQuestaoAtual();
}

async function carregarBancoQuestoes(ano) {
    // Mapeamento dos anos para os bancos - CORRIGIDO
    const mapeamentoAnos = {
        '6ano': '6ano',
        '7ano': '7ano', 
        '8ano': '8ano',
        '9ano': '9ano'
    };
    
    const bancoKey = mapeamentoAnos[ano];
    if (!bancoKey) {
        console.error('Ano não encontrado:', ano);
        return [];
    }
    
    try {
        const modulo = await import(`./questionBank${bancoKey.charAt(0)}.js`);
        return modulo.default || modulo;
    } catch (error) {
        console.error('Erro ao carregar banco de questões:', error);
        return [];
    }
}

function selecionarQuestoesUnicas(banco, quantidade) {
    const questoesSelecionadas = [];
    const gruposUsados = new Set();
    
    // Verificar se o banco é um array de grupos (estrutura dos questionBanks)
    if (!Array.isArray(banco)) {
        console.error('Banco de questões com formato inválido');
        return [];
    }
    
    // Achatar todas as questões com suas variantes
    const todasQuestoes = [];
    banco.forEach(grupo => {
        if (grupo.variantes && grupo.variantes.length > 0) {
            grupo.variantes.forEach(variante => {
                todasQuestoes.push({
                    ...variante,
                    idBase: grupo.id,
                    tema: grupo.tema
                });
            });
        }
    });
    
    // Embaralhar questões
    const questoesEmbaralhadas = embaralharArray([...todasQuestoes]);
    
    // Selecionar questões únicas (uma de cada grupo base)
    for (const questao of questoesEmbaralhadas) {
        if (!gruposUsados.has(questao.idBase) && questoesSelecionadas.length < quantidade) {
            gruposUsados.add(questao.idBase);
            questoesSelecionadas.push(questao);
        }
    }
    
    // Se não conseguiu quantidade suficiente, completar com questões repetidas
    if (questoesSelecionadas.length < quantidade) {
        const questoesRestantes = quantidade - questoesSelecionadas.length;
        const questoesAdicionais = embaralharArray([...todasQuestoes])
            .filter(questao => !gruposUsados.has(questao.idBase))
            .slice(0, questoesRestantes);
        
        questoesSelecionadas.push(...questoesAdicionais);
    }
    
    console.log(`✅ Selecionadas ${questoesSelecionadas.length} questões`);
    return questoesSelecionadas;
}

function embaralharArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function embaralharAlternativas(questao) {
    // Criar array de objetos com alternativa e índice original
    const alternativasComIndices = questao.alternativas.map((alt, index) => ({
        texto: alt,
        indiceOriginal: index
    }));
    
    // Embaralhar as alternativas
    const alternativasEmbaralhadas = embaralharArray([...alternativasComIndices]);
    
    // Encontrar a nova posição da resposta correta
    let novaPosicaoCorreta = 0;
    for (let i = 0; i < alternativasEmbaralhadas.length; i++) {
        if (alternativasEmbaralhadas[i].indiceOriginal === questao.correta) {
            novaPosicaoCorreta = i;
            break;
        }
    }
    
    // Extrair apenas os textos das alternativas embaralhadas
    const textosEmbaralhados = alternativasEmbaralhadas.map(item => item.texto);
    
    return {
        ...questao,
        alternativas: textosEmbaralhados,
        correta: novaPosicaoCorreta,
        respostaCorretaOriginal: questao.alternativas[questao.correta] // Para debug
    };
}

function mostrarQuestaoAtual() {
    if (questaoAtual >= questoes.length) {
        finalizarJogo();
        return;
    }
    
    const questaoData = questoes[questaoAtual];
    
    // ⚠️ CORREÇÃO: Atualizar a questão no array com as alternativas embaralhadas
    const questaoEmbaralhada = embaralharAlternativas(questaoData);
    questoes[questaoAtual] = questaoEmbaralhada; // ← LINHA CRÍTICA ADICIONADA
    
    questionText.textContent = questaoEmbaralhada.pergunta;
    alternativesDiv.innerHTML = '';
    
    // Criar alternativas
    questaoEmbaralhada.alternativas.forEach((alt, index) => {
        const altDiv = document.createElement('div');
        altDiv.className = 'alternative';
        const letter = String.fromCharCode(65 + index);
        altDiv.textContent = `${letter}) ${alt}`;
        altDiv.onclick = () => selecionarAlternativa(index, altDiv);
        alternativesDiv.appendChild(altDiv);
    });
    
    // Atualizar interface
    numeroQuestao.textContent = questaoAtual + 1;
    pontosAtual.textContent = acertos;
    atualizarBarraProgresso();
    
    selectedAlternative = null;
}

function selecionarAlternativa(index, element) {
    if (selectedAlternative !== null) return;
    
    selectedAlternative = index;
    
    // Remover seleção de todas as alternativas
    document.querySelectorAll('.alternative').forEach(alt => {
        alt.classList.remove('selected');
    });
    
    // Selecionar a alternativa clicada
    element.classList.add('selected');
    
    // Processar resposta
    processarResposta(index);
}

function processarResposta(respostaIndex) {
    const questao = questoes[questaoAtual];
    const acertou = respostaIndex === questao.correta;
    
    console.log('🎯 Resposta:', {
        respostaDada: respostaIndex,
        respostaCorreta: questao.correta,
        acertou: acertou,
        respostaCorretaTexto: questao.alternativas[questao.correta]
    });
    
    if (acertou) {
        acertos++;
    } else {
        erros++;
    }
    
    // Mostrar resultado
    mostrarResultado(acertou);
    
    // ✅ CORREÇÃO: Lógica simplificada para avançar
    setTimeout(() => {
        // Verificar se o jogador já atingiu a meta de acertos
        if (acertos >= 16) {
            finalizarJogo();
            return;
        }
        
        // Avançar para próxima questão se ainda houver questões
        questaoAtual++;
        if (questaoAtual < questoes.length) {
            mostrarQuestaoAtual();
        } else {
            finalizarJogo();
        }
    }, 1000);
}



function mostrarResultado(acertou) {
    const alternatives = document.querySelectorAll('.alternative');
    const questao = questoes[questaoAtual];
    
    alternatives.forEach((alt, index) => {
        if (index === questao.correta) {
            alt.classList.add('correct');
        } else if (index === selectedAlternative && !acertou) {
            alt.classList.add('incorrect');
        }
    });
    
    // Bloquear cliques durante a transição
    document.querySelectorAll('.alternative').forEach(alt => {
        alt.style.pointerEvents = 'none';
    });
}

function atualizarBarraProgresso() {
    const progresso = (acertos / 16) * 100;
    barraProgresso.style.width = `${Math.min(progresso, 100)}%`;
    textoProgresso.textContent = `${acertos} de 16 acertos necessários`;
}

function finalizarJogo() {
    const venceu = acertos >= 16;
    const percentualAcertos = Math.round((acertos / (acertos + erros)) * 100);
    
    console.log('🎮 Finalizando jogo:', { acertos, erros, venceu, percentualAcertos });
    
    if (venceu) {
        tituloResultado.textContent = '🎉 Parabéns!';
        mensagemResultado.textContent = 'Você completou o quiz com sucesso!';
    } else {
        tituloResultado.textContent = '😞 Tente Novamente';
        mensagemResultado.textContent = `Você acertou ${acertos} de 16 questões necessárias.`;
    }
    
    totalAcertos.textContent = acertos;
    totalErros.textContent = erros;
    percentual.textContent = `${percentualAcertos}%`;
    
    // ✅ CORREÇÃO: Alternar entre as telas
    telaJogo.classList.remove('ativa');
    telaJogo.style.display = 'none';
    
    telaResultados.classList.add('ativa');
    telaResultados.style.display = 'block';
    
    console.log('📊 Tela de resultados visível');
}

function resetarEstadoJogo() {
    questaoAtual = 0;
    acertos = 0;
    erros = 0;
    selectedAlternative = null;
    questoesUsadas.clear();
    questoes = [];
    
    console.log('🔄 Estado do jogo resetado');
}

function voltarAoMenu() {
    console.log('← Voltando ao menu...');
    
    // Resetar estado antes de sair
    resetarEstadoJogo();
 location.reload();
}