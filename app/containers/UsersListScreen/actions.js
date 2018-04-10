import { LOAD, REMOVE, CREATE, EDIT } from './constants';

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

export function create(email, password, isApi) {
  return {
    type: CREATE,
    payload: {
      email,
      password,
      isApi,
    },
  };
}

export function edit(id, email, password, isApi) {
  return {
    type: EDIT,
    payload: {
      id,
      email,
      password,
      isApi,
    },
  };
}
