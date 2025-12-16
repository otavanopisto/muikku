import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
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
import { Action, bindActionCreators, Dispatch } from "redux";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "~/sass/elements/rangeslider.scss";
import {
  uploadProfileImage,
  UploadProfileImageTriggerType,
} from "~/actions/main-function/profile";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * UploadImageDialogProps
 */
interface UploadImageDialogProps extends WithTranslation {
  displayNotification: DisplayNotificationTriggerType;
  uploadProfileImage: UploadProfileImageTriggerType;

  b64?: string;
  file?: File;
  src?: string;

  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
}

/**
 * UploadImageDialogState
 */
interface UploadImageDialogState {
  locked: boolean;

  scale: number;
  angle: number;
}

/**
 * UploadImageDialog
 */
class UploadImageDialog extends React.Component<
  UploadImageDialogProps,
  UploadImageDialogState
> {
  private retriever: ImageEditorRetrieverType;
  /**
   * constructor
   * @param props props
   */
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
  /**
   * upload
   * @param closeDialog closeDialog
   */
  upload(closeDialog: () => void) {
    this.setState({ locked: true });
    this.props.uploadProfileImage({
      croppedB64: this.retriever.getAsDataURL(),
      originalB64: !this.props.src ? this.props.b64 : null,
      file: !this.props.src ? this.props.file : null,
      /**
       * success
       */
      success: () => {
        closeDialog();
        this.setState({ locked: false });
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({ locked: false });
      },
    });
  }
  /**
   * rotate
   */
  rotate() {
    let nAngle = this.state.angle + 90;
    if (nAngle === 360) {
      nAngle = 0;
    }

    this.setState({ angle: nAngle });
  }
  /**
   * showLoadError
   */
  showLoadError() {
    this.props.displayNotification(
      this.props.t("notifications.loadError", {
        ns: "users",
        context: "profilePicture",
      }),
      "error"
    );
  }
  /**
   * onChangeScale
   * @param newValue newValue
   */
  onChangeScale(newValue: number) {
    this.setState({
      scale: newValue,
    });
  }
  /**
   * getRetriever
   * @param retriever retriever
   */
  getRetriever(retriever: ImageEditorRetrieverType) {
    this.retriever = retriever;
  }
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
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
              max={200}
              min={100}
              onChange={this.onChangeScale}
            />
          </div>
          <ButtonPill icon="spinner" onClick={this.rotate} />
        </div>
      </div>
    );
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["execute", "standard-ok"]}
          onClick={this.upload.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.save")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={this.props.t("labels.profileImage", { ns: "profile" })}
        content={content}
        footer={footer}
        modifier="upload-image"
        onClose={this.props.onClose}
      />
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { displayNotification, uploadProfileImage },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(null, mapDispatchToProps)(UploadImageDialog)
);
