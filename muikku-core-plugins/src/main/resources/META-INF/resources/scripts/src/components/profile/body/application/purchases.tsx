import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType, PurchaseType } from "~/reducers/main-function/profile";
import promisify from "~/util/promisify";
import ApplicationList, { ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list'
import Button from "~/components/general/button";
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import { errorMessageContent, errorMessageTitle } from '~/helper-functions/ceepos-error';

interface IPurchasesProps {
  i18n: i18nType,
  profile: ProfileType,
}

interface IPurchasesState {}

class Purchases extends React.Component<IPurchasesProps, IPurchasesState> {

  constructor(props: IPurchasesProps) {
    super(props);

    this.performPayment = this.performPayment.bind(this);
  }

  /**
   * performPayment
   */
  public async performPayment() {
    const currentPurchase = this.props.profile.purchases[0];
    const value: string = await promisify(mApi().ceepos.pay.create(currentPurchase.id), "callback")() as string;

    location.href = value;
  }

    /**
   * render
   * @returns
   */
  public render() {
    if (this.props.profile.location !== "purchases" || !this.props.profile.purchases) {
      return null;
    }

    const purchases = this.props.profile.purchases;

    const ongoingPuchases: PurchaseType[] = purchases.filter((purchase) => {
      return (purchase.state === "ONGOING" || purchase.state === "CREATED"  || purchase.state === "ERRORED")
    });

    const completedPurchases: PurchaseType[] = purchases.filter((purchase) => {
      return (purchase.state !== "ONGOING" && purchase.state !== "CREATED" && purchase.state !== "ERRORED")
    });

    if (!purchases.length) {
      return (
        <section>
          <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.purchases')}</h2>
          <div className="empty"><span>{this.props.i18n.text.get("plugin.profile.purchases.noOrders")}</span></div>
        </section>
      );
    }

    return (
      <section>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.purchases')}</h2>
        <div className="application-sub-panel">
          <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.purchases.activeOrder')}</h3>
          <div className="application-sub-panel__body">
            {ongoingPuchases.length ?
              <ApplicationList>
                {ongoingPuchases.map((p) => {
                  return (
                    <ApplicationListItem modifiers="product" key={p.id}>
                      <ApplicationListItemHeader modifiers="product">
                        <span className={`glyph--product-state-indicator state-${p.state} icon-shopping-cart`}></span>
                        <span className="application-list__header-primary application-list__header-primary--product">
                          <span className="application-list__header-primary-title"><b>{p.product.Description}</b></span>
                          <span className="application-list__header-primary-description">
                            {this.props.i18n.text.get("plugin.profile.purchases.description." + p.state)}
                          </span>
                          <span className="application-list__header-primary-meta">
                            <span>{this.props.i18n.text.get("plugin.profile.purchases.orderId")}: {p.id}</span>
                            <span>{this.props.i18n.text.get("plugin.profile.purchases.date.created")}: {this.props.i18n.time.format(p.created)}</span>
                            {p.paid ?
                              <span>{this.props.i18n.text.get("plugin.profile.purchases.date.paid")}: {this.props.i18n.time.format(p.paid)}</span>
                              : null}
                          </span>

                          {p.state === "CREATED" || p.state === "ONGOING" ?
                            <span className="application-list__header-primary-actions">
                              <Button
                                icon="forward"
                                buttonModifiers={["pay-student-order", "execute"]}
                                onClick={this.performPayment}>{this.props.i18n.text.get("plugin.profile.purchases.payButton.label")}
                              </Button>
                            </span> : null}

                            {p.state === "ERRORED" ?
                            <span className="application-list__header-primary-actions">
                              <CommunicatorNewMessage extraNamespace="ceepos-error"
                                initialSubject={errorMessageTitle(this.props.i18n, p)}
                                initialMessage={errorMessageContent(this.props.i18n, p, this.props.i18n.text.get("plugin.profile.purchases.description." + p.state))}><Button
                                  icon="envelope"
                                  buttonModifiers={["send-message", "info"]}
                                >{this.props.i18n.text.get("plugin.profile.purchases.sendMessageButton.label")}
                                </Button></CommunicatorNewMessage>
                            </span> : null}
                        </span>
                        <span className="application-list__header-secondary">

                        </span>
                      </ApplicationListItemHeader>
                    </ApplicationListItem>
                  );
                })}
              </ApplicationList>
            : <div className="empty">
            <span>{this.props.i18n.text.get("plugin.profile.purchases.activeOrder.empty")}</span>
          </div>}

            </div>
          </div>

          <div className="application-sub-panel">
            <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.purchases.orderHistory')}</h3>
            {completedPurchases.length ?
              <div className="application-sub-panel__body">
                <ApplicationList>
                  {completedPurchases.map((p) => {
                    return (
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
                          </span>
                          <span className="application-list__header-secondary">

                          </span>
                        </ApplicationListItemHeader>
                      </ApplicationListItem>
                    );
                  })}
                </ApplicationList>
              </div>
            : <div className="empty"><span>{this.props.i18n.text.get('plugin.profile.purchases.orderHistory.empty')}</span></div>}
          </div>
        </section>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchases);
