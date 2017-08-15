import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './general/i18n';

export default Redux.combineReducers({
  notifications,
  i18n,
  locales,
  status
});