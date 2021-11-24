import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { GuiderType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/glyph.scss';
import { doOrderForCurrentStudent, DoOrderForCurrentStudentTriggerType } from '~/actions/main-function/guider';
import { PurchaseProductType } from '~/reducers/main-function/profile';
import Dialog from '~/components/general/dialog';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import Button from '~/components/general/button';

interface CeeposProps {
  i18n: i18nType,
  guider: GuiderType,
  locale: string,
  doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType,
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

    this.beginOrderCreationProcess = this.beginOrderCreationProcess.bind(this);
    this.acceptOrderCreation = this.acceptOrderCreation.bind(this);
    this.declineOrderCreation = this.declineOrderCreation.bind(this);
    this.getProductStateDescription = this.getProductStateDescription.bind(this);
  }
  beginOrderCreationProcess(p: PurchaseProductType) {
    this.setState({
      isConfirmDialogOpenFor: p,
    });
  }
  acceptOrderCreation() {
    this.props.doOrderForCurrentStudent(this.state.isConfirmDialogOpenFor);
    this.setState({
      isConfirmDialogOpenFor: null,
    });
  }
  declineOrderCreation() {
    this.setState({
      isConfirmDialogOpenFor: null,
    });
  }
  getProductStateDescription(state: string) {
    let text;
    switch (state) {
      case "CREATED":
        text = "plugin.guider.purchaseStateIndicator.created";
        break;
      case "CANCELLED":
        text = "plugin.guider.purchaseStateIndicator.cancelled";
        break;
      case "ERRORED":
        text = "plugin.guider.purchaseStateIndicator.errored";
        break;
      case "ONGOING":
        text = "plugin.";
        break;
      case "PAID":
        text = "plugin.guider.purchaseStateIndicator.paid";
        break;
      case "COMPLETE":
        text = "plugin.guider.purchaseStateIndicator.complete";
        break;
    }

    return this.props.i18n.text.get(text);
  }
  render() {
    let content = (closeDialog: () => any) => <div>
      <span>{this.state.isConfirmDialogOpenFor && this.state.isConfirmDialogOpenFor.Description}</span>
    </div>

    let footer = (closeDialog: () => any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "success"]} onClick={this.acceptOrderCreation}>
            {this.props.i18n.text.get("plugin.guider.purchaseDialog.okButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.declineOrderCreation}>
            {this.props.i18n.text.get("plugin.guider.purchaseDialog.cancelButton")}
          </Button>
        </div>
      )
    }

    const canOrderBeCreated = this.props.guider.currentStudent.purchases &&
      this.props.guider.currentStudent.purchases.find((param) =>
        param["state"] === "CREATED" || param["state"] === "ONGOING" ? true : false
      );

    return (
      <div>
        {this.props.guider.availablePurchaseProducts && this.props.guider.availablePurchaseProducts.length ?
          <Dropdown items={this.props.guider.availablePurchaseProducts.map((p) => (
            <Link className="link link--full link--purchasable-product-dropdown" onClick={this.beginOrderCreationProcess.bind(this, p)}>
              <span className="link__icon icon-cart-plus"></span>
              <span>{p.Description}</span>
            </Link>
          ))}>
            <Link
            disabled={canOrderBeCreated ? true : false}
              className="link link--create-student-order">{this.props.i18n.text.get("plugin.guider.createStudentOrder")}</Link>
          </Dropdown> : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.guider.noPurchasableProducts")}</span>
          </div>}

        {this.props.guider.currentStudent.purchases && this.props.guider.currentStudent.purchases.length ? <div className="application-list">
          {this.props.guider.currentStudent.purchases.map((p) => (
            <div className="application-list__item application-list__item--product">
              <div className="application-list__item-header application-list__item-header--product">
                <span className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}></span>
                <span className="application-list__header-primary application-list__header-primary--product">
                  <span>{p.product.Description}</span>
                  <span className="application-list__header-primary-description">{this.getProductStateDescription(p.state)}</span>
                </span>
                <span className="application-list__header-secondary">{this.props.i18n.time.format(p.created)}</span>
              </div>
            </div>
          ))}
          </div> : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.guider.noPurchases")}</span>
          </div>}

        <Dialog
          modifier="dialog-confirm-purchase"
          isOpen={!!this.state.isConfirmDialogOpenFor}
          title={this.props.i18n.text.get("plugin.guider.purchaseDialog.title")}
          onClose={this.declineOrderCreation}
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
  return bindActionCreators({doOrderForCurrentStudent}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ceepos);
