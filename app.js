const addBtn = document.querySelector(".form-text-submit");
const textInput = document.querySelector(".form-text-input");
const itemsContainer = document.querySelector(".items-container");
const listContainer = document.querySelector(".list-container");
const titleForm = document.querySelector(".title-form");
const titleInput = document.querySelector(".title-input");

let editMode = false;
let editID;
let counter = 0;

window.addEventListener("load", () => {
    if("title" in localStorage) titleInput.value = localStorage.title;
    const tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : {};
    for(const taskID in tasks) {
        addTask(taskID, tasks[taskID]);
    }
    crossOutTasks();
});

titleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    textInput.focus();
});

titleForm.addEventListener("focusout", () => {
    addTitleToLocalStorage();
});

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const value = textInput.value;
    textInput.value = "";
    if(editMode) {
        const itemText = document.getElementById(`text-${editID}`);
        const editBtn = document.getElementById(`edit-${editID}`);
        if(value != "") {
            itemText.innerText = `${value}`;
            let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : {};
            tasks[`${editID}`] = `${value}`;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        addBtn.innerHTML = `<i class="fas fa-plus fa-2x add-btn"></i>`;
        editBtn.classList.remove("colorGrey");
        editBtn.classList.add("colorWhite");
        editMode = false;
        editID = 0;

    } else {
        if(value != "") {
            const itemID = Date.now();
            addTask(itemID, value);
            let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : {};
            tasks[itemID] = value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }
});

function clearList()
{
    itemsContainer.innerHTML = "";
    counter = 0;
    const deleteAll = document.querySelector(".delete-all");
    listContainer.removeChild(deleteAll);
    localStorage.clear();
    addTitleToLocalStorage();
}

function addTitleToLocalStorage()
{
    if(!titleInput.value) localStorage.removeItem("title");
    else localStorage.setItem("title", titleInput.value);
}

function addTask(id, value)
{
    const item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("id", id);
    item.innerHTML = `<h4 id="text-${id}" class="item-text">${value}</h4>
        <span></span>
        <button id="edit-${id}" class="edit-btn item-btn colorWhite"><i class="fas fa-edit fa-2x"></i></button>
        <button id="check-${id}" class="check-btn item-btn colorWhite"><i class="fas fa-check fa-2x"></i></button>
        <button id="delete-${id}" class="delete-btn item-btn colorWhite"><i class="fas fa-trash fa-2x"></i></button>`;
    itemsContainer.appendChild(item);
    addEditBtn(id);
    addCheckBtn(id);
    addDeleteBtn(id);
    counter++;
    if(counter == 1) {
        const deleteAll = document.createElement("div");
        deleteAll.classList.add("delete-all");
        deleteAll.innerHTML =
        `<svg viewBox="0 0 400 50" class="delete-all-svg">
            <path class="svg-xd delete-all-path" d="M 0 0 L 400 0 L 350 50 L 50 50 L 0 0 "></path>
        </svg>
        <span class="delete-all-text">delete all</span>
        <i class="fas fa-trash delete-all-icon"></i>`;
        listContainer.appendChild(deleteAll);
        const deleteAllPathBtn = document.querySelector(".delete-all-path");
        const deleteAllTextBtn = document.querySelector(".delete-all-text");
        const deleteAllIconBtn = document.querySelector(".delete-all-icon");
        [deleteAllPathBtn, deleteAllTextBtn, deleteAllIconBtn].forEach((item) => {
            item.addEventListener("click", () => {
                clearList();
            });
        });
    }
}

function addEditBtn(taskID)
{
    const task = document.getElementById(`${taskID}`);
    const editBtn = document.getElementById(`edit-${taskID}`);
    editBtn.addEventListener("click", () => {
        const previousEdit = document.getElementById(`edit-${editID}`);
        if(previousEdit) {
            previousEdit.classList.remove("colorGrey");
            previousEdit.classList.add("colorWhite");
        }
        if(editBtn === previousEdit) {
            textInput.value = "";
            addBtn.innerHTML = `<i class="fas fa-plus fa-2x add-btn"></i>`;
            editMode = false;
            editID = 0;
        } else {
            addBtn.innerHTML = `<i class="fas fa-edit fa-2x"></i>`;
            editBtn.classList.remove("colorWhite");
            editBtn.classList.add("colorGrey");
            editMode = true;
            editID = taskID;
            textInput.value = document.getElementById(`text-${editID}`).innerText;
            textInput.focus();
        }
    });
}

function addCheckBtn(taskID)
{
    const checkBtn = document.getElementById(`check-${taskID}`);
    checkBtn.addEventListener("click", () => {
        const itemText = document.getElementById(`text-${taskID}`);
        itemText.classList.toggle("check");
        let checkList = localStorage.getItem("checkList") ? JSON.parse(localStorage.getItem("checkList")) : {};
        if(`${taskID}` in checkList) {
            checkList[`${taskID}`] = !checkList[`${taskID}`];
        } else {
            checkList[`${taskID}`] = true;
        }
        localStorage.setItem("checkList", JSON.stringify(checkList));
    });
}

function addDeleteBtn(taskID)
{
    const task = document.getElementById(`${taskID}`);
    const deleteBtn = document.getElementById(`delete-${taskID}`);
    deleteBtn.addEventListener("click", () => {
        itemsContainer.removeChild(task);
        counter--;
        let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : {};
        delete tasks[taskID];
        localStorage.setItem("tasks", JSON.stringify(tasks));
        let checkList = localStorage.getItem("checkList") ? JSON.parse(localStorage.getItem("checkList")) : {};
        delete checkList[taskID];
        localStorage.setItem("checkList", JSON.stringify(checkList));
        if(counter == 0) {
            const deleteAll = document.querySelector(".delete-all");
            listContainer.removeChild(deleteAll);
        }
    });
}

function crossOutTasks()
{
    const checkList = localStorage.getItem("checkList") ? JSON.parse(localStorage.getItem("checkList")) : {};
    for(const key in checkList) {
        if(checkList[key] === true) {
            const itemText = document.getElementById(`text-${key}`);
            itemText.classList.toggle("check");
        }
    }
}
