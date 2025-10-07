/** Simple example: Create a web page with form */

var gui = require ( '../../' )
// stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 
  'Burger Menu Demo', null, null, 
  { burgerMenu: [ 'desktop','tablet','mobile' ]} 
)
mainPage.title = 'Page ABCr' // replace default = "main"
mainPage.addView ( { id : 'PageAbc' }, null )
mainPage.navId = "Main"

gui.navSubMenu = ['onMouseEnter']


/** Add a 2nd page. */
var page2 = gui.addPage( 'secondpage', 'Page XYZ',  { id:'PageXyz' }, null )
page2.addInfo( 'New' )
//we may want different page title and menu label
page2.navLabel = 'New Page'
page2.navId = 'NewPage'
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
page4.navId = '42'

var subMenuageWithHtmlNav = gui.addPage( 'myMenu/foo2', 'Sub Page 1', { id:'Page3' } )
subMenuageWithHtmlNav.navHTML = '<b>Test:</b> <i>HTML</i> injected for <a href="index.html?layout=myMenu/foo2">page 3</a>'

/** Add a user settingse page. */
gui.addPage( 'user/settings', 'User Settings', { id:'UserSettings' }, null )
// this page is hidden from the normal navigation menu
// the page appears after login in the user pull-down menu

var pageWithHtmlNav = gui.addPage( 'other-page', 'Other Page', { id:'Page4' } )
pageWithHtmlNav.navHTML = '<a href="index.html?layout=other-page">Other...</a>'
