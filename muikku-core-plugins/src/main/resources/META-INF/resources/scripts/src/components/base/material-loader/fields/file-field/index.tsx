import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import equals = require("deep-equal");
import ConfirmRemoveDialog from "./confirm-remove-dialog";
import FileUploader from "~/components/general/file-uploader";
import Synchronizer from "../base/synchronizer";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../../base/index";

interface FileFieldProps {
  type: string;
  content: {
    name: string;
  };
  i18n: i18nType;
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

export default class FileField extends React.Component<
  FileFieldProps,
  FileFieldState
> {
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
   * @param savedState
   */
  onFieldSavedStateChange(savedState: FieldStateStatus) {
    this.setState({
      fieldSavedState: savedState,
    });
  }

  /**
   * shouldComponentUpdate
   * @param nextProps
   * @param nextState
   * @returns
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
   * @param file
   * @param data
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
   * @returns
   */
  checkDoneAndRunOnChange() {
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
   * @param index
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
   * @param data
   */
  removeFile(data: any) {
    const index = this.state.values.findIndex((f) => f.fileId === data.fileId);
    this.removeFileAt(index);
  }

  /**
   * render
   * @returns
   */
  render() {
    // if elements is disabled
    const ElementDisabledState = this.props.readOnly
      ? "material-page__taskfield-disabled"
      : "";

    const formDataGenerator = (file: File, formData: FormData) => {
      formData.append("file", file);
    };

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // and this is the container
    return (
      <span
        className={`material-page__filefield-wrapper ${fieldSavedStateClass}`}
      >
        <Synchronizer
          synced={this.state.synced}
          syncError={this.state.syncError}
          i18n={this.props.i18n}
          onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
        />
        <span className={`material-page__filefield ${ElementDisabledState}`}>
          <FileUploader
            emptyText={
              this.props.readOnly
                ? this.props.i18n.text.get("plugin.workspace.fileField.noFiles")
                : null
            }
            readOnly={this.props.readOnly}
            url={this.props.status.contextPath + "/tempFileUploadServlet"}
            displayNotificationOnError
            formDataGenerator={formDataGenerator}
            onFileSuccess={(file: File, data: any) => {
              this.onFileAdded(file, data);
            }}
            hintText={this.props.i18n.text.get(
              "plugin.workspace.fileField.fieldHint"
            )}
            fileTooLargeErrorText={this.props.i18n.text.get(
              "plugin.workspace.fileFieldUpload.fileSizeTooLarge"
            )}
            deleteFileText={this.props.i18n.text.get(
              "plugin.workspace.fileField.removeLink"
            )}
            downloadFileText={this.props.i18n.text.get(
              "plugin.workspace.fileField.downloadLink"
            )}
            files={this.state.values}
            fileIdKey="fileId"
            fileNameKey="name"
            fileUrlGenerator={(f) => `/rest/workspace/fileanswer/${f.fileId}`}
            fileDownloadAllUrlGenerator={(f) =>
              "/rest/workspace/allfileanswers/" +
              f[0].fileId +
              "?archiveName=" +
              this.props.i18n.text.get("plugin.workspace.fileField.zipFileName")
            }
            fileDownloadAllLabel={this.props.i18n.text.get(
              "plugin.workspace.fileField.downloadAllLink"
            )}
            deleteDialogElement={ConfirmRemoveDialog}
            deleteDialogElementProps={{ onConfirm: this.removeFile }}
            modifier="taskfield"
            uploadingTextProcesser={(percent: number) =>
              this.props.i18n.text.get(
                "plugin.workspace.fileField.statusUploading",
                percent
              )
            }
            invisible={this.props.invisible}
            notificationOfSuccessText={this.props.i18n.text.get(
              "plugin.workspace.fileFieldUpload.uploadSuccessful"
            )}
            displayNotificationOnSuccess
          />
        </span>
      </span>
    );
  }
}
