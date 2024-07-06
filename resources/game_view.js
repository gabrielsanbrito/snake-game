"use strict"

class GameView {
  canvas = null;
  controller = null
  screenWidth = null;
  screenHeight = null

  canvasCtx = null

  constructor(canvasId, controller) {
    this.controller = controller;

    this.canvas = document.getElementById(canvasId);
    this.canvasCtx = this.canvas.getContext("2d");
    let screenRect = this.canvas.getBoundingClientRect();
    this.screenWidth = screenRect.width
    this.screenHeight = screenRect.height
    
    // Draw background
    this.canvasCtx.fillStyle = "cyan";
    this.canvasCtx.fillRect(0,0,this.screenWidth,this.screenHeight)
  }

  update() {
    this.drawBackground();
    this.drawSnake();
    this.drawFruit();
  }

  drawSnake() {
    let snake = this.controller.snake
    // Draw head
    let headCoord = this.calculateCoordinates(snake.head);
    this.drawPoint(headCoord, "red")
    for (const part of snake.body.slice(1)) {
      let bodyCoord = this.calculateCoordinates(part);
      this.drawPoint(bodyCoord, "black")
    }
  }

  drawFruit() {
    let fruitPosition = this.controller.fruitPosition;
    this.drawPoint(this.calculateCoordinates(fruitPosition), "green")
  }

  drawBackground() {
    this.canvasCtx.reset()
    // Draw background
    this.canvasCtx.fillStyle = "cyan";
    this.canvasCtx.fillRect(0,0,this.screenWidth,this.screenHeight)
  }

  calculateCoordinates(point) {
    let gridX = point.x;
    let gridY = point.y;
    let gridIncrementX = this.screenWidth/this.controller.gridWidth
    let gridIncrementY = this.screenHeight/this.controller.gridHeight
    console.log({ x: (gridX+0.5)*gridIncrementX, y: (gridY+0.5)*gridIncrementY})
    return { x: (gridX+0.5)*gridIncrementX, y: (gridY+0.5)*gridIncrementY};
  }

  drawPoint (point, color) {
    let radius = this.screenWidth/this.controller.gridWidth/2
    this.canvasCtx.fillStyle = color;
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(point.x,point.y, radius, 0, 2*Math.PI)
    this.canvasCtx.fill();
  }
}