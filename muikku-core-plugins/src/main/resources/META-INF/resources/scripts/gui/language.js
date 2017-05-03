(function() {
  
  function openLanguageSelection() {
    $('.language-selection-container').show();
    $('.language-selection-container').attr('data-visibility-status', 'visible');
  }
  
function closeLanguageSelection() {
  $('.language-selection-container').hide();
  $('.language-selection-container').attr('data-visibility-status', 'hidden');
}
  
  $(document).on('click', '.selected-language', function (event, data) {
    var status = $('.language-selection-container').attr('data-visibility-status');
    if (status == 'hidden') {
      openLanguageSelection();
    } else {
      closeLanguageSelection();  
    }
    
  });

}).call(this);
