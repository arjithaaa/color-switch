//All variable declarations

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

const ballRadius = 15, x = canvas.width / 2, pi = Math.PI;
var fin, //handles animation frame
  y = canvas.height / 2, //position of ball
  dy = 0,
  ballPos, //temp variable for ball
  score = 0,
  rotSpeed = pi/180;


if (localStorage.getItem("highScore") == null) localStorage.setItem("highScore", 0);

//obstacle

class Obs {
  constructor(pos) {
    this.pos = pos;
    this.end = pi;
    this.start = 0;
    this.r = 120;
    this.x = canvas.width / 2;
  }

  draw() {

    //top white
    c.beginPath();
    c.arc(this.x, this.pos, this.r, this.start, this.end, true);
    c.lineWidth = 20;
    c.strokeStyle = "white";
    c.stroke();

    //bottom orange
    c.beginPath();
    c.arc(this.x, this.pos, this.r, this.start, this.end);
    c.strokeStyle = "#FF7315";
    c.stroke();


  }

  reset(pos) {
    this.pos = pos;
    this.end = pi;
    this.start = 0;
    this.r = 120;
    this.x = canvas.width / 2;
  }

  rotate() {

    if (this.start > 2 * pi - pi / 180) {
      this.start = 0;
      this.end = pi;
    }
    this.start += rotSpeed;
    this.end += rotSpeed;
  }

  checkCollsion() {

    let outerRadiusDown = this.pos + this.r + 10,
      innerRadiusDown = this.pos + this.r - 10,
      outerRadiusUp = this.pos - this.r - 10,
      innerRadiusUp = this.pos - this.r + 10;

      //4 conditions
    if (y - ballRadius <= outerRadiusDown && y - ballRadius >= innerRadiusDown) {
      if (this.start >= pi / 2 && this.start <= 3 * pi / 2);
      else {
        gameOver();
      }
    } else if (y + ballRadius <= outerRadiusDown && y + ballRadius >= innerRadiusDown) {
      if (this.start >= pi / 2 && this.start <= 3 * pi / 2);
      else {
        gameOver();
      }
    } else if (y - ballRadius <= innerRadiusUp && y - ballRadius >= outerRadiusUp) {
      if (this.start >= 3 * pi / 2 && this.start <= pi * 2 || this.start >= 0 && this.start <= pi / 2);
      else {
        gameOver();
      }
    } else if (y + ballRadius <= innerRadiusUp && y + ballRadius >= outerRadiusUp) {
      if (this.start >= 3 * pi / 2 && this.start <= pi * 2 || this.start >= 0 && this.start <= pi / 2);
      else {
        gameOver();
      }
    }
  }

  move() {
    this.draw();
    this.rotate();
    this.checkCollsion();
    if (dy == -3) this.pos += 3;
  }


}

//updating Score
setInterval(function() {
  document.getElementById("score").textContent = "Score : " + score;
  if(localStorage.getItem("highScore")<score){
    document.getElementById("high").textContent = "High Score : " + score;
  }
  else document.getElementById("high").textContent = "High Score : " + localStorage.getItem("highScore");
}, 1);




//Initial Frame
var obs1 = new Obs(-140),
  obs2 = new Obs(-580);

c.clearRect(0, 0, innerWidth, innerHeight);
c.beginPath();
c.fillStyle = "white";
c.strokeStyle = "white";
c.arc(x, y, ballRadius, 0, 2 * Math.PI);
c.fill();

//Animation

function animate() {

  y += dy;
  if (y <= ballPos) dy = 3;
  if (dy < 0) score += 1;
  c.clearRect(0, 0, innerWidth, innerHeight);
  c.beginPath();
  c.arc(x, y, ballRadius, 0, 2 * Math.PI);
  c.fillStyle = "white";
  c.fill();

  obs1.move();
  obs2.move();
  if (obs1.pos - obs1.r >= innerHeight) obs1.reset(-140);
  if (obs2.pos - obs2.r >= innerHeight) obs2.reset(-140);
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

  if (score >= localStorage.getItem("highScore")) localStorage.setItem("highScore", score);

  c.clearRect(0, 0, innerWidth, innerHeight);
  document.getElementById("high").textContent = "High Score : " + localStorage.getItem("highScore");
  score = 0;

  c.clearRect(0, 0, innerWidth, innerHeight);
  c.beginPath();
  c.fillStyle = "white";
  c.strokeStyle = "white";
  c.arc(x, y, ballRadius, 0, 2 * Math.PI);
  c.fill();

  obs1.reset(-140);
  obs2.reset(-580);
}

animate();
