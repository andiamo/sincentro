// Redux store
var store = Redux.createStore(controlsReducer);

/**
 * @description Helper function to select a part of the state and trigger function on change
 */
function observe(select, onChange) {
  let currentSelectedState;
  function handleChange() {
    const nextState = store.getState();
    const nextSelectedState = select(nextState);
    if (nextSelectedState !== currentSelectedState) {
      currentSelectedState = nextSelectedState;
      onChange(currentSelectedState, nextState);
    }
  }
  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
