var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 3' )

var formConfig = {
    id   : 'myForm',
    title: 'Form View',
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
                        {
                            id:    'field1',
                            label: 'Ask',
                            type:  'text',
                            defaultVal: 'Hello world?'
                        }
                    ]
                }
            ]
        }
    ],
    actions: [
        {
            id: 'myBtn',
            actionName: 'Ask',
            method: 'GET',
            actionURL: 'test',
            setData: [
                { 
                  "resId": "myTable"
                }
           ]
        }
    ]
  }
  
gui.addView ( formConfig, formPlugInConfig )


var tableConfig = {
    id   : 'myTable',
    title: 'Table View',
    type : 'pong-table',
    resourceURL: 'hello',
    height: '200px'
  }
  
var tablePlugInConfig = {
  "rowId": "id",
  "cols": [
        {
            "id": "name",
            "label": "Name",
            "cellType": "text",
            "width": "20%"
        },
        {
            "id": "answer",
            "label": "Answer",
            "cellType": "text",
            "width": "80%"
        }
    ],
    "maxRows":"5"
  }    


gui.addView ( tableConfig, tablePlugInConfig )



// ... Stop here! That's all of easy-web gui :-)
// -----------------------------------------------------------
// For a complete example we need REST web service:
// The browser will send the the data via GET request. 
var app  = gui.getExpress()
var bodyParser  = require( 'body-parser' )
var jsonParser  = bodyParser.json()

//app.locals.pretty = true
//app.set('json spaces', 2)


// serve a table as answer for GET request
app.get( 
    '/test', 
    jsonParser,
    function( req, res ) {
      res.statusCode = 200    // = OK
   
      var resultTable = 
        [
           { name: 'Moe', answer:'Hello world!' },
           { name: 'Susan', answer:'Hello!' },
           { name: 'Jan', answer:'Moin!' },
           { name: 'Nina', answer:'How are you!' },
           { name: 'Joe', answer:'Hi!' },
           { name: 'Lisa', answer:'Hello world!' },
           { name: 'John Doe', answer:'Hello you!' },
           { name: 'Joey', answer:'Huhu!' }
        ]
   
      return res.json( resultTable )  
    }
  )