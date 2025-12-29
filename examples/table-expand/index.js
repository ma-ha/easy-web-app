/** Simple example: Create a web page with form */
var gui = require('../../')       // stand alone: replace with  require( 'easy-web-app' )
var bodyParser = require('body-parser')
var express = require( 'express' )

// initialize the web app framework and a default main page
var mainPage = gui.init( 'Table Expand Demo' )
mainPage.title = 'Table Expand Demo'
mainPage.header.logoText = 'Table Expand Demo'
gui.getExpress().use( '/css-custom', express.static( __dirname ) )

// add a view of type 'pong-easy-table' (= plug-in) 
gui.addView( // view config
  {
    'id': 'tableView',
    'title': 'Table Demo (sorry, zoom is always a flower ;-)',
    'type': 'pong-table',
    'height': '600px',
    'resourceURL': '/products',
    'actions':
    [
      {
        'type': 'pong-help',
        'modalName': 'Show how easy it is to configure of this view',
        'param': { 'showConfig': 'tableView' }
      }
    ]
  },
  // view's 'pong-table' plug-in config
  {
    dataURL: '',
    rowId: 'ID', // required for editable cells and select
    cols: [
      {
        cellType: "button", 
        method: "expand",
        id: "Det1", width: "5%", label: "&nbsp;",
        expand: {
          heightMin: "100px",
          // this are the elements of the exand:
          divs: [ 
            { id: 'id', cellType: "text" },
            { id: "Picture", cellType: "img" },
            {
              id: "ZoomImg", label: "ZoomImg_zooms_Picture",
              cellType: "largeimg", forImg: "Picture"
            },
            {
              id: "XCust", cellType: "div",
              divs: [
                { id: "CustomerCountLb", cellType:'label',label: "Customers" },
                { id: "CustomerCount", cellType: "text" },
                { id: "RatingLb", cellType:'label', label: "Rating" },
                { id: "Rating", cellType: "rating", ratingType: "3star" }
              ]
            },
            { id: "Descr", cellType: "text" },
            { id: "ColSel", cellType: "select",
              options: [
                { option:'Red' },{ option:'Green' },{ option:'Blue' }
              ]
            }
          ]

        } 
      },
      // other "normal" table columns ...
      {
        width: "15%",
        id: 'id',
        label: 'id',
        cellType: "text"
      },
      {
        id: "Name.0",
        label: "Name",
        cellType: "text",
        editable: "true"
      },
      {
        id: "Status",
        label: "Status",
        cellType: "checkbox"
      },
      {
        id: "Created",
        label: "Created",
        cellType: "datems",
        editable: "true"
      },
      { 
        id: "Rating", 
        label: "Rating as Number", 
        cellType: "number", 
        digits: 2 
      },
      {
        id: "ProductPage",
        label: "Product Page",
        cellType: "linkLink"
      },
      {
        id: "act",
        cellType: "button",
        URL: '/products',
        update: [ {resId:'tableView'} ]
      }
    ]
  }
)

// the table requires a REST web service to serve the data: 
var d = (new Date()).valueOf()
var tableData = 
  [ 
    {ID:'yyy1',Name:['Prod A','A'],Rating:'3',Status:'false',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x02.png',ZoomImg:'img\/tst.jpg',act:'Buy',ColSel:'Blue'},
    {ID:'yyy3',Name:['Prod B','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x03.png',ZoomImg:'img\/tst.jpg'},
    {ID:'yyy4',Name:['Prod C','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x04.png',ZoomImg:'img\/tst.jpg',act:'Mark'},
    {ID:'yyy5',Name:['http://mh-svr.de/','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x05.png',ZoomImg:'img\/tst.jpg',act:'Do something'},
    {ID:'yyy6',Name:['Prod E','A'],Rating:'1',Status:'false',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x06.png',ZoomImg:'img\/tst.jpg',act:'Buy'},
    {ID:'yyy7',Name:['Prod F','A'],Rating:'2',Status:'false',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x07.png',ZoomImg:'img\/tst.jpg',act:null},
    {ID:'yyy8',Name:['Prod G','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x08.png',ZoomImg:'img\/tst.jpg',act:false},
    {ID:'yy09',Name:['Prod I','A'],Rating:'3',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x10.png',ZoomImg:'img\/tst.jpg',act:'Buy'},
    {ID:'yy19',Name:['Prod J','A'],Rating:'3',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x11.png',ZoomImg:'img\/tst.jpg',act:'Buy'},
    {ID:'yy11',Name:['Prod K','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x12.png',ZoomImg:'img\/tst.jpg',act:'Buy'},
    {ID:'yy12',Name:['Prod L','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x13.png',ZoomImg:'img\/tst.jpg',act:'Buy'},
    {ID:'yy13',Name:['Prod M','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x14.png',ZoomImg:'img\/tst.jpg',act:'Buy'},
    {ID:'yy14',Name:['Prod N','A'],Rating:'2',Status:'true',ProductPage:'http:\/\/mh-svr.de\/pong_dev\/README.md',descr:'Blah blub bubber.',Picture:'img\/x15.png',ZoomImg:'img\/tst.jpg',act:'Buy'}
  ]
for (var i = 0; i < tableData.length; i++) {
  tableData[ i ].Created = d
  d -= 1000000000
}
var svc = gui.getExpress();
svc.get(
  '/products',
  bodyParser.urlencoded({ extended: false }),
  function (req, res) {
    var dateFilter = null
    var ratingFilter = null
    if (req.query && req.query.dataFilter && req.query.dataFilter.dateMin) {
      dateFilter = (new Date(req.query.dataFilter.dateMin)).valueOf()
      console.log('dateFilter > ' + dateFilter)
    }
    if (req.query && req.query.dataFilter && req.query.dataFilter.rating == 1) {
      ratingFilter = true
      console.log('ratingFilter: ' + ratingFilter)
    }

    var result = []
    for (var i = 0; i < tableData.length; i++) {
      if (dateFilterOk(tableData[ i ].Created, dateFilter)
        && ratingFilterOk(tableData[ i ].Rating, ratingFilter)) {
        result.push(tableData[ i ])
      }
    }
    res.json(result)
  }
)

function ratingFilterOk(rec, filter) {
  if (filter && rec != '3') { return false }
  return true
}

function dateFilterOk(rec, filter) {
  if (filter && rec <= filter) { return false }
  return true
}

svc.post(
  '/products',
  bodyParser.urlencoded({ extended: false }),
  function (req, res) {
    if (req.body && req.body.ID && req.body.Created) {
      for (var i = 0; i < tableData.length; i++) {
        if (tableData[ i ].ID == req.body.ID) {
          tableData[ i ].Created = req.body.Created
          console.log('Changed: Created=' + req.body.Created + ' for ID=' + req.body.ID)
          continue
        }
      }
    }
    res.json(tableData)
  }
)
