function updateAllSheets() {
  var label = "updateAllSheets"
  console.log(label)
  console.time(label);
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length ; i++ ) {
    var sheet = sheets[i];
    var sheetLabel = label + ":" + sheet.getName();
    console.time(sheetLabel);
    var momentamSheet  = Sheet({name:sheet.getName()});
    momentamSheet.update();
    console.timeEnd(sheetLabel);
  }
  console.timeEnd(label);
}

function deleteLastRowAllSheets() {
  var label = "deleteLastRowAllSheets"
  console.log(label)
  console.time(label);
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length ; i++ ) {
    var sheet = sheets[i];
    var sheetLabel = label + ":" + sheet.getName();
    console.time(sheetLabel);
    var momentamSheet  = Sheet({name:sheet.getName()});
    momentamSheet.deleteLastRow();
    console.timeEnd(sheetLabel);
  }
  console.timeEnd(label);
}
