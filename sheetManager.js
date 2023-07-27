const collectedSheets = {};

function createSheet(sheet) {
  if (collectedSheets[sheet]) return;
  collectedSheets[sheet] = {};
  sheetStorage = collectedSheets[sheet];
}

function removeSheetData(sheet) {
  delete collectedSheets[sheet];
}

function updateUiOnSheetChange() {
  for (let key in sheetStorage) {
    const [cell, cellProps] = getCellAndProp(key);
    cell.innerText = cellProps.value;
    cell.style.fontFamily = cellProps.fontFamily;
    cell.style.fontSize = cellProps.fontSize + "px";
    cell.style.color = cellProps.textColor;
    cell.style.backgroundColor = cellProps.backgroundColor;
    cell.style.textAlign = cellProps.textAlign;
    cell.style.fontWeight = cellProps.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProps.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProps.underline ? "underline" : "none";
  }
  
  //putting the cell to focus in the active sheet that was active in the previous active sheet
  if(activeCellAddress) {
    const [cell,] = getCellAndProp(activeCellAddress);
    cell.focus();
    cellActionsUIChanger(activeCellAddress);
  }
}

//Creates those cells in the new sheet which are not present in previous sheet
function createCellsOnNewActiveSheet(currentActiveSheet, newActiveSheet) {
  for (let key in collectedSheets[currentActiveSheet?.getAttribute("id")]) {
    collectedSheets[newActiveSheet.getAttribute("id")][key]
      ? null
      : (collectedSheets[newActiveSheet.getAttribute("id")][key] = {
          ...cellPropertiesPrototype,
        });
  }
}

//creating a sheet by default on start
sheetAddButton.click();

//making first cell clicked by-default
let firstCell = document.querySelector(".grid-cell");
firstCell.focus();
