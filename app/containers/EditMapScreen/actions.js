import {
  RESET,
  SAVE,
  EDIT,
  LOAD_INITIAL_DATA,
  UPDATE_LOCKERS,
} from './constants';

export function reset() {
  return {
    type: RESET,
  };
}

export function save(name, lockers) {
  return {
    type: SAVE,
    payload: {
      name,
      lockers,
    },
  };
}

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
