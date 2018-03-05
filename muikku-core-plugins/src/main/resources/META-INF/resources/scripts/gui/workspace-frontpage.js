/* global moment */

/* String.prototype.includes polyfill.
   Copyright Mathias Bynens <https://mathiasbynens.be/>

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */
/*! https://mths.be/includes v1.0.0 by @mathias */
if (!String.prototype.includes) {
  (function() {
    'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
    var toString = {}.toString;
    var defineProperty = (function() {
      // IE 8 only supports `Object.defineProperty` on DOM elements
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var indexOf = ''.indexOf;
    var includes = function(search) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      if (search && toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var position = arguments.length > 1 ? arguments[1] : undefined;
      // `ToInteger`
      var pos = position ? Number(position) : 0;
      if (pos != pos) { // better `isNaN`
        pos = 0;
      }
      var start = Math.min(Math.max(pos, 0), stringLength);
      // Avoid the `indexOf` call if no match is possible
      if (searchLength + start > stringLength) {
        return false;
      }
      return indexOf.call(string, searchString, pos) != -1;
    };
    if (defineProperty) {
      defineProperty(String.prototype, 'includes', {
        'value': includes,
        'configurable': true,
        'writable': true
      });
    } else {
      String.prototype.includes = includes;
    }
  }());
}

(function() { 'use strict';

  $.widget("custom.workspaceTeachers", {
    options: {
      workspaceEntityId: undefined,
      workspaceUrlName: undefined
    },
    _create : function() {
      this.element.on('click', '.workspace-teacher-info.message', $.proxy(this._sendMessage, this));
      
      mApi().user.staffMembers.read({
        workspaceEntityId: this.options.workspaceEntityId,
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end'
      }).callback($.proxy(function (err, staffMembers) {
        if (!err && staffMembers) {
          staffMembers.sort(function(a, b) {
            var an = a.lastName + ' ' + a.firstName;
            var bn = b.lastName + ' ' + b.firstName;
            return an < bn ? -1 : an == bn ? 0 : 1;
          });
          for (var i = 0; i < staffMembers.length; i++) {
            var props = staffMembers[i].properties;
            if (props['profile-vacation-start'] && props['profile-vacation-end']) {
              var begin = moment(props['profile-vacation-start']).startOf('day');
              var end = moment(props['profile-vacation-end']).startOf('day');
              var now = moment().startOf('day');
              if (now.isSame(end) || now.isBefore(end)) {
                if (begin.isSame(end)) {
                  props['profile-vacation-period'] = formatDate(begin.toDate());
                }
                else {
                  props['profile-vacation-period'] = formatDate(begin.toDate()) + ' - ' + formatDate(end.toDate());
                }
              }
            }
          }
          renderDustTemplate('workspace/workspace-frontpage-teachers.dust', {
            staffMembers: staffMembers
          }, $.proxy(function (text) {
            this.element.append($.parseHTML(text));
          }, this));
        }
      }, this));
    },
    _getServer: function () {
      var url = window.location.href;
      var arr = url.split("/");

      return arr[0] + "//" + arr[2];
    },
    _sendMessage: function (event) {
      var teacherId = $(event.target).closest(".workspace-teacher").attr("data-id");

      mApi().user.users.basicinfo.read(teacherId, {}).callback($.proxy(function (err, staffMember) {
        
        var workspaceTitle = [$('h1.workspace-title').text()];
        var captionExtra = $('div.workspace-additional-info-wrapper').text(); 
        if (captionExtra) {
          workspaceTitle.push('(' + captionExtra + ')');
        }
        captionExtra = $('span.workspace-duration').text();
        if (captionExtra) {
          workspaceTitle.push(captionExtra);
        }
        workspaceTitle = workspaceTitle.join(' ');
        
        var messageCaption = getLocaleText("plugin.workspace.index.newMessageCaption", workspaceTitle);
        var workspaceUrl = this._getServer() + CONTEXTPATH + "/workspace/" + this.options.workspaceUrlName;
        var messageContent = "<p/><p>" + getLocaleText("plugin.workspace.index.newMessageContent") + " <a href='" + workspaceUrl + "'>" + workspaceTitle + "</a></p>";
        
        if (!err && staffMember) {
          var options = {
            groupMessagingPermission: false,
            isStudent: true,
            userRecipients: [staffMember],
            initialCaption: messageCaption,
            initialMessage: messageContent
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
    var workspaceEntityId = $('.workspaceEntityId').val();
    
    if ($('.isUserLoggedIn').val() == 'false') {
      
      var logInGuidingIcon = $('<div>')
        .addClass('notification-queue-login-guiding-icon');
      
      var backToFrontPageLink = $('<a>')
        .attr('href', '/')
        .text(getLocaleText('plugin.workspace.logInGuidingLink') + ' ');
      
      var logInGuide = $('<div>')
        .addClass('notification-queue-login-guiding-wrapper')
        .append(logInGuidingIcon)
        .append($('<div>')
          .addClass('notification-queue-login-guiding-title')
          .text(getLocaleText('plugin.workspace.logInGuidingTitle') + ' ')
        )
        .append($('<div>')
          .addClass('notification-queue-login-guiding-text')
          .text(getLocaleText('plugin.workspace.logInGuidingInformation') + ' ')
        )
        .append($('<div>')
          .addClass('notification-queue-login-guiding-link')
          .append(backToFrontPageLink)
        );
 
      $('.notification-queue').notificationQueue('notification', 'guiding', logInGuide);
    }

    $(document)
      .muikkuMaterialLoader({
        workspaceEntityId: workspaceEntityId,
        baseUrl: $('.materialsBaseUrl').val()
      })
      .muikkuMaterialLoader('loadMaterials', $('.material-page'));
    
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
          
          $('.workspace-teachers-container').workspaceTeachers({
            workspaceEntityId: workspaceEntityId,
            workspaceUrlName: workspace.urlName
          });
        }
      }, this));
    
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
  });

}).call(this);