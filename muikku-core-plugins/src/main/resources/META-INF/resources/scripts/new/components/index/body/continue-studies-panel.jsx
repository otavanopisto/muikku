//TODO please translate this... >:c
//You see those language strings...

import Link from '../../general/link.jsx';

class ContinueStudiesPanel extends React.Component {
  render(){
    if (!this.props.status.loggedIn){
      return null;
    }
    return (<div className="ordered-container-item index panel">
      <div className="index text index-text-for-panels-title index-text-for-panels-title-continue-studies">
        <span className="icon icon-revert"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.lastWorkspace.continueStudiesLink')}</span>
      </div>
      {this.props.lastWorkspace ? (
        <h2 className="index text index-text-panel-continue-studies-workspace-name">
          {this.props.lastWorkspace.workspaceName}
        </h2>
       ) : null}
      {this.props.lastWorkspace ? (<span className="index text index-text-panel-continue-studies">
         Olit vimeksi sivulla{" "}<b><i>{this.props.lastWorkspace.materialName}</i></b>{" "}
         <Link href={this.props.lastWorkspace.url}>Jatka opintoja</Link>
       </span>) : null}
    </div>);
  }
}

function mapStateToProps(state){
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.lastWorkspace
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ContinueStudiesPanel);