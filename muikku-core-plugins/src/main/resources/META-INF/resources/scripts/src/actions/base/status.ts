import {LOGOUT} from '~/actions';

export default {
  logout():LOGOUT{
    return {
      type: 'LOGOUT',
      payload: null
    }
  }
};