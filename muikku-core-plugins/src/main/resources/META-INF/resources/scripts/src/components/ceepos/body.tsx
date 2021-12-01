import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { CeeposState } from '~/reducers/main-function/ceepos';
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import Button from "~/components/general/button";
import Link from "~/components/general/link";

import '~/sass/elements/card.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/glyph.scss';

interface CeeposBodyProps {
  i18n: i18nType;
  pay?: boolean;
  done?: boolean;
  status?: number;
  ceepos: CeeposState;
}

interface CeeposBodyState {

}

class CeeposBody extends React.Component<CeeposBodyProps, CeeposBodyState> {

  constructor(props: CeeposBodyProps) {
    super(props);

    this.performPayment = this.performPayment.bind(this);

    // this.state = {
    //   email: "",
    // }
  }

    /**
   * performPayment
   */
  async performPayment() {
    const currentPurchase = this.props.ceepos.purchase;
    const value: string = await promisify(mApi().ceepos.pay.create({'id': currentPurchase.id}), "callback")() as string;
      location.href = value;
  }

  /**
   * render
   * @returns
   */
  render() {
    let productData: React.ReactNode = null;
    let feedbackData: React.ReactNode = null;

    // Create productData to be used later
    if (this.props.ceepos.purchase) {
      productData = (
        <>
          <div className="card__title card__title--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.title")}</div>
          <div className="card__text">
            <div className="card__text-row">
              <div className="card__subtitle">Tuote</div>
              <div>{this.props.ceepos.purchase.product.Description}</div>
            </div>
            <div className="card__text-row">
              <div className="card__subtitle">Hinta</div>
              <div className="card__text-highlight card__text-highlight--ceepos">{this.props.ceepos.purchase.product.Price / 100}€</div>
            </div>
            <div className="card__text-row">
              <div className="card__subtitle">Päivämäärä</div>
              <div>{this.props.i18n.time.format(this.props.ceepos.purchase.created)}</div>
            </div>
          </div>
        </>
      )

      // This happens when the whole Ceepos integration crashes for some reason or order has been deleted.
    } else if (this.props.ceepos.state === "ERROR") {
      productData = (
        <>
          <div className="card__title card__title--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.error.title")}</div>
          <div className="card__text">{this.props.i18n.text.get("plugin.ceepos.order.error.description")}</div>
        </>
      )
    }

    // Ceepos/pay a.k.a default view when student access this view via clicking the link in the sent email
    if (this.props.pay) {
      feedbackData = (
        <div className="card__content">
          {this.props.ceepos.state === "LOADING" ? <div className="loader-empty"/> : null}
          {productData}

          {/*
            Different states of the order to be displayed if the student comes back to the pay view after order has been fulfilled.
            Missing CREATED and ONGOING states should automatically redirect student to the Ceepos store.
          */}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "CANCELLED" ? <div>{this.props.i18n.text.get("plugin.ceepos.order.state.cancelled")}</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "ERRORED" ? <div>{this.props.i18n.text.get("plugin.ceepos.order.state.errored")}</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "PAID" ? <div>{this.props.i18n.text.get("plugin.ceepos.order.state.paid")}</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "COMPLETE" ? <div>{this.props.i18n.text.get("plugin.ceepos.order.state.complete")}</div> : null}
        </div>
      );

      // Ceepos/done view when the user has completed the payment of the order.
      // This view should be displayed only once per order and after student has returned from Ceepos online store back to Muikku.
      // Also we detect and inform student whether the payment event was successfull or not.
    } else if (this.props.done) {
      // Everything went ok, payment was successful and order will be completed on our end.
      const paymentWasSuccessful = this.props.status === 1;

      // Student cancelled the payment process manually
      const paymentWasCancelled = this.props.status === 0;

      // Ceepos returned status 99 as something went wrong and error occured.
      const paymentWasErrored = this.props.status === 99;

      // Something else went wrong and we have no additional details nor any idea what went wrong.
      const unknownError = !paymentWasSuccessful && !paymentWasCancelled && !paymentWasErrored;

      feedbackData = (
        <div className="card__content">
          {this.props.ceepos.state === "LOADING" ? <div className="loader-empty"/> : null}
          {productData}

            {/*
              Different statuses of the completed order.
              These will be displayed after the student returns back to Muikku from Ceepos online store.
            */}
            {paymentWasSuccessful ?
              <>
                <div className="card__text">
                  <div className="card__text-row card__text-row--ceepos-done">{this.props.i18n.text.get("plugin.ceepos.order.done.successful")}</div>
                </div>
                <footer className="card__footer card__footer--ceepos">
                  <Button
                    icon="forward"
                    buttonModifiers={["ceepos-back-to-muikku", "info"]}
                    href="/">{this.props.i18n.text.get("plugin.ceepos.order.backToMuikkuLink.label")}
                  </Button>
                </footer>
              </>
            : null}

            {paymentWasCancelled ?
              <>
                <div className="card__text">
                  <div className="card__text-row card__text-row--ceepos-done">{this.props.i18n.text.get("plugin.ceepos.order.done.cancelled")}</div>
                </div>
                <footer className="card__footer card__footer--ceepos">
                  <Button
                    icon="forward"
                    buttonModifiers={["ceepos-back-to-muikku", "info"]}
                    href="/">{this.props.i18n.text.get("plugin.ceepos.order.backToMuikkuLink.label")}
                  </Button>
                </footer>
              </>
            : null}

            {paymentWasErrored ?
              <>
                <div className="card__text">
                  <div className="card__text-row card__text-row--ceepos-done">{this.props.i18n.text.get("plugin.ceepos.order.done.errored")}</div>
                </div>
                <footer className="card__footer card__footer--ceepos">
                  <Button
                    icon="envelope"
                    buttonModifiers={["ceepos-back-to-muikku", "info"]}
                  >{this.props.i18n.text.get("plugin.ceepos.order.sendMessageButton.label")}
                  </Button>
                </footer>
              </>
            : null}

            {unknownError ?
              <>
                <div className="card__text">
                  <div className="card__text-row card__text-row--ceepos-done">{this.props.i18n.text.get("plugin.ceepos.order.done.unknownError")}</div>
                </div>
                <footer className="card__footer card__footer--ceepos">
                  <Button
                    icon="envelope"
                    buttonModifiers={["ceepos-back-to-muikku", "info"]}
                  >{this.props.i18n.text.get("plugin.ceepos.order.sendMessageButton.label")}
                  </Button>
                </footer>
              </>
            : null}
          </div>
      );
    }

    return (
      <div className="card-wrapper">
        <div className="card card--ceepos">
          <header className="card__hero card__hero--ceepos">
            <img className="card__hero-image card__hero-image--ceepos" src="/gfx/oo-branded-site-logo.png" role="presentation"/>
            <span className="card__hero-text card__hero-text--ceepos">Muikku</span>
          </header>
          {feedbackData}

            {/*
              This is for backup only as we should automatically redirect user to the Ceepos online store
              when state of the order is CREATED or ONGOING
            */}
            {this.props.ceepos.purchase &&
              (this.props.ceepos.purchase.state === "ONGOING" || this.props.ceepos.purchase.state === "CREATED") ?
              <footer className="card__footer card__footer--ceepos">
                <Button
                  icon="forward"
                  buttonModifiers={["pay-student-order", "execute"]}
                  onClick={this.performPayment}>{this.props.i18n.text.get("plugin.ceepos.order.payButton.label")}
                </Button>
              </footer>
            : null}
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
)(CeeposBody);
