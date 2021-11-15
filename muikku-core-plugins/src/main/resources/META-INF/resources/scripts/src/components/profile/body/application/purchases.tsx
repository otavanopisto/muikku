import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType } from "~/reducers/main-function/profile";
import promisify from "~/util/promisify";

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

    // this.state = {
    //   email: "",
    // }
  }

  // public componentDidUpdate(prevProps: IPurchasesProps) {
  //   const currentPurchase = this.props.profile.purchases && this.props.profile.purchases[0];
  //   const prevPurchase = prevProps.profile.purchases && prevProps.profile.purchases[0];

  //   if (currentPurchase === prevPurchase || (currentPurchase && currentPurchase.id) === (prevPurchase && prevPurchase.id)) {
  //     return;
  //   }

  //   this.setState({
  //     email: currentPurchase.studentEmail,
  //   });
  // }

  // public onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   this.setState({
  //     email: e.target.value,
  //   });
  // }

  public async performPayment() {
    const currentPurchase = this.props.profile.purchases[0];
    const value: string = await promisify(mApi().ceepos.pay.create({'id': currentPurchase.id}), "callback")() as string;

    location.href = value;
  }

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

    return (
      <section>
        <div>
          <div>{currentPurchase.product.Description}</div>
          <div>{this.props.i18n.time.format(currentPurchase.created)}</div>
          <div>{currentPurchase.state}</div>
          <div>{currentPurchase.id}</div>
          <div>{currentPurchase.studentEmail}</div>
          {/* <input type="text" value={this.state.email} onChange={this.onEmailChange}/> */}
          {
            currentPurchase.state === "CREATED" ?
            <button onClick={this.performPayment}>{this.props.i18n.text.get("plugin.profile.pay")}</button> :
            null
          }
        </div>

        {remainingPurchases.length ? <div>
          {remainingPurchases.map((p) => {
            return (
              <div key={p.id}>
                <span>{this.props.i18n.time.format(currentPurchase.created)}</span>
                <span>{p.product.Description}</span>
                <span>{p.state}</span>
              </div>
            );
          })}
        </div> : null}
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
