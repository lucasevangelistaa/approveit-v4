const restartBtn = document.getElementById("restart-btn")
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const gameBoard = document.getElementById("game-container");
var fileDropdown = document.getElementById("file-dropdown");

let gameData = [];

document.getElementById('checkAnswers').addEventListener('click', function () {
    const inputs = document.querySelectorAll('input'); // Seleciona todos os inputs no jogo
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
        if (userAnswer === correctAnswer) {
            input.style.borderColor = "green"; // Sinalizar resposta correta
            correctCount++;
        } else {
            input.style.borderColor = "red"; // Sinalizar resposta incorreta
        }
    });

    // Exibir o resultado
    const resultElement = document.getElementById('result');
    if (correctCount === inputs.length) {
        resultElement.textContent = "Parabéns! Todas as respostas estão corretas.";
        resultElement.style.color = "green";
    } else {
        resultElement.textContent = `Você acertou ${correctCount} de ${inputs.length} respostas.`;
        resultElement.style.color = "red";
    }
});


function restartGame() {
    input1.value = "";
    input2.value = "";
    console.log("1")
}

restartBtn.addEventListener("click", restartGame);

// Função para embaralhar os dados
function shuffleData(data) {
    return data.sort(() => Math.random() - 0.5);
}

function createGameBoard() {
    gameBoard.innerHTML = ''; // Limpar tabuleiro anterior
    const gaps = [];

    // Criar cards de termos e definições
    gameData.forEach((item, index) => {
        // gap de Termo
        const gapTerm = createGap(item, "term", index);
        // gap de Definição
        const gapDefinition = createGap(item, "definition", index);

        gaps.push(gapTerm);
        gaps.push(gapDefinition);

        const div = document.createElement("div");
        div.appendChild(gapTerm);
        div.appendChild(gapDefinition);

        gameBoard.appendChild(div);



    });

    // Embaralhar os gaps e adicioná-los ao tabuleiro
    // gaps.forEach(gap => gameBoard.appendChild(gap));
}

// Função para criar um gap
function createGap(item, type, index) {
    const gap = type === "term" ? document.createElement("span") : document.createElement("input");
    gap.classList.add("gap");
    gap.classList.add("input1")
    gap.dataset.index = index;
    gap.dataset.type = type;
    gap.dataset.term = item.term;
    gap.dataset.definition = item.definition;
    gap.textContent = type === "term" ? item.term : "";
    // gap.addEventListener("click", onCardClick);
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
            // totalMatches = gameData.length;
            // matchedCards = 0;
            // errors = 0;
            // gameStarted = false;
            // timeElapsed = 0;
            // timerDisplay.textContent = `00:00`;
            // feedbackDisplay.textContent = '';
            createGameBoard();
        });
}

// Evento para carregar o arquivo selecionado
fileDropdown.addEventListener("change", () => {
    if (fileDropdown.value) {
        loadGameData(fileDropdown.value);
    }
});

loadFileList(fileDropdown);

