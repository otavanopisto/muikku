import Dialog from '~/components/general/dialog';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/buttons.scss';
import Button from '~/components/general/button';
import { IAvailableChatRoomType } from './chat';
import mApi from '~/lib/mApi';
import promisify from '~/util/promisify';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import { bindActionCreators } from 'redux';

interface DeleteRoomDialogProps {
  i18n: i18nType,

  chat: IAvailableChatRoomType;

  displayNotification: DisplayNotificationTriggerType;

  isOpen: boolean,
  onClose: ()=>any,
  onDelete: ()=>any;
}

interface DeleteRoomDialogState {

}

class DeleteRoomDialog extends React.Component<DeleteRoomDialogProps, DeleteRoomDialogState> {
  constructor(props: DeleteRoomDialogProps){
    super(props);

    this.delete = this.delete.bind(this);
  }
  async delete(closeDialog: ()=>any){
    try {
      await (promisify(mApi().chat.publicRoom.del({
        name: this.props.chat.roomJID,
      }), 'callback')());
      closeDialog();
      this.props.displayNotification(this.props.i18n.text.get("plugins.chat.rooms.deleteSuccess"), "success");
      this.props.onDelete();
    } catch {
      this.props.displayNotification(this.props.i18n.text.get("plugins.chat.rooms.deleteFail"), "error");
    }
  }
  render(){
    let content = (closeDialog: ()=>any)=><div>
        <span>{this.props.i18n.text.get('plugin.chat.rooms.deleteRoomDesc', this.props.chat.roomName)}</span>
      </div>;
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["fatal","standard-ok"]} onClick={this.delete.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.chat.button.delete')}
        </Button>
        <Button buttonModifiers={["cancel","standard-cancel"]} onClick={closeDialog}>
          {this.props.i18n.text.get('plugin.chat.button.cancel')}
        </Button>
      </div>
    }
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} title={this.props.i18n.text.get('plugin.chat.rooms.deleteRoomTitle')}
      content={content} footer={footer} modifier="delete-room"/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({displayNotification}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteRoomDialog);
