import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { GuiderType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/glyph.scss';
import {
  doOrderForCurrentStudent,
  DoOrderForCurrentStudentTriggerType,
  deleteOrderFromCurrentStudent,
  DeleteOrderFromCurrentStudentTriggerType,
  completeOrderFromCurrentStudent,
  CompleteOrderFromCurrentStudentTriggerType
} from '~/actions/main-function/guider';
import ApplicationList, { ApplicationListItem, ApplicationListItemHeader, ApplicationListHeaderPrimary, ApplicationListItemFooter, ApplicationListItemDate } from '~/components/general/application-list'
import { PurchaseProductType, PurchaseType } from '~/reducers/main-function/profile';
import Dialog from '~/components/general/dialog';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import Button from '~/components/general/button';

interface CeeposProps {
  i18n: i18nType,
  guider: GuiderType,
  locale: string,
  doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType,
  deleteOrderFromCurrentStudent: DeleteOrderFromCurrentStudentTriggerType,
  completeOrderFromCurrentStudent: CompleteOrderFromCurrentStudentTriggerType,
}

interface CeeposState {
  isConfirmDialogOpenFor: PurchaseProductType;
  isDeleteDialogOpen: boolean;
  orderToBeDeleted: PurchaseType;
  isCompleteDialogOpen: boolean;
  orderToBeCompleted: PurchaseType;
}

class Ceepos extends React.Component<CeeposProps, CeeposState> {
  constructor(props: CeeposProps) {
    super(props);

    this.state = {
      isConfirmDialogOpenFor: null,
      isDeleteDialogOpen: null,
      orderToBeDeleted: null,
      isCompleteDialogOpen: null,
      orderToBeCompleted: null,
    }

    this.beginOrderCreationProcess = this.beginOrderCreationProcess.bind(this);
    this.acceptOrderCreation = this.acceptOrderCreation.bind(this);
    this.declineOrderCreation = this.declineOrderCreation.bind(this);
    this.openDeleteOrderDialog = this.openDeleteOrderDialog.bind(this);
    this.deleteOrderFromCurrentStudent = this.deleteOrderFromCurrentStudent.bind(this);
    this.closeDeleteOrderDialog = this.closeDeleteOrderDialog.bind(this);
    this.completeOrderFromCurrentStudent = this.completeOrderFromCurrentStudent.bind(this);
    this.openCompleteOrderDialog = this.openCompleteOrderDialog.bind(this);
    this.closeCompleteOrderDialog = this.closeCompleteOrderDialog.bind(this);
  }

  /**
   * beginOrderCreationProcess
   * @param p
   */
  beginOrderCreationProcess(p: PurchaseProductType) {
    this.setState({
      isConfirmDialogOpenFor: p,
    });
  }

  /**
   * acceptOrderCreation
   */
  acceptOrderCreation() {
    this.props.doOrderForCurrentStudent(this.state.isConfirmDialogOpenFor);
    this.setState({
      isConfirmDialogOpenFor: null,
    });
  }

  /**
   * declineOrderCreation
   */
  declineOrderCreation() {
    this.setState({
      isConfirmDialogOpenFor: null,
    });
  }

  /**
   * openDeleteDialog
   * @param id
   */
  openDeleteOrderDialog(order: PurchaseType) {
    this.setState({
      isDeleteDialogOpen: true,
      orderToBeDeleted: order,
    });
  }

  /**
   * closeDeleteDialog
   */
  closeDeleteOrderDialog() {
    this.setState({
      isDeleteDialogOpen: null,
    });
  }

  /**
   * deleteOrderFromStudent
   */
  deleteOrderFromCurrentStudent() {
    this.props.deleteOrderFromCurrentStudent(this.state.orderToBeDeleted);
  }

/**
 * openDeleteDialog
 * @param id
 */
  openCompleteOrderDialog(order: PurchaseType) {
    this.setState({
      isCompleteDialogOpen: true,
      orderToBeCompleted: order,
    });
  }

  /**
   * closeDeleteDialog
   */
  closeCompleteOrderDialog() {
    this.setState({
      isCompleteDialogOpen: null,
    });
  }

  /**
   *
   */
  completeOrderFromCurrentStudent() {
    this.props.completeOrderFromCurrentStudent(this.state.orderToBeCompleted);
  }

  render() {
    let orderConfirmDialogContent = (closeDialog: () => any) => <div>
      <span>{this.state.isConfirmDialogOpenFor && this.state.isConfirmDialogOpenFor.Description}</span>
    </div>

    let orderConfirmDialogFooter = (closeDialog: () => any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "execute"]} onClick={this.acceptOrderCreation}>
            {this.props.i18n.text.get("plugin.guider.orderConfirmDialog.okButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.declineOrderCreation}>
            {this.props.i18n.text.get("plugin.guider.orderConfirmDialog.cancelButton")}
          </Button>
        </div>
      )
    }

    let orderDeleteDialogContent = (closeDialog: () => any) => <div>
      <span>{this.props.i18n.text.get("plugin.guider.orderDeleteDialog.description")}</span>
    </div>

    let orderDeleteDialogFooter = (closeDialog: () => any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "fatal"]} onClick={this.deleteOrderFromCurrentStudent}>
            {this.props.i18n.text.get("plugin.guider.orderDeleteDialog.okButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.closeDeleteOrderDialog}>
            {this.props.i18n.text.get("plugin.guider.orderDeleteDialog.cancelButton")}
          </Button>
        </div>
      )
    }

    let orderCompleteDialogContent = (closeDialog: () => any) => <div>
      <span>{this.props.i18n.text.get("plugin.guider.orderCompleteDialog.description")}</span>
    </div>

    let orderCompleteDialogFooter = (closeDialog: () => any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "execute"]} onClick={this.completeOrderFromCurrentStudent}>
            {this.props.i18n.text.get("plugin.guider.orderCompleteDialog.okButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.closeCompleteOrderDialog}>
            {this.props.i18n.text.get("plugin.guider.orderCompleteDialog.cancelButton")}
          </Button>
        </div>
      )
    }

    const canOrderBeCreated = this.props.guider.currentStudent.purchases &&
      this.props.guider.currentStudent.purchases.find((param) =>
        param["state"] === "CREATED" || param["state"] === "ONGOING" ? true : false
      );

    const orderDeleteLinkDisabledState = (state: string) => {
      switch (state) {
        case "ONGOING":
        case "COMPLETE":
        case "PAID":
          return true;
        default:
          return false;
      }
    };

    const orderCompleteLinkDisabledState = (state: string) => {
      switch (state) {
        case "COMPLETE":
          return true;
        default:
          return false;
      }
    };

    return (
      <div>
        {this.props.guider.availablePurchaseProducts && this.props.guider.availablePurchaseProducts.length ?
          <Dropdown items={this.props.guider.availablePurchaseProducts.map((p) => (
            <Link className="link link--full link--purchasable-product-dropdown" onClick={this.beginOrderCreationProcess.bind(this, p)}>
              <span className="link__icon icon-plus"></span>
              <span>{p.Description}</span>
            </Link>
          ))}>
            <Button
              icon="cart-plus"
              buttonModifiers={["create-student-order", "info"]}
              disabled={canOrderBeCreated ? true : false}
            >{this.props.i18n.text.get("plugin.guider.createStudentOrder")}</Button>
          </Dropdown> : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.guider.noPurchasableProducts")}</span>
          </div>}

        {this.props.guider.currentStudent.purchases && this.props.guider.currentStudent.purchases.length ? <ApplicationList>
          {this.props.guider.currentStudent.purchases.map((p) => (
            <ApplicationListItem modifiers="product" key={p.id}>
              <ApplicationListItemHeader modifiers="product">
                <span className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}></span>
                <span className="application-list__header-primary application-list__header-primary--product">
                  <span><b>{p.product.Description}</b></span>
                  <span className="application-list__header-primary-description">{this.props.i18n.text.get("plugin.guider.purchases.description." + p.state)}</span>
                  <span className="application-list__header-primary-actions">
                    <Button
                      onClick={this.openDeleteOrderDialog.bind(this, p)}
                      disabled={orderDeleteLinkDisabledState(p.state)}
                      icon="trash"
                      buttonModifiers={["delete-student-order", "fatal"]}
                    >{this.props.i18n.text.get("plugin.guider.purchase.deleteOrderLink")}</Button>
                    <Button
                      onClick={this.openCompleteOrderDialog.bind(this, p)}
                      disabled={orderCompleteLinkDisabledState(p.state)}
                      icon="forward"
                      buttonModifiers={["complete-student-order", "execute"]}
                    >{this.props.i18n.text.get("plugin.guider.purchase.completeOrderLink")}</Button>
                  </span>
                </span>
                <span className="application-list__header-secondary">{this.props.i18n.time.format(p.created)}</span>
              </ApplicationListItemHeader>
            </ApplicationListItem>
          ))}
          </ApplicationList> : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.guider.noPurchases")}</span>
          </div>}

        <Dialog
          modifier="dialog-confirm-order"
          isOpen={!!this.state.isConfirmDialogOpenFor}
          title={this.props.i18n.text.get("plugin.guider.orderConfirmDialog.title")}
          onClose={this.declineOrderCreation}
          content={orderConfirmDialogContent}
          footer={orderConfirmDialogFooter}
        />

        <Dialog
          modifier="dialog-delete-order"
          isOpen={!!this.state.isDeleteDialogOpen}
          title={this.props.i18n.text.get("plugin.guider.orderDeleteDialog.title")}
          onClose={this.closeDeleteOrderDialog}
          content={orderDeleteDialogContent}
          footer={orderDeleteDialogFooter}
        />

        <Dialog
          modifier="dialog-complete-order"
          isOpen={!!this.state.isCompleteDialogOpen}
          title={this.props.i18n.text.get("plugin.guider.orderCompleteDialog.title")}
          onClose={this.closeCompleteOrderDialog}
          content={orderCompleteDialogContent}
          footer={orderCompleteDialogFooter}
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
  return bindActionCreators({doOrderForCurrentStudent, deleteOrderFromCurrentStudent, completeOrderFromCurrentStudent}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ceepos);
