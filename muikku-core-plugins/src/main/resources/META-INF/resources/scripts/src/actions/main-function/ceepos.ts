import actions from '../base/notifications';
import promisify from '~/util/promisify';
import { AnyActionType, SpecificActionType } from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import { HOPSDataType, HOPSStatusType, HOPSEligibilityType } from '~/reducers/main-function/hops';
import { StateType } from '~/reducers';
import { CeepostStateStatusType } from '~/reducers/main-function/ceepos';
import { PurchaseType } from '~/reducers/main-function/profile';

export interface LoadCeeposPurchaseTriggerType {
  (purchaseId: number): AnyActionType
}

export interface UPDATE_CEEPOS_PURCHASE extends SpecificActionType<"UPDATE_CEEPOS_PURCHASE", PurchaseType> { }
export interface UPDATE_CEEPOS_STATE extends SpecificActionType<"UPDATE_CEEPOS_STATE", CeepostStateStatusType> { }

let loadCeeposPurchase: LoadCeeposPurchaseTriggerType = function loadCeeposPurchase(purchaseId) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeepostStateStatusType>"LOADING"
      });
      const studentId = getState().status.userSchoolDataIdentifier;
      const purchase = await promisify(mApi().ceepos.user.order.read(studentId, purchaseId), "callback")() as PurchaseType;
      dispatch({
        type: 'UPDATE_CEEPOS_PURCHASE',
        payload: purchase,
      });
      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeepostStateStatusType>"READY"
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.ceepos.errormessage.orderLoadFailed"), 'error'));
      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeepostStateStatusType>"ERROR"
      });
    }
  }
}

let loadCeeposPurchaseAndPay: LoadCeeposPurchaseTriggerType = function loadCeeposPurchase(purchaseId) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeepostStateStatusType>"LOADING"
      });
      const studentId = getState().status.userSchoolDataIdentifier;
      const purchase = await promisify(mApi().ceepos.user.order.read(studentId, purchaseId), "callback")() as PurchaseType;

      if (purchase.state === "CREATED" || purchase.state === "ONGOING") {
        const value: string = await promisify(mApi().ceepos.pay.create({ 'id': purchaseId }), "callback")() as string;
        location.href = value;
      }

      dispatch({
        type: 'UPDATE_CEEPOS_PURCHASE',
        payload: purchase,
      });
      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeepostStateStatusType>"READY"
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.ceepos.errormessage.orderLoadFailed"), 'error'));
      dispatch({
        type: 'UPDATE_CEEPOS_STATE',
        payload: <CeepostStateStatusType>"ERROR"
      });
    }
  }
}

export default { loadCeeposPurchase, loadCeeposPurchaseAndPay };
export { loadCeeposPurchase, loadCeeposPurchaseAndPay };
