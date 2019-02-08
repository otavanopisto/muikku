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
interface SummaryProps {
  i18n: i18nType,
  records: RecordsType
}

interface SummaryState {
}

class Summary extends React.Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps){
    super(props);
  }    
  render(){        
      if (this.props.records.location !== "summary") {
        return null;        
      } else {
        
        let studentBasicInfo = <div className="application-sub-panel">
          <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.summary.studyInfo")}</div>
          <div className="application-sub-panel__body application-sub-panel__body--studies-summary-dates">
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.records.studyStartDateLabel")}</div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-start-date">
                <span>{this.props.records.studyStartDate ? 
                    this.props.i18n.time.format(this.props.records.studyStartDate) : "-"}</span>          
              </div>
            </div>
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title">{this.props.i18n.text.get(this.props.records.studyEndDate ? "plugin.records.studyEndDateLabel" :
              "plugin.records.studyTimeEndLabel")}</div>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-end-date"><span>{this.props.records.studyEndDate || this.props.records.studyTimeEnd ? 
                  this.props.i18n.time.format(this.props.records.studyEndDate || this.props.records.studyTimeEnd) : "-"}</span></div>
            </div>
          </div>
        </div>          
      return (
        <div>
          <div className="application-panel__content-header">{this.props.i18n.text.get("plugin.records.summary.title")}</div>          
          
          {studentBasicInfo}

          <div className="application-sub-panel">
            <div className="application-sub-panel__body application-sub-panel__body--studies-summary-cards">
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-evaluated">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-evaluated">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.title")}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.stat.pre")}</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-evaluated">6</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.stat.post")}</div>
              </div>                
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-activity">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-activity">{this.props.i18n.text.get("plugin.records.summary.card.activity.title")}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.activity.stat.pre")}</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-activity">6</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.activity.stat.post")}</div>
              </div>                
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-returned">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-returned">{this.props.i18n.text.get("plugin.records.summary.card.tasks.title")}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.tasks.stat.pre")}</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-returned">6</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.tasks.stat.post")}</div>
              </div>
            </div>
          </div>
      {/* Waits for summary notifications
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.summary.notifications.title")}</div>
            <div className="application-sub-panel__body application-list">
              <div className="application-list__item application-list__item--notification">
                <div className="application-list__item-header">
                  <span className="application-list__header-icon application-list__header-icon--notification-1 icon-bell"></span>                        
                  <span className="application-list__header-primary">
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis non tortor vitae dictum. Maecenas pharetra felis ut lectus pharetra pellentesque.</span>
                  </span>
                </div>
                <div className="application-list__item-footer">
                  <span>dd/mm/yyyy </span>
               </div>
              </div>
              <div className="application-list__item application-list__item--notification">
                <div className="application-list__item-header">
                   <span className="application-list__header-icon application-list__header-icon--notification-2 icon-bell"></span>                        
                   <span className="application-list__header-primary">
                     <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis non tortor vitae dictum. Maecenas pharetra felis ut lectus pharetra pellentesque.</span>
                   </span>
                 </div>
                 <div className="application-list__item-footer">
                   <span>dd/mm/yyyy </span>
                </div>
              </div>
              <div className="application-list__item application-list__item--notification">
                  <div className="application-list__item-header">
                    <span className="application-list__header-icon application-list__header-icon--notification-3 icon-bell"></span>                        
                    <span className="application-list__header-primary">
                      <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                    </span>
                  </div>
                  <div className="application-list__item-footer">
                    <span>dd/mm/yyyy </span>
                 </div>
               </div>
            </div>
          </div>
       */}
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
)(Summary);
