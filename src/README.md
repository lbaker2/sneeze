h1. sneeze-client

Checkout github for different versions depending on your needs.

h2 usage

@options@ - Sneeze only takes a few options

* url - the url you want to post the error information
* context - the context in which you want to run your wrapped functions or callbacks, defaults to the Sneeze object
* data - any extra data that you want to send when logging an error. Can be a function and will be executed in the context of the context option.
* onError - a callback to execute when an error does occur, does not wait for the asynchronous logging to finish

@Sneeze.listen([options])@ - Binds an error handler to the window object and logs errors to the url option or default url
@Sneeze.catch(fn, [options])@ - Runs a block of code 'fn' and logs any errors using the options or default options provided
@Sneeze.wrapTryCatch(fn,[options])@ - Returns a function that will execute fn in the context of options.context and log any errors if/when they occur. Good for anonymous or asynchronous callback functions
@Sneeze.configure([options])@ - Override global default configurations by passing in the options here
