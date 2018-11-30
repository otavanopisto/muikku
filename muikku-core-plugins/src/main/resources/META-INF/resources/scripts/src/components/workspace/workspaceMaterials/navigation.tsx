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
  activeNodeId: number
}

interface NavigationState {
  
}

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < (window.innerHeight - 100) && elemBottom >= (document.querySelector("#stick") as HTMLElement).offsetHeight + 50;
  return isVisible;
}

class NavigationComponent extends React.Component<NavigationProps, NavigationState> {
  componentWillReceiveProps(nextProps: NavigationProps){
    if (nextProps.activeNodeId !== this.props.activeNodeId){
      let element = (this.refs[nextProps.activeNodeId] as NavigationElement).getElement();
      if (!isScrolledIntoView(element)){
        element.scrollIntoView(true);
      }
    }
  }
  render(){
    if (!this.props.materials){
      return null;
    }
    
    return <Navigation>{
      this.props.materials.map((node)=>{
        return <NavigationTopic name={node.title} key={node.workspaceMaterialId}>
          {node.children.map((subnode)=>{
            return <NavigationElement ref={subnode.workspaceMaterialId + ""} iconColor={null} icon={null} key={subnode.workspaceMaterialId}
              isActive={this.props.activeNodeId === subnode.workspaceMaterialId} disableScroll
              hash={"p-" + subnode.workspaceMaterialId}>{subnode.title}</NavigationElement>
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
)(NavigationComponent);