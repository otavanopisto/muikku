import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messages from './main-function/messages';
import {combineReducers} from 'redux';
import records from '~/reducers/main-function/records/records';
import vops from '~/reducers/main-function/vops';
import hops from '~/reducers/main-function/hops';
import yo from '~/reducers/main-function/records/yo';
import summary from '~/reducers/main-function/records/summary';
import subjectEligibility from '~/reducers/main-function/records/subject_eligibility';

export default combineReducers({
  records,
  vops,
  hops,
  yo,
  summary,
  subjectEligibility,
  notifications,
  i18n,
  locales,
  status,
  websocket,
  messages,
  title
});