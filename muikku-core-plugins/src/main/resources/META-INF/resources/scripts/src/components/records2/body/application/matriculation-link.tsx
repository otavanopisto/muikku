//import * as React from "react";
//import $ from '~/lib/jquery';
//import mApi from "~/lib/mApi";
//import {i18nType} from '~/reducers/base/i18n';
//
//interface MatriculationLinkProps {
//  i18n: i18nType;
//}
//
//interface MatriculationLinkState {
//  enabled: boolean;
//}
//
//interface CurrentExam {
//  starts: Number;
//  ends: Number;
//  eligible: boolean;
//}
//
//export class MatriculationLink extends React.Component<MatriculationLinkProps, MatriculationLinkState> {
//  constructor(props: MatriculationLinkProps) {
//    super(props);
//
//    this.state = {enabled: false};
//  }
//
//  public componentDidMount() {
//    if ("matriculation" in mApi()) {
//      mApi().matriculation.currentExam.read({}).callback((err: any, data: CurrentExam) => {
//        if (err) {
//          return;
//        }
//        const now : Number = new Date().getTime();
//        if (data && data.eligible && data.starts <= now && data.ends >= now) {
//          this.setState({enabled: true});
//        }
//      });
//    }
//  }
//
//  public render() {
//    if (!this.state.enabled) {
//        return null;
//    }
//    return <div className="application-sub-panel application-sub-panel--matriculation-enrollment">
//      <a className="link link--matriculation-enrollment" href="/matriculation-enrollment">{this.props.i18n.text.get("plugin.records.matriculationLink")}</a>
//    </div>
//  }
//
//}

import * as React from "react";
import $ from '~/lib/jquery';
import mApi from "~/lib/mApi";
import {i18nType} from '~/reducers/base/i18n';

interface MatriculationLinkProps {
  i18n: i18nType;
}

interface MatriculationLinkState {
  enabled: boolean;
  exams: CurrentExam[]
}

interface CurrentExam {
  id: Number;
  starts: Number;
  ends: Number;
  eligible: boolean;
}

export class MatriculationLink extends React.Component<MatriculationLinkProps, MatriculationLinkState> {
  private _isMounted: boolean;

  constructor(props: MatriculationLinkProps) {
    super(props);
    this._isMounted = false;
    this.state = {
      enabled: false,
      exams: []
    };
  }

  public componentDidMount() {
    this._isMounted = true;
    if ("matriculation" in mApi()) {
      mApi().matriculation.exams.read({}).callback((err: any, data: CurrentExam[]) => {
        if (err) {
          return;
        }

        if (data && this._isMounted) {
          this.setState({ exams: data, enabled: true });
        }
      });
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
  }

  public render() {
    if (!this.state.enabled) {
      return null;
    }

    return <div className="application-sub-panel application-sub-panel--matriculation-enrollment">
    {
      this.state.exams
        .filter((exam) => exam.eligible === true)
        .map((exam, i) =>
          <a key={i} className="link link--matriculation-enrollment" href={"/matriculation-enrollment/" + exam.id}>{this.props.i18n.text.get("plugin.records.matriculationLink")}</a>
        )
    }
    </div>
  }

}
