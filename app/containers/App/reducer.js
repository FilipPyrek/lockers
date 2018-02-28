import { fromJS } from 'immutable';

import {
  LOGIN_SUCCESS,
} from '../LoginScreen/constants';

const initialState = fromJS({
  token: null,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return state.set('token', action.payload.token);
    default:
      return state;
  }
}

export default appReducer;
