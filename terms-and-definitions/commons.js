
// Função para carregar os arquivos JSON no dropdown
function loadFileList(element) {
  const files = [
      { name: "../data/chess.json", label: "Xadrez" },
      // { name: "../data/ing-family.json", label: "Palavras -ing" },
      { name: "../data/actions.json", label: "Ações" },
      { name: "../data/ing-family-short.json", label: "Palavras -ing" },

  ];

  files.forEach(file => {
      const option = document.createElement("option");
      option.value = file.name;
      option.textContent = file.label;
      element.appendChild(option);
  });
}

let timerSeconds = 0;
let timer;

// Função para iniciar o cronômetro
function startTimer(element) {
  timer = setInterval(() => {
      timerSeconds++;
      const minutes = Math.floor(timerSeconds / 60);
      const seconds = timerSeconds % 60;
      // 
      element.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer); // Limpar o temporizador anterior
  timerSeconds = 0;
}
