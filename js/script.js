(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const GRAVITY_LEVEL = 0.3;
  const BOUNCE_LEVEL = 0.5; // Must be between 0 and 1
  const FRICTION_LEVEL = 0.05;

  // Each ball instance is stored in the balls array
  const balls = [];

  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.color = "#F3CF68";
      // Horizontal velocity is a random number between -10 and 10
      this.vx = (Math.random() - 0.5) * 20;
      // Vertical velocity is a random number between -10 and 0 (negative to ensure the ball is fired upwards)
      this.vy = Math.random() * -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

    move() {
      this.#updateTrajectory();
      this.#bounce();
    }

    // Private methods

    #updateTrajectory() {
      this.#updateHorizontalDisplacement();
      this.#updateVerticalDisplacement();
      this.#applyGravity();
    }

    #bounce() {
      if (this.#isTouchingFloor()) {
        this.#stayOnFloor();
        this.#reverseVerticalDirection();
        this.#applyBounce();
        this.#applyFriction();
        this.#eventuallyStop();
      }

      if (this.#isTouchingCeiling()) {
        this.#stayOnCeiling();
        this.#reverseVerticalDirection();
      }

      if (this.#isTouchingWall()) {
        this.#reverseHorizontalDirection();
      }
    }

    #updateHorizontalDisplacement() {
      this.x += this.vx;
    }

    #updateVerticalDisplacement() {
      this.y += this.vy;
    }

    #isTouchingFloor() {
      return this.y > canvas.height - this.radius;
    }

    #stayOnFloor() {
      this.y = canvas.height - this.radius;
    }

    #isTouchingCeiling() {
      return this.y < this.radius;
    }

    #stayOnCeiling() {
      this.y = this.radius;
    }

    #isTouchingWall() {
      return this.x + this.radius > canvas.width || this.x - this.radius < 0;
    }

    #applyGravity() {
      this.vy += GRAVITY_LEVEL;
    }

    #applyBounce() {
      this.vy *= BOUNCE_LEVEL;
    }

    #applyFriction() {
      if (this.vx > 0) this.vx -= FRICTION_LEVEL;
      if (this.vx < 0) this.vx += FRICTION_LEVEL;
      this.vy += FRICTION_LEVEL;
    }

    #eventuallyStop() {
      // Stops ball from bouncing when vertical speed is low
      if (this.vy < 0 && this.vy > -1.5) this.vy = 0;
      // Stops ball from moving horizontally on the floor when horizontal speed is low
      if (Math.abs(this.vx) < 1.1) this.vx = 0;
    }

    #reverseHorizontalDirection() {
      this.vx *= -1;
    }

    #reverseVerticalDirection() {
      this.vy *= -1;
    }
  }

  // When user clicks on canvas
  canvas.addEventListener("click", e => {
    // Create new ball instance
    const newBall = new Ball(e.clientX, e.clientY);
    // Push new ball into balls array
    balls.push(newBall);
  });

  init();

  function init() {
    resizeCanvas();
    updateCanvas();
  }

  // Resize the canvas to fill browser window dynamically
  window.addEventListener("resize", resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function animateBalls() {
    balls.forEach(ball => {
      ball.draw();
      ball.move();
    });
  }

  function updateCanvas() {
    clearCanvas();
    animateBalls();
    // IMPORTANT: Calls updateCanvas() before each repaint
    requestAnimationFrame(updateCanvas);
  }
})();
