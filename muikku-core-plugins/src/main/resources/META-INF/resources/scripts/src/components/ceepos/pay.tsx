import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { CeeposState } from '~/reducers/main-function/ceepos';
import { getErrorMessageContent, getErrorMessageTitle } from '~/helper-functions/ceepos-error';
import { getName } from "~/util/modifiers";

import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import Button from '~/components/general/button';

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
            {this.props.ceepos.state === "ERROR" ?
              <div className="card__footer card__footer--ceepos">
                <Button
                  icon="forward"
                  buttonModifiers={["back-to-muikku", "info"]}
                  href="/">{this.props.i18n.text.get("plugin.ceepos.order.backToMuikkuButton.label")}
                </Button>
                <CommunicatorNewMessage extraNamespace="ceepos-error"
                  initialSelectedItems={[{
                    type: "staff",
                    value: {
                      id: this.props.ceepos.purchase.creator.userEntityId,
                      name: getName(this.props.ceepos.purchase.creator, true)
                    }
                  }]}
                  initialSubject={getErrorMessageTitle(this.props.i18n, this.props.ceepos.purchase)}
                  initialMessage={getErrorMessageContent(this.props.i18n, this.props.ceepos.purchase, this.props.ceepos.payStatusMessage)}><Button
                    icon="envelope"
                    buttonModifiers={["send-message", "info"]}
                  >{this.props.i18n.text.get("plugin.ceepos.order.sendMessageButton.label")}
                  </Button></CommunicatorNewMessage>
              </div>
          : null}
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
