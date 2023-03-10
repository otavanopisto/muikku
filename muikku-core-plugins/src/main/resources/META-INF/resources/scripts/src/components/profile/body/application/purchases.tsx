import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import {
  ProfileType,
  PurchaseType,
  PurchaseStateType,
} from "~/reducers/main-function/profile";
import promisify from "~/util/promisify";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { getName } from "~/util/modifiers";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import {
  getErrorMessageContent,
  getErrorMessageTitle,
} from "~/helper-functions/ceepos-error";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * IPurchasesProps
 */
interface IPurchasesProps extends WithTranslation {
  i18nOLD: i18nType;
  profile: ProfileType;
}

/**
 * IPurchasesState
 */
interface IPurchasesState {}

/**
 * Purchases
 */
class Purchases extends React.Component<IPurchasesProps, IPurchasesState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: IPurchasesProps) {
    super(props);

    this.performPayment = this.performPayment.bind(this);
  }

  /**
   * performPayment
   */
  public async performPayment() {
    const currentPurchase = this.props.profile.purchases[0];
    const value: string = (await promisify(
      mApi().ceepos.pay.create(currentPurchase.id),
      "callback"
    )()) as string;

    location.href = value;
  }

  /**
   * render
   */
  public render() {
    if (
      this.props.profile.location !== "purchases" ||
      !this.props.profile.purchases
    ) {
      return null;
    }

    const purchases = this.props.profile.purchases;

    const ongoingPuchases: PurchaseType[] = purchases.filter(
      (purchase) =>
        purchase.state === PurchaseStateType.ONGOING ||
        purchase.state === PurchaseStateType.CREATED ||
        purchase.state === PurchaseStateType.ERRORED
    );

    const completedPurchases: PurchaseType[] = purchases.filter(
      (purchase) =>
        purchase.state !== PurchaseStateType.ONGOING &&
        purchase.state !== PurchaseStateType.CREATED &&
        purchase.state !== PurchaseStateType.ERRORED
    );

    if (!purchases.length) {
      return (
        <section>
          <h2 className="application-panel__content-header">
            {this.props.t("labels.orders_other", { ns: "orders" })}
          </h2>
          <div className="empty">
            <span>{this.props.t("content.empty", { ns: "orders" })}</span>
          </div>
        </section>
      );
    }

    return (
      <section>
        <h2 className="application-panel__content-header">
          {this.props.t("labels.orders_other", { ns: "orders" })}
        </h2>
        <div className="application-sub-panel">
          <h3 className="application-sub-panel__header">
            {this.props.t("labels.open", { ns: "orders" })}
          </h3>
          <div className="application-sub-panel__body">
            {ongoingPuchases.length > 0 ? (
              <ApplicationList>
                {ongoingPuchases.map((p) => (
                  <ApplicationListItem modifiers="product" key={p.id}>
                    <ApplicationListItemHeader modifiers="product">
                      <span
                        className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}
                      ></span>
                      <span className="application-list__header-primary application-list__header-primary--product">
                        <span className="application-list__header-primary-title">
                          <b>{p.product.Description}</b>
                        </span>
                        <span className="application-list__header-primary-description">
                          {this.props.t("content.state", {
                            context: p.state,
                            ns: "orders",
                          })}
                        </span>
                        <span className="application-list__header-primary-meta">
                          <span>
                            {this.props.t("labels.id", { ns: "orders" })}:{" "}
                            {p.id}
                          </span>
                          <span>
                            {this.props.t("labels.created")}:{" "}
                            {this.props.i18nOLD.time.format(p.created)}
                          </span>
                          {p.paid ? (
                            <span>
                              {this.props.t("labels.paid")} :{" "}
                              {this.props.i18nOLD.time.format(p.paid)}
                            </span>
                          ) : null}
                        </span>

                        {p.state === PurchaseStateType.CREATED ||
                        p.state === PurchaseStateType.ONGOING ? (
                          <span className="application-list__header-primary-actions">
                            <Button
                              icon="forward"
                              buttonModifiers={["pay-student-order", "execute"]}
                              onClick={this.performPayment}
                            >
                              {this.props.t("actions.pay", { ns: "orders" })}
                            </Button>
                          </span>
                        ) : null}

                        {p.state === PurchaseStateType.ERRORED ||
                        p.state === PurchaseStateType.CANCELLED ||
                        p.state === PurchaseStateType.PAID ? (
                          <span className="application-list__header-primary-actions">
                            <CommunicatorNewMessage
                              extraNamespace="ceepos-error"
                              initialSelectedItems={[
                                {
                                  type: "staff",
                                  value: {
                                    id: p.creator.userEntityId,
                                    name: getName(p.creator, true),
                                  },
                                },
                              ]}
                              initialSubject={getErrorMessageTitle(p)}
                              initialMessage={getErrorMessageContent(
                                this.props.i18nOLD,
                                p,
                                this.props.t("content.state", {
                                  context: p.state,
                                  ns: "orders",
                                })
                              )}
                            >
                              <Button
                                icon="envelope"
                                buttonModifiers={["send-message", "info"]}
                              >
                                {this.props.t("actions.reportError")}
                              </Button>
                            </CommunicatorNewMessage>
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
                <span>{this.props.t("content.empty", { ns: "orders" })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="application-sub-panel">
          <h3 className="application-sub-panel__header">
            {this.props.t("content.empty", {
              ns: "orders",
              context: "history",
            })}
          </h3>
          {completedPurchases.length > 0 ? (
            <div className="application-sub-panel__body">
              <ApplicationList>
                {completedPurchases.map((p) => (
                  <ApplicationListItem modifiers="product" key={p.id}>
                    <ApplicationListItemHeader modifiers="product">
                      <span
                        className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}
                      ></span>
                      <span className="application-list__header-primary application-list__header-primary--product">
                        <span className="application-list__header-primary-title">
                          <b>{p.product.Description}</b>
                        </span>
                        <span className="application-list__header-primary-description">
                          {this.props.t("content.state", {
                            context: p.state,
                            ns: "orders",
                          })}
                        </span>
                        <span className="application-list__header-primary-meta">
                          <span>
                            {this.props.t("labels.id", { ns: "orders" })}:{" "}
                            {p.id}
                          </span>
                          <span>
                            {this.props.t("labels.created")}:{" "}
                            {this.props.i18nOLD.time.format(p.created)}
                          </span>
                          {p.paid ? (
                            <span>
                              {this.props.t("labels.paid")}:{" "}
                              {this.props.i18nOLD.time.format(p.paid)}
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="application-list__header-secondary"></span>
                    </ApplicationListItemHeader>
                  </ApplicationListItem>
                ))}
              </ApplicationList>
            </div>
          ) : (
            <div className="empty">
              <span>
                {this.props.t("content.empty", {
                  ns: "orders",
                  context: "history",
                })}
              </span>
            </div>
          )}
        </div>
      </section>
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
    profile: state.profile,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(Purchases)
);
