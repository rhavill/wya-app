// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) { 
  if (typeof data.toPage === "string") {
    var u = $.mobile.path.parseUrl(data.toPage);
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
  $("#loginForm").on("submit",function(e) {
    //disable the button so we can't resubmit while we wait
    $("#submitButton",this).attr("disabled","disabled");
    var u = $("#username", this).val();
    var p = $("#password", this).val();
    if(u != '' && p!= '') {
      $.ajax({
        type: "POST",
        url: 'https://whereyouat.net/rest/user/login.json',
        dataType: 'json',
        data: {
          username: u,
          password: p
        },
        success: function() {
          $("#submitButton").removeAttr("disabled");
          $.mobile.changePage("#my-friends");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var statusCode = jqXHR.statusCode().status;
          alert('Houston, we have a problem trying to log in: ' + statusCode + ' ' + errorThrown);
          $("#submitButton").removeAttr("disabled");
        }
      });
    }
    return false;
  });
});

$(document).bind("pageinit", function( e, data ) { 
  $('.logout').click(function() {
    $.ajax({
      type: "POST",
      url: 'https://whereyouat.net/rest/user/logout.json',
      dataType: 'json',
      success: function() {
        $.mobile.changePage("#login");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var statusCode = jqXHR.statusCode().status;
        if (statusCode == 406) {
          $.mobile.changePage("#login");
        }
        else {
          alert('Houston, we have a problem trying to log out: ' + statusCode + ' ' + errorThrown);
        }
      }
    });
  });
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
        $.mobile.changePage("#login");
      }
      else {
        alert('Houston, we have a problem trying to list friends: ' + statusCode + ' ' + errorThrown);        
      }
    }
  });
  
}

function callJSONP(url) {
  if (url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script); 
  }
}
