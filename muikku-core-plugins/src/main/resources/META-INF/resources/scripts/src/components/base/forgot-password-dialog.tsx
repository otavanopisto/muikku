import Dialog from '~/components/general/dialog';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/buttons.scss';

interface ForgotPasswordDialogProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  modifier?: string
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
          <div className="form_element">
            <label className="form-element__label" htmlFor="forgotpassword-email">{this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.email')}</label>
            <input type="text" name="email" className="form-element__input form-element__input--forgotpassword"/>
            <input type="submit" className="form__hidden" id="form-reset-password-submit"/>
          </div>
        </form>
      </div>;
    let footer = (closeDialog: ()=>any)=>{
      return <div>
        <Link className="button button--forgotpassword-dialog-cancel button--cancel" onClick={closeDialog}>
          {this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.cancelButtonLabel')}
        </Link>
        <label htmlFor="form-reset-password-submit" className="button button--forgotpassword-dialog-submit button--success">
          {this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.sendButtonLabel')}
        </label>
      </div>
    }
    return <Dialog title={this.props.i18n.text.get('plugin.forgotpassword.forgotPasswordDialog.title')}
      content={content} footer={footer} modifier={this.props.modifier ? ["forgot-password", this.props.modifier] : "forgot-password"}>
        {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordDialog);