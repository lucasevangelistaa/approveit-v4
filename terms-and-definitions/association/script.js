const fileDropdown = document.getElementById("file-dropdown");

const definitionsContainer = document.getElementById('definitions');
const termsContainer = document.getElementById('terms');
const timerDisplay = document.getElementById('timer');
const feedbackDisplay = document.getElementById("feedback");
const restartBtn = document.getElementById("restart-btn");

    // Carregar os sons
    const correctSound = new Audio('../sounds/bell.wav');
    const wrongSound = new Audio('../sounds/caught.wav');
    const endSound = new Audio('../sounds/win.wav');

    // Evento para carregar o arquivo selecionado
    async function loadGameData(selectedFile) {
      const data = await fetchData(selectedFile);
      if (data.length === 0) {
        alert('Failed to load data.');
        return;
      }
  
      // Limpar containers antes de renderizar novos dados
      definitionsContainer.innerHTML = '';
      termsContainer.innerHTML = '';
  
      // Renderizar definições e termos
      renderDefinitionsAndTerms(data);
    }
  
    async function fetchData(file) {
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Failed to load data.');
        return await response.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  
    let startTime; // Armazena o horário de início do jogo
    let endTime; // Armazena o horário de término do jogo
    let correctMatches = 0; // Conta o número de acertos
    let wrongMatches = 0; // Conta o número de erros
    let timerInterval; // Intervalo para atualizar o cronômetro
    let elapsedTime = 0; // Tempo total em segundos

function renderDefinitionsAndTerms(data) {

  
  startTimer(timerDisplay); // Iniciar o cronômetro
  
  // Criar um array de objetos com os pares de termo e definição
  const termsWithDefinitions = data.map((item, index) => ({
    term: item.term,
    definition: item.definition,
    id: index // ID único para cada par termo-definição
  }));

  // Embaralhar os termos e definições separadamente
  const shuffledTerms = shuffleArray(termsWithDefinitions.map(item => item.term));
  const shuffledDefinitions = shuffleArray(termsWithDefinitions.map(item => item.definition));

  // Renderizar as definições embaralhadas
  shuffledDefinitions.forEach((definition, index) => {
    const definitionDiv = document.createElement('div');
    definitionDiv.classList.add('definition');
    definitionDiv.id = `definition-${index}`;
    definitionDiv.textContent = definition;
    definitionsContainer.appendChild(definitionDiv);
  });

  // Renderizar os termos embaralhados
  shuffledTerms.forEach((term, index) => {
    const termDiv = document.createElement('div');
    termDiv.classList.add('term');
    termDiv.setAttribute('draggable', 'true');
    termDiv.setAttribute('id', `term-${index}`);
    
    // Encontrar a definição correta para o termo
    const correctDefinition = termsWithDefinitions.find(item => item.term === term).definition;
    termDiv.dataset.correctDefinition = `definition-${shuffledDefinitions.indexOf(correctDefinition)}`;

    termDiv.textContent = term;
    termsContainer.appendChild(termDiv);
  });

  enableDragAndDrop();
}

// Função para embaralhar um array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function enableDragAndDrop() {
  const definitions = document.querySelectorAll('.definition');
  const terms = document.querySelectorAll('.term');

  terms.forEach(term => {
    term.addEventListener('dragstart', event => {
      event.target.classList.add('dragging');
      event.dataTransfer.setData('termId', event.target.id);
    });

    term.addEventListener('dragend', event => {
      event.target.classList.remove('dragging');
    });
  });

  definitions.forEach(definition => {
    definition.addEventListener('dragover', event => event.preventDefault());

    definition.addEventListener('drop', event => {
      event.preventDefault();
      const termId = event.dataTransfer.getData('termId');
      const term = document.getElementById(termId);

      // Verificar a correspondência
      if (term.dataset.correctDefinition === definition.id) {
        correctMatches++;
        definition.appendChild(term);
        term.setAttribute('draggable', 'false');
        term.style.backgroundColor = '#4CAF50'; // Indicar correspondência correta
        definition.classList.add('correct');

        // Tocar som de acerto
          correctSound.play();
      } else {
        wrongMatches++;
        term.style.backgroundColor = '#f44336'; // Indicar correspondência incorreta
        definition.classList.add('wrong');

        // Tocar som de erro
          wrongSound.play();
      }

      updateFeedback();
      // Verificar se o jogo terminou (todos os termos foram colocados corretamente)
      if (correctMatches === terms.length) {
        endGame();
        alert(`Parabéns! Você terminou o jogo! Acertos: ${correctMatches} | Erros: ${wrongMatches}`);
      }
    });
  });
}
// Função para atualizar o feedback de acertos e erros
function updateFeedback() {
  feedbackDisplay.textContent = `Acertos: ${correctMatches} | Erros: ${wrongMatches}`;
}

// Função para finalizar o jogo
function endGame() {
  resetTimer();
  // Tocar som de fim de jogo
  endSound.play();
  feedbackDisplay.textContent += ` | Tempo final: ${timerDisplay.textContent}`;
  
}

// Função para reiniciar o jogo
function restartGame() {
  correctMatches = 0;
  wrongMatches = 0;
  timerDisplay.textContent = `00:00`;
  resetTimer();
  feedbackDisplay.textContent = '';
  loadGameData(fileDropdown.value);
}

// Evento de reiniciar o jogo
restartBtn.addEventListener("click", restartGame);

document.addEventListener('DOMContentLoaded', () => {
    const dataSelector = document.getElementById('file-select');
    const loadDataButton = document.getElementById('loadData');

    const definitionsContainer = document.getElementById('definitions');
    const termsContainer = document.getElementById('terms');



function showResults() {
    const resultsElement = document.createElement('div');
    resultsElement.classList.add('results');
    resultsElement.innerHTML = `
      <h2>Resultado</h2>
      <p>Acertos: ${correctMatches}</p>
      <p>Erros: ${wrongMatches}</p>
      <p>Tempo: ${Math.floor((endTime - startTime) / 1000)} segundos</p>
    `;
    document.body.appendChild(resultsElement);
}

})

// Evento para carregar o arquivo selecionado
fileDropdown.addEventListener("change", () => {
  if (fileDropdown.value) {
      loadGameData(fileDropdown.value);
  }
});

// Carregar a lista de arquivos ao carregar a página
window.onload = loadFileList(fileDropdown);
