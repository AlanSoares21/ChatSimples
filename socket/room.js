const SocketIo = require('socket.io');

module.exports = {
  async ativa(http){

    const io = SocketIo(http);
    let usersOn = [];
    let salas = [];
    /*
    salas = [
    { name : 'nome1', users: [ socket1 , socket2 ]},
    { name : 'nome2', users: [ socket1 , socket2 ]},
    { name : 'nome3', users: [ socket1 , socket2 ]},
   ]
    */

    io.on('connection',(socket)=>{

      console.log('no chat um usuario conectou id: '+socket.id);

      socket.on('Nome usuario',(nomeUser)=>{
        user = { id : socket.id , name : nomeUser };
        usersOn.push(user) ;
        //console.log(user);
      });

      //entrando em uma nova sala
      socket.on('sala',(nomeSala)=>{
        socket.join(nomeSala);

        let sala = salas.findIndex( sala => sala.name == nomeSala);
        if(sala != -1){//sala existe

          let user = salas[sala].users.findIndex( user => user.id == socket.id);
          if(user == -1){
            //adiciona o usuario ao array salas
            salas[sala].users.push( usersOn[ usersOn.findIndex(value => value.id == socket.id) ] )
          }

          socket.emit('usuariosOn',salas[sala]);
          socket.broadcast.to(nomeSala).emit('novo usuario',salas[sala]);
        }else{//sala não existe
          //criando sala
          let user = usersOn.findIndex(user => user.id == socket.id);
          sala = { name : nomeSala, users : [ usersOn[user] ] };
          salas.push(sala);
          socket.emit('usuariosOn',sala);
        }


      });

      socket.on('menssagem',(m,sala)=>{// @m => menssagem enviada; @sala => nome da sala onde vamos transmitir a menssagem
        let user = usersOn[ usersOn.findIndex( i => i.id == socket.id) ];
        socket.broadcast.to(sala).emit('menssagem',m,user);
      });


      socket.on('disconnect',()=>{
        let user = usersOn[ usersOn.findIndex( i => i.id == socket.id) ];

        salas.forEach((sala) => {
          var indx = sala.users.findIndex( i => i == user);
          if(indx != -1){
            sala.users.splice(sala.users.indexOf(user), 1);//encontra o indice de user no array e apaga 1 registro
            io.to(sala.name).emit('usuario desconectou',sala,user);//novo formato da sala e os dados do usuario
          }
        });

            usersOn.splice(usersOn.indexOf(user), 1);//encontra o indice de user no array e apaga 1 registro
            console.log('usuario removido '+socket.id);



      });//disconnect

    });//fim do connection

  }
}
