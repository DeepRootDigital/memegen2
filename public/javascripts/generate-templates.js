// Object Types
// "OVERLAY", "TEXT", "IMG", "HR"

var canvasWidth = 0;
var canvasHeight = 0;
var objects = [];
var overlayColor = "rgba(255,0,0,0.5)";
var fontColor = "rgba(255,255,255,.75)";
var fontType = 'Comic Sans';
var bodyTextSize = 25;
var footerTextSize = 18;
var footerAuthorSize = 16;
var domainFontSize = 20;
var domainName = "businessonmarketst.com";
var logoURL = "icons/bms_logo.png";
var canvasBackground = "bg/colpan_gaslamp.jpg";


$(document).ready(function() {
  canvasWidth = canvas.getWidth();
  canvasHeight = canvas.getHeight();
});

function CanvasObject(objName, objType, objObject) {
  this.objName = objName;
  this.objType = objType;
  this.objObject = objObject;
}

function left(overlayWidth) {
  if(overlayWidth < .01)
    overlayWidth = .01;
  else if(overlayWidth > 1)
    overlayWidth = 1;

  var rect = new fabric.Rect({
    width: canvasWidth * overlayWidth,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
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

  var text = new fabric.Text("This is where the template body text will go.", {
    fontFamily: fontType,
    fontSize: bodyTextSize,
    fill: fontColor,
    top: line.top + 5,
    left: line.left
  });

  var bodyText = new CanvasObject("bodyText", "TEXT", text);

  var line2 = new fabric.Rect({
    width: lineWidth,
    height: 3,
    fill: fontColor,
    top: text.top + text.height + 5,
    left: line.left
  });

  var botHR = new CanvasObject("botHR", "HR", line2);

  var text2 = new fabric.Text("Some really cool dude said this.", {
    fontFamily: fontType,
    fontSize: footerTextSize,
    fill: fontColor,
    top: line2.top + 10,
    left: line.left
  });

  var footerText = new CanvasObject("footer", "TEXT", text2);

  var text3 = new fabric.Text("He was smart.", {
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
  });

  var logoImg = new CanvasObject("logo", "IMG", logo);

  objects.push(overlay);
  objects.push(topHR);
  objects.push(botHR);
  objects.push(bodyText);
  objects.push(footerText);
  objects.push(domainText);
  objects.push(footerAuthorText);
  objects.push(logoImg);

  addObjectsToCanvas();
}

function halfRight() {
  var rect = new fabric.Rect({
    width: canvasWidth * .5,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: canvasWidth * .5
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function halfTop() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .5,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function halfBottom() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .5,
    fill : overlayColor,
    top: canvasHeight * .5,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function thirdLeft() {
  var rect = new fabric.Rect({
    width: canvasWidth * .33,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function thirdRight() {
  var rect = new fabric.Rect({
    width: canvasWidth * .33,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: canvasWidth * .66
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function thirdTop() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .33,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function thirdBottom() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .33,
    fill : overlayColor,
    top: canvasHeight * .66,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function twoThirdLeft() {
  var rect = new fabric.Rect({
    width: canvasWidth * .66,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function twoThirdRight() {
  var rect = new fabric.Rect({
    width: canvasWidth * .66,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: canvasWidth * .33
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function twoThirdTop() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .66,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function twoThirdBottom() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .66,
    fill : overlayColor,
    top: canvasHeight * .33,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function fourthLeft() {
  var rect = new fabric.Rect({
    width: canvasWidth * .25,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function fourthRight() {
  var rect = new fabric.Rect({
    width: canvasWidth * .25,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: canvasWidth * .75
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function fourthTop() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .25,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function fourthBottom() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .25,
    fill : overlayColor,
    top: canvasHeight * .75,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function threeFourthLeft() {
  var rect = new fabric.Rect({
    width: canvasWidth * .75,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function threeFourthRight() {
  var rect = new fabric.Rect({
    width: canvasWidth * .75,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: canvasWidth * .25
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function threeFourthTop() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .75,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function threeFourthBottom() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight * .75,
    fill : overlayColor,
    top: canvasHeight * .25,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

  addObjectsToCanvas();
}

function full() {
  var rect = new fabric.Rect({
    width: canvasWidth,
    height: canvasHeight,
    fill : overlayColor,
    top: 0,
    left: 0
  });

  var overlay = new CanvasObject("overlayBox", "OVERLAY", rect);
  objects.push(overlay);

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