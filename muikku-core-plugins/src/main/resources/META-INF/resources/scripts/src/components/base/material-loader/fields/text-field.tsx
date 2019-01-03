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
  },
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  readOnly?: boolean,
  value?: string
}

interface TextFieldState {
  value: string,
  modified: boolean,
  synced: boolean
}

export default class TextField extends React.Component<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps){
    super(props);
    
    this.state = {
      value: props.value || '',
      modified: false,
      synced: true
    }
    
    this.onInputChange = this.onInputChange.bind(this);
  }
  componentWillReceiveProps(nextProps: TextFieldProps){
    if (nextProps.value !== this.state.value){
      this.setState({
        value: nextProps.value || ''
      });
    }
    
    this.setState({
      modified: false,
      synced: true
    });
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