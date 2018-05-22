import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import JumboDialog from '~/components/general/jumbo-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import {createDiscussionArea, CreateDiscussionAreaTriggerType} from '~/actions/main-function/discussion';
import {StateType} from '~/reducers';

interface DiscussionNewAreaProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  createDiscussionArea: CreateDiscussionAreaTriggerType
}

interface DiscussionNewAreaState {
  name: string,
  description: string,
  locked: boolean
}

class DiscussionNewArea extends SessionStateComponent<DiscussionNewAreaProps, DiscussionNewAreaState> {
  constructor(props: DiscussionNewAreaProps){
    super(props, "discussion-new-area");
    
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.createArea = this.createArea.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    
    this.state = this.getRecoverStoredState({
      name: "",
      description: "",
      locked: false
    })
  }
  checkAgainstStoredState(){
    this.checkAgainstDefaultState({
      name: "",
      description: ""
    });
  }
  clearUp(){
    this.setStateAndClear({
      name: "",
      description: ""
    });
  }
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setStateAndStore({description: e.target.value});
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setStateAndStore({name: e.target.value});
  }
  createArea(closeDialog: ()=>any){
    this.setState({locked: true});
    this.props.createDiscussionArea({
      name: this.state.name,
      description: this.state.description,
      success: ()=>{
        this.setStateAndClear({name: "", description: "", locked: false});
        closeDialog();
      },
      fail: ()=>{
        this.setState({locked: false});
      }
    })
  }
  render(){
    let content = (closeDialog: ()=>any) => [
      (   
       <div className="container container--new-discussion-area-title">             
         <input key="1" type="text" className="form-field form-field--new-discussion-area-name"
        placeholder={this.props.i18n.text.get('plugin.discussion.createarea.name')}
        value={this.state.name} onChange={this.onNameChange} autoFocus/>
       </div>
      ),(
         <div className="container container--new-discussion-area-description">   
         <textarea key="2" placeholder={this.props.i18n.text.get('plugin.discussion.createarea.description')} className="form-field form-field--new-discussion-area-description"
       onChange={this.onDescriptionChange} value={this.state.description}/>
         </div>
        )
         
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="jumbo-dialog__button-container">
          {this.recovered ? <Button buttonModifiers="danger" onClick={this.clearUp} disabled={this.state.locked}>
            {this.props.i18n.text.get('clear draft')}
          </Button> : null}
          <Button buttonModifiers={["warn", "standard-cancel"]} onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createarea.cancel')}
          </Button>
          <Button buttonModifiers="standard-ok" onClick={this.createArea.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createarea.send')}
          </Button>
        </div>
      )
    }
    
    return <JumboDialog modifier="new-area"
      title={this.props.i18n.text.get('plugin.discussion.createarea.topic')}
      content={content} footer={footer} onOpen={this.checkAgainstStoredState}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({createDiscussionArea}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionNewArea);