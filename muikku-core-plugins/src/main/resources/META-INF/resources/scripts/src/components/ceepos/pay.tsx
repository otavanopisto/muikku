import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { CeeposState } from '~/reducers/main-function/ceepos';

import '~/sass/elements/card.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/glyph.scss';

interface CeeposPayProps {
  i18n: i18nType;
  ceepos: CeeposState;
}

interface CeeposPayState {

}

class CeeposPay extends React.Component<CeeposPayProps, CeeposPayState> {

  /**
   * render
   * @returns
   */
  render() {
    return (
      <div className="card-wrapper">
        <div className="card card--ceepos">
          <header className="card__hero card__hero--ceepos">
            <img className="card__hero-image card__hero-image--ceepos" src="/gfx/oo-branded-site-logo.png" role="presentation"/>
            <span className="card__hero-text card__hero-text--ceepos">Muikku</span>
          </header>
          <div className="card__content card__content--ceepos">
            <div className="card__title card__title--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.title")}</div>
            <div className="card__text card__text--ceepos">
              {this.props.ceepos.payStatusMessage ?
                this.props.ceepos.payStatusMessage
                : this.props.i18n.text.get("plugin.ceepos.order.redirectToCeeposDescription")
              }
            </div>
          </div>
       </div>
      </div>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    ceepos: state.ceepos,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CeeposPay);
