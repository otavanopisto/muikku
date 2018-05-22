import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/item-list.scss';
import { GuiderUserLabelListType, GuiderUserLabelType, GuiderWorkspaceType, GuiderType } from '~/reducers/main-function/guider';
import LabelUpdateDialog from './application/label-update-dialog';
import {StateType} from '~/reducers';
import { ButtonPill } from '~/components/general/button';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationProps {
  i18n: i18nType,
  guider: GuiderType
}

interface NavigationState {
  
}

class NavigationAside extends React.Component<NavigationProps, NavigationState> {
  render(){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    return <Navigation>
      {this.props.guider.availableFilters.labels.length !== 0 ? <NavigationTopic name={this.props.i18n.text.get("plugin.guider.filters.flags")}>
        {this.props.guider.availableFilters.labels.map((label: GuiderUserLabelType)=>{
          let isActive = this.props.guider.activeFilters.labelFilters.includes(label.id);
          let hash = isActive ? 
            queryString.stringify(Object.assign({}, locationData, {c: "", l: (locationData.l || []).filter((i:string)=>parseInt(i)!==label.id)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {c: "", l: (locationData.l || []).concat(label.id)}), {arrayFormat: 'bracket'});
          return <NavigationElement key={label.id} icon="flag" iconColor={label.color} isActive={isActive} hash={"?" + hash}
          editableWrapper={LabelUpdateDialog} editableWrapperArgs={{label: label}} isEditable>{label.name}</NavigationElement>
        })}
      </NavigationTopic>: null}
      <NavigationTopic name={this.props.i18n.text.get("plugin.guider.filters.workspaces")}>
        {this.props.guider.availableFilters.workspaces.map((workspace: GuiderWorkspaceType)=>{
          let isActive = this.props.guider.activeFilters.workspaceFilters.includes(workspace.id);
          let hash = isActive ?
            queryString.stringify(Object.assign({}, locationData, {c: "", w: (locationData.w || []).filter((w:string)=>parseInt(w)!==workspace.id)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {c: "", w: (locationData.w || []).concat(workspace.id)}), {arrayFormat: 'bracket'});
          return <NavigationElement key={workspace.id} isActive={isActive} hash={"?" + hash}>{workspace.name}</NavigationElement>
        })}
      </NavigationTopic>
    </Navigation>
//    return <div className="item-list item-list--aside-navigation">
//      {this.props.guider.availableFilters.labels.length !== 0 ? 
//        <span className="text item-list__title">{this.props.i18n.text.get("plugin.guider.filters.flags")}</span>
//      : null}
//      {this.props.guider.availableFilters.labels.map((label: GuiderUserLabelType)=>{
//        let isActive = this.props.guider.activeFilters.labelFilters.includes(label.id);
//        let hash = isActive ? 
//            queryString.stringify(Object.assign({}, locationData, {c: "", l: (locationData.l || []).filter((i:string)=>parseInt(i)!==label.id)}), {arrayFormat: 'bracket'}) :
//            queryString.stringify(Object.assign({}, locationData, {c: "", l: (locationData.l || []).concat(label.id)}), {arrayFormat: 'bracket'})
//        return <Link key={label.id} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
//          <span className="icon-flag" style={{color: label.color}}></span>
//          <span className="item-list__text-body text">
//            {label.name}
//          </span>
//          <LabelUpdateDialog label={label}>
//            <ButtonPill disablePropagation as="span" buttonModifiers="navigation-edit-label" icon="edit"/>
//          </LabelUpdateDialog>
//        </Link>
//      })}
//      <span className="text item-list__title">{this.props.i18n.text.get("plugin.guider.filters.workspaces")}</span>
//      {this.props.guider.availableFilters.workspaces.map((workspace: GuiderWorkspaceType)=>{
//        let isActive = this.props.guider.activeFilters.workspaceFilters.includes(workspace.id);
//        let hash = isActive ?
//            queryString.stringify(Object.assign({}, locationData, {c: "", w: (locationData.w || []).filter((w:string)=>parseInt(w)!==workspace.id)}), {arrayFormat: 'bracket'}) :
//            queryString.stringify(Object.assign({}, locationData, {c: "", w: (locationData.w || []).concat(workspace.id)}), {arrayFormat: 'bracket'});
//        return <Link key={workspace.id} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
//          <span className="item-list__text-body text">
//            {workspace.name}
//          </span>
//        </Link>
//      })}
//   </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    guider: state.guider
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationAside);