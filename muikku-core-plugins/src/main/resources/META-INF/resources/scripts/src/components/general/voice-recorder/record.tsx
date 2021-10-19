import * as React from "react";
import { RecordValue } from "~/@types/recorder";
import Link from "~/components/general/link";
import { StateType } from "~/reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";

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
 * @param props
 * @returns JSX.Element
 */
function Record(props: RecordProps) {
  props = { ...defaultRecordtProps, ...props };

  const { record, onClickDelete, noDeleteFunctions, ...rest } = props;

  const failed = record.failed;

  return (
    <>
      <div className="voice-recorder__file-container" key={rest.key}>
        <audio className="voice-recorder__file" {...rest} />
          <Link
            className="voice-recorder__download-button icon-download"
            title={props.i18n.text.get(
              "plugin.workspace.audioField.downloadLink"
            )}
            href={record.url}
            openInNewTab={record.name}
          />
        {!noDeleteFunctions ? (
          <Link
            className="voice-recorder__remove-button icon-trash"
            title={props.i18n.text.get(
              "plugin.workspace.audioField.removeLink"
            )}
            onClick={() => onClickDelete && onClickDelete(record.id)}
          />
        ) : null}
      </div>
      {failed ? <div>Virhe tallennettaessa äänipalautetta</div> : null}
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
