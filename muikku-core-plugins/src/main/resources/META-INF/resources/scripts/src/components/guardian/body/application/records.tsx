import * as React from "react";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/file-uploader.scss";
import { RecordsType } from "~/reducers/main-function/records";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
// import Link from "~/components/general/link";
import { StateType } from "~/reducers";
// import ApplicationList, {
//   ApplicationListItem,
// } from "~/components/general/application-list";
import { AnyActionType } from "~/actions";
import RecordsGroup from "./records-group/records-group";
import { StatusType } from "~/reducers/base/status";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * RecordsProps
 */
interface RecordsProps extends WithTranslation {
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
    const { t } = this.props;

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
        {this.props.records.userData.map((lineCategoryData, i) => (
          <ApplicationSubPanel.Body key={lineCategoryData.lineCategory}>
            {lineCategoryData.credits.length +
              lineCategoryData.transferCredits.length >
            0 ? (
              <RecordsGroup
                key={`credit-category-${i}`}
                recordGroup={lineCategoryData}
              />
            ) : (
              <div className="application-sub-panel__item">
                <div className="empty">
                  <span>
                    {t("content.empty", {
                      ns: "studies",
                      context: "workspaces",
                    })}
                  </span>
                </div>
              </div>
            )}
          </ApplicationSubPanel.Body>
        ))}
      </ApplicationSubPanel>
    );

    return (
      <BodyScrollKeeper
        hidden={
          this.props.records.location !== "records" ||
          !!this.props.records.current
        }
      >
        <h2 className="application-panel__content-header">
          {t("labels.records", { ns: "studies" })}
        </h2>
        {studentRecords}
        {/* 
        
        Disabled from a guardian
        
        <ApplicationSubPanel>
          <ApplicationSubPanel.Header>
            {t("labels.files")}
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
              <ApplicationListItem className="application-list__item application-list__item--studies-file-attacment">
                <div className="empty">
                  <span>
                    {t("content.empty", { ns: "files", context: "files" })}
                  </span>
                </div>
              </ApplicationListItem>
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel> */}
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
export default withTranslation(["studies"])(
  connect(mapStateToProps, mapDispatchToProps)(Records)
);
