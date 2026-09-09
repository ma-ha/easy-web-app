/** Simple example: Create a web page with form */

var gui = require ( '../../' )  // stand alone: replace with  require( 'easy-web-app' )
var log = require( 'npmlog' );

// initialize the web app framework and a default main page
var page = gui.init ()
page.header.logoText = 'Tree + Histogram Example'

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

// Split page into columns
var columns = page.addColumnsRow( 'row3', '400px' )

// split left column into rows
var cRows = columns.addRowsColumn( 'TreeAndHist', '20%' )

// add the tree as row in left column
var treeView = cRows.addView( 
    { rowId:'tree', 
      title:'Categories', 
      type:'pong-tree', 
      resourceURL:'/products-tree', 
      height:'200px' 
    },
    {
      dataURL:"/products-tree",
      titleField:"info",
      treeArray:"types",
      idField:"productSpec",
      labelField:"productName",
      update:["tableView"],
      maxDeepth:"4"
  }
)

// add the histogram below tree in left column
var histView = cRows.addView( 
    { rowId:'hist', 
      title:'Rating',  
      type:'pong-histogram', 
      resourceURL:'/products/rating', 
      height:'200px' 
    },
    {
      dataX:"Rating",
      dataY:"count",
      xAxisUnit:"star",
      xAxisMin:"0",
      xAxisMax:"3",
      blockCount:"3",
      yAxisMax:"auto",
      update:[ ]      
    }
  )

// add the table view in the right column 
var view = columns.addView ( 
    // view config
    { columnId:'tableView', title:'Table', type:'pong-easytable', resourceURL:'/products', width:'80%' },
    // view's "pong-easytable" plug-in config
    {
      dataURL:'',
      easyCols:
        [
          '*ID|5%',
          'Name=Name.0',
          'ProductPage_linkForCol_1',
          'Picture',
          'ZoomImg_zooms_Picture',
          'Status_checkbox',
          'Rating',
          'Description_editable',
          'Product~Page_link'
        ],
      actions:[
        {  
          "method":"SETDATA", 
          "setData": [ { "resId":"hist" } ]
        }
      ]
    }
)

// the table requires a REST web service to serve the data: 
var svc  = gui.getExpress();
svc.get( 
    '/products-tree', 
    function( req, res ) {
      // generate some dummy data:
      var treeData = 
      {
          "info":"Filter:",
          "types":[
              {
                  "productSpec":"color",
                  "productName":"Color",
                  "types":[
                      {
                          "productSpec":"blue",
                          "productName":"Blue"
                      },
                      {
                        "productSpec":"red",
                        "productName":"Red",
                      },
                      {
                        "productSpec":"green",
                        "productName":"Green",
                      },
                      {
                        "productSpec":"grey",
                        "productName":"Grey",
                      }
                  ]
              },
              {
                  "productSpec":"top",
                  "productName":"3 Star"
              },
              {
                "productSpec":"all",
                "productName":"Show all"
            }
          ]
      }
      res.json( treeData )
    }
  )

// show page definition
//log.info( 'Page', JSON.stringify( page, ' ', ' ') )

// define some mock data
var tableData = 
  [ 
   {"ID":"yyy1",productSpec:["top","color","blue"],"Name":["Prod A","A"],"Rating":"3","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x02.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yyy3",productSpec:["brown","color"],"Name":["Prod B","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x03.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yyy4",productSpec:["color"],"Name":["Prod C","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x04.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yyy5",productSpec:["brown","color"],"Name":["Prod D","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x05.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yyy6",productSpec:["grey"],"Name":["Prod E","A"],"Rating":"1","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x06.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yyy7",productSpec:["grey"],"Name":["Prod F","A"],"Rating":"2","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x07.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yyy8",productSpec:["grey"],"Name":["Prod G","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x08.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yy09",productSpec:["top","green","color"],"Name":["Prod I","A"],"Rating":"3","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x10.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yy19",productSpec:["top","color","green","red"],"Name":["Prod J","A"],"Rating":"3","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x11.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yy11",productSpec:["grey"],"Name":["Prod K","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x12.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yy12",productSpec:["green","color"],"Name":["Prod L","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x13.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yy13",productSpec:["blue","color"],"Name":["Prod M","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x14.png","ZoomImg":"img\/tst.jpg"},
   {"ID":"yy14",productSpec:["blue","green","color"],"Name":["Prod N","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x15.png","ZoomImg":"img\/tst.jpg"}
  ]
  

// product service returns all data or filtered data on productSpec
svc.get( 
  '/products', 
  function( req, res ) {
    var result = []
    if ( req.query.productSpec  && req.query.productSpec != 'all' ) {
      //log.info( '/products', 'search: '+req.query.productSpec  )          
      for ( var i = 0; i < tableData.length; i++ ) {
        if ( tableData[i].productSpec.indexOf( req.query.productSpec ) >= 0 ) {
          //log.info( '/products', JSON.stringify( tableData[i].productSpec ) )          
          result.push( tableData[i] )
        }
      }
    } else {
      //log.info( '/products', "copy whole")
      result = tableData
    }
    // generate some dummy data:
    res.json( result )
  }
)

// trick: use i18n replacement for hist labels
gui.lang = { }
gui.lang[ 'EN' ] = { }
gui.addTranslation( 'EN', '1star', '<img src="/modules/pong-table/rating/3star1.png">' )
gui.addTranslation( 'EN', '2star', '<img src="/modules/pong-table/rating/3star2.png">' )
gui.addTranslation( 'EN', '3star', '<img src="/modules/pong-table/rating/3star3.png">' )
