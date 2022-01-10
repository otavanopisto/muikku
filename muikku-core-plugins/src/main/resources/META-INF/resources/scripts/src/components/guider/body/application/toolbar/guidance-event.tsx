import * as React from "react";
import EnvironmentDialog from '~/components/general/environment-dialog';
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/link.scss';
import { bindActionCreators } from "redux";
import { StateType } from '~/reducers';
import { GuiderType, GuiderStudentType } from "~/reducers/main-function/guider";
import { ButtonPill } from "~/components/general/button";

interface GuidanceEventProps {
  i18n: i18nType,
  guider: GuiderType
  children: React.ReactElement<any>;
}

interface GuidanceEventState {
}

class GuidanceEvent extends React.Component<GuidanceEventProps, GuidanceEventState> {
  constructor(props: GuidanceEventProps) {
    super(props);

    this.state = {
      isOpen: false
    }

  }

  render() {
    const content = () => <div>Muuu</div>;
    const footer = (closeDialog: () => any) => <div>Niii</div>;

    return <EnvironmentDialog modifier="guidance-event"
      title={this.props.i18n.text.get('plugin.communicator.createmessage.label')}
      content={content} footer={footer}
    >
      {this.props.children}
    </EnvironmentDialog>;
  }

}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuidanceEvent);
