import * as React from "react";
import '~/sass/elements/separator.scss';

interface SeparatorProps {
}

interface SeparatorState {
  
}

export default class Separator extends React.Component<SeparatorProps, SeparatorState> {
  render() {
    return <div className="separator separator--frontpage"></div>
  }
}