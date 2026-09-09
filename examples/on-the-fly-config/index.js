/** Simple example: Create a web page with form */

var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var page = gui.init ()
page.header.logoText = 'Test: Table edit columns on-the-fly'

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

// add a view of type 'pong-easy-table' (= plug-in) 
gui.addView ( 
  // view config
  {
    id    : 'tableView',
    title : 'Table Demo (sorry, zoom is always a flower ;-)',
    type  : 'pong-easytable',
    resourceURL : '/products',
    height: '800px',
    actions:
      [
        {
          type: 'pong-on-the-fly',
          param: { assistUrl:"/products/pong-easytable/columns-available" }
        }
      ]
  }
  // plug-in config will be loaded from http://localhost:8888/products/pong-table 
)

// the table requires a REST web service to serve the data: 
var svc  = gui.getExpress()
var bodyParser  = require( 'body-parser' )
var jsonParser  = bodyParser.json()

// this is the table config at startup -- but you can change it in the browser
var moduleConfig =  {
    dataURL:"", // to load data on page load
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
      ]
  }
var moduleConfigTemplate =  JSON.parse( JSON.stringify( moduleConfig ) ) // clone moduleConfig

// load table config
svc.get( 
    '/products/pong-table', 
    function( req, res ) {
      res.json( moduleConfig )
    }
  )

// serve available config columns
svc.get( 
    '/products/pong-easytable/columns-available', 
    function( req, res ) {
      res.send( JSON.stringify( moduleConfigTemplate, null, '\t' ) )
    }
  )

// load table config
svc.get( 
    '/products/pong-easytable', 
    function( req, res ) {
      res.json( moduleConfig )
    }
  )
  
// save changed table config back
svc.post( 
    '/products/pong-easytable', 
    jsonParser,
    function( req, res ) {
      //console.log( JSON.stringify( req.body ) )
      if ( req.body && req.body.easyCols ) {
        moduleConfig = req.body
        //console.log( 'Response 200' )
        res.statusCode = 200  // request OK
      } else {
        //console.log( 'Response 200' )
        res.statusCode = 400  // bad request
      }
      return res.json( moduleConfig ) 
    }
  )

// table can store back single rows
svc.post( 
    '/products', 
    jsonParser,
    function( req, res ) {
      // ... implementaion should go here ....
      res.statusCode = 200  // request OK
      return res.json( {} ) 
    }
  )
// serve some dummy table content 
svc.get( 
    '/products', 
    function( req, res ) {
      // generate some dummy data:
      var tableData = 
        [ 
         {"ID":"yyy1","Name":["Prod A","A"],"Rating":"3","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x02.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yyy3","Name":["Prod B","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x03.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yyy4","Name":["Prod C","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x04.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yyy5","Name":["Prod D","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x05.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yyy6","Name":["Prod E","A"],"Rating":"1","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x06.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yyy7","Name":["Prod F","A"],"Rating":"2","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x07.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yyy8","Name":["Prod G","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x08.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yy09","Name":["Prod I","A"],"Rating":"3","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x10.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yy19","Name":["Prod J","A"],"Rating":"3","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x11.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yy11","Name":["Prod K","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x12.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yy12","Name":["Prod L","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x13.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yy13","Name":["Prod M","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x14.png","ZoomImg":"img\/tst.jpg"},
         {"ID":"yy14","Name":["Prod N","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/x15.png","ZoomImg":"img\/tst.jpg"}
        ]
      res.json( tableData )
    }
  )