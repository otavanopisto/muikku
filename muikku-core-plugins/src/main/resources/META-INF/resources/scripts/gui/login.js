(function() {
  
  $(document).ready(function () {

    // LoginBox effect and stuff
	$("div.bt-login").click(function () {
	  $("div.bt-login").addClass('bt-login-active');
	  $(".loginWidgetWrapper").show( 200 , function() {
		  $(document).bind('click', function(){
		   	$(".loginWidgetWrapper").hide( 100 , function(){
		   	  $("div.bt-login").removeClass('bt-login-active');
              $(document).unbind('click');  
		   	});
		  });
		  $(".loginWidgetWrapper").bind('click', function(e){
        //return false;
			  e.stopPropagation();
		  });
	  });
	});
	  
  });

}).call(this);