import notifications from './base/notifications';
import locales from './base/locales';
import i18n from './general/i18n';

export default Redux.combineReducers({
  notifications,
  i18n,
  locales
});