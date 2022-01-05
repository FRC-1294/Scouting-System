# Errors
This is a list of every error I've encountered, and the troubleshooting steps to fix it.

# Unable to bind to ports

Check [server.ts](server.ts) lines 9 and 10

Check if something else is using ports 80 and 443 or if mongo is not running on 27016

# Unable to connect to Discord

Check your client secret, application ID, and application secret

Check network connection

# Unable to connect to Database

Check that mongodb is listening at localhost:27016

Check username/password if auth is enabled

# OAuth failure

Check [server.ts](server.ts) in the "web" section and check that OAuth is setup and working.

# Unable to add document

Check that the mongodb user has permission to add documents

Try adding a document using the `mongosh` shell

# Unable to find expected document

Check that everywhere that's supposed to add a document runs `.save()` on the new document

Try finding the document with the `mongosh` shell

# Aggregation failure

Check the pipeline for typos
