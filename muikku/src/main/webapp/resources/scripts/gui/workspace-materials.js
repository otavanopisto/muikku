(function() {

  $(document).ready(function() {
    // Workspace Material's page loading
    $('.workspace-materials-view-page').each(function(index, node) {
      var materialType = $(node).data('material-type');
      switch (materialType) {
      case 'html':
        var materialId = $(node).data('material-id');
        mApi().materials.html.read(materialId).callback(
          function (err, html) {
            $(node).html(html.html);
          });
        break;
      case 'folder':
        $(node).append($('<p>').html($(node).data('material-title')));
        break;
      default:
        break;
      }
    });

    // Workspace material's Reading View page loading
    $('.workspace-materials-reading-view-page').each(function(index, node) {
      var materialType = $(node).data('material-type');
      switch (materialType) {
      case 'html':
        var materialId = $(node).data('material-id');
        mApi().materials.html.read(materialId).callback(
          function (err, html) {
            $(node).html(html.html);
          });
        break;
      case 'folder':
        $(node).append($('<p>').html($(node).data('material-title')));
        break;
      default:
        break;
      }
    });

    /* Smooth scrolling in workspace Material's View */
    var $sections = $('.workspace-materials-view-page');

    $sections.each(function() {
      var $section = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $('html, body').stop().animate({
          scrollTop: $section.offset().top - 100
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
    
    /* Smooth scrolling in workspace Material's Reading View */
    var $sections = $('.workspace-materials-reading-view-page');

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

    /* Highlighting toc item at appropriate time when we scroll to the corresponding section */
    $('.workspace-materials-view-page')
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
    
    /* Highlighting toc item at appropriate time when we scroll to the corresponding section - Reading View */
    $('.workspace-materials-reading-view-page')
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

// TODO enable?
//  jsPlumb.ready(function() {
//    $(".muikku-connect-field-table").muikkuConnectField();
//  });

}).call(this);