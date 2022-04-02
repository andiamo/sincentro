import uiSlider from "nouislider";
import $ from "jquery";
import store from "./store";
import actions from "./actions";
import "nouislider/distribute/nouislider.min.css";

function initRangeSlider(domElement, range = [0, 100]) {
  uiSlider.create(domElement, {
    start: range,
    connect: true,
    tooltips: true,
    format: {
      to: (value) => value.toFixed(0),
      from: function (value) {
        return value.replace(",-", "");
      },
    },
    range: {
      min: range[0],
      max: range[1],
    },
  });
}

function listenChecksBox(elementClass, add, remove) {
  const elements = document.getElementsByClassName(elementClass);
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(
      "change",
      () => {
        const { value, checked } = elements[i];
        if (!checked) store.dispatch(remove(value));
        else store.dispatch(add(value));
      },
      false
    );
  }
}

function clickOutElement(element) {
  $(document).mouseup((e) => {
    const container = $(`.${element}`);
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.removeClass("active");
    }
  });
}

function showOnClick(triggerBTN, targetShow, closeList) {
  const triggerElement = document.getElementsByClassName(triggerBTN);
  if (triggerElement.length > 1) {
    console.error(`Hay mas de un target al buscar ${triggerBTN}`);
  } else {
    const targetElement = document.getElementsByClassName(targetShow);
    triggerElement[0].onclick = () => {
      if (triggerBTN === "about-btn") {
        store.dispatch(actions.openAboutModal());
      }
      if (triggerBTN === "close-about-modal") {
        store.dispatch(actions.closeAboutModal());
      }
      if (triggerBTN === "collapse-btn") {
        store.dispatch(actions.toggleUiSearch());
      }
      targetElement[0].classList.toggle("active");
      if (targetShow === "documentos-cont" || targetShow === "temas-cont") {
        clickOutElement(targetElement[0]);
      }
      if (closeList) {
        if (!targetElement[0].classList.contains("active")) {
          for (var i in closeList) {
            const target = document.getElementsByClassName(closeList[i])[0];
            target.classList.remove("active");
          }
        }
      }
    };
  }
}

function closeSide() {
  document.getElementById("close-side").onclick = (e) => {
    store.dispatch(actions.removeActiveNode());
  };
}

function closeSidePath() {
  document.getElementById("close-side-path").onclick = (e) => {
    store.dispatch(actions.removeActivePath());
  };
}

class Filters {
  constructor() {
    this.sliderElement = document.getElementById("slider");
    this.sidePanelElement = document.getElementById("side-panel");
    this.searchInputElement = document.getElementById("searchInput");
    this.subjectsList = document.getElementById("temas-list");
    this.documentosList = document.getElementById("documentos-list");
  }

  fillCheckList(elements, parent, elementClass) {
    let str = "";
    for (var i in elements) {
      str += `<div class="checkbox">
      <label>
        <input type="checkbox" class="${elementClass}" checked value="${elements[i]}" /> ${elements[i]}
      </label>
    </div>`;
    }
    str += `<div class="${elementClass}-fill"><span class="bi bi-check"></span> seleccionar todos</div>`;
    str += `<div class="${elementClass}-clear"><span class="bi bi-trash"></span>  limpiar selección</div>`;
    parent.innerHTML = str;
  }

  clearSelectionBTN(element, elementsClass, clearAction) {
    document.getElementsByClassName(element)[0].onclick = () => {
      const elements = document.getElementsByClassName(elementsClass);
      for (let i = 0; i < elements.length; i++) {
        elements[i].checked = false;
      }
      store.dispatch(clearAction());
    };
  }

  fillSelectionBTN(element, elementsClass, fillAction, data) {
    document.getElementsByClassName(element)[0].onclick = () => {
      const elements = document.getElementsByClassName(elementsClass);
      for (let i = 0; i < elements.length; i++) {
        elements[i].checked = true;
      }
      store.dispatch(fillAction(data));
    };
  }

  returnNodeInfo(node) {
    const sameYear = node.yearStart === node.yearEnd;
    const period = sameYear
      ? node.yearStart
      : `${node.yearStart} - ${node.yearEnd}`;
    // console.log({ summary: node.summaryText });
    const summary = node?.summaryText;
    // console.log({ summary });
    return `
      <span id="close-side" class="close-side bi bi-x"></span>
      <h3 class="node-title">${node.titleLong}</h3>
      <h4 class="node-dates">${period}</h4>
      <p>
        ${summary}
      </p>
      <p><b class="node-title">Etiquetas:</b> ${node.tags.join(", ")}</p>
      <div class="btn-cont">
        <a class="btn" target=”_blank” href="${
          node.collectionUrl
        }">Más información</a>
      </div>
      <div class="spacer"></div>
    `;
  }

  returnPathInfo(path) {
    return `
      <span id="close-side-path" class="close-side bi bi-x"></span>
      <p class="terminos">Términos relacionados entre ${path.a} y ${path.b}</p>
      <ul>${path.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
    `;
  }

  init({ initRange, subjects, types }) {
    showOnClick("collapse-btn", "filters-cont", [
      "temas-cont",
      "documentos-cont",
    ]);
    showOnClick("temas-btn", "temas-cont");
    clickOutElement("temas-cont");
    clickOutElement("documentos-cont");
    showOnClick("btn-start", "welcome");
    showOnClick("about-btn", "about");
    showOnClick("close-about-modal", "about");
    showOnClick("documentos-btn", "documentos-cont");
    initRangeSlider(this.sliderElement, initRange);

    this.fillCheckList(subjects, this.subjectsList, "temas-check");
    this.clearSelectionBTN(
      "temas-check-clear",
      "temas-check",
      actions.clearAllSubject
    );
    this.fillSelectionBTN(
      "temas-check-fill",
      "temas-check",
      actions.fillAllSubject,
      subjects
    );

    this.fillCheckList(types, this.documentosList, "docs-check");
    this.clearSelectionBTN(
      "docs-check-clear",
      "docs-check",
      actions.clearAllType
    );
    this.fillSelectionBTN(
      "docs-check-fill",
      "docs-check",
      actions.fillAllType,
      types
    );

    listenChecksBox("temas-check", actions.addSubject, actions.removeSubject);
    listenChecksBox("docs-check", actions.addType, actions.removeType);
    this.sliderElement.noUiSlider.on("change", (range) => {
      store.dispatch(actions.updateDateRange(range));
    });

    document.getElementById("search-form").onsubmit = (e) => {
      e.preventDefault();
    };

    this.searchInputElement.onchange = (e) => {
      e.preventDefault();
      store.dispatch(actions.searchInput(e.target.value));
    };

    const subscribeActive = store.observe(
      (state) => state.active,
      (state) => {
        if (state !== null) {
          document
            .getElementsByClassName("filters-cont")[0]
            .classList.remove("active");
          document.getElementById("side-panel").classList.add("active");
          document.getElementById("side-panel").innerHTML =
            this.returnNodeInfo(state);
          closeSide();
        } else {
          document.getElementById("side-panel").classList.remove("active");
        }
      }
    );
    const subscribePath = store.observe(
      (state) => state.path,
      (state) => {
        if (state !== null) {
          document
            .getElementsByClassName("filters-cont")[0]
            .classList.remove("active");
          document.getElementById("side-panel").classList.add("active");
          document.getElementById("side-panel").innerHTML =
            this.returnPathInfo(state);
          closeSidePath();
        } else {
          document.getElementById("side-panel").classList.remove("active");
        }
      }
    );
  }
}

export default Filters;
