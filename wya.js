// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.
	if ( typeof data.toPage === "string" ) {
		var u = $.mobile.path.parseUrl( data.toPage );
		if (u.hash == '#my-friends') {
			loadFriends();
                }
		else if (u.hash == '#login') {
			alert('login page')
		}
//			e.preventDefault();
	}
});
$(document).ready(function () {
  loadFriends();
});
function loadFriends() {
  alert('get friends..');
  callJSONP('http://wya/rest/user-relationships.jsonp?callback=whatNow');
/*
  var req = $.ajax({
    url: 'http://wya/rest/user-relationships',
    dataType: 'xml'
    //data: data,
    success: function (data, textStatus, jqXHR) {
	alert('success');
    } ,
    error: function (jqXHR, textStatus, errorThrown) {
 	alert('error');
    } 
  });
  req.done(function(msg) {
    alert( msg );
  });

  req.fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus );
  });
*/
}

function listFriends(a,b) {
  alert('list friends');
}

function callJSONP(url) {
  if (url) {
    var script = document.createElement('script');
    script.src = url;
     
    // append the script in the document body. 
    // As per on-deman script behaviour as soon as you add the script to 
    // the document,the script will be execute and the web service will 
    // be called.
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
