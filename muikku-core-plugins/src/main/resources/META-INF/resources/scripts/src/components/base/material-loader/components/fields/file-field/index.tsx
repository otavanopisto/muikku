import * as React from "react";
import { StatusType } from "~/reducers/base/status";
import equals = require("deep-equal");
import ConfirmRemoveDialog from "./confirm-remove-dialog";
import FileUploader from "~/components/general/file-uploader";
import Synchronizer from "../base/synchronizer";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../../../utils";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import "~/sass/elements/filefield.scss";

/**
 * FileFieldProps
 */
interface FileFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
  };
  status: StatusType;
  usedAs: UsedAs;
  readOnly?: boolean;
  initialValue?: string;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;

  invisible?: boolean;
}

/**
 * FileFieldState
 */
interface FileFieldState {
  values: Array<{
    // might not be there while uploading
    fileId: string;
    name: string;
    contentType: string;
  }>;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  fieldSavedState: FieldStateStatus;
}

/**
 * FileField
 */
class FileField extends React.Component<FileFieldProps, FileFieldState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FileFieldProps) {
    super(props);

    this.state = {
      values:
        (props.initialValue && (JSON.parse(props.initialValue) || [])) || [],

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      fieldSavedState: null,
    };

    this.onFileAdded = this.onFileAdded.bind(this);
    this.checkDoneAndRunOnChange = this.checkDoneAndRunOnChange.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);
  }

  /**
   * onFieldSavedStateChange
   * @param savedState savedState
   */
  onFieldSavedStateChange(savedState: FieldStateStatus) {
    this.setState({
      fieldSavedState: savedState,
    });
  }

  /**
   * shouldComponentUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   * @returns boolean
   */
  shouldComponentUpdate(nextProps: FileFieldProps, nextState: FileFieldState) {
    return (
      !equals(nextProps.content, this.props.content) ||
      this.props.readOnly !== nextProps.readOnly ||
      !equals(nextState, this.state) ||
      nextProps.invisible !== this.props.invisible
    );
  }

  /**
   * onFileAdded
   * @param file file
   * @param data data
   */
  onFileAdded(file: File, data: any) {
    const newValues = [
      ...this.state.values,
      {
        fileId: data.fileId,
        name: file.name,
        contentType: data.fileContentType || file.type,
      },
    ];

    this.setState(
      {
        values: newValues,
      },
      this.checkDoneAndRunOnChange
    );
  }

  /**
   * checkDoneAndRunOnChange
   * @returns {undefined}
   */
  checkDoneAndRunOnChange(): undefined {
    if (!this.props.onChange || !this.props.content) {
      return;
    }

    // ok now that all is done we need to filter what failed to upload, and otherwise
    // set the fileId name and content type from the value as the value for the result
    const result = JSON.stringify(
      this.state.values.map((value) => {
        const { fileId, name, contentType } = value;
        return {
          fileId,
          name,
          contentType,
        };
      })
    );

    // call onchange
    this.props.onChange(this, this.props.content.name, result);
  }

  /**
   * removeFileAt
   * @param index index
   */
  removeFileAt(index: number) {
    const newValues = this.state.values.filter((a, i) => i !== index);
    this.setState(
      {
        values: newValues,
      },
      this.checkDoneAndRunOnChange
    );
  }

  /**
   * removeFile
   * @param data data
   */
  removeFile(data: any) {
    const index = this.state.values.findIndex((f) => f.fileId === data.fileId);
    this.removeFileAt(index);
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    // if elements is disabled
    const ElementDisabledState = this.props.readOnly
      ? "filefield--disabled"
      : "";

    /**
     * formDataGenerator
     * @param file file
     * @param formData formData
     */
    const formDataGenerator = (file: File, formData: FormData) => {
      formData.append("file", file);
    };

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // and this is the container
    return (
      <>
        <ReadspeakerMessage
          text={t("messages.assignment", {
            ns: "readSpeaker",
            context: "file",
          })}
        />
        <span
          className={`filefield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          <span className={`filefield ${ElementDisabledState}`}>
            <FileUploader
              emptyText={
                this.props.readOnly ? t("content.empty", { ns: "files" }) : null
              }
              readOnly={this.props.readOnly}
              url={this.props.status.contextPath + "/tempFileUploadServlet"}
              displayNotificationOnError
              formDataGenerator={formDataGenerator}
              onFileSuccess={(file: File, data: any) => {
                this.onFileAdded(file, data);
              }}
              hintText={t("content.add", { ns: "materials", context: "file" })}
              fileTooLargeErrorText={t("notifications.sizeTooLarge", {
                ns: "files",
              })}
              deleteFileText={t("actions.remove")}
              downloadFileText={t("actions.download")}
              files={this.state.values}
              fileIdKey="fileId"
              fileNameKey="name"
              fileUrlGenerator={(f) => `/rest/workspace/fileanswer/${f.fileId}`}
              fileDownloadAllUrlGenerator={(f) =>
                "/rest/workspace/allfileanswers/" +
                f[0].fileId +
                "?archiveName=" +
                t("labels.zipFileName", { ns: "files" })
              }
              fileDownloadAllLabel={t("actions.download", {
                ns: "common",
                context: "all",
              })}
              deleteDialogElement={ConfirmRemoveDialog}
              deleteDialogElementProps={{ onConfirm: this.removeFile }}
              modifier="taskfield"
              uploadingTextProcesser={(percent: number) =>
                t("content.statusUploading", {
                  ns: "materials",
                  progress: percent,
                })
              }
              invisible={this.props.invisible}
              notificationOfSuccessText={t("notifications.uploadSuccess", {
                ns: "files",
              })}
              displayNotificationOnSuccess
            />
          </span>
        </span>
      </>
    );
  }
}

export default withTranslation(["materials", "files", "common"])(FileField);
