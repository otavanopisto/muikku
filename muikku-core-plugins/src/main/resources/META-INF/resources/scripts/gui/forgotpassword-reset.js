(function() {
  'use strict';
  
  $(document).ready(function () {
    webshim.polyfill('forms');

    $('#password1,#password2').change(function (event) {
      var password1 = $('#password1').val();
      var password2 = $('#password2').val();
      
      if (password1 != password2) {
        $('#password2')[0].setCustomValidity(getLocaleText('plugin.forgotpassword.forgotPasswordDialog.passwordsDontMatch'));
      } else {
        $('#password2')[0].setCustomValidity('');  
      }
    });
    
  });
  
  
}).call(this);
