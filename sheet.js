var spreadSheet =  SpreadsheetApp.openById("1VvHumqBPW-pzmAn-Il7ADqkgjqD8Xeo9Ak0i2rPIA68");

Sheet = function() {  
  var optns = arguments[0] || {};
  name = optns.name;
  var simRegex = new RegExp(/.*_sim$/);
  if(name == "現金") {
	var sheet = new CashSheet({name:name});
  } else if (name == "Parameter") {
	var sheet = new ParameterSheet({name:name});
  } else if ( simRegex.test(name)) {
	var sheet = new SimulationSheet({name:name});
  } else {
	var sheet = new MutualFundSheet({name:name});
  }
  return sheet;
}

function GeneralSheet() {
  this.init.apply ( this, arguments );
}

GeneralSheet.prototype = {
  init: function() {
    var label = "GeneralSheet:init"
    console.time(label);
    var optns = arguments[0] || {};
    this.name = optns.name;
    this.actualSheet = spreadSheet.getSheetByName(this.name);
    try { if (!this.actualSheet); 
    } catch (error) {
      throw new Error( "Sheet didn't exist. Sheet Name:" + this.name );
    }
    console.timeEnd(label);
  },
  getName : function () {
    return this.name;
  },
  getType : function() {
    return this.type;
  },
  getActualSheet : function () {
    return this.actualSheet
  },
  update : function() {
    return true;
  },
  deleteLastRow : function() {
    return true;
  }
}

function CashSheet() {
  this.init.apply ( this, arguments );
}

CashSheet.prototype = {
  init : function () {
    var label = "CashSheet:init"
    console.time(label);
    GeneralSheet.prototype.init.apply (this, arguments);
    this.type = "Cash";
    console.timeEnd(label)
  },
  getName : GeneralSheet.prototype.getName,
  getActualSheet : GeneralSheet.prototype.getActualSheet,
  update : GeneralSheet.prototype.update,
  deleteLastRow : GeneralSheet.prototype.deleteLastRow,
  getType : function () {
    return "Cash";  
  }
}

function SimulationSheet () {
  this.init.apply ( this, arguments );
}

SimulationSheet.prototype = {
  init : function () {
    var label = "SimulationSheet:init"
    console.time(label);
    GeneralSheet.prototype.init.apply (this, arguments);
    this.type = "Simulation";
    getSheetLatestDate_.call(this);
    console.timeEnd(label)
  },
  getName : GeneralSheet.prototype.getName,
  getType : GeneralSheet.prototype.getType,
  getActualSheet : GeneralSheet.prototype.getActualSheet,
  getSheetLatestDate : function () {
    return this.sheetLatestDate
  },
  update : function () {
    var label = "SimulationSheet:update"
    console.time(label);
    var mutualFundSheet = Sheet({name:'ニッセイ 日経平均インデックスファンド'});
    console.log(label + ":updateCheck:" + this.sheetLatestDate.valueOf() + ":" + mutualFundSheet.sheetLatestDate.valueOf());
    if ( this.sheetLatestDate.valueOf() < mutualFundSheet.sheetLatestDate.valueOf()) {
      var sourceRange = this.actualSheet.getRange(this.priceLastRow, 2, 1, this.actualSheet.getLastColumn() - 1);
      sourceRange.copyTo(this.actualSheet.getRange(this.priceLastRow + 1, 2, 1, this.actualSheet.getLastColumn() - 1));
      this.actualSheet.getRange(this.priceLastRow + 1, 1).setValue(mutualFundSheet.getSheetLatestDate());
      getSheetLatestDate_.call(this);
    }

    console.timeEnd(label);
    return "シミュレーションページ更新完了";
  },
  deleteLastRow : function () {
    var label = "SimulationSheet:deleteLastRow"  + ":" + this.name  + ":削除行:" + this.priceLastRow;
    console.time(label);
    this.actualSheet.deleteRow(this.priceLastRow);
    var sourceRange = this.actualSheet.getRange(this.priceLastRow - 2, 2, 1, this.actualSheet.getLastColumn() - 1);
    sourceRange.copyTo(this.actualSheet.getRange(this.priceLastRow - 1, 2, 1, this.actualSheet.getLastColumn() - 1));
    console.timeEnd(label);
    return "シミュレーションページ最終行削除完了";
  }
}

function ParameterSheet() {
  this.init.apply ( this, arguments );
}

ParameterSheet.prototype = {
  init : function () {
    var label = "ParameterSheet:init"
    console.time(label);
    GeneralSheet.prototype.init.apply (this, arguments);
    this.type = "Parameter";
    console.timeEnd(label)
  },
  getName : GeneralSheet.prototype.getName,
  getType : GeneralSheet.prototype.getType,
  update : GeneralSheet.prototype.update,
  deleteLastRow : GeneralSheet.prototype.deleteLastRow,
  getActualSheet : GeneralSheet.prototype.getActualSheet
}

function MutualFundSheet () {
  this.init.apply ( this, arguments );
}

MutualFundSheet.prototype = {
  init : function () {
    var label = "MutualFundSheet:init"
    console.time(label);
    GeneralSheet.prototype.init.apply (this, arguments);
    this.type = "Mutual Fund";
    var urlRange = this.actualSheet.getRange("A1");
    var rawURL = urlRange.getFormula();
    this.url = rawURL.substring(rawURL.indexOf("(") + 2,rawURL.indexOf(",") - 1);
    getSheetLatestDate_.call(this);
    console.timeEnd(label)
  },
  getName : GeneralSheet.prototype.getName,
  getType : GeneralSheet.prototype.getType,
  getActualSheet : GeneralSheet.prototype.getActualSheet,
  getURL : function () {
    return this.url;
  },
  getUpdatedDate : function () {
    return this.updatedDate;
  },
  getPrice : function () {
    return this.price;
  },
  getSheetLatestDate : function () {
    return this.sheetLatestDate
  },
  update : function () {
    var label = "MutualFundSheet:updatePrice"  + ":" + this.name;
    console.time(label);
    this.content = getWebPage.call(this);
    var extractDate = this.content.match(/<span\sclass="ptdate">([\s\S]*?)<\/span>/); 
    var rawDate = extractDate[1].replace("年","/")
    rawDate = rawDate.replace("月","/")
    rawDate = rawDate.replace("日","")
    this.updatedDate = new Date(rawDate);
    var extractPrice = this.content.match(/<span\sclass="fprice">([\s\S]*?)<\/span>/); 
    this.price = extractPrice[1];
    console.log(label + ":updateCheck:" + this.sheetLatestDate.valueOf() + ":" + this.updatedDate.valueOf());
    if ( this.sheetLatestDate.valueOf() !== this.updatedDate.valueOf()) {
      var sourceRange = this.actualSheet.getRange(this.priceLastRow, 3, 1, this.actualSheet.getLastColumn() - 2);
      sourceRange.copyTo(this.actualSheet.getRange(this.priceLastRow + 1, 3, 1, this.actualSheet.getLastColumn() - 2));
      this.actualSheet.getRange(this.priceLastRow + 1, 1).setValue(this.updatedDate);
      this.actualSheet.getRange(this.priceLastRow + 1, 2).setValue(this.price);
      getSheetLatestDate_.call(this);
    }
    console.timeEnd(label);
    return "投資信託ページ更新完了";
  },
  deleteLastRow : function () {
    var label = "MutualFundSheet:deleteLastRow"  + ":" + this.name + ":削除行:" + this.priceLastRow; 
    console.time(label);
    this.actualSheet.deleteRow(this.priceLastRow);
    console.timeEnd(label);
    return "投資信託ページ最終行削除完了";
  }
}

function getSheetLatestDate_() {
  var sheet = this.actualSheet;
  var lastRowValues = lastRowValue_("A",sheet);
  this.priceLastRow = lastRowValues[0];
  this.sheetLatestDate = new Date(lastRowValues[1]);
}

function lastRowValue_(column,sheet) {
  var lastRow = sheet.getMaxRows();
  var values = sheet.getRange(column + "1:" + column + lastRow).getValues();
  for (; values[lastRow - 1] == "" && lastRow > 0; lastRow--) {}
  return [lastRow, values[lastRow - 1]];
}

function getWebPage() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(this.name);
  if (cached != null) {
    return cached;
  }
  var response = UrlFetchApp.fetch(this.url);
  var responseCode = response.getResponseCode()
  try { if (!responseCode !== 200 ); 
      } catch (error) {
        throw new Error( "Page response was not 200:" + responseCode );
      }
  var contents = response.getContentText("Shift_JIS"); 
  cache.put(this.name, contents, 21600); 
  return contents;
}

