import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType } from "~/reducers/main-function/profile";

interface IPurchasesProps {
  i18n: i18nType,
  profile: ProfileType,
}

interface IPurchasesState {
}

class Purchases extends React.Component<IPurchasesProps, IPurchasesState> {

  public render() {
    if (this.props.profile.location !== "purchases") {
      return null;
    }

    return <section>
      
    </section>;
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchases);
