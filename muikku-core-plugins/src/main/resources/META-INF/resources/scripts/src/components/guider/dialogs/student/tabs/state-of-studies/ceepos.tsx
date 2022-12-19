import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { GuiderType } from "~/reducers/main-function/guider";
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
import {
  PurchaseProductType,
  PurchaseType,
} from "~/reducers/main-function/profile";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";

/**
 * CeeposProps
 */
interface CeeposProps {
  i18nOLD: i18nType;
  status: StatusType;
  guider: GuiderType;
  locale: string;
  deleteOrderFromCurrentStudent: DeleteOrderFromCurrentStudentTriggerType;
  completeOrderFromCurrentStudent: CompleteOrderFromCurrentStudentTriggerType;
}

/**
 * CeeposState
 */
interface CeeposState {
  isConfirmDialogOpenFor: PurchaseProductType | null;
  isDeleteDialogOpen: boolean;
  orderToBeDeleted: PurchaseType | null;
  isCompleteDialogOpen: boolean;
  orderToBeCompleted: PurchaseType | null;
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
    p: PurchaseProductType,
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
   * @param order order object of purchase
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
   * @returns JSX.element
   */
  render() {
    /**
     * orderDeleteDialogContent
     * @param closeDialog closeDialog
     */
    const orderDeleteDialogContent = (closeDialog: () => void) => (
      <div>
        <span>
          {this.props.i18nOLD.text.get(
            "plugin.guider.orderDeleteDialog.description"
          )}
        </span>
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
          {this.props.i18nOLD.text.get(
            "plugin.guider.orderDeleteDialog.okButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.declineOrderDelete}
        >
          {this.props.i18nOLD.text.get(
            "plugin.guider.orderDeleteDialog.cancelButton"
          )}
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
          {this.props.i18nOLD.text.get(
            "plugin.guider.orderCompleteDialog.description"
          )}
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
          {this.props.i18nOLD.text.get(
            "plugin.guider.orderCompleteDialog.okButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.declineOrderManualComplete}
        >
          {this.props.i18nOLD.text.get(
            "plugin.guider.orderCompleteDialog.cancelButton"
          )}
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
     * Order can only be deleted if its' state is not ONGOING, COMPLETE or PAID.
     *
     * canOderBeDelete
     * @param state state
     * @returns true or false
     */
    const IsOrderDeletionDisabled = (state: string) => {
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
                      {this.props.i18nOLD.text.get(
                        "plugin.guider.purchases.description." + p.state
                      )}
                    </span>
                    <span className="application-list__header-primary-meta">
                      <span>
                        {this.props.i18nOLD.text.get(
                          "plugin.guider.purchases.orderId"
                        )}
                        : {p.id}
                      </span>
                      <span>
                        {this.props.i18nOLD.text.get(
                          "plugin.guider.purchases.date.created"
                        )}
                        : {this.props.i18nOLD.time.format(p.created)}
                      </span>
                      {p.paid ? (
                        <span>
                          {this.props.i18nOLD.text.get(
                            "plugin.guider.purchases.date.paid"
                          )}
                          : {this.props.i18nOLD.time.format(p.paid)}
                        </span>
                      ) : null}
                    </span>

                    {/* We show "Delete" and "Complete order" buttons only if purchase state is not COMPLETE */}
                    {p.state !== "COMPLETE" ? (
                      <span className="application-list__header-primary-actions">
                        {/* We show "Delete" button only if logged in user has REMOVE_ORDER permission or logged in user's userEntityId is the same as purchase creator userId */}
                        {this.props.status.permissions.REMOVE_ORDER ||
                        p.creator.userEntityId === this.props.status.userId ? (
                          <Button
                            onClick={this.beginOrderDeleteProcess.bind(this, p)}
                            disabled={IsOrderDeletionDisabled(p.state)}
                            icon="trash"
                            buttonModifiers={["delete-student-order", "fatal"]}
                          >
                            {this.props.i18nOLD.text.get(
                              "plugin.guider.purchase.deleteOrderLink"
                            )}
                          </Button>
                        ) : null}

                        {/* We show "Complete order" button only if logged in user has COMPLETE_ORDER permission */}
                        {this.props.status.role === "ADMINISTRATOR" ? (
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
                            {this.props.i18nOLD.text.get(
                              "plugin.guider.purchase.completeOrderLink"
                            )}
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
              {this.props.i18nOLD.text.get("plugin.guider.noPurchases")}
            </span>
          </div>
        )}

        {/* Delete order dialog */}
        <Dialog
          modifier="dialog-delete-order"
          isOpen={!!this.state.isDeleteDialogOpen}
          title={this.props.i18nOLD.text.get(
            "plugin.guider.orderDeleteDialog.title"
          )}
          onClose={this.declineOrderDelete}
          content={orderDeleteDialogContent}
          footer={orderDeleteDialogFooter}
        />

        {/* Complete order manually dialog */}
        <Dialog
          modifier="dialog-complete-order"
          isOpen={!!this.state.isCompleteDialogOpen}
          title={this.props.i18nOLD.text.get(
            "plugin.guider.orderCompleteDialog.title"
          )}
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
    i18nOLD: state.i18nOLD,
    guider: state.guider,
    locale: state.locales.current,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      deleteOrderFromCurrentStudent,
      completeOrderFromCurrentStudent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Ceepos);
