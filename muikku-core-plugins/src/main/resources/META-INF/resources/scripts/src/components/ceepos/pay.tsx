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
  status?: number;
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
    let productData: React.ReactNode = null;
    let feedbackData: React.ReactNode = null;

    // Create productData to be used later
    if (this.props.ceepos.purchase) {


      // This happens when the whole Ceepos integration crashes for some reason or order has been deleted.
    } else if (this.props.ceepos.state === "ERROR") {
      productData = (
        <>
          <div className="card__title card__title--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.error.title")}</div>
          <div className="card__text">{this.props.i18n.text.get("plugin.ceepos.order.error.description")}</div>
        </>
      )
    }

    return (
      <div className="card-wrapper">
        <div className="card card--ceepos">
          <header className="card__hero card__hero--ceepos">
            <img className="card__hero-image card__hero-image--ceepos" src="/gfx/oo-branded-site-logo.png" role="presentation"/>
            <span className="card__hero-text card__hero-text--ceepos">Muikku</span>
          </header>
          <div className="card__content">
            <div className="card__title card__title--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.title")}</div>
            <div className="card__text">
              <div className="card__text-row">
                <div className="card__subtitle">{this.props.i18n.text.get("plugin.ceepos.order.product.title")}</div>
                <div>{this.props.ceepos.purchase.product.Description}</div>
              </div>
              <div className="card__text-row">
                <div className="card__subtitle">{this.props.i18n.text.get("plugin.ceepos.order.product.price")}</div>
                <div className="card__text-highlight card__text-highlight--ceepos">{this.props.ceepos.purchase.product.Price / 100}€</div>
              </div>
              <div className="card__text-row">
                <div className="card__subtitle">{this.props.i18n.text.get("plugin.ceepos.order.product.date")}</div>
                <div>{this.props.i18n.text.get("plugin.ceepos.order.product.created")}: {this.props.i18n.time.format(this.props.ceepos.purchase.created)}</div>
                {this.props.ceepos.purchase.paid && this.props.ceepos.purchase.paid !== null ?
                  <div>{this.props.i18n.text.get("plugin.ceepos.order.product.paid")}: {this.props.i18n.time.format(this.props.ceepos.purchase.paid)}</div>
                : null}
              </div>
            </div>

            {/*
              Different states of the order to be displayed if the student comes back to the pay view after order has been fulfilled/cancelled/errored.
              Missing CREATED and ONGOING states should automatically redirect student to the Ceepos store.
            */}
            {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "CANCELLED" ?
              <div className="card__text">
                <div className="card__text-row card__text-row--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.state.cancelled")}</div>
              </div>
            : null}

            {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "ERRORED" ?
              <div className="card__text">
                <div className="card__text-row card__text-row--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.state.errored")}</div>
              </div>
            : null}

            {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "PAID" ?
              <div className="card__text">
                <div className="card__text-row card__text-row--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.state.paid")}</div>
              </div>
            : null}

            {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "COMPLETE" ?
              <div className="card__text">
                <div className="card__text-row card__text-row--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.state.complete")}</div>
              </div>
            : null}

          </div>

          {feedbackData}

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
