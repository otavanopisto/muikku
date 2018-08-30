import * as React from "react";
import { HTMLtoReactComponent, guidGenerator } from "~/util/modifiers";
import $ from '~/lib/jquery';

interface MathFieldProps {
  className?: string,
  formulaClassName: string,
  value: string,
  onChange: (value: string)=>any
}

interface MathFieldState {
  value: string,
  selectedFormulaId: string
}

export default class TextField extends React.Component<MathFieldProps, MathFieldState> {
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      value: props.value,
      selectedFormulaId: null
    }
    
    this.selectFormula = this.selectFormula.bind(this);
  }
  shouldComponentUpdate(nextProps: MathFieldProps){
    return nextProps.value !== this.state.value;
  }
  selectFormula(formulaId: string){
    this.setState({
      selectedFormulaId: formulaId
    });
  }
  render(){
    return <div className={this.props.className} contentEditable spellCheck={false}>{
      HTMLtoReactComponent($("<container>" + this.state.value + "</container>")[0], (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
        if (Tag === "container"){
          return children;
        } else if (Tag === "span" && elementProps.className === this.props.formulaClassName && elementProps.key !== this.state.selectedFormulaId) {
          if (!elementProps.dataKey){
            elementProps.key = guidGenerator();
          }
          elementProps.onClick = this.selectFormula.bind(this, elementProps.key);
        }
        
        if (Tag === "span" && elementProps.className === this.props.formulaClassName && elementProps.key === this.state.selectedFormulaId){
          //TODO return editable math
        }
        return <Tag {...elementProps}>{children}</Tag>
      })
    }</div>
  }
}