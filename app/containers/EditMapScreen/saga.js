import { takeEvery, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import {
  SAVE,
  SAVE_SUCCESS,
  SAVE_FAIL,
  EDIT,
  EDIT_SUCCESS,
  EDIT_FAIL,
  LOAD_INITIAL_DATA,
  LOAD_INITIAL_DATA_SUCCESS,
  LOAD_INITIAL_DATA_FAIL,
} from './constants';


export function* sendData({ payload }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/map/add?token=${token}`,
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
  yield put(push('/maps'));
}

export function* loadInitialData({ payload }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/map/${payload.id}/?token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (data.error) {
      if (typeof data.error === 'object') {
        yield put({ type: LOAD_INITIAL_DATA_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: LOAD_INITIAL_DATA_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: LOAD_INITIAL_DATA_FAIL, payload: { error: error.message } });
  }
}

export function* editData({ payload: { _id, lockers } }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/map/edit/${_id}/?token=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lockers }),
      }
    );
    if (data.error) {
      if (typeof data.error === 'object') {
        yield put({ type: EDIT_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: EDIT_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: EDIT_FAIL, payload: { error: error.message } });
  }
}


export default function* defaultSaga() {
  yield takeEvery(SAVE, sendData);
  yield takeEvery(SAVE_SUCCESS, redirect);
  yield takeEvery(EDIT, editData);
  yield takeEvery(EDIT_SUCCESS, redirect);
  yield takeEvery(LOAD_INITIAL_DATA, loadInitialData);
}
