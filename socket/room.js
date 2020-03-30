const SocketIo = require('socket.io');

module.exports = {
  async ativa(http){
    const io = SocketIo(http);
    let usersOn = [];//usuarios conectados
    let salas = [];//salas criadas
    /*
    usersOn{ socket.id => { id : socket.id , name : nomeUsuario } }

    salas = [
      { name : 'nomeSala1',
        menssagens:[ { texto: "texto1", enviado : { id : user.id name : user.name } }  ] ,
        users: [ user1 , user2 ]
      },
   ]
    */

    io.on('connection',(socket)=>{

      console.log('no chat um usuario conectou id: '+socket.id);

      // insere o nome do usuario e coloca ele no usersOn; @nomeUser => string
      socket.on('Nome usuario',(nomeUser)=>{
        user = { id : socket.id , name : nomeUser };
        usersOn[socket.id] = user ;
      });

      // conecta o usuario a sala que deseja entrar; @nomeSala => string
      socket.on('sala',(nomeSala)=>{
          socket.join(nomeSala);
          //index da sala, inxSala = -1 se a sala não foi criada
          let idxSala = salas.findIndex( sala => sala.name == nomeSala);

          if(idxSala == -1){
            const user = usersOn[ socket.id ];
            sala = { name : nomeSala, menssagens: [ { texto : "Criado hoje", enviado:{ id : user.id , name : "Sistema"}} ], users : [ user ] };
            salas.push(sala);
            socket.emit('usuariosOn',sala);
          }else{
            let idxUser = salas[idxSala].users.findIndex( user => user.id == socket.id);
            if(idxUser == -1){
              //adiciona o usuario ao array salas
              salas[idxSala].users.push( usersOn[ socket.id ] );
            }
            socket.emit('usuariosOn',salas[idxSala]);//eniva dados da sala para quem se conectou
            socket.broadcast.to(nomeSala).emit('novo usuario',salas[idxSala]);//informa novo usuario para a sala
          }

      });

      socket.on('menssagem',(m,nomeSala)=>{
        /*
         @m => menssagem enviada;
         @nomeSala => nome da sala onde vamos transmitir a menssagem
        */
        let user = usersOn[ socket.id ];

        //guardando a menssagem enviada no array salas.sala.menssagens
        let sala = salas[ salas.findIndex( obj => obj.name == nomeSala )];
        let menssagem = { texto : m, enviado : user };
        sala.menssagens.push(menssagem);
        //enviando a menssagem para os usuarios
        socket.broadcast.to(nomeSala).emit('menssagem',menssagem,nomeSala);
      });


      socket.on('disconnect',()=>{
        let user = usersOn[ socket.id ];
        salas.forEach((sala) => {
          if(sala.users.findIndex( i => i == user) != -1){
            sala.users.splice(sala.users.indexOf(user), 1);//encontra o indice de user no array e apaga 1 registro
            io.to(sala.name).emit('usuario desconectou',sala,user);//novo formato da sala e os dados do usuario
          }
        });
        usersOn.splice(usersOn.indexOf(user), 1);//encontra o indice de user no array e apaga 1 registro
        console.log('usuario se desconectou '+socket.id);
      });//disconnect

    });//fim do connection

  }
}
