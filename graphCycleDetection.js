function checkCycle() {
  const sheetGraph = {}; // graph representation of the sheet
  const visited = {};
  const dfsVisited = {};
  for (let cell in sheetStorage) {
    sheetGraph[cell] = [...JSON.parse(sheetStorage[cell].children)];
    visited[cell] = false;
    dfsVisited[cell] = false;
  }
  for (let cell in sheetGraph) {
    if (cycleDetector(cell, visited, dfsVisited, sheetGraph) === true) {
      return cell;
    }
  }
  return null;
}

function cycleDetector(cell, visited, dfsVisited, sheetGraph) {
  if (dfsVisited[cell] === true && visited[cell] === true) {
    return true; // Cycle detected
  }

  if (visited[cell] === true) {
    return false; // No cycle found in this exploration
  }
  visited[cell] = true;
  dfsVisited[cell] = true;
  for (let nextCell of sheetGraph[cell]) {
    if (cycleDetector(nextCell, visited, dfsVisited, sheetGraph) === true) {
      return true;
    }
  }
  dfsVisited[cell] = false; // Reset for the next exploration
  return false;
}
