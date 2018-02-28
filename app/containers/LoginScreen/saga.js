import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
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
    if (data.error) {
      throw new Error(data.error);
    }
    yield put({ type: LOGIN_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: LOGIN_FAIL, payload: { error: error.message } });
  }
}

export function* redirect() {
  yield put(push('/'));
}

export default function* login() {
  yield takeEvery(LOGIN, fetchData);
  yield takeEvery(LOGIN_SUCCESS, redirect);
}
