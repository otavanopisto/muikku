(function() {
  'use strict';
  
   function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = 100;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      
      $('html, body').stop().animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('a.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', false);
        }
      });
    } else {
      $('html, body').stop().scrollTop(scrollTop);
      $('a.active').removeClass('active');
      $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
    }
  }

  $(window).load(function() {
    if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
      scrollToPage(window.location.hash.substring(3), false);
    }
  });
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });

  $(document).ready(function() {
    
    $("#materialsScrollableTOC").perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });
    
    
    
    $(window).data('initializing', true);
    $(document).muikkuMaterialLoader({
      loadAnswers: true,
      workspaceEntityId: $('.workspaceEntityId').val()
    }).muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
        var workspaceMaterialId = $(this).data('workspace-material-id');
        $('a.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
        window.location.hash = 'p-' + workspaceMaterialId;
      }
    }, {
      offset: '60%'
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EXERCISE"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type exercise')
          .text(getLocaleText("plugin.workspace.materialsLoader.exerciseAssignmentLabel"))
      );
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EVALUATED"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type evaluated')
          .text(getLocaleText("plugin.workspace.materialsLoader.evaluatedAssignmentLabel"))
      );
    });
    
    $('.muikku-connect-field').muikkuConnectField('refresh');
    
    $(window).data('initializing', false);
  });
  
  $(window).load(function () {
    // Workspace's material's TOC
    if ($('#workspaceMaterialsTOCWrapper').length > 0) {

      var contentContainer = ($('#contentWorkspaceMaterials').length > 0 ? contentContainer = $('#contentWorkspaceMaterials') : contentContainer = $('#content'));
      var tocWrapper = $('#workspaceMaterialsTOCWrapper');
      var cOffset = contentContainer.offset();
      var tocLeftPos = cOffset.left + contentContainer.width() - tocWrapper.width();
      
      $(tocWrapper).css({
        left:tocLeftPos + 'px'
      })
      
      $(window).resize(function(){
        cOffset = contentContainer.offset();
        tocLeftPos = cOffset.left + contentContainer.width() - tocWrapper.width();
        
        $(tocWrapper).css({
          left:tocLeftPos + 'px'
        })
        
      });
      
      // Prevent page scroll happening if TOC scroll reaches bottom
      $('.workspace-materials-toc-content-inner').on('DOMMouseScroll mousewheel', function(ev) {
        var $this = $(this),
          scrollTop = this.scrollTop,
          scrollHeight = this.scrollHeight,
          height = $this.height(),
          delta = (ev.type == 'DOMMouseScroll' ?
                ev.originalEvent.detail * -40 :
                ev.originalEvent.wheelDelta),
              up = delta > 0;
    
         var prevent = function() {
           ev.stopPropagation();
           ev.preventDefault();
           ev.returnValue = false;
           return false;
         }
    
         if (!up && -delta > scrollHeight - height - scrollTop) {
           // Scrolling down, but this will take us past the bottom.
           $this.scrollTop(scrollHeight);
           return prevent();
         } else if (up && delta > scrollTop) {
           // Scrolling up, but this will take us past the top.
           $this.scrollTop(0);
           return prevent();
          }
      });
    }
  });

  $(document).on('change', '.muikku-field', function (event, data) {
    $(this).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
    var page = $(this).closest('.workspace-materials-view-page');
    var saveButton = $(page).find('.muikku-save-page');
    if (saveButton.length) {
      saveButton
        .removeClass('save-successful')          
        .text(saveButton.data('unsaved-text'));
    }
  });

}).call(this);