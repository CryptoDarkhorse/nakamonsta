const initialState = {
  data: null,
  point: 0,
  pointFactor: 0,
};

const userReducer = (state = initialState, action) => {
  if (action.type === "USER_LOGGED_IN" || action.type === "USER_UPDATED") {
    return Object.assign({}, state, {
      data: action.payload,
    });
  }

  if (action.type === "USER_LOGGED_OUT") {
    return Object.assign({}, state, {
      data: null,
    });
  }

  if (action.type === "USER_SET_POINT") {
    return Object.assign({}, state, {
      point: action.payload,
    });
  }

  if (action.type === "USER_SET_POINT_FACTOR") {
    return Object.assign({}, state, {
      pointFactor: action.payload,
    });
  }

  return state;
};

export default userReducer;
