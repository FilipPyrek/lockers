import { fromJS } from 'immutable';

import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
} from './constants';

const initialState = fromJS({
  loading: false,
  layouts: [],
});

function createGridReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('loading', true);
    case LOAD_FAIL:
      return state.set('loading', false);
    case LOAD_SUCCESS:
      return state.set('layouts', fromJS(action.payload.layouts))
                   .set('loading', false);
    default:
      return state;
  }
}

export default createGridReducer;
