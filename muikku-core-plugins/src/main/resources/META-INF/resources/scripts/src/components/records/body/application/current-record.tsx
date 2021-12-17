import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import '~/sass/elements/link.scss';
import '~/sass/elements/application-list.scss';
import { RecordsType } from '~/reducers/main-function/records';
import Material from './current-record/material';
import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/assignment.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/journal.scss';
import '~/sass/elements/workspace-assessment.scss';

import ApplicationList, { ApplicationListItem, ApplicationListItemBody, ApplicationListItemHeader } from '~/components/general/application-list';
import { StatusType } from '~/reducers/base/status';

interface CurrentRecordProps {
  i18n: i18nType,
  records: RecordsType,
  status: StatusType
}

interface CurrentRecordState {
}

class CurrentRecord extends React.Component<CurrentRecordProps, CurrentRecordState> {
  constructor(props: CurrentRecordProps) {
    super(props);
  }

  render() {
    if (this.props.records.location !== "records" || !this.props.records.current) {
      return null;
    } else if (this.props.records.currentStatus === "LOADING") {
      return null;
    }

    let evalStateClassName = "";
    let evalStateIcon = "";
    let assessmentIsPending = null;
    let assessmentIsIncomplete = null;
    let assessmentIsUnassessed = null;
    if (this.props.records.current.workspace.studentAssessmentState) {
      switch (this.props.records.current.workspace.studentAssessmentState.state) {
        case "pass":
          evalStateClassName = "workspace-assessment--passed";
          evalStateIcon = "icon-thumb-up";
          break;
        case "pending":
        case "pending_pass":
        case "pending_fail":
          evalStateClassName = "workspace-assessment--pending";
          evalStateIcon = "icon-assessment-pending";
          assessmentIsPending = true;
          break;
        case "fail":
          evalStateClassName = "workspace-assessment--failed";
          evalStateIcon = "icon-thumb-down";
          break;
        case "incomplete":
          evalStateClassName = "workspace-assessment--incomplete";
          evalStateIcon = "";
          assessmentIsIncomplete = true;
          break;
        case "unassessed":
          assessmentIsUnassessed = true;
      }
    }

    let literalAssessment = this.props.records.current.workspace.studentAssessmentState &&
      this.props.records.current.workspace.studentAssessmentState.text ? this.props.records.current.workspace.studentAssessmentState.text : null;

    return <section>
      <h3 className="application-panel__content-header" key={this.props.records.current.workspace.id}>
        {this.props.records.current.workspace.name} {this.props.records.current.workspace.nameExtension && "(" + this.props.records.current.workspace.nameExtension + ")"}
      </h3>
      <div className="application-sub-panel">
        {!assessmentIsUnassessed &&
          <div className="react-required-container">
            {this.props.records.current.workspace.studentAssessmentState && !assessmentIsPending ?
              <div className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}>
                <div className={`workspace-assessment__icon ${evalStateIcon}`}></div>
                <div className="workspace-assessment__date">
                  <span className="workspace-assessment__date-label">{this.props.i18n.text.get("plugin.records.workspace.assessment.date.label")}:</span>
                  <span className="workspace-assessment__date-data">{this.props.i18n.time.format(this.props.records.current.workspace.studentAssessmentState.date)}</span>
                </div>
                <div className="workspace-assessment__grade">
                  <span className="workspace-assessment__grade-label">{this.props.i18n.text.get("plugin.records.workspace.assessment.grade.label")}:</span>
                  <span className="workspace-assessment__grade-data">{assessmentIsIncomplete ? this.props.i18n.text.get("plugin.records.workspace.assessment.grade.incomplete.data") : this.props.records.current.workspace.studentAssessmentState.grade}</span>
                </div>
                <div className="workspace-assessment__literal">
                  <div className="workspace-assessment__literal-label">{this.props.i18n.text.get("plugin.records.workspace.assessment.literal.label")}:</div>
                  <div className="workspace-assessment__literal-data rich-text" dangerouslySetInnerHTML={{ __html: literalAssessment }}></div>
                </div>
              </div>
              :
              <div className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}>
                <div className={`workspace-assessment__icon ${evalStateIcon}`}></div>
                <div className="workspace-assessment__date">
                  <span className="workspace-assessment__date-label">{this.props.i18n.text.get("plugin.records.workspace.assessment.date.label")}:</span>
                  <span className="workspace-assessment__date-data">{this.props.i18n.time.format(this.props.records.current.workspace.studentAssessmentState.date)}</span>
                </div>
                <div className="workspace-assessment__literal">
                  <div className="workspace-assessment__literal-label">{this.props.i18n.text.get("plugin.records.workspace.assessment.request.label")}:</div>
                  <div className="workspace-assessment__literal-data rich-text" dangerouslySetInnerHTML={{ __html: literalAssessment }}></div>
                </div>
              </div>
            }
          </div>
        }

        <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.assignments.title")}</div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-detailed-info">
          <ApplicationList>
            {this.props.records.current.materials.map((material) => {
            
              let showHiddenAssignment = false

              if(material.assignment && material.assignment.hidden){
                const compositeReply = this.props.records.current && this.props.records.current.compositeReplies.find((cItem) => cItem.workspaceMaterialId === material.assignment.id);

                if(compositeReply && compositeReply.submitted !== null){
                  showHiddenAssignment = true
                }
              }
              
              if(material.assignment && material.assignment.hidden && !showHiddenAssignment){
                return null;
              }

              return <Material key={material.id} material={material} i18n={this.props.i18n}
                workspace={this.props.records.current.workspace}
                status={this.props.status} />
            })}
          </ApplicationList>
        </div>
      </div>
      {this.props.records.current.journals.length ? <div className="application-sub-panel">
        <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.studydiary.title")}</div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-journal-entries">
          <div className="application-list">
            <div className="application-list_item-wrapper">
              {this.props.records.current.journals.map((journal) => {
                return <ApplicationListItem className="journal journal--studies" key={journal.id}>
                  <ApplicationListItemHeader className="application-list__item-header--journal-entry">
                    <div className="application-list__item-header-main application-list__item-header-main--journal-entry">
                      <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-title">{journal.title}</span>
                    </div>
                    <div className="application-list__item-header-aside">
                      <span>{this.props.i18n.time.format(journal.created, "L LT")}</span>
                    </div>
                  </ApplicationListItemHeader>
                  <ApplicationListItemBody className="application-list__item-body">
                    <article className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text" dangerouslySetInnerHTML={{ __html: journal.content }}></article>
                  </ApplicationListItemBody>
                </ApplicationListItem>
              })}
            </div>
          </div>
        </div>
      </div>: null}

    </section>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentRecord);
