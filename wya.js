// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) { 
  if (typeof data.toPage === "string") {
    var u = $.mobile.path.parseUrl( data.toPage );
    if (u.hash == '#my-friends') {
      loadFriends();
    }
    else if (u.hash == '#login') {
      //alert('login page')
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
  $.ajax({
    type: "GET",
    url: 'https://whereyouat.net/rest/user-relationships.json',
    dataType: 'json',
    success: function(friends) {
      listFriends(friends);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var statusCode = jqXHR.statusCode().status;
      if (statusCode == 401) {
        $.mobile.changePage( "#login"/*, { transition: "slideup"} */);
      }
      else {
        alert('Houston, we have a problem trying to list friends: ' + statusCode + ' ' + errorThrown);        
      }
    }
  });
  
}

$("#loginForm").on("submit",function(e) {
  //disable the button so we can't resubmit while we wait
  $("#submitButton",this).attr("disabled","disabled");
  var u = $("#username", this).val();
  var p = $("#password", this).val();
  if(u != '' && p!= '') {/*
    $.post("https://whereyouat.net/rest/user-relationships/login.json", {username:u,password:p}, function(res) {
      if(res == true) {
        $.mobile.changePage("#my-friends");
      } else {
        navigator.notification.alert("Your login failed", function() {});
      }
      $("#submitButton").removeAttr("disabled");
    },"json");*/
    $.ajax({
      type: "POST",
      url: 'https://whereyouat.net/rest/user/login.json',
      dataType: 'json',
      success: function(friends) {
        alert('login good.');
        //listFriends(friends);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('login bad');
        var statusCode = jqXHR.statusCode().status;
        if (statusCode == 401) {
          $.mobile.changePage( "#login"/*, { transition: "slideup"} */);
        }
        else {
          alert('Houston, we have a problem trying to log in: ' + statusCode + ' ' + errorThrown);        
        }
      }
    });
  }
 return false;
});

function callJSONP(url) {
  if (url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script); 
  }
}
