import * as React from "react";
import "~/sass/elements/pager.scss";
import "~/sass/elements/wcag.scss";
import ReactPaginateForked, { ReactPaginateForkProps } from "react-paginate";
import { useTranslation } from "react-i18next";

/**
 * PagerV2Props extends ReactPaginateForkProps excluding ariaLabelBuilder
 * which is defined default by the component itself
 */
interface PagerV2Props
  extends Omit<ReactPaginateForkProps, "ariaLabelBuilder"> {
  /**
   * Default `plugin.wcag.pager.goToPage.label`
   */
  ariaLabelGoToPage?: string;
  /**
   * Default `plugin.wcag.pager.current.label`
   */
  ariaLabelCurrent?: string;
}

/**
 * Props defined by default if they are not given
 */
const defaultPagerV2Props = {
  containerClassName: "pager__body",
  pageClassName: "pager__item",
  activeClassName: "pager__item pager__item--current",
  breakClassName: "pager__item pager__item--gap",
};

/**
 * PagerV2. It extends React Paginate components props, but without aria label builder
 * which is included already in PagerV2 by default
 * @param props props
 * @returns JSX.Element
 */
const PagerV2: React.FC<PagerV2Props> = (props): JSX.Element => {
  props = { ...defaultPagerV2Props, ...props };
  const { t } = useTranslation("paging");
  /**
   * Creates aria-label for a tags depending if link is selected
   * or not. Label is default or user defined if ariaLabelGoToPage/ariaLabelCurrent
   * has been passed to by props
   * @param index link index
   * @param selected if selected
   * @returns label with correct locale string
   */
  const handleAriaLabelBuilder = (index: number, selected: boolean): string => {
    let label = props.ariaLabelGoToPage
      ? props.ariaLabelGoToPage
      : t("wcag.goToPage");

    /**
     * If item is selected, then its current item
     */
    if (selected) {
      label = props.ariaLabelCurrent
        ? props.ariaLabelCurrent
        : t("wcag.currentPage");
    }

    return label;
  };

  return (
    <ReactPaginateForked {...props} ariaLabelBuilder={handleAriaLabelBuilder} />
  );
};

export default PagerV2;
