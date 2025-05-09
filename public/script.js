// função para salvar um usuário
function salvarUsuario() {
    const nome = document.getElementById("nome").value;

    fetch("http://localhost:3000/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    })
    .then(res => res.json())
    .then(() => listarUsuarios()); // atualiza a lista de usuários
}

// função para listar usuários cadastrados
function listarUsuarios() {
    fetch("http://localhost:3000/usuarios")
    .then(res => res.json())
    .then(usuarios => {
        const lista = document.getElementById("listaUsuarios");
        lista.innerHTML = ""; // limpa a lista antes de preencher

        usuarios.forEach(user => {
            const li = document.createElement("li");
            li.textContent = user.nome;
            lista.appendChild(li);
        });
    });
}

// busca os usuários backend e exibe na lista
function carregarUsuarios() {
    fetch("http://localhost:3000/usuarios")
    .then(response => response.json())
    .then(usuarios => {
        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        usuarios.forEach(usuario => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.innerHTML = `
            ${usuario.nome}
            <div>
            <button class="btn btn-outline-warning btn-sm me-2" onclick="editarUsuario(${usuario.id}, '${usuario.nome}')">
                <i class="bi bi-pencil-square fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deletarUsuario(${usuario.id})">
                <i class="bi bi-trash fs-6"></i>
            </button>
            </div>
        `;
        lista.appendChild(li);
        });
    })
    .catch(error => console.error("Erro ao carregar usuários:", error));
}

// lida com o envio do formulário para salvar ou editar usuário
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const mensagem = document.getElementById("mensagem");

    // verifica se o campo nome foi preenchido
    if (!nome) {
    mensagem.textContent = "Por favor, digite um nome!";
    mensagem.style.color = "red";
    mensagem.style.display = "block";
    setTimeout(() => mensagem.style.display = "none", 3000);
    return;
    }

    const url = id ? `http://localhost:3000/editar/${id}` : "http://localhost:3000/salvar";
    const metodo = id ? "PUT" : "POST";

    fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome })
    })
    .then(response => response.json())
    .then(data => {
        mensagem.textContent = data.mensagem;
        mensagem.style.color = "green";
        mensagem.style.display = "block";
        setTimeout(() => mensagem.style.display = "none", 3000);

        document.getElementById("id").value = "";
        document.getElementById("nome").value = "";

        carregarUsuarios();
    })
    .catch(error => console.error("Erro ao salvar:", error));
});

function editarUsuario(id, nome) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
}

function deletarUsuario(id) {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
    fetch(`http://localhost:3000/deletar/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
        alert(data.mensagem);
        carregarUsuarios();
        })
        .catch(error => console.error("Erro ao remover usuário:", error));
    }
}

carregarUsuarios();

// carregar usuários ao iniciar a página
listarUsuarios();