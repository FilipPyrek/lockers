import { takeEvery, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import {
  SAVE,
  SAVE_SUCCESS,
  SAVE_FAIL,
} from './constants';


export function* sendData({ payload }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/locker/layout/add?token=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    if (data.error) {
      if (typeof data.error === 'object') {
        yield put({ type: SAVE_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: SAVE_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: SAVE_FAIL, payload: { error: error.message } });
  }
}

export function* redirect() {
  yield put(push('/layouts'));
}

export default function* save() {
  yield takeEvery(SAVE, sendData);
  yield takeEvery(SAVE_SUCCESS, redirect);
}
