var activeProfile = "";
var profileList = [];

$(document).ready(function(){

  $('#viewmemes').on('click',populateMemeTable);
  $('#viewimages').on('click',populateImageTable);
  $('#profile-choice').on('change', populateTable);
  //$('#viewbgs').on('click',populateBgTable);

  loadProfiles();

});

function populateMemeTable() {
  var tableContent = '';
  $.getJSON( '/memelist', function( data ) {
    memeListData = data;
    // For each of the memes generate the HTML
    activeProfile = $('#profile-choice').find('option:selected')[0].innerHTML;

    $.each(data, function(){
      if (this.username == getCookie('id') && this.profileName == activeProfile) {
        tableContent += '<li><div class="';
        tableContent += this._id;
        tableContent += '"><p>';
        tableContent += this.memename;
        tableContent += '</p><button class="delete-icon"></button></div></li>';
      }
    });
    // Insert into the meme loading selector
    $('.management-left > p').text('My Memes');
    $('.management-left ul').html(tableContent);
    $('.delete-icon').on("click",deleteMemeSingle);
    $('.management-left ul li div').on('click',showSingleMeme);
  });
};

function deleteMemeSingle(event) {
  event.preventDefault();
  var ident = $(this).parent().attr("class");
  var deletememe = {
    id: ident
  }
  $.ajax({
    type: 'POST',
    data: deletememe,
    url: '/deletememe',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      // Update list of memes
      populateMemeTable();
      $('.management-right-name h2').text('');
      $('.management-right-edit button').text('');
      $('.management-right-preview').html('');
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
};

function showSingleMeme() {
  $('.delete-icon').css('display','none');
  $(this).find('.delete-icon').css('display','block');
  // Show Preview
  var ident = $(this).attr('class');
  $.getJSON('/memelist', function(data) {
    var memen;
    var memeinfo;
    var height;
    var width;
    $.each(data, function() {
      if (this._id == ident) {
        memen = this.memename;
        memeinfo = this.json;
        height = this.height;
        width = this.width;
      }
    });
    $('.management-right-name h2').text(memen);
    $('.management-right-edit').html('<button>'+memen+'</button>');
    $('.management-right-preview').html('<canvas id="c" width="' + width + 'px" height="' + height + 'px"></canvas>');
    var canvas = new fabric.Canvas('c');
    canvas.loadFromJSON(memeinfo,function(){
        applyImageFilters(canvas);
    });
    templateClick();
  });
}

function templateClick() {
  $('.management-right-edit button').on('click',function(){
    var templatename = $(this).text();
    document.cookie = "templatename="+templatename;
    window.location = "/create";
  });
}

function applyImageFilters(canvas) {
  canvas.forEachObject(function(obj) {
    if(obj.type === 'image' && obj.filters.length) {
      obj.applyFilters(function(){
        obj.canvas.renderAll();
      });
    } else {
      canvas.renderAll();
    }
  });
  setTimeout(function(){
    var dataURL = canvas.toDataURL({format: "png"});
    $('.management-right-preview').html('<img src="' + dataURL + '" alt="Preview Image">');
  },1000);
}

function showSingleIcon() {
  $('.delete-icon').css('display','none');
  $(this).find('.delete-icon').css('display','block');
  // Show Preview
  var ident = $(this).attr('class');
  $.getJSON('/iconlist', function(data) {
    var filen;
    var fileloc;
    $.each(data, function() {
      if (this._id == ident) {
        filen = this.filename;
        fileloc = this.savename;
      }
    });
    $('.management-right-name h2').text(filen);
    $('.management-right-preview').html("<img src='icons/" + fileloc + "' alt='image preview'>");
  });
}

function showSingleImage() {
  $('.delete-icon').css('display','none');
  $(this).find('.delete-icon').css('display','block');
  // Show Preview
  var ident = $(this).attr('class');
  $.getJSON('/imagelist', function(data) {
    var filen;
    var fileloc;
    $.each(data, function() {
      if (this._id == ident) {
        filen = this.filename;
        fileloc = this.savename;
      }
    });
    $('.management-right-name h2').text(filen);
    $('.management-right-preview').html("<img src='bg/" + fileloc + "' alt='image preview'>");
  });
}

function populateImageTable() {
  event.preventDefault();
  var tableContent = '';
  $.getJSON( '/iconlist', function( data) {
    $.each(data, function(){
      if (this.username == getCookie('id')) {
        tableContent += '<li><div class="';
        tableContent += this._id;
        tableContent += '"><p>';
        tableContent += this.filename;
        tableContent += '</p><button class="delete-icon"></button></div></li>';
      }
    });
    $('.management-left ul').html(tableContent);
    $('.management-left > p').text('My Images');
    $('.delete-icon').on("click",deleteIconSingle);
    $('.management-left ul li div').on('click',showSingleIcon);
  });
};

function deleteIconSingle(event) {
  event.preventDefault();
  var ident = $(this).parent().attr("class");
  var deletememe = {
    'id': ident
  }
  $.ajax({
    type: 'POST',
    data: deletememe,
    url: '/deleteimage',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      // Update list of memes
      populateImageTable();
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
};

/*function populateBgTable() {
  event.preventDefault();
  var tableContent = '';
  $.getJSON( '/imagelist', function( data) {
    $.each(data, function(){
      if (this.username == getCookie('id')) {
        tableContent += '<li><div class="';
        tableContent += this._id;
        tableContent += '"><p>';
        tableContent += this.filename;
        tableContent += '</p><button class="delete-icon"></button></div></li>';
      }
    });
    $('.management-left ul').html(tableContent);
    $('.management-left > p').text('My Backgrounds');
    $('.delete-icon').on("click",deleteImageSingle);
    $('.management-left ul li div').on('click',showSingleImage);
  });
}; */

function deleteImageSingle(event) {
  event.preventDefault();
  var ident = $(this).parent().attr("class");
  var deletememe = {
    id: ident
  }
  $.ajax({
    type: 'POST',
    data: deletememe,
    url: '/deletebg',
    dataType: 'JSON'
  })
  .done(function(response){
    // Analyze response message from server
    if (response.msg === '') {
      // Update list of memes
      populateBgTable();
    } else {
      // Throw error if there is one
      alert('Error: ' + response.msg);
    }
  });
};

function loadProfiles() {
  $.getJSON( '/profilelist', function(data) {
    profileList.length = 0;
    $.each(data, function() {
      if(this.username == getCookie('id')) {
        profileList.push(this.profileName);
      }
    });
  }).done(function() {
    populateProfileList();
    populateMemeTable();
  });
}

function populateProfileList() {
  var profileTable = '';
  for(i=0; i < profileList.length; i++) {
        profileTable += '<option>';
        profileTable += profileList[i];
        profileTable += '</option>';
  }
  $('#profile-choice').html(profileTable);
}

function populateTable() {
  if($('.management-left > p')[0].textContent == "My Images")
    populateImageTable();
  else
    populateMemeTable();

}