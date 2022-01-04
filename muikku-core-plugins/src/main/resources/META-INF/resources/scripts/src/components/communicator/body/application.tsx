import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import Toolbar from "./application/toolbar";
import CommunicatorMessages from "./application/messages";
import MessageView from "./application/message-view";
import NewMessage from "../dialogs/new-message";
import SignatureUpdateDialog from "../dialogs/signature-update";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import Button, { ButtonPill } from "~/components/general/button";

interface CommunicatorApplicationProps {
  aside: React.ReactElement<any>;
  i18n: i18nType;
}

interface CommunicatorApplicationState {
  updateSignatureDialogOpened: boolean;
}

class CommunicatorApplication extends React.Component<
  CommunicatorApplicationProps,
  CommunicatorApplicationState
> {
  constructor(props: CommunicatorApplicationProps) {
    super(props);

    this.openDialogSignature = this.openDialogSignature.bind(this);
    this.closeDialogSignature = this.closeDialogSignature.bind(this);

    this.state = {
      updateSignatureDialogOpened: false
    };
  }
  openDialogSignature(closeDropdown?: () => any) {
    this.setState({
      updateSignatureDialogOpened: true
    });
    closeDropdown && closeDropdown();
  }
  closeDialogSignature() {
    this.setState({
      updateSignatureDialogOpened: false
    });
  }

  render() {
    let title = this.props.i18n.text.get("plugin.communicator.pageTitle");
    let icon = (
      <Dropdown
        modifier="main-functions-settings"
        items={[
          (closeDropdown) => (
            <Link
              tabIndex={0}
              className="link link--full link--main-functions-settings-dropdown"
              onClick={this.openDialogSignature.bind(this, closeDropdown)}
            >
              <span>
                {this.props.i18n.text.get(
                  "plugin.communicator.settings.signature"
                )}
              </span>
            </Link>
          )
        ]}
      >
        <ButtonPill buttonModifiers="settings" icon="cog" />
      </Dropdown>
    );
    let primaryOption = (
      <NewMessage>
        <Button buttonModifiers="primary-function">
          {this.props.i18n.text.get("plugin.communicator.newMessage.label")}
        </Button>
      </NewMessage>
    );
    let toolbar = <Toolbar />;

    //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
    return (
      <div className="application-panel-wrapper">
        <ApplicationPanel
          modifier="communicator"
          toolbar={toolbar}
          title={title}
          icon={icon}
          primaryOption={primaryOption}
          asideBefore={this.props.aside}
        >
          <CommunicatorMessages />
          <MessageView />
        </ApplicationPanel>
        <SignatureUpdateDialog
          isOpen={this.state.updateSignatureDialogOpened}
          onClose={this.closeDialogSignature}
        />
        <NewMessage>
          <HoverButton icon="plus" modifier="new-message" />
        </NewMessage>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true
})(CommunicatorApplication);
