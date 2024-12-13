import * as React from "react";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import { StateType } from "~/reducers";
import { RecordsType } from "~/reducers/main-function/records";

/**
 * StudiesToolbarProps
 */
interface StudiesToolbarProps {
  records: RecordsType;
}

/**
 * StudiesToolbarState
 */
interface StudiesToolbarState {
  searchquery: string;
}

/**
 * StudiesToolbar
 */
class StudiesToolbar extends React.Component<
  StudiesToolbarProps,
  StudiesToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: StudiesToolbarProps) {
    super(props);
    this.onGoBackClick = this.onGoBackClick.bind(this);
  }

  /**
   * onGoBackClick
   */
  onGoBackClick() {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed

    if (history.replaceState) {
      const canGoBack =
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

  /**
   * render
   */
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    records: (state as any).records,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesToolbar);
