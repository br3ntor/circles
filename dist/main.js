/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Classes.js":
/*!************************!*\
  !*** ./src/Classes.js ***!
  \************************/
/*! exports provided: Particle, Player, Goal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Particle", function() { return Particle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Goal", function() { return Goal; });
/* harmony import */ var _util_elastic_collision__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util-elastic-collision */ "./src/util-elastic-collision.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");



class Particle {
  constructor(x, y, radius, color, xSpeed, ySpeed, wallCollision = true) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.velocity = {
      x: this.xSpeed,
      y: this.ySpeed,
    };
    this.circlVelocity = 0.01;
    this.radius = radius;
    this.color = color;
    this.mass = 1; // Used in elastic collision
    this.opacity = 0.2;
    this.wallCollision = wallCollision;
    this.radians = Math.random() * Math.PI * 2;
    this.distanceFromCenter = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(100, 220);
    this.lastMouse = { x: x, y: y };
    // this.distanceFromCenter = {
    //   x: randInt(50, 120),
    //   y: randInt(50, 120),
    // };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = this.color;
    ctx.stroke();
    // ctx.closePath(); // Not sure if necessary
  }

  circleDraw(ctx, lastPoint) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.radius;
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.closePath();
  }

  circleUpdate(ctx, mouse) {
    const lastPoint = { x: this.x, y: this.y };

    // Move points over time
    this.radians += this.circlVelocity;

    // Drag effect
    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

    // Circular Motion
    // this.x = innerWidth / 2 + Math.cos(this.radians) * this.distanceFromCenter;
    // this.y = innerHeight / 2 + Math.sin(this.radians) * this.distanceFromCenter;

    // this.x = mouse.x + Math.cos(this.radians) * this.distanceFromCenter;
    // this.y = mouse.y + Math.sin(this.radians) * this.distanceFromCenter;

    this.x =
      this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
    this.y =
      this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;

    // this.draw(ctx);
    this.circleDraw(ctx, lastPoint);
  }

  update(ctx, particles, player) {
    this.draw(ctx);

    // Loop over particles for collision detection
    // for (let i = 0; i < particles.length; i++) {
    //   // Never compare particle to itself, skips if true.
    //   if (this === particles[i]) continue;

    //   const dist = distance(this.x, this.y, particles[i].x, particles[i].y);

    //   if (dist - this.radius - particles[i].radius < 0) {
    //     // Elastic collision
    //     resolveCollision(this, particles[i]);

    //     // Light up particles on collision
    //     this.opacity = 0.6;
    //     particles[i].opacity = 0.6;
    //   }
    // }

    // Reset back to transparent after collision
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    // Collision detection for walls
    if (this.wallCollision) {
      if (this.x - this.radius < 0 || this.x + this.radius >= innerWidth) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
        this.velocity.y = -this.velocity.y;
      }
    } else {
      // Particles can go offscreen and come back opposite side
      if (this.x - this.radius > innerWidth + 1000) this.x = 0 - this.radius;
      if (this.x + this.radius < 0 - 1000) this.x = innerWidth + this.radius;
      if (this.y - this.radius > innerHeight + 1000) this.y = 0 - this.radius;
      if (this.y + this.radius < 0 - 1000) this.y = innerHeight + this.radius;
    }

    // Player object collision (should I handle in player class?)
    const playerDistance = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["distance"])(this.x, this.y, player.x, player.y);

    if (playerDistance - this.radius - player.radius <= 0) {
      this.opacity = 1;
      return true;
    }

    // Set particles to next position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.radius = radius;
    this.color = color;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update(ctx, wall, mouse) {
    this.draw(ctx);
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const angle = Math.atan2(dy, dx);
    const xVelocity = Math.cos(angle) * this.speed;
    const yVelocity = Math.sin(angle) * this.speed;

    // Only update player if distance from mouse greater than 2
    // I must be able to simplify this if else chain though, maybe?
    // Gross disgusting 3am code
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      if (wall) {
        if (this.x + this.radius >= 95 && dx > 2) {
          this.x = 95 - this.radius;
        } else {
          this.x += xVelocity;
        }
      } else {
        this.x += xVelocity;
      }

      this.y += yVelocity;
    }

    // Collision for walls
    if (this.x - this.radius <= 0) this.x = this.radius + 1;
    if (this.x + this.radius >= innerWidth) this.x = innerWidth - this.radius;
    if (this.y - this.radius <= 0) this.y = this.radius + 1;
    if (this.y + this.radius >= innerHeight) this.y = innerHeight - this.radius;
  }
}

class Goal {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = false;
  }
  draw(ctx) {
    if (this.fill === true) {
      ctx.fillStyle = "#7bf977";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.strokeStyle = "#7bf977";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  update(ctx, player) {
    this.draw(ctx);
    if (
      player.x - player.radius > this.x &&
      player.y - player.radius > this.y &&
      player.y + player.radius < this.y + this.height
    ) {
      this.fill = true;
      return true;
    } else {
      this.fill = false;
    }
  }
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Classes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Classes */ "./src/Classes.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
// import resolveCollision from "./util-elastic-collision";



// function circlePattern() {
//   const p = [];
//   const particleCount = 15;

//   let angle = 360 - 90;
//   let dangle = 360 / particleCount;

//   for (let i = 0; i < particleCount; i++) {
//     angle += dangle;
//     circle.style.transform = `rotate(${angle}deg) translate(${ciclegraph.clientWidth /
//       2}px) rotate(-${angle}deg)`;
//     p.push(new Particle());
//   }

//   return p;
// }
function singleParticle() {
  return [new _Classes__WEBPACK_IMPORTED_MODULE_0__["Particle"](innerWidth / 2, innerHeight / 2, 30, Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(), 0, 0)];
}

function stackParticles() {
  const p = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    p.push(new _Classes__WEBPACK_IMPORTED_MODULE_0__["Particle"](innerWidth / 2, innerHeight / 2, 10, Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(), 0, 0));
  }

  return p;
}
function circleParticles() {
  const p = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 5 + 2;
    p.push(
      new _Classes__WEBPACK_IMPORTED_MODULE_0__["Particle"](innerWidth / 2, innerHeight / 2, radius, Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(), 0, 0)
    );
  }

  return p;
}

// This would be great to make it accept also a function and delay pehaps
function changeParticlesSequential(particles) {
  let i = 0;

  const interval = setInterval(() => {
    particles[i].velocity.x = (Math.random() - 0.5) * 6;
    particles[i].velocity.y = (Math.random() - 0.5) * 6;

    if (i++ >= particles.length - 1) {
      i = 0;
      // clearInterval(interval);
    }
  }, 300);

  return interval;
}

function changeParticlesConcurrent(particles) {
  const moveSequence = [
    [2, 0],
    [0, 1],
    [-2, 0],
    [0, -1],
  ];
  let i = 0;

  const interval = setInterval(() => {
    particles.forEach((p) => {
      p.velocity.x = moveSequence[i][0];
      p.velocity.y = moveSequence[i][1];
    });

    if (i >= moveSequence.length - 1) {
      i = 0;
    } else {
      i++;
    }
  }, 2000);

  return interval;
}

function newParticlePattern() {
  const p = [];
  const particleCount = 15;

  for (let i = 1; i <= particleCount; i++) {
    if (i % 2 === 0) {
      p.push(new _Classes__WEBPACK_IMPORTED_MODULE_0__["Particle"](60 * i + 105, 40, 30, Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(), 2, 2, false));
    } else {
      p.push(
        new _Classes__WEBPACK_IMPORTED_MODULE_0__["Particle"](
          60 * i + 105,
          innerHeight - 40,
          30,
          Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(),
          2,
          -2,
          false
        )
      );
    }
  }

  return p;
}

// Create particle objects
function particleCreator(level) {
  const p = [];
  const wallEnd = 105;
  const objects = level.objects();

  for (let i = 0; i < objects; i++) {
    const radius = level.radius();
    let x = level.x(radius, wallEnd);
    let y = level.y(radius);
    const xS = level.xSpeed();
    const yS = level.ySpeed();
    const color = level.color();

    // Skip first generation, only 1 circle
    if (i !== 0) {
      // Keep track of retries for a no overlap circle
      let retries = 0;

      for (let j = 0; j < p.length; j++) {
        if (retries > 100) {
          console.log("Not enough space for circles!");
          break;
        }
        const dist = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["distance"])(x, y, p[j].x, p[j].y);

        if (dist - radius - p[j].radius < 0) {
          // The + 105 here is for the wall
          x = level.x(radius, wallEnd);
          y = level.y(radius);

          // Reset loop to check if replacement
          // circle has overlap itself.
          j = -1;
          retries++;
        }
      }
    }

    p.push(new _Classes__WEBPACK_IMPORTED_MODULE_0__["Particle"](x, y, radius, color, xS, yS, level.wallCollision));
  }
  return p;
}

// Sets game state and all objects to starting setup
function init() {
  particles = [];
  player = null;
  wall = true;
  goal = null;

  // Create particle objects
  // particles = particleCreator(particleConfigs[level]);
  // particles = newParticlePattern();
  // particles = stackParticles();
  particles = circleParticles();

  // Create player object
  const pR = 30;
  const pX = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(pR, 100 - pR);
  const pY = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(pR, canvas.height - pR);
  player = new _Classes__WEBPACK_IMPORTED_MODULE_0__["Player"](pX, pY, pR, "red");

  // Create goal object
  const goalWidth = 100;
  const goalHeight = 160;
  const goalX = canvas.width - goalWidth;
  const goalY = canvas.height / 2 - goalHeight / 2;
  goal = new _Classes__WEBPACK_IMPORTED_MODULE_0__["Goal"](goalX, goalY, goalWidth, goalHeight);

  return "Initialized game objects.";
}

// The animation loop
function animate() {
  frameRequest = requestAnimationFrame(animate);

  // Clear canvas for next draw
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Alt to clearRect for an effect
  // ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draws goal and detects if player has entered the goal.
  // Returns undefined until goal reached then returns true.
  const goalReached = goal.update(ctx, player);

  // If Goal is reached set to next level and continue
  if (goalReached) {
    cancelAnimationFrame(frameRequest);
    goal.draw(ctx);
    setTimeout(() => {
      alert(`You beat level ${level + 1}!`);
      if (level < particleConfigs.length - 1) {
        level += 1;
      } else {
        level = 0;
      }
      init();
      animate();
    });
  }

  // If they player is behind starting wall, draw the wall
  // else, update / draw particle position and check for
  // collision. If collision then reset level
  if (wall === true) {
    // Draw left start area barrier
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, canvas.height);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#eeeeee";
    ctx.stroke();
    drawParticleFrame(ctx);
  } else {
    // Hmm what happens here when init and animate
    // are called after cancle animation?
    particles.forEach((p) => {
      p.circleUpdate(ctx, mouse);
      // const collision = p.update(ctx, particles, player);
      // if (collision) {
      //   cancelAnimationFrame(frameRequest);
      //   p.draw(ctx);
      //   setTimeout(() => {
      //     alert("You lose");
      //     init();
      //     animate();
      //   });
      // }
    });
  }

  player.update(ctx, wall, mouse);
}

// For testing to see first render. Comment out animate().
function drawParticleFrame(ctx) {
  particles.forEach((p) => {
    p.draw(ctx);
  });
}

// Dynamically generate number of balls based on screen dimensions
function balls() {
  return Math.floor(innerHeight / 100 + innerWidth / 200);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
// canvas.style.background = "#0c0c0c";
canvas.style.background = "rgb(0, 0, 0)";

// Colors for randomColor function
const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

let mouse = {
  x: 30,
  y: innerHeight / 2,
};

let level = 0;

let wall = true;

// Objects for canvas
let particles;
let player;
let goal;

let frameRequest;

// Options for particle objects
const particleConfigs = [
  {
    objects: () => balls(),
    radius: () => Math.random() * 60 + 15,
    x: (radius, wall) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius + wall, canvas.width - radius),
    y: (radius) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius, canvas.height - radius),
    xSpeed: () => (Math.random() - 0.5) * 5,
    ySpeed: () => (Math.random() - 0.5) * 5,
    color: () => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(),
  },
  {
    wallCollision: false,
    objects: () => balls() + 10,
    radius: () => 30,
    x: (radius, wall) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius + wall, canvas.width - radius),
    y: (radius) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius, canvas.height - radius),
    ySpeed: () => (Math.random() - 0.5) * 8,
    xSpeed: () => (Math.random() - 0.5) * 1,
    color: () => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randomColor"])(colors),
  },
  {
    objects: () => balls() + 20,
    radius: () => 10,
    x: (radius, wall) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius + wall, canvas.width - radius),
    y: (radius) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius, canvas.height - radius),
    xSpeed: () => 3,
    ySpeed: () => 0,
    color: () => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["niceColor"])(),
  },
  {
    objects: () => balls() - 5,
    radius: () => 100,
    x: (radius, wall) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius + wall, canvas.width - radius),
    y: (radius) => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["randInt"])(radius, canvas.height - radius),
    xSpeed: () => (Math.random() - 0.5) * 2,
    ySpeed: () => (Math.random() - 0.5) * 2,
    color: () => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getColor"])(),
  },
];

// Updates mouse state
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Resizing resets game
addEventListener("resize", (event) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

addEventListener("click", (event) => {
  const clickDistance = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["distance"])(
    event.clientX,
    event.clientY,
    player.x,
    player.y
  );

  // If click happens within radius of player circle, set wall to false
  if (clickDistance < player.radius) {
    wall = false;
  }

  changeParticlesSequential(particles);
  // changeParticlesConcurrent(particles);
});

// Right click resets game
addEventListener("contextmenu", (event) => {
  event.preventDefault();
  init();
});

init();

// drawParticleFrame(ctx);
animate();


/***/ }),

/***/ "./src/util-elastic-collision.js":
/*!***************************************!*\
  !*** ./src/util-elastic-collision.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return resolveCollision; });
/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: randInt, randomColor, getColor, niceColor, distance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randInt", function() { return randInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomColor", function() { return randomColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getColor", function() { return getColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "niceColor", function() { return niceColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distance", function() { return distance; });
/**
 * Random Int from Range Inclusive
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Three optional function to get colors
function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function getColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function niceColor() {
  const r = randInt(0, 360);
  return `hsl(${r}deg 100% 50%)`;
}

// Pythagorean theorem
function distance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NsYXNzZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsLWVsYXN0aWMtY29sbGlzaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF3RDtBQUNaOztBQUVyQztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsc0RBQU87QUFDckMsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0Isc0JBQXNCO0FBQzVDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQix1REFBUTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7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O0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQSxnQkFBZ0IsRUFBRTtBQUNsQjs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiaW1wb3J0IHJlc29sdmVDb2xsaXNpb24gZnJvbSBcIi4vdXRpbC1lbGFzdGljLWNvbGxpc2lvblwiO1xyXG5pbXBvcnQgeyBkaXN0YW5jZSwgcmFuZEludCB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFydGljbGUge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHksIHJhZGl1cywgY29sb3IsIHhTcGVlZCwgeVNwZWVkLCB3YWxsQ29sbGlzaW9uID0gdHJ1ZSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLnhTcGVlZCA9IHhTcGVlZDtcclxuICAgIHRoaXMueVNwZWVkID0geVNwZWVkO1xyXG4gICAgdGhpcy52ZWxvY2l0eSA9IHtcclxuICAgICAgeDogdGhpcy54U3BlZWQsXHJcbiAgICAgIHk6IHRoaXMueVNwZWVkLFxyXG4gICAgfTtcclxuICAgIHRoaXMuY2lyY2xWZWxvY2l0eSA9IDAuMDE7XHJcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcclxuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgIHRoaXMubWFzcyA9IDE7IC8vIFVzZWQgaW4gZWxhc3RpYyBjb2xsaXNpb25cclxuICAgIHRoaXMub3BhY2l0eSA9IDAuMjtcclxuICAgIHRoaXMud2FsbENvbGxpc2lvbiA9IHdhbGxDb2xsaXNpb247XHJcbiAgICB0aGlzLnJhZGlhbnMgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDI7XHJcbiAgICB0aGlzLmRpc3RhbmNlRnJvbUNlbnRlciA9IHJhbmRJbnQoMTAwLCAyMjApO1xyXG4gICAgdGhpcy5sYXN0TW91c2UgPSB7IHg6IHgsIHk6IHkgfTtcclxuICAgIC8vIHRoaXMuZGlzdGFuY2VGcm9tQ2VudGVyID0ge1xyXG4gICAgLy8gICB4OiByYW5kSW50KDUwLCAxMjApLFxyXG4gICAgLy8gICB5OiByYW5kSW50KDUwLCAxMjApLFxyXG4gICAgLy8gfTtcclxuICB9XHJcblxyXG4gIGRyYXcoY3R4KSB7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcblxyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAvLyBjdHguY2xvc2VQYXRoKCk7IC8vIE5vdCBzdXJlIGlmIG5lY2Vzc2FyeVxyXG4gIH1cclxuXHJcbiAgY2lyY2xlRHJhdyhjdHgsIGxhc3RQb2ludCkge1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLnJhZGl1cztcclxuICAgIGN0eC5tb3ZlVG8obGFzdFBvaW50LngsIGxhc3RQb2ludC55KTtcclxuICAgIGN0eC5saW5lVG8odGhpcy54LCB0aGlzLnkpO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gIH1cclxuXHJcbiAgY2lyY2xlVXBkYXRlKGN0eCwgbW91c2UpIHtcclxuICAgIGNvbnN0IGxhc3RQb2ludCA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfTtcclxuXHJcbiAgICAvLyBNb3ZlIHBvaW50cyBvdmVyIHRpbWVcclxuICAgIHRoaXMucmFkaWFucyArPSB0aGlzLmNpcmNsVmVsb2NpdHk7XHJcblxyXG4gICAgLy8gRHJhZyBlZmZlY3RcclxuICAgIHRoaXMubGFzdE1vdXNlLnggKz0gKG1vdXNlLnggLSB0aGlzLmxhc3RNb3VzZS54KSAqIDAuMDU7XHJcbiAgICB0aGlzLmxhc3RNb3VzZS55ICs9IChtb3VzZS55IC0gdGhpcy5sYXN0TW91c2UueSkgKiAwLjA1O1xyXG5cclxuICAgIC8vIENpcmN1bGFyIE1vdGlvblxyXG4gICAgLy8gdGhpcy54ID0gaW5uZXJXaWR0aCAvIDIgKyBNYXRoLmNvcyh0aGlzLnJhZGlhbnMpICogdGhpcy5kaXN0YW5jZUZyb21DZW50ZXI7XHJcbiAgICAvLyB0aGlzLnkgPSBpbm5lckhlaWdodCAvIDIgKyBNYXRoLnNpbih0aGlzLnJhZGlhbnMpICogdGhpcy5kaXN0YW5jZUZyb21DZW50ZXI7XHJcblxyXG4gICAgLy8gdGhpcy54ID0gbW91c2UueCArIE1hdGguY29zKHRoaXMucmFkaWFucykgKiB0aGlzLmRpc3RhbmNlRnJvbUNlbnRlcjtcclxuICAgIC8vIHRoaXMueSA9IG1vdXNlLnkgKyBNYXRoLnNpbih0aGlzLnJhZGlhbnMpICogdGhpcy5kaXN0YW5jZUZyb21DZW50ZXI7XHJcblxyXG4gICAgdGhpcy54ID1cclxuICAgICAgdGhpcy5sYXN0TW91c2UueCArIE1hdGguY29zKHRoaXMucmFkaWFucykgKiB0aGlzLmRpc3RhbmNlRnJvbUNlbnRlcjtcclxuICAgIHRoaXMueSA9XHJcbiAgICAgIHRoaXMubGFzdE1vdXNlLnkgKyBNYXRoLnNpbih0aGlzLnJhZGlhbnMpICogdGhpcy5kaXN0YW5jZUZyb21DZW50ZXI7XHJcblxyXG4gICAgLy8gdGhpcy5kcmF3KGN0eCk7XHJcbiAgICB0aGlzLmNpcmNsZURyYXcoY3R4LCBsYXN0UG9pbnQpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGN0eCwgcGFydGljbGVzLCBwbGF5ZXIpIHtcclxuICAgIHRoaXMuZHJhdyhjdHgpO1xyXG5cclxuICAgIC8vIExvb3Agb3ZlciBwYXJ0aWNsZXMgZm9yIGNvbGxpc2lvbiBkZXRlY3Rpb25cclxuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgIC8vIE5ldmVyIGNvbXBhcmUgcGFydGljbGUgdG8gaXRzZWxmLCBza2lwcyBpZiB0cnVlLlxyXG4gICAgLy8gICBpZiAodGhpcyA9PT0gcGFydGljbGVzW2ldKSBjb250aW51ZTtcclxuXHJcbiAgICAvLyAgIGNvbnN0IGRpc3QgPSBkaXN0YW5jZSh0aGlzLngsIHRoaXMueSwgcGFydGljbGVzW2ldLngsIHBhcnRpY2xlc1tpXS55KTtcclxuXHJcbiAgICAvLyAgIGlmIChkaXN0IC0gdGhpcy5yYWRpdXMgLSBwYXJ0aWNsZXNbaV0ucmFkaXVzIDwgMCkge1xyXG4gICAgLy8gICAgIC8vIEVsYXN0aWMgY29sbGlzaW9uXHJcbiAgICAvLyAgICAgcmVzb2x2ZUNvbGxpc2lvbih0aGlzLCBwYXJ0aWNsZXNbaV0pO1xyXG5cclxuICAgIC8vICAgICAvLyBMaWdodCB1cCBwYXJ0aWNsZXMgb24gY29sbGlzaW9uXHJcbiAgICAvLyAgICAgdGhpcy5vcGFjaXR5ID0gMC42O1xyXG4gICAgLy8gICAgIHBhcnRpY2xlc1tpXS5vcGFjaXR5ID0gMC42O1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gUmVzZXQgYmFjayB0byB0cmFuc3BhcmVudCBhZnRlciBjb2xsaXNpb25cclxuICAgIGlmICh0aGlzLm9wYWNpdHkgPiAwLjAyKSB7XHJcbiAgICAgIHRoaXMub3BhY2l0eSAtPSAwLjAyO1xyXG4gICAgICB0aGlzLm9wYWNpdHkgPSBNYXRoLm1heCgwLCB0aGlzLm9wYWNpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbGxpc2lvbiBkZXRlY3Rpb24gZm9yIHdhbGxzXHJcbiAgICBpZiAodGhpcy53YWxsQ29sbGlzaW9uKSB7XHJcbiAgICAgIGlmICh0aGlzLnggLSB0aGlzLnJhZGl1cyA8IDAgfHwgdGhpcy54ICsgdGhpcy5yYWRpdXMgPj0gaW5uZXJXaWR0aCkge1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkueCA9IC10aGlzLnZlbG9jaXR5Lng7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMueSAtIHRoaXMucmFkaXVzIDw9IDAgfHwgdGhpcy55ICsgdGhpcy5yYWRpdXMgPj0gaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5LnkgPSAtdGhpcy52ZWxvY2l0eS55O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBQYXJ0aWNsZXMgY2FuIGdvIG9mZnNjcmVlbiBhbmQgY29tZSBiYWNrIG9wcG9zaXRlIHNpZGVcclxuICAgICAgaWYgKHRoaXMueCAtIHRoaXMucmFkaXVzID4gaW5uZXJXaWR0aCArIDEwMDApIHRoaXMueCA9IDAgLSB0aGlzLnJhZGl1cztcclxuICAgICAgaWYgKHRoaXMueCArIHRoaXMucmFkaXVzIDwgMCAtIDEwMDApIHRoaXMueCA9IGlubmVyV2lkdGggKyB0aGlzLnJhZGl1cztcclxuICAgICAgaWYgKHRoaXMueSAtIHRoaXMucmFkaXVzID4gaW5uZXJIZWlnaHQgKyAxMDAwKSB0aGlzLnkgPSAwIC0gdGhpcy5yYWRpdXM7XHJcbiAgICAgIGlmICh0aGlzLnkgKyB0aGlzLnJhZGl1cyA8IDAgLSAxMDAwKSB0aGlzLnkgPSBpbm5lckhlaWdodCArIHRoaXMucmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBsYXllciBvYmplY3QgY29sbGlzaW9uIChzaG91bGQgSSBoYW5kbGUgaW4gcGxheWVyIGNsYXNzPylcclxuICAgIGNvbnN0IHBsYXllckRpc3RhbmNlID0gZGlzdGFuY2UodGhpcy54LCB0aGlzLnksIHBsYXllci54LCBwbGF5ZXIueSk7XHJcblxyXG4gICAgaWYgKHBsYXllckRpc3RhbmNlIC0gdGhpcy5yYWRpdXMgLSBwbGF5ZXIucmFkaXVzIDw9IDApIHtcclxuICAgICAgdGhpcy5vcGFjaXR5ID0gMTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0IHBhcnRpY2xlcyB0byBuZXh0IHBvc2l0aW9uXHJcbiAgICB0aGlzLnggKz0gdGhpcy52ZWxvY2l0eS54O1xyXG4gICAgdGhpcy55ICs9IHRoaXMudmVsb2NpdHkueTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXIge1xyXG4gIGNvbnN0cnVjdG9yKHgsIHksIHJhZGl1cywgY29sb3IpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy5zcGVlZCA9IDM7XHJcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcclxuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICB9XHJcbiAgZHJhdyhjdHgpIHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gIH1cclxuICB1cGRhdGUoY3R4LCB3YWxsLCBtb3VzZSkge1xyXG4gICAgdGhpcy5kcmF3KGN0eCk7XHJcbiAgICBjb25zdCBkeCA9IG1vdXNlLnggLSB0aGlzLng7XHJcbiAgICBjb25zdCBkeSA9IG1vdXNlLnkgLSB0aGlzLnk7XHJcbiAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoZHksIGR4KTtcclxuICAgIGNvbnN0IHhWZWxvY2l0eSA9IE1hdGguY29zKGFuZ2xlKSAqIHRoaXMuc3BlZWQ7XHJcbiAgICBjb25zdCB5VmVsb2NpdHkgPSBNYXRoLnNpbihhbmdsZSkgKiB0aGlzLnNwZWVkO1xyXG5cclxuICAgIC8vIE9ubHkgdXBkYXRlIHBsYXllciBpZiBkaXN0YW5jZSBmcm9tIG1vdXNlIGdyZWF0ZXIgdGhhbiAyXHJcbiAgICAvLyBJIG11c3QgYmUgYWJsZSB0byBzaW1wbGlmeSB0aGlzIGlmIGVsc2UgY2hhaW4gdGhvdWdoLCBtYXliZT9cclxuICAgIC8vIEdyb3NzIGRpc2d1c3RpbmcgM2FtIGNvZGVcclxuICAgIGlmIChNYXRoLmFicyhkeCkgPiAyIHx8IE1hdGguYWJzKGR5KSA+IDIpIHtcclxuICAgICAgaWYgKHdhbGwpIHtcclxuICAgICAgICBpZiAodGhpcy54ICsgdGhpcy5yYWRpdXMgPj0gOTUgJiYgZHggPiAyKSB7XHJcbiAgICAgICAgICB0aGlzLnggPSA5NSAtIHRoaXMucmFkaXVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnggKz0geFZlbG9jaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnggKz0geFZlbG9jaXR5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnkgKz0geVZlbG9jaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbGxpc2lvbiBmb3Igd2FsbHNcclxuICAgIGlmICh0aGlzLnggLSB0aGlzLnJhZGl1cyA8PSAwKSB0aGlzLnggPSB0aGlzLnJhZGl1cyArIDE7XHJcbiAgICBpZiAodGhpcy54ICsgdGhpcy5yYWRpdXMgPj0gaW5uZXJXaWR0aCkgdGhpcy54ID0gaW5uZXJXaWR0aCAtIHRoaXMucmFkaXVzO1xyXG4gICAgaWYgKHRoaXMueSAtIHRoaXMucmFkaXVzIDw9IDApIHRoaXMueSA9IHRoaXMucmFkaXVzICsgMTtcclxuICAgIGlmICh0aGlzLnkgKyB0aGlzLnJhZGl1cyA+PSBpbm5lckhlaWdodCkgdGhpcy55ID0gaW5uZXJIZWlnaHQgLSB0aGlzLnJhZGl1cztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHb2FsIHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdGhpcy5maWxsID0gZmFsc2U7XHJcbiAgfVxyXG4gIGRyYXcoY3R4KSB7XHJcbiAgICBpZiAodGhpcy5maWxsID09PSB0cnVlKSB7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcIiM3YmY5NzdcIjtcclxuICAgICAgY3R4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiM3YmY5NzdcIjtcclxuICAgICAgY3R4LnN0cm9rZVJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZShjdHgsIHBsYXllcikge1xyXG4gICAgdGhpcy5kcmF3KGN0eCk7XHJcbiAgICBpZiAoXHJcbiAgICAgIHBsYXllci54IC0gcGxheWVyLnJhZGl1cyA+IHRoaXMueCAmJlxyXG4gICAgICBwbGF5ZXIueSAtIHBsYXllci5yYWRpdXMgPiB0aGlzLnkgJiZcclxuICAgICAgcGxheWVyLnkgKyBwbGF5ZXIucmFkaXVzIDwgdGhpcy55ICsgdGhpcy5oZWlnaHRcclxuICAgICkge1xyXG4gICAgICB0aGlzLmZpbGwgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZmlsbCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBpbXBvcnQgcmVzb2x2ZUNvbGxpc2lvbiBmcm9tIFwiLi91dGlsLWVsYXN0aWMtY29sbGlzaW9uXCI7XHJcbmltcG9ydCB7IFBhcnRpY2xlLCBHb2FsLCBQbGF5ZXIgfSBmcm9tIFwiLi9DbGFzc2VzXCI7XHJcbmltcG9ydCB7IHJhbmRJbnQsIHJhbmRvbUNvbG9yLCBnZXRDb2xvciwgbmljZUNvbG9yLCBkaXN0YW5jZSB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG4vLyBmdW5jdGlvbiBjaXJjbGVQYXR0ZXJuKCkge1xyXG4vLyAgIGNvbnN0IHAgPSBbXTtcclxuLy8gICBjb25zdCBwYXJ0aWNsZUNvdW50ID0gMTU7XHJcblxyXG4vLyAgIGxldCBhbmdsZSA9IDM2MCAtIDkwO1xyXG4vLyAgIGxldCBkYW5nbGUgPSAzNjAgLyBwYXJ0aWNsZUNvdW50O1xyXG5cclxuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xyXG4vLyAgICAgYW5nbGUgKz0gZGFuZ2xlO1xyXG4vLyAgICAgY2lyY2xlLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpIHRyYW5zbGF0ZSgke2NpY2xlZ3JhcGguY2xpZW50V2lkdGggL1xyXG4vLyAgICAgICAyfXB4KSByb3RhdGUoLSR7YW5nbGV9ZGVnKWA7XHJcbi8vICAgICBwLnB1c2gobmV3IFBhcnRpY2xlKCkpO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgcmV0dXJuIHA7XHJcbi8vIH1cclxuZnVuY3Rpb24gc2luZ2xlUGFydGljbGUoKSB7XHJcbiAgcmV0dXJuIFtuZXcgUGFydGljbGUoaW5uZXJXaWR0aCAvIDIsIGlubmVySGVpZ2h0IC8gMiwgMzAsIGdldENvbG9yKCksIDAsIDApXTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RhY2tQYXJ0aWNsZXMoKSB7XHJcbiAgY29uc3QgcCA9IFtdO1xyXG4gIGNvbnN0IHBhcnRpY2xlQ291bnQgPSA1MDtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZUNvdW50OyBpKyspIHtcclxuICAgIHAucHVzaChuZXcgUGFydGljbGUoaW5uZXJXaWR0aCAvIDIsIGlubmVySGVpZ2h0IC8gMiwgMTAsIGdldENvbG9yKCksIDAsIDApKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwO1xyXG59XHJcbmZ1bmN0aW9uIGNpcmNsZVBhcnRpY2xlcygpIHtcclxuICBjb25zdCBwID0gW107XHJcbiAgY29uc3QgcGFydGljbGVDb3VudCA9IDUwO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xyXG4gICAgY29uc3QgcmFkaXVzID0gTWF0aC5yYW5kb20oKSAqIDUgKyAyO1xyXG4gICAgcC5wdXNoKFxyXG4gICAgICBuZXcgUGFydGljbGUoaW5uZXJXaWR0aCAvIDIsIGlubmVySGVpZ2h0IC8gMiwgcmFkaXVzLCBnZXRDb2xvcigpLCAwLCAwKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwO1xyXG59XHJcblxyXG4vLyBUaGlzIHdvdWxkIGJlIGdyZWF0IHRvIG1ha2UgaXQgYWNjZXB0IGFsc28gYSBmdW5jdGlvbiBhbmQgZGVsYXkgcGVoYXBzXHJcbmZ1bmN0aW9uIGNoYW5nZVBhcnRpY2xlc1NlcXVlbnRpYWwocGFydGljbGVzKSB7XHJcbiAgbGV0IGkgPSAwO1xyXG5cclxuICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgIHBhcnRpY2xlc1tpXS52ZWxvY2l0eS54ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogNjtcclxuICAgIHBhcnRpY2xlc1tpXS52ZWxvY2l0eS55ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogNjtcclxuXHJcbiAgICBpZiAoaSsrID49IHBhcnRpY2xlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgIGkgPSAwO1xyXG4gICAgICAvLyBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgIH1cclxuICB9LCAzMDApO1xyXG5cclxuICByZXR1cm4gaW50ZXJ2YWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoYW5nZVBhcnRpY2xlc0NvbmN1cnJlbnQocGFydGljbGVzKSB7XHJcbiAgY29uc3QgbW92ZVNlcXVlbmNlID0gW1xyXG4gICAgWzIsIDBdLFxyXG4gICAgWzAsIDFdLFxyXG4gICAgWy0yLCAwXSxcclxuICAgIFswLCAtMV0sXHJcbiAgXTtcclxuICBsZXQgaSA9IDA7XHJcblxyXG4gIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgcGFydGljbGVzLmZvckVhY2goKHApID0+IHtcclxuICAgICAgcC52ZWxvY2l0eS54ID0gbW92ZVNlcXVlbmNlW2ldWzBdO1xyXG4gICAgICBwLnZlbG9jaXR5LnkgPSBtb3ZlU2VxdWVuY2VbaV1bMV07XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoaSA+PSBtb3ZlU2VxdWVuY2UubGVuZ3RoIC0gMSkge1xyXG4gICAgICBpID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkrKztcclxuICAgIH1cclxuICB9LCAyMDAwKTtcclxuXHJcbiAgcmV0dXJuIGludGVydmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdQYXJ0aWNsZVBhdHRlcm4oKSB7XHJcbiAgY29uc3QgcCA9IFtdO1xyXG4gIGNvbnN0IHBhcnRpY2xlQ291bnQgPSAxNTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGFydGljbGVDb3VudDsgaSsrKSB7XHJcbiAgICBpZiAoaSAlIDIgPT09IDApIHtcclxuICAgICAgcC5wdXNoKG5ldyBQYXJ0aWNsZSg2MCAqIGkgKyAxMDUsIDQwLCAzMCwgZ2V0Q29sb3IoKSwgMiwgMiwgZmFsc2UpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHAucHVzaChcclxuICAgICAgICBuZXcgUGFydGljbGUoXHJcbiAgICAgICAgICA2MCAqIGkgKyAxMDUsXHJcbiAgICAgICAgICBpbm5lckhlaWdodCAtIDQwLFxyXG4gICAgICAgICAgMzAsXHJcbiAgICAgICAgICBnZXRDb2xvcigpLFxyXG4gICAgICAgICAgMixcclxuICAgICAgICAgIC0yLFxyXG4gICAgICAgICAgZmFsc2VcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcDtcclxufVxyXG5cclxuLy8gQ3JlYXRlIHBhcnRpY2xlIG9iamVjdHNcclxuZnVuY3Rpb24gcGFydGljbGVDcmVhdG9yKGxldmVsKSB7XHJcbiAgY29uc3QgcCA9IFtdO1xyXG4gIGNvbnN0IHdhbGxFbmQgPSAxMDU7XHJcbiAgY29uc3Qgb2JqZWN0cyA9IGxldmVsLm9iamVjdHMoKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RzOyBpKyspIHtcclxuICAgIGNvbnN0IHJhZGl1cyA9IGxldmVsLnJhZGl1cygpO1xyXG4gICAgbGV0IHggPSBsZXZlbC54KHJhZGl1cywgd2FsbEVuZCk7XHJcbiAgICBsZXQgeSA9IGxldmVsLnkocmFkaXVzKTtcclxuICAgIGNvbnN0IHhTID0gbGV2ZWwueFNwZWVkKCk7XHJcbiAgICBjb25zdCB5UyA9IGxldmVsLnlTcGVlZCgpO1xyXG4gICAgY29uc3QgY29sb3IgPSBsZXZlbC5jb2xvcigpO1xyXG5cclxuICAgIC8vIFNraXAgZmlyc3QgZ2VuZXJhdGlvbiwgb25seSAxIGNpcmNsZVxyXG4gICAgaWYgKGkgIT09IDApIHtcclxuICAgICAgLy8gS2VlcCB0cmFjayBvZiByZXRyaWVzIGZvciBhIG5vIG92ZXJsYXAgY2lyY2xlXHJcbiAgICAgIGxldCByZXRyaWVzID0gMDtcclxuXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGlmIChyZXRyaWVzID4gMTAwKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBlbm91Z2ggc3BhY2UgZm9yIGNpcmNsZXMhXCIpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRpc3QgPSBkaXN0YW5jZSh4LCB5LCBwW2pdLngsIHBbal0ueSk7XHJcblxyXG4gICAgICAgIGlmIChkaXN0IC0gcmFkaXVzIC0gcFtqXS5yYWRpdXMgPCAwKSB7XHJcbiAgICAgICAgICAvLyBUaGUgKyAxMDUgaGVyZSBpcyBmb3IgdGhlIHdhbGxcclxuICAgICAgICAgIHggPSBsZXZlbC54KHJhZGl1cywgd2FsbEVuZCk7XHJcbiAgICAgICAgICB5ID0gbGV2ZWwueShyYWRpdXMpO1xyXG5cclxuICAgICAgICAgIC8vIFJlc2V0IGxvb3AgdG8gY2hlY2sgaWYgcmVwbGFjZW1lbnRcclxuICAgICAgICAgIC8vIGNpcmNsZSBoYXMgb3ZlcmxhcCBpdHNlbGYuXHJcbiAgICAgICAgICBqID0gLTE7XHJcbiAgICAgICAgICByZXRyaWVzKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcC5wdXNoKG5ldyBQYXJ0aWNsZSh4LCB5LCByYWRpdXMsIGNvbG9yLCB4UywgeVMsIGxldmVsLndhbGxDb2xsaXNpb24pKTtcclxuICB9XHJcbiAgcmV0dXJuIHA7XHJcbn1cclxuXHJcbi8vIFNldHMgZ2FtZSBzdGF0ZSBhbmQgYWxsIG9iamVjdHMgdG8gc3RhcnRpbmcgc2V0dXBcclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICBwYXJ0aWNsZXMgPSBbXTtcclxuICBwbGF5ZXIgPSBudWxsO1xyXG4gIHdhbGwgPSB0cnVlO1xyXG4gIGdvYWwgPSBudWxsO1xyXG5cclxuICAvLyBDcmVhdGUgcGFydGljbGUgb2JqZWN0c1xyXG4gIC8vIHBhcnRpY2xlcyA9IHBhcnRpY2xlQ3JlYXRvcihwYXJ0aWNsZUNvbmZpZ3NbbGV2ZWxdKTtcclxuICAvLyBwYXJ0aWNsZXMgPSBuZXdQYXJ0aWNsZVBhdHRlcm4oKTtcclxuICAvLyBwYXJ0aWNsZXMgPSBzdGFja1BhcnRpY2xlcygpO1xyXG4gIHBhcnRpY2xlcyA9IGNpcmNsZVBhcnRpY2xlcygpO1xyXG5cclxuICAvLyBDcmVhdGUgcGxheWVyIG9iamVjdFxyXG4gIGNvbnN0IHBSID0gMzA7XHJcbiAgY29uc3QgcFggPSByYW5kSW50KHBSLCAxMDAgLSBwUik7XHJcbiAgY29uc3QgcFkgPSByYW5kSW50KHBSLCBjYW52YXMuaGVpZ2h0IC0gcFIpO1xyXG4gIHBsYXllciA9IG5ldyBQbGF5ZXIocFgsIHBZLCBwUiwgXCJyZWRcIik7XHJcblxyXG4gIC8vIENyZWF0ZSBnb2FsIG9iamVjdFxyXG4gIGNvbnN0IGdvYWxXaWR0aCA9IDEwMDtcclxuICBjb25zdCBnb2FsSGVpZ2h0ID0gMTYwO1xyXG4gIGNvbnN0IGdvYWxYID0gY2FudmFzLndpZHRoIC0gZ29hbFdpZHRoO1xyXG4gIGNvbnN0IGdvYWxZID0gY2FudmFzLmhlaWdodCAvIDIgLSBnb2FsSGVpZ2h0IC8gMjtcclxuICBnb2FsID0gbmV3IEdvYWwoZ29hbFgsIGdvYWxZLCBnb2FsV2lkdGgsIGdvYWxIZWlnaHQpO1xyXG5cclxuICByZXR1cm4gXCJJbml0aWFsaXplZCBnYW1lIG9iamVjdHMuXCI7XHJcbn1cclxuXHJcbi8vIFRoZSBhbmltYXRpb24gbG9vcFxyXG5mdW5jdGlvbiBhbmltYXRlKCkge1xyXG4gIGZyYW1lUmVxdWVzdCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuXHJcbiAgLy8gQ2xlYXIgY2FudmFzIGZvciBuZXh0IGRyYXdcclxuICAvLyBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gIC8vIEFsdCB0byBjbGVhclJlY3QgZm9yIGFuIGVmZmVjdFxyXG4gIC8vIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSlcIjtcclxuICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDAsIDAsIDAsIDAuMDUpXCI7XHJcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gIC8vIERyYXdzIGdvYWwgYW5kIGRldGVjdHMgaWYgcGxheWVyIGhhcyBlbnRlcmVkIHRoZSBnb2FsLlxyXG4gIC8vIFJldHVybnMgdW5kZWZpbmVkIHVudGlsIGdvYWwgcmVhY2hlZCB0aGVuIHJldHVybnMgdHJ1ZS5cclxuICBjb25zdCBnb2FsUmVhY2hlZCA9IGdvYWwudXBkYXRlKGN0eCwgcGxheWVyKTtcclxuXHJcbiAgLy8gSWYgR29hbCBpcyByZWFjaGVkIHNldCB0byBuZXh0IGxldmVsIGFuZCBjb250aW51ZVxyXG4gIGlmIChnb2FsUmVhY2hlZCkge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoZnJhbWVSZXF1ZXN0KTtcclxuICAgIGdvYWwuZHJhdyhjdHgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGFsZXJ0KGBZb3UgYmVhdCBsZXZlbCAke2xldmVsICsgMX0hYCk7XHJcbiAgICAgIGlmIChsZXZlbCA8IHBhcnRpY2xlQ29uZmlncy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgbGV2ZWwgKz0gMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXZlbCA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgaW5pdCgpO1xyXG4gICAgICBhbmltYXRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZXkgcGxheWVyIGlzIGJlaGluZCBzdGFydGluZyB3YWxsLCBkcmF3IHRoZSB3YWxsXHJcbiAgLy8gZWxzZSwgdXBkYXRlIC8gZHJhdyBwYXJ0aWNsZSBwb3NpdGlvbiBhbmQgY2hlY2sgZm9yXHJcbiAgLy8gY29sbGlzaW9uLiBJZiBjb2xsaXNpb24gdGhlbiByZXNldCBsZXZlbFxyXG4gIGlmICh3YWxsID09PSB0cnVlKSB7XHJcbiAgICAvLyBEcmF3IGxlZnQgc3RhcnQgYXJlYSBiYXJyaWVyXHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKDEwMCwgMCk7XHJcbiAgICBjdHgubGluZVRvKDEwMCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICBjdHgubGluZVdpZHRoID0gMTA7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiNlZWVlZWVcIjtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICAgIGRyYXdQYXJ0aWNsZUZyYW1lKGN0eCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEhtbSB3aGF0IGhhcHBlbnMgaGVyZSB3aGVuIGluaXQgYW5kIGFuaW1hdGVcclxuICAgIC8vIGFyZSBjYWxsZWQgYWZ0ZXIgY2FuY2xlIGFuaW1hdGlvbj9cclxuICAgIHBhcnRpY2xlcy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgIHAuY2lyY2xlVXBkYXRlKGN0eCwgbW91c2UpO1xyXG4gICAgICAvLyBjb25zdCBjb2xsaXNpb24gPSBwLnVwZGF0ZShjdHgsIHBhcnRpY2xlcywgcGxheWVyKTtcclxuICAgICAgLy8gaWYgKGNvbGxpc2lvbikge1xyXG4gICAgICAvLyAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGZyYW1lUmVxdWVzdCk7XHJcbiAgICAgIC8vICAgcC5kcmF3KGN0eCk7XHJcbiAgICAgIC8vICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIC8vICAgICBhbGVydChcIllvdSBsb3NlXCIpO1xyXG4gICAgICAvLyAgICAgaW5pdCgpO1xyXG4gICAgICAvLyAgICAgYW5pbWF0ZSgpO1xyXG4gICAgICAvLyAgIH0pO1xyXG4gICAgICAvLyB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHBsYXllci51cGRhdGUoY3R4LCB3YWxsLCBtb3VzZSk7XHJcbn1cclxuXHJcbi8vIEZvciB0ZXN0aW5nIHRvIHNlZSBmaXJzdCByZW5kZXIuIENvbW1lbnQgb3V0IGFuaW1hdGUoKS5cclxuZnVuY3Rpb24gZHJhd1BhcnRpY2xlRnJhbWUoY3R4KSB7XHJcbiAgcGFydGljbGVzLmZvckVhY2goKHApID0+IHtcclxuICAgIHAuZHJhdyhjdHgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBEeW5hbWljYWxseSBnZW5lcmF0ZSBudW1iZXIgb2YgYmFsbHMgYmFzZWQgb24gc2NyZWVuIGRpbWVuc2lvbnNcclxuZnVuY3Rpb24gYmFsbHMoKSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoaW5uZXJIZWlnaHQgLyAxMDAgKyBpbm5lcldpZHRoIC8gMjAwKTtcclxufVxyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5jYW52YXMud2lkdGggPSBpbm5lcldpZHRoO1xyXG5jYW52YXMuaGVpZ2h0ID0gaW5uZXJIZWlnaHQ7XHJcbi8vIGNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMGMwYzBjXCI7XHJcbmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZ2IoMCwgMCwgMClcIjtcclxuXHJcbi8vIENvbG9ycyBmb3IgcmFuZG9tQ29sb3IgZnVuY3Rpb25cclxuY29uc3QgY29sb3JzID0gW1wiIzIxODVDNVwiLCBcIiM3RUNFRkRcIiwgXCIjRkZGNkU1XCIsIFwiI0ZGN0Y2NlwiXTtcclxuXHJcbmxldCBtb3VzZSA9IHtcclxuICB4OiAzMCxcclxuICB5OiBpbm5lckhlaWdodCAvIDIsXHJcbn07XHJcblxyXG5sZXQgbGV2ZWwgPSAwO1xyXG5cclxubGV0IHdhbGwgPSB0cnVlO1xyXG5cclxuLy8gT2JqZWN0cyBmb3IgY2FudmFzXHJcbmxldCBwYXJ0aWNsZXM7XHJcbmxldCBwbGF5ZXI7XHJcbmxldCBnb2FsO1xyXG5cclxubGV0IGZyYW1lUmVxdWVzdDtcclxuXHJcbi8vIE9wdGlvbnMgZm9yIHBhcnRpY2xlIG9iamVjdHNcclxuY29uc3QgcGFydGljbGVDb25maWdzID0gW1xyXG4gIHtcclxuICAgIG9iamVjdHM6ICgpID0+IGJhbGxzKCksXHJcbiAgICByYWRpdXM6ICgpID0+IE1hdGgucmFuZG9tKCkgKiA2MCArIDE1LFxyXG4gICAgeDogKHJhZGl1cywgd2FsbCkgPT4gcmFuZEludChyYWRpdXMgKyB3YWxsLCBjYW52YXMud2lkdGggLSByYWRpdXMpLFxyXG4gICAgeTogKHJhZGl1cykgPT4gcmFuZEludChyYWRpdXMsIGNhbnZhcy5oZWlnaHQgLSByYWRpdXMpLFxyXG4gICAgeFNwZWVkOiAoKSA9PiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA1LFxyXG4gICAgeVNwZWVkOiAoKSA9PiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiA1LFxyXG4gICAgY29sb3I6ICgpID0+IGdldENvbG9yKCksXHJcbiAgfSxcclxuICB7XHJcbiAgICB3YWxsQ29sbGlzaW9uOiBmYWxzZSxcclxuICAgIG9iamVjdHM6ICgpID0+IGJhbGxzKCkgKyAxMCxcclxuICAgIHJhZGl1czogKCkgPT4gMzAsXHJcbiAgICB4OiAocmFkaXVzLCB3YWxsKSA9PiByYW5kSW50KHJhZGl1cyArIHdhbGwsIGNhbnZhcy53aWR0aCAtIHJhZGl1cyksXHJcbiAgICB5OiAocmFkaXVzKSA9PiByYW5kSW50KHJhZGl1cywgY2FudmFzLmhlaWdodCAtIHJhZGl1cyksXHJcbiAgICB5U3BlZWQ6ICgpID0+IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDgsXHJcbiAgICB4U3BlZWQ6ICgpID0+IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDEsXHJcbiAgICBjb2xvcjogKCkgPT4gcmFuZG9tQ29sb3IoY29sb3JzKSxcclxuICB9LFxyXG4gIHtcclxuICAgIG9iamVjdHM6ICgpID0+IGJhbGxzKCkgKyAyMCxcclxuICAgIHJhZGl1czogKCkgPT4gMTAsXHJcbiAgICB4OiAocmFkaXVzLCB3YWxsKSA9PiByYW5kSW50KHJhZGl1cyArIHdhbGwsIGNhbnZhcy53aWR0aCAtIHJhZGl1cyksXHJcbiAgICB5OiAocmFkaXVzKSA9PiByYW5kSW50KHJhZGl1cywgY2FudmFzLmhlaWdodCAtIHJhZGl1cyksXHJcbiAgICB4U3BlZWQ6ICgpID0+IDMsXHJcbiAgICB5U3BlZWQ6ICgpID0+IDAsXHJcbiAgICBjb2xvcjogKCkgPT4gbmljZUNvbG9yKCksXHJcbiAgfSxcclxuICB7XHJcbiAgICBvYmplY3RzOiAoKSA9PiBiYWxscygpIC0gNSxcclxuICAgIHJhZGl1czogKCkgPT4gMTAwLFxyXG4gICAgeDogKHJhZGl1cywgd2FsbCkgPT4gcmFuZEludChyYWRpdXMgKyB3YWxsLCBjYW52YXMud2lkdGggLSByYWRpdXMpLFxyXG4gICAgeTogKHJhZGl1cykgPT4gcmFuZEludChyYWRpdXMsIGNhbnZhcy5oZWlnaHQgLSByYWRpdXMpLFxyXG4gICAgeFNwZWVkOiAoKSA9PiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLFxyXG4gICAgeVNwZWVkOiAoKSA9PiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyLFxyXG4gICAgY29sb3I6ICgpID0+IGdldENvbG9yKCksXHJcbiAgfSxcclxuXTtcclxuXHJcbi8vIFVwZGF0ZXMgbW91c2Ugc3RhdGVcclxuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZXZlbnQpID0+IHtcclxuICBtb3VzZS54ID0gZXZlbnQuY2xpZW50WDtcclxuICBtb3VzZS55ID0gZXZlbnQuY2xpZW50WTtcclxufSk7XHJcblxyXG4vLyBSZXNpemluZyByZXNldHMgZ2FtZVxyXG5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIChldmVudCkgPT4ge1xyXG4gIGNhbnZhcy53aWR0aCA9IGlubmVyV2lkdGg7XHJcbiAgY2FudmFzLmhlaWdodCA9IGlubmVySGVpZ2h0O1xyXG4gIGluaXQoKTtcclxufSk7XHJcblxyXG5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgY2xpY2tEaXN0YW5jZSA9IGRpc3RhbmNlKFxyXG4gICAgZXZlbnQuY2xpZW50WCxcclxuICAgIGV2ZW50LmNsaWVudFksXHJcbiAgICBwbGF5ZXIueCxcclxuICAgIHBsYXllci55XHJcbiAgKTtcclxuXHJcbiAgLy8gSWYgY2xpY2sgaGFwcGVucyB3aXRoaW4gcmFkaXVzIG9mIHBsYXllciBjaXJjbGUsIHNldCB3YWxsIHRvIGZhbHNlXHJcbiAgaWYgKGNsaWNrRGlzdGFuY2UgPCBwbGF5ZXIucmFkaXVzKSB7XHJcbiAgICB3YWxsID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VQYXJ0aWNsZXNTZXF1ZW50aWFsKHBhcnRpY2xlcyk7XHJcbiAgLy8gY2hhbmdlUGFydGljbGVzQ29uY3VycmVudChwYXJ0aWNsZXMpO1xyXG59KTtcclxuXHJcbi8vIFJpZ2h0IGNsaWNrIHJlc2V0cyBnYW1lXHJcbmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGluaXQoKTtcclxufSk7XHJcblxyXG5pbml0KCk7XHJcblxyXG4vLyBkcmF3UGFydGljbGVGcmFtZShjdHgpO1xyXG5hbmltYXRlKCk7XHJcbiIsIi8qKlxyXG4gKiBSb3RhdGVzIGNvb3JkaW5hdGUgc3lzdGVtIGZvciB2ZWxvY2l0aWVzXHJcbiAqXHJcbiAqIFRha2VzIHZlbG9jaXRpZXMgYW5kIGFsdGVycyB0aGVtIGFzIGlmIHRoZSBjb29yZGluYXRlIHN5c3RlbSB0aGV5J3JlIG9uIHdhcyByb3RhdGVkXHJcbiAqXHJcbiAqIEBwYXJhbSAgT2JqZWN0IHwgdmVsb2NpdHkgfCBUaGUgdmVsb2NpdHkgb2YgYW4gaW5kaXZpZHVhbCBwYXJ0aWNsZVxyXG4gKiBAcGFyYW0gIEZsb2F0ICB8IGFuZ2xlICAgIHwgVGhlIGFuZ2xlIG9mIGNvbGxpc2lvbiBiZXR3ZWVuIHR3byBvYmplY3RzIGluIHJhZGlhbnNcclxuICogQHJldHVybiBPYmplY3QgfCBUaGUgYWx0ZXJlZCB4IGFuZCB5IHZlbG9jaXRpZXMgYWZ0ZXIgdGhlIGNvb3JkaW5hdGUgc3lzdGVtIGhhcyBiZWVuIHJvdGF0ZWRcclxuICovXHJcblxyXG5mdW5jdGlvbiByb3RhdGUodmVsb2NpdHksIGFuZ2xlKSB7XHJcbiAgY29uc3Qgcm90YXRlZFZlbG9jaXRpZXMgPSB7XHJcbiAgICB4OiB2ZWxvY2l0eS54ICogTWF0aC5jb3MoYW5nbGUpIC0gdmVsb2NpdHkueSAqIE1hdGguc2luKGFuZ2xlKSxcclxuICAgIHk6IHZlbG9jaXR5LnggKiBNYXRoLnNpbihhbmdsZSkgKyB2ZWxvY2l0eS55ICogTWF0aC5jb3MoYW5nbGUpLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiByb3RhdGVkVmVsb2NpdGllcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFN3YXBzIG91dCB0d28gY29sbGlkaW5nIHBhcnRpY2xlcycgeCBhbmQgeSB2ZWxvY2l0aWVzIGFmdGVyIHJ1bm5pbmcgdGhyb3VnaFxyXG4gKiBhbiBlbGFzdGljIGNvbGxpc2lvbiByZWFjdGlvbiBlcXVhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0gIE9iamVjdCB8IHBhcnRpY2xlICAgICAgfCBBIHBhcnRpY2xlIG9iamVjdCB3aXRoIHggYW5kIHkgY29vcmRpbmF0ZXMsIHBsdXMgdmVsb2NpdHlcclxuICogQHBhcmFtICBPYmplY3QgfCBvdGhlclBhcnRpY2xlIHwgQSBwYXJ0aWNsZSBvYmplY3Qgd2l0aCB4IGFuZCB5IGNvb3JkaW5hdGVzLCBwbHVzIHZlbG9jaXR5XHJcbiAqIEByZXR1cm4gTnVsbCB8IERvZXMgbm90IHJldHVybiBhIHZhbHVlXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZUNvbGxpc2lvbihwYXJ0aWNsZSwgb3RoZXJQYXJ0aWNsZSkge1xyXG4gIGNvbnN0IHhWZWxvY2l0eURpZmYgPSBwYXJ0aWNsZS52ZWxvY2l0eS54IC0gb3RoZXJQYXJ0aWNsZS52ZWxvY2l0eS54O1xyXG4gIGNvbnN0IHlWZWxvY2l0eURpZmYgPSBwYXJ0aWNsZS52ZWxvY2l0eS55IC0gb3RoZXJQYXJ0aWNsZS52ZWxvY2l0eS55O1xyXG5cclxuICBjb25zdCB4RGlzdCA9IG90aGVyUGFydGljbGUueCAtIHBhcnRpY2xlLng7XHJcbiAgY29uc3QgeURpc3QgPSBvdGhlclBhcnRpY2xlLnkgLSBwYXJ0aWNsZS55O1xyXG5cclxuICAvLyBQcmV2ZW50IGFjY2lkZW50YWwgb3ZlcmxhcCBvZiBwYXJ0aWNsZXNcclxuICBpZiAoeFZlbG9jaXR5RGlmZiAqIHhEaXN0ICsgeVZlbG9jaXR5RGlmZiAqIHlEaXN0ID49IDApIHtcclxuICAgIC8vIEdyYWIgYW5nbGUgYmV0d2VlbiB0aGUgdHdvIGNvbGxpZGluZyBwYXJ0aWNsZXNcclxuICAgIGNvbnN0IGFuZ2xlID0gLU1hdGguYXRhbjIoXHJcbiAgICAgIG90aGVyUGFydGljbGUueSAtIHBhcnRpY2xlLnksXHJcbiAgICAgIG90aGVyUGFydGljbGUueCAtIHBhcnRpY2xlLnhcclxuICAgICk7XHJcblxyXG4gICAgLy8gU3RvcmUgbWFzcyBpbiB2YXIgZm9yIGJldHRlciByZWFkYWJpbGl0eSBpbiBjb2xsaXNpb24gZXF1YXRpb25cclxuICAgIGNvbnN0IG0xID0gcGFydGljbGUubWFzcztcclxuICAgIGNvbnN0IG0yID0gb3RoZXJQYXJ0aWNsZS5tYXNzO1xyXG5cclxuICAgIC8vIFZlbG9jaXR5IGJlZm9yZSBlcXVhdGlvblxyXG4gICAgY29uc3QgdTEgPSByb3RhdGUocGFydGljbGUudmVsb2NpdHksIGFuZ2xlKTtcclxuICAgIGNvbnN0IHUyID0gcm90YXRlKG90aGVyUGFydGljbGUudmVsb2NpdHksIGFuZ2xlKTtcclxuXHJcbiAgICAvLyBWZWxvY2l0eSBhZnRlciAxZCBjb2xsaXNpb24gZXF1YXRpb25cclxuICAgIGNvbnN0IHYxID0ge1xyXG4gICAgICB4OiAodTEueCAqIChtMSAtIG0yKSkgLyAobTEgKyBtMikgKyAodTIueCAqIDIgKiBtMikgLyAobTEgKyBtMiksXHJcbiAgICAgIHk6IHUxLnksXHJcbiAgICB9O1xyXG4gICAgY29uc3QgdjIgPSB7XHJcbiAgICAgIHg6ICh1Mi54ICogKG0xIC0gbTIpKSAvIChtMSArIG0yKSArICh1MS54ICogMiAqIG0yKSAvIChtMSArIG0yKSxcclxuICAgICAgeTogdTIueSxcclxuICAgIH07XHJcblxyXG4gICAgLy8gRmluYWwgdmVsb2NpdHkgYWZ0ZXIgcm90YXRpbmcgYXhpcyBiYWNrIHRvIG9yaWdpbmFsIGxvY2F0aW9uXHJcbiAgICBjb25zdCB2RmluYWwxID0gcm90YXRlKHYxLCAtYW5nbGUpO1xyXG4gICAgY29uc3QgdkZpbmFsMiA9IHJvdGF0ZSh2MiwgLWFuZ2xlKTtcclxuXHJcbiAgICAvLyBTd2FwIHBhcnRpY2xlIHZlbG9jaXRpZXMgZm9yIHJlYWxpc3RpYyBib3VuY2UgZWZmZWN0XHJcbiAgICBwYXJ0aWNsZS52ZWxvY2l0eS54ID0gdkZpbmFsMS54O1xyXG4gICAgcGFydGljbGUudmVsb2NpdHkueSA9IHZGaW5hbDEueTtcclxuXHJcbiAgICBvdGhlclBhcnRpY2xlLnZlbG9jaXR5LnggPSB2RmluYWwyLng7XHJcbiAgICBvdGhlclBhcnRpY2xlLnZlbG9jaXR5LnkgPSB2RmluYWwyLnk7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBSYW5kb20gSW50IGZyb20gUmFuZ2UgSW5jbHVzaXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZEludChtaW4sIG1heCkge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xyXG59XHJcblxyXG4vLyBUaHJlZSBvcHRpb25hbCBmdW5jdGlvbiB0byBnZXQgY29sb3JzXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21Db2xvcihjb2xvcnMpIHtcclxuICByZXR1cm4gY29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbG9ycy5sZW5ndGgpXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbG9yKCkge1xyXG4gIHJldHVybiBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuaWNlQ29sb3IoKSB7XHJcbiAgY29uc3QgciA9IHJhbmRJbnQoMCwgMzYwKTtcclxuICByZXR1cm4gYGhzbCgke3J9ZGVnIDEwMCUgNTAlKWA7XHJcbn1cclxuXHJcbi8vIFB5dGhhZ29yZWFuIHRoZW9yZW1cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgbGV0IHhEaXN0YW5jZSA9IHgyIC0geDE7XHJcbiAgbGV0IHlEaXN0YW5jZSA9IHkyIC0geTE7XHJcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4RGlzdGFuY2UsIDIpICsgTWF0aC5wb3coeURpc3RhbmNlLCAyKSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==