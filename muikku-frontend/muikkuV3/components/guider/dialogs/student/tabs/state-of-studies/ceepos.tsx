import * as React from "react";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { GuiderState } from "~/reducers/main-function/guider";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/glyph.scss";
import {
  deleteOrderFromCurrentStudent,
  DeleteOrderFromCurrentStudentTriggerType,
  completeOrderFromCurrentStudent,
  CompleteOrderFromCurrentStudentTriggerType,
} from "~/actions/main-function/guider";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";
import { CeeposOrder, CeeposPurchaseProduct, Role } from "~/generated/client";

/**
 * CeeposProps
 */
interface CeeposProps extends WithTranslation {
  status: StatusType;
  guider: GuiderState;
  locale: string;
  deleteOrderFromCurrentStudent: DeleteOrderFromCurrentStudentTriggerType;
  completeOrderFromCurrentStudent: CompleteOrderFromCurrentStudentTriggerType;
}

/**
 * CeeposState
 */
interface CeeposState {
  isConfirmDialogOpenFor: CeeposPurchaseProduct | null;
  isDeleteDialogOpen: boolean;
  orderToBeDeleted: CeeposOrder | null;
  isCompleteDialogOpen: boolean;
  orderToBeCompleted: CeeposOrder | null;
}

/**
 * Ceepos
 */
class Ceepos extends React.Component<CeeposProps, CeeposState> {
  /**
  constructor(props: CeeposProps) {
   *
   * @param props props
   */
  constructor(props: CeeposProps) {
    super(props);

    this.state = {
      isConfirmDialogOpenFor: null,
      isDeleteDialogOpen: false,
      orderToBeDeleted: null,
      isCompleteDialogOpen: false,
      orderToBeCompleted: null,
    };

    this.beginOrderCreationProcess = this.beginOrderCreationProcess.bind(this);
    this.beginOrderDeleteProcess = this.beginOrderDeleteProcess.bind(this);
    this.acceptOrderDelete = this.acceptOrderDelete.bind(this);
    this.declineOrderDelete = this.declineOrderDelete.bind(this);

    this.beginOrderManualCompleteProcess =
      this.beginOrderManualCompleteProcess.bind(this);
    this.acceptOrderManualComplete = this.acceptOrderManualComplete.bind(this);
    this.declineOrderManualComplete =
      this.declineOrderManualComplete.bind(this);
  }

  /**
   * beginOrderCreationProcess
   * @param p product
   * @param closeDropdown closeDropdown
   */
  beginOrderCreationProcess(
    p: CeeposPurchaseProduct,
    closeDropdown?: () => void
  ) {
    this.setState({
      isConfirmDialogOpenFor: p,
    });
    closeDropdown && closeDropdown();
  }

  /**
   * beginOrderDeleteProcess
   * @param order order object of purchase
   */
  beginOrderDeleteProcess(order: CeeposOrder) {
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
   * @param order order object of purchase
   */
  beginOrderManualCompleteProcess(order: CeeposOrder) {
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
   * @returns JSX.element
   */
  render() {
    /**
     * orderDeleteDialogContent
     * @param closeDialog closeDialog
     */
    const orderDeleteDialogContent = (closeDialog: () => void) => (
      <div>
        <span>{this.props.i18n.t("content.removing", { ns: "orders" })}</span>
      </div>
    );

    /**
     * orderDeleteDialogFooter
     * @param closeDialog closeDialog
     */
    const orderDeleteDialogFooter = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.acceptOrderDelete}
        >
          {this.props.i18n.t("actions.confirmRemove", { ns: "orders" })}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.declineOrderDelete}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
      </div>
    );

    /**
     * orderCompleteDialogContent
     * @param closeDialog closeDialog
     */
    const orderCompleteDialogContent = (closeDialog: () => void) => (
      <div>
        <span>
          {this.props.i18n.t("content.finishingOrder", { ns: "orders" })}
        </span>
      </div>
    );

    /**
     * orderCompleteDialogFooter
     * @param closeDialog closeDialog
     */
    const orderCompleteDialogFooter = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "execute"]}
          onClick={this.acceptOrderManualComplete}
        >
          {this.props.i18n.t("actions.confirmSave", { ns: "orders" })}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.declineOrderManualComplete}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
      </div>
    );

    /**
     * Logic for whether new order can be created.
     *
     * If previous order(s) has state of CREATED, ONGOING or ERRORED new order cannot be created.
     *
     * IsOrderCreationDisabled
     * @returns true or false
     */
    // const IsOrderCreationDisabled =
    //   this.props.guider.currentStudent.purchases &&
    //   this.props.guider.currentStudent.purchases.filter(
    //     (purchase) =>
    //       purchase.state === "CREATED" ||
    //       purchase.state === "ONGOING" ||
    //       purchase.state === "ERRORED"
    //   ).length > 0;

    /**
     * Logic for whether already created order can be deleted
     *
     * Order can only be deleted if its' state is not COMPLETE or PAID.
     *
     * canOderBeDelete
     * @param state state
     * @returns true or false
     */
    const IsOrderDeletionDisabled = (state: string) => {
      switch (state) {
        case "COMPLETE":
        case "PAID":
          return true;
        default:
          return false;
      }
    };

    /**
     * Logic for whether order can be manually completed on behalf of student.
     *
     * Order can be manually completed only if its's state is not ONGOING, PAID or ERRORED.
     *
     * Following rules describes requirement for manual completion:
     *  - If Muikku is down when payment was made then order's state will remain as ONGOING.
     *  - If Pyramus was down when payment was made and Muikku regognized it then order's state will remain as PAID.
     *  - If something went wrong but payment was successful then order's state can be ERRORED.
     *
     * This is handled as inverse.
     *
     * IsOrderCompletionManuallyDisabled
     * @param state state
     * @returns true or false
     */
    const IsOrderCompletionManuallyDisabled = (state: string) => {
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
        {this.props.guider.currentStudent.purchases &&
        this.props.guider.currentStudent.purchases.length ? (
          <ApplicationList>
            {this.props.guider.currentStudent.purchases.map((p) => (
              <ApplicationListItem modifiers="product" key={p.id}>
                <ApplicationListItemHeader modifiers="product">
                  <span
                    className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}
                  ></span>
                  <span className="application-list__header-primary application-list__header-primary--product">
                    <span className="application-list__header-primary-title">
                      {p.product.Description}
                    </span>
                    <span className="application-list__header-primary-description">
                      {this.props.i18n.t(`states.${p.state}`, {
                        ns: "orders",
                        context: "counselor",
                      })}
                    </span>
                    <span className="application-list__header-primary-meta">
                      <span>
                        {this.props.i18n.t("labels.id", {
                          ns: "orders",
                        })}
                        : {p.id}
                      </span>
                      <span>
                        {this.props.i18n.t("labels.created")}:{" "}
                        {localize.date(p.created)}
                      </span>
                      {p.paid ? (
                        <span>
                          {this.props.i18n.t("labels.paid")}:{" "}
                          {localize.date(p.paid)}
                        </span>
                      ) : null}
                    </span>

                    {/* We show "Delete" and "Complete order" buttons only if purchase state is not COMPLETE */}
                    {p.state !== "COMPLETE" ? (
                      <span className="application-list__header-primary-actions">
                        {/* We show "Delete" button only if logged in user has REMOVE_ORDER permission or logged in user's userEntityId is the same as purchase creator userId */}
                        {this.props.status.permissions.REMOVE_ORDER ||
                        p.userEntityId === this.props.status.userId ? (
                          <Button
                            onClick={this.beginOrderDeleteProcess.bind(this, p)}
                            disabled={IsOrderDeletionDisabled(p.state)}
                            icon="trash"
                            buttonModifiers={["delete-student-order", "fatal"]}
                          >
                            {this.props.i18n.t("actions.remove", {
                              ns: "orders",
                            })}
                          </Button>
                        ) : null}

                        {/* We show "Complete order" button only if logged in user has COMPLETE_ORDER permission */}
                        {this.props.status.roles.includes(
                          Role.Administrator
                        ) ? (
                          <Button
                            onClick={this.beginOrderManualCompleteProcess.bind(
                              this,
                              p
                            )}
                            disabled={IsOrderCompletionManuallyDisabled(
                              p.state
                            )}
                            icon="forward"
                            buttonModifiers={[
                              "complete-student-order",
                              "execute",
                            ]}
                          >
                            {this.props.i18n.t("actions.finalize", {
                              ns: "orders",
                            })}
                          </Button>
                        ) : null}
                      </span>
                    ) : null}
                  </span>
                  <span className="application-list__header-secondary"></span>
                </ApplicationListItemHeader>
              </ApplicationListItem>
            ))}
          </ApplicationList>
        ) : (
          <div className="empty">
            <span>
              {this.props.i18n.t("content.noPurchases", { ns: "orders" })}
            </span>
          </div>
        )}

        {/* Delete order dialog */}
        <Dialog
          modifier="dialog-delete-order"
          isOpen={!!this.state.isDeleteDialogOpen}
          title={this.props.i18n.t("labels.remove", { ns: "orders" })}
          onClose={this.declineOrderDelete}
          content={orderDeleteDialogContent}
          footer={orderDeleteDialogFooter}
        />

        {/* Complete order manually dialog */}
        <Dialog
          modifier="dialog-complete-order"
          isOpen={!!this.state.isCompleteDialogOpen}
          title={this.props.i18n.t("labels.complete", { ns: "orders" })}
          onClose={this.declineOrderManualComplete}
          content={orderCompleteDialogContent}
          footer={orderCompleteDialogFooter}
        />
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
    locale: state.locales.current,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      deleteOrderFromCurrentStudent,
      completeOrderFromCurrentStudent,
    },
    dispatch
  );
}

export default withTranslation(["orders"])(
  connect(mapStateToProps, mapDispatchToProps)(Ceepos)
);
