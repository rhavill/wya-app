// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) { 
  if ( typeof data.toPage === "string" ) {
    var u = $.mobile.path.parseUrl( data.toPage );
    if (u.hash == '#my-friends') {
      loadFriends();
    }
    else if (u.hash == '#login') {
      alert('login page')
    }
    //e.preventDefault();
  }
});

$(document).ready(function () {
  if (location.hash == '' || location.hash == '#my-friends') {
    loadFriends();
  }
});

function listFriends(friends) {
  $.each(friends, function(key, value) { 
  alert(value.rid); 
  });
}

function loadFriends() {
  alert('geting friends..');
  callJSONP('http://wya/rest/user-relationships.jsonp?callback=listFriends');
}

function callJSONP(url) {
  if (url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script); 
  }
}
/*
$(document).bind( 'pageinit',function(event,data){
  alert( 'page init was called' );
  $("#msg").css("border","3px solid red");  
  if ( typeof data.toPage === "string" ) {
    alert(data.toPage);
  }
});
$( document ).bind( "pagebeforeload", function( event, data ){
  alert( 'pagebeforeload');
});
$( document ).bind( 'pagebeforecreate',function(event){
  alert( 'pagebeforecreate was called' );
});
$( document ).bind( 'pagecreate',function(event){
  alert( 'pagecreate was called' );
});
*/
