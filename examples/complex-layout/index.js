/* Complex layout example. 
 Principle: page has rows, add view per row, nest columns in a row, view in columns and rows in a column.
 Multiple views can also be nested within a tab-container. 
 Result:
  ---------------------------
  |  Row 1 View             |
  ---------------------------
  |  Row 2 View             |
  ---------------------------
  |  Row 3 Cols             |
  | --------- ------------- |
  | |       | | Col 2     | |
  | | Col 1 | | --------- | |
  | | View  | | | Row X | | |
  | |       | | --------- | |
  | |       | | | Row X | | |
  | |       | | --------- | |
  | --------- ------------- |
  |  ...                    |
  */
var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require( 'npmlog' )
var express = require( 'express' )

// Initialize the framework and the default page
var mainPage = gui.init()
mainPage.title = 'Complex Layout Demo'
mainPage.header.logoText = 'Complex Layout Demo'

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

mainPage.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'100px,', resourceURL:'paramtest' } )
mainPage.addView( { 'id':'row2view', 'title':'Row 2 View', 'height':'100px' } )

var columns = mainPage.addColumnsRow( 'row3', '200px' )
columns.addView( { 'id':'col1view', 'title':'Col 1 View', 'width':'40%' } )

var col2rows = columns.addRowsColumn( 'col2', '60%' )
col2rows.addView( { 'id':'rowX', 'title':'Row X', 'height':'100px' } )
col2rows.addView( { 'id':'rowY', 'title':'Row Y', 'height':'100px' } )

var columns2 = mainPage.addColumnsRow( 'row3a', '200px' )
columns2.addView( { 'id':'col3aview', 'title':'Col 2 View', 'width':'40%' } )
var tabs1 = columns2.addTabContainer( { 'id':'colTab',  'width':'60%' } )

var formDef = {
    id: 'tab11Frm', description: 'shows first form',
    fieldGroups: [{ columns: [{ formFields: [{
      id:    'field1',
      label: 'Text',
      type:  'text',
      defaultVal: 'Hello world!'
    }] }]} ],
    actions: [{ id: 'myBtn', actionName: 'Send', 
      method: 'POST', actionURL: 'test'
    }]
  } 
tabs1.addView( 
  { id:'tab11', title:'Tab 1 in Col', type: 'pong-form', resourceURL: 'hello' },
  formDef
)
tabs1.addView( { id:'tab12', title:'Tab 2 in Col', resourceURL:'test' } )


var tabs2 = mainPage.addTabContainer( { id:'row4view', height:'400px'} )
tabs2.addView( { id:'tab21', title:'Tab 1 in Row 4', resourceURL:'test' } )
tabs2.addView( { id:'tab22', title:'Tab 2 in Row 4', resourceURL:'test' } )
var tRows = tabs2.addRows( 'tab23', 'Rows in tab' )
tRows.addView( { 'id':'tRowX', 'title':'T-Row X', 'height':'180px' } )
tRows.addView( { 'id':'tRowY', 'title':'T-Row Y', 'height':'170px' } )

gui.getExpress().use( '/test/html', express.static( __dirname + '/test' ) )

gui.getExpress().get( '/none/html', (req,res) => {
  res.status( 200 ).send( '...' )
})

// sinve v1.2.1 params must be passed to plain html view:
gui.getExpress().get( '/paramtest/html', (req,res) => {
  var html = 'Params:<ul>'
  for ( var param in req.query ) {
    html += '<li id="parm_'+param+'">'+param+': '+req.query[param]+'</li>'
  }
  html += '</ul>'
  res.status( 200 ).send( html )
})

// Print out the page layout specification:
// console.log( JSON.stringify( mainPage, null, ' ' ) )