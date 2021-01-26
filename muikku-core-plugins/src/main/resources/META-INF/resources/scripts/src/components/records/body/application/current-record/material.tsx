import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNodeType, WorkspaceType } from "~/reducers/workspaces";

import MaterialLoader from "~/components/base/material-loader";
import { shortenGrade, getShortenGradeExtension } from "~/util/modifiers";
import { StatusType } from "~/reducers/base/status";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import { MaterialLoaderDate } from "~/components/base/material-loader/date";
import { ApplicationListItem, ApplicationListItemHeader, ApplicationListItemBody } from '~/components/general/application-list';

interface MaterialProps {
  material: MaterialContentNodeType,
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType,
}

interface MaterialState {
  opened: boolean
}

export default class Material extends React.Component<MaterialProps, MaterialState> {
  constructor(props: MaterialProps){
    super(props);

    this.toggleOpened = this.toggleOpened.bind(this);

    this.state = {
      opened: false
    }
  }
  componentWillReceiveProps(nextProps: MaterialProps){
    if (nextProps.material.assignment.id !== this.props.material.assignment.id){
      this.setState({
        opened: false
      })
    }
  }
  toggleOpened(){
    this.setState({opened: !this.state.opened})
  }
  render(){

    let evaluation = this.props.material.evaluation;
    return <ApplicationListItem key={this.props.material.id} className={`application-list__item assignment ${this.props.material.evaluation ? "" : "state-NO-ASSESSMENT"}`}>
      <ApplicationListItemHeader modifiers="studies-assignment" onClick={this.toggleOpened}>
        {evaluation ?
          <span title={evaluation.gradingScale + getShortenGradeExtension(evaluation.grade)}
            className={`application-list__indicator-badge application-list__indicator-badge--task ${evaluation.passed ? "state-PASSED" : "state-FAILED"}`}>{shortenGrade(evaluation.grade)}</span>
          : <span className={`application-list__indicator-badge application-list__indicator-badge--task state-NO-ASSESSMENT`}>N</span>}
        <span className="application-list__header-primary">{this.props.material.assignment.title}</span>
      </ApplicationListItemHeader>
      {this.state.opened ? <ApplicationListItemBody>
        <MaterialLoader material={this.props.material} workspace={this.props.workspace}
          readOnly loadCompositeReplies modifiers="studies-material-page">
          {(props, state, stateConfiguration) => {
            let evalStateClassName:string = "";
            let evalStateIcon:string = "";
            let hasEvaluation = props.compositeReplies && (props.compositeReplies.state === "PASSED" || props.compositeReplies.state === "FAILED");
            if (props.compositeReplies){
              switch (props.compositeReplies.state){
                case "INCOMPLETE":
                  evalStateClassName = "material-page__assignment-assessment--incomplete";
                  evalStateIcon = "icon-thumb-down";
                  break;
                case "FAILED":
                  evalStateClassName = "material-page__assignment-assessment--failed";
                  evalStateIcon = "icon-thumb-down";
                  break;
                case "PASSED":
                  evalStateClassName = "material-page__assignment-assessment--passed";
                  evalStateIcon = "icon-thumb-up";
                  break;
                case "WITHDRAWN":
                  evalStateClassName = "material-page__assignment-assessment--withdrawn";
                  evalStateIcon = "";
                  break;
              }
            }
            return <div>
              <MaterialLoaderContent {...props} {...state} stateConfiguration={stateConfiguration}/>
              {hasEvaluation &&
                <div className={`material-page__assignment-assessment ${evalStateClassName}`}>
                  <div className={`material-page__assignment-assessment-icon ${evalStateIcon}`}></div>
                  <MaterialLoaderDate {...props} {...state}/>
                  <MaterialLoaderGrade {...props} {...state}/>
                  <MaterialLoaderAssesment {...props} {...state}/>
                </div>}
            </div>
          }}
        </MaterialLoader>
      </ApplicationListItemBody> : null}
    </ApplicationListItem>
  }
}
