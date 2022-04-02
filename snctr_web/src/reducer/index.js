const getInitialState = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedPath = urlParams.get("path");
  const urlPath = sharedPath !== "" ? sharedPath : null;
  return {
    range: null,
    search: null,
    subjects: null,
    types: null,
    searchOpen: null,
    sideOpen: null,
    searchHeight: document.getElementById("search").offsetHeight + 55,
    path: null,
    urlPath,
  };
};

const initialState = getInitialState();

function filters(state = initialState, action) {
  switch (action.type) {
    case "CLEAR_PATH":
      return { ...state, urlPath: null };
    case "UPDATE_PATH":
      return { ...state, urlPath: action.urlPath };
    case "OPEN_ABOUT_MODAL":
      return { ...state, aboutOpen: true };
    case "CLOSE_ABOUT_MODAL":
      return { ...state, aboutOpen: false };
    case "TOGGLE_UI_SEARCH":
      return {
        ...state,
        searchOpen: !state.searchOpen,
        path: null,
        active: null,
      };
    case "RESET_VIZ":
      return {
        ...state,
        path: null,
        sideOpen: false,
        active: null,
        urlPath: null,
      };
    case "UPDATE_DATE_RANGE":
      return { ...state, range: action.range };
    case "SEARCH_INPUT_CHANGE":
      return { ...state, search: action.value };
    case "SEARCH_INPUT_CLEAR":
      return { ...state, search: null };
    case "LOAD_SUBJECTS":
      return { ...state, subjects: action.subjects };
    case "LOAD_TYPES":
      return { ...state, types: action.types };
    case "ACTIVE_PATH":
      return { ...state, path: action.path, sideOpen: true };
    case "REMOVE_ACTIVE_PATH":
      return { ...state, path: null, sideOpen: false };
    case "ACTIVE_NODE":
      return { ...state, active: action.active, sideOpen: true };
    case "REMOVE_ACTIVE_NODE":
      return { ...state, active: null, sideOpen: false };
    case "REMOVE_SUBJECT":
      return {
        ...state,
        subjects: state.subjects.filter((s) => s !== action.subject),
      };
    case "ADD_SUBJECT":
      return { ...state, subjects: [...state.subjects, action.subject] };
    case "CLEAR_ALL_SUBJECT":
      return { ...state, subjects: [] };
    case "FILLL_ALL_SUBJECT":
      return { ...state, subjects: action.subjects };
    case "REMOVE_TYPE":
      return {
        ...state,
        types: state.types.filter((t) => t !== action.typeR),
      };
    case "ADD_TYPE":
      return { ...state, types: [...state.types, action.typeR] };
    case "CLEAR_ALL_TYPE":
      return { ...state, types: [] };
    case "FILLL_ALL_TYPE":
      return { ...state, types: action.types };
    default:
      return state;
  }
}

export default filters;
