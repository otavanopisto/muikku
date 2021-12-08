import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType } from "~/reducers/main-function/profile";
import promisify from "~/util/promisify";
import Button from "~/components/general/button";

interface IPurchasesProps {
  i18n: i18nType,
  profile: ProfileType,
}

interface IPurchasesState {
  // email: string;
}

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

    const currentPurchase = this.props.profile.purchases[0];
    const remainingPurchases = this.props.profile.purchases.slice(1);

    if (!currentPurchase) {
      return (
        <section>
          {this.props.i18n.text.get("plugin.profile.noPurchases")}
        </section>
      );
    }

    const sectionLabels = (<div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--item-labels">
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-details">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--product">
          {this.props.i18n.text.get("plugin.profile.purchases.description.label")}
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-date">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--product">
          {this.props.i18n.text.get("plugin.profile.purchases.date.label")}
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-id">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--product">
          {this.props.i18n.text.get("plugin.profile.purchases.id.label")}
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-actions">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--product">
          {this.props.i18n.text.get("plugin.profile.purchases.status.label")}
        </label>
      </span>
    </div>);

    return (
      <section>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.purchases')}</h2>
        <div className="application-sub-panel">
          <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.purchases.activeOrder')}</h3>
          {currentPurchase ? <div className="application-sub-panel__body">
            {sectionLabels}
            <div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--list-mode">
              <span title={currentPurchase.state} className={`glyph glyph--product-state-indicator state-${currentPurchase.state} icon-shopping-cart`}></span>
              <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-details">
                <span className="application-sub-panel__multiple-item-container-title"><b>{currentPurchase.product.Description}</b></span>
                <span className="application-sub-panel__multiple-item-container-description">{this.props.i18n.text.get("plugin.profile.purchases.description." + currentPurchase.state)}</span>
              </span>
              <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-date">
                {this.props.i18n.time.format(currentPurchase.created)}
              </span>
              <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-id">
                {currentPurchase.id}
              </span>
              <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-actions">
                {currentPurchase.state === "CREATED" || currentPurchase.state === "ONGOING" ?
                  <Button
                    icon="forward"
                    buttonModifiers={["pay-student-order", "execute"]}
                    onClick={this.performPayment}>{this.props.i18n.text.get("plugin.profile.purchases.payButton.label")}
                  </Button> : this.props.i18n.text.get("plugin.profile.purchases.status." + currentPurchase.state)}
              </span>
            </div>
          </div> : <div className="empty"><span>{this.props.i18n.text.get('plugin.profile.purchases.activeOrder.empty')}</span></div>}
        </div>

        <div className="application-sub-panel">
          <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.purchases.orderHistory')}</h3>
          {remainingPurchases.length ? <div className="application-sub-panel__body">
            {sectionLabels}
            {remainingPurchases.map((p) => {
              return (
              <div key={p.id} className="application-sub-panel__multiple-items application-sub-panel__multiple-items--list-mode">
                <span title={p.state} className={`glyph glyph--product-state-indicator state-${p.state} icon-shopping-cart`}></span>
                <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-details">
                  <span className="application-sub-panel__multiple-item-container-title"><b>{p.product.Description}</b></span>
                  <span className="application-sub-panel__multiple-item-container-description">{this.props.i18n.text.get("plugin.profile.purchases.description." + p.state)}</span>
                </span>
                <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-date">
                  {this.props.i18n.time.format(p.created)}
                </span>
                <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-id">
                  {p.id}
                </span>
                <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--product-actions">
                  {this.props.i18n.text.get("plugin.profile.purchases.status." + p.state)}
                </span>
              </div>

              );
            })}
          </div> : <div className="empty"><span>{this.props.i18n.text.get('plugin.profile.purchases.orderHistory.empty')}</span></div>}
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
