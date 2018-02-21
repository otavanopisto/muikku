import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { RecordsGradesType, MaterialType } from "~/reducers/main-function/records/records";
import { WorkspaceType } from "reducers/main-function/index/workspaces";

import MaterialLoader from "~/components/base/material-loader";

interface MaterialProps {
  material: MaterialType,
  workspace: WorkspaceType,
  i18n: i18nType,
  grades: RecordsGradesType
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
    return <div className="application-list__item" onClick={this.toggleOpened}>
      <div className="application-list__item-content application-list__item-content--main">
        <div className="application-list__item-header">
          {evaluation ?
            <span title={this.props.grades[[
              evaluation.gradingScaleSchoolDataSource,
              evaluation.gradingScaleIdentifier,
              evaluation.gradeSchoolDataSource,
              evaluation.gradeIdentifier].join("-")].scale} className={`TODO tiny-block-with-score-class-name ${evaluation.grade ? "passed" : "failed"}`}>{evaluation.grade}</span>
            : <span className={`TODO tiny-block-when-no-score`}>N</span>}
          
          {this.props.material.assignment.title}
        </div>
        {this.state.opened ? <div className="application-list__item-body">
          <MaterialLoader material={this.props.material} workspace={this.props.workspace}/>
        </div> : null}
      </div>
    </div>
  }
}