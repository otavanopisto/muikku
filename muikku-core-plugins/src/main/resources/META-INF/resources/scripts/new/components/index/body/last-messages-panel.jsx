class LastMessagesPanel extends React.Component {
  render(){
    return (<div className="ordered-container-item index panel">
      <div className="index text index-text-for-panels-title index-text-for-panels-title-last-messages">
        <span className="icon icon-envelope"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.communicator.lastMessages')}</span>
      </div>
      <div data-controller-widget="panel-last-messages"></div>
    </div>);
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

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(LastMessagesPanel);