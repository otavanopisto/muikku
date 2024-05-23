import * as React from "react";
import $ from "~/lib/jquery";
import { extractDataSet, HTMLToReactComponentRule } from "~/util/modifiers";
import { HTMLtoReactComponent } from "~/util/modifiers";
import { UsedAs } from "~/@types/shared";
import Image from "../static/image";
import Link from "../static/link";
import MathJAX from "../static/mathjax";

/**
 * BaseProps
 */
interface BaseProps {
  html: string;
  usedAs: UsedAs;
}

/**
 * BaseState
 */
interface BaseState {
  elements: Array<HTMLElement>;
}

/**
 * Fixes the html inconsitencies because there are some of them which shouldn't but hey that's the case
 * @param $html html
 * @returns any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preprocessor($html: any): any {
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

/**
 * Base
 */
export default class Base extends React.Component<BaseProps, BaseState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: BaseProps) {
    super(props);

    // We preprocess the html
    this.state = {
      elements: preprocessor($(props.html)).toArray() as Array<HTMLElement>,
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps - To update everything if we get a brand new html we unmount and remount
   * @param nextProps nextProps
   */
  // eslint-disable-next-line react/no-deprecated
  UNSAFE_componentWillReceiveProps(nextProps: BaseProps) {
    if (nextProps.html !== this.props.html) {
      const elements = preprocessor(
        $(nextProps.html)
      ).toArray() as Array<HTMLElement>;
      this.setState({
        elements,
      });
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const processingRules: HTMLToReactComponentRule[] = [
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          tagname === "span" && element.classList.contains("math-tex"),
        /**
         * processingFunction
         * @param tag tag
         * @param props  props
         * @param children  children
         * @param element  element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => (
          <MathJAX key={props.key} invisible={false} children={children} />
        ),
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          (tagname === "figure" || tagname === "span") &&
          element.classList.contains("image"),
        preventChildProcessing: true,

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => {
          const dataset = extractDataSet(element);
          return (
            <Image
              key={props.key}
              element={element}
              path={""}
              invisible={false}
              dataset={dataset}
              processingRules={processingRules}
            />
          );
        },
        id: "image-rule",
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          !!(tagname === "a" && (element as HTMLAnchorElement).href),
        id: "link-rule",
        preventChildProcessing: true,

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => {
          const dataset = extractDataSet(element);
          return (
            <Link
              key={props.key}
              element={element}
              path={""}
              dataset={dataset}
              processingRules={processingRules}
            />
          );
        },
      },
    ];

    // This is all there is we just glue the HTML in there
    // and pick out the content from there
    return (
      <>
        {this.state.elements.map((rootElement, index) =>
          HTMLtoReactComponent(rootElement, processingRules, index)
        )}
      </>
    );
  }
}
