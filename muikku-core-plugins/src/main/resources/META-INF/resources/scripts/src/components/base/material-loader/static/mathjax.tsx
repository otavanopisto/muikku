import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import { MATHJAXSRC, MATHJAXCONFIG } from "~/lib/mathjax";
const MathJax = require("react-mathjax-preview");

interface MathJaxProps {
  invisible?: boolean;
  children: React.ReactNode;
}

export default class MathJAX extends React.Component<MathJaxProps, {}>{
  constructor(props: MathJaxProps){
    super(props);
  }
  render(){
    //TODO remove the data-muikku-word-definition thing, it's basically used for styling alone
    if (this.props.invisible){
      return <span className="math-tex">{this.props.children}</span>
    }
    return <span className="math-tex"><MathJax.default script={MATHJAXSRC} config={MATHJAXCONFIG} math={this.props.children}/></span>
  }
}