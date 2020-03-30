var salas = [];//salas que o usuario se conectou
/*
  sala = { name : "nome da sala" ,
    users = [
      {id : id1 , name : "nome1"},
      {id : id2 , name : "nome2"},
    ]
  }
*/
function novaSala(sala) {
    salas.push(sala);
    mostraNovaSala(sala.name,sala.users);
}

function mostraNovaSala(nomeSala,membros) {
  //div de uma nova sala
  var nvSala = $('<div />');
  nvSala.addClass('card bg-secondary');
  nvSala.attr('style','width: 18rem;');

  //elemento com o nome da sala
  var nmSala = $('<li />');
  nmSala.addClass("list-group-item active ")
  nmSala.html(nomeSala)

  var ul = $('<ul />');
  ul.addClass("list-group list-group-flush border border-secondary");
  ul.attr('id',nomeSala.replace(" ",""));
  ul.attr('value',nomeSala);

  ul.append(nmSala);

  //inserindo elementos na ul
  for (var c = 0; c < membros.length; c++) {
    addUsuario(ul,membros[c],nomeSala);//adiciona usuario
  }

  nvSala.append(ul);

  nvSala.click((e)=>{
    $('#divMenssagens').html('');
    sessionStorage.setItem('sala',$('#'+nomeSala.replace(" ","")).attr('value'));
    //mostra menssagens
    var  menssagens  = salas[ salas.findIndex(obj => obj.name == $('#'+nomeSala.replace(" ","")).attr('value'))].menssagens;
    console.log(menssagens);
    mostraMenssagens($('#divMenssagens'),menssagens);

  });

  $('#divSalas').append(nvSala);

  sessionStorage.setItem('sala',nomeSala)
  //mostraMenssagens
  $('#divMenssagens').html('');
  var  menssagens  = salas[ salas.findIndex(obj => obj.name == $('#'+nomeSala.replace(" ","")).attr('value'))].menssagens;
  console.log(menssagens);
  mostraMenssagens($('#divMenssagens'),menssagens);
}

function addUsuario(elmt,user,nomeSala) {
  var li = $('<li />');
  li.addClass('list-group-item bg-dark');
  li.attr('id',user.id+""+nomeSala.replace(" ",""));
  li.html(user.name);
  elmt.append(li);
}

function novaMenssagem(men,nomeSala) {//recebe e trata uma menssagem que chegou
  /*
    @men => objeto menssagem;
    @nomeSala => sala onde chegou a menssagem
  */
  let idxSala = salas.findIndex( obj => obj.name == nomeSala );
  salas[idxSala].menssagens.push(men);

  if(nomeSala == sessionStorage.getItem('sala')){
    var div = $('#divMenssagens');
    outrasMenssagens(div,men);
  }else{
    alert('nova menssagem');
  }
}

function minhasMenssagens(div,men) {//adiciona minha menssagem no chat
  /*
    @div =>div onde serão inseridas as menssagens
    @men => objeto menssagem
  */
  var m = $('<div />');
  m.addClass("alert alert-success");
  m.attr('role','alert');
  m.html(men.enviado.name+": "+men.texto);
  div.append(m);
}

function outrasMenssagens(div,men) {//adiciona menssagem de outra pessoa no chat
  /*
    @div =>div onde serão inseridas as menssagens
    @men => objeto menssagem
  */
  var m = $('<div />');
  m.addClass("alert alert-primary");
  m.attr('role','alert');
  m.html(men.enviado.name+": "+men.texto);
  div.append(m);
}

function mostraMenssagens(div,menssagens) {
  /*
    @div => div onde as menssagens serão inseridas
    @menssagens => array com as menssagens que serão tratadas
  */
  menssagens.forEach((men) => {
    console.log(men);
    if(men.enviado.id == sessionStorage.getItem('id')){
      minhasMenssagens(div,men);
    }else{
      outrasMenssagens(div,men);
    }
  });

}
