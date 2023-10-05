const input = document.getElementById("input-busca");
const key = "7440b68a9ac573a17a7d19a73f62a9d4";
const clientID = "8e977bb2c2e7495395472914f788615d";
const clientSecret = "8cf163d8050f4f6b8542a57b3d493f4d";
const ulElement = document.querySelector(".playlist-caixa");
const liElement = ulElement.querySelectorAll("li");

const videoURLs = [
    './video/ceu azul.mp4',
    './video/chuva.mp4',
    './video/nublado.mp4',
    './video/nuvem.mp4',
    './video/ondas.mp4',
    './video/arranhaceu.mp4',
];

function videoAleatorio(array){
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function recarregaVideoTela(){
    const videoElement = document.querySelector(".video");
    const videoSource = document.getElementById("video-source");
    const randomVideoUrl = videoAleatorio(videoURLs);

    if(videoElement && videoSource){
        videoSource.src = randomVideoUrl;

        videoElement.load();
    }
}

function movimentoInput(inputValue) {
    const visibility = input.style.visibility;

    inputValue && procuraCidade(inputValue);

    visibility === "hidden" ? abrirInput() : fecharInput();
}

function botaoBusca() {
    const inputValue = input.value;

    movimentoInput(inputValue)
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

function mostrarEnvelope() {
    document.querySelector(".envelope").style.visibility = "visible";
    document.querySelector(".caixa").style.alignItems = "end";
    document.querySelector(".procura").style.position = "initial";
}

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        const valorInput = input.value;
        movimentoInput(valorInput)
    }
})

document.addEventListener("DOMContentLoaded", () => {
    fecharInput();
    recarregaVideoTela();
})

async function procuraCidade(city) {
    try {
        const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=pt_br`);

        if (dados.status === 200) {
            const resultado = await dados.json();

            topAlbuns(resultado.sys.country);
            mostraClimaTela(resultado);
            mostrarEnvelope();
            recarregaVideoTela();

        } else {
            throw new Error
        }

    } catch {
     alert("Erro!");
    }
}

function mostraClimaTela(resultado) {
    document.querySelector(".icone-tempo").src = `./assets/${resultado.weather[0].icon}.png`
    document.querySelector(".nome-cidade").innerHTML = `${resultado.name}`;
    document.querySelector(".temperatura").innerHTML = `${resultado.main.temp.toFixed(0)}ºC`;
    document.querySelector(".maxTemperatura").innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}ºC`;
    document.querySelector(".minTemperatura").innerHTML = `min: ${resultado.main.temp_min.toFixed(0)}ºC`;
}

async function acessoToken() {

    const credentials = `${clientID}:${clientSecret}`;
    const encodedCredentials = btoa(credentials);

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${encodedCredentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });
    
    const data = await response.json()
    return data.access_token;
    
}

function dataAtual() {
    const currentDate = new Date();
    const ano = currentDate.getFullYear();
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const dia = currentDate.getDate().toString().padStart(2, "0");

    return `${ano}-${mes}-${dia}`
}


async function topAlbuns(country) {

    try {

        const acessToken = await acessoToken();
        const dataA = dataAtual();
        const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataA}T10%3A00%3A00&limit=3`;

        const resultado = await fetch(`${url}`, {
            headers: {
             "Authorization": `Bearer ${acessToken}`
            },
        });

        if (resultado.status === 200) {
            const data = await resultado.json()
            const result = data.playlists.items.map(item => ({
                name: item.name,
                image: item.images[0].url
            }))

            musicaTela(result);

        } else {
          throw new Error
        }
    } catch {
     alert("Erro na busca de musica!");
    }

}

function musicaTela(dados) {
    liElement.forEach((liElement, index) =>{
        const imgElement = liElement.querySelector("img");
        const pElement = liElement.querySelector("p");

        imgElement.src = dados[index].image;
        pElement.textContent = dados[index].name
    })
}