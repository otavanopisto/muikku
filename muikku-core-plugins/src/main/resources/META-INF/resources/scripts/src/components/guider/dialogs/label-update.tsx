import * as React from 'react';
import Dialog from '~/components/general/dialog';
import Link from '~/components/general/link';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ColorResult} from 'react-color';
//Another weird typescript bug, won't import properly
const ChromePicker:any = require('react-color').ChromePicker;
import {AnyActionType} from '~/actions';
import {i18nType } from '~/reducers/base/i18n';

import '~/sass/elements/form-elements.scss';
import { GuiderUserLabelType } from '~/reducers/main-function/guider';
import { UpdateGuiderFilterLabelTriggerType, RemoveGuiderFilterLabelTriggerType, updateGuiderFilterLabel, removeGuiderFilterLabel } from '~/actions/main-function/guider';
import GuiderLabelShareDialog from './label-share';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';

import '~/sass/elements/color-picker.scss';

const KEYCODES = {
  ENTER: 13
}

interface GuiderLabelUpdateDialogProps {
  children: React.ReactElement<any>,
  label: GuiderUserLabelType,
  isOpen?: boolean,
  onClose?: ()=>any,
  i18n: i18nType,
  updateGuiderFilterLabel: UpdateGuiderFilterLabelTriggerType,
  removeGuiderFilterLabel: RemoveGuiderFilterLabelTriggerType
}

interface GuiderLabelUpdateDialogState {
  displayColorPicker: boolean,
  color: string,
  name: string,
  description: string,
  removed: boolean
}

class GuiderLabelUpdateDialog extends React.Component<GuiderLabelUpdateDialogProps, GuiderLabelUpdateDialogState> {
  constructor(props: GuiderLabelUpdateDialogProps){
    super(props);
    
    this.onColorChange = this.onColorChange.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.shareLabel = this.shareLabel.bind(this);
    
    this.state = {
      displayColorPicker: false,
      color: props.label.color,
      name: props.label.name,
      description: props.label.description,
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
  componentWillReceiveProps(nextProps: GuiderLabelUpdateDialogProps){
    if (nextProps.label.id !== this.props.label.id){
      this.resetState(null, nextProps);
    }
  }
  resetState(e:HTMLElement, props=this.props):void{
    this.setState({
      color: props.label.color,
      removed: false,
      name: props.label.name,
      description: props.label.description
    });
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
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setState({description: e.target.value});
  }
  removeLabel(){
    this.setState({removed: true});
  }
  shareLabel(){
    
  }
  update(closeDialog: ()=>any){
    closeDialog();
    if ((this.state.name !== this.props.label.name ||
        this.state.color !== this.props.label.color ||
        this.state.description !== this.props.label.description) && !this.state.removed){
      this.props.updateGuiderFilterLabel(this.props.label, this.state.name, this.state.description, this.state.color);
    } else if (this.state.removed){
      this.props.removeGuiderFilterLabel(this.props.label);
    }
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["success", "standard-ok"]} onClick={this.update.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.guider.flags.editFlagDialog.save')}
        </Button>
        <Button buttonModifiers={["cancel", "standard-cancel"]} onClick={closeDialog}>
         {this.props.i18n.text.get('plugin.guider.flags.editFlagDialog.cancel')}
        </Button>
        <GuiderLabelShareDialog label={this.props.label}>
          <Button buttonModifiers={["info", "guider-share-label"]} disabled={this.state.removed} onClick={this.shareLabel}>
            {this.props.i18n.text.get('plugin.guider.flags.shareFlag.label')}
          </Button>
        </GuiderLabelShareDialog>
        <Button buttonModifiers={["fatal", "guider-remove-label"]} disabled={this.state.removed} onClick={this.removeLabel}>
         {this.state.removed ? this.props.i18n.text.get('plugin.guider.flags.confirmFlagDelete.deleted') : this.props.i18n.text.get('plugin.guider.flags.removeFlag.label')}
       </Button>
      </div>
    }
    let sliderPicker = <ChromePicker disableAlpha color={this.state.removed ? "#aaa" : this.state.color} onChange={this.onColorChange}/>
    let content = (closeDialog: ()=>any)=>{
      return (          
        <div style={{opacity: this.state.removed ? 0.5 : null}}>
          <div className="dialog__container dialog__container--color-picker">
            <div className="text text--label-update-dialog-icon" style={{borderColor: this.state.removed ? "#aaa" : this.state.color}} onClick={ this.onHandleClick }>
              <span className={`text__icon icon-tag`} style={{color: this.state.removed ? "#aaa" : this.state.color}}/>
            </div>
            {this.state.displayColorPicker ? <div className="color-picker">
              <div className="color-picker-overlay" onClick={ this.onHandleClose }/>
              {sliderPicker}
            </div> : null}
          </div>
          <div className="dialog__container dialog__container--form">
            <div className="form-element">
            <input placeholder={this.props.i18n.text.get('plugin.guider.flags.editFlagDialog.name')} value={this.state.name}
              className="form-element__input form-element__input--guider-label-name"
              disabled={this.state.removed}
              onChange={this.onNameChange}/>
            </div>
            <div className="form-element">
              <textarea placeholder={this.props.i18n.text.get('plugin.guider.flags.editFlagDialog.description')} className="form-element__textarea"
              value={this.state.description}
              disabled={this.state.removed}
              onChange={this.onDescriptionChange}/>
            </div>
          </div>
        </div>
      )
    }
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} onKeyStroke={this.handleKeydown} onOpen={this.resetState} modifier="guider" 
     title={this.props.i18n.text.get('plugin.guider.flags.editFlagDialog.title', this.props.label.name)}
     content={content} footer={footer}>{this.props.children}</Dialog>
  } 
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({updateGuiderFilterLabel, removeGuiderFilterLabel}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderLabelUpdateDialog);