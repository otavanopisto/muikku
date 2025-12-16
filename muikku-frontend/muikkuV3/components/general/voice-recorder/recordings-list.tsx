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
  onDescriptionChange?: (index: number, description: string) => void;
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
  const { records, deleteAudio, noDeleteFunctions, onDescriptionChange } =
    props;

  return records.length > 0 ? (
    <div className="voice-recorder__files-container">
      {records.map((record, index) => (
        <Record
          controls
          record={record}
          index={index} // used as id if no id
          src={record.url}
          key={record.id || index}
          noDeleteFunctions={noDeleteFunctions}
          onClickDelete={deleteAudio}
          onDescriptionChange={onDescriptionChange}
        />
      ))}
    </div>
  ) : null;
}

export default RecordingsList;
