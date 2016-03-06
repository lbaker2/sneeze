module.exports = (function(window, document){
  var request = require('superagent');

  var _sneeze = {};

  _sneeze.initialize = function(configuration){
    this.configure.bind(this)(configuration)
  }

  _sneeze.configure = function(configuration){
    configuration = configuration || {};
    this._config = this._config || {};
    this._config.url = configuration.url || this._config.url || '/sneeze';
    // any other configurations can go here
  }

  _sneeze.configure(); 

  _sneeze.log = function(error){
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
    errorInfo.lineno = src[src.length-2].trim();
    errorInfo.colno = src[src.length-1].trim();
    errorInfo.stack = stack.trim();

    request.post(this._config.url)
      .send(errorInfo)
      .end();
  }

  _sneeze.listen = function(cb){
    var self = this;
    window.onerror = function(message, source, lineno, colno, error){
      self.log(error);
      if(cb){
        cb(error);
      }
    }
  }

  _sneeze.catch = function(fn, cb){
    var self = this;
    try{
      fn();
    }catch(e){
      self.log(e);
    }
  }

  return _sneeze;
})(window, document);