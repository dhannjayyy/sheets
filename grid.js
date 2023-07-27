const rowCount = 100;
const columnCount = 26;
const rowAddressContainerRef = document.querySelector(".row-address-container");
const columnAddressContainerRef = document.querySelector(
  ".column-address-container"
);
const cellsContainerGrid = document.querySelector(".cells-container-grid");
const addressBar = document.querySelector(".address-bar");
const sheetsFolderContainer = document.querySelector(
  ".sheets-folder-container"
);
let sheetDefaultNameCounter = 0;

function clickAndFocusOnCell(e) {
  addressBar.value = e.target.getAttribute("data-address");
  activeCellAddress = addressBar.value; //this is the active cell
  if (!sheetStorage[activeCellAddress]) {
    sheetStorage[activeCellAddress] = { ...cellPropertiesPrototype };
  }
  cellActionsUIChanger();
}

function activeSheet() {
  let activeSheet =
    sheetsFolderContainer.querySelector(".active-sheet")?.innerText;
  let activeSheetRef = sheetsFolderContainer.querySelector(".active-sheet");

  function setActiveSheet(sheet) {
    const currentActiveSheet =
      sheetsFolderContainer.querySelector(".active-sheet");
    currentActiveSheet?.classList.remove("active-sheet");
    const newActiveSheet = sheetsFolderContainer.querySelector(
      `.sheet-folder[id="${sheet}"]`
    );
    newActiveSheet.classList.add("active-sheet");
    activeSheet = newActiveSheet.innerText;
    activeSheetRef = newActiveSheet;
  }

  return [activeSheet, activeSheetRef, setActiveSheet];
}

function getSheet(sheet) {
  return sheetsFolderContainer.querySelector(`.sheet-folder[id="${sheet}"]`);
}

function removeSheet(sheet) {
  if(sheetsFolderContainer.children.length === 1) {
    alert("Can't delete the last sheet");
    return;
  }
  const [,,setActiveSheet] = activeSheet();
  const previousSheet = getSheet(sheet).previousElementSibling;
  if(previousSheet) {
    setActiveSheet(previousSheet.innerText);
  }
  else{
    setActiveSheet(getSheet(sheet).nextElementSibling.innerText);
  }
  getSheet(sheet).remove();
}

//delegated event listener for all the cells in the grid

// cellsContainerGrid.addEventListener("click", (e) => {
//   clickAndFocusOnCell(e);
// });
cellsContainerGrid.addEventListener("focusin", (e) => {
  clickAndFocusOnCell(e);
});

cellsContainerGrid.addEventListener("focusout", (e) => {
  addressBar.value = e.target.getAttribute("data-address");
  activeCellAddress = addressBar.value; //this is the active cell
  let [cell, activeCellProp] = getCellAndProp(activeCellAddress);
  if (activeCellProp) {
    activeCellProp.value = Number(cell.innerText)
      ? Number(cell.innerText)
      : cell.innerText;
  }
  if (
    activeCellProp.formula &&
    activeCellProp.value !== evaluateFormula(activeCellProp.formula)
  ) {
    activeCellProp.value = evaluateFormula(activeCellProp.formula);
    cell.innerText = activeCellProp.value;
  }
  updateChildren(activeCellProp);
});

for (var i = 0; i < rowCount; i++) {
  const rowAddress = document.createElement("p");
  rowAddress.className = "row-address";
  rowAddress.innerText = i + 1;
  rowAddressContainerRef.appendChild(rowAddress);
}

for (var i = 0; i < columnCount; i++) {
  const columnAddress = document.createElement("p");
  columnAddress.className = "column-address";
  columnAddress.innerText = String.fromCharCode(65 + i);
  columnAddressContainerRef.appendChild(columnAddress);
}

function gridGenerator() {
  for (var i = 0; i < rowCount; i++) {
    for (var j = 0; j < columnCount; j++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.setAttribute("contenteditable", true);
      cell.setAttribute("spellcheck", false);
      cell.setAttribute(
        "data-address",
        `${String.fromCharCode(65 + j)}${i + 1}`
      );
      cellsContainerGrid.appendChild(cell);
    }
  }
}

const sheetAddButton = document.querySelector(".sheet-add-icon");
sheetAddButton.addEventListener("click", () => {
  const sheetFolder = document.createElement("button");
  sheetFolder.setAttribute("class", "sheet-folder");
  sheetsFolderContainer.appendChild(sheetFolder);
  sheetFolder.innerText = `Sheet ${++sheetDefaultNameCounter}`;
  sheetFolder.setAttribute(
    "id",
    `Sheet ${sheetDefaultNameCounter}`
  );
  const [, , setActiveSheet] = activeSheet();
  setActiveSheet(sheetFolder.innerText);
});

sheetsFolderContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("sheet-folder")) {
    const [, , setActiveSheet] = activeSheet();
    setActiveSheet(e.target.innerText);
  }
});

sheetsFolderContainer.addEventListener("mousedown", (e) => {
  if (e.which === 3 && e.target.classList.contains("sheet-folder")) {
    removeSheet(e.target.innerText);
  }
});

sheetsFolderContainer.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

sheetAddButton.click();
gridGenerator();
