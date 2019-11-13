import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {StateType} from '~/reducers';
import ApplicationPanel from '~/components/general/application-panel/application-panel';
import ApplicationPanelBody from '~/components/general/application-panel/components/application-panel-body';
import Tabs from '~/components/general/tabs';
import {i18nType} from '~/reducers/base/i18n';

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
  activeTab: "SUMMARY" | "USERS" | "COURSES" | "REPORTS"
}

class OrganizationManagementApplication extends React.Component<OrganizationManagementApplicationProps, OrganizationManagementApplicationState>{
  constructor(props: OrganizationManagementApplicationProps ){
    super(props);
    this.state = {
      activeTab : "SUMMARY"
    }
    this.onTabChange = this.onTabChange.bind(this);
    
  }
  
  onTabChange(id: "SUMMARY" | "USERS" | "COURSES" | "REPORTS" ) {
    this.setState({
      activeTab: id
    });
  }
  
  render(){
        let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.organization.pageTitle')}</h2>
        return (
            <ApplicationPanel modifier="organization" title={title} onTabChange={this.onTabChange} activeTab={this.state.activeTab} panelTabs={[
          {
            id: "SUMMARY",
            name: this.props.i18n.text.get('plugin.organization.tab.title.summary'),
            component: ()=> { return <ApplicationPanelBody modifier="tabs" children={<h1>Sunmary</h1>}/>}
            
          },
          {
            id: "USERS",
            name: this.props.i18n.text.get('plugin.organization.tab.title.users'),
            component: ()=> { return <ApplicationPanelBody modifier="tabs" children={<h1>Usah</h1>}/>}
            
          },
          {
            id: "COURSES",
            name: this.props.i18n.text.get('plugin.organization.tab.title.courses'),
            component: ()=> { return <ApplicationPanelBody modifier="tabs" children={<h1>Course</h1>}/>}
            
          },
          {
            id: "REPORTS",
            name: this.props.i18n.text.get('plugin.organization.tab.title.reports'),
            component: ()=> { return <ApplicationPanelBody  modifier="tabs" children={<h1>Rebort</h1>}/>}
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