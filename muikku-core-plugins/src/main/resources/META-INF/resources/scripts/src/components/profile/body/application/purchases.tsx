import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { localize } from "~/locales/i18n";
import { ProfileState } from "~/reducers/main-function/profile";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";
import { CeeposOrder } from "~/generated/client";
import MApi from "~/api/api";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * IPurchasesProps
 */
interface IPurchasesProps extends WithTranslation {
  profile: ProfileState;
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
    const ceeposApi = MApi.getCeeposApi();

    const currentPurchase = this.props.profile.purchases[0];

    const value = await ceeposApi.createCeeposPay({
      orderId: currentPurchase.id,
    });

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

    const ongoingPuchases: CeeposOrder[] = purchases.filter(
      (purchase) =>
        purchase.state === "ONGOING" ||
        purchase.state === "CREATED" ||
        purchase.state === "ERRORED"
    );

    const completedPurchases: CeeposOrder[] = purchases.filter(
      (purchase) =>
        purchase.state !== "ONGOING" &&
        purchase.state !== "CREATED" &&
        purchase.state !== "ERRORED"
    );

    if (!purchases.length) {
      return (
        <section>
          <h2 className="application-panel__content-header">
            {this.props.t("labels.orders", { ns: "orders" })}
          </h2>
          <div className="empty">
            <span>
              {this.props.t("content.empty", {
                ns: "orders",
                context: "orders",
              })}
            </span>
          </div>
        </section>
      );
    }

    return (
      <section>
        <h2 className="application-panel__content-header">
          {this.props.t("labels.orders", { ns: "orders" })}
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
                          {this.props.t(`states.${p.state}`, {
                            context: "student",
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
                            {localize.date(p.created)}
                          </span>
                          {p.paid ? (
                            <span>
                              {this.props.t("labels.paid")} :{" "}
                              {localize.date(p.paid)}
                            </span>
                          ) : null}
                        </span>

                        {p.state === "CREATED" || p.state === "ONGOING" ? (
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
            {this.props.t("labels.history", {
              ns: "orders",
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
                          {this.props.t(`states.${p.state}`, {
                            context: "student",
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
                            {localize.date(p.created)}
                          </span>
                          {p.paid ? (
                            <span>
                              {this.props.t("labels.paid")}:{" "}
                              {localize.date(p.paid)}
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
            <div className="application-sub-panel__body">
              <div className="empty">
                <span>
                  {this.props.t("content.empty", {
                    ns: "orders",
                    context: "history",
                  })}
                </span>
              </div>
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
    profile: state.profile,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(Purchases)
);
