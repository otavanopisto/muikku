import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AnyActionType } from '~/actions';
import { i18nType } from '~/reducers/base/i18n';
import Link from '~/components/general/link';
import Dialog from '~/components/general/dialog';
import { deleteSelectedAnnouncements, deleteCurrentAnnouncement,
  DeleteSelectedAnnouncementsTriggerType, DeleteCurrentAnnouncementTriggerType } from '~/actions/main-function/announcer/announcements';
import { AnnouncementType } from 'reducers/main-function/announcer/announcements';

interface DeleteAnnouncementDialogProps {
  i18n: i18nType,
  current?: boolean
  children: React.ReactElement<any>,
  deleteSelectedAnnouncements: DeleteSelectedAnnouncementsTriggerType,
  deleteCurrentAnnouncement: DeleteCurrentAnnouncementTriggerType
}

interface DeleteAnnouncementDialogState {
  locked: boolean
}

class DeleteAnnouncementDialog extends React.Component<DeleteAnnouncementDialogProps, DeleteAnnouncementDialogState> {
  constructor(props: DeleteAnnouncementDialogProps){
    super(props);
    
    this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
    
    this.state = {
      locked: false
    }
  }
  deleteAnnouncement(closeDialog: ()=>any){
    this.setState({locked: true});
    if (!this.props.current){
      this.props.deleteCurrentAnnouncement({
        success: ()=>{
          this.setState({locked: false});
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    } else {
      this.props.deleteSelectedAnnouncements({
        success: ()=>{
          this.setState({locked: false});
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => <div className="text text--delete-announcement">
      {this.props.i18n.text.get('TODO remove announcement messsage')}
    </div>
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div>
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog}>
            {this.props.i18n.text.get('TODO cancel remove announcement')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.deleteAnnouncement.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('TODO confirm remove announcement')}
          </Link>
        </div>
      )
    }
    
    return <Dialog modifier="delete-announcement"
      title={this.props.i18n.text.get('TODO remove announcement')}
      content={content} footer={footer}>
      {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    areas: state.areas,
    discussionThreads: state.discussionThreads
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({deleteSelectedAnnouncements, deleteCurrentAnnouncement}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DeleteAnnouncementDialog);