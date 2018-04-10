import { takeEvery, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  LOAD,
  LOAD_FAIL,
  LOAD_SUCCESS,
  REMOVE,
  REMOVE_FAIL,
  REMOVE_SUCCESS,
  CREATE,
  CREATE_FAIL,
  CREATE_SUCCESS,
  EDIT,
  EDIT_FAIL,
  EDIT_SUCCESS,
} from './constants';

export function* load() {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/user?token=${token}`,
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
      `/user/remove?token=${token}`,
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

export function* create({ payload }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/user/add?token=${token}`,
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
        yield put({ type: CREATE_FAIL, payload: { error: data.error } });
        return;
      }
      throw new Error(data.error);
    }
    yield put({ type: CREATE_SUCCESS, payload: data.response });
  } catch (error) {
    yield put({ type: CREATE_FAIL, payload: { error: error.message } });
  }
}

export function* edit({ payload: { id, email, password, isApi } }) {
  const token = yield select((state) => state.getIn(['global', 'token']));
  try {
    const data = yield call(
      request,
      `/user/edit/${id}?token=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          isApi,
          ...(password ? { password } : {}),
        }),
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
  yield takeEvery(LOAD, load);
  yield takeEvery(REMOVE, remove);
  yield takeEvery(CREATE, create);
  yield takeEvery(EDIT, edit);
  yield takeEvery(CREATE_SUCCESS, load);
  yield takeEvery(REMOVE_SUCCESS, load);
  yield takeEvery(EDIT_SUCCESS, load);
}
