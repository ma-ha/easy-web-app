// only a code fragment
// UC: Show documents for a product in a product-category

// URL for GUI 
//  my-server.com/layout=my-page&id=123/8877
// and API is
//  my-server.com/api/category/123/product/8877/docs

let page = gui.addPage( 'prd-doc-page', 'Files' )
page.dynamicRow( ( staticRows, req, page ) => {
  return new Promise( async ( resolve, reject ) => { try {

    let views = staticRows
    if ( ! req.query.id ) { return staticRows }
    let categoryId = req.query.id.split('/')[0]
    let productId  = req.query.id.split('/')[1]
    
    let prd = await db.loadProducty( productId )
    if ( ! prd ) { return views }

    views.push({ 
      rowId: 'DocTbl', // IMPORTANT: don't use "id" here !!!
      title: 'Docu Files for Product "'+prd.name+'" (Category: "'+prd.catName+'")',
      type: 'pong-table', height: '650px', decor: 'decor',
      resourceURL: 'api/category/'+categoryId+'/product/'+productId+'/docs',
      moduleConfig: {
        dataURL: '', rowId: 'docId',
        cols : [
          { id: "edit", label: "Edit", cellType: "link", width:"10%", 
            URL: 'index.html?layout=edit-nonav' },
          { id: "name", label: "Doc Name", width:"20%" }, 
          { id: "descr", label: "Description", width:"70%" }
        ]
      }
    })
    resolve( views )
  } catch ( exc ) {
    log.error( 'prd-doc-page', exc.message )
    resolve( staticRows )
  } })
})
