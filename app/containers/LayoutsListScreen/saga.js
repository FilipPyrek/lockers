import { takeEvery, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
} from './constants';

export function* load() {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/locker/layout?token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (data.error) {
      if (typeof data.error === 'object') {
        yield put({ type: LOAD_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: LOAD_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: LOAD_FAIL, payload: { error: error.message } });
  }
}


export default function* defaultSaga() {
  yield takeEvery(LOAD, load);
}
