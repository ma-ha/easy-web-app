WEB_SERVER_PORT = 9895;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Table expand example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/table-expand');
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
          this.browser.assert.element( 'div#header' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
    it( 'should show table', 
      function() {
          this.browser.assert.success();
          this.browser.assert.element( 'div#tableView' );
          this.browser.assert.element( 'div.decor-menu' );
          this.browser.assert.text( 'div#tableViewTitle', 'Table Demo (sorry, zoom is always a flower ;-)' );
    }
    );  
    
    it( 'should show table content', 
      function() {
          this.browser.assert.text( '#tableViewContentR0C2', 'Prod A' );
          this.browser.assert.element( '#tableViewContentR0Det1' );
        }
    );  
    
    it( 'should render buttons', 
      function() {
          this.browser.assert.text( '#tableViewContentR0act', 'Buy' );
          // this.browser.assert.element( '#tableViewContentR1C7', 0 );
        }
    );  
    
  }
);