

// Script desenvolvido por: Rafael Iacillo Soares
// utilizado em um envento da Semana Nacional de Ciencia e Tecnologia na escolha FAETEC
// proponente: Professora Fernada Souza, clube de ciencias da escola
// Data de desenvolvimento: 2019-10-23
// Versão: 1.0
// Conteúdo javascript abordado: 
// >> Funções, Funções de callback, Arrays, Objetos, Desestruturação, 
// >> localStorage, JSON.parse(), JSON.stringify(), gerar PDF com html2pdf.js

const arquivo = 'urna'
const logo = 'img/faetec.png'
const opcoes = ['boa','regular','ruim']
const emojis = ['&#128512;','&#128533;','&#129298;','&#128525;']
const botoes = [...document.querySelectorAll(".votar")]
const baixar = document.querySelector(".baixar")

const dados = JSON.parse(localStorage.getItem(arquivo)) || {total:0,boa:0,regular:0,ruim:0}

function votar(opcao){
    if(opcoes.indexOf(opcao)!=-1){
        dados[opcao] = dados[opcao] + 1
        dados.total = dados.total + 1
        gravar()
        return true
    }else{
        return false
    }
}
function gravar(dados){
    localStorage.setItem(arquivo,JSON.stringify(dados))
}
function getPorcentagem(opcao){
    if(opcoes.indexOf(opcao)!=-1){
        const total = dados.total
        if(total>0){
            const porcentagem = (dados[opcao] / total) * 100
            return porcentagem.toFixed(2)
        }else{
            return 0
        }
    }else{
        return 0
    }
}
function getPorcentagens(){
    const porcentagens = {
        boa:getPorcentagem('boa'),
        regular:getPorcentagem('regular'),
        ruim:getPorcentagem('ruim')
    }
    return porcentagens
}
function getVencedor({boa,regular,ruim}){
    if(ruim >= boa && ruim >= regular) return 'ruim'
    if(regular >= boa && regular >= ruim) return 'regular'
    if(boa >= regular && boa >= ruim) return 'boa'

}
function atualizarPorcentagens(){
    const info = document.querySelector(".info")
    const {boa,regular,ruim} = getPorcentagens()
    const conteudo = `<B>BOA:</B>${boa}% | <B>REGULAR:</B>${regular}% | <B>RUIM:</B>${ruim}%`
    info.innerHTML = conteudo

}
function atualizarDisplay(){
    const display = document.querySelector(".resultado")
    display.innerHTML = capitalize(getVencedor(dados))
}
function capitalize(texto){
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

botoes.map((botao,i)=>botao.addEventListener("click",evt=>{
    const titulo = `<h1><img width='150px' src='${logo}'></h1>`
    const mensagem = `Você observa que a qualidade do ar de Volta Redonda é:
    <br><b>${capitalize(opcoes[i])} ${emojis[i]} </b>
    <br>
    <br>Obrigado pela sua opinião! ${emojis[3]}`
    votar(opcoes[i])
    gravar(dados)
    atualizarPorcentagens()
    atualizarDisplay()
    showMessage(titulo,mensagem)
}))
window.addEventListener("load",evt=>{
    botoes.map((botao,i)=>botao.innerHTML = `${emojis[i]} ${capitalize(opcoes[i])}`)
    atualizarPorcentagens()
    atualizarDisplay()
})

// MODAL
const modal = document.querySelector(".fade-modal")
const okModal = document.querySelector("#modal .action button")

function toggleModal(){
    modal.classList.toggle("hide-modal")
}
function showMessage(titulo="Mensagem",msg){
    document.querySelector("#modal .barra-titulo").innerHTML = titulo
    document.querySelector("#modal p").innerHTML = msg
    toggleModal()
}

okModal.addEventListener("click",
    (evt) => {toggleModal()}
)



//GERAR PDF
function atualizarRelatorio(dados){
    const data = document.querySelector("#date")
    const descricao = document.querySelector("#descricao")
    const qtd = document.querySelector("#qtd")
    const pqtd = document.querySelector("#p-qtd")
    const boa = document.querySelector("#boa")
    const pboa = document.querySelector("#p-boa")
    const regular = document.querySelector("#regular")
    const pregular = document.querySelector("#p-regular")
    const ruim = document.querySelector("#ruim")
    const pruim = document.querySelector("#p-ruim")

    const agora = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric',weekday: 'long'} ).format(new Date())
    const paragrafo = `O Sistema de Votação de Opinião foi utilizado durante 
    os 2(dois) dias de visitação da Semana Nacional de Ciência e Tecnologia na FAETEC ETE Amaury César Vieira, coletando as opiniões dos visitantes que se dispuseram a responder a pergunta: <b>"Como está a qualidade do ar em Volta Redonda?",</b> escolhendo uma das 3(três) opções apresentadas <b>Boa</b>, <b>Regular</b> ou <b>Ruim</b>. Os resultados obtidos foram compilados e estão apresentados abaixo.`

    data.innerHTML = agora
    descricao.innerHTML = paragrafo
    qtd.innerHTML = dados.total
    pqtd.innerHTML = `100.00 %`
    boa.innerHTML = dados.boa
    pboa.innerHTML = `${getPorcentagem('boa')} %`
    regular.innerHTML = dados.regular
    pregular.innerHTML = `${getPorcentagem('regular')} %`
    ruim.innerHTML = dados.ruim
    pruim.innerHTML = `${getPorcentagem('ruim')} %`



}


baixar.addEventListener("click",evt=>{
    gerarPDF()
})

async function gerarPDF(){
    atualizarRelatorio(dados)
    const relatorio = document.querySelector(".relatorio")
    relatorio.classList.remove("hide")
    const options = {
        margin: [10,10,10,10],
        filename: 'relatorio.pdf',
        html2canvas: {
            scale: 2,
        },
        jsPDF: {
            unit:'mm', 
            format:'a4' ,
            orientation:'portrait',
        }
    }
    await html2pdf().set(options).from(relatorio).save()
    relatorio.classList.add("hide")
    
}

