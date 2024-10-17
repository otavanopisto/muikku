import * as React from "react";
import { RecordValue } from "~/@types/recorder";
import Record from "./record";

/**
 * RecordingsListProps
 */
export interface RecordingsListProps {
  records: RecordValue[] | null;
  noDeleteFunctions?: boolean;
  deleteAudio?: (recordId: string) => void;
}

/**
 * defaultRecordListProps
 */
const defaultRecordListProps = {
  noDeleteFunctions: false,
};

/**
 * RecordingsList
 * @param props props
 * @returns JSX.Element
 */
function RecordingsList(props: RecordingsListProps) {
  props = { ...defaultRecordListProps, ...props };

  const { records, deleteAudio, noDeleteFunctions } = props;

  return records.length > 0 ? (
    <div className="voice-recorder__files-container">
      {records.map((record, index) => (
        <Record
          controls
          record={record}
          src={record.url}
          key={record.id || index}
          noDeleteFunctions={noDeleteFunctions}
          onClickDelete={deleteAudio}
        />
      ))}
    </div>
  ) : null;
}

export default RecordingsList;
