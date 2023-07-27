const collectedSheets = [];

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


function sheetsCreator() {
  const sheetStorage = {};
  collectedSheets.push(sheetStorage);
}
