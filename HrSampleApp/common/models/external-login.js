module.exports = function(ExternalLogin) {

  ExternalLogin.loginUrl = function(req,res,returnUrl, cb) {
      res.setHeader("Set-Cookie",'cookie='+ returnUrl);
      req.session['returnTo'] = returnUrl + '/:accessToken/';
    var response = "";
    cb(null,response);
  }

  ExternalLogin.remoteMethod (
        'loginUrl',
        {
          http: {path: '/login', verb: 'get'},
          accepts: [
 {arg: 'req', type: 'object', 'http': {source: 'req'}},
 {arg: 'res', type: 'object', 'http': {source: 'res'}},
   {arg: 'returnUrl', type: 'string', http: { source: 'query' } }
],
        
          returns: {arg: 'name', type: 'string'}
        }
    );

  ExternalLogin.getToken = function(token, cb) {
    var response = token;
    cb(null,response);
  }

  ExternalLogin.remoteMethod (
        'getToken',
        {
          http: {path: '/getToken', verb: 'get'},
          accepts: {arg: 'token', type: 'string', http: { source: 'query' } },
          returns: {arg: 'name', type: 'string'}
        }
    );




  ExternalLogin.getDetail = function(id, cb) {
    var response = token;
    cb(null,response);
  }

  ExternalLogin.remoteMethod (
        'getDetail',
        {
          http: {path: '/getDetail', verb: 'get'},
          accepts: {arg: 'id', type: 'int', http: { source: 'query' } },
          returns: {arg: 'name', type: 'string'}
        }
    );

};



