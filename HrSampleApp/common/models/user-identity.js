
 module.exports = function(UserIdentity) {
  var loopback = require('loopback');
 // var utils = require('./utils');


function createAccessToken(user, ttl, cb) {
    if (arguments.length === 2 && typeof ttl === 'function') {
      cb = ttl;
      ttl = 0;
    }
    user.accessTokens.create({
      created: new Date(),
      ttl: Math.min(ttl || user.constructor.settings.ttl,
        user.constructor.settings.maxTTL)
    }, cb);
  }

  function profileToUser(provider, profile, options) {
  // Let's create a user for that
    var profileEmail = profile.emails && profile.emails[0] &&
              profile.emails[0].value;
    var generatedEmail = (profile.username || profile.id) + '@loopback.' +
              (profile.provider || provider) + '.com';
    var email = provider === 'local' ? profileEmail : generatedEmail;
    var username = provider + '.' + (profile.username || profile.id);
    var password = "sdkjfnsdkjnk";
    var userObj = {
      username: username,
      password: password
    };
    if (email) {
      userObj.email = email;
    }
    return userObj;
  }
  
  /**
   * Log in with a third-party provider such as Facebook or Google.
   *
   * @param {String} provider The provider name.
   * @param {String} authScheme The authentication scheme.
   * @param {Object} profile The profile.
   * @param {Object} credentials The credentials.
   * @param {Object} [options] The options.
   * @callback {Function} cb The callback function.
   * @param {Error|String} err The error object or string.
   * @param {Object} user The user object.
   * @param {Object} [info] The auth info object.
   *
   * -  identity: UserIdentity object
   * -  accessToken: AccessToken object
   */
  UserIdentity.login = function (provider, authScheme, profile, credentials,
                                 options, cb) {
    options = options || {};
    if(typeof options === 'function' && cb === undefined) {
      cb = options;
      options = {};
    }
    var autoLogin = options.autoLogin || options.autoLogin === undefined;
   // var UserIdentity = utils.getModel(this, UserIdentity);
    profile.id = profile.id || profile.openid;
    UserIdentity.findOne({where: {
      provider: provider,
      externalId: profile.id
    }}, function (err, identity) {
      if (err) {
        return cb(err);
      }
      if (identity) {
        identity.credentials = credentials;
        return identity.updateAttributes({profile: profile,
          credentials: credentials, modified: new Date()}, function (err, i) {
          // Find the user for the given identity
          return identity.user(function (err, user) {
            // Create access token if the autoLogin flag is set to true
            if(!err && user && autoLogin) {
              return (options.createAccessToken || createAccessToken)(user, function(err, token) {
                cb(err, user, identity, token);
              });
            }
            cb(err, user, identity);
          });
        });
      }
      // Find the user model
      var userModel = (UserIdentity.relations.User &&
                       UserIdentity.relations.user.modelTo) ||
                       loopback.getModelByType(loopback.User);
                       
      var userObj = (options.profileToUser || profileToUser)('local', profile, options);
      if (userObj==null && !userObj.email && !options.emailOptional) {
        process.nextTick(function() {
          return cb('email is missing from the user profile');
        });
      }

      var query;
      if (userObj.email && userObj.username) {
        query = { or: [
          { email: userObj.email }
        ]};
      } else if (userObj.email) {
        query = { email: userObj.email };
      } else {
        query = { username: userObj.username };
      }

      userModel.findOne({ where: query }, function (err, user) {
        if (err) {
          return cb(err);
        }
      if(user==null)
      {
        return cb(err,user,identity);
      }
        var date = new Date();
        UserIdentity.findOne({ where: { externalId: user.id } }, 
         function (err, identity) {
          if(!err && user && autoLogin) {
            return (options.createAccessToken || createAccessToken)(user, function(err, token) {
              
         // options.successRedirect =   options.successRedirect.replace(/:accessToken/,JSON.stringify(token.__data));
              cb(err, user, identity, token);
            });
          }
          cb(err, user, identity);
        });
      });
    });
  };
  return UserIdentity;
};
