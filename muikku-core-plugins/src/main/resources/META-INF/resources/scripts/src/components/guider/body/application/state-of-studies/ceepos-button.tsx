import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/glyph.scss";
import { ButtonPill } from "~/components/general/button";
import {
  doOrderForCurrentStudent,
  DoOrderForCurrentStudentTriggerType,
} from "~/actions/main-function/guider";
import { PurchaseProductType } from "~/reducers/main-function/profile";
import Dialog from "~/components/general/dialog";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import Button from "~/components/general/button";

/**
 * CeeposButtonProps
 */
interface CeeposButtonProps {
  i18n: i18nType;
  status: StatusType;
  guider: GuiderType;
  doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType;
}

/**
 * CeeposButton
 * @param props
 * @returns JSX.elenment
 */
export const CeeposButton: React.FC<CeeposButtonProps> = (props) => {
  const { guider, i18n, status, doOrderForCurrentStudent } = props;

  const [isConfirmDialogOpenFor, setIsConfirmDialogOpenFor] =
    React.useState<PurchaseProductType>(null);

  /**
   * Logic for whether new order can be created.
   *
   * If previous order(s) has state of CREATED, ONGOING or ERRORED new order cannot be created.
   *
   * IsOrderCreationDisabled
   * @returns true or false
   */
  const IsOrderCreationDisabled =
    guider.currentStudent.purchases &&
    guider.currentStudent.purchases.filter(
      (purchase) =>
        purchase.state === "CREATED" ||
        purchase.state === "ONGOING" ||
        purchase.state === "ERRORED"
    ).length > 0;
  /**
   * orderConfirmDialogContent
   * @param closeDialog closeDialog
   */
  const orderConfirmDialogContent = (closeDialog: () => any) => (
    <div>
      <span>
        <b>{isConfirmDialogOpenFor && isConfirmDialogOpenFor.Description}</b>
      </span>
      <br />
      <br />
      <span>
        {i18n.text.get("plugin.guider.orderConfirmDialog.description")}
      </span>
    </div>
  );

  /**
   * acceptOrderCreation
   */
  const acceptOrderCreation = () => {
    doOrderForCurrentStudent(isConfirmDialogOpenFor);
    setIsConfirmDialogOpenFor(null);
  };

  /**
   * declineOrderCreation
   */
  const declineOrderCreation = () => {
    setIsConfirmDialogOpenFor(null);
  };

  /**
   * orderConfirmDialogFooter
   * @param closeDialog closeDialog
   */
  const orderConfirmDialogFooter = (closeDialog: () => any) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "execute"]}
        onClick={acceptOrderCreation}
      >
        {i18n.text.get("plugin.guider.orderConfirmDialog.okButton")}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={declineOrderCreation}
      >
        {i18n.text.get("plugin.guider.orderConfirmDialog.cancelButton")}
      </Button>
    </div>
  );
  /**
   * beginOrderCreationProcess
   * @param p product
   * @param closeDropdown closeDropdown
   */
  const beginOrderCreationProcess = (
    p: PurchaseProductType,
    closeDropdown?: () => any
  ) => {
    setIsConfirmDialogOpenFor(p);
    closeDropdown && closeDropdown();
  };

  return (
    <>
      {guider.availablePurchaseProducts &&
      guider.availablePurchaseProducts.length ? (
        <>
          {status.permissions.CREATE_ORDER ? (
            <Dropdown
              modifier="guider-products-selection"
              items={guider.availablePurchaseProducts.map(
                (p) => (closeDropdown: () => any) =>
                  (
                    <Link
                      className="link link--full link--purchasable-product-dropdown"
                      onClick={beginOrderCreationProcess.bind(
                        this,
                        p,
                        closeDropdown
                      )}
                    >
                      <span className="link__icon icon-plus"></span>
                      <span>{p.Description}</span>
                    </Link>
                  )
              )}
            >
              <ButtonPill
                icon="cart-plus"
                buttonModifiers={["create-student-order", "info"]}
                disabled={IsOrderCreationDisabled}
              ></ButtonPill>
            </Dropdown>
          ) : null}
        </>
      ) : (
        <div className="empty">
          <span>{i18n.text.get("plugin.guider.noPurchasableProducts")}</span>
        </div>
      )}
      {/* Confirm order creation dialog */}
      <Dialog
        modifier="dialog-confirm-order"
        isOpen={!!isConfirmDialogOpenFor}
        title={i18n.text.get("plugin.guider.orderConfirmDialog.title")}
        onClose={declineOrderCreation}
        content={orderConfirmDialogContent}
        footer={orderConfirmDialogFooter}
      />
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      doOrderForCurrentStudent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CeeposButton);
