import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Store } from 'react-redux';
import {Action} from 'redux';
import * as queryString from 'query-string';
import {i18nType} from '~/reducers/base/i18n';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-sub-panel.scss';
import { RecordsType } from '~/reducers/main-function/records';
import { SummaryType } from '~/reducers/main-function/records/summary';
import { HOPSType } from '~/reducers/main-function/hops';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import MainChart from '~/components/general/graph/main-chart';
import '~/sass/elements/application-sub-panel.scss';
import { updateLabelFilters, updateWorkspaceFilters } from '~/actions/main-function/guider';


interface SummaryProps {
  i18n: i18nType,
  records: RecordsType,
  summary: SummaryType,
  hops: HOPSType,
}

interface SummaryState {
}

class Summary extends React.Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps){
    super(props);
  }

  render(){
      if (this.props.records.location !== "summary" || this.props.summary.status !== "READY" ) {
        return null;
      } else {

      let studentBasicInfo = <div className="application-sub-panel">
        <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.summary.studyInfo")}</div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-summary-dates">
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.records.studyStartDateLabel")}</div>
            <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-start-date">
              <span>{this.props.records.studyStartDate ?
                  this.props.i18n.time.format(this.props.records.studyStartDate) : this.props.i18n.text.get("plugin.records.summary.studyTime.empty")}</span>
            </div>
          </div>
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">{this.props.i18n.text.get(this.props.records.studyEndDate ? "plugin.records.studyEndDateLabel" :
            "plugin.records.studyTimeEndLabel")}</div>
            <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-end-date"><span>{this.props.records.studyEndDate || this.props.records.studyTimeEnd ?
                this.props.i18n.time.format(this.props.records.studyEndDate || this.props.records.studyTimeEnd) : this.props.i18n.text.get("plugin.records.summary.studyTime.empty")}</span></div>
          </div>
        </div>
      </div>

      let studyStatus = this.props.hops.value.goalMatriculationExam === "yes" ?
         <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-evaluated">
           <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-evaluated">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.title")}</div>
           <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.done.pre")}</div>
           <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-evaluated">{this.props.summary.summary.eligibilityStatus}</div>
           <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.done.post.matriculationEligibility")}</div>
         </div>:
          <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-evaluated">
            <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-evaluated">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.title")}</div>
            <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.done.pre")}</div>
            <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-evaluated">{this.props.summary.summary.coursesDone}</div>
            <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.workspaces.done.post.workspace")}</div>
          </div>;
      return (
        <div>
          <div className="application-panel__content-header">{this.props.i18n.text.get("plugin.records.summary.title")}</div>
          {studentBasicInfo}
          <div className="application-sub-panel">
          <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.summary.studyEvents")}</div>
            <div className="application-sub-panel__body application-sub-panel__body--studies-summary-cards">
              {studyStatus}
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-activity">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-activity">{this.props.i18n.text.get("plugin.records.summary.card.activity.title")}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.activity.stat.pre")}</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-activity">{this.props.summary.summary.activity}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.activity.stat.post")}</div>
              </div>
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-returned">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-returned">{this.props.i18n.text.get("plugin.records.summary.card.tasks.title")}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.tasks.stat.pre")}</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-returned">{this.props.summary.summary.returnedExercises}</div>
                <div className="application-sub-panel__card-body">{this.props.i18n.text.get("plugin.records.summary.card.tasks.stat.post")}</div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header application-sub-panel__header--guider-header">{this.props.i18n.text.get("plugin.guider.user.details.statistics")}</div>
              {this.props.summary.summary.graphData.activity && this.props.summary.summary.graphData.workspaces ? <MainChart workspaces={this.props.summary.summary.graphData.workspaces} activityLogs={this.props.summary.summary.graphData.activity}/> : null}
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
    summary: state.summary,
    hops: state.hops
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
