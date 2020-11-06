import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';


import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/wcag.scss';
import {StateType} from '~/reducers';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain } from '~/components/general/application-panel';
import { WorkspacesType } from '~/reducers/workspaces';

interface CoursepickerToolbarProps {
  i18n: i18nType,
  workspaces: WorkspacesType
}

interface CoursepickerToolbarState {
  searchquery: string
}

class CoursepickerToolbar extends React.Component<CoursepickerToolbarProps, CoursepickerToolbarState> {
  private searchTimer: NodeJS.Timer;
  private focused:boolean;
  constructor(props: CoursepickerToolbarProps){
    super(props);

    this.state = {
      searchquery: this.props.workspaces.activeFilters.query || ""
    }

    this.setSearchQuery = this.setSearchQuery.bind(this);
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);

    this.searchTimer = null;
    this.focused = false;
  }

  updateSearchWithQuery(query: string){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    locationData.q = query;
    window.location.hash = "#?" + queryString.stringify(locationData, {arrayFormat: 'bracket'});
  }

  setSearchQuery(e: React.ChangeEvent<HTMLInputElement>){
    clearTimeout(this.searchTimer);

    this.setState({
      searchquery: e.target.value
    });

    this.searchTimer = setTimeout(this.updateSearchWithQuery.bind(this, e.target.value), 400);
  }

  componentWillReceiveProps(nextProps: CoursepickerToolbarProps){
    if (!this.focused && (nextProps.workspaces.activeFilters.query || "") !== this.state.searchquery){
      this.setState({
        searchquery: nextProps.workspaces.activeFilters.query || ""
      });
    }
  }

  onInputFocus(){
    this.focused = true;
  }

  onInputBlur(){
    this.focused = false;
  }

  render(){
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div className="form-element form-element--coursepicker-toolbar">
              <label htmlFor="searchCourses" className="visually-hidden">{this.props.i18n.text.get('plugin.coursepicker.search.placeholder')}</label>
              <input id="searchCourses" onFocus={this.onInputFocus} onBlur={this.onInputBlur} className="form-element__input form-element__input--main-function-search" placeholder={this.props.i18n.text.get('plugin.coursepicker.search.placeholder')} value={this.state.searchquery}  onChange={this.setSearchQuery}/>
              <div className="form-element__input-decoration form-element__input-decoration--main-function-search icon-search"></div>
            </div>
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      )
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
)(CoursepickerToolbar);
