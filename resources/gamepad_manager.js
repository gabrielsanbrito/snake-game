"use strict"

class GamepadStateManager {
  connectedGamepads = [];
  pollingInterval = null;

  constructor() {
    this.pollingInterval = window.setInterval(() => this.pollGamepads() , 4);

    window.addEventListener('gamepadconnected', (event) => {
      this.addGamepad(event.gamepad);
      console.log(`connected gamepad ${event.gamepad.index}: ${event.gamepad.id}`);
    });
    
    window.addEventListener('gamepaddisconnected', (event) => {
      this.removeGamepad(event.gamepad);
      console.log(`disconnected gamepad ${event.gamepad.index}: ${event.gamepad.id}`);
    });
  }

  addGamepad(gamepad) {
    this.connectedGamepads[gamepad.index] = gamepad;
  }

  removeGamepad(gamepad) {
    delete this.connectedGamepads[gamepad.index];
  }

  getFirstGamepad() {
    if (this.connectedGamepads.empty){
      return null;
    }

    for (const gamepad of this.connectedGamepads) {
      if (gamepad) {
        return gamepad;
      }
    }

    return null;
  }

  pollGamepads() {
    let gamepads = navigator.getGamepads();
    
    for (const gamepad of gamepads) {
      if(gamepad){
        this.connectedGamepads[gamepad.index] = gamepad;
      }
    }
  }
};