// Fetch the to-do lists from the JSON and populate the widgets
const fetchTodoLists = async () => {
    try {
      console.log('Fetching to-do lists...');
      const response = await fetch('/api/todo-lists');
      console.log('Response:', response);
  
      const data = await response.json();
      console.log('Data:', data);
  
      Object.keys(data).forEach(listName => {
        const container = document.querySelector(`#Todo${listName === "frontEnd" ? 1 : 2}`);
        console.log(`Updating container for: ${listName}`, container);
  
        const ul = container.querySelector(".todo-ul");
        ul.innerHTML = ""; // Clear current items
  
        data[listName].forEach(item => createListItem(ul, item.text, item.checked));
      });
  
      initializeListEventListeners(); // Ensure existing items have functionality
    } catch (err) {
      console.error("Error fetching to-do lists:", err);
    }
  };
  
  // Create a new <li> element
  const createListItem = (ul, text, checked = false) => {
    const li = document.createElement("li");
    li.textContent = text;
  
    if (checked) {
      li.classList.add("checked");
    }
  
    // Add close button
    addCloseButton(li);
  
    // Add "checked" toggle functionality
    li.addEventListener("click", function (event) {
      if (event.target.tagName === "LI") {
        li.classList.toggle("checked");
        const container = ul.closest(".todo-container");
        syncTodoList(container); // Sync the state with the server
      }
    });
  
    ul.appendChild(li);
  };
  
  // Add a close button to <li>
  const addCloseButton = (li) => {
    const span = document.createElement("SPAN");
    const txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
  
    span.onclick = function () {
      const ul = li.closest("ul");
      li.remove(); // Remove <li> from the DOM
      const container = ul.closest(".todo-container");
      syncTodoList(container); // Sync with the server
    };
  };
  
  // Add new items to the list
  const newElement = (button) => {
    const container = button.closest(".todo-container");
    const input = container.querySelector(".myInput");
    const ul = container.querySelector(".todo-ul");
    const inputValue = input.value.trim();
  
    if (inputValue) {
      createListItem(ul, inputValue); // Create and append the new <li>
      input.value = ""; // Clear the input field
      syncTodoList(container); // Sync the new state with the server
    }
  };
  
  const idToListName = {
    Todo1: "frontEnd",
    Todo2: "backEnd",
  };
  
  const syncTodoList = async (container) => {
    const ul = container.querySelector(".todo-ul");
    const listName = idToListName[container.id]; // Dynamically map id to list name
  
    if (!listName) {
      console.error(`No list name mapped for container id: ${container.id}`);
      return;
    }
  
    const items = Array.from(ul.children).map(li => ({
      text: li.textContent.replace("×", "").trim(),
      checked: li.classList.contains("checked"),
    }));
  
    try {
      const response = await fetch('/api/update-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName, items }),
      });
  
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to sync to-do list:", data.error);
      }
    } catch (err) {
      console.error("Error syncing to-do list:", err);
    }
  };
  
  // Initialize functionality for existing items
  const initializeListEventListeners = () => {
    const todoLists = document.querySelectorAll(".todo-ul");
  
    todoLists.forEach(ul => {
      ul.childNodes.forEach(li => {
        if (!li.querySelector(".close")) {
          addCloseButton(li);
        }
  
        li.addEventListener("click", function (event) {
          if (event.target.tagName === "LI") {
            li.classList.toggle("checked");
            const container = ul.closest(".todo-container");
            syncTodoList(container); // Sync state with the server
          }
        });
      });
    });
  };
  
  // Set up event listeners for the "Add" button
  document.querySelectorAll(".addBtn").forEach(button => {
    const input = button.previousElementSibling;
  
    // Add functionality for both click and Enter key
    button.addEventListener("click", () => newElement(button));
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        button.click();
      }
    });
  });
  
  // Fetch and populate the widgets on page load
  window.addEventListener("load", () => {
    fetchTodoLists();
  });  