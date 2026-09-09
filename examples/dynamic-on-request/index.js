/** Example: Create page layout on the fly */

const gui = require( '../../' )       // stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
let page = gui.init()
page.header.logoText = 'Test: Dynamic on-the-fly page genaration'
page.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'500px' } )

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

// ============================================================================
// 2nd page with a default view, should be overwritten by callback
let dynamicPage = gui.addPage( 'dynamicPage', 'Dynamic', { id:'Page2' } )
let pg2 = 
// generate page structure per request
dynamicPage.dynamicRow( ( staticRows, request, page ) => {
  return new Promise( ( resolve, reject ) => {
    let rnd5 = Math.random() * 5
    console.log( 'Gen random row-views for dynamic page: '+page )
      // per call you can re-define all the page rows here
    let newRows = [] 
    for ( let i = 0; i < rnd5; i++ ) {
      newRows.push({ 
        id: 'v'+i, rowId: 'v'+i, 
        title: 'Dynamic View '+i,
        height: '170px', decor: 'decor',
        resourceURL: 'none'
      })
  
    }
    resolve( newRows )
  })
})

// ============================================================================
//let's also redefine the nav tabs

gui.dynamicNav( ( navType, navTabs, req ) => {
  return new Promise( ( resolve, reject ) => {
    if ( navType === 'nav' ) { // can also be 'nav-embed' and 'nav-embed-sub'
      console.log( 'Manipulate NavTabs ...' )
      // add a funny dummy nav menu item
      navTabs.push({
        layout: 'xyz', // does not exist, so will redirect to main 
        label: 'BlaBla' 
      })
      resolve( navTabs )
    }
  })
})

// ============================================================================
// define callback to manipulate title, header and footer

gui.dynamicTitle( ( title, req, page ) => {
  return new Promise( ( resolve, reject ) => {
    console.log( 'Change title text for page '+ page +'...' )
    title = 'Dynamic Demo'
    resolve( title )
  })
})

// try out http://localhost:8888/index.html?layout=dynamicPage&id=1234
gui.dynamicHeader( ( headerDef, req, page ) => {
  return new Promise( ( resolve, reject ) => {
    console.log( 'Change header logo text  for page '+ page +'...' )
    headerDef.logoText += ' ...'
    if ( req.query.id ) {
      headerDef.logoText += req.query.id // "id" is passes by v2.3.1 to structure request
    }
    resolve( headerDef )
  })
})

gui.dynamicFooter( ( footerDef, req, page ) => {
  return new Promise( ( resolve, reject ) => {
    console.log( 'Change footer  for page '+ page +'...' )
    footerDef.copyrightText += ' :-)'
    resolve( footerDef )
  })
})
