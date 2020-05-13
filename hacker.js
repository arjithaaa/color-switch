//All variable declarations

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

const ballRadius = 15,
  x = canvas.width / 2,
  pi = Math.PI,
  colors = ["white", "#17BEBB", "#CD5334", "#F9B384"]; //color of the ball
var fin, //handles animation frame
  y = canvas.height / 2, //position of ball
  dy = 0,
  ballPos, //temp variable for ball
  score = 0,
  paused = false;

if (localStorage.getItem("highScore") == null) localStorage.setItem("highScore", 0);

//obstacle

class Obs {
  constructor(pos) {
    this.pos = pos;
    this.rot = 0;
    this.r = 120;
    this.x = canvas.width / 2;
    this.dirn = Math.floor(Math.random() * 2);
    this.speed = (Math.random() * 2 + 0.5) * pi / 180;

    this.changerPos = this.pos - 220;
    this.changerRad = 20;
    this.changeFlag = true;
  }

  draw() {

    c.beginPath();
    c.arc(this.x, this.pos, this.r, 0 + this.rot, pi / 2 + this.rot);
    c.lineWidth = 20;
    c.strokeStyle = "#17BEBB";
    c.stroke();

    c.beginPath();
    c.arc(this.x, this.pos, this.r, pi / 2 + this.rot, pi + this.rot);
    c.lineWidth = 20;
    c.strokeStyle = "#CD5334";
    c.stroke();

    c.beginPath();
    c.arc(this.x, this.pos, this.r, pi + this.rot, 3 * pi / 2 + this.rot);
    c.lineWidth = 20;
    c.strokeStyle = "white";
    c.stroke();

    c.beginPath();
    c.arc(this.x, this.pos, this.r, 3 * pi / 2 + this.rot, pi * 2 + this.rot);
    c.lineWidth = 20;
    c.strokeStyle = "#F9B384";
    c.stroke();

  }

  reset(pos) {
    this.pos = pos;
    this.rot = 0;
    this.r = 120;
    this.x = canvas.width / 2;
    this.dirn = Math.floor(Math.random() * 2);
    this.speed = (Math.random() * 2 + 1) * pi / 180;

    this.changerPos = this.pos - 220;
    this.changerRad = 20;
    this.changeFlag = true;
  }

  rotate(dirn) {
    if (dirn) //clockwise
    {
      if (this.rot > 2 * pi - this.speed) this.rot = 0;
      this.rot += this.speed;
    } else { //anticlockwise
      if (this.rot < -2 * pi + this.speed) this.rot = 0;
      this.rot -= this.speed;
    }
  }

  colorChecker(col) {
    if (col != ballColorNo) gameOver();
  }


  checkCollsion(dirn) {

    let outerRadiusDown = this.pos + this.r + 10,
      innerRadiusDown = this.pos + this.r - 10,
      outerRadiusUp = this.pos - this.r - 10,
      innerRadiusUp = this.pos - this.r + 10;

    //conditions
    if ((y - ballRadius <= outerRadiusDown && y - ballRadius >= innerRadiusDown) || (y + ballRadius <= outerRadiusDown && y + ballRadius >= innerRadiusDown)) {
      if (dirn) {
        if (this.rot >= 0 && this.rot < pi / 2) this.colorChecker(1); //blue
        else if (this.rot >= pi / 2 && this.rot < pi) this.colorChecker(3); //pink
        else if (this.rot >= pi && this.rot < 3 * pi / 2) this.colorChecker(0); //white
        else this.colorChecker(2); //orange
      } else {
        if (this.rot < 0 && this.rot >= -pi / 2) this.colorChecker(2); //orange
        else if (this.rot < -pi / 2 && this.rot >= -pi) this.colorChecker(0); //white
        else if (this.rot < -pi && this.rot >= -3 * pi / 2) this.colorChecker(3); //pink
        else this.colorChecker(1); //blue
      }
    } else if ((y - ballRadius <= innerRadiusUp && y - ballRadius >= outerRadiusUp) || (y + ballRadius <= innerRadiusUp && y + ballRadius >= outerRadiusUp)) {
      if (dirn) {
        if (this.rot >= 0 && this.rot < pi / 2) this.colorChecker(0); //white
        else if (this.rot >= pi / 2 && this.rot < pi) this.colorChecker(2); //orange
        else if (this.rot >= pi && this.rot < 3 * pi / 2) this.colorChecker(1); //blue
        else this.colorChecker(3); //pink
      } else {
        if (this.rot < 0 && this.rot >= -pi / 2) this.colorChecker(3); //pink
        else if (this.rot < -pi / 2 && this.rot >= -pi) this.colorChecker(1); //blue
        else if (this.rot < -pi && this.rot >= -3 * pi / 2) this.colorChecker(2); //orange
        else this.colorChecker(0); //white
      }
    }
  }

  change() {
    let col;
    do {
      col = Math.floor(Math.random() * 4);
    } while (col == ballColorNo);
    ballColorNo = col;
    this.changeFlag = false;
    var point = new Audio("point.mp3");
    point.play();
  }

  drawChanger() {
    c.beginPath();
    c.arc(this.x, this.changerPos, this.changerRad, 0, 2 * Math.PI);
    c.fillStyle = "grey";
    c.fill();
  }

  move() {

    this.draw();
    this.rotate(this.dirn);
    this.checkCollsion(this.dirn);
    if (y > this.changerPos + this.changerRad && this.changeFlag) this.drawChanger();
    else {
      if (this.changeFlag)
        this.change();
    }
    if (dy == -3) {
      this.pos += 3;
      this.changerPos += 3;
    }
  }


}

//updating Score
setInterval(function() {
  document.getElementById("score").textContent = "Score : " + score;
  if (localStorage.getItem("highScore") < score) {
    document.getElementById("high").textContent = "High Score : " + score;
  } else document.getElementById("high").textContent = "High Score : " + localStorage.getItem("highScore");
}, 1);



//Initial Frame
var obs1 = new Obs(-140),
  obs2 = new Obs(-700);

c.clearRect(0, 0, innerWidth, innerHeight);
c.beginPath();
var ballColorNo = Math.floor(Math.random() * 4); //random color of ball
c.fillStyle = colors[ballColorNo];
c.arc(x, y, ballRadius, 0, 2 * Math.PI);
c.fill();

function toggleGame() {
  if (paused == false) {
    paused = true;
    document.getElementById("pause").textContent = "Play";
  } else {
    paused = false;
    document.getElementById("pause").textContent = "Pause";
    requestAnimationFrame(animate);
  }
}

//Animation

function animate() {
  if (paused) return;
  y += dy;
  if (y <= ballPos) dy = 3;
  if (dy < 0) score += 1;
  c.clearRect(0, 0, innerWidth, innerHeight);
  c.beginPath();
  c.arc(x, y, ballRadius, 0, 2 * Math.PI);
  c.fillStyle = colors[ballColorNo];
  c.fill();

  obs1.move();
  obs2.move();

  //if obstacle moves out of frame
  if (obs1.pos - obs1.r >= innerHeight) obs1.reset(-400);
  if (obs2.pos - obs2.r >= innerHeight) obs2.reset(-400);


  if (y + ballRadius >= canvas.height) gameOver();
  fin = requestAnimationFrame(animate);
}

document.addEventListener('keydown', function(event) {

  if (event.keyCode == '38') {
    document.getElementById("end").style.display = "none";
    var bounce = new Audio("bounce.wav");
    bounce.play();
    dy = -3;
    ballPos = y - 60;
  }
});


function gameOver() {
  var hit = new Audio("hit.wav");
  hit.play();
  cancelAnimationFrame(fin);
  document.getElementById("end").style.display = "inline-block";
  setTimeout(function() {
    document.getElementById("end").style.display = "none";
  }, 3000);
  y = canvas.height / 2;
  dy = 0;
  ballPos = y - 60;

  if (score >= localStorage.getItem("highScore")) localStorage.setItem("highScore", score);

  c.clearRect(0, 0, innerWidth, innerHeight);
  document.getElementById("high").textContent = "High Score : " + localStorage.getItem("highScore");
  score = 0;

  c.clearRect(0, 0, innerWidth, innerHeight);
  c.beginPath();
  c.fillStyle = "white";
  c.strokeStyle = "white";
  c.arc(x, canvas.height / 2, ballRadius, 0, 2 * Math.PI);
  c.fill();

  obs1.reset(-140);
  obs2.reset(-700);
}

animate();
