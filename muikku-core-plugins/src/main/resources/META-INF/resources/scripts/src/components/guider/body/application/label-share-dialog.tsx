import * as React from 'react';
import Dialog from '~/components/general/dialog';
import Link from '~/components/general/link';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AnyActionType} from '~/actions';
import {i18nType } from '~/reducers/base/i18n';
import mApi from '~/lib/mApi';

import '~/sass/elements/container.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import { GuiderUserLabelType } from '~/reducers/main-function/guider/guider-filters';
import { UpdateGuiderFilterLabelTriggerType, RemoveGuiderFilterLabelTriggerType, updateGuiderFilterLabel, removeGuiderFilterLabel } from '~/actions/main-function/guider/guider-filters';

import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import { StaffRecepientType, UserIndexType, UserType } from '~/reducers/main-function/user-index';
import promisify from '~/util/promisify';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import { loadUserIndexBySchoolData, LoadUserIndexBySchoolDataTriggerType } from '~/actions/main-function/user-index';

const KEYCODES = {
  ENTER: 13
}

interface GuiderLabelShareDialogProps {
  children: React.ReactElement<any>,
  label: GuiderUserLabelType,
  isOpen: boolean,
  onClose: ()=>any,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType,
  loadUserIndexBySchoolData: LoadUserIndexBySchoolDataTriggerType,
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
  componentDidMount(){
    this.getShares();
  }
  componentWillReceiveProps(nextProps: GuiderLabelShareDialogProps){
    if (nextProps.userIndex !== this.props.userIndex){
      this.updateSharesState();
    }
  }
  updateSharesState(){
    //HAXING THIS IN, since there's no such way to retrieve a staff user from the user index
    this.setState({
      selectedItems: this.sharesResult.map((result:any)=>{
        let user:UserType = this.props.userIndex.usersBySchoolData[result.id];
        if (!user){
          return null;
        }
        return {
          type: "staff",
          value: {
            id: result.id,
            email: "unknown",
            firstName: user.firstName,
            lastName: user.lastName,
            properties: {},
            userEntityId: user.id
          }
        }
      }).filter((r:StaffRecepientType)=>r!==null)
    })
  }
  async getShares(){
    try {
      this.sharesResult = await promisify(mApi().user.flags.shares.read(this.props.label.id), 'callback')();
      this.sharesResult.forEach((user: any)=>{
        this.props.loadUserIndexBySchoolData(user.userIdentifier)
      });
      this.updateSharesState();
    } catch (e){
      this.props.displayNotification(e.message, "error");
    }
  }
  share(closeDialog: ()=>any){
    closeDialog();
  }
  onSharedMembersChange(members: StaffRecepientType[]){
    this.setState({selectedItems: members});
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
      return <div className="container container--full">
        <Link className="button button--warn button--standard-cancel" onClick={closeDialog}>
         {this.props.i18n.text.get('TODO CANCEL')}
        </Link>
        <Link className="button button--standard-ok" onClick={this.share.bind(this, closeDialog)}>
          {this.props.i18n.text.get('TODO SHARE')}
        </Link>
      </div>
    }
    let content = (closeDialog: ()=>any)=>{
      return (
        <InputContactsAutofill modifier="guider" onChange={this.onSharedMembersChange}
          selectedItems={this.state.selectedItems} hasGroupPermission={false} hasUserPermission={false}
          hasWorkspacePermission={false} hasStaffPermission autofocus showEmails={false}/>
      )
    }
    
    //TODO UKKONEN
    //PLEASE MAKE THIS DIALOG LARGER, IT HAS AN INPUT CONTACTS AUTOFILL AND ITS A PAIN
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} modifier="guider" 
     title={this.props.i18n.text.get('TODO SHARE LABEL')}
     content={content} footer={footer}>{this.props.children}</Dialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    userIndex: state.userIndex
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({displayNotification, loadUserIndexBySchoolData}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(GuiderLabelShareDialog);