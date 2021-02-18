var ww;
var gamecode;

  $(function(){
    $('form').submit(function(event){
      event.preventDefault();
      socket.emit('gamecode',$('#gamecode').val());
      socket.emit('checkuser',$('#username').val());
    });
  });

  socket.on('gc_isavalible', function (boo) {
    if ( boo === '1' ) {
      window.location.href = 'game.html?username='+$('#username').val()+'&gamecode='+$('#gamecode').val();
    }
    else {
      if ($('#gamecode').val() === '') {
      window.location.href = 'game.html?username='+$('#username').val();
      }
      else {window.alert('Gamecode nicht vergeben');}
    }
  });
