(function() {

  $(document).ready(
      function() {

        // TODO: Re-use in other material scripts
        
        function loadPageNode(node, callback) {
          var workspaceMaterialId = $(node).data('workspace-material-id');
          var materialId = $(node).data('material-id');
          var materialType = $(node).data('material-type');
          
          if (materialType !== 'folder') {
            var typeEndpoint = mApi().materials[materialType];
            if (typeEndpoint != null) {
              typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
                renderDustTemplate('workspace/materials-page.dust',
                    { workspaceMaterialId: workspaceMaterialId,
                      materialId: materialId,
                      id: materialId,
                      type: materialType,
                      data: result 
                    },
                      $.proxy(function (text) {
                  $(this).html(text);
                  
                  callback();
                }, node));
              }, node));
            } else {
              $('.notification-queue').notificationQueue('notification', 'error', "Could not find rest service for " + materialType);
            }
          } else {
            renderDustTemplate('workspace/materials-page.dust', { id: materialId, type: materialType }, $.proxy(function (text) {
              $(this).html(text);
              
              callback();
            }, node));
          }
        }

        function loadPageNodes(selector, node) {
          loadPageNode(node, function() {
            loadPageNodes(selector, $(node).next(selector));
          });
        }
        
        loadPageNodes('.workspace-materials-view-page', $('.workspace-materials-view-page').first());

        // Workspace material's Reading View page loading
        $('.workspace-materials-reading-view-page').each(
            function(index, node) {
              var materialType = $(node).data('material-type');
              switch (materialType) {
              case 'html':
                var materialId = $(node).data('material-id');
                mApi().materials.html.read(materialId).callback(
                    function(err, html) {
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
              scrollTop : $section.offset().top - 100
            }, {
              duration : 500,
              easing : "easeInOutQuad",
              complete : function() {
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
              scrollTop : $section.offset().top - 29
            }, {
              duration : 500,
              easing : "easeInOutQuad",
              complete : function() {
                window.location.hash = hash;
              }
            });
            event.preventDefault();
          });
        });

        /*
         * Highlighting toc item at appropriate time when we scroll to the
         * corresponding section
         */
        $('.workspace-materials-view-page').waypoint(function(direction) {
          var $links = $('a[href="#' + this.id + '"]');
          $links.toggleClass('active', direction === 'down');
        }, {
          offset : '60%'
        }).waypoint(function(direction) {
          var $links = $('a[href="#' + this.id + '"]');
          $links.toggleClass('active', direction === 'up');
        }, {
          offset : function() {
            return -$(this).height() + 250;
          }
        });

        /*
         * Highlighting toc item at appropriate time when we scroll to the
         * corresponding section - Reading View
         */
        $('.workspace-materials-reading-view-page').waypoint(
            function(direction) {
              var $links = $('a[href="#' + this.id + '"]');
              $links.toggleClass('active', direction === 'down');
            }, {
              offset : '60%'
            }).waypoint(function(direction) {
          var $links = $('a[href="#' + this.id + '"]');
          $links.toggleClass('active', direction === 'up');
        }, {
          offset : function() {
            return -$(this).height() + 250;
          }
        });

      });

  // TODO enable?
  // jsPlumb.ready(function() {
  // $(".muikku-connect-field-table").muikkuConnectField();
  // });

}).call(this);