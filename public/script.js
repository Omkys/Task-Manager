const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Fetch tasks from the server
async function fetchTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  renderTasks(tasks);
}

// Add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value;
  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  const newTask = await response.json();
  renderTask(newTask);
  taskInput.value = '';
});

// Render all tasks
function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(renderTask);
}

// Render a single task
function renderTask(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  li.className = task.completed ? 'completed' : '';
  li.innerHTML = `
    <span>${task.title}</span>
    <div>
      <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
  taskList.appendChild(li);
}

// Mark a task as complete or delete
taskList.addEventListener('click', async (e) => {
  const li = e.target.closest('li');
  const id = li.dataset.id;

  if (e.target.classList.contains('complete-btn')) {
    const completed = !li.classList.contains('completed');
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    li.classList.toggle('completed');
    e.target.textContent = completed ? 'Undo' : 'Complete';
  }

  if (e.target.classList.contains('delete-btn')) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    li.remove();
  }
});

// Initial fetch of tasks
fetchTasks();
