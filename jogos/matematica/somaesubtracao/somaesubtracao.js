let operacaoAtual = '';
let modoAtual = '';
let num1 = 0;
let num2 = 0;
let resultado = 0;
let numerosVaiUm = [];
let numerosEmprestimo = [];
let celulasResposta = [];
let celulasVaiUm = [];
let intervaloRelogio;
let tempoRestante = 0;
let pontuacao = 0;
let totalProblemas = 10;
let problemaAtual = 0;
let celulaSelecionada = null;
let botaoNumeroSelecionado = null;
let marcasEmprestimo = [];
let celulasNum1 = [];
let celulasNum2 = [];
let contagemsoma = 0;
let contagemsubtracao = 0;
let valoresManipulados = {};
const valoresOriginais = {};
let setup = 'positivo';
let celulaSelecionadaAnterior = null;


let elementos = {};

export function iniciarJogoDeSomaESubtração() {
    carregarCSS();

    document.body.innerHTML =
    `
        <div class="container">
            <!-- Tela de Boas Vindas -->
            <div id="tela-bem-vindo" class="tela ativa">
                <h1>Jogo de Soma e Subtração</h1>
                <div class="descricao">
                    <p>Pratique suas habilidades em matemática!</p>
                    <p><strong>Soma ou Subtração (modo estudo)</strong> Sem tempo limite, com números de 3 dígitos</p>
                    <p><strong>Modo Desafio:</strong> 2 minutos para resolver 10 problemas (5 somas e 5 subtrações) com números de 5 dígitos</p>
                </div>
                <div class="grade-botoes">
                    <button class="botao" id="btn-soma-modo-estudo">Soma</button>
                    <button class="botao" id="btn-subtracao-modo-estudo">Subtração</button>
                    <button class="botao" id="botao-modo-desafio">Modo Desafio</button>
                </div>
                <button class="botao botao-voltar" id="botao-voltar-menu">Retornar para o Menu</button>
            </div>

            <!-- Tela do Jogo -->
            <div id="tela-jogo" class="tela">
                <h1 id="titulo-jogo">Jogo</h1>
                <div class="temporizador" id="temporizador" style="display: none;">02:00</div>
                <div class="pontuacao" id="pontuacao" style="display: none;">Acertos: 0/10</div>
                
                <div class="container-operacao">
                    <div class="operacao" id="exibicao-operacao">
                        <!-- Operação será gerada dinamicamente -->
                    </div>
                </div>
                
                <div class="painel-numeros" id="painel-numeros">
                    <!-- Botões numéricos serão gerados dinamicamente -->
                </div>
                
                <div class="botoes-acao">
                    <button class="botao botao-limpar" id="botao-limpar">Limpar</button>
                    <button class="botao botao-verificar" id="botao-verificar">Verificar</button>
                </div>
                
                <div class="mensagem" id="mensagem" style="display: none;"></div>
                
                <div class="botoes-acao">
                    <button class="botao botao-voltar" id="botao-novo-problema">Nova Operação</button>
                    <button class="botao botao-voltar" id="botao-voltar-modo">Voltar ao Menu</button>
                </div>
            </div>
        </div>


    `;
        carregarElementosDOM();
        init();
}


function carregarCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/matematica/somaesubtracao/somaesubtracao.css';
    document.head.appendChild(link);
}

function init() {
    configurarEventListeners();
}

function carregarElementosDOM(){

    elementos = {
        telaBemVindo: document.getElementById('tela-bem-vindo'),
        telaJogo: document.getElementById('tela-jogo'),
        tituloJogo: document.getElementById('titulo-jogo'),
        exibicaoOperacao: document.getElementById('exibicao-operacao'),
        painelNumeros: document.getElementById('painel-numeros'),
        temporizadorElemento: document.getElementById('temporizador'),
        pontuacaoElemento: document.getElementById('pontuacao'),
        mensagemElemento: document.getElementById('mensagem'),

        btnSomaModoEstudo: document.getElementById('btn-soma-modo-estudo'),
        btnSubtracaoModoEstudo: document.getElementById('btn-subtracao-modo-estudo'),
        botaoModoDesafio: document.getElementById('botao-modo-desafio'),
        botaoVoltarMenu: document.getElementById('botao-voltar-menu'),
        botaoLimpar: document.getElementById('botao-limpar'),
        botaoVerificar: document.getElementById('botao-verificar'),
        botaoNovoProblema: document.getElementById('botao-novo-problema'),
        botaoVoltarModo: document.getElementById('botao-voltar-modo')
       
    };

}

function criarBotoesNumeros() {
    elementos.painelNumeros.innerHTML = '';
    
    for (let i = 0; i <= 9; i++) {
        const botao = document.createElement('button');
        botao.className = 'botao-numero';
        botao.textContent = i;
        botao.addEventListener('click', () => selecionarNumero(botao));
        elementos.painelNumeros.appendChild(botao);
    }
    
    // REMOVIDO: Botão de corte não é mais necessário
}

function configurarEventListeners() {
    elementos.btnSomaModoEstudo.addEventListener('click', () => selecionarModo('soma-estudo'));
    elementos.btnSubtracaoModoEstudo.addEventListener('click', () => selecionarModo('subtracao-estudo'));

    elementos.botaoModoDesafio.addEventListener('click', () => selecionarModo('desafio'));
    elementos.botaoVoltarMenu.addEventListener('click', voltarAoMenu);
    elementos.botaoLimpar.addEventListener('click', limparResposta);
    elementos.botaoVerificar.addEventListener('click', verificarResposta);
    elementos.botaoNovoProblema.addEventListener('click', gerarProblema);
    elementos.botaoVoltarModo.addEventListener('click', voltarParaSelecaoModo);
}

function selecionarModo(modo) {
    modoAtual = modo;
    elementos.tituloJogo.textContent = modo === 'soma-estudo' ? 'Modo estudo: adição' :
                                modo === 'subtracao-estudo' ? 'Modo estudo: subtração' : 'Modo desafio';
    
    if (modo === 'desafio') {
        tempoRestante = 240;
        pontuacao = 0;
        problemaAtual = 0;
        atualizarPontuacao();
        iniciarTemporizador();
        elementos.temporizadorElemento.style.display = 'block';
        elementos.pontuacaoElemento.style.display = 'block';
        elementos.botaoNovoProblema.style.display = 'none';
        elementos.botaoNovoProblema.disabled = true;
    } else {
        elementos.temporizadorElemento.style.display = 'none';
        elementos.pontuacaoElemento.style.display = 'none';
        elementos.botaoNovoProblema.style.display = 'block';
        elementos.botaoNovoProblema.disabled = false;
    }
    
    
    gerarProblema();
    mostrarTela(elementos.telaJogo);
}

function gerarProblema() {
    // Para o modo desafio, alternar entre soma e subtração
    if (modoAtual === 'desafio') {
        operacaoAtual = problemaAtual < 5 ? 'soma' : 'subtracao';
    } else if (modoAtual === 'soma-estudo') {
        operacaoAtual = 'soma';
    } else if (modoAtual === 'subtracao-estudo') {
        operacaoAtual = 'subtracao';
    }

    // Gera os números baseados no modo e operação
    if (modoAtual === 'desafio') {
        if (operacaoAtual === 'soma') {
            num2 = Math.floor(Math.random() * (8000 - 800 + 1)) + 800; // Entre 800 e 8000
            num1 = num2 + Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // num2 + valor entre 1000 e 9999
            resultado = num1 + num2;
        } else {
            num2 = Math.floor(Math.random() * (8000 - 800 + 1)) + 800; // Entre 800 e 8000
            num1 = num2 + Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // num2 + valor entre 1000 e 9999
            resultado = num1 - num2;
        }
    } else if (modoAtual === 'soma-estudo' || modoAtual === 'subtracao-estudo') {
        num2 = Math.floor(Math.random() * (800 - 120 + 1)) + 120; // Entre 120 e 800
        
        if (operacaoAtual === 'soma') {
            
            const maxAdicional = 999 - num2;
            const adicional = Math.floor(Math.random() * maxAdicional) + 1;
            num1 = num2 + adicional;
            resultado = num1 + num2;
        } else {
            // Para subtração, num1 deve ser maior que num2 mas não ultrapassar 999
            const maxAdicional = 999 - num2;
            const adicional = Math.floor(Math.random() * maxAdicional) + 1;
            num1 = num2 + adicional;
            resultado = num1 - num2;
        }
    }
    renderizarOperacao();
    criarBotoesNumeros();
    esconderMensagem();
}        

function mostrarTela(tela) {
    elementos.telaBemVindo.classList.remove('ativa');
    elementos.telaJogo.classList.remove('ativa');
    
    tela.classList.add('ativa');
}

function atualizarPontuacao() {
    elementos.pontuacaoElemento.textContent = `Acertos: ${pontuacao}/${totalProblemas}`;
}

function iniciarTemporizador() {
    clearInterval(intervaloRelogio);
        intervaloRelogio = setInterval(() => {
        tempoRestante--;
                
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        elementos.temporizadorElemento.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                
        if (tempoRestante <= 0) {
            finalizarJogo();
        }
    }, 1000);
}

function renderizarOperacao() {
    elementos.exibicaoOperacao.innerHTML = '';
    numerosVaiUm = [];
    numerosEmprestimo = [];
    celulasResposta = [];
    celulasVaiUm = [];
    marcasEmprestimo = [];
    celulasNum1 = [];
    celulasNum2 = [];
    let celulasCorte = []; // Nova array para células de corte
    valoresManipulados = {};
    setup = 'positivo';
        elementos.botaoLimpar.style.display = 'block';
        elementos.botaoLimpar.disabled = false;
        elementos.botaoVerificar.style.display = 'block';
        elementos.botaoVerificar.disabled = false;

            
    const num1Str = num1.toString();
    const num2Str = num2.toString();
    const comprimentoMaximo = Math.max(num1Str.length, num2Str.length);
    
    // Container principal com posicionamento relativo
    const container = document.createElement('div');
    container.style.position = 'relative';
    
    // 1. LINHA DE CORTE (apenas para subtração)
    if (operacaoAtual === 'subtracao') {
        const linhaCorte = document.createElement('div');
        linhaCorte.className = 'linha-corte';
        linhaCorte.style.display = 'flex';
        linhaCorte.style.justifyContent = 'flex-end';
        linhaCorte.style.marginBottom = '5px';
        linhaCorte.style.height = '40px';
        linhaCorte.style.position = 'relative';
        
        for (let i = 0; i < comprimentoMaximo; i++) {
            const celulaCorte = document.createElement('div');
            celulaCorte.className = 'celula-corte celula-vazia';
            celulaCorte.style.width = '50px';
            celulaCorte.style.height = '40px';
            celulaCorte.style.margin = '0 5px';
            celulaCorte.style.textAlign = 'center';
            celulaCorte.dataset.indice = i;
            celulaCorte.dataset.valorOriginal = '0';
            
            // Event listener para corte
            celulaCorte.addEventListener('click', () => {
                if (operacaoAtual === 'subtracao') {
                    manipularCorte(celulaCorte, i);
                }
            });
            
            linhaCorte.appendChild(celulaCorte);
            celulasCorte.push(celulaCorte);
        }
        container.appendChild(linhaCorte);
    }
            
    // 2. LINHA DE VAI-UM (apenas para soma)
    if (operacaoAtual === 'soma') {
        const linhaVaiUm = document.createElement('div');
        linhaVaiUm.className = 'linha-vai-um';
        linhaVaiUm.style.display = 'flex';
        linhaVaiUm.style.justifyContent = 'flex-end';
        linhaVaiUm.style.marginBottom = '5px';
        linhaVaiUm.style.height = '40px';
        
        for (let i = 0; i < comprimentoMaximo + 1; i++) {
            const celulaVaiUm = document.createElement('div');
            celulaVaiUm.className = 'celula-vai-um celula-vazia';
            celulaVaiUm.style.width = '50px';
            celulaVaiUm.style.height = '40px';
            celulaVaiUm.style.margin = '0 5px';
            celulaVaiUm.style.textAlign = 'center';
            celulaVaiUm.dataset.indice = i;
            celulaVaiUm.addEventListener('click', () => selecionarCelula(celulaVaiUm));
            
            linhaVaiUm.appendChild(celulaVaiUm);
            celulasVaiUm.push(celulaVaiUm);
        }
        container.appendChild(linhaVaiUm);
    }

    // 3. LINHA DO PRIMEIRO NÚMERO
    const linhaNum1 = document.createElement('div');
    linhaNum1.className = 'linha-numeros';
    linhaNum1.style.display = 'flex';
    linhaNum1.style.justifyContent = 'flex-end';
    linhaNum1.style.marginBottom = '5px';
    
    // 4. LINHA DO SEGUNDO NÚMERO
    const linhaNum2 = document.createElement('div');
    linhaNum2.className = 'linha-numeros';
    linhaNum2.style.display = 'flex';
    linhaNum2.style.justifyContent = 'flex-end';
    linhaNum2.style.marginBottom = '5px';
    
    // Adicionar operador na linha do segundo número
    const celulaOperador = document.createElement('div');
    celulaOperador.className = 'operador';
    celulaOperador.style.width = '50px';
    celulaOperador.style.textAlign = 'center';
    celulaOperador.style.margin = '0 5px';
    celulaOperador.style.fontSize = '1.8rem';
    celulaOperador.textContent = operacaoAtual === 'soma' ? '+' : '-';
    linhaNum2.appendChild(celulaOperador);
    
    // Preencher com células para os números
    for (let i = 0; i < comprimentoMaximo; i++) {
        // Células do primeiro número
        const celulaNum1 = document.createElement('div');
        celulaNum1.className = 'celula-numero';
        celulaNum1.style.width = '50px';
        celulaNum1.style.height = '50px';
        celulaNum1.style.textAlign = 'center';
        celulaNum1.style.margin = '0 5px';
        celulaNum1.style.border = '2px solid #ddd';
        celulaNum1.style.borderRadius = '8px';
        celulaNum1.style.display = 'flex';
        celulaNum1.style.justifyContent = 'center';
        celulaNum1.style.alignItems = 'center';
        celulaNum1.style.fontSize = '1.5rem';
        
        const indiceDigito1 = i - (comprimentoMaximo - num1Str.length);
        if (indiceDigito1 >= 0) {
            celulaNum1.textContent = num1Str[indiceDigito1];
            celulaNum1.dataset.valor = num1Str[indiceDigito1];
            celulaNum1.dataset.valorOriginal = num1Str[indiceDigito1];
        } else {
            celulaNum1.textContent = '0';
            celulaNum1.dataset.valor = '0';
            celulaNum1.dataset.valorOriginal = '0';
        }
        celulaNum1.dataset.indice = i;
        linhaNum1.appendChild(celulaNum1);
        celulasNum1.push(celulaNum1);
        
        // Células do segundo número
        const celulaNum2 = document.createElement('div');
        celulaNum2.className = 'celula-numero';
        celulaNum2.style.width = '50px';
        celulaNum2.style.height = '50px';
        celulaNum2.style.textAlign = 'center';
        celulaNum2.style.margin = '0 5px';
        celulaNum2.style.border = '2px solid #ddd';
        celulaNum2.style.borderRadius = '8px';
        celulaNum2.style.display = 'flex';
        celulaNum2.style.justifyContent = 'center';
        celulaNum2.style.alignItems = 'center';
        celulaNum2.style.fontSize = '1.5rem';
        
        const indiceDigito2 = i - (comprimentoMaximo - num2Str.length);
        if (indiceDigito2 >= 0) {
            celulaNum2.textContent = num2Str[indiceDigito2];
        } else {
            celulaNum2.textContent = '0';
        }
        linhaNum2.appendChild(celulaNum2);
        celulasNum2.push(celulaNum2);
    }
    
    container.appendChild(linhaNum1);
    container.appendChild(linhaNum2);
    
    // 5. LINHA DO TRAÇO
    const linhaTraco = document.createElement('div');
    linhaTraco.className = 'linha-traco';
    linhaTraco.style.borderTop = '2px solid #333';
    linhaTraco.style.margin = '10px 0';
    container.appendChild(linhaTraco);
    
    // 6. LINHA DA RESPOSTA
    const linhaResposta = document.createElement('div');
    linhaResposta.className = 'linha-numeros';
    linhaResposta.style.display = 'flex';
    linhaResposta.style.justifyContent = 'flex-end';
    linhaResposta.style.marginBottom = '5px';
    
    // Adicionar células de resposta
    for (let i = 0; i < comprimentoMaximo + (operacaoAtual === 'soma' ? 1 : 0); i++) {
        const celulaResposta = document.createElement('div');
        celulaResposta.className = 'celula-numero celula-vazia celula-resposta';
        celulaResposta.style.width = '50px';
        celulaResposta.style.height = '50px';
        celulaResposta.style.textAlign = 'center';
        celulaResposta.style.margin = '0 5px';
        celulaResposta.style.border = '2px solid #ddd';
        celulaResposta.style.borderRadius = '8px';
        celulaResposta.style.display = 'flex';
        celulaResposta.style.justifyContent = 'center';
        celulaResposta.style.alignItems = 'center';
        celulaResposta.style.fontSize = '1.5rem';
        celulaResposta.style.backgroundColor = '#f0f0f0';
        celulaResposta.style.cursor = 'pointer';
        
        celulaResposta.dataset.indice = i;
        celulaResposta.addEventListener('click', () => selecionarCelula(celulaResposta));
        linhaResposta.appendChild(celulaResposta);
        celulasResposta.push(celulaResposta);
    }
    
    container.appendChild(linhaResposta);
    elementos.exibicaoOperacao.appendChild(container);
}


function selecionarCelula(celula) {
    // Desselecionar célula anterior
    if (celulaSelecionada) {
        celulaSelecionada.classList.remove('selecionado');
    }
    
    // Selecionar nova célula
    celulaSelecionada = celula;
    celula.classList.add('selecionado');
    
    // Verificar se é um corte (célula número selecionada + célula de corte selecionada)
    if (celulaSelecionada.classList.contains('celula-numero') && 
        celulaSelecionadaAnterior && 
        celulaSelecionadaAnterior.classList.contains('celula-corte')) {
        
        // Realizar o corte
        const indice = parseInt(celulaSelecionada.dataset.indice);
        const celulaCorte = celulaSelecionadaAnterior;
        manipularCorte(celulaCorte, indice);
        
        // Desselecionar após o corte
        celulaSelecionada.classList.remove('selecionado');
        celulaSelecionadaAnterior.classList.remove('selecionado');
        celulaSelecionada = null;
        celulaSelecionadaAnterior = null;
    }
    
    // Armazenar seleção anterior para possível corte
    if (celula.classList.contains('celula-corte') || celula.classList.contains('celula-numero')) {
        celulaSelecionadaAnterior = celula;
    }
    
    // Se já tiver um número selecionado, colocar na célula
    if (botaoNumeroSelecionado && celula.classList.contains('celula-resposta')) {
        colocarNumeroNaCelula();
        }
            if (celula.classList.contains('celula-corte')) {
        mostrarMensagem('Agora clique no número que você quer cortar', 'info');
    } else if (celula.classList.contains('celula-numero') && celulaSelecionadaAnterior && 
               celulaSelecionadaAnterior.classList.contains('celula-corte')) {
        mostrarMensagem('Clique no espaço acima para confirmar o corte', 'info');
    }
        
}


function selecionarNumero(botao) {
    // Desselecionar botão anterior
    if (botaoNumeroSelecionado) {
        botaoNumeroSelecionado.classList.remove('selecionado');
    }
    
    // Selecionar novo botão
    botaoNumeroSelecionado = botao;
    botao.classList.add('selecionado');
    
    // Se já tiver uma célula selecionada, colocar o número
    if (celulaSelecionada) {
        colocarNumeroNaCelula();
    }
}

// Colocar número na célula
function colocarNumeroNaCelula() {
    if (celulaSelecionada && botaoNumeroSelecionado) {
        celulaSelecionada.textContent = botaoNumeroSelecionado.textContent;
        celulaSelecionada.classList.remove('celula-vazia');
        
        // Desselecionar
        celulaSelecionada.classList.remove('selecionado');
        botaoNumeroSelecionado.classList.remove('selecionado');
        celulaSelecionada = null;
        botaoNumeroSelecionado = null;
    }
}

    
function manipularCorte(celulaCorte, indice) {
    if (operacaoAtual !== 'subtracao') return;
   
    const celulasCortePorIndice = {};
    const num1Str = num1.toString();
    const num2Str = num2.toString();
    const comprimentoMaximo = Math.max(num1Str.length, num2Str.length);

    if (setup === 'positivo') 
        {   for (let i = 0; i < comprimentoMaximo; i++) {
            const indiceDigito = i - (comprimentoMaximo - num1Str.length);
            valoresOriginais[i] = indiceDigito >= 0 ? parseInt(num1Str[indiceDigito]) : 0;          
        }
           valoresManipulados = {...valoresOriginais}; 
           setup = 'negativo';
    };
     

    const todasCelulas = document.querySelectorAll('.celula-corte');
    todasCelulas.forEach(celula => {
        const indice = celula.getAttribute('data-indice');
        celulasCortePorIndice[indice] = celula;
    });
   
    // Verificar se já foi cortado
    if (celulaCorte.dataset.cortado === 'true') {
        mostrarMensagem('Este número já foi cortado', 'erro');
        return;
    }

    // Verificar se é possível cortar (se o dígito é maior que 0)
    if (celulasCortePorIndice[indice].textContent === '' && valoresOriginais[indice] === 0) {
        mostrarMensagem('Não é possível cortar um zero', 'erro');        
        return;
    }
    
    // Verificar se há célula à DIREITA para receber o empréstimo
    if (indice === celulasNum1.length - 1) {
        mostrarMensagem('Não é possível cortar a unidade', 'erro');
        return;
    }

    if (valoresManipulados[indice].textContent === valoresOriginais[indice].textContent) {

    valoresManipulados[indice] = valoresManipulados[indice] -1;
    valoresManipulados[indice +1] = valoresManipulados[indice +1] +10;
    celulaCorte.dataset.cortado = 'true';
    celulaCorte.innerHTML = `<span class="valor-cortado">${valoresManipulados[indice]}</span> → `;
    celulasCortePorIndice[indice + 1].innerHTML = valoresManipulados[indice +1];
    celulaCorte.style.color = 'red';
    celulaCorte.style.fontWeight = 'bold'; 

    } else {
        alert('teste');
    }
      
    // Mensagem de instrução
    mostrarMensagem('Número cortado! O valor à direita recebeu +10', 'info');
    setTimeout(esconderMensagem, 2000);
}

    
function limparResposta() {
    // Limpar células de resposta
    celulasResposta.forEach(celula => {
        celula.textContent = '';
        celula.classList.add('celula-vazia');
    });
    
    // Limpar células de vai-um
    celulasVaiUm.forEach(celula => {
        celula.textContent = '';
        celula.classList.add('celula-vazia');
    });
    
    // Limpar células de CORTE
    const todasCelulasCorte = document.querySelectorAll('.celula-corte');
    todasCelulasCorte.forEach(celula => {
        celula.innerHTML = '';
        celula.dataset.cortado = 'false';
        celula.style.color = '';
        celula.style.fontWeight = '';
        
        // Remover marcas de empréstimo
        const emprestimos = celula.querySelectorAll('.numero-emprestimo');
        emprestimos.forEach(el => el.remove());
    });
    
    // Restaurar células num1 (valores originais)
    celulasNum1.forEach((celula, index) => {
        const valorOriginal = celula.dataset.valorOriginal;
        celula.textContent = valorOriginal;
        celula.style.color = '';
        celula.style.fontWeight = '';
    });
    
    // RESET das variáveis de corte
    valoresManipulados = {};
    for (let key in valoresOriginais) {
        valoresManipulados[key] = valoresOriginais[key];
    }
    setup = 'positivo';
    
    // Limpar array de marcas
    marcasEmprestimo = [];
    
    esconderMensagem();
    
    // Desselecionar qualquer célula ou botão
    if (celulaSelecionada) {
        celulaSelecionada.classList.remove('selecionado');
        celulaSelecionada = null;
    }
    if (botaoNumeroSelecionado) {
        botaoNumeroSelecionado.classList.remove('selecionado');
        botaoNumeroSelecionado = null;
    }
    celulaSelecionadaAnterior = null;
}

        // Verificar resposta
function verificarResposta() {
            // Construir a resposta do usuário
    let respostaUsuario = '';
    celulasResposta.forEach(celula => {
        respostaUsuario += celula.textContent;
    });
    respostaUsuario = parseInt(respostaUsuario) || 0;            
    // Verificar vai-um/empréstimo (implementação simplificada)
    let correto = respostaUsuario === resultado;
    
    if (correto) {
        if (modoAtual === 'desafio') {
            pontuacao++;
            problemaAtual++;
            atualizarPontuacao();
            
            if (problemaAtual >= totalProblemas) {
                finalizarJogo();
                return;
            }
            
     
            gerarProblema();
        }
        
        mostrarMensagem('Parabéns! Resposta correta!', 'sucesso');
        setTimeout(() => {
            if (modoAtual === 'estudo') {
                gerarProblema();
            }
            esconderMensagem();
        }, 2000);
    } else {
        mostrarMensagem('Resposta incorreta. Tente novamente!', 'erro');
    }
}

    
function mostrarMensagem(texto, tipo) {
            elementos.mensagemElemento.textContent = texto;
            elementos.mensagemElemento.className = `mensagem ${tipo}`;
            elementos.mensagemElemento.style.display = 'block';
}
    
function esconderMensagem() {
            elementos.mensagemElemento.style.display = 'none';
}
     
function finalizarJogo() {
    clearInterval(intervaloRelogio);
    
    if (pontuacao === totalProblemas) {
        mostrarMensagem(`Parabéns! Você completou todos os ${totalProblemas} problemas!`, 'sucesso');
    } else {
        mostrarMensagem(`Tempo esgotado! Você acertou ${pontuacao} de ${totalProblemas} problemas.`, 'erro');
        elementos.botaoLimpar.style.display = 'none';
        elementos.botaoLimpar.disabled = true;
        elementos.botaoVerificar.style.display = 'none';
        elementos.botaoVerificar.disabled = true;
    }
    
    // Mostrar botão para jogar novamente
    const botaoJogarNovamente = document.createElement('button');
    botaoJogarNovamente.className = 'botao';
    botaoJogarNovamente.textContent = 'Jogar Novamente';
    botaoJogarNovamente.addEventListener('click', () => {
        selecionarModo('desafio');
    });
    elementos.mensagemElemento.appendChild(botaoJogarNovamente);
}

function voltarAoMenu() {
    // RESET COMPLETO de todas as variáveis
    operacaoAtual = '';
    modoAtual = '';
    num1 = 0;
    num2 = 0;
    resultado = 0;
    numerosVaiUm = [];
    numerosEmprestimo = [];
    celulasResposta = [];
    celulasVaiUm = [];
    marcasEmprestimo = [];
    celulasNum1 = [];
    celulasNum2 = [];
    problemaAtual = 0;
    celulaSelecionada = null;
    botaoNumeroSelecionado = null;
  
    
    // Reset dos objetos de valores
    for (let key in valoresOriginais) {
        delete valoresOriginais[key];
    }
    for (let key in valoresManipulados) {
        delete valoresManipulados[key];
    }
    setup = 'positivo';
    
    // Parar temporizador
    clearInterval(intervaloRelogio);
    
    // Mostrar tela inicial
    mostrarTela(elementos.telaBemVindo);
    location.reload();
}

function voltarParaSelecaoModo() {
    // Reset similar ao voltarAoMenu mas mantém algumas configurações
    operacaoAtual = '';
    num1 = 0;
    num2 = 0;
    resultado = 0;
    celulasResposta = [];
    celulasVaiUm = [];
    celulasNum1 = [];
    celulasNum2 = [];
    celulaSelecionada = null;
    botaoNumeroSelecionado = null;
    
    // Reset dos objetos de valores
    for (let key in valoresOriginais) {
        delete valoresOriginais[key];
    }
    for (let key in valoresManipulados) {
        delete valoresManipulados[key];
    }
    setup = 'positivo';
    
    // Parar temporizador se estiver rodando
    clearInterval(intervaloRelogio);
    
    // Mostrar tela inicial
    mostrarTela(elementos.telaBemVindo);
}




