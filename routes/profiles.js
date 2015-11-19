/*
 * GET profile listing.
 */

exports.profileList = function(db) {
  return function(req, res) {
    db.collection('profilelist').find().toArray(function(err, items) {
      res.json(items);
    });
  }
};

/*
 * POST to addprofile
 */

 exports.addProfile = function(db) {
   return function(req, res) {
     db.collection('profilelist').insert(req.body, function(err, result){
       res.send(
         (err === null) ? { msg: ''} : { msg: err }
       );
     });
   }
 };

 /*
 * DELETE to deleteProfile
 */

 exports.deleteProfile = function(db) {
   return function(req, res) {
     var profileToDelete = req.body.id;
     console.log(req.body.id);
     db.collection('profilelist').removeById(profileToDelete, function(err, result) {
       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
     });
   }
 }

 exports.setActiveProfile = function(db) {
  return function(req, res) {
    var un = req.body.username;
    var pn = req.body.profileName;
    var isActive = req.body.isActive;
    console.log(isActive);
    db.collection('profilelist').update({username: un, profileName: pn}, {$set: {active: isActive}}, function(err, result){
      res.send(
        (err === null) ? { msg: ''} : { msg: err }
      );
    });
  }
 }