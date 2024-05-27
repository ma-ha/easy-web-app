This example is a bit more complex:
- it serves a GUI with login button
- an OpenID Connect provider is required to do the login 
- then redirects back to our GUI with an id token 
- the backend serves now an authorized GUI
- a secured ReST API evaluates the JWT from the header and serves data if authorized

The example works with Auth0 as provider. The configuration for the provider needs also some important steps:

1. Create an API (or APP)
2. Get the "Auth Domain", the "Client ID", the "Audience" (=API name) and the JSON Web Key Set URI (advanced config) and adjust the configuration
3. In the Auth0 config, specify `http://localhost:8111/security2demo/index.html` for callback, allowed origin, allowed logout URI
4. enable RBAC in the API
5. Create an access right `read:all` for the API
6. Create a role `Reader` and assign the `read:all` four our API

TODO: 
- nav too fast -> shows unauthorized menu
- solve API problem with the audience and aud (get clientID, expects URL)