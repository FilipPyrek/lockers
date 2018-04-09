import { fromJS } from 'immutable';

import {
  RESET,
  LOAD_INITIAL_DATA_SUCCESS,
  UPDATE_LOCKERS,
} from './constants';

const initialState = fromJS({
  _id: null,
  lockers: {},
  name: '',
});

function editMapReducer(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case LOAD_INITIAL_DATA_SUCCESS:
      return state.merge(fromJS(action.payload));
    case UPDATE_LOCKERS:
      return state.setIn(['lockers'], action.payload.lockers);
    default:
      return state;
  }
}

export default editMapReducer;
