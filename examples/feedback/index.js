/** Simple example: Create a web page with form */

var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var page = gui.init ()
page.header.logoText = 'Test: Table with "Feedback"'

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )
  
// ----------------------------------------------------------------------------
// FEEDBACK: add the feedback module to the footer
page.footer.modules.push( 
    { 
      id: 'feedbackView', 
      type: 'pong-feedback', 
      param: { } 
    } 
  )
// ----------------------------------------------------------------------------

// add a view of type 'pong-easy-table' (= plug-in) 
gui.addView ( 
  // view config
  {
    'id'   : 'tableView',
    'title':'Feedback Demo: Click on one of the "Descriptions" and edit it or try out button there -----> ',
    'type':'pong-easytable',
    'resourceURL':'/products'
  },
  // view's "pong-easytable" plug-in config
  {
    "pollDataSec":"120",    // this generates a button to stop/start updates
    "dataURL":"",           // trigger to load data on page load 
    'easyCols':
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
      'maxRows':'5'
  }
)

// the table requires a REST web service to serve the data: 
var svc  = gui.getExpress();
svc.get( 
  '/products', 
  function( req, res ) {
    // generate some dummy data:
    var tableData = 
      [ 
       {"ID":"yyy1","Name":["Prod A","A"],"Rating":"3","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p01w.png","ZoomImg":"img\/p01.jpg"},
       {"ID":"yyy2","Name":["Prod B","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p02w.png","ZoomImg":"img\/p02.jpg"},
       {"ID":"yyy3","Name":["Prod C","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p03w.png","ZoomImg":"img\/p03.jpg"},
       {"ID":"yyy4","Name":["Prod D","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p04w.png","ZoomImg":"img\/p04.jpg"},
       {"ID":"yyy5","Name":["Prod E","A"],"Rating":"1","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p05w.png","ZoomImg":"img\/p05.jpg"},
       {"ID":"yyy6","Name":["Prod F","A"],"Rating":"2","Status":"false","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p06w.png","ZoomImg":"img\/p06.jpg"},
       {"ID":"yyy7","Name":["Prod G","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p07w.png","ZoomImg":"img\/p07.jpg"},
       {"ID":"yy08","Name":["Prod I","A"],"Rating":"3","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p08w.png","ZoomImg":"img\/p08.jpg"},
       {"ID":"yy09","Name":["Prod J","A"],"Rating":"3","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p09w.png","ZoomImg":"img\/p09.jpg"},
       {"ID":"yy10","Name":["Prod K","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p10w.png","ZoomImg":"img\/p10.jpg"},
       {"ID":"yy11","Name":["Prod L","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p11w.png","ZoomImg":"img\/p11.jpg"},
       {"ID":"yy12","Name":["Prod M","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p12w.png","ZoomImg":"img\/p12.jpg"},
       {"ID":"yy13","Name":["Prod N","A"],"Rating":"2","Status":"true","ProductPage":"http:\/\/mh-svr.de\/pong_dev\/README.md","descr":"Blah blub bubber.","Picture":"img\/p13w.png","ZoomImg":"img\/p13.jpg"}
      ]
    res.json( tableData )
  }
)