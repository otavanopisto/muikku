import * as React from 'react';
import Portal from '~/components/general/portal';

import '~/sass/elements/material-editor.scss';
import { bindActionCreators } from 'redux';
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType } from '~/actions/workspaces';
import { connect, Dispatch } from 'react-redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { WorkspaceMaterialEditorType } from "~/reducers/workspaces";

interface MaterialEditorProps {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  i18n: i18nType,
  editorState: WorkspaceMaterialEditorType
}

interface MaterialEditorState {
  visible: boolean
}

class MaterialEditor extends React.Component<MaterialEditorProps, MaterialEditorState> {
  private oldOverflow:string;

  constructor(props: MaterialEditorProps){
    super(props);
    
    this.state = {
      visible: false
    }

    this.beforeClose = this.beforeClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }
  
  beforeClose(DOMNode: HTMLElement, removeFromDOM: ()=>any){
    this.setState({
      visible: false
    });
    this.props.setWorkspaceMaterialEditorState({...this.props.editorState, opened: false});
    setTimeout(removeFromDOM, 300);
  }
  
  onOpen() {
    setTimeout(()=>{
      this.setState({
        visible: true
      });
    }, 10);
  }

  render(){
    return (<Portal isOpen={this.props.editorState.opened}
        onOpen={this.onOpen} beforeClose={this.beforeClose} closeOnEsc>
        {(closePortal: ()=>any)=>{
          return <div
            className={`material-editor ${this.state.visible ? "material-editor--visible" : ""}`}
          >
            <button onClick={closePortal}>close</button>
          </div>
        }}
    </Portal>);
  }
}
  
function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    editorState: state.workspaces.materialEditor,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({setWorkspaceMaterialEditorState}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialEditor);