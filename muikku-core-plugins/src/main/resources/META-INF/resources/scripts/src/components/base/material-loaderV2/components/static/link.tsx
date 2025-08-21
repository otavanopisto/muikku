/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  HTMLtoReactComponent,
  HTMLToReactComponentRule,
} from "~/util/modifiers";
import { LinkDataset } from "../../types";

/**
 * LinkProps
 */
interface LinkProps extends WithTranslation {
  element: HTMLElement;
  path: string;
  dataset: LinkDataset;
  processingRules: HTMLToReactComponentRule[];
}

/**
 * Link
 */
class Link extends React.Component<LinkProps, Record<string, unknown>> {
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
  renderAccessibilityIndicatorByTarget = (target: any) => {
    const { t } = this.props;

    switch (target) {
      case "_blank":
        return (
          <>
            <span className="visually-hidden">{t("wcag.externalLink")}</span>
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

export default withTranslation(["common"])(Link);
