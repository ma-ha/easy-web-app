var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )
var fileupload = require('express-fileupload')

// initialize the web app framework and a default main page
var page = gui.init ()
page.header.logoText = 'Upload Files Example'

// add upload module
gui.addView ( 
  {
    id    : 'Upload',
    title : 'Upload',
    type  : 'pong-upload',
    resourceURL : '/upload',
    height: '115px'
  },
  {
    accept: '.txt,image/*', // accept is optional
    update: [ 'Files' ],
    input: [ // inputs are optional
      { id: 'name', label: 'Name', value:'filename' } // value is optional
    ]
  }
)

// file list
gui.addView ( 
  {
    id    : 'Files',
    title : 'File List',
    type  : 'pong-table',
    resourceURL : 'files',
    height: '500px'
  },
  {
    dataURL: '',
    rowId: 'ID', // required for editable cells and select
    cols: [
      {
        width: '30%',
        id: 'filename',
        label: 'File',
        cellType: 'text'
      },
      {
        width: '20%',
        id: 'name',
        label: 'Name',
        cellType: 'text'
      },
      {
        width: '15%',
        id: 'mimeType',
        label: 'MimeType',
        cellType: 'text'
      },
      {
        width: '15%',
        id: 'size',
        label: 'Size',
        cellType: 'text'
      },
      {
        width: '20%',
        id: 'date',
        label: 'Uploaded',
        cellType: 'datems'
      }
    ]
  }
)


// API:
var svc  = gui.getExpress()
let fileList = []

svc.get( '/files', ( req, res ) => {
  res.json( fileList )
})

svc.use(fileupload())

svc.post( '/upload', (req, res) => {
    if ( ! req.files ) { 
      console.log( 'File not foud' )
      return res.send('File was not found')
    }
    console.log( req.files )
    fileList.push({
      name     : req.body.name,
      filename : req.files.file.name,
      mimeType : req.files.file.mimetype,
      size     : req.files.file.size,
      date     : Date.now()
    })    
    res.send('File Uploaded')
})
