import * as React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/html';
import 'brace/theme/github';
import '~/sass/elements/rich-text.scss';



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
    this.showURLEncoded = this.showURLEncoded.bind(this);
    
    let data = window.location.hash.replace("#","").split("?")[1];
    let def;
    if (data){
      let url = new ((window as any).URL)("http://__playground?" + data);
      def = url.searchParams.get("__playground");
    }
    
    this.state = {
      html: def || localStorage.getItem('HTML') || "",
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
  showURLEncoded(){
    let text = encodeURIComponent(this.state.html);
    let newHash = location.hash;
    if (newHash && newHash.indexOf("?")){
      newHash += "&__playground=" + text;
    } else if (newHash){
      newHash += "?__playground=" + text;
    } else {
      newHash += "#?__playground=" + text;
    }
    let url = location.protocol + "//" + location.host + location.pathname + location.search + newHash;
    prompt("copy this", url);
  }
  componentDidMount(){
    document.addEventListener("keyup", (e)=>{
      if (e.keyCode == 27 && !e.ctrlKey) {
        console.log("toggling console");
        this.setState({codeDisplayed: !this.state.codeDisplayed})
      } else if (e.keyCode == 27 && e.ctrlKey){
        this.reloadStylesheets();
      } else if (e.keyCode == 81 && e.ctrlKey){
        this.showURLEncoded();
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
      <div style={style} className="rich-text" dangerouslySetInnerHTML={{__html: this.state.html}}></div>
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