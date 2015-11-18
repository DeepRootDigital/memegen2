var profileList = [];
var numMembers = 5;
var activeProfile;

function Profile(profileId, profileName, fontColor, fontType, overlayColor, profileImages, isActive) {
  this.profileId = profileId;
  this.profileName = profileName ;
  this.fontColor = fontColor;
  this.fontType = fontType;
  this.overlayColor = overlayColor;
  this.profileImages = profileImages;
  this.isActive = isActive;

  this.getMembers = function(){
    return [this.profileName, this.fontColor, this.fontType, this.overlayColor, this.profileImages, this.profileId];
  };
}

$(document).ready(function(){
  loadProfiles();
});


function loadProfiles() {
  $.getJSON( '/profilelist', function(data) {
    profileList.length = 0;
    $.each(data, function() {
      if(this.username == getCookie('id')) {
        var newProfile = new Profile(this._id, this.profileName, this.fontColor, this.fontType, this.overlayColor, this.profileImages, this.active);
        profileList.push(newProfile);
      }
    });
  }).done(function() {
    // TODO: Fix the sorting profiles by name
    //sortProfiles(); 
    if(document.getElementById("profiles-list")) {
      showProfiles();
      $(".remove").on('click', function(a){
        removeProfile(a);
      });
    }
  });
}

function addProfile() {
  var addedName = document.getElementById("profile-name").value;
  for(i = 0; i < profileList.length; i++) {
    if(addedName == profileList[i].profileName) {
      window.alert("Profile name already in use!");
      return;
    }
  }

  var isActive = false;
  console.log(profileList.length);
  if(profileList.length == 0)
    isActive = true;
    var newProfile = {
    'profileName'  : document.getElementById("profile-name").value,
    'fontColor'  : document.getElementById("font-color").value,
    'fontType'  : document.getElementById("font-type").value,
    'overlayColor' : document.getElementById("overlay-color").value,
    'profileImages' : document.getElementById("profile-images").value,
    'username' : getCookie('id'),
    'active' : isActive
  }
    

  var isError = false;
  var errorString = "Profile not added. Below is a list of errors: \n\n";
  if(newProfile.profileName == '') {
    errorString += "Profile name can't be blank.\n";
    isError = true;
  }
  if(newProfile.fontColor == '') {
    errorString += "Font color can't be blank.\n";
    isError = true;
  }
  if(newProfile.fontType == '') {
    errorString += "Font type can't be blank.\n";
    isError = true;
  }
    if(newProfile.overlayColor == '') {
    errorString += "Overlay color can't be blank.\n";
    isError = true;
  }
    if(newProfile.profileImages == '') {
    errorString += "Profile images can't be blank.\n";
    isError = true;
  }
  //Early out if there is an error
  if(isError) {
    window.alert(errorString);
    return;
  }

  // Execute ajax request
  $.ajax({
    type: 'POST',
    data: newProfile,
    url: '/addprofile',
    dataType: 'JSON'
  }).done(function() {
    loadProfiles();
    clearForm();
  });
}

function showProfiles() {
  var table = document.getElementById("profiles-list");

  for(i = 0; i < profileList.length; i++) {
  
    if($("#"+profileList[i].profileId).text() != "")
      continue;
    
    var row = table.insertRow(i+1);
    row.setAttribute("id", profileList[i].profileId); 
    for(j = 0; j < numMembers; j++) {
      var active = "";
      if( j == 0 && profileList[i].isActive == "true")
        active += "* ";
      var cell = row.insertCell(j);
      cell.innerHTML = active + profileList[i].getMembers()[j];
    }
    var cell = row.insertCell(numMembers);
    cell.innerHTML = "<button type=\"button\" class=\"remove\" identifier=\""+ profileList[i].profileId +"\"> Remove</button>";
  }
}

function sortProfiles() {
  profileList.sort(function(a, b) {
    return b.profileName - a.profileName;
  });
}

function removeProfile(curData) { 

  var identifier = curData.currentTarget.attributes.identifier.nodeValue;

  var deleteMe = {
    id: identifier
  } 
  $.ajax({
    type: 'POST',
    data: deleteMe,
    url: '/deleteprofile',
    dataType: 'JSON'
  });

  var indexToDelete;
  for(i = 0; i < profileList.length; i++){
    if(profileList[i].profileId == identifier) {
      indexToDelete = i;
      break;
    }
  }

  $("#"+ profileList[indexToDelete].profileId).remove();
  profileList.splice(indexToDelete, 1);

  var isActive = false;
  for(i=0; i < profileList.length; i++){
    if(profileList[i].isActive == "true") {
      isActive = true;
      break;
    }
  }

  if(!isActive && profileList.length)
    setActive(profileList[0].profileName);
}

function setActive(profile) {
  var messageData = {
    username: getCookie('id'),
    profileName: profile,
    isActive: true
  }

  $.ajax({
    type: 'POST',
    data: messageData,
    url: '/setactiveprofile',
    dataType: 'JSON'
  }).done(function() {

    for(i=0; i < profileList.length; i++) {
      if(profileList[i].profileName == profile)
        continue;

      setInactive(profileList[i].profileName);
    }
  });
}

function setInactive(profile) {
    var messageData = {
    username: getCookie('id'),
    profileName: profile,
    isActive: false
  }

  $.ajax({
    type: 'POST',
    data: messageData,
    url: '/setactiveprofile',
    dataType: 'JSON'
  }).done(function() {
  });
}

function clearForm() {
  document.getElementById("profile-name").value = "",
  document.getElementById("font-color").value = "",
  document.getElementById("font-type").value = "",
  document.getElementById("overlay-color").value = "",
  document.getElementById("profile-images").value = ""
}