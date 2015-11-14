var profileList = [];
var numMembers = 5;
var activeProfile;

function Profile(profileId, profileName, fontColor, fontType, overlayColor, profileImages) {
  this.profileId = profileId;
  this.profileName = profileName ;
  this.fontColor = fontColor;
  this.fontType = fontType;
  this.overlayColor = overlayColor;
  this.profileImages = profileImages;

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
      var newProfile = new Profile(this._id, this.profileName, this.fontColor, this.fontType, this.overlayColor, this.profileImages);
      profileList.push(newProfile);
    });
  }).done(function() {
    // TODO: Fix the sorting profiles by name
    //sortProfiles(); 
    showProfiles();
    $(".remove").on('click', function(a){
      removeProfile(a);
    });
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
    var newProfile = {
    'profileName'  : document.getElementById("profile-name").value,
    'fontColor'  : document.getElementById("font-color").value,
    'fontType'  : document.getElementById("font-type").value,
    'overlayColor' : document.getElementById("overlay-color").value,
    'profileImages' : document.getElementById("profile-images").value
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
      var cell = row.insertCell(j);
      cell.innerHTML = profileList[i].getMembers()[j];
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
}

function clearForm() {
  document.getElementById("profile-name").value = "",
  document.getElementById("font-color").value = "",
  document.getElementById("font-type").value = "",
  document.getElementById("overlay-color").value = "",
  document.getElementById("profile-images").value = ""
}