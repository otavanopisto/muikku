import * as React from "react";
import equals = require("deep-equal");

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
  },
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  readOnly?: boolean,
  initialValue?: string
}

interface TextFieldState {
  value: string,
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class TextField extends React.Component<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps){
    super(props);
    
    this.state = {
      value: props.initialValue || '',
      modified: false,
      synced: true,
      syncError: null
    }
    
    this.onInputChange = this.onInputChange.bind(this);
  }
  shouldComponentUpdate(nextProps: TextFieldProps, nextState: TextFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState({
      value: e.target.value
    });
  }
  render(){
    if (this.props.readOnly){
      return <div className="muikku-text-field muikku-field">{this.state.value}</div>
    }
    return <input className="muikku-text-field muikku-field" type="text" value={this.state.value}
      size={this.props.content.columns && parseInt(this.props.content.columns)} placeholder={this.props.content.hint} onChange={this.onInputChange}/>
  }
}