const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let usuarios = [];
let mensagens = [];

function pesquisaId(obj, id){
    for (let x = 0; x < obj.length; x++){
        if (obj[x].id == id){
            return x;
        }
    }
    return -1;
}

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    usuarios.push({id: socket.id, nome: "Guest"});
    
    socket.emit("loadUsuarios", usuarios);
    socket.broadcast.emit("usuarioEntrou", usuarios);

    socket.emit("mensagensAnteriores", mensagens);

    socket.on('disconnect', () => {
        console.log(`Socket desconectado: ${socket.id}`);      
        socket.broadcast.emit("usuarioSaiu", socket.id);
        usuarios.splice(pesquisaId(usuarios, socket.id));
    });

    socket.on('updateUsuario', autor => {
        usuarios[pesquisaId(usuarios, socket.id)].nome = autor;
        socket.emit("updateUsuarios", usuarios);
        socket.broadcast.emit("updateUsuarios", usuarios);
    });

    socket.on("enviaMensagem", msg => {
        mensagens.push(msg);
        socket.emit("mensagemRecebida", msg, true);
        socket.broadcast.emit("mensagemRecebida", msg, false);
    });
});

server.listen(3000);