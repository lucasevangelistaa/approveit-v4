// Referências aos elementos do modal
const resultModal = document.getElementById("resultModal");
const closeModal = document.getElementById("closeModal");
const finalScoreElement = document.getElementById("finalScore");
const restartGameButton = document.getElementById("restartGame");

// Mostrar o modal com os resultados
function showResults() {
    // Parar o cronômetro
    clearInterval(timer);

    // Exibir resultados no modal
    finalScoreElement.innerText = `
        Você completou o quiz!
        Pontuação final: ${score} de ${questionData.length}
        Tempo total: ${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, '0')}
    `;

    // Exibir o modal
    resultModal.style.display = "block";
}

// Fechar o modal
closeModal.addEventListener("click", () => {
    resultModal.style.display = "none";
});

// Reiniciar o jogo
restartGameButton.addEventListener("click", () => {
    resultModal.style.display = "none";
    document.getElementById("fileSelect").value = ""; // Resetar seleção do arquivo
    document.getElementById("question").innerText = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("score").innerText = "Pontuação: 0";
    document.getElementById("timer").innerText = "Tempo: 00:00";
    score = 0;
    currentQuestionIndex = 0;
    timerSeconds = 0;
});
