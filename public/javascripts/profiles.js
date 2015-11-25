var profileList = [];
var numMembers = 6;
var activeProfile;

function Profile(profileId, profileName, overlayColor, fontType, fontColor, logo, domainName, isActive) {
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

$('#add-profile-btn').on('click', addProfile);


function loadProfiles(name) {
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
    loadFonts();
    if(document.getElementById("profiles-list")) {
      showProfiles();
      updateProfile(name);
      $('.remove').on('click', function(a){
        removeProfile(a);
      });

      $('.edit').on('click', function(a){
        editProfile(a);
      });
    }
    else {
      populateEditor();
    }
  });
}

function addProfile() {
  var button = document.getElementById("add-profile-btn");
  var name = button.name;
  if(button.innerHTML == "Edit Profile") {
    var newProfile = {
      'oldProfileName' : document.getElementById("add-profile-btn").name,
      'profileName' : document.getElementById("profile-name").value,
      'overlayColor'  : document.getElementById("overlay-color").value,
      'fontType'  : $('#font-select').find('option:selected')[0].value,
      'fontColor' : document.getElementById("font-color").value,
      'logo' : getCookie('id') + '_' + $('#logo-select').find('option:selected')[0].value,
      'domainName' : document.getElementById("domain-name").value,
      'username' : getCookie('id'),
    }
   $.ajax({
      type: 'POST',
      data: newProfile,
      url: '/updateprofile',
      dataType: 'JSON'
    }).done(function() {
        loadProfiles(name);
        }
      );
   clearForm();
   button.innerHTML = "Add Profile";
  }
  else {
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

      var fontErr = false;
      var fontName = "";
      if($('#font-select').find('option:selected').length)
        fontName = $('#font-select').find('option:selected')[0].value;
      else
        fontErr = true;

      var overlayColor = document.getElementById("overlay-color").value;//hexToRgb(document.getElementById("overlay-color").value, document.getElementById("overlay-opacity").value);
      var fontColor = document.getElementById("font-color").value;//hexToRgb(document.getElementById("font-color").value, document.getElementById("font-opacity").value);

      var newProfile = {
      'profileName'  : document.getElementById("profile-name").value,
      'overlayColor'  : overlayColor,
      'fontType'  : fontName,
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
    if(fontErr) {
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
        active += "";

      var cell = row.insertCell(j);
      if(j != 4)
        cell.innerHTML = active + profileList[i].getMembers()[j];
      else
        cell.innerHTML = "<img src=icons/" + profileList[i].getMembers()[j] +"></img>";

      //Set the text color equal to the text color provided in the profiles
      if(j == 3)
        cell.style.backgroundColor = "#" + profileList[i].fontColor;

      if(j == 2) {
        cell.style.color = profileList[i].fontColor;
        cell.style.fontFamily = profileList[i].fontType;
        cell.style.backgroundColor = profileList[i].overlayColor;
      }
      //Set the overlay color equal to the overlay color provided in the profiles
      if(j == 1)
        cell.style.backgroundColor = "#" + profileList[i].overlayColor;
    }
    var cell = row.insertCell(numMembers);
    cell.innerHTML = "<button type=\"button\" class=\"edit\" identifier=\""+ profileList[i].profileName +"\"> Edit</button>";
    cell = row.insertCell(numMembers+1);
    cell.innerHTML = "<button type=\"button\" class=\"remove\" identifier=\""+ profileList[i].profileId +"\"> Remove</button>";
  }
}

function updateProfile(profileName) {
  var table = document.getElementById("profiles-list");
  var index = -1;
  for(i=0; i < profileList.length; i++) {
    var row = table.rows[i+1];
     if(row.cells[0].innerHTML == profileName) {
      index = i
      for(j = 0; j < numMembers; j++) {
          var active = "";
          if( j == 0 && profileList[i].isActive == "true")
            active += "";

          var cell = row.cells[j];
          if(j != 4)
            cell.innerHTML = active + profileList[i].getMembers()[j];
          else
            cell.innerHTML = "<img src=icons/" + profileList[i].getMembers()[j] +"></img>";

          //Set the text color equal to the text color provided in the profiles
          if(j == 3)
            cell.style.backgroundColor = "#" + profileList[i].fontColor;

          if(j == 2) {
            cell.style.color = profileList[i].fontColor;
            cell.style.fontFamily = profileList[i].fontType;
            cell.style.backgroundColor = profileList[i].overlayColor;
          }
          //Set the overlay color equal to the overlay color provided in the profiles
          if(j == 1)
            cell.style.backgroundColor = "#" + profileList[i].overlayColor;
        }
        table.rows[index+1].cells[numMembers].innerHTML = "<button type=\"button\" class=\"edit\" identifier=\""+ profileList[index].profileName +"\"> Edit</button>";
      break;
      }
    }
    if(index != -1) {
      document.getElementById("add-profile-btn").name = profileList[index].profileName;

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

function editProfile(curData) {
  var identifier = curData.currentTarget.attributes.identifier.nodeValue;
  var index;
  for(i=0; i < profileList.length; i++) {
    if(identifier == profileList[i].profileName) {
      index = i;
      break;
    }
  }

  document.getElementById("profile-name").value = profileList[index].profileName;
  document.getElementById("font-color").value = profileList[index].fontColor;
  document.getElementById("overlay-color").value = profileList[index].overlayColor;
  document.getElementById("domain-name").value = profileList[index].domainName;
  document.getElementById("font-select").value = profileList[index].fontType;
  var logoName = profileList[index].logo.replace(getCookie('id')+"_", "");
  document.getElementById("logo-select").value = logoName;

  var button = document.getElementById("add-profile-btn");
  button.innerHTML = "Edit Profile";
  button.name = profileList[index].profileName;
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
  document.getElementById("overlay-color").value = "FFFFFF";
  document.getElementById("overlay-color").style.color = "black";
  document.getElementById("overlay-color").style.backgroundColor = "white";
  document.getElementById("domain-name").value = "";
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
    
    if(isNaN(a) || a > 1)
      a = 1;
    else if(a < 0)
      a = 0;

    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
$('#font-select').on('change', function () { 

    $('body').append("<link rel='stylesheet' id='colorbox-css'  href='http://fonts.googleapis.com/css?family=" + escape($(this).val()) +"' type='text/css' media='all' />");

    $('#font-select').css({'font-family':'"'+$(this).val()+'"'})

});

$.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCmindH6dNUXJHMn-Yy28zLM15uw-WllV0",  {}, function (data) {

    $.each(data.items, function (index, value) {
            $('#font-select').append($("<option></option>")
                    .attr("value", value.family)
                    .text(value.family));
                    });


});

function loadFonts() {
  for(i=0; i< profileList.length; i++) {
    $('body').append("<link rel='stylesheet' id='colorbox-css'  href='http://fonts.googleapis.com/css?family=" + escape(profileList[i].fontType) +"' type='text/css' media='all' />");
  }
}

