module.exports = (function(){
  var request = require('superagent');

  var _sneeze = {};

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
    this._config = this._config || {};
    this._config.url = configuration.url || this._config.url || '/errors';
    // any other configurations can go here
  }

  /*
    - Accepts an error object and passes the error to the configured url via POST
    - Will attempt to post to the server as long as a valid response is returned
    - Will not attempt further logging if a request to the server returns an error
  */
  _sneeze.log = function(error){
    if(!this.enabled){
      return;
    }
    
    var errorInfo = this.getErrorInfo(error);

    try{
      request.post(this._config.url)
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

  _sneeze.listen = function(cb){
    var self = this;

    if(typeof window != 'undefined'){
      window.onerror = function(message, source, lineno, colno, error){
        self.log(error);
        if(cb){
          cb(error);
        }
      }
    }else{
      process.on('uncaughtException', function(err){
        self.log(error);
        if(cb){
          cb(error);
        }
      });
    }
    
  }

  /* 
    - Attempts a function and catches any errors. 
    - Will execute a callback if passed, but does not wait for sneeze to send the error to the server
  */
  _sneeze.catch = function(fn, cb){
    var self = this;
    try{
      fn();
    }catch(e){
      self.log(e);
      if(cb){
        cb(e);
      }
    }
  }

  /* 
    - Setup default configuration
  */
  _sneeze.configure(); 

  return _sneeze;
})();