/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {

  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  function createFakeParserElement(editor, realElement) {
    var fake = editor.createFakeParserElement(realElement, 'muikku-organizer-field', 'muikkuorganizerfield', true);
    fake.attributes.src = CKEDITOR.plugins.getPath('muikku-organizerfield') + 'gfx/muikku-placeholder-organizerfield.gif';
    fake.attributes.title = editor.lang['muikku-organizerfield'].uiElement;
    return fake;
  }

  function createFakeElement(editor, realElement) {
    var fake = editor.createFakeElement(realElement, 'muikku-organizer-field', 'muikkuorganizerfield', true);
    fake.setAttribute('src', CKEDITOR.plugins.getPath('muikku-organizerfield') + 'gfx/muikku-placeholder-organizerfield.gif');
    fake.setAttribute('title', editor.lang['muikku-organizerfield'].uiElement);
    return fake;
  }

  var organizerFieldElement = function(dialog, elementDefinition, htmlList) {
    this.selectedTerm = null;
    this.terms = {}; // name=id|count
    this.termCategories = {};
    CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
  };

  organizerFieldElement.prototype = new CKEDITOR.ui.dialog.uiElement;
  CKEDITOR.tools.extend(organizerFieldElement.prototype, {
    buildUi: function(editor) {
      var uiElement = this.getElement();
      
      // Clear previous UI
      
      while (uiElement.getFirst()) {
        uiElement.getFirst().remove();
      }
      this.selectedTerm = null;
      this.terms = {};
      this.termCategories = {};
      
      // Term title container
      
      termTitleContainer = new CKEDITOR.dom.element('div');
      termTitleContainer.addClass('organizer-term-title-container');
      uiElement.append(termTitleContainer);
      
      termTitleLabel = new CKEDITOR.dom.element('span');
      termTitleLabel.setText(editor.lang['muikku-organizerfield'].propertiesDialogTermTitle);
      termTitleContainer.append(termTitleLabel);
      
      termTitleField = new CKEDITOR.dom.element('input');
      termTitleField.setAttribute('type', 'text');
      termTitleField.setAttribute('style', 'border:1px solid rgb(0,0,0);');
      termTitleField.setAttribute('name', 'termTitle');
      termTitleContainer.append(termTitleField);
      
      var categoriesContainer = new CKEDITOR.dom.element('div');
      categoriesContainer.addClass('organizer-categories-container');
      uiElement.append(categoriesContainer);
      
      var addCategoryLink = new CKEDITOR.dom.element('a');
      addCategoryLink.addClass('icon-add');
      addCategoryLink.on('click', function() {
        _this.addCategory();
      });
      uiElement.append(addCategoryLink);

//      // Terms and categories container
//      
//      var termsAndCategoriesContainer = new CKEDITOR.dom.element('div');
//      termsAndCategoriesContainer.addClass('organizer-terms-and-categories-container');
//      uiElement.append(termsAndCategoriesContainer);
//      
//      // Terms container
//      
//      var termsContainer = new CKEDITOR.dom.element('div');
//      termsContainer.addClass('organizer-terms-container');
//      termsAndCategoriesContainer.append(termsContainer);
//      
//      // Terms header
//      
//      var termsHeaderContainer = new CKEDITOR.dom.element('div');
//      termsHeaderContainer.addClass('organizer-terms-header');
//      termsContainer.append(termsHeaderContainer);
//
//      var termsHeaderTitle = new CKEDITOR.dom.element('span');
//      termsHeaderTitle.setText(editor.lang['muikku-organizerfield'].propertiesDialogTermsTitle);
//      termsHeaderContainer.append(termsHeaderTitle);
//      
//      var _this = this;
//      var termsHeaderAddTermLink = new CKEDITOR.dom.element('a');
//      termsHeaderAddTermLink.addClass('icon-add');
//      termsHeaderAddTermLink.on('click', function() {
//        _this.addTerm();
//      });
//      termsHeaderContainer.append(termsHeaderAddTermLink);
//      
//      // Categories container
//      
//      var categoriesContainer = new CKEDITOR.dom.element('div');
//      categoriesContainer.addClass('organizer-categories-container');
//      termsAndCategoriesContainer.append(categoriesContainer);
//
//      // Categories header
//      
//      var categoriesHeaderContainer = new CKEDITOR.dom.element('div');
//      categoriesHeaderContainer.addClass('organizer-categories-header');
//      categoriesContainer.append(categoriesHeaderContainer);
//
//      var categoriesHeaderTitle = new CKEDITOR.dom.element('span');
//      categoriesHeaderTitle.setText(editor.lang['muikku-organizerfield'].propertiesDialogCategoriesTitle);
//      categoriesHeaderContainer.append(categoriesHeaderTitle);
//      
//      var _this = this;
//      var categoriesHeaderAddCategoryLink = new CKEDITOR.dom.element('a');
//      categoriesHeaderAddCategoryLink.addClass('icon-add');
//      categoriesHeaderAddCategoryLink.on('click', function() {
//        _this.addCategory();
//      });
//      categoriesHeaderContainer.append(categoriesHeaderAddCategoryLink);
    },
//    addTerm: function(name, categoryId) {
//      var _this = this;
//      // Term container
//      var termContainer = new CKEDITOR.dom.element('div');
//      termContainer.addClass('organizer-term');
//      termContainer.setAttribute('id', id||this._generateTermId());
//      termContainer.on('click', function() {
//        _this._setSelectedTerm(this);
//      });
//      // Term field
//      var termField = new CKEDITOR.dom.element('input');
//      termField.addClass('organizer-term-name');
//      termField.setAttribute('type', 'text');
//      termField.setAttribute('style', 'border:1px solid rgb(0,0,0);');
//      if (name) {
//        termField.setAttribute('value', name);
//      }
//      termContainer.append(termField);
//      // Delete term button
//      var deleteTermLink = new CKEDITOR.dom.element('a');
//      deleteTermLink.addClass('icon-remove');
//      termContainer.append(deleteTermLink);
//      deleteTermLink.on('click', function() {
//        var term = this;
//        while (!term.hasClass('organizer-term')) {
//          term = term.getParent();
//        }
//        delete _this.terms[term.getAttribute('id')];
//        term.remove();
//      });
//      // Add
//      var termsContainer = this.getElement().findOne('.organizer-terms-container');
//      termsContainer.append(termContainer);
//    },
    addCategory: function(id, name) {
      var _this = this;
      // Category container
      var categoryContainer = new CKEDITOR.dom.element('div');
      categoryContainer.addClass('organizer-category-container');
      // Category name
      var categoryField = new CKEDITOR.dom.element('input');
      categoryField.addClass('organizer-category-name');
      categoryField.setAttribute('type', 'text');
      categoryField.setAttribute('style', 'border:1px solid rgb(0,0,0);');
      if (name) {
        categoryField.setAttribute('value', name);
      }
      categoryContainer.append(categoryField);
      // Delete category button
      var deleteCategoryLink = new CKEDITOR.dom.element('a');
      deleteCategoryLink.addClass('icon-remove');
      categoryContainer.append(deleteCategoryLink);
      deleteCategoryLink.on('click', function() {
        var category = this;
        while (!category.hasClass('organizer-category')) {
          category = category.getParent();
        }
        category.remove();
      });
      // Category itself
      var category = new CKEDITOR.dom.element('div');
      category.addClass('organizer-category');
      category.setAttribute('id', id||this._generateCategoryId());
      categoryContainer.append(category);
      // New term field
      var termField = new CKEDITOR.dom.element('input');
      termField.addClass('organizer-term-name');
      termField.setAttribute('type', 'text');
      termField.setAttribute('style', 'border:1px solid rgb(0,0,0);');
      category.append(termField);
      termField.$.on('keypress', function(evt) {
        var field = evt.target;
        if (e.keyCode == 13 && field.value !== '') {
          var termid = _this._createTerm(field.value);
        }
      });
      // Add
      var categoriesContainer = this.getElement().findOne('.organizer-categories-container');
      categoriesContainer.append(categoryContainer);
    },
    getTermTitle: function() {
      return this.getElement().findOne('input[name="termTitle"]').$.value;
    },
    getTerms: function() {
      var result = [];
      var terms = this.getElement().find('.organizer-term');
      for (var i = 0; i < terms.count(); i++) {
        result.push({
          'id': terms.getItem(i).getAttribute('id'),
          'name': terms.getItem(i).findOne('.organizer-term-name').$.value
        })
      }
      return result;
    },
    getCategories: function() {
      var result = [];
      var categories = this.getElement().find('.organizer-category');
      for (var i = 0; i < categories.count(); i++) {
        result.push({
          'id': categories.getItem(i).getAttribute('id'),
          'name': categories.getItem(i).findOne('.organizer-category-name').$.value
        })
      }
      return result;
    },
    getTermCategories: function() {
      var result = [];
      var keys = Object.keys(this.termCategories);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result.push({
          'term': key,
          'categories': this.termCategories[key]
        })
      }
      return result;
    },
    _addTerm: function(term, categoryId) {
      var termObject = this.terms[terms];
      var term = new CKEDITOR.dom.element('div');
      term.addClass('organizer-term');
      term.setAttribute('data-term-id', this.terms[terms].id);
      term.setText(term);
      var category = document.getElementById(categoryId);
      category.append(term);
    },
    _createTerm: function(id, term) {
      var termObject = this.terms[term];
      if (this.terms[term]) {
        this.terms[term].count++;
      }
      else {
        this.terms[term] = {
          'id': id||_generateTermId(),
          'count': 1;
        }
      }
      return this.terms[term];
    },
    _generateTermId: function() {
      var i = 1;
      while (document.getElementById('t' + i) != null) {
        i++;
      }
      return 't' + i;
    },
    _generateCategoryId: function() {
      var i = 1;
      while (document.getElementById('c' + i) != null) {
        i++;
      }
      return 'c' + i;
    },
    _setSelectedCategory: function(categoryId, selected) {
      if (this.selectedTerm != null) {
        var termId = this.selectedTerm.getAttribute('id');
        var termCategories = this.termCategories[termId];
        if (!termCategories) {
          termCategories = [];
        }
        if (selected) {
          termCategories.push(categoryId);
        }
        else {
          var index = termCategories.indexOf(categoryId);
          if (index != -1) {
            termCategories.splice(index, 1);
          }
        }
        this.termCategories[termId] = termCategories;
      }
    }
  });

  CKEDITOR.dialog.addUIElement('muikkuOrganizerFieldElement', {
    build : function(dialog, elementDefinition, output) {
      return new organizerFieldElement(dialog, elementDefinition, output);
    }
  });

  CKEDITOR.dialog.add('muikkuorganizerfield', function(editor) {
    return {
      title : editor.lang['muikku-organizerfield'].propertiesDialogTitle,
      minWidth : 640,
      minHeight : 480,
      onShow : function() {
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        this.setupContent(contentJson);
      },
      onOk : function(event) {
        var oldJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        var name = oldJson.name ? oldJson.name : editor.createRandomMuikkuFieldName();
        var newJson = {
          'name': name,
          'termTitle': this.getContentElement('info', 'organizer').getTermTitle(),
          'terms': this.getContentElement('info', 'organizer').getTerms(),
          'categories': this.getContentElement('info', 'organizer').getCategories(),
          'termCategories': this.getContentElement('info', 'organizer').getTermCategories()
        };
        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.organizer');
        var paramType = new CKEDITOR.dom.element('cke:param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('cke:param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', JSON.stringify(newJson));
        object.append(paramType);
        object.append(paramContent);
        var fakeElement = createFakeElement(editor, object);
        editor.insertElement(fakeElement);
      },
      onHide : function() {
      },
      contents : [{
        id : 'info',
        elements : [{
          id : 'organizer',
          type : 'muikkuOrganizerFieldElement',
          setup : function(json) {
            this.buildUi(editor);
            if (isEmpty(json)) {
              return;
            }
            
            var termTitleField = this.getElement().findOne('input[name="termTitle"]');
            termTitleField.$.value = json.termTitle;
            
            var terms = json.terms;
            for (var i = 0; i < terms.length; i++) {
              this.addTerm(terms[i].id, terms[i].name);
            }
            
            var categories = json.categories;
            for (var i = 0; i < categories.length; i++) {
              this.addCategory(categories[i].id, categories[i].name);
            }
            
            var termCategories = json.termCategories;
            for (var i = 0; i < termCategories.length; i++) {
              this.termCategories[termCategories[i].term] = termCategories[i].categories;
            }
          }
        }]
      }]
    };
  });
  
  CKEDITOR.plugins.add('muikku-organizerfield', {
    requires : 'muikku-fields',
    icons : 'muikku-organizerfield',
    hidpi : true,
    lang : 'fi,en',
    onLoad : function() {
    },
    init : function(editor) {
      editor.ui.addButton('muikku-organizerfield', {
        label : editor.lang['muikku-organizerfield'].toolbarMenu,
        command : 'createMuikkuOrganizerField'
      });
      editor.addCommand('createMuikkuOrganizerField', new CKEDITOR.dialogCommand('muikkuorganizerfield', {}));
      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;
        if (element.is('img') && element.data('cke-real-element-type') == 'muikkuorganizerfield') {
          evt.data.dialog = 'muikkuorganizerfield';
        }
      });
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuOrganizerFieldGroup');
        editor.addMenuItem('muikkuOrganizerFieldItem', {
          label : editor.lang['muikku-organizerfield'].propertiesMenu,
          command : 'createMuikkuOrganizerField',
          group : 'muikkuOrganizerFieldGroup'
        });
        editor.contextMenu.addListener(function(element, selection) {
          if (element && element.is('img') && !element.isReadOnly() && element.data('cke-real-element-type') == 'muikkuorganizerfield') {
            return { muikkuConnectFieldItem : CKEDITOR.TRISTATE_OFF };
          }
        });
      }
    },
    afterInit : function(editor) {
      var path = this.path;
      var dataProcessor = editor.dataProcessor;
      var dataFilter = dataProcessor && dataProcessor.dataFilter;
      if (dataFilter) {
        dataFilter.addRules({
          elements : {
            'cke:object' : function(element) {
              var type = element.attributes.type;
              if (type == 'application/vnd.muikku.field.organizer') {
                return createFakeParserElement(editor, element)
              }
            }
          }
        }, 5);
      }
    }
  });

})();