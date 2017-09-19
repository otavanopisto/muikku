import Dialog from '~/components/general/dialog.tsx';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {connect} from 'react-redux';
import Link from '~/components/general/link.tsx';

class ForgotPasswordDialog extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    classNameExtension: PropTypes.string.isRequired
  }
  render(){
    let content = (closeDialog)=><div>
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
    let footer = (closeDialog)=>{
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

function mapStateToProps(state){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordDialog);