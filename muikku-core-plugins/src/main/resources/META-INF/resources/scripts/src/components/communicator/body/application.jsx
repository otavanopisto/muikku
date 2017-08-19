import React from 'react';
import {connect} from 'react-redux';

import ApplicationPanel from '../../general/application-panel.jsx';

class CommunicatorApplication extends React.Component {
  render(){
    let title = <h2 className="communicator text text-panel-application-title communicator-text-title">{this.props.i18n.text.get('plugin.communicator.pageTitle')}</h2>
    let icon = <a className="communicator button-pill communicator-button-pill-settings">
      <span className="icon icon-settings"></span>
    </a>
    let primaryOption = <a className="communicator button communicator-button-new-message">
        {this.props.i18n.text.get('plugin.communicator.newMessage')}
    </a>
    let navigation = <div></div>
    let toolbar = <div></div>
    return (<ApplicationPanel classNameExtension="communicator" toolbar={toolbar} title={title} icon={icon} primaryOption={primaryOption} navigation={navigation}>
      <div></div>
    </ApplicationPanel>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorApplication);