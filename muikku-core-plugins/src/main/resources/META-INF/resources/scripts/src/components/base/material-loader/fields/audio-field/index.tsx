import * as React from "react";
import Link from "~/components/general/link";
import $ from "~/lib/jquery";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarLine = require("react-progress-bar.js").Line;
import moment from "~/lib/moment";
import { StatusType } from "reducers/base/status";
import equals = require("deep-equal");
import ConfirmRemoveDialog from "./confirm-remove-dialog";
import Synchronizer from "../base/synchronizer";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import { FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";

// so we use the media recorder
// the media recorder is polyfilled
// if it's not there
if (!(window as any).MediaRecorder) {
  const script = document.createElement("script");
  // CONTEXTPATHREMOVED
  script.src = "/scripts/dist/polyfill-mediarecorder.js";
  script.async = true;
  document.head.appendChild(script);
}

/**
 * AudioFieldProps
 */
interface AudioFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
  };
  status: StatusType;

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
 * AudioFieldState
 */
interface AudioFieldState {
  recording: boolean;
  values: Array<{
    // might not be there while uploading
    id?: string;
    name?: string;
    contentType: string;
    uploading?: boolean;
    failed?: boolean;

    // only has a value while uploading
    progress?: number;
    file?: File;
    blob?: Blob;

    // utility
    url?: string;
  }>;
  supportsMediaAPI: () => boolean;
  time: number;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  fieldSavedState: FieldStateStatus;
}

// this is the maximum recording time in seconds
const MAX_RECORDING_TIME_IN_SECONDS = 60 * 5;

/**
 * AudioField
 */
class AudioField extends React.Component<AudioFieldProps, AudioFieldState> {
  private interval: NodeJS.Timer;
  private recorder: any;
  private stream: MediaStream;
  /**
   * constructor
   * @param props props
   */
  constructor(props: AudioFieldProps) {
    super(props);

    this.getSupportsMediaAPI = this.getSupportsMediaAPI.bind(this);

    this.state = {
      recording: false,
      time: 0,
      values: (
        (props.initialValue && (JSON.parse(props.initialValue) || [])) ||
        []
      ).map((a: any) => ({
        ...a,
        url: `/rest/workspace/audioanswer/${a.id}`,
      })),

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      fieldSavedState: null,

      // so even
      supportsMediaAPI: this.getSupportsMediaAPI,
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.removeClipAt = this.removeClipAt.bind(this);
    this.onFileChanged = this.onFileChanged.bind(this);
    this.processFileAt = this.processFileAt.bind(this);
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
   */
  shouldComponentUpdate(
    nextProps: AudioFieldProps,
    nextState: AudioFieldState
  ) {
    return (
      !equals(nextProps.content, this.props.content) ||
      this.props.readOnly !== nextProps.readOnly ||
      !equals(nextState, this.state) ||
      nextProps.invisible !== this.props.invisible
    );
  }

  /**
   * getSupportsMediaAPI
   */
  getSupportsMediaAPI() {
    // dang must be a fast AF browser for this to happen
    if (!(window as any).MediaRecorder) {
      // force update after 500 ms give it time
      // this function will be called again
      // by the render
      // its a hack but well
      setTimeout(this.forceUpdate, 500);

      // lets assume true
      // after all a fast browser that got into here
      // likely supports it
      return true;
    }
    return !(window as any).MediaRecorder.notSupported;
  }

  /**
   * start - here we start the stream
   */
  async start() {
    // we create it
    try {
      this.stream =
        this.stream ||
        (await navigator.mediaDevices.getUserMedia({
          audio: true,
        }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.stack);
      return;
    }
    // start the recorder
    this.recorder = new (window as any).MediaRecorder(this.stream);

    // and add a event listener on dataavaliable
    this.recorder.addEventListener("dataavailable", (e: Event) => {
      // where we take the blob generated
      const blob = (e as any).data as Blob;

      // set the state as that blob, with the given local blob url
      // the content type and the fact that is uploading
      // with all the values concatted
      this.setState(
        {
          values: this.state.values.concat([
            {
              blob,
              url: URL.createObjectURL(blob),
              contentType: blob.type,
              uploading: true,
            },
          ]),
        },
        () => {
          // and we tell it to process the last file
          // just like a file would
          this.processFileAt(this.state.values.length - 1);
        }
      );
    });

    // we start the recorder
    this.recorder.start();
    // and set the time
    this.setState({
      recording: true,
      time: 0,
    });
    // set a interval every second
    // just to check the time and update the timer
    this.interval = setInterval(() => {
      const nTime = this.state.time + 1;
      if (nTime === MAX_RECORDING_TIME_IN_SECONDS) {
        this.stop();
      }
      this.setState({
        time: nTime,
      });
    }, 1000) as any;
  }

  /**
   * stop - here we stop the recording
   */
  stop() {
    // clear the interval that checks the time
    clearInterval(this.interval);
    // stop the recorder, this should trigger the dataavailable event
    this.recorder.stop();
    this.stream.getTracks().forEach((t) => t.stop());

    // delete stuff
    delete this["recorder"];
    delete this["stream"];

    // and stop the fact it is recording
    this.setState({
      recording: false,
    });
  }

  /**
   * removeClipAt - Here we remote the clip
   * @param index index
   */
  removeClipAt(index: number) {
    const newValues = this.state.values.filter((a, i) => i !== index);
    this.setState(
      {
        values: newValues,
      },
      this.checkDoneAndRunOnChange
    );
  }

  /**
   * onFileChanged - when the file changes (old method for bad browsers)
   * @param e e
   */
  onFileChanged(e: React.ChangeEvent<HTMLInputElement>) {
    // we do it similarly to the file field
    const newValues = Array.from(e.target.files).map((file) => ({
      name: file.name,
      contentType: file.type,
      uploading: true,
      progress: 0,
      file,
      url: URL.createObjectURL(file),
    }));

    // check the method at the file field for an in depth explanation
    const originalLenght = this.state.values.length;
    this.setState({ values: this.state.values.concat(newValues) }, () => {
      newValues.forEach((value, index) => {
        const realIndex = index + originalLenght;
        this.processFileAt(realIndex);
      });
    });
  }

  /**
   * processFileAt - processing a file, this function doesn't care on whether it came from the local stream or a file element
   * @param index index
   */
  processFileAt(index: number) {
    // create the form data
    const formData = new FormData();
    // the file can be the file itself as it was given or the blob as given by the steam
    // both different types
    const file: any =
      this.state.values[index].file || this.state.values[index].blob;
    // we add it to the file
    formData.append("file", file);
    // and do the thing
    $.ajax({
      url: this.props.status.contextPath + "/tempFileUploadServlet",
      type: "POST",
      data: formData,
      /**
       * success
       * @param data data
       */
      success: (data: any) => {
        // we change this
        const newValues = [...this.state.values];
        newValues[index] = { ...this.state.values[index] };
        newValues[index].uploading = false;
        newValues[index].id = data.fileId;
        // if the server does not return a content type we'll use whatever the blob recorded, this shouldn't be the case the server should return somethings
        newValues[index].contentType = data.fileContentType || file.type;
        // if user didn't provide a name we will give one, this happens when recording in place, such is the default behaviour
        newValues[index].name = newValues[index].name || data.fileId; //NO extension, we don't need it

        this.setState(
          {
            values: newValues,
          },
          this.checkDoneAndRunOnChange
        );
      },
      // in case of error
      /**
       * error
       * @param xhr xhr
       * @param err err
       */
      error: (xhr: any, err: Error) => {
        const newValues = [...this.state.values];
        newValues[index] = { ...this.state.values[index] };
        newValues[index].uploading = false;
        newValues[index].failed = true;
        this.setState(
          {
            values: newValues,
          },
          this.checkDoneAndRunOnChange
        );
      },
      /**
       * xhr
       */
      xhr: () => {
        const xhr = new (window as any).XMLHttpRequest();
        // Upload progress same as in the file field
        xhr.upload.addEventListener(
          "progress",
          (evt: any) => {
            if (evt.lengthComputable) {
              const percentComplete = evt.loaded / evt.total;
              const newValues = [...this.state.values];
              newValues[index] = { ...this.state.values[index] };
              newValues[index].progress = percentComplete;
              this.setState({
                values: newValues,
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

  /**
   * checkDoneAndRunOnChange
   */
  checkDoneAndRunOnChange() {
    if (!this.props.content) {
      return;
    }
    // if something is uploading, wait
    for (const value of this.state.values) {
      if (value.uploading) {
        return;
      }
    }
    if (!this.props.onChange) {
      return;
    }

    // get the result
    const result = JSON.stringify(
      this.state.values
        .filter((value) => !value.failed)
        .map((value) => {
          const { id, name, contentType } = value;
          return {
            id,
            name,
            contentType,
          };
        })
    );

    // and trigger onchange
    this.props.onChange(this, this.props.content.name, result);
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    if (this.props.invisible) {
      let emptyData = null;
      if (this.state.values.length) {
        // we need to map them
        emptyData = this.state.values.map((value, index) => (
          // if the value is not uploading, we set it as static
          <span
            className="material-page__audiofield-file-container"
            key={index}
          />
        ));
      }
      return (
        <>
          {/* TODO: lokalisointi*/}
          <ReadspeakerMessage text="Äänitystehtävä" />
          <span className="material-page__audiofield-wrapper rs_skip_always">
            <span className="material-page__audiofield">
              {!this.props.readOnly && !this.state.supportsMediaAPI() ? (
                <input type="file" />
              ) : null}
              {!this.props.readOnly && this.state.supportsMediaAPI() ? (
                <span className="material-page__audiofield-controls" />
              ) : null}
              {this.state.values.length > 0 ? (
                <span className="material-page__audiofield-files-container">
                  {emptyData}
                </span>
              ) : null}
            </span>
          </span>
        </>
      );
    }
    // rendering things here
    // this is the data that it has already created
    let dataInContainer = null;
    let recordingInContainer = null;

    // if we have values
    if (this.state.values.length) {
      // we need to map them
      dataInContainer = this.state.values.map((value, index) => {
        if (!value.uploading) {
          // if the value is not uploading, we set it as static
          return (
            <span
              className="material-page__audiofield-file-container"
              key={index}
            >
              <AudioPoolComponent
                className="material-page__audiofield-file"
                controls
                src={value.url}
                preload="metadata"
              />
              <Link
                className="material-page__audiofield-download-file-button icon-download"
                title={t("actions.download", { count: 1 })}
                href={value.url}
                openInNewTab={value.name}
              />

              {!this.props.readOnly ? (
                <ConfirmRemoveDialog
                  onConfirm={this.removeClipAt.bind(this, index)}
                >
                  <Link
                    className="material-page__audiofield-remove-file-button icon-trash"
                    title={t("actions.remove")}
                  />
                </ConfirmRemoveDialog>
              ) : null}
            </span>
          );
        } else if (value.failed) {
          // if the value failed we add a message, you can get the value name there so use it to say which file
          return (
            <span className="material-page__audiofield-file-container">
              <span className="material-page__audiofield-file material-page__audiofield-file--FAILED-TO-UPLOAD">
                {t("notifications.saveError", {
                  ns: "materials",
                  context: "audio",
                })}
              </span>
            </span>
          );
        } else {
          // if the value is uploading
          return (
            <span
              className="material-page__audiofield-file-container material-page__audiofield-file-container--uploading"
              key={index}
            >
              <span className="material-page__audiofield-file material-page__audiofield-file--uploading">
                <ProgressBarLine
                  containerClassName="material-page__audiofield-file-upload-progressbar"
                  options={{
                    strokeWidth: 1,
                    duration: 1000,
                    color: "#72d200",
                    trailColor: "#f5f5f5",
                    trailWidth: 1,
                    svgStyle: { width: "100%", height: "4px" },
                    text: {
                      className:
                        "material-page__audiofield-file-upload-percentage",
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
                  text={t("notifications.uploading", {
                    ns: "files",
                    progress: Math.round(value.progress * 100),
                  })}
                  progress={value.progress}
                />
              </span>
            </span>
          );
        }
      });
    }

    {
      this.state.recording
        ? (recordingInContainer = (
            <span className="material-page__audiofield-file-container material-page__audiofield-file-container--recording">
              <span className="material-page__audiofield-file material-page__audiofield-file--recording">
                <ProgressBarLine
                  containerClassName="material-page__audiofield-file-record-progressbar"
                  options={{
                    strokeWidth: 1,
                    duration: 1000,
                    color: "#de3211",
                    trailColor: "#f5f5f5",
                    trailWidth: 1,
                    svgStyle: { width: "100%", height: "4px" },
                    text: {
                      className:
                        "material-page__audiofield-file-record-percentage",
                      style: {
                        right: "100%",
                      },
                    },
                  }}
                  strokeWidth={1}
                  easing="easeInOut"
                  duration={1000}
                  color="#de3211"
                  trailColor="#f5f5f5"
                  trailWidth={1}
                  svgStyle={{ width: "100%", height: "4px" }}
                  text={t("notifications.recording", {
                    ns: "materials",
                    currentLength: moment("2015-01-01")
                      .startOf("day")
                      .seconds(this.state.time)
                      .format("mm:ss"),
                    maxLength: moment("2015-01-01")
                      .startOf("day")
                      .seconds(MAX_RECORDING_TIME_IN_SECONDS)
                      .format("mm:ss"),
                  })}
                  progress={this.state.time / MAX_RECORDING_TIME_IN_SECONDS}
                />
              </span>
            </span>
          ))
        : null;
    }

    // if elements is disabled
    const ElementDisabledState = this.props.readOnly
      ? "material-page__taskfield-disabled"
      : "";

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // and this is the container
    return (
      <>
        {/* TODO: lokalisointi*/}
        <ReadspeakerMessage text="Äänitystehtävä" />
        <span
          className={`material-page__audiofield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          <span className={`material-page__audiofield ${ElementDisabledState}`}>
            {!this.props.readOnly && !this.state.supportsMediaAPI() ? (
              <input
                type="file"
                accept="audio/*"
                onChange={this.onFileChanged}
                multiple
              />
            ) : null}
            {!this.props.readOnly && this.state.supportsMediaAPI() ? (
              <span className="material-page__audiofield-controls">
                {!this.state.recording ? (
                  <Link
                    className="material-page__audiofield-start-record-button icon-record"
                    onClick={this.start}
                  >
                    <span className="material-page__audiofield-start-record-label">
                      {t("actions.start", { ns: "materials" })}
                    </span>
                  </Link>
                ) : (
                  <Link
                    className="material-page__audiofield-stop-record-button icon-stop"
                    onClick={this.stop}
                  >
                    <span className="material-page__audiofield-stop-record-label">
                      {t("actions.start", { ns: "materials" })}
                    </span>
                  </Link>
                )}
                {!this.state.recording ? (
                  <span className="material-page__audiofield-description material-page__audiofield-description--start-recording">
                    {t("content.startRecording", { ns: "materials" })}
                  </span>
                ) : (
                  <span className="material-page__audiofield-description material-page__audiofield-description--stop-recording">
                    {t("content.stopRecording", { ns: "materials" })}
                  </span>
                )}
              </span>
            ) : null}
            {this.state.values.length > 0 || this.state.recording ? (
              <span className="material-page__audiofield-files-container">
                {dataInContainer}
                {recordingInContainer}
              </span>
            ) : null}
            {this.props.readOnly && this.state.values.length == 0 ? (
              <span className="material-page__audiofield-files-container material-page__audiofield-files-container--empty">
                {t("content.noRecordings", { ns: "materials" })}
              </span>
            ) : null}
          </span>
        </span>
      </>
    );
  }
}

export default withTranslation(["materials", "workspace", "files", "common"])(
  AudioField
);
