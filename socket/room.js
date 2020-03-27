const SocketIo = require('socket.io');

module.exports = {
  async ativa(http){
    const io = SocketIo(http);
    let usersOn = [];//usuarios conectados
    let salas = [];//salas criadas
    /*
    usersOn{ socket.id => { id : socket.id , name : nomeUsuario } }

    salas = [
    { name : 'nomeSala1', users: [ user1 , user2 ]},
    { name : 'nomeSala2', users: [ user1 , user2 ]},
    { name : 'nomeSala3', users: [ user1 , user2 ]},
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
          socket.join(nomeSala);//conecta socket a sala ela existindo ou não
          let idxSala = salas.findIndex( sala => sala.name == nomeSala);//index da sala, inxSala = -1 se a sala não foi criada
          if(idxSala != -1){//sala existe
            let idxUser = salas[idxSala].users.findIndex( user => user.id == socket.id);//index do usuario
            if(idxUser == -1){
              //adiciona o usuario ao array salas
              salas[idxSala].users.push( usersOn[ socket.id ] );
            }
            socket.emit('usuariosOn',salas[idxSala]);//eniva dados da sala para quem se conectou
            socket.broadcast.to(nomeSala).emit('novo usuario',salas[idxSala]);//informa novo usuario para a sala

          }else{//sala não existe

            let user = usersOn[ socket.id ];
            sala = { name : nomeSala, users : [ user ] };
            salas.push(sala);
            socket.emit('usuariosOn',sala);
          }
      });

      socket.on('menssagem',(m,sala)=>{// @m => menssagem enviada; @sala => nome da sala onde vamos transmitir a menssagem
        let user = usersOn[ socket.id ];
        socket.broadcast.to(sala).emit('menssagem',m,user);
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
