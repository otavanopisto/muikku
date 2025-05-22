import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import CKEditor from "~/components/general/ckeditor";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateSignature,
  UpdateSignatureTriggerType,
} from "~/actions/main-function/messages";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import { WithTranslation, withTranslation } from "react-i18next";
import { CommunicatorSignature } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

const KEYCODES = {
  ENTER: 13,
};

/**
 * CommunicatorSignatureUpdateDialogProps
 */
interface CommunicatorSignatureUpdateDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
  signature: CommunicatorSignature;
  updateSignature: UpdateSignatureTriggerType;
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
          {this.props.t("actions.save")}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={closeDialog}>
          {this.props.t("actions.cancel")}
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
        title={this.props.t("labels.signature", { ns: "messaging" })}
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ updateSignature }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommunicatorSignatureUpdateDialog)
);
