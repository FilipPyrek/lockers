import { SAVE } from './constants';

export function save(name, boxes) {
  return {
    type: SAVE,
    payload: {
      name,
      boxes,
    },
  };
}
