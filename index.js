/*!
 * easy-web-gui
 * Copyright(c) 2018 ma-ha
 * MIT Licensed
 */

var gui = exports = module.exports = {
  pages : {}
  ,userTokens : {}
  ,pullDownMenu : {}
  ,appRoot: '/'
  ,decor: 'decor'
};

// logger
var log = require( 'npmlog' );

// use express for REST services
var express     = require( 'express' );
var webservices = express();
var router = express.Router();
gui.express = webservices
var jwt = require( 'jsonwebtoken' )

var bodyParser  = require( 'body-parser' );
// body-parser for JSON payload:
var jsonParser  = bodyParser.json();
// body-parser for parsing application/x-www-form-urlencoded:
var formParser  = bodyParser.urlencoded( { extended: true } );

var cookieParser = require( 'cookie-parser' )
webservices.use( cookieParser() )

// support external confugation
var config = require( 'config' )
if ( config.staging ) { log.info( 'Web GUI', 'config stage: '+config.staging ) }
var cfg = {}
if ( config.has('easy-web-app') ) { 
  cfg = config.get( 'easy-web-app' ) 
  if ( cfg.enableCustomCSS ) {
    router.use( '/css-custom', express.static( process.cwd()+'/css' ) )
    log.info( 'Web GUI', 'use '+process.cwd() +'/custom.css' )
  }
  if ( cfg['img-cust'] ) {
    router.use( '/img-cust', express.static( process.cwd() +'/'+ cfg['img-cust'] ) )
    log.info( 'Web GUI', 'get "/img-cust" from folder '+process.cwd() +'/'+ cfg['img-cust']   )
  }
}
log.info( 'Web GUI', 'config port: '+cfg.port )

if ( config.loglevel ) { 
  log.info( 'Web GUI', 'switch to log level: '+config.loglevel )
  log.level = config.loglevel 
}

/** Initialize the Web GUI */
gui.init = function init( logoText, port, rootPath, options ) {
  this.appRoot = rootPath || cfg.rootPath || '/'
  if ( this.appRoot.indexOf('/') != 0 ) { this.appRoot = '/'+this.appRoot }
  var mainPage = this.setDefaults( options )
  mainPage.header.logoText = cfg.logoText || logoText
  mainPage.title           = cfg.title || mainPage.title
  mainPage.footer.copyrightText = cfg.copyrightText || mainPage.footer.copyrightText
  if ( cfg.logoURL ) { mainPage.setLogoURL( cfg.logoURL ) }

  var wsPort = port || cfg.port || 8888
  if ( typeof WEB_SERVER_PORT !== 'undefined' ) { 
    wsPort = WEB_SERVER_PORT  //  global setting override
  }
  webservices.use( this.appRoot, router )
  webservices.listen( wsPort )
  log.info( 'Web GUI', 'http://localhost:' + wsPort + this.appRoot )
  if ( cfg.enableSecurity === true ) {
    gui.enableSecurity()
    if ( cfg.loginTimeout ) {
      gui.loginTimeout = cfg.loginTimeout 
    }
  }
  return mainPage
}

gui.getExpress = function getExpress() {
  return router;
}

/** Set defaults for all required configurations */
gui.setDefaults = function setDefaults( options ) {
  // create a default "main" page minimum config
  var  navUrl = ( this.appRoot=='/' ? '/svc/nav' : this.appRoot+'/svc/nav' ) 
  this.pages[ 'main' ] = {
      title : 'Main Page'
    , version: '2'
    , header : {
          logoText : 'Test'
          ,frameWarning: "true"
          ,modules : [ ]
        }
    , rows : []
    , footer : {
        copyrightText : 'powered by '+
          '<a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
      , modules: []
    }
  }

  this.pages[ 'main' ].setLogo =
    function( text, imgLink ) {
      if ( ! text ) return
      this.header['logo'] = { text: text, url: gui.appRoot + '/index.html' }
      if ( imgLink ) this.header['logo']['img'] = imgLink 
    }

  this.pages[ 'main' ].setLogoText =
    function( text ) {
      this.header['logoText'] = text
    }

  this.pages[ 'main' ].setLogoURL =
    function( url ) {
      this.header['logoURL'] = url
    }

  this.pages[ 'main' ].setTitle =
    function( text ) {
      this.title = text
    }

  this.pages[ 'main' ].addColumnsRow = 
      function ( id, height ) {
        return gui.addColumnsRow( id, this.rows, height  )
      }
  this.pages[ 'main' ].addView =  
      function ( def, config ) {
        if ( def.id ) { def.id = def.id.replace( ' ', '' ) }
        def.rowId = def.rowId || def.id;   
        return gui.addViewIn( def, config, this.rows )          
      }

  this.pages[ 'main' ].addTabContainer =
    function( def ) { return addTabCont( def, 'row', this.rows ) }
   
  /** set page width attribute and override CSS */
  this.pages[ 'main' ].setPageWidth = 
    function setPageWidth( width  ) {
      this[ 'page_width' ] = width
    }
  
  this.pages[ 'main' ].setCopyright =
    function( text ) {
      this.footer['copyrightText'] = text
    }

  this.pages[ 'main' ].addFooterLink =
    function( linkText, linkURL, linkTarget ) {
    if ( ! this.footer['linkList'] ) {  this.footer['linkList'] = [] }
    if ( linkTarget ) {
      this.footer['linkList'].push( { text:linkText, url:linkURL, target:linkTarget } )
    } else {
      this.footer['linkList'].push( { text:linkText, url:linkURL } )
    }
  }


  this.pages[ 'main' ].addInfo =
    function( text ) {
      this.info = text
    }

  this.pages[ 'main' ].delInfo =
    function( ) {
      this.info = null
    }

  this.pages[ 'main' ].dynamicRow =
    function( dynamicRowCallback ) {
      this.dynamicRowCallback = dynamicRowCallback
    }

  if ( options && options.nav == 'embedded' ) {
    var navView = {
      id : 'Nav', title:'',
      type:'pong-nav-embed',
      resourceURL:'/svc/nav-embed', 
      height:'XX', decor:"none"
    }
    this.pages[ 'main' ].addView ( navView )
    options.decor = 'none'
    this.pages[ 'main' ].header.embedNav = true
  } else {
    var navbar = { 
        id : 'MainNav' , type : 'pong-navbar'
        , param : {
            confURL : navUrl
        }
      } 
    this.pages[ 'main' ].header.modules.push( navbar )
  }
  if ( options && options.decor != 'none' ) {
    this.pages[ 'main' ].decor = gui.decor
  }
  
  return this.pages[ 'main' ]
}

gui.dynamicTitle =
  function( dynamicTitleCallback ) {
    this.dynamicTitleCallback = dynamicTitleCallback
  }

gui.dynamicHeader =
  function( dynamicHeaderCallback ) {
    this.dynamicHeaderCallback = dynamicHeaderCallback
  }

gui.dynamicFooter =
  function( dynamicFooterCallback ) {
    this.dynamicFooterCallback = dynamicFooterCallback
  }

function addTabCont( def, type, arr ) {
  var tabDiv = {}
  tabDiv.tabs = []
  if ( type == 'row' ) {
    tabDiv.height = def.height || '400px'
    tabDiv.rowId  = def.rowId || def.id
  } else {
    tabDiv.width    = def.width || '100%'
    tabDiv.columnId = def.columnId || def.id
  }
  tabDiv.addView = ( def, vConfig ) => {
    var view = { 
      tabId : def.id,
      title : def.title || def.id || ' ',
      resourceURL : def.resourceURL || null
    }
    if ( def.type ) { view.type = def.type }
    if ( def. actions ) { view.actions = def.actions }
    if ( vConfig ) { view.moduleConfig = vConfig }
    tabDiv.tabs.push( view )
    return view
  }
  tabDiv.addRows = ( id, title ) => {
    var rows = gui.addRowsColumn( id, null, '100%' )
    rows.title = title
    rows.tabId = id
    delete rows.columnId
    delete rows.width
    tabDiv.tabs.push( rows )
    return rows
  }
  arr.push( tabDiv )
  return tabDiv   
}


/** add new pull down menu */
gui.addPullDownMenu = function addPullDownMenu( menuId, menuLabel ) {
	var newMenu = 
	  { id: menuId, 
		type: 'pong-pulldown', 
	    moduleConfig: {
	      title: menuLabel,
	      menuItems : [ ]   
	    } 
	  }
	this.pullDownMenu[ menuId ] = newMenu
	this.pages[ 'main' ].header.modules.push( newMenu )
}

/** add a new pull down menu header module */
gui.addPullDownMenuHtmlItem = function addPullDownMenuHtmlItem( menuId, htmlString ) {
	if ( this.pullDownMenu[ menuId ] ) { 
		this.pullDownMenu[ menuId ].moduleConfig.menuItems.push( { html:htmlString } )
	} else {
		log.warn( 'addPullDownMenuHtmlItem: Menu "'+menuId+'" not available!')
	}
}

gui.dynamicNav = function dynamicNav( dynamicNavCallback ) {
  this.dynamicNavCallback = dynamicNavCallback
}

/** add new page to portal, navigation tabs included */
gui.addPage = function addPage( pageId, title, viewDef, viewConfig  ) {
  if ( ! pageId ) {
    log.warn( 'gui.addPage', 'pageID not defined propperly' );
  } else if ( this.pages[ pageId ] ) {
    log.warn( 'gui.addPage', 'Page "' + pageId + '" already exists in GUI.' );
  } else {
    var pgObj = {
        title : pageId
      , version: '2'
      , header : this.pages[ 'main' ].header
      , rows : []
      , footer : this.pages[ 'main' ].footer
    }
    if ( title ) 
      pgObj.title = title 
    
    pgObj.addColumnsRow = 
        function ( id, height) {
          // log.info( 'pages[].addColumns', id )
          return gui.addColumnsRow( id, this.rows, height )
        }
    pgObj.addView =  
        function ( def, config ) {
          def.rowId = def.rowId || def.id;
          if ( def.rowId ) { def.rowId = def.rowId.replace( ' ','' ) }
          return gui.addViewIn( def, config, pgObj.rows )
        }
    pgObj.addTabContainer =
      function( def ) { return addTabCont( def, 'row', pgObj.rows ) }

    /** set page width attribute and override CSS */
    pgObj.setPageWidth = 
      function setPageWidth( width  ) {
        this[ 'page_width' ] = width
      }
    
    pgObj.addInfo =
      function( text ) {
        this.info = text
      }

    pgObj.delInfo =
      function(  ) {
        this.info = null
      }
    
    pgObj.dynamicRow =
      function( dynamicRowCallback ) {
        this.dynamicRowCallback = dynamicRowCallback
      }
    
    if ( this.pages[ 'main' ].header.embedNav ) {
      var navView = {
        id : 'Nav', title:'',
        type:'pong-nav-embed',
        resourceURL:'/svc/nav-embed', 
        height:'XX', decor:"none"
      }
      pgObj.addView ( navView )
    }

    pgObj.addSubNav =
      function(  ) {
          var navView = {
            id : 'SubNav', title:'',
            type:'pong-nav-embed',
            resourceURL:'/svc/nav-embed-sub', 
            height:'XX', decor:"none"
          }
          pgObj.addView ( navView )
      }

      if ( viewDef ) {
        if ( viewDef.id ) { viewDef.id = viewDef.id.replace( ' ', '' ) }
        pgObj.addView( viewDef, viewConfig )
      }
    
    this.pages[ pageId ] = pgObj

    // check if pag is for pull down menu:
    if ( pageId.indexOf( '/' ) != -1 ) {
    	var menuId = pageId.substr( 0 , pageId.indexOf( '/' ) )
    	// log.info( ' ... '+menuId )
    	if ( menuId == 'user' ) {
        if ( gui.secParams ) { // only if security is enabled 
          //log.info( 'menu "'+menuId +'": '+pageId)
          if ( ! gui.secParams.userPages ) { gui.secParams.userPages = {} }
          gui.secParams.userPages[ title ] = pageId
        }
    	} else if ( this.pullDownMenu[ menuId ] ) {
    		// log.info( 'pullDownMenu: '+menuId )
    		this.pullDownMenu[ menuId ].moduleConfig.menuItems.push( 
    		    { pageLink:pageId, label:title } 
    		)
    	} 
    }

    return pgObj
  }
}


/** split the column into a rows, to add views */
gui.addColumnsRow = function addColumnsRow( id, colArr, height ) {
  // log.info( 'addColumns', id )
  var rowObj = {
      rowId : id
    , height: height || "300px"
    , cols : []
  }
  rowObj.addRowsColumn = 
      function ( id, width ) {
        return gui.addRowsColumn( id, this.cols, width )
      }
  rowObj.addView = 
    function ( def, config ) {
      if ( def.id && ! def.columnId ) {
        def.columnId = def.id
      }
      if ( def.columnId ) { def.columnId =  def.columnId .replace( ' ', '' ) }
      return gui.addViewIn( def, config, this.cols )          
    }
  rowObj.addTabContainer =
      function( def ) { return addTabCont( def , 'col', rowObj.cols ) }
  colArr.push( rowObj )
  // log.info( 'addColumns', 'rowObj='+JSON.stringify( rowObj ) )
  return rowObj
}


/** split the row into a columns, to add views */
gui.addRowsColumn = function addRowsColumn( id, cols, width ) {
  var newCol = {
      columnId: id
    , width: width || "300px"
    , rows : []
  }
  newCol.addColumnsRow = 
      function ( id, height) {
        // log.info( 'pages[].addColumns', id )
        return gui.addColumnsRow( id, this.rows, height )
      }  
  newCol.addRows = 
      function ( height ) {
       return gui.addColumns( this.rows, height )
      }
  newCol.addView =
      function ( def, config ) { 
        if ( def.id && ! def.rowId ) {
          def.rowId = def.id
        }
        if ( def.rowId ) { def.rowId = def.rowId.replace( ' ', '' ) }
        return gui.addViewIn( def, config, this.rows )          
      }
  newCol.addTabContainer =
      function( def ) { return addTabCont( def , 'row', this.rows ) }

  if ( cols ) cols.push( newCol )
  return newCol
}

gui.addViewIn = function addViewIn( def, config, arr ) {
  var view = JSON.parse( JSON.stringify( def ) ) // clone it
  if ( def.title == '' ) { view.title = null } 
    else { view.title = def.title || def.id || "View:" }
  view.decor = def.decor || this.decor
  view.resourceURL = def.resourceURL || "none"
  view.height = def.height || '400px'
  if ( config ) {
    view.moduleConfig = config
  }
  if ( view.id ) { view.id = view.id.replace( ' ', '' ) }
  arr.push( view )
  return view
}

/** add a view (new row) to the page */
gui.addView = function addView( def, config, page ) {
  var pg = page || 'main';
  // pg = encodeURIComponent ( pg );
  var view = {};
  if ( !this.pages[ pg ] ) {
    log.warn( 'gui.addView', 'Page "' + pg + '" not found in GUI!' );
    return null;
  }
  if ( !def ) {
    log.warn( 'gui.addView', '"def" is required parameter!' );
    return null;
  }
  if ( !def.id ) {
    log.warn( 'gui.addView','"def.id" is required!' );
    return null;
  } else { // OK, add view
    view[ 'rowId' ]  = def.id.replace( ' ', '' ) ;
    view[ 'title' ]  = def.title || def.id || "View:";
    view[ 'decor' ]  = def.decor || this.decor;
    view[ 'height' ] = def.height || '400px';
    view[ 'resourceURL' ] = def.resourceURL || "none";
    if ( def.type ) {
      view[ 'type' ] = def.type;
    }
    if ( config ) {
      view[ 'moduleConfig' ] = config;
    }
    if (def. actions ) {
      view[ 'actions' ] = def.actions;
    }
    this.pages[ pg ].rows.push ( view );
  }
  // console.log( JSON.stringify( this.pages[ pg ] ) );
  return view;
};


/* define static directories to load the framework into the web page */
var fs = require('fs')
var staticDir = __dirname + '/rest-web-gui/html'
if ( fs.existsSync( staticDir ) ) {
    log.info(' Init', 'Using static in '+staticDir )
} else {
  var path =require('path')
  staticDir = path.resolve( __dirname, '../rest-web-gui/html' )
  if ( fs.existsSync( staticDir ) ) {
    log.info(' Init', 'Using static in '+staticDir )
  } else {
    staticDir = __dirname + '/node_modules/rest-web-gui/html'
    if ( fs.existsSync( staticDir ) ) {
      log.info(' Init', 'Using static in '+staticDir )
    } else {
      log.error(' Init', 'No path to "rest-web-gui" found! ' )
      log.error(' Init', 'Tried: '+__dirname + '/rest-web-gui/html' )
      log.error(' Init', 'Tried: '+path.resolve( __dirname, '../rest-web-gui/html' ) )
      log.error(' Init', 'Tried: '+staticDir )
      process.exit(1)
    }
  }
}
router.use ( '/css',     express.static( staticDir + '/css' ) );
router.use ( '/js',      express.static( staticDir + '/js' ) );
router.use ( '/img',     express.static( staticDir + '/img' ) );
router.use ( '/modules', express.static( staticDir + '/modules' ) );
// router.use ( '/i18n', express.static( staticDir + '/i18n' ) );

function getBasePageName( page ) {
  var len2 = page.length -2
  if ( page.indexOf( '-m' ) == len2  ||  page.indexOf( '-t' ) == len2 ) {
    return page.substring( 0, len2 )
  } else { 
    return page
  }
}

/** REST web service to GET layout structure: */
router.get( 
  '/svc/layout/:id/structure', 
  async function( req, res ) {
    var pgId = getBasePageName( req.params.id )
    var userId = null
    try { userId = await gui.getUserIdFromReq( req ) }
    catch( exc ) { log.warn( 'easy-web-app /svc/layout/:id/structure', exc ) }
    if ( gui.authorize && ! await gui.authorize( userId, pgId, req ) ) {
      // not authorized for this page
      var redirectPage =  'main'
      if ( gui.secParams && gui.secParams.needLoginPage ) {
        redirectPage = gui.secParams.needLoginPage
      }
      var pg = JSON.parse( JSON.stringify( gui.pages[ redirectPage ] ) ) // cloned
      if ( gui.authorize && pg.header ) { // check authorization for header modules
        var user = await gui.getUserIdFromReq( req )
        for ( var i = pg.header.modules.length-1; i >= 0; i-- ) {
          //log.info( '>>>>', pg.header.modules[i].type)
          let allowedModules = [ 'pong-security', 'pong-security2', 'pong-navbar'  ]
          if ( allowedModules.indexOf( pg.header.modules[i].type ) == -1 ) { 
            // all others should be checked for authorization
            if (  pg.header.modules[i].id  && ! await gui.authorize( user, pg.header.modules[i].id, req ) ) {
              delete pg.header.modules[i] // not a
            }
          }
        }
      }
      pg = await dynamicStructureCallbacks( pg, gui.pages[ redirectPage ].dynamicRowCallback, req, pgId )
      var layout = {
        'layout' : pg
      }
      // console.log( layout )
      return res.json( layout )
    } else  
    if ( gui.pages[ req.params.id ] ) {
      var pg = JSON.parse( JSON.stringify( gui.pages[ req.params.id ] ) ) // cloned
      if ( gui.authorize && pg.header ) { // check authorization for header modules
        var user = await gui.getUserIdFromReq( req )
        for ( var i = pg.header.modules.length-1; i >= 0; i-- ) {
          let allowedModules = [ 'pong-security', 'pong-security2', 'pong-navbar'  ]
          if ( allowedModules.indexOf( pg.header.modules[i].type ) == -1 ) { 
            // all others should be checked for authorization
            if (  pg.header.modules[i].id  && ! await gui.authorize( user, pg.header.modules[i].id, req ) ) {
              delete pg.header.modules[i] // not authorized
            }
          }
        }
      }
      pg = await dynamicStructureCallbacks( pg, gui.pages[ req.params.id ].dynamicRowCallback, req, pgId )
      //log.info( "structure", req.params.id  )
      var layout = {
        'layout' : pg 
      }
      return res.json( layout )
    } else {
      res.statusCode = 404
      return res.send( 'Error 404: No quote found' )
    }
  } 
);

/** REST web service to GET layout structure for sub menu pages: */
router.get( 
  '/svc/layout/:id/:subid/structure', 
  async function( req, res ) {
    var page = req.params.id +'/'+ req.params.subid
    // console.log( '>>'+req.params.subid );
    var userId = null
    try { userId = await gui.getUserIdFromReq( req ) }
    catch( exc ) { log.warn( 'easy-web-app /svc/layout/:id/:subid/structure', exc ) }
    if ( gui.authorize && ! gui.authorize( userId, page, req ) ) {
      // not authorized for this page
      var redirectPage =  'main'
      if ( gui.secParams && gui.secParams.needLoginPage ) {
        redirectPage = gui.secParams.needLoginPage
      }
      var pg = JSON.parse( JSON.stringify( gui.pages[ redirectPage ] ) ) // cloned
      if ( gui.authorize && pg.header ) { // check authorization for header modules
        var user = await gui.getUserIdFromReq( req )
        for ( var i = pg.header.modules.length-1; i >= 0; i-- ) {
          //log.info( '>>>>', pg.header.modules[i].type)
          let allowedModules = [ 'pong-security', 'pong-security2', 'pong-navbar'  ]
          if ( allowedModules.indexOf( pg.header.modules[i].type ) == -1 ) { 
            // all others should be checked for authorization
            if (  pg.header.modules[i].id  && ! gui.authorize( user, pg.header.modules[i].id, req ) ) {
              delete pg.header.modules[i] // not a
            }
          }
        }
      }
      pg = await dynamicStructureCallbacks( pg, gui.pages[ redirectPage ].dynamicRowCallback, req, page )
      var layout = {
          'layout' : pg
        };
      return res.json( layout );
    } else 
    if ( gui.pages[ page ] ) {
      var pg = JSON.parse( JSON.stringify( gui.pages[ page] ) ) // cloned
      pg = await dynamicStructureCallbacks( pg, gui.pages[ page ].dynamicRowCallback, req, page )
      var layout = {
        'layout' : pg
      };
      res.json( layout );
    } else {
      res.statusCode = 404;
      return res.send( 'Error 404: Page "'+page+'" not found' );
    }
  } 
);

// enable to replace the static structure of header, rows and footer per request using calbacks
async function dynamicStructureCallbacks( pg, dynamicRowCallback, req, page ) {
  if ( gui.dynamicTitleCallback )  { // manipulate title on the fly
    try { 
      let newTitle = await gui.dynamicTitleCallback( pg.title, req, page ) 
      if ( newTitle ) {
        pg.title = newTitle
      }
    } catch( exc ) { log.warn( 'easy-web-app /svc/layout/:id/structure dynamicRowCallback', exc ) }
  }
  if ( gui.dynamicHeaderCallback ) { // manipulate header content on the fly via callback
    try { 
      let newHeader = await gui.dynamicHeaderCallback( pg.header, req, page ) 
      if ( newHeader ) {
        pg.header = newHeader
      }
    } catch( exc ) { log.warn( 'easy-web-app /svc/layout/:id/structure dynamicRowCallback', exc ) }
  }
  if ( dynamicRowCallback ) { // generate rows content on the fly via callback
    try { 
      let newRows = await dynamicRowCallback( pg.rows, req, page ) 
      if ( newRows ) {
        pg.rows = newRows
      }
    } catch( exc ) { log.warn( 'easy-web-app /svc/layout/:id/structure dynamicRowCallback', exc ) }
  }
  if ( gui.dynamicFooterCallback ) { // manipulate footer content on the fly via callback
    try { 
      let newFooter = await gui.dynamicFooterCallback( pg.footer, req, page ) 
      if ( newFooter ) {
        pg.footer = newFooter
      }
    } catch( exc ) { log.warn( 'easy-web-app /svc/layout/:id/structure dynamicRowCallback', exc ) }
  }
  return pg
}



/**
 * Single page does it all, the layout parameter references the "page". Default
 * is the "main" page
 */
router.get ( 
  '/', 
  function( req, res ) {
    if ( gui.appRoot == '/' ) {
      res.redirect( '/index.html' );      
    } else {
      res.redirect( gui.appRoot+'/index.html' );      
    }
  }
);


router.get( 
  '/index.html', 
  function( req, res ) {
    res.sendFile( __dirname + '/index.html' );
  }
);


/** web service to assemble top level menu items for embedded navigation bar */
router.get( 
  '/svc/nav-embed', 
  async function( req, res ) {
    var navTabs = []
    var layout =  req.query.page
    //  main menu
    for ( var layoutId in gui.pages ) {
      if ( gui.pages.hasOwnProperty ( layoutId ) ) {
        if (( layoutId.indexOf( '-nonav' ) == -1 ||
              layoutId.indexOf( '-nonav' ) != layoutId.length -6  ) && 
            ( layoutId.indexOf( '-m' ) == -1 ||
              layoutId.indexOf( '-m' ) != layoutId.length -2 ) && 
            ( layoutId.indexOf( '-t' ) == -1 ||
              layoutId.indexOf( '-t' ) != layoutId.length -2 ) && 
            ( layoutId.indexOf( 'user/' ) != 0 ) ) {  
            // check authorization for page
          if ( gui.authorize && ! await gui.authorize( userId, layoutId, req ) ) {
            // not visible for this user
          } else if ( layoutId == 'main' && gui.pages['main'].header.logo ) {
            // not displayed, because header link
          } else {
            var nav = {
                'layout' : layoutId,
                'label' : ( gui.pages[ layoutId ].navLabel ? 
                  gui.pages[ layoutId ].navLabel : gui.pages[ layoutId ].title )
              }
            if ( gui.pages[ layoutId ].info ) { nav.info =  gui.pages[ layoutId ].info } 
            navTabs.push( nav )              
          }
        }
      }
    }
    if ( gui.dynamicNavCallback ) { // generate nav on the fly via callback
      try { 
        let newNavTabs = await gui.dynamicNavCallback( 'nav-embed', navTabs, req ) 
        if ( newNavTabs ) { navTabs = newNavTabs }
      } catch( exc ) { log.warn( 'easy-web-app /svc/nav-embed dynamicNavCallback', exc ) }
    }

    res.json( { 'navigations' : navTabs } )
  }
)

/** web service to assemble sub level menu items for embedded navigation bar */
router.get( 
  '/svc/nav-embed-sub', 
  async function( req, res ) {
    var navTabs = []
    var layout =  req.query.page
    var masterPage = layout + '/'
    if ( layout && layout.indexOf( '/' ) > 0 ){
      masterPage = layout.substr( 0, ( layout.indexOf( '/' )+1) )
    } 
    //log.info( 'nav-embed-sub', masterPage )
    for ( var layoutId in gui.pages ) {
        //log.info( 'nav-embed-sub', layoutId +' -> '+layoutId.indexOf( masterPage ) )
        if ( layoutId.indexOf( masterPage ) == 0 ) {
          if ( ( layoutId.indexOf( '-nonav' ) == -1 ||
                 layoutId.indexOf( '-nonav' ) != layoutId.length -6  ) && 
               ( layoutId.indexOf( '-m' ) == -1 ||
                 layoutId.indexOf( '-m' ) != layoutId.length -2 ) && 
               ( layoutId.indexOf( '-t' ) == -1 ||
                 layoutId.indexOf( '-t' ) != layoutId.length -2 ) && 
               ( layoutId.indexOf( 'user/' ) != 0 ) ) {            // check authorization for page
          if ( gui.authorize && ! await gui.authorize( userId, layoutId, req ) ) {
            // not visible for this user
          } else if ( layoutId == 'main' && gui.pages['main'].header.logo ) {
            // not displayed, because header link
          } else {
            var nav = {
                'layout' : layoutId,
                'label' : ( gui.pages[ layoutId ].navLabel ? 
                  gui.pages[ layoutId ].navLabel : gui.pages[ layoutId ].title )
              }
            if ( gui.pages[ layoutId ].info ) { nav.info =  gui.pages[ layoutId ].info } 
            navTabs.push( nav )              
          }
        }
      }
    }
    if ( gui.dynamicNavCallback ) { // generate nav on the fly via callback
      try { 
        let newNavTabs = await gui.dynamicNavCallback( 'nav-embed-sub', navTabs, req ) 
        if ( newNavTabs ) { navTabs = newNavTabs }
      } catch( exc ) { log.warn( 'easy-web-app /svc/nav-embed-sub dynamicNavCallback', exc ) }
    }

    res.json( { 'navigations' : navTabs } )
  }
)

/** web service for multi page navigation bar */
router.get( 
  '/svc/nav', 
  async function( req, res ) {
    try { 
      var navTabs = []
      var subMenus = {}
      var userId = await gui.getUserIdFromReq( req )
      // console.log( 'GET /svc/nav '+gui.pages.length )
      for ( var layoutId in gui.pages ) {
        // console.log( '>>'+layoutId )
        if ( gui.pages.hasOwnProperty ( layoutId ) ) {
          if ( layoutId.indexOf( '/' ) == -1 ) {
            // ignore alternate mobile and tablet layouts
            if ( ( layoutId.indexOf( '-nonav' ) == -1 ||
                  layoutId.indexOf( '-nonav' ) != layoutId.length -6  ) && 
                ( layoutId.indexOf( '-m' ) == -1 ||
                  layoutId.indexOf( '-m' ) != layoutId.length -2 ) && 
                ( layoutId.indexOf( '-t' ) == -1 ||
                  layoutId.indexOf( '-t' ) != layoutId.length -2 ) ) {  
              // check authorization for page
              if ( gui.authorize && ! await gui.authorize( userId,layoutId, req ) ) {
                // not visible for this user
              } else if ( layoutId == 'main' && gui.pages['main'].header.logo ) {
                // not displayed, because header link
              } else {
                var nav = {
                    'layout' : layoutId,
                    'label' : ( gui.pages[ layoutId ].navLabel ? 
                      gui.pages[ layoutId ].navLabel : gui.pages[ layoutId ].title )
                  }
                if ( gui.pages[ layoutId ].info ) { nav.info =  gui.pages[ layoutId ].info } 
                navTabs.push( nav )              
              }
            }
          } else { // sub-menu
            var subMenu = layoutId.substr( 0 , layoutId.indexOf( '/' ) )
            if ( ! gui.pullDownMenu[ subMenu ] && subMenu != 'user' ) { // if this is not a pull down
              if ( ! subMenus[ subMenu ] ) { // first sub menu item creates menu
                // ignore alternate mobile and tablet layouts
                if ( layoutId.indexOf( '-m' ) != layoutId.length -2 && 
                    layoutId.indexOf( '-t' ) != layoutId.length -2 ) {  	  
                  if ( gui.authorize && ! await gui.authorize( userId, layoutId, req ) ) {
                    // not visible for this user
                  } else {
                    subMenus[ subMenu ] = navTabs.length
                    navTabs.push( {
                      label : subMenu,
                      menuItems: []
                    } )
                  }
                }
              }
              if ( ( gui.authorize && ! await gui.authorize( userId,  layoutId, req ) ) ) {
                // not visible for this user
              } else if ( subMenu == 'user' ) {
                //log.verbose( 'nav','hide user in nav tabs' )
              } else {
                var nav = {
                    'layout' : layoutId,
                    'label' : ( gui.pages[ layoutId ].navLabel ? 
                      gui.pages[ layoutId ].navLabel : gui.pages[ layoutId ].title )
                  }
                if ( gui.pages[ layoutId ].info ) { 
                  nav.info =  gui.pages[ layoutId ].info
                  navTabs[ subMenus[ subMenu ] ].info = '!'
                  //log.info('nav', navTabs )
                } 
                navTabs[ subMenus[ subMenu ] ].menuItems.push( nav )
              }
            }
          }
        }
      }

      if ( gui.dynamicNavCallback ) { // generate nav on the fly via callback
        try { 
          let newNavTabs = await gui.dynamicNavCallback( 'nav', navTabs, req ) 
          if ( newNavTabs ) { navTabs = newNavTabs }
        } catch( exc ) { log.warn( 'easy-web-app /svc/nav dynamicNavCallback', exc ) }
      }
  
      // show menu only, if it's more than one page
      if ( navTabs.length == 1 && ! Object.keys( gui.pullDownMenu ).length > 0 )  navTabs = [] 
      res.json( { 'navigations' : navTabs } )
    } catch ( exc ) {
      log.warn( 'easy-web-app /svc/nav', exc )
      res.json( { 'navigations' : [] } )
    }  
  }
);

// ----------------------------------------------------------------------------
// i18n:


/** first call switches on i18n, further calls add supported languages */
gui.addLang = function addLang( langCode, translations ) {
  var trnsl = {}
  if ( translations ) { trnsl = translations } 
  if ( ! this.lang ) {
    this.lang = { }
    this.lang[ langCode ] = trnsl
    this.pages[ 'main' ].header.modules.push( 
        { 
          'id': 'LangSel', 'type': 'i18n'
          ,'param': { 'langList': [ langCode ] } 
        }
      ) 
  } else {
    this.lang[ langCode ] = trnsl
    for (var i = 0; i < this.pages[ 'main' ].header.modules.length; i++) {
      var mod = this.pages[ 'main' ].header.modules[i]
      if ( mod.id == 'LangSel' ) {     
        mod.param.langList.push( langCode )
      }
    }
  }
}

gui.addTranslation = function addTranslation( langCode, label, translation ) {
  if ( gui.lang && gui.lang[ langCode ] ) {
    gui.lang[ langCode ][label] = translation
  }
}

router.get(
    '/i18n/:lang',
    async function( req, res ) {
      if ( req.params.lang  ) {
        var langCode = req.params.lang.substring( 0, 2 )
        if ( gui.getTranslation ) {
          var translation = await  gui.getTranslation( req, langCode )
          res.json( translation )
        } else if ( gui.lang && gui.lang[ langCode ] ) {
          res.json( gui.lang[ langCode ] )
        } else {
          res.json( {} ) // don't offer any translations
        }
      } else {
        res.json( {} ) // don't offer any translations
      }
    }
  )


// ----------------------------------------------------------------------------

/** High level API to add a IO view */
gui.addIoView = function addIoView( page ) {
  if ( !this.io ) {  // first initialization
    this.io = [];

    /** REST web service to GET IO data */
    router.get ( 
        '/svc/io/:ioId', 
        function ( req, res ) {
          // console.log( 'ping: ' + req.params.ioId );
          res.json( gui.io[ req.params.ioId ] );
        } 
    );

    router.post( 
      '/svc/io/:ioId', 
      jsonParser, 
      function ( req, res ) {
        // console.log( JSON.stringify( req.body ) );
        if ( req.body && req.body.id && req.params.ioId ) {
          var ioID = req.params.ioId;
          var ctlID = req.body.id;
          if ( gui.io[ ioID ][ ctlID ] ) {
            if ( req.body.value ) {
              gui.io[ ioID ][ ctlID ].value = req.body.value;
            }
            if ( gui.io[ ioID ][ ctlID ].callBack ) {
              gui.io[ ioID ][ ctlID ].callBack ( req.body.value , ctlID )
            } else {
              log.warn( 'POST /svc/io', 'CallBack undefined: "' + ctlID + '"' )
            }
          } else {
            log.warn( 'POST /svc/io', 'Not defined: gui.io[ '+ioID+' ][ '+ctlID+' ]' ) 
          } 
        } else {
          log.warn( 'POST /svc/io', 'Not valid: req.body && req.body.id && req.params.ioId' )
        }
        res.statusCode = 200;
        return res.json( gui.io[ req.params.ioId ] );
      } 
    );
  }
  var ioId = this.io.length;
  this.io.push( {} );
  
  // define IO Object
  var io = gui.addView( {
      'id' : 'io' + ioId,
      'type' : 'pong-io'
    }, 
    {
      'imgURL' : 'img.png',
      'dataURL' : ( gui.appRoot=='/' ? '' : gui.appRoot ) + '/svc/io/' + ioId,
      'poll' : '10000',
      'io' : []
    }, 
    page 
  )
  io.ioId = ioId;

  // IO method to define update polling
  io.setUpdateMilliSec = function (ms ) {
      this.moduleConfig.poll = ms;
  }

  // IO method to define update polling
  io.setBackgroundImage = function ( imgFullPath ) {
      if ( imgFullPath ) {
        var bgImgName = ( gui.appRoot=='/' ? '' : gui.appRoot ) + '/local' 
          + imgFullPath.substring( imgFullPath.lastIndexOf( '/' ) );
        var bgImgPath = imgFullPath.substring( 0, imgFullPath.lastIndexOf( '/' ) );
        // log.info( 'static /local', bgImgPath +' '+ bgImgName);
        this.moduleConfig.imgURL = bgImgName;
        router.use ( '/local', express.static( bgImgPath ) );
      } else {
        this.moduleConfig.imgURL = null
      }
  }

  io.addLED = function ( id, x, y, value ) {
    if ( id && (x >= 0) && (y >= 0) ) {
      this.moduleConfig.io.push ( 
        {
          id : id,
          type : "LED",
          pos : { "x" : x, "y" : y }
        } 
      )
      gui.io[ this.ioId ][ id ] = {
        value : (value || 0)
      }

    } else {
      log.warn( 'addLED', 'need proper "ID", "x" and "y" values!' );
    }
  }

  io.setLED = function( id, value ) {
    if ( id && gui.io[ this.ioId ][ id ] ) {
      if ( [ -1, 0, 1 ].indexOf ( value ) >= 0 ) {
        gui.io[ this.ioId ][ id ].value = value;
        // console.log( value );
      } else {
        log.warn( 'setLED', 'value "' + value + '" ignored' );
      }
    } else {
      log.warn( 'setLED',':id "' + io + '" unknown' );
    }
  }

  io.addSwitch = function( id, x, y, values, callBack ) {
    if ( values && values.length > 0 ) {
      this.moduleConfig.io.push ( {
        id : id,
        type : "Switch",
        pos : {
          x : x,
          y : y
        },
        values : values
      } );
      gui.io[ this.ioId ][ id ] = {
        value : values[ 0 ],
        callBack : callBack
      };
    } else {
      log.warn( 'addSwitch: ', 'Ignored, values should be an array!' );
    }
  }
  
  io.addStaticLabel = function( text, x, y ) {
    var label = null
    if ( text && x && y ) {
      label = { id:'label'+(lId++), type:'Label', label:text, pos: { x:''+x, y:''+y } }
      this.moduleConfig.io.push( label )
    } 
    return label
  }
  
  // add general config obj
  io.addIoElementConfig = function( config, callback ) {
    if ( config ) { 
      this.moduleConfig.io.push ( config ) 
      if ( callback && config.id ) {
        gui.io[ this.ioId ][ config.id ] = {
          value : null,
          callBack : callback
        }
      }
    }
  }
  
  return io
}
var lId = 0

// ----------------------------------------------------------------------------
// security

/** add pong-security plug in to header */
gui.enableSecurity = function enableBasicAuth( paramObj ) {
  if ( gui.sec2Params ) { delete gui.sec2Params }
  gui.secParams = {}
  if ( ! gui.loginTimeout ) { gui.loginTimeout = 6400000 }
  var root = ( this.appRoot== '/' ? '' : this.appRoot ) 
  if ( ! paramObj ) {paramObj = {} }
  gui.secParams.divLayout = ( paramObj.divLayout ? true : false )
  gui.secParams.loginURL = ( paramObj.loginURL ? paramObj.loginURL : root+'/login' )
  if ( paramObj.resetPasswordURL ) gui.secParams.resetPasswordURL = paramObj.resetPasswordURL
  gui.secParams.loginPage = ( paramObj.loginPage ? paramObj.loginPage : 'main' )
  if ( paramObj.registgerURL ) gui.secParams.registgerURL = paramObj.registgerURL
  gui.secParams.logoutPage = ( paramObj.logoutPage ? paramObj.logoutPage : 'main' )
  gui.secParams.logoutURL = ( paramObj.logoutURL ? paramObj.logoutURL : root+'/logout' )
  gui.secParams.sessionExpiredAlert = ( paramObj.sessionExpiredAlert ? paramObj.sessionExpiredAlert : false )
  gui.secParams.changePasswordStrength = 4
  this.pages[ 'main' ].header.modules.push(
    { 'id': 'Sec', 'type': 'pong-security', 'param': gui.secParams }
  )

  // basic login impl calls authenticate
  router.post( '/login', formParser, async function(req, res) {
    try{ 
      // log.info( "POST Login ..." )
      if ( gui.authenticate != null ) {
        if ( req.body && req.body.userid ) {
          // log.info( "calling authenticate ..." )
          gui.authenticate( 
            req.body.userid, 
            req.body.password, 
            async function ( err, loginOK, mustChangePassword ) {
              if ( !err && loginOK ) {
                // log.info( "Login OK" )
                res.statusCode = 200
                // todo set up "session" for user via hook
                var token = ''
                if ( gui.createToken ) { 
                  token = await gui.createToken( req.body.userid ) 
                } else {
                  token = gui.mkToken( 32 ) 
                }
                // log.info( "Token: "+token )
                gui.userTokens[ token ] = { 
                  userId : req.body.userid, 
                  expires: new Date( Date.now() + gui.loginTimeout ),
                  csrfToken: gui.mkToken( 20 ) 
                } 
                res.cookie( 'pong-security', 
                    token, 
                    { //expires: new Date(Date.now() + 6400000), 
                      httpOnly: true, path: gui.appRoot }
                )
                // console.log( 'this.appRoot='+gui.appRoot )
                
                if ( gui.changePassword ) {
                  gui.secParams.changePasswordURL = 
                    ( gui.appRoot=='/' ? '/password' : gui.appRoot+'/password' )
                }
                var changePassword = false
                if ( mustChangePassword ) { changePassword = true }
                res.json( { loginResult: "Login OK", changePassword: changePassword } ) 
              } else {
                // log.info( "Login failed!" )
                res.status( 401 ).send(  "Login failed" )
              }              
            }
          )
          
          
        } else {
          var reqUser = await gui.getUserNameFromReq( req ) // just to display in GUI
          if ( reqUser ) {
            res.status( 200 ).send( reqUser )
            return
          } else {
            // log.info( "user/password or cookie required" )
            res.status( 401 ).send( "Login failed" )  
            return        
          }
        }
      } else {
        // log.info( "Please implement authenticate function:" )
        // log.info( " gui.authenticate = function authenticate(user,
        // password)"+
        // " { ... return true/false }")
        res.status( 401 ).send( "Login failed" )
      }
    } catch ( exc ) {
      log.warn( 'easy-web-app /login', exc )
      res.status( 500 ).send( "Login failed" )
    }
  })

  // Change Password ReST Service
  router.post( '/password', formParser, async function(req, res) {
    // log.info( "POST Login ..." )
    var userId = await gui.getUserIdFromReq( req )
    if ( userId ) {
      if ( gui.changePassword != null ) {
        if ( req.body && req.body.oldPassword && req.body.newPassword ) {
          var oldPwd = req.body.oldPassword
          var newPwd = req.body.newPassword
          gui.changePassword( userId, oldPwd, newPwd,
            function( err, result ) {
                //log.info( "callback", "err:"+err+" result:"+result )
                if ( result ) {
                  res.status( 200 ).send( "Password changed!" )                 
                } else {
                  res.status( 400 ).send( "Failed to change password!" )              
                }
            }
          )
        } else {
          res.status( 400 ).send( "Invalid request!" )                              
        }
        // TODO
      } else {
        res.status( 405 ).send( "Failed to change password!" )                  
      }
    } else {
      res.status( 401 ).send( "Login invalid!" )                                    
    }
  })

  // logout ReST service
  router.post( '/logout', formParser,  function(req, res) {
    // log.info( "POST Logout ..." )
    // log.info( 'Cookies: ', req.cookies )
    if ( req.cookies && req.cookies[ 'pong-security' ] ) {
      // log.info( "pong-security cookie ..." )

      var token = req.cookies[ 'pong-security' ]
      // log.info( "token = "+token )
      // log.info( "user = " + gui.userTokens[ token ] )
      if ( gui.deleteUserIdForToken ) {
        gui.deleteUserIdForToken( token )
      } else if ( gui.userTokens[ token ] ) {
        delete gui.userTokens[ token ]
      }
    }
    if ( req.session ) {
      req.session.destroy() 
    }
    res.clearCookie( 'pong-security', { path: gui.appRoot } )
      .status( 200 ).send( "" )
  })

  log.info( "Security is enabled!" )
}

gui.checkUserCSRFtoken = function checkUserCSRFtoken( req ) {
 if ( req.cookies && req.cookies[ 'pong-security' ] ) {
    var token = req.cookies[ 'pong-security' ]
    if ( gui.userTokens[ token ] && gui.userTokens[ token ].csrfToken ) {
      var headerToken = req.get('X-Protect') 
      var userToken = gui.userTokens[ token ].csrfToken
      if ( userToken != headerToken ) {
        return false
      }
    }
  } 
  return true
}

webservices.use( // inject CSRF token
  async function( req, res, next ) {
    try { 
      var csrfToken = 'default'
      if ( req.cookies && req.cookies[ 'pong-security' ] ) {
        var token = req.cookies[ 'pong-security' ]
        if ( gui.getCsrfTokenForUser ) {
          csrfToken = await gui.getCsrfTokenForUser( token )
        } else if ( gui.userTokens[ token ] && gui.userTokens[ token ].csrfToken ) {
          csrfToken = gui.userTokens[ token ].csrfToken
        }
      }
    } catch ( exc ) { log.warn('easy-web-app CSRF token, exc') }
    res.header( 'X-Protect', csrfToken );
    next();
  } 
)

gui.mkToken = function mkToken( len ) {
  var chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var token =''
  for ( var i = 0; i < len; i++ ) {
    var iRnd = Math.floor( Math.random() * chrs.length )
    token += chrs.substring( iRnd, iRnd+1 )
  }
  return token
}

/** returns null, if not logged in */
gui.getUserIdFromReq = async function getUserIdFromReq( req ) {
  // console.log( req.headers );
  var userId = null
  // for ( let c in  req.cookies ) {
  //   log.info( 'Cookie: '+ c )
  //   log.info( req.cookies[c] )
  // }
  try {
    if ( ! req.cookies ) { return null }
    if ( req.cookies[ 'pongSec2IdTkn' ] ) { 
      // log.info( "UserIdFromReq: pongSec2JWT cookie ..." )
      var tokenStr = req.cookies[ 'pongSec2IdTkn' ]
      var token = jwt.decode( tokenStr, { complete: true }) || {}
      if ( token.payload  &&  token.payload.name  &&  token.payload.name !== '' ) {
        userId = token.payload.name
      } else if ( token.payload  &&  token.payload.email ) {
        userId = token.payload.email
      }
    } else if ( req.cookies[ 'pong-security' ] ) {
      // log.info( "UserIdFromReq: pong-security cookie ..." )

      var token = req.cookies[ 'pong-security' ]
      // log.info( "UserIdFromReq: token = "+token )
      if ( token ) {
        if ( gui.getUserIdForToken ) {
          // log.info( "UserIdFromReq..." )
          userId = await gui.getUserIdForToken( token )
        } else if ( gui.userTokens[ token ] ) {
          log.verbose( "UserIdFromReq: userId = "+gui.userTokens[ token ].userId )
          if ( Date.now() < gui.userTokens[ token ].expires ) {
            userId = gui.userTokens[ token ].userId
          } else {
            log.verbose( "UserIdFromReq: userId = "+gui.userTokens[ token ].userId+"  >>>> session expired" )
          }
        }
      }
    } else if ( req.headers && req.headers.authorization ) {
      // log.info( "UserIdFromReq: authorization header ..." )
      // try to parse JWT token
      var parts = req.headers.authorization.split( ' ' )
      if ( parts.length == 2  &&  parts[0] == 'Bearer' ) {
        var tokenStr = parts[1]
        var token = jwt.decode( tokenStr, { complete: true }) || {}
        if ( token.payload  &&  token.payload.name ) {
          userId = token.payload.name
        }
      } 
    }
  } catch ( exc ) {
    log.error( 'easy-web-app getUserIdFromReq', exc )
    userId = null
  }
  return userId
}

gui.getUserNameFromReq = async function getUserNameFromReq( req ) {
  var userName = null
  try {
    if ( req.cookies && req.cookies[ 'pong-security' ] ) {
      var token = req.cookies[ 'pong-security' ]
      if ( token ) {
        if ( gui.getUserNameForToken ) {
          userName = await gui.getUserNameForToken( token )
        } else {
          userName = gui.getUserIdFromReq( req )
        }
      }
    }
  } catch ( exc ) {
    log.error( 'easy-web-app getUserIdFromReq', exc )
    userName = null
  }
  return userName
}

/** please use  getUserIdFromReq instead */
gui.getUserId = function getUserId( req ) {
  WARNING_DEPRECATED_UserId_FUNCTION() 
  return gui.getLoggedInUserId( req )
}
gui.getLoggedInUserId = function getLoggedInUserId( req ) {
  WARNING_DEPRECATED_UserId_FUNCTION() 
	var uid = null 
	if ( req.cookies && req.cookies[ 'pong-security' ] ) {
		var token = req.cookies[ 'pong-security' ]
    if ( gui.userTokens[ token ] ) {
      if ( Date.now() < gui.userTokens[ token ].expires ) {
			  uid = gui.userTokens[ token ].userId
      }
		}
	}
	return uid
}
var showUserIdReprecated = true
function WARNING_DEPRECATED_UserId_FUNCTION() {
  if ( showUserIdReprecated ) {
    showUserIdReprecated = false
    log.warn( 'DEPRECATED: gui.getUserId(req)', 'Use "await getUserIdFromReq()" instead' )
  }
}

// ============================================================================
// sec2 - OpenID Connect 

gui.enableSec2 = function enableSec2( paramObj ) {
  if ( gui.secParams ) { delete gui.secParams }
  gui.sec2Params = paramObj
  this.pages[ 'main' ].header.modules.push(
    { 'id': 'Sec2', 'type': 'pong-security2', 'param': gui.sec2Params }
  ) 
  log.info( "Security v2 is enabled!" )
}