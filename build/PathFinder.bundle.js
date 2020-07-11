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

/***/ "./node_modules/denque/index.js":
/*!**************************************!*\
  !*** ./node_modules/denque/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Custom implementation of a double ended queue.
 */
function Denque(array) {
  this._head = 0;
  this._tail = 0;
  this._capacityMask = 0x3;
  this._list = new Array(4);
  if (Array.isArray(array)) {
    this._fromArray(array);
  }
}

/**
 * -------------
 *  PUBLIC API
 * -------------
 */

/**
 * Returns the item at the specified index from the list.
 * 0 is the first element, 1 is the second, and so on...
 * Elements at negative values are that many from the end: -1 is one before the end
 * (the last element), -2 is two before the end (one before last), etc.
 * @param index
 * @returns {*}
 */
Denque.prototype.peekAt = function peekAt(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var len = this.size();
  if (i >= len || i < -len) return undefined;
  if (i < 0) i += len;
  i = (this._head + i) & this._capacityMask;
  return this._list[i];
};

/**
 * Alias for peakAt()
 * @param i
 * @returns {*}
 */
Denque.prototype.get = function get(i) {
  return this.peekAt(i);
};

/**
 * Returns the first item in the list without removing it.
 * @returns {*}
 */
Denque.prototype.peek = function peek() {
  if (this._head === this._tail) return undefined;
  return this._list[this._head];
};

/**
 * Alias for peek()
 * @returns {*}
 */
Denque.prototype.peekFront = function peekFront() {
  return this.peek();
};

/**
 * Returns the item that is at the back of the queue without removing it.
 * Uses peekAt(-1)
 */
Denque.prototype.peekBack = function peekBack() {
  return this.peekAt(-1);
};

/**
 * Returns the current length of the queue
 * @return {Number}
 */
Object.defineProperty(Denque.prototype, 'length', {
  get: function length() {
    return this.size();
  }
});

/**
 * Return the number of items on the list, or 0 if empty.
 * @returns {number}
 */
Denque.prototype.size = function size() {
  if (this._head === this._tail) return 0;
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Add an item at the beginning of the list.
 * @param item
 */
Denque.prototype.unshift = function unshift(item) {
  if (item === undefined) return this.size();
  var len = this._list.length;
  this._head = (this._head - 1 + len) & this._capacityMask;
  this._list[this._head] = item;
  if (this._tail === this._head) this._growArray();
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the first item on the list,
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.shift = function shift() {
  var head = this._head;
  if (head === this._tail) return undefined;
  var item = this._list[head];
  this._list[head] = undefined;
  this._head = (head + 1) & this._capacityMask;
  if (head < 2 && this._tail > 10000 && this._tail <= this._list.length >>> 2) this._shrinkArray();
  return item;
};

/**
 * Add an item to the bottom of the list.
 * @param item
 */
Denque.prototype.push = function push(item) {
  if (item === undefined) return this.size();
  var tail = this._tail;
  this._list[tail] = item;
  this._tail = (tail + 1) & this._capacityMask;
  if (this._tail === this._head) {
    this._growArray();
  }

  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the last item on the list.
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.pop = function pop() {
  var tail = this._tail;
  if (tail === this._head) return undefined;
  var len = this._list.length;
  this._tail = (tail - 1 + len) & this._capacityMask;
  var item = this._list[this._tail];
  this._list[this._tail] = undefined;
  if (this._head < 2 && tail > 10000 && tail <= len >>> 2) this._shrinkArray();
  return item;
};

/**
 * Remove and return the item at the specified index from the list.
 * Returns undefined if the list is empty.
 * @param index
 * @returns {*}
 */
Denque.prototype.removeOne = function removeOne(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size) return void 0;
  if (i < 0) i += size;
  i = (this._head + i) & this._capacityMask;
  var item = this._list[i];
  var k;
  if (index < size / 2) {
    for (k = index; k > 0; k--) {
      this._list[i] = this._list[i = (i - 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._head = (this._head + 1 + len) & this._capacityMask;
  } else {
    for (k = size - 1 - index; k > 0; k--) {
      this._list[i] = this._list[i = ( i + 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._tail = (this._tail - 1 + len) & this._capacityMask;
  }
  return item;
};

/**
 * Remove number of items from the specified index from the list.
 * Returns array of removed items.
 * Returns undefined if the list is empty.
 * @param index
 * @param count
 * @returns {array}
 */
Denque.prototype.remove = function remove(index, count) {
  var i = index;
  var removed;
  var del_count = count;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size || count < 1) return void 0;
  if (i < 0) i += size;
  if (count === 1 || !count) {
    removed = new Array(1);
    removed[0] = this.removeOne(i);
    return removed;
  }
  if (i === 0 && i + count >= size) {
    removed = this.toArray();
    this.clear();
    return removed;
  }
  if (i + count > size) count = size - i;
  var k;
  removed = new Array(count);
  for (k = 0; k < count; k++) {
    removed[k] = this._list[(this._head + i + k) & this._capacityMask];
  }
  i = (this._head + i) & this._capacityMask;
  if (index + count === size) {
    this._tail = (this._tail - count + len) & this._capacityMask;
    for (k = count; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (index === 0) {
    this._head = (this._head + count + len) & this._capacityMask;
    for (k = count - 1; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (i < size / 2) {
    this._head = (this._head + index + count + len) & this._capacityMask;
    for (k = index; k > 0; k--) {
      this.unshift(this._list[i = (i - 1 + len) & this._capacityMask]);
    }
    i = (this._head - 1 + len) & this._capacityMask;
    while (del_count > 0) {
      this._list[i = (i - 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
    if (index < 0) this._tail = i;
  } else {
    this._tail = i;
    i = (i + count + len) & this._capacityMask;
    for (k = size - (count + index); k > 0; k--) {
      this.push(this._list[i++]);
    }
    i = this._tail;
    while (del_count > 0) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
  }
  if (this._head < 2 && this._tail > 10000 && this._tail <= len >>> 2) this._shrinkArray();
  return removed;
};

/**
 * Native splice implementation.
 * Remove number of items from the specified index from the list and/or add new elements.
 * Returns array of removed items or empty array if count == 0.
 * Returns undefined if the list is empty.
 *
 * @param index
 * @param count
 * @param {...*} [elements]
 * @returns {array}
 */
Denque.prototype.splice = function splice(index, count) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var size = this.size();
  if (i < 0) i += size;
  if (i > size) return void 0;
  if (arguments.length > 2) {
    var k;
    var temp;
    var removed;
    var arg_len = arguments.length;
    var len = this._list.length;
    var arguments_index = 2;
    if (!size || i < size / 2) {
      temp = new Array(i);
      for (k = 0; k < i; k++) {
        temp[k] = this._list[(this._head + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i > 0) {
          this._head = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._head = (this._head + i + len) & this._capacityMask;
      }
      while (arg_len > arguments_index) {
        this.unshift(arguments[--arg_len]);
      }
      for (k = i; k > 0; k--) {
        this.unshift(temp[k - 1]);
      }
    } else {
      temp = new Array(size - (i + count));
      var leng = temp.length;
      for (k = 0; k < leng; k++) {
        temp[k] = this._list[(this._head + i + count + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i != size) {
          this._tail = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._tail = (this._tail - leng + len) & this._capacityMask;
      }
      while (arguments_index < arg_len) {
        this.push(arguments[arguments_index++]);
      }
      for (k = 0; k < leng; k++) {
        this.push(temp[k]);
      }
    }
    return removed;
  } else {
    return this.remove(i, count);
  }
};

/**
 * Soft clear - does not reset capacity.
 */
Denque.prototype.clear = function clear() {
  this._head = 0;
  this._tail = 0;
};

/**
 * Returns true or false whether the list is empty.
 * @returns {boolean}
 */
Denque.prototype.isEmpty = function isEmpty() {
  return this._head === this._tail;
};

/**
 * Returns an array of all queue items.
 * @returns {Array}
 */
Denque.prototype.toArray = function toArray() {
  return this._copyArray(false);
};

/**
 * -------------
 *   INTERNALS
 * -------------
 */

/**
 * Fills the queue with items from an array
 * For use in the constructor
 * @param array
 * @private
 */
Denque.prototype._fromArray = function _fromArray(array) {
  for (var i = 0; i < array.length; i++) this.push(array[i]);
};

/**
 *
 * @param fullCopy
 * @returns {Array}
 * @private
 */
Denque.prototype._copyArray = function _copyArray(fullCopy) {
  var newArray = [];
  var list = this._list;
  var len = list.length;
  var i;
  if (fullCopy || this._head > this._tail) {
    for (i = this._head; i < len; i++) newArray.push(list[i]);
    for (i = 0; i < this._tail; i++) newArray.push(list[i]);
  } else {
    for (i = this._head; i < this._tail; i++) newArray.push(list[i]);
  }
  return newArray;
};

/**
 * Grows the internal list array.
 * @private
 */
Denque.prototype._growArray = function _growArray() {
  if (this._head) {
    // copy existing data, head to end, then beginning to tail.
    this._list = this._copyArray(true);
    this._head = 0;
  }

  // head is at 0 and array is now full, safe to extend
  this._tail = this._list.length;

  this._list.length *= 2;
  this._capacityMask = (this._capacityMask << 1) | 1;
};

/**
 * Shrinks the internal list array.
 * @private
 */
Denque.prototype._shrinkArray = function _shrinkArray() {
  this._list.length >>>= 1;
  this._capacityMask >>>= 1;
};


module.exports = Denque;


/***/ }),

/***/ "./node_modules/heap/index.js":
/*!************************************!*\
  !*** ./node_modules/heap/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/heap */ "./node_modules/heap/lib/heap.js");


/***/ }),

/***/ "./node_modules/heap/lib/heap.js":
/*!***************************************!*\
  !*** ./node_modules/heap/lib/heap.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (true) {
      return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
  })(this, function() {
    return Heap;
  });

}).call(this);


/***/ }),

/***/ "./src/PathFinding/algorithms/AStar.js":
/*!*********************************************!*\
  !*** ./src/PathFinding/algorithms/AStar.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AStar; });
/* harmony import */ var heap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! heap */ "./node_modules/heap/index.js");
/* harmony import */ var heap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(heap__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_BackTrace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/BackTrace */ "./src/PathFinding/utils/BackTrace.js");
/* harmony import */ var _utils_Heuristics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Heuristics */ "./src/PathFinding/utils/Heuristics.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var AStar = /*#__PURE__*/function () {
  function AStar(options) {
    _classCallCheck(this, AStar);

    console.log(options);
    this.allowDiagonal = options.allowDiagonal;
    this.biDirectional = options.biDirectional;
    this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
    this.heuristic = _utils_Heuristics__WEBPACK_IMPORTED_MODULE_2__["default"][options.heuristic];
  }

  _createClass(AStar, [{
    key: "getDistanceFromCurrentProcessignNode",
    value: function getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour) {
      if (Math.abs(currentProcessingNode.x - neighbour.x) + Math.abs(currentProcessingNode.y - neighbour.y) === 1) {
        return 1;
      }

      return Math.SQRT2;
    }
  }, {
    key: "findPath",
    value: function findPath(grid) {
      var _this = this;

      var minHeap = new heap__WEBPACK_IMPORTED_MODULE_0___default.a(function (node1, node2) {
        return node1.f - node2.f;
      }),
          startNode = grid.getNodeAtXY(grid.startPoint.x, grid.startPoint.y),
          endNode = grid.getNodeAtXY(grid.endPoint.x, grid.endPoint.y),
          currentProcessingNode,
          neighbours,
          neighbourGValFromCurrentProcessingNode;
      startNode.f = 0;
      startNode.g = 0;
      minHeap.insert(startNode);
      startNode.addedToHeap = true;

      while (!minHeap.empty()) {
        currentProcessingNode = minHeap.pop();
        currentProcessingNode.currentNode = true;

        if (currentProcessingNode === endNode) {
          return _utils_BackTrace__WEBPACK_IMPORTED_MODULE_1__["default"].backTrace(currentProcessingNode, startNode);
        }

        neighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
        neighbours.forEach(function (neighbour) {
          if (neighbour.visited) return; //equivalent to continue in forEach

          neighbourGValFromCurrentProcessingNode = currentProcessingNode.g + _this.getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour);

          if (!neighbour.addedToHeap) {
            neighbour.g = neighbourGValFromCurrentProcessingNode;
            neighbour.h = _this.heuristic(endNode, neighbour);
            neighbour.f = neighbour.g + neighbour.h;
            minHeap.insert(neighbour);
            neighbour.addedToHeap = true;
            neighbour.parent = currentProcessingNode;
          } else if (neighbour.g > neighbourGValFromCurrentProcessingNode) {
            neighbour.g = neighbourGValFromCurrentProcessingNode;
            neighbour.h = _this.heuristic(endNode, neighbour);
            neighbour.f = neighbour.g + neighbour.h;
            minHeap.updateItem(neighbour);
            neighbour.parent = currentProcessingNode;
          }
        });
        currentProcessingNode.visited = true;
      }

      return [];
    }
  }]);

  return AStar;
}();



/***/ }),

/***/ "./src/PathFinding/algorithms/BestFirstSearch.js":
/*!*******************************************************!*\
  !*** ./src/PathFinding/algorithms/BestFirstSearch.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BestFirstSearch; });
/* harmony import */ var _AStar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AStar */ "./src/PathFinding/algorithms/AStar.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var BestFirstSearch = /*#__PURE__*/function (_AStar) {
  _inherits(BestFirstSearch, _AStar);

  var _super = _createSuper(BestFirstSearch);

  function BestFirstSearch(options) {
    var _this;

    _classCallCheck(this, BestFirstSearch);

    _this = _super.call(this, options);
    var heuristicToOverride = _this.heuristic;

    _this.heuristic = function (node1, node2) {
      return heuristicToOverride(node1, node2, 500000);
    };

    return _this;
  }

  return BestFirstSearch;
}(_AStar__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),

/***/ "./src/PathFinding/algorithms/BreadthFirstSearch.js":
/*!**********************************************************!*\
  !*** ./src/PathFinding/algorithms/BreadthFirstSearch.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BreadthFirstSearch; });
/* harmony import */ var denque__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! denque */ "./node_modules/denque/index.js");
/* harmony import */ var denque__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(denque__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_BackTrace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/BackTrace */ "./src/PathFinding/utils/BackTrace.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var BreadthFirstSearch = /*#__PURE__*/function () {
  function BreadthFirstSearch(options) {
    _classCallCheck(this, BreadthFirstSearch);

    console.log(options);
    this.allowDiagonal = options.allowDiagonal;
    this.biDirectional = options.biDirectional;
    this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
  }

  _createClass(BreadthFirstSearch, [{
    key: "findPath",
    value: function findPath(grid) {
      var startPoint = grid.startPoint,
          endPoint = grid.endPoint,
          startNode = grid[startPoint.y][startPoint.x],
          endNode = grid[endPoint.y][endPoint.x];
      var queue = new denque__WEBPACK_IMPORTED_MODULE_0___default.a([startNode]),
          neighbours = [],
          currentProcessingNode;
      startNode.addedToQueue = true;

      while (!queue.isEmpty()) {
        currentProcessingNode = queue.shift(); // Dequeue operation on queue

        currentProcessingNode.currentNode = true;

        if (currentProcessingNode === endNode) {
          return _utils_BackTrace__WEBPACK_IMPORTED_MODULE_1__["default"].backTrace(endNode, startNode);
        }

        neighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
        neighbours.forEach(function (neighbour) {
          if (neighbour.visited || neighbour.addedToQueue) {
            return; // equivalent to CONTINUE in forEach
          }

          queue.push(neighbour);
          neighbour.addedToQueue = true;
          neighbour.parent = currentProcessingNode;
        });
        currentProcessingNode.visited = true;
      }

      return [];
    }
  }]);

  return BreadthFirstSearch;
}();



/***/ }),

/***/ "./src/PathFinding/algorithms/Dijkshtra.js":
/*!*************************************************!*\
  !*** ./src/PathFinding/algorithms/Dijkshtra.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Dijkshtra; });
/* harmony import */ var _AStar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AStar */ "./src/PathFinding/algorithms/AStar.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var Dijkshtra = /*#__PURE__*/function (_AStar) {
  _inherits(Dijkshtra, _AStar);

  var _super = _createSuper(Dijkshtra);

  function Dijkshtra(options) {
    var _this;

    _classCallCheck(this, Dijkshtra);

    _this = _super.call(this, options);

    _this.heuristic = function () {
      return 0;
    };

    return _this;
  }

  return Dijkshtra;
}(_AStar__WEBPACK_IMPORTED_MODULE_0__["default"]);



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
      if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) return true;
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
    key: "getNodeAtXY",
    value: function getNodeAtXY(x, y) {
      return this[y][x];
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
    /*
    	|_ _|_a_|_ _| |_p_|_ _|_q_| 
    	|_d_|_*_|_b_| |_ _|_*_|_ _|
    	|_ _|_c_|_ _| |_s_|_ _|_r_|
     */

  }, {
    key: "getNeighbours",
    value: function getNeighbours(node, allowDiagonal, doNotCrossCornersBetweenObstacles) {
      var neighbours = [];
      var x = node.x,
          y = node.y;
      var a, b, c, d; // a

      if (!this.isXYWallElement(x, y - 1)) {
        neighbours.push(this.getNodeAtXY(x, y - 1));
        a = true;
      } // b


      if (!this.isXYWallElement(x + 1, y)) {
        neighbours.push(this.getNodeAtXY(x + 1, y));
        b = true;
      } // c


      if (!this.isXYWallElement(x, y + 1)) {
        neighbours.push(this.getNodeAtXY(x, y + 1));
        c = true;
      } // d


      if (!this.isXYWallElement(x - 1, y)) {
        neighbours.push(this.getNodeAtXY(x - 1, y));
        d = true;
      }

      if (allowDiagonal) {
        if (doNotCrossCornersBetweenObstacles) {
          //p
          if ((a || d) & !this.isXYWallElement(x - 1, y - 1)) {
            neighbours.push(this.getNodeAtXY(x - 1, y - 1));
          } //q


          if ((a || b) & !this.isXYWallElement(x + 1, y - 1)) {
            neighbours.push(this.getNodeAtXY(x + 1, y - 1));
          } //r


          if ((b || c) & !this.isXYWallElement(x + 1, y + 1)) {
            neighbours.push(this.getNodeAtXY(x + 1, y + 1));
          } //s


          if ((c || d) & !this.isXYWallElement(x - 1, y + 1)) {
            neighbours.push(this.getNodeAtXY(x - 1, y + 1));
          }
        } else {
          //p
          if (!this.isXYWallElement(x - 1, y - 1)) {
            neighbours.push(this.getNodeAtXY(x - 1, y - 1));
          } //q


          if (!this.isXYWallElement(x + 1, y - 1)) {
            neighbours.push(this.getNodeAtXY(x + 1, y - 1));
          } //r


          if (!this.isXYWallElement(x + 1, y + 1)) {
            neighbours.push(this.getNodeAtXY(x + 1, y + 1));
          } //s


          if (!this.isXYWallElement(x - 1, y + 1)) {
            neighbours.push(this.getNodeAtXY(x - 1, y + 1));
          }
        }
      }

      return neighbours;
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
/* harmony import */ var _algorithms_AStar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./algorithms/AStar */ "./src/PathFinding/algorithms/AStar.js");
/* harmony import */ var _algorithms_Dijkshtra__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./algorithms/Dijkshtra */ "./src/PathFinding/algorithms/Dijkshtra.js");
/* harmony import */ var _algorithms_BestFirstSearch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./algorithms/BestFirstSearch */ "./src/PathFinding/algorithms/BestFirstSearch.js");






/* harmony default export */ __webpack_exports__["default"] = ({
  Grid: _core_Grid__WEBPACK_IMPORTED_MODULE_0__["default"],
  GraphNode: _core_GraphNode__WEBPACK_IMPORTED_MODULE_1__["default"],
  BreadthFirstSearch: _algorithms_BreadthFirstSearch__WEBPACK_IMPORTED_MODULE_2__["default"],
  AStar: _algorithms_AStar__WEBPACK_IMPORTED_MODULE_3__["default"],
  Dijkshtra: _algorithms_Dijkshtra__WEBPACK_IMPORTED_MODULE_4__["default"],
  BestFirstSearch: _algorithms_BestFirstSearch__WEBPACK_IMPORTED_MODULE_5__["default"]
});

/***/ }),

/***/ "./src/PathFinding/utils/BackTrace.js":
/*!********************************************!*\
  !*** ./src/PathFinding/utils/BackTrace.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BackTrace = /*#__PURE__*/function () {
  function BackTrace() {
    _classCallCheck(this, BackTrace);
  }

  _createClass(BackTrace, [{
    key: "backTrace",
    value: function backTrace(node, startNode) {
      var path = [];

      while (node !== startNode) {
        path.push(node);
        node = node.parent;
      }

      path.reverse();
      return path;
    }
  }]);

  return BackTrace;
}();

/* harmony default export */ __webpack_exports__["default"] = (new BackTrace());

/***/ }),

/***/ "./src/PathFinding/utils/Heuristics.js":
/*!*********************************************!*\
  !*** ./src/PathFinding/utils/Heuristics.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var abs = Math.abs,
    sqrt = Math.sqrt,
    max = Math.max,
    min = Math.min;

var Heuristic = /*#__PURE__*/function () {
  function Heuristic() {
    _classCallCheck(this, Heuristic);
  }

  _createClass(Heuristic, [{
    key: "manhattan",
    value: function manhattan(nodeA, nodeB) {
      var weight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var dx = abs(nodeA.x - nodeB.x);
      var dy = abs(nodeA.y - nodeB.y);
      return weight * (dx + dy);
    }
  }, {
    key: "euclidean",
    value: function euclidean(nodeA, nodeB) {
      var weight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var dx = abs(nodeA.x - nodeB.x);
      var dy = abs(nodeA.y - nodeB.y);
      return weight * sqrt(dx * dx + dy * dy);
    }
  }, {
    key: "octile",
    value: function octile(nodeA, nodeB) {
      var weight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var dx = abs(nodeA.x - nodeB.x);
      var dy = abs(nodeA.y - nodeB.y);
      return weight * (max(dx, dy) + (sqrt(2) - 1) * min(dx, dy));
    }
  }, {
    key: "chebyshev",
    value: function chebyshev(nodeA, nodeB) {
      var weight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var dx = abs(nodeA.x - nodeB.x);
      var dy = abs(nodeA.y - nodeB.y);
      return weight * max(dx, dy);
    }
  }]);

  return Heuristic;
}();

/* harmony default export */ __webpack_exports__["default"] = (new Heuristic());

/***/ })

/******/ });
//# sourceMappingURL=PathFinder.bundle.js.map