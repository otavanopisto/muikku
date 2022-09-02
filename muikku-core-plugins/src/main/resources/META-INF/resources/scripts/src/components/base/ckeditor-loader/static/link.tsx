import * as React from "react";
import { HTMLAttributeAnchorTarget } from "react";
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
   * renderAccessibilityIndicator
   * @param target target
   * @returns target accessibility indicator
   */
  renderAccessibilityIndicatorByTarget = (
    target: HTMLAttributeAnchorTarget
  ) => {
    switch (target) {
      case "_blank":
        return (
          <>
            <span className="visually-hidden">
              {this.props.i18n.text.get("plugin.wcag.externalLink.label")}
            </span>
            <span
              role="presentation"
              className="external-link-indicator icon-external-link"
            ></span>
          </>
        );

      default:
        return null;
    }
  };

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

      /**
       * processingFunction
       * @param Tag Tag
       * @param props props
       * @param children children
       * @param element element
       * @returns any
       */
      processingFunction: (Tag, props, children, element) => {
        if (props.target) {
          return (
            <Tag {...props}>
              {children}
              {this.renderAccessibilityIndicatorByTarget(props.target)}
            </Tag>
          );
        }

        return <Tag {...props}>{children}</Tag>;
      },
    });
    return HTMLtoReactComponent(this.props.element, newRules);
  }
}
