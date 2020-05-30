var socket = io('http://localhost:3000');

function loadUsuario(usr) {
    console.log(socket.id);
    document.getElementById("listaUsuarios").innerHTML += `<div id='${usr.id}' class='mensagem ${usr.id==socket.id?"autor":""}'>${usr.nome}</div>`;
}
function loadUsuarios(users) {
    document.getElementById("listaUsuarios").innerHTML = "";
    for (user of users) {
        loadUsuario(user);
    }
}
function addMensagem(data, eu) {
    document.getElementById("mensagens").innerHTML += `<div class='mensagem ${eu ? "autor" : ""}'><h5>${data.hora}</h5><div class='msg'><h3>${data.autor}</h3> ${data.mensagem}</div>`;
    updateScroll("mensagens");
}
function updateScroll(div){
    var element = document.getElementById(div);
    element.scrollTop = element.scrollHeight;
}

socket.on("usuarioEntrou", usr => {
    console.log(usr);
    loadUsuarios(usr);
});

socket.on("loadUsuarios", usuarios => {
    for (usuario of usuarios){
        loadUsuario(usuario);
    }
});

socket.on("updateUsuarios", usuarios => {
    loadUsuarios(usuarios);
});

socket.on("usuarioSaiu", usuario => {
    document.getElementById(usuario).outerHTML = "";
});

socket.on("mensagemRecebida", (msg, eu) => {
    addMensagem(msg, eu);
});

socket.on("mensagensAnteriores", mensagens => {
    for (msg of mensagens) {
        console.log(msg);
        addMensagem(msg, false);
    }
});

document.getElementById("mensagemContainer").onsubmit = event => {
    event.preventDefault();

    var autor = document.getElementById("autor");
    var msg = document.getElementById("mensagem");

    if (autor.value != "") {
        socket.emit("updateUsuario", autor.value);
    }
    socket.emit("enviaMensagem", {id: socket.id, autor: autor.value, mensagem: msg.value, hora: new Date()});
};