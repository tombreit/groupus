// import * as bootstrap from 'bootstrap';
import Sortable from 'sortablejs';
import htmx from 'htmx.org';


const calculatorWrapperElement = document.getElementById('calculator-wrapper');
const prefsParentElement = document.getElementById('prefsContainer');
const personsParentElement = document.getElementById('personsContainer');
const personsPrefsFormElement = document.getElementById('btn-generate-groups');
const personsPrefsInputElement = document.getElementById('personsPrefs');
const personsNamesInputField = document.getElementById("personsNamesInputField");

personsPrefsFormElement.addEventListener('click', getPersonPrefs);
personsNamesInputField.addEventListener('keyup', convertToElements);

prefsParentElement.addEventListener('click', function(e){
    if (e.target.classList.contains("pref-dismiss")) {
        e.target.parentElement.remove();
    }
})


const personsObj = new Set();

new Sortable(personsContainer, {
    group: {
      name: "shared",
        pull: 'clone',
        put: false,
    },
    sort: false,
    animation: 150
});


function createPersonElemMarkup(person, isActive) {
    const active = isActive ? "active" : "";
    return `
        <div 
            class="pref-item draggable text-nowrap list-group-item ${active}" 
            data-id="${person}"
        >
            ${person} 
            <span class="pref-dismiss">✖</span>
        </div>
    `
}


function getPersonPrefs(){
  // console.log('Executing before form submission...');

  const personsPrefsObjs = []

  for (personPref of prefsParentElement.children) {
      const dataAttributeValues = [];
      const listItems = personPref.querySelectorAll('.list-group-item');

      listItems.forEach(item => {
        const dataAttributeValue = item.getAttribute('data-id');
        dataAttributeValues.push(dataAttributeValue);
      });
      personsPrefsObjs.push(dataAttributeValues)
  }

  // console.info("personsPrefsObjs: ", personsPrefsObjs)
  personsPrefsInputElement.value = JSON.stringify(personsPrefsObjs);
};


function convertToElements() {
    const inputValues = personsNamesInputField.value.split(",");

    inputValues.forEach(function(value) {
        value = value.trim();
        // console.log(personsNamesInputField.value)

        if (personsNamesInputField.value.endsWith(",")){         
          if (value) {
            // console.info(value);
            personsObj.add(value);
            // console.log(personsObj);
            buildPrefsTable(personsObj);
          };
        };
        
    });
}


function buildPrefsTable(personsObj) {
  calculatorWrapperElement.style.display = "block"; 
  personsParentElement.replaceChildren();
  prefsParentElement.replaceChildren();

  for (person of personsObj) {
    let active = "noactive";
    let personElement = createPersonElemMarkup(person, false);
    personsParentElement.insertAdjacentHTML("beforeend", personElement);

    active = "asdfadsactive";
    const prefsContainer = `
        <div class="card m-4">
            <div id="prefs-${person}" class="prefs-list list-group list-group-flush">
                ${createPersonElemMarkup(person, true)}
            </div>
        </div>
    `;

  prefsParentElement.insertAdjacentHTML("beforeend", prefsContainer);

  const prefsSortable = document.getElementById(`prefs-${person}`);
  const sortable = Sortable.create(prefsSortable, {
    animation: 150,
    group: {
      name: "shared",
      pull: 'clone',
        sort: true,
        put: (to, from, dragEl, event) => { for (let i = 0; i < to.el.children.length; i++) { if (to.el.children[i].getAttribute("data-id") === dragEl.getAttribute("data-id")) { console.log("already exist"); return false } } return true }
    },
  });
  };
};

