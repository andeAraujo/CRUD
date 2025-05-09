// importa os módulos necessários
const express = require("express"); // framework para criar o servidor
const sqlite3 = require("sqlite3").verbose(); // banco de dados SQLite
const cors = require("cors"); // permite requisições entre frontend e backend
const bodyParser = require("body-parser"); // middleware para processar JSON

// incializa o servidor express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// conectar ao bando de dados SQLite
const db = new sqlite3.Database("meusite.db", err => {
    if (err) console.error("Erro ao conectar ao SQLite:",err);
    else console.log("Banco de dados SQLite conectado!");
});

// criar a tabela 'usuarios' se não existir
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)");
    console.log("Tabela 'usuarios' verificada/criada com sucesso.")
});

// rota para salvar um novo usuário (rota POST)
app.post("/salvar", (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ mensagem: "Nome é obrigatório!" });

    const sql = "INSERT INTO usuarios (nome) VALUES (?)";
    db.run(sql, [nome], function (err) {
        if (err) {
            console.error("Erro ao inserir:", err);
            return res.status(500).json({ mensagem: "Erro ao salvar no banco."});
        }
        res.json({ mensagem: "Nome salvo com sucesso!", id: this.lastID });
    });
});

// rota para listar todos os usuários (rota GET)
app.get("/usuarios", (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar usuários:",err);
            return res.status(500).json({ mensagem: "Erro ao buscar usuários." });
        }
        res.json(rows);
    });
});

// atualizar um usuário (rota PUT)
app.put("/editar/:id", (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ mensagem: "Nome é obrigatório!"});

    const sql = "UPDATE usuarios SET nome = ? WHERE id = ?";
    db.run(sql, [nome, id], function (err) {
        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json({ mensagem: "Erro ao atualizar usuário."});
        }
        res.json({ mensagem: "Usuário atualizado com sucesso!"});
    });
});

// remover um usuário (rota DELETE)
app.delete("/deletar/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.run(sql, [id], function (err) {
        if (err) {
            console.error("Erro ao excluir usuário:", err);
            return res.status(500).json({ mensagem: "Erro ao excluir usuário."});
        }
        res.json({ mensagem: "Usuário excluído com sucesso!"});
    });
});

// inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});