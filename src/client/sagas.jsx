import io from "socket.io-client";
import { eventChannel } from "redux-saga";
import { fork, take, call, put, cancel } from "redux-saga/effects";
import {
  logout,
  requestPattern,
  updatePattern,
} from "./actions";


function connect() {
  const socket = io('http://yourserver.com:3000/');
  return new Promise(resolve => {
      socket.on('connect', () => {
          resolve(socket);
      });
  });
}

function subscribe(socket) {
  return eventChannel(emit => {
      socket.on('patternUpdate', (pattern) => {
          emit(updatePattern(pattern));
      });

      socket.on('disconnect', () => {
          emit(logout());
      });

      return () => {
          socket.off('patternUpdate');
          socket.off('disconnect');
      };
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
      const action = yield take(channel);
      yield put(action);
  }
}

function* write(socket) {
  while (true) {
      const { payload } = yield take(requestPattern);
      socket.emit('requestPattern', { patternId: payload.id });
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(write, socket);
}

function* flow() {
  while (true) {
      const socket = yield call(connect);
      const task = yield fork(handleIO, socket);

      yield take('LOGOUT');
      socket.emit('logout');
      socket.disconnect();

      yield cancel(task);
  }
}

export default function* rootSaga() {
  yield fork(flow);
}
