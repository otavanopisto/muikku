import * as React from "react";
import specialCharacters, { SpecialCharacterType } from './special-character-set';
import latexCommands, { LatexCommandType } from './latex-command-set';
import ToolbarButton from './button';

export interface MathFieldCommandType {
  latex: string,
  latexText: string,
  html?: string,
  useWrite: boolean
}

interface MathFieldToolbarProps {
  className?: string,
  isOpen: boolean,
  i18n: {
    basicsAndSymbols: string,
    algebra: string,
    geometryAndVectors: string,
    logic: string,
    moreMath: string,
    mathOperations: string
  },
  onCommand: (command: MathFieldCommandType)=>any,
  onToolbarAction: ()=>any,
  onRequestToOpenMathMode: ()=>any,
  isMathExpanded: boolean
}

interface MathFieldToolbarState {
  isExpanded: boolean
}

export default class MathFieldToolbar extends React.Component<MathFieldToolbarProps, MathFieldToolbarState> {
  constructor(props: MathFieldToolbarProps){
    super(props);
    
    this.state = {
      isExpanded: false
    }
    
    this.triggerCommandOn = this.triggerCommandOn.bind(this);
    this.toggleIsExpanded = this.toggleIsExpanded.bind(this);
  }
  triggerCommandOn(s: SpecialCharacterType | LatexCommandType, e: React.ChangeEvent<any>){
    e.preventDefault();
    
    if ((s as SpecialCharacterType).character){
      this.props.onCommand({
        latex: (s as SpecialCharacterType).latexCommand || (s as SpecialCharacterType).character,
        latexText: (s as SpecialCharacterType).latexCommand || (s as SpecialCharacterType).character,
        html: (s as SpecialCharacterType).character,
        useWrite: true
      });
      return;
    }
    
    this.props.onCommand({
      latex: (s as LatexCommandType).action,
      latexText: (s as LatexCommandType).label || (s as LatexCommandType).action,
      useWrite: (s as LatexCommandType).useWrite
    });
  }
  toggleIsExpanded(){
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }
  render(){
    if (!this.props.isOpen){
      return null;
    }
    //Please do not change the type of the --symbol unless you ensure that if you change (say to a div) the css expresses that the text cannot be selected
    //so far buttons work well
    return <div className={`${this.props.className} ${this.state.isExpanded ? this.props.className + "--expanded" : ""}`} onMouseDown={this.props.onToolbarAction}>
      <div className={this.props.className + "--symbols"}>
        {specialCharacters.map(c=><div className={this.props.className + "--symbol-group"} key={c.label}>
          <div className={this.props.className + "--symbol-group-label"}>
            {(this.props.i18n as any)[c.label]}
          </div>
          <div className={this.props.className + "--symbol-group-content"}>
            {c.characters.filter((s:SpecialCharacterType)=>!this.state.isExpanded ? s.popular: true)
              .map((s: SpecialCharacterType)=>
              <ToolbarButton key={s.character} className={this.props.className + "--symbol"} html={s.character}
               onTrigger={this.triggerCommandOn.bind(this, s)} tooltipClassName={this.props.className + "--symbol-latex-tooltip"}
               tooltip={s.latexCommand || s.character}/>)}
          </div>
        </div>)}
        <button className={this.props.className + "--symbols-expand " + (this.state.isExpanded ? this.props.className + "--symbols-expanded" : "")}
          onClick={this.toggleIsExpanded}/>
      </div>
      <div className={this.props.className + "--math " +  (this.props.isMathExpanded ? this.props.className + "--math-expanded" : "")}>
        {!this.props.isMathExpanded ?
          <button className={this.props.className + "--more-math-expand"} onClick={this.props.onRequestToOpenMathMode}>{this.props.i18n.moreMath}</button> :
          null}
        {this.props.isMathExpanded ? <div className={this.props.className + "--math-label"}>
          {this.props.i18n.mathOperations}
        </div> : null}
        {this.props.isMathExpanded ?
            latexCommands.map((c:LatexCommandType)=>
              <ToolbarButton key={c.action} className={this.props.className + "--math-operation"} image={c.svg}
               onTrigger={this.triggerCommandOn.bind(this, c)} tooltipClassName={this.props.className + "--math-operation-tooltip"}
               tooltip={c.action}/>) : null}
      </div>
    </div>
  }
}