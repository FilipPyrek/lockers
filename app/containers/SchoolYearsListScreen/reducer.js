import { fromJS } from 'immutable';

import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
} from './constants';

const initialState = fromJS({
  loading: false,
  schoolYears: [],
  error: null,
});

function schoolYearsListReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state.set('loading', true)
                  .set('schoolYears', fromJS([]))
                  .set('error', null);
    case LOAD_FAIL:
      return state.set('error', fromJS(action.payload.error))
                  .set('loading', false);
    case LOAD_SUCCESS:
      return state.set('schoolYears', fromJS(action.payload.schoolYears))
                  .set('loading', false);
    default:
      return state;
  }
}

export default schoolYearsListReducer;
