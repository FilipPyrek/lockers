import { fromJS } from 'immutable';

import {
  LOGIN,
} from './constants';

const initialState = fromJS({
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      console.log(action.payload.email, action.payload.password);
      return state;
    default:
      return state;
  }
}

export default loginReducer;
