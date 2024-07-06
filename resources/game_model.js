"use strict"

const SCREEN_HEIGHT = 48;
const SCREEN_WIDTH = 96;

const UP_DIRECTION = 12;
const DOWN_DIRECTION = 13;
const LEFT_DIRECTION = 14;
const RIGHT_DIRECTION = 15;


class GameModel {
  gameStateManager = null;
  screen = null;
  snake = null;
  
  gridWidth = null
  gridHeight = null
  screenView = null

  fruitPosition = null;
  
  constructor(gridWidth, gridHeight, gameStateManager) {
    this.gameStateManager = gameStateManager;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    // Initialize screen
    this.screen = new Array(this.gridHeight);
    for (let i = 0; i < this.gridWidth; i++) {
      this.screen[i] = new Array(this.gridWidth);
    }

    this.snake = new Snake(this.gridWidth, this.gridHeight, this);

    this.fruitPosition = this.generateFruit()

    this.screenView = new GameView("game-screen", this);
  }

  #isButtonPressed(gamepad, button_id) {
    return gamepad.buttons[button_id].pressed;
  }

  updateModel(gamepad) {
    if (this.#isButtonPressed(gamepad, UP_DIRECTION) && this.snake.headDirection != DOWN_DIRECTION){
      console.log("Up pressed");
      this.snake.headDirection = UP_DIRECTION;
    }
    else if (this.#isButtonPressed(gamepad, DOWN_DIRECTION) && this.snake.headDirection != UP_DIRECTION){
      console.log("Down pressed");
      this.snake.headDirection = DOWN_DIRECTION;
    }
    else if (this.#isButtonPressed(gamepad, LEFT_DIRECTION) && this.snake.headDirection != RIGHT_DIRECTION){
      console.log("Left pressed");
      this.snake.headDirection = LEFT_DIRECTION;
    }
    else if (this.#isButtonPressed(gamepad, RIGHT_DIRECTION) && this.snake.headDirection != LEFT_DIRECTION){
      console.log("Right pressed");
      this.snake.headDirection = RIGHT_DIRECTION;
    }
    

    this.snake.move(this.fruitPosition);
    
    if(this.snake.hasEatenItself()){
      this.gameStateManager.onGameOver();
      return;
    }

    if (!this.fruitPosition) {
      this.fruitPosition = this.generateFruit();
    }
    this.screenView.update();
  }

  generateFruit() {
    let grid = [];
    for(let i = 0; i < this.gridWidth; i++) {
      for (let j = 0; j < this.gridHeight; j++) {
        grid.push(new Point(i,j));
      }
    }

    // Remove snake occupied points.
    for (let bodyPart of this.snake.body) {
      let index = grid.findIndex((element) => {
        (element.x == bodyPart.x) && (element.y == bodyPart.y);
      })
      // Found element.
      if (index > 0) {
        // Remove it from the array.
        grid.splice(index, 1);
      }
    }

    return grid[Math.floor(Math.random() * grid.length)]    
  }

  onFruitEaten() {
    this.fruitPosition = null;
  }

  get gridHeight() {
    return this.gridHeight;
  }

  get gridWidth() {
    return this.gridWidth;
  }

  get snake() {
    return this.snake.toReversed();
  }

  get fruitPosition() {
    return this.fruitPosition
  }
}


// Snake is implemented a queue, where its head is always the last
// element of the array (most recent);
class Snake {
  #body = [];
  #headDirection = null;
  #gridWidth = null;
  #gridHeight = null;
  #controller = null

  constructor(gridWidth, gridHeight, controller) {
    this.#gridWidth = gridWidth;
    this.#gridHeight = gridHeight;
    this.#controller = controller;
    let initialX = this.#gridWidth/2;
    let initialY = this.#gridHeight/2;
    this.#body.push(new Point(initialX-2, initialY));
    this.#body.push(new Point(initialX-1, initialY));
    this.#body.push(new Point(initialX, initialY));
    this.#headDirection = RIGHT_DIRECTION;
  }

  get headDirection() {
    return this.#headDirection;
  }

  set headDirection(direction) {
    this.#headDirection = direction;
  }

  get head() {
    return this.#body.at(-1);
  }

  get body() {
    return this.#body.toReversed()
  }

  move() {
    let oldHead = this.head;
    let newHeadX = oldHead.x;
    let newHeadY = oldHead.y;
    switch(this.#headDirection) {
      case UP_DIRECTION:
        newHeadY--;
        if (newHeadY < 0) {
          newHeadY += this.#gridHeight;
        }
        break;
      case DOWN_DIRECTION:
        newHeadY = (newHeadY+1) % this.#gridHeight;
        break;
      case LEFT_DIRECTION:
        newHeadX--;
        if(newHeadX < 0) {
          newHeadX += this.#gridWidth 
        }
        break;
      case RIGHT_DIRECTION:
        newHeadX = (newHeadX+1) % this.#gridWidth;
        break;
    }
    
    // Add new head.
    this.#body.push(new Point(newHeadX, newHeadY));
    
    // Remove trailing body part only if the snake has not eaten a fruit.
    if(newHeadX == this.#controller.fruitPosition.x
        && newHeadY == this.#controller.fruitPosition.y) {
      this.#controller.onFruitEaten();
    }
    else {
      this.#body.shift();
    }
  }

  hasEatenItself() {
    for (let bodyPart of this.body.slice(1)) {
      if ((this.head.x == bodyPart.x) && (this.head.y == bodyPart.y)) {
        return true;
      }
    }
    
    return false;
  }

  print() {
    let snakeStr = "";
    for (let part of this.#body.toReversed()) {
      snakeStr += `(x: ${part.x}, y: ${part.y}) ` 
    }
    console.log(snakeStr);
  }
}

class Point {
  #x = null;
  #y = null;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  } 

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
}

// [{x:5, y:2}, {x:4, y:2}, {x:3, y:2}]
// snake_body[0]

// | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
// | 1 |   |   |   |   |   |   |   |
// | 2 |   |   | # | # | @ |   |   |
// | 3 |   |   |   |   |   |   |   |
// | 4 |   |   |   |   |   |   |   |