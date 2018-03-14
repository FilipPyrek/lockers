import { fromJS } from 'immutable';

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './constants';

const initialState = fromJS({
  inProgress: false,
  error: null,
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return state.set('inProgress', true);
    case LOGIN_SUCCESS:
      return state.set('inProgress', false)
                  .set('error', null);
    case LOGIN_FAIL:
      return state.set('error', fromJS(action.payload.error))
                   .set('inProgress', false);
    default:
      return state;
  }
}

export default loginReducer;
