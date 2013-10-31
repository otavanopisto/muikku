(function() {
  
  AssessmentRequestWallEntryController = $.klass(WallEntryController, {
    render: function (data) {
      // TODO: sync issues with renderDustTemplate
      dust.preload('wall/assessmentrequestwallentry.dust');
      
      var rtn = undefined;
      
      renderDustTemplate('wall/assessmentrequestwallentry.dust', data, function (text) {
        rtn = $.parseHTML(text);
      });
      
      return rtn;
    }
  });
  
  addWallEntryController('UserFeedAssessmentRequestItem', AssessmentRequestWallEntryController);
  
}).call(this);