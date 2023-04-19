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
import "~/sass/elements/link.scss";
import Button, { ButtonPill } from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * CommunicatorApplicationProps
 */
interface CommunicatorApplicationProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside: React.ReactElement<any>;
}

/**
 * CommunicatorApplicationState
 */
interface CommunicatorApplicationState {
  updateSignatureDialogOpened: boolean;
}

/**
 * CommunicatorApplication
 */
class CommunicatorApplication extends React.Component<
  CommunicatorApplicationProps,
  CommunicatorApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CommunicatorApplicationProps) {
    super(props);

    this.openDialogSignature = this.openDialogSignature.bind(this);
    this.closeDialogSignature = this.closeDialogSignature.bind(this);

    this.state = {
      updateSignatureDialogOpened: false,
    };
  }

  /**
   * openDialogSignature
   * @param closeDropdown closeDropdown
   */
  openDialogSignature(closeDropdown?: () => void) {
    this.setState({
      updateSignatureDialogOpened: true,
    });
    closeDropdown && closeDropdown();
  }

  /**
   * closeDialogSignature
   */
  closeDialogSignature() {
    this.setState({
      updateSignatureDialogOpened: false,
    });
  }

  /**
   * render
   */
  render() {
    const title = this.props.t("labels.communicator");
    const icon = (
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
                {this.props.t("labels.signature", { ns: "messaging" })}
              </span>
            </Link>
          ),
        ]}
      >
        <ButtonPill buttonModifiers="settings" icon="cog" />
      </Dropdown>
    );
    const primaryOption = (
      <NewMessage>
        <Button buttonModifiers="primary-function">
          {this.props.t("actions.create", {
            ns: "messaging",
            context: "message",
          })}
        </Button>
      </NewMessage>
    );
    const toolbar = <Toolbar />;

    //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
    return (
      <>
        <ApplicationPanel
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
      </>
    );
  }
}


/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

const componentWithTranslation = withTranslation(["messaging"], {
  withRef: true,
})(CommunicatorApplication);

export default connect(null, mapDispatchToProps, null, {
  withRef: true,
})(componentWithTranslation);
