var socket = io('http://localhost:3000');

function renderizaMensagem(data) {
    document.getElementById("mensagens").innerHTML += `<p><strong>${data.autor}</strong>: ${data.mensagem}</p>`;
}

socket.on("mensagensAnteriores", msgs => {
    for (msg of msgs){
        renderizaMensagem(msg);
    }
});

socket.on("mensagemRecebida", msg => {
    renderizaMensagem(msg);
});

document.getElementById("chat").onsubmit = event => {
    event.preventDefault();

    var autor = document.getElementsByName("txbNome")[0].value;
    var mensagem = document.getElementsByName("txbMensagem")[0].value;

    if (autor.length && mensagem.length){
        var msgObjeto = {
            autor: autor,
            mensagem: mensagem
        };

        renderizaMensagem(msgObjeto);
        socket.emit('enviarMensagem', msgObjeto);
    }
};