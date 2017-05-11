function openInSN(template, options, formSendFunction, formContentFunction) {
  var functionContainer = $('.sn-container');
  var formContainer = $('#mainfunctionFormTabs');

  formContainer.empty();
 
  var openTabs = formContainer.children().length;
  var tabDiv = $("<div class='mf-form-tab' id='mainfunctionFormTab-" + eval(openTabs + 1) + "'>");

  tabDiv.appendTo(formContainer);

  renderDustTemplate(template, options, function(text) {
    $(tabDiv).append($.parseHTML(text));
    var textareas = functionContainer.find("textarea");    
    var textfields = functionContainer.find("input[type='text']"); 
    var cancelBtn = $(tabDiv).find("input[name='cancel']");
    var sendBtn = $(tabDiv).find("input[name='send']");
    var elements = $(tabDiv).find("form");
    
    // #2821: Prevent form submit when pressing enter in a text field 
    $(textfields).each(function(index, field) {
      $(field).on('keypress', function(event) {
        if (event.keyCode == 13) {
          event.preventDefault();
        }
      });
    });
    
    // Discussion - TODO: replace with formParameters 
    if (options != null && options.actionType == "edit") {
      var editableContent = options.message;
      var topic = options.title;
      $(textfields).each(function(index,textfield){        
        $(textfield).val(topic);
      });  
    }

    $(textareas).each(function(index,textarea) {
      $(textarea).val(editableContent);
      if (options && options.draftKey) {
        CKEDITOR.plugins.addExternal('notification', '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.8/');
        CKEDITOR.plugins.addExternal('change', '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js');
        CKEDITOR.plugins.addExternal('draft', '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js');
        CKEDITOR.replace(textarea, {
          language: getLocale(),
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
          ],
          extraPlugins : 'notification,change,draft',
          draftKey: options.draftKey
        });
      }
      else {
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
      }
    });
     
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
      if ($.isFunction(formContentFunction)) {
        formContentFunction();
      }
      else if (formContentFunction.quote == true) {
        CKEDITOR.instances.textContent.setData('<blockquote><p><strong>' + formContentFunction.quoteAuthor + '</strong></p>' + formContentFunction.quoteContent + '</blockquote><p></p>');         
      }
    }
    
    cancelBtn.on("click", cancelBtn, function() {
      if (CKEDITOR.instances.textContent && CKEDITOR.instances.textContent.config.draftKey) {
        CKEDITOR.instances.textContent.discardDraft();
      }
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
      }
      else if (CKEDITOR.instances.length > 0) {
        ckContent = CKEDITOR.instances[0].textContent.getData();
      }

      elements.find(':input').each(function(index, element) {
        varIsArray[element.name] = $(element).data('array') || false;
      });

      $.each(vals, function(index, value) {
        if (varIsArray[value.name] != true) {
          if (value.name == "content" || value.name == "message" && textareas.length > 0) {
            obj[value.name] = ckContent || '';         
          }
          else {
            obj[value.name] = value.value || '';   
          }
        }
        else {
          if (!$.isArray(obj[value.name])) {
            obj[value.name] = [];
          }
          obj[value.name].push(value.value);
        }
      });

      var result = formSendFunction(obj);
      if (result !== false) {
        if (CKEDITOR.instances.textContent && CKEDITOR.instances.textContent.config.draftKey) {
          CKEDITOR.instances.textContent.discardDraft();
        }
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
      $("#content").css({"margin-bottom" : "320px"});
    }
  }
  else {
    if ($("#content").length > 0) {
      $("#content").css({"margin-bottom" : 0});
    }
  }
  
}
