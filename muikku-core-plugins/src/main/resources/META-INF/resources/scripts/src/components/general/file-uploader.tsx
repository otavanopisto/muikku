import * as React from "react";
import $ from "~/lib/jquery";
import "~/sass/elements/file-uploader.scss";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarLine = require("react-progress-bar.js").Line;
import { v4 as uuidv4 } from "uuid";
import { UploadingValue } from "../../@types/shared";

/**
 * FileUploaderProps
 */
interface FileUploaderProps {
  // Default uploading process
  onFileError?: (file: File, err: Error) => any;
  fileTooLargeErrorText?: string;
  onFileSuccess?: (file: File, response: any) => any;
  formDataGenerator?: (file: File, formData: FormData) => any;
  uploadingTextProcesser?: (i: number) => string;
  url?: string;
  uploadingValues?: UploadingValue[];
  // taking control from it
  onFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  modifier?: string;
  files?: any[];
  fileIdKey: string;
  fileUrlGenerator: (file: any) => any;
  fileDownloadAllUrlGenerator?: (files: any) => string;
  fileDownloadAllLabel?: string;
  fileExtraNodeGenerator?: (file: any) => any;
  fileNameKey: string;
  deleteDialogElement: any;
  deleteDialogElementProps?: any;
  emptyText?: string;
  deleteFileText?: string;
  downloadFileText?: string;
  hintText: string;
  showURL?: boolean;
  readOnly?: boolean;
  displayNotificationOnError?: boolean;
  displayNotificationOnSuccess?: boolean;
  notificationOfSuccessText?: string;

  invisible?: boolean;

  displayNotification: DisplayNotificationTriggerType;
}

/**
 * FileUploaderState
 */
interface FileUploaderState {
  uploadingValues: UploadingValue[];
}

const MAX_BYTES = 10000000;

/**
 * FileUploader
 */
class FileUploader extends React.Component<
  FileUploaderProps,
  FileUploaderState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FileUploaderProps) {
    super(props);

    this.state = {
      uploadingValues: [],
    };

    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.processFileAt = this.processFileAt.bind(this);
    this.removeFailedFileAt = this.removeFailedFileAt.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    if (this.props.uploadingValues) {
      this.setState({
        uploadingValues: this.props.uploadingValues,
      });
    }
  };

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState  prevState
   */
  componentDidUpdate = (
    prevProps: FileUploaderProps,
    prevState: FileUploaderState
  ) => {
    if (
      JSON.stringify(prevProps.uploadingValues) !==
      JSON.stringify(this.props.uploadingValues)
    ) {
      this.setState({
        uploadingValues: this.props.uploadingValues,
      });
    }
  };

  /**
   * removeFailedFileAt
   * @param index index
   */
  removeFailedFileAt(index: number) {
    const newValues = [...this.state.uploadingValues];
    newValues.splice(index, 1);

    //and call set state
    this.setState({
      uploadingValues: newValues,
    });
  }

  /**
   * processFileAt
   * @param index index
   */
  processFileAt(index: number) {
    //first we create a new form data
    const formData = new FormData();
    //get the file from that index
    const file =
      this.state.uploadingValues[index] &&
      this.state.uploadingValues[index].file &&
      this.state.uploadingValues[index].file;
    //we append it in the way the server expects

    if (file && file.size >= MAX_BYTES) {
      //on error we do similarly that on success
      const newValues = [...this.state.uploadingValues];
      const successIndex = newValues.findIndex((f) => f.file === file);
      newValues[successIndex] = { ...this.state.uploadingValues[successIndex] };
      newValues[successIndex].failed = true;

      //and call set state
      this.setState({
        uploadingValues: newValues,
      });

      this.props.displayNotificationOnError &&
        this.props.displayNotification(
          this.props.fileTooLargeErrorText,
          "error"
        );
      this.props.onFileError &&
        this.props.onFileError(
          file,
          new Error(this.props.fileTooLargeErrorText)
        );
      return;
    }

    if (file && this.props.formDataGenerator) {
      this.props.formDataGenerator(file, formData);
    }

    if (file) {
      //we make the ajax request to the temp file upload servlet
      $.ajax({
        url: this.props.url,
        type: "POST",
        data: formData,
        // eslint-disable-next-line
        success: (data: any) => {
          let actualData = data;
          try {
            actualData = JSON.parse(data);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(err);
          }
          //make a copy of the values
          const newValues = [...this.state.uploadingValues];
          const successIndex = newValues.findIndex((f) => f.file === file);
          newValues.splice(successIndex, 1);

          //and call set state
          this.setState({
            uploadingValues: newValues,
          });
          this.props.displayNotificationOnSuccess &&
            this.props.displayNotification(
              this.props.notificationOfSuccessText,
              "success"
            );
          this.props.onFileSuccess &&
            this.props.onFileSuccess(file, actualData);
        },
        // eslint-disable-next-line
        error: (xhr: any, err: Error) => {
          //on error we do similarly that on success
          const newValues = [...this.state.uploadingValues];
          const successIndex = newValues.findIndex((f) => f.file === file);
          newValues[successIndex] = {
            ...this.state.uploadingValues[successIndex],
          };
          newValues[successIndex].failed = true;
          //and call set state
          this.setState({
            uploadingValues: newValues,
          });

          this.props.displayNotificationOnError &&
            this.props.displayNotification(err.message, "error");
          this.props.onFileError && this.props.onFileError(file, err);
        },
        // eslint-disable-next-line
        xhr: () => {
          //we need to get the upload progress
          const xhr = new (window as any).XMLHttpRequest();
          //Upload progress
          xhr.upload.addEventListener(
            "progress",
            (evt: any) => {
              if (evt.lengthComputable) {
                const currentIndex = this.state.uploadingValues.findIndex(
                  (f) => f.file === file
                );
                //we calculate the percent
                const percentComplete = evt.loaded / evt.total;
                //make a copy of the values
                const newValues = [...this.state.uploadingValues];
                //find it at that specific index and make a copy
                newValues[currentIndex] = {
                  ...this.state.uploadingValues[currentIndex],
                };
                //and set the new progress
                newValues[currentIndex].progress = percentComplete;
                //set the state for that new progress
                this.setState({
                  uploadingValues: newValues,
                });
              }
            },
            false
          );
          return xhr;
        },
        cache: false,
        contentType: false,
        processData: false,
      });
    }
  }

  /**
   * onFileInputChange
   * @param e e
   */
  onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.onFileInputChange) {
      this.props.onFileInputChange(e);
    } else {
      const newValues = Array.from(e.target.files).map((file) => ({
        name: file.name,
        contentType: file.type,
        progress: 0,
        file,
      }));
      //let's get the original size of the array that we currently got
      const originalLenght = this.state.uploadingValues.length;
      this.setState(
        { uploadingValues: this.state.uploadingValues.concat(newValues) },
        () => {
          //we are going to loop thru those newly added values
          newValues.forEach((value, index) => {
            //we get the real index
            const realIndex = index + originalLenght;
            //we tell this to process the file
            this.processFileAt(realIndex);
          });
        }
      );
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    // Download All is not rendered with material page's attachments list nor in Guider
    const downloadAll =
      this.props.fileDownloadAllUrlGenerator &&
      this.props.files &&
      this.props.files.length > 1 ? (
        <span className="file-uploader__item file-uploader__item--download-all">
          <Link
            href={this.props.fileDownloadAllUrlGenerator(this.props.files)}
            openInNewTab={this.props.fileDownloadAllLabel}
            className="link link--download-all"
            title={
              this.props.fileDownloadAllLabel
                ? this.props.fileDownloadAllLabel
                : ""
            }
          >
            {this.props.fileDownloadAllLabel}
          </Link>
        </span>
      ) : null;

    const uniqueElementID = "file-uploader__hint-" + uuidv4();
    if (this.props.invisible) {
      return (
        <span
          className={`file-uploader ${
            this.props.modifier ? "file-uploader--" + this.props.modifier : ""
          } ${this.props.readOnly ? "file-uploader--readonly" : ""}`}
        >
          <span
            className={`file-uploader__field-container ${
              this.props.modifier
                ? "file-uploader__field-container--" + this.props.modifier
                : ""
            }`}
          >
            <span id={uniqueElementID} className="file-uploader__hint">
              {this.props.hintText}
            </span>
            {this.props.readOnly ? null : (
              <input
                aria-labelledby={uniqueElementID}
                type="file"
                multiple
                className="file-uploader__field"
              />
            )}
          </span>
          {this.props.files &&
            (this.props.files.length ? (
              <span
                className={`file-uploader__items-container ${
                  this.props.modifier
                    ? "file-uploader__items--" + this.props.modifier
                    : ""
                }`}
              >
                {this.props.files.map((file) => {
                  const url = this.props.fileUrlGenerator(file);
                  return (
                    <span
                      className="file-uploader__item"
                      key={file[this.props.fileIdKey]}
                    >
                      <span className="file-uploader__item-attachment-icon icon-attachment"></span>
                      {this.props.showURL ? (
                        <span className="file-uploader__item-title-container">
                          <span className="file-uploader__item-title">
                            {file[this.props.fileNameKey]}
                          </span>
                          <span className="file-uploader__item-url">{url}</span>
                        </span>
                      ) : (
                        <span className="file-uploader__item-title-container">
                          <span className="file-uploader__item-title">
                            {file[this.props.fileNameKey]}
                          </span>
                        </span>
                      )}
                      <Link className="file-uploader__item-download-icon icon-download" />
                      {this.props.readOnly ? null : (
                        <Link className="file-uploader__item-delete-icon icon-trash" />
                      )}
                      {this.props.fileExtraNodeGenerator &&
                        this.props.fileExtraNodeGenerator(file)}
                    </span>
                  );
                })}
                {downloadAll}
              </span>
            ) : this.props.emptyText && this.props.readOnly ? (
              <span className="file-uploader__items-container file-uploader__items-container--empty">
                {this.props.emptyText}
              </span>
            ) : this.props.emptyText ? (
              <span className="file-uploader__items-container file-uploader__items-container--empty">
                {this.props.emptyText}
              </span>
            ) : null)}
        </span>
      );
    }

    const loaderElement = this.state.uploadingValues.map(
      (uploadingFile, index) => {
        if (uploadingFile.failed) {
          return (
            <span
              className="file-uploader__item file-uploader__item--failed-to-upload"
              key={index}
            >
              <span className="file-uploader__item-title-container">
                <span className="file-uploader__item-title">
                  {uploadingFile.name}
                </span>
              </span>
              <Link
                disablePropagation
                className="file-uploader__item-delete-icon icon-trash"
                onClick={this.removeFailedFileAt.bind(this, index)}
                title={
                  this.props.deleteFileText ? this.props.deleteFileText : ""
                }
              />
            </span>
          );
        }

        return (
          <span className="file-uploader__item" key={index}>
            <ProgressBarLine
              containerClassName="file-uploader__item-upload-progressbar"
              options={{
                strokeWidth: 1,
                duration: 1000,
                color: "#72d200",
                trailColor: "#f5f5f5",
                trailWidth: 1,
                svgStyle: { width: "100%", height: "4px" },
                text: {
                  className: "file-uploader__item-upload-percentage",
                  style: {
                    right: "100%",
                  },
                },
              }}
              strokeWidth={1}
              easing="easeInOut"
              duration={1000}
              color="#72d200"
              trailColor="#f5f5f5"
              trailWidth={1}
              svgStyle={{ width: "100%", height: "4px" }}
              text={this.props.uploadingTextProcesser(
                Math.round(uploadingFile.progress * 100)
              )}
              progress={uploadingFile.progress}
            />
          </span>
        );
      }
    );

    const DialogDeleteElement = this.props.deleteDialogElement;
    let dataNode = null;
    if (this.props.files || this.state.uploadingValues.length) {
      if (this.props.files.length || this.state.uploadingValues.length) {
        dataNode = (
          <span className="file-uploader__items-container">
            {this.props.files.map((file) => {
              const url = this.props.fileUrlGenerator(file);
              return (
                <span
                  className={`file-uploader__item ${
                    this.props.modifier
                      ? "file-uploader__item--" + this.props.modifier
                      : ""
                  }`}
                  key={file[this.props.fileIdKey]}
                >
                  <span className="file-uploader__item-attachment-icon icon-attachment"></span>
                  {this.props.showURL ? (
                    <span className="file-uploader__item-title-container">
                      <span className="file-uploader__item-title">
                        {file[this.props.fileNameKey]}
                      </span>
                      <span className="file-uploader__item-url">{url}</span>
                    </span>
                  ) : (
                    <span className="file-uploader__item-title-container">
                      <span className="file-uploader__item-title">
                        {file[this.props.fileNameKey]}
                      </span>
                    </span>
                  )}
                  <Link
                    href={url}
                    openInNewTab={file[this.props.fileNameKey]}
                    className="file-uploader__item-download-icon icon-download"
                    title={
                      this.props.downloadFileText
                        ? this.props.downloadFileText
                        : ""
                    }
                  />
                  {this.props.readOnly ? null : (
                    <DialogDeleteElement
                      file={file}
                      {...this.props.deleteDialogElementProps}
                    >
                      <Link
                        disablePropagation
                        className="file-uploader__item-delete-icon icon-trash"
                        title={
                          this.props.deleteFileText
                            ? this.props.deleteFileText
                            : ""
                        }
                      />
                    </DialogDeleteElement>
                  )}
                  {this.props.fileExtraNodeGenerator &&
                    this.props.fileExtraNodeGenerator(file)}
                </span>
              );
            })}
            {loaderElement}
            {downloadAll}
          </span>
        );
      } else if (this.props.emptyText && this.props.readOnly) {
        dataNode = (
          <span className="file-uploader__items-container file-uploader__items-container--empty">
            {this.props.emptyText}
          </span>
        );
      } else if (this.props.emptyText) {
        dataNode = (
          <span className="file-uploader__items-container file-uploader__items-container--empty">
            {this.props.emptyText}
          </span>
        );
      }
    }

    return (
      <span
        className={`file-uploader ${
          this.props.modifier ? "file-uploader--" + this.props.modifier : ""
        } ${this.props.readOnly ? "file-uploader--readonly" : ""}`}
      >
        <span
          className={`file-uploader__field-container ${
            this.props.modifier
              ? "file-uploader__field-container--" + this.props.modifier
              : ""
          }`}
        >
          <span id={uniqueElementID} className="file-uploader__hint">
            {this.props.hintText}
          </span>
          {this.props.readOnly ? null : (
            <input
              aria-labelledby={uniqueElementID}
              type="file"
              multiple
              className="file-uploader__field"
              onChange={this.onFileInputChange}
              value=""
            />
          )}
        </span>
        {dataNode}
      </span>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUploader);
