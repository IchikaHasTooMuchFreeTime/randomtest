
let repositoryData = {
    categories: []
};


const categoryList = document.getElementById('categoryList');
const solutionsList = document.getElementById('solutionsList');
const solutionContent = document.getElementById('solutionContent');
const welcomeView = document.getElementById('welcomeView');
const categoryView = document.getElementById('categoryView');
const solutionView = document.getElementById('solutionView');
const editView = document.getElementById('editView');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const addSolutionBtn = document.getElementById('addSolutionBtn');
const editCategoryBtn = document.getElementById('editCategoryBtn');
const editSolutionBtn = document.getElementById('editSolutionBtn');
const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');
const deleteSolutionBtn = document.getElementById('deleteSolutionBtn');
const backToCategoryBtn = document.getElementById('backToCategoryBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryCount = document.getElementById('categoryCount');
const solutionCount = document.getElementById('solutionCount');
const currentCategoryTitle = document.getElementById('currentCategoryTitle');
const currentSolutionTitle = document.getElementById('currentSolutionTitle');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editContent = document.getElementById('editContent');
const editTags = document.getElementById('editTags');
const editForm = document.getElementById('editForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const addCategoryForm = document.getElementById('addCategoryForm');
const categoryName = document.getElementById('categoryName');
const categoryDescription = document.getElementById('categoryDescription');
const addCategoryModal = document.getElementById('addCategoryModal');
const closeModal = document.querySelector('.close-modal');
const confirmModal = document.getElementById('confirmModal');
const confirmModalTitle = document.getElementById('confirmModalTitle');
const confirmModalMessage = document.getElementById('confirmModalMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmActionBtn = document.getElementById('confirmActionBtn');


let currentCategoryId = null;
let currentSolutionId = null;
let currentEditMode = null; 

function init() {
    loadData();
    renderCategories();
    updateStats();
    setupEventListeners();
}


function loadData() {
    const savedData = localStorage.getItem('solutionRepository');
    if (savedData) {
        repositoryData = JSON.parse(savedData);
    } else {

        repositoryData = {
            categories: [
                {
                    id: 'sample-1',
                    name: 'JavaScript',
                    description: 'Solutions for JavaScript problems',
                    solutions: [
                        {
                            id: 'sample-sol-1',
                            title: 'Array manipulation',
                            description: 'Common array operations in JavaScript',
                            content: 'Here are some common array operations:\n\n1. map(): Creates a new array with the results of calling a function on every element\n2. filter(): Creates a new array with elements that pass a test\n3. reduce(): Reduces the array to a single value',
                            tags: ['arrays', 'methods']
                        },
                        {
                            id: 'sample-sol-2',
                            title: 'Promises',
                            description: 'Working with asynchronous code',
                            content: 'Promises in JavaScript:\n\nA Promise is an object representing the eventual completion or failure of an asynchronous operation.\n\nBasic syntax:\n\nconst myPromise = new Promise((resolve, reject) => {\n  // asynchronous operation here\n  if (success) {\n    resolve(value);\n  } else {\n    reject(error);\n  }\n});',
                            tags: ['async', 'es6']
                        }
                    ]
                },
                {
                    id: 'sample-2',
                    name: 'CSS',
                    description: 'CSS solutions and tricks',
                    solutions: [
                        {
                            id: 'sample-sol-3',
                            title: 'Centering elements',
                            description: 'Different ways to center elements in CSS',
                            content: 'Centering techniques:\n\n1. Horizontal centering with margin: 0 auto;\n2. Flexbox centering:\n   .container {\n     display: flex;\n     justify-content: center;\n     align-items: center;\n   }\n3. Grid centering:\n   .container {\n     display: grid;\n     place-items: center;\n   }',
                            tags: ['layout', 'flexbox', 'grid']
                        }
                    ]
                }
            ]
        };
        saveData();
    }
}


function saveData() {
    localStorage.setItem('solutionRepository', JSON.stringify(repositoryData));
    updateStats();
}


function updateStats() {
    const totalCategories = repositoryData.categories.length;
    const totalSolutions = repositoryData.categories.reduce((total, category) => {
        return total + category.solutions.length;
    }, 0);
    
    categoryCount.textContent = totalCategories;
    solutionCount.textContent = totalSolutions;
}


function renderCategories() {
    categoryList.innerHTML = '';
    
    repositoryData.categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name;
        li.dataset.id = category.id;
        li.addEventListener('click', () => showCategory(category.id));
        categoryList.appendChild(li);
    });
}


function showCategory(categoryId) {
    const category = repositoryData.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    currentCategoryId = categoryId;
    currentSolutionId = null;
    
    welcomeView.classList.add('hidden');
    categoryView.classList.remove('hidden');
    solutionView.classList.add('hidden');
    editView.classList.add('hidden');
    
    currentCategoryTitle.textContent = category.name;
    renderSolutions(category.solutions);
    

    document.querySelectorAll('#categoryList li').forEach(li => {
        li.classList.toggle('active', li.dataset.id === categoryId);
    });
}


function renderSolutions(solutions) {
    solutionsList.innerHTML = '';
    
    if (solutions.length === 0) {
        solutionsList.innerHTML = '<p>No solutions yet. Click "Add Solution" to create one.</p>';
        return;
    }
    
    solutions.forEach(solution => {
        const solutionCard = document.createElement('div');
        solutionCard.className = 'solution-card';
        solutionCard.dataset.id = solution.id;
        
        solutionCard.innerHTML = `
            <h3>${solution.title}</h3>
            <p>${solution.description || 'No description'}</p>
            <div class="tags">
                ${solution.tags ? solution.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
        `;
        
        solutionCard.addEventListener('click', () => showSolution(solution.id));
        solutionsList.appendChild(solutionCard);
    });
}


function showSolution(solutionId) {
    const category = repositoryData.categories.find(c => c.id === currentCategoryId);
    if (!category) return;
    
    const solution = category.solutions.find(s => s.id === solutionId);
    if (!solution) return;
    
    currentSolutionId = solutionId;
    
    categoryView.classList.add('hidden');
    solutionView.classList.remove('hidden');
    editView.classList.add('hidden');
    
    currentSolutionTitle.textContent = solution.title;
    solutionContent.textContent = solution.content;
}


function showEditView(type, id) {
    currentEditMode = type;
    editViewTitle.textContent = type === 'category' ? 'Edit Category' : 'Edit Solution';
    
    if (type === 'category') {
        const category = repositoryData.categories.find(c => c.id === id);
        if (!category) return;
        
        editTitle.value = category.name;
        editDescription.value = category.description || '';
        editContent.value = '';
        editTags.value = '';
    } else {
        const category = repositoryData.categories.find(c => c.id === currentCategoryId);
        if (!category) return;
        
        const solution = category.solutions.find(s => s.id === id);
        if (!solution) return;
        
        editTitle.value = solution.title;
        editDescription.value = solution.description || '';
        editContent.value = solution.content;
        editTags.value = solution.tags ? solution.tags.join(', ') : '';
    }
    
    categoryView.classList.add('hidden');
    solutionView.classList.add('hidden');
    editView.classList.remove('hidden');
}


function saveEdits() {
    if (currentEditMode === 'category') {
        const category = repositoryData.categories.find(c => c.id === currentCategoryId);
        if (!category) return;
        
        category.name = editTitle.value;
        category.description = editDescription.value;
    } else {
        const category = repositoryData.categories.find(c => c.id === currentCategoryId);
        if (!category) return;
        
        const solution = category.solutions.find(s => s.id === currentSolutionId);
        if (!solution) return;
        
        solution.title = editTitle.value;
        solution.description = editDescription.value;
        solution.content = editContent.value;
        solution.tags = editTags.value ? editTags.value.split(',').map(tag => tag.trim()) : [];
    }
    
    saveData();
    
    if (currentEditMode === 'category') {
        renderCategories();
        showCategory(currentCategoryId);
    } else {
        showSolution(currentSolutionId);
    }
}


function addCategory(name, description) {
    const newCategory = {
        id: 'cat-' + Date.now(),
        name: name,
        description: description,
        solutions: []
    };
    
    repositoryData.categories.push(newCategory);
    saveData();
    renderCategories();
    showCategory(newCategory.id);
    hideModal(addCategoryModal);
}


function addSolution(title, description, content, tags) {
    const category = repositoryData.categories.find(c => c.id === currentCategoryId);
    if (!category) return;
    
    const newSolution = {
        id: 'sol-' + Date.now(),
        title: title,
        description: description,
        content: content,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };
    
    category.solutions.push(newSolution);
    saveData();
    showSolution(newSolution.id);
}


function deleteCurrentCategory() {
    repositoryData.categories = repositoryData.categories.filter(c => c.id !== currentCategoryId);
    saveData();
    renderCategories();
    showWelcomeView();
}


function deleteCurrentSolution() {
    const category = repositoryData.categories.find(c => c.id === currentCategoryId);
    if (!category) return;
    
    category.solutions = category.solutions.filter(s => s.id !== currentSolutionId);
    saveData();
    showCategory(currentCategoryId);
}


function showWelcomeView() {
    currentCategoryId = null;
    currentSolutionId = null;
    
    welcomeView.classList.remove('hidden');
    categoryView.classList.add('hidden');
    solutionView.classList.add('hidden');
    editView.classList.add('hidden');
    

    document.querySelectorAll('#categoryList li').forEach(li => {
        li.classList.remove('active');
    });
}


function showModal(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('show');
}


function hideModal(modal) {
    modal.classList.remove('show');
    modal.classList.add('hidden');
}


function setupEventListeners() {

    addCategoryBtn.addEventListener('click', () => showModal(addCategoryModal));
    addSolutionBtn.addEventListener('click', () => showEditView('solution', 'new'));
    editCategoryBtn.addEventListener('click', () => showEditView('category', currentCategoryId));
    editSolutionBtn.addEventListener('click', () => showEditView('solution', currentSolutionId));
    deleteCategoryBtn.addEventListener('click', () => {
        confirmModalTitle.textContent = 'Delete Category';
        confirmModalMessage.textContent = 'Are you sure you want to delete this category and all its solutions?';
        confirmActionBtn.onclick = deleteCurrentCategory;
        showModal(confirmModal);
    });
    deleteSolutionBtn.addEventListener('click', () => {
        confirmModalTitle.textContent = 'Delete Solution';
        confirmModalMessage.textContent = 'Are you sure you want to delete this solution?';
        confirmActionBtn.onclick = deleteCurrentSolution;
        showModal(confirmModal);
    });
    backToCategoryBtn.addEventListener('click', () => showCategory(currentCategoryId));
    cancelEditBtn.addEventListener('click', () => {
        if (currentSolutionId) {
            showSolution(currentSolutionId);
        } else {
            showCategory(currentCategoryId);
        }
    });
    

    addCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addCategory(categoryName.value, categoryDescription.value);
        categoryName.value = '';
        categoryDescription.value = '';
    });
    
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEdits();
    });
    

    closeModal.addEventListener('click', () => hideModal(addCategoryModal));
    confirmCancelBtn.addEventListener('click', () => hideModal(confirmModal));
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === addCategoryModal) {
            hideModal(addCategoryModal);
        }
        if (e.target === confirmModal) {
            hideModal(confirmModal);
        }
    });
    

    searchBtn.addEventListener('click', searchSolutions);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchSolutions();
        }
    });
}


function searchSolutions() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;
    
    const results = [];
    
    repositoryData.categories.forEach(category => {
        category.solutions.forEach(solution => {
            if (solution.title.toLowerCase().includes(query) || 
                solution.description.toLowerCase().includes(query) || 
                solution.content.toLowerCase().includes(query) ||
                (solution.tags && solution.tags.some(tag => tag.toLowerCase().includes(query)))) {
                results.push({
                    categoryId: category.id,
                    categoryName: category.name,
                    solution: solution
                });
            }
        });
    });
    
    if (results.length === 0) {
        solutionsList.innerHTML = '<p>No solutions found matching your search.</p>';
    } else {
        solutionsList.innerHTML = '';
        results.forEach(result => {
            const solutionCard = document.createElement('div');
            solutionCard.className = 'solution-card';
            solutionCard.dataset.id = result.solution.id;
            
            solutionCard.innerHTML = `
                <h3>${result.solution.title}</h3>
                <p><strong>Category:</strong> ${result.categoryName}</p>
                <p>${result.solution.description || 'No description'}</p>
                <div class="tags">
                    ${result.solution.tags ? result.solution.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            `;
            
            solutionCard.addEventListener('click', () => {
                showCategory(result.categoryId);
                setTimeout(() => showSolution(result.solution.id), 0);
            });
            
            solutionsList.appendChild(solutionCard);
        });
    }
    
    welcomeView.classList.add('hidden');
    categoryView.classList.remove('hidden');
    solutionView.classList.add('hidden');
    editView.classList.add('hidden');
    
    currentCategoryTitle.textContent = `Search Results for "${query}"`;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
