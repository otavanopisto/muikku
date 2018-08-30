import * as React from "react";
import specialCharacters, { SpecialCharacterType } from './special-character-set';

export interface MathFieldCommandType {
  latex: string,
  html?: string
}

interface MathFieldToolbarProps {
  className?: string,
  isOpen: boolean,
  i18n: {
    basicsAndSymbols: string,
    algebra: string,
    geometryAndVectors: string,
    logic: string,
    mathOperations: string
  },
  onCommand: (command: MathFieldCommandType)=>any
}

interface MathFieldToolbarState {
  isExpanded: boolean,
  isMathExpanded: boolean
}

export default class MathFieldToolbar extends React.Component<MathFieldToolbarProps, MathFieldToolbarState> {
  constructor(props: MathFieldToolbarProps){
    super(props);
    
    this.state = {
      isExpanded: false,
      isMathExpanded: false
    }
    
    this.triggerCommandOn = this.triggerCommandOn.bind(this);
  }
  triggerCommandOn(s: SpecialCharacterType){
    this.props.onCommand({
      latex: s.latexCommand,
      html: s.character
    });
  }
  render(){
    if (!this.props.isOpen){
      return null;
    }
    //Please do not change the type of the --symbol unless you ensure that if you change (say to a div) the css expresses that the text cannot be selected
    //so far buttons work well
    return <div className={this.props.className}>
      {specialCharacters.map(c=><div className={this.props.className + "--symbol-group"} key={c.label}>
        <div className={this.props.className + "--symbol-group-label"}>
          {(this.props.i18n as any)[c.label]}
        </div>
        <div className={this.props.className + "--symbol-group-content"}>
          {c.characters.map(s=><button className={this.props.className + "--symbol"} onMouseDown={this.triggerCommandOn.bind(this, s)} key={s.character}
            dangerouslySetInnerHTML={{__html:s.character}}/>)}
        </div>
      </div>)}
    </div>
  }
}