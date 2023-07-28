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

const rangeDecoder = (range) => {
  let decodedColRange = range.map((address) => address.charCodeAt(0));
  let decodedRowRange = range.map((address) => Number(address.slice(1)));
  decodedColRange = decodedColRange.sort();
  decodedRowRange = decodedRowRange.sort();
  return [
    [decodedRowRange[0], decodedColRange[0]],
    [decodedRowRange[1], decodedColRange[1]],
  ];
};

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
  if (
    e.target.classList.contains("button-copy") ||
    e.target.classList.contains("button-cut")
  ) {
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
}

function cutOperationHandler(selectedRangeEncoded) {
  selectedRangeEncoded.forEach((address) => {
    sheetStorage[address] = { ...cellPropertiesPrototype };
  });
  updateCellsUi()(selectedRangeEncoded);
}

cellActionsContainer.addEventListener("click", (event) =>
  dataAggregator(event)
);
