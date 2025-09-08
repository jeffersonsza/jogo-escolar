import { dados1trimestre, dados2trimestre, dados3trimestre } from "./dados.js";

function carregarCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './jogos/historia/associacao/associacao.css'; // Caminho do seu CSS
    document.head.appendChild(link);
}

export function iniciarJogo(selecao) {

    carregarCSS()

    document.body.innerHTML = ` <div class="jogo-container">
           
            <div id="area-jogo"> `

const areaJogo = document.getElementById('area-jogo');

areaJogo.innerHTML = `

<!-- Tela de Instruções -->
<div id="assteladeinstrucoes">
    <h1>JOGO DE ASSOCIAÇÃO</h1>
    <p>COMBINE AS CARTAS. VOCÊ TEM 3 VIDAS.</p>
    <p>INSTRUÇÕES:</p>
    <p>1º Clique na carta. Clique no espaço abaixo das cartas.</p>
    <p>2º Faça o mesmo com a carta que se associa a primeira.</p>
   
    <h3>ESCOLHA A DIFICULDADE:</h3>
    <button class="botaodificuldade" data-difficulty="facil">Modo Fácil</button>
    <button class="botaodificuldade" data-difficulty="dificil">Modo Difícil</button>
    
    <button id="botaoiniciar">Iniciar Jogo</button>
</div>

<!-- Tela do Jogo -->
<div id="assteladojogo">
    <div id = "titulodotitulo"> 
       
    </div>
    <div id="timer" style="font-size: 18px; margin: 10px;">Tempo: 00:00</div>
    <div class="vidasdiv" id="vidasdiv">
        <div class="vidas"></div>
        <div class="vidas"></div>
        <div class="vidas"></div>
    </div>
    
    <div class="areadeselecao" id="espacodeselecao">
        <!-- Itens para selecionar -->
    </div>
    
    <div class="areadedespejo" id="espacodedespejo"> 
        <!-- Pares de dominó -->
    </div>

    <div><button id="botaoreiniciar1">Reiniciar</button></div>
    <div><button class="voltar">Voltar para o menu</button></div>


</div>



<div id="assteladeresultado">
    <h2 id="mensagemderesultado"></h2>
    <button class="botaodificuldade" data-difficulty="facil">Modo Fácil</button>
    <button class="botaodificuldade" data-difficulty="dificil">Modo Difícil</button>
    <button id="botaoreiniciar">Jogar Novamente</button>
    <div><button class="voltar">Voltar para o menu</button></div>
</div>`;
//area conteiner

const assTelaDeInstrucoes = document.getElementById ('assteladeinstrucoes');
const assTelaDoJogo = document.getElementById ('assteladojogo');
const assTelaDeResultado = document.getElementById ('assteladeresultado');

const divDotitulo = document.getElementById ('titulodotitulo');

const assEspacoDeSelecao = document.getElementById ('espacodeselecao');
const assEspacoDeDespejo = document.getElementById ('espacodedespejo');

const assBotaoIniciar = document.getElementById ('botaoiniciar');
const assBotaoReiniciar = document.getElementById ('botaoreiniciar');
const assBotaoReiniciar1 =document.getElementById ('botaoreiniciar1');
const botaoDificuldade = document.querySelectorAll ('.botaodificuldade');
const assBotaoDeVoltar = document.querySelectorAll('.voltar');

const assMensagemDeResultado = document.getElementById ('mensagemderesultado');


let tempoinicial;
let decorrido = 0;
let intervalodetempo;
let parescorretos = 0;
let paratual = [];
let vidas = 3;
let itemselecionado = null;
let slotsdedespejo = [];
let dificuldadeatual = 'facil'

 botaoDificuldade.forEach(botao => {
        botao.addEventListener('click', () => {
            dificuldadeatual = botao.dataset.difficulty;
            
            // Destacar o botão selecionado
            botaoDificuldade.forEach(btn => {
                btn.style.opacity = btn === botao ? "1" : "0.7";
            });
        });
    });

assBotaoIniciar.addEventListener('click', () => {
        assTelaDeInstrucoes.style.display = 'none';
        assTelaDoJogo.style.display = 'block';
        resetarjogo();
        configurarjogo(selecao.trimestre, selecao.ano);
    });

 assBotaoReiniciar.addEventListener('click', () => {
        assTelaDeResultado.style.display = 'none';
        assTelaDoJogo.style.display = 'block';
        resetarjogo();
        configurarjogo(selecao.trimestre, selecao.ano);
    });

 assBotaoReiniciar1.addEventListener ('click', () => {
    resetarjogo();
    configurarjogo(selecao.trimestre, selecao.ano);
 })   

assBotaoDeVoltar.forEach(voltar=> {
    voltar.addEventListener('click', () => {
        location.reload();
    });
});

function iniciarcronometro() {
        tempoinicial = Date.now() - decorrido;
        intervalodetempo = setInterval(atualizarcronometro, 1000);
    }

function atualizarcronometro() {
        decorrido = Date.now() - tempoinicial;
        const seconds = Math.floor((decorrido/ 1000) % 60);
        const minutes = Math.floor((decorrido/ 1000 / 60) % 60);
        document.getElementById('timer').textContent = `Tempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

 function pararcronometro() {
        clearInterval(intervalodetempo);
    };

function resetarcronometro() {
        pararcronometro();
        decorrido = 0;
        document.getElementById('timer').textContent = 'Tempo: 00:00';
    };

 function resetarjogo() {
        vidas = 3;
        parescorretos = 0;
        atualizardisplay();
    };
 function atualizardisplay() {
        const lifeElements = document.querySelectorAll('.vidas');
        lifeElements.forEach((life, index) => {
            life.classList.toggle('lost', index >= vidas);
        });
    };

function loseLife() {
        vidas--;
        atualizardisplay();
        
        if (vidas <= 0) {
            terminarjogo(false);
        }
    };
function terminarjogo(success) {
        pararcronometro();
    
        assTelaDoJogo.style.display = 'none';
        assTelaDeResultado.style.display = 'block';
        
        if (success) {
            // Calcular o tempo decorrido formatado
            const seconds = Math.floor((decorrido / 1000) % 60);
            const minutes = Math.floor((decorrido / 1000 / 60) % 60);
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Mensagem com o ano e tempo
            assMensagemDeResultado.textContent = `Parabéns! Você completou a tarefa do ${selecao.ano}º ano em ${timeString}!`;
        } else {
            assMensagemDeResultado.textContent = "Tente novamente! Você errou 3 vezes.";
        }
    };

function configurarjogo() {

    let dadosTrimestre;
    
    switch(selecao.trimestre) {
        case '1':
            dadosTrimestre = dados1trimestre[selecao.ano];
            break;
        case '2':
            dadosTrimestre = dados2trimestre[selecao.ano];
            break;
        case '3':
            dadosTrimestre = dados3trimestre[selecao.ano];
            break;
        default:
            dadosTrimestre = dados1trimestre[selecao.ano];
    }
        paratual = dadosTrimestre.pares;
        assEspacoDeSelecao.innerHTML = '';
        assEspacoDeDespejo.innerHTML = '';
        itemselecionado = null;
        slotsdedespejo = [];

        divDotitulo.innerHTML = `  <strong>${dadosTrimestre.title}</strong>`

        

        // Criar lista com todos os itens
        let todosositens = [];
        paratual.forEach(pair => {
            todosositens.push(
                { id: pair.id * 2, content: pair.itemA, type: pair.typeA, pairId: pair.id, theme: pair.theme },
                { id: pair.id * 2 + 1, content: pair.itemB, type: pair.typeB, pairId: pair.id, theme: pair.theme }
            );
        });

        // Embaralhar
        todosositens = embaralhar(todosositens);

        // Adicionar itens arrastáveis
        todosositens.forEach(item => {
            const dragItem = document.createElement('div');
            dragItem.className = 'drag-item';
            dragItem.dataset.id = item.id;
            dragItem.dataset.pairId = item.pairId;
            
            // Aplicar cor de tema se estiver no modo fácil
            if (dificuldadeatual === "facil" && item.theme !== undefined) {
                const themeClass = `theme-color-${item.theme % 6}`; // Usamos módulo 6 para garantir que temos uma classe válida
                dragItem.classList.add(themeClass);
            }

            if (item.type === "image") {
                const img = document.createElement('img');
                img.src = item.content;
                dragItem.appendChild(img);
            } else {
                dragItem.textContent = item.content;
            }

            dragItem.addEventListener('click', () => selecionaritem(dragItem));
            assEspacoDeSelecao.appendChild(dragItem);
        });

        // Criar slots (metade do número de pares)
        for (let i = 0; i < 4; i++) {
            const dominoPair = document.createElement('div');
            dominoPair.className = 'domino-pair';

            const dropSlot1 = document.createElement('div');
            dropSlot1.className = 'drop-slot';
            dropSlot1.dataset.pairIndex = i;

            const dropSlot2 = document.createElement('div');
            dropSlot2.className = 'drop-slot';
            dropSlot2.dataset.pairIndex = i;

            [dropSlot1, dropSlot2].forEach(slot => {
                slot.addEventListener('click', () => tentarcolocaritem(slot));
                slotsdedespejo.push(slot);
            });

            dominoPair.appendChild(dropSlot1);
            dominoPair.appendChild(dropSlot2);
            assEspacoDeDespejo.appendChild(dominoPair);
        }
        
        resetarcronometro();
        iniciarcronometro();
    };


    function embaralhar (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

     function selecionaritem (item) {
        // Desselecionar item anterior
        document.querySelectorAll('.drag-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Selecionar novo item
        itemselecionado = item;
        item.classList.add('selected');
        
        // Mostrar slots disponíveis
        slotsdedespejo.forEach(slot => {
            if (!slot.hasChildNodes()) {
                slot.classList.add('highlight');
            }
        });
    };

     function tentarcolocaritem (slot) {
        if (!itemselecionado || slot.hasChildNodes()) return;

        // Remover highlight
        slotsdedespejo.forEach(s => s.classList.remove('highlight'));

        // Criar cópia do item
        const clonedItem = itemselecionado.cloneNode(true);
        clonedItem.classList.remove('selected');
        clonedItem.addEventListener('click', (e) => {
            e.stopPropagation();
            assEspacoDeSelecao.appendChild(clonedItem);
            clonedItem.addEventListener('click', () => selecionaritem(clonedItem));
        });

        // Colocar no slot
        slot.appendChild(clonedItem);
        
        // Remover original
        itemselecionado.remove();
        itemselecionado = null;

        // Verificar se completou um par
        verificarpar();
    };

     function verificarpar() {
        // Verificar todos os pares de slots
        for (let i = 0; i < slotsdedespejo.length; i += 2) {
            const slot1 = slotsdedespejo[i];
            const slot2 = slotsdedespejo[i + 1];

            // Se ambos slots estão preenchidos
            if (slot1.firstChild && slot2.firstChild) {
                const item1 = slot1.firstChild;
                const item2 = slot2.firstChild;

                // Verificar se é um par correto
                if (item1.dataset.pairId === item2.dataset.pairId) {
                    // Par correto - remover após 0.5s
                    setTimeout(() => {
                        slot1.removeChild(item1);
                        slot2.removeChild(item2);
                        parescorretos++;
                        
                        // Verificar vitória
                        if (parescorretos >= paratual.length) {
                            terminarjogo(true);
                        }
                    }, 500);
                } else {
                    // Par errado - perder vida após 1s
                    setTimeout(() => {
                        assEspacoDeSelecao.appendChild(item1);
                        assEspacoDeSelecao.appendChild(item2);
                        item1.addEventListener('click', () => selecionaritem(item1));
                        item2.addEventListener('click', () => selecionaritem(item2));
                        loseLife();
                    }, 1000);
                }
            }
        }
    }




};

