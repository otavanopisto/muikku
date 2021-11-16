import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import mApi from '~/lib/mApi';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { CeeposState } from '~/reducers/main-function/ceepos';
import promisify from '~/util/promisify';

interface CeeposBodyProps {
  i18n: i18nType;
  pay?: boolean;
  done?: boolean;
  status?: number;
  ceepos: CeeposState;
}

interface CeeposBodyState {

}

class CeeposBody extends React.Component<CeeposBodyProps, CeeposBodyState> {
  render() {
    let purchaseNode: React.ReactNode = null;
    if (this.props.ceepos.purchase) {
      purchaseNode = (
        <div>
          <div>{this.props.i18n.time.format(this.props.ceepos.purchase.created)}</div>
          <div>{this.props.ceepos.purchase.product.Description}</div>
          <div>{this.props.ceepos.purchase.product.Price}</div>
        </div>
      )
    } else if (this.props.ceepos.state === "ERROR") {
      purchaseNode = (
        <div>
          something went wrong
        </div>
      )
    }

    if (this.props.pay) {
      // IF THIS IS VISIBLE IT MEANS THAT THE USER ALREADY PAID
      // OR THERE WAS AN ERROR, in that case the state will be ERROR
      // DISPLAY ACCORDINGLY
      // an error occured
      // this.props.ceepos.state === "ERROR"
      // this.props.ceepos.purchase.state === "DONE"
      // YOU ALREADY PAID
      // NOTE THAT THE ceepos.purchase part takes time to load
      return (
        <div>
          {this.props.ceepos.state === "LOADING" ? <div className="loader-empty"/> : null}
          {purchaseNode}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "CANCELLED" ? <div>This purchase was cancelled</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "ERRORED" ? <div>This purchase has failed</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "PAID" ? <div>This purchase has been paid</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "ONGOING" ? <div>This purchase is ongoing</div> : null}
          {this.props.ceepos.purchase && this.props.ceepos.purchase.state === "COMPLETE" ? <div>This purchase is done</div> : null}
        </div>
      );
    } else {
      const hasSucceed = this.props.status === 1;
      const hasBeenCancelled = this.props.status === 0;
      const otherIssue = this.props.status === 99;
      const what = !hasSucceed && !hasBeenCancelled && !otherIssue;

      return (
        <div>
          {this.props.ceepos.state === "LOADING" ? <div className="loader-empty"/> : null}
          {purchaseNode}
          {hasSucceed ? <div>This purchase has succeed</div> : null}
          {hasBeenCancelled ? <div>This purchase has been cancelled</div> : null}
          {otherIssue ? <div>An error has occured during payment</div> : null}
          {what ? <div>Unknown status code</div> : null}
        </div>
      );
    }
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    ceepos: state.ceepos,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CeeposBody);
