// import * as bootstrap from 'bootstrap';
import "./app.scss";
import Sortable from 'sortablejs';
import htmx from 'htmx.org';


const personsObj = new Set();

const calculatorWrapperElement = document.getElementById('calculator-wrapper');
const prefsParentElement = document.getElementById('prefsContainer');
const personsParentElement = document.getElementById('personsContainer');
const personsPrefsFormElement = document.getElementById('btn-generate-groups');
const personsPrefsInputElement = document.getElementById('personsPrefs');
const personsNamesInputField = document.getElementById("personsNamesInputField");

personsPrefsFormElement.addEventListener('click', getPersonPrefs);
personsNamesInputField.addEventListener('keyup', convertToElements);

// Helper function to attach event listener to every child element of target
const on = (element, type, selector, handler) => {
  element.addEventListener(type, (event) => {
    if (event.target.closest(selector)) {
      handler(event);
    }
  });
};

function dismissPrefElem(elem){
  const prefItemElem = elem.closest(".pref-item");
  prefItemElem.remove();
}

on(document, 'click', '.pref-dismiss', (event) => dismissPrefElem(event.target));


function getPersonPrefs(){
  // Before form submission, collect and return the prefs for each person
  // and store them in the forms hidden textarea input field.
  const personsPrefsObjs = []

  for (personPref of prefsParentElement.children) {
      const dataAttributeValues = [];
      const listItems = personPref.querySelectorAll('.pref-item');

      listItems.forEach(item => {
        const dataAttributeValue = item.getAttribute('data-id');
        dataAttributeValues.push(dataAttributeValue);
      });
      personsPrefsObjs.push(dataAttributeValues)
  }

  personsPrefsInputElement.value = JSON.stringify(personsPrefsObjs);
};


function convertToElements() {
    const inputValues = personsNamesInputField.value.split(",");

    inputValues.forEach(function(value) {
        value = value.trim();

        if (personsNamesInputField.value.endsWith(",")){         
          if (value) {
            personsObj.add(value);
            buildPrefsTable(personsObj);
          };
        };
        
    });
}


new Sortable(personsContainer, {
    group: {
      name: "shared",
        pull: "clone",
        put: false,
    },
    sort: false,
    animation: 150
});


function createPersonElemMarkup(person, isActive) {
    const active = isActive ? "active disabled" : "";
    // const draggable = isActive ? "": "draggable";

    return `
    <span 
      class="pref-item text-nowrap ${active}"
      data-id="${person}"
    >
      <i class="person-avatar bi bi-person-circle me-2"></i>
      ${person} 
      <span class="pref-dismiss">
        <span class="vr mx-1"></span>
        <i class="bi bi-x-circle-fill"></i>
      </span>
    </span>
    `
}


function buildPrefsTable(personsObj) {
  calculatorWrapperElement.style.display = "block"; 
  personsParentElement.replaceChildren();
  prefsParentElement.replaceChildren();

  for (person of personsObj) {
    // Build the persons list as draggable source
    let personElement = createPersonElemMarkup(person, false);
    personsParentElement.insertAdjacentHTML("beforeend", personElement);

    // Build the prelimary empty prefs container for each person
    const prefsContainer = `
        <div class="card m-4 p-2">
            <div id="prefs-${person}" class="prefs-list">
                ${createPersonElemMarkup(person, true)}
            </div>
        </div>
    `;

  prefsParentElement.insertAdjacentHTML("beforeend", prefsContainer);

  const prefsSortable = document.getElementById(`prefs-${person}`);
  const sortable = Sortable.create(prefsSortable, {
    // TODO: Prevent adding an item at the first position of the list.
    // This position is already taken by the hardcoded person item.
    // onAdd: function (evt) {
    //   console.log("onAdd: ", evt)
    //   console.log("firstItem: ", firstItem)
    //   if (evt.newIndex === 0) {
    //     console.log("evt.newIndex === 0");
    //     evt.preventDefault(); // Prevent dropping the item at the first position
    //   }
    // },
    onMove: function (evt) {
      // Do not allow an element to be moved before .active element
      return evt.related.className.indexOf('active') === -1;
    },
    filter: ".active",
    group: {
      name: "shared",
      pull: "clone",
        sort: true,
        put: (to, from, dragEl, event) => { 
          // Prevent adding the already hardcoded person item
          for (let i of to.el.children) {
            if (i.getAttribute("data-id") === dragEl.getAttribute("data-id")) { 
              console.log("Person already exist in this prefs list!"); 
              return false
            }
          } 
          return true 
        }
    },
  });
  };
};
