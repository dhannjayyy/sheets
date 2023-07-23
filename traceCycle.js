function colorCell() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function traceCycle(cycleCell) {
  const sheetGraph = {}; // graph representation of the sheet
  const visited = {};
  const dfsVisited = {};
  for (let cell in sheetStorage) {
    sheetGraph[cell] = [...JSON.parse(sheetStorage[cell].children)];
    visited[cell] = false;
    dfsVisited[cell] = false;
  }
  const response = await cyclePathTracer(
    cycleCell,
    visited,
    dfsVisited,
    sheetGraph
  );
  if (response === true) {
    return Promise.resolve(true);
  }
}

async function cyclePathTracer(cell, visited, dfsVisited, sheetGraph) {
  if (dfsVisited[cell] === true && visited[cell] === true) {
    const cellRef = getCellAndProp(cell)[0];
    cellRef.style.backgroundColor = "lightsalmon";
    await colorCell();
    cellRef.style.backgroundColor = "white";
    // await colorCell();
    return Promise.resolve(true); // Cycle detected
  }

  if (visited[cell] === true) {
    return Promise.reject(false); // No cycle found in this exploration
  }
  visited[cell] = true;
  dfsVisited[cell] = true;

  for (let nextCell of sheetGraph[cell]) {
    const nextCellRef = getCellAndProp(nextCell)[0];
    nextCellRef.style.backgroundColor = "lightblue";
    await colorCell();
    nextCellRef.style.backgroundColor = "white";
    let response = await cyclePathTracer(nextCell, visited, dfsVisited, sheetGraph) === true
    if (response === true) {
      return Promise.resolve(true);
    }
  }
  dfsVisited[cell] = false; // Reset for the next exploration
}
