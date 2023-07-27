// storage for cell properties
let sheetStorage = {};
let activeCellAddress = "";
const cellPropertiesPrototype = {
  bold: false,
  itlaic: false,
  underline: false,
  textAlign: "left",
  fontFamily: "monospace",
  fontSize: "14",
  textColor: "#000000",
  backgroundColor: "#ffffff",
  value: "",
  formula: "",
  children: "[]",
};
let activePropBackgroundColor = "#d1d8e0";

const getCellAndProp = (activeCellAddress) => {
  let cell = `.grid-cell[data-address="${activeCellAddress}"]`;
  cell = document.querySelector(cell);
  if (!sheetStorage[activeCellAddress] && cell) {
    sheetStorage[activeCellAddress] = { ...cellPropertiesPrototype };
  }
  let activeCellProp = sheetStorage[activeCellAddress];
  return [cell, activeCellProp];
};

const validButtonClick = (e) => {
  const cellActionButton = e.target;
  if (cellActionButton.tagName === "SPAN" && e.type === "click") return "click";
  else if (
    (cellActionButton.tagName === "SELECT" ||
      cellActionButton.tagName === "INPUT") &&
    (e.type === "change" || e.type === "input")
  )
    return "change";
};

//activeAlignment is a class name
const fontAlignmentActiveIconChanger = (
  activeAlignment,
  activeCellProp,
  cell
) => {
  //chnages in data
  activeAlignment.includes("left")
    ? (activeCellProp.textAlign = "left")
    : activeAlignment.includes("center")
    ? (activeCellProp.textAlign = "center")
    : (activeCellProp.textAlign = "right");
  //changes in UI
  const fontAlignmentButtons = document.querySelectorAll("span.font-alignment");
  fontAlignmentButtons.forEach((button) => {
    if (button.classList[0] === activeAlignment) {
      button.style.backgroundColor = activePropBackgroundColor;
    } else {
      button.style.backgroundColor = "transparent";
    }
  });
  cell.style.textAlign = activeAlignment.split("-")[1].split("Align")[0];
};

//delegated event listener for cell properties
const cellActionsContainer = document.querySelector(".cell-actions-container");

function updateStyleButtonsUi(e) {
  const cellActionButton = e.target;
  if (validButtonClick(e) === "click") {
    let [cell, activeCellProp] = getCellAndProp(activeCellAddress);
    switch (cellActionButton.classList[0]) {
      case "button-bold":
        activeCellProp.bold = !activeCellProp.bold; //change in data
        cell.style.fontWeight = activeCellProp.bold ? "bold" : "normal"; //UI change 1
        cellActionButton.style.backgroundColor = activeCellProp.bold
          ? activePropBackgroundColor
          : "transparent"; //UI change 2
        return;
      case "button-italic":
        activeCellProp.italic = !activeCellProp.italic; //change in data
        cell.style.fontStyle = activeCellProp.italic ? "italic" : "normal"; //UI change 1
        cellActionButton.style.backgroundColor = activeCellProp.italic
          ? activePropBackgroundColor
          : "transparent"; //UI change 2
        return;
      case "button-underline":
        activeCellProp.underline = !activeCellProp.underline; //change in data
        cell.style.textDecoration = activeCellProp.underline
          ? "underline"
          : "none"; //UI change 1
        cellActionButton.style.backgroundColor = activeCellProp.underline
          ? activePropBackgroundColor
          : "transparent"; //UI change 2
        return;
      case "button-leftAlign":
        fontAlignmentActiveIconChanger(
          "button-leftAlign",
          activeCellProp,
          cell
        );
        return;
      case "button-centerAlign":
        fontAlignmentActiveIconChanger(
          "button-centerAlign",
          activeCellProp,
          cell
        );
        return;
      case "button-rightAlign":
        fontAlignmentActiveIconChanger(
          "button-rightAlign",
          activeCellProp,
          cell
        );
        return;
    }
    if (
      JSON.stringify(sheetStorage[activeCellAddress]) ===
      JSON.stringify(cellPropertiesPrototype)
    ) {
      delete sheetStorage[activeCellAddress];
    }
  }
  if (validButtonClick(e) === "change") {
    let [cell, activeCellProp] = getCellAndProp(activeCellAddress);
    switch (cellActionButton.classList[0]) {
      case "button-fontFamily":
        activeCellProp.fontFamily = cellActionButton.value;
        cell.style.fontFamily = activeCellProp.fontFamily;
        return;
      case "button-fontSize":
        activeCellProp.fontSize = cellActionButton.value;
        cell.style.fontSize = activeCellProp.fontSize + "px";
        return;
      case "button-textColor":
        activeCellProp.textColor = cellActionButton.value;
        cell.style.color = cellActionButton.value;
        return;
      case "button-backgroundColor":
        activeCellProp.backgroundColor = cellActionButton.value;
        cell.style.backgroundColor = cellActionButton.value;
        return;
    }
    if (
      JSON.stringify(sheetStorage[activeCellAddress]) ===
      JSON.stringify(cellPropertiesPrototype)
    ) {
      delete sheetStorage[activeCellAddress];
    }
  }
}

//delgated event listeners for cell properties
cellActionsContainer.addEventListener("click", event => updateStyleButtonsUi(event));
cellActionsContainer.addEventListener("change",event => updateStyleButtonsUi(event));

// const cellAddressDecoder = (address) => {
//   const addressColRegex = /[A-Z]/g;
//   const addressRowRegex = /\d/g;
//   let colDecoded;
//   let col = address.match(addressColRegex).join("");
//   const row = address.match(addressRowRegex).join("");
//   if (col.length > 1) {
//     for (var i = 0; i < col.length - 1; i++) {
//       colDecoded = col.charCodeAt(i) - 65;
//       colDecoded = (colDecoded + 1) * 26;
//     }
//     colDecoded = colDecoded + (col.charCodeAt(col.length - 1) - 65);
//   } else {
//     colDecoded = col.charCodeAt(0) - 65;
//   }
//   return [colDecoded, row];
// };

// changing the cell actions buttons UI according to the property object of the cell
function cellActionsUIChanger(activeCellAddress) {
  const [, activeCellProps] = getCellAndProp(activeCellAddress);
  const buttonBold = document.querySelector(".button-bold");
  const buttonItalic = document.querySelector(".button-italic");
  const buttonUnderline = document.querySelector(".button-underline");
  const buttonLeftAlign = document.querySelector(".button-leftAlign");
  const buttonCenterAlign = document.querySelector(".button-centerAlign");
  const buttonRightAlign = document.querySelector(".button-rightAlign");
  const buttonFontFamily = document.querySelector(".button-fontFamily");
  const buttonFontSize = document.querySelector(".button-fontSize");
  const buttonTextcolor = document.querySelector(".button-textColor");
  const buttonBackgroundColor = document.querySelector(
    ".button-backgroundColor"
  );
  const formulabar = document.querySelector(".formula-bar");
  formulabar.value = activeCellProps.formula;
  buttonBold.style.backgroundColor = activeCellProps.bold
    ? activePropBackgroundColor
    : "transparent";
  buttonItalic.style.backgroundColor = activeCellProps.italic
    ? activePropBackgroundColor
    : "transparent";
  buttonUnderline.style.backgroundColor = activeCellProps.underline
    ? activePropBackgroundColor
    : "transparent";
  buttonLeftAlign.style.backgroundColor =
    activeCellProps.textAlign === "left"
      ? activePropBackgroundColor
      : "transparent";
  buttonCenterAlign.style.backgroundColor =
    activeCellProps.textAlign === "center"
      ? activePropBackgroundColor
      : "transparent";
  buttonRightAlign.style.backgroundColor =
    activeCellProps.textAlign === "right"
      ? activePropBackgroundColor
      : "transparent";
  buttonFontFamily.value = activeCellProps.fontFamily;
  buttonFontSize.value = activeCellProps.fontSize;
  buttonTextcolor.value = activeCellProps.textColor;
  buttonBackgroundColor.value = activeCellProps.backgroundColor;
}
