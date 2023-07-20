const formulabar = document.querySelector(".formula-bar");
formulabar.addEventListener("keydown", (e) => {
  const expression = e.target.value;
  if (e.key === "Enter") {
    const [cell, activeCellProps] = getCellAndProp(activeCellAddress);
    activeCellProps.formula = expression ? expression : "";
    activeCellProps.value = evaluateFormula(expression)
      ? evaluateFormula(expression)
      : "";
    cell.innerText = activeCellProps.value;
  }
});

function toCapitalCase(str) {
  return str
    .split("")
    .map((char) => {
      return char.toUpperCase();
    })
    .join("");
}

function evaluateFormula(expression) {
  if (expression === "") return "";
  const dependentCells = getDependentcells(expression);

  //checking if the expression has any dependent cells
  if (dependentCells.length > 0) {
    let EVAL_FLAG = true;
    expression = toCapitalCase(expression);
    dependentCells.forEach((cell) => {
      const cellRef = getCellAndProp(cell)[0];
      if (cellRef) {
        const dependentCellValue = Number(cellRef.innerText);
        expression = expression.replace(cell, dependentCellValue);
      } else {
        EVAL_FLAG = false;
      }
    });
    return EVAL_FLAG ? eval(expression) : "Can not Evaluate";
  } else {
    try {
      return eval(expression);
    } catch (e) {}
  }
}

function getDependentcells(expression) {
  //regex for finding valid cell addresses
  const dependentCellsRegex = /^[A-Za-z]+[1-9][0-9]*$/g;
  const dependentCellsOperatorsRemovalRegex = /[%+/*-]/g;
  let dependentCells = expression
    .replace(dependentCellsOperatorsRemovalRegex, " ")
    .split(" ");

  //filtering out valid cell addresses
  dependentCells = dependentCells.filter((cell) =>
    cell.match(dependentCellsRegex)
  );
  dependentCells = dependentCells.map((cell) => toCapitalCase(cell));
  return dependentCells;
}
