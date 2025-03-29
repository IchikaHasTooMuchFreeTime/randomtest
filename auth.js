
const USER = {
    username: "admin",
    password: "solutions123" 
};

let isAuthenticated = false;


const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const closeModal = document.querySelector('.close');
const addProblemBtn = document.getElementById('add-problem-btn');


loginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
});


closeModal.addEventListener('click', () => {
    loginModal.classList.add('hidden');
    loginError.textContent = '';
});


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === USER.username && password === USER.password) {
        isAuthenticated = true;
        loginModal.classList.add('hidden');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        addProblemBtn.classList.remove('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        loginError.textContent = '';
        

        displayProblems();
    } else {
        loginError.textContent = 'Invalid username or password';
    }
});


logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    addProblemBtn.classList.add('hidden');
    

    displayProblems();
});


window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
        loginError.textContent = '';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        addProblemBtn.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        addProblemBtn.classList.add('hidden');
    }
});
