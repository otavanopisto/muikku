/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import $ from "~/lib/jquery";
import { HTMLtoReactComponent } from "~/util/modifiers";
import { DataProvider, FieldManagerValues, StateManagerValues } from "../types";
import { createProcessingRules } from "./ProcessingRules";

/**
 * ContentRenderer handles HTML content processing and rendering
 * Replaces the content rendering logic from the current Base component
 */
interface ContentRendererProps {
  fieldManager: FieldManagerValues;
  stateManager: StateManagerValues;
  dataProvider: DataProvider;
  invisible: boolean;
}

/**
 * HTML preprocessing function (moved from current Base component)
 * @param html HTML string to preprocess
 * @returns processed HTML elements
 */
function preprocessHtml(html: string): HTMLElement[] {
  const $html = $(html);

  // Fix image inconsistencies
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

  // Fix audio elements
  $html.find("audio").each(function () {
    $(this).attr("preload", "metadata");
  });

  // Fix source elements
  $html.find("source").each(function () {
    const src = this.getAttribute("src");
    if (src) {
      this.dataset.original = src;
      $(this).removeAttr("src");
    }
  });

  // Fix old style images wrapped in links
  $html.find("a figure").each(function () {
    $(this).parent("a").replaceWith(this);
  });

  // Wrap tables in div containers
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

  return $newHTML.toArray() as HTMLElement[];
}

/**
 * ContentRenderer component
 * @param props props
 * @returns ContentRenderer component
 */
export const ContentRenderer = (props: ContentRendererProps) => {
  const { fieldManager, stateManager, dataProvider, invisible } = props;

  // Preprocess HTML content
  const elements = React.useMemo(
    () => preprocessHtml(dataProvider.material.html),
    [dataProvider.material.html]
  );

  // Create processing rules
  const processingRules = React.useMemo(() => {
    const path = `/workspace/${dataProvider.workspace.urlName}/materials/${dataProvider.material.path}`;
    return createProcessingRules(
      fieldManager,
      stateManager,
      dataProvider,
      path,
      invisible
    );
  }, [fieldManager, stateManager, dataProvider, invisible]);

  return (
    <div className="material-page__content rich-text">
      {elements.map((rootElement, index) =>
        HTMLtoReactComponent(rootElement, processingRules, index)
      )}
    </div>
  );
};

/**
 * Hook for using ContentRenderer
 * @param props ContentRenderer props
 * @returns ContentRenderer component
 */
export function useContentRenderer(props: ContentRendererProps) {
  return <ContentRenderer {...props} />;
}
