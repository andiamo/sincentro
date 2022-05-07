// RADIUS REDUCER
let initialPincelState = { value: 0 };

function pincelControlReducer(state = initialPincelState, action) {
  switch (action.type) {
    case UPDATE_PINCEL:
      return { ...state, value: action.payload.value };
    case RESET_PINCEL:
      return { ...state, value: initialPincelState.value };
    default:
      return state;
  }
}

const controlsReducer = Redux.combineReducers({
  pincel: pincelControlReducer,
});
