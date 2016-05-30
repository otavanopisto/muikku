/**
 * Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// This file contains style definitions that can be used by CKEditor plugins.
//
// The most common use for it is the "stylescombo" plugin, which shows a combo
// in the editor toolbar, containing all styles. Other plugins instead, like
// the div plugin, use a subset of the styles on their feature.
//
// If you don't have plugins that depend on this file, you can simply ignore it.
// Otherwise it is strongly recommended to customize this file to match your
// website requirements and design properly.

CKEDITOR.stylesSet.add( 'workspace-material-styles', [
  /* Block Styles */
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.genericBox"), element: 'div', attributes: { 'class': 'material-basicbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.grammarBox"), element: 'div', attributes: { 'class': 'material-grammarbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.thinkingBox"), element: 'div', attributes: { 'class': 'material-thinkingbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.objectiveBox"), element: 'div', attributes: { 'class': 'material-objectivebox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.informationBox"), element: 'div', attributes: { 'class': 'material-infobox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.instructionBox"), element: 'div', attributes: { 'class': 'material-instructionbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.recapBox"), element: 'div', attributes: { 'class': 'material-recapbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.citationBasic"), element: 'div', attributes: { 'class': 'material-citation-basic material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.citationHighlight"), element: 'div', attributes: { 'class': 'material-citation-highlight material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.longCitation"), element: 'div', attributes: { 'class': 'material-citation-long material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.exampleBox"), element: 'div', attributes: { 'class': 'material-example material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.externalLinkBox"), element: 'div', attributes: { 'class': 'material-linkbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.audioBox"), element: 'div', attributes: { 'class': 'material-audiobox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.fileBox"), element: 'div', attributes: { 'class': 'material-filebox material-styles-block' } }
  
  /* Inline Styles */

  

  /* Object Styles */

 
] );

