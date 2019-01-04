import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import Toolbar from './application/toolbar';
import CoursepickerWorkspaces from './application/courses';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/link.scss';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';

import {StateType} from '~/reducers';
import { WorkspaceBaseFilterType, WorkspacesType } from '~/reducers/workspaces';

interface CoursepickerApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType,
  workspaces: WorkspacesType
}

interface CoursepickerApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType,
  workspaces: WorkspacesType
}

interface CoursepickerApplicationState {
}

class CoursepickerApplication extends React.Component<CoursepickerApplicationProps, CoursepickerApplicationState> {
  constructor(props: CoursepickerApplicationProps){
    super(props);
    
    this.onCoursepickerFilterChange = this.onCoursepickerFilterChange.bind(this);
  }

  onCoursepickerFilterChange(e: React.ChangeEvent<HTMLSelectElement>){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    locationData.b = e.target.value;
    window.location.hash = "#?" + queryString.stringify(locationData, {arrayFormat: 'bracket'});
  }
  
  render(){
    let filterTranslationString = {
      "ALL_COURSES": "plugin.coursepicker.allcourses",
      "MY_COURSES": "plugin.coursepicker.owncourses",
      "AS_TEACHER": "plugin.coursepicker.teachercourses"
    }

    let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.coursepicker.pageTitle')}</h2>
    let toolbar = <Toolbar/>
    let primaryOption = <div className="form-element"> 
      <select className="form-element__select form-element__select--main-action" value={this.props.workspaces.activeFilters.baseFilter} onChange={this.onCoursepickerFilterChange}>
        {this.props.workspaces.avaliableFilters.baseFilters.map((filter: WorkspaceBaseFilterType)=>{
          return <option key={filter} value={filter}>{this.props.i18n.text.get(filterTranslationString[filter])}</option> 
        })} 
      </select>
    </div>
    return (<div>
      <ApplicationPanel modifier="coursepicker" toolbar={toolbar} title={title} asideBefore={this.props.aside} primaryOption={primaryOption}>
        <CoursepickerWorkspaces/>
      </ApplicationPanel>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspaces: state.workspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursepickerApplication);