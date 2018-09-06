import * as React from 'react';
import Dropdown from '~/components/general/dropdown';
import { StateType } from '~/reducers';

interface WorkspaceFilterProps {
  workspaces: {id:number, name:string}[],
  filteredWorkspaces:number[],
  handler: any
}

class WorkspaceFilter extends React.Component<WorkspaceFilterProps> {
  constructor(props:WorkspaceFilterProps) {
    super(props);
  }
  //TODO: Check if text--course-icon is needed and remove if not 
  render(){
    return (
      <div className="filter filter--workspace-filter">
        <Dropdown modifier="workspace-filter" persistant={true} items={this.props.workspaces.map((workspace)=>{
          let ifChecked = !this.props.filteredWorkspaces.includes(workspace.id);
          return (<div className="filter-item filter-item--workspace" key={workspace.name}><input type='checkbox' onClick={()=>{this.props.handler(workspace.id)}} defaultChecked={ifChecked} /><span className="filter-item_label">{workspace.name}</span></div>);
          })}>
          <span className="icon-books filter_activator filter_activator--workspace-filter"></span>
        </Dropdown>
      </div>
    )
  }
}

export default WorkspaceFilter;