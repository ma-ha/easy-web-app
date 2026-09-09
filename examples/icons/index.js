var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 

// the icon navigation must appear on each page:

var icons = { id:'nav1', title:' ', width:'7% ', type:'pong-icons', resourceURL:"navigation" }
var iconNav =
  { icons:[
        { layout:"main",  label:"Main", img:"img/p01w.png" },
        { layout:"page2", label:"Page 2", img:"img/p02w.png" },
        { layout:"page3", label:"Page 3", img:"img/p03w.png" }
     ],
     update:"15"
  }

// -------------------------------------------------------------
// main page

var mainPage = gui.init()
mainPage.title = 'Icon Navigation Demo'
mainPage.header.logoText = 'Icon Navigation Demo'
mainPage.header.modules = [] // removes nav-bar module

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

var columns = mainPage.addColumnsRow( 'row3', '600px' )
var nav = columns.addView( icons, iconNav )
nav.decor = null
// empty view: do business logic here:
columns.addView( { 'id':'col1view1', 'title':'Main Page', 'width':'93%' } )
  

// -------------------------------------------------------------
// page 2

var page2 = gui.addPage( 'page2', 'Page 2' )
var p2columns = page2.addColumnsRow( 'row3', '600px' )
var nav2 = p2columns.addView( icons, iconNav )
nav2.decor = ''

// empty view: do business logic here:
p2columns.addView( { 'id':'col1view2', 'title':'Page 2', 'width':'93%' } )


// -------------------------------------------------------------
// page 3

var page3 = gui.addPage( 'page3', 'Page 3' )
var p3columns = page3.addColumnsRow( 'row3', '600px' )
var nav3 = p3columns.addView( icons, iconNav )
nav3.decor = ''

// empty view: do business logic here:
p3columns.addView( { 'id':'col1view3', 'title':'Page 3', 'width':'93%' } )

// -------------------------------------------------------------
// icon view will request updates:
var svc  = gui.getExpress()
var cnt = 0
svc.get( 
  '/navigation', 
  function( req, res ) {
    cnt++;
    iconNav.icons[0].info = cnt+''
    res.status( 200 ).json( iconNav )     
  }
)