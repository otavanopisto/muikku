(function() {
  
  $(document).ready(function() {
    // Workspace Material's page loading
    $('.workspace-material-reading-view-page').each(function(index, node) {
      var materialId = $(node).data('material-id');
      var materialType = $(node).data('material-type');
      
      if (materialType !== 'folder') {
        var typeEndpoint = mApi().materials[materialType];
        if (typeEndpoint != null) {
          typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
            renderDustTemplate('workspace/materials-management-page.dust', { id: materialId, type: materialType, data: result }, $.proxy(function (text) {
              $(this).html(text);
            }, node));
          }, node));
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', "Could not find rest service for " + materialType);
        }
      } else {
        renderDustTemplate('workspace/materials-management-page.dust', { id: materialId, type: materialType }, $.proxy(function (text) {
          $(this).html(text);
        }, node));
      }
    });

    /* Smooth scrolling in workspace Material's Reading View */
    var $sections = $('.workspace-material-reading-view-page');

    $sections.each(function() {
      var $section = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $('html, body').stop().animate({
          scrollTop: $section.offset().top - 29
        },{
          duration: 500,
          easing : "easeInOutQuad",
          complete: function() {
            window.location.hash = hash;
          }
        });
        event.preventDefault();
      });
    });

    /* Highlighting toc item at appropriate time when we scroll to the corresponding section - Reading View */
    $('.workspace-material-reading-view-page')
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'down');
      }, {
        offset: '60%'
      })
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'up');
      }, {
        offset: function() {
          return -$(this).height() + 250;
        }
      });
    
  });
  
}).call(this);