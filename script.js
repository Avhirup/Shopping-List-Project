const form = document.getElementById('item-form');
const formInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterBtn = document.getElementById('filter');
let isEditMode = false;
const formBtn = form.querySelector('button');

//! DISPLAYING ITEMS TO THE DOM
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function addItem(e) {
    e.preventDefault();

    //? FORM VALIDATION
    const inputValue = formInput.value;
    if (inputValue === '') {
        alert('You have not entered anything.');
        return;
    }

    //! CHECKING FOR EDIT MODE
    if (isEditMode) {
        const currItemToEdit = itemList.querySelector('.edit-mode');
        //* REMOVING FROM LOCAL STORAGE
        removeItemFromStorage(currItemToEdit.textContent);
        // currItemToEdit.classList.remove('edit-mode');
        currItemToEdit.remove();
        isEditMode = false;
    }
    else {
        if (checkIfItemExists(inputValue)) {
            alert('Item already exists !');
            return;
        }
    }

    //* CREATING ITEM DOM ELEMENT
    addItemToDOM(inputValue);

    //* ADD ITEM TO LOCALSTORAGE
    addItemToLocalStorage(inputValue);

    formInput.value = '';

    checkUI();
}

//? LISTENING THE FORM TO SUBMIT
function createButton(classes) {
    const button = document.createElement('button');
    button.setAttribute('class', classes);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.setAttribute('class', classes);
    return icon;
}

//? CREATING THE WHOLE LI ELEMENT
function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red');
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    li.appendChild(button);

    itemList.appendChild(li);
}

//! ADDING ITEM TO LOCAL STORAGE
function addItemToLocalStorage(item) {
    const itemsFromStorage = getItemsFromStorage();


    //* ADDING NEW ELEMENT TO THE ARRAY
    itemsFromStorage.push(item);

    //* CONVERTING TO JSON_STRING FROM ARRAY
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


//! GETTING ALL THE ITEMS FROM LOCAL STORAGE
function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

//! ON CLICKING ON THE ITEM
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        if (e.target.tagName === 'LI')
            setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();

    return (itemsFromStorage.includes(item));
}

function setItemToEdit(item) {
    if (isEditMode) {
        let oldItem = itemList.querySelector('.edit-mode');
        oldItem.classList.remove('edit-mode');
        item.classList.add('edit-mode');
    }
    else {
        isEditMode = true;
        item.classList.add('edit-mode');
    }
    formBtn.innerHTML = `<i class="fa-solid fa-pen"></i>   Update `;
    formBtn.style.backgroundColor = '#228B22';
    formInput.value = item.textContent;
}

//* REMOVE ITEM FUNCTION
function removeItem(item) {
    if (window.confirm('Are you sure you want to remove ?')) {

        //* REMOVING ITEM FROM DOM
        item.remove();

        //* REMOVING ITEM FROM STORAGE
        removeItemFromStorage(item.textContent);
        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //* FILTER OUT ITEMS TO BE REMOVED
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //* RESET TO LOCAL STORAGE THE UPDATED ARRAY
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//* CLEAR EVERYTHING BUTTON
function clearItems(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //* CLEARING FROM LOCALSTORAGE
    localStorage.removeItem('items');

    checkUI();
}

//? FILTERING ITEMS
function filterItem(e) {
    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    })
}


//* CHEKCING IS THE ANY LI IS PRESENT
function checkUI() {

    formInput.value = '';

    const items = document.querySelectorAll('li');
    if (items.length === 0) {
        filterBtn.style.display = 'none';
        clearBtn.style.display = 'none';
    }
    else {
        filterBtn.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    formBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//* INITIALIZE OUR APP
function init() {

    //? EVENT LISTENERS
    form.addEventListener('submit', addItem);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    filterBtn.addEventListener('input', filterItem);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();

}

init();


