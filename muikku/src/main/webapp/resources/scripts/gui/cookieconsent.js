(function() {
  'use strict';
  var consent = getCookie("muikkuConcent");
  if(consent != "accepted"){
    var block = document.createElement("div");
    block.setAttribute("id", "ConcentDiv");
    /*change to class and create class in css*/
    block.style.cssText="position:fixed; bottom:0; z-index: 1000; width:100%; height:30px; background: linear-gradient(to bottom, #fda726 0%, #ed8e00 100%);";
    
    var text = document.createElement("p");
    var node = document.createTextNode("Please agree to accept our Cookies! They is tasty and usefull!");
    /*change to class and create class in css*/
    text.style.cssText="float: left; color:white; margin:5px 30px 5px 200px;";
    text.appendChild(node);
    block.appendChild(text);
    
    var button = document.createElement("button");
    button.innerHTML = 'Accept';
    button.setAttribute("id", "ConcentBtn");
    /*change to class and create class in css*/
    button.style.cssText="position:fixed; right:400px; bottom:5px; width:80px; height; 20px; background:#3aa569; color:white; border:0;";
    button.onclick = function(){
      setCookie("muikkuConcent", "accepted",30);
      var check = getCookie("muikkuConcent");
      if(check == "accepted"){
      document.getElementById("ConcentDiv").remove();
      }
      else
        {
      windows.alert("Cookie has not been set. Check your browser.");  
      }
    };
    block.appendChild(button);
    document.body.insertBefore(block, document.body.firstChild);
  }
}).call(this);

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return null;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}