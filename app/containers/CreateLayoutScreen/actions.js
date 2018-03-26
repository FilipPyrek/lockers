import {
  SAVE,
  EDIT,
  LOAD_INITIAL_DATA,
  UPDATE_BOXES,
} from './constants';

export function save(name, boxes) {
  return {
    type: SAVE,
    payload: {
      name,
      boxes,
    },
  };
}

export function edit(_id, boxes) {
  return {
    type: EDIT,
    payload: {
      _id,
      boxes,
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

export function updateBoxes(boxes) {
  return {
    type: UPDATE_BOXES,
    payload: {
      boxes,
    },
  };
}
