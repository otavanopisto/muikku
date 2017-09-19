import * as React from 'react';
import * as PropTypes from 'prop-types';
import Dialog from '~/components/general/dialog.tsx';
import Link from '~/components/general/link.tsx';
import communicatorMessagesActions from '~/actions/main-function/communicator/communicator-messages';
import communicatorNavigationActions from '~/actions/main-function/communicator/communicator-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SliderPicker, ColorResult} from 'react-color';

const KEYCODES = {
  ENTER: 13
}

class CommunicatorLabelUpdateDialog extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    label: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  }
  constructor(props){
    super(props);
    
    this.onColorChange = this.onColorChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    
    this.state = {
      color: props.label.color,
      name: props.label.text(props.i18n),
      removed: false
    }
  }
  handleKeydown(code, closeDialog){
    if (code === KEYCODES.ENTER){
      this.update(closeDialog);
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.label.id !== this.props.label.id){
      this.resetState(nextProps);
    }
  }
  resetState(props=this.props){
    this.setState({color: props.label.color, removed: false, name: props.label.text(props.i18n)});
  }
  onColorChange(color: ColorResult){
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
    closeDialog();
    if ((this.state.name !== this.props.label.name || this.state.color !== this.props.label.color) && !this.state.removed){
      this.props.updateCommunicatorLabel(this.props.label, this.state.name, this.state.color);
    } else if (this.state.removed){
      this.props.removeLabel(this.props.label);
    }
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
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} onKeyStroke={this.handleKeydown} onOpen={this.resetState} classNameExtension="communicator" 
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