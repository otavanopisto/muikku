import * as React from 'react';
import Dialog from '~/components/general/dialog';
import Link from '~/components/general/link';
import {updateMessagesNavigationLabel, removeMessagesNavigationLabel, UpdateMessagesNavigationLabelTriggerType, RemoveMessagesNavigationLabelTriggerType} from '~/actions/main-function/messages';
import { MessagesType, MessagesNavigationItemType } from '~/reducers/main-function/messages';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ColorResult} from 'react-color';
//Another weird typescript bug, won't import properly
const ChromePicker:any = require('react-color').ChromePicker;
import {AnyActionType} from '~/actions';
import {i18nType } from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/form-elements.scss';
import Button from '~/components/general/button';

import '~/sass/elements/color-picker.scss';

const KEYCODES = {
  ENTER: 13
}

interface CommunicatorLabelUpdateDialogProps {
  children: React.ReactElement<any>,
  label: MessagesNavigationItemType,
  isOpen?: boolean,
  onClose?: ()=>any,
  i18n: i18nType,
  messages: MessagesType,
  updateMessagesNavigationLabel: UpdateMessagesNavigationLabelTriggerType,
  removeMessagesNavigationLabel: RemoveMessagesNavigationLabelTriggerType
}

interface CommunicatorLabelUpdateDialogState {
  displayColorPicker: boolean,
  color: string,
  name: string,
  removed: boolean
}

class CommunicatorLabelUpdateDialog extends React.Component<CommunicatorLabelUpdateDialogProps, CommunicatorLabelUpdateDialogState> {
  constructor(props: CommunicatorLabelUpdateDialogProps){
    super(props);
    
    this.onColorChange = this.onColorChange.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    
    this.state = {
      displayColorPicker: false,
      color: props.label.color,
      name: props.label.text(props.i18n),
      removed: false
    }
  }
  onHandleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }
  onHandleClose = () => {
    this.setState({ displayColorPicker: false })
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
      this.props.updateMessagesNavigationLabel(this.props.label, this.state.name, this.state.color);
    } else if (this.state.removed){
      this.props.removeMessagesNavigationLabel(this.props.label);
    }
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["success","standard-ok"]} onClick={this.update.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.communicator.label.edit.button.send')}
        </Button>
        <Button buttonModifiers={["cancel", "standard-cancel"]} onClick={closeDialog}>
         {this.props.i18n.text.get('plugin.communicator.label.edit.button.cancel')}
        </Button>
         <Button buttonModifiers={["fatal","communicator-remove-label"]} disabled={this.state.removed} onClick={this.removeLabel}>
           {this.state.removed ? this.props.i18n.text.get('plugin.communicator.label.edit.button.removed') : this.props.i18n.text.get('plugin.communicator.label.edit.button.remove')}
         </Button>
      </div>
    }
    let sliderPicker = <ChromePicker disableAlpha color={this.state.removed ? "#aaa" : this.state.color} onChange={this.onColorChange}/>
    let content = (closeDialog: ()=>any)=>{
      return (          
        <div style={{opacity: this.state.removed ? 0.5 : null}}>
          <div className="dialog__container dialog__container--color-picker">
            <div className="text text--label-update-dialog-icon" style={{borderColor: this.state.removed ? "#aaa" : this.state.color}} onClick={ this.onHandleClick }>
              <span className={`text__icon icon-${this.props.label.icon}`} style={{color: this.state.removed ? "#aaa" : this.state.color}}/>
            </div>
            {this.state.displayColorPicker ? <div className="color-picker">
              <div className="color-picker-overlay" onClick={ this.onHandleClose }/>
              {sliderPicker}
            </div> : null}
          </div>
          <div className="dialog__container dialog__container--form">
            <div className="form-element">
              <input placeholder={this.props.i18n.text.get('plugin.communicator.label.editLabelDialog.name')} value={this.state.name}
                className="form-element__input form-element__input--communicator-label-name"
                disabled={this.state.removed}
                onChange={this.onNameChange}/>
            </div>
          </div>
        </div>
      )
    }
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} onKeyStroke={this.handleKeydown} onOpen={this.resetState} modifier="communicator" 
     title={this.props.i18n.text.get('plugin.communicator.label.edit.caption')}
     content={content} footer={footer}>{this.props.children}</Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    messages: state.messages,
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({updateMessagesNavigationLabel, removeMessagesNavigationLabel}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorLabelUpdateDialog);