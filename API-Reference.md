# API Reference
The API makes things simpler, but you can still work with plain JSON specifications 
to render a page -- as done behind the scenes.

Notation: 
* [  ] means optional
* `abc` is a class or field name
* "xyz" is a value
* `<abc>` is a placeholder for value
* (object), (String), (Array) are JavaScript tpyes

## Web Services
Some REST/JSON web services are provided:
* `GET /svc/layout/<id>/structure`
* `GET /svc/layout/<id>/<subid>/structure`
* `GET /svc/nav`
* `GET /i18n/<lang>`

Additional services, if you enable basic auth security 
using `gui.enableSecurity( ... )`: 
* `POST /login`
* `POST /password`
* `POST /logout`

If you enable OpenID Connect `gui.enableSec2( ... )` these 
service endpoints are not available, since the identity provider
must be used.

## "GUI" API
### gui.init ( \[portalName\] \[,port\] \[,rootPath\ \[,options\]])
Returns the main `page` object and starts a minimal REST/JSON
web service eco system for the portal.

Example code:

```javascript
var gui = require ( 'easy-web-app' )
var mainPage = gui.init ( )
...
```

The `portalName` appears on every page as `logoText`.
You are able to change that, or alternatively define an `logoURL` for an image. 

The `port` defines the TCP port for the Web Services. Default `port` is "8888".

`rootPath` is the location in the URL, e.g. `init( 'XY', 8080, '/myportal' )` 
will start result in the base URL `http://localhost:8080/myportal` 
(see [custom-css example](https://github.com/ma-ha/easy-web-app/blob/master/examples/custom-css/index.js)))

By default the page will show a "click hijacking" security warning, 
if it's embedded in an iframe.
Set `mainPage.header.frameWarning = "false"` if embedding is OK.

Supportet options:
* `nav: 'embedded'`: Display a menu (pong-nav-embed) in the page and not in the header


### gui.addPage ( pageId \[, title\] \[, viewDef\] \[, viewConfig\] )
Returns the new `page` object.

Header and footer will be included from the "main" `page`, 
but of course you can change this in the `page`.

Example code:

```javascript
...
gui.addPage( '2ndPage', '2nd Page' ) // will be empty
gui.addPage( 'XYZ/PageA', '3rd Page', { id:'a1', type:'pong-table', height:'500px' } ) 
gui.addPage( 'XYZ/PageB', '3rd Page', { id:'b1', type:'pong-table', height:'500px' } ) 
...
```


Remark: All pages are stored in the `gui.pages[]` array. 
By `gui.addPage(...)` also a navigation menu for page navigation 
will provided automatically. In the example "PageA" and "PageB" 
are in a "XYZ" navigation menu tab as a pull down submenu. 

Special page names:
* If you want to exclude a page from the navigation, the pageId should end with `-nonav` 
* Mobile phone optimized page: You can add a page with the same name, 
  but append `-m`. 
  This page does not show in the navigation menu and it will autmatically be 
  loaded on a smart phone, instead of the normal page.
* Tablet optimized pages: Same as mobile, but append `-t` to the page name instead.
* After authentication the user may have access to his personal settings.
  Any page starting with `user/` will appear in the users drop down, where also 
  logout and change password is available. 
  These pages are hidden in the normal navigation menu.


### gui.addPullDownMenu ( menuId, menuLabel ) 
Add a pull down menu. Pages can be assigned to this menu by labeling them
`menuID/mageId`.

### gui.addPullDownMenuHtmlItem( menuId, htmlString ) 
Add a line to the pull down menu with static HTML.


### gui.addView ( viewDef \[, moduleConfig\] \[, page\] ) 
Returns `view` object (part of the `page` object structure).

By default the view's properties are set to:

```
  'title'       = 'View:',
  'decor'       = 'decor',
  'height'      = '400px',
  'resourceURL' = 'none'
``` 
By default it will add a `view` in a new row to the "main" page.

The `viewDef` must at least define an `id` and should define `type` (check out the
[available view types](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules#modulesviews)).

The `moduleConfig` holds the specific parameters for the `viewDef.type` plug-in.  

The `moduleConfig` can be `null`, if there is a `viewDef.resourceURL` given.
You are responsible to implement the REST/JSON web service for the `moduleConfig`.
The view "type" is appended to "ressourceURL (`<resourceURL>/<type>`), so if you 
have a resource like http://my.server/products/ you can define different views 
for that, e.g.  
* GET http://my.server/products/pong-form/
* GET http://my.server/products/pong-table/
* GET http://my.server/products/pong-help/

Example code:
```javascript
...
gui.addView( { id:'X' } ) // ads another empty view to the main page
...
```
### gui.addLang ( languageId [, translations] )
Adds a supported language. 

Translations can be added as an object with `label:translations`, e.g.

```javascript
// default language uses normal lables
gui.addLang( 'EN' ) 
// this language uses translations
gui.addLang( 'DE',
    { 
      'Title':'Title'
      ,'Language':'Sprache'
      ,'Main Page':'Hauptseite'
      , ...
    } 
  )
```

You may call `gui.addTranslation(...)` to add translations for labels one by one.

### gui.addTranslation ( languageId, label, translation )
Adds a translation for a single label to a supported language.
```javascript
gui.addLang( 'DE' ) 
gui.addTranslation( 'DE', 'Language', 'Sprache' ) 
gui.addTranslation( 'DE', 'Main Page', 'Hauptseite' )
``` 

### gui.enableSecurity( paramsObj )
Add [pong-security module](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-security) to the header. 

`paramsObj` can be empty, but you can specify:
* `loginURL`: request login web service URL to POST the userid and password, default is `/login`
* `loginPage`: page id to show after a successful login, default is `main` 
* `needLoginPage`: page id shown if unauthenticted user tries to request a protectd page, default is "main"  
* `logoutURL`: request logout web service URL (POST), default is `/logout` 
* `logoutPage`: page id to show after a successful logout, default is `main`
* `registerURL`: if you need a link to a registration page id, default is `null` 

IMPORTANT: You need to implement 
* `gui.authenticate = function( user, password, callback ){ ... callback( err, true/false [, true/false] ) }` and 
* `gui.authorize = function( user, page req ){ ... return true/false}` function,
   see [security example](https://github.com/ma-ha/easy-web-app/blob/master/examples/security/index.js). 

The `gui.authorize` function can also return a Promise, e.g.:

```javascript
gui.authorize = ( user, page, req ) => {
  return new Promise( ( resolve, reject ) => {
    ...
  })
}
```

The `authenticate callback` has two or three parameters:
* `err`: should be null if authentication is OK
* `authenticationOK`: `true` or `false`
* (optional) `mustChangePassword`: `true` or `false`

Optional you can implement a change password hook. 

```javascript
gui.changePassword =  
  function changePassword( user, oldPasswprd, newPassword, callback ) {
     ...
     callback( err, changedStatus )
  }
```
`changedStatus` should be _true_ if password was changed successfully.

If the hook is defined, the Web UI will generate a link and a modal form for you.

Remark:  In multi node set up, you need to sync login sessions.
To do this, you need to implement the async functions `createToken`,
`getUserIdForToken` and `deleteUserIdForToken`:
* `gui.createToken = async function createToken( userId ){ ... return token }` 
* `gui.getUserIdForToken = async function getUserIdForToken( token ){ ... return userId }`
* `gui.deleteUserIdForToken = async function deleteUserIdForToken(token) { ... }`
Typically you use a Redis cache, to store `token: userid`.

Login session timeout is set to 6400000 ms, 
you can change the value `gui.loginTimeout` to your requirements.

IMPORTANT: You can not use `gui.enableSec2( ... )`
and `gui.enableSecurity( ... )` in the same app.


### gui.enableSec2( paramsObj )
Add [pong-security2 module](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-security2) to the header. 
This implements OAuth 2.0 and OpenID Connect security. 

Please find docu of paramsObj in link above or in the [Auth0 example](https://github.com/ma-ha/easy-web-app/blob/master/examples/openid/)


You need to implement the GUI authorization function
```javascript
gui.authorize = ( user, page, req ) => {
  return new Promise( ( resolve, reject ) => {
    ...
    resolve( true|false )
  })
}
```

IMPORTANT: You can not use `gui.enableSec2( ... )`
and `gui.enableSecurity( ... )` in the same app.


### gui.checkUserCSRFtoken( req )
Returns `true` if the CSRF token in the HTML header is valid.
A `false` return value may indicate a CSRF attack or a reuse of an outdated session. 

It is recommended to check the CSRF token in all REST web service implementations.

See [security example](https://github.com/ma-ha/easy-web-app/blob/master/examples/security/index.js). 

### gui.dynamicHeader( callback ) / gui.dynamicFooter( callback ) /gui.dynamicTitle( callback )
The callbacks can manipulate or
replace the title, header or footer layout configuration per request.

Callback function should e.g. be:
```javascript
( originalStructure, req, pageName ) => {
  return new Promise( ( resolve, reject ) => {
    //...
    resolve( manipulatedStructure )
  })
}
```

The `title` must be a simple string. 
The `header` and `footer` are complex objects.

See also:
* [example code](https://github.com/ma-ha/easy-web-app/tree/master/examples/dynamic-on-request/index.js).
* [Structure format documentation](https://github.com/ma-ha/rest-web-ui/tree/master/html/js)


### gui.dynamicNav( callback )
The callback can manipulate or
replace the navigation menu item array by new layout configuration per request.

Callback function should be:
```javascript
( navType, navTabs, req, pageName ) => {
  return new Promise( ( resolve, reject ) => {
    //...
    resolve( newRowsArray )
  })
}
```
Parameters are:
* `navType` is one of 
  * `'nav'` = main menu,
  * `'nav-embed'` = embedded menu,
  * `'nav-embed-sub'` = sub-menu of embedded menu,
* `navTabs` generated menu, you can change and return this or build a new array
* `req` the GET request object

Return must be an array of navigation objects, e.g.
```json
[
  { layout: 'main', label: 'Main Page' },
  { layout: 'pagename', label: 'Menu Label' }
]
```

[Example code](https://github.com/ma-ha/easy-web-app/tree/master/examples/dynamic-on-request/index.js).

### gui.getExpress()
Returns the "express" router web service plug-in, 
so that you can implement 
web services, e.g. for forms commits or loading i18n translations
(ref. examples with \*). 

If you need express and not the router, you can access it via `gui.express`.

### gui.getLoggedInUserId( req ) 
DEPRECATED, use `async getUserIdFromReq( req )`

### async gui.getUserIdFromReq( req )
Returns users ID, if authenticated or _null_ if not authenticated.

Example usage in ReST service code:

```javascript
var svc  = gui.getExpress()
svc.get( 
  '/products', 
  async ( req, res ) => {
    try { // required to avoid silent errors
      if ( await gui.getLoggedInUserId( req ) ) { 
        // user login: OK
        ...
        res.status( 200 ).json( products )  		
      } else {
        res.status( 401 ).send( "You must login first!!"  )  		  		
      }
    } catch ( exc ) { res.status( 500 ).send( 'Oups' )  } 
  }
)
```

## gui.getTranslations

You can define this function to serve translations on the fly:

```javascript
// ...your code ...
gui.getTranslation = async ( req, lang ) => {
  let translations = {
    // 'label1': 'label1 translation',
    // 'label2': 'label2 translation' 
  }
  // e.g. load translation tale from DB
  return translations
}
```


## "Page" API Reference
Page object reference: 
[structure specification of rest-web-ui](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification)

For page the following structure will be set up:
* `title` (String)
* `header` (object)
  * `logoText` (String)
  * `modules` (Array)
    * "nav-bar" object 
* `rows` (empty Array, use `page.addView(...)` or 
  `page.addColumnsRow(...)` to add elements	)
* `footer`
  * `copyrightText` (String) 
  * `modules` (empty Array)

Optional you can add:
* `navLabel` (String) seaparate page title and menu label

### addFooterLink (  linkText, linkURL, \[, linkTarget\] )
Main page only!

Initializes the footer link list and adds the link. 
The linkTarget is optional, typically you define it to be `_blank`

### page.addSubNav ( )
Adds a new `row` with a 2nd level menu. 
Pages with a '/' are dsiplayed. if the root is the active page.

See [embedded nav example](https://github.com/ma-ha/easy-web-app/tree/master/examples/nav-embed).

### addTabContainer ( def )

`def` usually only requires an `id` and `width` or `height`

Returns: TabContainer

### page.addView ( def \[, config\] )
Adds a new `row` with a new `view` and returns the `view`, ref. `gui.addView`.

IMPORTANT (v10 and higher): 
The view def id must be a string w/o spaces. also numbers are not allowed.

Example code:

```javascript
...
var gui = require ( 'easy-web-app' )
var mainPage = gui.init ( )
mainPage.addView( 
	{ id:'p42', type:'pong-mediawiki', resourceURL:'http://${lang}.wikipedia.org/w/' },
	{ page: { EN: "Main_Page",
	          DE: "Wikipedia:Hauptseite",
	          IT: "Pagina_principale" },
	  wikiRef: "/wiki/" }
	)
...
```

### page.addIoView ( def \[, config\] )
Returns IoView, ref. [I/O example](https://github.com/ma-ha/easy-web-app/tree/master/examples/io).

The `addIoView(...)` calls `addView` and the returns object is based on the view config object.

### page.addInfo ( text )
Add info (e.g. available updates) to menu tab.


### page.dynamicRow( callback )
The callback is called per request an can manipulate or
replace the `staticRows` array by new layout configuration.

Callback function should be:
```javascript
( staticRows, request, pageName ) => {
  return new Promise( ( resolve, reject ) => {
    //...
    resolve( newRowsArray )
  })
}
```

See also:
* [example code](https://github.com/ma-ha/easy-web-app/tree/master/examples/dynamic-on-request/index.js).
* [Structure format documentation](https://github.com/ma-ha/rest-web-ui/tree/master/html/js)


### page.delInfo ( text )
Removes the info from the menu tab.

### page.setCopyright( text )
Main page only!

Sets the copyright text in the footer.

### page.setLogo( logoText \[, imgURL\]  )
Main page only!

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)

Remark: THe logo img and text will link to main page. 
By that, the main page is hidden in the menu tabs. 

### page.setLogoText ( text ) 
Main page only!

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)

### page.setLogoURL ( url ) 
Main page only!

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)

### page.setPageWidth ( width )
Override CSS and set to `width` value: `px` or `%` are welcome.

See [customize example](https://github.com/ma-ha/easy-web-app/tree/master/examples/custom-css)


## View API reference
By default the view has
* `title` (String) 
  * set to `def.title` or `def.id` or "View: "
* `decor` (String)
  * set to `def.decor` or "decor"
* `resourceURL` (String)
  * set to `def.resourceURL` or "none" (TODO: check if it must be unset)
* \[`type`\] (String)
* \[`moduleConfig`\] (Object)
  * set to `config`, if that method parameter is defined
* \[`actions`\] (Array)
  * set to `def.actions`, if that attribute is defined

Details ref. [structure specification of rest-web-ui](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification)

Example code:

```javascript
...
var myView = mainPage.addView( ... )
// create empty actions array, if not already there:
if ( ! myView.actions ) myView.actions = []
// add help button for view:
myView.actions.push( { type:"pong-help" } ) 
...
```

### addColumnsRow ( id, width )
Adds and returns a `row` object with `cols` array in it.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

## "Rows" API
Used inside a `page`.

### row.addView ( def \[, config\] )
Appends a row with new view and returns the view, see `gui.addView(...)`.

In `def` you can just define an `id`. It is automatically converted into `columnId`. 

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

### row.addColumnsRow ( id, height )
Adds and returns a `row` object with `cols` array in it.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

## "Columns" API
Used inside a `page`.

### column.addView ( def \[, config\] )
Appends a column with new view and returns the view, see `gui.addView(...)`.

In `def` you can just define an `id`. It is automatically converted into `rowId`. 

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

### column.addRowsColumn ( id, width )
Adds and return `rows` object.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

## TabContainer API

### tabs.addView ( config )

Adds a tab with the `config.title` 
and a view for this tab as defined in the config.

Example code, see ["complex-layout" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/complex-layout)

### tabs.addRows ( id, title )  -- TODO

Adds a tab with the `title` and returns a `row` (see "Rows API" above). 
By this you can add more than one view per tab.


# Config-Reference

The [config npm package](https://www.npmjs.com/package/config)
is great for staging and CI/CD automation. It helps you also to make the code short and simple.

Supported config elemtents
* `easy-web-app.port`: port number
* `easy-web-app.rootPath: example`: URL path string, w/o leading `/`
* `easy-web-app.enableSecurity`: false / true
* `easy-web-app.enableCustomCSS`: false / true (requires ./css/custom.css file)
* `easy-web-app.loginTimeout`: number, milli seconds
* `easy-web-app.img-cust`: relative dir name , w/o leading `/`
* `easy-web-app.logoURL`: realtiv file, should start with `img-cust/`
* `easy-web-app.logoText`: string
* `easy-web-app.title`: string
* `easy-web-app.copyrightText`: string

Example `config/default.yml`:
```yaml
staging: TEST
loglevel: info
easy-web-app:
  port: 8900
  rootPath: example
  enableSecurity: false
```

By using `config` you only need these stripped down code to run your GUI:

```javascript    
var gui    = require( 'easy-web-app' ) 
var config = require( 'config' )
var main = gui.init() 
main.addView( { 'id':'View01', 'title':'Empty View' } )
```
