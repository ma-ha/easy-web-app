# Examples
## How to run the examples:
There are two ways to run the examples:

1. Clone the GIT repo (recommended): 
	* Do a `git clone https://github.com/ma-ha/easy-web-app.git`
	* Change into the `easy-web-app` directory
	* Run a `npm update` to load all required packages
	* Start the example: `node index.js` 
2. Run the examples stand alone: 
	* Copy the `index.js` to a local folder and change into that folder
	* Open the `index.js` in an editor and 
	  change the line 
	  	* `var gui = require ( '../../' )` 
	  	* to  `var gui = require( 'easy-web-app' )`
	* Run `npm install easy-web-app npmlog` (some examples also need `express` to be installed)
	* Start the example: `node index.js`  

After starting the example, the console log should show you a line 
```
info Web GUI http://localhost:8888/
```
Open this URL in your browser.

## First Steps
Perhaps start here:
* [Simple form explained -- showing all currently supported field types](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/)
  *  [Simple form JS source](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)
  
## View Type examples  
* [Simple form -- showing all currently supported field types](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)
* [Table demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/table-demo/index.js) \*
  * [Table with expands](https://github.com/ma-ha/easy-web-app/blob/master/examples/table-expand/index.js) \*
* [Content via MediaWiki API](https://github.com/ma-ha/easy-web-app/blob/master/examples/wiki-demo/index.js)
* [Icon navigation demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/icons/) 
* [I/O demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/io/index.js) \*
* [Tree and Histogram demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/tree/) \*
* [List demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/list/) \*
* [Embedded page-navigation view](https://github.com/ma-ha/easy-web-app/blob/master/examples/nav-embed/index.js)

## Other Feature Demos
* [2 pages with navigation](https://github.com/ma-ha/easy-web-app/blob/master/examples/multi-page/index.js)
* [Responsive layout for mobile phones, tablets or desktop browsers](https://github.com/ma-ha/easy-web-app/blob/master/examples/mobile-detect/index.js)
* [how to provide a customized CSS, change the logo, etc.](https://github.com/ma-ha/easy-web-app/blob/master/examples/custom-css/index.js)
* [menu demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/menu-tabs/index.js)
* [pull-down menu demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/pull-down-menu/index.js)
* [i18n / internationalization / multi-language support](https://github.com/ma-ha/easy-web-app/blob/master/examples/i18n/index.js) \*
* ["complex" layout demo -- more than one view on a page](https://github.com/ma-ha/easy-web-app/blob/master/examples/complex-layout/index.js)
* [change view configuration "on-the-fly"](https://github.com/ma-ha/easy-web-app/blob/master/examples/on-the-fly-config/index.js)
* [Security: Login, logout and page authorization](https://github.com/ma-ha/easy-web-app/blob/master/examples/security/)
* [event feedback for user in footer](https://github.com/ma-ha/easy-web-app/blob/master/examples/feedback/index.js)
* [theme demo](https://github.com/ma-ha/easy-web-app/blob/master/examples/theme/index.js)

<sub>_Remark: (\*) includes a REST/JSON web service implementation_</sub>  

# Tutorial  
* [form tutorial](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/)

# API Reference
* [API Reference Page](https://github.com/ma-ha/easy-web-app/blob/master/API-Reference.md)

# Custom Modules 

You can write your own view types (or customize/extend existing ones):
Example [code](https://github.com/ma-ha/rest-web-ui/tree/master/html/ext-module/mymediawiki) and
[integration](https://github.com/ma-ha/rest-web-ui/blob/master/html/svc/layout/tests/extension/structure)
