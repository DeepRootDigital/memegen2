var profileList = [];
var numMembers = 6;
var activeProfile;

function Profile(profileId, profileName, fontColor, fontType, overlayColor, logo, domainName, isActive) {
  this.profileId = profileId;
  this.profileName = profileName ;
  this.fontColor = fontColor;
  this.fontType = fontType;
  this.overlayColor = overlayColor;
  this.logo = logo;
  this.domainName = domainName;
  this.isActive = isActive;

  this.getMembers = function(){
    return [this.profileName, this.overlayColor, this.fontType, this.fontColor, this.logo, this.domainName, this.profileId];
  };
}

$(document).ready(function(){
  loadProfiles();
  listIcons();

  $('#icon-dropzone').dropzone({ 
    url: '/uploadicon',
    init: function() {
      this.on("success", function(file) {
        listIcons();  
        $('.upload-response').animate({'height':'60px'},function(){
          setTimeout(function(){
            $('.upload-response').animate({'height':'0px'},300);
          },1500);
        });
      });
    },
    headers: { "un" : getCookie('id'),
                "img_type" : "logo" },
    previewsContainer: "#previewCon"
  });
});


function loadProfiles() {
  $.getJSON( '/profilelist', function(data) {
    profileList.length = 0;
    $.each(data, function() {
      if(this.username == getCookie('id')) {
        var newProfile = new Profile(this._id, this.profileName, this.overlayColor, this.fontType, this.fontColor, this.logo, this.domainName, this.active);
        profileList.push(newProfile);
      }
    });
  }).done(function() {
    // TODO: Fix the sorting profiles by name
    if(document.getElementById("profiles-list")) {
      showProfiles();
      $(".remove").on('click', function(a){
        removeProfile(a);
      });
    }
    else {
      populateEditor();
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
  if(profileList.length == 0)
    isActive = true;

    var logoErr = false;
    var logoName = "";
    if($('#logo-select').find('option:selected').length)
      logoName = getCookie('id') + '_' + $('#logo-select').find('option:selected')[0].value;
    else
      logoErr = true;

    var overlayColor = hexToRgb(document.getElementById("overlay-color").value, document.getElementById("overlay-opacity").value);
    var fontColor = hexToRgb(document.getElementById("font-color").value, document.getElementById("font-opacity").value);

    var newProfile = {
    'profileName'  : document.getElementById("profile-name").value,
    'overlayColor'  : overlayColor,
    'fontType'  : document.getElementById("font-type").value,
    'fontColor' : fontColor,
    'logo' : logoName,
    'domainName' : document.getElementById("domain-name").value,
    'username' : getCookie('id'),
    'active' : isActive
  }
    

  var isError = false;
  var errorString = "Profile not added. Below is a list of errors: \n\n";
  if(newProfile.profileName == '') {
    errorString += "Profile name can't be blank.\n";
    isError = true;
  }
   if(newProfile.overlayColor == '') {
    errorString += "Overlay color can't be blank.\n";
    isError = true;
  }
  if(newProfile.fontType == '') {
    errorString += "Font type can't be blank.\n";
    isError = true;
  }
  if(newProfile.fontColor == '') {
    errorString += "Font color can't be blank.\n";
    isError = true;
  }
  if(newProfile.profileImages == '') {
    errorString += "Profile images can't be blank.\n";
    isError = true;
  }
  if(logoErr) {
    errorString += "Logo can't be blank.\n";
    isError = true;
  }
    if(newProfile.domainName == '') {
    errorString += "Domain name can't be blank.\n";
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
      if(j != 4)
        cell.innerHTML = active + profileList[i].getMembers()[j];
      else
        cell.innerHTML = "<img src=icons/" + profileList[i].getMembers()[j] +"></img>";

      //Set the text color equal to the text color provided in the profiles
      if(j == 1)
        cell.style.backgroundColor = profileList[i].getMembers()[j];

      //Set the overlay color equal to the overlay color provided in the profiles
      if(j == 3)
        cell.style.backgroundColor = profileList[i].getMembers()[j];
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
    loadProfiles();
  });
}

function clearForm() {
  document.getElementById("profile-name").value = "";
  document.getElementById("font-color").value = "FFFFFF";
  document.getElementById("font-color").style.color = "black";
  document.getElementById("font-color").style.backgroundColor = "white";
  document.getElementById("font-type").value = "";
  document.getElementById("overlay-color").value = "FFFFFF";
  document.getElementById("overlay-color").style.color = "black";
  document.getElementById("overlay-color").style.backgroundColor = "white";
  document.getElementById("domain-name").value = "";
  document.getElementById("overlay-opacity").value = "";
  document.getElementById("font-opacity").value = "";
}

function listIcons() {
  var iconTable = '';
  $.getJSON( '/iconlist', function( data) {
    $.each(data, function(){
      if (getCookie('id') == this.username && this.img_type == "logo") {
        iconTable += '<option>';
        iconTable += this.filename;
        iconTable += '</option>';
      }
    });
    $('#logo-select').html(iconTable);
  });
}

function hexToRgb(hex, opacity) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    var a = parseFloat(opacity);
    console.log(a);
    
    if(isNaN(a) || a > 1)
      a = 1;
    else if(a < 0)
      a = 0;

    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
