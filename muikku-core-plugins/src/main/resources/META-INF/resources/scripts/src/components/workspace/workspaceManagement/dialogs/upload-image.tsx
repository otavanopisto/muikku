import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/image-editor.scss";
import Button, { ButtonPill } from "~/components/general/button";
import ImageEditor, {
  ImageEditorRetrieverType,
} from "~/components/general/image-editor";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import {
  updateCurrentWorkspaceImagesB64,
  UpdateCurrentWorkspaceImagesB64TriggerType,
} from "~/actions/workspaces";
const Slider = require("react-rangeslider").default;
import "~/sass/elements/rangeslider.scss";

interface UploadImageDialogProps {
  i18n: i18nType;
  displayNotification: DisplayNotificationTriggerType;
  onImageChange: (croppedB64: string, originalB64?: string, file?: File) => any;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
  b64?: string;
  file?: File;
  src?: string;

  isOpen: boolean;
  onClose: () => any;
}

interface UploadImageDialogState {
  scale: number;
  angle: number;
}

class UploadImageDialog extends React.Component<
  UploadImageDialogProps,
  UploadImageDialogState
> {
  private retriever: ImageEditorRetrieverType;
  constructor(props: UploadImageDialogProps) {
    super(props);
    this.acceptImage = this.acceptImage.bind(this);
    this.showLoadError = this.showLoadError.bind(this);
    this.rotate = this.rotate.bind(this);
    this.onChangeScale = this.onChangeScale.bind(this);
    this.getRetriever = this.getRetriever.bind(this);
    this.state = {
      scale: 100,
      angle: 0,
    };
  }
  acceptImage(closeDialog: () => any) {
    closeDialog();
    this.props.updateCurrentWorkspaceImagesB64({
      originalB64: this.props.b64,
      croppedB64: this.retriever.getAsDataURL(),
      success: () => {
        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.management.notification.coverImage.saved",
          ),
          "success",
        );
        this.props.onImageChange(
          this.retriever.getAsDataURL(),
          !this.props.src ? this.props.b64 : null,
          !this.props.src ? this.props.file : null,
        );
      },
    });
  }
  rotate() {
    let nAngle = this.state.angle + 90;
    if (nAngle === 360) {
      nAngle = 0;
    }

    this.setState({ angle: nAngle });
  }
  showLoadError() {
    this.props.displayNotification(
      this.props.i18n.text.get(
        "plugin.workspace.management.notification.failedToLoadImage",
      ),
      "error",
    );
  }
  onChangeScale(newValue: number) {
    this.setState({
      scale: newValue,
    });
  }
  getRetriever(retriever: ImageEditorRetrieverType) {
    this.retriever = retriever;
  }

  // The calculated image ratio at the moment for the workspace cover image is 4,62962962963,
  // so it's passed as 4.63 which is close enough (I don't see any difference as a result).
  // If the layout is changed and the ratio changes, this needs to be updated
  // The ratio could be calculated dynamically, but as of now, there's no reason

  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <ImageEditor
          className="image-editor image-editor--workspace"
          onInitializedGetRetriever={this.getRetriever}
          dataURL={this.props.src || this.props.b64}
          onLoadError={this.showLoadError}
          ratio={4.63}
          scale={this.state.scale / 100}
          angle={this.state.angle}
          displayBoxWidth={parseInt((window.innerWidth * 0.8) as any)}
        />
        <div className="dialog__image-tools">
          <div className="dialog__slider">
            <Slider
              value={this.state.scale}
              orientation="horizontal"
              max={200}
              min={100}
              onChange={this.onChangeScale}
            />
          </div>
          <ButtonPill icon="spinner" onClick={this.rotate} />
        </div>
      </div>
    );
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["execute", "standard-ok"]}
          onClick={this.acceptImage.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.management.changeImage.dialog.saveButton.label",
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.management.changeImage.dialog.cancelButton.label",
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={this.props.i18n.text.get(
          "plugin.workspace.management.changeImage.dialog.title",
        )}
        content={content}
        footer={footer}
        modifier="upload-header-image"
        onClose={this.props.onClose}
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { displayNotification, updateCurrentWorkspaceImagesB64 },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageDialog);
