/** Simple example: Create a web page with form */

var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )
var bodyParser  = require( 'body-parser' )

// initialize the web app framework and a default main page
gui.init ()

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

// add a view of type 'pong-easy-table' (= plug-in) 
gui.addView ( 
  // view config
  {
    'id'    : 'tableView',
    'title' : 'Table Demo (sorry, zoom is always a flower ;-)',
    'type'  : 'pong-easytable',
    'height': '500px',
    'resourceURL' : '/products',
    'actions':
      [
        {
           'type':'pong-help', 
           'modalName':'Show how easy it is to configure of this view',
           'param': { 'showConfig':'tableView' }
        }  
      ]
  },
  // view's 'pong-easytable' plug-in config
  {
    dataURL:'',
    filter:{
      dataReqParams: [ 
        { id:'dateMin', label:'Newer than', type:'date',
          description:'Yes - this should really filer the data!' },
        { id: 'status', label: 'Status', type: 'checkbox' },
        { id:'rating', type:'select', label:'Rating',
          options: [
            { value:'0', option:"doesn't matter"},
            { value:'1', option:"top rated"}
          ]
        }
      ],
      dataReqParamsSrc: 'Form'
    },
    easyCols:
      [
        '*ID|5%',
        'Name=Name.0',
        'ProductPage_linkForCol_1',
        'Picture',
        'ZoomImg_zooms_Picture',
        'Status_checkbox',
        'Rating',
        'descr_editable',
        'Product~Page_link',
        'Created_datems_editable'
      ]
  }
)

// the table requires a REST web service to serve the data: 
var d = (new Date()).valueOf()
var tableData = 
  [ 
    {ID:'yyy1',Name:['Prod A','A'],Rating:'3',Status:'false',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Changing this will cause an error ;-)',Picture:'img\/x02.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy3',Name:['Prod B','A'],Rating:'2',Status:'true',ProductPage:'',descr:'Blah blub bubber.',Picture:'img\/x03.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy4',Name:['Prod C','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x04.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy5',Name:['Prod D','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x05.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy6',Name:['Prod E','A'],Rating:'1',Status:'false',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x06.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy7',Name:['Prod F','A'],Rating:'2',Status:'false',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x07.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy8',Name:['Prod G','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x08.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yy09',Name:['Prod I','A'],Rating:'3',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x10.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yy19',Name:['Prod J','A'],Rating:'3',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x11.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yy11',Name:['Prod K','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x12.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yy12',Name:['Prod L','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x13.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yy13',Name:['Prod M','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x14.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yy14',Name:['Prod N','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x15.png',ZoomImg:'img\/tst.jpg'}
  ]
for ( var i = 0; i < tableData.length; i++ ) {
  tableData[i].Created = d
  d -= 1000000000
}
var svc  = gui.getExpress();
svc.get( 
  '/products', 
  bodyParser.urlencoded( { extended: false } ),  
  function( req, res ) {
    var dateFilter   = null
    var ratingFilter = null
    var statusFilter = false
    if ( req.query && req.query.dataFilter && req.query.dataFilter.dateMin ) {
      dateFilter = ( new Date( req.query.dataFilter.dateMin ) ).valueOf()
      console.log( 'dateFilter > '+dateFilter)
    }
    if ( req.query && req.query.dataFilter && req.query.dataFilter.rating == 1 ) {
      ratingFilter = true
      console.log( 'ratingFilter: '+ratingFilter)
    }
    if ( req.query && req.query.dataFilter && req.query.dataFilter.status === 'true' ) {
      statusFilter = true
    }
    console.log( 'statusFilter: '+statusFilter)

    var result = []
    for ( var i = 0; i < tableData.length; i++ ) {
      if ( dateFilterOk( tableData[i].Created, dateFilter ) 
          && ratingFilterOk(  tableData[i].Rating, ratingFilter ) 
          && statusFilterOk(  tableData[i].Status, statusFilter ) ){
        result.push( tableData[i] )
      }
    }
    res.json( result )
  }
)

function ratingFilterOk( rec, filter ) {
  if ( filter && rec != '3' ) {  return false }
  return true
}

function dateFilterOk( rec, filter ) {
  if ( filter && rec <= filter ) { return false }
  return true
}

function statusFilterOk( rec, filter ) {
  if ( filter ) { 
    return ( rec === 'true' )
  } else {
    return true
  }
}

svc.post( 
  '/products',
  bodyParser.urlencoded( { extended: false } ),  
  function( req, res ) {
    if ( req.body.ID == 'yyy1') {
      return res.status(400).send('This is an error test ;-)')
    }
    if ( req.body && req.body.ID && req.body.Created )  {
      for ( var i = 0; i < tableData.length; i++ ) {
        if ( tableData[i].ID == req.body.ID ) {
          tableData[i].Created = req.body.Created
          console.log( 'Changed: Created='+req.body.Created+' for ID='+req.body.ID )
          continue
        }
      }
    }
    res.json( tableData )
  }
)
