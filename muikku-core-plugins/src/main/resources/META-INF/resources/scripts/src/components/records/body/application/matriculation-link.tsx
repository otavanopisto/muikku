import * as React from "react";
import $ from '~/lib/jquery';
import mApi from "~/lib/mApi";
import {i18nType} from '~/reducers/base/i18n';

interface MatriculationLinkProps {
  i18n: i18nType;
}

interface MatriculationLinkState {
  enabled: boolean;
}

interface CurrentExam {
  starts: Number;
  ends: Number;
}

export class MatriculationLink extends React.Component<MatriculationLinkProps, MatriculationLinkState> {
  constructor(props: MatriculationLinkProps) {
    super(props);

    this.state = {enabled: false};
  }

  public componentDidMount() {
    if ("matriculation" in mApi()) {
      mApi().matriculation.currentExam.read({}).callback((err: any, data: CurrentExam) => {
        if (err) {
          console.log(err);
          return;
        }
        const now : Number = new Date().getTime();
        if (data && data.starts <= now && data.ends >= now) {
          this.setState({enabled: true});
        }
      });
    }
  }

  public render() {
    if (!this.state.enabled) {
        return null;
    }
    return <div className="application-sub-panel application-sub-panel--matriculation-enrollment">
      <a className="link link--matriculation-enrollment" href="/jsf/matriculation/index.jsf">{this.props.i18n.text.get("plugin.records.matriculationLink")}</a>
    </div>
  }

}
