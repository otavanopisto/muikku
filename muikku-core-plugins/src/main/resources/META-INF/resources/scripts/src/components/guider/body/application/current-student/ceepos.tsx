import Workspace from './workspaces/workspace';
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType, GuiderType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/empty.scss';
import { doPurchaseForCurrentStudent, DoPurchaseForCurrentStudentTriggerType } from '~/actions/main-function/guider';
import { PurchaseProductType } from '~/reducers/main-function/profile';
import Dialog from '~/components/general/dialog';
import Button from '~/components/general/button';

interface CeeposProps {
  i18n: i18nType,
  guider: GuiderType,
  locale: string,
  doPurchaseForCurrentStudent: DoPurchaseForCurrentStudentTriggerType,
}

interface CeeposState {
  isConfirmDialogOpenFor: PurchaseProductType;
}

class Ceepos extends React.Component<CeeposProps, CeeposState> {
  constructor(props: CeeposProps) {
    super(props);

    this.state = {
      isConfirmDialogOpenFor: null,
    }

    this.beginPurchaseProcess = this.beginPurchaseProcess.bind(this);
    this.acceptPurchase = this.acceptPurchase.bind(this);
    this.declinePurchase = this.declinePurchase.bind(this);
  }
  beginPurchaseProcess(p: PurchaseProductType) {
    this.setState({
      isConfirmDialogOpenFor: p,
    });
  }
  acceptPurchase() {
    this.props.doPurchaseForCurrentStudent(this.state.isConfirmDialogOpenFor);
    this.setState({
      isConfirmDialogOpenFor: null,
    });
  }
  declinePurchase() {
    this.setState({
      isConfirmDialogOpenFor: null,
    });
  }
  render() {
    let content = (closeDialog: ()=>any) => <div>
      <span>{this.state.isConfirmDialogOpenFor && this.state.isConfirmDialogOpenFor.Description}</span>
    </div>

    let footer = (closeDialog: ()=>any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "success"]} onClick={this.acceptPurchase}>
            {this.props.i18n.text.get("plugin.guider.acceptPurchase")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.declinePurchase}>
            {this.props.i18n.text.get("plugin.guider.declinePurchase")}
          </Button>
        </div>
      )
    }
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
              <div onClick={this.beginPurchaseProcess.bind(this, p)}>
                {p.Description}
              </div>
            ))}
          </div> : <div className="empty">
            <h3 className="">{this.props.i18n.text.get("plugin.guider.noPurchaseProducts")}</h3>
          </div>
        }
        <Dialog
          modifier="dialog-confirm-purchase"
          isOpen={!!this.state.isConfirmDialogOpenFor}
          title={this.props.i18n.text.get("plugin.guider.confirmPurchase")}
          onClose={this.declinePurchase}
          content={content}
          footer={footer}
        />
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
  return bindActionCreators({doPurchaseForCurrentStudent}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ceepos);
