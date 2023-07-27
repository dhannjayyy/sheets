let selectedRange = [];

const cellAddressDecoder = (address) => {
  let colDecoded;
  const addressColRegex = /[A-Z]/g;
  const addressRowRegex = /\d/g;
  let col = address.match(addressColRegex).join("");
  const row = address.match(addressRowRegex).join("");
  if (col.length > 1) {
    //if there are more than one characters in the column address
    for (var i = 0; i < col.length - 1; i++) {
      colDecoded = col.charCodeAt(i) - 65;
      colDecoded = (colDecoded + 1) * 26;
    }
    colDecoded = colDecoded + (col.charCodeAt(col.length - 1) - 65);
  } else {
    colDecoded = col.charCodeAt(0) - 65;
  }
  //subtracting 1 for zero-based indexing
  return [Number(row) - 1, colDecoded];
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

cellActionsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("button-copy")) {
    console.log(selectedRange);
  }
});
