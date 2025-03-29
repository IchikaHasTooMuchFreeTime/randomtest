
let problems = JSON.parse(localStorage.getItem('problems')) || [
    {
        id: '1',
        title: 'Example Problem',
        description: 'This is an example problem to demonstrate the functionality.',
        solution: 'This is the example solution. Edit or add new problems when logged in.',
        filename: 'example-problem.html'
    }
];


const problemsContainer = document.getElementById('problems-container');
const addProblemBtn = document.getElementById('add-problem-btn');
const addProblemModal = document.getElementById('add-problem-modal');
const addProblemForm = document.getElementById('add-problem-form');
const closeAddModal = addProblemModal.querySelector('.close');


function displayProblems() {
    problemsContainer.innerHTML = '';
    
    problems.forEach(problem => {
        const problemCard = document.createElement('div');
        problemCard.className = 'problem-card';
        
        problemCard.innerHTML = `
            <h3>${problem.title}</h3>
            <p>${problem.description}</p>
            <button class="view-btn" onclick="viewProblem('${problem.filename}')">View Solution</button>
            ${isAuthenticated ? `<button class="edit-btn" onclick="editProblem('${problem.id}')">Edit</button>
            <button class="delete-btn" onclick="deleteProblem('${problem.id}')">Delete</button>` : ''}
        `;
        
        problemsContainer.appendChild(problemCard);
    });
}


function viewProblem(filename) {
    window.open(`problems/${filename}`, '_blank');
}


addProblemBtn.addEventListener('click', () => {
    if (isAuthenticated) {
        addProblemModal.classList.remove('hidden');
    }
});

closeAddModal.addEventListener('click', () => {
    addProblemModal.classList.add('hidden');
});

addProblemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('problem-title').value;
    const description = document.getElementById('problem-description').value;
    const solution = document.getElementById('problem-solution').value;
    
    const newProblem = {
        id: Date.now().toString(),
        title,
        description,
        solution,
        filename: `problem-${Date.now()}.html`
    };
    
    problems.push(newProblem);
    saveProblems();
    createProblemPage(newProblem);
    
    addProblemForm.reset();
    addProblemModal.classList.add('hidden');
    displayProblems();
});


function editProblem(id) {
    const problem = problems.find(p => p.id === id);
    if (!problem) return;
    
    const newTitle = prompt('Enter new title:', problem.title);
    if (newTitle !== null) problem.title = newTitle;
    
    const newDescription = prompt('Enter new description:', problem.description);
    if (newDescription !== null) problem.description = newDescription;
    
    const newSolution = prompt('Enter new solution:', problem.solution);
    if (newSolution !== null) problem.solution = newSolution;
    
    saveProblems();
    createProblemPage(problem); 
    displayProblems();
}


function deleteProblem(id) {
    if (confirm('Are you sure you want to delete this problem?')) {
        problems = problems.filter(p => p.id !== id);
        saveProblems();
        displayProblems();
    }
}


function saveProblems() {
    localStorage.setItem('problems', JSON.stringify(problems));
}


function createProblemPage(problem) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${problem.title} - Solution</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${problem.title}</h1>
            <a href="../index.html" class="back-btn">Back to Problems</a>
        </header>

        <main>
            <section class="problem-solution">
                <h2>Description</h2>
                <p>${problem.description}</p>
                
                <h2>Solution</h2>
                <div class="solution-content">${problem.solution.replace(/\n/g, '<br>')}</div>
            </section>
        </main>

        <footer>
            <p>&copy; 2023 Problem Solutions. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
    `;
    

    localStorage.setItem(`problem_${problem.id}_html`, htmlContent);
    

    console.log(`Created problem page: problems/${problem.filename}`);
}


document.addEventListener('DOMContentLoaded', () => {
    displayProblems();
    

    if (!localStorage.getItem('problems_dir')) {
        localStorage.setItem('problems_dir', '{}');
    }
    

    const exampleProblem = problems.find(p => p.id === '1');
    if (exampleProblem && !localStorage.getItem(`problem_1_html`)) {
        createProblemPage(exampleProblem);
    }
});


window.addEventListener('click', (e) => {
    if (e.target === addProblemModal) {
        addProblemModal.classList.add('hidden');
    }
});
