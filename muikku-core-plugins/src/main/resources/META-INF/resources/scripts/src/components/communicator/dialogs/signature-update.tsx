import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import CKEditor from "~/components/general/ckeditor";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import {
  updateSignature,
  UpdateSignatureTriggerType,
} from "~/actions/main-function/messages";
import { MessageSignatureType } from "~/reducers/main-function/messages";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";

const KEYCODES = {
  ENTER: 13,
};

/**
 * CommunicatorSignatureUpdateDialogProps
 */
interface CommunicatorSignatureUpdateDialogProps {
  children?: React.ReactElement<any>;
  isOpen: boolean;
  onClose: () => any;
  signature: MessageSignatureType;
  updateSignature: UpdateSignatureTriggerType;
  i18n: i18nType;
}

/**
 * CommunicatorSignatureUpdateDialogState
 */
interface CommunicatorSignatureUpdateDialogState {
  signature: string;
}

/**
 * CommunicatorSignatureUpdateDialog
 */
class CommunicatorSignatureUpdateDialog extends React.Component<
  CommunicatorSignatureUpdateDialogProps,
  CommunicatorSignatureUpdateDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CommunicatorSignatureUpdateDialogProps) {
    super(props);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.resetState = this.resetState.bind(this);
    this.update = this.update.bind(this);

    this.state = {
      signature: props.signature ? props.signature.signature : "",
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(
    prevProps: Readonly<CommunicatorSignatureUpdateDialogProps>,
    prevState: Readonly<CommunicatorSignatureUpdateDialogState>
  ): void {
    // On first render signature might be null
    // so we need to check if it's changes from null to something
    // and update state
    if (prevProps.signature !== this.props.signature) {
      this.setState({
        signature: this.props.signature ? this.props.signature.signature : "",
      });
    }
  }

  /**
   * handleKeydown
   * @param code code
   * @param closeDialog closeDialog
   */
  handleKeydown(code: number, closeDialog: () => any) {
    if (code === KEYCODES.ENTER) {
      this.update(closeDialog);
    }
  }

  /**
   * onCKEditorChange
   * @param signature signature
   */
  onCKEditorChange(signature: string) {
    this.setState({ signature });
  }

  /**
   * resetState
   */
  resetState() {
    this.setState({
      signature: this.props.signature ? this.props.signature.signature : "",
    });
  }

  /**
   * update
   * @param closeDialog closeDialog
   */
  update(closeDialog: () => any) {
    this.props.updateSignature(this.state.signature.trim() || null);
    closeDialog();
  }

  /**
   * render
   */
  render() {
    /**
     * @param closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.update.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.communicator.settings.signature.create"
          )}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={closeDialog}>
          {this.props.i18n.text.get(
            "plugin.communicator.confirmSignatureRemovalDialog.cancelButton"
          )}
        </Button>
      </div>
    );
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div className="env-dialog__row">
        <div className="env-dialog__form-element-container">
          <CKEditor onChange={this.onCKEditorChange} autofocus>
            {this.state.signature}
          </CKEditor>
        </div>
      </div>
    );
    return (
      <EnvironmentDialog
        onClose={this.props.onClose}
        isOpen={this.props.isOpen}
        onKeyStroke={this.handleKeydown}
        onOpen={this.resetState}
        modifier="update-signature"
        title={this.props.i18n.text.get(
          "plugin.communicator.settings.signature"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    signature: state.messages.signature,
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateSignature }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorSignatureUpdateDialog);
