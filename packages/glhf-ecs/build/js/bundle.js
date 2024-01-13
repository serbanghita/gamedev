/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../glhf-bitmask/src/bitmask.ts":
/*!**************************************!*\
  !*** ../glhf-bitmask/src/bitmask.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * Doom soundtrack: https://music.youtube.com/watch?v=cixW6rogZ48
 * Bitmask - why, how and when: https://alemil.com/bitmask
 * BigInt: arbitrary-precision integers in JavaScript https://v8.dev/features/bigint
 * Bit, Byte, and Binary: https://www.cs.cmu.edu/~fgandon/documents/lecture/uk1999/binary/HandOut.pdf
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleAllBits = exports.hasAnyOfBits = exports.hasBit = exports.removeBit = exports.toggleBit = exports.addBit = void 0;
/**
 * Add bit(s) to the bitmask.
 *
 *
 *
 * @param bitmasks
 * @param bit
 */
function addBit(bitmasks, bit) {
    bitmasks |= bit;
    return bitmasks;
}
exports.addBit = addBit;
/**
 * Toggle **existing** or **non-existing** bit(s) from the bitmask.
 *
 * Bitwise XOR (^)
 * The bitwise XOR operator (^) returns a 1 in each bit position for which the corresponding bits
 * of either but not both operands are 1s.
 * @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR
 *
 * @param bitmasks
 * @param bit
 */
function toggleBit(bitmasks, bit) {
    bitmasks ^= bit;
    return bitmasks;
}
exports.toggleBit = toggleBit;
/**
 * Remove **existing** or **non-existing** bit(s) from the bitmask.
 *
 * Bitwise AND (&)
 * The bitwise AND operator (&) returns a 1 in each bit position for which the corresponding bits
 * of both operands are 1s.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND
 *
 * @param bitmasks
 * @param bit
 */
function removeBit(bitmasks, bit) {
    bitmasks &= ~bit;
    return bitmasks;
}
exports.removeBit = removeBit;
/**
 * Check if the bit already exists in the bitmask.
 *
 * Bitwise AND (&)
 *
 * @param bitmasks
 * @param bit
 */
function hasBit(bitmasks, bit) {
    return (bitmasks & bit) === bit;
}
exports.hasBit = hasBit;
/**
 * Check if the bitmask contains ANY of the bits.
 * e.g. 1101 - bitmask, 10 - bits => false
 * e.g. 1101 - bitmask, 11 -> bits => true
 *
 * @param bitmask
 * @param bits
 */
function hasAnyOfBits(bitmask, bits) {
    return (bitmask & bits) !== 0n;
}
exports.hasAnyOfBits = hasAnyOfBits;
function toggleAllBits(bitmask) {
    const oneBit = (typeof bitmask === "bigint" ? 1n : 1);
    let start = oneBit;
    while (start <= bitmask) {
        bitmask ^= start;
        start = start << oneBit;
    }
    return bitmask;
}
exports.toggleAllBits = toggleAllBits;


/***/ }),

/***/ "./demo/demo.ts":
/*!**********************!*\
  !*** ./demo/demo.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ComponentRegistry_1 = __importDefault(__webpack_require__(/*! ../src/ComponentRegistry */ "./src/ComponentRegistry.ts"));
const Entity_1 = __importDefault(__webpack_require__(/*! ../src/Entity */ "./src/Entity.ts"));
const Query_1 = __importDefault(__webpack_require__(/*! ../src/Query */ "./src/Query.ts"));
const Body_1 = __webpack_require__(/*! ../src/mocks/Body */ "./src/mocks/Body.ts");
const Position_1 = __webpack_require__(/*! ../src/mocks/Position */ "./src/mocks/Position.ts");
const Keyboard_1 = __webpack_require__(/*! ../src/mocks/Keyboard */ "./src/mocks/Keyboard.ts");
const Renderable_1 = __webpack_require__(/*! ../src/mocks/Renderable */ "./src/mocks/Renderable.ts");
const reg = ComponentRegistry_1.default.getInstance();
reg.registerComponent(Body_1.Body);
reg.registerComponent(Position_1.Position);
reg.registerComponent(Keyboard_1.Keyboard);
reg.registerComponent(Renderable_1.Renderable);
const dino = new Entity_1.default("dino");
dino.addComponent(new Body_1.Body({ width: 10, height: 20 }));
dino.addComponent(new Position_1.Position({ x: 1, y: 2 }));
dino.addComponent(new Renderable_1.Renderable({}));
const player = new Entity_1.default("player");
player.addComponent(new Body_1.Body({ width: 30, height: 40 }));
player.addComponent(new Position_1.Position({ x: 3, y: 4 }));
player.addComponent(new Keyboard_1.Keyboard({ up: "w", down: "s", left: "a", right: "d" }));
player.addComponent(new Renderable_1.Renderable({}));
const q = new Query_1.default("all entities to render to screen", [dino, player], { all: [Renderable_1.Renderable] });
// @ts-ignore
window['engine'] = {
    'q': q
};
const loop = (now) => {
    q.execute().forEach(entity => {
        // render(entity);
    });
    window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);


/***/ }),

/***/ "./src/Component.ts":
/*!**************************!*\
  !*** ./src/Component.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Component {
    constructor(properties) {
        this.properties = properties;
    }
}
exports["default"] = Component;


/***/ }),

/***/ "./src/ComponentRegistry.ts":
/*!**********************************!*\
  !*** ./src/ComponentRegistry.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ComponentRegistry {
    constructor() {
        this.bitmask = 1n;
    }
    static getInstance() {
        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }
    registerComponent(ComponentDeclaration) {
        // @todo: Safety check if Base was already registered.
        ComponentDeclaration.prototype.bitmask = (this.bitmask <<= 1n);
        return ComponentDeclaration;
    }
    getLastBitmask() {
        return this.bitmask;
    }
}
exports["default"] = ComponentRegistry;


/***/ }),

/***/ "./src/Entity.ts":
/*!***********************!*\
  !*** ./src/Entity.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const bitmask_1 = __webpack_require__(/*! ../../glhf-bitmask/src/bitmask */ "../glhf-bitmask/src/bitmask.ts");
class Entity {
    constructor(id) {
        this.id = id;
        this.componentsBitmask = 0n;
        this.components = {};
    }
    addComponent(instance) {
        this.components[instance.constructor.name] = instance;
        if (typeof instance.bitmask === "undefined") {
            throw new Error(`Please register the component ${instance.constructor.name} in the ComponentRegistry.`);
        }
        this.componentsBitmask = (0, bitmask_1.addBit)(this.componentsBitmask, instance.bitmask);
    }
    getComponent(declaration) {
        return this.components[declaration.name];
    }
    hasComponent(declaration) {
        // return !!this.components[componentDeclaration.name];
        return (0, bitmask_1.hasBit)(this.componentsBitmask, declaration.bitmask);
    }
}
exports["default"] = Entity;


/***/ }),

/***/ "./src/Query.ts":
/*!**********************!*\
  !*** ./src/Query.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const bitmask_1 = __webpack_require__(/*! ../../glhf-bitmask/src/bitmask */ "../glhf-bitmask/src/bitmask.ts");
class Query {
    /**
     * Create a "query" of entities.
     *
     * @param id
     * @param dataSet Initial "dataset" upon which we execute the query.
     *                Dataset will be cloned and filtered *after* the first query.
     *                After the first query:
     *                  +addition is performed via candidate(Entity) method.
     *                  -removal is performed via remove(Entity) method.
     * @param filters
     */
    constructor(id = "", dataSet, filters) {
        this.id = id;
        this.dataSet = dataSet;
        this.filters = filters;
        this.all = 0n;
        this.any = 0n;
        this.none = 0n;
        this.hasExecuted = false;
        this.processFiltersAsBitMasks();
    }
    processFiltersAsBitMasks() {
        if (this.filters.all) {
            this.filters.all.forEach((component) => {
                this.all = (0, bitmask_1.addBit)(this.all, component.prototype.bitmask);
            });
        }
        if (this.filters.any) {
            this.filters.any.forEach((component) => {
                this.any = (0, bitmask_1.addBit)(this.any, component.prototype.bitmask);
            });
        }
        if (this.filters.none) {
            this.filters.none.forEach((component) => {
                this.none = (0, bitmask_1.addBit)(this.none, component.prototype.bitmask);
            });
        }
    }
    /**
     * Set only the entities that correspond to the filters given.
     */
    execute() {
        if (!this.hasExecuted) {
            this.dataSet = this.dataSet.filter((entity) => this.match(entity));
            this.hasExecuted = true;
        }
        return this.dataSet;
    }
    match(entity) {
        // Reject all entities that have a component(s) that is in the none filter.
        if (this.none !== 0n && (0, bitmask_1.hasAnyOfBits)(entity.componentsBitmask, this.none)) {
            return false;
        }
        // Include any entity that has all the components in the "any" filter.
        if (this.any !== 0n && (0, bitmask_1.hasAnyOfBits)(entity.componentsBitmask, this.any)) {
            return true;
        }
        // Check all bits.
        if (this.all !== 0n && !(0, bitmask_1.hasBit)(entity.componentsBitmask, this.all)) {
            return false;
        }
        return true;
    }
    candidate(entity) {
        if (this.match(entity)) {
            this.dataSet.push(entity);
            return true;
        }
        return false;
    }
    remove(entity) {
        const index = this.dataSet.indexOf(entity);
        if (index !== -1) {
            this.dataSet.splice(index, 1);
        }
    }
}
exports["default"] = Query;


/***/ }),

/***/ "./src/mocks/Body.ts":
/*!***************************!*\
  !*** ./src/mocks/Body.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Body = void 0;
const Component_1 = __importDefault(__webpack_require__(/*! ../Component */ "./src/Component.ts"));
class Body extends Component_1.default {
    constructor(properties) {
        super(properties);
        this.properties = properties;
    }
}
exports.Body = Body;


/***/ }),

/***/ "./src/mocks/Keyboard.ts":
/*!*******************************!*\
  !*** ./src/mocks/Keyboard.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Keyboard = void 0;
const Component_1 = __importDefault(__webpack_require__(/*! ../Component */ "./src/Component.ts"));
class Keyboard extends Component_1.default {
    constructor(properties) {
        super(properties);
        this.properties = properties;
    }
}
exports.Keyboard = Keyboard;


/***/ }),

/***/ "./src/mocks/Position.ts":
/*!*******************************!*\
  !*** ./src/mocks/Position.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Position = void 0;
const Component_1 = __importDefault(__webpack_require__(/*! ../Component */ "./src/Component.ts"));
class Position extends Component_1.default {
    constructor(properties) {
        super(properties);
        this.properties = properties;
    }
}
exports.Position = Position;


/***/ }),

/***/ "./src/mocks/Renderable.ts":
/*!*********************************!*\
  !*** ./src/mocks/Renderable.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderable = void 0;
const Component_1 = __importDefault(__webpack_require__(/*! ../Component */ "./src/Component.ts"));
class Renderable extends Component_1.default {
    constructor(properties) {
        super(properties);
        this.properties = properties;
    }
}
exports.Renderable = Renderable;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./demo/demo.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9nbGhmLWVjcy8uLi9nbGhmLWJpdG1hc2svc3JjL2JpdG1hc2sudHMiLCJ3ZWJwYWNrOi8vZ2xoZi1lY3MvLi9kZW1vL2RlbW8udHMiLCJ3ZWJwYWNrOi8vZ2xoZi1lY3MvLi9zcmMvQ29tcG9uZW50LnRzIiwid2VicGFjazovL2dsaGYtZWNzLy4vc3JjL0NvbXBvbmVudFJlZ2lzdHJ5LnRzIiwid2VicGFjazovL2dsaGYtZWNzLy4vc3JjL0VudGl0eS50cyIsIndlYnBhY2s6Ly9nbGhmLWVjcy8uL3NyYy9RdWVyeS50cyIsIndlYnBhY2s6Ly9nbGhmLWVjcy8uL3NyYy9tb2Nrcy9Cb2R5LnRzIiwid2VicGFjazovL2dsaGYtZWNzLy4vc3JjL21vY2tzL0tleWJvYXJkLnRzIiwid2VicGFjazovL2dsaGYtZWNzLy4vc3JjL21vY2tzL1Bvc2l0aW9uLnRzIiwid2VicGFjazovL2dsaGYtZWNzLy4vc3JjL21vY2tzL1JlbmRlcmFibGUudHMiLCJ3ZWJwYWNrOi8vZ2xoZi1lY3Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZ2xoZi1lY3Mvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9nbGhmLWVjcy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZ2xoZi1lY3Mvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBEb29tIHNvdW5kdHJhY2s6IGh0dHBzOi8vbXVzaWMueW91dHViZS5jb20vd2F0Y2g/dj1jaXhXNnJvZ1o0OFxuICogQml0bWFzayAtIHdoeSwgaG93IGFuZCB3aGVuOiBodHRwczovL2FsZW1pbC5jb20vYml0bWFza1xuICogQmlnSW50OiBhcmJpdHJhcnktcHJlY2lzaW9uIGludGVnZXJzIGluIEphdmFTY3JpcHQgaHR0cHM6Ly92OC5kZXYvZmVhdHVyZXMvYmlnaW50XG4gKiBCaXQsIEJ5dGUsIGFuZCBCaW5hcnk6IGh0dHBzOi8vd3d3LmNzLmNtdS5lZHUvfmZnYW5kb24vZG9jdW1lbnRzL2xlY3R1cmUvdWsxOTk5L2JpbmFyeS9IYW5kT3V0LnBkZlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRvZ2dsZUFsbEJpdHMgPSBleHBvcnRzLmhhc0FueU9mQml0cyA9IGV4cG9ydHMuaGFzQml0ID0gZXhwb3J0cy5yZW1vdmVCaXQgPSBleHBvcnRzLnRvZ2dsZUJpdCA9IGV4cG9ydHMuYWRkQml0ID0gdm9pZCAwO1xuLyoqXG4gKiBBZGQgYml0KHMpIHRvIHRoZSBiaXRtYXNrLlxuICpcbiAqXG4gKlxuICogQHBhcmFtIGJpdG1hc2tzXG4gKiBAcGFyYW0gYml0XG4gKi9cbmZ1bmN0aW9uIGFkZEJpdChiaXRtYXNrcywgYml0KSB7XG4gICAgYml0bWFza3MgfD0gYml0O1xuICAgIHJldHVybiBiaXRtYXNrcztcbn1cbmV4cG9ydHMuYWRkQml0ID0gYWRkQml0O1xuLyoqXG4gKiBUb2dnbGUgKipleGlzdGluZyoqIG9yICoqbm9uLWV4aXN0aW5nKiogYml0KHMpIGZyb20gdGhlIGJpdG1hc2suXG4gKlxuICogQml0d2lzZSBYT1IgKF4pXG4gKiBUaGUgYml0d2lzZSBYT1Igb3BlcmF0b3IgKF4pIHJldHVybnMgYSAxIGluIGVhY2ggYml0IHBvc2l0aW9uIGZvciB3aGljaCB0aGUgY29ycmVzcG9uZGluZyBiaXRzXG4gKiBvZiBlaXRoZXIgYnV0IG5vdCBib3RoIG9wZXJhbmRzIGFyZSAxcy5cbiAqIEBzZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL09wZXJhdG9ycy9CaXR3aXNlX1hPUlxuICpcbiAqIEBwYXJhbSBiaXRtYXNrc1xuICogQHBhcmFtIGJpdFxuICovXG5mdW5jdGlvbiB0b2dnbGVCaXQoYml0bWFza3MsIGJpdCkge1xuICAgIGJpdG1hc2tzIF49IGJpdDtcbiAgICByZXR1cm4gYml0bWFza3M7XG59XG5leHBvcnRzLnRvZ2dsZUJpdCA9IHRvZ2dsZUJpdDtcbi8qKlxuICogUmVtb3ZlICoqZXhpc3RpbmcqKiBvciAqKm5vbi1leGlzdGluZyoqIGJpdChzKSBmcm9tIHRoZSBiaXRtYXNrLlxuICpcbiAqIEJpdHdpc2UgQU5EICgmKVxuICogVGhlIGJpdHdpc2UgQU5EIG9wZXJhdG9yICgmKSByZXR1cm5zIGEgMSBpbiBlYWNoIGJpdCBwb3NpdGlvbiBmb3Igd2hpY2ggdGhlIGNvcnJlc3BvbmRpbmcgYml0c1xuICogb2YgYm90aCBvcGVyYW5kcyBhcmUgMXMuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL09wZXJhdG9ycy9CaXR3aXNlX0FORFxuICpcbiAqIEBwYXJhbSBiaXRtYXNrc1xuICogQHBhcmFtIGJpdFxuICovXG5mdW5jdGlvbiByZW1vdmVCaXQoYml0bWFza3MsIGJpdCkge1xuICAgIGJpdG1hc2tzICY9IH5iaXQ7XG4gICAgcmV0dXJuIGJpdG1hc2tzO1xufVxuZXhwb3J0cy5yZW1vdmVCaXQgPSByZW1vdmVCaXQ7XG4vKipcbiAqIENoZWNrIGlmIHRoZSBiaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGJpdG1hc2suXG4gKlxuICogQml0d2lzZSBBTkQgKCYpXG4gKlxuICogQHBhcmFtIGJpdG1hc2tzXG4gKiBAcGFyYW0gYml0XG4gKi9cbmZ1bmN0aW9uIGhhc0JpdChiaXRtYXNrcywgYml0KSB7XG4gICAgcmV0dXJuIChiaXRtYXNrcyAmIGJpdCkgPT09IGJpdDtcbn1cbmV4cG9ydHMuaGFzQml0ID0gaGFzQml0O1xuLyoqXG4gKiBDaGVjayBpZiB0aGUgYml0bWFzayBjb250YWlucyBBTlkgb2YgdGhlIGJpdHMuXG4gKiBlLmcuIDExMDEgLSBiaXRtYXNrLCAxMCAtIGJpdHMgPT4gZmFsc2VcbiAqIGUuZy4gMTEwMSAtIGJpdG1hc2ssIDExIC0+IGJpdHMgPT4gdHJ1ZVxuICpcbiAqIEBwYXJhbSBiaXRtYXNrXG4gKiBAcGFyYW0gYml0c1xuICovXG5mdW5jdGlvbiBoYXNBbnlPZkJpdHMoYml0bWFzaywgYml0cykge1xuICAgIHJldHVybiAoYml0bWFzayAmIGJpdHMpICE9PSAwbjtcbn1cbmV4cG9ydHMuaGFzQW55T2ZCaXRzID0gaGFzQW55T2ZCaXRzO1xuZnVuY3Rpb24gdG9nZ2xlQWxsQml0cyhiaXRtYXNrKSB7XG4gICAgY29uc3Qgb25lQml0ID0gKHR5cGVvZiBiaXRtYXNrID09PSBcImJpZ2ludFwiID8gMW4gOiAxKTtcbiAgICBsZXQgc3RhcnQgPSBvbmVCaXQ7XG4gICAgd2hpbGUgKHN0YXJ0IDw9IGJpdG1hc2spIHtcbiAgICAgICAgYml0bWFzayBePSBzdGFydDtcbiAgICAgICAgc3RhcnQgPSBzdGFydCA8PCBvbmVCaXQ7XG4gICAgfVxuICAgIHJldHVybiBiaXRtYXNrO1xufVxuZXhwb3J0cy50b2dnbGVBbGxCaXRzID0gdG9nZ2xlQWxsQml0cztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQ29tcG9uZW50UmVnaXN0cnlfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vc3JjL0NvbXBvbmVudFJlZ2lzdHJ5XCIpKTtcbmNvbnN0IEVudGl0eV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9zcmMvRW50aXR5XCIpKTtcbmNvbnN0IFF1ZXJ5XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3NyYy9RdWVyeVwiKSk7XG5jb25zdCBCb2R5XzEgPSByZXF1aXJlKFwiLi4vc3JjL21vY2tzL0JvZHlcIik7XG5jb25zdCBQb3NpdGlvbl8xID0gcmVxdWlyZShcIi4uL3NyYy9tb2Nrcy9Qb3NpdGlvblwiKTtcbmNvbnN0IEtleWJvYXJkXzEgPSByZXF1aXJlKFwiLi4vc3JjL21vY2tzL0tleWJvYXJkXCIpO1xuY29uc3QgUmVuZGVyYWJsZV8xID0gcmVxdWlyZShcIi4uL3NyYy9tb2Nrcy9SZW5kZXJhYmxlXCIpO1xuY29uc3QgcmVnID0gQ29tcG9uZW50UmVnaXN0cnlfMS5kZWZhdWx0LmdldEluc3RhbmNlKCk7XG5yZWcucmVnaXN0ZXJDb21wb25lbnQoQm9keV8xLkJvZHkpO1xucmVnLnJlZ2lzdGVyQ29tcG9uZW50KFBvc2l0aW9uXzEuUG9zaXRpb24pO1xucmVnLnJlZ2lzdGVyQ29tcG9uZW50KEtleWJvYXJkXzEuS2V5Ym9hcmQpO1xucmVnLnJlZ2lzdGVyQ29tcG9uZW50KFJlbmRlcmFibGVfMS5SZW5kZXJhYmxlKTtcbmNvbnN0IGRpbm8gPSBuZXcgRW50aXR5XzEuZGVmYXVsdChcImRpbm9cIik7XG5kaW5vLmFkZENvbXBvbmVudChuZXcgQm9keV8xLkJvZHkoeyB3aWR0aDogMTAsIGhlaWdodDogMjAgfSkpO1xuZGluby5hZGRDb21wb25lbnQobmV3IFBvc2l0aW9uXzEuUG9zaXRpb24oeyB4OiAxLCB5OiAyIH0pKTtcbmRpbm8uYWRkQ29tcG9uZW50KG5ldyBSZW5kZXJhYmxlXzEuUmVuZGVyYWJsZSh7fSkpO1xuY29uc3QgcGxheWVyID0gbmV3IEVudGl0eV8xLmRlZmF1bHQoXCJwbGF5ZXJcIik7XG5wbGF5ZXIuYWRkQ29tcG9uZW50KG5ldyBCb2R5XzEuQm9keSh7IHdpZHRoOiAzMCwgaGVpZ2h0OiA0MCB9KSk7XG5wbGF5ZXIuYWRkQ29tcG9uZW50KG5ldyBQb3NpdGlvbl8xLlBvc2l0aW9uKHsgeDogMywgeTogNCB9KSk7XG5wbGF5ZXIuYWRkQ29tcG9uZW50KG5ldyBLZXlib2FyZF8xLktleWJvYXJkKHsgdXA6IFwid1wiLCBkb3duOiBcInNcIiwgbGVmdDogXCJhXCIsIHJpZ2h0OiBcImRcIiB9KSk7XG5wbGF5ZXIuYWRkQ29tcG9uZW50KG5ldyBSZW5kZXJhYmxlXzEuUmVuZGVyYWJsZSh7fSkpO1xuY29uc3QgcSA9IG5ldyBRdWVyeV8xLmRlZmF1bHQoXCJhbGwgZW50aXRpZXMgdG8gcmVuZGVyIHRvIHNjcmVlblwiLCBbZGlubywgcGxheWVyXSwgeyBhbGw6IFtSZW5kZXJhYmxlXzEuUmVuZGVyYWJsZV0gfSk7XG4vLyBAdHMtaWdub3JlXG53aW5kb3dbJ2VuZ2luZSddID0ge1xuICAgICdxJzogcVxufTtcbmNvbnN0IGxvb3AgPSAobm93KSA9PiB7XG4gICAgcS5leGVjdXRlKCkuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAvLyByZW5kZXIoZW50aXR5KTtcbiAgICB9KTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xufTtcbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcykge1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQ29tcG9uZW50UmVnaXN0cnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmJpdG1hc2sgPSAxbjtcbiAgICB9XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIUNvbXBvbmVudFJlZ2lzdHJ5Lmluc3RhbmNlKSB7XG4gICAgICAgICAgICBDb21wb25lbnRSZWdpc3RyeS5pbnN0YW5jZSA9IG5ldyBDb21wb25lbnRSZWdpc3RyeSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb21wb25lbnRSZWdpc3RyeS5pbnN0YW5jZTtcbiAgICB9XG4gICAgcmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50RGVjbGFyYXRpb24pIHtcbiAgICAgICAgLy8gQHRvZG86IFNhZmV0eSBjaGVjayBpZiBCYXNlIHdhcyBhbHJlYWR5IHJlZ2lzdGVyZWQuXG4gICAgICAgIENvbXBvbmVudERlY2xhcmF0aW9uLnByb3RvdHlwZS5iaXRtYXNrID0gKHRoaXMuYml0bWFzayA8PD0gMW4pO1xuICAgICAgICByZXR1cm4gQ29tcG9uZW50RGVjbGFyYXRpb247XG4gICAgfVxuICAgIGdldExhc3RCaXRtYXNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iaXRtYXNrO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENvbXBvbmVudFJlZ2lzdHJ5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBiaXRtYXNrXzEgPSByZXF1aXJlKFwiLi4vLi4vZ2xoZi1iaXRtYXNrL3NyYy9iaXRtYXNrXCIpO1xuY2xhc3MgRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY29tcG9uZW50c0JpdG1hc2sgPSAwbjtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XG4gICAgfVxuICAgIGFkZENvbXBvbmVudChpbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHNbaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZV0gPSBpbnN0YW5jZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5iaXRtYXNrID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBsZWFzZSByZWdpc3RlciB0aGUgY29tcG9uZW50ICR7aW5zdGFuY2UuY29uc3RydWN0b3IubmFtZX0gaW4gdGhlIENvbXBvbmVudFJlZ2lzdHJ5LmApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50c0JpdG1hc2sgPSAoMCwgYml0bWFza18xLmFkZEJpdCkodGhpcy5jb21wb25lbnRzQml0bWFzaywgaW5zdGFuY2UuYml0bWFzayk7XG4gICAgfVxuICAgIGdldENvbXBvbmVudChkZWNsYXJhdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzW2RlY2xhcmF0aW9uLm5hbWVdO1xuICAgIH1cbiAgICBoYXNDb21wb25lbnQoZGVjbGFyYXRpb24pIHtcbiAgICAgICAgLy8gcmV0dXJuICEhdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudERlY2xhcmF0aW9uLm5hbWVdO1xuICAgICAgICByZXR1cm4gKDAsIGJpdG1hc2tfMS5oYXNCaXQpKHRoaXMuY29tcG9uZW50c0JpdG1hc2ssIGRlY2xhcmF0aW9uLmJpdG1hc2spO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVudGl0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYml0bWFza18xID0gcmVxdWlyZShcIi4uLy4uL2dsaGYtYml0bWFzay9zcmMvYml0bWFza1wiKTtcbmNsYXNzIFF1ZXJ5IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBcInF1ZXJ5XCIgb2YgZW50aXRpZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gZGF0YVNldCBJbml0aWFsIFwiZGF0YXNldFwiIHVwb24gd2hpY2ggd2UgZXhlY3V0ZSB0aGUgcXVlcnkuXG4gICAgICogICAgICAgICAgICAgICAgRGF0YXNldCB3aWxsIGJlIGNsb25lZCBhbmQgZmlsdGVyZWQgKmFmdGVyKiB0aGUgZmlyc3QgcXVlcnkuXG4gICAgICogICAgICAgICAgICAgICAgQWZ0ZXIgdGhlIGZpcnN0IHF1ZXJ5OlxuICAgICAqICAgICAgICAgICAgICAgICAgK2FkZGl0aW9uIGlzIHBlcmZvcm1lZCB2aWEgY2FuZGlkYXRlKEVudGl0eSkgbWV0aG9kLlxuICAgICAqICAgICAgICAgICAgICAgICAgLXJlbW92YWwgaXMgcGVyZm9ybWVkIHZpYSByZW1vdmUoRW50aXR5KSBtZXRob2QuXG4gICAgICogQHBhcmFtIGZpbHRlcnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihpZCA9IFwiXCIsIGRhdGFTZXQsIGZpbHRlcnMpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmRhdGFTZXQgPSBkYXRhU2V0O1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBmaWx0ZXJzO1xuICAgICAgICB0aGlzLmFsbCA9IDBuO1xuICAgICAgICB0aGlzLmFueSA9IDBuO1xuICAgICAgICB0aGlzLm5vbmUgPSAwbjtcbiAgICAgICAgdGhpcy5oYXNFeGVjdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnByb2Nlc3NGaWx0ZXJzQXNCaXRNYXNrcygpO1xuICAgIH1cbiAgICBwcm9jZXNzRmlsdGVyc0FzQml0TWFza3MoKSB7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcnMuYWxsKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMuYWxsLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWxsID0gKDAsIGJpdG1hc2tfMS5hZGRCaXQpKHRoaXMuYWxsLCBjb21wb25lbnQucHJvdG90eXBlLmJpdG1hc2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVycy5hbnkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVycy5hbnkuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbnkgPSAoMCwgYml0bWFza18xLmFkZEJpdCkodGhpcy5hbnksIGNvbXBvbmVudC5wcm90b3R5cGUuYml0bWFzayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWx0ZXJzLm5vbmUpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVycy5ub25lLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubm9uZSA9ICgwLCBiaXRtYXNrXzEuYWRkQml0KSh0aGlzLm5vbmUsIGNvbXBvbmVudC5wcm90b3R5cGUuYml0bWFzayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgb25seSB0aGUgZW50aXRpZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBmaWx0ZXJzIGdpdmVuLlxuICAgICAqL1xuICAgIGV4ZWN1dGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNFeGVjdXRlZCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2V0ID0gdGhpcy5kYXRhU2V0LmZpbHRlcigoZW50aXR5KSA9PiB0aGlzLm1hdGNoKGVudGl0eSkpO1xuICAgICAgICAgICAgdGhpcy5oYXNFeGVjdXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNldDtcbiAgICB9XG4gICAgbWF0Y2goZW50aXR5KSB7XG4gICAgICAgIC8vIFJlamVjdCBhbGwgZW50aXRpZXMgdGhhdCBoYXZlIGEgY29tcG9uZW50KHMpIHRoYXQgaXMgaW4gdGhlIG5vbmUgZmlsdGVyLlxuICAgICAgICBpZiAodGhpcy5ub25lICE9PSAwbiAmJiAoMCwgYml0bWFza18xLmhhc0FueU9mQml0cykoZW50aXR5LmNvbXBvbmVudHNCaXRtYXNrLCB0aGlzLm5vbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5jbHVkZSBhbnkgZW50aXR5IHRoYXQgaGFzIGFsbCB0aGUgY29tcG9uZW50cyBpbiB0aGUgXCJhbnlcIiBmaWx0ZXIuXG4gICAgICAgIGlmICh0aGlzLmFueSAhPT0gMG4gJiYgKDAsIGJpdG1hc2tfMS5oYXNBbnlPZkJpdHMpKGVudGl0eS5jb21wb25lbnRzQml0bWFzaywgdGhpcy5hbnkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBhbGwgYml0cy5cbiAgICAgICAgaWYgKHRoaXMuYWxsICE9PSAwbiAmJiAhKDAsIGJpdG1hc2tfMS5oYXNCaXQpKGVudGl0eS5jb21wb25lbnRzQml0bWFzaywgdGhpcy5hbGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhbmRpZGF0ZShlbnRpdHkpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goZW50aXR5KSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2V0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVtb3ZlKGVudGl0eSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0YVNldC5pbmRleE9mKGVudGl0eSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVNldC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUXVlcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQm9keSA9IHZvaWQgMDtcbmNvbnN0IENvbXBvbmVudF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIikpO1xuY2xhc3MgQm9keSBleHRlbmRzIENvbXBvbmVudF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXMpIHtcbiAgICAgICAgc3VwZXIocHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgfVxufVxuZXhwb3J0cy5Cb2R5ID0gQm9keTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5LZXlib2FyZCA9IHZvaWQgMDtcbmNvbnN0IENvbXBvbmVudF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIikpO1xuY2xhc3MgS2V5Ym9hcmQgZXh0ZW5kcyBDb21wb25lbnRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzKSB7XG4gICAgICAgIHN1cGVyKHByb3BlcnRpZXMpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIH1cbn1cbmV4cG9ydHMuS2V5Ym9hcmQgPSBLZXlib2FyZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Qb3NpdGlvbiA9IHZvaWQgMDtcbmNvbnN0IENvbXBvbmVudF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIikpO1xuY2xhc3MgUG9zaXRpb24gZXh0ZW5kcyBDb21wb25lbnRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzKSB7XG4gICAgICAgIHN1cGVyKHByb3BlcnRpZXMpO1xuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIH1cbn1cbmV4cG9ydHMuUG9zaXRpb24gPSBQb3NpdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZW5kZXJhYmxlID0gdm9pZCAwO1xuY29uc3QgQ29tcG9uZW50XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKSk7XG5jbGFzcyBSZW5kZXJhYmxlIGV4dGVuZHMgQ29tcG9uZW50XzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcykge1xuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB9XG59XG5leHBvcnRzLlJlbmRlcmFibGUgPSBSZW5kZXJhYmxlO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vZGVtby9kZW1vLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9