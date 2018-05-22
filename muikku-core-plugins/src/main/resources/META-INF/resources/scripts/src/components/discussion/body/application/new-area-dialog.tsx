import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import JumboDialog from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
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

class DiscussionNewArea extends React.Component<DiscussionNewAreaProps, DiscussionNewAreaState> {
  constructor(props: DiscussionNewAreaProps){
    super(props);
    
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.createArea = this.createArea.bind(this);
    
    this.state = {
      name: "",
      description: "",
      locked: false
    }
  }
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setState({description: e.target.value});
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({name: e.target.value});
  }
  createArea(closeDialog: ()=>any){
    this.setState({locked: true});
    this.props.createDiscussionArea({
      name: this.state.name,
      description: this.state.description,
      success: ()=>{
        this.setState({name: "", description: "", locked: false});
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
        <div className="environment-dialog__form-element--wrapper">  
          <div className="environment-dialog__form-element-label">{this.props.i18n.text.get('plugin.discussion.createarea.name')}</div>          
            <input key="1" type="text" className="environment-dialog__form-element environment-dialog__form-element--new-discussion-area-name"          
            value={this.state.name} onChange={this.onNameChange} autoFocus/>
          </div>
       </div>
      ),(          
         <div className="container container--new-discussion-area-description">   
           <div className="environment-dialog__form-element--wrapper">  
             <div className="environment-dialog__form-element-label">{this.props.i18n.text.get('plugin.discussion.createarea.description')}</div>          
             <textarea key="2" className="environment-dialog__form-element environment-dialog__form-element--new-discussion-area-description"
             onChange={this.onDescriptionChange} value={this.state.description}/>            
           </div> 
         </div>
        )
         
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="environment-dialog__button-container">
          <Button className="button button-dialog--execute" onClick={this.createArea.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createarea.send')}
          </Button>
          <Button className="button button-dialog--cancel" onClick={closeDialog}>
            {this.props.i18n.text.get('plugin.discussion.createarea.cancel')}
          </Button>
        </div>
      )
    }
    
    return <JumboDialog modifier="new-area"
      title={this.props.i18n.text.get('plugin.discussion.createarea.topic')}
      content={content} footer={footer}>
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