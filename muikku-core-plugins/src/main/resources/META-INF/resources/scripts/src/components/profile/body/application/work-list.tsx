import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType } from "~/reducers/main-function/profile";

interface IWorkListProps {
  i18n: i18nType,
  profile: ProfileType;
}

class WorkList extends React.Component<IWorkListProps> {
  constructor(props: IWorkListProps) {
    super(props);
  }

  public render() {
    if (this.props.profile.location !== "work") {
      return null;
    }

    return <section>
      <form>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.worklist')}</h2>
        <div className="application-sub-panel">
          <div className="application-sub-panel__body">

          </div>
        </div>
      </form>
    </section>;
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
  }
};

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkList);