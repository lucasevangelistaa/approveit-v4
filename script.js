document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories');
    const termsContainer = document.getElementById('terms');
  
    // Dados
    const data = {
      categories: [
        { id: 'fruits', name: 'Fruits' },
        { id: 'animals', name: 'Animals' }
      ],
      terms: [
        { text: 'Apple', category: 'fruits' },
        { text: 'Banana', category: 'fruits' },
        { text: 'Dog', category: 'animals' },
        { text: 'Elephant', category: 'animals' }
      ]
    };
  
    // Renderizar categorias
    data.categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.id = category.id;
      categoryDiv.textContent = category.name;
      categoriesContainer.appendChild(categoryDiv);
    });
  
    // Renderizar termos
    data.terms.forEach((term, index) => {
      const termDiv = document.createElement('div');
      termDiv.classList.add('term');
      termDiv.setAttribute('draggable', 'true');
      termDiv.setAttribute('id', `term-${index}`);
      termDiv.dataset.category = term.category;
      termDiv.textContent = term.text;
      termsContainer.appendChild(termDiv);
    });
  
    // Ativar funcionalidade de drag-and-drop
    enableDragAndDrop();
  });

  function enableDragAndDrop() {
    const categories = document.querySelectorAll('.category');
    const terms = document.querySelectorAll('.term');
  
    terms.forEach(term => {
      term.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text', event.target.dataset.category);
        event.dataTransfer.setData('id', event.target.id);
      });
    });
  
    categories.forEach(category => {
      category.addEventListener('dragover', event => event.preventDefault());
  
      category.addEventListener('drop', event => {
        event.preventDefault();
        const droppedCategory = event.dataTransfer.getData('text');
        const termId = event.dataTransfer.getData('id');
  
        if (droppedCategory === category.id) {
          const term = document.getElementById(termId);
          category.appendChild(term);
          term.setAttribute('draggable', 'false');
          term.style.backgroundColor = 'lightgreen'; // Indicar correto
        } else {
          alert('Wrong category! Try again.');
        }
      });
    });
  }
  