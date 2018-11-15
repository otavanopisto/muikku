import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNodeListType } from "~/reducers/workspaces";

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { ButtonPill } from '~/components/general/button';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationProps {
  i18n: i18nType,
  materials: MaterialContentNodeListType,
  onScrollToSection?: ()=>any,
  activeNodeId: number
}

interface NavigationState {
  
}

class NavigationAside extends React.Component<NavigationProps, NavigationState> {
  render(){
    if (!this.props.materials){
      return null;
    }
    
    return <Navigation>{
      this.props.materials.map((node)=>{
        return <NavigationTopic name={node.title} key={node.workspaceMaterialId}>
          {node.children.map((subnode)=>{
            return <NavigationElement iconColor={null} icon={null} key={subnode.workspaceMaterialId} onScrollToSection={this.props.onScrollToSection}
              isActive={this.props.activeNodeId === subnode.workspaceMaterialId} hash={subnode.workspaceMaterialId}>{subnode.title}</NavigationElement>
          })}
        </NavigationTopic>
      })
    }
    </Navigation>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
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
)(NavigationAside);