import actions from '../base/notifications';
import promisify from '~/util/promisify';
import { AnyActionType, SpecificActionType } from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import { StateType } from '~/reducers';
import { CeeposStateStatusType, CeeposPayStatusCodeType } from '~/reducers/main-function/ceepos';
import { PurchaseType } from '~/reducers/main-function/profile';

export interface LoadCeeposPurchaseTriggerType {
  (purchaseId: number): AnyActionType
}

export interface UPDATE_CEEPOS_PURCHASE extends SpecificActionType<"UPDATE_CEEPOS_PURCHASE", PurchaseType> { }
export interface UPDATE_CEEPOS_STATE extends SpecificActionType<"UPDATE_CEEPOS_STATE", CeeposStateStatusType> { }
export interface UPDATE_CEEPOS_PAY_STATUS extends SpecificActionType<"UPDATE_CEEPOS_PAY_STATUS", CeeposPayStatusCodeType> { }


let loadCeeposPurchase: LoadCeeposPurchaseTriggerType = function loadCeeposPurchase(purchaseId) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {

      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeeposStateStatusType>"LOADING"
      });

      const studentId = getState().status.userSchoolDataIdentifier;
      const purchase = await promisify(mApi().ceepos.user.order.read(studentId, purchaseId), "callback")() as PurchaseType;

      dispatch({
        type: 'UPDATE_CEEPOS_PURCHASE',
        payload: purchase,
      });

      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeeposStateStatusType>"READY"
      });

    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }

      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.ceepos.errormessage.orderLoadFailed"), 'error'));

      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeeposStateStatusType>"ERROR"
      });
    }
  }
}

let loadCeeposPurchaseAndPay: LoadCeeposPurchaseTriggerType = function loadCeeposPurchase(purchaseId) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {

      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeeposStateStatusType>"LOADING"
      });

      const value: string = await promisify(mApi().ceepos.pay.create(purchaseId), "callback")() as string;
      location.href = value;

      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeeposStateStatusType>"READY"
      });
    } catch (err) {

      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeeposStateStatusType>"ERROR"
      });

      dispatch({
        type: 'UPDATE_CEEPOS_PAY_STATUS',
        payload: err.message
      });
    }
  }
}

export default { loadCeeposPurchase, loadCeeposPurchaseAndPay };
export { loadCeeposPurchase, loadCeeposPurchaseAndPay };
