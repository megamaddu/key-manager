'use strict';

var pkg = require('./package')
, fs = require('fs')
, path = require('path')
, keycache = {}
;

module.exports = function(appname, env, keydir, privsuffix, pubsuffix) {
  
  function pair(tcid, priv, pub) {
    var key = { priv: appname === tcid ? priv : '', pub: pub };
    keycache[tcid] = key;
    return key;
  }

  function clean(path) {
    path = path || '/';
    return path[0] === '/' ? path : '/'.concat(path);
  }

  appname = clean(appname);
  env = env || 'dev';
  privsuffix = privsuffix || 'key';
  pubsuffix = pubsuffix || 'key.pub';
  keydir = path.join(keydir || path.join(process.env.UserProfileKeyDir || process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.keys'), env);
  return function(tcid, cb) {
    tcid = clean(tcid);
    if (tcid in keycache) {
      return (cb && cb(null, keycache[tcid])) || keycache[tcid];
    }
    if (cb) {
      return fs.readFile(path.join(keydir, tcid, privsuffix), { encoding: 'utf8' }, function(priverr, priv) {
        if (priverr) return cb(priverr);
        return fs.readFile(path.join(keydir, tcid, pubsuffix), { encoding: 'utf8' }, function(puberr, pub) {
          if (puberr) return cb(puberr);
          return cb(null, pair(tcid, priv, pub));
        });
      });
    }
    var priv = fs.readFileSync(path.join(keydir, tcid, 'key'), { encoding: 'utf8' })
    , pub = fs.readFileSync(path.join(keydir, tcid, 'key.pub'), { encoding: 'utf8' })
    ;
    return pair(tcid, priv, pub);
  };
};

Object.defineProperty(module.exports, 'version', { enumerable: true, value: pkg.version });