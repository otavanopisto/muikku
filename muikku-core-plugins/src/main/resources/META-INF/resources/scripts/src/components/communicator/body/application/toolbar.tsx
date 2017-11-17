import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import {deleteCurrentMessage, DeleteCurrentMessageTriggerType, addLabelToCurrentMessage, AddLabelToCurrentMessageTriggerType,
  removeLabelFromSelectedMessages, RemoveLabelFromSelectedMessagesTriggerType, deleteSelectedMessages, DeleteSelectedMessagesTriggerType,
  toggleMessagesReadStatus, ToggleMessageReadStatusTriggerType, removeLabelFromCurrentMessage, RemoveLabelFromCurrentMessageTriggerType,
  addLabelToSelectedMessages, AddLabelToSelectedMessagesTriggerType} from '~/actions/main-function/communicator/communicator-messages';
import {addCommunicatorLabel, AddCommunicatorLabelTriggerType} from '~/actions/main-function/communicator/communicator-navigation';
import {filterMatch, filterHighlight, intersect, difference} from '~/util/modifiers';
import LabelUpdateDialog from '~/components/communicator/body/label-update-dialog';
import {CommunicatorNavigationItemListType, CommunicatorNavigationItemType} from '~/reducers/main-function/communicator/communicator-navigation';
import {CommunicatorMessagesType, CommunicatorMessageType} from '~/reducers/main-function/communicator/communicator-messages';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';

interface CommunicatorToolbarProps {
  communicatorNavigation: CommunicatorNavigationItemListType,
  communicatorMessages: CommunicatorMessagesType,
  i18n: i18nType,
  deleteCurrentMessage: DeleteCurrentMessageTriggerType,
  addLabelToCurrentMessage: AddLabelToCurrentMessageTriggerType,
  removeLabelFromSelectedMessages: RemoveLabelFromSelectedMessagesTriggerType,
  deleteSelectedMessages: DeleteSelectedMessagesTriggerType,
  toggleMessagesReadStatus: ToggleMessageReadStatusTriggerType,
  addCommunicatorLabel: AddCommunicatorLabelTriggerType,
  removeLabelFromCurrentMessage: RemoveLabelFromCurrentMessageTriggerType,
  addLabelToSelectedMessages: AddLabelToSelectedMessagesTriggerType
}

interface CommunicatorToolbarState {
  labelFilter: string
}

class CommunicatorToolbar extends React.Component<CommunicatorToolbarProps, CommunicatorToolbarState> {
  constructor(props: CommunicatorToolbarProps){
    super(props);
    
    this.updateLabelFilter = this.updateLabelFilter.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    
    this.state = {
      labelFilter: ""
    }
  }
  loadMessage(messageId: number){
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      history.replaceState('', '', location.hash.split("/")[0] + "/" + messageId);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  } 
  updateLabelFilter(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({labelFilter: e.target.value});
  }
  onGoBackClick(e: Event){
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      let canGoBack = (document.referrer.indexOf(window.location.host) !== -1) && (history.length);
      if (canGoBack){
        history.back();
      } else {
        history.replaceState('', '', location.hash.split("/")[0]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = location.hash.split("/")[0];
    }
  }
  render(){
    let currentLocation = this.props.communicatorNavigation.find((item)=>{
      return (item.location === this.props.communicatorMessages.location);
    });
    
    if (!currentLocation){
      return null;
    }
    if (this.props.communicatorMessages.current){
      return ( 
        <div className="application-panel__toolbar">
          <div className="application-panel__toolbar-actions-main">          
            <Link className="button-pill button-pill--go-back" onClick={this.onGoBackClick}>
              <span className="icon icon-goback"></span>
            </Link>
          
            <div className="text text--communicator-current-folder">
              <span className={`icon icon-${currentLocation.icon}`} style={{color: currentLocation.color}}/>
              {"  " + currentLocation.text(this.props.i18n)}
              {currentLocation.type === "label" ? <LabelUpdateDialog label={currentLocation}>
                <Link className="button-pill button-pill--toolbar-edit-label"><span className="icon icon-edit"></span></Link>
              </LabelUpdateDialog> : null} {" / " + this.props.communicatorMessages.current.messages[0].caption}
            </div>                
            <Link className="button-pill button-pill--delete" onClick={this.props.deleteCurrentMessage}>
              <span className="icon icon-delete"></span>
            </Link>          
            <Dropdown modifier="communicator-labels" items={
              [
                <input className="form-field" value={this.state.labelFilter} onChange={this.updateLabelFilter}
                  type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />,
                <Link className="link link--full link--new" onClick={this.props.addCommunicatorLabel.bind(null, this.state.labelFilter)}>
                  {this.props.i18n.text.get("plugin.communicator.label.create")}
                </Link>
              ].concat(this.props.communicatorNavigation.filter((item)=>{
                return item.type === "label" && filterMatch(item.text(this.props.i18n), this.state.labelFilter);
              }).map((label)=>{
                let isSelected = this.props.communicatorMessages.current.labels.find(l=>l.labelId === label.id);
                return (<Link className={`link link--full link--label ${isSelected ? "selected" : ""}`}
                  onClick={!isSelected ? this.props.addLabelToCurrentMessage.bind(null, label) : this.props.removeLabelFromCurrentMessage.bind(null, label)}>
                  <span className="icon icon-tag" style={{color: label.color}}></span>
                  <span className="text">{filterHighlight(label.text(this.props.i18n), this.state.labelFilter)}</span>
                </Link>);
              }))
            }>
              <Link className="button-pill button-pill--label">
                <span className="icon icon-tag"></span>
              </Link>
            </Dropdown>
          </div>
          <div className="application-panel__toolbar-actions-aside">
            <Link className="button-pill button-pill--prev-page"
              disabled={this.props.communicatorMessages.current.olderThreadId === null}
              onClick={this.loadMessage.bind(this, this.props.communicatorMessages.current.olderThreadId)}>
              <span className="icon icon-arrow-left"></span>
            </Link>        
            
            <Link className="button-pill button-pill--next-page"
              disabled={this.props.communicatorMessages.current.newerThreadId === null}
              onClick={this.loadMessage.bind(this, this.props.communicatorMessages.current.newerThreadId)}>
              <span className="icon icon-arrow-right"></span>
            </Link>
          </div>
        </div>
      )
    }
  
    let allInCommon:number[] = [];
    let onlyInSome:number[] = [];
    let isAtLeastOneSelected = this.props.communicatorMessages.selected.length >= 1;
    if (isAtLeastOneSelected){
      let partialIds = this.props.communicatorMessages.selected.map((message: CommunicatorMessageType)=>{return message.labels.map(l=>l.labelId)});
      allInCommon = intersect(...partialIds);
      onlyInSome = difference(...partialIds);
    }
    
    return <div className="application-panel__toolbar">
      <div className="text text--communicator-current-folder">
        <span className={`icon icon-${currentLocation.icon}`} style={{color: currentLocation.color}}/>
        {"  " + currentLocation.text(this.props.i18n)}
        {currentLocation.type === "label" ? <LabelUpdateDialog label={currentLocation}>
          <Link className="button-pill button-pill--toolbar-edit-label"><span className="icon icon-edit"></span></Link>
         </LabelUpdateDialog> : null}
      </div>
      
      <Link className="button-pill button-pill--delete"
       disabled={this.props.communicatorMessages.selected.length == 0} onClick={this.props.deleteSelectedMessages}>
        <span className="icon icon-delete"></span>
      </Link>
               
      <Dropdown modifier="communicator-labels" items={
        [
          <input className="form-field" value={this.state.labelFilter} onChange={this.updateLabelFilter}
            type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />,
          <span className="link link--full link--communicator-new" onClick={this.props.addCommunicatorLabel.bind(null, this.state.labelFilter)}>
            {this.props.i18n.text.get("plugin.communicator.label.create")}
          </span>
        ].concat(this.props.communicatorNavigation.filter((item)=>{
          return item.type === "label" && filterMatch(item.text(this.props.i18n), this.state.labelFilter);
        }).map((label: CommunicatorNavigationItemType)=>{
          let isSelected = allInCommon.includes(label.id as number);
          let isPartiallySelected = onlyInSome.includes(label.id as number);
          return (<Link className={`link link--full link--communicator-label ${isSelected ? "selected" : ""} ${isPartiallySelected ? "semi-selected" : ""} ${isAtLeastOneSelected ? "" : "disabled"}`}
            onClick={!isSelected || isPartiallySelected ? this.props.addLabelToSelectedMessages.bind(null, label) : this.props.removeLabelFromSelectedMessages.bind(null, label)}>
            <span className="icon icon-tag" style={{color: label.color}}></span>
            <span className="text">{filterHighlight(label.text(this.props.i18n), this.state.labelFilter)}</span>
          </Link>);
        }))
      }>
        <Link className="button-pill button-pill--label">
          <span className="icon icon-tag"></span>
        </Link>
      </Dropdown>
      
      <Link className="button-pill button-pill--toggle-read"
        disabled={this.props.communicatorMessages.selected.length !== 1}
        onClick={this.props.communicatorMessages.toolbarLock ? null : this.props.toggleMessagesReadStatus.bind(null, this.props.communicatorMessages.selected[0])}>
        <span className={`icon icon-message-${this.props.communicatorMessages.selected.length === 1 && !this.props.communicatorMessages.selected[0].unreadMessagesInThread ? "un" : ""}read`}></span>
      </Link>
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    communicatorNavigation: state.communicatorNavigation,
    communicatorMessages: state.communicatorMessages,
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({deleteCurrentMessage, addLabelToCurrentMessage,
    removeLabelFromSelectedMessages, deleteSelectedMessages,
    toggleMessagesReadStatus, addCommunicatorLabel, addLabelToSelectedMessages,
    removeLabelFromCurrentMessage}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);