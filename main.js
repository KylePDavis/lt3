// @ts-check

const randomPct = () => Math.random();
const randomNum = (/** @type {number} */ n) => n * Math.random();
const randomInt = (/** @type {number} */ s) => Math.floor(randomNum(s));

const SIZE = 1024;

/** A 2D point */
class XY {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

/** A part / particle */
class Part {
  constructor(
    pos = new XY(SIZE * randomPct(), SIZE * randomPct()),
    dir = new XY(randomNum(8) - 4, randomNum(8) - 4),
    scale = randomPct()
  ) {
    this.pos = pos;
    this.dir = dir;
    this.scale = scale;
  }
}

/** A base hearts animation */
class HeartsAnim {
  constructor(count = 25) {
    this.count = count;
    this.hearts = Array.from({ length: count }, () => new Part());
  }

  clearFrame(/** @type {CanvasRenderingContext2D} */ ctx) {
    ctx.clearRect(0, 0, SIZE, SIZE);
  }

  renderFrame(
    /** @type {CanvasRenderingContext2D} */ ctx,
    /** @type {number} */ t
  ) {
    // clear before re-rendering
    this.clearFrame(ctx);

    // setup base styling
    Object.assign(ctx, {
      fillStyle: "#f00",
      textAlign: "center",
      textBaseline: "center",
    });

    // render hearts
    for (const heart of this.hearts) {
      const { pos, dir, scale } = heart;

      // update position
      pos.x += dir.x;
      pos.y += dir.y;

      // bounce at edge
      if (pos.x <= 20 || pos.x >= SIZE - 20) dir.x *= -1;
      if (pos.y <= 20 || pos.y >= SIZE - 20) dir.y *= -1;

      // draw text
      ctx.font = `${10 * scale}vh monospace`;
      ctx.fillText("＜3", pos.x, pos.y);
      //   ctx.fillText("less than three", pos.x, pos.y);
    }
  }

  start(/** @type {CanvasRenderingContext2D} */ ctx) {
    const anim = this;
    return (function renderer() {
      anim.renderFrame(ctx);
      return requestAnimationFrame(renderer);
    })();
  }
}

/** The main app */
class App {
  constructor(el = document.getElementById("app")) {
    if (!el) throw Error("Bad #app element!");
    this.el = el;

    const doc = el.ownerDocument;
    const canvasEl = doc.createElement("canvas");
    Object.assign(canvasEl, { width: SIZE, height: SIZE });
    Object.assign(canvasEl.style, { width: `100vw`, height: `100vh` });
    this.canvasEl = el.appendChild(canvasEl);

    const ctx = canvasEl.getContext("2d");
    if (!ctx) throw Error("Bad canvas context!");
    this.ctx = ctx;

    this.anim = new HeartsAnim();
  }

  start() {
    this.anim.start(this.ctx);
  }
}

// start app
const app = new App();
app.start();

// attach app to global for debugging
Object.assign(globalThis, { app });
