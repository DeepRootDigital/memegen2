var textcount = 0;
var imagecount = 0;
var linecount = 0;
var boxcount = 0;
var canvas = new fabric.Canvas('c');
var memeListData = [];
var activeObject;
var templatename;
var objectsOnCanvas = [];
var lockedObjs = [];

// Default Object class
function Obj(obj, objType) {
  this.obj = obj;
  this.objType = objType;
  this.isLocked = false;
  this.lockIndex = -1;
}

// Creating LockedObjects class
function LockedObject(objects, index) {
  objects = objects;
  index = index;
}


// Accessors
function getIsLocked() {
  return this.isLocked;
}

$(document).ready(function(){
	// Open new tab with image to be saved
	$('.downloadmeme').click(function(){
		var formattype = $(this).attr('id');
    canvas.deactivateAllWithDispatch().renderAll();
    var dataURL = canvas.toDataURL({format: formattype});
    window.open(dataURL);
  });

    $('#bg-dropzone').dropzone({ 
    url: '/uploadicon',
    init: function() {
      this.on("success", function(file) {
        listBgs();  
        $('.upload-response').animate({'height':'60px'},function(){
          setTimeout(function(){
            $('.upload-response').animate({'height':'0px'},300);
          },1500);
        });
      });
    },
    headers: { "un" : getCookie('id'),
                "img_type" : "bg" },
    previewsContainer: "#previewCon"
  });



	// Populate saved memes the select menu to be loaded
	populateTable();
	// Populate background images to the select menu
	listImages();
	// Populate icons to their select menu
	listIcons();
  listBgs();
  listProfiles();
  socialLoad();
  canvasBindings();
  activeObjects();

  // Code for testing the array of objects on the canvas
  //setInterval(function(){console.log("Current Num Objects" + objectsOnCanvas.length);}, 1000);

  // Bring activeObject forward
  $('.bringforward').click(function(){
    var active = activeObject;
    canvas.bringForward(activeObject);
    canvas.deactivateAllWithDispatch().renderAll();
    canvas.setActiveObject(active);
  });
  // Send activeObject back
  $('.sendbackward').click(function(){
    var active = activeObject;
    canvas.sendBackwards(activeObject);
    canvas.deactivateAllWithDispatch().renderAll();
    canvas.setActiveObject(active);
  });

$(function(){
    /*
     * this swallows backspace keys on any non-input element.
     * stops backspace -> back
     */
    var rx = /INPUT|SELECT|TEXTAREA/i;

    $(document).bind("keydown keypress", function(e){
        if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                e.preventDefault();
            }
        }
    });
});

  // Add delete function for active objects
  window.onkeyup = function(event) {
    if (event.keyCode == 46 || event.keyCode == 63272) {
      event.preventDefault();
      if (activeObject) {
        canvas.remove(activeObject);

        var index = -1;
        for(i = 0; i < objectsOnCanvas.length; i++) {
          if(objectsOnCanvas[i].obj == activeObject) {
            index = i;
            break;
          }
        }

        if(index != -1) {
          objectsOnCanvas.splice(index,1);
          removeObject(index);
        }
      }
    }
  };

  $('.mememaker-left').on('mousedown',function(){
    $('.box').removeClass('box');
    $('.line').removeClass('line');
    $('.textb').removeClass('textb');
    $('.bg').removeClass('bg');
    $('.icons').removeClass('icons');
    $('.save').removeClass('save');
    $('.dl').removeClass('dl');
    $('.memeload').removeClass('memeload');
  });

});

function activeObjects(){
  // Delete objects if they are dragged off to the left
  canvas.on('object:selected', function(e){
    activeObject = canvas.getActiveObject();
    if ( activeObject ) {
      if ( activeObject.get('left') > 630 ) {
        canvas.remove(activeObject);
      }
      $('.active-container > div').css('display','none');
      if ( activeObject.get('type') == "i-text" ) {
        $('.active-container > .updatetext').css('display','block');
        $('.updatetext #updatetext-color').val(activeObject.fill);
        document.getElementById("updatetext-color").style.backgroundColor = activeObject.fill;
        $('.updatetext #updatetext-fontsize').val(activeObject.fontSize);
      } else if ( activeObject.get('type') == "image" ) {
        $('.active-container > .updateicons').css('display','block');
      } else if ( activeObject.get('type') == "rect" ) {
        $('.active-container > .updatebox').css('display','block');
        $('.updatebox #updatebox-color').val(activeObject.fill);
        $('.updatebox #updatebox-opacity').val(activeObject.opacity);
      } else if ( activeObject.get('type') == "line" ) {
        $('.active-container > .updateline').css('display','block');
        $('.updateline #updateline-color').val(activeObject.stroke);
        document.getElementById("updateline-color").style.backgroundColor = activeObject.fill;
        $('.updateline #updateline-lw').val(activeObject.strokeWidth);
      }
    }
  });

  // Clear activeobject edits when selection dropped
  canvas.on("selection:cleared", function(event){
    $('.active-container > div').css('display','none');
    $('.active-container .updatecanvas').css('display','block');
  });

}

// Function for canvas bindings
function canvasBindings() {
  // Click trigger to save a meme
  $('#savememe').on('click', saveMeme);
  // Click trigger to load meme on canvas
  $('#memeLoad').on('click', loadCanvas);
  // Click trigger to load image on canvas bg
  $('#background-choice-submit').on('click', loadImageCanvas);
  // Click trigger to load icon on canvas
  $('#icon-choice-submit').on('click', loadIconCanvas);
  // Click trigger to resize canvas
  $('#canvas-resize').on('click', resizeCanvas);
  // Add text to the meme canvas
  $('#addtext-add').on('click', addText);
  // Update text of active object
  $('#updatetext').on('click', updateText);
  // Add shape-line
  $('#addshape-line').on('click', addLine);
  // Update line of active object
  $('#updateline').on('click', updateLine);
  // Add shape-box
  $('#addshape-box').on('click', addBox);
  // Update box of active object
  $('#updatebox').on('click', updateBox);
  // Click to clear the canvas
  $('#canvas-clear').on('click', clearCanvas);
  // Lock item button
  $('#lock-objects').on('click', lockObjects);
  // Overlay Size
  $('#overlay-btn').on('click', setOverlaySize);
  // Body text
  $('#body-text-btn').on('click', function(a) {
    var text = $('#body-text').val();
    changeText(a.currentTarget.className, text);
  });
  $('#footer-text-btn').on('click', function(a) {
    var text = $('#footer-text').val();
    changeText(a.currentTarget.className, text);

  });
  $('#author-text-btn').on('click', function(a) {
    var text = $('#author-text').val();
    changeText(a.currentTarget.className, text);

  });
  $('#domain-text-btn').on('click', function(a) {
    var text = $('#domain-text').val();
    changeText(a.currentTarget.className, text);
  });
  $('#overlay-selection').on('change', switchTemplate);
  $('#color-select-btn').on('click', changeOverlayColor);
  $('#font-select-btn').on('click', changeFontColor);
  $('#profile-choice').on('change', switchProfile);
  $('#bg-grayscale').on('click', function() {
      var isChecked = document.getElementById("bg-grayscale").checked;
      var img = findObjectByName("bg");
      applyGrayscale(isChecked, img);
      bgImgGrayscale = isChecked;
  });
  $('#logo-grayscale').on('click', function() {
      var isChecked = document.getElementById("logo-grayscale").checked;
      var img = findObjectByName("logo");
      applyGrayscale(isChecked, img);
      logoImgGrayscale = isChecked;
  });
  $('#bg-btn').on('click', function() {
    var object = findObjectByName("bg");
    var opacity = document.getElementById("bg-opacity").value;
    document.getElementById("bg-opacity").value = setOpacity(object, opacity);
  });
  $('#logo-btn').on('click', function() {
    var object = findObjectByName("logo");
    var opacity = document.getElementById("logo-opacity").value;
    var newOpacity = setOpacity(object, opacity);
    document.getElementById("logo-opacity").value = newOpacity;
    logoImgOpacity = newOpacity;
  });
  $('#bg-select-btn').on('click', switchBackground)
}

// Function to save the meme that is fired on clicking button
function saveMeme(event){
	event.preventDefault();
  canvas.deactivateAllWithDispatch().renderAll();
	// Basic validation to check name isn't empty, probably need more validation
	if ($('#memename').val() === '') {
		// Alert and return false if the name fails validation.
		alert('Please fill in the name.');
		return false;
	} else {
    // Get the name entered
    var memename = $('#memename').val();
    // Check if the username is in use
    $.getJSON( '/memelist', function( data ) {
      var inuse = false;
      memeListData = data;
      // For each of the memes generate the HTML
      $.each(data, function(){
        if (this.memename == memename && this.username == getCookie('id')) {
          inuse = true;
        }
      });
      if (inuse == false) {
        // Get the canvas sizes
        var canvasheight = $('.canvas-container').css('height');
        var canvaswidth = $('.canvas-container').css('width');
        // Get the json string for the current canvas
        var jsonstring = JSON.stringify(canvas);
        // Get the user that is saving
        var usern = getCookie('id');

        var profileName = $('#profile-choice').find('option:selected')[0].innerHTML;
        if(!profileName) {
          window.alert("You must select a profile before you can save.")
          return;
        }
        // Turn the data into an object to be submitted
        var newMeme = {
          'memename' : memename,
          'json' : jsonstring,
          'username' : usern,
          'profileName' : profileName,
          'height' : canvasheight,
          'width' : canvaswidth
        }
        // Execute ajax request
        $.ajax({
          type: 'POST',
          data: newMeme,
          url: '/addmeme',
          dataType: 'JSON'
        })
        .done(function(response){
          // Analyze response message from server
          if (response.msg === '') {
            // Clear the name field
            $('#memename').val('');
            // Update list of memes
            populateTable();
            $('.upload-response p').text('Meme Saved');
            $('.upload-response').animate({'height':'60px'},function(){
              setTimeout(function(){
                $('.upload-response').animate({'height':'0px'},300,function(){
                  $('.upload-response p').text('File Uploaded');
                });
              },1500);
            });
          } else {
            // Throw error if there is one
            alert('Error: ' + response.msg);
          }
        });
      } else {
        var confirmation = confirm('This name is in use already. Do you want to overwrite it?');
        if (confirmation == true) {
          // Get the canvas sizes
          var canvasheight = $('.canvas-container').css('height');
          var canvaswidth = $('.canvas-container').css('width');
          // Get the json string for the current canvas
          var jsonstring = JSON.stringify(canvas);
          // Get the user that is saving
          var usern = getCookie('id');
          // Turn the data into an object to be submitted
          var newMeme = {
            'memename' : memename,
            'json' : jsonstring,
            'username' : usern,
            'height' : canvasheight,
            'width' : canvaswidth
          }
          // Execute ajax request
          $.ajax({
            type: 'POST',
            data: newMeme,
            url: '/updatememe',
            dataType: 'JSON'
          })
          .done(function(response){
            // Analyze response message from server
            if (response.msg === '') {
              // Clear the name field
              $('#memename').val('');
              // Update list of memes
              populateTable();
              $('.upload-response p').text('Meme Saved');
              $('.upload-response').animate({'height':'60px'},function(){
                setTimeout(function(){
                  $('.upload-response').animate({'height':'0px'},300,function(){
                    $('.upload-response p').text('File Uploaded');
                  });
                },1500);
              });
            } else {
              // Throw error if there is one
              alert('Error: ' + response.msg);
            }
          });
        } else {
        }
      }
    });
}
};

function populateTable() {
	var tableContent = '';
	$.getJSON( '/memelist', function( data ) {
		memeListData = data;
		// For each of the memes generate the HTML
		$.each(data, function(){
      if (this.username == getCookie('id')) {
        tableContent += '<option>';
        tableContent += this.memename;
        tableContent += '</option>';
      }
    });
		// Insert into the meme loading selector
		$('#memeLoadSelector').html(tableContent);
	});
};

function loadCanvas(event) {
	event.preventDefault();
	// Confirm that you want to load the saved canvas state
	var confirmation = confirm('Are you sure you want to load? It will overwrite current progress.');
	if (confirmation === true) {
		var thisMeme = $('#memeLoadSelector').val();
		var arrayPosition = memeListData.map(function(arrayItem) { return arrayItem.memename; }).indexOf(thisMeme);
		var thisMemeObject = memeListData[arrayPosition];
		// Render canvas to the saved state
    $('#dropzone').html('<canvas id="c" width="' + thisMemeObject.width + 'px" height="' + thisMemeObject.height + 'px"></canvas>');
    canvas = new fabric.Canvas('c');
    canvas.loadFromJSON(thisMemeObject.json,function(){
      applyImageFilters();
    });
    activeObjects();
  } else {
    return false;
  }
};

function applyImageFilters() {
  canvas.forEachObject(function(obj) {
    if(obj.type === 'image' && obj.filters.length) {
      obj.applyFilters(function(){
        obj.canvas.renderAll();
      });
    } else {
      canvas.renderAll();
    }
  });
}

function listImages() {
	var imageTable = '';
	$.getJSON( '/imagelist', function( data) {
		$.each(data, function(){
      if (this.username == getCookie('id')) {
       imageTable += '<option>';
       imageTable += this.filename;
       imageTable += '</option>';
     }
   });
		$('#background-choice').html(imageTable);
	});
};

function loadImageCanvas(event) {
	event.preventDefault();
	var thisImage = $('#background-choice').val();
	$.getJSON( '/imagelist', function( data ) {
		var arrayPosition = data.map(function(arrayItem) { return arrayItem.filename; }).indexOf(thisImage);
		var thisImageObject = data[arrayPosition];
		canvas.setBackgroundImage( 'bg/' + thisImageObject.savename, canvas.renderAll.bind(canvas) );
	});
};

function listIcons() {
	var iconTable = '';
	$.getJSON( '/iconlist', function( data) {
		$.each(data, function(){
      if (getCookie('id') == this.username ) {
        iconTable += '<option>';
        iconTable += this.filename;
        iconTable += '</option>';
      }
    });
		$('#icon-choice').html(iconTable);
	});
};

function listProfiles() {
  var profileTable = '';
  $.getJSON( '/profilelist', function( data) {
    $.each(data, function(){
      if (getCookie('id') == this.username ) {
        profileTable += '<option>';
        profileTable += this.profileName;
        profileTable += '</option>';
      }
    });
    $('#profile-choice').html(profileTable);
  });
};

function loadIconCanvas(event) {
	event.preventDefault();
	var thisIcon = $('#icon-choice').val();
  var grayscale = false;
  if (document.getElementById('icon-grayscale').checked) {
    grayscale = true;
  }
  $.getJSON( '/iconlist', function( data ) {
    var arrayPosition = data.map(function(arrayItem) { return arrayItem.filename; }).indexOf(thisIcon);
    var thisIconObject = data[arrayPosition];
    idnum = window.imagecount + 1;
    idnum = "image_" + idnum;
    fabric.Image.fromURL('icons/' + thisIconObject.savename,function(smallimage) {
      smallimage.set('id',idnum);
      if (grayscale == true) {
        smallimage.filters.push(new fabric.Image.filters.Grayscale());
        smallimage.applyFilters(canvas.renderAll.bind(canvas));
      }
      canvas.add(smallimage);
    });
    window.imagecount = window.imagecount + 1;
  });
};

function dropzoneCanvas(filename) {
  var thisIcon = filename;
  idnum = window.imagecount + 1;
  idnum = "image_" + idnum;
  fabric.Image.fromURL('icons/' + thisIcon,function(smallimage) {
    smallimage.set('id',idnum);
    canvas.add(smallimage);
  });
  window.imagecount = window.imagecount + 1;
}

function addText(event) {
  idnum = window.textcount + 1;
  idnum = "text_" + idnum;
  var textcontent = document.getElementById('addtext-text').value;
  var textcolor = document.getElementById('addtext-color').value;
  textcolor = "#" + textcolor;
  var textsize = $('#addtext-fontsize').slider("option","value");
  if (textsize == 0) {
    textsize = 12;
  }
  var textlh = parseInt(textsize * 1.2);
  var newText = new fabric.IText(textcontent, {
    fontFamily: 'Helvetica',
    fontSize: textsize,
    fill: textcolor,
    lineHeight: 1,
    id: idnum
  });
  canvas.add(newText);
  window.textcount = window.textcount + 1;
  closecontainers("textBox");
  canvas.setActiveObject(newText);

  var newObj = new Obj(newText, "Text");
  objectsOnCanvas.push(newObj);
  var textname = "Text " + window.textcount;
  addObject(textname, objectsOnCanvas.length-1);
}

function updateText(event) {
  var newtextcolor = document.getElementById('updatetext-color').value;
  newtextcolor = "#" + newtextcolor;
  var newtextsize = parseInt(document.getElementById('updatetext-fontsize').value);
  if (canvas.backgroundColor) {
    var backgroundcolor = canvas.backgroundColor;
  } else {
    var backgroundcolor = 'rgba(0,0,0,0)';
  }
  activeObject.fill = newtextcolor;
  activeObject.fontSize = newtextsize;
  canvas.setBackgroundColor(backgroundcolor, canvas.renderAll.bind(canvas));

}

function addLine(){
  var bgcolor = $('#addshape-color').val();
  bgcolor = "#" + bgcolor;
  var lw = $('#addshape-lw').val();
  if (lw == '0' || lw == '') {
    lw = 1;
  }
  lw = parseInt(lw);
  if (bgcolor == '') {
    bgcolor = '#ffffff';
  }
  var idnum = "line_" + window.linecount;
  var newShape = new fabric.Line([50,50,150,50], {
   top: 100,
   left: 100,
   stroke: bgcolor,
   strokeWidth: lw
 });
  newShape.set('id',idnum);
  canvas.add(newShape);
  window.linecount += 1;
  closecontainers("line");
  canvas.setActiveObject(newShape);

  var newObj = new Obj(newShape, "Line");
  objectsOnCanvas.push(newObj);
  var shapeName = "Line " + window.linecount;
  addObject(shapeName, objectsOnCanvas.length-1);
}

function updateLine() {
  var newlinecolor = document.getElementById('updateline-color').value;
  if(newlinecolor[0] != '#')
    newlinecolor = "#" + newlinecolor;
  var newlinelw = parseInt(document.getElementById('updateline-lw').value);
  if (canvas.backgroundColor) {
    var backgroundcolor = canvas.backgroundColor;
  } else {
    var backgroundcolor = 'rgba(0,0,0,0)';
  }
  activeObject.stroke = newlinecolor;
  activeObject.strokeWidth = newlinelw;
  canvas.setBackgroundColor(backgroundcolor, canvas.renderAll.bind(canvas));
}

function addBox(){
  var bgcolor = $('#addbox-color').val();
  bgcolor = "#" + bgcolor;
  var opa = $('#addshape-opacity').slider("option","value");
  if (opa == '') {
    opa = 1;
  }
  if (bgcolor == '') {
    bgcolor = '#ffffff';
  }
  var idnum = "box_" + window.boxcount;
  var newShape = new fabric.Rect({
   width: 100,
   height: 100,
   top: 100,
   left: 100,
   fill: bgcolor,
   opacity: opa
 });
  newShape.set('id',idnum);
  canvas.add(newShape);
  window.boxcount += 1;
  closecontainers("box");
  canvas.setActiveObject(newShape);

  var newObj = new Obj(newShape, "Box");
  objectsOnCanvas.push(newObj);
  var boxName = "Box " + window.boxcount;
  addObject(boxName, objectsOnCanvas.length-1);
}

function updateBox() {
  var newboxcolor = document.getElementById('updatebox-color').value;
  if(newboxcolor[0] != '#')
    newboxcolor = "#" + newboxcolor;
  var newboxopa = document.getElementById('updatebox-opacity').value;
  if (canvas.backgroundColor) {
    var backgroundcolor = canvas.backgroundColor;
  } else {
    var backgroundcolor = 'rgba(0,0,0,0)';
  }
  activeObject.fill = newboxcolor;
  activeObject.opacity = newboxopa;
  canvas.setBackgroundColor(backgroundcolor, canvas.renderAll.bind(canvas));

}

function resizeCanvas(event) {
	// Resize the canvas in all aspects and resize stuff on the canvas
	event.preventDefault();
	var width = $('#canvas-width').val();
	var height = $('#canvas-height').val();
	sizecanvas(width,height);
	var jsonstring = canvas.toJSON();
	canvas.loadFromJSON(jsonstring,canvas.renderAll.bind(canvas));
}

function socialLoad() {
  if (getCookie("templatename")) {
    templatename = getCookie("templatename");
    document.cookie = "templatename=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (templatename == "facebook") {
      var height = 504;
      var width = 403;
      sizecanvas(width,height);
    } else if (templatename == "twitter") {
      var height = 220;
      var width = 440;
      sizecanvas(width,height);
    } else {
      $.getJSON( '/memelist', function( data ) {
        $.each(data, function(){
          if (this.username == getCookie('id') && this.memename == templatename) {
            $('#dropzone').html('<canvas id="c" width="' + this.width + 'px" height="' + this.height + 'px"></canvas>');
            canvas = new fabric.Canvas('c');
            canvas.loadFromJSON(this.json,function(){
              applyImageFilters();
            });
            activeObjects();
            return;
          }
        });
      });
    }
  } else {
    var height = 651;
    var width = 630;
    sizecanvas(width,height);
  }
  
}

// Clear all items on the canvas
function clearCanvas() {
  canvas.clear().renderAll();
  canvas.setBackgroundImage = 0;
  canvas.setBackgroundColor('rgba(0,0,0,0)', canvas.renderAll.bind(canvas));


   // Remove all items from the object array
  document.getElementById("objects-on-canvas").innerHTML = "";
  objectsOnCanvas.length = 0;
  objects.length = 0;
}

function sizecanvas(width,height) {
  $('.canvas-container').css('width',width+'px');
  $('.canvas-container').css('height',height+'px');
  $('#c').attr('width',width+'px');
  $('#c').attr('height',height+'px');
  $('#c').css('width',width+'px');
  $('#c').css('height',height+'px');
  $('.upper-canvas').attr('width',width+'px');
  $('.upper-canvas').attr('height',height+'px');
  $('.upper-canvas').css('width',width+'px');
  $('.upper-canvas').css('height',height+'px');
  canvas.width = width;
  canvas.height = height;
}

// Adds the object to the selectable list
function addObject(object, index) {
  return;
  var ul = document.getElementById("objects-on-canvas");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(object));
  li.setAttribute("id", index);
  li.setAttribute("onclick", "selectObject(id)");
  ul.appendChild(li);
}

// Removes an object from the selectable list
function removeObject(index) {
  var ul = document.getElementById("objects-on-canvas");
  var children = ul.children;
  ul.removeChild(children[index]);
  adjustIds(index);
}

// Allows for clicking on the list items
function selectObject(index) {
  /*var curObj = objectsOnCanvas[index];
  if(curObj.isLocked == true) {
    var lockedObjects = [];
    var curLockedObjs = lockedObjs[curObj.lockIndex];
    for(i = 0; i < curLockedObjs.length; i++) {
      lockedObjects.push(curLockedObjs[i]);
    }
    var group = new fabric.Group(lockedObjects, {
      left: 150,
      top: 100
    });
    canvas.setActiveGroup(group).renderAll();
  }
  else {
    canvas.setActiveObject(objectsOnCanvas[index].obj);
  }*/
  canvas.setActiveObject(objectsOnCanvas[index].obj);
}

// Helper function to adjust ids of the objects when another one is removed
function adjustIds(index) {
  var ul = document.getElementById("objects-on-canvas");
  var children = ul.children;
  for(i = index ; i < objectsOnCanvas.length; i++) {
    var prevID = children[i].getAttribute("id");
    var newIndex = prevID - 1;
    children[i].setAttribute("id", newIndex);
  }
}

// Used to lock items to each other
function lockObjects() {
  var group = canvas.getActiveGroup();
  if(!group)
      return;

  var lockedIndex = lockedObjs.length;
  var newLockedObject = new LockedObject(group, lockedIndex);
  lockedObjs.push(newLockedObject);


  for(i = 0; i < group.size(); i++) {
    var index = getIndex(group.item(i));
    if(index != -1) {
        objectsOnCanvas[index].isLocked = true;
        objectsOnCanvas[index].lockIndex = lockedIndex;
      }
  }
}

function unlockObject(object) {
  if(object.getIsLocked() == false)
    return;



}

// Returns the index of where the obj is in the array
// Returns -1 if it is not in the array
function getIndex(object) {
  if(!object)
    return -1;

  for(i = 0; i < objectsOnCanvas.length; i++) {
    if(objectsOnCanvas[i].obj == object)
      return i;
  }

  return -1;
}

function setOverlaySize() {
  var overlay = document.getElementById("overlay-input");

  var validFloat = parseFloat(overlay.value);
  
  if(isNaN(validFloat))
    overlay.value = 0;

  if(overlay.value < 0)
    overlay.value = 0;
  else if (overlay.value > 100)
    overlay.value = 100;
  
  overlaySize = overlay.value * 0.01;
  switchTemplate();
}

function populateEditor() {
  var index = -1;
  for(i=0; i < profileList.length; i++) {
    if(profileList[i].isActive == "true") {
      index = i;
      break;
    }
  }

  if(index == -1) {

  }
  else {
    logoURL = "icons/" + profileList[index].logo;
    domainName = profileList[index].domainName;
    overlayColor = hexToRgb(profileList[index].overlayColor, .5);
    fontColor = hexToRgb(profileList[index].fontColor, 1);
    fontType = profileList[index].fontType;
    document.getElementById("profile-choice").selectedIndex = index;
    document.getElementById("rgb-value").value = profileList[index].overlayColor;

  }

  document.getElementById("body-text").value = bodyText;
  document.getElementById("footer-text").value = footerText;
  document.getElementById("author-text").value = authorText;
  document.getElementById("overlay-input").value = overlaySize * 100;
  document.getElementById("opacity-value").value = .5;


  switchTemplate();
}

function switchTemplate() {
  var selection = $('#overlay-selection').find('option:selected')[0].innerHTML;
  currentTemplate = selection;
  generateTemplate(overlaySize, currentTemplate)
}

function changeOverlayColor() {
  var colorHex = document.getElementById("rgb-value").value;
  var opacity = document.getElementById("opacity-value").value;

  overlayColor = hexToRgb(colorHex, opacity);
  var overlay = findObjectByName("overlayBox");
  overlay.fill = overlayColor;
  canvas.renderAll();
}

function changeFontColor() {
  var colorHex = document.getElementById("font-rgb-value").value;
  var opacity = document.getElementById("font-opacity-value").value;

  fontColor = hexToRgb(colorHex, opacity);
  // Set initial values
  var texts = [ findObjectByName("bodyText"), findObjectByName("footerText"), findObjectByName("authorText"), 
                findObjectByName("domainText"), findObjectByName("botHR"), findObjectByName("topHR")];
  for(i=0;i<texts.length;i++) {
    texts[i].fill = fontColor;
  }
  canvas.renderAll();
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

    document.getElementById("opacity-value").value = a;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function switchProfile() {
  var activeProfile = document.getElementById("profile-choice").value;
  setActive(activeProfile);
}

function applyGrayscale(isChecked, img) {
  if(isChecked)
    img.filters.push(new fabric.Image.filters.Grayscale());
  else 
    img.filters.pop(new fabric.Image.filters.Grayscale());

    img.applyFilters(canvas.renderAll.bind(canvas));

}

function setOpacity(object, opacity) {
  var newOpacity = parseFloat(opacity);
  
  if(isNaN(newOpacity) || newOpacity > 1)
    newOpacity = 1;
  else if(newOpacity < 0)
    newOpacity = 0;

  object.setOpacity(newOpacity);
  canvas.renderAll();
  return newOpacity;
}

function listBgs() {
  var iconTable = '';
  $.getJSON( '/iconlist', function( data) {
    $.each(data, function(){
      if (getCookie('id') == this.username && this.img_type == "bg") {
        iconTable += '<option>';
        iconTable += this.filename;
        iconTable += '</option>';
      }
    });
    $('#bg-select').html(iconTable);
  });
}

function switchBackground() {
  if($('#bg-select').find('option:selected').length == 0)
   return;

  var bgLoc = "icons/" + getCookie('id') + '_' + $('#bg-select').find('option:selected')[0].value;
  canvasBackground = bgLoc;
  switchTemplate();
}