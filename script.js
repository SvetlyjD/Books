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
        write: 1,
        date: Date.now()
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
        write: 1,
        date: Date.now()
    }
    if (newBook.name && newBook.description) { books.push(newBook) } else alert("Добавьте заголовок и(или) содержание книги")
    books = books.sort(function (a, b) { return a.write - b.write || a.date - b.date })
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
        blockOneBook.setAttribute("data-number", index);
        if (item.write == 2) { blockOneBook.classList.add("readingBooks") }
        blockOneBook.innerHTML = `<div class ="bookName">${item.name}</div>
                                       <button class="readBook" data-index=${index}>Читать</button>
                                       <button class="reductBook" data-index=${index}>Редактировать</button>
                                       <button class="deleteBook" data-index=${index}>X</button>
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
        if (item.write == 2) { blockOneFavoriteBook.classList.add("readingBooks") }
        blockOneFavoriteBook.setAttribute("data-number", index)
        blockOneFavoriteBook.innerHTML = `<div class ="bookName">${item.name}</div>
                                        <button class="readBook" data-index=${index}>Читать</button>
                                        <button class="reductBook" data-index=${index}>Редактировать</button>
                                        <button class="deleteBook" data-index=${index}>X</button>
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
    contentBook.innerHTML = books[element].description;
}

//редактировать книгу
function editBook(element) {
    editBookArea.value = books[element].description;
    saveOneBook.dataset.edit = element;
    editOneBook.style.display = "block";

}

function readEndBook(indexBook) {
    if (books[indexBook].write == 1) {
        books[indexBook].write = 2
    } else if (books[indexBook].write == 2) {
        books[indexBook].write = 1
    }
    books = books.sort(function (a, b) { return a.write - b.write || a.date - b.date })
    localStorage.setItem("books", JSON.stringify(books));
}

//сохранить книгу
function saveEditBook(element) {
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
    contentBook.innerHTML = favoritebooks[element].description;
}

//редактировать любимую книгу
function editfavoriteBook(element) {
    editBookArea.value = favoritebooks[element].description;
    saveOneBook.dataset.edit = element;
    editOneBook.style.display = "block";
}

// любимая книга прочитана

function readEndfavoriteBook(indexBook) {
    if (favoritebooks[indexBook].write == 1) {
        favoritebooks[indexBook].write = 2
    } else if (favoritebooks[indexBook].write == 2) {
        favoritebooks[indexBook].write = 1
    }

    favoritebooks = favoritebooks.sort(function (a, b) { return a.write - b.write || a.date - b.date })
    localStorage.setItem("favoritebooks", JSON.stringify(favoritebooks));

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
    if (target.classList.contains("readEndBook")) {
        readEndBook(indexBook);

        renderLibrary();
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

    if (target.classList.contains("readEndBook")) {
        readEndfavoriteBook(indexBook);
        renderLibrary();
    }
})

// делегирование на блок с сохранением и редактированием

document.querySelector(".editBook").addEventListener("click", function (event) {
    let target = event.target;
    let indexBook = target.dataset.edit;
    if (target.classList.contains("saveOneBook")) {                              // кнопка сохранения книги=================================
        saveEditBook(indexBook);
    }
})

// делегирование draganddrop перенос из общих в любимые==============================================================

document.querySelector(".container").addEventListener("dragstart", handleDragStart);
function handleDragStart(event) {
    numfavoriteBooks = event.target.dataset.number;
    document.querySelector(".dropdownareaBooks").setAttribute("data-block", "block");
}

document.querySelector(".container").addEventListener("dragend", handleDragEnd);
function handleDragEnd(event) {
    document.querySelector(".dropdownareaBooks").removeAttribute("data-block");
    document.querySelector(".dropdownareaBooks").classList.remove("dropdownareaOver");
}
//     нужно прописать атрибут блокировки data-atribute на собственное поле при перетаскивании на него!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
document.querySelector(".dropdownarea").addEventListener("drop", handleDrop);
function handleDrop(event) {
    event.preventDefault();
    if (document.querySelector(".dropdownarea").dataset.block != "block") {
        favoritebooks.push(books[numfavoriteBooks]);
        deleteBook(numfavoriteBooks);
        document.querySelector(".dropdownareaBooks").removeAttribute("data-block");
        favoritebooks = favoritebooks.sort(function (a, b) { return a.write - b.write || a.date - b.date })
        localStorage.setItem("favoritebooks", JSON.stringify(favoritebooks));
        document.querySelector(".dropdownarea").classList.remove("dropdownareaOver");
        renderLibrary()
    } else return
}

document.querySelector(".dropdownarea").addEventListener("dragenter", handleDragEnter);
function handleDragEnter(event) {
    event.preventDefault()
    event.target.classList.add("dropdownareaOver");
}

document.querySelector(".dropdownarea").addEventListener("dragleave", handleDragLeave);
function handleDragLeave(event) {
    event.preventDefault();
    this.classList.remove("dropdownareaOver");
}


document.querySelector(".dropdownarea").addEventListener("dragover", handleDragOver);
function handleDragOver(event) {
    event.preventDefault()
}

// делегирование draganddrop перенос книг из любимых в общий блок==============================================================

document.querySelector(".listFavoriteBooks").addEventListener("dragstart", handleDragStartFavorite);
function handleDragStartFavorite(event) {
    numBooks = event.target.dataset.number;
    document.querySelector(".dropdownarea").setAttribute("data-block", "block");
}

document.querySelector(".listFavoriteBooks").addEventListener("dragend", handleDragEndFavorite);
function handleDragEndFavorite(event) {
    event.preventDefault();
    document.querySelector(".dropdownarea").classList.remove("dropdownareaOver");
    document.querySelector(".dropdownarea").removeAttribute("data-block");
}

document.querySelector(".dropdownareaBooks").addEventListener("drop", handleFavoriteDrop);
function handleFavoriteDrop(event) {

    if (document.querySelector(".dropdownareaBooks").dataset.block != "block") {
        document.querySelector(".dropdownarea").removeAttribute("data-block");
        document.querySelector(".dropdownareaBooks").classList.remove("dropdownareaOver");
        books.push(favoritebooks[numBooks]);
        deletefavoriteBook(numBooks);
        books = books.sort(function (a, b) { return a.write - b.write || a.date - b.date })
        localStorage.setItem("books", JSON.stringify(books));
        renderLibrary()
    } else return;
}


document.querySelector(".dropdownareaBooks").addEventListener("dragenter", handleDragEnterBooks);
function handleDragEnterBooks(event) {
    event.preventDefault()
    event.target.classList.add("dropdownareaOver");
}

document.querySelector(".dropdownareaBooks").addEventListener("dragleave", handleDragLeaveBooks);
function handleDragLeaveBooks(event) {
    event.preventDefault();
    this.classList.remove("dropdownareaOver");
}

document.querySelector(".dropdownareaBooks").addEventListener("dragover", handleDragOverBooks);
function handleDragOverBooks(event) {
    event.preventDefault()
}






