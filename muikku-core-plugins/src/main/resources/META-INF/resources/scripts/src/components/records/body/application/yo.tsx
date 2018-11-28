import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';
import {i18nType} from '~/reducers/base/i18n';
import { RecordsType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import { HOPSType } from "~/reducers/main-function/hops";
import mApi from '~/lib/mApi';
import MatriculationSubjectType from './matriculation-subjects/matriculation-subject-type';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/buttons.scss';



interface YOProps {
  i18n: i18nType,
  records: RecordsType,
  hops: HOPSType
}

interface YOState {
  matriculationSubjects: MatriculationSubjectType[],
  matriculationSubjectsLoaded: boolean
}

class YO extends React.Component<YOProps,YOState> {
  constructor(props:YOProps){
    super(props);

    this.state = {
      matriculationSubjects: [],
      matriculationSubjectsLoaded: false
    }
  }
  
  /**
   * Finds a matriculation subject name by subject value
   * 
   * @param matriculationSubjectValue value
   * @returns subject name or empty string if not found 
   */
  getMatriculationSubjectNameByValue = (matriculationSubjectValue: string): string => {
    const subject = this.state.matriculationSubjects.find((matriculationSubject: MatriculationSubjectType) => {
      return matriculationSubject.value === matriculationSubjectValue;
    });

    return subject ? subject.name : "";
  }

  /**
   * Component did mount life-cycle method  
   * 
   * Reads available matriculation subjects from REST API
   */
  componentDidMount() {
    mApi().records.matriculationSubjects.read()
      .callback((err: Error, matriculationSubjects: MatriculationSubjectType[])=>{
        if (!err) {
          this.setState({
            matriculationSubjects: matriculationSubjects,
            matriculationSubjectsLoaded: true
          });
        }
      });
  }
  
  render(){        
    
    if (this.props.records.location !== "yo") {
      return null;        
    } else {
      const loaded = this.state.matriculationSubjectsLoaded && this.props.hops.status === "READY" && !!this.props.hops.value;
      const selectedMatriculationSubjects = loaded ? (this.props.hops.value.studentMatriculationSubjects || []).map((subject: string, index: number) => {
        return (
          <div key={index}>{this.getMatriculationSubjectNameByValue(subject)}</div>
        );
      }) : ( <div>{this.props.i18n.text.get("plugin.records.yo.participationRights.loading")}</div> );
      
      return (
        <div>
          <div className="application-panel__header-title">{this.props.i18n.text.get("plugin.records.yo.title")}</div>          
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.abiStatus.title")}</div>
            <div className="application-sub-panel__body application-sub-panel__body--yo-status-incomplete">
              <div className="application-sub-panel__notification-item">
                <div className="application-sub-panel__notification-body application-sub-panel__notification-body--yo-status-incomplete">{this.props.i18n.text.get("plugin.records.yo.abiStatus.content.unfinished")}</div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.abiStatus.title")}</div>
            <div className="application-sub-panel__body application-sub-panel__body--yo-status-complete">
              <div className="application-sub-panel__notification-item">
                <div className="application-sub-panel__notification-body">{this.props.i18n.text.get("plugin.records.yo.abiStatus.content.finished")}</div>
                <div className="application-sub-panel__notification-footer">
                  <Link className="button button--yo-signup">{this.props.i18n.text.get("plugin.records.yo.button.signUp")}</Link>
                </div>
              </div>
            </div>
          </div>
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
        )
      }
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: state.records,
    hops: state.hops
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YO);
