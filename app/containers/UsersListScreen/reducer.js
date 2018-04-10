import { fromJS } from 'immutable';

import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
} from './constants';

const initialState = fromJS({
  loading: false,
  users: [],
  error: null,
});

function usersListReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('loading', true)
                  .set('users', fromJS([]))
                  .set('error', null);
    case LOAD_FAIL:
      return state.set('error', fromJS(action.payload.error))
                  .set('loading', false);
    case LOAD_SUCCESS:
      return state.set('users', fromJS(action.payload.users))
                  .set('loading', false);
    default:
      return state;
  }
}

export default usersListReducer;
