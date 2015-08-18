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
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.genericBox"), element: 'p', attributes: { 'class': 'material-basicbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.thinkingBox"), element: 'p', attributes: { 'class': 'material-thinkingbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.objectiveBox"), element: 'p', attributes: { 'class': 'material-objectivebox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.informationBox"), element: 'p', attributes: { 'class': 'material-infobox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.recapBox"), element: 'p', attributes: { 'class': 'material-recapbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.citationBasic"), element: 'p', attributes: { 'class': 'material-citation-basic material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.citationHighlight"), element: 'p', attributes: { 'class': 'material-citation-highlight material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.exampleBox"), element: 'p', attributes: { 'class': 'material-example material-styles-text' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.externalLinkBox"), element: 'p', attributes: { 'class': 'material-linkbox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.audioBox"), element: 'p', attributes: { 'class': 'material-audiobox material-styles-block' } },
  { name: getLocaleText("plugin.workspace.htmlMaterialEditor.stylesSets.chatBubble"), element: 'p', attributes: { 'class': 'material-chatbubble material-styles-block' } }
  
  /* Inline Styles */

  

  /* Object Styles */

 
] );

