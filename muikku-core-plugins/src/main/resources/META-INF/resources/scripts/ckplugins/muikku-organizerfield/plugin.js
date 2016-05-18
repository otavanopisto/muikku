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
    this.termIds = [];
    this.categoryIds = [];
    this.terms = {}; // name=id|count
    CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
  };

  organizerFieldElement.prototype = new CKEDITOR.ui.dialog.uiElement;
  CKEDITOR.tools.extend(organizerFieldElement.prototype, {
    buildUi: function(editor) {
      this._lang = editor.lang['muikku-organizerfield'];
      var uiElement = this.getElement();
      
      // Clear previous UI
      
      while (uiElement.getFirst()) {
        uiElement.getFirst().remove();
      }
      this.termIds = [];
      this.categoryIds = [];
      this.terms = {};
      
      // Term title container
      
      termTitleContainer = new CKEDITOR.dom.element('div');
      termTitleContainer.addClass('organizer-term-title-container');
      uiElement.append(termTitleContainer);
      
      termTitleLabel = new CKEDITOR.dom.element('label');
      termTitleLabel.setText(this._lang.propertiesDialogTermTitle);
      termTitleContainer.append(termTitleLabel);
      
      termTitleFieldContainer = new CKEDITOR.dom.element('div');
      termTitleFieldContainer.addClass('term-title-field-container');
      termTitleContainer.append(termTitleFieldContainer);
      
      termTitleField = new CKEDITOR.dom.element('input');
      termTitleField.setAttribute('type', 'text');
      termTitleField.setAttribute('name', 'termTitle');
      termTitleFieldContainer.append(termTitleField);
      
      categoriesTitleLabel = new CKEDITOR.dom.element('label');
      categoriesTitleLabel.setText(this._lang.propertiesDialogCategoriesTitle);
      uiElement.append(termTitleLabel);

      var categoriesContainer = new CKEDITOR.dom.element('div');
      categoriesContainer.addClass('organizer-categories-container');
      uiElement.append(categoriesContainer);
      
      var _this = this;
      var addCategoryLink = new CKEDITOR.dom.element('div');
      addCategoryLink.addClass('icon-add');
      addCategoryLink.addClass('organizer-add-category-container');
      addCategoryLink.on('click', function() {
        _this.addCategory();
      });
      categoriesContainer.append(addCategoryLink);
    },
    addCategory: function(id, name) {
      var _this = this;
      // Category container
      var categoryContainer = new CKEDITOR.dom.element('div');
      categoryContainer.addClass('organizer-category-container');
      // Category name
      var categoryField = new CKEDITOR.dom.element('input');
      categoryField.addClass('organizer-category-name');
      categoryField.setAttribute('type', 'text');
      categoryField.setAttribute('placeholder', this._lang.propertiesDialogCategoryName);
      if (name) {
        categoryField.setAttribute('value', name);
      }
      categoryContainer.append(categoryField);
      // Delete category button
      var deleteCategoryLink = new CKEDITOR.dom.element('a');
      deleteCategoryLink.addClass('icon-delete');
      categoryContainer.append(deleteCategoryLink);
      deleteCategoryLink.on('click', function() {
        var categoryContainer = this.getParent();
        var category = categoryContainer.findOne('.organizer-category');
        var terms = category.find('.organizer-term');
        for (var i = 0; i < terms.count(); i++) {
          _this.removeTerm(terms.getItem(i).getAttribute('data-term-id'));
        }
        var categoryId = category.getAttribute('data-category-id');
        var index = _this.categoryIds.indexOf(categoryId);
        _this.categoryIds.splice(index, 1);
        categoryContainer.remove();
      });
      // Category itself
      var category = new CKEDITOR.dom.element('div');
      category.addClass('organizer-category');
      category.setAttribute('data-category-id', id||this._generateCategoryId());
      categoryContainer.append(category);
      // New term field
      var termField = new CKEDITOR.dom.element('input');
      termField.addClass('organizer-term-name');
      termField.setAttribute('type', 'text');
      termField.setAttribute('placeholder', this._lang.propertiesDialogNewTerm);
      category.append(termField);
      termField.on('keydown', function(evt) {
        var field = this;
        if (evt.data.getKeystroke() == 13) {
          evt.data.preventDefault();
          evt.data.stopPropagation();
          evt.stop();
          if (field.$.value !== '') {
            var category = field;
            while (!category.hasClass('organizer-category')) {
              category = category.getParent();
            }
            _this.addTermToCategory(field.$.value, category.getAttribute('data-category-id'));
            field.$.value = '';
          }
          return false;
        }
      });
      categoryContainer.insertBefore(this.getElement().findOne('.organizer-add-category-container'));
    },
    addTerm: function(id, name) {
      this.terms[name] = {
        'id': id,
        'count': 0
      };
      this.termIds.push(id);
      return this.terms[name];
    },
    getTermTitle: function() {
      return this.getElement().findOne('input[name="termTitle"]').$.value;
    },
    getTerms: function() {
      var result = [];
      var keys = Object.keys(this.terms);
      for (var i = 0; i < keys.length; i++) {
        result.push({
          'id': this.terms[keys[i]].id,
          'name': keys[i]
        });
      }
      return result;
    },
    removeTerm(termId) {
      var termName = this.getTermName(termId);
      var termObject = this.terms[termName];
      if (termObject.count > 1) {
        termObject.count--;
      }
      else {
        delete this.terms[termName];
        var index = this.termIds.indexOf(termId);
        this.termIds.splice(index, 1);
      }
    },
    getCategories: function() {
      var result = [];
      var categories = this.getElement().find('.organizer-category');
      for (var i = 0; i < categories.count(); i++) {
        result.push({
          'id': categories.getItem(i).getAttribute('data-category-id'),
          'name': categories.getItem(i).getParent().findOne('.organizer-category-name').$.value
        })
      }
      return result;
    },
    getCategoryTerms: function() {
      var result = [];
      var categories = this.getElement().find('.organizer-category');
      for (var i = 0; i < categories.count(); i++) {
        var category = categories.getItem(i);
        var terms = category.find('.organizer-term');
        var termArray = [];
        for (var j = 0; j < terms.count(); j++) {
          termArray.push(terms.getItem(j).getAttribute('data-term-id'));
        }
        result.push({
          'category': category.getAttribute('data-category-id'),
          'terms': termArray
        });
      }
      return result;
    },
    addTermToCategory: function(termName, categoryId) {
      var _this = this;
      var termObject = this.terms[termName];
      if (termObject) {
        var category = this.getElement().findOne('.organizer-category[data-category-id="' + categoryId + '"]');
        var term = category.findOne('.organizer-term[data-term-id="' + termObject.id + '"]');
        if (term != null) {
          return;
        }
      }
      else {
        termObject = this.addTerm(this._generateTermId(), termName);
      }
      termObject.count++;
      var termContainer = new CKEDITOR.dom.element('div');
      termContainer.addClass('organizer-term-container');
      var term = new CKEDITOR.dom.element('div');
      term.addClass('organizer-term');
      term.setAttribute('data-term-id', termObject.id);
      term.setText(termName);
      termContainer.append(term);
      
      var deleteTermLink = new CKEDITOR.dom.element('a');
      deleteTermLink.addClass('icon-delete');
      termContainer.append(deleteTermLink);
      deleteTermLink.on('click', function() {
        var termContainer = this.getParent();
        var term = termContainer.findOne('.organizer-term');
        _this.removeTerm(term.getAttribute('data-term-id'));
        termContainer.remove();
      });

      var category = this.getElement().findOne('.organizer-category[data-category-id="' + categoryId + '"]');
      category.append(termContainer);
    },
    getTermName: function(termId) {
      var keys = Object.keys(this.terms);
      for (var i = 0; i < keys.length; i++) {
        if (this.terms[keys[i]].id == termId) {
          return keys[i];
        }
      }
      return null;
    },
    _generateTermId: function() {
      var i = 1;
      while (this.termIds.indexOf('t' + i) >= 0) {
        i++;
      }
      this.termIds.push('t' + i);
      return 't' + i;
    },
    _generateCategoryId: function() {
      var i = 1;
      while (this.categoryIds.indexOf('c' + i) >= 0) {
        i++;
      }
      this.categoryIds.push('c' + i);
      return 'c' + i;
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
      minWidth : 770,
      minHeight : 480,
      rezisable: 0,
      onShow : function() {
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        this.setupContent(contentJson);
        this._.element.on('keydown', function(evt) {
          if (evt.data.getKeystroke() == 13) {
            evt.data.preventDefault();
            evt.data.stopPropagation();
            evt.stop();
            return false;
          }
        }, this, null, 0);
      },
      onOk : function(event) {
        var oldJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        var name = oldJson.name ? oldJson.name : editor.createRandomMuikkuFieldName();
        var newJson = {
          'name': name,
          'termTitle': this.getContentElement('info', 'organizer').getTermTitle(),
          'terms': this.getContentElement('info', 'organizer').getTerms(),
          'categories': this.getContentElement('info', 'organizer').getCategories(),
          'categoryTerms': this.getContentElement('info', 'organizer').getCategoryTerms()
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
            
            var categoryTerms = json.categoryTerms;
            for (var i = 0; i < categoryTerms.length; i++) {
              var category = categoryTerms[i].category;
              var terms = categoryTerms[i].terms;
              for (var j = 0; j < terms.length; j++) {
                this.addTermToCategory(this.getTermName(terms[j]), category);
              }
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
