import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
import { CeeposState } from "~/reducers/main-function/ceepos";
import {
  getErrorMessageContent,
  getErrorMessageTitle,
} from "~/helper-functions/ceepos-error";
import { getName } from "~/util/modifiers";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/card.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/glyph.scss";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

interface CeeposPayProps extends WithTranslation {
  ceepos: CeeposState;
  status: StatusType;
}

interface CeeposPayState {}

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
                  <Button
                    icon="forward"
                    buttonModifiers={["back-to-muikku", "info"]}
                    href="/"
                  >
                    {this.props.i18n.t("actions.returnHome")}
                  </Button>
                  {this.props.ceepos.purchase ? (
                    <CommunicatorNewMessage
                      extraNamespace="ceepos-error"
                      initialSelectedItems={[
                        {
                          type: "staff",
                          value: {
                            id: this.props.ceepos.purchase.creator.userEntityId,
                            name: getName(
                              this.props.ceepos.purchase.creator,
                              true
                            ),
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
                  ) : null}
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

function mapStateToProps(state: StateType) {
  return {
    ceepos: state.ceepos,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation("orders")(
  connect(mapStateToProps, mapDispatchToProps)(CeeposPay)
);
