import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';

import Toolbar from './application/toolbar';
import CommunicatorMessages from './application/messages';
import MessageView from './application/message-view';
import NewMessage from './application/new-message';
import SignatureUpdateDialog from './signature-update-dialog';
import {i18nType} from '~/reducers/base/i18n';

interface CommunicatorApplicationProps {
  navigation: React.ReactElement<any>,
  i18n: i18nType
}

interface CommunicatorApplicationState {
  updateSignatureDialogOpened: boolean
}

class CommunicatorApplication extends React.Component<CommunicatorApplicationProps, CommunicatorApplicationState> {
  constructor(props: CommunicatorApplicationProps){
    super(props);
    
    this.openDialogSignature = this.openDialogSignature.bind(this);
    this.closeDialogSignature = this.closeDialogSignature.bind(this);
    
    this.state = {
      updateSignatureDialogOpened: false
    }
  }
  openDialogSignature(closeDropdown: ()=>any){
    this.setState({
      updateSignatureDialogOpened: true
    });
    closeDropdown();
  }
  closeDialogSignature(){
    this.setState({
      updateSignatureDialogOpened: false
    });
  }
  render(){
    let title = <h2 className="communicator text text-panel-application-title communicator-text-title">{this.props.i18n.text.get('plugin.communicator.pageTitle')}</h2>
    let icon = <Dropdown modifier="communicator-settings" items={[
      closeDropdown=><Link className="link link-full" onClick={this.openDialogSignature.bind(this, closeDropdown)}>
        <span>{this.props.i18n.text.get("plugin.communicator.settings.signatures")}</span>
      </Link>
    ]}>
      <Link className="communicator button-pill communicator-button-pill-settings">
        <span className="icon icon-settings"></span>
      </Link>
    </Dropdown>
    let primaryOption = <NewMessage><a className="communicator button communicator-button-new-message">
    {this.props.i18n.text.get('plugin.communicator.newMessage.label')}
    </a></NewMessage>
    let toolbar = <Toolbar/>
      
    //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
    return (<div className="embbed embbed-full">
      <ApplicationPanel classNameExtension="communicator" toolbar={toolbar} title={title} icon={icon} primaryOption={primaryOption} navigation={this.props.navigation}>
        <CommunicatorMessages/>
        <MessageView/>
      </ApplicationPanel>
      <SignatureUpdateDialog isOpen={this.state.updateSignatureDialogOpened} onClose={this.closeDialogSignature}/>
      <NewMessage><HoverButton icon="edit" classNameSuffix="new-message" classNameExtension="communicator"/></NewMessage>
    </div>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    communicatorMessages: state.communicatorMessages
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorApplication);