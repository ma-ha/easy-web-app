/** Simple example: Create a web page with form */

var gui = require ( '../../' )
// stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 'Menu Demo' )
mainPage.title = 'Page ABC' // replace default = "main"
mainPage.addView ( { id : 'PageAbc' }, null )

/** Add a 2nd page. */
var page2 = gui.addPage( 'secondpage', 'Page XYZ',  { id:'PageXyz' }, null )
page2.addInfo( 'New' )
//we may want different page title and menu label
page2.navLabel = 'New Page'
page2.title    = 'Menu Demo: New Page'

/** Add a 3rd page. */
// The page name is an URL and you can define a sub-menu like  
// this "myMenu" as name. If you need a non URL conform name 
// (e.g. "My Menu" with spaces etc.) you can use the i18n 
// feature to map technical labels in any language. 
var page3 = gui.addPage( 'myMenu/foo', 'Sub Page 1', { id:'Page1' } )

/** Add a 4th page. */
var page4 = gui.addPage( 'myMenu/bar', 'Sub Page 2',{ id:'Page2' }, null )
page4.addInfo( '42' )

/** Add a user settingse page. */
gui.addPage( 'user/settings', 'User Settings', { id:'UserSettings' }, null )
// this page is hidden from the normal navigation menu
// the page appears after login in the user pull-down menu