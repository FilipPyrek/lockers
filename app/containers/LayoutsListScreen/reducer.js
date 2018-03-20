import { fromJS } from 'immutable';

import {
  LOAD_SUCCESS,
} from './constants';

const initialState = fromJS({
  layouts: [],
});

function createGridReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SUCCESS:
      return state.set('layouts', fromJS(action.payload.layouts));
    default:
      return state;
  }
}

export default createGridReducer;
