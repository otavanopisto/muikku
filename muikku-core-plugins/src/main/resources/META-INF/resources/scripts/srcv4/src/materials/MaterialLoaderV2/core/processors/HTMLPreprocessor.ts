// srcv4/src/materials/MaterialLoaderV2/core/processors/HTMLPreprocessor.ts

import $ from "jquery";

/**
 * HTMLPreprocessor - Handles jQuery-based HTML preprocessing
 * Extracted from Base component
 */
export class HTMLPreprocessor {
  /**
   * Fixes the html inconsistencies because there are some of them which shouldn't but hey that's the case
   */
  static preprocess($html: JQuery<HTMLElement>): JQuery<HTMLElement> {
    $html.find("img").each(function () {
      if (!$(this).parent("figure").length) {
        const elem = document.createElement("span");
        elem.className = "image";

        $(this).replaceWith(elem);
        const src = this.getAttribute("src");
        if (src) {
          this.dataset.original = src;
          $(this).removeAttr("src");
        }

        elem.appendChild(this);
      } else {
        const src = this.getAttribute("src");
        if (src) {
          this.dataset.original = src;
          $(this).removeAttr("src");
        }
      }
    });

    $html.find("audio").each(function () {
      $(this).attr("preload", "metadata");
    });

    $html.find("source").each(function () {
      // This is done because there will be a bunch of 404's if the src is left untouched - the original url for the audio file src is incomplete as it's missing section/material_page path

      const src = this.getAttribute("src");

      if (src) {
        this.dataset.original = src;
        $(this).removeAttr("src");
      }
    });

    $html.find("a figure").each(function () {
      // removing old style images wrapped in a link
      // they get processed as link and thus don't work
      $(this).parent("a").replaceWith(this);
    });

    const $newHTML = $html.map(function () {
      if (this.tagName === "TABLE") {
        const elem = document.createElement("div");
        elem.className = "material-page__table-wrapper";
        elem.appendChild(this);
        return elem;
      }
      return this;
    });

    $newHTML.find("table").each(function () {
      if ($(this).parent().attr("class") === "material-page__table-wrapper") {
        return;
      }

      const elem = document.createElement("div");
      elem.className = "material-page__table-wrapper";

      $(this).replaceWith(elem);
      elem.appendChild(this);
    });

    return $newHTML;
  }
}
