/* global moment */

(function() { 'use strict';

  $.widget("custom.workspaceTeachers", {
    options: {
    },
    _create : function() {
      var workspaceEntityId = $('.workspaceEntityId').val();

      this.element.on('click', '.workspace-teacher-info.sendmessage', $.proxy(this._sendMessage, this));
      
      $(document)
        .muikkuMaterialLoader({
          workspaceEntityId: workspaceEntityId,
          baseUrl: $('.materialsBaseUrl').val()
        })
        .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));
      
      mApi().workspace.workspaces.materialProducers
        .read(workspaceEntityId).callback(function (err, materialProducers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            renderDustTemplate('workspace/workspace-index-material-producers.dust', {
              materialProducers: materialProducers
            }, $.proxy(function (text) {
              $('.workspace-frontpage-footer').append($.parseHTML(text));
            }, this));
          }
        });
      mApi().workspace.workspaces
        .read(workspaceEntityId).callback($.proxy(function (err, workspace) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var materialLicenseIcons = [];
            if (workspace.materialDefaultLicense && workspace.materialDefaultLicense.includes('creativecommons.org')) {
              materialLicenseIcons.push('cc');
              if (workspace.materialDefaultLicense.includes('creativecommons.org/licenses/')) {
                var license = workspace.materialDefaultLicense.match('creativecommons.org/licenses/(.*)/')[1];
                if (license) {
                  if (license.includes('by')) {
                    materialLicenseIcons.push('cc-by');
                  }
                  if (license.includes('nc')) {
                    materialLicenseIcons.push('cc-nc');
                  }
                  if (license.includes('nd')) {
                    materialLicenseIcons.push('cc-nd');
                  }
                  if (license.includes('sa')) {
                    materialLicenseIcons.push('cc-sa');
                  }
                }
              }
              else if (workspace.materialDefaultLicense.includes('creativecommons.org/publicdomain/')) {
                materialLicenseIcons.push('cc-zero');
              }
            }
            renderDustTemplate('workspace/workspace-index-material-license.dust', {
              materialDefaultLicense: workspace.materialDefaultLicense,
              materialLicenseIcons: materialLicenseIcons
            }, $.proxy(function (text) {
              $('.workspace-frontpage-footer').prepend($.parseHTML(text));
            }, this));
          }
        }, this));
      
      // #1813: Workspace teachers
      
      mApi().user.staffMembers.read({
        workspaceEntityId: workspaceEntityId,
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end'
      }).callback(function (err, staffMembers) {
        if (!err && staffMembers) {
          staffMembers.sort(function(a, b) {
            var an = a.lastName + ' ' + a.firstName;
            var bn = b.lastName + ' ' + b.firstName;
            return an < bn ? -1 : an == bn ? 0 : 1;
          });
          for (var i = 0; i < staffMembers.length; i++) {
            var props = staffMembers[i].properties;
            if (props['profile-vacation-start'] && props['profile-vacation-end']) {
              var bd = moment(props['profile-vacation-start']).toDate();
              bd.setHours(0);
              bd.setMinutes(0)
              bd.setSeconds(0)
              bd.setMilliseconds(0);
              var ed = moment(props['profile-vacation-end']).toDate();
              ed.setHours(0);
              ed.setMinutes(0)
              ed.setSeconds(0)
              ed.setMilliseconds(0);
              var nd = new Date();
              nd.setHours(0);
              nd.setMinutes(0)
              nd.setSeconds(0)
              nd.setMilliseconds(0);
              if (nd >= bd && nd <= ed) {
                props['profile-vacation-period'] = bd.getTime() == ed.getTime() ? formatDate(bd) : formatDate(bd) + ' - ' + formatDate(ed);
              }
            }
          }
          renderDustTemplate('workspace/workspace-frontpage-teachers.dust', {
            staffMembers: staffMembers
          }, $.proxy(function (text) {
            $('.workspace-teachers-container').append($.parseHTML(text));
          }, this));
        }
      });
      
      if ($('.workspace-announcements-container').length > 0) {

        $('.workspace-announcements-container').on('click', '.workspace-single-announcement', function() {
          var href = $(this).attr('data-href');
          window.location.assign(href);
        });
    
        mApi().announcer.announcements
          .read({ hideEnvironmentAnnouncements: true, workspaceEntityId: workspaceEntityId })
          .callback($.proxy(function(err, result) {
            if (err) {
              $(".notification-queue").notificationQueue('notification','error', err);
            } else {
              var baseUrl = $('.announcementsBaseUrl').val();
    
              for (var i=0; i<result.length; i++) {
                result[i].link = baseUrl + "?announcementId=" + result[i].id;
              }
              
              renderDustTemplate('workspace/workspace-frontpage-announcements.dust', result, $.proxy(function (text) {
                var element = $(text);
                $('.workspace-announcements-container').append(element);
                $('.workspace-announcements-container').perfectScrollbar({"suppressScrollY" : true});
              }, this));
            }
          }, this));
      }
    },
    _sendMessage: function (event) {
      var teacherId = $(event.target).closest(".workspace-teacher").attr("data-id");

      mApi().user.users.basicinfo.read(teacherId, {}).callback($.proxy(function (err, staffMember) {
        if (!err && staffMember) {
          var options = {
            groupMessagingPermission: false,
            isStudent: true,
            userRecipients: [staffMember]
          };
          
          var dialog = $('<div>')
            .communicatorCreateMessageDialog($.extend(options||{}, {
              groupMessagingPermission: this.options.groupMessagingPermission
            }));
          
          dialog.on('dialogReady', function(e) {
            $(document.body).css({
              paddingBottom: dialog.height() + 50 + 'px'
            }).addClass('footerDialogOpen');
          });
          
          dialog.on('dialogClose', function(e) {
            $(document.body).removeClass('footerDialogOpen').removeAttr('style');
          });
          
          $('#socialNavigation')
            .empty()
            .append(dialog);
        }
      }, this));
    }
  });

  $(document).ready(function() {
    $('.workspace-teachers-container').workspaceTeachers({
    });
  });

}).call(this);