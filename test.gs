QUnit.helpers( this );
function testFunctions() {
   testingCalculateAmountAndQty();
   testingSheets();
}
 
function doGet( e ) {
     QUnit.urlParams( e.parameter );
     QUnit.config({
          title: "QUnit for Google Apps Script - Test suite" // Sets the title of the test page.
     });
     QUnit.load( testFunctions );
 
     return QUnit.getHtml();
};
 
function testingCalculateAmountAndQty(){
   QUnit.test( "calculateAmountAndQty testing", function() {
      expect(7);
      equal( calculateAmountAndQty(10,2000), 20000, "Test for quantity : 10 and amount : 2000 sp output is 20000" );
      equal( calculateAmountAndQty("printer",2000), 0, "Test for quantity : printer and amount : 2000 so output is 0" );
      equal( calculateAmountAndQty(10,"mouse"), 0, "Test for quantity : 10 and amount : mouse so output is 0" );
      equal( calculateAmountAndQty(10,null), 0, "Test for quantity : 10 and amount : null so output is 0" );
      equal( calculateAmountAndQty(null,2000), 0, "Test for quantity : null and amount : 2000 so output is 0" );
      equal( calculateAmountAndQty(undefined,2000), 0, "Test for quantity : undefined and amount : 2000 so output is 0" );
      equal( calculateAmountAndQty(10,undefined), 0, "Test for quantity : 10 and amount : undefined so output is 0" );
   });
}

function testingSheets(){
	QUnit.test( "Sheets testing", function() {
		var cashSheet = new Sheet({name:'現金'});
		var simulationSheet = new Sheet({name:'MSL_sim'});
		var parameterSheet = new Sheet({name:'Parameter'});
		var mutualFundSheet = new Sheet(name:{'ニッセイ 日経平均インデックスファンド'});
		equal( cashSheet.getType,'Cash', "Testing cash sheet");
		equal( simulationSheet.getType, 'Simulation', "Testing Simulation sheet");
		equal( parameterSheet.getType, 'Parameter', "Testing for Parmeter sheet");
		equal( mutualFundSheet.getType, 'Mutual Fund', "Testing for Mutual Fund sheet");
		equal( mutualFundSheet.getURL, 'http://www.morningstar.co.jp/FundData/Download.do?fnc=2016112105', "Testing for Mutual Fund sheet URL");
	});
}
