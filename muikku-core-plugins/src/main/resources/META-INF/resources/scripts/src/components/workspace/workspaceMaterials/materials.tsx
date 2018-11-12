import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceType, MaterialContentNodeListType } from "~/reducers/workspaces";
import ProgressData from '../progressData';

import ApplicationPanel from '~/components/general/application-panel';

interface WorkspaceMaterialsProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  aside: React.ReactElement<any>,
  activeNodeId: number
}

interface WorkspaceMaterialsState {
  
}

class WorkspaceMaterials extends React.Component<WorkspaceMaterialsProps, WorkspaceMaterialsState> {
  render(){
    if (!this.props.workspace || !this.props.materials){
      return null;
    }
    
    return <ApplicationPanel modifier="materials"
      toolbar={<div><h2>{this.props.workspace.name}</h2><ProgressData i18n={this.props.i18n}
      activity={this.props.workspace.studentActivity}/></div>}
      asideAfter={this.props.aside}>
        {this.props.materials.map((node)=>{
          return <section>
            <h1>{node.title}</h1>
            <div>
              {node.children.map((subnode)=>{
                 return <div style={{height: 600}}/>
               })}
            </div>
          </section>
          })
        }
    </ApplicationPanel>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    materials: state.workspaces.currentMaterials,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkspaceMaterials);