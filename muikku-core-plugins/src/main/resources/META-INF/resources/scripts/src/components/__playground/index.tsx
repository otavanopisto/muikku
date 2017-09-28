import * as React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/java';
import 'brace/theme/github';

interface PlaygroundProps {
  
}

interface PlaygroundState {
  html: string,
  codeDisplayed: boolean
}

export default class Playground extends React.Component<PlaygroundProps, PlaygroundState> {
  constructor(props: PlaygroundProps){
    super(props);
    
    this.onChange = this.onChange.bind(this);
    this.reloadStylesheets = this.reloadStylesheets.bind(this);
    
    this.state = {
      html: localStorage.getItem('HTML') || "",
      codeDisplayed: true
    }
  }
  reloadStylesheets(){
    console.log("reloading stylesheets");
    let links = document.getElementsByTagName("link");
    for (let i = 0; i < links.length;i++) {
      let link = links[i];
      if (link.rel === "stylesheet") {
        link.href += "?";
      }
    }
  }
  componentDidMount(){
    document.addEventListener("keyup", (e)=>{
      if (e.keyCode == 27 && !e.ctrlKey) {
        console.log("toggling console");
        this.setState({codeDisplayed: !this.state.codeDisplayed})
      } else if (e.keyCode == 27 && e.ctrlKey){
        this.reloadStylesheets();
      }
    });
  }
  onChange(newHTML: string){
    this.setState({html: newHTML});
    localStorage.setItem('HTML', newHTML);
  }
  render(){
    let style = {width:"100%",height:"100%"};
    let codeThingStyle = {
      position: "fixed" as "fixed",
      width: "35%",
      height: "100%",
      display: this.state.codeDisplayed ? "block" : "none",
      backgroundColor: "white",
      right: 0,
      top: 0,
      borderLeft: "solid 1px #ccc",
      zIndex: 99999999999
    }
    return <div style={Object.assign(style, {zIndex: 99999999999})}>
      <div style={style} dangerouslySetInnerHTML={{__html: this.state.html}}></div>
      <div style={codeThingStyle}>
        <AceEditor
          focus
          mode="html"
          theme="github"
          onChange={this.onChange}
          value={this.state.html}
          name="html"
          editorProps={{$blockScrolling: true}}
          width="100%" height="100%"
        />
      </div>
    </div>
  }
}