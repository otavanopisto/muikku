import * as React from "react";
import { RecordValue } from "~/@types/recorder";
import Link from "~/components/general/link";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { Action, bindActionCreators, Dispatch } from "redux";
import AnimateHeight from "react-animate-height";
import DeleteDialog from "./dialogs/delete-warning";
import { AudioPoolComponent } from "../audio-pool-component";
import { useTranslation } from "react-i18next";
import ProgressBar from "@ramonak/react-progress-bar";

/**
 * RecordProps
 */
interface RecordProps
  extends React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  > {
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
  const { t } = useTranslation();

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
          title={t("actions.download")}
          href={record.url}
          openInNewTab={record.name}
        />
        {!noDeleteFunctions ? (
          <DeleteDialog onDeleteAudio={handleClickDelete}>
            <Link
              className="voice-recorder__remove-button icon-trash"
              title={t("actions.remove")}
            />
          </DeleteDialog>
        ) : null}
      </div>
      <AnimateHeight height={open ? "auto" : 0}>
        {record.uploading ? (
          <div style={{ margin: "0 10px" }}>
            <ProgressBar
              className="voice-recorder__file-record-progressbar"
              completed={record.progress * 100}
              maxCompleted={100}
              customLabel={`${Math.round(record.progress * 100)}%`}
              bgColor="#de3211"
              baseBgColor="#f5f5f5"
              height="5px"
            />
          </div>
        ) : null}
        {record.failed ? (
          <div className="voice-recorder__file-record-error">
            {t("notifications.saveError", { ns: "materials" })}
          </div>
        ) : null}
      </AnimateHeight>
    </>
  );
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(Record);
