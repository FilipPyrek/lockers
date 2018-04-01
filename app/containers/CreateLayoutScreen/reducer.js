import { fromJS } from 'immutable';

import {
  RESET,
  LOAD_INITIAL_DATA_SUCCESS,
  UPDATE_BOXES,
} from './constants';

const initialState = fromJS({
  _id: null,
  boxes: {},
  name: '',
});

function createGridReducer(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case LOAD_INITIAL_DATA_SUCCESS:
      return state.merge(fromJS(action.payload));
    case UPDATE_BOXES:
      return state.mergeIn(['boxes'], action.payload.boxes);
    default:
      return state;
  }
}

export default createGridReducer;
