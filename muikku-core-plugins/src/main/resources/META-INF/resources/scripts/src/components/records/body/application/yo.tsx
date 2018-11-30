import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-sub-panel.scss';

import { RecordsType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import '~/sass/elements/application-sub-panel.scss';
import mApi from '~/lib/mApi';

import moment from '~/lib/moment';

interface YOProps {
  i18n: i18nType,
  records: RecordsType
}

type EligibilityStatus =  "NOT_ELIGIBLE" | "ELIGIBLE" | "ENROLLED";

interface Eligibility {
  status: EligibilityStatus,
  coursesCompleted: Number,
  coursesRequired: Number,
  enrollmentDate: String,
  examDate: String
}

interface YOState {
  eligibility?: Eligibility,
  err?: String
}

class YO extends React.Component<YOProps,YOState> {
  constructor(props:YOProps){
    super(props);

    this.state = { }
  }    

  componentDidMount() {
    mApi().records.studentMatriculationEligibility
      .read((window as any).MUIKKU_LOGGED_USER)
      .callback((err: any, eligibility: Eligibility) => {
        if (err) {
          this.setState({err});
        } else {
          this.setState({eligibility});
        }
      });
  }

  render(){        
      let i18n = this.props.i18n;
      if (this.props.records.location !== "yo") {
        return null;        
      } else {
      return (
        <div>
          <h2>OTSOTS</h2>          
          {this.state.err != null ?
            <p>{this.state.err}</p> : null}
          {this.state.eligibility != null ?
            this.state.eligibility.status == "ELIGIBLE" ?
              <div>
                <p>{i18n.text.get("plugin.records.matriculation.eligible")}</p>
                <a href="/jsf/matriculation/index.jsf ">{i18n.text.get("plugin.records.matriculation.enroll")}</a>
              </div> :
              this.state.eligibility.status == "NOT_ELIGIBLE" ?
              <div>
                <p>{i18n.text.get("plugin.records.matriculation.notEligible")}</p>
                <p>{i18n.text.get("plugin.records.matriculation.coursesCompleted")}<b>{this.state.eligibility.coursesCompleted}</b></p>
                <p>{i18n.text.get("plugin.records.matriculation.coursesRequired")}<b>{this.state.eligibility.coursesRequired}</b></p>
              </div> :
              <div>
                <p>{i18n.text.get("plugin.records.matriculation.enrollmentDate")}
                   <b>{moment(this.state.eligibility.enrollmentDate).format("D.M.YYYY")}</b></p>
                <p>{i18n.text.get("plugin.records.matriculation.examDate")}
                   <b>{moment(this.state.eligibility.examDate).format("D.M.YYYY")}</b></p>
              </div>
            : <p>{i18n.text.get("plugin.records.matriculation.loading")}</p>}
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body">
              <div className="application-sub-panel__item">
                <div className="application-sub-panel__item-title">Ots</div>
              </div>
            </div>
          </div>                
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-sub-panel__body--studies-yo-cards">
              <div className="application-sub-panel__item--summarizer">
                <div className="application-sub-panel__header">Laatikko OTS</div>               
                <div className="application-sub-panel__body">Luatikko sis</div>
              </div>
              <div className="application-sub-panel__item--summarizer">
                <div className="application-sub-panel__header">Laatikko OTS</div>
                <div className="application-sub-panel__body">Luatikko sis</div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-list">
            
              <div className="application-list-item">
                <div className="application-list-item__header">
                  <span className="application-list-item__header-icon icon-books"></span>
                  <span className="application-list-item__header-primary">MAKKARAA</span>
                </div>
              </div>
              <div className="application-list-item">
                <div className="application-list-item__header">
                  <span className="application-list-item__header-icon icon-books"></span>
                  <span className="application-list-item__header-primary">Gur- gurzi 123123</span>
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
    records: state.records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YO);
