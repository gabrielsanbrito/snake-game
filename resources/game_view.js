"use strict"

class GameView {
  canvas = null;
  gameModel = null
  screenWidth = null;
  screenHeight = null

  canvasCtx = null

  constructor(canvasId, gameModel) {
    this.gameModel = gameModel;

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
    this.drawPowerUps();
    this.updatePowerUpMeter();
  }

  drawSnake() {
    let snake = this.gameModel.snake
    // Draw head
    let headCoord = this.calculateCoordinates(snake.head);
    this.drawPoint(headCoord, "red")
    for (const part of snake.body.slice(1)) {
      let bodyCoord = this.calculateCoordinates(part);
      this.drawPoint(bodyCoord, "black")
    }
  }

  drawFruit() {
    let fruitPosition = this.gameModel.fruitPosition;
    this.drawPoint(this.calculateCoordinates(fruitPosition), "green")
  }

  drawPowerUps() {
    if(this.gameModel.powerUpPositions.length > 0) {
      for(let powerUpPosition of this.gameModel.powerUpPositions) {
        this.drawPoint(this.calculateCoordinates(powerUpPosition), "orange")
      }
    }
  }

  drawBackground() {
    this.canvasCtx.reset()
    // Draw background
    this.canvasCtx.fillStyle = "cyan";
    this.canvasCtx.fillRect(0,0,this.screenWidth,this.screenHeight)
  }

  updatePowerUpMeter() {
    let meterValue = document.getElementById("power-up-meter");
    const nFormat = new Intl.NumberFormat(undefined, {minimumFractionDigits: 2})
    meterValue.textContent = `Power Up meter: ${nFormat.format(this.gameModel.powerUpMeter)}`
  }

  calculateCoordinates(point) {
    let gridX = point.x;
    let gridY = point.y;
    let gridIncrementX = this.screenWidth/this.gameModel.gridWidth
    let gridIncrementY = this.screenHeight/this.gameModel.gridHeight
    return { x: (gridX+0.5)*gridIncrementX, y: (gridY+0.5)*gridIncrementY};
  }

  drawPoint (point, color) {
    let radius = this.screenWidth/this.gameModel.gridWidth/2
    this.canvasCtx.fillStyle = color;
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(point.x,point.y, radius, 0, 2*Math.PI)
    this.canvasCtx.fill();
  }
}