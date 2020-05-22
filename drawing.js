const BACKGROUND_COLOR = "#000000";
const LINE_COLOR = "#FFFFFF";
const LINE_WIDTH = 10;
const CANVAS_WIDTH = 150;
const CANVAS_HEIGHT = 150;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;

function prepareCanvas() {
  console.log("Preparing Canvas...");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = "round";

  var isPainting = false;

  document.addEventListener("mousedown", function (event) {
    //console.log("mouse clicked");

    isPainting = true;
    currentX = event.clientY - canvas.offsetTop;
    currentY = event.clientY - canvas.offsetTop;
  });

   document.addEventListener("mouseup", function (event) {
    //console.log("mouse released");

    isPainting = false;
  });

  document.addEventListener("mousemove", function (event) {
    if (isPainting) {
      previousX = currentX;
      currentX = event.clientX - canvas.offsetLeft;
      previousY = currentY;
      currentY = event.clientY - canvas.offsetTop;

     draw();
    }
  });

  //touch options

  canvas.addEventListener("touchstart", function (event) {
    //console.log("touched");

    isPainting = true;
    currentX = event.touches[0].clientY - canvas.offsetTop;
    currentY = event.touches[0].clientY - canvas.offsetTop;
  });

  canvas.addEventListener("touchend", function (event) {
    //console.log("untouched");

    isPainting = false;
  });

  canvas.addEventListener("touchcancel", function (event) {
    //console.log("untouched");

    isPainting = false;
  });

  canvas.addEventListener("touchmove", function (event) {
    if (isPainting) {
      previousX = currentX;
      currentX = event.touches[0].clientX - canvas.offsetLeft;
      previousY = currentY;
      currentY = event.touches[0].clientY - canvas.offsetTop;

      draw();
    }
  });


  
}

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas(){
    
     currentX = 0;
     currentY = 0;
     previousX = 0;
     previousY = 0;

     context = canvas.getContext("2d");
     context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    
    
}