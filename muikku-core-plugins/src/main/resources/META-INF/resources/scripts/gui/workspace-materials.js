(function() {

  $(document).ready(function() {
    // Workspace material's page loading
    $('.workspace-material-page').each(function(index, node) {
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

    // Workspace material's page loading in reading view    
    $('.workspace-material-reading-view-page').each(function(index, node) {
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

    /* Rather fancy and smooth scrolling of links between sections */
    var $sections = $('.workspace-material-page');

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

    /* Highlighting toc item at appropriate time when we scroll to the corresponding section */
    $('.workspace-material-page')
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