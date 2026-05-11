<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Jogo de Equações</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .jogo-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }

        .container {
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            width: 100%;
            padding: 30px;
            text-align: center;
            position: relative;
        }

        .screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        h1 {
            color: #2575fc;
            margin-bottom: 20px;
            font-size: 2.2rem;
        }

        .instructions {
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.6;
            font-size: 1.1rem;
            color: #444;
        }

        .btn {
            padding: 12px 30px;
            background-color: #2575fc;
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
            display: inline-block;
        }

        .btncontainer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 10px;
            flex-wrap: wrap;
        }

        .menor {
            padding: 12px 30px;
            background-color: #fc2c25;
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 1.0rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
        }

        .btn-warning {
            background-color: #ffc107;
            color: #333;
        }

        .btn-warning:hover {
            background-color: #e0a800;
        }

        .btn:hover {
            background-color: #0b5ed7;
            transform: translateY(-3px);
        }

        .btn-success {
            background-color: #198754;
        }

        .btn-success:hover {
            background-color: #157347;
        }

        .game-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
            gap: 8px;
            flex-wrap: wrap;
        }

        .info-box {
            background-color: #f8f9fa;
            padding: 10px 20px;
            border-radius: 10px;
            text-align: center;
            flex: 1;
            margin: 0 5px;
        }

        .info-label {
            font-size: 0.9rem;
            color: #6c757d;
        }

        .info-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2575fc;
            transition: opacity 0.3s;
        }

        .timer {
            width: 100%;
            height: 15px;
            background-color: #e9ecef;
            border-radius: 10px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: opacity 0.3s;
        }

        .timer-progress {
            height: 100%;
            background-color: #20c997;
            width: 100%;
            transition: width 0.1s linear;
        }

        .timer-hidden {
            display: none !important;
        }

        .toggle-btn {
            background: #f0f0f0;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            font-size: 1.3rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        .toggle-btn:hover {
            background: #e0e0e0;
            transform: scale(1.05);
        }

        .equation-display {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 40px;
            margin: 20px 0;
            text-align: center;
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            word-break: break-word;
        }

        .deck-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
        }

        .deck {
            width: 90px;
            height: 135px;
            background-color: #ff6b6b;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 1.3rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.3s;
            position: relative;
            overflow: hidden;
        }

        .deck::before {
            content: "";
            position: absolute;
            top: 8px;
            left: 8px;
            right: 8px;
            bottom: 8px;
            border: 2px dashed rgba(255, 255, 255, 0.5);
            border-radius: 8px;
        }

        .deck:hover {
            transform: translateY(-5px);
        }

        .options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
            width: 100%;
            margin-top: 10px;
        }

        .option {
            background-color: #e9ecef;
            border: none;
            border-radius: 10px;
            padding: 12px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }

        .option:hover {
            background-color: #2575fc;
            color: white;
        }

        .hidden {
            display: none;
        }

        .result-title {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #198754;
        }

        .result-stats {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }

        .result-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .aluno-identificacao {
            background: linear-gradient(145deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .aluno-identificacao h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
        }

        .selector-row {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .selector-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .selector-group label {
            font-weight: bold;
            color: #495057;
            font-size: 1.1rem;
        }

        .selector-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .ano-btn, .letra-btn {
            padding: 12px 20px;
            font-size: 1.2rem;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            background: linear-gradient(145deg, #6c5ce7, #a463f5);
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 60px;
        }

        .numero-grid {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 8px;
            max-height: 200px;
            overflow-y: auto;
            padding: 10px;
            background: white;
            border-radius: 10px;
            border: 1px solid #dee2e6;
        }

        .numero-btn {
            padding: 10px;
            font-size: 1rem;
            font-weight: bold;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            background: linear-gradient(145deg, #00b894, #00cec9);
            color: white;
            cursor: pointer;
            transition: all 0.3s;
        }

        .ano-btn:hover, .letra-btn:hover, .numero-btn:hover {
            transform: scale(1.05);
            filter: brightness(1.1);
        }

        .ano-btn.selected, .letra-btn.selected, .numero-btn.selected {
            box-shadow: 0 0 0 3px #ffc107;
            filter: brightness(1.2);
        }

        .aluno-info {
            margin-top: 15px;
            padding: 15px;
            background: #d4edda;
            border-radius: 10px;
            text-align: center;
            font-weight: bold;
            color: #155724;
            font-size: 1.2rem;
            border: 1px solid #c3e6cb;
        }

        .modos-container {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin: 15px 0;
            flex-wrap: wrap;
        }

        .modo-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f8f9fa;
            padding: 10px 20px;
            border-radius: 40px;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid transparent;
        }

        .modo-checkbox:hover {
            background: #e9ecef;
            transform: scale(1.02);
        }

        .modo-checkbox.selected {
            border-color: #2575fc;
            background: #e3f2fd;
        }

        .modo-checkbox input {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .modo-checkbox label {
            font-weight: bold;
            cursor: pointer;
            margin: 0;
        }

        .modo-checkbox .modo-descricao {
            font-size: 0.8rem;
            color: #666;
            margin-left: 5px;
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

        .modal.hidden {
            display: none;
        }

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
            font-size: 14px;
            align-items: center;
        }

        .stats-item.fast-correct { background: rgba(40, 167, 69, 0.2); border-left: 5px solid #28a745; }
        .stats-item.normal-correct { background: rgba(23, 162, 184, 0.1); border-left: 5px solid #17a2b8; }
        .stats-item.slow-correct { background: rgba(255, 193, 7, 0.2); border-left: 5px solid #ffc107; }
        .stats-item.wrong { background: rgba(220, 53, 69, 0.1); border-left: 5px solid #dc3545; }

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
            flex-wrap: wrap;
            gap: 10px;
        }

        .history-stats {
            display: flex;
            gap: 15px;
            color: #666;
            font-size: 14px;
            flex-wrap: wrap;
        }

        .stats-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        .btn-stats {
            background: linear-gradient(145deg, #00b894, #00cec9);
            color: white;
        }

        .equation-preview {
            font-size: 1.1rem;
            color: #666;
            margin-top: 5px;
        }

        @media (max-width: 768px) {
            .options {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .result-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .stats-item {
                grid-template-columns: 60px 1fr 60px 50px;
                font-size: 11px;
            }
            
            .stats-summary {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .modos-container {
                flex-direction: column;
                align-items: center;
            }

            .toggle-btn {
                width: 35px;
                height: 35px;
                font-size: 1rem;
            }

            .game-info {
                gap: 5px;
            }

            .info-box {
                padding: 8px 12px;
            }

            .info-value {
                font-size: 1.2rem;
            }

            .equation-display {
                font-size: 1.5rem;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="jogo-container">
    <div class="btncontainer">
        <button id="restart-btn" class="btn btn-warning hidden">🔄 Reiniciar</button>
        <button id="vpequacoes-btn" class="btn btn-warning hidden">Voltar para equações</button>
    </div>
    
    <div class="container">
        <div class="screen" id="welcome-screen">
            <h1>🧮 Jogo de Equações</h1>
            
            <div class="aluno-identificacao">
                <h3>📋 Identifique-se</h3>
                <div class="selector-row">
                    <div class="selector-group">
                        <label>Ano:</label>
                        <div class="selector-buttons" id="ano-selector">
                            <button class="ano-btn" data-ano="6º">6º</button>
                            <button class="ano-btn" data-ano="7º">7º</button>
                            <button class="ano-btn" data-ano="8º">8º</button>
                            <button class="ano-btn" data-ano="9º">9º</button>
                        </div>
                    </div>
                    <div class="selector-group">
                        <label>Turma:</label>
                        <div class="selector-buttons" id="letra-selector" style="display: none;">
                            <button class="letra-btn" data-letra="A">A</button>
                            <button class="letra-btn" data-letra="B">B</button>
                            <button class="letra-btn" data-letra="C">C</button>
                            <button class="letra-btn" data-letra="D">D</button>
                            <button class="letra-btn" data-letra="E">E</button>
                            <button class="letra-btn" data-letra="F">F</button>
                        </div>
                    </div>
                    <div class="selector-group">
                        <label>N° Chamada:</label>
                        <div class="selector-buttons" id="numero-selector" style="display: none;">
                            <div class="numero-grid" id="numero-grid"></div>
                        </div>
                    </div>
                </div>
                <div id="aluno-info" class="aluno-info" style="display: none;">
                    ✅ Aluno: <span id="aluno-ano-display"></span> <span id="aluno-letra-display"></span> - N° <span id="aluno-numero-display"></span>
                </div>
            </div>
            
            <div class="instructions">
                <p>🎯 Resolva as equações de 1º grau antes que o tempo acabe!</p>
                <p>📊 Passe de nível acertando todas as questões</p>
                <p>⚡ Acertos rápidos adicionam tempo bônus</p>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
                <button class="btn" id="start-btn">Começar</button>
                <button class="btn btn-config" id="config-btn">⚙️ Configurar</button>
            </div>
            
            <div class="modos-container">
                <div class="modo-checkbox" id="modo-dobro-container">
                    <input type="checkbox" id="modo-dobro">
                    <label for="modo-dobro">
                        🔥 Modo Dobro
                        <span class="modo-descricao">(2× questões, 2× tempo)</span>
                    </label>
                </div>
                <div class="modo-checkbox" id="modo-triplo-container">
                    <input type="checkbox" id="modo-triplo">
                    <label for="modo-triplo">
                        💪 Modo Triplo
                        <span class="modo-descricao">(3× questões, 3× tempo)</span>
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
                <button class="btn btn-stats" id="view-stats-btn">📊 Ver Estatísticas</button>
            </div>
            
            <div id="config-indicator" style="display: none; color: #28a745; font-weight: bold; margin-top: 10px;">
                Nível: <span id="selected-level">1</span> | 
                Tempo: <span id="selected-time">40</span>s por questão
            </div>
            <div id="modo-indicator" style="display: none; color: #ff6b6b; font-weight: bold; margin-top: 5px; font-size: 0.9rem;">
                🔥 Modo Ativo: <span id="modo-ativo"></span>
            </div>
            <button class="voltar menor">Voltar para a plataforma de jogos</button>  
        </div>
        
        <div class="screen hidden" id="game-screen">
            <div class="game-info">
                <div class="info-box"><div class="info-label">Acertos</div><div class="info-value" id="score">0/20</div></div>
                <div class="info-box timer-text-container"><div class="info-label">Tempo</div><div class="info-value" id="time">40s</div></div>
                <button id="toggle-timer-text-btn" class="toggle-btn" title="Esconder/Mostrar cronômetro">👀</button>
                <div class="info-box"><div class="info-label">Nível</div><div class="info-value" id="level-display">1</div></div>
                
                <button id="toggle-timer-bar-btn" class="toggle-btn" title="Esconder/Mostrar barra de tempo">👀</button>
            </div>
            <div class="timer" id="timer-container"><div class="timer-progress" id="timer-progress"></div></div>
            <p class="info-label" id="level-description">Nível 1: Equações básicas com adição/subtração</p>
            
            <div class="equation-display" id="equation-display">
                x + 5 = 10
            </div>
            
            <div class="deck-container">
                <div class="deck" id="deck"><div>20</div></div>
                <div class="equation-preview">📦 Questões restantes</div>
            </div>
            
            <div class="options" id="options"></div>
        </div>

        <div class="screen hidden" id="result-screen">
            <h2 class="result-title" id="result-message">Parabéns!</h2>
            <p class="result-stats" id="result-stats">Você acertou 20 de 20 equações!</p>
            <div class="result-buttons">
                <button class="btn" id="play-again">Jogar Novamente</button>
                <button class="btn btn-success" id="next-level">Próximo Nível</button>
                <button class="btn btn-stats" id="view-level-stats">📊 Estatísticas deste jogo</button>
            </div>
        </div>
        
        <div class="screen hidden" id="stats-screen">
            <h2 class="stats-title">📊 Estatísticas do Nível <span id="stats-level">1</span></h2>
            <div class="stats-summary">
                <div class="stats-box"><div class="stats-label">Total de Questões</div><div class="stats-value" id="stats-total">20</div></div>
                <div class="stats-box"><div class="stats-label">Acertos</div><div class="stats-value" id="stats-correct">15</div></div>
                <div class="stats-box"><div class="stats-label">Erros</div><div class="stats-value" id="stats-wrong">5</div></div>
                <div class="stats-box"><div class="stats-label">Tempo Médio</div><div class="stats-value" id="stats-avg-time">1.2s</div></div>
            </div>
            <div class="stats-legend">
                <div class="legend-item"><div class="legend-color" style="background: #28a745;"></div><span>Acerto rápido</span></div>
                <div class="legend-item"><div class="legend-color" style="background: #17a2b8;"></div><span>Acerto médio</span></div>
                <div class="legend-item"><div class="legend-color" style="background: #ffc107;"></div><span>Acerto lento</span></div>
                <div class="legend-item"><div class="legend-color" style="background: #dc3545;"></div><span>Erro</span></div>
            </div>
            <div class="stats-list" id="stats-list"></div>
            <div class="stats-buttons">
                <button class="btn" id="back-to-result-stats">← Voltar para Resultado</button>
                <button class="btn" id="back-to-history-stats">← Voltar para Histórico</button>
            </div>
        </div>
        
        <div class="screen hidden" id="history-screen">
            <h2 class="stats-title">📚 Histórico de Jogos</h2>
            <div class="history-list" id="history-list"></div>
            <div class="stats-buttons">
                <button class="btn" id="back-to-welcome">Voltar ao Menu</button>
                <button class="btn btn-warning" id="clear-history-btn">🗑️ Limpar Histórico</button>
            </div>
        </div>
    </div>

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

    <div id="config-modal" class="modal hidden">
        <div class="modal-content" style="max-width: 500px;">
            <h3>⚙️ Configurações do Jogo</h3>
            <div style="margin: 20px 0;">
                <h4 style="margin-bottom: 10px;">Selecionar Nível Inicial (1-5):</h4>
                <div class="level-buttons" id="level-buttons"></div>
            </div>
            <div style="margin: 20px 0;">
                <h4 style="margin-bottom: 10px;">Configurar Tempo Base por Questão:</h4>
                <div style="display: flex; align-items: center; gap: 15px; justify-content: center;">
                    <button id="decrease-time" class="time-control-btn">-</button>
                    <input type="number" id="time-input" min="5" max="120" value="40" class="time-input">
                    <button id="increase-time" class="time-control-btn">+</button>
                    <span style="font-size: 16px; color: #666;">segundos</span>
                </div>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; margin: 25px 0 10px;">
                <button class="btn btn-success" id="apply-config">Aplicar Configurações</button>
                <button class="btn btn-warning" id="cancel-config">Cancelar</button>
            </div>
        </div>
    </div>
</div>

<script>
// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let baseTimeLimit = 40;
let correctAnswer = null;
let currentLevel = 1;
let currentEquation = null;
let gameActive = false;
let remainingEquations = 20;
let remainingTime = null;
let score = 0;
let timeLimit = 40;
let timerInterval = null;
let totalQuestions = 20;
let nivelConfigurado = 1;
let tempoConfigurado = 40;
let pageVisible = true;
let timeWhenHidden = 0;
let abaTrocada = false;
let hideTimerText = false;
let hideTimerBar = false;

let modoDificuldade = 'normal';

const SAVE_KEY = 'equacoes_game_state';
const STATS_KEY = 'equacoes_statistics';
const MAX_HISTORICO = 10;
const MIN_RESPOSTAS_PARA_SALVAR = 5;

let questionStartTime = null;
let questionStats = [];
let currentQuestionNumber = 0;
let alunoAno = null;
let alunoLetra = null;
let alunoNumero = null;

const TEMPO_MAXIMO_RECUPERACAO = 10 * 60 * 1000;

let elements = null;
let levelConfigs = null;

// ============================================
// FUNÇÃO MDC E SIMPLIFICAÇÃO
// ============================================
function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function simplificarFracao(numerador, denominador) {
    const divisor = gcd(Math.abs(numerador), Math.abs(denominador));
    return {
        numerador: numerador / divisor,
        denominador: denominador / divisor
    };
}

// ============================================
// CONFIGURAÇÕES DE NÍVEL
// ============================================
function configurarNiveis() {
    levelConfigs = {
        1: { 
            totalCards: 20, 
            timeMultiplier: 1,
            description: "Equações básicas com adição e subtração" 
        },
        2: { 
            totalCards: 20, 
            timeMultiplier: 1,
            description: "Coeficiente inteiro multiplicando a variável" 
        },
        3: { 
            totalCards: 18, 
            timeMultiplier: 1.5,
            description: "Combinação de adição/subtração com coeficiente" 
        },
        4: { 
            totalCards: 18, 
            timeMultiplier: 2,
            description: "Variáveis em ambos os lados e coeficientes negativos" 
        },
        5: { 
            totalCards: 16, 
            timeMultiplier: 2.5,
            description: "Coeficientes fracionários e decimais" 
        }
    };
}

// ============================================
// FUNÇÕES DE CÁLCULO DE MODO
// ============================================
function calcularQuestoesModo(originalCards, nivel) {
    if (modoDificuldade === 'dobro') {
        return Math.floor(originalCards * 1.5);
    } else if (modoDificuldade === 'triplo') {
        return Math.floor(originalCards * 2);
    }
    return originalCards;
}

function calcularTempoModo(originalTime, nivel) {
    if (modoDificuldade === 'dobro') {
        return originalTime * 1.5;
    } else if (modoDificuldade === 'triplo') {
        return originalTime * 2;
    }
    return originalTime;
}

function getModoDescricao() {
    if (modoDificuldade === 'dobro') return '🔥 Modo Dobro (1.5× questões, 1.5× tempo)';
    if (modoDificuldade === 'triplo') return '💪 Modo Triplo (2× questões, 2× tempo)';
    return 'Modo Normal';
}

function atualizarModoPelosCheckboxes() {
    const modoDobroCheck = document.getElementById('modo-dobro');
    const modoTriploCheck = document.getElementById('modo-triplo');
    
    if (modoDobroCheck.checked) {
        modoDificuldade = 'dobro';
    } else if (modoTriploCheck.checked) {
        modoDificuldade = 'triplo';
    } else {
        modoDificuldade = 'normal';
    }
    
    salvarModo();
    atualizarIndicadorModo();
}

function salvarModo() {
    localStorage.setItem('equacoes_modo', modoDificuldade);
}

function carregarModoSalvo() {
    const saved = localStorage.getItem('equacoes_modo');
    const modoDobroCheck = document.getElementById('modo-dobro');
    const modoTriploCheck = document.getElementById('modo-triplo');
    
    if (saved === 'dobro') {
        modoDificuldade = 'dobro';
        if (modoDobroCheck) modoDobroCheck.checked = true;
        if (modoTriploCheck) modoTriploCheck.checked = false;
    } else if (saved === 'triplo') {
        modoDificuldade = 'triplo';
        if (modoDobroCheck) modoDobroCheck.checked = false;
        if (modoTriploCheck) modoTriploCheck.checked = true;
    } else {
        modoDificuldade = 'normal';
        if (modoDobroCheck) modoDobroCheck.checked = false;
        if (modoTriploCheck) modoTriploCheck.checked = false;
    }
    atualizarIndicadorModo();
}

function atualizarIndicadorModo() {
    const modoIndicator = document.getElementById('modo-indicator');
    const modoAtivoSpan = document.getElementById('modo-ativo');
    if (modoIndicator && modoAtivoSpan) {
        if (modoDificuldade !== 'normal') {
            modoIndicator.style.display = 'block';
            modoAtivoSpan.textContent = getModoDescricao();
        } else {
            modoIndicator.style.display = 'none';
        }
    }
}

function getConfigNivel(nivel) {
    const original = levelConfigs[nivel];
    const tempoOriginal = Math.floor(baseTimeLimit * original.timeMultiplier);
    
    return {
        description: original.description,
        totalCards: calcularQuestoesModo(original.totalCards, nivel),
        timeLimit: calcularTempoModo(tempoOriginal, nivel)
    };
}

// ============================================
// INICIALIZAÇÃO
// ============================================
function init() {
    configurarNiveis();
    configurarElementosDOM();
    configurarEventListeners();
    configurarSeletoresAluno();
    configurarModosDificuldade();
    setupVisibilityDetection();
    carregarModoSalvo();
    carregarPreferenciasTimer();
    
    // Criar botões de nível
    const levelButtonsContainer = document.getElementById('level-buttons');
    if (levelButtonsContainer) {
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.dataset.level = i;
            btn.textContent = i;
            levelButtonsContainer.appendChild(btn);
        }
    }
}

function carregarPreferenciasTimer() {
    const savedHideText = localStorage.getItem('equacoes_hide_timer_text');
    const savedHideBar = localStorage.getItem('equacoes_hide_timer_bar');
    
    if (savedHideText === 'true') {
        hideTimerText = true;
        if (elements.toggleTimerTextBtn) elements.toggleTimerTextBtn.textContent = '🙈';
        if (elements.timeElement) elements.timeElement.style.opacity = '0';
    }
    
    if (savedHideBar === 'true') {
        hideTimerBar = true;
        if (elements.toggleTimerBarBtn) elements.toggleTimerBarBtn.textContent = '🙈';
        if (elements.timerContainer) elements.timerContainer.classList.add('timer-hidden');
    }
}

function configurarModosDificuldade() {
    const modoDobroCheck = document.getElementById('modo-dobro');
    const modoTriploCheck = document.getElementById('modo-triplo');
    
    if (modoDobroCheck) {
        modoDobroCheck.addEventListener('change', () => {
            if (modoDobroCheck.checked) {
                if (modoTriploCheck) modoTriploCheck.checked = false;
                modoDificuldade = 'dobro';
            } else if (modoTriploCheck && !modoTriploCheck.checked) {
                modoDificuldade = 'normal';
            }
            salvarModo();
            atualizarIndicadorModo();
        });
    }
    
    if (modoTriploCheck) {
        modoTriploCheck.addEventListener('change', () => {
            if (modoTriploCheck.checked) {
                if (modoDobroCheck) modoDobroCheck.checked = false;
                modoDificuldade = 'triplo';
            } else if (modoDobroCheck && !modoDobroCheck.checked) {
                modoDificuldade = 'normal';
            }
            salvarModo();
            atualizarIndicadorModo();
        });
    }
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
        timerContainer: document.getElementById('timer-container'),
        equationDisplay: document.getElementById('equation-display'),
        deck: document.getElementById('deck'),
        optionsContainer: document.getElementById('options'),
        resultMessage: document.getElementById('result-message'),
        resultStats: document.getElementById('result-stats'),
        nextLevelBtn: document.getElementById('next-level'),
        playAgainBtn: document.getElementById('play-again'),
        startBtn: document.getElementById('start-btn'),
        restartBtn: document.getElementById('restart-btn'),
        vpequacoesBtn: document.getElementById('vpequacoes-btn'),
        voltarBtn: document.querySelector('.voltar'),
        backToResultStats: document.getElementById('back-to-result-stats'),
        backToHistoryStats: document.getElementById('back-to-history-stats'),
        viewStatsBtn: document.getElementById('view-stats-btn'),
        viewLevelStats: document.getElementById('view-level-stats'),
        backToWelcome: document.getElementById('back-to-welcome'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        statsLevel: document.getElementById('stats-level'),
        statsTotal: document.getElementById('stats-total'),
        statsCorrect: document.getElementById('stats-correct'),
        statsWrong: document.getElementById('stats-wrong'),
        statsAvgTime: document.getElementById('stats-avg-time'),
        statsList: document.getElementById('stats-list'),
        historyList: document.getElementById('history-list'),
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
        toggleTimerTextBtn: document.getElementById('toggle-timer-text-btn'),
        toggleTimerBarBtn: document.getElementById('toggle-timer-bar-btn')
    };
}

function configurarEventListeners() {
    if (elements.startBtn) elements.startBtn.addEventListener('click', () => {
        atualizarModoPelosCheckboxes();
        startGame();
    });
    if (elements.playAgainBtn) elements.playAgainBtn.addEventListener('click', () => {
        atualizarModoPelosCheckboxes();
        startGame();
    });
    if (elements.nextLevelBtn) elements.nextLevelBtn.addEventListener('click', nextLevel);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', reiniciarJogo);
    if (elements.vpequacoesBtn) elements.vpequacoesBtn.addEventListener('click', retornarParaEquacoes);
    if (elements.voltarBtn) elements.voltarBtn.addEventListener('click', () => {
        localStorage.removeItem('equacoes_modo');
        window.location.href = 'https://jeffersonsza.github.io/jogo-escolar';
    });
    if (elements.viewStatsBtn) elements.viewStatsBtn.addEventListener('click', mostrarHistoricoDaSessao);
    if (elements.viewLevelStats) elements.viewLevelStats.addEventListener('click', () => mostrarEstatisticasAtuais('result'));
    if (elements.backToResultStats) elements.backToResultStats.addEventListener('click', () => {
        elements.statsScreen.classList.add('hidden');
        elements.resultScreen.classList.remove('hidden');
    });
    if (elements.backToHistoryStats) elements.backToHistoryStats.addEventListener('click', () => {
        elements.statsScreen.classList.add('hidden');
        elements.historyScreen.classList.remove('hidden');
    });
    if (elements.backToWelcome) elements.backToWelcome.addEventListener('click', () => {
        elements.historyScreen.classList.add('hidden');
        elements.welcomeScreen.classList.remove('hidden');
    });
    if (elements.clearHistoryBtn) elements.clearHistoryBtn.addEventListener('click', limparHistorico);
    
    if (elements.toggleTimerTextBtn) {
        elements.toggleTimerTextBtn.addEventListener('click', () => {
            hideTimerText = !hideTimerText;
            localStorage.setItem('equacoes_hide_timer_text', hideTimerText ? 'true' : 'false');
            if (elements.timeElement) {
                elements.timeElement.style.opacity = hideTimerText ? '0' : '1';
            }
            elements.toggleTimerTextBtn.textContent = hideTimerText ? '🙈' : '👀';
        });
    }
    
    if (elements.toggleTimerBarBtn) {
        elements.toggleTimerBarBtn.addEventListener('click', () => {
            hideTimerBar = !hideTimerBar;
            localStorage.setItem('equacoes_hide_timer_bar', hideTimerBar ? 'true' : 'false');
            if (elements.timerContainer) {
                if (hideTimerBar) {
                    elements.timerContainer.classList.add('timer-hidden');
                } else {
                    elements.timerContainer.classList.remove('timer-hidden');
                }
            }
            elements.toggleTimerBarBtn.textContent = hideTimerBar ? '🙈' : '👀';
        });
    }
    
    if (elements.configBtn) elements.configBtn.addEventListener('click', abrirModalSenha);
    if (elements.confirmPassword) elements.confirmPassword.addEventListener('click', verificarSenha);
    if (elements.cancelPassword) elements.cancelPassword.addEventListener('click', fecharModalSenha);
    if (elements.cancelConfig) elements.cancelConfig.addEventListener('click', fecharModalConfig);
    if (elements.applyConfig) elements.applyConfig.addEventListener('click', aplicarConfiguracoes);
    
    if (elements.decreaseTime) elements.decreaseTime.addEventListener('click', () => {
        let valor = parseInt(elements.timeInput.value) || 40;
        valor = Math.max(5, valor - 1);
        elements.timeInput.value = valor;
    });
    if (elements.increaseTime) elements.increaseTime.addEventListener('click', () => {
        let valor = parseInt(elements.timeInput.value) || 40;
        valor = Math.min(120, valor + 1);
        elements.timeInput.value = valor;
    });
    if (elements.timeInput) elements.timeInput.addEventListener('change', () => {
        let valor = parseInt(elements.timeInput.value) || 40;
        valor = Math.min(120, Math.max(5, valor));
        elements.timeInput.value = valor;
    });
    
    if (elements.optionsContainer) {
        elements.optionsContainer.addEventListener('click', (e) => {
            if (gameActive && e.target.classList.contains('option')) {
                checkAnswer(e.target.textContent);
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('level-btn')) {
            document.querySelectorAll('.level-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            e.target.classList.add('selected');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModalSenha();
            fecharModalConfig();
        }
    });
}

function configurarSeletoresAluno() {
    const numeroGrid = document.getElementById('numero-grid');
    if (numeroGrid) {
        for (let i = 1; i <= 40; i++) {
            const btn = document.createElement('button');
            btn.className = 'numero-btn';
            btn.dataset.numero = i.toString();
            btn.textContent = i;
            numeroGrid.appendChild(btn);
        }
    }
    
    document.querySelectorAll('.ano-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.ano-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            alunoAno = e.target.dataset.ano;
            const letraSelector = document.getElementById('letra-selector');
            const numeroSelector = document.getElementById('numero-selector');
            const alunoInfo = document.getElementById('aluno-info');
            if (letraSelector) letraSelector.style.display = 'flex';
            if (numeroSelector) numeroSelector.style.display = 'none';
            if (alunoInfo) alunoInfo.style.display = 'none';
            alunoLetra = null;
            alunoNumero = null;
        });
    });
    
    document.querySelectorAll('.letra-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.letra-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            alunoLetra = e.target.dataset.letra;
            const numeroSelector = document.getElementById('numero-selector');
            if (numeroSelector) numeroSelector.style.display = 'flex';
            alunoNumero = null;
        });
    });
    
    if (numeroGrid) {
        numeroGrid.querySelectorAll('.numero-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.numero-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                alunoNumero = e.target.dataset.numero;
                const anoDisplay = document.getElementById('aluno-ano-display');
                const letraDisplay = document.getElementById('aluno-letra-display');
                const numeroDisplay = document.getElementById('aluno-numero-display');
                const alunoInfo = document.getElementById('aluno-info');
                if (anoDisplay) anoDisplay.textContent = alunoAno;
                if (letraDisplay) letraDisplay.textContent = alunoLetra;
                if (numeroDisplay) numeroDisplay.textContent = alunoNumero;
                if (alunoInfo) alunoInfo.style.display = 'block';
            });
        });
    }
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

function registrarResposta(acertou, equacao, resposta) {
    if (!questionStartTime) return;
    const tempoResposta = (Date.now() - questionStartTime) / 1000;
    questionStats.push({
        numero: currentQuestionNumber,
        equacao: equacao,
        respostaCorreta: resposta,
        acertou: acertou,
        tempo: tempoResposta,
        nivel: currentLevel,
        modo: modoDificuldade
    });
    questionStartTime = null;
}

function calcularMediaTempo() {
    if (questionStats.length === 0) return 0;
    const soma = questionStats.reduce((acc, stat) => acc + stat.tempo, 0);
    return soma / questionStats.length;
}

function salvarEstatisticas() {
    if (questionStats.length < MIN_RESPOSTAS_PARA_SALVAR) {
        console.log(`⏭️ Partida ignorada (apenas ${questionStats.length} respostas)`);
        return;
    }
    
    if (!alunoAno || !alunoLetra || !alunoNumero) {
        alert('⚠️ Por favor, identifique-se antes de jogar!');
        return;
    }
    
    let historico = [];
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    if (historicoSalvo) {
        try { historico = JSON.parse(historicoSalvo); } catch (e) { historico = []; }
    }
    
    const registro = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        dataTimestamp: Date.now(),
        aluno: { ano: alunoAno, letra: alunoLetra, numero: alunoNumero },
        nivel: currentLevel,
        modo: modoDificuldade,
        stats: [...questionStats],
        total: questionStats.length,
        acertos: questionStats.filter(s => s.acertou).length,
        mediaTempo: calcularMediaTempo(),
        tempoTotal: timeLimit,
        tempoRestante: remainingTime
    };
    
    historico.push(registro);
    if (historico.length > MAX_HISTORICO) historico = historico.slice(-MAX_HISTORICO);
    localStorage.setItem(STATS_KEY, JSON.stringify(historico));
    console.log(`✅ Partida de ${alunoAno}${alunoLetra} N°${alunoNumero} salva (Modo: ${modoDificuldade})`);
}

function mostrarEstatisticasAtuais(origem) {
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.welcomeScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.statsScreen.classList.remove('hidden');
    
    if (elements.backToResultStats) elements.backToResultStats.style.display = (origem === 'result') ? 'inline-block' : 'none';
    if (elements.backToHistoryStats) elements.backToHistoryStats.style.display = (origem === 'history') ? 'inline-block' : 'none';
    
    if (elements.statsLevel) elements.statsLevel.textContent = currentLevel;
    if (elements.statsTotal) elements.statsTotal.textContent = questionStats.length;
    if (elements.statsCorrect) elements.statsCorrect.textContent = questionStats.filter(s => s.acertou).length;
    if (elements.statsWrong) elements.statsWrong.textContent = questionStats.length - questionStats.filter(s => s.acertou).length;
    if (elements.statsAvgTime) elements.statsAvgTime.textContent = calcularMediaTempo().toFixed(1) + 's';
    
    if (elements.statsList) {
        elements.statsList.innerHTML = '';
        const mediaTempo = calcularMediaTempo();
        questionStats.forEach(stat => {
            const item = document.createElement('div');
            item.className = 'stats-item';
            if (!stat.acertou) item.classList.add('wrong');
            else if (stat.tempo < mediaTempo * 0.8) item.classList.add('fast-correct');
            else if (stat.tempo > mediaTempo * 1.2) item.classList.add('slow-correct');
            else item.classList.add('normal-correct');
            
            item.innerHTML = `
                <div class="stats-number">#${stat.numero}</div>
                <div class="stats-question">${stat.equacao}</div>
                <div class="stats-time">${stat.tempo.toFixed(1)}s</div>
                <div class="stats-result">${stat.acertou ? '✅' : '❌'}</div>
            `;
            elements.statsList.appendChild(item);
        });
    }
}

function mostrarHistoricoDaSessao() {
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.remove('hidden');
    
    const historicoSalvo = localStorage.getItem(STATS_KEY);
    let historico = [];
    if (historicoSalvo) {
        try { historico = JSON.parse(historicoSalvo); } catch (e) { historico = []; }
    }
    
    if (elements.historyList) {
        elements.historyList.innerHTML = '';
        
        if (historico.length === 0) {
            elements.historyList.innerHTML = '<p style="text-align: center; padding: 40px;">Nenhuma estatística salva ainda.</p>';
            return;
        }
        
        const alunosMap = new Map();
        historico.forEach(reg => {
            const chave = `${reg.aluno.ano}-${reg.aluno.letra}-${reg.aluno.numero}`;
            if (!alunosMap.has(chave)) {
                alunosMap.set(chave, { aluno: reg.aluno, partidas: 0, questoes: 0, acertos: 0, tempoTotal: 0 });
            }
            const stat = alunosMap.get(chave);
            stat.partidas++;
            stat.questoes += reg.total;
            stat.acertos += reg.acertos;
            stat.tempoTotal += reg.mediaTempo * reg.total;
        });
        
        const resumoDiv = document.createElement('div');
        resumoDiv.className = 'stats-summary';
        resumoDiv.innerHTML = '<h3 style="grid-column: 1/-1; text-align: center;">📋 Resumo por Aluno</h3>';
        
        alunosMap.forEach(stat => {
            const percentual = Math.round((stat.acertos / stat.questoes) * 100) || 0;
            const mediaAluno = (stat.tempoTotal / stat.questoes).toFixed(1);
            const card = document.createElement('div');
            card.className = 'stats-box';
            card.innerHTML = `
                <div class="stats-label">${stat.aluno.ano}${stat.aluno.letra} N°${stat.aluno.numero}</div>
                <div class="stats-value" style="font-size: 20px;">${stat.partidas} jogos</div>
                <div style="font-size: 14px;">✅ ${percentual}% | ⏱️ ${mediaAluno}s</div>
            `;
            resumoDiv.appendChild(card);
        });
        
        elements.historyList.appendChild(resumoDiv);
        
        const detalhesDiv = document.createElement('div');
        detalhesDiv.innerHTML = '<h3 style="text-align: center; margin: 20px 0;">📝 Últimas Partidas</h3>';
        elements.historyList.appendChild(detalhesDiv);
        
        historico.reverse().forEach(registro => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const agora = Date.now();
            const tempoPartida = registro.dataTimestamp || registro.id;
            const diferenca = agora - tempoPartida;
            const ehRecente = diferenca <= TEMPO_MAXIMO_RECUPERACAO;

            const percentual = Math.round((registro.acertos / registro.total) * 100);
            const dataObj = new Date(registro.data);
            const hora = dataObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const modoIcon = registro.modo === 'dobro' ? '🔥' : (registro.modo === 'triplo' ? '💪' : '⭐');

            let nivelParaJogar;
            let textoBotao;

            if (registro.acertos === registro.total) {
                nivelParaJogar = Math.min(registro.nivel + 1, 5);
                textoBotao = `▶️ Jogar Nível ${nivelParaJogar} (próximo)`;
            } else {
                nivelParaJogar = registro.nivel;
                textoBotao = `▶️ Jogar Nível ${nivelParaJogar} (mesmo nível)`;
            }
            
            item.innerHTML = `
                <div class="history-header">
                    <span>🕒 ${hora}</span>
                    <span>👤 ${registro.aluno.ano}${registro.aluno.letra} N°${registro.aluno.numero}</span>
                    <span>🎮 Nível ${registro.nivel} ${modoIcon}</span>
                </div>
                <div class="history-stats">
                    <span>✅ ${registro.acertos}/${registro.total}</span>
                    <span>📊 ${percentual}%</span>
                    <span>⏱️ ${registro.mediaTempo.toFixed(1)}s</span>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                    <button class="history-view-btn" data-id="${registro.id}">Ver Detalhes</button>
                    ${ehRecente ? `
                        <button class="history-recover-btn" 
                                data-nivel-original="${registro.nivel}" 
                                data-nivel-jogar="${nivelParaJogar}"
                                data-aluno='${JSON.stringify(registro.aluno)}'
                                data-modo="${registro.modo || 'normal'}"
                                data-venceu="${registro.acertos === registro.total}"
                                style="background: #28a745; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                            ${textoBotao}
                        </button>
                    ` : ''}
                </div>
            `;
            
            elements.historyList.appendChild(item);
        });
        
        document.querySelectorAll('.history-recover-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nivelJogar = parseInt(e.target.dataset.nivelJogar);
                const aluno = JSON.parse(e.target.dataset.aluno);
                
                alunoAno = aluno.ano;
                alunoLetra = aluno.letra;
                alunoNumero = aluno.numero;
                
                const anoDisplay = document.getElementById('aluno-ano-display');
                const letraDisplay = document.getElementById('aluno-letra-display');
                const numeroDisplay = document.getElementById('aluno-numero-display');
                const alunoInfo = document.getElementById('aluno-info');
                
                if (anoDisplay) anoDisplay.textContent = alunoAno;
                if (letraDisplay) letraDisplay.textContent = alunoLetra;
                if (numeroDisplay) numeroDisplay.textContent = alunoNumero;
                if (alunoInfo) alunoInfo.style.display = 'block';
                
                document.querySelectorAll('.ano-btn').forEach(btn => {
                    if (btn.dataset.ano === alunoAno) btn.classList.add('selected');
                });
                document.querySelectorAll('.letra-btn').forEach(btn => {
                    if (btn.dataset.letra === alunoLetra) btn.classList.add('selected');
                });
                document.querySelectorAll('.numero-btn').forEach(btn => {
                    if (btn.dataset.numero === alunoNumero) btn.classList.add('selected');
                });
                
                nivelConfigurado = nivelJogar;
                currentLevel = nivelJogar;
                
                const hoje = new Date().toDateString();
                const estado = {
                    currentLevel: nivelJogar,
                    data: hoje,
                    timestamp: Date.now()
                };
                localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
                
                elements.historyScreen.classList.add('hidden');
                elements.welcomeScreen.classList.remove('hidden');
                
                atualizarModoPelosCheckboxes();
                
                setTimeout(() => startGame(), 100);
            });
        });
        
        document.querySelectorAll('.history-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const registro = historico.find(r => r.id === id);
                if (registro) {
                    questionStats = registro.stats;
                    currentLevel = registro.nivel;
                    elements.historyScreen.classList.add('hidden');
                    mostrarEstatisticasAtuais('history');
                    
                    const info = document.createElement('div');
                    info.className = 'aluno-info';
                    info.style.margin = '10px 0 20px';
                    info.innerHTML = `👤 Aluno: ${registro.aluno.ano}${registro.aluno.letra} - N° ${registro.aluno.numero} | ${registro.data} | Modo: ${registro.modo || 'normal'}`;
                    if (elements.statsList) {
                        elements.statsList.insertBefore(info, elements.statsList.firstChild);
                    }
                }
            });
        });
    }
}

function limparHistorico() {
    if (confirm('Tem certeza que deseja limpar TODO o histórico?')) {
        localStorage.removeItem(STATS_KEY);
        mostrarHistoricoDaSessao();
    }
}

// ============================================
// FUNÇÕES PRINCIPAIS DO JOGO
// ============================================
function startGame() {
    if (!alunoAno || !alunoLetra || !alunoNumero) {
        alert('⚠️ Identifique-se primeiro: Ano → Turma → Número da Chamada');
        return;
    }
    
    limparTimer();
    
    const nivelSalvo = verificarJogoSalvo();
    if (nivelSalvo) {
        if (confirm(`🎮 Continuar nível ${nivelSalvo}?`)) {
            iniciarJogoNoNivel(nivelSalvo);
            return;
        } else {
            nivelConfigurado = 1;
            currentLevel = 1;
        }
    }
    
    gameActive = true;
    abaTrocada = false;
    iniciarNovasEstatisticas();
    
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    if (elements.vpequacoesBtn) elements.vpequacoesBtn.classList.remove('hidden');
    
    const config = getConfigNivel(nivelConfigurado);
    currentLevel = nivelConfigurado;
    totalQuestions = config.totalCards;
    timeLimit = config.timeLimit;
    score = 0;
    remainingEquations = totalQuestions;
    remainingTime = timeLimit;
    
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingEquations;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    
    if (elements.timeElement) {
        elements.timeElement.style.opacity = hideTimerText ? '0' : '1';
    }
    if (elements.timerContainer) {
        if (hideTimerBar) {
            elements.timerContainer.classList.add('timer-hidden');
        } else {
            elements.timerContainer.classList.remove('timer-hidden');
        }
    }
    
    updateLevelInfo();
    generateEquation();
    startTimer();
    
    salvarEstadoJogo();
}

function reiniciarJogo() {
    limparTimer();
    gameActive = false;
    startGame();
}

function limparTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimeDisplay() {
    if (elements.timeElement) {
        elements.timeElement.textContent = `${remainingTime.toFixed(1)}s`;
    }
}

function nextLevel() {
    if (currentLevel < 5) {
        currentLevel++;
        nivelConfigurado = currentLevel;
        startGame();
    } else {
        alert('🎉 Parabéns! Você completou todos os níveis!');
        retornarParaEquacoes();
    }
}

function updateLevelInfo() {
    const config = levelConfigs[currentLevel];
    if (elements.levelDisplay) elements.levelDisplay.textContent = currentLevel;
    const modoTexto = modoDificuldade !== 'normal' ? ` [${getModoDescricao()}]` : '';
    if (elements.levelDescription) {
        elements.levelDescription.textContent = `Nível ${currentLevel}: ${config.description}${modoTexto}`;
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
    if (elements.timerProgress) {
        elements.timerProgress.style.width = `${percentage}%`;
        if (percentage <= 25) elements.timerProgress.style.backgroundColor = '#dc3545';
        else if (percentage <= 50) elements.timerProgress.style.backgroundColor = '#ffc107';
        else elements.timerProgress.style.backgroundColor = '#20c997';
    }
}

function generateEquation() {
    let equation = "";
    let solution = 0;
    
    switch(currentLevel) {
        case 1:
            // x + a = b ou x - a = b
            if (Math.random() > 0.5) {
                let a = Math.floor(Math.random() * 15) + 1;
                let b = Math.floor(Math.random() * 20) - 5;
                equation = `x + ${a} = ${b}`;
                solution = b - a;
            } else {
                let a = Math.floor(Math.random() * 15) + 1;
                let b = Math.floor(Math.random() * 20) - 5;
                equation = `x - ${a} = ${b}`;
                solution = b + a;
            }
            break;
            
        case 2:
            // a*x = b
            let a = Math.floor(Math.random() * 8) + 2;
            let b = a * (Math.floor(Math.random() * 15) - 5);
            equation = `${a}x = ${b}`;
            solution = b / a;
            break;
            
        case 3:
            // a*x + b = c ou a*x - b = c
            if (Math.random() > 0.5) {
                let a = Math.floor(Math.random() * 5) + 2;
                let b = Math.floor(Math.random() * 10) + 1;
                let c = a * (Math.floor(Math.random() * 10) - 3) + b;
                equation = `${a}x + ${b} = ${c}`;
                solution = (c - b) / a;
            } else {
                let a = Math.floor(Math.random() * 5) + 2;
                let b = Math.floor(Math.random() * 10) + 1;
                let c = a * (Math.floor(Math.random() * 10) - 3) - b;
                equation = `${a}x - ${b} = ${c}`;
                solution = (c + b) / a;
            }
            break;
            
        case 4:
            // Variáveis em ambos os lados
            const type = Math.floor(Math.random() * 3);
            if (type === 0) {
                let a = Math.floor(Math.random() * 15) - 2;
                let b = Math.floor(Math.random() * 10) + 1;
                equation = `${a} = x + ${b}`;
                solution = a - b;
            } else if (type === 1) {
                let a = Math.floor(Math.random() * 5) + 2;
                let b = a * (Math.floor(Math.random() * 10) - 3);
                equation = `-${a}x = ${b}`;
                solution = -b / a;
            } else {
                let a = Math.floor(Math.random() * 20) - 5;
                let b = Math.floor(Math.random() * 4) + 2;
                let c = Math.floor(Math.random() * 8) + 1;
                equation = `${a} = ${b}x - ${c}`;
                solution = (a + c) / b;
            }
            break;
            
        case 5:
            if (Math.random() > 0.5) {
                // Coeficiente fracionário
                let num, den;
                do {
                    num = Math.floor(Math.random() * 8) + 2;
                    den = Math.floor(Math.random() * 8) + 2;
                } while (num === den);
                
                let c = Math.floor(Math.random() * 12) + 1;
                equation = `(${num}/${den})x = ${c}`;
                solution = (c * den) / num;
            } else {
                // Coeficiente decimal
                const decimais = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9];
                const decimal = decimais[Math.floor(Math.random() * decimais.length)];
                const c = Math.floor(Math.random() * 15) + 1;
                equation = `${decimal}x = ${c}`;
                solution = c / decimal;
            }
            break;
    }
    
    currentEquation = equation;
    correctAnswer = solution;
    
    if (elements.equationDisplay) {
        elements.equationDisplay.textContent = equation;
    }
    generateOptions();
    iniciarTempoQuestao();
}

function generateOptions() {
    if (!elements.optionsContainer) return;
    
    elements.optionsContainer.innerHTML = '';
    
    let valorCorreto = correctAnswer;
    let options = [valorCorreto];
    
    // Gerar opções variadas
    const offsets = [-3, -2, -1, 1, 2, 3];
    let opcoesGeradas = 0;
    
    for (let offset of offsets) {
        if (opcoesGeradas >= 5) break;
        
        let option;
        if (Number.isInteger(valorCorreto)) {
            option = valorCorreto + offset;
        } else {
            let optionValue = valorCorreto + (offset * 0.5);
            optionValue = Math.round(optionValue * 100) / 100;
            option = optionValue;
        }
        
        if (option !== valorCorreto && !options.includes(option)) {
            options.push(option);
            opcoesGeradas++;
        }
    }
    
    // Se não tiver opções suficientes, usar multiplicadores
    let multiplicador = 2;
    while (options.length < 6 && multiplicador <= 10) {
        let option;
        if (Number.isInteger(valorCorreto)) {
            option = valorCorreto + multiplicador;
        } else {
            let optionValue = valorCorreto + (multiplicador * 0.3);
            optionValue = Math.round(optionValue * 100) / 100;
            option = optionValue;
        }
        
        if (option !== valorCorreto && !options.includes(option)) {
            options.push(option);
        }
        multiplicador++;
    }
    
    // Fallback
    const fallbacks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    while (options.length < 6) {
        let fallback = parseFloat(fallbacks[options.length % fallbacks.length]);
        if (fallback !== valorCorreto && !options.includes(fallback)) {
            options.push(fallback);
        }
    }
    
    // Embaralhar
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
    
    const userAnswer = parseFloat(answerText);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    
    desabilitarOpcoes(elements.optionsContainer);
    registrarResposta(isCorrect, currentEquation, correctAnswer);
    
    if (isCorrect) {
        score++;
        remainingEquations--;
        elements.scoreElement.textContent = `${score}/${totalQuestions}`;
        remainingTime = Math.min(timeLimit, remainingTime + 2.5);
    } else {
        remainingTime = Math.max(0.1, remainingTime - 2);
    }
    
    elements.deck.querySelector('div').textContent = remainingEquations;
    remainingTime = Math.round(remainingTime * 10) / 10;
    updateTimeDisplay();
    atualizarTimerVisual((remainingTime / timeLimit) * 100);
    
    if (score >= totalQuestions || remainingEquations <= 0 || remainingTime <= 0.1) {
        setTimeout(() => { limparTimer(); endGame(); }, 800);
        return;
    }
    
    setTimeout(() => { if (gameActive) generateEquation(); }, 800);
}

function desabilitarOpcoes(container) {
    if (!container) return;
    container.querySelectorAll('.option').forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function endGame() {
    gameActive = false;
    limparTimer();
    salvarEstatisticas();
    
    if (score >= totalQuestions || remainingTime <= 0.1) localStorage.removeItem(SAVE_KEY);
    
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.add('hidden');
    if (elements.vpequacoesBtn) elements.vpequacoesBtn.classList.add('hidden');
    
    const venceu = score >= totalQuestions;
    if (venceu) {
        elements.resultMessage.textContent = '🎉 Parabéns! 🎉';
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} equações!`;
    } else {
        elements.resultMessage.textContent = '⏰ Tempo esgotado! ⏰';
        elements.resultStats.textContent = `Você acertou ${score} de ${totalQuestions} equações.`;
    }
    
    if (elements.nextLevelBtn) {
        elements.nextLevelBtn.style.display = venceu && currentLevel < 5 ? 'block' : 'none';
    }
    if (elements.viewLevelStats) {
        elements.viewLevelStats.style.display = questionStats.length > 0 ? 'inline-block' : 'none';
    }
}

// ============================================
// FUNÇÕES DE VISIBILIDADE E SALVAMENTO
// ============================================
function setupVisibilityDetection() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', () => handleVisibilityChangeHidden());
    window.addEventListener('focus', () => handleVisibilityChangeVisible());
    window.addEventListener('pagehide', () => handleVisibilityChangeHidden());
    window.addEventListener('pageshow', (event) => { if (event.persisted) handleVisibilityChangeVisible(); });
}

function handleVisibilityChange() {
    if (document.hidden) handleVisibilityChangeHidden();
    else handleVisibilityChangeVisible();
}

function handleVisibilityChangeHidden() {
    if (!gameActive) return;
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
    iniciarNovasEstatisticas();
    abaTrocada = false;
    
    const config = getConfigNivel(currentLevel);
    totalQuestions = config.totalCards;
    timeLimit = config.timeLimit;
    score = 0;
    remainingEquations = totalQuestions;
    remainingTime = timeLimit;
    
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingEquations;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    
    if (elements.timeElement) {
        elements.timeElement.style.opacity = hideTimerText ? '0' : '1';
    }
    if (elements.timerContainer) {
        if (hideTimerBar) {
            elements.timerContainer.classList.add('timer-hidden');
        } else {
            elements.timerContainer.classList.remove('timer-hidden');
        }
    }
    
    updateLevelInfo();
    generateEquation();
    startTimer();
}

function salvarEstadoJogo() {
    if (!gameActive) return;
    const estado = {
        currentLevel: currentLevel,
        data: new Date().toDateString(),
        timestamp: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
}

function verificarJogoSalvo() {
    const savedState = localStorage.getItem(SAVE_KEY);
    if (!savedState) return false;
    try {
        const estado = JSON.parse(savedState);
        if (estado.data === new Date().toDateString()) {
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
    iniciarNovasEstatisticas();
    
    elements.welcomeScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.remove('hidden');
    if (elements.vpequacoesBtn) elements.vpequacoesBtn.classList.remove('hidden');
    
    const config = getConfigNivel(nivel);
    currentLevel = nivel;
    nivelConfigurado = nivel;
    totalQuestions = config.totalCards;
    timeLimit = config.timeLimit;
    score = 0;
    remainingEquations = totalQuestions;
    remainingTime = timeLimit;
    
    elements.scoreElement.textContent = `${score}/${totalQuestions}`;
    elements.deck.querySelector('div').textContent = remainingEquations;
    updateTimeDisplay();
    elements.timerProgress.style.width = '100%';
    elements.timerProgress.style.backgroundColor = '#20c997';
    
    if (elements.timeElement) {
        elements.timeElement.style.opacity = hideTimerText ? '0' : '1';
    }
    if (elements.timerContainer) {
        if (hideTimerBar) {
            elements.timerContainer.classList.add('timer-hidden');
        } else {
            elements.timerContainer.classList.remove('timer-hidden');
        }
    }
    
    updateLevelInfo();
    generateEquation();
    startTimer();
    salvarEstadoJogo();
}

function retornarParaEquacoes() {
    gameActive = false;
    limparTimer();
    elements.gameScreen.classList.add('hidden');
    elements.resultScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');
    elements.historyScreen.classList.add('hidden');
    elements.welcomeScreen.classList.remove('hidden');
    if (elements.restartBtn) elements.restartBtn.classList.add('hidden');
    if (elements.vpequacoesBtn) elements.vpequacoesBtn.classList.add('hidden');
}

// ============================================
// FUNÇÕES DE CONFIGURAÇÃO
// ============================================
function abrirModalSenha() {
    if (elements.passwordModal) elements.passwordModal.classList.remove('hidden');
    if (elements.passwordInput) {
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
    }
}

function fecharModalSenha() {
    if (elements.passwordModal) elements.passwordModal.classList.add('hidden');
}

function fecharModalConfig() {
    if (elements.configModal) elements.configModal.classList.add('hidden');
}

function verificarSenha() {
    const senhaDigitada = elements.passwordInput ? elements.passwordInput.value : '';
    const hoje = new Date();
    const d = hoje.getDate().toString().padStart(2, '0');
    if (senhaDigitada === "52" + d + "60") {
        fecharModalSenha();
        abrirModalConfig();
    } else {
        alert('❌ Senha incorreta!');
        if (elements.passwordInput) {
            elements.passwordInput.value = '';
            elements.passwordInput.focus();
        }
    }
}

function abrirModalConfig() {
    if (elements.timeInput) elements.timeInput.value = tempoConfigurado;
    
    document.querySelectorAll('.level-btn').forEach(btn => {
        if (parseInt(btn.dataset.level) === nivelConfigurado) btn.classList.add('selected');
        else btn.classList.remove('selected');
    });
    
    if (elements.configModal) elements.configModal.classList.remove('hidden');
}

function aplicarConfiguracoes() {
    const nivelSelecionadoElem = document.querySelector('.level-btn.selected');
    const nivelSelecionado = nivelSelecionadoElem ? parseInt(nivelSelecionadoElem.dataset.level) : nivelConfigurado;
    const tempoSelecionado = elements.timeInput ? parseInt(elements.timeInput.value) || 40 : 40;
    
    nivelConfigurado = nivelSelecionado;
    currentLevel = nivelSelecionado;
    tempoConfigurado = tempoSelecionado;
    baseTimeLimit = tempoSelecionado;
    
    const hoje = new Date().toDateString();
    const estado = {
        currentLevel: nivelSelecionado,
        data: hoje,
        timestamp: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));
    
    if (elements.selectedLevel) elements.selectedLevel.textContent = nivelSelecionado;
    if (elements.selectedTime) elements.selectedTime.textContent = tempoSelecionado;
    if (elements.configIndicator) elements.configIndicator.style.display = 'block';
    
    alert(`✅ Configurações aplicadas: Nível ${nivelSelecionado} | Tempo ${tempoSelecionado}s`);
    fecharModalConfig();
}

window.addEventListener('beforeunload', () => { if (gameActive) salvarEstadoJogo(); });

// Inicializar o jogo
init();
</script>
</body>
</html>
