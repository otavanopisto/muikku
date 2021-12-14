import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { CeeposState } from '~/reducers/main-function/ceepos';
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import Button from "~/components/general/button";
import { errorMessageContent, errorMessageTitle } from '~/helper-functions/ceepos-error';

import '~/sass/elements/card.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/glyph.scss';

interface CeeposDoneProps {
  i18n: i18nType;
  pay?: boolean;
  done?: boolean;
  status?: number;
  ceepos: CeeposState;
}

interface CeeposDoneState {

}

class CeeposDone extends React.Component<CeeposDoneProps, CeeposDoneState> {

  /**
   * render
   * @returns
   */
  render() {
    // Create product data
    let productData: React.ReactNode = null;

    // Create feedback data
    let feedbackData: React.ReactNode = null;

    if (this.props.ceepos.purchase) {
      productData = (
        <>
          <div className="card__title card__title--ceepos">{this.props.i18n.text.get("plugin.ceepos.order.title")}</div>
          <div className="card__text card__text--ceepos">
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
        </>
      )
    }

    // Everything went ok, payment was successful and order will be completed on our end.
    const paymentWasSuccessful = this.props.status === 1;

    // Student cancelled the payment process manually
    const paymentWasCancelled = this.props.status === 0;

    // Ceepos returned status 99 as something went wrong and error occured.
    const paymentWasErrored = this.props.status === 99;

    // Something else went wrong and we have no additional details nor any idea what went wrong.
    const unknownError = !paymentWasSuccessful && !paymentWasCancelled && !paymentWasErrored;

    if (this.props.status) {
      feedbackData = (
        <div className="card__content card__content--ceepos">
          {productData}
          <div className="card__text card__text--ceepos">
            <div className="card__text-row card__text-row--ceepos">
              {paymentWasSuccessful ?
                this.props.i18n.text.get("plugin.ceepos.order.done.successful")
                : null}

              {paymentWasCancelled ?
                this.props.i18n.text.get("plugin.ceepos.order.done.cancelled")
                : null}

              {paymentWasErrored ?
                this.props.i18n.text.get("plugin.ceepos.order.done.errored")
                : null}

              {unknownError ?
                this.props.i18n.text.get("plugin.ceepos.order.done.unknownError")
                : null}

            </div>
          </div>
          <footer className="card__footer card__footer--ceepos">
            {paymentWasSuccessful || paymentWasCancelled ?
              <Button
                icon="forward"
                buttonModifiers={["back-to-muikku", "info"]}
                href="/">{this.props.i18n.text.get("plugin.ceepos.order.backToMuikkuButton.label")}
              </Button>
              : null}

            {paymentWasErrored || unknownError ?
              <>
                <Button
                  icon="forward"
                  buttonModifiers={["back-to-muikku", "info"]}
                  href="/">{this.props.i18n.text.get("plugin.ceepos.order.backToMuikkuButton.label")}
                </Button>

                <CommunicatorNewMessage extraNamespace="ceepos-error"
                  initialSubject={errorMessageTitle(this.props.i18n, this.props.ceepos.purchase)}
                  initialMessage={errorMessageContent(this.props.i18n, this.props.ceepos.purchase, this.props.ceepos.payStatusMessage)}><Button
                    icon="envelope"
                    buttonModifiers={["send-message", "info"]}
                  >{this.props.i18n.text.get("plugin.ceepos.order.sendMessageButton.label")}
                  </Button></CommunicatorNewMessage>
              </>
              : null}
          </footer>
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
)(CeeposDone);
