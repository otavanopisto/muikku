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
const Slider = require("react-rangeslider").default;
import "~/sass/elements/rangeslider.scss";
import {
  uploadProfileImage,
  UploadProfileImageTriggerType,
} from "~/actions/main-function/profile";

interface UploadImageDialogProps {
  i18n: i18nType;
  displayNotification: DisplayNotificationTriggerType;
  uploadProfileImage: UploadProfileImageTriggerType;

  b64?: string;
  file?: File;
  src?: string;

  isOpen: boolean;
  onClose: () => any;
}

interface UploadImageDialogState {
  locked: boolean;

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

    this.upload = this.upload.bind(this);
    this.showLoadError = this.showLoadError.bind(this);
    this.rotate = this.rotate.bind(this);
    this.onChangeScale = this.onChangeScale.bind(this);
    this.getRetriever = this.getRetriever.bind(this);

    this.state = {
      locked: false,
      scale: 100,
      angle: 0,
    };
  }
  upload(closeDialog: () => any) {
    this.setState({ locked: true });
    this.props.uploadProfileImage({
      croppedB64: this.retriever.getAsDataURL(),
      originalB64: !this.props.src ? this.props.b64 : null,
      file: !this.props.src ? this.props.file : null,
      success: () => {
        closeDialog();
        this.setState({ locked: false });
      },
      fail: () => {
        this.setState({ locked: false });
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
        "plugin.profile.errormessage.profileImage.loadFailed",
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
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <ImageEditor
          className="image-editor image-editor--profile"
          onInitializedGetRetriever={this.getRetriever}
          dataURL={this.props.src || this.props.b64}
          onLoadError={this.showLoadError}
          ratio={1}
          scale={this.state.scale / 100}
          angle={this.state.angle}
          displayBoxWidth={250}
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
          onClick={this.upload.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.profile.changeImage.dialog.saveButton.label",
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.profile.changeImage.dialog.cancelButton.label",
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={this.props.i18n.text.get(
          "plugin.profile.changeImage.dialog.title",
        )}
        content={content}
        footer={footer}
        modifier="upload-image"
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
    { displayNotification, uploadProfileImage },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageDialog);
