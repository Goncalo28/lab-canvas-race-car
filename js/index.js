window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };
  function startGame() {
    board.draw();
    board.start();
    player.update();

  }
};
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = './images/road.png';

let obstacles = [];

const board = {
  image: image,
  canvas: canvas,
  ctx: ctx,
  x: 0,
  frames: 0,
  draw: function() {
      ctx.drawImage(this.image, this.x, 0, 500, 700);
  },
  start: function () {
    this.interval = setInterval(updateBoard, 20);
  },
  clear: function() {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  },
  stop: function(){
    clearInterval(this.interval);
  },
  score: function(){
    const points = Math.floor(this.frames / 5);
    this.ctx.font = '15px serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Score: ${points}`, 350, 50);
    }
}

const carImage = new Image();
carImage.src = './images/car.png'

class Component {
  constructor(){
    this.carimg = carImage;
    this.width = 60;
    this.height = 70;
    this.x = 250;
    this.y = 630;
    this.speedX = 3;
    this.speedY = 0;
  }
  update (){
    const ctx = board.ctx;
    ctx.drawImage(this.carimg, this.x, this.y, this.width, this.height);
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  left() {
    return this.x;
  }
  rigth(){
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom(){
    return this.y + this.height;
  }
  crashWith(obstacle){
      return !(this.bottom() < obstacle.top() || 
      this.top() > obstacle.bottom() || 
      this.rigth() < obstacle.left() || 
      this.left() > obstacle.rigth())
  }
} 

let player = new Component()

function updateBoard(){
  board.clear();
  board.draw();
  player.newPos();
  player.update();
  updateObstacles();
  checkGameOver();
  board.score();
}
document.addEventListener('keydown', e => {
  switch(e.keyCode){
      case 37:
          player.speedX--
          console.log(`pos: ${player.x}`)
      break;
      case 39:
          player.speedX++
      break;
  }
})
document.addEventListener('keyup', () => {
  player.speedX = 0;
  player.speedY = 0;
})




class Obstacles {
  constructor(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
  }
  update (){
    const ctx = board.ctx;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  left() {
    return this.x;
  }
  rigth(){
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom(){
    return this.y + this.height;
  }
  crashWith(obstacle){
      return !(this.bottom() < obstacle.top() || 
      this.top() > obstacle.bottom() || 
      this.rigth() < obstacle.left() || 
      this.left() > obstacle.rigth())
  }
} 

function updateObstacles(){
  for(let i = 0; i < obstacles.length; i++){
      obstacles[i].y += 1;
      obstacles[i].update();
  }
  board.frames++;
  if(board.frames % 120 === 0){
    let heigth = 15;
    let x = Math.random() * 400;
  
    obstacles.push(new Obstacles(200, heigth, 'black', x, 0))
     
  }
}
function checkGameOver() {
  const crashed = obstacles.some((obstacle) => {
      return player.crashWith(obstacle);
  });
  if(crashed){
      board.stop();
  }
}