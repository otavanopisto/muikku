import * as React from "react";
import useRecordingsList from "./hooks/user-recordings-list";
import { RecordValue } from "../../../@types/recorder";
import Link from "~/components/general/link";

export interface RecordingsListProps {
  records: RecordValue[] | null;
}

export default function RecordingsList(props: RecordingsListProps) {
  const { records } = props;

  const { recordings, deleteAudio } = useRecordingsList(records);

  return (
    <div className="voice__recorder-recordings__container">
      {records.length > 0 ? (
        <>
          <h1>Your recordings</h1>
          <div className="voice__recorder-recordings__list">
            {recordings.map((record) => {
              return (
                <Record
                  controls
                  record={record}
                  src={record.url}
                  key={record.id}
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

interface RecordProps
  extends React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  > {
  record: RecordValue;
  onClickDelete?: (recordId: string) => void;
}

function Record(props: RecordProps) {
  const audioRef = React.useRef(null);
  const { record, onClickDelete, ...rest } = props;

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
      <div className="delete-button-container">
        <Link
          className="voice__recorder-audiofield-remove-file-button icon-trash"
          title="Poista"
          onClick={() => onClickDelete(record.id)}
        />
      </div>
    </div>
  );
}
