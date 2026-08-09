window.addEventListener("load", () => {

    const loader = document.getElementById("loader");
    const app = document.getElementById("app");

    loader.style.opacity = "0";

    setTimeout(() => {

        loader.remove();
        app.classList.add("show");

    }, 500);

});


let LoginBtn = document.getElementById("Login-btn")

LoginBtn.addEventListener("click", function () {


    let nome = document.getElementById("name")
    let email = document.getElementById("email")
    let Telefone = document.getElementById("Telefone")
    let password = document.getElementById("password")

    nome.value = ""
    email.value = ""
    Telefone.value = ""
    password.value = ""

})






