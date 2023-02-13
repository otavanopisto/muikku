/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useLocalStorage } from "usehooks-ts";
import Link from "~/components/general/link";
import "~/sass/elements/toc.scss";

/**
 * TocProps
 */
interface TocProps {
  tocHeaderTitle?: string;
  tocHeaderExtraContent?: React.ReactNode;
  modifier?: string;
}

/**
 * Toc
 * @param props TocProps
 * @returns JSX.Element
 */
export const Toc: React.FC<TocProps> = (props) => (
  <div className={`toc ${props.modifier ? "toc--" + props.modifier : ""}`}>
    <div className="toc__header">
      {props.tocHeaderTitle && (
        <h2 className="toc__title">{props.tocHeaderTitle}</h2>
      )}
      {props.tocHeaderExtraContent && props.tocHeaderExtraContent}
    </div>
    <div className="toc__item-container">{props.children}</div>
  </div>
);

/**
 * TocTopicProps
 */
interface TocTopicProps {
  /**
   * Topic id is combination of workspace material folder id + something user related
   */
  topicId: number | string;
  /**
   * If some of topic's children is active, topic is active
   */
  isActive: boolean;

  /**
   * Toc topic class modifiers
   */
  modifiers?: string[];
  language?: string;
  name?: string;
  icon?: string;
  className?: string;
  isHidden: boolean;
  hash?: number | string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
  children?: React.ReactNode;
}

export type ToggleOpenHandle = {
  toggleOpen: (type?: "open" | "close") => void;
};

/**
 * TocTopic component with toggle open functionality with ref forwarding
 */
const TocTopic = React.forwardRef<ToggleOpenHandle, TocTopicProps>(
  (props, ref) => {
    const [height, setHeight] = useLocalStorage<number | string>(
      `tocTopic-${props.topicId}`,
      "auto"
    );

    /**
     * Toggles open state
     * @param type "open" | "handle"
     */
    const toggleHeight = (type?: "open" | "close") => {
      if (type) {
        setHeight(type === "open" ? "auto" : 0);
      } else {
        setHeight(height === 0 ? "auto" : 0);
      }
    };

    // Way to expose toggleHeight to parent component
    React.useImperativeHandle(ref, () => ({
      // eslint-disable-next-line jsdoc/require-jsdoc
      toggleOpen: (type) => {
        toggleHeight(type);
      },
    }));

    /**
     * Handles toggle open and close clicks
     * @param e e
     */
    const handleToggleHeightClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleHeight();
    };

    /**
     * Handles Link click. Opens topic if it's closed
     * @param e e
     */
    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (height === 0) {
        toggleHeight("open");
      }
    };

    const arrowModifier = height === 0 ? "icon-arrow-right" : "icon-arrow-down";

    return (
      <div
        className={`toc__section-container ${props.isActive ? "active" : ""} ${
          props.modifiers
            ? props.modifiers
                .map((m) => `toc__section-container--${m}`)
                .join(" ")
            : ""
        }`}
        lang={props.language}
      >
        {props.name ? (
          <div
            className={`toc__section-title-container ${
              props.isHidden ? "hidden" : ""
            }`}
          >
            <span
              className={`toc__icon toc__icon--section-open-close ${arrowModifier}`}
              onClick={handleToggleHeightClick}
            />
            <Link
              className="toc__section-title"
              href={props.hash ? "#" + props.hash : null}
              disableSmoothScroll={true}
              onClick={handleLinkClick}
            >
              <span className="toc__text-body">{props.name}</span>
            </Link>
            {props.iconAfter ? (
              <span
                title={props.iconAfterTitle}
                className={`toc__icon icon-${props.iconAfter}`}
                style={{ color: props.iconAfterColor }}
              ></span>
            ) : null}
          </div>
        ) : null}
        <AnimateHeight duration={200} height={height} easing="ease-in">
          {/**TODO: Styling */}
          <div>{props.children}</div>
        </AnimateHeight>
      </div>
    );
  }
);

TocTopic.displayName = "TocTopic";

export default TocTopic;

/**
 * TocElementProps
 */
interface TocElementProps {
  isActive: boolean;
  isHidden: boolean;
  /**
   * If element is filtered out for some reason
   * @default false
   */
  isFilteredOut?: boolean;
  className?: string;
  modifier?: string;
  hash?: number | string;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
  children: string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScrollToSection?: () => any;
  scrollPadding?: number;
  disableScroll?: boolean;
  language?: string;
}

/**
 * TocElementState
 */
interface TocElementState {}

/**
 * TocElement
 */
export class TocElement extends React.Component<
  TocElementProps,
  TocElementState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const {
      isActive,
      isHidden,
      isFilteredOut = false,
      className,
      modifier,
      hash,
      href,
      onClick,
      children,
      iconAfter,
      iconAfterTitle,
      iconAfterColor,
      onScrollToSection,
      scrollPadding,
      disableScroll,
      language,
    } = this.props;

    return (
      <Link
        className={`toc__item ${isActive ? "active" : ""} ${
          className ? className : ""
        } ${isHidden ? "hidden" : ""} ${isFilteredOut ? "filteredOut" : ""} ${
          modifier ? "toc__item--" + modifier : ""
        }`}
        onScrollToSection={onScrollToSection}
        scrollPadding={scrollPadding}
        disableScroll={disableScroll}
        href={hash ? "#" + hash : null}
        to={href}
        onClick={onClick}
        ref="element"
        lang={language}
      >
        <span className="toc__text-body">{children}</span>
        {iconAfter ? (
          <span
            title={iconAfterTitle}
            className={`toc__icon icon-${iconAfter}`}
            style={{ color: iconAfterColor }}
          ></span>
        ) : null}
      </Link>
    );
  }

  /**
   * getElement
   * @returns HTMLElement
   */
  getElement(): HTMLElement {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.refs["element"] as any) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.refs["element"] as any).getWrappedInstance().getElement()
    );
  }
}
