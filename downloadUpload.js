const donwloadButton = document.querySelector('.button-download');
const uploadButton = document.querySelector('.button-upload');

donwloadButton.addEventListener('click', () => {
    const data = JSON.stringify(sheetStorage);
    const blob = new Blob([data],{type:"application/json"});
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "sheet.json";
    a.click();
});

uploadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();
    input.addEventListener('change', () => {
        const file = input.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.addEventListener('load', () => {
            const data = JSON.parse(fileReader.result);
            sheetAddButton.click();
            for (let cell in data) {
                sheetStorage[cell] = data[cell];
            }
            updateCellsUi(true);
        });
    })
})