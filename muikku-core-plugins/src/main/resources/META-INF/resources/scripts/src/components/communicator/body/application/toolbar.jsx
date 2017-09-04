import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '~/components/general/dropdown.jsx';
import Link from '~/components/general/link.jsx';
import communicatorMessagesActions from '~/actions/main-function/communicator/communicator-messages';
import communicatorNavigationActions from '~/actions/main-function/communicator/communicator-navigation';
import {filterMatch, filterHighlight, intersect, difference} from '~/util/modifiers';
import LabelUpdateDialog from '~/components/communicator/body/label-update-dialog.jsx';

class CommunicatorToolbar extends React.Component {
  constructor(props){
    super(props);
    
    this.updateLabelFilter = this.updateLabelFilter.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    
    this.state = {
      labelFilter: ""
    }
  }
  loadMessage(messageId){
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      history.replaceState('', '', location.hash.split("/")[0] + "/" + messageId);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }
  updateLabelFilter(e){
    this.setState({labelFilter: e.target.value});
  }
  onGoBackClick(e){
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
      return <div className="communicator-navigation">
        <Link className="communicator button button-pill communicator-button-pill-go-back communicator-interact-go-back" onClick={this.onGoBackClick}>
          <span className="icon icon-goback"></span>
        </Link>
      
        <div className="communicator text communicator-text-current-folder">
          <span className={`icon icon-${currentLocation.icon}`} style={{color: currentLocation.color}}/>
          {"  " + currentLocation.text(this.props.i18n)}
          {currentLocation.type === "label" ? <LabelUpdateDialog label={currentLocation}>
            <Link className="communicator button-pill communicator-button-pill-toolbar-edit-label"><span className="icon icon-edit"></span></Link>
          </LabelUpdateDialog> : null} {" / " + this.props.communicatorMessages.current.messages[0].caption}
        </div>
                
        <Link className="communicator button button-pill communicator-button-pill-delete" onClick={this.props.deleteCurrentMessage}>
          {/* FIXME this is not the right icon, there are no trash bin in the file */}
          <span className="icon icon-forgotpassword"></span>
        </Link>
        
        <Link className="communicator button button-pill communicator-button-pill-label">
          <span className="icon icon-tag"></span>
        </Link>
                
        <Link className="communicator button button-pill communicator-button-pill-next-page"
          disabled={this.props.communicatorMessages.current.newerThreadId === null}
          onClick={this.loadMessage.bind(this, this.props.communicatorMessages.current.newerThreadId)}>
          <span className="icon icon-arrow-right"></span>
        </Link>
        <Link className="communicator button button-pill communicator-button-pill-prev-page"
          disabled={this.props.communicatorMessages.current.olderThreadId === null}
          onClick={this.loadMessage.bind(this, this.props.communicatorMessages.current.olderThreadId)}>
          <span className="icon icon-arrow-left"></span>
        </Link>
      </div>
    }
  
    let allInCommon = [];
    let onlyInSome = [];
    let isAtLeastOneSelected = this.props.communicatorMessages.selected.length >= 1;
    if (isAtLeastOneSelected){
      let partialIds = this.props.communicatorMessages.selected.map((message)=>{return message.labels.map(l=>l.labelId)});
      allInCommon = intersect(...partialIds);
      onlyInSome = difference(...partialIds);
    }
    
    return <div className="communicator-navigation">
      <div className="communicator text communicator-text-current-folder">
        <span className={`icon icon-${currentLocation.icon}`} style={{color: currentLocation.color}}/>
        {"  " + currentLocation.text(this.props.i18n)}
        {currentLocation.type === "label" ? <LabelUpdateDialog label={currentLocation}>
          <Link className="communicator button-pill communicator-button-pill-toolbar-edit-label"><span className="icon icon-edit"></span></Link>
         </LabelUpdateDialog> : null}
      </div>
      
      <Link className="communicator button button-pill communicator-button-pill-delete"
       disabled={this.props.communicatorMessages.selected.length == 0} onClick={this.props.deleteSelectedMessages}>
        {/* FIXME this is not the right icon, there are no trash bin in the file */}
        <span className="icon icon-forgotpassword"></span>
      </Link>
    
      <Dropdown classNameExtension="communicator" classNameSuffix="labels" items={
        [
          <input className="form-field" id="communicator-toolbar-labels-dropdown-input" value={this.state.labelFilter} onChange={this.updateLabelFilter}
            type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />,
          <span className="communicator link link-full communicator-link-new" onClick={this.props.addCommunicatorLabel.bind(null, this.state.labelFilter)}>
            {this.props.i18n.text.get("plugin.communicator.label.create")}
          </span>
        ].concat(this.props.communicatorNavigation.filter((item)=>{
          return item.type === "label" && filterMatch(item.text(this.props.i18n), this.state.labelFilter);
        }).map((label)=>{
          let isSelected = allInCommon.includes(label.id);
          let isPartiallySelected = onlyInSome.includes(label.id);
          return (<Link className={`communicator link link-full communicator-link-label ${isSelected ? "selected" : ""} ${isPartiallySelected ? "semi-selected" : ""} ${isAtLeastOneSelected ? "" : "disabled"}`}
            onClick={!isSelected || isPartiallySelected ? this.props.addLabelToSelectedMessages.bind(null, label) : this.props.removeLabelFromSelectedMessages.bind(null, label)}>
            <span className="icon icon-tag" style={{color: label.color}}></span>
            <span className="text">{filterHighlight(label.text(this.props.i18n), this.state.labelFilter)}</span>
          </Link>);
        }))
      }>
        <Link className="communicator button button-pill communicator-button-pill-label">
          <span className="icon icon-tag"></span>
        </Link>
      </Dropdown>
      
      <Link className="communicator button button-pill communicator-button-pill-toggle-read"
        disabled={this.props.communicatorMessages.selected.length !== 1}
        onClick={this.props.communicatorMessages.toolbarLock ? null : this.props.toggleMessagesReadStatus.bind(null, this.props.communicatorMessages.selected[0])}>
        <span className={`icon icon-message-${this.props.communicatorMessages.selected.length === 1 && !this.props.communicatorMessages.selected[0].unreadMessagesInThread ? "un" : ""}read`}></span>
      </Link>
    </div>
  }
}

function mapStateToProps(state){
  return {
    communicatorNavigation: state.communicatorNavigation,
    communicatorMessages: state.communicatorMessages,
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(Object.assign({}, communicatorMessagesActions, communicatorNavigationActions), dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);