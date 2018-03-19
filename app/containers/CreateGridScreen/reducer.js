import { fromJS } from 'immutable';

import {
  SAVE,
} from './constants';

const initialState = fromJS({
});

function createGridReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE:
      return state;
    default:
      return state;
  }
}

export default createGridReducer;
