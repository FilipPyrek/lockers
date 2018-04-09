import { fromJS } from 'immutable';

import {
  LOAD_INITIAL_DATA_SUCCESS,
  UPDATE_LOCKERS,
  UPDATE_CLASSES,
} from './constants';

const initialState = fromJS({
  _id: null,
  lockers: {},
  name: '',
  classes: [],
});

function createGridReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_INITIAL_DATA_SUCCESS:
      return state.merge(fromJS(action.payload));
    case UPDATE_LOCKERS:
      return state.set('lockers', action.payload.lockers);
    case UPDATE_CLASSES:
      return state.set('classes', action.payload.classes);
    default:
      return state;
  }
}

export default createGridReducer;
