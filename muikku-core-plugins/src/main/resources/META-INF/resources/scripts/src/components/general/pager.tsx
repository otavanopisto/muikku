import '~/sass/elements/pager.scss';
import * as React from 'react';

const PAGER_MAX_PAGES = 10;

interface PagerProps {
  onClick: (id: number) => any,
  current: number,
  pages: number,
  modifier?: string,
  identifier?: string,
}

interface PagerState {

}

export default class Pager extends React.Component<PagerProps, PagerState>{
  render() {
    let left = Math.floor((PAGER_MAX_PAGES - 1) / 2);
    let right = Math.ceil((PAGER_MAX_PAGES - 1) / 2);

    let leftPage = this.props.current - left;
    let rightPage = this.props.current + right;

    if (leftPage < 1) {
      rightPage += 1 - leftPage;
      leftPage = 1;
    }

    let rightPageExtra = 0;
    if (rightPage > this.props.pages) {
      leftPage += this.props.pages - rightPage;
      rightPage = this.props.pages;
    }

    if (leftPage < 1) {
      leftPage = 1;
    }

    let isPagerLessVisible = leftPage !== 1;
    let isPagerMoreVisible = rightPage !== this.props.pages;

    let pagerLessNumber = this.props.current - PAGER_MAX_PAGES;
    if (pagerLessNumber < 1) {
      pagerLessNumber = 1;
    }

    let pagerMoreNumber = this.props.current + PAGER_MAX_PAGES;
    if (pagerMoreNumber > this.props.pages) {
      pagerMoreNumber = this.props.pages;
    }

    return <div className={`pager ${this.props.modifier ? "pager--" + this.props.modifier : ""}`}>
      <div className="pager__body">
        {isPagerLessVisible ? [<div className="pager__item pager__item--less icon-arrow-left" onClick={this.props.onClick.bind(null, pagerLessNumber)} />,
        <div className="pager__item pager__item--first" onClick={this.props.onClick.bind(null, 1)}>1</div>,
        <div className="pager__item pager__item--gap">...</div>] : null}
        {Array.from(new Array(rightPage - leftPage + 1), (x, i) => leftPage + i).map((page) => {
          return <div key={this.props.identifier ? this.props.identifier + page : page} className={`pager__item ${page === this.props.current ? "pager__item--current" : ""}`}
            onClick={this.props.onClick.bind(null, page)}>{page}</div>
        })}
        {isPagerMoreVisible ? [<div className="pager__item pager__item--gap">...</div>,
        <div className="pager__item pager__item--last" onClick={this.props.onClick.bind(null, this.props.pages)}>{this.props.pages}</div>,
        <div className="pager__item pager__item--more icon-arrow-right" onClick={this.props.onClick.bind(null, pagerMoreNumber)} />] : null}
      </div>
    </div>
  }
}
