import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { GuiderFilterType, GuiderUserLabelListType, GuiderUserLabelType, GuiderWorkspaceType } from '~/reducers/main-function/guider/guider-filters';
import { GuiderStudentsType } from '~/reducers/main-function/guider/guider-students';

interface NavigationProps {
  i18n: i18nType,
  guiderFilters: GuiderFilterType,
  guiderStudents: GuiderStudentsType
}

interface NavigationState {
  
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    return <div className="item-list item-list--aside-navigation">
      {this.props.guiderFilters.labels.length !== 0 ? 
        <span>TODO FLAGS</span>
      : null}
      {this.props.guiderFilters.labels.map((label: GuiderUserLabelType)=>{
        let isActive = this.props.guiderStudents.filters.labelFilters.includes(label.id);
        let hash = isActive ? 
            queryString.stringify(Object.assign({}, locationData, {l: (locationData.l || []).filter((i:number)=>i!==label.id)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {l: (locationData.l || []).concat(label.id)}), {arrayFormat: 'bracket'})
        return <Link key={label.id} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
          <span className="TODO-icon" style={{color: label.color}}>ICON</span>
          <span className="item-list__text-body text">
            {label.name}
          </span>
        </Link>
      })}
      <span>TODO WORKSPACES</span>
      {this.props.guiderFilters.workspaces.map((workspace: GuiderWorkspaceType)=>{
        let isActive = this.props.guiderStudents.filters.workspaceFilters.includes(workspace.id);
        let hash = isActive ?
            queryString.stringify(Object.assign({}, locationData, {w: (locationData.w || []).filter((c:number)=>c!==workspace.id)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {w: (locationData.w || []).concat(workspace.id)}), {arrayFormat: 'bracket'});
        return <Link key={workspace.id} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
          <span className="item-list__text-body text">
            {workspace.name}
          </span>
        </Link>
      })}
   </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderFilters: state.guiderFilters,
    guiderStudents: state.guiderStudents
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);