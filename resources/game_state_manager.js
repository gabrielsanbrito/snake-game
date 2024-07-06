"use strict"

class GameStateManager {
  gamepadManager = null;
  requestAnimationFrameId = null;
  gameModel = null;

  isGameOver = false;

  speedCounter = 0
  // The greater the SPEED variable, the slower the game gets.
  SPEED = 10

  constructor() {
    this.gamepadManager = new GamepadStateManager();
    this.gameModel = new GameModel(/*width=*/24, /*height*/24, this);
  }

  startGameLoop() {
    this.requestAnimationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    let gamepad = this.gamepadManager.getFirstGamepad();
    if (!gamepad) {
      this.requestAnimationFrameId = requestAnimationFrame(() => this.gameLoop());
      return;
    }
    if(this.speedCounter % this.SPEED == 0){
      this.gameModel.updateModel(gamepad);
      this.speedCounter = 0
    }
    this.speedCounter++
    
    if(this.isGameOver){
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        duration: 1000,
        strongMagnitude: 0.5,
        weakMagnitude: 1.0,
      });
      return;
    }

    this.requestAnimationFrameId = requestAnimationFrame(() => this.gameLoop());
    //setTimeout(() => requestAnimationFrame(() => this.gameLoop()), 4)
  }

  onGameOver() {
    this.isGameOver = true;
  }
}