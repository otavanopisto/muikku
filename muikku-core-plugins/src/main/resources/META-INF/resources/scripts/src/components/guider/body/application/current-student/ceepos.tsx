import Workspace from './workspaces/workspace';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType, GuiderType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/empty.scss';

interface CeeposProps {
  i18n: i18nType,
  guider: GuiderType,
  locale: string
}

interface CeeposState {
}

class Ceepos extends React.Component<CeeposProps, CeeposState> {
  render() {
    return (
      <div>
        {
          this.props.guider.currentStudent.purchases && this.props.guider.currentStudent.purchases.length ? <div className="application-list">
            <h3 className="">{this.props.i18n.text.get("plugin.guider.studentPurchases")}</h3>
            {this.props.guider.currentStudent.purchases.map((p) => (
              <div>
                <span>{this.props.i18n.time.format(p.created)}</span>
                <span>{p.product.Description}</span>
                <span>{p.state}</span>
              </div>
            ))}
          </div> : <div className="empty">
            <h3 className="">{this.props.i18n.text.get("plugin.guider.noPurchases")}</h3>
          </div>
        }

        {
          this.props.guider.availablePurchaseProducts && this.props.guider.availablePurchaseProducts.length ? <div className="application-list">
            <h3 className="">{this.props.i18n.text.get("plugin.guider.createStudentOrder")}</h3>
            {this.props.guider.availablePurchaseProducts.map((p) => (
              <div>
                {p.Description}
              </div>
            ))}
          </div> : <div className="empty">
            <h3 className="">{this.props.i18n.text.get("plugin.guider.noPurchaseProducts")}</h3>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    locale: state.locales.current
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ceepos);
