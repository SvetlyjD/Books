// блок переменных и констант   ===================================================

var radio = document.getElementsByName("option");
let writingForm = document.querySelector(".writingBook");
let loadingForm = document.querySelector(".loadingBook");
let file = document.querySelector(".nameOnload");
let downloadLogin = document.querySelector(".downloadLogin")
let saveBook = document.querySelector(".saveBook");
let books = [];
let favoritebooks = [];
let numfavoriteBooks;
let numBooks;
let descriptionBook = document.querySelector(".descriptionBook");
let nameBook = document.querySelector(".nameWriting");
let container = document.querySelector(".container");
let containerfavoriteBooks = document.querySelector(".listFavoriteBooks");
let readBook = document.querySelector(".readBook");
let contentBook = document.querySelector(".contentsOneBook");
let editOneBook = document.querySelector(".editBook");
let editBookArea = document.querySelector(".editBookArea");
let saveOneBook = document.querySelector(".saveOneBook");
let dropdownAreaBooks = document.querySelector(".dropdownAreaBooks");
let oneBook1 = document.querySelectorAll(".oneBook");
let responseBack = {};

// получаем данные для рендера с LocalStorage 
if (localStorage.getItem("books")) {
    books = JSON.parse(localStorage.getItem("books"))
}
if (localStorage.getItem("favoritebooks")) {
    favoritebooks = JSON.parse(localStorage.getItem("favoritebooks"))
}
// здесь должен быть РЕНДЕР
renderLibrary();

// отображение формы  ==============================================================

function testRadio() {
    if (this.value == "writing") {
        writingForm.classList.remove("displayNone"); writingForm.classList.add("displayBlock");
        loadingForm.classList.remove("displayBlock"); loadingForm.classList.add("displayNone")
    }
    else
        if
            (this.value == "loading") {
            loadingForm.classList.add("displayBlock"); loadingForm.classList.remove("displayNone");
            writingForm.classList.add("displayNone"); writingForm.classList.remove("displayBlock");
        };
}

for (let i = 0; i < radio.length; i++) {
    radio[i].onchange = testRadio;
}

// отправка файла на сервер =========================================================

let formData = new FormData();

loadingForm.onsubmit = async (e) => {
    formData.append("login", downloadLogin.value);
    formData.append("file", file.files[0]);
    e.preventDefault();
    console.log(downloadLogin.value);
    let response = await fetch("https://apiinterns.osora.ru/", {
        method: 'POST',
        body: formData
    });
    let result = await response.json();
    let newBook = {
        name: downloadLogin.value,
        description: result.text,
        write: 1
    }
    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    renderLibrary();
};

// Пишем книгу =============================

saveBook.addEventListener("click", function () {
    let newBook = {
        name: nameBook.value,
        description: descriptionBook.value,
        write: 1
    }
    if (newBook.name && newBook.description) { books.push(newBook) } else alert("Добавьте заголовок и(или) содержание книги")
    localStorage.setItem("books", JSON.stringify(books));
    renderLibrary();

})


// функция рендеринга============================

function renderLibrary() {
    container.innerHTML = "";
    books.forEach((item, index) => {
        let blockOneBook = document.createElement("div");
        blockOneBook.classList.add("oneBook");
        blockOneBook.setAttribute("draggable", "true");
        blockOneBook.setAttribute("data-number", index)
        blockOneBook.innerHTML = `${item.name}
                                       <button class="readBook" data-index=${index}>Читать книгу</button>
                                       <button class="reductBook" data-index=${index}>Редактировать</button>
                                       <button class="deleteBook" data-index=${index}>Удалить</button>
                                       <button class ="readEndBook" data-index=${index}>Прочитана</button>`
        container.append(blockOneBook);
    }
        // сюда дописать рендер любимых книг
    )
    containerfavoriteBooks.innerHTML = "";
    favoritebooks.forEach((item, index) => {
        let blockOneFavoriteBook = document.createElement("div");
        blockOneFavoriteBook.classList.add("oneFavoriteBook");
        blockOneFavoriteBook.setAttribute("draggable", "true");
        blockOneFavoriteBook.setAttribute("data-number", index)
        blockOneFavoriteBook.innerHTML = `${item.name}
                                        <button class="readBook" data-index=${index}>Читать книгу</button>
                                        <button class="reductBook" data-index=${index}>Редактировать</button>
                                        <button class="deleteBook" data-index=${index}>Удалить</button>
                                        <button class ="readEndBook" data-index=${index}>Прочитана</button>`
        containerfavoriteBooks.append(blockOneFavoriteBook);
    })
}

// функции обработки событий =====================================================================
// удаление книги
function deleteBook(element) {
    books = books.filter((item, index) => index != element)
    localStorage.setItem("books", JSON.stringify(books));
}

// чтение книги1
function readesBook(element) {
    console.log(element);
    contentBook.innerHTML = books[element].description;
}

//редактировать книгу
function editBook(element) {
    editBookArea.value = books[element].description;
    saveOneBook.dataset.edit = element;
    editOneBook.style.display = "block";

}

//сохранить книгу
function saveEditBook(element) {
    // console.log(document.querySelector(".saveOneBook").dataset.save);
    if (document.querySelector(".saveOneBook").dataset.save == "books") {
        books[element].description = editBookArea.value;
        localStorage.setItem("books", JSON.stringify(books));
    } else if (
        document.querySelector(".saveOneBook").dataset.save == "favoriteBooks"
    ) {
        favoritebooks[element].description = editBookArea.value;
        localStorage.setItem("favoritebooks", JSON.stringify(favoritebooks));
    }

    renderLibrary();
    editOneBook.style.display = "none";
}

// функции обработки событий любимые книги =====================================================================
// удаление любимые книги
function deletefavoriteBook(element) {
    favoritebooks = favoritebooks.filter((item, index) => index != element)
    localStorage.setItem("favoritebooks", JSON.stringify(favoritebooks));
}

// чтение любимые книги1
function readesfavoriteBook(element) {
    console.log(element);
    contentBook.innerHTML = favoritebooks[element].description;
}

//редактировать любимую книгу
function editfavoriteBook(element) {
    editBookArea.value = favoritebooks[element].description;
    saveOneBook.dataset.edit = element;
    editOneBook.style.display = "block";

}

// задать обработку событий через делегирование блока со списком книг================================================

document.querySelector(".container").addEventListener("click", function (event) {
    let target = event.target;
    let indexBook = target.dataset.index;

    if (target.classList.contains("deleteBook")) {
        deleteBook(indexBook);
        renderLibrary();
    }
    if (target.classList.contains("readBook")) {
        readesBook(indexBook);
    }
    if (target.classList.contains("reductBook")) {
        document.querySelector(".saveOneBook").setAttribute("data-save", "books");
        editBook(indexBook);
    }
})

// делегирование блока с любимыми книгами =====================================================================

document.querySelector(".listFavoriteBooks").addEventListener("click", function (event) {
    let target = event.target;
    let indexBook = target.dataset.index;

    if (target.classList.contains("deleteBook")) {
        deletefavoriteBook(indexBook);
        renderLibrary();
    }
    if (target.classList.contains("readBook")) {
        readesfavoriteBook(indexBook);
    }
    if (target.classList.contains("reductBook")) {
        document.querySelector(".saveOneBook").setAttribute("data-save", "favoriteBooks");
        editfavoriteBook(indexBook);
    }
})

// делегирование на блок с сохранением и редактированием

document.querySelector(".editBook").addEventListener("click", function (event) {
    let target = event.target;
    let indexBook = target.dataset.edit;
    if (target.classList.contains("saveOneBook")) {                              // кнопка сохранения книги=================================
        console.log(indexBook);
        saveEditBook(indexBook);
    }
})

// делегирование draganddrop перенос из общих в любимые==============================================================

document.querySelector(".container").addEventListener("dragstart", handleDragStart);
function handleDragStart(event) {
    numfavoriteBooks = event.target.dataset.number;
    console.log("dragstart");
}

document.querySelector(".container").addEventListener("dragend", handleDragEnd);
function handleDragEnd(event) {
    document.querySelector(".dropdownarea").classList.remove("dropdownareaOver");
    console.log("dragEnd");
    favoritebooks.push(books[numfavoriteBooks]);
    deleteBook(numfavoriteBooks);
    localStorage.setItem("favoritebooks", JSON.stringify(favoritebooks));
    renderLibrary()
}


document.querySelector(".dropdownarea").addEventListener("dragenter", handleDragEnter);
function handleDragEnter(event) {
    event.preventDefault()
    console.log("dragenter");
    event.target.classList.add("dropdownareaOver");
}

document.querySelector(".dropdownarea").addEventListener("dragleave", handleDragLeave);
function handleDragLeave(event) {
    event.preventDefault();
    console.log("dragleave");
    this.classList.remove("dropdownareaOver");
}


document.querySelector(".dropdownarea").addEventListener("dragover", handleDragOver);
function handleDragOver(event) {
    event.preventDefault()
    console.log("dragover");

}

// делегирование draganddrop перенос книг из любимых в общий блок==============================================================

document.querySelector(".listFavoriteBooks").addEventListener("dragstart", handleDragStartFavorite);
function handleDragStartFavorite(event) {
    numBooks = event.target.dataset.number;
    console.log("dragstart");
}

document.querySelector(".listFavoriteBooks").addEventListener("dragend", handleDragEndFavorite);
function handleDragEndFavorite(event) {
    document.querySelector(".dropdownareaBooks").classList.remove("dropdownareaOver");
    console.log("dragEnd1");
    books.push(favoritebooks[numBooks]);
    deletefavoriteBook(numBooks);
    localStorage.setItem("books", JSON.stringify(books));
    renderLibrary()
}


document.querySelector(".dropdownareaBooks").addEventListener("dragenter", handleDragEnterBooks);
function handleDragEnterBooks(event) {
    event.preventDefault()
    console.log("dragenter");
    event.target.classList.add("dropdownareaOver");
}

document.querySelector(".dropdownareaBooks").addEventListener("dragleave", handleDragLeaveBooks);
function handleDragLeaveBooks(event) {
    event.preventDefault();
    console.log("dragleave");
    this.classList.remove("dropdownareaOver");
}


document.querySelector(".dropdownareaBooks").addEventListener("dragover", handleDragOverBooks);
function handleDragOverBooks(event) {
    event.preventDefault()
    console.log("dragover");
}


