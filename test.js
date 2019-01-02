QUnit.helpers( this );
function testFunctions() {
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
 
function testingSheets(){
  QUnit.test( "Sheets testing", function() {
    var cashSheet = Sheet({name:'現金'});
    var simulationSheet = Sheet({name:'MSL_sim'});
    var parameterSheet = Sheet({name:'Parameter'});
    var mutualFundSheet = Sheet({name:'ニッセイ 日経平均インデックスファンド'});
    //シートクラスのタイプテスト
    equal( cashSheet.getType(),'Cash', "Testing cash sheet");
    equal( simulationSheet.getType(), 'Simulation', "Testing Simulation sheet");
    equal( parameterSheet.getType(), 'Parameter', "Testing for Parmeter sheet");
    equal( mutualFundSheet.getType(), 'Mutual Fund', "Testing for Mutual Fund sheet");
    equal( mutualFundSheet.getURL(), 'http://www.morningstar.co.jp/FundData/Download.do?fnc=2016112105', "Testing for Mutual Fund sheet URL");
    //投資信託ページのテスト
    ok( mutualFundSheet.getSheetLatestDate(), '投資信託シート状の最新の日付：' + mutualFundSheet.getSheetLatestDate());
    equal( mutualFundSheet.update(), "投資信託ページ更新完了", "投資信託シートの価格の更新");
    ok( mutualFundSheet.getUpdatedDate(), '投資信託ページの更新日：' + mutualFundSheet.getUpdatedDate());
    ok( mutualFundSheet.getPrice(), '今日の投資信託の基準価格：' + mutualFundSheet.getPrice());
    //equal( mutualFundSheet.deleteLastRow(), "投資信託ページ最終行削除完了", "シミュレーションシートの更新");
    
    //シミュレーションページのテスト
    ok( simulationSheet.getSheetLatestDate(), 'シミュレーションシート状の最新の日付：' + simulationSheet.getSheetLatestDate());
    equal( simulationSheet.update(), "シミュレーションページ更新完了", "シミュレーションシートの更新");
    //equal( simulationSheet.deleteLastRow(), "シミュレーションページ最終行削除完了", "シミュレーションシートの更新");
       
    //現金ページのテスト
    ok( cashSheet.update(), "現金シートの更新");
    //ok( cashSheet.deleteLastRow(), '現金シートの最後の行削除');
       
    //パラメーターページのテスト
    ok( parameterSheet.update(), "パラメーターシートの更新");
    //ok( parameterSheet.deleteLastRow(), 'パラメーターシートの最後の行削除');
  });
}
