import * as React from "react";
import { RecordValue } from "../../../@types/recorder";
import { StateType } from "../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "../../../actions/index";
import { bindActionCreators } from "redux";
import Record from "./record";
import { i18nType } from "../../../reducers/base/i18n";

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
 * @param props
 * @returns JSX.Element
 */
function RecordingsList(props: RecordingsListProps) {
  props = { ...defaultRecordListProps, ...props };

  const { records, deleteAudio, noDeleteFunctions } = props;

  return (
    <div className="voice__recorder-recordings__container">
      {records.length > 0 ? (
        <div className="voice__recorder-recordings__list">
          {records.map((record, index) => {
            return (
              <Record
                controls
                listIndex={index}
                record={record}
                src={record.url}
                key={record.id}
                noDeleteFunctions={noDeleteFunctions}
                onClickDelete={deleteAudio}
              />
            );
          })}
        </div>
      ) : (
        <div className="voice__recorder-recordings__list voice__recorder-recordings__list--empty">
          <span>
            {props.i18n.text.get("plugin.workspace.audioField.noFiles")}
          </span>
        </div>
      )}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecordingsList);
