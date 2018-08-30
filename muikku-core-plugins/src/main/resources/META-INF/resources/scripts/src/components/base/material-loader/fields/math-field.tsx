import * as React from "react";
import MathField from './better-math-field';

interface MathFieldProps {
  type: string,
  content: {
    name: string
  }
}

interface MathFieldState {
  value: string
}

export default class TextField extends React.Component<MathFieldProps, MathFieldState> {
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      value: ""
    }
    
    this.setValue = this.setValue.bind(this);
  }
  setValue(newValue: string){
    this.setState({
      value: newValue
    });
  }
  render(){
    return <MathField className="muikku-math-exercise-field-editor"
      value={this.state.value} onChange={this.setValue}
      formulaClassName="muikku-math-exercise-formula"/>
  }
}