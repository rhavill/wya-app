// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) { 
  if (typeof data.toPage === "string") {
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
  if (friends.length) {
    $('#friend-list').empty();
    $.each(friends, function(key, value) { 
      $('<li><a href="' + value.id + '">' + value.name + '</a></li>').appendTo('#friend-list');
    });
    $("#friend-list").listview("refresh");
  }
}

function loadFriends() {
  //callJSONP('https://whereyouat.net/rest/user-relationships.jsonp?callback=listFriends');
  $.ajax({
    type: "GET",
    url: 'https://whereyouat.net/rest/user-relationships.json',
    dataType: 'json',
    success: function(friends) {
      listFriends(friends);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert(textStatus);
    }
  });
  
  //var req = $.ajax({
  //  url : 'http://whereyouat.net/rest/user-relationships.jsonp',
  //  dataType : "jsonp",
  //  timeout : 10000000
  //});
  //
  //req.success(function() {
  //  alert('Yes! Success!');
  //});
  //
  //req.error(function(jqXHR, textStatus, errorThrown) {
  //  alert('Oh noes!');
  //});
/*
$.jsonp({
  url: 'http://whereyouat.net/rest/user-relationships.jsonp',
  data: {
    "lang" : "en-us",
    "format" : "json",
    "tags" : "sunset"
  },
  dataType: "jsonp",
  callbackParameter: "listFriends",
  timeout: 5000,
  success: function(data, status){
    //$.each(data.items, function(i,item){
    //    $("<img>").attr("src", (item.media.m).replace("_m.","_s."))
    //              .attr("alt", item.title)
    //              .appendTo("ul#flickr")
    //              .wrap("<li><a href=\"" + item.link + "\"></a></li>");
    //    if (i == 9) return false;
    //});
  },
  error: function(XHR, textStatus, errorThrown){
      alert("ERREUR: " + textStatus);
      alert("ERREUR: " + errorThrown);
  }
    });  
*/
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
