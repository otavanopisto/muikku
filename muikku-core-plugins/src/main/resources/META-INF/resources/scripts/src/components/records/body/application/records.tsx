import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/file-uploader.scss";
import { RecordsType } from "~/reducers/main-function/records";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import { AnyActionType } from "~/actions";
import RecordsGroup from "./records-group/records-group";

/**
 * RecordsProps
 */
interface RecordsProps {
  i18n: i18nType;
  records: RecordsType;
}

/**
 * RecordsState
 */
interface RecordsState {}

/**
 * StoredCurriculum
 */
export interface StoredCurriculum {
  [identifier: string]: string;
}

const storedCurriculumIndex: StoredCurriculum = {};

/**
 * Records
 */
class Records extends React.Component<RecordsProps, RecordsState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: RecordsProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (
      this.props.records.userDataStatus === "LOADING" ||
      this.props.records.userDataStatus === "WAIT"
    ) {
      return null;
    } else if (this.props.records.userDataStatus === "ERROR") {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    }

    if (
      !Object.keys(storedCurriculumIndex).length &&
      this.props.records.curriculums.length
    ) {
      this.props.records.curriculums.forEach((curriculum) => {
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }

    /**
     * studentRecords
     */
    const studentRecords = (
      <div className="application-sub-panel">
        {this.props.records.userData.map((data) => {
          const user = data.user;
          const records = data.records;
          return (
            <div className="react-required-container" key={data.user.id}>
              <div className="application-sub-panel__header">
                {user.studyProgrammeName}
              </div>
              <div className="application-sub-panel__body">
                {records.length ? (
                  records.map((rG, i) => (
                    <RecordsGroup
                      key={rG.groupCurriculumIdentifier}
                      index={i}
                      recordGroup={rG}
                      storedCurriculumIndex={storedCurriculumIndex}
                    />
                  ))
                ) : (
                  <div className="application-sub-panel__item application-sub-panel__item--empty">
                    {this.props.i18n.text.get("plugin.records.courses.empty")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.

    return (
      <BodyScrollKeeper
        hidden={
          this.props.records.location !== "records" ||
          !!this.props.records.current
        }
      >
        <h2 className="application-panel__content-header">
          {this.props.i18n.text.get("plugin.records.records.title")}
        </h2>

        {studentRecords}
        <div className="application-sub-panel">
          <div className="application-sub-panel__header">
            {this.props.i18n.text.get("plugin.records.files.title")}
          </div>
          <div className="application-sub-panel__body">
            {this.props.records.files.length ? (
              <ApplicationList>
                {this.props.records.files.map((file) => (
                  <ApplicationListItem
                    className="application-list__item application-list__item--studies-file-attacment"
                    key={file.id}
                  >
                    <span className="icon-attachment"></span>
                    <Link
                      className="link link--studies-file-attachment"
                      href={`/rest/records/files/${file.id}/content`}
                      openInNewTab={file.title}
                    >
                      {file.title}
                    </Link>
                  </ApplicationListItem>
                ))}
              </ApplicationList>
            ) : (
              <ApplicationListItem className="application-list__item application-list__item--studies-file-attacment">
                {this.props.i18n.text.get("plugin.records.files.empty")}
              </ApplicationListItem>
            )}
          </div>
        </div>
      </BodyScrollKeeper>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Records);
