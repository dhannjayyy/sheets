const rowCount = 100;
const columnCount = 26;
const rowAddressContainerRef = document.querySelector(".row-address-container");
const columnAddressContainerRef = document.querySelector(
  ".column-address-container"
);
const cellsContainerGrid = document.querySelector(".cells-container-grid");
const addressBar = document.querySelector(".address-bar");

cellsContainerGrid.addEventListener("click", (e) => {
  addressBar.value = e.target.getAttribute("data-address");
});

for (var i = 0; i < rowCount; i++) {
  const rowAddress = document.createElement("p");
  rowAddress.className = "row-address";
  rowAddress.innerText = i + 1;
  rowAddressContainerRef.appendChild(rowAddress);
}

for (var i = 0; i < columnCount; i++) {
  const columnAddress = document.createElement("p");
  columnAddress.className = "column-address";
  columnAddress.innerText = String.fromCharCode(65 + i);
  columnAddressContainerRef.appendChild(columnAddress);
}

for (var i = 0; i < rowCount; i++) {
  for (var j = 0; j < columnCount; j++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.setAttribute("contenteditable", true);
    cell.setAttribute("data-address", `${String.fromCharCode(65 + j)}${i + 1}`);
    cellsContainerGrid.appendChild(cell);
  }
}
