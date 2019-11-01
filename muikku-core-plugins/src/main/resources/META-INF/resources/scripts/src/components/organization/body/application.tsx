import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {StateType} from '~/reducers';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';

{/* Reading panel's css */}
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/reading-panel.scss';
import '~/sass/elements/loaders.scss';

interface OrganizationManagementApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface OrganizationManagementApplicationState {
}

class OrganizationManagementApplication extends React.Component<OrganizationManagementApplicationProps, OrganizationManagementApplicationState>{
  render(){
        let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.announcements.pageTitle')}</h2>
        return (<div>

        </div>);        
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