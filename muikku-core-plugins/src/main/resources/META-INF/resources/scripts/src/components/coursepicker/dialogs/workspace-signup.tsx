import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import Dialog from '~/components/general/dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';

import '~/sass/elements/buttons.scss';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';
import { signupIntoWorkspace, SignupIntoWorkspaceTriggerType } from '~/actions/workspaces';
import { bindActionCreators } from 'redux';
import { WorkspaceType } from '~/reducers/workspaces';

interface WorkspaceSignupDialogProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  workspace: WorkspaceType,
  signupIntoWorkspace: SignupIntoWorkspaceTriggerType
}

interface WorkspaceSignupDialogState {
  locked: boolean,
  message: string
}

class WorkspaceSignupDialog extends React.Component<WorkspaceSignupDialogProps, WorkspaceSignupDialogState> {
  constructor(props: WorkspaceSignupDialogProps){
    super(props);
    this.state = {
      locked: false,
      message: ""
    }
    
    this.updateMessage = this.updateMessage.bind(this);
    this.signup = this.signup.bind(this);
  }
  updateMessage(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setState({message: e.target.value});
  }
  signup(closeDialog: ()=>any){
    this.setState({locked: true});
    this.props.signupIntoWorkspace({
      workspace: this.props.workspace,
      success: ()=>{
        this.setState({locked: false, message: ""});
        closeDialog();
      },
      fail: ()=>{
        this.setState({locked: false});
      },
      message: this.state.message
    });
  }
  render(){
    let content = (closeDialog: ()=>any) => <div>
      <div>
        <div className="dialog__content-row">{this.props.i18n.text.get('plugin.workspaceSignUp.courseDescription', this.props.workspace.name,
            this.props.workspace.nameExtension || "")}</div>
        {this.props.workspace.feeInfo && this.props.workspace.feeInfo.evaluationHasFee ?
          <div className="form-element dialog__content-row">
            <p><label>{this.props.i18n.text.get('plugin.workspaceSignUp.fee.label')}</label></p>
            <p><span>{this.props.i18n.text.get('plugin.workspaceSignUp.fee.content')}</span></p>
          </div> : null}
        <div className="form-element dialog__content-row">
          <p><label>{this.props.i18n.text.get('plugin.workspaceSignUp.messageLabel')}</label></p>
          <p><textarea className="form-element__textarea" value={this.state.message} onChange={this.updateMessage}/></p>
        </div>
      </div>
    </div>
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "info"]} onClick={this.signup.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.workspaceSignUp.signupButtonLabel')}
          </Button>  
        </div>
      )
    }
    
    return <Dialog modifier="workspace-signup-dialog"
      title={this.props.i18n.text.get('plugin.workspaceSignUp.title')}
      content={content} footer={footer}>
      {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({signupIntoWorkspace}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSignupDialog);