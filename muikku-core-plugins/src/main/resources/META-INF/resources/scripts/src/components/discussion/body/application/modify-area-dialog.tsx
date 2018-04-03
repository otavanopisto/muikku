import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import JumboDialog from '~/components/general/jumbo-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {DiscussionAreaListType, DiscussionAreaType} from '~/reducers/main-function/discussion';
import {DiscussionType} from '~/reducers/main-function/discussion';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
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

class DiscussionModifyArea extends React.Component<DiscussionModifyAreaProps, DiscussionModifyAreaState> {
  private area:DiscussionAreaType;
  
  constructor(props: DiscussionModifyAreaProps){
    super(props);
    
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.modifyArea = this.modifyArea.bind(this);
    
    this.area = this.props.discussion.areas.find(area=>area.id === this.props.discussion.areaId);
    
    this.state = {
      name: (this.area && this.area.name) || "",
      description: (this.area && this.area.description) || "",
      locked: false
    }
  }
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setState({description: e.target.value});
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({name: e.target.value});
  }
  componentWillReceiveProps(nextProps: DiscussionModifyAreaProps){
    this.area = nextProps.discussion.areas.find(area=>area.id === nextProps.discussion.areaId);
    
    this.setState({
      name: (this.area && this.area.name) || "",
      description: (this.area && this.area.description) || ""
    });
  }
  modifyArea(closeDialog: ()=>any){
    this.setState({locked: true});
    this.props.updateDiscussionArea({
      id: this.area.id,
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
    if (!this.area){
      return this.props.children;
    }

    
    
    let content = (closeDialog: ()=>any) => [
      (
      <div className="container container--new-discussion-area-title">          
        <input key="1" type="text" className="form-field form-field--new-discussion-area-name"
        placeholder={this.props.i18n.text.get('plugin.discussion.createarea.name')}
        value={this.state.name} onChange={this.onNameChange} autoFocus/>
      </div>    
      
      ),

      (
       <div className="container container--new-discussion-area-description">          
         <textarea key="2" className="form-field form-field--new-discussion-area-description"
        onChange={this.onDescriptionChange} value={this.state.description}/>
       </div>
    )]
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="jumbo-dialog__button-container">
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog}>
            {this.props.i18n.text.get('plugin.discussion.createarea.cancel')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.modifyArea.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createarea.send')}
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="modify-area"
      title={this.props.i18n.text.get('plugin.discussion.createarea.topic')}
      content={content} footer={footer}>
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