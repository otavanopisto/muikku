import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import { localize } from "~/locales/i18n";
import { CeeposState } from "~/reducers/main-function/ceepos";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import Button from "~/components/general/button";
import {
  getErrorMessageContent,
  getErrorMessageTitle,
} from "~/helper-functions/ceepos-error";
import { getName } from "~/util/modifiers";
import "~/sass/elements/card.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/glyph.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { CeeposReturnLink } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * CeeposDoneProps
 */
interface CeeposDoneProps extends WithTranslation {
  pay?: boolean;
  done?: boolean;
  status?: number;
  ceepos: CeeposState;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * ReturnLink
 */
export interface ReturnLink {
  path: string;
  text: string;
}

/**
 * CeeposDoneState
 */
interface CeeposDoneState {
  returnLink: CeeposReturnLink;
}

/**
 * CeeposDone
 */
class CeeposDone extends React.Component<CeeposDoneProps, CeeposDoneState> {
  /**
   * Class constructor
   * @param props props
   */
  constructor(props: CeeposDoneProps) {
    super(props);
    this.state = {
      returnLink: {
        text: this.props.i18n.t("actions.returnHome"),
        path: "/",
      },
    };
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
    const ceeposApi = MApi.getCeeposApi();

    try {
      const searchParams = new URLSearchParams(window.location.search);

      const returnLink = await ceeposApi.getCeeposReturnLink({
        orderId: parseInt(searchParams.get("Id")),
      });
      this.setState({ returnLink });
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }

      this.props.displayNotification(
        this.props.t("notifications.loadError", {
          context: "link",
          ns: "orders",
          error: e,
        }),
        "error"
      );
    }
  }

  /**
   * render
   * @returns JSX component
   */
  render() {
    // Create product data
    let productData: React.ReactNode = null;

    // Create feedback data
    let feedbackData: React.ReactNode = null;

    if (this.props.ceepos.purchase) {
      productData = (
        <>
          <div className="card__text card__text--ceepos">
            <div className="card__text-row">
              <div className="card__subtitle">
                {this.props.i18n.t("labels.product", {
                  ns: "orders",
                })}
              </div>
              <div>{this.props.ceepos.purchase.product.Description}</div>
            </div>
            <div className="card__text-row">
              <div className="card__subtitle">
                {this.props.i18n.t("labels.price", { ns: "orders" })}
              </div>
              <div className="card__text-highlight card__text-highlight--ceepos">
                {this.props.ceepos.purchase.product.Price / 100} €
              </div>
            </div>
            <div className="card__text-row">
              <div className="card__subtitle">
                {this.props.i18n.t("labels.state", {
                  context: "CREATED",
                  ns: "orders",
                })}
              </div>
              <div>{localize.date(this.props.ceepos.purchase.created)}</div>
            </div>
            {this.props.ceepos.purchase.paid &&
            this.props.ceepos.purchase.paid !== null ? (
              <div className="card__text-row">
                <div className="card__subtitle">
                  {this.props.i18n.t("labels.state", {
                    context: "PAID",
                    ns: "orders",
                  })}
                </div>
                <div>{localize.date(this.props.ceepos.purchase.paid)}</div>
              </div>
            ) : null}
          </div>
        </>
      );
    }

    // Everything went ok, payment was successful and order will be completed on our end.
    const paymentWasSuccessful = this.props.status === 1;

    // Student cancelled the payment process manually
    const paymentWasCancelled = this.props.status === 0;

    // Ceepos returned status 99 as something went wrong and error occured.
    const paymentWasErrored = this.props.status === 99;

    // Something else went wrong and we have no additional details nor any idea what went wrong.
    const unknownError =
      !paymentWasSuccessful && !paymentWasCancelled && !paymentWasErrored;

    if (this.props.status != null) {
      feedbackData = (
        <div className="card__content card__content--ceepos">
          <div className="card__title card__title--ceepos">
            {this.props.i18n.t("labels.info", { ns: "orders" })}
          </div>
          <div className="card__text card__text--ceepos">
            <div className="card__text-row card__text-row--ceepos-feedback">
              {paymentWasSuccessful
                ? this.props.i18n.t("notifications.createSuccess", {
                    ns: "orders",
                  })
                : null}

              {paymentWasCancelled
                ? this.props.i18n.t("notifications.cancelSuccess", {
                    ns: "orders",
                  })
                : null}

              {paymentWasErrored
                ? this.props.i18n.t("notifications.createError", {
                    ns: "orders",
                    context: "payment",
                  })
                : null}

              {unknownError
                ? this.props.i18n.t("notifications.createError", {
                    ns: "orders",
                    context: "order",
                  })
                : null}
            </div>
          </div>
          {productData}
          <footer className="card__footer card__footer--ceepos">
            {paymentWasSuccessful || paymentWasCancelled ? (
              <Button
                icon="forward"
                buttonModifiers={["back-to-muikku", "info"]}
                href={this.state.returnLink.path}
              >
                {this.state.returnLink.text}
              </Button>
            ) : null}

            {paymentWasErrored || unknownError ? (
              <>
                <Button
                  icon="forward"
                  buttonModifiers={["back-to-muikku", "info"]}
                  href={this.state.returnLink.path}
                >
                  {this.state.returnLink.text}
                </Button>

                <CommunicatorNewMessage
                  extraNamespace="ceepos-error"
                  initialSelectedItems={[
                    {
                      type: "staff",
                      value: {
                        id: this.props.ceepos.purchase.creator.userEntityId,
                        name: getName(this.props.ceepos.purchase.creator, true),
                      },
                    },
                  ]}
                  initialSubject={getErrorMessageTitle(
                    this.props.ceepos.purchase
                  )}
                  initialMessage={getErrorMessageContent(
                    this.props.ceepos.purchase,
                    this.props.ceepos.payStatusMessage
                  )}
                >
                  <Button
                    icon="envelope"
                    buttonModifiers={["send-message", "info"]}
                  >
                    {this.props.i18n.t("actions.reportError")}
                  </Button>
                </CommunicatorNewMessage>
              </>
            ) : null}
          </footer>
        </div>
      );
    }

    return (
      <div className="card-wrapper">
        <div className="card card--ceepos">
          <header className="card__hero card__hero--ceepos">
            <img
              className="card__hero-image card__hero-image--ceepos"
              src="/gfx/oo-branded-site-logo.png"
              role="presentation"
            />
            <span className="card__hero-text card__hero-text--ceepos">
              Muikku
            </span>
          </header>
          {feedbackData}
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    ceepos: state.ceepos,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation("orders")(
  connect(mapStateToProps, mapDispatchToProps)(CeeposDone)
);
