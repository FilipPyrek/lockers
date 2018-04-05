import { LOAD, REMOVE, DUPLICATE, CREATE } from './constants';

export function load() {
  return {
    type: LOAD,
  };
}

export function remove(ids) {
  return {
    type: REMOVE,
    payload: {
      ids,
    },
  };
}

export function duplicate(ids) {
  return {
    type: DUPLICATE,
    payload: {
      ids,
    },
  };
}

export function create(mapId, name) {
  return {
    type: CREATE,
    payload: {
      mapId,
      name,
    },
  };
}
