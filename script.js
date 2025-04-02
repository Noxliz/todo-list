document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Afficher les tâches au chargement
    renderTasks();

    // Ajouter une tâche
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Filtrer les tâches
    allBtn.addEventListener('click', () => filterTasks('all'));
    activeBtn.addEventListener('click', () => filterTasks('active'));
    completedBtn.addEventListener('click', () => filterTasks('completed'));

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) taskItem.classList.add('completed');

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="complete-btn">✓</button>
                    <button class="delete-btn">X</button>
                </div>
            `;

            const completeBtn = taskItem.querySelector('.complete-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            completeBtn.addEventListener('click', () => toggleComplete(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(taskItem);
        });
    }

    function toggleComplete(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function filterTasks(filter) {
        renderTasks(filter);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
