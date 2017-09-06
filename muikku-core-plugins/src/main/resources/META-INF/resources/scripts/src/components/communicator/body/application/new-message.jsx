//<div class="communicator jumbo-dialog">
//  <div class="jumbo-dialog-wrapper">
//    <div class="jumbo-dialog-window">
//    
//      <div class="jumbo-dialog-header">
//        <div class="jumbo-dialog-title">
//          {#localize key=""/}
//          <span class="jumbo-dialog-close icon icon-close"></span>
//        </div>
//      </div>
//      
//      <div class="communicator form-field communicator-form-field-new-message-recepients">
//        <input type="text" placeholder='{#localize key="plugin.communicator.createmessage.title.recipients"/}'></input>
//      </div>
//      <input type="text" class="communicator form-field communicator-form-field-new-message-subject" placeholder='{#localize key="plugin.communicator.createmessage.title.subject"/}'></input>
//      <textarea class="communicator form-field communicator-form-field-new-message-body"></textarea>
//      
//      {?signature}
//        <div class="communicator form-field communicator-form-field-signature-new-message-checkbox">
//          <input type="checkbox" checked="checked" />
//          {#localize key="plugin.communicator.createmessage.checkbox.signature"/}
//        </div>
//      {/signature}
//    </div>
//  </div>
//</div>

import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import JumboDialog from '~/components/general/jumbo-dialog.jsx';

class CommunicatorNewMessage extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }
  constructor(props){
    super(props);
  }
  render(){
    let content = (closeDialog) => <div>
      
    </div>
    
    return <JumboDialog classNameExtension="communicator"
      title={this.props.i18n.text.get('plugin.communicator.createmessage.topic')}
      content={content}>
      {this.props.children}
    </JumboDialog>
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
)(CommunicatorNewMessage);