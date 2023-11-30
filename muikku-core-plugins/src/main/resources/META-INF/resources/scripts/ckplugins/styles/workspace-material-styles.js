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
  { name: "Yleistyyli", element: 'div', attributes: { 'class': 'material-basicbox material-styles-block' } },
  { name: "Oppimispäiväkirja", element: 'div', attributes: { 'class': 'material-journalbox material-styles-block' } },
  { name: "Pohdi", element: 'div', attributes: { 'class': 'material-ponderbox material-styles-block' } },
  { name: "Tavoitteet", element: 'div', attributes: { 'class': 'material-objectivebox material-styles-block' } },
  { name: "Huomio", element: 'div', attributes: { 'class': 'material-infobox material-styles-block' } },
  { name: "Ohjeet", element: 'div', attributes: { 'class': 'material-instructionbox material-styles-block' } },
  { name: "Arviointiperusteet", element: 'div', attributes: { 'class': 'material-assignmentbox material-styles-block' } },
  { name: "Linkki", element: 'div', attributes: { 'class': 'material-linkbox material-styles-block' } },
  { name: "Ääni", element: 'div', attributes: { 'class': 'material-audiobox material-styles-block' } },
  { name: "Tiedosto", element: 'div', attributes: { 'class': 'material-filebox material-styles-block' } },
  { name: "Taulukko", element: 'div', attributes: { 'class': 'material-tablebox material-styles-block' } },
  { name: "Taulukko (pienennetty fontti)", element: 'div', attributes: { 'class': 'material-tablebox-small material-styles-block' } },
  { name: "Sisäinen Muikku-linkki", element: 'div', attributes: { 'class': 'material-muikkulinkbox material-styles-block' } },
  { name: "Korostettu teksti", element: 'div', attributes: { 'class': 'material-text-highlight material-styles-text' } },
  { name: "Sitaatti", element: 'div', attributes: { 'class': 'material-citation-basic material-styles-text' } },
  { name: "Pitkä sitaatti", element: 'div', attributes: { 'class': 'material-citation-long material-styles-text' } },
  { name: "Esimerkki", element: 'div', attributes: { 'class': 'material-example material-styles-text' } },
  { name: "Harjoitustehtävä", element: 'div', attributes: { 'class': 'material-exercise material-styles-text' } },
  { name: "Harjoitustehtävän palaute", element: 'div', attributes: { 'class': 'material-exercise-feedback material-styles-block', 'data-show': "true" } },

  { name: "Kuuntele ja toista", element: 'div', attributes: { 'class': 'material-visually-guided-styles-combo-block material-visually-guided-styles-combo__listen-and-speak'} },
  { name: "Kuuntele", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__listen'} },
  { name: "Puhu", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__speak'} },
  { name: "Lue", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__read'} },
  { name: "Kirjoita", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__write'} },
  { name: "Katso", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__look'} },
  { name: "Yhdistä", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__connect'} },
  { name: "Äänitä", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__record'} },
  { name: "Etsi", element: 'div', attributes: { 'class': 'material-visually-guided-styles-block material-visually-guided-styles__search'} },

  /* Inline Styles */



  /* Object Styles */


] );

