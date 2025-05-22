/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "usehooks-ts";
import "~/sass/elements/toc.scss";
import { IconButton } from "~/components/general/button";

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
 * @returns React.JSX.Element
 */
export const Toc: React.FC<TocProps> = (props) => (
  <div className={`toc ${props.modifier ? "toc--" + props.modifier : ""}`}>
    <div
      className={`toc__header ${
        props.modifier ? "toc__header--" + props.modifier : ""
      }`}
    >
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
  topicId: string;
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
  onTitleKeyDown?: (e: React.KeyboardEvent) => void;
}

export type TocTopicRef = {
  toggleOpen: (type?: "open" | "close") => void;
  titleContainerCurrent: HTMLAnchorElement | null;
};

/**
 * TocTopic component with toggle open functionality with ref forwarding
 */
const TocTopic = React.forwardRef<TocTopicRef, TocTopicProps>(
  (props, outerRef) => {
    const [height, setHeight] = useLocalStorage<number | string>(
      props.topicId,
      "auto"
    );

    const titleContainerRef = React.useRef<HTMLAnchorElement>(null);

    const { t } = useTranslation(["materials"]);

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

    // Way to expose toggleHeight and refs to parent component
    React.useImperativeHandle(outerRef, () => ({
      // eslint-disable-next-line jsdoc/require-jsdoc
      toggleOpen: (type) => {
        toggleHeight(type);
      },
      titleContainerCurrent:
        titleContainerRef.current && titleContainerRef.current,
    }));

    /**
     * Handles toggle open and close clicks
     * @param e e
     */
    const handleToggleHeightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleHeight();
    };

    /**
     * Handle key down event for toggle open and close
     * @param e e
     */
    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
      props.onTitleKeyDown && props.onTitleKeyDown(e);

      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        toggleHeight("open");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        toggleHeight("close");
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
        aria-expanded={height !== 0}
      >
        {props.name ? (
          <a
            id={props.topicId}
            ref={titleContainerRef}
            href={props.hash ? "#" + props.hash : null}
            className={`toc__section-title-container ${
              props.isHidden ? "hidden" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleTitleKeyDown}
            aria-controls={`topic-elements-${props.topicId}`}
            aria-label={
              height === 0
                ? t("wcag.tocTopicExpand", { ns: "materials" })
                : t("wcag.tocTopicCollapse", { ns: "materials" })
            }
          >
            <span
              className={`toc__icon toc__icon--section-open-close ${arrowModifier}`}
              onClick={handleToggleHeightClick}
              aria-controls={`topic-elements-${props.topicId}`}
            />
            <div className="toc__section-title">
              <span className="toc__text-body">{props.name}</span>
            </div>
            {props.iconAfter ? (
              <span
                title={props.iconAfterTitle}
                className={`toc__icon icon-${props.iconAfter}`}
                style={{ color: props.iconAfterColor }}
              ></span>
            ) : null}
          </a>
        ) : null}
        <AnimateHeight
          id={`topic-elements-${props.topicId}`}
          duration={200}
          height={height}
          easing="ease-in"
        >
          {/**TODO: Styling */}
          <div>{props.children}</div>
        </AnimateHeight>
      </div>
    );
  }
);

TocTopic.displayName = "TocTopic";

export default TocTopic;

export type TocElRef = {
  tocLinkCurrent: HTMLAnchorElement | null;
};

/**
 * TocElementProps
 */
interface TocElementProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
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
  children: string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
}

export const TocElement = React.forwardRef<HTMLAnchorElement, TocElementProps>(
  (props, outerRef) => {
    const {
      isActive,
      isHidden,
      isFilteredOut = false,
      modifier,
      hash,
      children,
      iconAfter,
      iconAfterTitle,
      iconAfterColor,
      className,
      ...anchorProps
    } = props;

    /**
     * Handles link click
     * @param e e
     */
    const handleLinkClick = (e: React.MouseEvent) => {
      const pageElement = document.getElementById(hash as string);

      if (pageElement) {
        pageElement.focus();
      }
    };

    return (
      <a
        {...anchorProps}
        ref={outerRef}
        className={`toc__item ${isActive ? "active" : ""} ${
          className ? className : ""
        } ${isHidden ? "hidden" : ""} ${isFilteredOut ? "filteredOut" : ""} ${
          modifier ? "toc__item--" + modifier : ""
        }`}
        href={hash ? "#" + hash : null}
        onClick={handleLinkClick}
        aria-current={isActive}
      >
        <span className="toc__text-body">{children}</span>
        {iconAfter ? (
          <span
            title={iconAfterTitle}
            className={`toc__icon icon-${iconAfter}`}
            style={{ color: iconAfterColor }}
          ></span>
        ) : null}
      </a>
    );
  }
);

TocElement.displayName = "TocElement";

/**
 * BackToTocProps
 */
interface BackToTocProps {
  tocElementId: string;
  openToc?: () => void;
}

/**
 * BackToToc
 * @param props props
 */
export const BackToToc = (props: BackToTocProps) => {
  const { t } = useTranslation(["materials"]);

  /**
   * handleLinkClick
   */
  const handleLinkClick = () => {
    props.openToc && props.openToc();

    // Focus the element after a short delay to ensure that the navigation is open
    setTimeout(() => {
      const tocElement = document.getElementById(props.tocElementId);

      if (tocElement) {
        tocElement.focus();
      }
    }, 100);
  };

  return (
    <IconButton
      icon="forward"
      onClick={handleLinkClick}
      buttonModifiers={["back-to-toc rs_skip_always"]}
      aria-label={t("wcag.focusToToc", { ns: "materials" })}
    />
  );
};
