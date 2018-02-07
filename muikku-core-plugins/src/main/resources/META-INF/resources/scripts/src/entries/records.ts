import App from '~/containers/records';
import reducer from '~/reducers/records';
import runApp from '~/run';
import {Action} from 'redux';

import mainFunctionDefault from '~/util/base-main-function';

import titleActions from '~/actions/base/title';
import { updateAllStudentUsers } from '~/actions/main-function/records/records';

let store = runApp(reducer, App);
mainFunctionDefault(store);

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.records.pageTitle')));
store.dispatch(<Action>updateAllStudentUsers())