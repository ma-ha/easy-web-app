var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var express = require( 'express' )
var log = require('npmlog');

log.info( __dirname )

// define to load /css-custom/custom.css from local folder
gui.getExpress().use( '/css-custom', express.static( __dirname ) )
gui.getExpress().use( '/img-cust', express.static( __dirname + '/img-cust' ) )
  

// define a main page
var mainPage = gui.init( 'List Demo', 8880 )
mainPage.setTitle( 'List Demo' )
mainPage.setPageWidth( '1200px' )

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

mainPage.addView( 
    { 
      id:'row1view', 
      title:'Service Dashboard',
      height:'480px', 
      type:'pong-list',
      resourceURL:'/service/statistics'
    },
    {
      maxRows:'4',
      rowId: 'ID',
      // pollDataSec: "5",
      divs: [
          { id:'ID', cellType:'text' }, 
          { id:'XCust', cellType:'div',
            'divs': [
              { id:'CustomerCountLb', cellType:'label', label:'Customers:' },
              { id:'CustomerCount', cellType:'text' },
              { id:'RatingLb', cellType:'label', label:'Customer Rating' },
              { id:'Rating', cellType:'rating', ratingType:'3star' }
            ]
          },  
          { "id" : "XSizeG", "cellType" : "div", 
            "divs" : [ 
                { "id" : "SizeGlb", "cellType" : "label", "label" : "Sizing" }, 
                { "id" : "SizeStat", "cellType": "pie",
                  "min":"0", "max":"100",
                  "labelColor":"#FFF"
                }
              ]
          },
          { id:'XSize', cellType:'div',
            'divs': [
               { id:'Sizelb', cellType:'label', label:'Sizing:' },
               { id:'Slb', cellType:'label', label:'S:' },
               { id:'Size.S', cellType:'text' },
               { id:'Size.Strend', cellType: 'icon' }, 
               { id:'Mlb', cellType:'label', label:'M:' },
               { id:'Size.M', cellType:'text' },
               { id:'Size.Mtrend', cellType: 'icon' }, 
               { id:'Llb', cellType:'label', label:'L:' },
               { id:'Size.L', cellType:'text' },
               { id:'Size.Ltrend', cellType: 'icon' }
            ]
          },  
          { id:'XOrders', cellType:'div',
            'divs': [
               { id:'Orderslb', cellType:'label', label:'Orders' },
               { id:'Orders.D', cellType:'text' },
               { id:'OrdersDlb', cellType:'label', label:'last day' },
               { id:'Orders.Dtrend', cellType: 'icon' }, 
               { id:'Orders.W', cellType:'text' },
               { id:'OrdersWlb', cellType:'label', label:'last week' },
               { id:'Orders.Wtrend', cellType: 'icon' }, 
               { id:'Orders.M', cellType:'text' },
               { id:'OrdersMlb', cellType:'label', label:'last month' },
               { id:'Orders.Mtrend', cellType: 'icon' }
            ]
          },  
          { id:'XAvail', cellType:'div',
            'divs': [
               { id:'AvailabilityLb', cellType:'label', label:'Availability' },
               { id:'Availability', cellType:'text' }
            ]
          },
          { id: 'XUsage', cellType: 'div', 
            'divs' : [ 
              { id : 'UsageLb', cellType: 'label', label: 'Traffic (1d)' }, 
              { id : 'Usage', cellType: 'graph',
                layout:{
                  name:'# requests',
                  graphType:'timeLog',
                  colors: { traffic: '#5A5' },
                  yAxis: {
                    axisType : 'linear',
                    min      : '0',
                    max      : 'auto',
                    labelCnt : 5
                    // alternatively:
                    // max      :'100',
                    // labels   :['0','25','50','75','100']
                  }
                } 
              } 
            ]
          }          
       ]
    }
)
var dta1 = [[-24,30],[-22,35],[-20,50],[-18,40],[-16,40],[-14,50],[-12,40],[-10,30],[-8,35],[-6,35],[-4,45],[-2,10],[0,30]]

// now we have to implement the web service to serve some data for the example
var svc  = gui.getExpress();
svc.get( 
  '/service/statistics', 
  function( req, res ) {
    // generate some dummy data:
    var d = JSON.parse( JSON.stringify( dta1[ 0 ] ) )
    for ( var i = 1; i < dta1.length; i++ ) {
      var d1 = dta1[ i ]
      var d2 = dta1[ i - 1 ]
      d2[1] = d1[1]
    }
    var d2 = dta1[ dta1.length-1  ]
    d2[1] = d[1]

    //console.log( JSON.stringify( dta1 ))
    
    var tableData = 
      [ 
       {"ID":"ABC","CustomerCount":1234,"Rating":"3","Status":"false",
         "Usage":[{"name":"traffic","data":dta1}],
         "SizeStat":[
                     {"val":40,"label":"S","color":"#0aa"},
                     {"val":30,"label":"M","color":"#0cc"},
                     {"val":30,"label":"L","color":"#0ee"}],
         "Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-e","L":"30%","Ltrend":"arrow-1-ne"},
         "Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-n","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:green\">100%</span>"},
       {"ID":"XYZ","CustomerCount":"345","Rating":"1","Status":"true",
           "Usage":[{"name":"traffic","data":[[-24,5],[-22,50],[-20,55],[-18,50],[-16,80],[-14,45],[-12,40],[-10,45],[-8,70],[-6,15],[-4,10],[-2,10],[0,8]]}],
           "SizeStat":[{"val":"10","label":"S","color":"#0aa"},
                       {"val":"10","label":"M","color":"#0cc"},
                       {"val":"80","label":"L","color":"#0ee"}],
           "Size":{"S":"10%","Strend":"arrow-1-e","M":"10%","Mtrend":"arrow-1-se","L":"80%","Ltrend":"arrow-1-ne"},
           "Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-ne","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:orange\">99,96%</span>"},
       {"ID":"A123","CustomerCount":"678","Rating":"2","Status":"true",
         "Usage":[{"name":"traffic","data":[[-24,80],[-20,70],[-16,80],[-12,60],[-8,75],[-4,65],[0,80]]}],
         "SizeStat":[{"val":"20","label":"S","color":"#0aa"},
                     {"val":"80","label":"M","color":"#0cc"},
                     {"val":"20","label":"L","color":"#0ee"}],
         "Size":{"S":"20%","Strend":"arrow-1-se","M":"80%","Mtrend":"arrow-1-n","L":"20%","Ltrend":"arrow-1-e"},
         "Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-s","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:green\">100%</span>"},
       {"ID":"YIII","CustomerCount":"900","Rating":"0","Status":"true",
         "Usage":[{"name":"traffic","data":[[-24,3],[-20,5],[-16,4],[-12,4],[-8,3],[-4,4],[0,3]]}],
         "SizeStat":[{"val":"70","label":"S","color":"#0aa"},
                     {"val":"30","label":"M","color":"#0cc"},
                     {"val":"0","label":"L","color":"#0ee"}],
         "Size":{"S":"70%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-n","L":"0%","Ltrend":"arrow-1-se"},
         "Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-ne","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:red\">88,5%</span>"}
      ]
    res.json( tableData )
  }
)
