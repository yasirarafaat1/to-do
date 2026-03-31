const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoForm = document.querySelector("#form form");
const toDoList = document.querySelector(".todo-list");
const standardTheme = document.querySelector(".standard-theme");
const lightTheme = document.querySelector(".light-theme");
const darkerTheme = document.querySelector(".darker-theme");
const themeSelectors = document.querySelectorAll(".theme-selector");
const taskSummary = document.querySelector("#task-summary");
const emptyState = document.querySelector("#empty-state");
const title = document.querySelector("#title");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

toDoForm.addEventListener("submit", addToDo);
toDoList.addEventListener("click", deletecheck);
document.addEventListener("DOMContentLoaded", initializeApp);
standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
darkerTheme.addEventListener("click", () => changeTheme("darker"));

let savedTheme = localStorage.getItem("savedTheme");
if (savedTheme === null) {
    savedTheme = "standard";
}

function initializeApp() {
    getTodos();
    changeTheme(savedTheme);
    updateTaskStatus();
}

function addToDo(event) {
    event.preventDefault();

    const taskText = toDoInput.value.trim();

    if (taskText === "") {
        alert("You must write something!");
        return;
    }

    const toDoDiv = createTodoElement(taskText);
    toDoList.appendChild(toDoDiv);
    savelocal(taskText);
    toDoInput.value = "";
    toDoInput.focus();
    updateTaskStatus();
}

function createTodoElement(todoText) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);

    const newToDo = document.createElement("li");
    newToDo.innerText = todoText;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    const checked = document.createElement("button");
    checked.type = "button";
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);
    checked.setAttribute("aria-label", "Mark task complete");
    toDoDiv.appendChild(checked);

    const deleted = document.createElement("button");
    deleted.type = "button";
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    deleted.setAttribute("aria-label", "Delete task");
    toDoDiv.appendChild(deleted);

    return toDoDiv;
}

function deletecheck(event) {
    const item = event.target;

    if (item.classList[0] === "delete-btn") {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        item.parentElement.addEventListener("transitionend", function () {
            item.parentElement.remove();
            updateTaskStatus();
        });
    }

    if (item.classList[0] === "check-btn") {
        item.parentElement.classList.toggle("completed");
        updateTaskStatus();
    }
}

function savelocal(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.forEach(function (todo) {
        const toDoDiv = createTodoElement(todo);
        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todos.indexOf(todo.children[0].innerText);
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function updateTaskStatus() {
    const allTasks = document.querySelectorAll(".todo");
    const completedTasks = document.querySelectorAll(".todo.completed");
    const totalTasks = allTasks.length;
    const openTasks = totalTasks - completedTasks.length;

    if (totalTasks === 0) {
        taskSummary.textContent = "No tasks yet. Add your first one.";
        emptyState.classList.remove("is-hidden");
        return;
    }

    if (openTasks === 0) {
        taskSummary.textContent = `All ${totalTasks} tasks are done. Nice work.`;
    } else {
        taskSummary.textContent = `${openTasks} task${openTasks > 1 ? "s" : ""} left out of ${totalTasks}.`;
    }

    emptyState.classList.add("is-hidden");
}

function changeTheme(color) {
    localStorage.setItem("savedTheme", color);
    savedTheme = color;

    document.body.className = color;
    title.classList.toggle("darker-title", color === "darker");
    toDoInput.className = `todo-input ${color}-input`;
    toDoBtn.className = `todo-btn ${color}-button`;

    document.querySelectorAll(".todo").forEach((todo) => {
        todo.className = todo.classList.contains("completed")
            ? `todo ${color}-todo completed`
            : `todo ${color}-todo`;
    });

    document.querySelectorAll(".check-btn").forEach((button) => {
        button.className = `check-btn ${color}-button`;
        button.setAttribute("aria-label", "Mark task complete");
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.className = `delete-btn ${color}-button`;
        button.setAttribute("aria-label", "Delete task");
    });

    themeSelectors.forEach((selector) => {
        selector.classList.toggle("active-theme", selector.dataset.theme === color);
    });

    const themeColorMap = {
        standard: "#123247",
        light: "#eef4ff",
        darker: "#04070b",
    };

    themeColorMeta.setAttribute("content", themeColorMap[color] || themeColorMap.standard);
}
