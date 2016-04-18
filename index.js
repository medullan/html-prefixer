var htmltree = require("htmltree"),
    q = require("q"),
    _ = require("lodash"),
    stringify = require("htmltree-stringify");
var sync = require('synchronize')
var traverse = function(node, options){
  if(_.isArray(node)){
    _.forEach(node, function(value){
      if(_.isPlainObject(value)){
        value = process(value, options)
      }
    })
  }
  return node;
}

var process = function(value, options){
  if(_.isPlainObject(value)){
    traverse(value.children, options)
    if(value.attributes){
      if(value.attributes.class)
      value.attributes.class = prefix(value.attributes.class, options);

      if(options.prefixIds && value.attributes.id)
      value.attributes.id = prefix(value.attributes.id, options);
    }
  }
  return value;
};

var startWithMatches = function(value, arr){
    if(_.isArray(arr)){
        for(var index in arr){
            if(_.isString(arr[index])){
                var result = _.startsWith(value, arr[index]);
                if(result) {
                    return result;
                }
            }
        }
    }
    return false;
};

var prefix = function(value, options){
  if(_.isString(value) && _.trim(value).length > 0){
    var parts = value.split(' ');
    _.forEach(parts, function(part, i){
      if( !_.startsWith(part, options.prefix) && !startWithMatches(part, options.ignore)){
        parts[i] = options.prefix + _.trim(part);
      }
    });
    value = parts.join(' ');
  }
  return value;
};

var service = function(html, options){
  var defer = q.defer();
  if(_.isPlainObject(options) && _.isString(options.prefix) && _.trim(options.prefix).length > 0 ){
    options.prefix = _.trim(options.prefix);
    htmltree(html, function(err, doc) {
      if(!err){
        doc.root = traverse(doc.root, options)
        defer.resolve(stringify(doc));
      }else{
        defer.reject(err);
      }
    });
  }else{
    defer.reject({message:'please provide a prefix to start processing'})
  }
  return defer.promise;
};

service.sync = function(html, options){
  var result = '', done = false;
  service(html, options)
    .then(function(val){
      result = val;
      done = true;
    })
    .fail(function(val){
      result = val;
      done = true;
    })

  require('deasync').loopWhile(function(){return !done;});
  return result;
}

module.exports = service;
