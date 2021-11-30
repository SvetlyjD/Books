var radio = document.getElementsByName("option");
let writingForm = document.querySelector(".writingBook");
let loadingForm = document.querySelector(".loadingBook");

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


loadingForm.addEventListener("submit", downloadBook)

function downloadBook(event) {
    event.preventDefault();
    let formdata = new FormData(loadingForm);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://apiinterns.osora.ru/");
    xhr.send(formData);
};



