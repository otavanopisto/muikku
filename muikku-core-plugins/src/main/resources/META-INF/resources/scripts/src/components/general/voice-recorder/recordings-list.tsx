import * as React from "react";
import { RecordValue } from "~/@types/recorder";
import { StateType } from "~/reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { bindActionCreators } from "redux";
import Record from "./record";
import { i18nType } from "~/reducers/base/i18n";

/**
 * RecordingsListProps
 */
export interface RecordingsListProps {
  i18n: i18nType;
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
      {records.map((record, index) => {
        return (
          <Record
            controls
            record={record}
            src={record.url}
            key={record.id || index}
            noDeleteFunctions={noDeleteFunctions}
            onClickDelete={deleteAudio}
          />
        );
      })}
    </div>
  ) : null;
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordingsList);
