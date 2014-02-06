(function() {
  'use strict';
  
  $.widget("custom.muikkuFileField", {
	_create : function() {
      var elementName = this.element.attr("name");	
	  this._uploader = $('<input>')
	    .attr({
	      'type': 'file',	
	      'name': 'file'	
	    })
	    .insertAfter(this.element)
	    .fileupload({
          url: CONTEXTPATH + '/tempFileUploadServlet',
	      autoUpload: true,
	      add: function (e, data) {
	          data.context = $('<div/>').insertAfter(this);
	          data.context.progressbar({
	        	  value: false,
	          });
	          data.submit();
	      },
	      done: function (e, data) {
	    	  console.log(data);
	          data.context.text(data.files[0].name+' uploaded.');
	          $(this).after("<input type='hidden' name='"+elementName+"_type' value='"+data.files[0].type+"'></input>");
	          $(this).after("<input type='hidden' name='"+elementName+"_origName' value='"+data.files[0].name+"'></input>");
	          $(this).after("<input type='hidden' name='"+elementName+"_fileid' value='"+data._response.result.fileId+"'></input>");	          
	      },
	      progress: function (e, data) {
	          var progress = parseInt(data.loaded / data.total * 100, 10);
	          data.context.progressbar( "value", progress );
	      }
	    });
	  
	   this.element.attr('type', 'hidden');
	},
    _destroy : function() {
   
    }
  });
  
  $(document).ready(function(){
    $(".muikku-file-input-field").muikkuFileField();
  });
}).call(this);