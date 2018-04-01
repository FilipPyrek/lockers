import {
  EDIT,
  LOAD_INITIAL_DATA,
  UPDATE_LOCKERS,
} from './constants';

export function edit(_id, lockers) {
  return {
    type: EDIT,
    payload: {
      _id,
      lockers,
    },
  };
}


export function loadInitialData(id) {
  return {
    type: LOAD_INITIAL_DATA,
    payload: {
      id,
    },
  };
}

export function updateLockers(lockers) {
  return {
    type: UPDATE_LOCKERS,
    payload: {
      lockers,
    },
  };
}
