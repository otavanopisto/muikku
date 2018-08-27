import * as React from 'react';
import Dropdown from '~/components/general/dropdown';
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
      <Dropdown modifier="workspace-filter" persistant={true} items={this.props.workspaces.map((workspace)=>{
        let ifChecked = !this.props.filteredWorkspaces.includes(workspace.id);
        return (<li key={workspace.name}><input type='checkbox' onClick={()=>{this.props.handler(workspace.id)}} defaultChecked={ifChecked} /><span>{workspace.name}</span></li>);
        })}>
        <input className={"workspace-filter-activator"} value="Workspaces" type="submit"></input>
      </Dropdown>
    )
  }
}

export default WorkspaceFilter;