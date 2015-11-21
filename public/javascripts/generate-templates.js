// Object Types
// "OVERLAY", "TEXT", "IMG", "HR"

var canvasWidth = 0;
var canvasHeight = 0;
var objects = [];
var overlaySize = 0;
var overlayColor = "rgba(255,0,0,0.5)";
var fontColor = "rgba(255,255,255,.75)";
var fontType = 'Comic Sans';
var bodyTextSize = 25;
var footerTextSize = 18;
var footerAuthorSize = 16;
var domainFontSize = 20;
var domainText = "businessonmarketst.com";
var logoURL = "icons/bms_logo.png";
var canvasBackground = "bg/colpan_gaslamp.jpg";
var bodyText = "Main text";
var footerText = "Additional text";
var authorText = "Additional text 2";



$(document).ready(function() {
  canvasWidth = canvas.getWidth();
  canvasHeight = canvas.getHeight();
});

function CanvasObject(objName, objType, objObject) {
  this.objName = objName;
  this.objType = objType;
  this.objObject = objObject;
}

function templateLeft(overlayWidth) {
  clearCanvas();

  var rect = new fabric.Rect({
    width: canvasWidth * overlayWidth,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);

  var adjustedWidth = rect.width;
  if(adjustedWidth == 0)
    adjustedWidth = canvasWidth;

  var lineWidth = adjustedWidth * .8;
  var line = new fabric.Rect({
    width: lineWidth,
    height: 1,
    fill: fontColor,
    top: rect.top + 40,
    left: rect.left + (lineWidth * .10)
  });

  var topHR = new CanvasObject("topHR", "HR", line);

  var text = new fabric.Text(bodyText, {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: fontColor,
    top: line.top + 5,
    left: line.left
  });

  var body = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: fontColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text(footerText, {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: fontColor,
    top: line2.top + 10,
    left: line.left
  });

  var footer = new CanvasObject("footerText", "TEXT", text2);

  var text3 = new fabric.Text(authorText, {
    fontFamily: fontType,
    fontSize: footerAuthorSize,
    fill: fontColor,
    top: text2.top + text2.height + 3,
    left: line.left
  });

  var footerAuthorText = new CanvasObject("authorText", "TEXT", text3);

  var domain = new fabric.Text(domainName, {
    fontFamily: fontType,
    fontSize: domainFontSize,
    fill: fontColor,
    top: rect.height - 60,
    left: line.left
  });

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

    img.top = domain.top - 100;
    img.left = overlay.left + (img.width * .5);
    canvas.add(img);
    lockObject(img);
    objects[objectIndex("logo")].objObject = img;
  });

  var logoImg = new CanvasObject("logo", "IMG", logo);

  var bg = new fabric.Image.fromURL(canvasBackground, function(img) {
    img.width = canvasWidth;
    img.height = canvasHeight;
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

function templateRight(overlayWidth) {
  clearCanvas();
  
  var rect = new fabric.Rect({
    width: canvasWidth * overlayWidth,
    height: canvasHeight,
    fill : overlayColor,
    top : 0,
    left : canvasWidth - (canvasWidth * overlayWidth)
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);

  var lineWidth = rect.width * .8;
  var line = new fabric.Rect({
    width: lineWidth,
    height: 1,
    fill: fontColor,
    top: rect.top + 40,
    left: rect.left + (lineWidth * .10)
  });

  var topHR = new CanvasObject("topHR", "HR", line);

  var text = new fabric.Text(bodyText, {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: fontColor,
    top: line.top + 5,
    left: line.left
  });

  var body = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: fontColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text(footerText, {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: fontColor,
    top: line2.top + 10,
    left: line.left
  });

  var footer = new CanvasObject("footer", "TEXT", text2);

  var text3 = new fabric.Text(authorText, {
    fontFamily: fontType,
    fontSize: footerAuthorSize,
    fill: fontColor,
    top: text2.top + text2.height + 3,
    left: line.left
  });

  var footerAuthorText = new CanvasObject("footerAuthor", "TEXT", text3);

  var domain = new fabric.Text(domainName, {
    fontFamily: fontType,
    fontSize: domainFontSize,
    fill: fontColor,
    top: rect.height - 60,
    left: line.left
  });

  var domainText = new CanvasObject("domain", "TEXT", domain);

  var logo = new fabric.Image.fromURL(logoURL, function(img) {
    var domain;
    var overlay;
    for(i=0; i < objects.length; i++) {
      if(objects[i].objName == "domain")
        domain = objects[i].objObject;
      else if(objects[i].objName == "overlayBox")
        overlay = objects[i].objObject;
    }

    img.top = domain.top - 100;
    img.left = overlay.left + (img.width * .5);
    canvas.add(img);
    lockObject(img);
    objects[objectIndex("logo")].objObject = img;
  });

  var logoImg = new CanvasObject("logo", "IMG", logo);

  var bg = new fabric.Image.fromURL(canvasBackground, function(img) {
    img.width = canvasWidth;
    img.height = canvasHeight;
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

function templateTop(overlayHeight) {
  clearCanvas();

  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * overlayHeight,
    fill : overlayColor,
    top : 0,
    left : 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);

  var lineWidth = rect.width * .8;
  var line = new fabric.Rect({
    width: lineWidth,
    height: 1,
    fill: fontColor,
    top: rect.top + 40,
    left: rect.left + (lineWidth * .10)
  });

  var topHR = new CanvasObject("topHR", "HR", line);

  var text = new fabric.Text(bodyText, {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: fontColor,
    top: line.top + 5,
    left: line.left
  });

  var body = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: fontColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text(footerText, {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: fontColor,
    top: line2.top + 10,
    left: line.left
  });

  var footer = new CanvasObject("footer", "TEXT", text2);

  var text3 = new fabric.Text(authorText, {
    fontFamily: fontType,
    fontSize: footerAuthorSize,
    fill: fontColor,
    top: text2.top + text2.height + 3,
    left: line.left
  });

  var footerAuthorText = new CanvasObject("footerAuthor", "TEXT", text3);

  var domain = new fabric.Text(domainName, {
    fontFamily: fontType,
    fontSize: domainFontSize,
    fill: fontColor,
    top: rect.height - 60,
    left: line.left
  });

  var domainText = new CanvasObject("domain", "TEXT", domain);

  var logo = new fabric.Image.fromURL(logoURL, function(img) {
    var domain;
    var overlay;
    for(i=0; i < objects.length; i++) {
      if(objects[i].objName == "domain")
        domain = objects[i].objObject;
      else if(objects[i].objName == "overlayBox")
        overlay = objects[i].objObject;
    }

    img.top = domain.top - 100;
    img.left = overlay.left + (img.width * .5);
    canvas.add(img);
    lockObject(img);
    objects[objectIndex("logo")].objObject = img;
  });

  var logoImg = new CanvasObject("logo", "IMG", logo);

  var bg = new fabric.Image.fromURL(canvasBackground, function(img) {
    img.width = canvasWidth;
    img.height = canvasHeight;
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

function templateBottom(overlayHeight) {
  clearCanvas();

  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * overlayHeight,
    fill : overlayColor,
    top : canvasHeight - (canvasHeight * overlayHeight),
    left : 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);

  var lineWidth = rect.width * .8;
  var line = new fabric.Rect({
    width: lineWidth,
    height: 1,
    fill: fontColor,
    top: rect.top + 40,
    left: rect.left + (lineWidth * .10)
  });

  var topHR = new CanvasObject("topHR", "HR", line);

  var text = new fabric.Text(bodyText, {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: fontColor,
    top: line.top + 5,
    left: line.left
  });

  var body = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: fontColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text(footerText, {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: fontColor,
    top: line2.top + 10,
    left: line.left
  });

  var footer = new CanvasObject("footer", "TEXT", text2);

  var text3 = new fabric.Text(authorText, {
    fontFamily: fontType,
    fontSize: footerAuthorSize,
    fill: fontColor,
    top: text2.top + text2.height + 3,
    left: line.left
  });

  var footerAuthorText = new CanvasObject("footerAuthor", "TEXT", text3);

  var domain = new fabric.Text(domainName, {
    fontFamily: fontType,
    fontSize: domainFontSize,
    fill: fontColor,
    top: canvasHeight - 60,
    left: line.left
  });

  var domainText = new CanvasObject("domain", "TEXT", domain);

  var logo = new fabric.Image.fromURL(logoURL, function(img) {
    var domain;
    var overlay;
    for(i=0; i < objects.length; i++) {
      if(objects[i].objName == "domain")
        domain = objects[i].objObject;
      else if(objects[i].objName == "overlayBox")
        overlay = objects[i].objObject;
    }

    img.top = domain.top - 100;
    img.left = overlay.left + (img.width * .5);
    canvas.add(img);
    lockObject(img);
    objects[objectIndex("logo")].objObject = img;
  });

  var logoImg = new CanvasObject("logo", "IMG", logo);

  var bg = new fabric.Image.fromURL(canvasBackground, function(img) {
    img.width = canvasWidth;
    img.height = canvasHeight;
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

function templateFull() {
  clearCanvas();

  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight,
    fill : overlayColor,
    top : 0,
    left : 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);

  var lineWidth = rect.width * .8;
  var line = new fabric.Rect({
    width: lineWidth,
    height: 1,
    fill: fontColor,
    top: rect.top + 40,
    left: rect.left + (lineWidth * .10)
  });

  var topHR = new CanvasObject("topHR", "HR", line);

  var text = new fabric.Text(bodyText, {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: fontColor,
    top: line.top + 5,
    left: line.left
  });

  var body = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: fontColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text(footerText, {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: fontColor,
    top: line2.top + 10,
    left: line.left
  });

  var footer = new CanvasObject("footer", "TEXT", text2);

  var text3 = new fabric.Text(authorText, {
    fontFamily: fontType,
    fontSize: footerAuthorSize,
    fill: fontColor,
    top: text2.top + text2.height + 3,
    left: line.left
  });

  var footerAuthorText = new CanvasObject("footerAuthor", "TEXT", text3);

  var domain = new fabric.Text(domainName, {
    fontFamily: fontType,
    fontSize: domainFontSize,
    fill: fontColor,
    top: canvasHeight - 60,
    left: line.left
  });

  var domainText = new CanvasObject("domain", "TEXT", domain);

  var logo = new fabric.Image.fromURL(logoURL, function(img) {
    var domain;
    var overlay;
    for(i=0; i < objects.length; i++) {
      if(objects[i].objName == "domain")
        domain = objects[i].objObject;
      else if(objects[i].objName == "overlayBox")
        overlay = objects[i].objObject;
    }

    img.top = domain.top - 100;
    img.left = overlay.left + (img.width * .5);
    canvas.add(img);
    lockObject(img);
    objects[objectIndex("logo")].objObject = img;
  });

  var logoImg = new CanvasObject("logo", "IMG", logo);

  var bg = new fabric.Image.fromURL(canvasBackground, function(img) {
    img.width = canvasWidth;
    img.height = canvasHeight;
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