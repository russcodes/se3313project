import { combineReducers } from "redux";
import { createReducer } from "redux-act";
import {
  login,
  logout,
  addUser,
  removeUser,
  requestPattern,
  updatePattern,
  newRoom,
  getRoom
} from "./actions";


const initial = {
  app: {
    username: null,
    room: null,
    rooms: []
  },
  users: {},
  patterns: {
    currentPattern: null
  }
};

const app = createReducer({
  [login]: (state, payload) => ({ ...state, username: payload.username, room: payload.room }),
  [logout]: (state, payload) => ({ ...state, username: null, room: null }),
  [newRoom]: (state, payload) => {
    let { rooms } = state;
    rooms.push({ name: payload.room, counts: 0 });
    return { ...state, rooms: rooms };
  },
  [getRoom]: (state, payload) => ({ ...state, rooms: payload.rooms }),
}, initial.app);

const users = createReducer({
  [addUser]: (state, payload) => ({ ...state, [payload.username]: true }),
  [removeUser]: (state, payload) => {
    const newState = { ...state };
    delete newState[payload.username];
    return newState;
  },
}, initial.users);

const patterns = createReducer({
  [requestPattern]: (state, { pattern }) => ({ ...state, currentPattern: pattern }),
  [updatePattern]: (state, { pattern }) => ({ ...state, currentPattern: pattern })
}, initial.patterns);


export default combineReducers({
  app,
  users,
  patterns
});
