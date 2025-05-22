import * as React from "react";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { GuiderState } from "~/reducers/main-function/guider";
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
import Dialog from "~/components/general/dialog";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { useTranslation } from "react-i18next";
import { CeeposPurchaseProduct } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * CeeposButtonProps
 */
interface CeeposButtonProps {
  status: StatusType;
  guider: GuiderState;
  doOrderForCurrentStudent: DoOrderForCurrentStudentTriggerType;
}

/**
 * CeeposButton
 * @param props CeeposButtonProps
 * @returns JSX.elenment
 */
export const CeeposButton: React.FC<CeeposButtonProps> = (props) => {
  const { guider, status, doOrderForCurrentStudent } = props;
  const [isConfirmDialogOpenFor, setIsConfirmDialogOpenFor] =
    React.useState<CeeposPurchaseProduct>(null);

  const { t } = useTranslation("orders");
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
  const orderConfirmDialogContent = (closeDialog: () => void) => (
    <div>
      <span>
        <b>{isConfirmDialogOpenFor && isConfirmDialogOpenFor.Description}</b>
      </span>
      <br />
      <br />
      <span>{t("content.orderConfirmed")}</span>
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
  const orderConfirmDialogFooter = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "execute"]}
        onClick={acceptOrderCreation}
      >
        {t("actions.create", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={declineOrderCreation}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );
  /**
   * beginOrderCreationProcess
   * @param p product
   * @param closeDropdown closeDropdown
   */
  const beginOrderCreationProcess = (
    p: CeeposPurchaseProduct,
    closeDropdown?: () => void
  ) => {
    setIsConfirmDialogOpenFor(p);
    closeDropdown && closeDropdown();
  };

  const Links = guider.availablePurchaseProducts.map((p) => {
    /**
     * Link
     * @param closeDropdown prop drilling for portal
     * @returns a link
     */
    const link = (closeDropdown: () => void) => (
      <Link
        key={p.Code}
        className="link link--full link--purchasable-product-dropdown"
        onClick={beginOrderCreationProcess.bind(this, p, closeDropdown)}
      >
        <span className="link__icon icon-plus"></span>
        <span>{p.Description}</span>
      </Link>
    );
    return link;
  });

  return (
    <>
      {guider.availablePurchaseProducts &&
      guider.availablePurchaseProducts.length ? (
        <>
          {status.permissions.CREATE_ORDER ? (
            <Dropdown modifier="guider-products-selection" items={Links}>
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
          <span>{t("content.noProducts")}</span>
        </div>
      )}
      {/* Confirm order creation dialog */}
      <Dialog
        modifier="dialog-confirm-order"
        isOpen={!!isConfirmDialogOpenFor}
        title={t("labels.confirm")}
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
    guider: state.guider,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      doOrderForCurrentStudent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CeeposButton);
