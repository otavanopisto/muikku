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
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import { WithTranslation, withTranslation } from "react-i18next";

const KEYCODES = {
  ENTER: 13,
};

/**
 * CommunicatorSignatureUpdateDialogProps
 */
interface CommunicatorSignatureUpdateDialogProps
  extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
  signature: MessageSignatureType;
  updateSignature: UpdateSignatureTriggerType;
  i18nOLD: i18nType;
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
   * handleKeydown
   * @param code code
   * @param closeDialog closeDialog
   */
  handleKeydown(code: number, closeDialog: () => void) {
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
  update(closeDialog: () => void) {
    this.props.updateSignature(this.state.signature.trim() || null);
    closeDialog();
  }

  /**
   * render
   */
  render() {
    /**
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.update.bind(this, closeDialog)}
        >
          {this.props.t("common:actions.save")}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={closeDialog}>
          {this.props.t("common:actions.cancel")}
        </Button>
      </div>
    );
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div className="env-dialog__row">
        <div className="env-dialog__form-element-container">
          {this.state.signature && (
            <CKEditor onChange={this.onCKEditorChange} autofocus>
              {this.state.signature}
            </CKEditor>
          )}
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
        // TODO: use i18next
        title={this.props.i18nOLD.text.get(
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateSignature }, dispatch);
}

export default withTranslation(["common"])(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommunicatorSignatureUpdateDialog)
);
