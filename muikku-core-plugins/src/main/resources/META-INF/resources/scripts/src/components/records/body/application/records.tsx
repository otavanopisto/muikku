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
import { StatusType } from "~/reducers/base/status";
import ApplicationSubPanel, {
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";

/**
 * RecordsProps
 */
interface RecordsProps {
  i18n: i18nType;
  records: RecordsType;
  status: StatusType;
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
      <ApplicationSubPanel>
        {this.props.records.userData.map((data) => {
          const user = data.user;
          const records = data.records;
          return (
            <div className="react-required-container" key={data.user.id}>
              <ApplicationSubPanel.Header>
                {user.studyProgrammeName}
              </ApplicationSubPanel.Header>
              <ApplicationSubPanel.Body>
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
                  <div className="empty">
                    <span>
                      {this.props.i18n.text.get("plugin.records.courses.empty")}
                    </span>
                  </div>
                )}
              </ApplicationSubPanel.Body>
            </div>
          );
        })}
      </ApplicationSubPanel>
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
        <ApplicationSubPanel>
          <ApplicationSubPanel.Header>
            {this.props.i18n.text.get("plugin.records.files.title")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
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
              <div className="empty">
                <span>
                  {this.props.i18n.text.get("plugin.records.files.empty")}
                </span>
              </div>
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
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
    status: state.status,
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
