/* Let's apply a different theme for the "Complex Layout" example. */
var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require( 'npmlog' )
var express = require( 'express' )

//define where to find the tedge.css theme file
gui.getExpress().use( '/css-custom', express.static( __dirname ) )

// Initialize the framework and the default page
var mainPage = gui.init()
mainPage.theme = 'tedge' //transparent edges
gui.decor = 'tedge'
mainPage.title = 'Complex Layout Demo'
mainPage.header.logoText = 'Complex Layout Demo (with "tedge" theme and decor)'

gui.getExpress().use( '/img', require('express').static( require('path').resolve(__dirname, '..') + '/img' ) )

mainPage.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'100px' } )
mainPage.addView( { 'id':'row2view', 'title':'Row 2 View', 'height':'100px' } )

var columns = mainPage.addColumnsRow( 'row3', '200px' )
columns.addView( { 'id':'col1view', 'title':'Col 1 View', 'width':'40%' } )

var col2rows = columns.addRowsColumn( 'col2', '60%' )
col2rows.addView( { 'id':'rowX', 'title':'Row X', 'height':'100px' } )
col2rows.addView( { 'id':'rowY', 'title':'Row Y', 'height':'100px' } )

mainPage.addView( { 'id':'row4view', 'title':'Row 4 View', 'height':'100px' } )
  