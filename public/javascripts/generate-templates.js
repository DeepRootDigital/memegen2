// Object Types
// "OVERLAY", "TEXT", "IMG", "HR"

var canvasWidth = 0;
var canvasHeight = 0;
var objects = [];
var overlaySize = .75;
var overlayColor = "rgba(255,0,0,0.85)";
var fontColor = "rgba(255,255,255,.75)";
var fontType = "";
var bodyColor = "rgba(255,255,255,.75)";
var footerColor = "rgba(255,255,255,.75)";
var authorColor = "rgba(255,255,255,.75)";
var bodyTextSize = 25;
var footerTextSize = 18;
var authorTextSize = 16;
var domainFontSize = 20;
var domainName = "businessonmarketst.com";
var logoURL = "icons/bms_logo.png";
var canvasBackground = "bg/colpan_gaslamp.jpg";
var bodyText = "Main text";
var footerText = "Additional text";
var authorText = "Additional text 2";
var bgImgOpacity = 1;
var bgImgGrayscale = false;
var logoImgOpacity = 1;
var logoImgGrayscale = false;
var currentTemplate = "Left";



$(document).ready(function() {
  canvasWidth = canvas.getWidth();
  canvasHeight = canvas.getHeight();
});

function CanvasObject(objName, objType, objObject) {
  this.objName = objName;
  this.objType = objType;
  this.objObject = objObject;
}

function generateTemplate(overlayWidth, templateType) {
  clearCanvas();

  var rect;
  switch(templateType) {
    case "Left":
      rect = new fabric.Rect({
        width: canvasWidth * overlayWidth,
        height: canvasHeight,
        fill : overlayColor,
        top: 0,
        left: 0
      });
    break;
    case "Right":
      rect = new fabric.Rect({
        width: canvasWidth * overlayWidth,
        height: canvasHeight,
        fill : overlayColor,
        top : 0,
        left : canvasWidth - (canvasWidth * overlayWidth)
      });
    break;
    case "Top":
      rect = new fabric.Rect({
        width: canvasWidth,
        height: canvasHeight * overlayWidth,
        fill : overlayColor,
        top : 0,
        left : 0
      });
    break;
    case "Bottom":
      rect = new fabric.Rect({
        width: canvasWidth,
        height: canvasHeight * overlayWidth,
        fill : overlayColor,
        top : canvasHeight - (canvasHeight * overlayWidth),
        left : 0
      });
    break;
    case "Full":
      rect = new fabric.Rect({
        width: canvasWidth,
        height: canvasHeight,
        fill : overlayColor,
        top : 0,
        left : 0
      });
    break;

  }

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);

  var adjustedWidth = rect.width;
  if(adjustedWidth == 0)
    adjustedWidth = canvasWidth;

  var lineWidth = adjustedWidth * .8;
  var line = new fabric.Rect({
    width: lineWidth,
    height: 1,
    fill: bodyColor,
    top: rect.top + 40,
    left: rect.left + (lineWidth * .10)
  });

  var topHR = new CanvasObject("topHR", "HR", line);

  var text = new fabric.Text(bodyText, {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: bodyColor,
    top: line.top + 5,
    left: line.left
  });

  var body = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: bodyColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text(footerText, {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: footerColor,
    top: line2.top + 10,
    left: line.left
  });

  var footer = new CanvasObject("footerText", "TEXT", text2);

  var text3 = new fabric.Text(authorText, {
    fontFamily: fontType,
    fontSize: authorTextSize,
    fill: authorColor,
    top: text2.top + text2.height + 3,
    left: line.left
  });

  var footerAuthorText = new CanvasObject("authorText", "TEXT", text3);

  var topHeight = rect.height - 60;
  if(currentTemplate == "Bottom")
    topHeight = canvasHeight - 60;

  var domain = new fabric.Text(domainName, {
    fontFamily: fontType,
    fontSize: domainFontSize,
    fill: bodyColor,
    top: topHeight,
    left: line.left
  });
  
  if(domain.width > rect.width) {
      domain.setFontSize (0.8 * domainFontSize);
  }

  var domainText = new CanvasObject("domainText", "TEXT", domain);

  var logo = new fabric.Image.fromURL(logoURL, function(img) {
    var domain;
    var overlay;
    for(i=0; i < objects.length; i++) {
      if(objects[i].objName == "domainText")
        domain = objects[i].objObject;
      else if(objects[i].objName == "overlayBox")
        overlay = objects[i].objObject;
    }

    img.top = domain.top - (img.height + 5);
    img.left = domain.left;
    img.opacity = logoImgOpacity;
    if(logoImgGrayscale)
      img.filters.push(new fabric.Image.filters.Grayscale());
    
    if(objects[objectIndex("logo")].objObject) 
      return;
    

    canvas.add(img);
    lockObject(img);
    objects[objectIndex("logo")].objObject = img;
  });

  var logoImg = new CanvasObject("logo", "IMG", logoImg);

  var bg = new fabric.Image.fromURL(canvasBackground, function(img) {
    img.width = canvasWidth;
    img.height = canvasHeight;
    img.opacity = bgImgOpacity;
    if(bgImgGrayscale)
      img.filters.push(new fabric.Image.filters.Grayscale());

    if(objects[objectIndex("bg")].objObject)
      return;

    canvas.add(img);
    img.sendToBack();
    lockObject(img);
    objects[objectIndex("bg")].objObject = img;
  });

  var bgImg = new CanvasObject("bg", "IMG", bgImg);

  objects.push(bgImg);
  objects.push(overlay);
  objects.push(topHR);
  objects.push(botHR);
  objects.push(body);
  objects.push(footer);
  objects.push(domainText);
  objects.push(footerAuthorText);
  objects.push(logoImg);

  addObjectsToCanvas();
}

function lockObject(object) {
  object.lockMovementX = true;
  object.lockMovementY = true;
  object.lockRotaion = true;
  object.lockScalingFlip = true;
  object.lockScalingX = true;
  object.lockScalingY = true;
  object.lockUniScaling = true;
}

function getCenter(axis, offset) {
  var center = 0;
  if(axis == "height") {
    var canvasHeight = canvas.getHeight();
    center = (canvasHeight * .5) - offset;
  }
  else if(axis == "width") {
    var canvasWidth = canvas.getWidth();
    center = (canvasWidth * .5) - offset;
  }

  return center;
}

function addObjectsToCanvas() {
  for(i = 0; i < objects.length; i++) {
    if(objects[i].objType == "IMG")
      continue;

    canvas.add(objects[i].objObject);
    lockObject(objects[i].objObject);
  }
}

function setBg(img) {
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
}

function changeText(textElement, textString) {
  for(i=0; i < objects.length; i++) {
    var name = objects[i].objName;
    console.log(name);
    if( name == textElement) {
      objects[i].objObject.setText(textString);
      switch(name) {
        case "bodyText":
          bodyText = textString;
        break;
        case "footerText":
          footerText = textString;
        break;
        case "authorText":
          authorText = textString
        break;
        case "domainText":
          domainName = textString;
        break;
      }
      switchTemplate();
      return;
    }
  }
}

function findObjectByName(name) {
  for(i=0; i < objects.length; i++) {
    if(objects[i].objName == name) {
      return objects[i].objObject;
    }
  }

  return undefined;
}

function objectIndex(name) {
  for(i=0; i < objects.length; i++) {
    if(objects[i].objName == name) {
      return i;
    }
  }

  return undefined;
}

function rgbaToHex(fontColor) {
  var hex = rgb2hex(fontColor);
  document.getElementById("rgb-value").value = hex;
  document.getElementById("opacity-value").value = 1;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? 
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function loadEditor(canvas) {
  var canObj = canvas.getObjects();

  //Load all items into the objects array
  var bg = new CanvasObject("bg", "IMG", canObj[0]);
  var overlay = new CanvasObject("overlayBox", "OVERLAY", canObj[1]);
  var topHR = new CanvasObject("topHR", "HR", canObj[2]);
  var botHR = new CanvasObject("botHR", "HR", canObj[3]);
  var bodyTxt = new CanvasObject("bodyText", "TEXT", canObj[4]);
  var footerTxt = new CanvasObject("footerText", "TEXT", canObj[5]);
  var authorTxt = new CanvasObject("authorText", "TEXT", canObj[6]);
  var domainTxt = new CanvasObject("domainText", "TEXT", canObj[7]);
  var logo = new CanvasObject("logo", "IMG", canObj[8]);

  objects.push(bg);
  objects.push(overlay);
  objects.push(topHR);
  objects.push(botHR);
  objects.push(bodyTxt);
  objects.push(footerTxt);
  objects.push(authorTxt);
  objects.push(domainTxt);
  objects.push(logo);

  for(i=0; i < objects.length; i++) {
    lockObject(objects[i].objObject);
  }

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
    overlayColor = canObj[1].getFill();
    bodyTextSize = canObj[4].getFontSize(); 
    footerTextSize = canObj[5].getFontSize(); 
    authorTextSize = canObj[7].getFontSize(); 
    domainTextSize = canObj[6].getFontSize();
    bodyColor = canObj[4].getFill();
    footerColor = canObj[5].getFill();
    authorColor = canObj[7].getFill();
    domainColor = canObj[6].getFill();
    fontColor = bodyColor;
    fontType = profileList[index].fontType;
    document.getElementById("rgb-value").value = rgb2hex(overlayColor).toUpperCase();
    document.getElementById("rgb-value").style.backgroundColor = "#" + rgb2hex(overlayColor).toUpperCase();
    document.getElementById("profile-choice").selectedIndex = index;
    document.getElementById("body-text-rgb").value = rgb2hex(bodyColor).toUpperCase();
    document.getElementById("footer-text-rgb").value = rgb2hex(footerColor).toUpperCase();
    document.getElementById("author-text-rgb").value = rgb2hex(authorColor).toUpperCase();
    document.getElementById("body-text-rgb").style.backgroundColor = "#" + rgb2hex(bodyColor).toUpperCase();
    document.getElementById("footer-text-rgb").style.backgroundColor = "#" + rgb2hex(footerColor).toUpperCase();
    document.getElementById("author-text-rgb").style.backgroundColor = "#" + rgb2hex(authorColor).toUpperCase();    
  }

  document.getElementById("body-text").value = canObj[4].getText();
  document.getElementById("footer-text").value = canObj[5].getText();
  document.getElementById("author-text").value = canObj[7].getText();
  document.getElementById("body-text-font-size").value = bodyTextSize;
  document.getElementById("footer-text-font-size").value = footerTextSize;
  document.getElementById("author-text-font-size").value = authorTextSize;
  document.getElementById("opacity-value").value = .85;

  var result = (canObj[1].getWidth() / canvas.getWidth()) * 100;
  overlaySize = Math.round(result) * .01;
  document.getElementById("overlay-input").value = overlaySize * 100;

  if(canObj[0].filters.length) {
    bgImgGrayscale = true;
    document.getElementById("bg-grayscale").checked = true;
  }

  if(canObj[8].filters.length) {
    logoImgGrayscale = true;
    document.getElementById("logo-grayscale").checked = true;
  }
}