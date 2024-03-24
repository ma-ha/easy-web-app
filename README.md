# Easy Web App
Create web applications easily and reduce complexity.

**No GUI programming required!** The **Web GUI is defined by JSON**, static files or served via REST service.
Create complex and full featured web GUIs incredibly fast just by configuration.  
You focus on programming business logic (REST services). 

This [Node.js API package](https://www.npmjs.com/package/easy-web-app) 
includes the [rest-web-gui](https://github.com/ma-ha/rest-web-ui) framework and make its usage comfortable and easy.

Focus is on **web applications** _(not simple web pages)_. 
Available view types:
* Forms (incl. QR and barcode scanner), Tables, Lists, Trees, Histograms, File Upload
* Content: Markdown (also as Wiki), WikiML via MediaWiki API, plain HTML views, RSS-/atom-feeds or help dialogs
* I/O: control switches/drawer, gauges, graphs, LEDs, displays, ...
* Maps: POIs, routes, traffic, ...
* Icons or icon rows with expands
* Source code display

Since v2.9.6 you can also develop and host your own (private or customized) modules to implement your own view types or GUI functionality.

Features:
* Rich page haeder and footer
* Flexible layout for multiple views on one page 
* Page to page navigation with navigation tabs, menus, links, ...
* i18n: switch language
* Security: RESTful, HTTP Basic or OAuth authentication support, "Change Password" dialog with policy check, ... (see below)
* Session data
* CSS customizing and themes
* layout alternatives: desktop / mobile phone / tablet detection 

This is how it may look like:
![demo screen shot](http://bit.ly/rest-web-gui-screenshot) 

Have a look at the ["list" example](https://github.com/ma-ha/easy-web-app/tree/master/examples/list):
![list demo screen shot](https://github.com/ma-ha/easy-web-app/raw/master/examples/list/pong-list.png) 

**Real World App Example**:
Check out what it's capable to do in my [Low Code Data App](https://github.com/ma-ha/lowcode-data-app/).
This includes OpenId connect authentication flow, an "Entity Diagram" extension, dynamic form and table generation, lot CSS hacks and more.

Check out [docu on "rest-web-gui" GIT project](https://github.com/ma-ha/rest-web-ui/), 
the [examples](https://github.com/ma-ha/easy-web-app/tree/master/examples/)
and the [online demos](https://mh-svr.de/pong_dev) of all features.


Check "[Release Notes](https://github.com/ma-ha/easy-web-app/blob/master/ReleaseNotes.md)" for latest changes in this version.

By v2.3.0 you are able to use callbacks to inject dynamic configuration per request. 
This gives you full flexibility to replace or customize title, header, navigation menu, rows or footer. 
Have a look at the [example code](https://github.com/ma-ha/easy-web-app/blob/master/examples/dynamic-on-request/index.js).
I needed dynamic configuration to do customizations and white-labeling per tenant in multi-tenant scenarios.

## Compared with ...
* jade
  * jade is descriptive, but low level (HTML structure)
  * jade is perfect for web pages, not for web applications
* angular 
  * angular can do everything, but web GUI programming is required 
* react
  * build web apps with JavaScript in a component way -- but not descriptive
* vue.js
  * still HTML (templating)

They can all work behind the scenes, i.e. for view plug-ins. 

## 20 sec Test
Requires [node.ns installed](https://nodejs.org/en/download/) -- 
which is always a good idea to have it.

Get a local copy and start example:

```bash
git clone https://github.com/ma-ha/easy-web-app.git

cd easy-web-app
npm install
 
cd examples
cd simple
node index.js
```

Now open the web app in your browser: [http://localhost:8888/](http://localhost:8888/)
	
## How does it work?
To create a web application with one view you simple do:

```javascript
// initialize:
var gui = require ( 'easy-web-app' )

// start REST services and create a main page
gui.init()  

// Create a form view on the main page:
gui.addView( 
	{ ... view config JSON ... },
	{ ... plug in config JSON ... } 
)
```

You'll find the full example here:
[simple form](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/)

The idea is to define "page" containing different "views" in a JSON format and a "portal" as a set of "pages".
This little package helps you to create the JSON configuration and 
to set up [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) 
web service to provide the page specification to the browser.

The JSON configuration of a whole page looks this way:
* `title`: a simple String
* `header` object
  * `logoText` (String) or `logoURL` (String) 
  * `modules`: Array of header plug-ins and their configuration
* `rows`: an array of "views" or "columns" and their configuration 
* `footer`
  * `copyrightText` String 
  * `modules`:  Array of footer modules and configurations for them

Inside the browser this is rendered to a full featured web app by
[the "rest-web-gui" JavaScript framework and it's plug-ins](https://github.com/ma-ha/rest-web-ui/) -- magic!!

Tested on all modern browsers and devices (support alternate layouts for mobile phones and tablets is now a feature):

![demo screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/gui-on-devices-s.png) 


## First project (< 1 min)
Requires [node.ns installed](https://nodejs.org/en/download/) -- 
it really don't hurt and it's always a good idea to have.

Create a demo folder and install _easy-web-app_ via _npm_

```bash
mkdir demo
cd demo
npm install easy-web-app
```

Create a _simpleForm.js_ file with following content 
(this is the [form example](https://github.com/ma-ha/easy-web-app/blob/master/examples/simple/index.js)):

```javascript
/** Simple example: Create a web page with form */
var gui = require ( 'easy-web-app' )

/** Initialize the framework, the default page and define a title */
gui.init ( 'My 1st Test' )

/**
 * Add a view of type "pong-easy-form" (= plug-in) to the default page the first
 * parameter of addView is the view configuration, a second parameter can define
 * the plug-in configuration, a third parameter can specify the page.
 */
gui.addView ( 
  {
    'id'   : 'myFirstView',
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
      , "c2|Mailings|label"   // second starts here column
      , "c2|Send~Ads~~|checkbox_infomails_ads"
      , "c2|Newsletter|checkbox_infomails_newsletter"
      , "c2|Pass~Word" 
    ],
    "actions" : [ 
      {
        "id" : "Chk",
        "actionName" : "Check",
        "actionURL"  : "svc/test/check"
      }
    ]
  }
)
```

Run the demo:

	npm install easy-web-app
	node simpleForm.js
	
Open the URL [http://localhost:8888/](http://localhost:8888/) in your Browser.

Remark: To keep this demo simple, there is no REST web service for the 
"Check" button shown here. 

## Security
.. made easy! You get a best practice implementaion for 
application security by confguration including 
* login menu / login dialog
* authentication and authorization (hooks)
* authentication can force password change
* session handling and session timeout
* API for web service authorization 
* secure session cookie handling
* change-password-dialog with password policy check
* (secure) logout 
* page redirects for unautorized requests
* CSRF protection
* click hijacking detection (user alert)
* OAuth2 option for web services 
* OpenID Connect authentication (login redirect) option

The [security example](https://github.com/ma-ha/easy-web-app/tree/master/examples/security) 
shows how to write a secure web app in 100 LoC. 

## Examples and API Reference
Have a look at [some feature demos](https://github.com/ma-ha/easy-web-app/tree/master/examples/),
which also contains a form tutorial.

The [API Reference](https://github.com/ma-ha/easy-web-app/blob/master/API-Reference.md)
contains all JS API and all implemented REST web services.

## Feedback and Support
Please tell me what you like and what I need to improve! I'm also interested in use cases you do. 

Please contact me: 

![email address](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/email.png) 

How can I help you?
