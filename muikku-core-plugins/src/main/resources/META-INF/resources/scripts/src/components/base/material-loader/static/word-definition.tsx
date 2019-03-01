import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import FieldBase from '../fields/base';

interface WordDefinitionProps {
  element: HTMLElement,
  dataset: {
    muikkuWordDefinition: string
  },
  i18n: i18nType
}

export default class WordDefinition extends FieldBase<WordDefinitionProps, {}>{
  constructor(props: WordDefinitionProps){
    super(props);
  }
  render(){
    //TODO remove the data-muikku-word-definition thing, it's basically used for styling alone
    if (!this.loaded){
      return <mark data-muikku-word-definition={this.props.dataset.muikkuWordDefinition}>{this.props.element.textContent}</mark>
    }
    return <Dropdown openByHover modifier="word-definition" content={this.props.dataset.muikkuWordDefinition}>
      <mark data-muikku-word-definition={this.props.dataset.muikkuWordDefinition}>{this.props.element.textContent}</mark>
    </Dropdown>
  }
}