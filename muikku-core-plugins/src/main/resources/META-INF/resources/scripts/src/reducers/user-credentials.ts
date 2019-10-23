import notifications from './base/notifications';
import locales from './base/locales';
import i18n from './base/i18n';
// import forgotPassword from './base/forgot-password';
import {combineReducers} from 'redux';

export default combineReducers({
  notifications,
  i18n,
  locales,
});