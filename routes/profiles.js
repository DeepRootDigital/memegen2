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
    db.collection('profilelist').update({username: un, profileName: pn}, {$set: {active: isActive}}, function(err, result){
      res.send(
        (err === null) ? { msg: ''} : { msg: err }
      );
    });
  }
 }

exports.updateProfile = function(db) {
  return function(req, res) {
    var _profileName = req.body.profileName;
    var _overlayColor = req.body.overlayColor;
    var _fontType = req.body.fontType;
    var _fontColor = req.body.fontColor;
    var _logo = req.body.logo;
    var _domainName = req.body.domainName;
    var _username = req.body.username;
    var _oldProfileName = req.body.oldProfileName;
    db.collection('profilelist').update({username : _username, profileName : _oldProfileName}, {$set: {profileName : _profileName, overlayColor : _overlayColor, fontType : _fontType,
                                                                           fontColor : _fontColor, logo : _logo, domainName :_domainName}}, function(err, result){
      res.send(
        (err === null) ? { msg: ''} : { msg: err }
      );
    });
  }
 }