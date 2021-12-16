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
import ApplicationList, { ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list'
import { PurchaseProductType, PurchaseType } from '~/reducers/main-function/profile';
import Dialog from '~/components/general/dialog';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import Button from '~/components/general/button';
import { isThisTypeNode } from 'typescript';

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

    this.beginOrderDeleteProcess = this.beginOrderDeleteProcess.bind(this);
    this.acceptOrderDelete = this.acceptOrderDelete.bind(this);
    this.declineOrderDelete = this.declineOrderDelete.bind(this);

    this.beginOrderManualCompleteProcess = this.beginOrderManualCompleteProcess.bind(this);
    this.acceptOrderManualComplete = this.acceptOrderManualComplete.bind(this);
    this.declineOrderManualComplete = this.declineOrderManualComplete.bind(this);
  }

  /**
   * beginOrderCreationProcess
   * @param p
   */
  beginOrderCreationProcess(p: PurchaseProductType, closeDropdown?: () => any) {
    this.setState({
      isConfirmDialogOpenFor: p,
    });
    closeDropdown && closeDropdown();
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
   * beginOrderDeleteProcess
   * @param order
   */
   beginOrderDeleteProcess(order: PurchaseType) {
    this.setState({
      isDeleteDialogOpen: true,
      orderToBeDeleted: order,
    });
  }

  /**
   * acceptOrderDelete
   */
  acceptOrderDelete() {
    this.props.deleteOrderFromCurrentStudent(this.state.orderToBeDeleted);
    this.setState({
      isDeleteDialogOpen: null,
    });
  }

  /**
   * declineOrderDelete
   */
  declineOrderDelete() {
    this.setState({
      isDeleteDialogOpen: null,
    });
  }

/**
 * beginOrderManualCompleteProcess
 * @param order
 */
  beginOrderManualCompleteProcess(order: PurchaseType) {
    this.setState({
      isCompleteDialogOpen: true,
      orderToBeCompleted: order,
    });
  }

  /**
   * acceptOrderManualComplete
   */
  acceptOrderManualComplete() {
    this.props.completeOrderFromCurrentStudent(this.state.orderToBeCompleted);
    this.setState({
      isCompleteDialogOpen: null,
    });
  }

  /**
   * declineOrderManualComplete
   */
   declineOrderManualComplete() {
    this.setState({
      isCompleteDialogOpen: null,
    });
  }

  /**
   * render
   * @returns
   */
  render() {

    /**
     * orderConfirmDialogContent
     * @param closeDialog
     * @returns
     */
    let orderConfirmDialogContent = (closeDialog: () => any) => <div>
      <span><b>{this.state.isConfirmDialogOpenFor && this.state.isConfirmDialogOpenFor.Description}</b></span>
      <br/><br/>
      <span>{this.props.i18n.text.get("plugin.guider.orderConfirmDialog.description")}</span>
    </div>

    /**
     * orderConfirmDialogFooter
     * @param closeDialog
     * @returns
     */
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

    /**
     * orderDeleteDialogContent
     * @param closeDialog
     * @returns
     */
    let orderDeleteDialogContent = (closeDialog: () => any) => <div>
      <span>{this.props.i18n.text.get("plugin.guider.orderDeleteDialog.description")}</span>
    </div>

    /**
     * orderDeleteDialogFooter
     * @param closeDialog
     * @returns
     */
    let orderDeleteDialogFooter = (closeDialog: () => any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "fatal"]} onClick={this.acceptOrderDelete}>
            {this.props.i18n.text.get("plugin.guider.orderDeleteDialog.okButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.declineOrderDelete}>
            {this.props.i18n.text.get("plugin.guider.orderDeleteDialog.cancelButton")}
          </Button>
        </div>
      )
    }

    /**
     * orderCompleteDialogContent
     * @param closeDialog
     * @returns
     */
    let orderCompleteDialogContent = (closeDialog: () => any) => <div>
      <span>{this.props.i18n.text.get("plugin.guider.orderCompleteDialog.description")}</span>
    </div>

    /**
     * orderCompleteDialogFooter
     * @param closeDialog
     * @returns
     */
    let orderCompleteDialogFooter = (closeDialog: () => any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "execute"]} onClick={this.acceptOrderManualComplete}>
            {this.props.i18n.text.get("plugin.guider.orderCompleteDialog.okButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.declineOrderManualComplete}>
            {this.props.i18n.text.get("plugin.guider.orderCompleteDialog.cancelButton")}
          </Button>
        </div>
      )
    }

    /**
     * Can new order be created by guidance counselor.
     * This is handled inverse as <Button> disabled attribute receives true or false directly.
     *
     * canOrderBeCreated
     */
    const canOrderBeCreated = this.props.guider.currentStudent.purchases &&
      this.props.guider.currentStudent.purchases.find((param) =>
        param["state"] === "CREATED" || param["state"] === "ONGOING" || param["state"] === "ERRORED" ? true : false
      );

    /**
     * Can guidance counselor delete already creted order
     * This is handled inverse as <Button> disabled attribute receives true or false directly.
     *
     * canOderBeDelete
     * @param state
     * @return true | false
     * */
    const canOrderBeDeleted = (state: string) => {
      switch (state) {
        case "ONGOING":
        case "COMPLETE":
        case "PAID":
          return true;
        default:
          return false;
      }
    };

    /**
     * Can guidance counselor manually complete (behalf of student) already created but not finished order.
     * This is handled inverse as <Button> disabled attribute receives true or false directly.
     *
     * canOrderBeCompletedManually
     * @param state
     * @returns true | false
     */
    const canOrderBeCompletedManually = (state: string) => {
      switch (state) {
        case "ONGOING":
        case "PAID":
        case "ERRORED":
          return false;
        default:
          return true;
      }
    };

    return (
      <>
        {this.props.guider.availablePurchaseProducts && this.props.guider.availablePurchaseProducts.length ?
          <>
            <div className="application-sub-panel__description">{this.props.i18n.text.get("plugin.guider.createStudentOrder.description")}</div>
            <Dropdown items={this.props.guider.availablePurchaseProducts.map((p) => {
              return (closeDropdown: () => any) => {
                return <Link className="link link--full link--purchasable-product-dropdown" onClick={this.beginOrderCreationProcess.bind(this, p, closeDropdown)}>
                  <span className="link__icon icon-plus"></span>
                  <span>{p.Description}</span>
                </Link>
              }
            })}>
              <Button
                icon="cart-plus"
                buttonModifiers={["create-student-order", "info"]}
                disabled={canOrderBeCreated ? true : false}
              >{this.props.i18n.text.get("plugin.guider.createStudentOrder.buttonLabel")}</Button>
            </Dropdown>
          </> : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.guider.noPurchasableProducts")}</span>
          </div>
        }

        {this.props.guider.currentStudent.purchases && this.props.guider.currentStudent.purchases.length ? <ApplicationList>
          {this.props.guider.currentStudent.purchases.map((p) => (
            <ApplicationListItem modifiers="product" key={p.id}>
              <ApplicationListItemHeader modifiers="product">
                <span className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}></span>
                <span className="application-list__header-primary application-list__header-primary--product">
                  <span className="application-list__header-primary-title"><b>{p.product.Description}</b></span>
                  <span className="application-list__header-primary-description">
                    {this.props.i18n.text.get("plugin.guider.purchases.description." + p.state)}
                  </span>
                  <span className="application-list__header-primary-meta">
                    <span>{this.props.i18n.text.get("plugin.guider.purchases.orderId")}: {p.id}</span>
                    <span>{this.props.i18n.text.get("plugin.guider.purchases.date.created")}: {this.props.i18n.time.format(p.created)}</span>
                    {p.paid ?
                      <span>{this.props.i18n.text.get("plugin.guider.purchases.date.paid")}: {this.props.i18n.time.format(p.paid)}</span>
                      : null}
                  </span>
                  {p.state !== "COMPLETE" ?
                  <span className="application-list__header-primary-actions">
                    <Button
                      onClick={this.beginOrderDeleteProcess.bind(this, p)}
                      disabled={canOrderBeDeleted(p.state)}
                      icon="trash"
                      buttonModifiers={["delete-student-order", "fatal"]}
                    >{this.props.i18n.text.get("plugin.guider.purchase.deleteOrderLink")}</Button>
                    <Button
                      onClick={this.beginOrderManualCompleteProcess.bind(this, p)}
                      disabled={canOrderBeCompletedManually(p.state)}
                      icon="forward"
                      buttonModifiers={["complete-student-order", "execute"]}
                    >{this.props.i18n.text.get("plugin.guider.purchase.completeOrderLink")}</Button>
                  </span>
                  : null}
                </span>
                <span className="application-list__header-secondary">

                </span>
              </ApplicationListItemHeader>
            </ApplicationListItem>
          ))}
          </ApplicationList> : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.guider.noPurchases")}</span>
          </div>}

        {/* Confirm order creation dialog */}
        <Dialog
          modifier="dialog-confirm-order"
          isOpen={!!this.state.isConfirmDialogOpenFor}
          title={this.props.i18n.text.get("plugin.guider.orderConfirmDialog.title")}
          onClose={this.declineOrderCreation}
          content={orderConfirmDialogContent}
          footer={orderConfirmDialogFooter}
        />

        {/* Delete order dialog */}
        <Dialog
          modifier="dialog-delete-order"
          isOpen={!!this.state.isDeleteDialogOpen}
          title={this.props.i18n.text.get("plugin.guider.orderDeleteDialog.title")}
          onClose={this.declineOrderDelete}
          content={orderDeleteDialogContent}
          footer={orderDeleteDialogFooter}
        />

        {/* Complete order manually dialog */}
        <Dialog
          modifier="dialog-complete-order"
          isOpen={!!this.state.isCompleteDialogOpen}
          title={this.props.i18n.text.get("plugin.guider.orderCompleteDialog.title")}
          onClose={this.declineOrderManualComplete}
          content={orderCompleteDialogContent}
          footer={orderCompleteDialogFooter}
        />
      </>
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
