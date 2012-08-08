
// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) { 
  if (typeof data.toPage === "string") {
    var u = $.mobile.path.parseUrl(data.toPage);
    if (u.hash == '#my-friends') {
      loadFriends();
    }
    else if (u.hash == '#my-phone') {
      //displayPhoneLocation();
      alert('find phone');
    }
    //e.preventDefault();
  }
});

$(document).ready(function () {
  //navigator.geolocation.getCurrentPosition(onSuccess, onError);
  // Throw an error if no update is received every 50 minutes // 30 seconds
  //var options = { timeout: 3000000 };
  var options = { timeout: 30000 };
  watchID = navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionError, options);      

  if (location.hash == '' || location.hash == '#my-friends') {
    loadFriends();
  }
  $("#loginForm").on("submit",function(e) {
    //disable the button so we can't resubmit while we wait
    $("#loginSubmitButton",this).attr("disabled","disabled");
    var u = $("#username", this).val();
    var p = $("#password", this).val();
    if(u != '' && p != '') {
      $.ajax({
        type: "POST",
        url: 'https://whereyouat.net/rest/user/login.json',
        dataType: 'json',
        data: {
          username: u,
          password: p
        },
        success: function() {
          $("#loginSubmitButton").removeAttr("disabled");
          $.mobile.changePage("#my-friends");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var statusCode = jqXHR.statusCode().status;
          alert('Houston, we have a problem trying to log in: ' + statusCode + ' ' + errorThrown);
          $("#loginSubmitButton").removeAttr("disabled");
        }
      });
    }
    return false;
  });

  $('#registerForm').on("submit",function(e) {
    //disable the button so we can't resubmit while we wait
    $("#registerSubmit",this).attr("disabled","disabled");
    var resgisterUsername = $("#resgisterUsername", this).val();
    var registerEmail = $("#registerEmail", this).val();
    if(resgisterUsername != '' && registerEmail != '') {
      $.ajax({
        type: "POST",
        url: 'https://whereyouat.net/rest/user/register.json',
        dataType: 'json',
        data: {
          account: {
            name: resgisterUsername,
            mail: registerEmail
          }
        },
        success: function() {
          $("#registerSubmit").removeAttr("disabled");
          alert('Contratulations, you have registered. Please check your email for more information.');
          $.mobile.changePage("#login");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var statusCode = jqXHR.statusCode().status;
          $("#registerSubmit").removeAttr("disabled");
          alert('Houston, we have a problem trying to register: ' + statusCode + ' ' + stripTags(errorThrown));
        }
      });
    }
    //e.preventDefault();
    return false;
  });

  $('#passwordForm').on("submit",function(e) {
    //disable the button so we can't resubmit while we wait
    $("#passwordSubmit",this).attr("disabled","disabled");
    var name = $("#passwordRequestName", this).val();
    if(name != '') {
      $.ajax({
        type: "POST",
        url: 'https://whereyouat.net/rest/user-relationships/password.json',
        dataType: 'json',
        data: {
          name: name
        },
        success: function() {
          $("#passwordSubmit").removeAttr("disabled");
          alert('Please check your email for instructions to help you set your password.');
          $.mobile.changePage("#login");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var statusCode = jqXHR.statusCode().status;
          $("#registerSubmit").removeAttr("disabled");
          alert('Houston, we have a problem with the password request: ' + statusCode + ' ' + stripTags(errorThrown));
        }
      });
    }
    return false;
  });

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

$(document).bind("pageinit", function( e, data ) {
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

function stripTags(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

function callJSONP(url) {
  if (url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script); 
  }
}

 // Wait for Cordova to load
    //
    //document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

  // onSuccess Geolocation
  //
  function watchPositionSuccess(position) {
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
      'Longitude: '          + position.coords.longitude             + '<br />' +
      'Altitude: '           + position.coords.altitude              + '<br />' +
      'Accuracy: '           + position.coords.accuracy              + '<br />' +
      'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
      'Heading: '            + position.coords.heading               + '<br />' +
      'Speed: '              + position.coords.speed                 + '<br />' +
      'Timestamp: '          + position.timestamp                    + '<br />';
      
    $.ajax({
      type: "POST",
      url: 'https://whereyouat.net/rest/location.json',
      dataType: 'json',
      data: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        accuracy: position.coords.accuracy,
        // todo: submit real timestamp updated: Math.round(position.timestamp)
        updated: 123455

      },
      success: function() {
        //alert('sent location');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var statusCode = jqXHR.statusCode().status;
        /*
        if (statusCode == 406) {
          $.mobile.changePage("#login");
        }
        else {*/
          alert('Houston, we have a problem trying to submit location: ' + statusCode + ' ' + errorThrown);
        //}
      }
    });
      
  }

// onError Callback receives a PositionError object
//
function watchPositionError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

                            
function displayPhoneLocation() {
  
}