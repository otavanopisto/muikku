import * as React from "react";

interface TextFieldProps {
  type: string,
  content: {
    autogrow: boolean,
    columns: string,
    hint: string,
    name: string,
    rightAnswers: Array<{
      caseSensitive: boolean,
      correct: false,
      normalizeWhitespace: boolean,
      text: string
    }>
  }
}

interface TextFieldState {
  value: string
}

export default class TextField extends React.Component<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps){
    super(props);
    
    this.state = {
      value: ''
    }
    
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      value: e.target.value
    });
  }
  render(){
    return <input className="muikku-text-field muikku-field" type="text" value={this.state.value}
      size={this.props.content.columns && parseInt(this.props.content.columns)} placeholder={this.props.content.hint} onChange={this.onInputChange}/>
  }
}