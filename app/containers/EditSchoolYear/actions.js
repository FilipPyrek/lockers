import {
  EDIT,
  LOAD_INITIAL_DATA,
  UPDATE_LOCKERS,
  UPDATE_CLASSES,
} from './constants';

export function edit(_id, lockers, classes) {
  return {
    type: EDIT,
    payload: {
      _id,
      lockers,
      classes,
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

export function updateClasses(classes) {
  return {
    type: UPDATE_CLASSES,
    payload: {
      classes,
    },
  };
}
