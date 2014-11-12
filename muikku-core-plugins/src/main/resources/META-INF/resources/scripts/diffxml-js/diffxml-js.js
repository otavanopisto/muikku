/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Utility class for DiffXmlJs
 */
DiffXmlUtils = /** @lends DiffXmlUtils */ {
  /**
   * Creates new class
   * 
   * @param superClass super class
   * @param definition class definition. Constructor is defined in "init" members in "proto". 
   * @returns class
   */
  createClass: function (superClass, definition) {
    if ((typeof definition.init) != 'function') {
      throw new Error("Class missing constructor");
    }

    if ((typeof definition.proto) != 'object') {
      throw new Error("Class missing proto");  
    }
    
    var properties = {};
    
    properties.constructor = {
      value: definition.init,
      enumerable: false
    };
    
    for (var funcName in definition.proto) {
      properties[funcName] = {
        value: definition.proto[funcName]
      };
    }
    
    var result = definition.init;
    result.prototype = Object.create(superClass, properties);
    
    return result;
  },
  
  /**
   * Parses a XML document from String
   * 
   * @param xml xml data
   * @returns xml document
   */
  parseXmlDocument: function (xml) {
    if (window.DOMParser) {
      var parser = new DOMParser();
      return parser.parseFromString(xml,"text/xml");
    } else {
      var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(xml);
      return xmlDoc;
    } 
  },
  
  /**
   * Serializes XML document into a string
   * 
   * @param document document
   * @returns serialized string
   */
  serializeXmlDocument: function (document) {
    var serializer = new XMLSerializer();
    return serializer.serializeToString(document);
  }
};/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Interface for Delta formats.
 */
Delta = DiffXmlUtils.createClass(null, {
  /**
   * Constructor
   * @constructs
   */
  init: function () {
  },
  proto : /** @lends Delta.prototype */ {
    /**
     * Appends an insert operation to the delta.
     * 
     * Set charpos to 1 if not needed.
     * 
     * @param n The node to insert
     * @param parent The path to the node to be parent of n
     * @param childno The child number of the parent node that n will become
     * @param charpos The character position to insert at
     */
    insert: function (n, parent, childno, charpos) {},
    
    /**
     * Adds a delete operation to the delta for the given Node.
     * 
     * @param node The Node that is to be deleted
     */
    deleteNode: function(node) {},

    /**
     * Adds a Move operation to the delta. 
     * 
     * @param node The node being moved
     * @param parent XPath to the new parent Node
     * @param childno Child number of the parent n will become
     * @param ncharpos The new character position for the Node
     */
    move: function (node, parent, childno, ncharpos) {},

    /**
     * Adds an update operation to the delta.
     * 
     * @param w The node to update
     * @param x The node to update it to
     */
    update: function (w, x) {}
  }
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Default delta.
 * @extends Delta
 */
InternalDelta = DiffXmlUtils.createClass(Delta, {
  /**
   * Constructor
   * @constructs
   */
  init: function (operations) {
    this._changes = operations||new Array();
  },
  proto : /** @lends InternalDelta.prototype */ {
    
    /**
     * Returns changes array
     * 
     * @returns changes array
     */
    getChanges: function () {
      return this._changes;
    },

    /**
     * Returns move operations as array
     * 
     * @returns move operations as array
     */
    getMoved: function () {
      return this._getChangesByType("move");
    },
    
    /**
     * Returns delete operations as array
     * 
     * @returns delete operations as array
     */
    getDeleted: function () {
      return this._getChangesByType("delete");
    },
    
    /**
     * Returns insert operations as array
     * 
     * @returns insert operations as array
     */
    getInserted: function () {
      return this._getChangesByType("insert");
    },
    
    /**
     * Returns update operations as array
     * 
     * @returns update operations as array
     */
    getUpdated: function () {
      return this._getChangesByType("update");
    },

    /**
     * Adds inserts for attributes of a node to an delta.
     * 
     * @param attrs the attributes to be added
     * @param path the path to the node they are to be added to
     */
    addAttrsToDelta: function (attrs, path) {
      var numAttrs;
      if (attrs == null) {
        numAttrs = 0;
      } else {
        numAttrs = attrs.length;
      }

      for (var i = 0; i < numAttrs; i++) {
        this.insert(attrs.item(i), path, 0, 1);
      }
    },
    
    /**
     * Appends an insert operation to the delta.
     * 
     * Set charpos to 1 if not needed.
     * 
     * @param n The node to insert
     * @param parent The path to the node to be parent of n
     * @param childno The child number of the parent node that n will become
     * @param charpos The character position to insert at
     */
    insert: function (n, parent, childno, charpos) {
      if (parent instanceof Node) {
        parent = NodeOps.getXPath(parent);
      }

      var inserted = {
        type: 'insert',
        parent: parent,
        nodeType: n.nodeType,
        value: n.nodeValue
      };
      
      if (n.nodeType != Node.ATTRIBUTE_NODE) {
        inserted['childNo'] = childno;
      } 
      
      if (n.nodeType == Node.ATTRIBUTE_NODE || n.nodeType == Node.ELEMENT_NODE || n.nodeType == Node.PROCESSING_INSTRUCTION_NODE) {
        inserted['nodeName'] = n.nodeName;
      }
      
      if (charpos > 1) {
        inserted['charpos'] = charpos;
      }
      
      this._changes.push(inserted);
      
      if (n.nodeType == Node.ELEMENT_NODE) {
        this.addAttrsToDelta(n.attributes, parent + "/node()[" + childno + "]");
      }
    },
    
    /**
     * Adds a delete operation to the delta for the given Node.
     * 
     * @param n The Node that is to be deleted
     */
    deleteNode: function(n) {
      var deleted = {
        type: 'delete',
        node: NodeOps.getXPath(n)
      };
      
      if (n.nodeType == Node.TEXT_NODE) {
        var cn = new ChildNumber(n);
        var charpos = cn.getXPathCharPos();
        
        if (charpos >= 1) {
          deleted['charpos'] = charpos;
          deleted['length'] = n.length;
        }
      }

      this._changes.push(deleted);
    },

    /**
     * Adds a Move operation to the delta. 
     * 
     * @param n The node being moved
     * @param parent XPath to the new parent Node
     * @param childno Child number of the parent n will become
     * @param ncharpos The new character position for the Node
     */
    move: function (n, parent, childno, ncharpos) {
      if (ncharpos < 1) {
        throw new Error("New Character position must be >= 1");
      }
      
      if (parent instanceof Node) {
        parent = NodeOps.getXPath(parent);
      }
        
      var moved = {
        type: 'move',
        node: NodeOps.getXPath(n),
        ocharpos: new ChildNumber(n).getXPathCharPos(),
        ncharpos: ncharpos,
        parent: parent,
        childNo: childno
      };
      
      if (n.nodeType == Node.TEXT_NODE) {
        moved['length'] = n.length;
      }
      
      this._changes.push(moved);
    },

    /**
     * Adds an update operation to the delta.
     * 
     * @param w The node to update
     * @param x The node to update it to
     */
    update: function (w, x) {
      var updated = {
        type: 'update',
        node: NodeOps.getXPath(w)
      };
      
      if (w.nodeType == Node.ELEMENT_NODE) {
        updated['nodeName'] = x.nodeName;
        this._updateAttributes(w, x);
      } else {
        updated['nodeValue'] = x.nodeValue;
      }
      
      this._changes.push(updated);
    },
    
    /**
     * Returns delta in DUL format
     * 
     * @returns delta in DUL format
     */
    toDUL: function () {
      var changes = this.getChanges();
      
      var dulDocument = DiffXmlUtils.parseXmlDocument('<?xml version="1.0" encoding="UTF-8" standalone="no"?><delta/>');
      
      for (var i = 0, l = changes.length; i < l; i++) {
        var change = changes[i];

        switch (change.type) {
          case 'insert':
            this._appendInsertDULNode(dulDocument, change.parent, change.nodeType, change.childNo, change.nodeName, change.charpos, change.value);
          break;
          case 'delete':
            this._appendDeleteDULNode(dulDocument, change.charpos, change.length, change.node);
          break;
          case 'move':
            this._appendMoveDULNode(dulDocument, change.node, change.ocharpos, change.ncharpos, change.parent, change.childNo, change.length);
          break;
          case 'update':
            this._appendUpdateDULNode(dulDocument, change.node, change.nodeName, change.nodeValue);
          break;
          default:
            throw new Error("Invalid operation: " + change.type);
          break;
        }
      }
      
      return DiffXmlUtils.serializeXmlDocument(dulDocument);
    },
    
    _appendInsertDULNode: function (dulDocument, parent, nodeType, childNo, nodeName, charpos, value) {
      var node = dulDocument.createElement(DULConstants.INSERT);

      if (charpos) {
        node.setAttribute(DULConstants.CHARPOS, charpos);
      }
      
      if (childNo) {
        node.setAttribute(DULConstants.CHILDNO, childNo);
      }

      if (nodeName) {
        node.setAttribute(DULConstants.NAME, nodeName);
      }
      
      if (nodeType) {
        node.setAttribute(DULConstants.NODETYPE, nodeType);
      }
      
      if (parent) {
        node.setAttribute(DULConstants.PARENT, parent);
      }

      if (value) {
        node.appendChild(dulDocument.createTextNode(value));
      }
      
      dulDocument.documentElement.appendChild(node);
    },
    
    _appendDeleteDULNode: function (dulDocument, charpos, length, nodeAttr) {
      var node = dulDocument.createElement(DULConstants.DELETE);
      
      if (charpos) {
        node.setAttribute(DULConstants.CHARPOS, charpos);
      }

      if (length) {
        node.setAttribute(DULConstants.LENGTH, length);
      }
      
      if (nodeAttr) {
        node.setAttribute(DULConstants.NODE, nodeAttr);
      }
      
      dulDocument.documentElement.appendChild(node);
    },
    
    _appendMoveDULNode: function (dulDocument, node, ocharpos, ncharpos, parent, childNo, length) {
      var node = dulDocument.createElement(DULConstants.MOVE);
      
      if (node) {
        node.setAttribute(DULConstants.NODE, node);
      }

      if (ocharpos) {
        node.setAttribute(DULConstants.OLD_CHARPOS, ocharpos);
      }
      
      if (ncharpos) {
        node.setAttribute(DULConstants.NEW_CHARPOS, ncharpos);
      }
      
      if (parent) {
        node.setAttribute(DULConstants.PARENT, parent);
      }
      
      if (childNo) {
        node.setAttribute(DULConstants.CHILDNO, childNo);
      }

      if (length) {
        node.setAttribute(DULConstants.LENGTH, length);
      }
      
      dulDocument.documentElement.appendChild(node);
    },
    
    _appendUpdateDULNode: function (dulDocument, node, nodeName, nodeValue) {
      var node = dulDocument.createElement(DULConstants.DELETE);
      
      if (node) {
        node.setAttribute(DULConstants.NODE, node);
      }
      
      if (nodeName) {
        node.appendChild(dulDocument.createTextNode(nodeName));
      } else if (nodeValue) {
        node.appendChild(dulDocument.createTextNode(nodeValue));
      }
      
      dulDocument.documentElement.appendChild(node);
    },
    
    /**
     * Updates the attributes of element w to be the same as x's.
     * 
     * @param w The Element to update the attributes of
     * @param x The element holding the correct attributes
     */
    _updateAttributes: function (w, x) {
      var wAttrs = w.attributes;
      var xAttrs = x.attributes;
      
      //Delete any attrs of w not in x, update others
      for (var i = 0; i < wAttrs.length; i++) {
        var wAttr = wAttrs.item(i);
        var xAttr = xAttrs[wAttr.name];
        if (xAttr == null) {
          this.deleteNode(wAttrs.item(i));
        } else if (wAttr.nodeValue != xAttr.nodeValue) {
          this.update(wAttr, xAttr);
        }
      }
        
      //Add any attrs in x but not w
      for (var j = 0; j < xAttrs.length; j++) {
        var xAttr = xAttrs.item(j);
        if (wAttrs[xAttr.name] == null) {
          this.insert(xAttr, NodeOps.getXPath(w), 0, 1);
        }
      }
    },
    
    _getChangesByType: function (type) {
      var result = new Array();
      for (var i = 0, l = this._changes.length; i < l; i++) {
        if (this._changes[i].type == type) {
          result.push(this._changes[i]);
        }
      }
      return result;
    }
  }
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class
 */
InternalPatch = DiffXmlUtils.createClass(null, {

  init : function() {

  },
  proto : /** @lends InternalPatch.prototype */
  {

    /**
     * Apply patch to XML document.
     * 
     * @param doc
     *          the XML document to be patched
     * @param patch
     *          the patch
     * @throws PatchFormatException
     *           if there is an error parsing the patch
     */
    apply : function(doc, patch) {

      for ( var i = 0, l = patch.getChanges().length; i < l; i++) {
        // Normalize is essential for deletes to work
        doc.normalize();
        
        var operation = patch.getChanges()[i];
        switch (operation.type) {
          case 'insert':
            this._doInsert(doc, operation);
          break;
          case 'delete':
            this._doDelete(doc, operation);
          break;
          case 'move':
            this._doMove(doc, operation);
          break;
          case 'update':
            this._doUpdate(doc, operation);
          break;
        }
      }

    },

    /**
     * Apply insert operation to document.
     * 
     * @param doc
     *          the document to be patched
     * @param operation
     *          the insert operation node
     */
    _doInsert : function(doc, operation) {
      var charpos = parseInt(operation.charpos || 1);
      var parentNode = this._findNodeByXPath(doc, operation.parent);
      var siblings = parentNode.childNodes;
      var nodeType = operation.nodeType;
      var value = operation.value;
      var childNo = operation.childNo === undefined ? 1 : parseInt(operation.childNo);
      var domChildNo = this._getDOMChildNo(nodeType, siblings, childNo);
      var ins = null;

      switch (nodeType) {
        case Node.TEXT_NODE:
          ins = doc.createTextNode(value);
          this._insertNode(siblings, parentNode, domChildNo, charpos, ins, doc);
        break;
        case Node.CDATA_SECTION_NODE:
          ins = doc.createCDATASection(value);
          this._insertNode(siblings, parentNode, domChildNo, charpos, ins, doc);
        break;
        case Node.ELEMENT_NODE:
          ins = doc.createElement(operation.nodeName);
          this._insertNode(siblings, parentNode, domChildNo, charpos, ins, doc);
        break;
        case Node.COMMENT_NODE:
          ins = doc.createComment(value);
          this._insertNode(siblings, parentNode, domChildNo, charpos, ins, doc);
        break;
        case Node.ATTRIBUTE_NODE:
          if (parentNode.nodeType != Node.ELEMENT_NODE) {
            throw new Error("Parent not an element");
          }

          parentNode.setAttribute(operation.nodeName, value);
        break;
        default:
          throw new Error("Unknown NodeType " + nodeType);
      }
    },

    /**
     * Apply delete operation.
     * 
     * @param doc
     *          document to be patched
     * @param operation
     *          delete operation
     */
    _doDelete : function(doc, operation) {
      var deleteNode = this._findNodeByXPath(doc, operation.node);
      if (deleteNode.nodeType == Node.ATTRIBUTE_NODE) {
        deleteNode.ownerElement.removeAttributeNode(deleteNode);
      } else if (deleteNode.nodeType == Node.TEXT_NODE) {
        var charpos = operation.charpos === undefined ? 1 : operation.charpos;
        var length = operation.length;
        if (length === undefined) {
          this._deleteText2(deleteNode, charpos, doc);
        } else {
          try {
            this._deleteText(deleteNode, charpos, length, doc);
          } catch (e) {
            this._deleteText2(deleteNode, charpos, doc);
          }
        }
      } else {
        deleteNode.parentNode.removeChild(deleteNode);
      }
    },

    /**
     * Perform update operation.
     * 
     * @param doc
     *          The document being patched
     * @param operation
     *          The update operation
     */
    _doUpdate : function(doc, operation) {
      var node = this._findNodeByXPath(doc, operation.node);

      if (node.nodeType == Node.ELEMENT_NODE) {
        var newNode = doc.createElement(operation.nodeName);
        for ( var i = 0, l = node.attributes.length; i < l; i++) {
          newNode.attributes[node.attributes[i].name] = node.attributes[i].value;
        }

        // Move all the children over
        while (node.hasChildNodes()) {
          newNode.appendChild(updateNode.firstChild);
        }

        node.parentNode.replaceChild(newNode, node);
      } else {
        node.nodeValue = operation.nodeValue;
      }
    },

    /**
     * Apply move operation.
     * 
     * @param doc
     *          document to be patched
     * @param operation
     *          move operation
     */
    _doMove : function(doc, operation) {
      var node = this._findNodeByXPath(doc, operation.node);
      var oldCharPos = operation.ocharpos;
      var newCharPos = operation.ncharpos;

      if (node.nodeType == Node.TEXT_NODE) {
        var text = "";
        try {
          var length = operation.length;
          if (length) {
            text = this._deleteText(node, oldCharPos, length, doc);
          } else {
            text = this._deleteText2(node, oldCharPos, doc);
          }
        } catch (e) {
          text = this._deleteText2(node, oldCharPos, doc);
        }

        node = doc.createTextNode(text);
      }

      if (node.nodeType != Node.TEXT_NODE) {
        node = node.parentNode.removeChild(node);
      }

      // Find position to move to
      // Get parent
      var parent = this._findNodeByXPath(doc, operation.parent);
      var newSiblings = parent.childNodes;
      var domcn = this._getDOMChildNo(node.nodeType, newSiblings, operation.childNo);

      // Perform insert
      this._insertNode(newSiblings, parent, domcn, newCharPos, node, doc);
    },

    _findNodeByXPath : function(document, xpath) {
      var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      return result.iterateNext();
    },

    /**
     * Get the DOM Child number
     * 
     * @param nodeType
     *          the nodeType to be inserted
     * @param siblings
     *          the siblings of the node
     * @param xPathChildNo
     *          operation childNo
     * @return the DOM Child number of the node
     */
    _getDOMChildNo : function(nodeType, siblings, xpathcn) {
      var domcn = 0;

      //Convert xpath childno to DOM childno
      if (nodeType != Node.ATTRIBUTE_NODE) {
          domcn = this._getDOMChildNoFromXPath(siblings, xpathcn);
      }

      return domcn;
    },
    
    /**
     * Get the DOM Child Number equivalent of the XPath childnumber.
     *
     * @param siblings the NodeList we are interested in
     * @param xpathcn  the XPath child number
     * @return the equivalent DOM child number
     */
    _getDOMChildNoFromXPath: function (siblings, xpathcn) {
      var domIndex = 0;
      var xPathIndex = 1;
      while ((xPathIndex < xpathcn) && (domIndex < siblings.length)) {
        if (!((this._prevNodeIsATextNode(siblings, domIndex)) && (siblings.item(domIndex).nodeType == Node.TEXT_NODE))) {
          xPathIndex++;
        }
        domIndex++;
      }
      //Handle appending nodes
      if (xPathIndex < xpathcn) {
        domIndex++;
        xPathIndex++;
      }
      
      return domIndex;
    },

    /**
     * Tests if previous node is a text node.
     * 
     * @param siblings
     *          siblings of current node
     * @param index
     *          index of current node
     * @return true if previous node is a text node, false otherwise
     */
    _prevNodeIsATextNode : function(siblings, index) {
      return index > 0 && siblings.item(index - 1).nodeType == Node.TEXT_NODE;
    },

    /**
     * Inserts a node at the given character position.
     * 
     * @param charpos
     *          the character position to insert at
     * @param siblings
     *          the NodeList to insert the node into
     * @param domcn
     *          the child number to insert the node as
     * @param ins
     *          the node to insert
     * @param parent
     *          the node to become the parent of the inserted node
     */
    _insertAtCharPos : function(charpos, siblings, domcn, ins, parent, doc) {
      // we know text node at domcn -1
      var cp = charpos;
      var textNodeIndex = domcn - 1;
      var append = false;

      while (this._prevNodeIsATextNode(siblings, textNodeIndex)) {
        textNodeIndex--;
      }

      while ((siblings.item(textNodeIndex).nodeType == Node.TEXT_NODE) && (cp > siblings.item(textNodeIndex).length)) {
        cp = cp - siblings.item(textNodeIndex).length;
        textNodeIndex++;

        if (textNodeIndex == siblings.length) {
          if (cp > 1) {
            throw new Error("charpos past end of text");
          }
          append = true;
          parent.appendChild(ins);
          break;
        }
      }
      ;

      var sibNode = siblings.item(textNodeIndex);

      if (!append) {
        if (cp == 1) {
          parent.insertBefore(ins, sibNode);
        } else if (cp > sibNode.length) {
          var nextSib = sibNode.nextSibling;
          if (nextSib != null) {
            parent.insertBefore(ins, nextSib);
          } else {
            parent.appendChild(ins);
          }
        } else {
          var text = sibNode.nodeValue;
          var nextSib = sibNode.nextSibling;
          parent.removeChild(sibNode);
          var text1 = doc.createTextNode(text.substring(0, cp - 1));
          var text2 = doc.createTextNode(text.substring(cp - 1));
          if (nextSib != null) {
            parent.insertBefore(text1, nextSib);
            parent.insertBefore(ins, nextSib);
            parent.insertBefore(text2, nextSib);
          } else {
            parent.appendChild(text1);
            parent.appendChild(ins);
            parent.appendChild(text2);
          }
        }
      }
    },

    /**
     * Insert a node under parent node at given position.
     * 
     * @param siblings
     *          the NodeList to insert the node into
     * @param parent
     *          the parent to insert the node under
     * @param domcn
     *          the child number to insert the node as
     * @param charpos
     *          the character position at which to insert the node
     * @param ins
     *          the node to be inserted
     * @param doc
     *          the document we are inserting into
     */
    _insertNode : function(siblings, parent, domcn, charpos, ins, doc) {
      // siblings(domcn) is the node currently at the position we want to put
      // the node

      if (domcn > siblings.length) {
        throw new Error("Child number past end of nodes");
      }
      if (parent.nodeType != Node.ELEMENT_NODE && parent.nodeType != Node.DOCUMENT_NODE) {
        throw new Error("Parent must be an element");
      }

      if ((siblings.length > 0)) {

        // Check if inserting into text
        if (this._prevNodeIsATextNode(siblings, domcn)) {
          this._insertAtCharPos(charpos, siblings, domcn, ins, parent, doc);
        } else if (domcn < siblings.length) {
          parent.insertBefore(ins, siblings.item(domcn));
        } else {
          parent.appendChild(ins);
        }
      } else {
        parent.appendChild(ins);
      }
    },

    /**
     * Delete the appropriate amount of text from a Node.
     * 
     * Assumes a normalized document, i.e. no adjacent or empty text nodes.
     * 
     * @param delNode the text node to delete text from
     * @param charpos the character position at which to delete
     * @param length the number of characters to delete
     * @param doc the document being deleted from
     * @return the deleted text
     */
    _deleteText : function(delNode, charpos, length, doc) {
      if (delNode.nodeType != Node.TEXT_NODE) {
        throw new Error("Attempt to delete text from non-text node.");
      }

      var text = delNode.nodeValue;
      if (charpos > text.length) {
        throw new Error("charpos past end of text node.");
      }

      if ((length + charpos - 1) > text.length) {
        throw new Error("length past end of text node.");
      }

      var newText = text.substring(0, charpos - 1) + text.substring(charpos - 1 + length);
      if (newText.length > 0) {
        var newTextNode = doc.createTextNode(newText);
        delNode.parentNode.insertBefore(newTextNode, delNode);
      }

      delNode.parentNode.removeChild(delNode);

      return text.substring(charpos - 1, charpos - 1 + length);
    },

    /**
     * Delete the appropriate amount of text from a Node.
     * 
     * @param delNode the text node to delete text from
     * @param charpos the character position at which to delete
     * @param doc the document being deleted from
     * @return the deleted text
     */
    _deleteText2 : function(delNode, charpos, doc) {
      var length = delNode.nodeValue.length - charpos + 1;
      return this._deleteText(delNode, charpos, length, doc);
    }
  }
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Creates the edit script for the fmes algorithm.
 *
 * Uses the algorithm described in the paper
 * "Change Detection in Hierarchically Structure Information".
 */
EditScript = DiffXmlUtils.createClass(null, {  
  
  /**
   * Constructor for EditScript.
   * Used to create a list of modifications that will turn document1 into document2,
   * given a set of matching nodes.
   * 
   * @constructs
   * @param document1 the original document
   * @param document2 the modified document
   * @param matchings the set of matching nodes
   */
  init: function (document1, document2, matchings) {
    // The original document.
    this._document1 = document1;

    // The modified document.
    this._document2 = document2;
    
    // The set of matching nodes.
    this._matchings = matchings;

    //Delta
    this._delta = null;
  },
  proto : /** @lends EditScript.prototype */ {
    
    /**
     * Creates an Edit Script conforming to matchings that transforms
     * document1 into document2.
     *
     * Uses algorithm in "Change Detection in Hierarchically Structured
     * Information".
     *
     * @param delta (optional) delta object, if not specified InternalDelta is used.
     *
     * @return the resultant Edit Script
     */
    create: function(delta) {
      this._delta = delta||new InternalDelta();
      
      // Fifo used to do a breadth first traversal of doc2
      var fifo = new NodeFifo();
      fifo.addChildrenOfNode(this._document2);
      
      var doc2docEl = this._document2.documentElement;
      //Special case for aligning children of root node
      this._alignChildren(this._document1, this._document2, this._matchings);

      while (!fifo.isEmpty()) {
          var x = fifo.pop();
          fifo.addChildrenOfNode(x);

          var y = x.parentNode;
          var z = this._matchings.getPartner(y);
          var w = this._matchings.getPartner(x);

          if (!this._matchings.isMatched(x)) {
            w = this._doInsert(x, z);
          } else {
            // TODO: Update should go here
            // Special case for document element
              if (NodeOps.checkIfSameNode(x, doc2docEl) && !Match.compareElements(w, x)) {
                w = this._doUpdate(w, x);
              } else { 
                if (!(this._matchings.getPartner(y) == w.parentNode)) {
                  this._doMove(w, x, z, this._matchings);
                }
              }
          }

          this._alignChildren(w, x, this._matchings);
      }

      this._deletePhase(this._document1, this._matchings);

      // TODO: Assert following
      // Post-Condition es is a minimum cost edit script,
      // Matchings is a total matching and
      // doc1 is isomorphic to doc2

      return this._delta;
    },

    /**
     * Updates a Node to the value of another node.
     * 
     * @param w The Node to be updated
     * @param x The Node to make it like
     * @return The new Node
     */
    _doUpdate: function (w, x) {
      var doc1 = w.ownerDocument;
      var newW = null;
      if (w.nodeType == Node.ELEMENT_NODE) {

          this._delta.update(w, x);

          //Unfortunately, you can't change the node name in DOM, so we need
          //to create a new node and copy it all over
          
          //TODO: Note you don't actually *need* to do this!!!
          //TODO: Only call this when in debug
          newW = doc1.createElement(x.nodeName);
          
          // Copy x's attributes to the new element
          var attrs = x.attributes;
          for (var i = 0; i < attrs.length; i++) {
            newW.attributes[attrs[i].name] = attrs[i].value;
          }
          
          while (w.hasChildNodes()) {
            newW.appendChild(w.firstChild);
          }

          w.parentNode.replaceChild(newW, w);
          this._matchings.remove(w);
          this._matchings.add(newW, x);   
      }
      
      return newW;
    },
    /**
     * Inserts (clone of) node x as child of z according to the algorithm 
     * and updates the Edit Script.
     *
     * @param x          current node
     * @param z          partner of x's parent
     * @return           the inserted node
     */
    _doInsert: function (x, z) {
        //Find the child number (k) to insert w as child of z 
        var pos = new FindPosition(x, this._matchings);

        //Apply insert to doc1
        //The node we want to insert is the import of x with attributes but no children

        var w = x.cloneNode(false);
        
        //Need to set in order as won't be revisited
        NodeOps.setInOrder(w);
        NodeOps.setInOrder(x);

        this._delta.insert(w, z, pos.getXPathInsertPosition(), pos.getCharInsertPosition());

        //Take match of parent (z), and insert
        w = this._insertAsChild(pos.getDOMInsertPosition(), z, w);

        this._matchings.add(w, x);

        return w;
    },

    /**
     * Performs a move operation according to the algorithm and updates
     * the EditScript.
     *
     * @param w          the node to be moved
     * @param x          the matching node
     * @param z          the partner of x's parent
     * @param matchings  the set of matching nodes
     */
    _doMove: function (w, x, z, matchings) {
      
      var v = w.parentNode;
      var y = x.parentNode;
      
      // Apply move if parents not matched and not null

      var partnerY = matchings.getPartner(y);
      if (NodeOps.checkIfSameNode(v, partnerY)) {
        throw new Error("v is same as partnerY");
      }
      
      var pos = new FindPosition(x, matchings);
      
      NodeOps.setInOrder(w);
      NodeOps.setInOrder(x);

      this._delta.move(w, z, pos.getXPathInsertPosition(), pos.getCharInsertPosition());

      //Apply move to T1
      this._insertAsChild(pos.getDOMInsertPosition(), z, w);
    },

    /**
     * Performs the deletePhase of the algorithm.
     *
     * @param n          the current node
     * @param matchings  the set of matching nodes
     */
    _deletePhase: function (n, matchings) {
      var kids = n.childNodes;
      if (kids != null) {
        // Note that we loop *backward* through kids
        for (var i = (kids.length - 1); i >= 0; i--) {
          this._deletePhase(kids.item(i), matchings);
        }
      }

      // If node isn't matched, delete it
      if (!matchings.isMatched(n) && n.nodeType != Node.DOCUMENT_TYPE_NODE) {
        this._delta.deleteNode(n);
        n.parentNode.removeChild(n);
      }
    },

    /**
     * Mark the children of a node out of order.
     *
     * @param n the parent of the nodes to mark out of order
     */
    _markChildrenOutOfOrder: function (n) {
      for (var i = 0, l = n.childNodes.length; i < l; i++) {
        NodeOps.setOutOfOrder(n.childNodes.item(i));
      }
    },

    /**
     * Mark the children of a node in order.
     *
     * @param n the parent of the nodes to mark in order
     */
    _markChildrenInOrder: function (n) {
      for (var i = 0, l = n.childNodes.length; i < l; i++) {
        NodeOps.setInOrder(n.childNodes.item(i));
      }
    },
    
    /**
     * Marks the Nodes in the given list and their partners "inorder".
     *
     * @param seq  the Nodes to mark "inorder"
     * @param matchings the set of matching Nodes
     */
    _setNodesInOrder: function (seq, matchings) {
      for (var i = 0, l = seq.length; i < l; i++) {
        var node = seq[i];
        NodeOps.setInOrder(node);
        NodeOps.setInOrder(matchings.getPartner(node));
      }
    },

    /**
     * Moves nodes that are not in order to correct position.
     *
     * @param w Node with potentially misaligned children
     * @param wSeq Sequence of children of w that have matches in the children of x
     * @param stay The List of nodes not to be moved
     * @param matchings The set of matching nodes
     */
    _moveMisalignedNodes: function (w, wSeq, stay, matchings) {
      for (var wSeqIndex = 0, wSeqLength = wSeq.length; wSeqIndex < wSeqLength; wSeqIndex++) {
        var a = wSeq[wSeqIndex];
        if (NodeOps.getNodeIndex(stay, a) == -1) {
          var b = matchings.getPartner(a);
          var pos = new FindPosition(b, matchings);
          this._delta.move(a, w, pos.getXPathInsertPosition(), pos.getCharInsertPosition());
          this._insertAsChild(pos.getDOMInsertPosition(), w, a);
          NodeOps.setInOrder(a);
          NodeOps.setInOrder(b);
        }
      }
    },

    /**
     * Aligns children of current node that are not in order.
     *
     * @param w  the match of the current node.
     * @param x  the current node

     * @param matchings  the set of matchings
     */
    _alignChildren: function (w, x, matchings) {
      //Order of w and x is important
      this._markChildrenOutOfOrder(w);
      this._markChildrenOutOfOrder(x);

      var wKids = w.childNodes;
      var xKids = x.childNodes;

      var wSeq = NodeSequence.getSequence(wKids, xKids, matchings);
      var xSeq = NodeSequence.getSequence(xKids, wKids, matchings);

      var lcsSeq = NodeSequence.getLCS(wSeq, xSeq, matchings);
      this._setNodesInOrder(lcsSeq, matchings);
      
      this._moveMisalignedNodes(w, wSeq, lcsSeq, matchings);
      
      //The following is missing from the algorithm, but is important
      this._markChildrenInOrder(w);
      this._markChildrenInOrder(x);
    },
    
    /**
     * Inserts a given node as numbered child of a parent node.
     *
     * If childNum doesn't exist the node is simply appended.
     *
     * @param childNum  the position to add the node to
     * @param parent    the node that is to be the parent
     * @param insNode   the node to be inserted
     * @return The inserted Node
     */
    _insertAsChild: function (childNum, parent, insNode) {
      if (insNode.parentNode) {
        insNode.parentNode.removeChild(insNode);
      }
      
      var child = parent.childNodes.item(childNum);
      if (child) {
        parent.insertBefore(insNode, child);
      } else {
        parent.appendChild(insNode);
      }
      
      return insNode;
    }
  }
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class 
 * Finds the position to insert a Node at.
 * 
 * Calculates XPath, DOM and character position.
 */
FindPosition = DiffXmlUtils.createClass(null, {
  
  /**
   * Finds the child number to insert a node as.
   *
   * (Equivalent to the current child number of the node to insert
   * before)
   *
   * @constructs
   * @param x         the node with no partner
   * @param matchings the set of matching nodes
   */
  init: function (x, matchings) {
    
    // The DOM position. 
    this._insertPositionDOM = null;
    
    // The XPath position.
    this._insertPositionXPath = null;
    
    // The character position.
    this._charInsertPosition = null;
    
    var v = this._getInOrderLeftSibling(x);
    if (v == null) {
      this._insertPositionDOM = 0;
      this._insertPositionXPath = 1;
      this._charInsertPosition = 1;
    } else {
      // Get partner of v and return index after
      // (we want to insert after the previous in-order node, so that
      // w's position is equivalent to x's).
      var u = matchings.getPartner(v);
      var uChildNo = new ChildNumber(u);
      //Need position after u
      this._insertPositionDOM = uChildNo.getInOrderDOM() + 1;
      this._insertPositionXPath = uChildNo.getInOrderXPath() + 1;
      //For xpath, character position is used if node is text node
      if (u.nodeType == Node.TEXT_NODE) {
        this._charInsertPosition = uChildNo.getInOrderXPathCharPos() + u.length;
      } else {
       this._charInsertPosition = 1;
      }
    }
  },
  proto : /** @lends FindPosition.prototype */ {
    /**
     * Gets the rightmost left sibling of n marked "inorder".
     *
     * @param n Node to find "in order" left sibling of
     * @return  Either the "in order" left sibling or null if none
     */
    _getInOrderLeftSibling: function (n) {
      var curr = n.previousSibling;
      while (curr != null && !NodeOps.isInOrder(curr)) {
        curr = curr.previousSibling;
      }

      return curr;
    },

    /**
     * Returns the DOM number the node should have when inserted.
     * 
     * @return the DOM number to insert the node as
     */
    getDOMInsertPosition: function () {
      return this._insertPositionDOM;
    },
    
    /**
     * Returns the XPath number the node should have when inserted.
     * 
     * @return The XPath number to insert the node as
     */
    getXPathInsertPosition: function () {
      return this._insertPositionXPath;
    },
    
    /**
     * Returns the character position to insert the node as.
     * 
     * @return The character position to insert the node at
     */
    getCharInsertPosition: function () {
      return this._charInsertPosition;
    }
  }  
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class 
 * Fmes finds the differences between two DOM documents.
 *
 * Uses the Fast Match Edit Script algorithm (fmes).
 */
Fmes = DiffXmlUtils.createClass(null, { 
  /**
   * Constructor
   * @constructs
   */
  init: function () {
  },
  proto : /** @lends Fmes.prototype */ {
    /**
     * Differences two DOM documents and returns the delta.
     *
     * @param document1    The original document
     * @param document2    The new document
     * @param delta        (optional) Delta object to be used
     *
     * @return A delta of changes
     */
    diff: function (document1, document2, delta) {
      var matchings = Match.easyMatch(document1, document2);
      return (new EditScript(document1, document2, matchings)).create(delta);
    } 
  }
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class 
 * Implements a First In First Out list.
 *
 * Equivalent to a stack where elements are removed from
 * the *opposite* end to where the are added. Hence the
 * Stack terms "push" and pop" are used.
 */
NodeFifo = DiffXmlUtils.createClass(null, {
  /**
   * Default constructor.
   * @constructs
   */
  init: function () {
    // Underlying list.
    this._fifo = new Array();
  },
  proto : /** @lends NodeFifo.prototype */ {
    
    push: function (n) {
      this._fifo.push(n);
    },

    /**
     * Checks if the Fifo contains any objects.
     *
     * @return true if there are any objects in the Fifo
     */

    isEmpty: function () {
       return this._fifo.length == 0;
    },

    /**
     * Remove a Node from the Fifo.
     *
     * This Node is always the oldest item in the array.
     *
     * @return the oldest item in the Fifo
     */
    pop: function () {
      if (this.isEmpty()) {
        return null;
      }
      
      return this._fifo.shift();
    },

    /**
     * Adds the children of a node to the fifo.
     *
     * @param x the node whose children are to be added
     */
    addChildrenOfNode: function (x) {
      var kids = x.childNodes;

      if (kids != null) {
        for (var i = 0, l = kids.length; i < l; i++) {
          if ((kids.item(i).nodeType == Node.DOCUMENT_TYPE_NODE)) {
            continue;
          }

          this.push(kids.item(i));
        }
      }
    }
  }  
});/**
 * @class 
 * Class to handle general diffxml operations on Nodes.
 */
NodeOps = /** @lends NodeOps */ {
    
  /**
   * Replacement for obsolete Node.setUserData
   * 
   * @param node node
   * @param name userKey
   * @param value userData
   */
  setUserData: function (node, name, value) {
    // TODO: Use Element.dataSet (https://developer.mozilla.org/en-US/docs/DOM/element.dataset) when supported
    
    if (!node._userData) {
      node._userData = {};
    }
    
    node._userData[name] = value;
  },
  
  /**
   * Replacement for obsolete Node.getUserData
   * 
   * @param node node
   * @param name userKey
   */
  getUserData: function (node, name) {
    // TODO: Use Element.dataSet (https://developer.mozilla.org/en-US/docs/DOM/element.dataset) when supported

    if (node._userData) {
      return node._userData[name];
    }
    
    return null;
  },
  
  /**
   * Returns a index of a node from array of nodes or NodeList
   * 
   * @param list array / NodeList
   * @param node node
   * @returns index of node or -1 if not found
   */
  getNodeIndex: function (list, node) {
    // TODO: Is this method really necessary?
    if (list instanceof Array) {
      return list.indexOf(node);
    } else if (list instanceof NodeList) {
      for (var i = 0, l = list.length; i < l; i++) {
        if (list.item(i) == node) {
          return i;
        }
      }
    }
    
    return -1;
  },

  /**
   * Mark the node as being "inorder".
   *
   * @param n the node to mark as "inorder"
   */
  setInOrder: function (n) {
    NodeOps.setUserData(n, "inorder", true);
  },

  /**
   * Mark the node as not being "inorder".
   *
   * @param n the node to mark as not "inorder"
   */
  setOutOfOrder: function (n) {
    NodeOps.setUserData(n, "inorder", false);
  },

  /**
   * Check if node is marked "inorder".
   *
   * Note that nodes are inorder by default.
   *
   * @param n node to check
   * @return false if UserData set to False, true otherwise
   */
  isInOrder: function (n) {
    var data = NodeOps.getUserData(n, "inorder");
    return data == null ? true : data;
  },

  /**
   * Check if nodes are the same.
   * 
   * @param x first node to check
   * @param y second node to check
   * @return true if same node, false otherwise
   */

  checkIfSameNode: function (x, y) {
    if (x != null && y != null) {
      return x == y;
    } 

    return false;
  },
  
  /**
   * Calculates an XPath that uniquely identifies the given node.
   * For text nodes note that the given node may only be part of the returned
   * node due to coalescing issues; use an offset and length to identify it
   * unambiguously.
   * 
   * @param n The node to calculate the XPath for.
   * @return The XPath to the node as a String
   */
  getXPath: function(n) {
    var xpath;
    if (n.nodeType == Node.ATTRIBUTE_NODE) {
        //Slightly special case for attributes as they are considered to
        //have no parent
      // TODO: ownerElement property is deprecated.
      xpath = this.getXPath(n.ownerElement) + "/@" + n.nodeName;
    } else if (n.nodeType == Node.DOCUMENT_NODE) {
      xpath = "/";
    } else if (n.nodeType == Node.DOCUMENT_TYPE_NODE) {
      throw new Error("DocumentType nodes cannot be identified with XPath");
    } else if (n.parentNode.nodeType == Node.DOCUMENT_NODE) {
      var cn = new ChildNumber(n);
      xpath = "/node()[" + cn.getXPath() + "]"; 
    } else {
      var cn = new ChildNumber(n);
      xpath = this.getXPath(n.parentNode) + "/node()[" + cn.getXPath() + "]";
    }
    
    return xpath;
  },
  
  /**
   * Check if node is an empty text node.
   * 
   * @param n The Node to test.
   * @return True if it is a 0 sized text node
   */
  nodeIsEmptyText: function (n) {
    if (n.nodeType = Node.TEXT_NODE) {
      return n.length == 0;
    }
    
    return false;
  }
};
/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Class to hold pairs of nodes.
 */
NodePairs = DiffXmlUtils.createClass(null, {
  /**
   * Constructor
   * @constructs
   */
  init: function () {
    this._pairs = new Object();
    this._pairCount = 0;
    this._hashCounter = new Date().getTime();
  },
  proto : /** @lends NodePairs.prototype */ {
    /**
     * Adds a pair of nodes to the set. Sets UserData as matched.
     * 
     * @param x first node
     * @param y partner of first node
     */
    add: function (x, y) {
      var xHash = ++this._hashCounter; 
      var yHash = ++this._hashCounter; 
    
      this._pairs[xHash] = y;
      this._pairs[yHash] = x;
      this._pairCount += 2;
      
      NodeOps.setUserData(x, "hash", xHash);
      NodeOps.setUserData(y, "hash", yHash);

      this._setMatched(x, y);
    },

    /**
     * Mark the node as being "matched".
     *
     * @param n the node to mark as "matched"
     */
    _setMatchedNode: function (n) {
      NodeOps.setUserData(n, "matched", true);
    },

    /**
     * Check if node is marked "matched".
     *
     * Made static so that I can use a instance method later if it is faster or
     * better.
     * 
     * @param n node to check
     * @return true if marked "matched", false otherwise
     */
    isMatched: function (n) {
      var data = NodeOps.getUserData(n, "matched");
      return data == null ? false : data;
    },
    
    /**
     * Mark a pair of nodes as matched.
     *
     * @param nodeA  The unmatched partner of nodeB
     * @param nodeB  The unmatched partner of nodeA
     */
    _setMatched: function (nodeA, nodeB) {
      this._setMatchedNode(nodeA);
      this._setMatchedNode(nodeB);
    },
    
    /**
     * Returns the partner of a given node. Returns null if the node does not
     * exist.
     * 
     * @param n the node to find the partner of.
     * @return the partner of n.
     */
    getPartner: function (n) {
      if (n == null) {
        return null;
      } else {
        var hash = NodeOps.getUserData(n, "hash");
        return hash ? this._pairs[hash]||null : null;
      }
    },

    /**
     * Get the number of nodes stored. 
     * 
     * Note that this includes both nodes and partners.
     * 
     * @return The number of nodes stored.
     */
    size: function () {
      return this._pairCount;
    },
    
    /**
     * Remove a node and it's partner from the list of matchings.
     * 
     * @param n The Node to remove
     */
    remove: function (n) {
      var nHash = NodeOps.getUserData(n, "hash");
      var nMatch = this._pairs[nHash];
      NodeOps.setUserData(nMatch, "matched", null);
      NodeOps.setUserData(n, "matched", null);
      
      delete this._pairs[NodeOps.getUserData(nMatch, "hash")];
      delete this._pairs[nHash];
      
      this._pairCount -= 2;
    }
    
  }
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Associates depth with a node.
 */
NodeDepth = DiffXmlUtils.createClass(null, {
  /**
   * Create a NodeDepth for the given node.
   *
   * @constructs
   * @param node The node to find the depth of
   */
  init: function (node) {
    // Node we're pointing to.
    this._node = node;

    // Field holding nodes depth.
    this._depth = this._calculateDepth(this._node);
  },
  proto : /** @lends NodeDepth.prototype */ {
    
    /**
     * Returns the depth value.
     *
     * @return The current depth value
     */
    getDepth: function () {
      return this._depth;
    },
    
    /**
     * Returns the underlying node.
     *
     * @return The Node.
     */
    getNode: function () {
      return this._node;  
    },
    
    /**
     * Calculates the depth of a Node.
     * 
     * The root Node is at depth 0.
     * 
     * @param node The Node to calculate the depth of
     * @return The depth of the node
     */
    _calculateDepth: function (node) {
      var depth = 0;
      var tmpNode = node;
      var doc;
      if (node.nodeType == Node.DOCUMENT_NODE) {
        doc = node;
      } else {
        doc = tmpNode.ownerDocument;
      }

      while (tmpNode != doc) {
        depth++;
        tmpNode = tmpNode.parentNode;
      }
      
      return depth;
    }
  }  
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class
 * Solves the "good matchings" problem for the FMES algorithm.
 *
 * Essentially pairs nodes that match between documents.
 * Uses the "fast match" algorithm is detailed in the paper
 * "Change Detection in Hierarchically Structure Information".
 *
 * WARNING: Will only work correctly with acylic documents.
 * TODO: Add alternate matching code for cylic documents.
 * See: http://www.devarticles.com/c/a/Development-Cycles/How-to-Strike-a-Match/
 * for information on how to match strings.
 */
Match = /** @lends Match */ {
  /**
   * Performs fast match algorithm on given DOM documents.
   * 
   *  TODO: May want to consider starting at same point in 2nd tree somehow, 
   *  may lead to better matches.
   * 
   * @param document1 The original document
   * @param document2 The modified document
   * 
   * @return NodeSet containing pairs of matching nodes.
   */
  easyMatch: function (document1, document2) {
    var matchSet = new NodePairs();
    
    document1.documentElement.normalize();
    document2.documentElement.normalize();
    
    var list1 = this._initialiseAndOrderNodes(document1);
    var list2 = this._initialiseAndOrderNodes(document2);
    
    //Explicitly add document elements and root
    matchSet.add(document1, document2);
    matchSet.add(document1.documentElement, document2.documentElement);
    
    // Proceed bottom up on List 1
    for (var i = 0, l = list1.length; i < l; i++) {
      var nd1 = list1[i];
      var n1 = nd1.getNode();
      for (var j = 0, jl = list2.length; j < jl; j++) {
        var nd2 = list2[j];
        var n2 = nd2.getNode();
        
        if (this._compareNodes(n1, n2)) {
          matchSet.add(n1, n2);
          //Don't want to consider it again
          this._removeItemFromNodeDepth(list2, nd2);
          break;
        }
      }
    }

    return matchSet;
  },
  
  /**
   * Compares two elements two determine whether they should be matched.
   * 
   * TODO: This method is critical in getting good results. Will need to be
   * tweaked. In addition, it may be an idea to allow certain doc types to
   * override it. Consider comparing position, matching of kids etc.
   * 
   * @param a First element
   * @param b Potential match for b
   * @return true if nodes match, false otherwise
   */
  compareElements: function (a, b) {
    var ret = false;

    if (a.nodeName == b.nodeName) {
        //Compare attributes
        
        //Attributes are equal until we find one that doesn't match
        ret = true;
        
        var aAttrs = a.attributes;
        var bAttrs = b.attributes;

        var numberAAttrs = 0;
        if (aAttrs != null) {
            numberAAttrs = aAttrs.length;
        }
        var numberBAttrs = 0;
        if (bAttrs != null) {
            numberBAttrs = bAttrs.length;
        }
        if (numberAAttrs != numberBAttrs) {
            ret = false;
        }

        var i = 0;
        while (ret && (i < numberAAttrs)) {
            // Check if attr exists in other tag
            var bItem = bAttrs[aAttrs.item(i).nodeName]; 
            if (bItem == null || (bItem.value != aAttrs.item(i).value)) {
                ret = false;
            } 
            i++;
        }
    }
    
    return ret;
  },
  
  /**
   * Compares two text nodes to determine if they should be matched.
   * 
   * Takes into account whitespace options.
   * 
   * @param a First node
   * @param b Potential match for a
   * @return True if nodes match, false otherwise
   */

  compareTextNodes: function (a, b) {
    var aString = a.data;
    var bString = b.data;

    return aString == bString;
  },

  /**
   * Compares 2 nodes to determine whether they should match.
   * 
   * TODO: Check if more comparisons are needed
   * TODO: Consider moving out to a separate class, implementing an interface
   * 
   * @param a first node
   * @param b potential match for a
   * @return true if nodes match, false otherwise
   */
  _compareNodes: function (a, b) {
    var ret = false;

    if (a.nodeType == b.nodeType) { 
      switch (a.nodeType) {
        case Node.ELEMENT_NODE :
          ret = this.compareElements(a, b);
        break;
        case Node.TEXT_NODE :
          ret = this.compareTextNodes(a, b);
        break;
        case Node.DOCUMENT_NODE :
          //Always match document nodes
          ret = true;
        break;
        default :
          ret = a.nodeValue == b.nodeValue;
        break;
      }
    }
    
    return ret;
  },

  /**
   * Returns a list of Nodes sorted according to their depths.
   * 
   * Does *NOT* include root or documentElement
   * 
   * TreeSet is sorted in reverse order of depth according to
   * NodeInfoComparator.
   * 
   * @param doc The document to be initialised and ordered.
   * @return A depth-ordered list of the nodes in the doc.
   */
  _initialiseAndOrderNodes: function (doc) {
    var ni = doc.createNodeIterator(doc, NodeFilter.SHOW_ALL, null);
    var depthSorted = new Array();
    var n;
    while ((n = ni.nextNode()) != null) {
      if (!(NodeOps.checkIfSameNode(doc, n) || NodeOps.checkIfSameNode(doc.documentElement, n) || n.nodeType == Node.DOCUMENT_TYPE_NODE)) {
        depthSorted.push(new NodeDepth(n));
      }
    }
  
    ni.detach();
  
    depthSorted.sort(function (nodeInfo1, nodeInfo2) {
      return nodeInfo2.getDepth() - nodeInfo1.getDepth();
    });
  
    return depthSorted;
  },
  
  /**
   * Removes nodeDepth from array of nodeDepths
   * 
   * @param list array of nodeDepths
   * @param nodeDepth nodeDepth to be removed
   */
  _removeItemFromNodeDepth: function (list, nodeDepth) {
    var index = list.indexOf(nodeDepth);
    if (index != -1) {
      list.splice(index, 1);
    }
  }

};/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Class to hold pairs of nodes.
 */
NodeSequence = /** @lends NodeSequence */ {
  
  /**
   * Gets the nodes in set1 which have matches in set2.
   *
   * @param set1      the first set of nodes
   * @param set2      the set of nodes to match against
   * @param matchings the set of matching nodes
   *
   * @return the nodes in set1 which have matches in set2
   */
  getSequence: function (set1, set2, matchings) {
    var seq = null;
    if (set1 != null && set2 != null) {
      var resultSet = new Array();
      var set2list = new Array();
      for (var i = 0, l = set2.length; i < l; i++) {
        set2list.push(set2.item(i));
      }
      
      for (var i = 0, l = set1.length; i < l; i++) {
        if (set2list.indexOf(matchings.getPartner(set1.item(i))) != -1) {
          resultSet.push(set1.item(i));
        }   
      }
      
      seq = resultSet;
    }
    
    return seq; 
  },

  /**
   * Gets the Longest Common Subsequence for the given Node arrays.
   * 
   * "Matched" Nodes are considered equal.
   * The returned nodes are from s1.
   * 
   * TODO: Check for better algorithms
   * 
   * @param s1 First Node sequence 
   * @param s2 Second Node sequence
   * @param matchings Set of matching Nodes
   * @return A list of Nodes representing the Longest Common Subsequence 
   */
  getLCS: function (s1, s2, matchings) {
    var num = new Array();
    for (var i = 0, l = s1.length + 1; i < l; i++) {
      var subArray = new Array();
      for (var j = 0, jl = s2.length + 1; j < jl; j++) {
        subArray.push(0);
      }
      
      num.push(subArray);
    }
    
    for (var i = 1; i <= s1.length; i++) {
      for (var j = 1; j <= s2.length; j++) {
        var n1 = matchings.getPartner(s1[i - 1]);
        var n2 = s2[j - 1];
        if (NodeOps.checkIfSameNode(n1, n2)) {
          num[i][j] = 1 + num[i - 1][j - 1];
        } else {
          num[i][j] = Math.max(num[i - 1][j], num[i][j - 1]);
        }
      }
    }
    
    //Length of LCS is num[s1.length][s2.length]);

    var s1position = s1.length; 
    var s2position = s2.length;
    
    var result = new Array();

    while (s1position != 0 && s2position != 0) {
      if (NodeOps.checkIfSameNode(matchings.getPartner(s1[s1position - 1]), s2[s2position - 1])) {
        result.unshift(s1[s1position - 1]);
        s1position--;
        s2position--;
      } else if (num[s1position][s2position - 1] >= num[s1position - 1][s2position]) {
        s2position--;
      } else {
        s1position--;
      }
    }

    return result;
  }   
};/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class Class to hold and calculate DOM and XPath child numbers of node.
 */
ChildNumber = DiffXmlUtils.createClass(null, {  
  /**
   * Default constructor.
   * 
   * @constructs
   * @param node Node to find the child numbers of
   */
  init: function (node) {
    if (node == null) {
      throw new Error("Node cannot be null");
    }
    
    if (node.parentNode == null) {
      throw new Error("Node must have parent");
    }
    
    // DOM child number.
    this._domChildNo = -1;

    // XPath child number.
    this._xPathChildNo = -1;

    // XPath char position.
    this._xPathCharPos = -1;

    // In-order DOM child number.
    this._inOrderDOMChildNo = -1;

    // In-order XPath child number.
    this._inOrderXPathChildNo = -1;
    
    // In-order XPath text position.
    this._inOrderXPathCharPos = -1;
    
    // The node we are doing the calcs on.
    this._node = node;
    
    // The siblings of the node and the node itself. 
    this._siblings = this._node.parentNode.childNodes;
  },
  proto : /** @lends ChildNumber.prototype */ {
    /**
     * Get the DOM child number.
     * 
     * @return DOM child number of associated node.
     */
    getDOM: function () {
      if (this._domChildNo == -1) {
        this._calculateDOMChildNumber();
      }
      
      return this._domChildNo;
    },

    /**
     * Get the XPath child number.
     * 
     * @return XPath child number of associated node.
     */
    getXPathCharPos: function() {
      if (this._xPathCharPos == -1) {
        this._calculateXPathChildNumberAndPosition();
      }
      
      return this._xPathCharPos;
    },

    /**
     * Get the XPath child number.
     * 
     * @return XPath child number of associated node.
     */
    getInOrderXPathCharPos: function () {
      if (this._inOrderXPathCharPos == -1) {
        this._calculateInOrderXPathChildNumberAndPosition();
      }
      
      return this._inOrderXPathCharPos;
    },

    /**
     * Get the XPath child number.
     * 
     * @return XPath child number of associated node.
     */
    getXPath: function() {
      if (this._xPathChildNo == -1) {
        this._calculateXPathChildNumberAndPosition();
      }
      
      return this._xPathChildNo;
    },

    /**
     * Get the in-order XPath child number.
     * 
     * Only counts nodes marked in-order.
     * 
     * @return In-order XPath child number of associated node.
     */
    getInOrderXPath: function() {
      if (this._inOrderXPathChildNo == -1) {
        this._calculateInOrderXPathChildNumberAndPosition();
      }
      
      return this._inOrderXPathChildNo;
    },

    /**
     * Get the in-order DOM child number.
     * 
     * Only counts nodes marked in-order.
     * 
     * @return In-order DOM child number of associated node.
     */
    getInOrderDOM: function () {
      if (this._inOrderXPathChildNo == -1) {
        this._calculateInOrderDOMChildNumber();
      }
      
      return this._inOrderDOMChildNo;
    },
    
    /**
     * Determines whether XPath index should be incremented.
     * 
     * Handles differences between DOM index and XPath index
     * 
     * @param i The current position in siblings
     * @return true If index should be incremented
     */
    _incIndex: function (i) {
      var inc = true;
      var curr = this._siblings.item(i);
      // Handle non-coalescing of text nodes
      if ((i > 0 && this._nodesAreTextNodes([curr, this._siblings.item(i - 1)])) || NodeOps.nodeIsEmptyText(curr)) {
        inc = false;
      }

      return inc;
    },
    
    /**
     * Determines whether the given Nodes are all text nodes or not.
     * 
     * @param nodes The Nodes to checks.
     * @return true if all the given Nodes are text nodes
     */
    _nodesAreTextNodes: function(nodes) {
      var areText = true;
      for (var i = 0, l = nodes.length; i < l; i++) {
        var n = nodes[i];
        if ((n == null) || (n.nodeType != Node.TEXT_NODE)) {
          areText = false;
          break;
        }
      }
        
      return areText;
    },

    /**
     * Calculates the DOM index of the node.
     */
    _calculateDOMChildNumber: function () {
      var cn;

      for (cn = 0; cn < this._siblings.length; cn++) {
        if (NodeOps.checkIfSameNode(this._siblings.item(cn), this._node)) {
          break;
        }
      }
        
      this._domChildNo = cn;
    },

    /**
     * Calculates the "in order" DOM child number of the node.
     */
    _calculateInOrderDOMChildNumber: function () {
      this._inOrderDOMChildNo = 0;
      for (var i = 0; i < this._siblings.length; i++) {
        if (NodeOps.checkIfSameNode(this._siblings.item(i), this._node)) {
          break;
        }
        
        if (NodeOps.isInOrder(this._siblings.item(i))) {
          this._inOrderDOMChildNo++;
        }
      }
    },

    /**
     * Sets the XPath child number and text position.
     */
    _calculateXPathChildNumberAndPosition: function () {
      var domIndex = this._calculateXPathChildNumber();
      this._calculateXPathTextPosition(domIndex);   
    },

    /**
     * Sets the XPath child number and text position.
     */
    _calculateInOrderXPathChildNumberAndPosition: function () {
      var domIndex = this._calculateInOrderXPathChildNumber();
      this._calculateInOrderXPathTextPosition(domIndex);   
    },
    
    /**
     * Calculate the character position of the node.
     * 
     * @param domIndex The DOM index of the node in its siblings.
     */
    _calculateXPathTextPosition: function(domIndex) {
      this._xPathCharPos = 1;
      for (var i = (domIndex - 1); i >= 0; i--) {
        if (this._siblings.item(i).nodeType == Node.TEXT_NODE) {
          this._xPathCharPos = this._xPathCharPos + this._siblings.item(i).length;
        } else {
          break;
        }
      }
    },

    /**
     * Set the XPath child number of the node.
     * 
     * @return The DOM index of the node in its siblings
     */
    _calculateXPathChildNumber: function () {
      var childNo = 1;
      var domIndex;
      for (domIndex = 0; domIndex < this._siblings.length; domIndex++) {
        if (NodeOps.checkIfSameNode(this._siblings.item(domIndex), this._node)) {
          if (!this._incIndex(domIndex)) {
            childNo--;
          }
          break;
        }
        if (this._incIndex(domIndex)) {
          childNo++;
        }
      }
      
      this._xPathChildNo = childNo;
        
      return domIndex;
    },

    /**
     * Set the in-order XPath child number of the node.
     * 
     * @return The DOM index of the node in its siblings
     */
    _calculateInOrderXPathChildNumber: function () {

      var childNo = 0;
      var domIndex;
      var lastInOrderNode = null;
      var currNode = null;
      
      for (domIndex = 0; domIndex < this._siblings.length; domIndex++) {
        currNode = this._siblings.item(domIndex);
        if (NodeOps.isInOrder(currNode) && !(this._nodesAreTextNodes([currNode, lastInOrderNode]) || NodeOps.nodeIsEmptyText(currNode))) {
          childNo++;
        } 
        
        if (NodeOps.checkIfSameNode(currNode, this._node)) {
          break;
        }
        
        if (NodeOps.isInOrder(currNode)) {
          lastInOrderNode = currNode;
        }
      }
 
      //Add 1 if the given node wasn't in order
      if (currNode != null && !NodeOps.isInOrder(currNode)) {
        childNo++;
      }
 
      this._inOrderXPathChildNo = childNo;
      return domIndex;
    },

    /**
     * Calculate the character position of the node.
     * 
     * @param domIndex The DOM index of the node in its siblings.
     */
    _calculateInOrderXPathTextPosition: function (domIndex) {
      this._inOrderXPathCharPos = 1;
      
      for (var i = (domIndex - 1); i >= 0; i--) {
        if (this._siblings.item(i).nodeType == Node.TEXT_NODE) {
          if (NodeOps.isInOrder(this._siblings.item(i))) { 
            this._inOrderXPathCharPos = this._inOrderXPathCharPos + this._siblings.item(i).length;
          }
        } else if (NodeOps.isInOrder(this._siblings.item(i))) {
          break;
        }
      }
    }
  }  
});/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class
 * Constants used in DUL Deltas.
 */
DULConstants = /** @lends DULConstants */ {

    /** If the delta was created as a "reverse patch". **/
  REVERSE_PATCH: "reverse_patch",
  
  /** The amount of parent sibling context. **/
  PARENT_SIBLING_CONTEXT: "par_sib_context",
  
  /** The amount of parent context. **/
  PARENT_CONTEXT: "par_context",
  
  /** The amount of sibling context. **/
  SIBLING_CONTEXT: "sib_context",
  
  /** Document element of a DUL EditScript. **/
  DELTA: "delta",
  
  /** Character position of the "new" node. **/
  NEW_CHARPOS: "new_charpos",
  
  /** Character position of the "old" node. **/
  OLD_CHARPOS: "old_charpos",
  
  /** Move operation element. **/
  MOVE: "move",
  
  /** Number of characters to extract from a text node. **/
  LENGTH: "length",
  
  /** The node for the operation. **/
  NODE: "node",
  
  /** Delete operation element. **/
  DELETE: "delete",
  
  /** Character position in text of the node. **/
  CHARPOS: "charpos",
  
  /** Name of the node. **/
  NAME: "name",
  
  /** Child number of parent node. **/
  CHILDNO: "childno",
  
  /** DOM type of the node. **/
  NODETYPE: "nodetype",
  
  /** Parent of the node. **/
  PARENT: "parent",
  
  /** Insert operation element. **/ 
  INSERT: "insert",
  
  /** Update operation element. **/ 
  UPDATE: "update",
  
  /** If entities were resolved when creating the delta. **/
  RESOLVE_ENTITIES: "resolve_entities",
  
  /** False constant. **/
  FALSE: "false",
  
  /** True constant. **/
  TRUE: "true"

};/*
 * DiffXmlJs - JavaScript library for comparing XML files.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Lepp�� / Foyt
 * antti.leppa@foyt.fi
 */

/**
 * @class
 * Parser for DUL Patch format
 */
DULParser = /** @lends DULParser */ {
  
  /**
   * Parses DUL format patch and converts it into internal format
   * 
   * @param dulPatch DUL patch
   * @returns InternalDelta
   */
  parseDULPatch: function (dulPatch) {
    var deltaElement = dulPatch.documentElement;
    if (deltaElement.nodeName != DULConstants.DELTA) {
      throw new Error("All deltas must begin with a " + DULConstants.DELTA + " element.");
    }

    var processed = new Array();
    
    // TODO: 
    // var siblingContext = deltaElement.attributes[DULConstants.SIBLING_CONTEXT];
    // var parentContext = deltaElement.attributes[DULConstants.PARENT_CONTEXT];
    // var parentSiblingContext = deltaElement.attributes[DULConstants.PARENT_SIBLING_CONTEXT];
    // var parentSiblingContext = deltaElement.attributes[DULConstants.REVERSE_PATCH];
    // var resolveEntities = deltaElement.attributes[DULConstants.RESOLVE_ENTITIES];
    
    for (var i = 0, l = deltaElement.childNodes.length; i < l; i++) {
      var operationNode = deltaElement.childNodes[i];
      switch (operationNode.nodeName) {
        case DULConstants.INSERT:
          processed.push(this._parseInsert(operationNode));
        break;
        case DULConstants.DELETE:
          processed.push(this._parseDelete(operationNode));
        break;
        case DULConstants.MOVE:
          processed.push(this._parseMove(operationNode));
        break;
        case DULConstants.UPDATE:
          processed.push(this._parseUpdate(operationNode));
        break;
      }
    }
    
    var delta = new InternalDelta(processed);
    return delta;
  },
  
  _parseInsert: function (operation) {
    var parent = operation.getAttribute(DULConstants.PARENT);
    var nodeType = parseInt(operation.getAttribute(DULConstants.NODETYPE));

    var internalOperation = {
      type: 'insert',
      parent: parent,
      nodeType: nodeType
    };
    
    if (nodeType != Node.ATTRIBUTE_NODE) {
      internalOperation['childNo'] = operation.getAttribute(DULConstants.CHILDNO);
    }
    
    if ((nodeType == Node.ATTRIBUTE_NODE) || (nodeType == Node.ELEMENT_NODE) || (nodeType == Node.PROCESSING_INSTRUCTION_NODE)) {
      internalOperation['nodeName'] = operation.getAttribute(DULConstants.NAME);
    }
    
    var charPosAttr = operation.attributes[DULConstants.CHARPOS];
    if (charPosAttr) {
      internalOperation['charpos'] = charPosAttr.value;
    }
    
    var valueNode = operation.firstChild;
    if (valueNode) {
      internalOperation['value'] = valueNode.nodeValue;
    };

    return internalOperation;
  },
  
  _parseDelete: function (operation) {
    var internalOperation = {
      type: 'delete',
      node: operation.getAttribute(DULConstants.NODE)
    };
    
    var charpos = operation.getAttribute(DULConstants.CHARPOS);
    var length = operation.getAttribute(DULConstants.LENGTH);

    if (charpos !== null) {
      internalOperation['charpos'] = parseInt(charpos);
    }
    
    if (length !== null) {
      internalOperation['length'] = parseInt(length);
    }
    
    return internalOperation;
  },
  
  _parseMove: function (operation) {
    var internalOperation = {
      type: 'move',
      node: operation.getAttribute(DULConstants.NODE),
      ocharpos: parseInt(operation.getAttribute(DULConstants.OLD_CHARPOS)),
      ncharpos: parseInt(operation.getAttribute(DULConstants.NEW_CHARPOS)),
      parent: operation.getAttribute(DULConstants.PARENT),
      childNo: parseInt(operation.getAttribute(DULConstants.CHILDNO))
    };
    
    var lengthAttribute = operation.getAttribute(DULConstants.LENGTH);
    if (lengthAttribute !== null) {
      internalOperation['length'] = parseInt(lengthAttribute);
    };
    
    return internalOperation;
  },
  
  _parseUpdate: function (operation) {
    var internalOperation = {
      type: 'update',
      node: operation.getAttribute(DULConstants.NODE)
    };
    
    // We do not know is the node element or something else so we add operation node content to 
    // both nodeName and nodeValue fields
    // this should be changed in future.
    
    internalOperation['nodeName'] = internalOperation['nodeValue'] = operation.firstChild.nodeValue;
      
    return internalOperation;
  }
  
};