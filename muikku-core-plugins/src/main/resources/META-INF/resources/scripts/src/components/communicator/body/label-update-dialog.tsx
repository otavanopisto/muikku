import * as React from 'react';
import Dialog from '~/components/general/dialog';
import Link from '~/components/general/link';
import {updateCommunicatorLabel, UpdateCommunicatorLabelTriggerType, removeLabel, RemoveLabelTriggerType} from '~/actions/main-function/communicator/communicator-navigation';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ColorResult} from 'react-color';
//Another weird typescript bug, won't import properly
const SliderPicker:any = require('react-color').SliderPicker;
import {AnyActionType} from '~/actions';
import {CommunicatorNavigationItemType, CommunicatorNavigationItemListType} from '~/reducers/main-function/communicator/communicator-navigation';
import {i18nType } from '~/reducers/base/i18n';
import {CommunicatorMessagesType} from '~/reducers/main-function/communicator/communicator-messages';

const KEYCODES = {
  ENTER: 13
}

interface CommunicatorLabelUpdateDialogProps {
  children: React.ReactElement<any>,
  label: CommunicatorNavigationItemType,
  isOpen: boolean,
  onClose: ()=>any,
  i18n: i18nType,
  communicatorNavigation: CommunicatorNavigationItemListType,
  communicatorMessages: CommunicatorMessagesType,
  updateCommunicatorLabel: UpdateCommunicatorLabelTriggerType,
  removeLabel: RemoveLabelTriggerType
}

interface CommunicatorLabelUpdateDialogState {
  color: string,
  name: string,
  removed: boolean
}


class CommunicatorLabelUpdateDialog extends React.Component<CommunicatorLabelUpdateDialogProps, CommunicatorLabelUpdateDialogState> {
  constructor(props: CommunicatorLabelUpdateDialogProps){
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
  handleKeydown(code: number, closeDialog: ()=>any){
    if (code === KEYCODES.ENTER){
      this.update(closeDialog);
    }
  }
  componentWillReceiveProps(nextProps: CommunicatorLabelUpdateDialogProps){
    if (nextProps.label.id !== this.props.label.id){
      this.resetState(null, nextProps);
    }
  }
  resetState(e:HTMLElement, props=this.props):void{
    this.setState({color: props.label.color, removed: false, name: props.label.text(props.i18n)});
  }
  onColorChange(color: ColorResult){
    if (this.state.removed){
      return;
    }
    this.setState({color: color.hex});
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({name: e.target.value});
  }
  removeLabel(){
    this.setState({removed: true});
  }
  update(closeDialog: ()=>any){
    closeDialog();
    if ((this.state.name !== this.props.label.text(this.props.i18n) || this.state.color !== this.props.label.color) && !this.state.removed){
      this.props.updateCommunicatorLabel(this.props.label, this.state.name, this.state.color);
    } else if (this.state.removed){
      this.props.removeLabel(this.props.label);
    }
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
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
    let sliderPicker = <SliderPicker color={this.state.removed ? "#aaa" : this.state.color} onChange={this.onColorChange}/>
    let content = (closeDialog: ()=>any)=>{
      return (          
        <div style={{opacity: this.state.removed ? 0.5 : null}}>
          <div className="communicator text communicator-text-label-update-dialog-icon">
            <span className={`icon icon-${this.props.label.icon}`} style={{color: this.state.removed ? "#aaa" : this.state.color}}/>
          </div>
          <input value={this.state.name}
            className="communicator form-field communicator-form-field-label-name"
            disabled={this.state.removed}
            onChange={this.onNameChange}/>
          {sliderPicker}
        
          {/*TODO please translate this*/}
          <Link className="communicator button button-large button-fatal communicator-button-remove-label" disabled={this.state.removed} onClick={this.removeLabel}>
            {this.state.removed ? "Label Removed" : "Remove Label"}
          </Link>
        </div>
      )
    }
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} onKeyStroke={this.handleKeydown} onOpen={this.resetState} classNameExtension="communicator" 
     title={this.props.i18n.text.get('plugin.communicator.label.edit.caption')}
     content={content} footer={footer}>{this.props.children}</Dialog>
  }
}

function mapStateToProps(state: any){
  return {
    communicatorNavigation: state.communicatorNavigation,
    communicatorMessages: state.communicatorMessages,
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({updateCommunicatorLabel, removeLabel}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorLabelUpdateDialog);