import { fromJS } from 'immutable';

import {
  LOAD_INITIAL_DATA_SUCCESS,
  UPDATE_LOCKERS,
} from './constants';

const initialState = fromJS({
  _id: null,
  lockers: {},
  name: '',
});

function createGridReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_INITIAL_DATA_SUCCESS:
      return state.merge(fromJS(action.payload));
    case UPDATE_LOCKERS:
      return state.mergeIn(['lockers'], action.payload.lockers);
    default:
      return state;
  }
}

export default createGridReducer;
