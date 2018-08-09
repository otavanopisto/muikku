import * as React from 'react';
import {StateType} from '~/reducers';

interface WorkspaceFilterProps {
  workspaces: {id:number, name:string}[],
  filteredWorkspaces:number[],
  handler: any
}

class WorkspaceFilter extends React.Component<WorkspaceFilterProps> {
  constructor(props:WorkspaceFilterProps) {
    super(props);
  }
  
  render(){
    return (
   	  <ul>
        {this.props.workspaces.map((workspace)=> {
          let ifChecked = !this.props.filteredWorkspaces.includes(workspace.id);
          //uniq key warning? change attribute to a neutral?
          return (<li><input type='checkbox' key={workspace.id} onClick={() => {this.props.handler(workspace.id)}} defaultChecked={ifChecked} />{workspace.name}</li>);
        })}
      </ul>
    )
  }
}

export default WorkspaceFilter;