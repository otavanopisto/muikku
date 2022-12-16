import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
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

interface CeeposPayProps {
  i18nOLD: i18nType;
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
                {this.props.i18nOLD.text.get("plugin.ceepos.order.title")}
              </div>
              <div className="card__text card__text--ceepos">
                {this.props.ceepos.payStatusMessage
                  ? this.props.ceepos.payStatusMessage
                  : this.props.i18nOLD.text.get(
                      "plugin.ceepos.order.redirectToCeeposDescription"
                    )}
              </div>
              {this.props.ceepos.state === "ERROR" ? (
                <div className="card__footer card__footer--ceepos">
                  <Button
                    icon="forward"
                    buttonModifiers={["back-to-muikku", "info"]}
                    href="/"
                  >
                    {this.props.i18nOLD.text.get(
                      "plugin.ceepos.order.backToMuikkuButton.label"
                    )}
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
                        this.props.i18nOLD,
                        this.props.ceepos.purchase,
                        this.props.ceepos.payStatusMessage
                      )}
                    >
                      <Button
                        icon="envelope"
                        buttonModifiers={["send-message", "info"]}
                      >
                        {this.props.i18nOLD.text.get(
                          "plugin.ceepos.order.sendMessageButton.label"
                        )}
                      </Button>
                    </CommunicatorNewMessage>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="card__content card__content--ceepos">
              <div className="card__title card__title--ceepos">
                {this.props.i18nOLD.text.get(
                  "plugin.ceepos.order.title.nonActiveUser"
                )}
              </div>
              <div className="card__text card__text--ceepos">
                {this.props.ceepos.payStatusMessage
                  ? this.props.ceepos.payStatusMessage
                  : this.props.i18nOLD.text.get(
                      "plugin.ceepos.order.description.nonActiveUser"
                    )}
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
    i18nOLD: state.i18nOLD,
    ceepos: state.ceepos,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CeeposPay);
