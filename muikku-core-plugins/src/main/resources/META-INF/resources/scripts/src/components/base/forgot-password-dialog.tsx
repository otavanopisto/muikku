import Dialog from '~/components/general/dialog';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

interface ForgotPasswordDialogProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  classNameExtension: string
}

interface ForgotPasswordDialogState {
  
}

class ForgotPasswordDialog extends React.Component<ForgotPasswordDialogProps, ForgotPasswordDialogState> {
  render(){
    let content = (closeDialog: ()=>any)=><div>
        {this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.instructions')}
        <br/>
        <br/>
        <form className="form">
          <div className="form-row">
            <label htmlFor="forgotpassword-email">{this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.email')}</label>
              <input type="text" name="email"/>
              <input type="submit" className="form-hidden" id="form-reset-password-submit"/>
          </div>
        </form>
      </div>;
    let footer = (closeDialog: ()=>any)=>{
      return <div>
        <label htmlFor="form-reset-password-submit" className="button button-large">
          {this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.sendButtonLabel')}
        </label>
        <Link className="button button-large button-warn" onClick={closeDialog}>
          {this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.cancelButtonLabel')}
        </Link>
      </div>
    }
    return <Dialog title={this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.title')}
      content={content} footer={footer} classNameExtension={this.props.classNameExtension}>
        {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordDialog);