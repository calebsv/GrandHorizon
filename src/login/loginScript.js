window.addEventListener("load", () => {

    const loader = document.getElementById("loader");
    const app = document.getElementById("app");

    if (loader) loader.style.opacity = "0";

    setTimeout(() => {
        if (loader) loader.remove();
        if (app) app.classList.add("show");
    }, 500);

});

// ---------- Referências dos campos ----------
const form = document.getElementById("form");
const nome = document.getElementById("name");
const email = document.getElementById("email");
const telefone = document.getElementById("Telefone");
const pagamento = document.getElementById("pagamento");
const days = document.getElementById("days");
const people = document.getElementById("people");
const hospedagem = document.getElementById("hospedagem");

// ---------- Utilitário: mostra/limpa mensagem de erro sem alterar o layout ----------
function setError(campo, mensagem) {
    const box = campo.closest(".input-box");
    if (!box) return;

    // remove mensagem antiga, se existir (ela fica logo APÓS o input-box, não dentro dele)
    const antigo = box.nextElementSibling;
    if (antigo && antigo.classList.contains("error-msg")) {
        antigo.remove();
    }

    if (mensagem) {
        box.style.borderColor = "#ff4d4d";

        const span = document.createElement("small");
        span.className = "error-msg";
        span.textContent = mensagem;
        span.style.color = "#ff4d4d";
        span.style.display = "block";
        span.style.width = "100%";
        span.style.margin = "-8px 0 8px";
        span.style.fontSize = "0.75rem";

        // insere como irmão, depois do input-box, sem alterar o flex interno dele
        box.insertAdjacentElement("afterend", span);
    } else {
        box.style.borderColor = "";
    }
}

// ---------- Validações individuais ----------
function validarNome() {
    const valor = nome.value.trim();
    if (valor.length < 3) {
        setError(nome, "Informe seu nome completo (mín. 3 caracteres).");
        return false;
    }
    setError(nome, "");
    return true;
}

function validarEmail() {
    const valor = email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(valor)) {
        setError(email, "Informe um e-mail válido.");
        return false;
    }
    setError(email, "");
    return true;
}

function validarTelefone() {
    const valor = telefone.value.replace(/\D/g, "");
    if (valor.length < 10 || valor.length > 11) {
        setError(telefone, "Informe um telefone válido (DDD + número).");
        return false;
    }
    setError(telefone, "");
    return true;
}

function validarSelect(campo, nomeCampo) {
    if (!campo.value) {
        setError(campo, `Selecione ${nomeCampo}.`);
        return false;
    }
    setError(campo, "");
    return true;
}

// ---------- Máscara simples de telefone enquanto digita ----------
telefone.addEventListener("input", () => {
    let v = telefone.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (v.length > 0) {
        v = v.replace(/(\d{0,2})/, "($1");
    }
    telefone.value = v;
});

// ---------- Validação em tempo real (ao sair do campo) ----------
nome.addEventListener("blur", validarNome);
email.addEventListener("blur", validarEmail);
telefone.addEventListener("blur", validarTelefone);
pagamento.addEventListener("change", () => validarSelect(pagamento, "a forma de pagamento"));
days.addEventListener("change", () => validarSelect(days, "o período de hospedagem"));
people.addEventListener("change", () => validarSelect(people, "a quantidade de hóspedes"));
hospedagem.addEventListener("change", () => validarSelect(hospedagem, "o tipo de hospedagem"));

// ---------- Envio do formulário ----------
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const validacoes = [
        validarNome(),
        validarEmail(),
        validarTelefone(),
        validarSelect(pagamento, "a forma de pagamento"),
        validarSelect(days, "o período de hospedagem"),
        validarSelect(people, "a quantidade de hóspedes"),
        validarSelect(hospedagem, "o tipo de hospedagem"),
    ];

    const formularioValido = validacoes.every(Boolean);

    if (!formularioValido) {
        const primeiroErro = form.querySelector(".error-msg");
        if (primeiroErro) {
            primeiroErro.closest(".input-box").scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
    }

    // Formulário válido: aqui entraria o envio real (fetch/AJAX) para o backend.
    mostrarMensagemSucesso("Reserva solicitada com sucesso! Em breve entraremos em contato.");

    form.reset();
    form.querySelectorAll(".input-box").forEach((box) => (box.style.borderColor = ""));
});

// ---------- Mensagem de sucesso temporária (some após 5 segundos) ----------
function mostrarMensagemSucesso(texto) {
    // remove mensagem anterior, se ainda estiver visível
    const antiga = document.getElementById("success-msg");
    if (antiga) antiga.remove();

    const msg = document.createElement("p");
    msg.id = "success-msg";
    msg.textContent = texto;
    msg.style.color = "#2ecc71";
    msg.style.background = "rgba(46, 204, 113, 0.12)";
    msg.style.border = "1px solid #2ecc71";
    msg.style.borderRadius = "8px";
    msg.style.padding = "10px 14px";
    msg.style.marginTop = "16px";
    msg.style.textAlign = "center";
    msg.style.fontSize = "0.9rem";
    msg.style.opacity = "0";
    msg.style.transition = "opacity 0.3s ease";

    form.insertAdjacentElement("afterend", msg);

    // força o fade-in
    requestAnimationFrame(() => {
        msg.style.opacity = "1";
    });

    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 300); // aguarda o fade-out antes de remover
    }, 5000);
}