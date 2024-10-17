let todolist = [];

// Load data from local storage on page load
window.onload = function() {
    const storedData = localStorage.getItem('todolist');
    if (storedData) {
        todolist = JSON.parse(storedData);
        display();
    }
};

function addtodo() {
    let input = document.querySelector('#input');
    let dateInput = document.querySelector('#tododate');
    let todo = input.value.trim();
    let todate = dateInput.value;

    if (todo !== '' && todate !== '') {
        todolist.push({ 
            item: todo, 
            duedate: todate,
            id: Date.now()
        });
        
        // Clear inputs with animation
        input.style.animation = 'fadeOut 0.3s';
        dateInput.style.animation = 'fadeOut 0.3s';
        
        setTimeout(() => {
            input.value = '';
            dateInput.value = '';
            input.style.animation = '';
            dateInput.style.animation = '';
        }, 300);

        localStorage.setItem('todolist', JSON.stringify(todolist));
        display();
    }
}

function display() {
    let list = document.querySelector('.list');
    list.innerHTML = '';

    todolist.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item animate__animated animate__fadeInUp';
        todoItem.style.animationDelay = `${index * 0.1}s`;

        todoItem.innerHTML = `
            <span class="todo-text">${todo.item}</span>
            <span class="todo-date">${formatDate(todo.duedate)}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">
                Delete
            </button>
        `;

        list.appendChild(todoItem);
    });
}

function deleteTodo(index) {
    const todoItem = document.querySelectorAll('.todo-item')[index];
    todoItem.classList.add('animate__fadeOutRight');
    
    todoItem.addEventListener('animationend', () => {
        todolist.splice(index, 1);
        localStorage.setItem('todolist', JSON.stringify(todolist));
        display();
    });
}

function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add event listener for Enter key
document.querySelector('#input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addtodo();
    }
});

// Prevent past dates
document.querySelector('#tododate').addEventListener('change', function(e) {
    const selectedDate = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Please select a future date');
        this.value = '';
    }
});