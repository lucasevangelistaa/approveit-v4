let currentQuestionIndex = 0;
let score = 0;

let questionData = [];
let currentTimer = 0;

const correctSound = new Audio("../sounds/bell.wav");
const wrongSound = new Audio("../sounds/caught.wav");
const flipSound = new Audio("../sounds/select.wav");

const fileDropdown = document.getElementById("file-dropdown");

document.getElementById("nextBtn").addEventListener("click", loadNextQuestion);

timerElem = document.getElementById("timer");

// Função para carregar as questões a partir do arquivo selecionado
function loadQuestions() {
    const fileName = fileDropdown.value;

    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            questionData = data;
            score = 0;
            currentQuestionIndex = 0;
            timerSeconds = 0;
            
            resetTimer();
            startTimer(timerElem); // Iniciar o cronômetro
            loadNextQuestion();
        });
}

// Função para carregar a próxima questão
function loadNextQuestion() {
    if (currentQuestionIndex >= questionData.length) {
        resetTimer();
        alert("Você completou o quiz! Pontuação final: " + score);
        return;
    }

    const currentQuestion = questionData[currentQuestionIndex];
    const term = currentQuestion.term;

    // Gerar as opções (definição correta + 3 incorretas)
    const options = generateOptions(currentQuestion);

    document.getElementById("question").innerText = `O que significa "${term}"?`;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    options.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.innerText = option.definition;
        optionElement.onclick = () => checkAnswer(option.definition, currentQuestion.definition);
        optionsContainer.appendChild(optionElement);
    });

    document.getElementById("nextBtn").style.display = "none"; // Esconde o botão até o jogador selecionar uma resposta
}

// Função para gerar opções (1 correta + 3 incorretas)
function generateOptions(currentQuestion) {
    // Criar uma lista de todas as definições, exceto a da questão atual
    const incorrectDefinitions = questionData.filter(q => q.term !== currentQuestion.term)
                                             .map(q => q.definition);

    // Selecionar 3 definições incorretas aleatórias
    const shuffledIncorrect = shuffle(incorrectDefinitions).slice(0, 3);

    // Gerar a lista final de opções (1 correta + 3 incorretas)
    const options = [{
        term: currentQuestion.term,
        definition: currentQuestion.definition
    }, ...shuffledIncorrect.map(definition => ({
        term: "???", // Termo irrelevante para opções incorretas
        definition: definition
    }))];

    return shuffle(options);
}

// Função para verificar se a resposta está correta
function checkAnswer(selectedAnswer, correctAnswer) {
    const feedback = document.getElementById("feedback");
    if (selectedAnswer === correctAnswer) {
        feedback.innerText = "Correto!";
        feedback.style.color = "#4CAF50";
        score++;
        correctSound.play();
    } else {
        feedback.innerText = "Errado! Tente novamente.";
        feedback.style.color = "#f56a79";
        wrongSound.play();
    }

    document.getElementById("score").innerText = `Pontuação: ${score}`;
    document.getElementById("nextBtn").style.display = "block"; // Mostrar o botão "Próxima"
    currentQuestionIndex++;
}

// Função para embaralhar as opções de resposta
function shuffle(array) {
    let currentIndex = array.length, randomIndex, tempValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }

    return array;
}

// Carregar o arquivo JSON selecionado
fileDropdown.addEventListener("change", loadQuestions);

// Carregar a lista de arquivos ao carregar a página
window.onload = loadFileList(fileDropdown);