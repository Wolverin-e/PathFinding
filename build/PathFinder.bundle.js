var PathFinder =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/PathFinding/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/PathFinding/algorithms/BreadthFirstSearch.js":
/*!**********************************************************!*\
  !*** ./src/PathFinding/algorithms/BreadthFirstSearch.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BreadthFirstSearch; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BreadthFirstSearch = /*#__PURE__*/function () {
  function BreadthFirstSearch(opts) {
    _classCallCheck(this, BreadthFirstSearch);

    console.log(opts);
  }

  _createClass(BreadthFirstSearch, [{
    key: "findPath",
    value: function findPath(grid) {
      var uLimit = 10;
      var dLimit = 20;
      var lLimit = 10;
      var rLimit = 20;

      for (var y = uLimit; y < dLimit; y++) {
        for (var x = lLimit; x < rLimit; x++) {
          grid[y][x].visited = true;
        }
      }

      return [{
        x: 12,
        y: 12
      }, {
        x: 3,
        y: 3
      }, {
        x: 4,
        y: 4
      }, {
        x: 5,
        y: 5
      }, {
        x: 6,
        y: 6
      }];
    }
  }]);

  return BreadthFirstSearch;
}();



/***/ }),

/***/ "./src/PathFinding/core/GraphNode.js":
/*!*******************************************!*\
  !*** ./src/PathFinding/core/GraphNode.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GraphNode = function GraphNode(options) {
  _classCallCheck(this, GraphNode);

  this.x = options.x;
  this.y = options.y;
};

/* harmony default export */ __webpack_exports__["default"] = (GraphNode);

/***/ }),

/***/ "./src/PathFinding/core/Grid.js":
/*!**************************************!*\
  !*** ./src/PathFinding/core/Grid.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GraphNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphNode */ "./src/PathFinding/core/GraphNode.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Grid = /*#__PURE__*/function () {
  function Grid(options) {
    _classCallCheck(this, Grid);

    this.rows = options.rows;
    this.columns = options.columns;
    this.startPoint = options.startPoint;
    this.endPoint = options.endPoint;

    for (var y = 0; y < this.rows; y++) {
      this[y] = new Array(this.columns);

      for (var x = 0; x < this.columns; x++) {
        this[y][x] = new _GraphNode__WEBPACK_IMPORTED_MODULE_0__["default"]({
          x: x,
          y: y
        });
      }
    }
  }

  _createClass(Grid, [{
    key: "isXYWallElement",
    value: function isXYWallElement(x, y) {
      return this[y][x].isWall ? true : false;
    }
  }, {
    key: "makeXYWall",
    value: function makeXYWall(x, y) {
      this[y][x].isWall = true;
    }
  }, {
    key: "destroyWallAtXY",
    value: function destroyWallAtXY(x, y) {
      this[y][x].isWall = false;
    }
  }, {
    key: "isXYStartPoint",
    value: function isXYStartPoint(x, y) {
      return this.startPoint.x === x && this.startPoint.y === y;
    }
  }, {
    key: "isXYEndPoint",
    value: function isXYEndPoint(x, y) {
      return this.endPoint.x === x && this.endPoint.y === y;
    }
  }, {
    key: "clone",
    value: function clone() {
      var grid = new Grid(this);

      for (var y = 0; y < this.rows; y++) {
        grid[y] = new Array(this.columns);

        for (var x = 0; x < this.columns; x++) {
          grid[y][x] = new _GraphNode__WEBPACK_IMPORTED_MODULE_0__["default"]({
            x: x,
            y: y
          });
          if (this.isXYWallElement(x, y)) grid.makeXYWall(x, y);
        }
      }

      return grid;
    }
  }]);

  return Grid;
}();

/* harmony default export */ __webpack_exports__["default"] = (Grid);

/***/ }),

/***/ "./src/PathFinding/index.js":
/*!**********************************!*\
  !*** ./src/PathFinding/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_Grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Grid */ "./src/PathFinding/core/Grid.js");
/* harmony import */ var _core_GraphNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/GraphNode */ "./src/PathFinding/core/GraphNode.js");
/* harmony import */ var _algorithms_BreadthFirstSearch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./algorithms/BreadthFirstSearch */ "./src/PathFinding/algorithms/BreadthFirstSearch.js");



/* harmony default export */ __webpack_exports__["default"] = ({
  Grid: _core_Grid__WEBPACK_IMPORTED_MODULE_0__["default"],
  GraphNode: _core_GraphNode__WEBPACK_IMPORTED_MODULE_1__["default"],
  BreadthFirstSearch: _algorithms_BreadthFirstSearch__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ })

/******/ });
//# sourceMappingURL=PathFinder.bundle.js.map