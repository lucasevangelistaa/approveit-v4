const restartBtn = document.getElementById("restart-btn");
const gameBoard = document.getElementById("game-container");
const fileDropdown = document.getElementById("file-dropdown");
const timerDisplay = document.getElementById("timer");
const resultElement = document.getElementById("result");
let gameData = [];

document.getElementById("checkAnswers").addEventListener("click", () => {
    const inputs = document.querySelectorAll("input"); // Seleciona todos os inputs no jogo
    let correctCount = 0;

    // Iterar pelos inputs e verificar se as respostas estão corretas
    inputs.forEach(input => {
        const index = input.dataset.index; // Índice associado ao termo/definição
        const type = input.dataset.type; // Verificar se é termo ou definição
        const userAnswer = input.value.trim().toLowerCase(); // Resposta do usuário
        const correctAnswer = type === "term" 
            ? gameData[index].term.toLowerCase()
            : gameData[index].definition.toLowerCase();

        // Comparar a resposta do usuário com a resposta correta
        input.style.borderColor = userAnswer === correctAnswer ? "green" : "red";
        if (userAnswer === correctAnswer) correctCount++;
    });

    // Exibir o resultado
    resultElement.textContent = correctCount === inputs.length 
        ? "Parabéns! Todas as respostas estão corretas."
        : `Você acertou ${correctCount} de ${inputs.length} respostas.`;
    resultElement.style.color = correctCount === inputs.length ? "green" : "red";
});


// Função para embaralhar os dados
function shuffleData(data) {
    return data.sort(() => Math.random() - 0.5);
}

function createGameBoard() {
    gameBoard.innerHTML = ""; // Limpar tabuleiro anterior

    // Criar cards de termos e definições
    gameData.forEach((item, index) => {
        const div = document.createElement("div");
        div.appendChild(createGap(item, "term", index));
        div.appendChild(createGap(item, "definition", index));
        gameBoard.appendChild(div);
        // Temporizador
        resetTimer();
        startTimer(timerDisplay);
    });
}

// Função para criar um gap
function createGap(item, type, index) {
    const gap = type === "term" ? document.createElement("span") : document.createElement("input");
    gap.classList.add("gap");
    gap.dataset.index = index;
    gap.dataset.type = type;
    gap.textContent = type === "term" ? item.term : "";
    return gap;
}

// Função para criar os pares únicos de termos e definições
function createUniquePairs(data) {
    const pairs = [];
    
    data.forEach(item => {
        // Criar um par único de termo e definição
        pairs.push({ term: item.term, definition: item.definition });
    });

    // Embaralhar os pares
    return shuffleData(pairs);
}

// Função para carregar os dados do arquivo selecionado
function loadGameData(fileName) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            gameData = createUniquePairs(data);
            createGameBoard();
        });
}

// Evento para carregar o arquivo selecionado
fileDropdown.addEventListener("change", () => {
    if (fileDropdown.value) loadGameData(fileDropdown.value);
});

loadFileList(fileDropdown);