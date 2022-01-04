import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18n";
import * as queryString from "query-string";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form-elements.scss";
import { StateType } from "~/reducers";
import { RecordsType } from "~/reducers/main-function/records";

interface StudiesToolbarProps {
  i18n: i18nType;
  records: RecordsType;
}

interface StudiesToolbarState {
  searchquery: string;
}

class StudiesToolbar extends React.Component<
  StudiesToolbarProps,
  StudiesToolbarState
> {
  private searchTimer: number;
  constructor(props: StudiesToolbarProps) {
    super(props);
    this.onGoBackClick = this.onGoBackClick.bind(this);
  }

  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>) {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed

    if (history.replaceState) {
      let canGoBack =
        (!document.referrer ||
          document.referrer.indexOf(window.location.host) !== -1) &&
        history.length;
      if (canGoBack) {
        history.back();
      } else {
        history.replaceState("", "", "#");
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = "#";
    }
  }

  render() {
    return (
      <div className="application-panel__toolbar">
        <div className="application-panel__toolbar-actions-main">
          {this.props.records.current ? (
            <Link
              className="button-pill button-pill--go-back"
              onClick={this.onGoBackClick}
            >
              <span className="button-pill__icon icon-back"></span>
            </Link>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: (state as any).records
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesToolbar);
