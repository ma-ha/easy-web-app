var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 4' )

var formConfig = {
    id   : 'myForm',
    title: 'Form: Field Types',
    type : 'pong-form',
    resourceURL: 'hello',
    height: 'auto'
  }
  
var formPlugInConfig = {
    id: 'myFormDef',
    description: 'shows first form',
    fieldGroups: [
      {
        columns: [
          {
            formFields: [
              { id: 'f01', label: 'Text', type: 'text' },
              { id: 'f01r', label: 'Textarea', type: 'text', rows:'3', defaultVal:'...' },
              { id: 'f01r', label: 'Text readonly', type: 'text', defaultVal:"Can't change", readonly:'true' },
              { id: 'f01d', label: 'Text disabled', type: 'text', defaultVal:"Can't select", disabled:'true' },
              { id: 'f01o', label: 'Text+Options', type: 'text',
                options:[ {value:'ABC'}, {value:'XYZ'}, {value:'ZXY', disabled:true}, {value:'12345'} ] },
              { id: 'f01h', label: 'HTML-Header', type: 'text', request:'header', descr:'press F12 and look at network request header to verify' },
              { id: 'f02', label: 'Password', type: 'password' },
              { id: "pwd1", label: "Secret",  type: "secret" },
              { id: 'f03', label: 'Hidden', type: 'text', hidden:true, value:'secret' },
              { id: 'f04', label: 'E-Mail', type: 'email' },
              { id: 'f05', label: 'Date', type: 'date' },
              { id: 'f06', label: 'Select', type: 'select',
                options:[ 
                  {option:'first',  value:'Option1' }, 
                  {option:'second', value:'Option2', selected:true }, 
                  {option:'second and a half', value:'Option2.5', disabled:true }, 
                  {option:'third', value:'Option3' } 
                ] 
              },
              { id: 'f07', label: 'Color', type: 'color', defaultVal:'#01699B' }
            ]
          },
          {
            formFields: [
              { id: 'f00', label: 'Enable POST', type: 'checkbox', name:'accept', activate:["actionPost"] },
              { id: 'fs1', label: 'Separator', type: 'separator' },
              { id: 'f07a', label: 'RO-Checkbox', type: 'checkbox', name:'myChecks', value:'1', defaultVal:true, descr:'is read-only', readonly:true },
              { id: 'f07b', label: '2nd Checkbox', type: 'checkbox', name:'myChecks', value:'2', defaultVal:'true' },
              { id: 'f07c', label: '3rd Checkbox', type: 'checkbox', name:'myChecks', value:'3', defaultVal:false },
              { id: 'fs2', label: 'Separator', type: 'separator' },
              { id: 'f07', label: 'This is a "label"', type: 'label' },
              { id: 'f08a', label: 'Radio 1st', type: 'radio', name:'myRadio', value:'1st' },
              { id: 'f08b', type: 'radio', name:'myRadio', value:'2nd' }, // w/o explizit label: the value will get the label
              { id: 'f09', label: 'This is a link', type: 'link', linkText: 'to same page ;-)', defaultVal:'index.html' },
              { id: 'f10', label: 'Must 3 characters', type: 'text', required: true, regExp: "[A-Za-z]{3}"}
            ]
          }
        ]
      }
    ],
    actions: [
      {  id: 'actionGet',  actionName: 'GET',  method: 'GET',  actionURL: 'test', setData:[ {resId: 'myForm'} ] },
      {  id: 'actionSave',  actionName: 'Save', method: 'POST', actionURL: 'test', modalQuestion: 'Do you want to save the data now?' },
      {  id: 'actionPost', actionName: 'POST', method: 'POST', actionURL: 'test', enabled:false }      
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

// serve a table as answer for GET request
app.get( 
    '/test', 
    function( req, res ) {
      res.statusCode = 200    // = OK
      console.log( 'GET Header: f01h="'+req.get('f01h')+'"' )
      console.log( 'GET Params: '+JSON.stringify( req.query ) )
      return  res.json( {"f09":"/"} ) // this will change the link href to href="/" in the form 
    }
  )

app.post( 
    '/test', 
    formParser,
    function( req, res ) {
      res.statusCode = 200    // = OK
      console.log( 'POST Header: f01h="'+req.get('f01h')+'"' )
      console.log( 'POST Body: '+JSON.stringify( req.body ) )
      return  res.json( {} )
    }
  )