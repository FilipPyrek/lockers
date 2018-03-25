import { fromJS } from 'immutable';

import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
} from './constants';

const initialState = fromJS({
  loading: false,
  layouts: [],
  error: null,
});

function layoutsListReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('loading', true)
                  .set('layouts', fromJS([]))
                  .set('error', null);
    case LOAD_FAIL:
      return state.set('error', fromJS(action.payload.error))
                  .set('loading', false);
    case LOAD_SUCCESS:
      return state.set('layouts', fromJS(action.payload.layouts))
                  .set('loading', false);
    default:
      return state;
  }
}

export default layoutsListReducer;
