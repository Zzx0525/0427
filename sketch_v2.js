// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

// 定義手部 21 個節點的骨架連線關係
const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // 大拇指
  [0, 5], [5, 6], [6, 7], [7, 8],       // 食指
  [5, 9], [9, 10], [10, 11], [11, 12],  // 中指
  [9, 13], [13, 14], [14, 15], [15, 16],// 無名指
  [13, 17], [17, 18], [18, 19], [19, 20],// 小拇指
  [0, 17]                               // 手掌邊緣
];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  background('#e7c6ff'); // 設定畫布背景顏色為紫色

  // 計算影像 50% 的寬高與置中的 X, Y 座標
  let vw = windowWidth * 0.5;
  let vh = windowHeight * 0.5;
  let vx = (windowWidth - vw) / 2;
  let vy = (windowHeight - vh) / 2;

  // 畫出置中且縮放的影像
  image(video, vx, vy, vw, vh);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        
        // 畫出骨架連線 (在圓點下方)
        if (hand.handedness == "Left") {
          stroke(255, 0, 255); // 左手連線顏色（桃紅色）
        } else {
          stroke(255, 255, 0); // 右手連線顏色（黃色）
        }
        strokeWeight(3);   // 設定線條粗細
        
        let vidW = video.width || 640;
        let vidH = video.height || 480;

        for (let [idxA, idxB] of connections) {
          let pA = hand.keypoints[idxA];
          let pB = hand.keypoints[idxB];
          let mappedAx = vx + (pA.x / vidW) * vw;
          let mappedAy = vy + (pA.y / vidH) * vh;
          let mappedBx = vx + (pB.x / vidW) * vw;
          let mappedBy = vy + (pB.y / vidH) * vh;
          line(mappedAx, mappedAy, mappedBx, mappedBy);
        }

        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          let mappedX = vx + (keypoint.x / vidW) * vw;
          let mappedY = vy + (keypoint.y / vidH) * vh;
          circle(mappedX, mappedY, 16);
        }
      }
    }
  }
}

// 當視窗改變大小時，自動調整畫布大小並維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}