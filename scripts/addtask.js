let IDs;
let expanded = false;
let URL_contacts = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let URL_tasks = "https://join-da080-default-rtdb.europe-west1.firebasedatabase.app/tasks";
let prio = "medium";
let subtasks = [];
let taskID = [];
let checkedContactsCircles = [];
let progress = "To Do";

/**
 * Prepares a task with the necessary parameters
 */
async function addTask() {
  let title = document.getElementById('input-title');
  let description = document.getElementById('input-description');
  let assignedContacts = getSelected();
  let deadline = document.getElementById('deadline');
  let category = document.getElementById('category');

  await uploadTask(title, description, deadline, category, assignedContacts);
  clearTasks();
  launchToaster();
}

/**
 * Prepares the task for upload and returns its id
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} deadline 
 * @param {string} category 
 * @param {array} assignedContacts 
 * @returns 
 */
async function uploadTask(title, description, deadline, category, assignedContacts) {
  let response = await sumbitUploadTask(title, description, deadline, category, assignedContacts);
  let responseToJson = await response.json();
  if (responseToJson['tasks']) {
    responseToJson['tasks'].forEach(task => {
      taskID.push(task);
    });
  }
  taskID.push(responseToJson['name']);
  return responseToJson;
}

/**
 * Uploads the task to database
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} deadline 
 * @param {*} category 
 * @param {*} assignedContacts 
 */
async function sumbitUploadTask(title, description, deadline, category, assignedContacts) {
  data = ({ title: title.value, description: description.value, deadline: deadline.value, prio: prio, category: category.value, contacts: assignedContacts, subtasks: subtasks, progress: progress });
  let response = await fetch(URL_tasks + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return response;
}

/**
 * Converts the contact-JSON into an array with all contacts as an object
 * 
 * @param {*} json 
 * @returns array with all contacts
 */
function jsonToArrayContacts(json) {
  let result = [];
  let keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

/**
 * Extracts the unique IDs
 * 
 * @param {json} json 
 * @returns unique ID, used by database
 */
function jsonToArrayIDs(json) {
  let result = [];
  let keys = Object.keys(json);
  keys.forEach(function (key) {
    let contact = json[key];
    contact.id = key;
    result.push(json[key]);
  });
  return result;
}

/**
 * Sets the global variable prio to "low", "medium" or "urgent"
 * 
 * @param {string} priority 
 */
function setPrio(priority) {
  prio = priority;
}

/**
 * Adds one subtask to subtask-array and loads it to subtask-html-area
 */
function addSubtask() {
  let subtask = document.getElementById('subtasks');
  if (subtask.value) {
    let subtaskobject = { title: `${subtask.value}`, done: "false" };
    subtasks.push(subtaskobject);
    renderAddedSubtasks();
    document.getElementById('subtasks').value = ``;
    cancelAddSubtask()
  }
}

/**
 * Renders the global array subtasks into the div
 */
function renderAddedSubtasks(){
  document.getElementById('added-subtasks').innerHTML = ``;
    for (let i = 0; i < subtasks.length; i++) {
      document.getElementById('added-subtasks').innerHTML += `<div id="outer-container-${i}" class="subtask-help-outer-container">
                                                                <li id="subtask${i}" class="subtask-help-inner-container">${subtasks[i]['title']}</li>
                                                                <div id="edit-images-${i}" class="edit-images-area-subtasks">
                                                                    <div><img id="pen-${i}" onclick="prepareEditSubtask('${i}')"src="./assets/img/subtaskedit.svg"></div>|
                                                                    <div><img id="trash-${i}" onclick="deleteSubtask('${i}')" src="./assets/img/subtaskdelete.svg"></div>
                                                                </div> 
                                                              </div>`;
    }
}

/**
 * Deletes one added subtask from preparing
 * 
 * @param {number} i 
 */
function deleteSubtask(i){
subtasks.splice(i, 1);
renderAddedSubtasks();
}

/**
 * Prepares the choosen subtask divs to edit it
 * @param {} i 
 */
function prepareEditSubtask(i){
let oldSubtask = document.getElementById(`subtask${i}`);
// oldSubtask.innerHTML = ``;
oldSubtask.innerHTML = `<input class="subtask-edit-input" id="new-subtask-for-edit-${i}" value="${oldSubtask.innerText}">`;
document.getElementById(`edit-images-${i}`).innerHTML = `<div><img id="trash-${i}" onmousedown="deleteSubtask('${i}')" src="./assets/img/subtaskdelete.svg"></div>
                                                          |
                                                          <div><img id="check-${i}" onmousedown="confirmEditSubtask('${i}')" src="./assets/img/subtaskcheck.svg"></div>`

document.getElementById(`outer-container-${i}`).classList.add('choosen-input');
document.getElementById(`new-subtask-for-edit-${i}`).focus();
document.getElementById(`new-subtask-for-edit-${i}`).addEventListener('blur', function() {
  renderAddedSubtasks();
  ;
});
}

/**
 * Confirms the editing and changes the array
 * @param {} i 
 */
function confirmEditSubtask(i){
subtasks.splice(i, 1, {"title": document.getElementById(`new-subtask-for-edit-${i}`).value, "done": "false"});
renderAddedSubtasks();
}

/**
 * Colors the urgent-area and uncolors the other areas
 */
function colorPrioUrgent() {
  document.getElementById('prio-urgent').classList.add('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}

/**
 * Colors the medium-area and uncolors the other areas
 */
function colorPrioMedium() {
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.add('prio-active-medium');
  document.getElementById('prio-low').classList.remove('prio-active-low');
}

/**
 * Colors the low-area and uncolors the other areas
 */
function colorPrioLow() {
  document.getElementById('prio-urgent').classList.remove('prio-active-urgent');
  document.getElementById('prio-medium').classList.remove('prio-active-medium');
  document.getElementById('prio-low').classList.add('prio-active-low');
}

/**
 * Designs the subtasks input to focus-mode
 */
function openAddSubtask() {
  document.getElementById('add-button-icon-plus').classList.add('d-none');
  document.getElementById('add-button-icon-cancel').classList.remove('d-none');
  document.getElementById('add-button-icon-check').classList.remove('d-none');
  document.getElementById('subtasks').focus();
}

/**
 * Designs the subtasks input to blur-mode
 */
function cancelAddSubtask() {
  document.getElementById('add-button-icon-plus').classList.remove('d-none');
  document.getElementById('add-button-icon-cancel').classList.add('d-none');
  document.getElementById('add-button-icon-check').classList.add('d-none');
}

/**
 * Clears all prepared Tasks
 */
function clearTasks() {
  document.getElementById('input-title').value = ``;
  document.getElementById('input-description').value = ``;
  clearCheckboxes()
  document.getElementById('deadline').value = ``;
  colorPrioMedium();
  prio = "medium";
  document.getElementById('category').innerHTML = emptyCategory();
  document.getElementById('subtasks').innerHTML = ``;
  document.getElementById('subtasks').value = ``;
  cancelAddSubtask();
  document.getElementById('added-subtasks').innerHTML = ``;
  subtasks = [];
}

/**
 * Clears the Checkboxes-Inputs
 */
function clearCheckboxes() {
  let checkboxes = document.querySelectorAll('input[name="contacts"]:checked');
  checkboxes.forEach(el => el.checked = false);
  checkedContactsCircles = [];
  document.getElementById('circle-area-assigned-contacts').innerHTML = ``;
}

/**
 * Sets category on default
 * 
 * @returns empty Category-Input
 */
function emptyCategory() {
  return /*html*/`
  <option value="" disabled selected hidden>Select your option</option>
  <option value="Technical Task">Technical Task</option>
  <option value="User Story">User Story</option>`
}

/**
 * Gives User-Feedback
 */
function launchToaster() {
  let x = document.getElementById("toaster-task")
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
    window.location.href = 'board.html';
  }, 2000);
}