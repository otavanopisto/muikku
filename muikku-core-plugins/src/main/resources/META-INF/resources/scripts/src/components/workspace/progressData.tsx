import { WorkspaceStudentActivityType } from "~/reducers/workspaces";
import { i18nType } from "reducers/base/i18n";
import * as React from "react";
import Dropdown from "~/components/general/dropdown";
let ProgressBarCircle = require('react-progressbar.js').Circle;

export default class ProgressData extends React.Component<{
  activity: WorkspaceStudentActivityType,
  i18n: i18nType
}, {}>{
  render(){
    if (!this.props.activity){
      return null;
    }
    
    let evaluablesDone = this.props.activity.evaluablesPassed + this.props.activity.evaluablesSubmitted +
      this.props.activity.evaluablesFailed + this.props.activity.evaluablesIncomplete;
    
    return <div>
      {this.props.activity.evaluablesTotal ? <Dropdown modifier="workspace-progress" content={<div>
        <div className="workspace-progress-menu-title">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.title')}</div>
      <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.done')} {evaluablesDone}</div>
      <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.total')} {this.props.activity.evaluablesTotal}</div>
      {this.props.activity.evaluablesTotal ?
        <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.passed')} {this.props.activity.evaluablesPassed}</div> : null}
      {this.props.activity.evaluablesSubmitted ?
        <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.unevaluated')} {this.props.activity.evaluablesSubmitted}</div> : null}
      {this.props.activity.evaluablesFailed ?
        <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.failed')} {this.props.activity.evaluablesFailed}</div> : null}
      {this.props.activity.evaluablesIncomplete ?
        <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.evaluable.incomplete')} {this.props.activity.evaluablesIncomplete}</div> : null}
      </div>}>
        <div>
          <ProgressBarCircle containerClassName="clip flex-row flex-align-items-center" options={{
            strokeWidth: 1,
            duration: 1000,
            color: "#ff9900",
            trailColor: "#f5f5f5",
            trailWidth: 1,
            svgStyle: {width: "50px", height: "50px"},
            text: {
              className: "time-text-or-something",
              style: {width: "50px", height: "50px"}
            }}
          }
          strokeWidth={1} easing="easeInOut" duration={1000} color="#ff9900" trailColor="#f5f5f5"
          trailWidth={1}
          text={evaluablesDone + "/" + this.props.activity.evaluablesTotal}
          progress={evaluablesDone/this.props.activity.evaluablesTotal}/>
        </div>
      </Dropdown> : null}
      {this.props.activity.exercisesTotal ? <Dropdown modifier="workspace-progress" content={<div>
        <div className="workspace-progress-menu-title">{this.props.i18n.text.get('plugin.workspace.progress.exercise.title')}</div>
        <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.exercise.done')} {this.props.activity.exercisesAnswered}</div>
        <div className="workspace-progress-menu-item">{this.props.i18n.text.get('plugin.workspace.progress.exercise.total')} {this.props.activity.exercisesTotal}</div>
      </div>}>
        <div>
          <ProgressBarCircle containerClassName="clip flex-row flex-align-items-center" options={{
            strokeWidth: 1,
            duration: 1000,
            color: "#ff9900",
            trailColor: "#f5f5f5",
            trailWidth: 1,
            svgStyle: {width: "50px", height: "50px"},
            text: {
             className: "time-text-or-something",
             style: {width: "50px", height: "50px"}
            }}
          }
          strokeWidth={1} easing="easeInOut" duration={1000} color="#ff9900" trailColor="#f5f5f5"
          trailWidth={1}
          text={this.props.activity.exercisesAnswered + "/" + this.props.activity.exercisesTotal}
          progress={this.props.activity.exercisesAnswered/this.props.activity.exercisesTotal}/>
        </div>
      </Dropdown> : null}
    </div>
  }
}