'use strict';

var pkg = require('./package')
, fs = require('fs')
, path = require('path')
, keycache = {}
;

module.exports = function(appname, env, keydir, privsuffix, pubsuffix) {
  privsuffix = privsuffix || 'key';
  pubsuffix = pubsuffix || 'key.pub';
  env = env || 'dev';
  keydir = path.join(keydir || path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.ns'), env);
  return function(tcid, cb) {
    if (tcid in keycache) {
      return (cb && cb(null, keycache[tcid])) || keycache[tcid];
    }
    if (cb) {
      return fs.readFile(path.join(process.env.HOME, tcid, privsuffix), { encoding: 'utf8' }, function(priverr, priv) {
        if (priverr) return cb(priverr);
        return fs.readFile(path.join(process.env.HOME, tcid, pubsuffix), { encoding: 'utf8' }, function(puberr, pub) {
          if (puberr) return cb(puberr);
          return cb(null, pair(tcid, priv, pub));
        });
      });
    }
    var priv = fs.readFileSync(path.join(process.env.HOME, tcid, 'key'), { encoding: 'utf8' })
    , pub = fs.readFileSync(path.join(process.env.HOME, tcid, 'key.pub'), { encoding: 'utf8' })
    ;
    return pair(tcid, priv, pub);
  };
};

function pair(tcid, priv, pub) {
  var key = { priv: appname === tcid ? priv || '', pub: pub };
  keycache[tcid] = key;
  return key;
}

Object.defineProperty(module.exports, 'version', { enumerable: true, value: pkg.version });