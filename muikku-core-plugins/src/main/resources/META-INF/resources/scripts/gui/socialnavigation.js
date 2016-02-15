  function openInSN(template, result, formSendFunction, formContentFunction, cke) {
  var functionContainer = $('.sn-container');
  var formContainer = $('#mainfunctionFormTabs');
  var ck = cke;
  // temporary solution for removing existing tabs --> TODO: TABBING

  formContainer.empty();
 
  var openTabs = formContainer.children().length;
  var tabDiv = $("<div class='mf-form-tab' id='mainfunctionFormTab-" + eval(openTabs + 1) + "'>");

  tabDiv.appendTo(formContainer);

  renderDustTemplate(template, result, function(text) {
    $(tabDiv).append($.parseHTML(text));
    var ckeditor = ck;
    var textareas = functionContainer.find("textarea");    
    var textfields = functionContainer.find("input[type='text']"); 
    var cancelBtn = $(tabDiv).find("input[name='cancel']");
    var sendBtn = $(tabDiv).find("input[name='send']");
    var elements = $(tabDiv).find("form");
    
    // Discussion - TODO: replace with formParameters 
    if(result != null && result.actionType == "edit"){
      var editableContent = result.message;
      var topic = result.title;
      
      $(textfields).each(function(index,textfield){        
        $(textfield).val(topic);
      });  
      
    }
    // Getting existing content 



     if(ckeditor == undefined){
       var ckeditor = true;
     }
     
     if(ckeditor == true){
     
        $(textareas).each(function(index,textarea){
          
          // This does not work 100%! This needs to be replaced in discussions!!
          
          $(textarea).val(editableContent);
          
          CKEDITOR.replace(textarea, {
            height : '100px',
            entities: false,
            entities_latin: false,
            entities_greek: false,
            toolbar: [
                      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
                      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
                      { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                      { name: 'links', items: [ 'Link' ] },
                      { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
                      { name: 'styles', items: [ 'Format' ] },
                      { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                      { name: 'tools', items: [ 'Maximize' ] }
                    ]
          });

        });
     }

     
    // Selects current forum area when new message form loads
    var selArea = $("#discussionAreaSelect").val();
    
    if (selArea != "all") {
      $("#forumAreaIdSelect option")
      .prop('selected', false)
      .filter('[value="' + selArea + '"]')
      .prop('selected', true);
    }
    
    // Form functions a done here, so all the form content is loaded this allows us to use CKEDITOR.setdata from the mainfunction
    
    if (formContentFunction != undefined){
      formContentFunction();
    }
    
    cancelBtn.on("click", cancelBtn, function() {
      formContainer.empty();
      $('.sn-container').removeClass('open');
      $('.sn-container').addClass('closed');
      
      adjustContentMargin();
    });

    
    sendBtn.on("click", sendBtn, function() {

      var vals = elements.serializeArray();
      var obj = {};
      var varIsArray = {};
      var ckContent = null;
      // TODO: Remove this hack
      if (CKEDITOR.instances.textContent) {
        ckContent = CKEDITOR.instances.textContent.getData();
      } else if (CKEDITOR.instances.length > 0) {
        ckContent = CKEDITOR.instances[0].textContent.getData();
      }

      elements.find(':input').each(function(index, element) {
        element0r = $(element);
        varIsArray[element.name] = element0r.data('array') || false;
      });

      $.each(vals, function(index, value) {
        
        if (varIsArray[value.name] != true) {
          
          if (value.name == "content" || value.name == "message" && textareas.length > 0) {
            obj[value.name] = ckContent || '';         
          } else {
            obj[value.name] = value.value || '';   
          }
          
        } else {
          if (!$.isArray(obj[value.name])) {
            obj[value.name] = [];
          }
          obj[value.name].push(value.value);
        }
      });

      var result = formSendFunction(obj);
      if (result !== false) {
        formContainer.empty();
        $('.sn-container').removeClass('open');
        $('.sn-container').addClass('closed');
        adjustContentMargin();
      }

    });


  });

  functionContainer.removeClass('closed');
  functionContainer.addClass('open');
  adjustContentMargin();
}

// TODO: create more sophisticated fix for content area's bottom margin adjustment when social navigation is opened  
function adjustContentMargin() {
  if ($('.sn-container.open').length > 0) {
  
    if ($("#content").length > 0) {
      $("#content").css({
        "margin-bottom" : "320px"
      });
    }
    
  } else {
    if ($("#content").length > 0) {
      $("#content").css({
        "margin-bottom" : 0
      });
    }
  }
  
}
