function createWrapperElement(layerId, width, height) {
  const $elem = document.createElement("div");
  $elem.id = layerId;
  $elem.setAttribute("tabindex", "0");
  if (width && height) {
    $elem.setAttribute("style", `width: ${width}px; height: ${height}px;`);
  }
  return $elem;
}

function createCanvas(layerName, width, height, layerIndex) {
  const $canvas = document.createElement("canvas");
  $canvas.id = "canvas-for-" + layerName;
  $canvas.width = width; // * window.devicePixelRatio || 1
  $canvas.height = height; // * window.devicePixelRatio || 1
  $canvas.setAttribute("tabindex", "1");
  $canvas.setAttribute("style", `background-color: transparent`);

  const canvasStyle = $canvas.style;
  canvasStyle.position = "absolute";
  canvasStyle.zIndex = layerIndex || "0";
  canvasStyle.width = $canvas.width + "px";
  canvasStyle.height = $canvas.height + "px";
  canvasStyle.imageRendering = "pixelated";

  const ctx = $canvas.getContext("2d"); // { alpha: false }

  ctx.imageSmoothingEnabled = false;
  return $canvas;
}

const $htmlWrapper = createWrapperElement("game-wrapper", 640, 480);
const $canvasBackground = createCanvas("background", 640, 480, "1");
const $ctxBackground = $canvasBackground.getContext('2d');
const $canvasForeground = createCanvas("foreground", 640, 480, "2");
const $ctxForeground = $canvasForeground.getContext('2d');

$htmlWrapper.appendChild($canvasBackground);
$htmlWrapper.appendChild($canvasForeground);

document.body.appendChild($htmlWrapper);


// class Keyboard {
//   constructor() {
//     this.keyUpCallback = this.keyUpHandler.bind(this);
//     this.keyDownCallback = this.keyDownHandler.bind(this);
//   }
//
//   keyUpHandler(e) {
//     e.stopPropagation();
//     console.log('keyUpHandler');
//     return 'a';
//   }
//
//   keyDownHandler(e) {
//     e.stopPropagation();
//     console.log('keyDownHandler');
//     return 'b';
//   }
//
//   listen(){
//     window.addEventListener('keyup', this.keyUpCallback );
//     window.addEventListener('keydown', this.keyDownCallback);
//   }
//
//
// }

var InputActions;
(function (InputActions) {
  InputActions[InputActions["MOVE_UP"] = 1] = "MOVE_UP";
  InputActions[InputActions["MOVE_DOWN"] = 2] = "MOVE_DOWN";
  InputActions[InputActions["MOVE_LEFT"] = 3] = "MOVE_LEFT";
  InputActions[InputActions["MOVE_RIGHT"] = 4] = "MOVE_RIGHT";
  InputActions[InputActions["ACTION_1"] = 5] = "ACTION_1";
  InputActions[InputActions["ACTION_2"] = 6] = "ACTION_2";
  InputActions[InputActions["ACTION_3"] = 7] = "ACTION_3";
  InputActions[InputActions["ACTION_4"] = 8] = "ACTION_4";
})(InputActions || (InputActions = {}));
class Keyboard {
  constructor() {
    console.log('Keyboard');
    this.ongoingActions = new Set([]);
    this.boundKeys = new Map([]);
    this.isListening = false;
    this.handleKeyDown = (e) => {
      if (this.isBoundKey(e.key)) {
        console.log('a');
        e.stopPropagation();
        e.stopImmediatePropagation();
        const action = this.boundKeys.get(e.key);
        this.ongoingActions.add(action);
      }
    };
    this.handleKeyUp = (e) => {
      if (this.isBoundKey(e.key)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        const action = this.boundKeys.get(e.key);
        this.ongoingActions.delete(action);
      }
    };
  }
  bindKey(keyCode, action) {
    this.boundKeys.set(keyCode, action);
  }
  unbindKey(keyCode) {
    this.boundKeys.delete(keyCode);
  }
  areKeysPressed() {
    return this.ongoingActions.size > 0;
  }
  areMovementKeysPressed() {
    return this.ongoingActions.has(InputActions.MOVE_UP) ||
      this.ongoingActions.has(InputActions.MOVE_DOWN) ||
      this.ongoingActions.has(InputActions.MOVE_LEFT) ||
      this.ongoingActions.has(InputActions.MOVE_RIGHT);
  }
  isBoundKey(keyCode) {
    return this.boundKeys.has(keyCode);
  }
  listen() {
    if (this.isListening)
      return;
    this.isListening = true;
    window.addEventListener("keydown", this.handleKeyDown, false);
    window.addEventListener("keyup", this.handleKeyUp, false);
  }
  unlisten() {
    if (!this.isListening)
      return;
    this.isListening = false;
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}


const k = new Keyboard();
k.bindKey("w", InputActions.MOVE_UP);
k.bindKey("s", InputActions.MOVE_DOWN);
k.bindKey("a", InputActions.MOVE_LEFT);
k.bindKey("d", InputActions.MOVE_RIGHT);
k.bindKey("f", InputActions.ACTION_1);
k.listen();


function loop() {
  console.log('running loop');
  requestAnimationFrame(loop);

}

requestAnimationFrame(loop);

