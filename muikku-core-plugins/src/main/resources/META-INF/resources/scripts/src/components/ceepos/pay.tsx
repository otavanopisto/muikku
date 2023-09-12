import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { CeeposState } from "~/reducers/main-function/ceepos";
import {
  getErrorMessageContent,
  getErrorMessageTitle,
} from "~/helper-functions/ceepos-error";
import { getName } from "~/util/modifiers";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import { ReturnLink } from "./done";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";

import "~/sass/elements/card.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/glyph.scss";

interface CeeposPayProps {
  i18n: i18nType;
  ceepos: CeeposState;
  status: StatusType;
}

interface CeeposPayState {
  returnLink: ReturnLink
}


class CeeposPay extends React.Component<CeeposPayProps, CeeposPayState> {
  constructor(props: CeeposPayProps) {
    super(props);

    this.state = {
      returnLink: {
        text: props.i18n.text.get("plugin.ceepos.order.backToMuikkuButton.label"),
        path: "/"
      }
    };
  }

  // This same one used in both components and the Returnlink interface. Could be a hook
  async componentDidMount() {
    try {
      const searchParams = new URLSearchParams(window.location.search);

      const returnLink: ReturnLink = (await promisify(
        mApi().ceepos.order.returnLink.read(searchParams.get("order")),
        "callback"
      )() as ReturnLink);
        this.setState({returnLink});
    } catch (e) {
      throw e;
    }
  }

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
                {this.props.i18n.text.get("plugin.ceepos.order.title")}
              </div>
              <div className="card__text card__text--ceepos">
                {this.props.ceepos.payStatusMessage
                  ? this.props.ceepos.payStatusMessage
                  : this.props.i18n.text.get(
                      "plugin.ceepos.order.redirectToCeeposDescription"
                    )}
              </div>
              {this.props.ceepos.state === "ERROR" ? (
                <div className="card__footer card__footer--ceepos">
                  <Button
                    icon="forward"
                    buttonModifiers={["back-to-muikku", "info"]}
                    href={this.state.returnLink.path}
                  >
                    {this.state.returnLink.text}
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
                        this.props.i18n,
                        this.props.ceepos.purchase,
                        this.props.ceepos.payStatusMessage
                      )}
                    >
                      <Button
                        icon="envelope"
                        buttonModifiers={["send-message", "info"]}
                      >
                        {this.props.i18n.text.get(
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
                {this.props.i18n.text.get(
                  "plugin.ceepos.order.title.nonActiveUser"
                )}
              </div>
              <div className="card__text card__text--ceepos">
                {this.props.ceepos.payStatusMessage
                  ? this.props.ceepos.payStatusMessage
                  : this.props.i18n.text.get(
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
    i18n: state.i18n,
    ceepos: state.ceepos,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CeeposPay);
