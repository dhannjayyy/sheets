let selectedRange = [];
let dataToBePasted;

// const cellAddressDecoder = (address) => {
//   let colDecoded;
//   const addressColRegex = /[A-Z]/g;
//   const addressRowRegex = /\d/g;
//   let col = address.match(addressColRegex).join("");
//   const row = address.match(addressRowRegex).join("");
//   if (col.length > 1) {
//     //if there are more than one characters in the column address
//     for (var i = 0; i < col.length - 1; i++) {
//       colDecoded = col.charCodeAt(i) - 65;
//       colDecoded = (colDecoded + 1) * 26;
//     }
//     colDecoded = colDecoded + (col.charCodeAt(col.length - 1) - 65);
//   } else {
//     colDecoded = col.charCodeAt(0) - 65;
//   }
//   //subtracting 1 for zero-based indexing
//   return [Number(row) - 1, colDecoded];
// };

cellsContainerGrid.addEventListener("click", (e) => {
  if (e.ctrlKey) {
    if (
      selectedRange.includes(e.target.getAttribute("data-address")) &&
      selectedRange.length >= 2
    ) {
      removeSingleSelection(e);
    } else if (selectedRange.length >= 2) {
      resetSelectedRangeUI();
      selectedRange = [];
      selectedRange.push(e.target.getAttribute("data-address"));
      e.target.style.border = "2px solid green";
    } else if (!selectedRange.includes(e.target.getAttribute("data-address"))) {
      selectedRange.push(e.target.getAttribute("data-address"));
      e.target.style.border = "2px solid green";
    } else {
      removeSingleSelection(e);
    }
  }
});

function rangeDecoder(range) {
  let decodedColRange = range.map((address) => address.charCodeAt(0));
  let decodedRowRange = range.map((address) => Number(address.slice(1)));
  decodedColRange = decodedColRange.sort();
  decodedRowRange = decodedRowRange.sort();
  return [
    [decodedRowRange[0], decodedColRange[0]],
    [decodedRowRange[1], decodedColRange[1]],
  ];
}

function removeSingleSelection(e) {
  const indexToRemove = selectedRange.indexOf(
    e.target.getAttribute("data-address")
  );
  e.target.style.border = "none";
  e.target.style.borderBottom = "2px solid #dfe4ea";
  e.target.style.borderRight = "2px solid #dfe4ea";
  selectedRange.splice(indexToRemove, 1);
}

function resetSelectedRangeUI() {
  selectedRange.forEach((address) => {
    cellsContainerGrid.querySelector(
      `[data-address="${address}"]`
    ).style.border = "none";
    cellsContainerGrid.querySelector(
      `[data-address="${address}"]`
    ).style.borderBottom = "2px solid #dfe4ea";
    cellsContainerGrid.querySelector(
      `[data-address="${address}"]`
    ).style.borderRight = "2px solid #dfe4ea";
  });
}

function dataAggregator(e) {
  if (selectedRange.length === 0) return;
  let selectedRangeDecoded = [];
  let selectedRangeEncoded = [];
  dataToBePasted = [];
  if (selectedRange.length === 2) {
    selectedRangeDecoded = rangeDecoder(selectedRange);
    for (
      var row = selectedRangeDecoded[0][0];
      row <= selectedRangeDecoded[1][0];
      row++
    ) {
      let dataRow = [];
      for (
        var col = selectedRangeDecoded[0][1];
        col <= selectedRangeDecoded[1][1];
        col++
      ) {
        const [, cellProps] = getCellAndProp(
          `${String.fromCharCode(col)}${row}`
        );
        const cellData = { ...cellProps };
        delete cellData.formula;
        delete cellData.children;
        dataRow.push(cellData);
        selectedRangeEncoded.push(`${String.fromCharCode(col)}${row}`);
      }
      dataToBePasted.push(dataRow);
    }
  } else if (selectedRange.length === 1) {
    const [, cellProps] = getCellAndProp(selectedRange[0]);
    const cellData = { ...cellProps };
    delete cellData.formula;
    delete cellData.children;
    dataToBePasted.push(cellData);
  }
  if (e.target.classList.contains("button-cut")) {
    cutOperationHandler(selectedRangeEncoded);
  }
  resetSelectedRangeUI();
}

function cutOperationHandler(selectedRangeEncoded) {
  selectedRangeEncoded.forEach((address) => {
    sheetStorage[address] = { ...cellPropertiesPrototype };
  });
  updateCellsUi()(selectedRangeEncoded);
}

function pasteOperationHandler() {
  if (!dataToBePasted) return;
  const startCol = activeCellAddress[0];
  const startRow = activeCellAddress[1];
  const cellsToBeUpdated = [];

  for (let row = 0; row < dataToBePasted.length; row++) {
    for (let col = 0; col < dataToBePasted[row].length; col++) {
      updatePastedCellsData(row, col);
    }
  }

  function updatePastedCellsData(row, col) {
    const [cell, cellProps] = getCellAndProp(
      `${String.fromCharCode(startCol.charCodeAt(0) + col)}${
        Number(startRow) + row
      }`
    );
    if (!cell) return;

    cellProps.bold = dataToBePasted[row][col].bold;
    cellProps.itlaic = dataToBePasted[row][col].itlaic;
    cellProps.underline = dataToBePasted[row][col].underline;
    cellProps.textAlign = dataToBePasted[row][col].textAlign;
    cellProps.fontFamily = dataToBePasted[row][col].fontFamily;
    cellProps.fontSize = dataToBePasted[row][col].fontSize;
    cellProps.textColor = dataToBePasted[row][col].textColor;
    cellProps.backgroundColor = dataToBePasted[row][col].backgroundColor;
    cellProps.value = dataToBePasted[row][col].value;

    cellsToBeUpdated.push(cell.getAttribute("data-address"));
  }
  updateCellsUi()(cellsToBeUpdated);
}

//Event listener for cut,copy and paste
cellActionsContainer.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("button-copy") ||
    event.target.classList.contains("button-cut")
  ) {
    dataAggregator(event);
  } else if (event.target.classList.contains("button-paste")) {
    pasteOperationHandler();
  }
});
