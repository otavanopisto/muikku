CoursePickerController = Class.create(WidgetController, {
  initialize: function () {
    this._searchAllCoursesClickListener = this._onSearchAllCoursesClick.bindAsEventListener(this);
    this._searchMyCoursesClickListener = this._onSearchMyCoursesClick.bindAsEventListener(this);
    this._checkCourseClickListener = this._onCheckCourseClick.bindAsEventListener(this);
  },
  setup: function (widgetElement) {
    this._widgetElement = widgetElement;
    this._environmentId = widgetElement.down("input[name='environmentId']").value;
    this._userId = widgetElement.down("input[name='userId']").value;
    this._allCoursesContainer = $('allCoursesList');
    this._myCoursesContainer = $('myCoursesList');
    
    this._initializeAllCoursesList();

    this._tabsContainer = widgetElement.down('.coursePickerTabs');
    this._tabControl = new S2.UI.Tabs(this._tabsContainer);
    
    var searchAllCoursesButton = widgetElement.down('input[name="coursePickerAllCoursesFilterBtn"]');
    Event.observe(searchAllCoursesButton, "click", this._searchAllCoursesClickListener);
    
    var searchMyCoursesButton = widgetElement.down('input[name="coursePickerMyCoursesFilterBtn"]');
    if (searchMyCoursesButton) {
      Event.observe(searchMyCoursesButton, "click", this._searchMyCoursesClickListener);
    }
  },
  deinitialize: function () {
    var widgetElement = this._widgetElement;
    
    var searchAllCoursesButton = widgetElement.down('.coursePickerAllCoursesFilterBtn');
    Event.stopObserving(searchAllCoursesButton, "click", this._searchAllCoursesClickListener);
    
    var searchMyCoursesButton = widgetElement.down('.coursePickerMyCoursesFilterBtn');
    if (searchMyCoursesButton) {
      Event.stopObserving(searchMyCoursesButton, "click", this._searchMyCoursesClickListener);
    }
  },
  _initializeAllCoursesList: function () {
    var _this = this;
    
    _this._allCoursesContainer.select('.coursePickerCourse').each(function (node) {
      node.purge();
      node.remove();
    });
    
    RESTful.doGet(CONTEXTPATH + "/rest/course/listAllCourses", {
      parameters: {
        'environmentId': this._environmentId
      },
      onSuccess: function (response) {
        renderDustTemplate('coursepickercourse.dust', response.responseJSON, function (text) {
          _this._allCoursesContainer.insert({
            bottom: text
          });
          
          _this._allCoursesContainer.select('.coursePickerCheckOutCourseButton').invoke("observe", "click", _this._checkCourseClickListener);
        });
      }
    });
  },
  _onSearchAllCoursesClick: function (event) {
    var _this = this;
    
    _this._allCoursesContainer.select('.coursePickerCourse').each(function (node) {
      node.purge();
      node.remove();
    });
    
    RESTful.doGet(CONTEXTPATH + "/rest/course/listAllCourses", {
      parameters: {
        'environmentId': this._environmentId
      },
      onSuccess: function (response) {
        renderDustTemplate('coursepickercourse.dust', response.responseJSON, function (text) {
          _this._allCoursesContainer.insert({
            bottom: text
          });
          
          _this._allCoursesContainer.select('.coursePickerCheckOutCourseButton').invoke("observe", "click", _this._checkCourseClickListener);
        });
      }
    });
  },
  _onSearchMyCoursesClick: function (event) {
    var _this = this;
    
    _this._myCoursesContainer.select('.coursePickerCourse').each(function (node) {
      node.purge();
      node.remove();
    });
    
    RESTful.doGet(CONTEXTPATH + "/rest/course/listUserCourses", {
      parameters: {
        'environmentId': this._environmentId,
        'userId': this._userId
      },
      onSuccess: function (response) {
        renderDustTemplate('coursepickercourse.dust', response.responseJSON, function (text) {
          _this._myCoursesContainer.insert({
            bottom: text
          });
          
          _this._myCoursesContainer.select('.coursePickerCheckOutCourseButton').invoke("observe", "click", _this._checkCourseClickListener);
        });
      }
    });
  },
  _onCheckCourseClick: function (event) {
    var element = Event.element(event);
    var coursePickerCourse = element.up(".coursePickerCourse");
    
    var courseId = coursePickerCourse.down("input[name='courseId']").value;
    
    window.location = CONTEXTPATH + '/course/index.jsf?courseId=' + courseId;
  }
});

addWidgetController('coursePicker', CoursePickerController);
