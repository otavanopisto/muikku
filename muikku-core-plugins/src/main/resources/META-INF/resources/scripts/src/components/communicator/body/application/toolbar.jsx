import React from 'react';
import {connect} from 'react-redux';
import Dropdown from '~/components/general/dropdown.jsx';
import Link from '~/components/general/link.jsx';
import {filterMatch, filterHighlight, intersect, difference} from '~/util/modifiers';

class CommunicatorToolbar extends React.Component {
  constructor(props){
    super(props);
    
    this.updateLabelFilter = this.updateLabelFilter.bind(this);
    
    this.state = {
      labelFilter: ""
    }
  }
  updateLabelFilter(e){
    this.setState({labelFilter: e.target.value});
  }
  render(){
    let currentLocation = this.props.communicatorNavigation.find((item)=>{
      return (item.location === this.props.hash);
    });
    
    if (!currentLocation){
      return null;
    }
    
    if (this.props.inMessage){
      return <div className="communicator-navigation">
        <Link className="communicator button button-pill communicator-button-pill-go-back communicator-interact-go-back">
          <span className="icon icon-goback"></span>
        </Link>
                
        <Link className="communicator text communicator-text-current-folder">{this.props.folder}</Link>
                
        <Link className="communicator button button-pill communicator-button-pill-delete communicator-toolbar-interact-delete">
          {/* FIXME this is not the right icon, there are no trash bin in the file */}
          <span className="icon icon-forgotpassword"></span>
        </Link>
        <Link className="communicator button button-pill communicator-button-pill-label communicator-toolbar-interact-label">
          <span className="icon icon-tag"></span>
        </Link>
        
        <Link className="communicator button button-pill communicator-button-pill-toggle-read communicator-toolbar-interact-toggle-read">
          <span className="icon {?currentMessageHasUnreadMessages}icon-message-read{:else}icon-message-unread{/currentMessageHasUnreadMessages}"></span>
        </Link>
                
        <Link className="communicator button button-pill communicator-button-pill-next-page communicator-toolbar-interact-toggle-next-page">
          <span className="icon icon-arrow-right"></span>
        </Link>
        <Link className="communicator button button-pill communicator-button-pill-prev-page communicator-toolbar-interact-toggle-prev-page">
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
      <Link className="communicator text communicator-text-current-folder">{currentLocation.text(this.props.i18n)}</Link>
                
      <Link className={`communicator button button-pill communicator-button-pill-delete ${this.props.communicatorMessages.selected.length == 0 ? "disabled" : ""}`}>
        {/* FIXME this is not the right icon, there are no trash bin in the file */}
        <span className="icon icon-forgotpassword"></span>
      </Link>
    
      <Dropdown classNameExtension="communicator" classNameSuffix="labels" items={
        [
          <input className="form-field" id="communicator-toolbar-labels-dropdown-input" value={this.state.labelFilter} onChange={this.updateLabelFilter}
            type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />,
          <span className="communicator link link-full communicator-link-new">
            {this.props.i18n.text.get("plugin.communicator.label.create")}
          </span>
        ].concat(this.props.communicatorNavigation.filter((item)=>{
          return item.type === "label" && filterMatch(item.text(this.props.i18n), this.state.labelFilter);
        }).map((item)=>{
          let isSelected = allInCommon.includes(item.id);
          let isPartiallySelected = onlyInSome.includes(item.id);
          return (<Link className={`communicator link link-full communicator-link-label ${isSelected ? "selected" : ""} ${isPartiallySelected ? "semi-selected" : ""} ${isAtLeastOneSelected ? "" : "disabled"}`}>
            <span className="icon icon-tag" style={{color: item.color}}></span>
            <span className="text">{filterHighlight(item.text(this.props.i18n), this.state.labelFilter)}</span>
          </Link>);
        }))
      }>
        <Link className="communicator button button-pill communicator-button-pill-label">
          <span className="icon icon-tag"></span>
        </Link>
      </Dropdown>
      
      <Link className={`communicator button button-pill communicator-button-pill-toggle-read ${this.props.communicatorMessages.selected.length !== 1 ? "disabled" : ""}`}>
        <span className={`icon icon-message-${this.props.communicatorMessages.selected.length === 1 && this.props.communicatorMessages.selected[0].unreadMessagesInThread ? "un" : ""}read`}></span>
      </Link>
    </div>
  }
}

function mapStateToProps(state){
  return {
    communicatorNavigation: state.communicatorNavigation,
    communicatorMessages: state.communicatorMessages,
    hash: state.hash,
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);