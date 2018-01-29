import Workspace from './workspaces/workspace';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType } from '~/reducers/main-function/guider/guider-students';

interface CurrentStudentWorkspacesProps {
  i18n: i18nType,
  guiderStudentsCurrent: GuiderStudentUserProfileType,
  guiderCurrentState: GuiderCurrentStudentStateType
}

interface CurrentStudentWorkspacesState {
}

class CurrentStudentWorkspaces extends React.Component<CurrentStudentWorkspacesProps, CurrentStudentWorkspacesState> {
  render(){
    return this.props.guiderStudentsCurrent.workspaces &&  (this.props.guiderStudentsCurrent.workspaces.length ? <div>
        {this.props.guiderStudentsCurrent.workspaces.map((workspace)=>{
          return <Workspace workspace={workspace} />
        })}
      </div>: <div className="mf-content-empty cm-no-messages flex-row">
        <h3 className=" lg-flex-cell-full md-flex-cell-full sm-flex-cell-full flex-align-items-center">{this.props.i18n.text.get("plugin.guider.noWorkspaces")}</h3>
      </div>)
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderStudentsCurrent: state.guiderStudents.current,
    guiderCurrentState: state.guiderStudents.currentState
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentStudentWorkspaces);