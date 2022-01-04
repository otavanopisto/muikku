import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";

interface WordDefinitionProps {
  dataset: {
    muikkuWordDefinition: string;
  };
  i18n: i18nType;
  invisible?: boolean;
}

export default class WordDefinition extends React.Component<
  WordDefinitionProps,
  {}
> {
  constructor(props: WordDefinitionProps) {
    super(props);
  }
  render() {
    //TODO remove the data-muikku-word-definition thing, it's basically used for styling alone
    if (this.props.invisible) {
      return (
        <mark
          data-muikku-word-definition={this.props.dataset.muikkuWordDefinition}
        >
          {this.props.children}
        </mark>
      );
    }
    return (
      <Dropdown
        openByHover
        openByHoverIsClickToo
        modifier="word-definition"
        content={this.props.dataset.muikkuWordDefinition}
      >
        <mark
          data-muikku-word-definition={this.props.dataset.muikkuWordDefinition}
        >
          {this.props.children}
        </mark>
      </Dropdown>
    );
  }
}
