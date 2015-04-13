
function openInSN(template, result, formFunction) {
  var functionContainer = $('.sn-container');
  var formContainer = $('#mainfunctionFormTabs');

  // temporary solution for removing existing tabs --> TODO: TABBING

  formContainer.empty();

  var openTabs = formContainer.children().length;
  var tabDiv = $("<div class='mf-form-tab' id='mainfunctionFormTab-" + eval(openTabs + 1) + "'>");

  tabDiv.appendTo(formContainer);

  renderDustTemplate(template, result, function(text) {
    $(tabDiv).append($.parseHTML(text));

    var textareas = functionContainer.find("textarea");    
    var cancelBtn = $(tabDiv).find("input[name='cancel']");
    var sendBtn = $(tabDiv).find("input[name='send']");
    var elements = $(tabDiv).find("form");

    $(textareas).each(function(index,textarea){
      
    CKEDITOR.replace(textarea);
      
    });
    
    cancelBtn.on("click", cancelBtn, function() {
      formContainer.empty();
      $('.sn-container').removeClass('open');
      $('.sn-container').addClass('closed');

    });

    sendBtn.on("click", sendBtn, function() {
      var vals = elements.serializeArray();
      var obj = {};
      var varIsArray = {};
      
      if(textareas.length > 0){
        var ckContent =  CKEDITOR.instances.msgContent.getData();
      
      }
      
      elements.find(':input').each(function(index, element) {
        element0r = $(element);

        varIsArray[element.name] = element0r.data('array') || false;
      });

      $.each(vals, function(index, value) {
        if (varIsArray[value.name] != true) {
          
          if(value.name == "content" && textareas.length > 0){
            obj[value.name] = ckContent || '';         
          }else{
            obj[value.name] = value.value || '';   
          }
          
        } else {
          if (obj[value.name] == undefined)
            obj[value.name] = [];

          obj[value.name].push(value.value);
        }
      });

      formFunction(obj);
      formContainer.empty();
      $('.sn-container').removeClass('open');
      $('.sn-container').addClass('closed');

    });

  });

  functionContainer.removeClass('closed');
  functionContainer.addClass('open');

}
