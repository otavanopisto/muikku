import * as React from "react";
import { RecordValue } from "../../../@types/recorder";
import Link from "~/components/general/link";

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
 * @param props
 * @returns JSX.Element
 */
export default function RecordingsList(props: RecordingsListProps) {
  props = { ...defaultRecordListProps, ...props };

  const { records, deleteAudio, noDeleteFunctions } = props;

  return (
    <div className="voice__recorder-recordings__container">
      {records.length > 0 ? (
        <>
          <h1>Your recordings</h1>
          <div className="voice__recorder-recordings__list">
            {records.map((record) => {
              return (
                <Record
                  controls
                  record={record}
                  src={record.url}
                  key={record.id}
                  noDeleteFunctions={noDeleteFunctions}
                  onClickDelete={deleteAudio}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="voice__recorder-recordings__list voice__recorder-recordings__list--empty">
          <span>You don't have records</span>
        </div>
      )}
    </div>
  );
}

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
 * @param props
 * @returns JSX.Element
 */
function Record(props: RecordProps) {
  props = { ...defaultRecordtProps, ...props };
  const audioRef = React.useRef(null);
  const { record, onClickDelete, noDeleteFunctions, ...rest } = props;

  return (
    <div className="voice__recorder-recordings__list-item" key={rest.key}>
      <audio ref={audioRef} {...rest} />
      <div className="delete-button-container">
        <Link
          className="voice__recorder-audiofield-download-file-button icon-download"
          title="lataa"
          href={record.url}
          openInNewTab={record.name}
        />
      </div>
      {!noDeleteFunctions ? (
        <div className="delete-button-container">
          <Link
            className="voice__recorder-audiofield-remove-file-button icon-trash"
            title="Poista"
            onClick={() => onClickDelete && onClickDelete(record.id)}
          />
        </div>
      ) : null}
    </div>
  );
}
