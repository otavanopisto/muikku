import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

interface MaterialProducersProps {
  workspace: WorkspaceType,
  i18n: i18nType
}

interface MaterialProducersState {

}

class MaterialProducers extends React.Component<MaterialProducersProps, MaterialProducersState> {
  render(){
    if (!this.props.workspace || !this.props.workspace.materialProducers || !this.props.workspace.materialProducers.length){
      return null;
    }
    return (<div className="workspace-footer-producers-wrapper lg-flex-cell-full md-flex-cell-full sm-flex-cell-full no-margin-top no-margin-bottom">
      <span className="workspace-material-producers-label">{this.props.i18n.text.get("plugin.workspace.index.producersLabel")}:</span>
      {this.props.workspace.materialProducers.map((producer, index)=>{
        let textForTheName = producer.name;
        if (index !== this.props.workspace.materialProducers.length - 1){
          textForTheName += ", "
        }
        return <span className="workspace-material-producer">{textForTheName}</span>
      })}
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaterialProducers);
          
          