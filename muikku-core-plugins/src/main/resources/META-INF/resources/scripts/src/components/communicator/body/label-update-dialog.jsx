import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '~/components/general/dialog.jsx';
import Link from '~/components/general/link.jsx';
import communicatorMessagesActions from '~/actions/main-function/communicator/communicator-messages';
import communicatorNavigationActions from '~/actions/main-function/communicator/communicator-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SliderPicker} from 'react-color';

class CommunicatorLabelUpdateDialog extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    label: PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    
    this.onColorChange = this.onColorChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.update = this.update.bind(this);
    
    this.state = {
      color: props.label.color,
      name: props.label.text(props.i18n),
      removed: false
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.label.id !== this.props.label.id){
      this.setState({color: nextProps.label.color, removed: false, name: nextProps.label.text(this.props.i18n)});
    }
  }
  onColorChange(color, event){
    if (this.state.removed){
      return;
    }
    this.setState({color: color.hex});
  }
  onNameChange(e){
    this.setState({name: e.target.value});
  }
  removeLabel(){
    this.setState({removed: true});
  }
  update(closeDialog){
    if (this.state.name !== this.props.label.name || this.state.color !== this.props.label.color){
      this.props.updateCommunicatorLabel(this.props.label, this.state.name, this.state.color);
    }
    closeDialog();
  }
  render(){
    let footer = (closeDialog)=>{
      return <div className="embbed embbed-full">
        <Link className="communicator button button-large button-warn commmunicator-button-standard-cancel" onClick={closeDialog}>
         {this.props.i18n.text.get('plugin.communicator.label.edit.button.cancel')}
        </Link>
        <Link className="communicator button button-large communicator-button-standard-ok" onClick={this.update.bind(this, closeDialog)}>
          {/*TODO this should be OK but instead it says edit, please fix*/}
          {this.props.i18n.text.get('plugin.communicator.label.edit.button.send')}
        </Link>
      </div>
    }
    let content = (closeDialog)=>{
      return <div style={{opacity: this.state.removed ? 0.5 : null}}>
        <div className="communicator text communicator-text-label-update-dialog-icon">
          <span className={`icon icon-${this.props.label.icon}`} style={{color: this.state.removed ? "#aaa" : this.state.color}}/>
        </div>
        <input value={this.state.name}
          className="communicator form-field communicator-form-field-label-name"
          disabled={this.state.removed}
          onChange={this.onNameChange}/>
        <SliderPicker color={this.state.removed ? "#aaa" : this.state.color} onChange={this.onColorChange}/>
      
        {/*TODO please translate this*/}
        <Link className="communicator button button-large button-fatal communicator-button-remove-label" disabled={this.state.removed} onClick={this.removeLabel}>
          {this.state.removed ? "Label Removed" : "Remove Label"}
        </Link>
      </div>
    }
    return <Dialog classNameExtension="communicator" 
     title={this.props.i18n.text.get('plugin.communicator.label.edit.caption')}
     content={content} footer={footer}>{this.props.children}</Dialog>
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
)(CommunicatorLabelUpdateDialog);