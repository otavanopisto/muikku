import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import JumboDialog from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {DiscussionAreaListType, DiscussionAreaType} from '~/reducers/main-function/discussion';
import {DiscussionType} from '~/reducers/main-function/discussion';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';

import '~/sass/elements/link.scss';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import { updateDiscussionArea, UpdateDiscussionAreaTriggerType } from '~/actions/main-function/discussion';
import {StateType} from '~/reducers';

interface DiscussionModifyAreaProps {
  i18n: i18nType,
  discussion: DiscussionType,
  children: React.ReactElement<any>,
  updateDiscussionArea: UpdateDiscussionAreaTriggerType
}

interface DiscussionModifyAreaState {
  name: string,
  description: string,
  locked: boolean
}

class DiscussionModifyArea extends SessionStateComponent<DiscussionModifyAreaProps, DiscussionModifyAreaState> {
  constructor(props: DiscussionModifyAreaProps){
    super(props, "discussion-modify-area-dialog");
    
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.modifyArea = this.modifyArea.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    
    let area = this.props.discussion.areas.find(area=>area.id === this.props.discussion.areaId);
    this.state = this.getRecoverStoredState({
      name: (area && area.name) || "",
      description: (area && area.description) || "",
      locked: false
    }, this.props.discussion.areaId)
  }
  clearUp(){
    let area = this.props.discussion.areas.find(area=>area.id === this.props.discussion.areaId);
    this.setStateAndClear({
      name: (area && area.name) || "",
      description: (area && area.description) || ""
    }, this.props.discussion.areaId)
  }
  checkAgainstStoredState(){
    let area = this.props.discussion.areas.find(area=>area.id === this.props.discussion.areaId);
    this.checkStoredAgainstThisState({
      name: (area && area.name) || "",
      description: (area && area.description) || ""
    }, this.props.discussion.areaId);
  }
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setStateAndStore({description: e.target.value}, this.props.discussion.areaId);
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setStateAndStore({name: e.target.value}, this.props.discussion.areaId);
  }
  componentWillReceiveProps(nextProps: DiscussionModifyAreaProps){
    let area = nextProps.discussion.areas.find(area=>area.id === nextProps.discussion.areaId);
    
    this.setState(this.getRecoverStoredState({
      name: (area && area.name) || "",
      description: (area && area.description) || ""
    }, nextProps.discussion.areaId));
  }
  modifyArea(closeDialog: ()=>any){
    this.setState({locked: true});
    this.props.updateDiscussionArea({
      id: this.props.discussion.areaId,
      name: this.state.name,
      description: this.state.description,
      success: ()=>{
        this.setState({locked: false});
        closeDialog();
      },
      fail: ()=>{
        this.setState({locked: false});
      }
    })
  }
  render(){
    let area = this.props.discussion.areas.find(area=>area.id === this.props.discussion.areaId);
    if (!area){
      return this.props.children;
    }
    
    let content = (closeDialog: ()=>any) => [
      (
      <div className="env-dialog__row" key="1">    
        <div className="env-dialog__form-element-container">  
          <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createarea.name')}</div>          
            <input type="text" className="env-dialog__input env-dialog__input--new-discussion-area-name"
            placeholder={this.props.i18n.text.get('plugin.discussion.createarea.name')}
            value={this.state.name} onChange={this.onNameChange} autoFocus/>
        </div>
      </div>          
      ),
      (
       <div className="env-dialog__row" key="2">          
         <div className="env-dialog__form-element-container">
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.editArea.description')}</div>          
           <textarea className="env-dialog__textarea"
            onChange={this.onDescriptionChange} value={this.state.description}/>
         </div>
       </div>
    )]
           
    let footer = (closeDialog: ()=>any)=>{
      return (          
        <div className="env-dialog__actions">
          <Button buttonModifiers="dialog-execute" onClick={this.modifyArea.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.editArea.send')}
          </Button>
          <Button buttonModifiers="dialog-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.editArea.cancel')}
          </Button>            
          {this.recovered ? <Button buttonModifiers="dialog-clear" onClick={this.clearUp} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.editArea.clearDraft')}
          </Button> : null}
        </div>
      )
    }
    
    return <JumboDialog modifier="modify-area"
      title={this.props.i18n.text.get('plugin.discussion.editArea.topic')}
      content={content} footer={footer} onOpen={this.checkAgainstStoredState}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    discussion: state.discussion
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({updateDiscussionArea}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionModifyArea);