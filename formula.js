const formulabar = document.querySelector(".formula-bar");
formulabar.addEventListener("keydown", async (e) => {
  const expression = e.target.value;
  if (e.key === "Enter") {
    establishRelationParentChild(expression);
    const cycleCell = checkCycle();
    if (cycleCell) {
      let response = confirm(
        "There is a loop in your formula. Would you like to trace it."
      );
      while (response === true) {
        await traceCycle(cycleCell);
        response = confirm(
          "There is a loop in your formula. Would you like to trace it."
        );
      }

      const child = addressBar.value;
      const childCellProp = getCellAndProp(child)[1];
      //removeChildFromParent finds the dependency from current formula, so we need to set it to new formula
      childCellProp.formula = expression;

      removeChildFromParent(child);
      //After the removal of cyclic dependency, we also need to update the UI, change the formula to blank
      childCellProp.formula = "";
      formulabar.value = childCellProp.formula;
      return;
    }
    changeUIandCellPropOnFormulaChange(expression);
  }
});

function updateChildren(parentCellProps) {
  const children = JSON.parse(parentCellProps.children);
  for (var child of children) {
    const [childCell, childCellProps] = getCellAndProp(child);
    childCellProps.value = evaluateFormula(childCellProps.formula);
    childCell.innerText = childCellProps.value;
    updateChildren(childCellProps);
  }
}

function establishRelationParentChild(expression) {
  if (expression === "") return;
  const childCell = addressBar.value;
  const childCellProp = getCellAndProp(childCell)[1];
  if (expression === childCellProp.formula) return;
  const parentCells = getDependentcells(expression);
  removeChildFromParent(childCell);
  addChildToParent(parentCells);
}

// Update the children property of the cell, that are no more parent of cell
function removeChildFromParent(childCell) {
  const childCellProp = getCellAndProp(childCell)[1];
  const oldParentCells = getDependentcells(childCellProp.formula);
  for (var oldParentCell of oldParentCells) {
    const [, oldParentCellProps] = getCellAndProp(oldParentCell);
    oldParentCellProps.children = JSON.parse(oldParentCellProps.children);
    const childIndex = oldParentCellProps.children.indexOf(childCell);
    if (childIndex !== -1) oldParentCellProps.children.splice(childIndex, 1);
    oldParentCellProps.children = JSON.stringify(oldParentCellProps.children);
  }
}

// Update the children property of the cell
function addChildToParent(parentCells) {
  const childCell = addressBar.value;
  for (var parentCell of parentCells) {
    const [, parentCellProp] = getCellAndProp(parentCell);
    parentCellProp.children = JSON.parse(parentCellProp.children);
    if (!parentCellProp.children.includes(childCell)) {
      parentCellProp.children.push(childCell);
    }
    parentCellProp.children = JSON.stringify(parentCellProp.children);
  }
}

function changeUIandCellPropOnFormulaChange(expression) {
  const [cell, activeCellProps] = getCellAndProp(activeCellAddress);
  if (expression === activeCellProps.formula) return;
  activeCellProps.formula = expression;
  activeCellProps.value = evaluateFormula(expression);
  cell.innerText = activeCellProps.value;
  updateChildren(activeCellProps);
}

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
        let dependentCellValue;
        if (cellRef.innerText === "0") dependentCellValue = 0;
        else
          dependentCellValue = Number(cellRef.innerText)
            ? Number(cellRef.innerText)
            : null;
        expression = expression.replace(cell, dependentCellValue);
      } else {
        EVAL_FLAG = false;
      }
    });
    const expressionResult = eval(expression);
    return EVAL_FLAG ? expressionResult : "";
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
  const dependentCellsParanthesisRemovalRegex = /[()]/g;
  let dependentCells = expression
    .replace(dependentCellsOperatorsRemovalRegex, " ")
    .replace(dependentCellsParanthesisRemovalRegex, " ")
    .split(" ");
  // filtering out valid cell addresses
  dependentCells = dependentCells.filter((cell) =>
    cell.match(dependentCellsRegex)
  );
  dependentCells = dependentCells.map((cell) => toCapitalCase(cell));
  return dependentCells;
}
