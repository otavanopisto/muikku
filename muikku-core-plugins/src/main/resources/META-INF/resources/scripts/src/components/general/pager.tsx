import * as React from 'react';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';

import '~/sass/elements/pager.scss';
import '~/sass/elements/wcag.scss';

const PAGER_MAX_PAGES = 10;

interface PagerProps {
  onClick: (id: number) => any,
  current: number,
  pages: number,
  modifier?: string,
  i18n: i18nType,
  identifier?: string,
}

interface PagerState {

}

class Pager extends React.Component<PagerProps, PagerState>{
  render(){
    let left = Math.floor((PAGER_MAX_PAGES-1)/2);
    let right = Math.ceil((PAGER_MAX_PAGES-1)/2);

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

    return <div className={`pager ${this.props.modifier ? "pager--" + this.props.modifier : ""}`} aria-label={this.props.i18n.text.get("plugin.wcag.pager.label")}>
      <div className="pager__body">
        {isPagerLessVisible ? [<div tabIndex={0} className="pager__item pager__item--less icon-arrow-left" onClick={this.props.onClick.bind(null, pagerLessNumber)} aria-label={this.props.i18n.text.get("plugin.wcag.pager.prev10.label")}/>,
          <div tabIndex={0} className="pager__item pager__item--first" onClick={this.props.onClick.bind(null, 1)} aria-label={this.props.i18n.text.get("plugin.wcag.pager.goToPage.label")}>1</div>,
          <div role="none" className="pager__item pager__item--gap">...</div>] : null}
        {Array.from(new Array(rightPage - leftPage + 1),(x,i)=> leftPage+i).map((page)=>{
          return <div tabIndex={0} key={this.props.identifier ? this.props.identifier + page: page} className={`pager__item ${page === this.props.current ? "pager__item--current" : ""}`}
            onClick={this.props.onClick.bind(null, page)} arial-label={page === this.props.current ? this.props.i18n.text.get("plugin.wcag.pager.current.label") : this.props.i18n.text.get("plugin.wcag.pager.goToPage.label")}>{page}</div>
        })}
        {isPagerMoreVisible ? [<div role="none" className="pager__item pager__item--gap">...</div>,
          <div tabIndex={0} className="pager__item pager__item--last" onClick={this.props.onClick.bind(null, this.props.pages)} aria-label={this.props.i18n.text.get("plugin.wcag.pager.goToPage.label")}>{this.props.pages}</div>,
          <div tabIndex={0} className="pager__item pager__item--more icon-arrow-right" onClick={this.props.onClick.bind(null, pagerMoreNumber)} aria-label={this.props.i18n.text.get("plugin.wcag.pager.next10.label")}/>] : null}
      </div>
    </div>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pager);
