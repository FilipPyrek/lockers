import { takeEvery, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
  REMOVE,
  REMOVE_FAIL,
  REMOVE_SUCCESS,
  DUPLICATE,
  DUPLICATE_FAIL,
  DUPLICATE_SUCCESS,
} from './constants';

export function* load() {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/map?token=${token}`,
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

export function* remove({ payload }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/map/remove?token=${token}`,
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
        yield put({ type: REMOVE_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: REMOVE_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: REMOVE_FAIL, payload: { error: error.message } });
  }
}

export function* duplicate({ payload }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/map/duplicate?token=${token}`,
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
        yield put({ type: DUPLICATE_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: DUPLICATE_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: DUPLICATE_FAIL, payload: { error: error.message } });
  }
}

export default function* defaultSaga() {
  yield takeEvery(LOAD, load);
  yield takeEvery(REMOVE, remove);
  yield takeEvery(DUPLICATE, duplicate);
  yield takeEvery(DUPLICATE_SUCCESS, load);
  yield takeEvery(REMOVE_SUCCESS, load);
}
