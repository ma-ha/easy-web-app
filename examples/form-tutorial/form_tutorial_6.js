var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 6' )

var formConfig = {
    id   : 'myForm',
    title: 'Captcha and Validate Example',
    type : 'pong-form',
    resourceURL: 'order',
    height: '750px'
  }
  
var formPlugInConfig = {
    id: 'myFormDef',
    description: 'dummy form',
    fieldGroups: [
      {
        columns: [ { formFields: [
          { id: 'companyName', label: 'Company', 
            type: 'text', 
            required: true },  // <<< important
          { id: 'shippingAddress', label: 'Address', 
            type: 'text', rows: 5, 
            required: true }, // <<< important
        ]}, { formFields: [
          { id: 'f00', label: 'Accept Policies', 
            type: 'checkbox', name:'polcies', value:'accepted',
            activate:["actionPost"] }, // <<< important
          { id: 'f00', type: 'reCAPTCHA', name:'accept', 
            sitekey: 'USE_YOUR_KEY'}, // <<< important
        ]} ]
      }
    ],
    actions: [
      {  id: 'actionPost', actionName: 'Order', 
         method: 'POST', actionURL: 'order', 
         enabled:false } 
    ]
  }
  
gui.addView ( formConfig, formPlugInConfig )



// -----------------------------------------------------------
// We need REST web service to process the "orders":
var app         = gui.getExpress()
var bodyParser  = require( 'body-parser' )
//var jsonParser  = bodyParser.json()
var formParser  = bodyParser.urlencoded( { extended: true } );

// serve a table as answer for GET request

app.post( 
    '/order', 
    formParser,
    function( req, res ) {
      res.statusCode = 200    // = OK
      console.log( 'POST Header: f01h="'+req.get('f01h')+'"' )
      console.log( 'POST Body: '+JSON.stringify( req.body ) )

      // TODO: vailidate the g-recaptcha-response field
      // at https://www.google.com/recaptcha/api/siteverify

      return  res.json( {} )
    }
  )