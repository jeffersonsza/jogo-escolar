document.addEventListener('DOMContentLoaded', () => {

    //div dos menus
    const menuInicial = document.getElementById ('menuinicial');
    const menuDoTrimestre = document.getElementById ('menudotrimestre');
    const menuJogoHistoria = document.getElementById ('menujogohistoria');
    const menuJogoMatematica = document.getElementById ('menujogomatematica');
    const menuDosAnos = document.getElementById ('menudosanos');
    const menusSecundarios = document.querySelectorAll('.secundarios');
    const menusTerciarios = document.querySelectorAll('.terciarios');
    const todosOsMenus = document.querySelectorAll ('.menu');

    //botoes
    //tela de menu
    const botaoHistoria = document.getElementById ('botaohistoria');
    const botaoMatematica = document.getElementById ('botaomatematica');
    //tela de trimestre
    const botaoTrimestre1 = document.getElementById ('botaotrimestre1');
    const botaoTrimestre2 = document.getElementById ('botaotrimestre2');
    const botaoTrimestre3 = document.getElementById ('botaotrimestre3');
    const botoesinuteis = document.querySelectorAll ('.inutil');
  
    //tela de escolha do tipo de jogo
    const botaoJogoDeAsociação = document.getElementById ('botaojogodeassociacao');
    const botaoJogoModohistoria = document.getElementById ('botaojogomodohistoria');
    //tela dos tipos de jogo de matematica
    const botaoJogoDeTabuada = document.getElementById ('botaojogodetabuada');
    const botaoJogoDeOperacoesComFracoes = document.getElementById('botaojogodeoperacoescomfracoes');
    const botaoJogoDeSomaeSubtracao = document.getElementById ('botaojogodesomaesubtracao');
    const botaoJogoDeMultiplicacao = document.getElementById ('botaojogodemultiplicacao');
    const botaoJogoDeDivisao = document.getElementById ('botaojogodedivisao');
    //tela de escolha dos anos
    const botao6Ano  = document.getElementById ('botao6ano');
    const botao7Ano  = document.getElementById ('botao7ano');
    const botao8Ano  = document.getElementById ('botao8ano');
    const botao9Ano  = document.getElementById ('botao9ano');
    //botoes de retorno
    const retornarN1 = document.querySelectorAll ('.retornarn1');
    const retornarN2 = document.querySelectorAll ('.retornarn2');
    const retornarN3 = document.querySelectorAll ('.retornarn3');
    // arrayde menu

    let selecao = {    
        disciplina: '',    
        trimestre: '',     
        ano: '',   
        tipodejogo: ''};
    // trimestre ano

    botaoHistoria.addEventListener ('click', () => {
        menuInicial.style.display = 'none';
        menuDoTrimestre.style.display ='block';
        selecao.disciplina = 'historia';
        desativabotoesinuteis (botoesinuteis);

    });

    botaoMatematica.addEventListener ('click', () => {
        menuInicial.style.display = 'none';
        menuJogoMatematica.style.display = 'block';
        selecao.disciplina = 'matematica';
        desativabotoesinuteis (botoesinuteis);

    });

    botaoTrimestre1.addEventListener ('click', () => {
        menuDoTrimestre.style.display = 'none';
        menuDosAnos.style.display = 'block';
        selecao.trimestre = '1';
    });
    
    botaoTrimestre2.addEventListener ('click', () => {
        menuDoTrimestre.style.display = 'none';
        menuDosAnos.style.display = 'block';
        selecao.trimestre = '2';
    });
    
    botaoTrimestre3.addEventListener ('click', () => {
        menuDoTrimestre.style.display = 'none';
        menuDosAnos.style.display = 'block';
        selecao.trimestre = '3';
    });
    


    botao6Ano.addEventListener ('click', () => {
        menuDosAnos.style.display = 'none';
        menuJogoHistoria.style.display = 'block';
        selecao.ano = '6ano';
    });
    botao7Ano.addEventListener ('click', () => {
        menuDosAnos.style.display = 'none';
        menuJogoHistoria.style.display = 'block';
        selecao.ano = '7ano';
    });
    botao8Ano.addEventListener ('click', () => {
        menuDosAnos.style.display = 'none';
        menuJogoHistoria.style.display = 'block';
        selecao.ano = '8ano';
    });
    botao9Ano.addEventListener ('click', () => {
        menuDosAnos.style.display = 'none';
        menuJogoHistoria.style.display = 'block';
        selecao.ano = '9ano';
    });

    botaoJogoDeAsociação.addEventListener('click', async () => {
        todosOsMenus.forEach(menu=>{
            menu.style.display = 'none';
        });
        selecao.tipodejogo = 'associacao';
        const modulo = await import(`./jogos/historia/associacao/associacao.js`);
        modulo.iniciarJogo(selecao);
    });

    botaoJogoDeTabuada.addEventListener('click', async () => {

        todosOsMenus.forEach(menu=>{
            menu.style.display = 'none';
        });
        const modulo = await import(`./jogos/matematica/tabuada/tabuada.js`);
        modulo.iniciarJogoTabuada();    
    });

    botaoJogoDeOperacoesComFracoes.addEventListener('click', async () => {
        todosOsMenus.forEach(menu=>{
            menu.style.display = 'none';
        });
        const modulo = await import(`./jogos/matematica/fracoes/fracoesbase.js`);
        modulo.iniciarJogoDeOperacoesComFracoes();    
    });

    botaoJogoDeSomaeSubtracao.addEventListener('click', async () => {
        todosOsMenus.forEach(menu=>{
            menu.style.display = 'none';
        });
        const modulo = await import(`./jogos/matematica/somaesubtracao/somaesubtracao.js`);
        modulo.iniciarJogoDeSomaESubtração();    
    });

retornarN1.forEach(botao => {
    botao.addEventListener('click', () => {
        // ✅ Converter NodeLists para arrays e concatenar
        const todosMenus = [
            ...Array.from(menusSecundarios), 
            ...Array.from(menusTerciarios)
        ];
        
        todosMenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        menuInicial.style.display = 'block';
    });
});

    retornarN2.forEach (botao => {
            botao.addEventListener ('click', () => {
            menuDosAnos.style.display = 'none';
            menuDoTrimestre.style.display = 'block';
            selecao = [];
        });
    });

retornarN3.forEach(botao => {
    botao.addEventListener('click', () => {
        // ✅ MOSTRAR menu dos anos
        menuDosAnos.style.display = 'block';
        
        // ✅ ESCONDER todos os menus terciários (cada um individualmente)
        menusTerciarios.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // ✅ LIMPAR seleção
        selecao = {};
    });
});


});


function desativabotoesinuteis (botoesinuteis) {

    botoesinuteis.forEach (botao => { 
        botao.style.display = 'none';
        botao.disabled = true;
    });

}
