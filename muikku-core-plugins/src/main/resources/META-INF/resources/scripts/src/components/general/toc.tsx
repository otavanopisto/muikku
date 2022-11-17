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
}

/**
 * Toc
 * @param props TocProps
 * @returns JSX.Element
 */
export const Toc: React.FC<TocProps> = (props) => (
  <div className="toc">
    <div className="toc-header">
      {props.tocHeaderTitle && (
        <h2 className="toc__title">{props.tocHeaderTitle}</h2>
      )}
      {props.tocHeaderExtraContent && props.tocHeaderExtraContent}
    </div>

    {props.children}
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
  name?: string;
  icon?: string;
  className?: string;
  isHidden: boolean;
  hash?: number | string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
}

/**
 * TocTopicNew
 * @param props props
 * @returns JSX.Element
 */
export const TocTopic: React.FC<TocTopicProps> = (props) => {
  const [height, setHeight] = useLocalStorage<number | string>(
    `tocTopic-${props.topicId}`,
    "auto"
  );

  /**
   * toggleHeight
   */
  const toggleHeight = () => {
    setHeight(height === 0 ? "auto" : 0);
  };

  const arrowModifier = height === 0 ? "icon-arrow-right" : "icon-arrow-down";

  return (
    <div className={props.className}>
      {props.name ? (
        <div className={`toc__section-title ${props.isHidden ? "hidden" : ""}`}>
          <span
            style={{ color: "inherit" }}
            className={`toc__icon toc__icon--section-open-close ${arrowModifier}`}
            onClick={toggleHeight}
          />
          <Link
            style={{ color: "inherit" }}
            href={props.hash ? "#" + props.hash : null}
            disableSmoothScroll={true}
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          {props.children}
        </div>
      </AnimateHeight>
    </div>
  );
};

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
