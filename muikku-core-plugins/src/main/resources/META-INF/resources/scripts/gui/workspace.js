(function() {
  'use strict';

  $(document).ready(function() {
    
    $('#staticNavigationWrapperWorkspace').waypoint('sticky', {
      stuckClass : 'stuckStNav'
    });
  
    var contentContainer = ($('#contentWorkspaceMaterials').length > 0 ? contentContainer = $('#contentWorkspaceMaterials') : contentContainer = $('#content'));
    
    // Workspace navigation
    if ($('#workspaceNavigationWrapper').length > 0) {
  
      var naviWrapper = $('#workspaceNavigationWrapper');
      var cOffset = contentContainer.offset();
      var naviLeftPos = cOffset.left - naviWrapper.width() - 30;
      
      $(naviWrapper).css({
        left:naviLeftPos + 'px'
      })
      
      $(window).resize(function(){
        cOffset = contentContainer.offset();
        naviLeftPos = cOffset.left - naviWrapper.width() - 30;
        naviLeftPos = naviLeftPos < 10 ? naviLeftPos = 10 : naviLeftPos = naviLeftPos;
        
        $(naviWrapper).css({
          left:naviLeftPos + 'px'
        })
  
      });
      
      // Workspace's material's TOC
      if ($('#workspaceMaterialsTOCWrapper').length > 0) {
        
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
  
    }
    
    if ($('.wi-workspace-dock-navi-button-cancel-evaluation'.length > 0)) {
      $('.wi-workspace-dock-navi-button-cancel-evaluation').hide();
    }
   
  });

  $(document).on('click', '.wi-workspace-dock-navi-button-request-evaluation', function (event) {
    confirmEvaluationRequest();
  });
  
  $(document).on('click', '.wi-workspace-dock-navi-button-cancel-evaluation', function (event) {

  });
  
  function confirmEvaluationRequest() {
    renderDustTemplate('workspace/workspace-evaluation-request-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 360,
        dialogClass: "workspace-evaluation-request-confirm-dialog",
        buttons: [{
          'text': dialog.data('button-request-text'),
          'class': 'request-button',
          'click': function(event) {
            $(this).dialog("close");
            $('.wi-workspace-dock-navi-button-request-evaluation').hide();
            $('.wi-workspace-dock-navi-button-cancel-evaluation').show();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }

}).call(this);