function novaSala(sala) {
  /*
  sala = { name : "nome da sala" ,
  users = [
  {id : id1 , name : "nome1"},
  {id : id2 , name : "nome2"},
]}
  */
    //div de uma nova sala
    var nvSala = $('<div />');
    nvSala.addClass('card bg-secondary');
    nvSala.attr('style','width: 18rem;');

    //elemento com o nome da sala
    var nmSala = $('<li />');
    nmSala.addClass("list-group-item active ")
    nmSala.html(sala.name)

    var ul = $('<ul />');
    ul.addClass("list-group list-group-flush border border-secondary");
    ul.attr('id',sala.name.replace(" ",""));

    ul.append(nmSala);

    //inserindo elementos na ul
    for (var c = 0; c < sala.users.length; c++) {
      addUsuario(ul,sala.users[c],sala.name);
    }

    nvSala.append(ul);

    nvSala.click((e)=>{
      sessionStorage.setItem('sala',sala.name)
      $('#divMenssagens').html('');
    });

    $('#divSalas').append(nvSala);
    sessionStorage.setItem('sala',sala.name)
    $('#divMenssagens').html('');

}

function addUsuario(elmt,user,nomeSala) {
  var li = $('<li />');
  li.addClass('list-group-item bg-dark');
  li.attr('id',user.id+""+nomeSala.replace(" ",""));
  li.html(user.name);
  elmt.append(li);
}

function montaMenssagem(m,user) {

}
