// PINCEL CONTROL ACTIONS
let UPDATE_PINCEL = "UPDATE_PINCEL";
let RESET_PINCEL = "RESET_PINCEL";

function updatePincel(value) {
  return {
    type: UPDATE_PINCEL,
    payload: {
      value,
    },
  };
}

function resetPincel() {
  return {
    type: RESET_RADIUS,
  };
}
