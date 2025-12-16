import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import { CeeposState } from "~/reducers/main-function/ceepos";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions/index";
import "~/sass/elements/card.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/glyph.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { CeeposReturnLink } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

/**
 * CeeposPayProps
 */
interface CeeposPayProps extends WithTranslation {
  ceepos: CeeposState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * CeeposPayState
 */
interface CeeposPayState {
  returnLink: CeeposReturnLink;
}

/**
 * CeeposPay
 */
class CeeposPay extends React.Component<CeeposPayProps, CeeposPayState> {
  /**
   * Class constructor
   * @param props props
   */
  constructor(props: CeeposPayProps) {
    super(props);

    this.state = {
      returnLink: {
        text: this.props.i18n.t("actions.returnHome"),
        path: "/",
      },
    };
  }

  // This same one used in both components and the Returnlink interface. Could be a hook
  /**
   * componentDidMount
   */
  async componentDidMount() {
    const ceeposApi = MApi.getCeeposApi();

    try {
      const searchParams = new URLSearchParams(window.location.search);

      const returnLink = await ceeposApi.getCeeposReturnLink({
        orderId: parseInt(searchParams.get("order")),
      });
      this.setState({ returnLink });
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
    }
  }

  /**
   * render
   * @returns JSX component
   */
  render() {
    if (this.props.ceepos.state === "LOADING") {
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
            <div className="card__content card__content--ceepos">
              <div className="loader-empty" />
            </div>
          </div>
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
          {this.props.status.isActiveUser ? (
            <div className="card__content card__content--ceepos">
              <div className="card__title card__title--ceepos">
                {this.props.i18n.t("labels.info", { ns: "orders" })}
              </div>
              <div className="card__text card__text--ceepos">
                {this.props.ceepos.payStatusMessage
                  ? this.props.ceepos.payStatusMessage
                  : this.props.i18n.t("content.redirect", { ns: "orders" })}
              </div>
              {this.props.ceepos.state === "ERROR" ? (
                <div className="card__footer card__footer--ceepos">
                  <div className="card__error-guidance">
                    <p className="card__error-guidance-text">
                      {this.props.i18n.t("content.errorGuidance", {
                        ns: "orders",
                      })}
                    </p>

                    <Button
                      icon="forward"
                      buttonModifiers={["back-to-muikku", "info"]}
                      href={this.state.returnLink.path}
                    >
                      {this.state.returnLink.text}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="card__content card__content--ceepos">
              <div className="card__title card__title--ceepos">
                {this.props.i18n.t("labels.nonActiveUser", { ns: "orders" })}
              </div>
              <div className="card__text card__text--ceepos">
                {this.props.ceepos.payStatusMessage
                  ? this.props.ceepos.payStatusMessage
                  : this.props.i18n.t("content.nonActiveUser", {
                      ns: "orders",
                    })}
              </div>
            </div>
          )}
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation("orders")(
  connect(mapStateToProps, mapDispatchToProps)(CeeposPay)
);
