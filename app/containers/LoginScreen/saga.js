import { takeEvery, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './constants';

export function* fetchData({ payload }) {
  try {
    const data = yield call(
      request,
      '/user/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    yield put({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: LOGIN_FAIL, payload: { error } });
  }
}

export default function* login() {
  yield takeEvery(LOGIN, fetchData);
}
