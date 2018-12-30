function hello() {
  Logger.log("Hello, " + mondo);
}

function MomentamTradeUpdater() {
  CheckFirstSheet();
  
}

function CheckFirstSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var simSheet = ss.getSheetByName('M_SLVol_simulation');
  var response = UrlFetchApp.fetch("http://www.morningstar.co.jp/FundData/SnapShot.do?fnc=2016112105");
  var content = response.getContentText("Shift_JIS"); 
  var page_date = get_date(content);
  var columnAValues = simSheet.getRange("A:A").getValues();
  var LastRow = columnAValues.filter(String).length + 3;
  console.log(LastRow);
  return;
}

function get_date(content) {
  var extract = content.match(/<span\sclass="ptdate">([\s\S]*?)<\/span>/); 
  Logger.log(extract[1]);
  return extract;
}
