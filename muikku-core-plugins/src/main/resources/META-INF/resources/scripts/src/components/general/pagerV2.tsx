import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import "~/sass/elements/pager.scss";
import "~/sass/elements/wcag.scss";
import ReactPaginateForked, { ReactPaginateForkProps } from "react-paginate";

/**
 * PagerV2Props extends ReactPaginateForkProps excluding ariaLabelBuilder
 * which is defined default by the component itself
 */
interface PagerV2Props
  extends Omit<ReactPaginateForkProps, "ariaLabelBuilder"> {
  /**
   * Translations
   */
  i18n: i18nType;

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
const PagerV2: React.FC<PagerV2Props> = (props) => {
  props = { ...defaultPagerV2Props, ...props };

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
      : props.i18n.text.get("plugin.wcag.pager.goToPage.label");

    /**
     * If item is selected, then its current item
     */
    if (selected) {
      label = props.ariaLabelCurrent
        ? props.ariaLabelCurrent
        : props.i18n.text.get("plugin.wcag.pager.current.label");
    }

    return label;
  };

  return (
    <ReactPaginateForked {...props} ariaLabelBuilder={handleAriaLabelBuilder} />
  );
};

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @returns object
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PagerV2);
