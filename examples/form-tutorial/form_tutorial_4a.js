var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 3' )

var formConfig = {
    id   : 'myForm',
    title: 'Form: Field Types',
    type : 'pong-form',
    resourceURL: 'hello',
    height: '750px'
  }
  
var formPlugInConfig = {
    id: 'myFormDef',
    description: 'Pre-Load Data Form',
    fieldGroups: [
      {
        columns: [
          {
            formFields: [
              { id: 'l01', label: 'This is a label.', type: 'label' },
              { id: 'f01', label: 'Text', type: 'text' },
              { id: 'f02', label: 'Textarea', type: 'text', rows:'3', defaultVal:'...' },
              { id: 'f03', label: 'E-Mail', type: 'email' },
              { id: 'f04', label: 'Date', type: 'date' },
              { id: 'f05', label: 'Check', type: 'checkbox' },
              { id: 'f06', label: 'QR', type: 'text', qr: true },
            ]
          }
        ]
      }
    ],
    actions: [
      { id: 'initFrom', actionName: 'GET',  method: 'GET', 
        onInit:{ getInitValues: "defaultValues" }, // will do a get to resourceURL /hello
      },
      { id: 'actionGet', actionName: 'GET',  method: 'GET',  actionURL: 'test' }
    ]
  }
  
gui.addView ( formConfig, formPlugInConfig )



// ... Stop here! That's all of form tutorial :-)
// -----------------------------------------------------------
// For a complete example we need REST web service:
var app         = gui.getExpress()
var bodyParser  = require( 'body-parser' )
//var jsonParser  = bodyParser.json()
var formParser  = bodyParser.urlencoded( { extended: true } );

app.get( 
  '/hello', 
  function( req, res ) {
    res.statusCode = 200    // = OK
    console.log( 'GET Header: f01h="'+req.get('f01h')+'"' )
    console.log( 'GET Params: '+JSON.stringify( req.query ) )
    return res.json( {
      l01 : 'New label',
      f01 : 'example text',
      f02 : 'more\nexample text',
      f03 : 'abc@xyz.com',
      f04 : Date.now(), // will be ignored (is a TODO)
      f05 : true
    })
  }
)

// serve a table as answer for GET request
app.get( 
    '/test', 
    function( req, res ) {
      res.statusCode = 200    // = OK
      console.log( 'GET Header: f01h="'+req.get('f01h')+'"' )
      console.log( 'GET Params: '+JSON.stringify( req.query ) )
      return  res.json( {} )
    }
  )