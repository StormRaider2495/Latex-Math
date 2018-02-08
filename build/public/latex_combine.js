/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var AlgebraLatex = __webpack_require__(2);
	
	var mathFieldSpan = document.getElementById('math-field');
	var latexSpan = document.getElementById('latex');
	var exprSpan = document.getElementById('expr');
	
	var MQ = MathQuill.getInterface(2); // for backcompat
	var mathField = MQ.MathField(mathFieldSpan, {
	    spaceBehavesLikeTab: true, // configurable
	    handlers: {
	        edit: function edit() {
	            // useful event handlers
	            latexSpan.textContent = mathField.latex(); // simple API
	            var latexInput = mathField.latex(); //storing latex format expression
	            var algebraObj = new AlgebraLatex(latexInput); //initializing AlgebraLatex
	            var mathOutput = algebraObj.toMath(); //storing math format expression
	            exprSpan.innerHTML = mathOutput;
	        }
	    }
	});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _parser = __webpack_require__(3);
	
	var _parser2 = _interopRequireDefault(_parser);
	
	var _formatMath = __webpack_require__(7);
	
	var _formatMath2 = _interopRequireDefault(_formatMath);
	
	var _logger = __webpack_require__(4);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _greekLetters = __webpack_require__(8);
	
	var greekLetters = _interopRequireWildcard(_greekLetters);
	
	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj['default'] = obj;return newObj;
	  }
	}
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	// Functors
	var stripParenthesis = function stripParenthesis(mathString) {
	  return mathString.substr(1, mathString.length - 2);
	};
	
	/**
	 * A class for parsing latex math
	 */
	
	var AlgebraLatex = (function () {
	  /**
	   * Create an AlgebraLatex object, to be converted
	   * @param  {String} latex The latex to parse
	   * @return {AlgebraLatex} object to be converted
	   */
	  function AlgebraLatex(latex) {
	    _classCallCheck(this, AlgebraLatex);
	
	    _logger2['default'].debug('Creating AlgebraLatex object with input: ' + latex);
	    this.texInput = latex;
	
	    this.structure = (0, _parser2['default'])(latex);
	  }
	
	  /**
	   * Will return a serialized string eg. 2*(3+4)/(sqrt(5))-8
	   * @return string The serialized string
	   */
	
	  _createClass(AlgebraLatex, [{
	    key: 'toMath',
	    value: function toMath() {
	      if (typeof this.formattedMath === 'undefined') {
	        this.formattedMath = stripParenthesis((0, _formatMath2['default'])(this.structure));
	      }
	
	      return this.formattedMath;
	    }
	
	    /**
	     * Will return an algebra.js Expression or Equation
	     * @param {Object} algebraJS an instance of algebra.js
	     * @return {(Expression|Equation)} an Expression or Equation
	     */
	
	  }, {
	    key: 'toAlgebra',
	    value: function toAlgebra(algebraJS) {
	      if (algebraJS === null) {
	        throw new Error('Algebra.js must be passed as a parameter for toAlgebra');
	      }
	
	      var mathToParse = this.toMath();
	      mathToParse = greekLetters.convertSymbols(mathToParse);
	
	      return algebraJS.parse(mathToParse);
	    }
	
	    /**
	     * Will return an algebrite object
	     * @param {Object} algebrite an instance of algebrite
	     * @return {Object} an algebrite object
	     */
	
	  }, {
	    key: 'toAlgebrite',
	    value: function toAlgebrite(algebrite) {
	      if (algebrite === null) {
	        return new Error('Algebrite must be passed as a parameter for toAlgebrite');
	      }
	
	      if (this.isEquation()) {
	        return new Error('Algebrite can not handle equations, only expressions');
	      }
	
	      var mathToParse = this.toMath();
	      mathToParse = greekLetters.convertSymbols(mathToParse);
	
	      return algebrite.eval(mathToParse);
	    }
	
	    /**
	     * Will return a coffequate object
	     * @return {Object} a coffeequate object
	     */
	
	  }, {
	    key: 'toCoffeequate',
	    value: function toCoffeequate(coffeequate) {
	      if (coffeequate === null) {
	        return new Error('Coffeequante must be passed as a parameter for toCoffeequante');
	      }
	
	      var result = this.toMath();
	      result = result.replace('^', '**');
	
	      return coffeequate(result);
	    }
	
	    /**
	     * Wether or not the object is an equation or an expression
	     * @return Boolean true if expression
	     */
	
	  }, {
	    key: 'isEquation',
	    value: function isEquation() {
	      return this.texInput.includes('=');
	    }
	  }]);
	
	  return AlgebraLatex;
	})();
	
	module.exports = AlgebraLatex;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _logger = __webpack_require__(4);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _functions = __webpack_require__(6);
	
	var _functions2 = _interopRequireDefault(_functions);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	/**
	 * Parse a latex math string, to an object
	 * @param  {string} latex A latex string like "\frac{1}{2}"
	 * @return {array} An array containing the content of the input,
	 *                     formatted with objects with a type and a value field
	 */
	var parseLatex = function parseLatex(latex) {
	  var findingToken = false;
	  var findingNumber = false;
	  var findingVariable = false;
	  var currentToken = '';
	  var currentNumber = '';
	  var currentVariable = '';
	  var structure = [];
	
	  for (var i = 0; i < latex.length; i++) {
	    var char = latex.charAt(i);
	
	    if (findingToken) {
	      if (char.match(/[a-zA-Z]/g)) {
	        currentToken += char;
	        continue;
	      } else {
	        if ((currentToken + char).match(/^\s+$/g)) {
	          currentToken = ' ';
	        }
	        findingToken = false;
	        _logger2['default'].debug('Found token ' + currentToken);
	        parseToken(currentToken, structure);
	        currentToken = '';
	      }
	    }
	
	    if (findingNumber) {
	      // Check for number
	      if (char.match(/[\d.,]/g)) {
	        _logger2['default'].debug('Found next number in sequence: ' + char);
	        currentNumber += char;
	        continue;
	      } else {
	        _logger2['default'].debug('Number found ' + currentNumber);
	        structure.push({
	          type: 'number',
	          value: currentNumber
	        });
	
	        currentNumber = '';
	        findingNumber = false;
	      }
	    } else {
	      if (char.match(/[\d.,]/g)) {
	        _logger2['default'].debug('Found a new number: ' + char);
	        currentNumber += char;
	        findingNumber = true;
	        continue;
	      }
	    }
	
	    if (findingVariable && !char.match(/[a-zA-Z]/g)) {
	      structure.push({
	        type: 'variable',
	        value: currentVariable
	      });
	      findingVariable = false;
	      _logger2['default'].debug('Found new variable ' + currentVariable);
	    }
	
	    // Check for group '{ ... }'
	    if (char === '\\') {
	      findingToken = true;
	      continue;
	    } else {
	      if (char === '{') {
	        var length = matchingBracketLength(latex.substr(i), 'curly');
	
	        if (length instanceof Error) return length;
	
	        var newLatex = latex.substr(i + 1, length - 1);
	        _logger2['default'].debug('New Latex' + newLatex);
	
	        structure.push({
	          type: 'group',
	          value: parseLatex(newLatex)
	        });
	
	        i += length;
	        continue;
	      }
	
	      // Check for operator
	      if (char.match(/[+\-*/()=^_]/g)) {
	        _logger2['default'].debug('Found operator ' + char);
	        structure.push({
	          type: 'operator',
	          value: char
	        });
	        continue;
	      }
	
	      // Check for variable
	      if (char.match(/[a-zA-Z]/g)) {
	        if (findingVariable) {
	          currentVariable += char;
	          _logger2['default'].debug('- Finding variable ' + currentVariable);
	        } else {
	          currentVariable = char;
	          findingVariable = true;
	          _logger2['default'].debug('Finding new variable ' + currentVariable);
	        }
	      }
	    }
	  } // Loop end
	
	  if (findingNumber) {
	    _logger2['default'].debug('Wrapping up number');
	    structure.push({
	      type: 'number',
	      value: currentNumber
	    });
	  }
	
	  if (findingToken) {
	    _logger2['default'].debug('Wrapping up token');
	    structure.push({
	      type: 'token',
	      value: currentToken
	    });
	  }
	
	  if (findingVariable) {
	    _logger2['default'].debug('Wrapping up variable');
	    structure.push({
	      type: 'variable',
	      value: currentVariable
	    });
	  }
	
	  return structure;
	};
	
	var parseToken = function parseToken(token, structure) {
	  var isFunction = _functions2['default'].reduce(function (acc, val) {
	    return acc || val === token;
	  }, false);
	  if (isFunction) {
	    structure.push({
	      type: 'function',
	      value: token
	    });
	    return;
	  }
	  switch (token) {
	    case 'cdot':
	      structure.push({
	        type: 'operator',
	        value: '*'
	      });
	      break;
	    case 'mod':
	      structure.push({
	        type: 'operator',
	        value: '%'
	      });
	      break;
	    default:
	      structure.push({
	        type: 'token',
	        value: token
	      });
	  }
	};
	
	/**
	 * Will find the length to the matching bracket, in provided string
	 * @param  {string} latex       A string of latex, starting from where the search should begin
	 * @param  {string} bracketType The type of bracket to search for.
	 *                                  Can be one of the following ['normal', 'curly', 'square']
	 * @return {number}             The length from start of provided string,
	 *                                  to the location of the matching bracket
	 */
	var matchingBracketLength = function matchingBracketLength(latex, bracketType) {
	  _logger2['default'].debug('Finding matching bracket for text:', latex);
	
	  var startBracket = '';
	  var endBracket = '';
	
	  switch (bracketType) {
	    case 'normal':
	      startBracket = '(';
	      endBracket = ')';
	      break;
	    case 'curly':
	      startBracket = '{';
	      endBracket = '}';
	      break;
	    case 'square':
	      startBracket = '[';
	      endBracket = ']';
	      break;
	  }
	
	  var bracketDepth = 0;
	
	  for (var i = 0; i < latex.length; i++) {
	    var char = latex.charAt(i);
	    _logger2['default'].debug('-- Char:' + char);
	
	    if (char === startBracket) {
	      bracketDepth++;
	      _logger2['default'].debug('-- Found starting bracket, depth ' + bracketDepth);
	    } else if (char === endBracket) {
	      if (bracketDepth === 1) {
	        _logger2['default'].debug('-- Found original closing bracket at position ' + i);
	        return i;
	      }
	
	      bracketDepth--;
	      _logger2['default'].debug('-- Found closing bracket, depth ' + bracketDepth);
	    }
	  }
	
	  return new Error('Brackets do not match up');
	};
	
	exports['default'] = parseLatex;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
	
	var debug = function debug(msg) {
	  if ((typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object') {
	    if (process.env.TEX_DEBUG) {
	      console.log(msg);
	    }
	  }
	};
	
	exports["default"] = {
	  debug: debug
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// shim for using process in browser
	'use strict';
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) {
	    return [];
	};
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports['default'] = ['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'log', 'ln', 'sqrt', 'max', 'min'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _greekLetters = __webpack_require__(8);
	
	var greekLetters = _interopRequireWildcard(_greekLetters);
	
	var _logger = __webpack_require__(4);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj['default'] = obj;return newObj;
	  }
	}
	
	/**
	 * Will format a parsed latex object, to a calculatable string
	 * @param  {object} parsedLatex An object parsed by "./parser.js"
	 * @return {string} A calculatable string, eg. "(1+3)/4*sqrt(2)"
	 */
	var formatter = function formatter(parsedLatex) {
	  var formattedString = '';
	
	  formattedString += '(';
	
	  for (var i = 0; i < parsedLatex.length; i++) {
	    var item = parsedLatex[i];
	
	    if (item.type === 'number') {
	      if (i > 0) {
	        if (parsedLatex[i - 1].type !== 'number' && parsedLatex[i - 1].type !== 'operator') {
	          _logger2['default'].debug('Adding * before number: ' + item.value + ', previous item: ' + parsedLatex[i - 1].type);
	          formattedString += '*';
	        }
	      }
	      formattedString += item.value;
	    }
	
	    if (item.type === 'operator') {
	      if (i === 0 && (item.value === '+' || item.value === '*')) {
	        _logger2['default'].debug('Structure starting with * or +, ignoring');
	      } else formattedString += item.value;
	    }
	
	    if (item.type === 'variable') {
	      if (i > 0) {
	        if (parsedLatex[i - 1].type !== 'operator') {
	          _logger2['default'].debug('Adding * before variable: ' + item.value + ', previous item: ' + parsedLatex[i - 1].type);
	          formattedString += '*';
	        }
	      }
	      formattedString += item.value;
	    }
	
	    if (item.type === 'group') {
	      formattedString += formatter(item.value);
	    }
	
	    if (item.type === 'token') {
	      _logger2['default'].debug('Handling token: ' + item.value);
	
	      if (greekLetters.getSymbol(item.value) !== null) {
	        var letter = greekLetters.getSymbol(item.value);
	        _logger2['default'].debug('greek letter ' + letter);
	        formattedString += letter;
	      }
	
	      if (item.value === 'frac') {
	        if (parsedLatex[i + 1].type === 'group' && parsedLatex[i + 2].type === 'group') {
	          _logger2['default'].debug('Found fraction');
	          formattedString += formatter(parsedLatex[i + 1].value) + '/' + formatter(parsedLatex[i + 2].value);
	          i += 2;
	        } else {
	          return new Error('Fraction must have 2 following parameters');
	        }
	      }
	
	      if (item.value === 'cdot' || item.value === 'times' || item.value === 'ast') {
	        formattedString += '*';
	      }
	
	      if (item.value === 'div') {
	        formattedString += '/';
	      }
	    }
	
	    if (item.type === 'function') {
	      formattedString += item.value;
	
	      var nextItem = parsedLatex[i + 1];
	
	      if (item.value === 'sqrt') {
	        if (parsedLatex[i + 1].type === 'group') {
	          _logger2['default'].debug('Found square root');
	          formattedString += formatter(parsedLatex[i + 1].value);
	          i++;
	        } else {
	          return new Error('Square root must be followed by {}');
	        }
	      } else if (nextItem.type === 'number' || nextItem.type === 'variable') {
	        formattedString += '(';
	        formattedString += nextItem.value;
	        formattedString += ')';
	        i++;
	      }
	    }
	  }
	
	  formattedString += ')';
	
	  return formattedString;
	};
	
	exports['default'] = formatter;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.letters = undefined;
	exports.toUpperCase = toUpperCase;
	exports.isUpperCase = isUpperCase;
	exports.getSymbol = getSymbol;
	exports.getName = getName;
	exports.convertSymbols = convertSymbols;
	
	var _logger = __webpack_require__(4);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	var letters = exports.letters = [{
	  name: 'alpha',
	  symbol: 'α'
	}, {
	  name: 'beta',
	  symbol: 'β'
	}, {
	  name: 'gamma',
	  symbol: 'γ'
	}, {
	  name: 'delta',
	  symbol: 'δ'
	}, {
	  name: 'epsilon',
	  symbol: 'ϵ'
	}, {
	  name: 'zeta',
	  symbol: 'ζ'
	}, {
	  name: 'eta',
	  symbol: 'η'
	}, {
	  name: 'theta',
	  symbol: 'θ'
	}, {
	  name: 'iota',
	  symbol: 'ι'
	}, {
	  name: 'kappa',
	  symbol: 'κ'
	}, {
	  name: 'lambda',
	  symbol: 'λ'
	}, {
	  name: 'mu',
	  symbol: 'μ'
	}, {
	  name: 'nu',
	  symbol: 'ν'
	}, {
	  name: 'omicron',
	  symbol: 'ο'
	}, {
	  name: 'pi',
	  symbol: 'π'
	}, {
	  name: 'rho',
	  symbol: 'ρ'
	}, {
	  name: 'sigma',
	  symbol: 'σ'
	}, {
	  name: 'tau',
	  symbol: 'τ'
	}, {
	  name: 'upsilon',
	  symbol: 'υ'
	}, {
	  name: 'phi',
	  symbol: 'ϕ'
	}, {
	  name: 'chi',
	  symbol: 'χ'
	}, {
	  name: 'psi',
	  symbol: 'ψ'
	}, {
	  name: 'omega',
	  symbol: 'ω'
	}];
	
	function toUpperCase(x) {
	  return x.charAt(0).toUpperCase() + x.slice(1);
	}
	
	function isUpperCase(x) {
	  return x.charAt(0).toUpperCase() === x.charAt(0);
	}
	
	function getSymbol(name) {
	  var symbol = letters.find(function (x) {
	    return x.name === name.toLowerCase();
	  });
	  if (typeof symbol === 'undefined') return null;
	  symbol = symbol.symbol;
	  if (isUpperCase(name)) symbol = toUpperCase(symbol);
	  return symbol;
	}
	
	function getName(symbol) {
	  var name = letters.find(function (x) {
	    return x.symbol === symbol.toLowerCase();
	  });
	  if (typeof name === 'undefined') return null;
	  name = name.name;
	  if (isUpperCase(symbol)) name = toUpperCase(name);
	  return name;
	}
	
	function convertSymbols(math) {
	  _logger2['default'].debug('Converting math symbols ' + math);
	  letters.forEach(function (letter) {
	    math = math.split(letter.symbol).join(letter.name);
	    math = math.split(toUpperCase(letter.symbol)).join(toUpperCase(letter.name));
	  });
	  _logger2['default'].debug('- Converted math symbols ' + math);
	  return math;
	}

/***/ })
/******/ ]);
//# sourceMappingURL=latex_combine.js.map