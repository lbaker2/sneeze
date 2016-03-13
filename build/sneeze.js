module.exports = (function(){
  var request = require('superagent');

  var _sneeze = {};
  var config;

  _sneeze.enabled = true;

  /*
    - Gets the browser type and version if available
  */
  _sneeze.browserWithVersion = (function(){
    if(!navigator){
      return 'No browser information available';
    }
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  })();

  _sneeze.configure = function(configuration){
    configuration = configuration || {};
    config = config || {};
    config.url = configuration.url || config.url || '/errors';
    config.extras = configuration.extras || config.extras;
    // any other configurations can go here
  }

  // returns a shallow copy of the configuration
  _sneeze.getConfig = function(){
    var configuration;
    if(config){
      configuration = {};
      for(var attr in config){
        configuration[attr] = config[attr];
      }
    }
    return configuration;
  }

  // will return options, comparing the options with _config, and fills the missing pieces of the options hash with _config values
  // will return options if _config is not defined
  _sneeze.extendOptions = function(options){
    if(config){
      return options;
    }
    for(var attrName in config){
      if(typeof options[attrName] == 'undefined'){
        options[attrName] = config[attrName];
      }
    }
  }

  /*
    - Accepts an error object and passes the error to the configured url via POST
    - Will attempt to post to the server as long as a valid response is returned
    - Will not attempt further logging if a request to the server returns an error
  */
  _sneeze.log = function(error, options){
    if(!this.enabled){
      return;
    }

    options = options || {};

    this.extendOptions(options);
    
    var errorInfo = this.getErrorInfo(error);

    try{
      request.post(options.url)
        .send(errorInfo)
        .end(function(err, response){
          if(err){
            _sneeze.enabled = false;
          }
        });
    }catch(e){
      this.enable = false
    }
  }

  /*
    Parses an error for 
      - the event that triggered the error
      - the source of the error (script)
      - the line number of the error
      - the column number of the error
      - the complete stack of the error

    Will return the parsed error and the user's browser and version
  */

  _sneeze.getErrorInfo = function(error){
    var errorInfo = {},
        stack = error.stack,
        pieces = stack.split('\n'),
        src = pieces[pieces.length-1].replace(/(\(*)(\)*)/, '').split(':'),
        stop = src.length-2,
        source = '';

    errorInfo.message = pieces[0].trim();
    
    source = '';
    for(var i=0; i < stop; i++){
      source+=src[i];
    }
    errorInfo.event = source.split('(')[0].trim();
    errorInfo.source = source.split('(')[1].trim();
    errorInfo.lineno = parseInt(src[src.length-2].trim());
    errorInfo.colno = parseInt(src[src.length-1].trim().replace(')', ''));
    errorInfo.stack = stack.trim();
    errorInfo.browser = this.browserWithVersion;

    return errorInfo;
  }

  /*
    - Global watch for errors.
    - Does not receive errors from functions executed with sneeze.catch
    - accepts a callback function, but does not wait for sneeze to send the error to the server
  */

  _sneeze.listen = function(cb, options){
    var self = this;

    if(typeof window != 'undefined'){
      window.onerror = function(message, source, lineno, colno, error){
        self.log(error, options);
        if(cb){
          cb(error, options);
        }
      }
    }else{
      process.on('uncaughtException', function(err){
        self.log(error, options);
        if(cb){
          cb(error, options);
        }
      });
    }
    
  }

  /* 
    - Attempts a function and catches any errors. 
    - Will execute a callback if passed, but does not wait for sneeze to send the error to the server
  */
  _sneeze.catch = function(fn, cb, options){
    var self = this;
    try{
      fn();
    }catch(e){
      self.log(e, options);
      if(cb){
        cb(e, options);
      }
    }
  }

  /* 
    - Setup default configuration
  */
  _sneeze.configure(); 

  return _sneeze;
})();