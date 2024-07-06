"use strict"

class GameStateManager {
  gamepadManager = null;
  requestAnimationFrameId = null;
  gameModel = null;

  constructor() {
    this.gamepadManager = new GamepadStateManager();
    this.gameModel = new GameModel(/*width=*/24, /*height*/24);
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

    this.gameModel.updateModel(gamepad);

    //this.requestAnimationFrameId = requestAnimationFrame(() => this.gameLoop());
    setTimeout(() => requestAnimationFrame(() => this.gameLoop()), 100)
  }
}