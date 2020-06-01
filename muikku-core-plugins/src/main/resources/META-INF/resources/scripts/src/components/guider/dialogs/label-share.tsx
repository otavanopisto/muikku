import * as React from 'react';
import Dialog from '~/components/general/dialog';
import Link from '~/components/general/link';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AnyActionType} from '~/actions';
import {i18nType } from '~/reducers/base/i18n';
import mApi from '~/lib/mApi';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import { GuiderUserLabelType } from '~/reducers/main-function/guider';

import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import { StaffRecepientType, UserIndexType, UserType } from '~/reducers/main-function/user-index';
import promisify from '~/util/promisify';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';

const KEYCODES = {
  ENTER: 13
}

interface GuiderLabelShareDialogProps {
  children: React.ReactElement<any>,
  label: GuiderUserLabelType,
  isOpen?: boolean,
  onClose?: ()=>any,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType,
  userIndex: UserIndexType
}

interface GuiderLabelShareDialogState {
  selectedItems: StaffRecepientType[]
}


class GuiderLabelShareDialog extends React.Component<GuiderLabelShareDialogProps, GuiderLabelShareDialogState> {
  sharesResult: any;
  constructor(props: GuiderLabelShareDialogProps){
    super(props);
    
    this.share = this.share.bind(this);
    this.getShares = this.getShares.bind(this);
    this.onSharedMembersChange = this.onSharedMembersChange.bind(this);
    this.updateSharesState = this.updateSharesState.bind(this);
    
    this.sharesResult = [];
    
    this.state = {
      selectedItems: []
    }
  }
  componentWillReceiveProps(nextProps: GuiderLabelShareDialogProps){
    if (nextProps.userIndex !== this.props.userIndex){
      this.updateSharesState(nextProps);
    }
  }
  updateSharesState(props=this.props){
    this.setState({
      selectedItems: this.sharesResult.map((result:any)=>{
        return {
          type: "staff",
          value: {
            id: result.user.userIdentifier,
            email: "unknown",
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            properties: {},
            userEntityId: result.user.userEntityId
          }
        }
      }).filter((r:StaffRecepientType)=>r!==null)
    })
  }
  async getShares(){
    this.setState({selectedItems: []});
    try {
      this.sharesResult = await promisify(mApi().user.flags.shares.read(this.props.label.id), 'callback')();
      this.updateSharesState();
    } catch (e){
      this.props.displayNotification(e.message, "error");
    }
  }
  share(closeDialog: ()=>any){
    this.state.selectedItems.forEach(async (member:StaffRecepientType)=>{
      let wasAdded = !this.sharesResult.find((share:any)=>{return share.userIdentifier === member.value.id});
      if (wasAdded){
        try {
          await promisify(mApi().user.flags.shares.create(this.props.label.id, {
            flagId: this.props.label.id,
            userIdentifier: member.value.id
          }), 'callback')();
        } catch (e) {
          this.props.displayNotification(e.message, "error");
        }
      }
    });
    this.sharesResult.forEach(async (share:any)=>{
      let wasRemoved = !this.state.selectedItems.find((member:StaffRecepientType)=>{return member.value.id === share.userIdentifier});
      if (wasRemoved){
        try {
          await promisify(mApi().user.flags.shares.del(this.props.label.id, share.id), 'callback')();
        } catch (e) {
          this.props.displayNotification(e.message, "error");
        }
      }
    });
    closeDialog();
  }
  onSharedMembersChange(members: StaffRecepientType[]){
    this.setState({selectedItems: members});
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["cancel", "standard-cancel"]} onClick={closeDialog}>
          {this.props.i18n.text.get('plugin.guider.flags.editFlagDialog.cancel')}
        </Button>
        <Button buttonModifiers={["success", "standard-ok"]} onClick={this.share.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.guider.flags.shareFlagDialog.save')}
        </Button>
      </div>
    }
    let content = (closeDialog: ()=>any)=>{
      return (
        <InputContactsAutofill modifier="guider" onChange={this.onSharedMembersChange}
          selectedItems={this.state.selectedItems} hasGroupPermission={false} hasUserPermission={false}
          hasWorkspacePermission={false} hasStaffPermission autofocus showEmails={false} showFullNames/>
      )
    }
    
    //TODO UKKONEN
    //PLEASE MAKE THIS DIALOG LARGER, IT HAS AN INPUT CONTACTS AUTOFILL AND ITS A PAIN
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} onOpen={this.getShares} modifier="guider" 
     title={this.props.i18n.text.get('plugin.guider.flags.shareFlagDialog.title', this.props.label.name)}
     content={content} footer={footer}>{this.props.children}</Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    userIndex: state.userIndex
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({displayNotification}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderLabelShareDialog);