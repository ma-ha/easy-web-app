/** Simple example: Create a web page with form */

var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

/** Initialize the framework and the default page */
gui.init ( 'First Example' )

/**
 * Add a view of type "pong-easy-form" (= plug-in) to the default page the first
 * parameter of addView is the view configuration, a second parameter can define
 * the plug-in configuration, a third parameter can specify the page.
 */
gui.addView ( 
  {
    'id'   : 'myFirstView',
    'title': 'Form view showing all field types',
    'type' : 'pong-easyform'    
  },
  {
    "id" : "tstFormId",
    "easyFormFields" : [ 
        "id"
      , "c1|Name"
      , "c1|Date|date"
      , "c1|separator"
      , "c1|Remark|3rows"
      , "c2|Mailings|label"
      , "c2|Send~Ads~~|checkbox_infomails_ads"
      , "c2|Newsletter|checkbox_infomails_newsletter"
      , "c2|Pass~Word" 
    ],
    "actions" : [ 
      {
        "id" : "Chk",
        "actionName" : "Check",
        "actionURL"  : "/dummy"
      }
    ]
  }
)

// ... Stop here! That's all of easy-web gui :-)
// -----------------------------------------------------------
// For a complete example we need REST web service:
// The browser will send the the data via POST request. 
var app  = gui.getExpress()
var bodyParser  = require( 'body-parser' )
var jsonParser  = bodyParser.json()

//app.locals.pretty = true
//app.set('json spaces', 2)


// save changed table config back
app.post( 
    '/dummy', 
    jsonParser,
    function( req, res ) {
      res.statusCode = 200    // = OK
      return res.json( {} )   // empty, but valid response object
    }
  )
