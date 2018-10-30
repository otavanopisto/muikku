import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

interface ProducersProps {
  workspace: WorkspaceType,
  i18n: i18nType
}

interface ProducersState {

}

class Producers extends React.Component<ProducersProps, ProducersState> {
  render(){
    if (!this.props.workspace || !this.props.workspace.Producers || !this.props.workspace.Producers.length){
      return null;
    }
    return (<div className="">
      <span className="">{this.props.i18n.text.get("plugin.workspace.index.producersLabel")}:</span>
      {this.props.workspace.Producers.map((producer, index)=>{
        let textForTheName = producer.name;
        if (index !== this.props.workspace.Producers.length - 1){
          textForTheName += ", "
        }
        return <span className="">{textForTheName}</span>
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
)(Producers);