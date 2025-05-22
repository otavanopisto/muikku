import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/file-uploader.scss";
import { RecordsType } from "~/reducers/main-function/records";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import { StateType } from "~/reducers";
import RecordsGroup from "./records-group/records-group";
import { StatusType } from "~/reducers/base/status";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

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
   * @returns React.JSX.Element
   */
  render() {
    const { t } = this.props;

    if (
      this.props.records.userDataStatus === "LOADING" ||
      this.props.records.userDataStatus === "WAIT"
    ) {
      return null;
    } else if (this.props.records.userDataStatus === "ERROR") {
      return (
        <div className="empty">
          <span>
            {t("content.empty", {
              ns: "studies",
              context: "records",
            })}
          </span>
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
                      context: "workspaces-guardian",
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}
export default withTranslation(["studies"])(
  connect(mapStateToProps, mapDispatchToProps)(Records)
);
