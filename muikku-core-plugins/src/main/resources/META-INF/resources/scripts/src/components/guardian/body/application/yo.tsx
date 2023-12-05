import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { RecordsType } from "~/reducers/main-function/records";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { HOPSState } from "~/reducers/main-function/hops";
import {
  MatriculationState,
  MatriculationSubjectEligibilityState,
} from "~/reducers/main-function/records/yo";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/course.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/buttons.scss";
import MatriculationEligibilityRow from "./matriculation-eligibility-row/matriculation-eligibility-row";
import { updateYO } from "~/actions/main-function/records/yo";
import { updateYOTriggerType } from "../../../../actions/main-function/records/yo";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import {
  MatriculationEligibility,
  MatriculationEligibilityStatus,
} from "~/generated/client";

/**
 * YOProps
 */
interface YOProps extends WithTranslation {
  records: RecordsType;
  hops: HOPSState;
  yo: MatriculationState;
  updateYO: updateYOTriggerType;
  eligibilitySubjects: MatriculationSubjectEligibilityState;
}

/**
 * YOState
 */
interface YOState {
  eligibility?: MatriculationEligibility;
  eligibilityStatus?: MatriculationEligibilityStatus;
  err?: string;
  succesfulEnrollments: number[];
}

/**
 * YO
 */
class YO extends React.Component<YOProps, YOState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: YOProps) {
    super(props);

    this.state = {
      succesfulEnrollments: [],
    };
  }

  /**
   * updateEnrollemnts HACK SOLUTION...
   * @param examId examId
   */
  updateEnrollemnts = (examId: number) => {
    const updatedSuccesfullEnrollments = [...this.state.succesfulEnrollments];

    updatedSuccesfullEnrollments.push(examId);

    this.setState({ succesfulEnrollments: updatedSuccesfullEnrollments });
  };

  /**
   * Render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (
      this.props.records.location !== "yo" ||
      this.props.yo.status != "READY" ||
      this.props.hops.eligibility.upperSecondarySchoolCurriculum == false
    ) {
      return null;
    } else {
      const selectedMatriculationSubjects =
        this.props.eligibilitySubjects.status == "READY" ? (
          this.props.eligibilitySubjects.subjects.length > 0 ? (
            this.props.eligibilitySubjects.subjects.map((subject, index) => (
              <MatriculationEligibilityRow
                key={subject.subjectCode + index}
                subject={subject}
              />
            ))
          ) : (
            <div>{t("content.noneSelectedSubjects", { ns: "studies" })}</div>
          )
        ) : (
          <div>{t("labels.loading")}</div>
        );

      const enrollmentLink =
        this.props.yo.enrollment != null
          ? this.props.yo.enrollment
              .filter((exam) => exam.eligible == true)
              .map((exam) =>
                this.state.succesfulEnrollments.includes(exam.id) ||
                exam.enrolled ? (
                  <div key={exam.id}>
                    <div className="application-sub-panel__notification-content">
                      <span className="application-sub-panel__notification-content-title">
                        {t("actions.alreadySignedUp", { ns: "studies" })}
                      </span>
                    </div>
                    <div className="application-sub-panel__notification-content">
                      {!this.state.succesfulEnrollments.includes(exam.id) ? (
                        <>
                          <span className="application-sub-panel__notification-content-label">
                            {t("labels.enrollmentDate", { ns: "studies" })}
                          </span>

                          <span className="application-sub-panel__notification-content-data">
                            {new Date(exam.enrollmentDate).toLocaleDateString(
                              "fi-Fi"
                            )}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null
              )
          : null;

      return (
        // TODO these are a bunch of wannabe components here. Need to be done to application-panel and sub-panel components.
        // Github issue: #4840
        <div>
          <h2 className="application-panel__content-header">
            {t("labels.matriculationExams", { ns: "studies" })}
          </h2>
          <div className="application-sub-panel application-sub-panel--yo-status-container">
            <div className="application-sub-panel__header">
              {t("labels.abiStatus", { ns: "studies" })}
            </div>
            {this.props.yo.eligibility != null ? (
              this.props.yo.eligibilityStatus == "ELIGIBLE" ? (
                <div className="application-sub-panel__body application-sub-panel__body--yo-status-complete">
                  <div className="application-sub-panel__notification-item">
                    <div className="application-sub-panel__notification-body">
                      {t("content.abiStatus", { ns: "studies" })}
                    </div>
                    {this.props.yo.enrollment.length > 0 && (
                      <div className="application-sub-panel__notification-footer">
                        {enrollmentLink}
                      </div>
                    )}
                  </div>
                </div>
              ) : this.props.yo.eligibilityStatus == "NOT_ELIGIBLE" ? (
                <div className="application-sub-panel__body application-sub-panel__body--yo-status-incomplete">
                  <div className="application-sub-panel__notification-item">
                    <div
                      className="application-sub-panel__notification-body application-sub-panel__notification-body--yo-status-incomplete"
                      dangerouslySetInnerHTML={{
                        __html: t("content.noAbiStatus", {
                          ns: "studies",
                          coursesCompleted:
                            this.props.yo.eligibility.coursesCompleted,
                          coursesRequired:
                            this.props.yo.eligibility.coursesRequired,
                          creditPoints: this.props.yo.eligibility.creditPoints,
                          creditPointsRequired:
                            this.props.yo.eligibility.creditPointsRequired,
                        }),
                      }}
                    />
                    {this.props.yo.enrollment &&
                      this.props.yo.enrollment.length > 0 && (
                        <div className="application-sub-panel__notification-footer">
                          {enrollmentLink}
                        </div>
                      )}
                  </div>
                </div>
              ) : null
            ) : null}
          </div>
          <div className="application-sub-panel  application-sub-panel--yo-status-container">
            <div className="application-sub-panel__header">
              {t("content.participationRights", { ns: "studies" })}
            </div>
            <div className="application-sub-panel__body application-sub-panel__body--studies-yo-subjects">
              <div className="application-sub-panel__notification-item">
                <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
                  {selectedMatriculationSubjects}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    records: state.records,
    hops: state.hops,
    yo: state.yo,
    eligibilitySubjects: state.eligibilitySubjects,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateYO }, dispatch);
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(YO)
);
