WEB_SERVER_PORT = 9888;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Menu demo example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/menu-tabs');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'h1', 'Menu Demo' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
    it( 'should show menu tabs div', 
      function() {
          this.browser.assert.success();
          this.browser.assert.element( 'div#MainNav' );
    }
    );  
    
    it( 'should show menu 1', 
      function() {
          this.browser.assert.success();
          this.browser.assert.link( '.pongNavBarItemActive a', 'Page ABC', 'index.html?layout=main' );
    }
    );  
    
    it( 'should show menu 2', 
      function() {
          this.browser.assert.success();
          this.browser.assert.link( '.pongNavBarItem a:not(.pongNavBarItemActive)', 'New Page', 'index.html?layout=secondpage' );
    }
    );  
    
    it( 'should show sub menu tabs and info', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( '#navItem2', 'myMenu' );
          this.browser.assert.text( '#navTab42Info', '42' );
          this.browser.assert.text( '#navTabmyMenufoo2Html', 'Test: HTML injected for page 3' );
        }
    );  
    
  }
);