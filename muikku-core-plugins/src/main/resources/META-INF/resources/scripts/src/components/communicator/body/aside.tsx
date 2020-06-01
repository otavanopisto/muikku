import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import LabelUpdateDialog from '../dialogs/label-update';
import {MessagesNavigationItemListType, MessagesNavigationItemType, MessagesType} from '~/reducers/main-function/messages';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { ButtonPill } from '~/components/general/button';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationProps {
  i18n: i18nType,
  messages: MessagesType,
  openSignatureDialog: ()=>any
}

interface NavigationState {
  
}

class NavigationAside extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <Navigation>
      <NavigationTopic name={this.props.i18n.text.get("plugin.communicator.folders.title")}>
        {this.props.messages.navigation.map((item)=>{
          return <NavigationElement iconColor={item.color} icon={item.icon} key={item.id}
            isActive={this.props.messages.location === item.location} hash={item.location}
            editableWrapper={LabelUpdateDialog} editableWrapperArgs={item.type === "label" ? {label:item} : null}
            isEditable={item.type === "label"}>{item.text(this.props.i18n)}</NavigationElement>
        })}
      </NavigationTopic>
      <NavigationTopic name={this.props.i18n.text.get("plugin.communicator.settings.topic")} className="item-list--settings">
        <NavigationElement icon="settings" isActive={false} onClick={this.props.openSignatureDialog}>{this.props.i18n.text.get('plugin.communicator.settings.signature')}</NavigationElement>
      </NavigationTopic>
    </Navigation>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    messages: state.messages
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationAside);