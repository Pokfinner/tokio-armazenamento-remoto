const express = require('express');
const app = express();

// Aceitar codificação do HTML
app.use(express.urlencoded({ extended: false }));

let arrayLivros = [
    { id: 1, nome: "Osteopatia", autor: "Dr. Manuel Afonso de Araújo" },
    { id: 3, nome: "HTML, CSS and JavaScript", autor: "Kymin Medoni" },
    { id: 2, nome: "Anatomia & Fisiologia", autor: "Seeley Stephens Tale" }
]

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/livros", (req, res) => {
    res.sendFile(__dirname + "/livros.html");
});

app.get("/livros/lista", (req, res) => {

    let html = "Bom dia <b>Diogo!</b>";

    html += `<br><br>`
    arrayLivros.forEach(livro => {
        html += `Nome: ${livro.nome}`
        html += `Autor: ${livro.autor}`
        html += `<br>`
    })
    html += `<br>`

    html += `<a href="/livros"> Voltar </a>`

    res.send(html)
});

app.get("/livros/adicionar", (req, res) => {
    res.sendFile(__dirname + "/adicionar-livro.html");
});

app.get("/livros/pesquisar", (req, res) => {

    let html = ""
    html += `<form method="GET">
            <input name="nome" type="text" placeholder="Nome do Livro">
            <input type="submit" value="Pesquisar"></form>
        <a href="/livros"> Voltar </a>`

    let nomePesquisado = req.query.nome
    let livrosFiltrados = [...arrayLivros]

    if (nomePesquisado)
    {
        livrosFiltrados = arrayLivros.filter(
            livro => livro.nome.toLowerCase().includes(nomePesquisado.toLowerCase()))
    }

    livrosFiltrados.forEach(livro => {
        html += `Nome: ${livro.nome}`
        html += `Autor: ${livro.autor}`
        html += `<br>`
    })

    res.send(html);
});

let obterUltimoId = () => {

    let arrayOrdenado = arrayLivros.sort((a, b) => {

        if(a.id > b.id) return 1
        else if(a.id < b.id) return -1
        else return 0

    })

    let ultimoElemento = arrayOrdenado[arrayOrdenado.length - 1]
    let ultimoId = ultimoElemento.id + 1

    console.log(ultimoId)

    res.send(`${ultimoId}`)

}

app.post("/livros/adicionar", (req, res) => {

    let nome = req.body.nome;
    let autor = req.body.autor;

    arrayLivros.push({ id: obterUltimoId(), nome: nome, autor: autor })

    res.send(`Livro Inserido. <br> <a href="/livros"> Voltar </a>`);

});

app.get("/livros/:livroId", (req, res) => {

    let livroId = req.params.livroId

    let livroEncontrado = arrayLivros.find(livro => livro.id == livroId)

    if (livroEncontrado)
    {
        res.send(`Livros do detalhe ${JSON.stringify(livroEncontrado)}`)
    }
    else
    {
        res.status(404).send(`Livro não encontrado.`)
    }

});

app.get("*", (req, res) => {
    res.status(404).send("Página 404");
});



app.listen(4000, () => console.log(`Listening on port 4000...`));