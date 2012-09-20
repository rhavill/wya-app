var baseUrl = 'http://wya';

// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) { 
  if (typeof data.toPage === "string") {
    var u = $.mobile.path.parseUrl(data.toPage);
    if (u.hash == '#my-friends') {
      loadFriends();
    }
    else if (u.hash == '#my-phone') {
      //displayPhoneLocation();
      //alert('find phone');
    }
    if (u.hash.slice(0, 13) == '#friend-phone') {
      var fid = u.hash.slice(18, u.hash.length);
      getLocation(fid, 'friend-phone-map-canvas');
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
        url: baseUrl + '/rest/user/login.json',
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
        url: baseUrl + '/rest/user/register.json',
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
        url: baseUrl + '/rest/user-relationships/password.json',
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
      url: baseUrl + '/rest/user/logout.json',
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
  var u = $.mobile.path.parseUrl(data.toPage);
});

function listFriends(friends) {
  if (friends.length) {
    $('#friend-list').empty();
    $.each(friends, function(key, value) { 
      $('<li><a href="#friend-phone?fid=' + value.id + '">' + value.name + '</a></li>').appendTo('#friend-list');
    });
    $("#friend-list").listview("refresh");
  }
}

function loadFriends() {
  $.ajax({
    type: "GET",
    url: baseUrl + '/rest/user-relationships.json',
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

function getLocation(uid, elementId) {
  $.ajax({
    type: "GET",
    url: baseUrl + '/rest/location/' + uid + '.json',
    dataType: 'json',
    success: function(location) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(location.updated * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = (minutes > 9) ? minutes : '0' + minutes;
    var seconds = date.getSeconds();
    seconds = (seconds > 9) ? seconds : '0' + seconds;
    var month = date.getMonth();
    var day = date.getDate() + ',';
    var time = months[month] + ' ' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      var element = document.getElementById('friend-geolocation');
      element.innerHTML = '<b>Latitude</b>: ' + location.latitude +
        ' <b>Longitude:</b> ' + location.longitude + '<br />' +
        '<b>Accuracy:</b> ' + location.accuracy + 'm' +
        ' <b>Time:</b> ' + time + '<br />';
      drawGmap(elementId, location.latitude, location.longitude);
      
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var statusCode = jqXHR.statusCode().status;
      alert('Houston, we have a problem trying to get location for ' + uid + ': ' + statusCode + ' ' + errorThrown);        
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
    /*
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    */
  // onSuccess Geolocation
  //
  function watchPositionSuccess(position) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(position.timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = (minutes > 9) ? minutes : '0' + minutes;
    var seconds = date.getSeconds();
    seconds = (seconds > 9) ? seconds : '0' + seconds;
    var month = date.getMonth();
    var day = date.getDate() + ',';
    var time = months[month] + ' ' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    var element = document.getElementById('geolocation');
    element.innerHTML = '<b>Latitude</b>: ' + position.coords.latitude +
      ' <b>Longitude:</b> ' + position.coords.longitude + '<br />' +
      '<b>Accuracy:</b> ' + position.coords.accuracy + 'm' +
      ' <b>Time:</b> ' + time + '<br />';

    $.ajax({
      type: "POST",
      url: baseUrl + '/rest/location.json',
      dataType: 'json',
      data: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        accuracy: position.coords.accuracy,
        updated: Math.round(position.timestamp/1000)
      },
      success: function() {
        drawGmap('my-phone-map-canvas', position.coords.latitude, position.coords.longitude);
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

function drawGmap(elementId, latitude, longitude)  {
    
    var latlng = new google.maps.LatLng(latitude, longitude);
    var myOptions = {
      zoom: 16,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var element = document.getElementById(elementId);
    var map = new google.maps.Map(element,
        myOptions);
    var marker = new google.maps.Marker({
          position: latlng,
          map: map
          //title:""
    });
  }
  //google.maps.event.addDomListener(window,'load', drawGmap);
 