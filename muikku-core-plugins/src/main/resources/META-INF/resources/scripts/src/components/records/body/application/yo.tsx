import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as queryString from 'query-string';
import { i18nType } from '~/reducers/base/i18n';
import { RecordsType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import { StateType } from '~/reducers';
import { HOPSType } from "~/reducers/main-function/hops";
import mApi from '~/lib/mApi';
import { YOType } from '~/reducers/main-function/records/yo';
import MatriculationSubjectType from './matriculation-subjects/matriculation-subject-type';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/application-sub-panel.scss';
import moment from '~/lib/moment';
import '~/sass/elements/buttons.scss';
import MatriculationEligibilityRow from './matriculation-eligibility-row/matriculation-eligibility-row';
import promisify from "~/util/promisify";

interface YOProps {
  i18n: i18nType,
  records: RecordsType,
  hops: HOPSType,
  yo: YOType
}

type EligibilityStatus = "NOT_ELIGIBLE" | "ELIGIBLE" | "ENROLLED";

interface Eligibility {
  status: EligibilityStatus,
  coursesCompleted: number,
  coursesRequired: number,
  enrollmentDate: String,
  examDate: String
}

interface YOState {
  eligibility?: Eligibility,
  err?: String
  matriculationSubjectsLoaded: boolean
}

class YO extends React.Component<YOProps, YOState> {
  constructor(props: YOProps) {
    super(props);
    this.state = {
      matriculationSubjectsLoaded: false
    }
  }

  async componentDidMount() {
    try {
      let eligibility: Eligibility = await promisify(
        mApi().records.studentMatriculationEligibility
        .read((window as any).MUIKKU_LOGGED_USER), 'callback')() as Eligibility;
      this.setState({eligibility});
    } catch (err) {
      this.setState({err});
    }
    
  }

  /**
   * Finds a subject code for matriculation subject
   * 
   * @param code matriculation subject code
   * @returns subject code or null if not found
   */
  getSubjectCodeForCode = (code: string) => {
     const result = this.props.yo.subjects.matriculationSubjects.find((matriculationSubject) => {
      return matriculationSubject.code === code;
    });

    return result ? result.subjectCode : null;
  }
  
  render() {      
    let i18n = this.props.i18n;
    
    let end = null;
    if (this.props.records.location !== "yo") {
      return null;
    } else {
      const loaded = this.state.matriculationSubjectsLoaded && this.props.hops.status === "READY" && !!this.props.hops.value;
      const selectedMatriculationSubjects = loaded ? (this.props.hops.value.studentMatriculationSubjects || []).map((code: string, index: number) => {
        return (
          <MatriculationEligibilityRow key={index} code={code} subjectCode={this.getSubjectCodeForCode(code)}/>
        );
      }) : (<div>{this.props.i18n.text.get("plugin.records.yo.participationRights.loading")}</div>);
      return (
        <div>
        <div className="application-panel__header-title">{this.props.i18n.text.get("plugin.records.yo.title")}</div>
        <div className="application-sub-panel">
          <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.abiStatus.title")}</div>
          {this.state.err != null ?
            <p>{this.state.err}</p> : null}
          {this.state.eligibility != null ? this.state.eligibility.status == "ELIGIBLE" ?
              <div>
                <div className="application-sub-panel__body application-sub-panel__body--yo-status-complete">
                  <div className="application-sub-panel__notification-item">
                    <div className="application-sub-panel__notification-body">{this.props.i18n.text.get("plugin.records.yo.abiStatus.content.finished")}</div>
                    <div className="application-sub-panel__notification-footer">
                      <Link href="/jsf/matriculation/index.jsf" className="button button--yo-signup">{this.props.i18n.text.get("plugin.records.yo.button.signUp")}</Link>
                    </div>
                  </div>
                </div>              
              </div> :                 
              this.state.eligibility.status == "NOT_ELIGIBLE" ?
                <div className="application-sub-panel__body application-sub-panel__body--yo-status-incomplete">
                  <div className="application-sub-panel__notification-item">
                    <div className="application-sub-panel__notification-body application-sub-panel__notification-body--yo-status-incomplete">
                      <span className="application-sub-panel__notification-content">
                        {i18n.text.get("plugin.records.matriculation.notEligible", this.state.eligibility.coursesCompleted, this.state.eligibility.coursesRequired)}
                      </span>
                    </div>
                  </div>
                </div>:
                <div className="application-sub-panel__body application-sub-panel__body--yo-status-complete">
                 <div className="application-sub-panel__notification-body">
                   <span className="application-sub-panel__notification-content">{i18n.text.get("plugin.records.matriculation.enrollmentDate")}</span>
                   <span className="application-sub-panel__notification-content">{moment(this.state.eligibility.enrollmentDate).format("D.M.YYYY")}</span>
                 </div>
                 <div className="application-sub-panel__notification-body">
                   <span className="application-sub-panel__notification-content">{i18n.text.get("plugin.records.matriculation.examDate")}</span>
                   <span className="application-sub-panel__notification-content">{moment(this.state.eligibility.examDate).format("D.M.YYYY")}</span>
                 </div>
               </div>  
            : null}
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body application-list">
              <div className="application-sub-panel">
                <div className="application-sub-panel__body application-sub-panel__body--studies-yo-cards">
                  <div className="application-sub-panel__item application-sub-panel__item--summarizer">
                    <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.participation.title")}</div>
                    <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">Luatikko sis</div>
                  </div>
                  <div className="application-sub-panel__item application-sub-panel__item--summarizer">
                    <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.participationRights.title")}</div>
                    <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">
                      {selectedMatriculationSubjects}
                    </div>
                  </div>
                </div>
              </div>
              <div className="application-sub-panel">
                <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.plannedWorkspaces.title")}</div>
                <div className="application-sub-panel__body application-list">
                  <div className="application-list__item course">
                    <div className="application-list__item-header application-list__item-header--course">
                      <span className="application-list__header-icon icon-books"></span>
                      <span className="application-list__header-primary">Gur- gurzi 4</span>
                      <span className="application-list__header-secondary">Toissijainen</span>
                    </div>
                  </div>
                  <div className="application-list__item course">
                    <div className="application-list__item-header  application-list__item-header--course">
                      <span className="application-list__header-icon icon-books"></span>
                      <span className="application-list__header-primary">Gur- gurzi 5</span>
                      <span className="application-list__header-secondary">Toissijainen</span>
                    </div>
                  </div>
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
    yo: state.yo
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YO);
