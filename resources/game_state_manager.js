"use strict"

class GameStateManager {
  gamepadManager = null;
  gameModel = null;

  isGameOver = false;

  BASE_SPEED = 60
  // The greater the SPEED variable, the slower the game gets.
  speed = this.BASE_SPEED;
  lastTimestamp = null

  constructor() {
    this.gamepadManager = new GamepadStateManager();
    this.gameModel = new GameModel(/*width=*/24, /*height*/24, this);
  }

  startGameLoop() {
    requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  gameLoop(timestamp) {
    let gamepad = this.gamepadManager.getFirstGamepad();
    if (!gamepad) {
      requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
      return;
    }

    if(!this.lastTimestamp){
      this.lastTimestamp = timestamp;
    }

    if((this.lastTimestamp != timestamp) && (timestamp - this.lastTimestamp > this.speed)) {
      this.gameModel.updateModel(gamepad, timestamp);
      this.lastTimestamp = timestamp;
    }
    
    if(this.isGameOver){
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        duration: 1000,
        strongMagnitude: 0.5,
        weakMagnitude: 1.0,
      });
      return;
    }

    requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    //setTimeout(() => requestAnimationFrame(() => this.gameLoop()), 4)
  }

  onGameOver() {
    this.isGameOver = true;
  }

  // MIN speed is BASE_SPEED
  // MAX speed is 1/4*BASE_SPEED
  onSpeedChanged(value) {
    this.speed = Math.floor(this.BASE_SPEED*(1-0.75*value));
  }
}