let faceapi;
let video;
let detections;
let zoomedimages = [];
let fallingText = [];
const poetry = [
  "my humanity is bound in yours",
  "we belong in a bundle of life",
  "a person is a person through other persons",
  "a person is a person through other persons",
  "more than 9,077 children have been killed by zionist warfare backed by the U.S.",
  "our freedom and livelihoods are linked together",
];

// by default, all options are set to true
const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createVideo("icmfinalvid.mp4", videoLoaded);
  video.hide();
  faceapi = ml5.faceApi(video, detection_options, modelReady);
  textAlign(CENTER);

  // Initialize falling text
  for (let i = 0; i < 6; i++) {
    fallingText.push({
      x: random(width - 10),
      y: random(-height, 0),
      speed: random(1, 1.5),
      poem: random(poetry),
    });
  }
}

function videoLoaded() {
  video.size(windowWidth, windowHeight);
  video.loop();
}

function draw() {
  image(video, 0, 0, width, height);
  frameRate(50);
  for (let i = 0; i < zoomedimages.length; i++) {
    noFill();
    stroke(161, 95, 251);
    strokeWeight(0);
    rect(
      zoomedimages[i].x,
      zoomedimages[i].y,
      zoomedimages[i].boxWidth * 4,
      zoomedimages[i].boxHeight
    );
    image(
      video,
      zoomedimages[i].x--,
      zoomedimages[i].y--,
      zoomedimages[i].boxWidth * 4,
      zoomedimages[i].boxHeight * 4,
      120,
      170,
      zoomedimages[i].boxWidth * 4,
      zoomedimages[i].boxHeight * 4
    );
  }

  // Draw falling text on top of zoomed images
  textSize(36);
  textStyle(ITALIC);
  fill(36,34,34);
  for (let i = 0; i < fallingText.length; i++) {
    text(fallingText[i].poem, fallingText[i].x, fallingText[i].y);
    fallingText[i].y += fallingText[i].speed;

    // Reset text position when it goes off the canvas
    if (fallingText[i].y > height) {
      fallingText[i].y = random(-height, 0);
      fallingText[i].x = random(width);
    }
  }
}

function modelReady() {
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }

  detections = result;

  if (detections) {
    if (detections.length > 0) {
      drawBox(detections);
    }
  }
  faceapi.detect(gotResults);
}

function drawBox(detections) {
  for (let i = 0; i < detections.length; i++) {
    const alignedRect = detections[i].alignedRect;
    const x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight = alignedRect._box._height;

    zoomedimages.push({
      alignedRect,
      x,
      y,
      boxWidth,
      boxHeight,
    });
  }
}

// Toggle fullscreen when 'f' key is pressed
function keyPressed() {
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
    if (fs) {
      video.size(windowWidth, windowHeight);
    } else {
      video.size(width, height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
