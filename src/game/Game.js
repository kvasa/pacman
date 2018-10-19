import Mousetrap from "mousetrap";

// sprites
import PACMAN from "./sprites/pacman";

// utilities
import { loadImage } from "./utils/images";
import { drawImage } from "./utils/canvas";

const SPRITE = "/images/pacman-sprite.png";
const POINT_SIZE = 32;

const SPEED = 2.6;

const LEFT = "left";
const RIGHT = "right";
const UP = "up";
const DOWN = "down";

export default class Game {
  constructor() {
    // prettier-ignore
    this.state = {
      map: [
        ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
        ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
        ["#", " ", "#", "#", "#", " ", "#", "#", "#", " ", "#", " ", "#", "#", "#", " ", "#", "#", "#", " ", "#"],
        ["#", " ", "#", "#", "#", " ", "#", "#", "#", " ", "#", " ", "#", "#", "#", " ", "#", "#", "#", " ", "#"],
        ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
        ["#", " ", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", " ", "#"],
        ["#", " ", "#", "#", "#", " ", "#", " ", " ", " ", "#", " ", " ", " ", "#", " ", "#", "#", "#", " ", "#"],
        ["#", " ", " ", " ", " ", " ", "#", "#", "#", " ", "#", " ", "#", "#", "#", " ", " ", " ", " ", " ", "#"],
        ["#", "#", "#", "#", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#", "#", "#", "#", "#"],
        [" ", " ", " ", " ", "#", " ", "#", " ", "#", "#", " ", "#", "#", " ", "#", " ", "#", " ", " ", " ", " "],
        ["#", "#", "#", "#", "#", " ", "#", " ", "#", " ", " ", " ", "#", " ", "#", " ", "#", "#", "#", "#", "#"],
        [" ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " "],
        ["#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#"],
        [" ", " ", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#", " ", " ", " ", " "],
        ["#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#"],
        ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
        ["#", " ", "#", "#", "#", " ", "#", "#", "#", " ", "#", " ", "#", "#", "#", " ", "#", "#", "#", " ", "#"],
        ["#", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"],
        ["#", "#", "#", " ", "#", " ", "#", " ", "#", "#", "#", "#", "#", " ", "#", " ", "#", " ", "#", "#", "#"],
        ["#", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#"],
        ["#", " ", "#", "#", "#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#", "#", "#", " ", "#"],
        ["#", " ", "#", "#", "#", "#", "#", "#", "#", " ", "#", " ", "#", "#", "#", "#", "#", "#", "#", " ", "#"],
        ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
        ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ],
      pacman: {
        x: 32 * 10,
        y: 32 * 13
      }
    };
    this.lastKey = LEFT;

    this.time = 0;
  }

  async init(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.sprite = await loadImage(SPRITE);
    this.bindKeyboards();
    this.run();
  }

  bindKeyboards() {
    Mousetrap.bind(UP, this.keyUp);
    Mousetrap.bind(DOWN, this.keyDown);
    Mousetrap.bind(LEFT, this.keyLeft);
    Mousetrap.bind(RIGHT, this.keyRight);
  }

  pacmanPosition(isRight, isDown) {
    const { x, y } = this.state.pacman;

    const tailX = Math.floor(x / POINT_SIZE) + (isRight ? 1 : 0);
    const tailY = Math.floor(y / POINT_SIZE) + (isDown ? 1 : 0);

    const isWall = this.state.map[tailY][tailX] === "#";

    return {
      tailX: tailX,
      tailY: tailY,
      isWall
    };
  }

  keyUp = e => {
    this.state.pacman.y -= 1 * SPEED;

    const { tailY, isWall } = this.pacmanPosition();
    if (isWall) {
      this.state.pacman.y = (tailY + 1) * POINT_SIZE;
    }

    this.lastKey = UP;
    e.preventDefault();
  };

  keyDown = e => {
    this.state.pacman.y += 1 * SPEED;

    const { tailY, isWall } = this.pacmanPosition(undefined, true);
    if (isWall) {
      this.state.pacman.y = (tailY - 1) * POINT_SIZE;
    }

    this.lastKey = DOWN;
    e.preventDefault();
  };

  keyLeft = e => {
    this.state.pacman.x -= 1 * SPEED;

    const { tailX, isWall } = this.pacmanPosition();
    if (isWall) {
      this.state.pacman.x = (tailX + 1) * POINT_SIZE;
    }

    this.lastKey = LEFT;
    e.preventDefault();
  };

  keyRight = e => {
    this.state.pacman.x += 1 * SPEED;

    const { tailX, isWall } = this.pacmanPosition(true);
    if (isWall) {
      this.state.pacman.x = (tailX - 1) * POINT_SIZE;
    }

    this.lastKey = RIGHT;
    e.preventDefault();
  };

  async run() {
    this.time = Date.now();

    this.draw();
  }

  draw() {
    const time = Date.now() - this.time;

    this.context.clearRect(0, 0, 672, 768);
    this.drawMap(time);
    this.drawPacman(time);

    setTimeout(() => this.draw(), 16.66);
  }

  drawMap(time) {
    this.state.map.forEach((row, y) => {
      row.forEach((char, x) => {
        if (char === "#") {
          this.context.fillRect(
            x * POINT_SIZE,
            y * POINT_SIZE,
            POINT_SIZE,
            POINT_SIZE
          );
        }
      });
    });
  }

  drawPacman(time) {
    const s = Math.floor(time / 100);

    const [sx, sy, swidth, sheight] = PACMAN[s % PACMAN.length];
    const { x, y } = this.state.pacman;

    let angle = 0;
    switch (this.lastKey) {
      case LEFT:
        angle = -90;
        break;
      case RIGHT:
        angle = 90;
        break;
      case DOWN:
        angle = 180;
        break;
      default:
        angle = 0;
    }

    drawImage(
      this.context,
      this.sprite,
      sx,
      sy,
      swidth,
      sheight,
      x,
      y,
      POINT_SIZE,
      POINT_SIZE,
      angle
    );
  }
}
