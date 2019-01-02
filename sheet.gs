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


GeneralSheet.prototype = function() {
    init: function() {
        var optns = arguments[0] || {};
        this.name = optns.name;
        var spreadSheet =  SpreadsheetApp.openById("1VvHumqBPW-pzmAn-Il7ADqkgjqD8Xeo9Ak0i2rPIA68");
        this.actualSheet = spreadSheet.getSheetByName(this.name);
    },
    getName : function() {
        return this.name;
    },
    getType : function() {
        return this.type;
    }
    getActualSheet : function () {
        return this.actualSheet
    }
}

function CashSheet() {
    this.init.apply ( this, arguments );
}

CashSheet.prototype = {
    init : function () {
        GeneralSheet.prototype.init.apply (this, arguments);
        this.type = "Cash";
    },
    getName : GeneralSheet.prototype.getName,
    getType : GeneralSheet.prototype.getType,
    getActualSheet : GeneralSheet.prototype.getActualSheet
}

function SimulationSheet () {
    this.init.apply ( this, arguments );
}

SimulationSheet.prototype = {
    init : function () {
        GeneralSheet.prototype.init.apply (this, arguments);
        this.type = "Simulation",
    },
    getName : GeneralSheet.prototype.getName,
    getType : GeneralSheet.prototype.getType
    getActualSheet : GeneralSheet.prototype.getActualSheet
}

function ParameterSheet() {
    this.init.apply ( this, arguments );
}

ParameterSheet.prototype = {
    init : function () {
        GeneralSheet.prototype.init.apply (this, arguments);
        this.type = "Parameter",
    },
    getName : GeneralSheet.prototype.getName,
    getType : GeneralSheet.prototype.getType
    getActualSheet : GeneralSheet.prototype.getActualSheet
}

MutualFundSheet function () {
    this.init.apply ( this, arguments );
}

MutualFundSheet.prototype = {
    init : function () {
        GeneralSheet.prototype.init.apply (this, arguments);
        this.type = "MutualFund",
        var urlRange = this.getActualSheet.getRange("A1");
        var rawURL = urlRange.getFormula();
        this.url = rawURL.substring(rawURL.indexOf("(") + 2,rawURL.indexOf(",") - 1);

    },
    getName : GeneralSheet.prototype.getName,
    getType : GeneralSheet.prototype.getType,
    getActualSheet : GeneralSheet.prototype.getActualSheet
    getURL : function () {
        return this.url;
    }
}

