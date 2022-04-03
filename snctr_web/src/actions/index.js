function updateDateRange(range) {
  return {
    type: "UPDATE_DATE_RANGE",
    range,
  };
}

function searchInput(value) {
  return {
    type: "SEARCH_INPUT_CHANGE",
    value,
  };
}

function clearSearchInput() {
  return {
    type: "SEARCH_INPUT_CLEAR",
  };
}

function loadSubjects(subjects) {
  return {
    type: "LOAD_SUBJECTS",
    subjects,
  };
}

function loadTypes(types) {
  return {
    type: "LOAD_TYPES",
    types,
  };
}

function loadRange(range) {
  return {
    type: "LOAD_RANGE",
    range,
  };
}

function setActiveNode(node) {
  return {
    type: "ACTIVE_NODE",
    active: node,
  };
}

function removeSubject(subject) {
  return {
    type: "REMOVE_SUBJECT",
    subject,
  };
}

function addSubject(subject) {
  return {
    type: "ADD_SUBJECT",
    subject,
  };
}

function removeType(typeR) {
  return {
    type: "REMOVE_TYPE",
    typeR,
  };
}

function addType(typeR) {
  return {
    type: "ADD_TYPE",
    typeR,
  };
}

function removeActiveNode() {
  return {
    type: "REMOVE_ACTIVE_NODE",
  };
}

function setActivePath(path) {
  return {
    type: "ACTIVE_PATH",
    path,
  };
}

function removeActivePath() {
  return {
    type: "REMOVE_ACTIVE_PATH",
  };
}

function toggleUiSearch() {
  return {
    type: "TOGGLE_UI_SEARCH",
  };
}

function openAboutModal() {
  return {
    type: "OPEN_ABOUT_MODAL",
  };
}

function closeAboutModal() {
  return {
    type: "CLOSE_ABOUT_MODAL",
  };
}

function clearAllType() {
  return {
    type: "CLEAR_ALL_TYPE",
  };
}

function clearAllSubject() {
  return {
    type: "CLEAR_ALL_SUBJECT",
  };
}

function fillAllType(types) {
  return {
    type: "FILLL_ALL_TYPE",
    types,
  };
}

function fillAllSubject(subjects) {
  return {
    type: "FILLL_ALL_SUBJECT",
    subjects,
  };
}

function updateURLPath(urlPath = null) {
  return { type: "UPDATE_PATH", urlPath };
}

function claerURLPath() {
  return { type: "UPDATE_PATH", urlPath: null };
}

function resetViz() {
  return { type: "RESET_VIZ" };
}

export default {
  fillAllType,
  fillAllSubject,
  clearAllType,
  clearAllSubject,
  toggleUiSearch,
  openAboutModal,
  closeAboutModal,
  updateDateRange,
  removeActiveNode,
  setActivePath,
  removeActivePath,
  removeType,
  addType,
  removeSubject,
  addSubject,
  searchInput,
  clearSearchInput,
  setActiveNode,
  loadSubjects,
  loadRange,
  loadTypes,
  updateURLPath,
  claerURLPath,
  resetViz,
};
