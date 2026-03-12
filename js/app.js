// Greeting and DateTime
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEl = document.getElementById('greetingSmall');
    
    let greeting = 'Good evening,';
    if (hour < 12) greeting = 'Good morning,';
    else if (hour < 18) greeting = 'Good afternoon,';
    
    greetingEl.textContent = greeting;
    
    // Update real-time clock
    updateClock();
}

function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timeString = now.toLocaleString('en-US', options);
    document.getElementById('currentTime').textContent = timeString;
}

// Custom name
const savedName = localStorage.getItem('userName') || 'Click to add your name';
const userNameEl = document.getElementById('userName');
userNameEl.textContent = savedName;

// Make name editable
userNameEl.addEventListener('click', function() {
    const currentName = this.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName === 'Click to add your name' ? '' : currentName;
    input.style.fontSize = '2rem';
    input.style.fontWeight = 'bold';
    input.style.border = '2px solid var(--primary)';
    input.style.borderRadius = '8px';
    input.style.padding = '0.5rem';
    input.style.background = 'var(--card-bg)';
    input.style.color = 'var(--text-primary)';
    input.placeholder = 'Enter your name';
    
    this.replaceWith(input);
    input.focus();
    
    function saveName() {
        const newName = input.value.trim() || 'Click to add your name';
        localStorage.setItem('userName', newName);
        userNameEl.textContent = newName;
        input.replaceWith(userNameEl);
    }
    
    input.addEventListener('blur', saveName);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveName();
    });
});

// Focus Timer
let timerInterval = null;
let timeLeft = 25 * 60;
let timerDuration = 25 * 60;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            stopTimer();
            alert('🎉 Focus session complete!');
            resetTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    timeLeft = timerDuration;
    updateTimerDisplay();
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('timerSettingsBtn').addEventListener('click', () => {
    document.getElementById('timerSettings').classList.toggle('hidden');
});

document.getElementById('timerMinutes').addEventListener('change', (e) => {
    const minutes = parseInt(e.target.value) || 25;
    timerDuration = minutes * 60;
    localStorage.setItem('timerDuration', minutes);
    resetTimer();
});

// To-Do List
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const div = document.createElement('div');
        div.className = 'todo-card' + (todo.completed ? ' completed' : '');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(index));
        
        const content = document.createElement('div');
        content.className = 'todo-content';
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        span.addEventListener('dblclick', () => editTodo(index, span));
        
        content.appendChild(span);
        
        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.className = 'action-btn edit-btn';
        editBtn.addEventListener('click', () => editTodo(index, span));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.addEventListener('click', () => deleteTodo(index));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        div.appendChild(checkbox);
        div.appendChild(content);
        div.appendChild(actions);
        todoList.appendChild(div);
    });
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Prevent duplicates
    if (todos.some(todo => todo.text.toLowerCase() === text.toLowerCase())) {
        alert('This task already exists!');
        return;
    }
    
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    input.value = '';
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function editTodo(index, spanElement) {
    const currentText = todos[index].text;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-text editing';
    input.value = currentText;
    
    spanElement.replaceWith(input);
    input.focus();
    
    function saveEdit() {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            // Check for duplicates
            if (todos.some((todo, i) => i !== index && todo.text.toLowerCase() === newText.toLowerCase())) {
                alert('This task already exists!');
                input.value = currentText;
                return;
            }
            todos[index].text = newText;
            saveTodos();
        }
        renderTodos();
    }
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit();
    });
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

function sortTodos() {
    todos.sort((a, b) => a.text.localeCompare(b.text));
    saveTodos();
    renderTodos();
}

document.getElementById('addTodoBtn').addEventListener('click', addTodo);
document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
document.getElementById('sortBtn').addEventListener('click', sortTodos);

// Quick Links
let links = JSON.parse(localStorage.getItem('links')) || [];
const colors = ['purple', 'red', 'orange', 'green'];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    const linksList = document.getElementById('linksList');
    linksList.innerHTML = '';
    
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = `link-card ${colors[index % colors.length]}`;
        
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name;
        a.target = '_blank';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'link-delete';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            deleteLink(index);
        });
        
        div.appendChild(a);
        div.appendChild(deleteBtn);
        linksList.appendChild(div);
    });
}

function addLink() {
    const nameInput = document.getElementById('linkName');
    const urlInput = document.getElementById('linkUrl');
    
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    
    if (!name || !url) {
        alert('Please enter both name and URL');
        return;
    }
    
    links.push({ name, url });
    saveLinks();
    renderLinks();
    
    nameInput.value = '';
    urlInput.value = '';
    document.getElementById('linkForm').classList.add('hidden');
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

document.getElementById('addLinkBtn').addEventListener('click', addLink);
document.getElementById('showLinkForm').addEventListener('click', () => {
    document.getElementById('linkForm').classList.toggle('hidden');
});

// Dark Mode Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// Initialize
function init() {
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    }
    
    // Load timer duration
    const savedDuration = localStorage.getItem('timerDuration');
    if (savedDuration) {
        document.getElementById('timerMinutes').value = savedDuration;
        timerDuration = parseInt(savedDuration) * 60;
        timeLeft = timerDuration;
    }
    
    updateGreeting();
    updateTimerDisplay();
    renderTodos();
    renderLinks();
    
    // Update time every second
    setInterval(updateGreeting, 1000);
}

init();
