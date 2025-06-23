// Lấy phần tử HTML
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Gắn sự kiện khi nhấn nút Thêm
addBtn.addEventListener('click', function () {
  const task = input.value.trim();
  if (task !== '') {
    createTodoItem(task, false);
    input.value = '';
    saveToLocalStorage();
    updateTaskCounter();
  } else {
    alert('Vui lòng nhập công việc!');
  }
});

// Tạo công việc và gắn sự kiện
function createTodoItem(text, isCompleted) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const span = document.createElement('span');
  span.textContent = text;
  if (isCompleted) span.classList.add('completed');

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'X';

  li.appendChild(span);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);

  // Xoá
  deleteBtn.addEventListener('click', function () {
    li.remove();
    saveToLocalStorage();
    updateTaskCounter();
  });

  // Hoàn thành
  span.addEventListener('click', function () {
    span.classList.toggle('completed');
    saveToLocalStorage();
    updateTaskCounter();
  });

  // Sửa khi double click
  span.addEventListener('dblclick', function () {
    const oldText = span.textContent;
    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = oldText;
    inputEdit.className = 'edit-input';
    li.replaceChild(inputEdit, span);
    inputEdit.focus();

    inputEdit.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const newText = inputEdit.value.trim() || oldText;
        const newSpan = document.createElement('span');
        newSpan.textContent = newText;
        newSpan.className = span.className;

        // Gắn lại sự kiện click hoàn thành
        newSpan.addEventListener('click', function () {
          newSpan.classList.toggle('completed');
          saveToLocalStorage();
          updateTaskCounter();
        });

        // Gắn lại sự kiện sửa
        newSpan.addEventListener('dblclick', arguments.callee);

        li.replaceChild(newSpan, inputEdit);
        saveToLocalStorage();
        updateTaskCounter();
      }
    });
  });
}

// Lưu vào localStorage
function saveToLocalStorage() {
  const items = [];
  document.querySelectorAll('.todo-item').forEach(li => {
    const text = li.querySelector('span').textContent;
    const isCompleted = li.querySelector('span').classList.contains('completed');
    items.push({ text, isCompleted });
  });
  localStorage.setItem('todos', JSON.stringify(items));
}

// Tải từ localStorage
function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('todos')) || [];
  data.forEach(item => createTodoItem(item.text, item.isCompleted));
}

// Đếm số việc chưa hoàn thành
function updateTaskCounter() {
  const allItems = document.querySelectorAll('.todo-item');
  let count = 0;
  allItems.forEach(item => {
    const isCompleted = item.querySelector('span').classList.contains('completed');
    if (!isCompleted) count++;
  });
  document.getElementById('task-counter').textContent = `Bạn còn ${count} việc cần làm`;
}

// Xoá tất cả
const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', function () {
  if (confirm('Bạn có chắc muốn xoá toàn bộ công việc không?')) {
    todoList.innerHTML = '';
    localStorage.removeItem('todos');
    updateTaskCounter();
  }
});

// Lọc công việc
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;

    document.querySelectorAll('.todo-item').forEach(item => {
      const isCompleted = item.querySelector('span').classList.contains('completed');
      if (
        filter === 'all' ||
        (filter === 'active' && !isCompleted) ||
        (filter === 'completed' && isCompleted)
      ) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Gọi khi mở trang
loadFromLocalStorage();
updateTaskCounter();
