import * as React from "react";
import { RecordValue } from "~/@types/recorder";
import Link from "~/components/general/link";
import { StateType } from "~/reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import AnimateHeight from "react-animate-height";
import DeleteDialog from "./dialogs/delete-warning";
import { AudioPoolComponent } from "../audio-pool-component";

let ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * RecordProps
 */
interface RecordProps
  extends React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  > {
  i18n: i18nType;
  record: RecordValue;
  noDeleteFunctions: boolean;
  onClickDelete?: (recordId: string) => void;
}

/**
 * defaultRecordtProps
 */
const defaultRecordtProps = {
  noDeleteFunctions: false,
};

/**
 * Record
 * Shows invidual records and their functions like download/delete buttons
 * and if uploading to tempfile servlet, the proggressbar and error if so
 * @param props props
 * @returns JSX.Element
 */
function Record(props: RecordProps) {
  props = { ...defaultRecordtProps, ...props };

  const { record, onClickDelete, noDeleteFunctions, ...rest } = props;

  const open = record.uploading || record.failed;

  /**
   * handleClickDelete
   */
  const handleClickDelete = () => {
    onClickDelete && onClickDelete(record.id);
  };

  return (
    <>
      <div className="voice-recorder__file-container" key={rest.key}>
        <AudioPoolComponent
          className="voice-recorder__file"
          controls={rest.controls}
          src={record.url}
          preload="metadata"
        />

        <Link
          className="voice-recorder__download-button icon-download"
          title={props.i18n.text.get(
            "plugin.workspace.audioField.downloadLink"
          )}
          href={record.url}
          openInNewTab={record.name}
        />
        {!noDeleteFunctions ? (
          <DeleteDialog onDeleteAudio={handleClickDelete}>
            <Link
              className="voice-recorder__remove-button icon-trash"
              title={props.i18n.text.get(
                "plugin.workspace.audioField.removeLink"
              )}
            />
          </DeleteDialog>
        ) : null}
      </div>
      <AnimateHeight height={open ? "auto" : 0}>
        {record.uploading ? (
          <div style={{ margin: "0 10px" }}>
            <ProgressBarLine
              containerClassName="voice-recorder__file-record-progressbar"
              options={{
                strokeWidth: 1,
                duration: 1000,
                color: "#de3211",
                trailColor: "#f5f5f5",
                trailWidth: 1,
                svgStyle: { width: "100%", height: "4px" },
                text: {
                  className: "voice-recorder__file-record-percentage",
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
              text={`${Math.round(record.progress * 100)}%`}
              progress={record.progress}
            />
          </div>
        ) : null}
        {record.failed ? (
          <div className="voice-recorder__file-record-error">
            {props.i18n.text.get("plugin.workspace.audioField.uploadFailed")}
          </div>
        ) : null}
      </AnimateHeight>
    </>
  );
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Record);
