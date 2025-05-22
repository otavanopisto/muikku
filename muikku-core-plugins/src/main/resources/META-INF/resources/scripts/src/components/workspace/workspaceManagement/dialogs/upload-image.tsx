import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
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

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "~/sass/elements/rangeslider.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * UploadImageDialogProps
 */
interface UploadImageDialogProps extends WithTranslation {
  displayNotification: DisplayNotificationTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImageChange: (croppedB64: string, originalB64?: string, file?: File) => any;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
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

  /**
   * acceptImage
   * @param closeDialog closeDialog
   */
  acceptImage(closeDialog: () => void) {
    const { t } = this.props;

    closeDialog();
    this.props.updateCurrentWorkspaceImagesB64({
      originalB64: this.props.b64,
      croppedB64: this.retriever.getAsDataURL(),
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          t("notifications.saveSuccess", {
            ns: "workspace",
            context: "coverImage",
          }),
          "success"
        );
        this.props.onImageChange(
          this.retriever.getAsDataURL(),
          !this.props.src ? this.props.b64 : null,
          !this.props.src ? this.props.file : null
        );
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
    const { t } = this.props;

    this.props.displayNotification(
      t("notifications.loadError", { ns: "workspace", context: "coverImage" }),
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

  // The calculated image ratio at the moment for the workspace cover image is 4,62962962963,
  // so it's passed as 4.63 which is close enough (I don't see any difference as a result).
  // If the layout is changed and the ratio changes, this needs to be updated
  // The ratio could be calculated dynamically, but as of now, there's no reason

  /**
   * render
   */
  render() {
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <ImageEditor
          className="image-editor image-editor--workspace"
          onInitializedGetRetriever={this.getRetriever}
          dataURL={this.props.src || this.props.b64}
          onLoadError={this.showLoadError}
          ratio={4.63}
          scale={this.state.scale / 100}
          angle={this.state.angle}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          displayBoxWidth={parseInt((window.innerWidth * 0.8) as any)}
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
          onClick={this.acceptImage.bind(this, closeDialog)}
        >
          {t("actions.save")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={t("labels.coverImage", { ns: "workspace" })}
        content={content}
        footer={footer}
        modifier="upload-header-image"
        onClose={this.props.onClose}
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { displayNotification, updateCurrentWorkspaceImagesB64 },
    dispatch
  );
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(UploadImageDialog)
);
