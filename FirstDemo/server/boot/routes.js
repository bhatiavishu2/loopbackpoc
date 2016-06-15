module.exports = function(app) {
  //U- Install a "/ping" route that returns "pong"
  app.get('/ping', function(req, res) {
    res.send('pong');
  });
}

//U-like express 
// module.exports = function(app) {
//   var router = app.loopback.Router();
//   router.get('/ping', function(req, res) {
//     res.send('pongaroo');
//   });
//   app.use(router);
// }