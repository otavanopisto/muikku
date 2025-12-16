import * as React from "react";
import "~/sass/elements/pager.scss";
import "~/sass/elements/wcag.scss";
import { withTranslation, WithTranslation } from "react-i18next";

const PAGER_MAX_PAGES = 10;

/**
 * PagerProps
 */
interface PagerProps extends WithTranslation {
  onClick: (id: number) => any;
  current: number;
  pages: number;
  modifier?: string;
  identifier?: string;
}

/**
 * PagerState
 */
interface PagerState {}

/**
 * Pager
 */
class Pager extends React.Component<PagerProps, PagerState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const left = Math.floor((PAGER_MAX_PAGES - 1) / 2);
    const right = Math.ceil((PAGER_MAX_PAGES - 1) / 2);

    let leftPage = this.props.current - left;
    let rightPage = this.props.current + right;

    if (leftPage < 1) {
      rightPage += 1 - leftPage;
      leftPage = 1;
    }

    if (rightPage > this.props.pages) {
      leftPage += this.props.pages - rightPage;
      rightPage = this.props.pages;
    }

    if (leftPage < 1) {
      leftPage = 1;
    }

    const isPagerLessVisible = leftPage !== 1;
    const isPagerMoreVisible = rightPage !== this.props.pages;

    let pagerLessNumber = this.props.current - PAGER_MAX_PAGES;
    if (pagerLessNumber < 1) {
      pagerLessNumber = 1;
    }

    let pagerMoreNumber = this.props.current + PAGER_MAX_PAGES;
    if (pagerMoreNumber > this.props.pages) {
      pagerMoreNumber = this.props.pages;
    }

    return (
      <div
        className={`pager ${
          this.props.modifier ? "pager--" + this.props.modifier : ""
        }`}
        aria-label={this.props.t("wcag.pager", { ns: "paging" })}
      >
        <div className="pager__body">
          {isPagerLessVisible
            ? [
                <div
                  key="prev-label"
                  tabIndex={0}
                  className="pager__item pager__item--less icon-arrow-left"
                  onClick={this.props.onClick.bind(null, pagerLessNumber)}
                  aria-label={this.props.t("wcag.prev10", { ns: "paging" })}
                />,
                <div
                  key="go-to-label"
                  tabIndex={0}
                  className="pager__item pager__item--first"
                  onClick={this.props.onClick.bind(null, 1)}
                  aria-label={this.props.t("wcag.goToPage", {
                    ns: "paging",
                  })}
                >
                  1
                </div>,
                <div
                  key="gap-left"
                  role="none"
                  className="pager__item pager__item--gap"
                >
                  ...
                </div>,
              ]
            : null}
          {Array.from(
            new Array(rightPage - leftPage + 1),
            (x, i) => leftPage + i
          ).map((page) => (
            <div
              tabIndex={0}
              key={this.props.identifier ? this.props.identifier + page : page}
              className={`pager__item ${
                page === this.props.current ? "pager__item--current" : ""
              }`}
              onClick={this.props.onClick.bind(null, page)}
              aria-label={
                page === this.props.current
                  ? this.props.t("wcag.currentPage", { ns: "paging" })
                  : this.props.t("wcag.goToPage", { ns: "paging" })
              }
            >
              {page}
            </div>
          ))}
          {isPagerMoreVisible
            ? [
                <div
                  key="gap-right"
                  role="none"
                  className="pager__item pager__item--gap"
                >
                  ...
                </div>,
                <div
                  key="go-to-label"
                  tabIndex={0}
                  className="pager__item pager__item--last"
                  onClick={this.props.onClick.bind(null, this.props.pages)}
                  aria-label={this.props.t("wcag.goToPage", { ns: "paging" })}
                >
                  {this.props.pages}
                </div>,
                <div
                  key="next-label"
                  tabIndex={0}
                  className="pager__item pager__item--more icon-arrow-right"
                  onClick={this.props.onClick.bind(null, pagerMoreNumber)}
                  aria-label={this.props.t("wcag.next10", { ns: "paging" })}
                />,
              ]
            : null}
        </div>
      </div>
    );
  }
}

export default withTranslation("paging")(Pager);
