import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import {
  HTMLtoReactComponent,
  HTMLToReactComponentRule,
} from "~/util/modifiers";

/**
 * LinkProps
 */
interface LinkProps {
  element: HTMLElement;
  path: string;
  dataset: {
    //Someone thought it was smart to set up two versions of data
    url?: string;
  };
  i18n: i18nType;
  processingRules: HTMLToReactComponentRule[];
}

/**
 * Link
 */
export default class Link extends React.Component<
  LinkProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: LinkProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    const newRules = this.props.processingRules.filter(
      (r) => r.id !== "link-rule"
    );
    newRules.push({
      /**
       * shouldProcessHTMLElement
       * @param tag tag
       * @param element element
       */
      shouldProcessHTMLElement: (tag, element) =>
        tag === "a" &&
        element.getAttribute("href") &&
        element.getAttribute("href")[0] !== "#",
      /**
       * preprocessReactProperties
       * @param tag tag
       * @param props props
       * @param children children
       * @param element element
       */
      preprocessReactProperties: (tag, props, children, element) => {
        const isAbsolute =
          props.href.indexOf("/") == 0 ||
          props.href.indexOf("mailto:") == 0 ||
          props.href.indexOf("data:") == 0 ||
          props.href.match("^(?:[a-zA-Z]+:)?//");
        if (!isAbsolute) {
          props.href = this.props.path + "/" + props.href;
        }
      },
    });
    return HTMLtoReactComponent(this.props.element, newRules);
  }
}
