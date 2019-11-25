import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {StateType} from '~/reducers';
import ApplicationPanel, {ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain } from '~/components/general/application-panel/application-panel';
import ApplicationPanelBody from '~/components/general/application-panel/components/application-panel-body';
import Tabs from '~/components/general/tabs';
import Summary from './application/summary';
import Users from './application/users';
import Courses from './application/courses';
import CoursesAside from './application/courses/aside';
import Reports from './application/reports';
import {i18nType} from '~/reducers/base/i18n';
import { ButtonPill} from '~/components/general/button';

import '~/sass/elements/link.scss';

{/* Reading panel's css */}
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/reading-panel.scss';
import '~/sass/elements/loaders.scss';

const tabNames = ["summary", "users", "courses", "reports"];
 
interface OrganizationManagementApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface OrganizationManagementApplicationState {
  activeTab: "SUMMARY" | "USERS" | "COURSES" | "REPORTS",
}

class OrganizationManagementApplication extends React.Component<OrganizationManagementApplicationProps, OrganizationManagementApplicationState>{
  constructor(props: OrganizationManagementApplicationProps ){
    super(props);
    this.state = {
      activeTab : "SUMMARY",
    }
    this.onTabChange = this.onTabChange.bind(this);
    
  }
  
  onTabChange(id: "SUMMARY" | "USERS" | "COURSES" | "REPORTS" ) {
    this.setState({
      activeTab: id
    });
  }
  
  onInputFocus() {
    console.log("Focus");
  }

  onInputBlur() {
   console.log("Blur");
  }
  
  setSearchQuery() {
    console.log("setSearchquery");
  }
  
  render(){
        
        let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.organization.pageTitle')}</h2>;
        let usersPrimaryAction = <ButtonPill buttonModifiers="organization" icon="add" />;
        let coursesPrimaryAction = <ButtonPill buttonModifiers="organization" icon="add" />;
        
        let coursesToolbar = <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div className="form-element form-element--coursepicker-toolbar">
              <input onFocus={this.onInputFocus} onBlur={this.onInputBlur} className="form-element__input form-element__input--main-function-search" placeholder={this.props.i18n.text.get('plugin.organization.courses.search.placeholder')}  onChange={this.setSearchQuery}/>
              <div className="form-element__input-decoration--main-function-search icon-search"></div>
            </div>
          </ApplicationPanelToolbarActionsMain>
          </ApplicationPanelToolbar>
          
        let usersToolbar = <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div className="form-element form-element--coursepicker-toolbar">
              <input onFocus={this.onInputFocus} onBlur={this.onInputBlur} className="form-element__input form-element__input--main-function-search" placeholder={this.props.i18n.text.get('plugin.organization.users.search.placeholder')}  onChange={this.setSearchQuery}/>
              <div className="form-element__input-decoration--main-function-search icon-search"></div>
            </div>
          </ApplicationPanelToolbarActionsMain>
          </ApplicationPanelToolbar>
          
;
        
        return (
          <ApplicationPanel modifier="organization" title={title} onTabChange={this.onTabChange} activeTab={this.state.activeTab} panelTabs={[
          {
            id: "SUMMARY",
            name: this.props.i18n.text.get('plugin.organization.tab.title.summary'),
            component: ()=> { return <ApplicationPanelBody modifier="tabs" children={<Summary />}/>}
            
          },
          {
            id: "USERS",
            name: this.props.i18n.text.get('plugin.organization.tab.title.users'),
            component: ()=> { return <ApplicationPanelBody primaryOption={usersPrimaryAction} toolbar={usersToolbar} modifier="tabs" children={<Users />}/>}
            
          },
          {
            id: "COURSES",
            name: this.props.i18n.text.get('plugin.organization.tab.title.courses'),
            component: ()=> { return <ApplicationPanelBody primaryOption={coursesPrimaryAction} toolbar={coursesToolbar} modifier="tabs" asideBefore={<CoursesAside />} children={<Courses />}/>}
            
          },
          {
            id: "REPORTS",
            name: this.props.i18n.text.get('plugin.organization.tab.title.reports'),
            component: ()=> { return <ApplicationPanelBody  modifier="tabs" children={<Reports />}/>}
          }
        ]} />
        );
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationManagementApplication);