import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import JumboDialog from '~/components/general/jumbo-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import { DiscussionType } from '~/reducers/main-function/discussion';
import { createDiscussionThread, CreateDiscussionThreadTriggerType } from '~/actions/main-function/discussion';
import {StateType} from '~/reducers';

const ckEditorConfig = {
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ],
  draftKey: 'discussion-new-message',
  resize_enabled: false
}
const extraPlugins = {
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js'
}

interface DicussionNewThreadProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  discussion: DiscussionType,
  createDiscussionThread: CreateDiscussionThreadTriggerType
}

interface DicussionNewThreadState {
  text: string,
  title: string,
  locked: boolean,
  threadPinned: boolean,
  threadLocked: boolean,
  selectedAreaId: number
}

class DicussionNewThread extends React.Component<DicussionNewThreadProps, DicussionNewThreadState> {
  constructor(props: DicussionNewThreadProps){
    super(props);
    
    this.state = {
      text: "",
      title: "",
      locked: false,
      threadPinned: false,
      threadLocked: false,
      selectedAreaId: props.discussion.areas[0] && props.discussion.areas[0].id
    }
    
    this.togglePinned = this.togglePinned.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onAreaChange = this.onAreaChange.bind(this);
  }
  onCKEditorChange(text: string){
    this.setState({text});
  }
  createThread(closeDialog: ()=>any){
    this.props.createDiscussionThread({
      forumAreaId: this.state.selectedAreaId,
      locked: this.state.threadLocked,
      sticky: this.state.threadPinned,
      message: this.state.text,
      title: this.state.title,
      success: ()=>{
        this.setState({
          text: "",
          title: "",
          locked: false,
          threadLocked: false,
          threadPinned: false
        });
        closeDialog();
      },
      fail: ()=>{
        this.setState({
          locked: false
        });
      }
    });
  }
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({title: e.target.value});
  }
  togglePinned(){
    this.setState({threadPinned: !this.state.threadPinned});
  }
  toggleLocked(){
    this.setState({threadLocked: !this.state.threadLocked});
  }
  componentWillReceiveProps(nextProps: DicussionNewThreadProps){
    if (nextProps.discussion.areaId !== this.state.selectedAreaId){
      this.setState({selectedAreaId: nextProps.discussion.areaId || (nextProps.discussion.areas[0] && nextProps.discussion.areas[0].id)});
    }
  }
  onAreaChange(e: React.ChangeEvent<HTMLSelectElement>){
    this.setState({selectedAreaId: parseInt(e.target.value)});
  }
  render(){
    let content = (closeDialog: ()=>any) => [
       <div key="1" className="container container--new-discussion-options">
         <input className="form-field form-field--new-discussion-thread-title" placeholder={this.props.i18n.text.get('plugin.discussion.createmessage.title')}
           value={this.state.title} onChange={this.onTitleChange} autoFocus/>
         <select className="form-field form-field--new-discussion-thread-area" value={this.state.selectedAreaId} onChange={this.onAreaChange}>
           {this.props.discussion.areas.map((area)=><option key={area.id} value={area.id}>
             {area.name}
           </option>)}
         </select>
       </div>,
       <div key="2" className="container container--new-discussion-thread-states">
         <span className="text text--new-discussion-create-state">{this.props.i18n.text.get('plugin.discussion.createmessage.pinned')}</span>
         <input type="checkbox" className="form-field" checked={this.state.threadPinned} onChange={this.togglePinned}/>
         <span className="text text--new-discussion-create-state">{this.props.i18n.text.get('plugin.discussion.createmessage.locked')}</span>
         <input type="checkbox" className="form-field" checked={this.state.threadLocked} onChange={this.toggleLocked}/>
       </div>,
       <CKEditor key="3" width="100%" height="grow" configuration={ckEditorConfig} extraPlugins={extraPlugins}
         onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
        <div className="jumbo-dialog__button-container">
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.cancel')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.createThread.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.send')}
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="new-message"
      title={this.props.i18n.text.get('plugin.discussion.createmessage.topic')}
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
  return bindActionCreators({createDiscussionThread}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DicussionNewThread);
