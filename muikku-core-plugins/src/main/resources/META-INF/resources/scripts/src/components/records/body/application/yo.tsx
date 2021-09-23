import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { i18nType } from '~/reducers/base/i18n';
import { RecordsType } from '~/reducers/main-function/records';
import Button from '~/components/general/button';
import { StateType } from '~/reducers';
import { HOPSType } from "~/reducers/main-function/hops";
import { YOType, YOEligibilityType, YOEligibilityStatusType, SubjectEligibilitySubjectsType } from '~/reducers/main-function/records/yo';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/buttons.scss';
import MatriculationEligibilityRow from './matriculation-eligibility-row/matriculation-eligibility-row';

interface YOProps {
  i18n: i18nType,
  records: RecordsType,
  hops: HOPSType,
  yo: YOType,
  eligibilitySubjects: SubjectEligibilitySubjectsType
}

interface YOState {
  eligibility?: YOEligibilityType,
  eligibilityStatus?: YOEligibilityStatusType,
  err?: String
}

class YO extends React.Component<YOProps, YOState> {
  constructor(props: YOProps) {
    super(props);
  }

  render() {

    let i18n = this.props.i18n;

    if (this.props.records.location !== "yo" || this.props.yo.status != "READY" || this.props.hops.eligibility.upperSecondarySchoolCurriculum == false) {
      return null;
    } else {
      const selectedMatriculationSubjects = this.props.eligibilitySubjects.status == "READY" ? this.props.eligibilitySubjects.subjects.length > 0 ? this.props.eligibilitySubjects.subjects.map((subject, index) => {
        return (
          <MatriculationEligibilityRow key={subject.subjectCode + index} subject={subject} />
        );
      }) : <div>{this.props.i18n.text.get("plugin.records.yo.noMatriculationSubjectsSelected")}</div> : <div>{this.props.i18n.text.get("plugin.records.yo.participationRights.loading")}</div>;

      //  < div className="empty">{i18n.text.get("plugin.records.matriculation.hopsUnfinished")}</div>

      const enrollmentLink = this.props.yo.enrollment != null ?
        (this.props.yo.enrollment).filter((exam) => exam.eligible == true).map((exam) => {
          return (
            exam.enrolled ?
              <div key={exam.id}>
                <div className="application-sub-panel__notification-content">
                  <span className="application-sub-panel__notification-content-title">{this.props.i18n.text.get("plugin.records.yo.button.signUp.hasAssigned")}</span>
                </div>
                <div className="application-sub-panel__notification-content">
                  <span className="application-sub-panel__notification-content-label">{i18n.text.get("plugin.records.matriculation.enrollmentDate")}</span>
                  <span className="application-sub-panel__notification-content-data">{new Date(exam.enrollmentDate).toLocaleDateString("fi-Fi")}</span>
                </div>
              </div>
              :
              <div key={exam.id}>
                <Button key={exam.id} href={"/matriculation-enrollment/" + exam.id} title={this.props.i18n.text.get("plugin.records.yo.button.signUp.active.title", new Date(exam.ends).toLocaleDateString("fi-Fi"))}
                  className="button button--yo-signup">{this.props.i18n.text.get("plugin.records.yo.button.signUp.active", new Date(exam.ends).toLocaleDateString("fi-Fi"))}</Button>
              </div>
          );
        }) : null;

      return (
        // TODO these are a bunch of wannabe components here. Need to be done to application-panel and sub-panel components.
        // Github issue: #4840
        <div>
          <h2 className="application-panel__content-header">{this.props.i18n.text.get("plugin.records.yo.title")}</h2>
          <div className="application-sub-panel application-sub-panel--yo-status-container">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.abiStatus.title")}</div>
            {this.props.yo.eligibility != null ? this.props.yo.eligibilityStatus == "ELIGIBLE" ?
              <div className="application-sub-panel__body application-sub-panel__body--yo-status-complete">
                <div className="application-sub-panel__notification-item">
                  <div className="application-sub-panel__notification-body">{this.props.i18n.text.get("plugin.records.yo.abiStatus.content.finished")}</div>
                  {this.props.yo.enrollment.length > 0 &&
                    <div className="application-sub-panel__notification-footer">{enrollmentLink}</div>
                  }
                </div>
              </div> :
              this.props.yo.eligibilityStatus == "NOT_ELIGIBLE" ?
                <div className="application-sub-panel__body application-sub-panel__body--yo-status-incomplete">
                  <div className="application-sub-panel__notification-item">
                    <div className="application-sub-panel__notification-body application-sub-panel__notification-body--yo-status-incomplete"
                      dangerouslySetInnerHTML={{ __html: i18n.text.get("plugin.records.matriculation.notEligible", this.props.yo.eligibility.coursesCompleted, this.props.yo.eligibility.coursesRequired) }} />
                    {this.props.yo.enrollment.length > 0 &&
                      <div className="application-sub-panel__notification-footer">{enrollmentLink}</div>
                    }
                  </div>
                </div> :
                null
              : null}
          </div>
          <div className="application-sub-panel  application-sub-panel--yo-status-container">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.participationRights.title")}</div>
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
    hops: state.hops,
    yo: state.yo,
    eligibilitySubjects: state.eligibilitySubjects
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YO);
