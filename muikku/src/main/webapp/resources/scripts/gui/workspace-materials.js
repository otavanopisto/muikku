(function() {

  'use strict';

  $(document).ready(function() {
    $(document).muikkuMaterialLoader()
      .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    // Smooth scrolling in workspace Material's View 
    var $sections =$('.workspace-materials-view-page');

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

    // Highlighting toc item at appropriate time when we scroll to the
    // corresponding section

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
  });

  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    
    page.find('.muikku-field').each(function (index, field) {
      reply.push({
        value: $(field).muikkuField('answer'),
        embedId: $(field).muikkuField('embedId'),
        materialId: $(field).muikkuField('materialId'),
        fieldName: $(field).muikkuField('fieldName')
      });
    });
    
    mApi().workspace.workspaces.materials.replies.create(workspaceEntityId, workspaceMaterialId, {
      answers: reply
    })
    .callback(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while saving field replies " + err);
      }
    });
  });

//  $(document).ready(
//      
//      function() {
//
//     // TODO: Re-use in other material scripts
//        function fixTables(node) {
//          var $tables = node.find("table");
//          
//          $tables.each(function() {
//            var $table = $(this);
//            
//            var padding = ($table.attr("cellpadding") !== undefined ? $table.attr("cellpadding") : 0);
//            var margin = ($table.attr("cellspacing") !== undefined ? $table.attr("cellspacing") : 0);
//            var border = ($table.attr("border") !== undefined ? $table.attr("border") : 0);
//            var width = $table.attr("width") !== undefined ? $table.attr("width") + "px;" : "auto;";
//            var bgcolor = $table.attr("bgcolor") !== undefined ? $table.attr("bgcolor") : "transparent;";
//            
//            if ($table.attr("style") !== undefined) {
//              var origStyle = $table.attr("style");
//              $table.attr("style", "width:" + width + "border:" + border + "px solid #000;" + "border-spacing:" + margin + "px; " + origStyle + "background-color:" + bgcolor);  
//            } else {
//              $table.attr("style", "width:" + width + "border:" + border + "px solid #000;" + "border-spacing:" + margin + "px; " + "background-color:" + bgcolor);  
//            }
//            
//            $table.removeAttr("border width cellpadding cellspacing bgcolor");
//             
//            var $tds = $table.find("td");
//            $tds.each(function(){
//              var $td = $(this);
//              var bgcolor = $td.attr("bgcolor") !== undefined ? $td.attr("bgcolor") : "transparent;";
//              var width = $td.attr("width") !== undefined ? $td.attr("width") + "px; " : "auto;";
//              var valign = $td.attr("valign") !== undefined ? $td.attr("valign") : "middle;";
//              $td.attr("style", "vertical-align:" + valign + "width:" + width + "padding:" + padding + "px;" + "border:" + border + "px solid #000;" + "background-color:" + bgcolor);
//              
//              $td.removeAttr("border width bgcolor valign");
//
//            });
//            
//          });
//          
//        }
//        
//        // TODO: Re-use in other material scripts
//        function loadPageNode(node, callback) {
//          var workspaceMaterialId = $(node).data('workspace-material-id');
//          var materialId = $(node).data('material-id');
//          var materialType = $(node).data('material-type');
//          
//          if (materialType !== 'folder') {
//            var typeEndpoint = mApi().materials[materialType];
//            if (typeEndpoint != null) {
//              typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
//                renderDustTemplate('workspace/materials-page.dust',
//                    { workspaceMaterialId: workspaceMaterialId,
//                      materialId: materialId,
//                      id: materialId,
//                      type: materialType,
//                      data: result 
//                    },
//                      $.proxy(function (text) {
//                  $(this).html(text);
//                  fixTables($(this));
//                  callback();
//                }, node));
//              }, node));
//            } else {
//              $('.notification-queue').notificationQueue('notification', 'error', "Could not find rest service for " + materialType);
//              
//              callback();
//            }
//          } else {
//            renderDustTemplate('workspace/materials-page.dust', { id: materialId, type: materialType }, $.proxy(function (text) {
//              $(this).html(text);
//              
//              callback();
//            }, node));
//          }
//        }
//
//        function loadPageNodes(selector, node) {
//          loadPageNode(node, function() {
//            var next = $(node).nextAll(selector).first();
//            if (next.length > 0) {
//              loadPageNodes(selector, next);
//            }
//          });
//        }
//        
//        loadPageNodes('.workspace-materials-view-page', $('.workspace-materials-view-page').first());
//
//        // Workspace material's Reading View page loading
//        $('.workspace-materials-reading-view-page').each(
//            function(index, node) {
//              var materialType = $(node).data('material-type');
//              switch (materialType) {
//              case 'html':
//                var materialId = $(node).data('material-id');
//                mApi().materials.html.read(materialId).callback(
//                    function(err, html) {
//                      $(node).html(html.html);
//                    });
//                break;
//              case 'folder':
//                $(node).append($('<p>').html($(node).data('material-title')));
//                break;
//              default:
//                break;
//              }
//            });
//
//        /* Smooth scrolling in workspace Material's View */
//        var $sections = $('.workspace-materials-view-page');
//
//        $sections.each(function() {
//          var $section = $(this);
//          var hash = '#' + this.id;
//
//          $('a[href="' + hash + '"]').click(function(event) {
//            $('html, body').stop().animate({
//              scrollTop : $section.offset().top - 100
//            }, {
//              duration : 500,
//              easing : "easeInOutQuad",
//              complete : function() {
//                window.location.hash = hash;
//              }
//            });
//            event.preventDefault();
//          });
//        });
//
//        /* Smooth scrolling in workspace Material's Reading View */
//        var $sections = $('.workspace-materials-reading-view-page');
//
//        $sections.each(function() {
//          var $section = $(this);
//          var hash = '#' + this.id;
//
//          $('a[href="' + hash + '"]').click(function(event) {
//            $('html, body').stop().animate({
//              scrollTop : $section.offset().top - 29
//            }, {
//              duration : 500,
//              easing : "easeInOutQuad",
//              complete : function() {
//                window.location.hash = hash;
//              }
//            });
//            event.preventDefault();
//          });
//        });
//
//        /*
//         * Highlighting toc item at appropriate time when we scroll to the
//         * corresponding section
//         */
//        $('.workspace-materials-view-page').waypoint(function(direction) {
//          var $links = $('a[href="#' + this.id + '"]');
//          $links.toggleClass('active', direction === 'down');
//        }, {
//          offset : '60%'
//        }).waypoint(function(direction) {
//          var $links = $('a[href="#' + this.id + '"]');
//          $links.toggleClass('active', direction === 'up');
//        }, {
//          offset : function() {
//            return -$(this).height() + 250;
//          }
//        });
//
//        /*
//         * Highlighting toc item at appropriate time when we scroll to the
//         * corresponding section - Reading View
//         */
//        $('.workspace-materials-reading-view-page').waypoint(
//            function(direction) {
//              var $links = $('a[href="#' + this.id + '"]');
//              $links.toggleClass('active', direction === 'down');
//            }, {
//              offset : '60%'
//            }).waypoint(function(direction) {
//          var $links = $('a[href="#' + this.id + '"]');
//          $links.toggleClass('active', direction === 'up');
//        }, {
//          offset : function() {
//            return -$(this).height() + 250;
//          }
//        });
//
//      });

  // TODO enable?
  // jsPlumb.ready(function() {
  // $(".muikku-connect-field-table").muikkuConnectField();
  // });

}).call(this);