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
    return <div className={`application-list__item assignment ${this.props.material.evaluation ? "" : "state-NO-ASSESSMENT"}`}>
      <div className="application-list__item-content application-list__item-content--main">
        <div className="application-list__item-header application-list__item-header--studies-assignment" onClick={this.toggleOpened}>
          {evaluation ?
            <span title={evaluation.gradingScale + getShortenGradeExtension(evaluation.grade)}
              className={`application-list__indicator-badge application-list__indicator-badge--task ${evaluation.passed ? "state-PASSED" : "state-FAILED"}`}>{shortenGrade(evaluation.grade)}</span>
            : <span className={`application-list__indicator-badge application-list__indicator-badge--task state-NO-ASSESSMENT`}>N</span>}
          <span className="application-list__header-primary">{this.props.material.assignment.title}</span>
        </div>
        {this.state.opened ? <div className="application-list__item-body">
          <MaterialLoader material={this.props.material} workspace={this.props.workspace}
            readOnly loadCompositeReplies modifiers="studies-material-page">
            {(props, state, stateConfiguration) => {
              return <div>
                <MaterialLoaderContent {...props} {...state} stateConfiguration={stateConfiguration}/>
                <div className={`material-page__assignment-assessment`}>
                  <div className={`material-page__assignment-assessment-icon`}></div>
                  <MaterialLoaderDate {...props} {...state}/>
                  <MaterialLoaderGrade {...props} {...state}/>
                  <MaterialLoaderAssesment {...props} {...state}/>
                </div>
              </div>
            }}
          </MaterialLoader>
        </div> : null}
      </div>
    </div>
  }
}
