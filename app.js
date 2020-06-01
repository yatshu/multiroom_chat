//importar as configurações dos servidor
var app = require('./config/server');

//parametrizar a porta de escuta
var port = 3000;
var server = app.listen(port, function(){
    console.log('Servidor online porta %s',port);
});

//o socket esta na mesma porta que o servidor
var io = require('socket.io').listen(server);

app.set('io',io); //criar variavel global io com lavor io

//on() alguem ouvindo
//emit() falando

/*
on('nome',function(data){})
Ouvindo pedidos de execução

emit('nome',{})
Pedido para executar alguma ação

*/
//criar a conexão por websocket
io.on('connection',function(socket){
    console.log('Usuário conectou');

    //desconectar quando sair da pagina, deixa a conexao websoclet
    socket.on('disconnect',function(){
        console.log('Usuario desconectou');
    });

    socket.on('msgParaServidor', function(data){
        
        // DIALOGO
        //para enviar para nossa tela
        socket.emit(
            'msgParaCliente', 
            {apelido: data.apelido, mensagem:data.mensagem}
        );
        
        //para enviar para todos os usuarios menos apra mim utiliza o broadcast
        socket.broadcast.emit(
            'msgParaCliente', 
            {apelido: data.apelido, mensagem:data.mensagem}
        );


        //PARTICIPANTES
        if(parseInt(data.apelido_atualizado_nos_clientes) == 0){
            //para enviar para nossa tela
            socket.emit(
                'participantesParaCliente', 
                {apelido: data.apelido}
            );
            
            //para enviar para todos os usuarios menos apra mim utiliza o broadcast
            socket.broadcast.emit(
                'participantesParaCliente', 
                {apelido: data.apelido}
            );
        }
    });


}); //por padrao 'connection' que pesquisa quando uma tentaticva é feita pelo lado do cliente