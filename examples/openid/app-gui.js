const express  = require( 'express' )
const cfg      = require( 'config' )
const log      = require( 'npmlog' )

exports: module.exports = { 
  setupGUI : setupGUI,
  setupSec : setupSec 
}

// ----------------------------------------------------------------------------
function setupGUI( gui ) {
  // define a main page
  let mainPage = gui.init( 'Security 2 Demo', 8111, 'security2demo' )
  mainPage.title = 'Home'
  mainPage.header.logoText = 'Security 2 Demo'

  mainPage.addView( { 'id':'row1view', 'title':'Login with user id "test1" or "test2"', 'height':'300px' } )

  // let's create a hidden page -- only available for logged in users
  let secretPage = gui.addPage( 'secretPage', 'Private&nbsp;Page',  
    { id:'DataTable', type:'pong-easytable', resourceURL:'/security2demo/products' },
    { dataURL:'', "pollDataSec":"60", easyCols: [ 'Name', 'Rating' ] }
  )
  

  // now add the pull down menu:
  gui.addPullDownMenu( 'testMenu', 'Menu' )
  // add static HTML dummy content to menu:
  gui.addPullDownMenuHtmlItem( 'testMenu', 'Test 1' )
  gui.addPullDownMenuHtmlItem( 'testMenu', 'Test 2' )

  // by defining this as subpage of "user", the link will appear in the user security menu
  gui.addPage( 'user/profile', 'User Profile',  { id:'UserProfile' }, null )
  gui.addPage( 'user/settings', 'Preferences',  { id:'Preferences' }, null )
}

// ----------------------------------------------------------------------------
function setupSec( gui ) {
  // switch securiy on:
  gui.enableSec2({ 
    requireJS: [ 
      'https://cdn.auth0.com/js/auth0/9.11/auth0.min.js',
      'https://cdn.auth0.com/js/change-password-1.5.1.min.js' 
    ],
    moduleJS: 'js/sec2auth0.js',
    checkLoginInterval: '60000',
    loginRedirect:  'http://localhost:8111/security2demo/index.html',
    logoutRedirect: 'http://localhost:8111/security2demo/index.html',
    
    resetPasswordURL  : 'svc/mock/sec/password',
    changePasswordURL : 'svc/mock/sec/password',
    //registerURL      : 'index.php?layout=tests/sec/register',
    
    authDomain : cfg.AUTH_DOMAIN,
    clientId   : cfg.CLIENT_ID,
    audience   : cfg.AUDIENCE,

    userPages: {
      'User Profile': 'index.html?layout=userprofile'
    }
  })

  // serve sec code to browser
  gui.getExpress().use( '/js', express.static( __dirname + '/serve-js' ) )


  // check authorization for GUI pages 
  gui.authorize =  function authorize( user, page ) {
    if ( page == 'main') {
      log.info( 'All users are authorized for page "'+page+'", also "'+user+'"' )
      return true;
    }
    if ( ! user ) {
      log.info( 'User "'+user+'" is not authorized for page "'+page+'"' )
      return false
    }
    log.info( 'User "'+user+'" is authorized for page "'+page+'"' )
    return true  
  }

}