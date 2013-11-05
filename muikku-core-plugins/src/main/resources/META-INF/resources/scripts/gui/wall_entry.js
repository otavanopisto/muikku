(function() {
  
  DefaultWallEntryController = $.klass(WallEntryController, {
    render: function (data) {
      // TODO: sync issues with renderDustTemplate
      dust.preload('wall/wallentryitem.dust');
      dust.preload('wall/wallentry.dust');
      dust.preload('wall/wallentryreply.dust');
      
      var rtn = undefined;
      this._wallId = data.wallEntry.wall.id;
      
      renderDustTemplate('wall/wallentryitem.dust', data, function (text) {
        rtn = $.parseHTML(text);
      });
      
      rtn = $(rtn);

      rtn.on("click", ".wallEntryReplyLink", $.proxy(this._onEntryElementClick, this));
      rtn.on("submit", ".wallEntryCommentFormForm", $.proxy(this._onPostCommentClick, this));
      
      return rtn;
    },
    _onEntryElementClick: function (event) {
      var _this = this;
      var element = $(event.target);
      element = element.hasClass("wallEntry") ? element : element.parents(".wallEntry");
  
      if (!this._commentRoot) {
        var data = {
          wallEntryId: element.find("input[name='wallEntryId']").val()
        };
        
        renderDustTemplate('wall/newcomment.dust', data, function (text) {
          _this._commentRoot = $($.parseHTML(text));

          if (_this._commentRoot.parentNode != element) {
            var wallEntryId = element.find("input[name='wallEntryId']").val();
            
            _this._commentRoot.find("input[name='wallEntryId']").val(wallEntryId);
            _this._commentRoot.find("input[name='wallEntryCommentText']").val("");
            
            element.append(_this._commentRoot);
          }
        });
      }
    },
    _onPostCommentClick: function (event) {
      var wallEntryId = this._commentRoot.find("input[name='wallEntryId']").val();
      var wallId = this._wallId;
      var commentText = this._commentRoot.find("input[name='wallEntryCommentText']").val();
      var commentsContainer = this._commentRoot.parents('.wallEntry').find('.wallEntryComments');
      
      RESTful.doPost(CONTEXTPATH + '/rest/wall/{wallId}/addWallEntryComment', {
        parameters: {
          'wallId': wallId,
          'wallEntryId': wallEntryId,
          'text': commentText
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('wall/wallentryreply.dust', data, function (text) {
          commentsContainer.append($.parseHTML(text));
        });
      });
    }
  });
  
  addWallEntryController('WallFeedWallEntryItem', DefaultWallEntryController);
  
}).call(this);