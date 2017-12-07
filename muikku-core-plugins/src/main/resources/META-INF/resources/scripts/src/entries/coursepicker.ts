import App from '~/containers/coursepicker';
import reducer from '~/reducers/coursepicker';
import runApp from '~/run';
import {Action} from 'redux';
import mainFunctionDefault from '~/util/base-main-function';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';
import { loadUserIndexBySchoolData } from '~/actions/main-function/user-index';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('TODO coursepicker title')));
store.dispatch(<Action>loadUserIndexBySchoolData(store.getState().status.userSchoolDataIdentifier));