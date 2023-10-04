const key = "7440b68a9ac573a17a7d19a73f62a9d4";

const input = document.getElementById("input-busca");

function botaoBusca() {
    const inputValue = input.value;

    movimentoInput()
}

function fecharInput() {
    input.style.visibility = "hidden";
    input.style.width = "40px";
    input.style.padding = "0.5rem 0.5rem 0.5rem 2.6rem";
    input.style.transition = "all 0.5s ease-in-out 0s";
    input.value = "";
}

function abrirInput() {
    input.style.visibility = "visible";
    input.style.width = "300px";
    input.style.padding = "0.5rem 0.5rem 0.5rem 3.1rem";
    input.style.transition = "all 0.5s ease-in-out 0s";
    input.value = "";
}

function movimentoInput(inputValue) {
    const visibility = input.style.visibility;

    inputValue && procuraCidade(inputValue);

    visibility === "hidden" ? abrirInput() : fecharInput();
}

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        const valorInput = input.value;
        movimentoInput(valorInput)
    }
})

document.addEventListener("DOMContentLoaded", () => {
    fecharInput();
})

async function procuraCidade(city) {
    try {

        const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=pt_br`);

        if (dados.status === 200) {

            const resultado = await dados.json()

            mostraClimaTela(resultado)
            console.log(resultado, "<<")
        } else {
            throw new Error
        }

    } catch {
        alert("Erro!");
    }
}

function mostraClimaTela(resultado){
    document.querySelector(".icone-tempo").src = `./assets/${resultado.weather[0].icon}.png`
    document.querySelector(".nome-cidade").innerHTML = `${resultado.name}`;
    document.querySelector(".temperatura").innerHTML = `${resultado.main.temp.toFixed(0)}ºC`;
    document.querySelector(".maxTemperatura").innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}ºC`;
    document.querySelector(".minTemperatura").innerHTML = `min: ${resultado.main.temp_min.toFixed(0)}ºC`;
}