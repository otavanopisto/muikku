import * as React from "react";
import { connect, Dispatch } from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";


interface AddProducerProps {
  producers?: Array<any>,
  addProducer: (name:string)=>any,
  removeProducer?: (index:number)=>any,
  modifier?: string
  i18n: i18nType,
}

interface AddProducerState {
  currentInputValue: string
}

export default class AddProducer extends React.Component<AddProducerProps, AddProducerState> {
  constructor(props: AddProducerProps) {
    super(props);    
    
    this.state = {
      currentInputValue: "desd"
     }
    
    this.updateInputValue = this.updateInputValue.bind(this);
    this.addProducerByClick = this.addProducerByClick.bind(this);
    this.removeProducerByClick = this.removeProducerByClick.bind(this);
    this.checkIfEnterKeyIsPressedAndAddProducer = this.checkIfEnterKeyIsPressedAndAddProducer.bind(this);
  }
  updateInputValue(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      currentInputValue: e.target.value
    });
  }
  checkIfEnterKeyIsPressedAndAddProducer(e: React.KeyboardEvent<HTMLInputElement>){
    let input = (document.getElementById("addProducer") as HTMLInputElement).value;
    if (e.keyCode == 13 && input.length > 2) {
      this.props.addProducer(this.state.currentInputValue);
    }
  }
  addProducerByClick(){
   let input = (document.getElementById("addProducer") as HTMLInputElement).value;
   let test = this.state.currentInputValue;
    if (input.length > 2) {
      this.props.addProducer(this.state.currentInputValue);
    } 
  }
  removeProducerByClick(index: number){
       this.props.removeProducer(index);
   }
  
  render(){
    return( <div className="material-editor__sub-section">
      <h3 className="material-editor__sub-title">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.subTitle.producers")}</h3>
      <div className="material-editor__add-producers-container">
        <div className="form-element form-element--material-editor-add-producers">
          <input id="addProducer" value={this.state.currentInputValue} onKeyUp={this.checkIfEnterKeyIsPressedAndAddProducer} onChange={this.updateInputValue} placeholder={this.props.i18n.text.get('plugin.workspace.materialsManagement.editorView.addProducers.placeHolder')} className="form-element__input form-element__input--material-editor-add-producer" type="text" />
          <div className="form-element__input-decoration--material-editor-add-producer icon-add" onClick={this.addProducerByClick}></div>
        </div>
      </div>
      <div className="material-editor__list-producers-container">
        {this.props.producers.map((p:any, index:number) => {
          return <div className="material-editor__producer" key={index}>{p.name}<span className="material-editor__remove-producer icon-close" onClick={this.removeProducerByClick.bind(this, index)}></span></div>
        })}
      </div>
    </div>
    )
  }
}



//<section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
//<h2 className="application-sub-panel__header">{this.props.i18n.text.get("plugin.workspace.management.workspaceProducersSectionTitle")}</h2>
//<input type="text" className="form-element__input"
//value={this.state.currentWorkspaceProducerInputValue} onChange={this.updateCurrentWorkspaceProducerInputValue}
//onKeyUp={this.checkIfEnterKeyIsPressedAndAddProducer}/>
//<Button onClick={this.addProducer.bind(this, this.state.currentWorkspaceProducerInputValue)}>
//{this.props.i18n.text.get("TODO Add workspace producer")}
//</Button>
//<div>
//{this.state.workspaceProducers && this.state.workspaceProducers.map((producer, index) => {
//  return <span className="" key={index}>
//    {producer.name}
//    <ButtonPill icon="close" onClick={this.removeProducer.bind(this, index)}/>
//  </span>
//})}
//</div>
//</section>
