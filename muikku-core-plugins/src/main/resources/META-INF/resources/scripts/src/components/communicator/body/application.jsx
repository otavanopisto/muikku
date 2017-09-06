import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ApplicationPanel from '~/components/general/application-panel.jsx';
import HoverButton from '~/components/general/hover-button.jsx';

import Toolbar from './application/toolbar.jsx';
import CommunicatorMessages from './application/messages.jsx';
import MessageView from './application/message-view.jsx';
import NewMessage from './application/new-message.jsx';

class CommunicatorApplication extends React.Component {
  static propTypes = {
    navigation: PropTypes.element.isRequired
  }
  render(){
    let title = <h2 className="communicator text text-panel-application-title communicator-text-title">{this.props.i18n.text.get('plugin.communicator.pageTitle')}</h2>
    let icon = <a className="communicator button-pill communicator-button-pill-settings">
      <span className="icon icon-settings"></span>
    </a>
    let primaryOption = <NewMessage><a className="communicator button communicator-button-new-message">
        {this.props.i18n.text.get('plugin.communicator.newMessage')}
    </a></NewMessage>
    let toolbar = <Toolbar/>
      
    //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
    return (<div className="embbed embbed-full">
      <ApplicationPanel classNameExtension="communicator" toolbar={toolbar} title={title} icon={icon} primaryOption={primaryOption} navigation={this.props.navigation}>
        <CommunicatorMessages/>
        <MessageView/>
      </ApplicationPanel>
      <NewMessage><HoverButton icon="edit" classNameSuffix="new-message" classNameExtension="communicator"/></NewMessage>
    </div>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n,
    communicatorMessages: state.communicatorMessages
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorApplication);