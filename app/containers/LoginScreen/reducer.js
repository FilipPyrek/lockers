import { fromJS } from 'immutable';

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './constants';

const initialState = fromJS({
  inProgress: false,
  error: null,
  token: null,
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return state.set('inProgress', true);
    case LOGIN_SUCCESS:
      return state.set('token', action.payload.token)
                   .set('inProgress', false);
    case LOGIN_FAIL:
      return state.set('error', action.payload.error)
                   .set('inProgress', false);
    default:
      return state;
  }
}

export default loginReducer;
