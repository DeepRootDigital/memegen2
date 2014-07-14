/*
 * POST to addmeme
 */

 exports.submiterror = function(db) {
   return function(req, res) {
     db.collection('errorlist').insert(req.body, function(err, result){
       res.send(
         (err === null) ? { msg: ''} : { msg: err }
       );
     });
   }
 };