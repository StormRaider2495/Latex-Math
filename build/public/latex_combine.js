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

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	window.jQuery = __webpack_require__(2);
	__webpack_require__(3);
	module.exports = window.MathQuill;
	
	var AlgebraLatex = __webpack_require__(4);
	// const MathQuill = require('exports-loader?window.MathQuill!imports-loader?window.jQuery=jquery!mathquill/build/mathquill.js');
	
	var mathField;
	var mathFieldSpan = document.getElementById('math-field');
	var latexSpan = document.getElementById('latex');
	var exprSpan = document.getElementById('expr');
	var ansSpan = document.getElementById('ans');
	var latexInput = undefined;
	var algebraObj = undefined;
	var mathOutput = undefined;
	var MQ = MathQuill.getInterface(2); // for backcompat
	var evaluateLatex = undefined;
	
	// configurable object
	var config = {
	    spaceBehavesLikeTab: true,
	    restrictMismatchedBrackets: true,
	    supSubsRequireOperand: true,
	    // autoCommands: 'pi pm sqrt nthroot prod div ast star frac',
	    // autoCommands: 'pi theta pm sqrt nthroot sum prod coprod',
	    autoCommands: 'pi pm sqrt nthroot div ast star frac',
	    autoOperatorNames: 'ln log sin cos tan asin acos atan invsin invcos invtan',
	    handlers: {
	        edit: function edit() {
	            // useful event handlers
	            var enteredMath = mathField.latex(); // Get entered math in LaTeX format
	            latexSpan.textContent = enteredMath; // simple API
	            latexInput = mathField.latex(); //storing latex format expression
	            algebraObj = new AlgebraLatex(latexInput); //initializing AlgebraLatex
	            mathOutput = algebraObj.toMath(); //storing math format expression
	            exprSpan.innerHTML = mathOutput;
	        },
	        enter: function enter() {
	            evaluateLatex();
	        }
	    }
	};
	mathField = MQ.MathField(mathFieldSpan, config);
	
	evaluateLatex = function () {
	    try {
	        var tree = undefined,
	            evl = undefined;
	        // tree = MathExpression.fromLatex(latexInput);
	        // evl = tree.evaluate();
	        evl = latexeval(latexInput);
	        // console.log(tree);
	        console.log(evl);
	        ansSpan.innerHTML = evl;
	    } catch (error) {
	        console.warn(error);
	        ansSpan.innerHTML = "Incorrect Input";
	    }
	};
	
	$("#eval").off("click").on("click", evaluateLatex);
	
	$("#cmdInputButton").off("click").on("click", function () {
	    var text = $("#latexInput1").val();
	    // mathField.latex(text); // Renders the given LaTeX in the MathQuill field
	    // mathField.latex(); // => '2^{\\frac{3}{2}}'
	    // mathField.write(text);
	    mathField.cmd(text);
	
	    //    a(text);
	    // mathField.MathQuill('write', text.replace('%1', latex)).focus();
	});
	
	$("#typeInputButton").off("click").on("click", function () {
	    var text = $("#latexInput2").val();
	    mathField.typedText(text);
	    mathField.focus();
	});
	
	$("#writeInputButton").off("click").on("click", function () {
	    var text = $("#latexInput3").val();
	    mathField.write(text);
	});
	
	$("#KeyInputButton").off("click").on("click", function () {
	    var text = $("#latexInput4").val();
	    mathField.keystroke(text);
	});
	
	$("#clearAll").off("click").on("click", function () {
	    // mathField.latex('');
	    mathField.select();
	    mathField.clearSelection();
	});
	
	$("#LatexInputButton").off("click").on("click", function () {
	    var text = $("#latexInput5").val();
	    mathField.latex(text);
	});
	
	/**
	 * Converts the given Latex expression to a Javascript expression.
	 * 
	 * expression : Expression to be interpreted.
	 **/
	function latexeval(expression, parseOnly) {
	    // Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
	    // and tries to evaluate it to a number.
	    expression = '' + expression;
	
	    var randomName = 'r' + Math.ceil(Math.random() * 10000000);
	    //Math[randomName] = place;
	    // Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
	    var latexrep = [[/((?:[\-+]?[0-9]+)|(?:\\left\([^\(\)]+\\right\)))!/ig, 'factorial($1)'], [/\\sqrt{([^{}]+)}/ig, 'sqrt($1)'], [/\\frac{([^{}]+)}{([^{}]+)}/ig, '(($1)/($2))'], [/\\left\|([^\|]*)\\right\|/g, 'abs($1)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\^((?:[\-+]?[0-9\.]+)|(?:{[^{}]+}))/ig, 'pow($1, $2)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2070/ig, 'pow($1, 0)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B9/ig, 'pow($1, 1)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B2/ig, 'pow($1, 2)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B3/ig, 'pow($1, 3)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2074/ig, 'pow($1, 4)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2075/ig, 'pow($1, 5)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2076/ig, 'pow($1, 6)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2077/ig, 'pow($1, 7)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2078/ig, 'pow($1, 8)'], [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2079/ig, 'pow($1, 9)']];
	
	    // Some LaTeX-markings need to be replaced only once.
	    var reponce = [[/\\sin\^{-1}|\\arcsin|\\asin/ig, 'asin'], // Replace arcsin
	    [/\\cos\^{-1}|\\arccos|\\acos/ig, 'acos'], // Replace arccos
	    [/\\tan\^{-1}|\\arctan|\\atan/ig, 'atan'], // Replace arctan
	    //[/(?:\\inp|inp|\\text{inp})\\left\(([0-9]+)\\right\)/ig, 'inp($1, ' + randomName + ')'],			// Replace ans
	    [/(?:\\ans|ans|\\text{ans})\\left\(([0-9]+)\\right\)/ig, 'ans($1, ' + randomName + ')'], // Replace ans
	    [/\\sin/ig, 'sin'], // Replace sin
	    [/\\cos/ig, 'cos'], // Replace cos
	    [/\\tan/ig, 'tan'], // Replace tan      
	    [/log/ig, 'logTen'], // Replace log
	    [/ln/ig, 'log'], // Replace ln
	    [/\\pi/ig, 'PI'], // Replace PI
	    [/\\left\(/ig, '('], // Replace left parenthesis )
	    [/\\right\)/ig, ')'], // Replace right parenthesis
	    [/(sin|cos|tan)\(([^\^\)]+)\^{\\circ}/ig, '$1($2*PI/180'], // Replace degrees with radians inside sin, cos and tan
	    [/{/ig, '('], // Replace left bracket
	    [/}/ig, ')'], // Replace right bracket
	    [/\)\(/ig, ')*('], // Add times between ending and starting parenthesis )
	    [/\\cdot/ig, '*'], // Replace cdot with times
	    [/\\exp1/ig, 'exp(1)']];
	    // Replace Neper's number
	    //[/([0-9]+)PI/ig, '$1*PI']
	    var oldexpr = '';
	
	    /*
	     * Commas should be replaced from the original input before
	     * any of the power functions (or other functions containing
	     * commas as separators) are replaced.
	     */
	    expression = expression.replace(/,/ig, '.');
	    expression = expression.replace(/\\mathrm{e}|\\e|e^|\\text{e}/ig, '\\exp1'); // replace \text{e} with exp()
	
	    while (oldexpr !== expression) {
	        // Replace strings as long as the expression keeps changing.
	        oldexpr = expression;
	        for (var i = 0; i < latexrep.length; i++) {
	            expression = expression.replace(latexrep[i][0], latexrep[i][1]);
	        }
	    }
	    for (var i = 0; i < reponce.length; i++) {
	        expression = expression.replace(reponce[i][0], reponce[i][1]);
	    }
	
	    var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig;
	    var valid = true;
	    expression = expression.replace(reg, function (word) {
	        var demoREMOVE = "hallua";
	        if (Math.hasOwnProperty(word)) {
	
	            return 'Math.' + word;
	        } else if (word.toLowerCase() == 'x' || word.toLowerCase() == 'y' || word.toLowerCase() == 'z' || word.toLowerCase() == 't') return word;else {
	            valid = false;
	            return word;
	        }
	    });
	    if (!valid) {
	        throw 'Invalidexpression1';
	    } else {
	        try {
	            expression = mathjs(expression);
	            if (parseOnly) return expression;
	
	            var s = new Function('return (' + expression + ')')();
	            //delete Math[randomName];
	            console.log("EQUATION : " + expression);
	            return s;
	        } catch (err) {
	            throw 'Invalidexpression2';
	        }
	    }
	}
	
	/**
	 * Adds 10-base logarithm to Math library.
	 */
	Math.logTen = function (x) {
	    return Math.log(x) * Math.LOG10E;
	};
	
	/**
	 * Adds factorial to Math library.
	 * 
	 * Implementation doesn't do memorization or any of the numerical
	 * accuracy improvements.
	 */
	Math.factorial = function (num) {
	    if (typeof num === 'number' && num >= 0) {
	        if (num >= 1000) return Number.POSITIVE_INFINITY; // Javascript's numeric capabilities stop much earlier than this, on the test bench the limit is 170.
	        //if ((n===+n) && (n!==(n|0))) return(undefined); // Not defined for decimals. Would require an implementation of the Gamma function.
	
	        var result = 1;
	        for (var i = 2; i <= num; i++) result *= i;
	        return result;
	    } else return undefined; // Unprocessed cases.
	};
	
	/*
	 * Converts the user input to valid evaluable Javascript.
	 * 
	 * Taken from the ASCII Math Calculator project.
	*/
	
	function mathjs(st) {
	    st = st.replace(/\s/g, "");
	    if (st.indexOf("^-1") != -1) {
	        st = st.replace(/sec\^-1/g, "Math.arcsec");
	        st = st.replace(/csc\^-1/g, "Math.arccsc");
	        st = st.replace(/cot\^-1/g, "Math.arccot");
	        st = st.replace(/sinh\^-1/g, "Math.arcsinh");
	        st = st.replace(/cosh\^-1/g, "Math.arccosh");
	        st = st.replace(/tanh\^-1/g, "Math.arctanh");
	        st = st.replace(/sech\^-1/g, "Math.arcsech");
	        st = st.replace(/csch\^-1/g, "Math.arccsch");
	        st = st.replace(/coth\^-1/g, "Math.arccoth");
	    }
	    st = st.replace(/pi/g, "Math.PI");
	    //st = st.replace(/([^a-zA-Z])e([^a-zA-Z])/g,"$1(Math.E)$2");
	    st = st.replace(/([0-9])([\(a-zA-Z])/g, "$1*$2");
	    st = st.replace(/\)([\(0-9a-zA-Z])/g, "\)*$1");
	
	    var i, j, k, ch, nested;
	    while ((i = st.indexOf("^")) != -1) {
	        //find left argument
	        if (i == 0) return "Error: missing argument";
	        j = i - 1;
	        ch = st.charAt(j);
	        if (ch >= "0" && ch <= "9") {
	            // look for (decimal) number
	            j--;
	            while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
	            if (ch == ".") {
	                j--;
	                while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
	            }
	        } else if (ch == ")") {
	            // look for matching opening bracket and function name
	            nested = 1;
	            j--;
	            while (j >= 0 && nested > 0) {
	                ch = st.charAt(j);
	                if (ch == "(") nested--;else if (ch == ")") nested++;
	                j--;
	            }
	            while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
	        } else if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") {
	            // look for variable
	            j--;
	            while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
	        } else {
	            return "Error: incorrect syntax in " + st + " at position " + j;
	        }
	        //find right argument
	        if (i == st.length - 1) return "Error: missing argument";
	        k = i + 1;
	        ch = st.charAt(k);
	        if (ch >= "0" && ch <= "9" || ch == "-") {
	            // look for signed (decimal) number
	            k++;
	            while (k < st.length && (ch = st.charAt(k)) >= "0" && ch <= "9") k++;
	            if (ch == ".") {
	                k++;
	                while (k < st.length && (ch = st.charAt(k)) >= "0" && ch <= "9") k++;
	            }
	        } else if (ch == "(") {
	            // look for matching closing bracket and function name
	            nested = 1;
	            k++;
	            while (k < st.length && nested > 0) {
	                ch = st.charAt(k);
	                if (ch == "(") nested++;else if (ch == ")") nested--;
	                k++;
	            }
	        } else if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") {
	            // look for variable
	            k++;
	            while (k < st.length && (ch = st.charAt(k)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") k++;
	        } else {
	            return "Error: incorrect syntax in " + st + " at position " + k;
	        }
	        st = st.slice(0, j + 1) + "Math.pow(" + st.slice(j + 1, i) + "," + st.slice(i + 1, k) + ")" + st.slice(k);
	    }
	    while ((i = st.indexOf("!")) != -1) {
	        //find left argument
	        if (i == 0) return "Error: missing argument";
	        j = i - 1;
	        ch = st.charAt(j);
	        if (ch >= "0" && ch <= "9") {
	            // look for (decimal) number
	            j--;
	            while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
	            if (ch == ".") {
	                j--;
	                while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
	            }
	        } else if (ch == ")") {
	            // look for matching opening bracket and function name
	            nested = 1;
	            j--;
	            while (j >= 0 && nested > 0) {
	                ch = st.charAt(j);
	                if (ch == "(") nested--;else if (ch == ")") nested++;
	                j--;
	            }
	            while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
	        } else if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") {
	            // look for variable
	            j--;
	            while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
	        } else {
	            return "Error: incorrect syntax in " + st + " at position " + j;
	        }
	        st = st.slice(0, j + 1) + "Math.factorial(" + st.slice(j + 1, i) + ")" + st.slice(i + 1);
	    }
	    return st;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v3.3.1
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright JS Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2018-01-20T17:24Z
	 */"use strict";(function(global,factory){"use strict";if(typeof module === "object" && typeof module.exports === "object"){ // For CommonJS and CommonJS-like environments where a proper `window`
	// is present, execute the factory and get jQuery.
	// For environments that do not have a `window` with a `document`
	// (such as Node.js), expose a factory as module.exports.
	// This accentuates the need for the creation of a real `window`.
	// e.g. var jQuery = require("jquery")(window);
	// See ticket #14549 for more info.
	module.exports = global.document?factory(global,true):function(w){if(!w.document){throw new Error("jQuery requires a window with a document");}return factory(w);};}else {factory(global);} // Pass this if window is not defined yet
	})(typeof window !== "undefined"?window:undefined,function(window,noGlobal){ // Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";var arr=[];var document=window.document;var getProto=Object.getPrototypeOf;var _slice=arr.slice;var concat=arr.concat;var push=arr.push;var indexOf=arr.indexOf;var class2type={};var toString=class2type.toString;var hasOwn=class2type.hasOwnProperty;var fnToString=hasOwn.toString;var ObjectFunctionString=fnToString.call(Object);var support={};var isFunction=function isFunction(obj){ // Support: Chrome <=57, Firefox <=52
	// In some browsers, typeof returns "function" for HTML <object> elements
	// (i.e., `typeof document.createElement( "object" ) === "function"`).
	// We don't want to classify *any* DOM node as a function.
	return typeof obj === "function" && typeof obj.nodeType !== "number";};var isWindow=function isWindow(obj){return obj != null && obj === obj.window;};var preservedScriptAttributes={type:true,src:true,noModule:true};function DOMEval(code,doc,node){doc = doc || document;var i,script=doc.createElement("script");script.text = code;if(node){for(i in preservedScriptAttributes) {if(node[i]){script[i] = node[i];}}}doc.head.appendChild(script).parentNode.removeChild(script);}function toType(obj){if(obj == null){return obj + "";} // Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function"?class2type[toString.call(obj)] || "object":typeof obj;} /* global Symbol */ // Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module
	var version="3.3.1", // Define a local copy of jQuery
	jQuery=function jQuery(selector,context){ // The jQuery object is actually just the init constructor 'enhanced'
	// Need init if jQuery is called (just allow error to be thrown if not included)
	return new jQuery.fn.init(selector,context);}, // Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;jQuery.fn = jQuery.prototype = { // The current version of jQuery being used
	jquery:version,constructor:jQuery, // The default length of a jQuery object is 0
	length:0,toArray:function toArray(){return _slice.call(this);}, // Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get:function get(num){ // Return all the elements in a clean array
	if(num == null){return _slice.call(this);} // Return just the one element from the set
	return num < 0?this[num + this.length]:this[num];}, // Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack:function pushStack(elems){ // Build a new jQuery matched element set
	var ret=jQuery.merge(this.constructor(),elems); // Add the old object onto the stack (as a reference)
	ret.prevObject = this; // Return the newly-formed element set
	return ret;}, // Execute a callback for every element in the matched set.
	each:function each(callback){return jQuery.each(this,callback);},map:function map(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},slice:function slice(){return this.pushStack(_slice.apply(this,arguments));},first:function first(){return this.eq(0);},last:function last(){return this.eq(-1);},eq:function eq(i){var len=this.length,j=+i + (i < 0?len:0);return this.pushStack(j >= 0 && j < len?[this[j]]:[]);},end:function end(){return this.prevObject || this.constructor();}, // For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push:push,sort:arr.sort,splice:arr.splice};jQuery.extend = jQuery.fn.extend = function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0] || {},i=1,length=arguments.length,deep=false; // Handle a deep copy situation
	if(typeof target === "boolean"){deep = target; // Skip the boolean and the target
	target = arguments[i] || {};i++;} // Handle case when target is a string or something (possible in deep copy)
	if(typeof target !== "object" && !isFunction(target)){target = {};} // Extend jQuery itself if only one argument is passed
	if(i === length){target = this;i--;}for(;i < length;i++) { // Only deal with non-null/undefined values
	if((options = arguments[i]) != null){ // Extend the base object
	for(name in options) {src = target[name];copy = options[name]; // Prevent never-ending loop
	if(target === copy){continue;} // Recurse if we're merging plain objects or arrays
	if(deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))){if(copyIsArray){copyIsArray = false;clone = src && Array.isArray(src)?src:[];}else {clone = src && jQuery.isPlainObject(src)?src:{};} // Never move original objects, clone them
	target[name] = jQuery.extend(deep,clone,copy); // Don't bring in undefined values
	}else if(copy !== undefined){target[name] = copy;}}}} // Return the modified object
	return target;};jQuery.extend({ // Unique for each copy of jQuery on the page
	expando:"jQuery" + (version + Math.random()).replace(/\D/g,""), // Assume jQuery is ready without the ready module
	isReady:true,error:function error(msg){throw new Error(msg);},noop:function noop(){},isPlainObject:function isPlainObject(obj){var proto,Ctor; // Detect obvious negatives
	// Use toString instead of jQuery.type to catch host objects
	if(!obj || toString.call(obj) !== "[object Object]"){return false;}proto = getProto(obj); // Objects with no prototype (e.g., `Object.create( null )`) are plain
	if(!proto){return true;} // Objects with prototype are plain iff they were constructed by a global Object function
	Ctor = hasOwn.call(proto,"constructor") && proto.constructor;return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;},isEmptyObject:function isEmptyObject(obj){ /* eslint-disable no-unused-vars */ // See https://github.com/eslint/eslint/issues/6125
	var name;for(name in obj) {return false;}return true;}, // Evaluates a script in a global context
	globalEval:function globalEval(code){DOMEval(code);},each:function each(obj,callback){var length,i=0;if(isArrayLike(obj)){length = obj.length;for(;i < length;i++) {if(callback.call(obj[i],i,obj[i]) === false){break;}}}else {for(i in obj) {if(callback.call(obj[i],i,obj[i]) === false){break;}}}return obj;}, // Support: Android <=4.0 only
	trim:function trim(text){return text == null?"":(text + "").replace(rtrim,"");}, // results is for internal usage only
	makeArray:function makeArray(arr,results){var ret=results || [];if(arr != null){if(isArrayLike(Object(arr))){jQuery.merge(ret,typeof arr === "string"?[arr]:arr);}else {push.call(ret,arr);}}return ret;},inArray:function inArray(elem,arr,i){return arr == null?-1:indexOf.call(arr,elem,i);}, // Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge:function merge(first,second){var len=+second.length,j=0,i=first.length;for(;j < len;j++) {first[i++] = second[j];}first.length = i;return first;},grep:function grep(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert; // Go through the array, only saving the items
	// that pass the validator function
	for(;i < length;i++) {callbackInverse = !callback(elems[i],i);if(callbackInverse !== callbackExpect){matches.push(elems[i]);}}return matches;}, // arg is for internal usage only
	map:function map(elems,callback,arg){var length,value,i=0,ret=[]; // Go through the array, translating each of the items to their new values
	if(isArrayLike(elems)){length = elems.length;for(;i < length;i++) {value = callback(elems[i],i,arg);if(value != null){ret.push(value);}} // Go through every key on the object,
	}else {for(i in elems) {value = callback(elems[i],i,arg);if(value != null){ret.push(value);}}} // Flatten any nested arrays
	return concat.apply([],ret);}, // A global GUID counter for objects
	guid:1, // jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support:support});if(typeof Symbol === "function"){jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];} // Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(i,name){class2type["[object " + name + "]"] = name.toLowerCase();});function isArrayLike(obj){ // Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length=!!obj && "length" in obj && obj.length,type=toType(obj);if(isFunction(obj) || isWindow(obj)){return false;}return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;}var Sizzle= /*!
	 * Sizzle CSS Selector Engine v2.3.3
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-08-08
	 */(function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate, // Local document vars
	setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains, // Instance-specific data
	expando="sizzle" + 1 * new Date(),preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),sortOrder=function sortOrder(a,b){if(a === b){hasDuplicate = true;}return 0;}, // Instance methods
	hasOwn=({}).hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice, // Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf=function indexOf(list,elem){var i=0,len=list.length;for(;i < len;i++) {if(list[i] === elem){return i;}}return -1;},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", // Regular expressions
	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace="[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier="(?:\\\\.|[\\w-]|[^\0-\\xa0])+", // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes="\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +  // Operator (capture 2)
	"*([*^$|!~]?=)" + whitespace +  // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
	"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",pseudos=":(" + identifier + ")(?:\\((" +  // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
	// 1. quoted (capture 3; capture 4 or capture 5)
	"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +  // 2. simple (capture 6)
	"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +  // 3. anything else (capture 2)
	".*" + ")\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace=new RegExp(whitespace + "+","g"),rtrim=new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$","g"),rcomma=new RegExp("^" + whitespace + "*," + whitespace + "*"),rcombinators=new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),rattributeQuotes=new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^" + identifier + "$"),matchExpr={"ID":new RegExp("^#(" + identifier + ")"),"CLASS":new RegExp("^\\.(" + identifier + ")"),"TAG":new RegExp("^(" + identifier + "|[*])"),"ATTR":new RegExp("^" + attributes),"PSEUDO":new RegExp("^" + pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)","i"),"bool":new RegExp("^(?:" + booleans + ")$","i"), // For use in libraries implementing .is()
	// We use this for POS matching in `select`
	"needsContext":new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/, // CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape=new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)","ig"),funescape=function funescape(_,escaped,escapedWhitespace){var high="0x" + escaped - 0x10000; // NaN means non-codepoint
	// Support: Firefox<24
	// Workaround erroneous numeric interpretation of +"0x"
	return high !== high || escapedWhitespace?escaped:high < 0? // BMP codepoint
	String.fromCharCode(high + 0x10000): // Supplemental Plane codepoint (surrogate pair)
	String.fromCharCode(high >> 10 | 0xD800,high & 0x3FF | 0xDC00);}, // CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,fcssescape=function fcssescape(ch,asCodePoint){if(asCodePoint){ // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
	if(ch === "\0"){return "�";} // Control characters and (dependent upon position) numbers get escaped as code points
	return ch.slice(0,-1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";} // Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;}, // Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler=function unloadHandler(){setDocument();},disabledAncestor=addCombinator(function(elem){return elem.disabled === true && ("form" in elem || "label" in elem);},{dir:"parentNode",next:"legend"}); // Optimize for push.apply( _, NodeList )
	try{push.apply(arr = slice.call(preferredDoc.childNodes),preferredDoc.childNodes); // Support: Android<4.0
	// Detect silently failing push.apply
	arr[preferredDoc.childNodes.length].nodeType;}catch(e) {push = {apply:arr.length? // Leverage slice if possible
	function(target,els){push_native.apply(target,slice.call(els));}: // Support: IE<9
	function(target,els){var j=target.length,i=0; // Can't trust NodeList.length
	while(target[j++] = els[i++]) {}target.length = j - 1;}};}function Sizzle(selector,context,results,seed){var m,i,elem,nid,match,groups,newSelector,newContext=context && context.ownerDocument, // nodeType defaults to 9, since context defaults to document
	nodeType=context?context.nodeType:9;results = results || []; // Return early from calls with invalid selector or context
	if(typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11){return results;} // Try to shortcut find operations (as opposed to filters) in HTML documents
	if(!seed){if((context?context.ownerDocument || context:preferredDoc) !== document){setDocument(context);}context = context || document;if(documentIsHTML){ // If the selector is sufficiently simple, try using a "get*By*" DOM method
	// (excepting DocumentFragment context, where the methods don't exist)
	if(nodeType !== 11 && (match = rquickExpr.exec(selector))){ // ID selector
	if(m = match[1]){ // Document context
	if(nodeType === 9){if(elem = context.getElementById(m)){ // Support: IE, Opera, Webkit
	// TODO: identify versions
	// getElementById can match elements by name instead of ID
	if(elem.id === m){results.push(elem);return results;}}else {return results;} // Element context
	}else { // Support: IE, Opera, Webkit
	// TODO: identify versions
	// getElementById can match elements by name instead of ID
	if(newContext && (elem = newContext.getElementById(m)) && contains(context,elem) && elem.id === m){results.push(elem);return results;}} // Type selector
	}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results; // Class selector
	}else if((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results;}} // Take advantage of querySelectorAll
	if(support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))){if(nodeType !== 1){newContext = context;newSelector = selector; // qSA looks outside Element context, which is not what we want
	// Thanks to Andrew Dupont for this workaround technique
	// Support: IE <=8
	// Exclude object elements
	}else if(context.nodeName.toLowerCase() !== "object"){ // Capture the context ID, setting it first if necessary
	if(nid = context.getAttribute("id")){nid = nid.replace(rcssescape,fcssescape);}else {context.setAttribute("id",nid = expando);} // Prefix every selector in the list
	groups = tokenize(selector);i = groups.length;while(i--) {groups[i] = "#" + nid + " " + toSelector(groups[i]);}newSelector = groups.join(","); // Expand context for sibling selectors
	newContext = rsibling.test(selector) && testContext(context.parentNode) || context;}if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results;}catch(qsaError) {}finally {if(nid === expando){context.removeAttribute("id");}}}}}} // All others
	return select(selector.replace(rtrim,"$1"),context,results,seed);} /**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */function createCache(){var keys=[];function cache(key,value){ // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
	if(keys.push(key + " ") > Expr.cacheLength){ // Only keep the most recent entries
	delete cache[keys.shift()];}return cache[key + " "] = value;}return cache;} /**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */function markFunction(fn){fn[expando] = true;return fn;} /**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */function assert(fn){var el=document.createElement("fieldset");try{return !!fn(el);}catch(e) {return false;}finally { // Remove from its parent by default
	if(el.parentNode){el.parentNode.removeChild(el);} // release memory in IE
	el = null;}} /**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */function addHandle(attrs,handler){var arr=attrs.split("|"),i=arr.length;while(i--) {Expr.attrHandle[arr[i]] = handler;}} /**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */function siblingCheck(a,b){var cur=b && a,diff=cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex; // Use IE sourceIndex if available on both nodes
	if(diff){return diff;} // Check if b follows a
	if(cur){while(cur = cur.nextSibling) {if(cur === b){return -1;}}}return a?1:-1;} /**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name === "input" && elem.type === type;};} /**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return (name === "input" || name === "button") && elem.type === type;};} /**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */function createDisabledPseudo(disabled){ // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function(elem){ // Only certain elements can match :enabled or :disabled
	// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
	// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
	if("form" in elem){ // Check for inherited disabledness on relevant non-disabled elements:
	// * listed form-associated elements in a disabled fieldset
	//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
	//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
	// * option elements in a disabled optgroup
	//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
	// All such elements have a "form" property.
	if(elem.parentNode && elem.disabled === false){ // Option elements defer to a parent optgroup if present
	if("label" in elem){if("label" in elem.parentNode){return elem.parentNode.disabled === disabled;}else {return elem.disabled === disabled;}} // Support: IE 6 - 11
	// Use the isDisabled shortcut property to check for disabled fieldset ancestors
	return elem.isDisabled === disabled ||  // Where there is no isDisabled, check manually
	/* jshint -W018 */elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;}return elem.disabled === disabled; // Try to winnow out elements that can't be disabled before trusting the disabled property.
	// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
	// even exist on them, let alone have a boolean value.
	}else if("label" in elem){return elem.disabled === disabled;} // Remaining elements are neither :enabled nor :disabled
	return false;};} /**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */function createPositionalPseudo(fn){return markFunction(function(argument){argument = +argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length; // Match elements found at the specified indexes
	while(i--) {if(seed[j = matchIndexes[i]]){seed[j] = !(matches[j] = seed[j]);}}});});} /**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */function testContext(context){return context && typeof context.getElementsByTagName !== "undefined" && context;} // Expose support vars for convenience
	support = Sizzle.support = {}; /**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */isXML = Sizzle.isXML = function(elem){ // documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement=elem && (elem.ownerDocument || elem).documentElement;return documentElement?documentElement.nodeName !== "HTML":false;}; /**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */setDocument = Sizzle.setDocument = function(node){var hasCompare,subWindow,doc=node?node.ownerDocument || node:preferredDoc; // Return early if doc is invalid or already selected
	if(doc === document || doc.nodeType !== 9 || !doc.documentElement){return document;} // Update global variables
	document = doc;docElem = document.documentElement;documentIsHTML = !isXML(document); // Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if(preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow){ // Support: IE 11, Edge
	if(subWindow.addEventListener){subWindow.addEventListener("unload",unloadHandler,false); // Support: IE 9 - 10 only
	}else if(subWindow.attachEvent){subWindow.attachEvent("onunload",unloadHandler);}} /* Attributes
		---------------------------------------------------------------------- */ // Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function(el){el.className = "i";return !el.getAttribute("className");}); /* getElement(s)By*
		---------------------------------------------------------------------- */ // Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function(el){el.appendChild(document.createComment(""));return !el.getElementsByTagName("*").length;}); // Support: IE<9
	support.getElementsByClassName = rnative.test(document.getElementsByClassName); // Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function(el){docElem.appendChild(el).id = expando;return !document.getElementsByName || !document.getElementsByName(expando).length;}); // ID filter and find
	if(support.getById){Expr.filter["ID"] = function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id") === attrId;};};Expr.find["ID"] = function(id,context){if(typeof context.getElementById !== "undefined" && documentIsHTML){var elem=context.getElementById(id);return elem?[elem]:[];}};}else {Expr.filter["ID"] = function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");return node && node.value === attrId;};}; // Support: IE 6 - 7 only
	// getElementById is not reliable as a find shortcut
	Expr.find["ID"] = function(id,context){if(typeof context.getElementById !== "undefined" && documentIsHTML){var node,i,elems,elem=context.getElementById(id);if(elem){ // Verify the id attribute
	node = elem.getAttributeNode("id");if(node && node.value === id){return [elem];} // Fall back on getElementsByName
	elems = context.getElementsByName(id);i = 0;while(elem = elems[i++]) {node = elem.getAttributeNode("id");if(node && node.value === id){return [elem];}}}return [];}};} // Tag
	Expr.find["TAG"] = support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName !== "undefined"){return context.getElementsByTagName(tag); // DocumentFragment nodes don't have gEBTN
	}else if(support.qsa){return context.querySelectorAll(tag);}}:function(tag,context){var elem,tmp=[],i=0, // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
	results=context.getElementsByTagName(tag); // Filter out possible comments
	if(tag === "*"){while(elem = results[i++]) {if(elem.nodeType === 1){tmp.push(elem);}}return tmp;}return results;}; // Class
	Expr.find["CLASS"] = support.getElementsByClassName && function(className,context){if(typeof context.getElementsByClassName !== "undefined" && documentIsHTML){return context.getElementsByClassName(className);}}; /* QSA/matchesSelector
		---------------------------------------------------------------------- */ // QSA and matchesSelector support
	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = []; // qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];if(support.qsa = rnative.test(document.querySelectorAll)){ // Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert(function(el){ // Select is set to empty string on purpose
	// This is to test IE's treatment of not explicitly
	// setting a boolean content attribute,
	// since its presence should be enough
	// https://bugs.jquery.com/ticket/12359
	docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>"; // Support: IE8, Opera 11-12.16
	// Nothing should be selected when empty strings follow ^= or $= or *=
	// The test attribute must be unknown in Opera but "safe" for WinRT
	// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
	if(el.querySelectorAll("[msallowcapture^='']").length){rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");} // Support: IE8
	// Boolean attributes and "value" are not treated correctly
	if(!el.querySelectorAll("[selected]").length){rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");} // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
	if(!el.querySelectorAll("[id~=" + expando + "-]").length){rbuggyQSA.push("~=");} // Webkit/Opera - :checked should return selected option elements
	// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
	// IE8 throws error here and will not see later tests
	if(!el.querySelectorAll(":checked").length){rbuggyQSA.push(":checked");} // Support: Safari 8+, iOS 8+
	// https://bugs.webkit.org/show_bug.cgi?id=136851
	// In-page `selector#id sibling-combinator selector` fails
	if(!el.querySelectorAll("a#" + expando + "+*").length){rbuggyQSA.push(".#.+[+~]");}});assert(function(el){el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>"; // Support: Windows 8 Native Apps
	// The type and name attributes are restricted during .innerHTML assignment
	var input=document.createElement("input");input.setAttribute("type","hidden");el.appendChild(input).setAttribute("name","D"); // Support: IE8
	// Enforce case-sensitivity of name attribute
	if(el.querySelectorAll("[name=d]").length){rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");} // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
	// IE8 throws error here and will not see later tests
	if(el.querySelectorAll(":enabled").length !== 2){rbuggyQSA.push(":enabled",":disabled");} // Support: IE9-11+
	// IE's :disabled selector does not pick up the children of disabled fieldsets
	docElem.appendChild(el).disabled = true;if(el.querySelectorAll(":disabled").length !== 2){rbuggyQSA.push(":enabled",":disabled");} // Opera 10-11 does not throw on post-comma invalid pseudos
	el.querySelectorAll("*,:x");rbuggyQSA.push(",.*:");});}if(support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)){assert(function(el){ // Check to see if it's possible to do matchesSelector
	// on a disconnected node (IE 9)
	support.disconnectedMatch = matches.call(el,"*"); // This should fail with an exception
	// Gecko does not error, returns false instead
	matches.call(el,"[s!='']:x");rbuggyMatches.push("!=",pseudos);});}rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")); /* Contains
		---------------------------------------------------------------------- */hasCompare = rnative.test(docElem.compareDocumentPosition); // Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType === 9?a.documentElement:a,bup=b && b.parentNode;return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains?adown.contains(bup):a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));}:function(a,b){if(b){while(b = b.parentNode) {if(b === a){return true;}}}return false;}; /* Sorting
		---------------------------------------------------------------------- */ // Document order sorting
	sortOrder = hasCompare?function(a,b){ // Flag for duplicate removal
	if(a === b){hasDuplicate = true;return 0;} // Sort on method existence if only one input has compareDocumentPosition
	var compare=!a.compareDocumentPosition - !b.compareDocumentPosition;if(compare){return compare;} // Calculate position if both inputs belong to the same document
	compare = (a.ownerDocument || a) === (b.ownerDocument || b)?a.compareDocumentPosition(b): // Otherwise we know they are disconnected
	1; // Disconnected nodes
	if(compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare){ // Choose the first element that is related to our preferred document
	if(a === document || a.ownerDocument === preferredDoc && contains(preferredDoc,a)){return -1;}if(b === document || b.ownerDocument === preferredDoc && contains(preferredDoc,b)){return 1;} // Maintain original order
	return sortInput?indexOf(sortInput,a) - indexOf(sortInput,b):0;}return compare & 4?-1:1;}:function(a,b){ // Exit early if the nodes are identical
	if(a === b){hasDuplicate = true;return 0;}var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b]; // Parentless nodes are either documents or disconnected
	if(!aup || !bup){return a === document?-1:b === document?1:aup?-1:bup?1:sortInput?indexOf(sortInput,a) - indexOf(sortInput,b):0; // If the nodes are siblings, we can do a quick check
	}else if(aup === bup){return siblingCheck(a,b);} // Otherwise we need full lists of their ancestors for comparison
	cur = a;while(cur = cur.parentNode) {ap.unshift(cur);}cur = b;while(cur = cur.parentNode) {bp.unshift(cur);} // Walk down the tree looking for a discrepancy
	while(ap[i] === bp[i]) {i++;}return i? // Do a sibling check if the nodes have a common ancestor
	siblingCheck(ap[i],bp[i]): // Otherwise nodes in our document sort first
	ap[i] === preferredDoc?-1:bp[i] === preferredDoc?1:0;};return document;};Sizzle.matches = function(expr,elements){return Sizzle(expr,null,null,elements);};Sizzle.matchesSelector = function(elem,expr){ // Set document vars if needed
	if((elem.ownerDocument || elem) !== document){setDocument(elem);} // Make sure that attribute selectors are quoted
	expr = expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))){try{var ret=matches.call(elem,expr); // IE 9's matchesSelector returns false on disconnected nodes
	if(ret || support.disconnectedMatch ||  // As well, disconnected nodes are said to be in a document
	// fragment in IE 9
	elem.document && elem.document.nodeType !== 11){return ret;}}catch(e) {}}return Sizzle(expr,document,null,[elem]).length > 0;};Sizzle.contains = function(context,elem){ // Set document vars if needed
	if((context.ownerDocument || context) !== document){setDocument(context);}return contains(context,elem);};Sizzle.attr = function(elem,name){ // Set document vars if needed
	if((elem.ownerDocument || elem) !== document){setDocument(elem);}var fn=Expr.attrHandle[name.toLowerCase()], // Don't get fooled by Object.prototype properties (jQuery #13807)
	val=fn && hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val !== undefined?val:support.attributes || !documentIsHTML?elem.getAttribute(name):(val = elem.getAttributeNode(name)) && val.specified?val.value:null;};Sizzle.escape = function(sel){return (sel + "").replace(rcssescape,fcssescape);};Sizzle.error = function(msg){throw new Error("Syntax error, unrecognized expression: " + msg);}; /**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */Sizzle.uniqueSort = function(results){var elem,duplicates=[],j=0,i=0; // Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;sortInput = !support.sortStable && results.slice(0);results.sort(sortOrder);if(hasDuplicate){while(elem = results[i++]) {if(elem === results[i]){j = duplicates.push(i);}}while(j--) {results.splice(duplicates[j],1);}} // Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;return results;}; /**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */getText = Sizzle.getText = function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){ // If no nodeType, this is expected to be an array
	while(node = elem[i++]) { // Do not traverse comment nodes
	ret += getText(node);}}else if(nodeType === 1 || nodeType === 9 || nodeType === 11){ // Use textContent for elements
	// innerText usage removed for consistency of new lines (jQuery #11153)
	if(typeof elem.textContent === "string"){return elem.textContent;}else { // Traverse its children
	for(elem = elem.firstChild;elem;elem = elem.nextSibling) {ret += getText(elem);}}}else if(nodeType === 3 || nodeType === 4){return elem.nodeValue;} // Do not include comment or processing instruction nodes
	return ret;};Expr = Sizzle.selectors = { // Can be adjusted by the user
	cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function ATTR(match){match[1] = match[1].replace(runescape,funescape); // Move the given value to match[3] whether quoted or unquoted
	match[3] = (match[3] || match[4] || match[5] || "").replace(runescape,funescape);if(match[2] === "~="){match[3] = " " + match[3] + " ";}return match.slice(0,4);},"CHILD":function CHILD(match){ /* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/match[1] = match[1].toLowerCase();if(match[1].slice(0,3) === "nth"){ // nth-* requires argument
	if(!match[3]){Sizzle.error(match[0]);} // numeric x and y parameters for Expr.filter.CHILD
	// remember that false/true cast respectively to 0/1
	match[4] = +(match[4]?match[5] + (match[6] || 1):2 * (match[3] === "even" || match[3] === "odd"));match[5] = +(match[7] + match[8] || match[3] === "odd"); // other types prohibit arguments
	}else if(match[3]){Sizzle.error(match[0]);}return match;},"PSEUDO":function PSEUDO(match){var excess,unquoted=!match[6] && match[2];if(matchExpr["CHILD"].test(match[0])){return null;} // Accept quoted arguments as-is
	if(match[3]){match[2] = match[4] || match[5] || ""; // Strip excess characters from unquoted arguments
	}else if(unquoted && rpseudo.test(unquoted) && ( // Get excess from tokenize (recursively)
	excess = tokenize(unquoted,true)) && ( // advance to the next closing parenthesis
	excess = unquoted.indexOf(")",unquoted.length - excess) - unquoted.length)){ // excess is a negative index
	match[0] = match[0].slice(0,excess);match[2] = unquoted.slice(0,excess);} // Return only captures needed by the pseudo filter method (type and argument)
	return match.slice(0,3);}},filter:{"TAG":function TAG(nodeNameSelector){var nodeName=nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector === "*"?function(){return true;}:function(elem){return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;};},"CLASS":function CLASS(className){var pattern=classCache[className + " "];return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className,function(elem){return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");});},"ATTR":function ATTR(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result == null){return operator === "!=";}if(!operator){return true;}result += "";return operator === "="?result === check:operator === "!="?result !== check:operator === "^="?check && result.indexOf(check) === 0:operator === "*="?check && result.indexOf(check) > -1:operator === "$="?check && result.slice(-check.length) === check:operator === "~="?(" " + result.replace(rwhitespace," ") + " ").indexOf(check) > -1:operator === "|="?result === check || result.slice(0,check.length + 1) === check + "-":false;};},"CHILD":function CHILD(type,what,argument,first,last){var simple=type.slice(0,3) !== "nth",forward=type.slice(-4) !== "last",ofType=what === "of-type";return first === 1 && last === 0? // Shortcut for :nth-*(n)
	function(elem){return !!elem.parentNode;}:function(elem,context,xml){var cache,uniqueCache,outerCache,node,nodeIndex,start,dir=simple !== forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType && elem.nodeName.toLowerCase(),useCache=!xml && !ofType,diff=false;if(parent){ // :(first|last|only)-(child|of-type)
	if(simple){while(dir) {node = elem;while(node = node[dir]) {if(ofType?node.nodeName.toLowerCase() === name:node.nodeType === 1){return false;}} // Reverse direction for :only-* (if we haven't yet done so)
	start = dir = type === "only" && !start && "nextSibling";}return true;}start = [forward?parent.firstChild:parent.lastChild]; // non-xml :nth-child(...) stores cache data on `parent`
	if(forward && useCache){ // Seek `elem` from a previously-cached index
	// ...in a gzip-friendly way
	node = parent;outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});cache = uniqueCache[type] || [];nodeIndex = cache[0] === dirruns && cache[1];diff = nodeIndex && cache[2];node = nodeIndex && parent.childNodes[nodeIndex];while(node = ++nodeIndex && node && node[dir] || ( // Fallback to seeking `elem` from the start
	diff = nodeIndex = 0) || start.pop()) { // When found, cache indexes on `parent` and break
	if(node.nodeType === 1 && ++diff && node === elem){uniqueCache[type] = [dirruns,nodeIndex,diff];break;}}}else { // Use previously-cached element index if available
	if(useCache){ // ...in a gzip-friendly way
	node = elem;outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});cache = uniqueCache[type] || [];nodeIndex = cache[0] === dirruns && cache[1];diff = nodeIndex;} // xml :nth-child(...)
	// or :nth-last-child(...) or :nth(-last)?-of-type(...)
	if(diff === false){ // Use the same loop as above to seek `elem` from the start
	while(node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {if((ofType?node.nodeName.toLowerCase() === name:node.nodeType === 1) && ++diff){ // Cache the index of each encountered element
	if(useCache){outerCache = node[expando] || (node[expando] = {}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});uniqueCache[type] = [dirruns,diff];}if(node === elem){break;}}}}} // Incorporate the offset, then check against cycle size
	diff -= last;return diff === first || diff % first === 0 && diff / first >= 0;}};},"PSEUDO":function PSEUDO(pseudo,argument){ // pseudo-class names are case-insensitive
	// http://www.w3.org/TR/selectors/#pseudo-classes
	// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
	// Remember that setFilters inherits from pseudos
	var args,fn=Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo); // The user may use createPseudo to indicate that
	// arguments are needed to create the filter function
	// just as Sizzle does
	if(fn[expando]){return fn(argument);} // But maintain support for old signatures
	if(fn.length > 1){args = [pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--) {idx = indexOf(seed,matched[i]);seed[idx] = !(matches[idx] = matched[i]);}}):function(elem){return fn(elem,0,args);};}return fn;}},pseudos:{ // Potentially complex pseudos
	"not":markFunction(function(selector){ // Trim the selector passed to compile
	// to avoid treating leading and trailing
	// spaces as combinators
	var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length; // Match elements unmatched by `matcher`
	while(i--) {if(elem = unmatched[i]){seed[i] = !(matches[i] = elem);}}}):function(elem,context,xml){input[0] = elem;matcher(input,null,xml,results); // Don't keep the element (issue #299)
	input[0] = null;return !results.pop();};}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length > 0;};}),"contains":markFunction(function(text){text = text.replace(runescape,funescape);return function(elem){return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;};}), // "Whether an element is represented by a :lang() selector
	// is based solely on the element's language value
	// being equal to the identifier C,
	// or beginning with the identifier C immediately followed by "-".
	// The matching of C against the element's language value is performed case-insensitively.
	// The identifier C does not have to be a valid language name."
	// http://www.w3.org/TR/selectors/#lang-pseudo
	"lang":markFunction(function(lang){ // lang value must be a valid identifier
	if(!ridentifier.test(lang || "")){Sizzle.error("unsupported lang: " + lang);}lang = lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do {if(elemLang = documentIsHTML?elem.lang:elem.getAttribute("xml:lang") || elem.getAttribute("lang")){elemLang = elemLang.toLowerCase();return elemLang === lang || elemLang.indexOf(lang + "-") === 0;}}while((elem = elem.parentNode) && elem.nodeType === 1);return false;};}), // Miscellaneous
	"target":function target(elem){var hash=window.location && window.location.hash;return hash && hash.slice(1) === elem.id;},"root":function root(elem){return elem === docElem;},"focus":function focus(elem){return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);}, // Boolean properties
	"enabled":createDisabledPseudo(false),"disabled":createDisabledPseudo(true),"checked":function checked(elem){ // In CSS3, :checked should return both checked and selected elements
	// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
	var nodeName=elem.nodeName.toLowerCase();return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;},"selected":function selected(elem){ // Accessing this property makes selected-by-default
	// options in Safari work properly
	if(elem.parentNode){elem.parentNode.selectedIndex;}return elem.selected === true;}, // Contents
	"empty":function empty(elem){ // http://www.w3.org/TR/selectors/#empty-pseudo
	// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
	//   but not by others (comment: 8; processing instruction: 7; etc.)
	// nodeType < 6 works because attributes (2) do not appear as children
	for(elem = elem.firstChild;elem;elem = elem.nextSibling) {if(elem.nodeType < 6){return false;}}return true;},"parent":function parent(elem){return !Expr.pseudos["empty"](elem);}, // Element/input types
	"header":function header(elem){return rheader.test(elem.nodeName);},"input":function input(elem){return rinputs.test(elem.nodeName);},"button":function button(elem){var name=elem.nodeName.toLowerCase();return name === "input" && elem.type === "button" || name === "button";},"text":function text(elem){var attr;return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ( // Support: IE<8
	// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
	(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");}, // Position-in-collection
	"first":createPositionalPseudo(function(){return [0];}),"last":createPositionalPseudo(function(matchIndexes,length){return [length - 1];}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return [argument < 0?argument + length:argument];}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i < length;i += 2) {matchIndexes.push(i);}return matchIndexes;}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i < length;i += 2) {matchIndexes.push(i);}return matchIndexes;}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument < 0?argument + length:argument;for(;--i >= 0;) {matchIndexes.push(i);}return matchIndexes;}),"gt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument < 0?argument + length:argument;for(;++i < length;) {matchIndexes.push(i);}return matchIndexes;})}};Expr.pseudos["nth"] = Expr.pseudos["eq"]; // Add button/input type pseudos
	for(i in {radio:true,checkbox:true,file:true,password:true,image:true}) {Expr.pseudos[i] = createInputPseudo(i);}for(i in {submit:true,reset:true}) {Expr.pseudos[i] = createButtonPseudo(i);} // Easy API for creating new setFilters
	function setFilters(){}setFilters.prototype = Expr.filters = Expr.pseudos;Expr.setFilters = new setFilters();tokenize = Sizzle.tokenize = function(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector + " "];if(cached){return parseOnly?0:cached.slice(0);}soFar = selector;groups = [];preFilters = Expr.preFilter;while(soFar) { // Comma and first run
	if(!matched || (match = rcomma.exec(soFar))){if(match){ // Don't consume trailing commas as valid
	soFar = soFar.slice(match[0].length) || soFar;}groups.push(tokens = []);}matched = false; // Combinators
	if(match = rcombinators.exec(soFar)){matched = match.shift();tokens.push({value:matched, // Cast descendant combinators to space
	type:match[0].replace(rtrim," ")});soFar = soFar.slice(matched.length);} // Filters
	for(type in Expr.filter) {if((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))){matched = match.shift();tokens.push({value:matched,type:type,matches:match});soFar = soFar.slice(matched.length);}}if(!matched){break;}} // Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly?soFar.length:soFar?Sizzle.error(selector): // Cache the tokens
	tokenCache(selector,groups).slice(0);};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i < len;i++) {selector += tokens[i].value;}return selector;}function addCombinator(matcher,combinator,base){var dir=combinator.dir,skip=combinator.next,key=skip || dir,checkNonElements=base && key === "parentNode",doneName=done++;return combinator.first? // Check against closest ancestor/preceding element
	function(elem,context,xml){while(elem = elem[dir]) {if(elem.nodeType === 1 || checkNonElements){return matcher(elem,context,xml);}}return false;}: // Check against all ancestor/preceding elements
	function(elem,context,xml){var oldCache,uniqueCache,outerCache,newCache=[dirruns,doneName]; // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
	if(xml){while(elem = elem[dir]) {if(elem.nodeType === 1 || checkNonElements){if(matcher(elem,context,xml)){return true;}}}}else {while(elem = elem[dir]) {if(elem.nodeType === 1 || checkNonElements){outerCache = elem[expando] || (elem[expando] = {}); // Support: IE <9 only
	// Defend against cloned attroperties (jQuery gh-1709)
	uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});if(skip && skip === elem.nodeName.toLowerCase()){elem = elem[dir] || elem;}else if((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName){ // Assign to newCache so results back-propagate to previous elements
	return newCache[2] = oldCache[2];}else { // Reuse newcache so results back-propagate to previous elements
	uniqueCache[key] = newCache; // A match means we're done; a fail means we have to keep checking
	if(newCache[2] = matcher(elem,context,xml)){return true;}}}}}return false;};}function elementMatcher(matchers){return matchers.length > 1?function(elem,context,xml){var i=matchers.length;while(i--) {if(!matchers[i](elem,context,xml)){return false;}}return true;}:matchers[0];}function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i < len;i++) {Sizzle(selector,contexts[i],results);}return results;}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map != null;for(;i < len;i++) {if(elem = unmatched[i]){if(!filter || filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i);}}}}return newUnmatched;}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter && !postFilter[expando]){postFilter = setMatcher(postFilter);}if(postFinder && !postFinder[expando]){postFinder = setMatcher(postFinder,postSelector);}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length, // Get initial elements from seed or context
	elems=seed || multipleContexts(selector || "*",context.nodeType?[context]:context,[]), // Prefilter to get matcher input, preserving a map for seed-results synchronization
	matcherIn=preFilter && (seed || !selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
	postFinder || (seed?preFilter:preexisting || postFilter)? // ...intermediate processing is necessary
	[]: // ...otherwise use results directly
	results:matcherIn; // Find primary matches
	if(matcher){matcher(matcherIn,matcherOut,context,xml);} // Apply postFilter
	if(postFilter){temp = condense(matcherOut,postMap);postFilter(temp,[],context,xml); // Un-match failing elements by moving them back to matcherIn
	i = temp.length;while(i--) {if(elem = temp[i]){matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);}}}if(seed){if(postFinder || preFilter){if(postFinder){ // Get the final matcherOut by condensing this intermediate into postFinder contexts
	temp = [];i = matcherOut.length;while(i--) {if(elem = matcherOut[i]){ // Restore matcherIn since elem is not yet a final match
	temp.push(matcherIn[i] = elem);}}postFinder(null,matcherOut = [],temp,xml);} // Move matched elements from seed to results to keep them synchronized
	i = matcherOut.length;while(i--) {if((elem = matcherOut[i]) && (temp = postFinder?indexOf(seed,elem):preMap[i]) > -1){seed[temp] = !(results[temp] = elem);}}} // Add elements to results, through postFinder if defined
	}else {matcherOut = condense(matcherOut === results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml);}else {push.apply(results,matcherOut);}}});}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative || Expr.relative[" "],i=leadingRelative?1:0, // The foundational matcher ensures that elements are reachable from top-level context(s)
	matchContext=addCombinator(function(elem){return elem === checkContext;},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem) > -1;},implicitRelative,true),matchers=[function(elem,context,xml){var ret=!leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml)); // Avoid hanging onto element (issue #299)
	checkContext = null;return ret;}];for(;i < len;i++) {if(matcher = Expr.relative[tokens[i].type]){matchers = [addCombinator(elementMatcher(matchers),matcher)];}else {matcher = Expr.filter[tokens[i].type].apply(null,tokens[i].matches); // Return special upon seeing a positional matcher
	if(matcher[expando]){ // Find the next relative operator (if any) for proper handling
	j = ++i;for(;j < len;j++) {if(Expr.relative[tokens[j].type]){break;}}return setMatcher(i > 1 && elementMatcher(matchers),i > 1 && toSelector( // If the preceding token was a descendant combinator, insert an implicit any-element `*`
	tokens.slice(0,i - 1).concat({value:tokens[i - 2].type === " "?"*":""})).replace(rtrim,"$1"),matcher,i < j && matcherFromTokens(tokens.slice(i,j)),j < len && matcherFromTokens(tokens = tokens.slice(j)),j < len && toSelector(tokens));}matchers.push(matcher);}}return elementMatcher(matchers);}function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length > 0,byElement=elementMatchers.length > 0,superMatcher=function superMatcher(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i="0",unmatched=seed && [],setMatched=[],contextBackup=outermostContext, // We must always have either seed elements or outermost context
	elems=seed || byElement && Expr.find["TAG"]("*",outermost), // Use integer dirruns iff this is the outermost matcher
	dirrunsUnique=dirruns += contextBackup == null?1:Math.random() || 0.1,len=elems.length;if(outermost){outermostContext = context === document || context || outermost;} // Add elements passing elementMatchers directly to results
	// Support: IE<9, Safari
	// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
	for(;i !== len && (elem = elems[i]) != null;i++) {if(byElement && elem){j = 0;if(!context && elem.ownerDocument !== document){setDocument(elem);xml = !documentIsHTML;}while(matcher = elementMatchers[j++]) {if(matcher(elem,context || document,xml)){results.push(elem);break;}}if(outermost){dirruns = dirrunsUnique;}} // Track unmatched elements for set filters
	if(bySet){ // They will have gone through all possible matchers
	if(elem = !matcher && elem){matchedCount--;} // Lengthen the array for every element, matched or not
	if(seed){unmatched.push(elem);}}} // `i` is now the count of elements visited above, and adding it to `matchedCount`
	// makes the latter nonnegative.
	matchedCount += i; // Apply set filters to unmatched elements
	// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
	// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
	// no element matchers and no seed.
	// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
	// case, which will result in a "00" `matchedCount` that differs from `i` but is also
	// numerically zero.
	if(bySet && i !== matchedCount){j = 0;while(matcher = setMatchers[j++]) {matcher(unmatched,setMatched,context,xml);}if(seed){ // Reintegrate element matches to eliminate the need for sorting
	if(matchedCount > 0){while(i--) {if(!(unmatched[i] || setMatched[i])){setMatched[i] = pop.call(results);}}} // Discard index placeholder values to get only actual matches
	setMatched = condense(setMatched);} // Add matches to results
	push.apply(results,setMatched); // Seedless set matches succeeding multiple successful matchers stipulate sorting
	if(outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1){Sizzle.uniqueSort(results);}} // Override manipulation of globals by nested matchers
	if(outermost){dirruns = dirrunsUnique;outermostContext = contextBackup;}return unmatched;};return bySet?markFunction(superMatcher):superMatcher;}compile = Sizzle.compile = function(selector,match /* Internal Use Only */){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector + " "];if(!cached){ // Generate a function of recursive functions that can be used to check each element
	if(!match){match = tokenize(selector);}i = match.length;while(i--) {cached = matcherFromTokens(match[i]);if(cached[expando]){setMatchers.push(cached);}else {elementMatchers.push(cached);}} // Cache the compiled function
	cached = compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers)); // Save selector and tokenization
	cached.selector = selector;}return cached;}; /**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */select = Sizzle.select = function(selector,context,results,seed){var i,tokens,token,type,find,compiled=typeof selector === "function" && selector,match=!seed && tokenize(selector = compiled.selector || selector);results = results || []; // Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if(match.length === 1){ // Reduce context if the leading compound selector is an ID
	tokens = match[0] = match[0].slice(0);if(tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]){context = (Expr.find["ID"](token.matches[0].replace(runescape,funescape),context) || [])[0];if(!context){return results; // Precompiled matchers will still verify ancestry, so step up a level
	}else if(compiled){context = context.parentNode;}selector = selector.slice(tokens.shift().value.length);} // Fetch a seed set for right-to-left matching
	i = matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--) {token = tokens[i]; // Abort if we hit a combinator
	if(Expr.relative[type = token.type]){break;}if(find = Expr.find[type]){ // Search, expanding context for leading sibling combinators
	if(seed = find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)){ // If seed is empty or no tokens remain, we can return early
	tokens.splice(i,1);selector = seed.length && toSelector(tokens);if(!selector){push.apply(results,seed);return results;}break;}}}} // Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	(compiled || compile(selector,match))(seed,context,!documentIsHTML,results,!context || rsibling.test(selector) && testContext(context.parentNode) || context);return results;}; // One-time assignments
	// Sort stability
	support.sortStable = expando.split("").sort(sortOrder).join("") === expando; // Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate; // Initialize against the default document
	setDocument(); // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function(el){ // Should return 1, but returns 4 (following)
	return el.compareDocumentPosition(document.createElement("fieldset")) & 1;}); // Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if(!assert(function(el){el.innerHTML = "<a href='#'></a>";return el.firstChild.getAttribute("href") === "#";})){addHandle("type|href|height|width",function(elem,name,isXML){if(!isXML){return elem.getAttribute(name,name.toLowerCase() === "type"?1:2);}});} // Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if(!support.attributes || !assert(function(el){el.innerHTML = "<input/>";el.firstChild.setAttribute("value","");return el.firstChild.getAttribute("value") === "";})){addHandle("value",function(elem,name,isXML){if(!isXML && elem.nodeName.toLowerCase() === "input"){return elem.defaultValue;}});} // Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if(!assert(function(el){return el.getAttribute("disabled") == null;})){addHandle(booleans,function(elem,name,isXML){var val;if(!isXML){return elem[name] === true?name.toLowerCase():(val = elem.getAttributeNode(name)) && val.specified?val.value:null;}});}return Sizzle;})(window);jQuery.find = Sizzle;jQuery.expr = Sizzle.selectors; // Deprecated
	jQuery.expr[":"] = jQuery.expr.pseudos;jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;jQuery.text = Sizzle.getText;jQuery.isXMLDoc = Sizzle.isXML;jQuery.contains = Sizzle.contains;jQuery.escapeSelector = Sizzle.escape;var dir=function dir(elem,_dir,until){var matched=[],truncate=until !== undefined;while((elem = elem[_dir]) && elem.nodeType !== 9) {if(elem.nodeType === 1){if(truncate && jQuery(elem).is(until)){break;}matched.push(elem);}}return matched;};var _siblings=function _siblings(n,elem){var matched=[];for(;n;n = n.nextSibling) {if(n.nodeType === 1 && n !== elem){matched.push(n);}}return matched;};var rneedsContext=jQuery.expr.match.needsContext;function nodeName(elem,name){return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();};var rsingleTag=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i; // Implement the identical functionality for filter and not
	function winnow(elements,qualifier,not){if(isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){return !!qualifier.call(elem,i,elem) !== not;});} // Single element
	if(qualifier.nodeType){return jQuery.grep(elements,function(elem){return elem === qualifier !== not;});} // Arraylike of elements (jQuery, arguments, Array)
	if(typeof qualifier !== "string"){return jQuery.grep(elements,function(elem){return indexOf.call(qualifier,elem) > -1 !== not;});} // Filtered directly for both simple and complex selectors
	return jQuery.filter(qualifier,elements,not);}jQuery.filter = function(expr,elems,not){var elem=elems[0];if(not){expr = ":not(" + expr + ")";}if(elems.length === 1 && elem.nodeType === 1){return jQuery.find.matchesSelector(elem,expr)?[elem]:[];}return jQuery.find.matches(expr,jQuery.grep(elems,function(elem){return elem.nodeType === 1;}));};jQuery.fn.extend({find:function find(selector){var i,ret,len=this.length,self=this;if(typeof selector !== "string"){return this.pushStack(jQuery(selector).filter(function(){for(i = 0;i < len;i++) {if(jQuery.contains(self[i],this)){return true;}}}));}ret = this.pushStack([]);for(i = 0;i < len;i++) {jQuery.find(selector,self[i],ret);}return len > 1?jQuery.uniqueSort(ret):ret;},filter:function filter(selector){return this.pushStack(winnow(this,selector || [],false));},not:function not(selector){return this.pushStack(winnow(this,selector || [],true));},is:function is(selector){return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
	// so $("p:first").is("p:last") won't return true for a doc with two "p".
	typeof selector === "string" && rneedsContext.test(selector)?jQuery(selector):selector || [],false).length;}}); // Initialize a jQuery object
	// A central reference to the root jQuery(document)
	var rootjQuery, // A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,init=jQuery.fn.init = function(selector,context,root){var match,elem; // HANDLE: $(""), $(null), $(undefined), $(false)
	if(!selector){return this;} // Method init() accepts an alternate rootjQuery
	// so migrate can support jQuery.sub (gh-2101)
	root = root || rootjQuery; // Handle HTML strings
	if(typeof selector === "string"){if(selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3){ // Assume that strings that start and end with <> are HTML and skip the regex check
	match = [null,selector,null];}else {match = rquickExpr.exec(selector);} // Match html or make sure no context is specified for #id
	if(match && (match[1] || !context)){ // HANDLE: $(html) -> $(array)
	if(match[1]){context = context instanceof jQuery?context[0]:context; // Option to run scripts is true for back-compat
	// Intentionally let the error be thrown if parseHTML is not present
	jQuery.merge(this,jQuery.parseHTML(match[1],context && context.nodeType?context.ownerDocument || context:document,true)); // HANDLE: $(html, props)
	if(rsingleTag.test(match[1]) && jQuery.isPlainObject(context)){for(match in context) { // Properties of context are called as methods if possible
	if(isFunction(this[match])){this[match](context[match]); // ...and otherwise set as attributes
	}else {this.attr(match,context[match]);}}}return this; // HANDLE: $(#id)
	}else {elem = document.getElementById(match[2]);if(elem){ // Inject the element directly into the jQuery object
	this[0] = elem;this.length = 1;}return this;} // HANDLE: $(expr, $(...))
	}else if(!context || context.jquery){return (context || root).find(selector); // HANDLE: $(expr, context)
	// (which is just equivalent to: $(context).find(expr)
	}else {return this.constructor(context).find(selector);} // HANDLE: $(DOMElement)
	}else if(selector.nodeType){this[0] = selector;this.length = 1;return this; // HANDLE: $(function)
	// Shortcut for document ready
	}else if(isFunction(selector)){return root.ready !== undefined?root.ready(selector): // Execute immediately if ready is not present
	selector(jQuery);}return jQuery.makeArray(selector,this);}; // Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn; // Initialize central reference
	rootjQuery = jQuery(document);var rparentsprev=/^(?:parents|prev(?:Until|All))/, // Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.fn.extend({has:function has(target){var targets=jQuery(target,this),l=targets.length;return this.filter(function(){var i=0;for(;i < l;i++) {if(jQuery.contains(this,targets[i])){return true;}}});},closest:function closest(selectors,context){var cur,i=0,l=this.length,matched=[],targets=typeof selectors !== "string" && jQuery(selectors); // Positional selectors never match, since there's no _selection_ context
	if(!rneedsContext.test(selectors)){for(;i < l;i++) {for(cur = this[i];cur && cur !== context;cur = cur.parentNode) { // Always skip document fragments
	if(cur.nodeType < 11 && (targets?targets.index(cur) > -1: // Don't pass non-elements to Sizzle
	cur.nodeType === 1 && jQuery.find.matchesSelector(cur,selectors))){matched.push(cur);break;}}}}return this.pushStack(matched.length > 1?jQuery.uniqueSort(matched):matched);}, // Determine the position of an element within the set
	index:function index(elem){ // No argument, return index in parent
	if(!elem){return this[0] && this[0].parentNode?this.first().prevAll().length:-1;} // Index in selector
	if(typeof elem === "string"){return indexOf.call(jQuery(elem),this[0]);} // Locate the position of the desired element
	return indexOf.call(this, // If it receives a jQuery object, the first element is used
	elem.jquery?elem[0]:elem);},add:function add(selector,context){return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(),jQuery(selector,context))));},addBack:function addBack(selector){return this.add(selector == null?this.prevObject:this.prevObject.filter(selector));}});function sibling(cur,dir){while((cur = cur[dir]) && cur.nodeType !== 1) {}return cur;}jQuery.each({parent:function parent(elem){var parent=elem.parentNode;return parent && parent.nodeType !== 11?parent:null;},parents:function parents(elem){return dir(elem,"parentNode");},parentsUntil:function parentsUntil(elem,i,until){return dir(elem,"parentNode",until);},next:function next(elem){return sibling(elem,"nextSibling");},prev:function prev(elem){return sibling(elem,"previousSibling");},nextAll:function nextAll(elem){return dir(elem,"nextSibling");},prevAll:function prevAll(elem){return dir(elem,"previousSibling");},nextUntil:function nextUntil(elem,i,until){return dir(elem,"nextSibling",until);},prevUntil:function prevUntil(elem,i,until){return dir(elem,"previousSibling",until);},siblings:function siblings(elem){return _siblings((elem.parentNode || {}).firstChild,elem);},children:function children(elem){return _siblings(elem.firstChild);},contents:function contents(elem){if(nodeName(elem,"iframe")){return elem.contentDocument;} // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
	// Treat the template element as a regular one in browsers that
	// don't support it.
	if(nodeName(elem,"template")){elem = elem.content || elem;}return jQuery.merge([],elem.childNodes);}},function(name,fn){jQuery.fn[name] = function(until,selector){var matched=jQuery.map(this,fn,until);if(name.slice(-5) !== "Until"){selector = until;}if(selector && typeof selector === "string"){matched = jQuery.filter(selector,matched);}if(this.length > 1){ // Remove duplicates
	if(!guaranteedUnique[name]){jQuery.uniqueSort(matched);} // Reverse order for parents* and prev-derivatives
	if(rparentsprev.test(name)){matched.reverse();}}return this.pushStack(matched);};});var rnothtmlwhite=/[^\x20\t\r\n\f]+/g; // Convert String-formatted options into Object-formatted ones
	function createOptions(options){var object={};jQuery.each(options.match(rnothtmlwhite) || [],function(_,flag){object[flag] = true;});return object;} /*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */jQuery.Callbacks = function(options){ // Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string"?createOptions(options):jQuery.extend({},options);var  // Flag to know if list is currently firing
	firing, // Last fire value for non-forgettable lists
	memory, // Flag to know if list was already fired
	_fired, // Flag to prevent firing
	_locked, // Actual callback list
	list=[], // Queue of execution data for repeatable lists
	queue=[], // Index of currently firing callback (modified by add/remove as needed)
	firingIndex=-1, // Fire callbacks
	fire=function fire(){ // Enforce single-firing
	_locked = _locked || options.once; // Execute callbacks for all pending executions,
	// respecting firingIndex overrides and runtime changes
	_fired = firing = true;for(;queue.length;firingIndex = -1) {memory = queue.shift();while(++firingIndex < list.length) { // Run callback and check for early termination
	if(list[firingIndex].apply(memory[0],memory[1]) === false && options.stopOnFalse){ // Jump to end and forget the data so .add doesn't re-fire
	firingIndex = list.length;memory = false;}}} // Forget the data if we're done with it
	if(!options.memory){memory = false;}firing = false; // Clean up if we're done firing for good
	if(_locked){ // Keep an empty list if we have data for future add calls
	if(memory){list = []; // Otherwise, this object is spent
	}else {list = "";}}}, // Actual Callbacks object
	self={ // Add a callback or a collection of callbacks to the list
	add:function add(){if(list){ // If we have memory from a past run, we should fire after adding
	if(memory && !firing){firingIndex = list.length - 1;queue.push(memory);}(function add(args){jQuery.each(args,function(_,arg){if(isFunction(arg)){if(!options.unique || !self.has(arg)){list.push(arg);}}else if(arg && arg.length && toType(arg) !== "string"){ // Inspect recursively
	add(arg);}});})(arguments);if(memory && !firing){fire();}}return this;}, // Remove a callback from the list
	remove:function remove(){jQuery.each(arguments,function(_,arg){var index;while((index = jQuery.inArray(arg,list,index)) > -1) {list.splice(index,1); // Handle firing indexes
	if(index <= firingIndex){firingIndex--;}}});return this;}, // Check if a given callback is in the list.
	// If no argument is given, return whether or not list has callbacks attached.
	has:function has(fn){return fn?jQuery.inArray(fn,list) > -1:list.length > 0;}, // Remove all callbacks from the list
	empty:function empty(){if(list){list = [];}return this;}, // Disable .fire and .add
	// Abort any current/pending executions
	// Clear all callbacks and values
	disable:function disable(){_locked = queue = [];list = memory = "";return this;},disabled:function disabled(){return !list;}, // Disable .fire
	// Also disable .add unless we have memory (since it would have no effect)
	// Abort any pending executions
	lock:function lock(){_locked = queue = [];if(!memory && !firing){list = memory = "";}return this;},locked:function locked(){return !!_locked;}, // Call all callbacks with the given context and arguments
	fireWith:function fireWith(context,args){if(!_locked){args = args || [];args = [context,args.slice?args.slice():args];queue.push(args);if(!firing){fire();}}return this;}, // Call all the callbacks with the given arguments
	fire:function fire(){self.fireWith(this,arguments);return this;}, // To know if the callbacks have already been called at least once
	fired:function fired(){return !!_fired;}};return self;};function Identity(v){return v;}function Thrower(ex){throw ex;}function adoptValue(value,resolve,reject,noValue){var method;try{ // Check for promise aspect first to privilege synchronous behavior
	if(value && isFunction(method = value.promise)){method.call(value).done(resolve).fail(reject); // Other thenables
	}else if(value && isFunction(method = value.then)){method.call(value,resolve,reject); // Other non-thenables
	}else { // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
	// * false: [ value ].slice( 0 ) => resolve( value )
	// * true: [ value ].slice( 1 ) => resolve()
	resolve.apply(undefined,[value].slice(noValue));} // For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	}catch(value) { // Support: Android 4.0 only
	// Strict mode functions invoked without .call/.apply get global-object context
	reject.apply(undefined,[value]);}}jQuery.extend({Deferred:function Deferred(func){var tuples=[ // action, add listener, callbacks,
	// ... .then handlers, argument index, [final state]
	["notify","progress",jQuery.Callbacks("memory"),jQuery.Callbacks("memory"),2],["resolve","done",jQuery.Callbacks("once memory"),jQuery.Callbacks("once memory"),0,"resolved"],["reject","fail",jQuery.Callbacks("once memory"),jQuery.Callbacks("once memory"),1,"rejected"]],_state="pending",_promise={state:function state(){return _state;},always:function always(){deferred.done(arguments).fail(arguments);return this;},"catch":function _catch(fn){return _promise.then(null,fn);}, // Keep pipe for back-compat
	pipe:function pipe() /* fnDone, fnFail, fnProgress */{var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){ // Map tuples (progress, done, fail) to arguments (done, fail, progress)
	var fn=isFunction(fns[tuple[4]]) && fns[tuple[4]]; // deferred.progress(function() { bind to newDefer or newDefer.notify })
	// deferred.done(function() { bind to newDefer or newDefer.resolve })
	// deferred.fail(function() { bind to newDefer or newDefer.reject })
	deferred[tuple[1]](function(){var returned=fn && fn.apply(this,arguments);if(returned && isFunction(returned.promise)){returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);}else {newDefer[tuple[0] + "With"](this,fn?[returned]:arguments);}});});fns = null;}).promise();},then:function then(onFulfilled,onRejected,onProgress){var maxDepth=0;function resolve(depth,deferred,handler,special){return function(){var that=this,args=arguments,mightThrow=function mightThrow(){var returned,then; // Support: Promises/A+ section 2.3.3.3.3
	// https://promisesaplus.com/#point-59
	// Ignore double-resolution attempts
	if(depth < maxDepth){return;}returned = handler.apply(that,args); // Support: Promises/A+ section 2.3.1
	// https://promisesaplus.com/#point-48
	if(returned === deferred.promise()){throw new TypeError("Thenable self-resolution");} // Support: Promises/A+ sections 2.3.3.1, 3.5
	// https://promisesaplus.com/#point-54
	// https://promisesaplus.com/#point-75
	// Retrieve `then` only once
	then = returned && ( // Support: Promises/A+ section 2.3.4
	// https://promisesaplus.com/#point-64
	// Only check objects and functions for thenability
	typeof returned === "object" || typeof returned === "function") && returned.then; // Handle a returned thenable
	if(isFunction(then)){ // Special processors (notify) just wait for resolution
	if(special){then.call(returned,resolve(maxDepth,deferred,Identity,special),resolve(maxDepth,deferred,Thrower,special)); // Normal processors (resolve) also hook into progress
	}else { // ...and disregard older resolution values
	maxDepth++;then.call(returned,resolve(maxDepth,deferred,Identity,special),resolve(maxDepth,deferred,Thrower,special),resolve(maxDepth,deferred,Identity,deferred.notifyWith));} // Handle all other returned values
	}else { // Only substitute handlers pass on context
	// and multiple values (non-spec behavior)
	if(handler !== Identity){that = undefined;args = [returned];} // Process the value(s)
	// Default process is resolve
	(special || deferred.resolveWith)(that,args);}}, // Only normal processors (resolve) catch and reject exceptions
	process=special?mightThrow:function(){try{mightThrow();}catch(e) {if(jQuery.Deferred.exceptionHook){jQuery.Deferred.exceptionHook(e,process.stackTrace);} // Support: Promises/A+ section 2.3.3.3.4.1
	// https://promisesaplus.com/#point-61
	// Ignore post-resolution exceptions
	if(depth + 1 >= maxDepth){ // Only substitute handlers pass on context
	// and multiple values (non-spec behavior)
	if(handler !== Thrower){that = undefined;args = [e];}deferred.rejectWith(that,args);}}}; // Support: Promises/A+ section 2.3.3.3.1
	// https://promisesaplus.com/#point-57
	// Re-resolve promises immediately to dodge false rejection from
	// subsequent errors
	if(depth){process();}else { // Call an optional hook to record the stack, in case of exception
	// since it's otherwise lost when execution goes async
	if(jQuery.Deferred.getStackHook){process.stackTrace = jQuery.Deferred.getStackHook();}window.setTimeout(process);}};}return jQuery.Deferred(function(newDefer){ // progress_handlers.add( ... )
	tuples[0][3].add(resolve(0,newDefer,isFunction(onProgress)?onProgress:Identity,newDefer.notifyWith)); // fulfilled_handlers.add( ... )
	tuples[1][3].add(resolve(0,newDefer,isFunction(onFulfilled)?onFulfilled:Identity)); // rejected_handlers.add( ... )
	tuples[2][3].add(resolve(0,newDefer,isFunction(onRejected)?onRejected:Thrower));}).promise();}, // Get a promise for this deferred
	// If obj is provided, the promise aspect is added to the object
	promise:function promise(obj){return obj != null?jQuery.extend(obj,_promise):_promise;}},deferred={}; // Add list-specific methods
	jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[5]; // promise.progress = list.add
	// promise.done = list.add
	// promise.fail = list.add
	_promise[tuple[1]] = list.add; // Handle state
	if(stateString){list.add(function(){ // state = "resolved" (i.e., fulfilled)
	// state = "rejected"
	_state = stateString;}, // rejected_callbacks.disable
	// fulfilled_callbacks.disable
	tuples[3 - i][2].disable, // rejected_handlers.disable
	// fulfilled_handlers.disable
	tuples[3 - i][3].disable, // progress_callbacks.lock
	tuples[0][2].lock, // progress_handlers.lock
	tuples[0][3].lock);} // progress_handlers.fire
	// fulfilled_handlers.fire
	// rejected_handlers.fire
	list.add(tuple[3].fire); // deferred.notify = function() { deferred.notifyWith(...) }
	// deferred.resolve = function() { deferred.resolveWith(...) }
	// deferred.reject = function() { deferred.rejectWith(...) }
	deferred[tuple[0]] = function(){deferred[tuple[0] + "With"](this === deferred?undefined:this,arguments);return this;}; // deferred.notifyWith = list.fireWith
	// deferred.resolveWith = list.fireWith
	// deferred.rejectWith = list.fireWith
	deferred[tuple[0] + "With"] = list.fireWith;}); // Make the deferred a promise
	_promise.promise(deferred); // Call given func if any
	if(func){func.call(deferred,deferred);} // All done!
	return deferred;}, // Deferred helper
	when:function when(singleValue){var  // count of uncompleted subordinates
	remaining=arguments.length, // count of unprocessed arguments
	i=remaining, // subordinate fulfillment data
	resolveContexts=Array(i),resolveValues=_slice.call(arguments), // the master Deferred
	master=jQuery.Deferred(), // subordinate callback factory
	updateFunc=function updateFunc(i){return function(value){resolveContexts[i] = this;resolveValues[i] = arguments.length > 1?_slice.call(arguments):value;if(! --remaining){master.resolveWith(resolveContexts,resolveValues);}};}; // Single- and empty arguments are adopted like Promise.resolve
	if(remaining <= 1){adoptValue(singleValue,master.done(updateFunc(i)).resolve,master.reject,!remaining); // Use .then() to unwrap secondary thenables (cf. gh-3000)
	if(master.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)){return master.then();}} // Multiple arguments are aggregated like Promise.all array elements
	while(i--) {adoptValue(resolveValues[i],updateFunc(i),master.reject);}return master.promise();}}); // These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;jQuery.Deferred.exceptionHook = function(error,stack){ // Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if(window.console && window.console.warn && error && rerrorNames.test(error.name)){window.console.warn("jQuery.Deferred exception: " + error.message,error.stack,stack);}};jQuery.readyException = function(error){window.setTimeout(function(){throw error;});}; // The deferred used on DOM ready
	var readyList=jQuery.Deferred();jQuery.fn.ready = function(fn){readyList.then(fn) // Wrap jQuery.readyException in a function so that the lookup
	// happens at the time of error handling instead of callback
	// registration.
	["catch"](function(error){jQuery.readyException(error);});return this;};jQuery.extend({ // Is the DOM ready to be used? Set to true once it occurs.
	isReady:false, // A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait:1, // Handle when the DOM is ready
	ready:function ready(wait){ // Abort if there are pending holds or we're already ready
	if(wait === true?--jQuery.readyWait:jQuery.isReady){return;} // Remember that the DOM is ready
	jQuery.isReady = true; // If a normal DOM Ready event fired, decrement, and wait if need be
	if(wait !== true && --jQuery.readyWait > 0){return;} // If there are functions bound, to execute
	readyList.resolveWith(document,[jQuery]);}});jQuery.ready.then = readyList.then; // The ready event handler and self cleanup method
	function completed(){document.removeEventListener("DOMContentLoaded",completed);window.removeEventListener("load",completed);jQuery.ready();} // Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if(document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll){ // Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout(jQuery.ready);}else { // Use the handy event callback
	document.addEventListener("DOMContentLoaded",completed); // A fallback to window.onload, that will always work
	window.addEventListener("load",completed);} // Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access=function access(elems,fn,key,value,chainable,emptyGet,raw){var i=0,len=elems.length,bulk=key == null; // Sets many values
	if(toType(key) === "object"){chainable = true;for(i in key) {access(elems,fn,i,key[i],true,emptyGet,raw);} // Sets one value
	}else if(value !== undefined){chainable = true;if(!isFunction(value)){raw = true;}if(bulk){ // Bulk operations run against the entire set
	if(raw){fn.call(elems,value);fn = null; // ...except when executing function values
	}else {bulk = fn;fn = function(elem,key,value){return bulk.call(jQuery(elem),value);};}}if(fn){for(;i < len;i++) {fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)));}}}if(chainable){return elems;} // Gets
	if(bulk){return fn.call(elems);}return len?fn(elems[0],key):emptyGet;}; // Matches dashed string for camelizing
	var rmsPrefix=/^-ms-/,rdashAlpha=/-([a-z])/g; // Used by camelCase as callback to replace()
	function fcamelCase(all,letter){return letter.toUpperCase();} // Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 15
	// Microsoft forgot to hump their vendor prefix (#9572)
	function camelCase(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);}var acceptData=function acceptData(owner){ // Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || ! +owner.nodeType;};function Data(){this.expando = jQuery.expando + Data.uid++;}Data.uid = 1;Data.prototype = {cache:function cache(owner){ // Check if the owner object already has a cache
	var value=owner[this.expando]; // If not, create one
	if(!value){value = {}; // We can accept data for non-element nodes in modern browsers,
	// but we should not, see #8335.
	// Always return an empty object.
	if(acceptData(owner)){ // If it is a node unlikely to be stringify-ed or looped over
	// use plain assignment
	if(owner.nodeType){owner[this.expando] = value; // Otherwise secure it in a non-enumerable property
	// configurable must be true to allow the property to be
	// deleted when data is removed
	}else {Object.defineProperty(owner,this.expando,{value:value,configurable:true});}}}return value;},set:function set(owner,data,value){var prop,cache=this.cache(owner); // Handle: [ owner, key, value ] args
	// Always use camelCase key (gh-2257)
	if(typeof data === "string"){cache[camelCase(data)] = value; // Handle: [ owner, { properties } ] args
	}else { // Copy the properties one-by-one to the cache object
	for(prop in data) {cache[camelCase(prop)] = data[prop];}}return cache;},get:function get(owner,key){return key === undefined?this.cache(owner): // Always use camelCase key (gh-2257)
	owner[this.expando] && owner[this.expando][camelCase(key)];},access:function access(owner,key,value){ // In cases where either:
	//
	//   1. No key was specified
	//   2. A string key was specified, but no value provided
	//
	// Take the "read" path and allow the get method to determine
	// which value to return, respectively either:
	//
	//   1. The entire cache object
	//   2. The data stored at the key
	//
	if(key === undefined || key && typeof key === "string" && value === undefined){return this.get(owner,key);} // When the key is not a string, or both a key and value
	// are specified, set or extend (existing objects) with either:
	//
	//   1. An object of properties
	//   2. A key and value
	//
	this.set(owner,key,value); // Since the "set" path can have two possible entry points
	// return the expected data based on which path was taken[*]
	return value !== undefined?value:key;},remove:function remove(owner,key){var i,cache=owner[this.expando];if(cache === undefined){return;}if(key !== undefined){ // Support array or space separated string of keys
	if(Array.isArray(key)){ // If key is an array of keys...
	// We always set camelCase keys, so remove that.
	key = key.map(camelCase);}else {key = camelCase(key); // If a key with the spaces exists, use it.
	// Otherwise, create an array by matching non-whitespace
	key = key in cache?[key]:key.match(rnothtmlwhite) || [];}i = key.length;while(i--) {delete cache[key[i]];}} // Remove the expando if there's no more data
	if(key === undefined || jQuery.isEmptyObject(cache)){ // Support: Chrome <=35 - 45
	// Webkit & Blink performance suffers when deleting properties
	// from DOM nodes, so set to undefined instead
	// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
	if(owner.nodeType){owner[this.expando] = undefined;}else {delete owner[this.expando];}}},hasData:function hasData(owner){var cache=owner[this.expando];return cache !== undefined && !jQuery.isEmptyObject(cache);}};var dataPriv=new Data();var dataUser=new Data(); //	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	var rbrace=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash=/[A-Z]/g;function getData(data){if(data === "true"){return true;}if(data === "false"){return false;}if(data === "null"){return null;} // Only convert to a number if it doesn't change the string
	if(data === +data + ""){return +data;}if(rbrace.test(data)){return JSON.parse(data);}return data;}function dataAttr(elem,key,data){var name; // If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if(data === undefined && elem.nodeType === 1){name = "data-" + key.replace(rmultiDash,"-$&").toLowerCase();data = elem.getAttribute(name);if(typeof data === "string"){try{data = getData(data);}catch(e) {} // Make sure we set the data so it isn't changed later
	dataUser.set(elem,key,data);}else {data = undefined;}}return data;}jQuery.extend({hasData:function hasData(elem){return dataUser.hasData(elem) || dataPriv.hasData(elem);},data:function data(elem,name,_data){return dataUser.access(elem,name,_data);},removeData:function removeData(elem,name){dataUser.remove(elem,name);}, // TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data:function _data(elem,name,data){return dataPriv.access(elem,name,data);},_removeData:function _removeData(elem,name){dataPriv.remove(elem,name);}});jQuery.fn.extend({data:function data(key,value){var i,name,data,elem=this[0],attrs=elem && elem.attributes; // Gets all values
	if(key === undefined){if(this.length){data = dataUser.get(elem);if(elem.nodeType === 1 && !dataPriv.get(elem,"hasDataAttrs")){i = attrs.length;while(i--) { // Support: IE 11 only
	// The attrs elements can be null (#14894)
	if(attrs[i]){name = attrs[i].name;if(name.indexOf("data-") === 0){name = camelCase(name.slice(5));dataAttr(elem,name,data[name]);}}}dataPriv.set(elem,"hasDataAttrs",true);}}return data;} // Sets multiple values
	if(typeof key === "object"){return this.each(function(){dataUser.set(this,key);});}return access(this,function(value){var data; // The calling jQuery object (element matches) is not empty
	// (and therefore has an element appears at this[ 0 ]) and the
	// `value` parameter was not undefined. An empty jQuery object
	// will result in `undefined` for elem = this[ 0 ] which will
	// throw an exception if an attempt to read a data cache is made.
	if(elem && value === undefined){ // Attempt to get data from the cache
	// The key will always be camelCased in Data
	data = dataUser.get(elem,key);if(data !== undefined){return data;} // Attempt to "discover" the data in
	// HTML5 custom data-* attrs
	data = dataAttr(elem,key);if(data !== undefined){return data;} // We tried really hard, but the data doesn't exist.
	return;} // Set the data...
	this.each(function(){ // We always store the camelCased key
	dataUser.set(this,key,value);});},null,value,arguments.length > 1,null,true);},removeData:function removeData(key){return this.each(function(){dataUser.remove(this,key);});}});jQuery.extend({queue:function queue(elem,type,data){var queue;if(elem){type = (type || "fx") + "queue";queue = dataPriv.get(elem,type); // Speed up dequeue by getting out quickly if this is just a lookup
	if(data){if(!queue || Array.isArray(data)){queue = dataPriv.access(elem,type,jQuery.makeArray(data));}else {queue.push(data);}}return queue || [];}},dequeue:function dequeue(elem,type){type = type || "fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function next(){jQuery.dequeue(elem,type);}; // If the fx queue is dequeued, always remove the progress sentinel
	if(fn === "inprogress"){fn = queue.shift();startLength--;}if(fn){ // Add a progress sentinel to prevent the fx queue from being
	// automatically dequeued
	if(type === "fx"){queue.unshift("inprogress");} // Clear up the last queue stop function
	delete hooks.stop;fn.call(elem,next,hooks);}if(!startLength && hooks){hooks.empty.fire();}}, // Not public - generate a queueHooks object, or return the current one
	_queueHooks:function _queueHooks(elem,type){var key=type + "queueHooks";return dataPriv.get(elem,key) || dataPriv.access(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){dataPriv.remove(elem,[type + "queue",key]);})});}});jQuery.fn.extend({queue:function queue(type,data){var setter=2;if(typeof type !== "string"){data = type;type = "fx";setter--;}if(arguments.length < setter){return jQuery.queue(this[0],type);}return data === undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data); // Ensure a hooks for this queue
	jQuery._queueHooks(this,type);if(type === "fx" && queue[0] !== "inprogress"){jQuery.dequeue(this,type);}});},dequeue:function dequeue(type){return this.each(function(){jQuery.dequeue(this,type);});},clearQueue:function clearQueue(type){return this.queue(type || "fx",[]);}, // Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise:function promise(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function resolve(){if(! --count){defer.resolveWith(elements,[elements]);}};if(typeof type !== "string"){obj = type;type = undefined;}type = type || "fx";while(i--) {tmp = dataPriv.get(elements[i],type + "queueHooks");if(tmp && tmp.empty){count++;tmp.empty.add(resolve);}}resolve();return defer.promise(obj);}});var pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;var rcssNum=new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$","i");var cssExpand=["Top","Right","Bottom","Left"];var isHiddenWithinTree=function isHiddenWithinTree(elem,el){ // isHiddenWithinTree might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem; // Inline style trumps all
	return elem.style.display === "none" || elem.style.display === "" &&  // Otherwise, check computed style
	// Support: Firefox <=43 - 45
	// Disconnected elements can have computed display: none, so first confirm that elem is
	// in the document.
	jQuery.contains(elem.ownerDocument,elem) && jQuery.css(elem,"display") === "none";};var swap=function swap(elem,options,callback,args){var ret,name,old={}; // Remember the old values, and insert the new ones
	for(name in options) {old[name] = elem.style[name];elem.style[name] = options[name];}ret = callback.apply(elem,args || []); // Revert the old values
	for(name in options) {elem.style[name] = old[name];}return ret;};function adjustCSS(elem,prop,valueParts,tween){var adjusted,scale,maxIterations=20,currentValue=tween?function(){return tween.cur();}:function(){return jQuery.css(elem,prop,"");},initial=currentValue(),unit=valueParts && valueParts[3] || (jQuery.cssNumber[prop]?"":"px"), // Starting value computation is required for potential unit mismatches
	initialInUnit=(jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem,prop));if(initialInUnit && initialInUnit[3] !== unit){ // Support: Firefox <=54
	// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
	initial = initial / 2; // Trust units reported by jQuery.css
	unit = unit || initialInUnit[3]; // Iteratively approximate from a nonzero starting point
	initialInUnit = +initial || 1;while(maxIterations--) { // Evaluate and update our best guess (doubling guesses that zero out).
	// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
	jQuery.style(elem,prop,initialInUnit + unit);if((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0){maxIterations = 0;}initialInUnit = initialInUnit / scale;}initialInUnit = initialInUnit * 2;jQuery.style(elem,prop,initialInUnit + unit); // Make sure we update the tween properties later on
	valueParts = valueParts || [];}if(valueParts){initialInUnit = +initialInUnit || +initial || 0; // Apply relative offset (+=/-=) if specified
	adjusted = valueParts[1]?initialInUnit + (valueParts[1] + 1) * valueParts[2]:+valueParts[2];if(tween){tween.unit = unit;tween.start = initialInUnit;tween.end = adjusted;}}return adjusted;}var defaultDisplayMap={};function getDefaultDisplay(elem){var temp,doc=elem.ownerDocument,nodeName=elem.nodeName,display=defaultDisplayMap[nodeName];if(display){return display;}temp = doc.body.appendChild(doc.createElement(nodeName));display = jQuery.css(temp,"display");temp.parentNode.removeChild(temp);if(display === "none"){display = "block";}defaultDisplayMap[nodeName] = display;return display;}function showHide(elements,show){var display,elem,values=[],index=0,length=elements.length; // Determine new display value for elements that need to change
	for(;index < length;index++) {elem = elements[index];if(!elem.style){continue;}display = elem.style.display;if(show){ // Since we force visibility upon cascade-hidden elements, an immediate (and slow)
	// check is required in this first loop unless we have a nonempty display value (either
	// inline or about-to-be-restored)
	if(display === "none"){values[index] = dataPriv.get(elem,"display") || null;if(!values[index]){elem.style.display = "";}}if(elem.style.display === "" && isHiddenWithinTree(elem)){values[index] = getDefaultDisplay(elem);}}else {if(display !== "none"){values[index] = "none"; // Remember what we're overwriting
	dataPriv.set(elem,"display",display);}}} // Set the display of the elements in a second loop to avoid constant reflow
	for(index = 0;index < length;index++) {if(values[index] != null){elements[index].style.display = values[index];}}return elements;}jQuery.fn.extend({show:function show(){return showHide(this,true);},hide:function hide(){return showHide(this);},toggle:function toggle(state){if(typeof state === "boolean"){return state?this.show():this.hide();}return this.each(function(){if(isHiddenWithinTree(this)){jQuery(this).show();}else {jQuery(this).hide();}});}});var rcheckableType=/^(?:checkbox|radio)$/i;var rtagName=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i;var rscriptType=/^$|^module$|\/(?:java|ecma)script/i; // We have to close these tags to support XHTML (#13200)
	var wrapMap={ // Support: IE <=9 only
	option:[1,"<select multiple='multiple'>","</select>"], // XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]}; // Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;wrapMap.th = wrapMap.td;function getAll(context,tag){ // Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;if(typeof context.getElementsByTagName !== "undefined"){ret = context.getElementsByTagName(tag || "*");}else if(typeof context.querySelectorAll !== "undefined"){ret = context.querySelectorAll(tag || "*");}else {ret = [];}if(tag === undefined || tag && nodeName(context,tag)){return jQuery.merge([context],ret);}return ret;} // Mark scripts as having already been evaluated
	function setGlobalEval(elems,refElements){var i=0,l=elems.length;for(;i < l;i++) {dataPriv.set(elems[i],"globalEval",!refElements || dataPriv.get(refElements[i],"globalEval"));}}var rhtml=/<|&#?\w+;/;function buildFragment(elems,context,scripts,selection,ignored){var elem,tmp,tag,wrap,contains,j,fragment=context.createDocumentFragment(),nodes=[],i=0,l=elems.length;for(;i < l;i++) {elem = elems[i];if(elem || elem === 0){ // Add nodes directly
	if(toType(elem) === "object"){ // Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	jQuery.merge(nodes,elem.nodeType?[elem]:elem); // Convert non-html into a text node
	}else if(!rhtml.test(elem)){nodes.push(context.createTextNode(elem)); // Convert html into DOM nodes
	}else {tmp = tmp || fragment.appendChild(context.createElement("div")); // Deserialize a standard representation
	tag = (rtagName.exec(elem) || ["",""])[1].toLowerCase();wrap = wrapMap[tag] || wrapMap._default;tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2]; // Descend through wrappers to the right content
	j = wrap[0];while(j--) {tmp = tmp.lastChild;} // Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	jQuery.merge(nodes,tmp.childNodes); // Remember the top-level container
	tmp = fragment.firstChild; // Ensure the created nodes are orphaned (#12392)
	tmp.textContent = "";}}} // Remove wrapper from fragment
	fragment.textContent = "";i = 0;while(elem = nodes[i++]) { // Skip elements already in the context collection (trac-4087)
	if(selection && jQuery.inArray(elem,selection) > -1){if(ignored){ignored.push(elem);}continue;}contains = jQuery.contains(elem.ownerDocument,elem); // Append to fragment
	tmp = getAll(fragment.appendChild(elem),"script"); // Preserve script evaluation history
	if(contains){setGlobalEval(tmp);} // Capture executables
	if(scripts){j = 0;while(elem = tmp[j++]) {if(rscriptType.test(elem.type || "")){scripts.push(elem);}}}}return fragment;}(function(){var fragment=document.createDocumentFragment(),div=fragment.appendChild(document.createElement("div")),input=document.createElement("input"); // Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute("type","radio");input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input); // Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked; // Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;})();var documentElement=document.documentElement;var rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,rtypenamespace=/^([^.]*)(?:\.(.+)|)/;function returnTrue(){return true;}function returnFalse(){return false;} // Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement(){try{return document.activeElement;}catch(err) {}}function _on(elem,types,selector,data,fn,one){var origFn,type; // Types can be a map of types/handlers
	if(typeof types === "object"){ // ( types-Object, selector, data )
	if(typeof selector !== "string"){ // ( types-Object, data )
	data = data || selector;selector = undefined;}for(type in types) {_on(elem,type,selector,data,types[type],one);}return elem;}if(data == null && fn == null){ // ( types, fn )
	fn = selector;data = selector = undefined;}else if(fn == null){if(typeof selector === "string"){ // ( types, selector, fn )
	fn = data;data = undefined;}else { // ( types, data, fn )
	fn = data;data = selector;selector = undefined;}}if(fn === false){fn = returnFalse;}else if(!fn){return elem;}if(one === 1){origFn = fn;fn = function(event){ // Can use an empty set, since event contains the info
	jQuery().off(event);return origFn.apply(this,arguments);}; // Use same guid so caller can remove using origFn
	fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);}return elem.each(function(){jQuery.event.add(this,types,fn,data,selector);});} /*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */jQuery.event = {global:{},add:function add(elem,types,handler,data,selector){var handleObjIn,eventHandle,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.get(elem); // Don't attach events to noData or text/comment nodes (but allow plain objects)
	if(!elemData){return;} // Caller can pass in an object of custom data in lieu of the handler
	if(handler.handler){handleObjIn = handler;handler = handleObjIn.handler;selector = handleObjIn.selector;} // Ensure that invalid selectors throw exceptions at attach time
	// Evaluate against documentElement in case elem is a non-element node (e.g., document)
	if(selector){jQuery.find.matchesSelector(documentElement,selector);} // Make sure that the handler has a unique ID, used to find/remove it later
	if(!handler.guid){handler.guid = jQuery.guid++;} // Init the element's event structure and main handler, if this is the first
	if(!(events = elemData.events)){events = elemData.events = {};}if(!(eventHandle = elemData.handle)){eventHandle = elemData.handle = function(e){ // Discard the second event of a jQuery.event.trigger() and
	// when an event is called after a page has unloaded
	return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type?jQuery.event.dispatch.apply(elem,arguments):undefined;};} // Handle multiple events separated by a space
	types = (types || "").match(rnothtmlwhite) || [""];t = types.length;while(t--) {tmp = rtypenamespace.exec(types[t]) || [];type = origType = tmp[1];namespaces = (tmp[2] || "").split(".").sort(); // There *must* be a type, no attaching namespace-only handlers
	if(!type){continue;} // If event changes its type, use the special event handlers for the changed type
	special = jQuery.event.special[type] || {}; // If selector defined, determine special event api type, otherwise given type
	type = (selector?special.delegateType:special.bindType) || type; // Update special based on newly reset type
	special = jQuery.event.special[type] || {}; // handleObj is passed to all event handlers
	handleObj = jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector && jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn); // Init the event handler queue if we're the first
	if(!(handlers = events[type])){handlers = events[type] = [];handlers.delegateCount = 0; // Only use addEventListener if the special events handler returns false
	if(!special.setup || special.setup.call(elem,data,namespaces,eventHandle) === false){if(elem.addEventListener){elem.addEventListener(type,eventHandle);}}}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid = handler.guid;}} // Add to the element's handler list, delegates in front
	if(selector){handlers.splice(handlers.delegateCount++,0,handleObj);}else {handlers.push(handleObj);} // Keep track of which events have ever been used, for event optimization
	jQuery.event.global[type] = true;}}, // Detach an event or set of events from an element
	remove:function remove(elem,types,handler,selector,mappedTypes){var j,origCount,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.hasData(elem) && dataPriv.get(elem);if(!elemData || !(events = elemData.events)){return;} // Once for each type.namespace in types; type may be omitted
	types = (types || "").match(rnothtmlwhite) || [""];t = types.length;while(t--) {tmp = rtypenamespace.exec(types[t]) || [];type = origType = tmp[1];namespaces = (tmp[2] || "").split(".").sort(); // Unbind all events (on this namespace, if provided) for the element
	if(!type){for(type in events) {jQuery.event.remove(elem,type + types[t],handler,selector,true);}continue;}special = jQuery.event.special[type] || {};type = (selector?special.delegateType:special.bindType) || type;handlers = events[type] || [];tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"); // Remove matching events
	origCount = j = handlers.length;while(j--) {handleObj = handlers[j];if((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)){handlers.splice(j,1);if(handleObj.selector){handlers.delegateCount--;}if(special.remove){special.remove.call(elem,handleObj);}}} // Remove generic event handler if we removed something and no more handlers exist
	// (avoids potential for endless recursion during removal of special event handlers)
	if(origCount && !handlers.length){if(!special.teardown || special.teardown.call(elem,namespaces,elemData.handle) === false){jQuery.removeEvent(elem,type,elemData.handle);}delete events[type];}} // Remove data and the expando if it's no longer used
	if(jQuery.isEmptyObject(events)){dataPriv.remove(elem,"handle events");}},dispatch:function dispatch(nativeEvent){ // Make a writable jQuery.Event from the native event object
	var event=jQuery.event.fix(nativeEvent);var i,j,ret,matched,handleObj,handlerQueue,args=new Array(arguments.length),handlers=(dataPriv.get(this,"events") || {})[event.type] || [],special=jQuery.event.special[event.type] || {}; // Use the fix-ed jQuery.Event rather than the (read-only) native event
	args[0] = event;for(i = 1;i < arguments.length;i++) {args[i] = arguments[i];}event.delegateTarget = this; // Call the preDispatch hook for the mapped type, and let it bail if desired
	if(special.preDispatch && special.preDispatch.call(this,event) === false){return;} // Determine handlers
	handlerQueue = jQuery.event.handlers.call(this,event,handlers); // Run delegates first; they may want to stop propagation beneath us
	i = 0;while((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {event.currentTarget = matched.elem;j = 0;while((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) { // Triggered event must either 1) have no namespace, or 2) have namespace(s)
	// a subset or equal to those in the bound event (both can have no namespace).
	if(!event.rnamespace || event.rnamespace.test(handleObj.namespace)){event.handleObj = handleObj;event.data = handleObj.data;ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem,args);if(ret !== undefined){if((event.result = ret) === false){event.preventDefault();event.stopPropagation();}}}}} // Call the postDispatch hook for the mapped type
	if(special.postDispatch){special.postDispatch.call(this,event);}return event.result;},handlers:function handlers(event,_handlers){var i,handleObj,sel,matchedHandlers,matchedSelectors,handlerQueue=[],delegateCount=_handlers.delegateCount,cur=event.target; // Find delegate handlers
	if(delegateCount &&  // Support: IE <=9
	// Black-hole SVG <use> instance trees (trac-13180)
	cur.nodeType &&  // Support: Firefox <=42
	// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
	// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
	// Support: IE 11 only
	// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
	!(event.type === "click" && event.button >= 1)){for(;cur !== this;cur = cur.parentNode || this) { // Don't check non-elements (#13208)
	// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
	if(cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)){matchedHandlers = [];matchedSelectors = {};for(i = 0;i < delegateCount;i++) {handleObj = _handlers[i]; // Don't conflict with Object.prototype properties (#13203)
	sel = handleObj.selector + " ";if(matchedSelectors[sel] === undefined){matchedSelectors[sel] = handleObj.needsContext?jQuery(sel,this).index(cur) > -1:jQuery.find(sel,this,null,[cur]).length;}if(matchedSelectors[sel]){matchedHandlers.push(handleObj);}}if(matchedHandlers.length){handlerQueue.push({elem:cur,handlers:matchedHandlers});}}}} // Add the remaining (directly-bound) handlers
	cur = this;if(delegateCount < _handlers.length){handlerQueue.push({elem:cur,handlers:_handlers.slice(delegateCount)});}return handlerQueue;},addProp:function addProp(name,hook){Object.defineProperty(jQuery.Event.prototype,name,{enumerable:true,configurable:true,get:isFunction(hook)?function(){if(this.originalEvent){return hook(this.originalEvent);}}:function(){if(this.originalEvent){return this.originalEvent[name];}},set:function set(value){Object.defineProperty(this,name,{enumerable:true,configurable:true,writable:true,value:value});}});},fix:function fix(originalEvent){return originalEvent[jQuery.expando]?originalEvent:new jQuery.Event(originalEvent);},special:{load:{ // Prevent triggered image.load events from bubbling to window.load
	noBubble:true},focus:{ // Fire native event if possible so blur/focus sequence is correct
	trigger:function trigger(){if(this !== safeActiveElement() && this.focus){this.focus();return false;}},delegateType:"focusin"},blur:{trigger:function trigger(){if(this === safeActiveElement() && this.blur){this.blur();return false;}},delegateType:"focusout"},click:{ // For checkbox, fire native event so checked state will be right
	trigger:function trigger(){if(this.type === "checkbox" && this.click && nodeName(this,"input")){this.click();return false;}}, // For cross-browser consistency, don't fire native .click() on links
	_default:function _default(event){return nodeName(event.target,"a");}},beforeunload:{postDispatch:function postDispatch(event){ // Support: Firefox 20+
	// Firefox doesn't alert if the returnValue field is not set.
	if(event.result !== undefined && event.originalEvent){event.originalEvent.returnValue = event.result;}}}}};jQuery.removeEvent = function(elem,type,handle){ // This "if" is needed for plain objects
	if(elem.removeEventListener){elem.removeEventListener(type,handle);}};jQuery.Event = function(src,props){ // Allow instantiation without the 'new' keyword
	if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props);} // Event object
	if(src && src.type){this.originalEvent = src;this.type = src.type; // Events bubbling up the document may have been marked as prevented
	// by a handler lower down the tree; reflect the correct value.
	this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&  // Support: Android <=2.3 only
	src.returnValue === false?returnTrue:returnFalse; // Create target properties
	// Support: Safari <=6 - 7 only
	// Target should not be a text node (#504, #13143)
	this.target = src.target && src.target.nodeType === 3?src.target.parentNode:src.target;this.currentTarget = src.currentTarget;this.relatedTarget = src.relatedTarget; // Event type
	}else {this.type = src;} // Put explicitly provided properties onto the event object
	if(props){jQuery.extend(this,props);} // Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now(); // Mark it as fixed
	this[jQuery.expando] = true;}; // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {constructor:jQuery.Event,isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,isSimulated:false,preventDefault:function preventDefault(){var e=this.originalEvent;this.isDefaultPrevented = returnTrue;if(e && !this.isSimulated){e.preventDefault();}},stopPropagation:function stopPropagation(){var e=this.originalEvent;this.isPropagationStopped = returnTrue;if(e && !this.isSimulated){e.stopPropagation();}},stopImmediatePropagation:function stopImmediatePropagation(){var e=this.originalEvent;this.isImmediatePropagationStopped = returnTrue;if(e && !this.isSimulated){e.stopImmediatePropagation();}this.stopPropagation();}}; // Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each({altKey:true,bubbles:true,cancelable:true,changedTouches:true,ctrlKey:true,detail:true,eventPhase:true,metaKey:true,pageX:true,pageY:true,shiftKey:true,view:true,"char":true,charCode:true,key:true,keyCode:true,button:true,buttons:true,clientX:true,clientY:true,offsetX:true,offsetY:true,pointerId:true,pointerType:true,screenX:true,screenY:true,targetTouches:true,toElement:true,touches:true,which:function which(event){var button=event.button; // Add which for key events
	if(event.which == null && rkeyEvent.test(event.type)){return event.charCode != null?event.charCode:event.keyCode;} // Add which for click: 1 === left; 2 === middle; 3 === right
	if(!event.which && button !== undefined && rmouseEvent.test(event.type)){if(button & 1){return 1;}if(button & 2){return 3;}if(button & 4){return 2;}return 0;}return event.which;}},jQuery.event.addProp); // Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(orig,fix){jQuery.event.special[orig] = {delegateType:fix,bindType:fix,handle:function handle(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj; // For mouseenter/leave call the handler if related is outside the target.
	// NB: No relatedTarget if the mouse left/entered the browser window
	if(!related || related !== target && !jQuery.contains(target,related)){event.type = handleObj.origType;ret = handleObj.handler.apply(this,arguments);event.type = fix;}return ret;}};});jQuery.fn.extend({on:function on(types,selector,data,fn){return _on(this,types,selector,data,fn);},one:function one(types,selector,data,fn){return _on(this,types,selector,data,fn,1);},off:function off(types,selector,fn){var handleObj,type;if(types && types.preventDefault && types.handleObj){ // ( event )  dispatched jQuery.Event
	handleObj = types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType + "." + handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this;}if(typeof types === "object"){ // ( types-object [, selector] )
	for(type in types) {this.off(type,selector,types[type]);}return this;}if(selector === false || typeof selector === "function"){ // ( types [, fn] )
	fn = selector;selector = undefined;}if(fn === false){fn = returnFalse;}return this.each(function(){jQuery.event.remove(this,types,fn,selector);});}});var  /* eslint-disable max-len */ // See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi, /* eslint-enable */ // Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml=/<script|<style|<link/i, // checked="checked" or checked
	rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g; // Prefer a tbody over its parent table for containing new rows
	function manipulationTarget(elem,content){if(nodeName(elem,"table") && nodeName(content.nodeType !== 11?content:content.firstChild,"tr")){return jQuery(elem).children("tbody")[0] || elem;}return elem;} // Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem){elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;return elem;}function restoreScript(elem){if((elem.type || "").slice(0,5) === "true/"){elem.type = elem.type.slice(5);}else {elem.removeAttribute("type");}return elem;}function cloneCopyEvent(src,dest){var i,l,type,pdataOld,pdataCur,udataOld,udataCur,events;if(dest.nodeType !== 1){return;} // 1. Copy private data: events, handlers, etc.
	if(dataPriv.hasData(src)){pdataOld = dataPriv.access(src);pdataCur = dataPriv.set(dest,pdataOld);events = pdataOld.events;if(events){delete pdataCur.handle;pdataCur.events = {};for(type in events) {for(i = 0,l = events[type].length;i < l;i++) {jQuery.event.add(dest,type,events[type][i]);}}}} // 2. Copy user data
	if(dataUser.hasData(src)){udataOld = dataUser.access(src);udataCur = jQuery.extend({},udataOld);dataUser.set(dest,udataCur);}} // Fix IE bugs, see support tests
	function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase(); // Fails to persist the checked state of a cloned checkbox or radio button.
	if(nodeName === "input" && rcheckableType.test(src.type)){dest.checked = src.checked; // Fails to return the selected option to the default selected state when cloning options
	}else if(nodeName === "input" || nodeName === "textarea"){dest.defaultValue = src.defaultValue;}}function domManip(collection,args,callback,ignored){ // Flatten any nested arrays
	args = concat.apply([],args);var fragment,first,scripts,hasScripts,node,doc,i=0,l=collection.length,iNoClone=l - 1,value=args[0],valueIsFunction=isFunction(value); // We can't cloneNode fragments that contain checked, in WebKit
	if(valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)){return collection.each(function(index){var self=collection.eq(index);if(valueIsFunction){args[0] = value.call(this,index,self.html());}domManip(self,args,callback,ignored);});}if(l){fragment = buildFragment(args,collection[0].ownerDocument,false,collection,ignored);first = fragment.firstChild;if(fragment.childNodes.length === 1){fragment = first;} // Require either new content or an interest in ignored elements to invoke the callback
	if(first || ignored){scripts = jQuery.map(getAll(fragment,"script"),disableScript);hasScripts = scripts.length; // Use the original fragment for the last item
	// instead of the first because it can end up
	// being emptied incorrectly in certain situations (#8070).
	for(;i < l;i++) {node = fragment;if(i !== iNoClone){node = jQuery.clone(node,true,true); // Keep references to cloned scripts for later restoration
	if(hasScripts){ // Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	jQuery.merge(scripts,getAll(node,"script"));}}callback.call(collection[i],node,i);}if(hasScripts){doc = scripts[scripts.length - 1].ownerDocument; // Reenable scripts
	jQuery.map(scripts,restoreScript); // Evaluate executable scripts on first document insertion
	for(i = 0;i < hasScripts;i++) {node = scripts[i];if(rscriptType.test(node.type || "") && !dataPriv.access(node,"globalEval") && jQuery.contains(doc,node)){if(node.src && (node.type || "").toLowerCase() !== "module"){ // Optional AJAX dependency, but won't run scripts if not present
	if(jQuery._evalUrl){jQuery._evalUrl(node.src);}}else {DOMEval(node.textContent.replace(rcleanScript,""),doc,node);}}}}}}return collection;}function _remove(elem,selector,keepData){var node,nodes=selector?jQuery.filter(selector,elem):elem,i=0;for(;(node = nodes[i]) != null;i++) {if(!keepData && node.nodeType === 1){jQuery.cleanData(getAll(node));}if(node.parentNode){if(keepData && jQuery.contains(node.ownerDocument,node)){setGlobalEval(getAll(node,"script"));}node.parentNode.removeChild(node);}}return elem;}jQuery.extend({htmlPrefilter:function htmlPrefilter(html){return html.replace(rxhtmlTag,"<$1></$2>");},clone:function clone(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(true),inPage=jQuery.contains(elem.ownerDocument,elem); // Fix IE cloning issues
	if(!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)){ // We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
	destElements = getAll(clone);srcElements = getAll(elem);for(i = 0,l = srcElements.length;i < l;i++) {fixInput(srcElements[i],destElements[i]);}} // Copy the events from the original to the clone
	if(dataAndEvents){if(deepDataAndEvents){srcElements = srcElements || getAll(elem);destElements = destElements || getAll(clone);for(i = 0,l = srcElements.length;i < l;i++) {cloneCopyEvent(srcElements[i],destElements[i]);}}else {cloneCopyEvent(elem,clone);}} // Preserve script evaluation history
	destElements = getAll(clone,"script");if(destElements.length > 0){setGlobalEval(destElements,!inPage && getAll(elem,"script"));} // Return the cloned set
	return clone;},cleanData:function cleanData(elems){var data,elem,type,special=jQuery.event.special,i=0;for(;(elem = elems[i]) !== undefined;i++) {if(acceptData(elem)){if(data = elem[dataPriv.expando]){if(data.events){for(type in data.events) {if(special[type]){jQuery.event.remove(elem,type); // This is a shortcut to avoid jQuery.event.remove's overhead
	}else {jQuery.removeEvent(elem,type,data.handle);}}} // Support: Chrome <=35 - 45+
	// Assign undefined instead of using delete, see Data#remove
	elem[dataPriv.expando] = undefined;}if(elem[dataUser.expando]){ // Support: Chrome <=35 - 45+
	// Assign undefined instead of using delete, see Data#remove
	elem[dataUser.expando] = undefined;}}}}});jQuery.fn.extend({detach:function detach(selector){return _remove(this,selector,true);},remove:function remove(selector){return _remove(this,selector);},text:function text(value){return access(this,function(value){return value === undefined?jQuery.text(this):this.empty().each(function(){if(this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9){this.textContent = value;}});},null,value,arguments.length);},append:function append(){return domManip(this,arguments,function(elem){if(this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9){var target=manipulationTarget(this,elem);target.appendChild(elem);}});},prepend:function prepend(){return domManip(this,arguments,function(elem){if(this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild);}});},before:function before(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this);}});},after:function after(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this.nextSibling);}});},empty:function empty(){var elem,i=0;for(;(elem = this[i]) != null;i++) {if(elem.nodeType === 1){ // Prevent memory leaks
	jQuery.cleanData(getAll(elem,false)); // Remove any remaining nodes
	elem.textContent = "";}}return this;},clone:function clone(dataAndEvents,deepDataAndEvents){dataAndEvents = dataAndEvents == null?false:dataAndEvents;deepDataAndEvents = deepDataAndEvents == null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents);});},html:function html(value){return access(this,function(value){var elem=this[0] || {},i=0,l=this.length;if(value === undefined && elem.nodeType === 1){return elem.innerHTML;} // See if we can take a shortcut and just use innerHTML
	if(typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["",""])[1].toLowerCase()]){value = jQuery.htmlPrefilter(value);try{for(;i < l;i++) {elem = this[i] || {}; // Remove element nodes and prevent memory leaks
	if(elem.nodeType === 1){jQuery.cleanData(getAll(elem,false));elem.innerHTML = value;}}elem = 0; // If using innerHTML throws an exception, use the fallback method
	}catch(e) {}}if(elem){this.empty().append(value);}},null,value,arguments.length);},replaceWith:function replaceWith(){var ignored=[]; // Make the changes, replacing each non-ignored context element with the new content
	return domManip(this,arguments,function(elem){var parent=this.parentNode;if(jQuery.inArray(this,ignored) < 0){jQuery.cleanData(getAll(this));if(parent){parent.replaceChild(elem,this);}} // Force callback invocation
	},ignored);}});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name] = function(selector){var elems,ret=[],insert=jQuery(selector),last=insert.length - 1,i=0;for(;i <= last;i++) {elems = i === last?this:this.clone(true);jQuery(insert[i])[original](elems); // Support: Android <=4.0 only, PhantomJS 1 only
	// .get() because push.apply(_, arraylike) throws on ancient WebKit
	push.apply(ret,elems.get());}return this.pushStack(ret);};});var rnumnonpx=new RegExp("^(" + pnum + ")(?!px)[a-z%]+$","i");var getStyles=function getStyles(elem){ // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
	// IE throws on elements created in popups
	// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
	var view=elem.ownerDocument.defaultView;if(!view || !view.opener){view = window;}return view.getComputedStyle(elem);};var rboxStyle=new RegExp(cssExpand.join("|"),"i");(function(){ // Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests(){ // This is a singleton, we need to execute it only once
	if(!div){return;}container.style.cssText = "position:absolute;left:-11111px;width:60px;" + "margin-top:1px;padding:0;border:0";div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;" + "margin:auto;border:1px;padding:1px;" + "width:60%;top:1%";documentElement.appendChild(container).appendChild(div);var divStyle=window.getComputedStyle(div);pixelPositionVal = divStyle.top !== "1%"; // Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
	reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12; // Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
	// Some styles come back with percentage values, even though they shouldn't
	div.style.right = "60%";pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36; // Support: IE 9 - 11 only
	// Detect misreporting of content dimensions for box-sizing:border-box elements
	boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36; // Support: IE 9 only
	// Detect overflow:scroll screwiness (gh-3699)
	div.style.position = "absolute";scrollboxSizeVal = div.offsetWidth === 36 || "absolute";documentElement.removeChild(container); // Nullify the div so it wouldn't be stored in the memory and
	// it will also be a sign that checks already performed
	div = null;}function roundPixelMeasures(measure){return Math.round(parseFloat(measure));}var pixelPositionVal,boxSizingReliableVal,scrollboxSizeVal,pixelBoxStylesVal,reliableMarginLeftVal,container=document.createElement("div"),div=document.createElement("div"); // Finish early in limited (non-browser) environments
	if(!div.style){return;} // Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";div.cloneNode(true).style.backgroundClip = "";support.clearCloneStyle = div.style.backgroundClip === "content-box";jQuery.extend(support,{boxSizingReliable:function boxSizingReliable(){computeStyleTests();return boxSizingReliableVal;},pixelBoxStyles:function pixelBoxStyles(){computeStyleTests();return pixelBoxStylesVal;},pixelPosition:function pixelPosition(){computeStyleTests();return pixelPositionVal;},reliableMarginLeft:function reliableMarginLeft(){computeStyleTests();return reliableMarginLeftVal;},scrollboxSize:function scrollboxSize(){computeStyleTests();return scrollboxSizeVal;}});})();function curCSS(elem,name,computed){var width,minWidth,maxWidth,ret, // Support: Firefox 51+
	// Retrieving style before computed somehow
	// fixes an issue with getting wrong values
	// on detached elements
	style=elem.style;computed = computed || getStyles(elem); // getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if(computed){ret = computed.getPropertyValue(name) || computed[name];if(ret === "" && !jQuery.contains(elem.ownerDocument,elem)){ret = jQuery.style(elem,name);} // A tribute to the "awesome hack by Dean Edwards"
	// Android Browser returns percentage for some values,
	// but width seems to be reliably pixels.
	// This is against the CSSOM draft spec:
	// https://drafts.csswg.org/cssom/#resolved-values
	if(!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)){ // Remember the original values
	width = style.width;minWidth = style.minWidth;maxWidth = style.maxWidth; // Put in the new values to get a computed value out
	style.minWidth = style.maxWidth = style.width = ret;ret = computed.width; // Revert the changed values
	style.width = width;style.minWidth = minWidth;style.maxWidth = maxWidth;}}return ret !== undefined? // Support: IE <=9 - 11 only
	// IE returns zIndex value as an integer.
	ret + "":ret;}function addGetHookIf(conditionFn,hookFn){ // Define the hook, we'll check on the first run if it's really needed.
	return {get:function get(){if(conditionFn()){ // Hook not needed (or it's not possible to use it due
	// to missing dependency), remove it.
	delete this.get;return;} // Hook needed; redefine it so that the support test is not executed again.
	return (this.get = hookFn).apply(this,arguments);}};}var  // Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap=/^(none|table(?!-c[ea]).+)/,rcustomProp=/^--/,cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:"0",fontWeight:"400"},cssPrefixes=["Webkit","Moz","ms"],emptyStyle=document.createElement("div").style; // Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name){ // Shortcut for names that are not vendor prefixed
	if(name in emptyStyle){return name;} // Check for vendor prefixed names
	var capName=name[0].toUpperCase() + name.slice(1),i=cssPrefixes.length;while(i--) {name = cssPrefixes[i] + capName;if(name in emptyStyle){return name;}}} // Return a property mapped along what jQuery.cssProps suggests or to
	// a vendor prefixed property.
	function finalPropName(name){var ret=jQuery.cssProps[name];if(!ret){ret = jQuery.cssProps[name] = vendorPropName(name) || name;}return ret;}function setPositiveNumber(elem,value,subtract){ // Any relative (+/-) values have already been
	// normalized at this point
	var matches=rcssNum.exec(value);return matches? // Guard against undefined "subtract", e.g., when used as in cssHooks
	Math.max(0,matches[2] - (subtract || 0)) + (matches[3] || "px"):value;}function boxModelAdjustment(elem,dimension,box,isBorderBox,styles,computedVal){var i=dimension === "width"?1:0,extra=0,delta=0; // Adjustment may not be necessary
	if(box === (isBorderBox?"border":"content")){return 0;}for(;i < 4;i += 2) { // Both box models exclude margin
	if(box === "margin"){delta += jQuery.css(elem,box + cssExpand[i],true,styles);} // If we get here with a content-box, we're seeking "padding" or "border" or "margin"
	if(!isBorderBox){ // Add padding
	delta += jQuery.css(elem,"padding" + cssExpand[i],true,styles); // For "border" or "margin", add border
	if(box !== "padding"){delta += jQuery.css(elem,"border" + cssExpand[i] + "Width",true,styles); // But still keep track of it otherwise
	}else {extra += jQuery.css(elem,"border" + cssExpand[i] + "Width",true,styles);} // If we get here with a border-box (content + padding + border), we're seeking "content" or
	// "padding" or "margin"
	}else { // For "content", subtract padding
	if(box === "content"){delta -= jQuery.css(elem,"padding" + cssExpand[i],true,styles);} // For "content" or "padding", subtract border
	if(box !== "margin"){delta -= jQuery.css(elem,"border" + cssExpand[i] + "Width",true,styles);}}} // Account for positive content-box scroll gutter when requested by providing computedVal
	if(!isBorderBox && computedVal >= 0){ // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
	// Assuming integer scroll gutter, subtract the rest and round down
	delta += Math.max(0,Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5));}return delta;}function getWidthOrHeight(elem,dimension,extra){ // Start with computed style
	var styles=getStyles(elem),val=curCSS(elem,dimension,styles),isBorderBox=jQuery.css(elem,"boxSizing",false,styles) === "border-box",valueIsBorderBox=isBorderBox; // Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if(rnumnonpx.test(val)){if(!extra){return val;}val = "auto";} // Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox && (support.boxSizingReliable() || val === elem.style[dimension]); // Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if(val === "auto" || !parseFloat(val) && jQuery.css(elem,"display",false,styles) === "inline"){val = elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)]; // offsetWidth/offsetHeight provide border-box values
	valueIsBorderBox = true;} // Normalize "" and auto
	val = parseFloat(val) || 0; // Adjust for the element's box model
	return val + boxModelAdjustment(elem,dimension,extra || (isBorderBox?"border":"content"),valueIsBorderBox,styles, // Provide the current computed size to request scroll gutter calculation (gh-3589)
	val) + "px";}jQuery.extend({ // Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks:{opacity:{get:function get(elem,computed){if(computed){ // We should always get a number back from opacity
	var ret=curCSS(elem,"opacity");return ret === ""?"1":ret;}}}}, // Don't automatically add "px" to these possibly-unitless properties
	cssNumber:{"animationIterationCount":true,"columnCount":true,"fillOpacity":true,"flexGrow":true,"flexShrink":true,"fontWeight":true,"lineHeight":true,"opacity":true,"order":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true}, // Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps:{}, // Get and set the style property on a DOM Node
	style:function style(elem,name,value,extra){ // Don't set styles on text and comment nodes
	if(!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style){return;} // Make sure that we're working with the right name
	var ret,type,hooks,origName=camelCase(name),isCustomProp=rcustomProp.test(name),style=elem.style; // Make sure that we're working with the right name. We don't
	// want to query the value if it is a CSS custom property
	// since they are user-defined.
	if(!isCustomProp){name = finalPropName(origName);} // Gets hook for the prefixed version, then unprefixed version
	hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]; // Check if we're setting a value
	if(value !== undefined){type = typeof value; // Convert "+=" or "-=" to relative numbers (#7345)
	if(type === "string" && (ret = rcssNum.exec(value)) && ret[1]){value = adjustCSS(elem,name,ret); // Fixes bug #9237
	type = "number";} // Make sure that null and NaN values aren't set (#7116)
	if(value == null || value !== value){return;} // If a number was passed in, add the unit (except for certain CSS properties)
	if(type === "number"){value += ret && ret[3] || (jQuery.cssNumber[origName]?"":"px");} // background-* props affect original clone's values
	if(!support.clearCloneStyle && value === "" && name.indexOf("background") === 0){style[name] = "inherit";} // If a hook was provided, use that value, otherwise just set the specified value
	if(!hooks || !("set" in hooks) || (value = hooks.set(elem,value,extra)) !== undefined){if(isCustomProp){style.setProperty(name,value);}else {style[name] = value;}}}else { // If a hook was provided get the non-computed value from there
	if(hooks && "get" in hooks && (ret = hooks.get(elem,false,extra)) !== undefined){return ret;} // Otherwise just get the value from the style object
	return style[name];}},css:function css(elem,name,extra,styles){var val,num,hooks,origName=camelCase(name),isCustomProp=rcustomProp.test(name); // Make sure that we're working with the right name. We don't
	// want to modify the value if it is a CSS custom property
	// since they are user-defined.
	if(!isCustomProp){name = finalPropName(origName);} // Try prefixed name followed by the unprefixed name
	hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]; // If a hook was provided get the computed value from there
	if(hooks && "get" in hooks){val = hooks.get(elem,true,extra);} // Otherwise, if a way to get the computed value exists, use that
	if(val === undefined){val = curCSS(elem,name,styles);} // Convert "normal" to computed value
	if(val === "normal" && name in cssNormalTransform){val = cssNormalTransform[name];} // Make numeric if forced or a qualifier was provided and val looks numeric
	if(extra === "" || extra){num = parseFloat(val);return extra === true || isFinite(num)?num || 0:val;}return val;}});jQuery.each(["height","width"],function(i,dimension){jQuery.cssHooks[dimension] = {get:function get(elem,computed,extra){if(computed){ // Certain elements can have dimension info if we invisibly show them
	// but it must have a current display style that would benefit
	return rdisplayswap.test(jQuery.css(elem,"display")) && ( // Support: Safari 8+
	// Table columns in Safari have non-zero offsetWidth & zero
	// getBoundingClientRect().width unless display is changed.
	// Support: IE <=11 only
	// Running getBoundingClientRect on a disconnected node
	// in IE throws an error.
	!elem.getClientRects().length || !elem.getBoundingClientRect().width)?swap(elem,cssShow,function(){return getWidthOrHeight(elem,dimension,extra);}):getWidthOrHeight(elem,dimension,extra);}},set:function set(elem,value,extra){var matches,styles=getStyles(elem),isBorderBox=jQuery.css(elem,"boxSizing",false,styles) === "border-box",subtract=extra && boxModelAdjustment(elem,dimension,extra,isBorderBox,styles); // Account for unreliable border-box dimensions by comparing offset* to computed and
	// faking a content-box to get border and padding (gh-3699)
	if(isBorderBox && support.scrollboxSize() === styles.position){subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem,dimension,"border",false,styles) - 0.5);} // Convert to pixels if value adjustment is needed
	if(subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px"){elem.style[dimension] = value;value = jQuery.css(elem,dimension);}return setPositiveNumber(elem,value,subtract);}};});jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft,function(elem,computed){if(computed){return (parseFloat(curCSS(elem,"marginLeft")) || elem.getBoundingClientRect().left - swap(elem,{marginLeft:0},function(){return elem.getBoundingClientRect().left;})) + "px";}}); // These hooks are used by animate to expand properties
	jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix + suffix] = {expand:function expand(value){var i=0,expanded={}, // Assumes a single number if not a string
	parts=typeof value === "string"?value.split(" "):[value];for(;i < 4;i++) {expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];}return expanded;}};if(prefix !== "margin"){jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;}});jQuery.fn.extend({css:function css(name,value){return access(this,function(elem,name,value){var styles,len,map={},i=0;if(Array.isArray(name)){styles = getStyles(elem);len = name.length;for(;i < len;i++) {map[name[i]] = jQuery.css(elem,name[i],false,styles);}return map;}return value !== undefined?jQuery.style(elem,name,value):jQuery.css(elem,name);},name,value,arguments.length > 1);}});function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing);}jQuery.Tween = Tween;Tween.prototype = {constructor:Tween,init:function init(elem,options,prop,end,easing,unit){this.elem = elem;this.prop = prop;this.easing = easing || jQuery.easing._default;this.options = options;this.start = this.now = this.cur();this.end = end;this.unit = unit || (jQuery.cssNumber[prop]?"":"px");},cur:function cur(){var hooks=Tween.propHooks[this.prop];return hooks && hooks.get?hooks.get(this):Tween.propHooks._default.get(this);},run:function run(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos = eased = jQuery.easing[this.easing](percent,this.options.duration * percent,0,1,this.options.duration);}else {this.pos = eased = percent;}this.now = (this.end - this.start) * eased + this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this);}if(hooks && hooks.set){hooks.set(this);}else {Tween.propHooks._default.set(this);}return this;}};Tween.prototype.init.prototype = Tween.prototype;Tween.propHooks = {_default:{get:function get(tween){var result; // Use a property on the element directly when it is not a DOM element,
	// or when there is no matching style property that exists.
	if(tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null){return tween.elem[tween.prop];} // Passing an empty string as a 3rd parameter to .css will automatically
	// attempt a parseFloat and fallback to a string if the parse fails.
	// Simple values such as "10px" are parsed to Float;
	// complex values such as "rotate(1rad)" are returned as-is.
	result = jQuery.css(tween.elem,tween.prop,""); // Empty strings, null, undefined and "auto" are converted to 0.
	return !result || result === "auto"?0:result;},set:function set(tween){ // Use step hook for back compat.
	// Use cssHook if its there.
	// Use .style if available and use plain properties where available.
	if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween);}else if(tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now + tween.unit);}else {tween.elem[tween.prop] = tween.now;}}}}; // Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {set:function set(tween){if(tween.elem.nodeType && tween.elem.parentNode){tween.elem[tween.prop] = tween.now;}}};jQuery.easing = {linear:function linear(p){return p;},swing:function swing(p){return 0.5 - Math.cos(p * Math.PI) / 2;},_default:"swing"};jQuery.fx = Tween.prototype.init; // Back compat <1.8 extension point
	jQuery.fx.step = {};var fxNow,inProgress,rfxtypes=/^(?:toggle|show|hide)$/,rrun=/queueHooks$/;function schedule(){if(inProgress){if(document.hidden === false && window.requestAnimationFrame){window.requestAnimationFrame(schedule);}else {window.setTimeout(schedule,jQuery.fx.interval);}jQuery.fx.tick();}} // Animations created synchronously will run synchronously
	function createFxNow(){window.setTimeout(function(){fxNow = undefined;});return fxNow = Date.now();} // Generate parameters to create a standard animation
	function genFx(type,includeWidth){var which,i=0,attrs={height:type}; // If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth?1:0;for(;i < 4;i += 2 - includeWidth) {which = cssExpand[i];attrs["margin" + which] = attrs["padding" + which] = type;}if(includeWidth){attrs.opacity = attrs.width = type;}return attrs;}function createTween(value,prop,animation){var tween,collection=(Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),index=0,length=collection.length;for(;index < length;index++) {if(tween = collection[index].call(animation,prop,value)){ // We're done with this property
	return tween;}}}function defaultPrefilter(elem,props,opts){var prop,value,toggle,hooks,oldfire,propTween,restoreDisplay,display,isBox="width" in props || "height" in props,anim=this,orig={},style=elem.style,hidden=elem.nodeType && isHiddenWithinTree(elem),dataShow=dataPriv.get(elem,"fxshow"); // Queue-skipping animations hijack the fx hooks
	if(!opts.queue){hooks = jQuery._queueHooks(elem,"fx");if(hooks.unqueued == null){hooks.unqueued = 0;oldfire = hooks.empty.fire;hooks.empty.fire = function(){if(!hooks.unqueued){oldfire();}};}hooks.unqueued++;anim.always(function(){ // Ensure the complete handler is called before this completes
	anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire();}});});} // Detect show/hide animations
	for(prop in props) {value = props[prop];if(rfxtypes.test(value)){delete props[prop];toggle = toggle || value === "toggle";if(value === (hidden?"hide":"show")){ // Pretend to be hidden if this is a "show" and
	// there is still data from a stopped show/hide
	if(value === "show" && dataShow && dataShow[prop] !== undefined){hidden = true; // Ignore all other no-op show/hide data
	}else {continue;}}orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem,prop);}} // Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject(props);if(!propTween && jQuery.isEmptyObject(orig)){return;} // Restrict "overflow" and "display" styles during box animations
	if(isBox && elem.nodeType === 1){ // Support: IE <=9 - 11, Edge 12 - 15
	// Record all 3 overflow attributes because IE does not infer the shorthand
	// from identically-valued overflowX and overflowY and Edge just mirrors
	// the overflowX value there.
	opts.overflow = [style.overflow,style.overflowX,style.overflowY]; // Identify a display type, preferring old show/hide data over the CSS cascade
	restoreDisplay = dataShow && dataShow.display;if(restoreDisplay == null){restoreDisplay = dataPriv.get(elem,"display");}display = jQuery.css(elem,"display");if(display === "none"){if(restoreDisplay){display = restoreDisplay;}else { // Get nonempty value(s) by temporarily forcing visibility
	showHide([elem],true);restoreDisplay = elem.style.display || restoreDisplay;display = jQuery.css(elem,"display");showHide([elem]);}} // Animate inline elements as inline-block
	if(display === "inline" || display === "inline-block" && restoreDisplay != null){if(jQuery.css(elem,"float") === "none"){ // Restore the original display value at the end of pure show/hide animations
	if(!propTween){anim.done(function(){style.display = restoreDisplay;});if(restoreDisplay == null){display = style.display;restoreDisplay = display === "none"?"":display;}}style.display = "inline-block";}}}if(opts.overflow){style.overflow = "hidden";anim.always(function(){style.overflow = opts.overflow[0];style.overflowX = opts.overflow[1];style.overflowY = opts.overflow[2];});} // Implement show/hide animations
	propTween = false;for(prop in orig) { // General show/hide setup for this element animation
	if(!propTween){if(dataShow){if("hidden" in dataShow){hidden = dataShow.hidden;}}else {dataShow = dataPriv.access(elem,"fxshow",{display:restoreDisplay});} // Store hidden/visible for toggle so `.stop().toggle()` "reverses"
	if(toggle){dataShow.hidden = !hidden;} // Show elements before animating them
	if(hidden){showHide([elem],true);} /* eslint-disable no-loop-func */anim.done(function(){ /* eslint-enable no-loop-func */ // The final step of a "hide" animation is actually hiding the element
	if(!hidden){showHide([elem]);}dataPriv.remove(elem,"fxshow");for(prop in orig) {jQuery.style(elem,prop,orig[prop]);}});} // Per-property setup
	propTween = createTween(hidden?dataShow[prop]:0,prop,anim);if(!(prop in dataShow)){dataShow[prop] = propTween.start;if(hidden){propTween.end = propTween.start;propTween.start = 0;}}}}function propFilter(props,specialEasing){var index,name,easing,value,hooks; // camelCase, specialEasing and expand cssHook pass
	for(index in props) {name = camelCase(index);easing = specialEasing[name];value = props[index];if(Array.isArray(value)){easing = value[1];value = props[index] = value[0];}if(index !== name){props[name] = value;delete props[index];}hooks = jQuery.cssHooks[name];if(hooks && "expand" in hooks){value = hooks.expand(value);delete props[name]; // Not quite $.extend, this won't overwrite existing keys.
	// Reusing 'index' because we have the correct "name"
	for(index in value) {if(!(index in props)){props[index] = value[index];specialEasing[index] = easing;}}}else {specialEasing[name] = easing;}}}function Animation(elem,properties,options){var result,stopped,index=0,length=Animation.prefilters.length,deferred=jQuery.Deferred().always(function(){ // Don't match elem in the :animated selector
	delete tick.elem;}),tick=function tick(){if(stopped){return false;}var currentTime=fxNow || createFxNow(),remaining=Math.max(0,animation.startTime + animation.duration - currentTime), // Support: Android 2.3 only
	// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
	temp=remaining / animation.duration || 0,percent=1 - temp,index=0,length=animation.tweens.length;for(;index < length;index++) {animation.tweens[index].run(percent);}deferred.notifyWith(elem,[animation,percent,remaining]); // If there's more to do, yield
	if(percent < 1 && length){return remaining;} // If this was an empty animation, synthesize a final progress notification
	if(!length){deferred.notifyWith(elem,[animation,1,0]);} // Resolve the animation and report its conclusion
	deferred.resolveWith(elem,[animation]);return false;},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{},easing:jQuery.easing._default},options),originalProperties:properties,originalOptions:options,startTime:fxNow || createFxNow(),duration:options.duration,tweens:[],createTween:function createTween(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop] || animation.opts.easing);animation.tweens.push(tween);return tween;},stop:function stop(gotoEnd){var index=0, // If we are going to the end, we want to run all the tweens
	// otherwise we skip this part
	length=gotoEnd?animation.tweens.length:0;if(stopped){return this;}stopped = true;for(;index < length;index++) {animation.tweens[index].run(1);} // Resolve when we played the last frame; otherwise, reject
	if(gotoEnd){deferred.notifyWith(elem,[animation,1,0]);deferred.resolveWith(elem,[animation,gotoEnd]);}else {deferred.rejectWith(elem,[animation,gotoEnd]);}return this;}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index < length;index++) {result = Animation.prefilters[index].call(animation,elem,props,animation.opts);if(result){if(isFunction(result.stop)){jQuery._queueHooks(animation.elem,animation.opts.queue).stop = result.stop.bind(result);}return result;}}jQuery.map(props,createTween,animation);if(isFunction(animation.opts.start)){animation.opts.start.call(elem,animation);} // Attach callbacks from options
	animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue}));return animation;}jQuery.Animation = jQuery.extend(Animation,{tweeners:{"*":[function(prop,value){var tween=this.createTween(prop,value);adjustCSS(tween.elem,prop,rcssNum.exec(value),tween);return tween;}]},tweener:function tweener(props,callback){if(isFunction(props)){callback = props;props = ["*"];}else {props = props.match(rnothtmlwhite);}var prop,index=0,length=props.length;for(;index < length;index++) {prop = props[index];Animation.tweeners[prop] = Animation.tweeners[prop] || [];Animation.tweeners[prop].unshift(callback);}},prefilters:[defaultPrefilter],prefilter:function prefilter(callback,prepend){if(prepend){Animation.prefilters.unshift(callback);}else {Animation.prefilters.push(callback);}}});jQuery.speed = function(speed,easing,fn){var opt=speed && typeof speed === "object"?jQuery.extend({},speed):{complete:fn || !fn && easing || isFunction(speed) && speed,duration:speed,easing:fn && easing || easing && !isFunction(easing) && easing}; // Go to the end state if fx are off
	if(jQuery.fx.off){opt.duration = 0;}else {if(typeof opt.duration !== "number"){if(opt.duration in jQuery.fx.speeds){opt.duration = jQuery.fx.speeds[opt.duration];}else {opt.duration = jQuery.fx.speeds._default;}}} // Normalize opt.queue - true/undefined/null -> "fx"
	if(opt.queue == null || opt.queue === true){opt.queue = "fx";} // Queueing
	opt.old = opt.complete;opt.complete = function(){if(isFunction(opt.old)){opt.old.call(this);}if(opt.queue){jQuery.dequeue(this,opt.queue);}};return opt;};jQuery.fn.extend({fadeTo:function fadeTo(speed,to,easing,callback){ // Show any hidden elements after setting opacity to 0
	return this.filter(isHiddenWithinTree).css("opacity",0).show() // Animate to the value specified
	.end().animate({opacity:to},speed,easing,callback);},animate:function animate(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function doAnimation(){ // Operate on a copy of prop so per-property easing won't be lost
	var anim=Animation(this,jQuery.extend({},prop),optall); // Empty animations, or finishing resolves immediately
	if(empty || dataPriv.get(this,"finish")){anim.stop(true);}};doAnimation.finish = doAnimation;return empty || optall.queue === false?this.each(doAnimation):this.queue(optall.queue,doAnimation);},stop:function stop(type,clearQueue,gotoEnd){var stopQueue=function stopQueue(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd);};if(typeof type !== "string"){gotoEnd = clearQueue;clearQueue = type;type = undefined;}if(clearQueue && type !== false){this.queue(type || "fx",[]);}return this.each(function(){var dequeue=true,index=type != null && type + "queueHooks",timers=jQuery.timers,data=dataPriv.get(this);if(index){if(data[index] && data[index].stop){stopQueue(data[index]);}}else {for(index in data) {if(data[index] && data[index].stop && rrun.test(index)){stopQueue(data[index]);}}}for(index = timers.length;index--;) {if(timers[index].elem === this && (type == null || timers[index].queue === type)){timers[index].anim.stop(gotoEnd);dequeue = false;timers.splice(index,1);}} // Start the next in the queue if the last step wasn't forced.
	// Timers currently will call their complete callbacks, which
	// will dequeue but only if they were gotoEnd.
	if(dequeue || !gotoEnd){jQuery.dequeue(this,type);}});},finish:function finish(type){if(type !== false){type = type || "fx";}return this.each(function(){var index,data=dataPriv.get(this),queue=data[type + "queue"],hooks=data[type + "queueHooks"],timers=jQuery.timers,length=queue?queue.length:0; // Enable finishing flag on private data
	data.finish = true; // Empty the queue first
	jQuery.queue(this,type,[]);if(hooks && hooks.stop){hooks.stop.call(this,true);} // Look for any active animations, and finish them
	for(index = timers.length;index--;) {if(timers[index].elem === this && timers[index].queue === type){timers[index].anim.stop(true);timers.splice(index,1);}} // Look for any animations in the old queue and finish them
	for(index = 0;index < length;index++) {if(queue[index] && queue[index].finish){queue[index].finish.call(this);}} // Turn off finishing flag
	delete data.finish;});}});jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name] = function(speed,easing,callback){return speed == null || typeof speed === "boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback);};}); // Generate shortcuts for custom animations
	jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name] = function(speed,easing,callback){return this.animate(props,speed,easing,callback);};});jQuery.timers = [];jQuery.fx.tick = function(){var timer,i=0,timers=jQuery.timers;fxNow = Date.now();for(;i < timers.length;i++) {timer = timers[i]; // Run the timer and safely remove it when done (allowing for external removal)
	if(!timer() && timers[i] === timer){timers.splice(i--,1);}}if(!timers.length){jQuery.fx.stop();}fxNow = undefined;};jQuery.fx.timer = function(timer){jQuery.timers.push(timer);jQuery.fx.start();};jQuery.fx.interval = 13;jQuery.fx.start = function(){if(inProgress){return;}inProgress = true;schedule();};jQuery.fx.stop = function(){inProgress = null;};jQuery.fx.speeds = {slow:600,fast:200, // Default speed
	_default:400}; // Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function(time,type){time = jQuery.fx?jQuery.fx.speeds[time] || time:time;type = type || "fx";return this.queue(type,function(next,hooks){var timeout=window.setTimeout(next,time);hooks.stop = function(){window.clearTimeout(timeout);};});};(function(){var input=document.createElement("input"),select=document.createElement("select"),opt=select.appendChild(document.createElement("option"));input.type = "checkbox"; // Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== ""; // Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected; // Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement("input");input.value = "t";input.type = "radio";support.radioValue = input.value === "t";})();var boolHook,attrHandle=jQuery.expr.attrHandle;jQuery.fn.extend({attr:function attr(name,value){return access(this,jQuery.attr,name,value,arguments.length > 1);},removeAttr:function removeAttr(name){return this.each(function(){jQuery.removeAttr(this,name);});}});jQuery.extend({attr:function attr(elem,name,value){var ret,hooks,nType=elem.nodeType; // Don't get/set attributes on text, comment and attribute nodes
	if(nType === 3 || nType === 8 || nType === 2){return;} // Fallback to prop when attributes are not supported
	if(typeof elem.getAttribute === "undefined"){return jQuery.prop(elem,name,value);} // Attribute hooks are determined by the lowercase version
	// Grab necessary hook if one is defined
	if(nType !== 1 || !jQuery.isXMLDoc(elem)){hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name)?boolHook:undefined);}if(value !== undefined){if(value === null){jQuery.removeAttr(elem,name);return;}if(hooks && "set" in hooks && (ret = hooks.set(elem,value,name)) !== undefined){return ret;}elem.setAttribute(name,value + "");return value;}if(hooks && "get" in hooks && (ret = hooks.get(elem,name)) !== null){return ret;}ret = jQuery.find.attr(elem,name); // Non-existent attributes return null, we normalize to undefined
	return ret == null?undefined:ret;},attrHooks:{type:{set:function set(elem,value){if(!support.radioValue && value === "radio" && nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val){elem.value = val;}return value;}}}},removeAttr:function removeAttr(elem,value){var name,i=0, // Attribute names can contain non-HTML whitespace characters
	// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
	attrNames=value && value.match(rnothtmlwhite);if(attrNames && elem.nodeType === 1){while(name = attrNames[i++]) {elem.removeAttribute(name);}}}}); // Hooks for boolean attributes
	boolHook = {set:function set(elem,value,name){if(value === false){ // Remove boolean attributes when set to false
	jQuery.removeAttr(elem,name);}else {elem.setAttribute(name,name);}return name;}};jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),function(i,name){var getter=attrHandle[name] || jQuery.find.attr;attrHandle[name] = function(elem,name,isXML){var ret,handle,lowercaseName=name.toLowerCase();if(!isXML){ // Avoid an infinite loop by temporarily removing this function from the getter
	handle = attrHandle[lowercaseName];attrHandle[lowercaseName] = ret;ret = getter(elem,name,isXML) != null?lowercaseName:null;attrHandle[lowercaseName] = handle;}return ret;};});var rfocusable=/^(?:input|select|textarea|button)$/i,rclickable=/^(?:a|area)$/i;jQuery.fn.extend({prop:function prop(name,value){return access(this,jQuery.prop,name,value,arguments.length > 1);},removeProp:function removeProp(name){return this.each(function(){delete this[jQuery.propFix[name] || name];});}});jQuery.extend({prop:function prop(elem,name,value){var ret,hooks,nType=elem.nodeType; // Don't get/set properties on text, comment and attribute nodes
	if(nType === 3 || nType === 8 || nType === 2){return;}if(nType !== 1 || !jQuery.isXMLDoc(elem)){ // Fix name and attach hooks
	name = jQuery.propFix[name] || name;hooks = jQuery.propHooks[name];}if(value !== undefined){if(hooks && "set" in hooks && (ret = hooks.set(elem,value,name)) !== undefined){return ret;}return elem[name] = value;}if(hooks && "get" in hooks && (ret = hooks.get(elem,name)) !== null){return ret;}return elem[name];},propHooks:{tabIndex:{get:function get(elem){ // Support: IE <=9 - 11 only
	// elem.tabIndex doesn't always return the
	// correct value when it hasn't been explicitly set
	// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
	// Use proper attribute retrieval(#12072)
	var tabindex=jQuery.find.attr(elem,"tabindex");if(tabindex){return parseInt(tabindex,10);}if(rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href){return 0;}return -1;}}},propFix:{"for":"htmlFor","class":"className"}}); // Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if(!support.optSelected){jQuery.propHooks.selected = {get:function get(elem){ /* eslint no-unused-expressions: "off" */var parent=elem.parentNode;if(parent && parent.parentNode){parent.parentNode.selectedIndex;}return null;},set:function set(elem){ /* eslint no-unused-expressions: "off" */var parent=elem.parentNode;if(parent){parent.selectedIndex;if(parent.parentNode){parent.parentNode.selectedIndex;}}}};}jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()] = this;}); // Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse(value){var tokens=value.match(rnothtmlwhite) || [];return tokens.join(" ");}function getClass(elem){return elem.getAttribute && elem.getAttribute("class") || "";}function classesToArray(value){if(Array.isArray(value)){return value;}if(typeof value === "string"){return value.match(rnothtmlwhite) || [];}return [];}jQuery.fn.extend({addClass:function addClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,getClass(this)));});}classes = classesToArray(value);if(classes.length){while(elem = this[i++]) {curValue = getClass(elem);cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";if(cur){j = 0;while(clazz = classes[j++]) {if(cur.indexOf(" " + clazz + " ") < 0){cur += clazz + " ";}} // Only assign if different to avoid unneeded rendering.
	finalValue = stripAndCollapse(cur);if(curValue !== finalValue){elem.setAttribute("class",finalValue);}}}}return this;},removeClass:function removeClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,getClass(this)));});}if(!arguments.length){return this.attr("class","");}classes = classesToArray(value);if(classes.length){while(elem = this[i++]) {curValue = getClass(elem); // This expression is here for better compressibility (see addClass)
	cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";if(cur){j = 0;while(clazz = classes[j++]) { // Remove *all* instances
	while(cur.indexOf(" " + clazz + " ") > -1) {cur = cur.replace(" " + clazz + " "," ");}} // Only assign if different to avoid unneeded rendering.
	finalValue = stripAndCollapse(cur);if(curValue !== finalValue){elem.setAttribute("class",finalValue);}}}}return this;},toggleClass:function toggleClass(value,stateVal){var type=typeof value,isValidValue=type === "string" || Array.isArray(value);if(typeof stateVal === "boolean" && isValidValue){return stateVal?this.addClass(value):this.removeClass(value);}if(isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,getClass(this),stateVal),stateVal);});}return this.each(function(){var className,i,self,classNames;if(isValidValue){ // Toggle individual class names
	i = 0;self = jQuery(this);classNames = classesToArray(value);while(className = classNames[i++]) { // Check each className given, space separated list
	if(self.hasClass(className)){self.removeClass(className);}else {self.addClass(className);}} // Toggle whole class name
	}else if(value === undefined || type === "boolean"){className = getClass(this);if(className){ // Store className if set
	dataPriv.set(this,"__className__",className);} // If the element has a class name or if we're passed `false`,
	// then remove the whole classname (if there was one, the above saved it).
	// Otherwise bring back whatever was previously saved (if anything),
	// falling back to the empty string if nothing was stored.
	if(this.setAttribute){this.setAttribute("class",className || value === false?"":dataPriv.get(this,"__className__") || "");}}});},hasClass:function hasClass(selector){var className,elem,i=0;className = " " + selector + " ";while(elem = this[i++]) {if(elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1){return true;}}return false;}});var rreturn=/\r/g;jQuery.fn.extend({val:function val(value){var hooks,ret,valueIsFunction,elem=this[0];if(!arguments.length){if(elem){hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks && "get" in hooks && (ret = hooks.get(elem,"value")) !== undefined){return ret;}ret = elem.value; // Handle most common string cases
	if(typeof ret === "string"){return ret.replace(rreturn,"");} // Handle cases where value is null/undef or number
	return ret == null?"":ret;}return;}valueIsFunction = isFunction(value);return this.each(function(i){var val;if(this.nodeType !== 1){return;}if(valueIsFunction){val = value.call(this,i,jQuery(this).val());}else {val = value;} // Treat null/undefined as ""; convert numbers to string
	if(val == null){val = "";}else if(typeof val === "number"){val += "";}else if(Array.isArray(val)){val = jQuery.map(val,function(value){return value == null?"":value + "";});}hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]; // If set returns undefined, fall back to normal setting
	if(!hooks || !("set" in hooks) || hooks.set(this,val,"value") === undefined){this.value = val;}});}});jQuery.extend({valHooks:{option:{get:function get(elem){var val=jQuery.find.attr(elem,"value");return val != null?val: // Support: IE <=10 - 11 only
	// option.text throws exceptions (#14686, #14858)
	// Strip and collapse whitespace
	// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
	stripAndCollapse(jQuery.text(elem));}},select:{get:function get(elem){var value,option,i,options=elem.options,index=elem.selectedIndex,one=elem.type === "select-one",values=one?null:[],max=one?index + 1:options.length;if(index < 0){i = max;}else {i = one?index:0;} // Loop through all the selected options
	for(;i < max;i++) {option = options[i]; // Support: IE <=9 only
	// IE8-9 doesn't update selected after form reset (#2551)
	if((option.selected || i === index) &&  // Don't return options that are disabled or in a disabled optgroup
	!option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode,"optgroup"))){ // Get the specific value for the option
	value = jQuery(option).val(); // We don't need an array for one selects
	if(one){return value;} // Multi-Selects return an array
	values.push(value);}}return values;},set:function set(elem,value){var optionSet,option,options=elem.options,values=jQuery.makeArray(value),i=options.length;while(i--) {option = options[i]; /* eslint-disable no-cond-assign */if(option.selected = jQuery.inArray(jQuery.valHooks.option.get(option),values) > -1){optionSet = true;} /* eslint-enable no-cond-assign */} // Force browsers to behave consistently when non-matching value is set
	if(!optionSet){elem.selectedIndex = -1;}return values;}}}}); // Radios and checkboxes getter/setter
	jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this] = {set:function set(elem,value){if(Array.isArray(value)){return elem.checked = jQuery.inArray(jQuery(elem).val(),value) > -1;}}};if(!support.checkOn){jQuery.valHooks[this].get = function(elem){return elem.getAttribute("value") === null?"on":elem.value;};}}); // Return jQuery for attributes-only inclusion
	support.focusin = "onfocusin" in window;var rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,stopPropagationCallback=function stopPropagationCallback(e){e.stopPropagation();};jQuery.extend(jQuery.event,{trigger:function trigger(event,data,elem,onlyHandlers){var i,cur,tmp,bubbleType,ontype,handle,special,lastElement,eventPath=[elem || document],type=hasOwn.call(event,"type")?event.type:event,namespaces=hasOwn.call(event,"namespace")?event.namespace.split("."):[];cur = lastElement = tmp = elem = elem || document; // Don't do events on text and comment nodes
	if(elem.nodeType === 3 || elem.nodeType === 8){return;} // focus/blur morphs to focusin/out; ensure we're not firing them right now
	if(rfocusMorph.test(type + jQuery.event.triggered)){return;}if(type.indexOf(".") > -1){ // Namespaced trigger; create a regexp to match event type in handle()
	namespaces = type.split(".");type = namespaces.shift();namespaces.sort();}ontype = type.indexOf(":") < 0 && "on" + type; // Caller can pass in a jQuery.Event object, Object, or just an event type string
	event = event[jQuery.expando]?event:new jQuery.Event(type,typeof event === "object" && event); // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
	event.isTrigger = onlyHandlers?2:3;event.namespace = namespaces.join(".");event.rnamespace = event.namespace?new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"):null; // Clean up the event in case it is being reused
	event.result = undefined;if(!event.target){event.target = elem;} // Clone any incoming data and prepend the event, creating the handler arg list
	data = data == null?[event]:jQuery.makeArray(data,[event]); // Allow special events to draw outside the lines
	special = jQuery.event.special[type] || {};if(!onlyHandlers && special.trigger && special.trigger.apply(elem,data) === false){return;} // Determine event propagation path in advance, per W3C events spec (#9951)
	// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
	if(!onlyHandlers && !special.noBubble && !isWindow(elem)){bubbleType = special.delegateType || type;if(!rfocusMorph.test(bubbleType + type)){cur = cur.parentNode;}for(;cur;cur = cur.parentNode) {eventPath.push(cur);tmp = cur;} // Only add window if we got to document (e.g., not plain obj or detached DOM)
	if(tmp === (elem.ownerDocument || document)){eventPath.push(tmp.defaultView || tmp.parentWindow || window);}} // Fire handlers on the event path
	i = 0;while((cur = eventPath[i++]) && !event.isPropagationStopped()) {lastElement = cur;event.type = i > 1?bubbleType:special.bindType || type; // jQuery handler
	handle = (dataPriv.get(cur,"events") || {})[event.type] && dataPriv.get(cur,"handle");if(handle){handle.apply(cur,data);} // Native handler
	handle = ontype && cur[ontype];if(handle && handle.apply && acceptData(cur)){event.result = handle.apply(cur,data);if(event.result === false){event.preventDefault();}}}event.type = type; // If nobody prevented the default action, do it now
	if(!onlyHandlers && !event.isDefaultPrevented()){if((!special._default || special._default.apply(eventPath.pop(),data) === false) && acceptData(elem)){ // Call a native DOM method on the target with the same name as the event.
	// Don't do default actions on window, that's where global variables be (#6170)
	if(ontype && isFunction(elem[type]) && !isWindow(elem)){ // Don't re-trigger an onFOO event when we call its FOO() method
	tmp = elem[ontype];if(tmp){elem[ontype] = null;} // Prevent re-triggering of the same event, since we already bubbled it above
	jQuery.event.triggered = type;if(event.isPropagationStopped()){lastElement.addEventListener(type,stopPropagationCallback);}elem[type]();if(event.isPropagationStopped()){lastElement.removeEventListener(type,stopPropagationCallback);}jQuery.event.triggered = undefined;if(tmp){elem[ontype] = tmp;}}}}return event.result;}, // Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate:function simulate(type,elem,event){var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true});jQuery.event.trigger(e,null,elem);}});jQuery.fn.extend({trigger:function trigger(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function triggerHandler(type,data){var elem=this[0];if(elem){return jQuery.event.trigger(type,data,elem,true);}}}); // Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if(!support.focusin){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){ // Attach a single capturing handler on the document while someone wants focusin/focusout
	var handler=function handler(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event));};jQuery.event.special[fix] = {setup:function setup(){var doc=this.ownerDocument || this,attaches=dataPriv.access(doc,fix);if(!attaches){doc.addEventListener(orig,handler,true);}dataPriv.access(doc,fix,(attaches || 0) + 1);},teardown:function teardown(){var doc=this.ownerDocument || this,attaches=dataPriv.access(doc,fix) - 1;if(!attaches){doc.removeEventListener(orig,handler,true);dataPriv.remove(doc,fix);}else {dataPriv.access(doc,fix,attaches);}}};});}var location=window.location;var nonce=Date.now();var rquery=/\?/; // Cross-browser xml parsing
	jQuery.parseXML = function(data){var xml;if(!data || typeof data !== "string"){return null;} // Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try{xml = new window.DOMParser().parseFromString(data,"text/xml");}catch(e) {xml = undefined;}if(!xml || xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: " + data);}return xml;};var rbracket=/\[\]$/,rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;function buildParams(prefix,obj,traditional,add){var name;if(Array.isArray(obj)){ // Serialize array item.
	jQuery.each(obj,function(i,v){if(traditional || rbracket.test(prefix)){ // Treat each array item as a scalar.
	add(prefix,v);}else { // Item is non-scalar (array or object), encode its numeric index.
	buildParams(prefix + "[" + (typeof v === "object" && v != null?i:"") + "]",v,traditional,add);}});}else if(!traditional && toType(obj) === "object"){ // Serialize object item.
	for(name in obj) {buildParams(prefix + "[" + name + "]",obj[name],traditional,add);}}else { // Serialize scalar item.
	add(prefix,obj);}} // Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function(a,traditional){var prefix,s=[],add=function add(key,valueOrFunction){ // If value is a function, invoke it and use its return value
	var value=isFunction(valueOrFunction)?valueOrFunction():valueOrFunction;s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null?"":value);}; // If an array was passed in, assume that it is an array of form elements.
	if(Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)){ // Serialize the form elements
	jQuery.each(a,function(){add(this.name,this.value);});}else { // If traditional, encode the "old" way (the way 1.3.2 or older
	// did it), otherwise encode params recursively.
	for(prefix in a) {buildParams(prefix,a[prefix],traditional,add);}} // Return the resulting serialization
	return s.join("&");};jQuery.fn.extend({serialize:function serialize(){return jQuery.param(this.serializeArray());},serializeArray:function serializeArray(){return this.map(function(){ // Can add propHook for "elements" to filter or add form elements
	var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this;}).filter(function(){var type=this.type; // Use .is( ":disabled" ) so that fieldset[disabled] works
	return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));}).map(function(i,elem){var val=jQuery(this).val();if(val == null){return null;}if(Array.isArray(val)){return jQuery.map(val,function(val){return {name:elem.name,value:val.replace(rCRLF,"\r\n")};});}return {name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}});var r20=/%20/g,rhash=/#.*$/,rantiCache=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)$/mg, // #7653, #8125, #8152: local protocol detection
	rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//, /* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */prefilters={}, /* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */transports={}, // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes="*/".concat("*"), // Anchor tag for parsing the document origin
	originAnchor=document.createElement("a");originAnchor.href = location.href; // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure){ // dataTypeExpression is optional and defaults to "*"
	return function(dataTypeExpression,func){if(typeof dataTypeExpression !== "string"){func = dataTypeExpression;dataTypeExpression = "*";}var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];if(isFunction(func)){ // For each dataType in the dataTypeExpression
	while(dataType = dataTypes[i++]) { // Prepend if requested
	if(dataType[0] === "+"){dataType = dataType.slice(1) || "*";(structure[dataType] = structure[dataType] || []).unshift(func); // Otherwise append
	}else {(structure[dataType] = structure[dataType] || []).push(func);}}}};} // Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=structure === transports;function inspect(dataType){var selected;inspected[dataType] = true;jQuery.each(structure[dataType] || [],function(_,prefilterOrFactory){var dataTypeOrTransport=prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false;}else if(seekingTransport){return !(selected = dataTypeOrTransport);}});return selected;}return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");} // A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions || {};for(key in src) {if(src[key] !== undefined){(flatOptions[key]?target:deep || (deep = {}))[key] = src[key];}}if(deep){jQuery.extend(true,target,deep);}return target;} /* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes; // Remove auto dataType and get content-type in the process
	while(dataTypes[0] === "*") {dataTypes.shift();if(ct === undefined){ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");}} // Check if we're dealing with a known content-type
	if(ct){for(type in contents) {if(contents[type] && contents[type].test(ct)){dataTypes.unshift(type);break;}}} // Check to see if we have a response for the expected dataType
	if(dataTypes[0] in responses){finalDataType = dataTypes[0];}else { // Try convertible dataTypes
	for(type in responses) {if(!dataTypes[0] || s.converters[type + " " + dataTypes[0]]){finalDataType = type;break;}if(!firstDataType){firstDataType = type;}} // Or just use first one
	finalDataType = finalDataType || firstDataType;} // If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if(finalDataType){if(finalDataType !== dataTypes[0]){dataTypes.unshift(finalDataType);}return responses[finalDataType];}} /* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */function ajaxConvert(s,response,jqXHR,isSuccess){var conv2,current,conv,tmp,prev,converters={}, // Work with a copy of dataTypes in case we need to modify it for conversion
	dataTypes=s.dataTypes.slice(); // Create converters map with lowercased keys
	if(dataTypes[1]){for(conv in s.converters) {converters[conv.toLowerCase()] = s.converters[conv];}}current = dataTypes.shift(); // Convert to each sequential dataType
	while(current) {if(s.responseFields[current]){jqXHR[s.responseFields[current]] = response;} // Apply the dataFilter if provided
	if(!prev && isSuccess && s.dataFilter){response = s.dataFilter(response,s.dataType);}prev = current;current = dataTypes.shift();if(current){ // There's only work to do if current dataType is non-auto
	if(current === "*"){current = prev; // Convert response if prev dataType is non-auto and differs from current
	}else if(prev !== "*" && prev !== current){ // Seek a direct converter
	conv = converters[prev + " " + current] || converters["* " + current]; // If none found, seek a pair
	if(!conv){for(conv2 in converters) { // If conv2 outputs current
	tmp = conv2.split(" ");if(tmp[1] === current){ // If prev can be converted to accepted input
	conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];if(conv){ // Condense equivalence converters
	if(conv === true){conv = converters[conv2]; // Otherwise, insert the intermediate dataType
	}else if(converters[conv2] !== true){current = tmp[0];dataTypes.unshift(tmp[1]);}break;}}}} // Apply converter (if not an equivalence)
	if(conv !== true){ // Unless errors are allowed to bubble, catch and return them
	if(conv && s.throws){response = conv(response);}else {try{response = conv(response);}catch(e) {return {state:"parsererror",error:conv?e:"No conversion from " + prev + " to " + current};}}}}}}return {state:"success",data:response};}jQuery.extend({ // Counter for holding the number of active queries
	active:0, // Last-Modified header cache for next request
	lastModified:{},etag:{},ajaxSettings:{url:location.href,type:"GET",isLocal:rlocalProtocol.test(location.protocol),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8", /*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"}, // Data converters
	// Keys separate source (or catchall "*") and destination types with a single space
	converters:{ // Convert anything to text
	"* text":String, // Text to html (true = no transformation)
	"text html":true, // Evaluate text as a json expression
	"text json":JSON.parse, // Parse text as xml
	"text xml":jQuery.parseXML}, // For options that shouldn't be deep extended:
	// you can add your own custom options here if
	// and when you create one that shouldn't be
	// deep extended (see ajaxExtend)
	flatOptions:{url:true,context:true}}, // Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup:function ajaxSetup(target,settings){return settings? // Building a settings object
	ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings): // Extending ajaxSettings
	ajaxExtend(jQuery.ajaxSettings,target);},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports), // Main method
	ajax:function ajax(url,options){ // If url is an object, simulate pre-1.5 signature
	if(typeof url === "object"){options = url;url = undefined;} // Force options to be an object
	options = options || {};var transport, // URL without anti-cache param
	cacheURL, // Response headers
	responseHeadersString,responseHeaders, // timeout handle
	timeoutTimer, // Url cleanup var
	urlAnchor, // Request state (becomes false upon send and true upon completion)
	completed, // To know if global events are to be dispatched
	fireGlobals, // Loop variable
	i, // uncached part of the url
	uncached, // Create the final options object
	s=jQuery.ajaxSetup({},options), // Callbacks context
	callbackContext=s.context || s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
	globalEventContext=s.context && (callbackContext.nodeType || callbackContext.jquery)?jQuery(callbackContext):jQuery.event, // Deferreds
	deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"), // Status-dependent callbacks
	_statusCode=s.statusCode || {}, // Headers (they are sent all at once)
	requestHeaders={},requestHeadersNames={}, // Default abort message
	strAbort="canceled", // Fake xhr
	jqXHR={readyState:0, // Builds headers hashtable if needed
	getResponseHeader:function getResponseHeader(key){var match;if(completed){if(!responseHeaders){responseHeaders = {};while(match = rheaders.exec(responseHeadersString)) {responseHeaders[match[1].toLowerCase()] = match[2];}}match = responseHeaders[key.toLowerCase()];}return match == null?null:match;}, // Raw string
	getAllResponseHeaders:function getAllResponseHeaders(){return completed?responseHeadersString:null;}, // Caches the header
	setRequestHeader:function setRequestHeader(name,value){if(completed == null){name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;requestHeaders[name] = value;}return this;}, // Overrides response content-type header
	overrideMimeType:function overrideMimeType(type){if(completed == null){s.mimeType = type;}return this;}, // Status-dependent callbacks
	statusCode:function statusCode(map){var code;if(map){if(completed){ // Execute the appropriate callbacks
	jqXHR.always(map[jqXHR.status]);}else { // Lazy-add the new callbacks in a way that preserves old ones
	for(code in map) {_statusCode[code] = [_statusCode[code],map[code]];}}}return this;}, // Cancel the request
	abort:function abort(statusText){var finalText=statusText || strAbort;if(transport){transport.abort(finalText);}done(0,finalText);return this;}}; // Attach deferreds
	deferred.promise(jqXHR); // Add protocol if not provided (prefilters might expect it)
	// Handle falsy url in the settings object (#10093: consistency with old signature)
	// We also use the url parameter if available
	s.url = ((url || s.url || location.href) + "").replace(rprotocol,location.protocol + "//"); // Alias method option to type as per ticket #12004
	s.type = options.method || options.type || s.method || s.type; // Extract dataTypes list
	s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""]; // A cross-domain request is in order when the origin doesn't match the current origin.
	if(s.crossDomain == null){urlAnchor = document.createElement("a"); // Support: IE <=8 - 11, Edge 12 - 15
	// IE throws exception on accessing the href property if url is malformed,
	// e.g. http://example.com:80x/
	try{urlAnchor.href = s.url; // Support: IE <=8 - 11 only
	// Anchor's host property isn't correctly set when s.url is relative
	urlAnchor.href = urlAnchor.href;s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;}catch(e) { // If there is an error parsing the URL, assume it is crossDomain,
	// it can be rejected by the transport if it is invalid
	s.crossDomain = true;}} // Convert data if not already a string
	if(s.data && s.processData && typeof s.data !== "string"){s.data = jQuery.param(s.data,s.traditional);} // Apply prefilters
	inspectPrefiltersOrTransports(prefilters,s,options,jqXHR); // If request was aborted inside a prefilter, stop there
	if(completed){return jqXHR;} // We can fire global events as of now if asked to
	// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
	fireGlobals = jQuery.event && s.global; // Watch for a new set of requests
	if(fireGlobals && jQuery.active++ === 0){jQuery.event.trigger("ajaxStart");} // Uppercase the type
	s.type = s.type.toUpperCase(); // Determine if request has content
	s.hasContent = !rnoContent.test(s.type); // Save the URL in case we're toying with the If-Modified-Since
	// and/or If-None-Match header later on
	// Remove hash to simplify url manipulation
	cacheURL = s.url.replace(rhash,""); // More options handling for requests with no content
	if(!s.hasContent){ // Remember the hash so we can put it back
	uncached = s.url.slice(cacheURL.length); // If data is available and should be processed, append data to url
	if(s.data && (s.processData || typeof s.data === "string")){cacheURL += (rquery.test(cacheURL)?"&":"?") + s.data; // #9682: remove data so that it's not used in an eventual retry
	delete s.data;} // Add or update anti-cache param if needed
	if(s.cache === false){cacheURL = cacheURL.replace(rantiCache,"$1");uncached = (rquery.test(cacheURL)?"&":"?") + "_=" + nonce++ + uncached;} // Put hash and anti-cache on the URL that will be requested (gh-1732)
	s.url = cacheURL + uncached; // Change '%20' to '+' if this is encoded form body content (gh-2658)
	}else if(s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0){s.data = s.data.replace(r20,"+");} // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
	if(s.ifModified){if(jQuery.lastModified[cacheURL]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);}if(jQuery.etag[cacheURL]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL]);}} // Set the correct header, if data is being sent
	if(s.data && s.hasContent && s.contentType !== false || options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType);} // Set the Accepts header for the server, depending on the dataType
	jqXHR.setRequestHeader("Accept",s.dataTypes[0] && s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*"?", " + allTypes + "; q=0.01":""):s.accepts["*"]); // Check for headers option
	for(i in s.headers) {jqXHR.setRequestHeader(i,s.headers[i]);} // Allow custom headers/mimetypes and early abort
	if(s.beforeSend && (s.beforeSend.call(callbackContext,jqXHR,s) === false || completed)){ // Abort if not done already and return
	return jqXHR.abort();} // Aborting is no longer a cancellation
	strAbort = "abort"; // Install callbacks on deferreds
	completeDeferred.add(s.complete);jqXHR.done(s.success);jqXHR.fail(s.error); // Get transport
	transport = inspectPrefiltersOrTransports(transports,s,options,jqXHR); // If no transport, we auto-abort
	if(!transport){done(-1,"No Transport");}else {jqXHR.readyState = 1; // Send global event
	if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s]);} // If request was aborted inside ajaxSend, stop there
	if(completed){return jqXHR;} // Timeout
	if(s.async && s.timeout > 0){timeoutTimer = window.setTimeout(function(){jqXHR.abort("timeout");},s.timeout);}try{completed = false;transport.send(requestHeaders,done);}catch(e) { // Rethrow post-completion exceptions
	if(completed){throw e;} // Propagate others as results
	done(-1,e);}} // Callback for when everything is done
	function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText; // Ignore repeat invocations
	if(completed){return;}completed = true; // Clear timeout if it exists
	if(timeoutTimer){window.clearTimeout(timeoutTimer);} // Dereference transport for early garbage collection
	// (no matter how long the jqXHR object will be used)
	transport = undefined; // Cache response headers
	responseHeadersString = headers || ""; // Set readyState
	jqXHR.readyState = status > 0?4:0; // Determine if successful
	isSuccess = status >= 200 && status < 300 || status === 304; // Get response data
	if(responses){response = ajaxHandleResponses(s,jqXHR,responses);} // Convert no matter what (that way responseXXX fields are always set)
	response = ajaxConvert(s,response,jqXHR,isSuccess); // If successful, handle type chaining
	if(isSuccess){ // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
	if(s.ifModified){modified = jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[cacheURL] = modified;}modified = jqXHR.getResponseHeader("etag");if(modified){jQuery.etag[cacheURL] = modified;}} // if no content
	if(status === 204 || s.type === "HEAD"){statusText = "nocontent"; // if not modified
	}else if(status === 304){statusText = "notmodified"; // If we have data, let's convert it
	}else {statusText = response.state;success = response.data;error = response.error;isSuccess = !error;}}else { // Extract error from statusText and normalize for non-aborts
	error = statusText;if(status || !statusText){statusText = "error";if(status < 0){status = 0;}}} // Set data for the fake xhr object
	jqXHR.status = status;jqXHR.statusText = (nativeStatusText || statusText) + ""; // Success/Error
	if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);}else {deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);} // Status-dependent callbacks
	jqXHR.statusCode(_statusCode);_statusCode = undefined;if(fireGlobals){globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);} // Complete
	completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]); // Handle the global AJAX counter
	if(! --jQuery.active){jQuery.event.trigger("ajaxStop");}}}return jqXHR;},getJSON:function getJSON(url,data,callback){return jQuery.get(url,data,callback,"json");},getScript:function getScript(url,callback){return jQuery.get(url,undefined,callback,"script");}});jQuery.each(["get","post"],function(i,method){jQuery[method] = function(url,data,callback,type){ // Shift arguments if data argument was omitted
	if(isFunction(data)){type = type || callback;callback = data;data = undefined;} // The url can be an options object (which then must have .url)
	return jQuery.ajax(jQuery.extend({url:url,type:method,dataType:type,data:data,success:callback},jQuery.isPlainObject(url) && url));};});jQuery._evalUrl = function(url){return jQuery.ajax({url:url, // Make this explicit, since user can override this through ajaxSetup (#11264)
	type:"GET",dataType:"script",cache:true,async:false,global:false,"throws":true});};jQuery.fn.extend({wrapAll:function wrapAll(html){var wrap;if(this[0]){if(isFunction(html)){html = html.call(this[0]);} // The elements to wrap the target around
	wrap = jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0]);}wrap.map(function(){var elem=this;while(elem.firstElementChild) {elem = elem.firstElementChild;}return elem;}).append(this);}return this;},wrapInner:function wrapInner(html){if(isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i));});}return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html);}else {self.append(html);}});},wrap:function wrap(html){var htmlIsFunction=isFunction(html);return this.each(function(i){jQuery(this).wrapAll(htmlIsFunction?html.call(this,i):html);});},unwrap:function unwrap(selector){this.parent(selector).not("body").each(function(){jQuery(this).replaceWith(this.childNodes);});return this;}});jQuery.expr.pseudos.hidden = function(elem){return !jQuery.expr.pseudos.visible(elem);};jQuery.expr.pseudos.visible = function(elem){return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);};jQuery.ajaxSettings.xhr = function(){try{return new window.XMLHttpRequest();}catch(e) {}};var xhrSuccessStatus={ // File protocol always yields status code 0, assume 200
	0:200, // Support: IE <=9 only
	// #1450: sometimes IE returns 1223 when it should be 204
	1223:204},xhrSupported=jQuery.ajaxSettings.xhr();support.cors = !!xhrSupported && "withCredentials" in xhrSupported;support.ajax = xhrSupported = !!xhrSupported;jQuery.ajaxTransport(function(options){var callback,errorCallback; // Cross domain only allowed if supported through XMLHttpRequest
	if(support.cors || xhrSupported && !options.crossDomain){return {send:function send(headers,complete){var i,xhr=options.xhr();xhr.open(options.type,options.url,options.async,options.username,options.password); // Apply custom fields if provided
	if(options.xhrFields){for(i in options.xhrFields) {xhr[i] = options.xhrFields[i];}} // Override mime type if needed
	if(options.mimeType && xhr.overrideMimeType){xhr.overrideMimeType(options.mimeType);} // X-Requested-With header
	// For cross-domain requests, seeing as conditions for a preflight are
	// akin to a jigsaw puzzle, we simply never set it to be sure.
	// (it can always be set on a per-request basis or even using ajaxSetup)
	// For same-domain requests, won't change header if already provided.
	if(!options.crossDomain && !headers["X-Requested-With"]){headers["X-Requested-With"] = "XMLHttpRequest";} // Set headers
	for(i in headers) {xhr.setRequestHeader(i,headers[i]);} // Callback
	callback = function(type){return function(){if(callback){callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;if(type === "abort"){xhr.abort();}else if(type === "error"){ // Support: IE <=9 only
	// On a manual native abort, IE9 throws
	// errors on any property access that is not readyState
	if(typeof xhr.status !== "number"){complete(0,"error");}else {complete( // File: protocol always yields status 0; see #8605, #14207
	xhr.status,xhr.statusText);}}else {complete(xhrSuccessStatus[xhr.status] || xhr.status,xhr.statusText, // Support: IE <=9 only
	// IE9 has no XHR2 but throws on binary (trac-11426)
	// For XHR2 non-text, let the caller handle it (gh-2498)
	(xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string"?{binary:xhr.response}:{text:xhr.responseText},xhr.getAllResponseHeaders());}}};}; // Listen to events
	xhr.onload = callback();errorCallback = xhr.onerror = xhr.ontimeout = callback("error"); // Support: IE 9 only
	// Use onreadystatechange to replace onabort
	// to handle uncaught aborts
	if(xhr.onabort !== undefined){xhr.onabort = errorCallback;}else {xhr.onreadystatechange = function(){ // Check readyState before timeout as it changes
	if(xhr.readyState === 4){ // Allow onerror to be called first,
	// but that will not handle a native abort
	// Also, save errorCallback to a variable
	// as xhr.onerror cannot be accessed
	window.setTimeout(function(){if(callback){errorCallback();}});}};} // Create the abort callback
	callback = callback("abort");try{ // Do send the request (this may raise an exception)
	xhr.send(options.hasContent && options.data || null);}catch(e) { // #14683: Only rethrow if this hasn't been notified as an error yet
	if(callback){throw e;}}},abort:function abort(){if(callback){callback();}}};}}); // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter(function(s){if(s.crossDomain){s.contents.script = false;}}); // Install script dataType
	jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function textScript(text){jQuery.globalEval(text);return text;}}}); // Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script",function(s){if(s.cache === undefined){s.cache = false;}if(s.crossDomain){s.type = "GET";}}); // Bind script tag hack transport
	jQuery.ajaxTransport("script",function(s){ // This transport only deals with cross domain requests
	if(s.crossDomain){var script,callback;return {send:function send(_,complete){script = jQuery("<script>").prop({charset:s.scriptCharset,src:s.url}).on("load error",callback = function(evt){script.remove();callback = null;if(evt){complete(evt.type === "error"?404:200,evt.type);}}); // Use native DOM manipulation to avoid our domManip AJAX trickery
	document.head.appendChild(script[0]);},abort:function abort(){if(callback){callback();}}};}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/; // Default jsonp settings
	jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function jsonpCallback(){var callback=oldCallbacks.pop() || jQuery.expando + "_" + nonce++;this[callback] = true;return callback;}}); // Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp !== false && (rjsonp.test(s.url)?"url":typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data"); // Handle iff the expected data type is "jsonp" or we have a parameter to set
	if(jsonProp || s.dataTypes[0] === "jsonp"){ // Get callback name, remembering preexisting value associated with it
	callbackName = s.jsonpCallback = isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback; // Insert callback into url or form data
	if(jsonProp){s[jsonProp] = s[jsonProp].replace(rjsonp,"$1" + callbackName);}else if(s.jsonp !== false){s.url += (rquery.test(s.url)?"&":"?") + s.jsonp + "=" + callbackName;} // Use data converter to retrieve json after script execution
	s.converters["script json"] = function(){if(!responseContainer){jQuery.error(callbackName + " was not called");}return responseContainer[0];}; // Force json dataType
	s.dataTypes[0] = "json"; // Install callback
	overwritten = window[callbackName];window[callbackName] = function(){responseContainer = arguments;}; // Clean-up function (fires after converters)
	jqXHR.always(function(){ // If previous value didn't exist - remove it
	if(overwritten === undefined){jQuery(window).removeProp(callbackName); // Otherwise restore preexisting value
	}else {window[callbackName] = overwritten;} // Save back as free
	if(s[callbackName]){ // Make sure that re-using the options doesn't screw things around
	s.jsonpCallback = originalSettings.jsonpCallback; // Save the callback name for future use
	oldCallbacks.push(callbackName);} // Call if it was a function and we have a response
	if(responseContainer && isFunction(overwritten)){overwritten(responseContainer[0]);}responseContainer = overwritten = undefined;}); // Delegate to script
	return "script";}}); // Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = (function(){var body=document.implementation.createHTMLDocument("").body;body.innerHTML = "<form></form><form></form>";return body.childNodes.length === 2;})(); // Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function(data,context,keepScripts){if(typeof data !== "string"){return [];}if(typeof context === "boolean"){keepScripts = context;context = false;}var base,parsed,scripts;if(!context){ // Stop scripts or inline event handlers from being executed immediately
	// by using document.implementation
	if(support.createHTMLDocument){context = document.implementation.createHTMLDocument(""); // Set the base href for the created document
	// so any parsed elements with URLs
	// are based on the document's URL (gh-2965)
	base = context.createElement("base");base.href = document.location.href;context.head.appendChild(base);}else {context = document;}}parsed = rsingleTag.exec(data);scripts = !keepScripts && []; // Single tag
	if(parsed){return [context.createElement(parsed[1])];}parsed = buildFragment([data],context,scripts);if(scripts && scripts.length){jQuery(scripts).remove();}return jQuery.merge([],parsed.childNodes);}; /**
	 * Load a url into a page
	 */jQuery.fn.load = function(url,params,callback){var selector,type,response,self=this,off=url.indexOf(" ");if(off > -1){selector = stripAndCollapse(url.slice(off));url = url.slice(0,off);} // If it's a function
	if(isFunction(params)){ // We assume that it's the callback
	callback = params;params = undefined; // Otherwise, build a param string
	}else if(params && typeof params === "object"){type = "POST";} // If we have elements to modify, make the request
	if(self.length > 0){jQuery.ajax({url:url, // If "type" variable is undefined, then "GET" method will be used.
	// Make value of this field explicit since
	// user can override it through ajaxSetup method
	type:type || "GET",dataType:"html",data:params}).done(function(responseText){ // Save response for use in complete callback
	response = arguments;self.html(selector? // If a selector was specified, locate the right elements in a dummy div
	// Exclude scripts to avoid IE 'Permission Denied' errors
	jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector): // Otherwise use the full result
	responseText); // If the request succeeds, this function gets "data", "status", "jqXHR"
	// but they are ignored because response was set above.
	// If it fails, this function gets "jqXHR", "status", "error"
	}).always(callback && function(jqXHR,status){self.each(function(){callback.apply(this,response || [jqXHR.responseText,status,jqXHR]);});});}return this;}; // Attach a bunch of functions for handling common AJAX events
	jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type] = function(fn){return this.on(type,fn);};});jQuery.expr.pseudos.animated = function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem === fn.elem;}).length;};jQuery.offset = {setOffset:function setOffset(elem,options,i){var curPosition,curLeft,curCSSTop,curTop,curOffset,curCSSLeft,calculatePosition,position=jQuery.css(elem,"position"),curElem=jQuery(elem),props={}; // Set position first, in-case top/left are set even on static elem
	if(position === "static"){elem.style.position = "relative";}curOffset = curElem.offset();curCSSTop = jQuery.css(elem,"top");curCSSLeft = jQuery.css(elem,"left");calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1; // Need to be able to calculate position if either
	// top or left is auto and position is either absolute or fixed
	if(calculatePosition){curPosition = curElem.position();curTop = curPosition.top;curLeft = curPosition.left;}else {curTop = parseFloat(curCSSTop) || 0;curLeft = parseFloat(curCSSLeft) || 0;}if(isFunction(options)){ // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
	options = options.call(elem,i,jQuery.extend({},curOffset));}if(options.top != null){props.top = options.top - curOffset.top + curTop;}if(options.left != null){props.left = options.left - curOffset.left + curLeft;}if("using" in options){options.using.call(elem,props);}else {curElem.css(props);}}};jQuery.fn.extend({ // offset() relates an element's border box to the document origin
	offset:function offset(options){ // Preserve chaining for setter
	if(arguments.length){return options === undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i);});}var rect,win,elem=this[0];if(!elem){return;} // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
	// Support: IE <=11 only
	// Running getBoundingClientRect on a
	// disconnected node in IE throws an error
	if(!elem.getClientRects().length){return {top:0,left:0};} // Get document-relative position by adding viewport scroll to viewport-relative gBCR
	rect = elem.getBoundingClientRect();win = elem.ownerDocument.defaultView;return {top:rect.top + win.pageYOffset,left:rect.left + win.pageXOffset};}, // position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position:function position(){if(!this[0]){return;}var offsetParent,offset,doc,elem=this[0],parentOffset={top:0,left:0}; // position:fixed elements are offset from the viewport, which itself always has zero offset
	if(jQuery.css(elem,"position") === "fixed"){ // Assume position:fixed implies availability of getBoundingClientRect
	offset = elem.getBoundingClientRect();}else {offset = this.offset(); // Account for the *real* offset parent, which can be the document or its root element
	// when a statically positioned element is identified
	doc = elem.ownerDocument;offsetParent = elem.offsetParent || doc.documentElement;while(offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent,"position") === "static") {offsetParent = offsetParent.parentNode;}if(offsetParent && offsetParent !== elem && offsetParent.nodeType === 1){ // Incorporate borders into its offset, since they are outside its content origin
	parentOffset = jQuery(offsetParent).offset();parentOffset.top += jQuery.css(offsetParent,"borderTopWidth",true);parentOffset.left += jQuery.css(offsetParent,"borderLeftWidth",true);}} // Subtract parent offsets and element margins
	return {top:offset.top - parentOffset.top - jQuery.css(elem,"marginTop",true),left:offset.left - parentOffset.left - jQuery.css(elem,"marginLeft",true)};}, // This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent:function offsetParent(){return this.map(function(){var offsetParent=this.offsetParent;while(offsetParent && jQuery.css(offsetParent,"position") === "static") {offsetParent = offsetParent.offsetParent;}return offsetParent || documentElement;});}}); // Create scrollLeft and scrollTop methods
	jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top="pageYOffset" === prop;jQuery.fn[method] = function(val){return access(this,function(elem,method,val){ // Coalesce documents and windows
	var win;if(isWindow(elem)){win = elem;}else if(elem.nodeType === 9){win = elem.defaultView;}if(val === undefined){return win?win[prop]:elem[method];}if(win){win.scrollTo(!top?val:win.pageXOffset,top?val:win.pageYOffset);}else {elem[method] = val;}},method,val,arguments.length);};}); // Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,function(elem,computed){if(computed){computed = curCSS(elem,prop); // If curCSS returns percentage, fallback to offset
	return rnumnonpx.test(computed)?jQuery(elem).position()[prop] + "px":computed;}});}); // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner" + name,content:type,"":"outer" + name},function(defaultExtra,funcName){ // Margin is only for outerHeight, outerWidth
	jQuery.fn[funcName] = function(margin,value){var chainable=arguments.length && (defaultExtra || typeof margin !== "boolean"),extra=defaultExtra || (margin === true || value === true?"margin":"border");return access(this,function(elem,type,value){var doc;if(isWindow(elem)){ // $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
	return funcName.indexOf("outer") === 0?elem["inner" + name]:elem.document.documentElement["client" + name];} // Get document width or height
	if(elem.nodeType === 9){doc = elem.documentElement; // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
	// whichever is greatest
	return Math.max(elem.body["scroll" + name],doc["scroll" + name],elem.body["offset" + name],doc["offset" + name],doc["client" + name]);}return value === undefined? // Get width or height on the element, requesting but not forcing parseFloat
	jQuery.css(elem,type,extra): // Set width or height on the element
	jQuery.style(elem,type,value,extra);},type,chainable?margin:undefined,chainable);};});});jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "),function(i,name){ // Handle event binding
	jQuery.fn[name] = function(data,fn){return arguments.length > 0?this.on(name,null,data,fn):this.trigger(name);};});jQuery.fn.extend({hover:function hover(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);}});jQuery.fn.extend({bind:function bind(types,data,fn){return this.on(types,null,data,fn);},unbind:function unbind(types,fn){return this.off(types,null,fn);},delegate:function delegate(selector,types,data,fn){return this.on(types,selector,data,fn);},undelegate:function undelegate(selector,types,fn){ // ( namespace ) or ( selector, types [, fn] )
	return arguments.length === 1?this.off(selector,"**"):this.off(types,selector || "**",fn);}}); // Bind a function to a context, optionally partially applying any
	// arguments.
	// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
	// However, it is not slated for removal any time soon
	jQuery.proxy = function(fn,context){var tmp,args,proxy;if(typeof context === "string"){tmp = fn[context];context = fn;fn = tmp;} // Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if(!isFunction(fn)){return undefined;} // Simulated bind
	args = _slice.call(arguments,2);proxy = function(){return fn.apply(context || this,args.concat(_slice.call(arguments)));}; // Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;return proxy;};jQuery.holdReady = function(hold){if(hold){jQuery.readyWait++;}else {jQuery.ready(true);}};jQuery.isArray = Array.isArray;jQuery.parseJSON = JSON.parse;jQuery.nodeName = nodeName;jQuery.isFunction = isFunction;jQuery.isWindow = isWindow;jQuery.camelCase = camelCase;jQuery.type = toType;jQuery.now = Date.now;jQuery.isNumeric = function(obj){ // As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type=jQuery.type(obj);return (type === "number" || type === "string") &&  // parseFloat NaNs numeric-cast false positives ("")
	// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	// subtraction forces infinities to NaN
	!isNaN(obj - parseFloat(obj));}; // Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	if(true){!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return jQuery;}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}var  // Map over jQuery in case of overwrite
	_jQuery=window.jQuery, // Map over the $ in case of overwrite
	_$=window.$;jQuery.noConflict = function(deep){if(window.$ === jQuery){window.$ = _$;}if(deep && window.jQuery === jQuery){window.jQuery = _jQuery;}return jQuery;}; // Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if(!noGlobal){window.jQuery = window.$ = jQuery;}return jQuery;}); // Otherwise append directly

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * MathQuill v0.10.1               http://mathquill.com
	 * by Han, Jeanine, and Mary  maintainers@mathquill.com
	 *
	 * This Source Code Form is subject to the terms of the
	 * Mozilla Public License, v. 2.0. If a copy of the MPL
	 * was not distributed with this file, You can obtain
	 * one at http://mozilla.org/MPL/2.0/.
	 */'use strict';(function(){var jQuery=window.jQuery,undefined,mqCmdId='mathquill-command-id',mqBlockId='mathquill-block-id',min=Math.min,max=Math.max;function noop(){} /**
	 * A utility higher-order function that makes defining variadic
	 * functions more convenient by letting you essentially define functions
	 * with the last argument as a splat, i.e. the last argument "gathers up"
	 * remaining arguments to the function:
	 *   var doStuff = variadic(function(first, rest) { return rest; });
	 *   doStuff(1, 2, 3); // => [2, 3]
	 */var __slice=[].slice;function variadic(fn){var numFixedArgs=fn.length - 1;return function(){var args=__slice.call(arguments,0,numFixedArgs);var varArg=__slice.call(arguments,numFixedArgs);return fn.apply(this,args.concat([varArg]));};} /**
	 * A utility higher-order function that makes combining object-oriented
	 * programming and functional programming techniques more convenient:
	 * given a method name and any number of arguments to be bound, returns
	 * a function that calls it's first argument's method of that name (if
	 * it exists) with the bound arguments and any additional arguments that
	 * are passed:
	 *   var sendMethod = send('method', 1, 2);
	 *   var obj = { method: function() { return Array.apply(this, arguments); } };
	 *   sendMethod(obj, 3, 4); // => [1, 2, 3, 4]
	 *   // or more specifically,
	 *   var obj2 = { method: function(one, two, three) { return one*two + three; } };
	 *   sendMethod(obj2, 3); // => 5
	 *   sendMethod(obj2, 4); // => 6
	 */var send=variadic(function(method,args){return variadic(function(obj,moreArgs){if(method in obj)return obj[method].apply(obj,args.concat(moreArgs));});}); /**
	 * A utility higher-order function that creates "implicit iterators"
	 * from "generators": given a function that takes in a sole argument,
	 * a "yield_" function, that calls "yield_" repeatedly with an object as
	 * a sole argument (presumably objects being iterated over), returns
	 * a function that calls it's first argument on each of those objects
	 * (if the first argument is a function, it is called repeatedly with
	 * each object as the first argument, otherwise it is stringified and
	 * the method of that name is called on each object (if such a method
	 * exists)), passing along all additional arguments:
	 *   var a = [
	 *     { method: function(list) { list.push(1); } },
	 *     { method: function(list) { list.push(2); } },
	 *     { method: function(list) { list.push(3); } }
	 *   ];
	 *   a.each = iterator(function(yield_) {
	 *     for (var i in this) yield_(this[i]);
	 *   });
	 *   var list = [];
	 *   a.each('method', list);
	 *   list; // => [1, 2, 3]
	 *   // Note that the for-in loop will yield 'each', but 'each' maps to
	 *   // the function object created by iterator() which does not have a
	 *   // .method() method, so that just fails silently.
	 */function iterator(generator){return variadic(function(fn,args){if(typeof fn !== 'function')fn = send(fn);var yield_=function yield_(obj){return fn.apply(obj,[obj].concat(args));};return generator.call(this,yield_);});} /**
	 * sugar to make defining lots of commands easier.
	 * TODO: rethink this.
	 */function bind(cons /*, args... */){var args=__slice.call(arguments,1);return function(){return cons.apply(this,args);};} /**
	 * a development-only debug method.  This definition and all
	 * calls to `pray` will be stripped from the minified
	 * build of mathquill.
	 *
	 * This function must be called by name to be removed
	 * at compile time.  Do not define another function
	 * with the same name, and only call this function by
	 * name.
	 */function pray(message,cond){if(!cond)throw new Error('prayer failed: ' + message);}var P=(function(prototype,ownProperty,undefined){ // helper functions that also help minification
	function isObject(o){return typeof o === 'object';}function isFunction(f){return typeof f === 'function';} // used to extend the prototypes of superclasses (which might not
	// have `.Bare`s)
	function SuperclassBare(){}return function P(_superclass, /* = Object */definition){ // handle the case where no superclass is given
	if(definition === undefined){definition = _superclass;_superclass = Object;} // C is the class to be returned.
	//
	// It delegates to instantiating an instance of `Bare`, so that it
	// will always return a new instance regardless of the calling
	// context.
	//
	//  TODO: the Chrome inspector shows all created objects as `C`
	//        rather than `Object`.  Setting the .name property seems to
	//        have no effect.  Is there a way to override this behavior?
	function C(){var self=new Bare();if(isFunction(self.init))self.init.apply(self,arguments);return self;} // C.Bare is a class with a noop constructor.  Its prototype is the
	// same as C, so that instances of C.Bare are also instances of C.
	// New objects can be allocated without initialization by calling
	// `new MyClass.Bare`.
	function Bare(){}C.Bare = Bare; // Set up the prototype of the new class.
	var _super=SuperclassBare[prototype] = _superclass[prototype];var proto=Bare[prototype] = C[prototype] = C.p = new SuperclassBare(); // other variables, as a minifier optimization
	var extensions; // set the constructor property on the prototype, for convenience
	proto.constructor = C;C.extend = function(def){return P(C,def);};return (C.open = function(def){extensions = {};if(isFunction(def)){ // call the defining function with all the arguments you need
	// extensions captures the return value.
	extensions = def.call(C,proto,_super,C,_superclass);}else if(isObject(def)){ // if you passed an object instead, we'll take it
	extensions = def;} // ...and extend it
	if(isObject(extensions)){for(var ext in extensions) {if(ownProperty.call(extensions,ext)){proto[ext] = extensions[ext];}}} // if there's no init, we assume we're inheriting a non-pjs class, so
	// we default to applying the superclass's constructor.
	if(!isFunction(proto.init)){proto.init = _superclass;}return C;})(definition);}; // as a minifier optimization, we've closured in a few helper functions
	// and the string 'prototype' (C[p] is much shorter than C.prototype)
	})('prototype',({}).hasOwnProperty); /*************************************************
	 * Base classes of edit tree-related objects
	 *
	 * Only doing tree node manipulation via these
	 * adopt/ disown methods guarantees well-formedness
	 * of the tree.
	 ************************************************/ // L = 'left'
	// R = 'right'
	//
	// the contract is that they can be used as object properties
	// and (-L) === R, and (-R) === L.
	var L=-1;var R=1;function prayDirection(dir){pray('a direction was passed',dir === L || dir === R);} /**
	 * Tiny extension of jQuery adding directionalized DOM manipulation methods.
	 *
	 * Funny how Pjs v3 almost just works with `jQuery.fn.init`.
	 *
	 * jQuery features that don't work on $:
	 *   - jQuery.*, like jQuery.ajax, obviously (Pjs doesn't and shouldn't
	 *                                            copy constructor properties)
	 *
	 *   - jQuery(function), the shortcut for `jQuery(document).ready(function)`,
	 *     because `jQuery.fn.init` is idiosyncratic and Pjs doing, essentially,
	 *     `jQuery.fn.init.apply(this, arguments)` isn't quite right, you need:
	 *
	 *       _.init = function(s, c) { jQuery.fn.init.call(this, s, c, $(document)); };
	 *
	 *     if you actually give a shit (really, don't bother),
	 *     see https://github.com/jquery/jquery/blob/1.7.2/src/core.js#L889
	 *
	 *   - jQuery(selector), because jQuery translates that to
	 *     `jQuery(document).find(selector)`, but Pjs doesn't (should it?) let
	 *     you override the result of a constructor call
	 *       + note that because of the jQuery(document) shortcut-ness, there's also
	 *         the 3rd-argument-needs-to-be-`$(document)` thing above, but the fix
	 *         for that (as can be seen above) is really easy. This problem requires
	 *         a way more intrusive fix
	 *
	 * And that's it! Everything else just magically works because jQuery internally
	 * uses `this.constructor()` everywhere (hence calling `$`), but never ever does
	 * `this.constructor.find` or anything like that, always doing `jQuery.find`.
	 */var $=P(jQuery,function(_){_.insDirOf = function(dir,el){return dir === L?this.insertBefore(el.first()):this.insertAfter(el.last());};_.insAtDirEnd = function(dir,el){return dir === L?this.prependTo(el):this.appendTo(el);};});var Point=P(function(_){_.parent = 0;_[L] = 0;_[R] = 0;_.init = function(parent,leftward,rightward){this.parent = parent;this[L] = leftward;this[R] = rightward;};this.copy = function(pt){return Point(pt.parent,pt[L],pt[R]);};}); /**
	 * MathQuill virtual-DOM tree-node abstract base class
	 */var Node=P(function(_){_[L] = 0;_[R] = 0;_.parent = 0;var id=0;function uniqueNodeId(){return id += 1;}this.byId = {};_.init = function(){this.id = uniqueNodeId();Node.byId[this.id] = this;this.ends = {};this.ends[L] = 0;this.ends[R] = 0;};_.dispose = function(){delete Node.byId[this.id];};_.toString = function(){return '{{ MathQuill Node #' + this.id + ' }}';};_.jQ = $();_.jQadd = function(jQ){return this.jQ = this.jQ.add(jQ);};_.jQize = function(jQ){ // jQuery-ifies this.html() and links up the .jQ of all corresponding Nodes
	var jQ=$(jQ || this.html());function jQadd(el){if(el.getAttribute){var cmdId=el.getAttribute('mathquill-command-id');var blockId=el.getAttribute('mathquill-block-id');if(cmdId)Node.byId[cmdId].jQadd(el);if(blockId)Node.byId[blockId].jQadd(el);}for(el = el.firstChild;el;el = el.nextSibling) {jQadd(el);}}for(var i=0;i < jQ.length;i += 1) jQadd(jQ[i]);return jQ;};_.createDir = function(dir,cursor){prayDirection(dir);var node=this;node.jQize();node.jQ.insDirOf(dir,cursor.jQ);cursor[dir] = node.adopt(cursor.parent,cursor[L],cursor[R]);return node;};_.createLeftOf = function(el){return this.createDir(L,el);};_.selectChildren = function(leftEnd,rightEnd){return Selection(leftEnd,rightEnd);};_.bubble = iterator(function(yield_){for(var ancestor=this;ancestor;ancestor = ancestor.parent) {var result=yield_(ancestor);if(result === false)break;}return this;});_.postOrder = iterator(function(yield_){(function recurse(descendant){descendant.eachChild(recurse);yield_(descendant);})(this);return this;});_.isEmpty = function(){return this.ends[L] === 0 && this.ends[R] === 0;};_.children = function(){return Fragment(this.ends[L],this.ends[R]);};_.eachChild = function(){var children=this.children();children.each.apply(children,arguments);return this;};_.foldChildren = function(fold,fn){return this.children().fold(fold,fn);};_.withDirAdopt = function(dir,parent,withDir,oppDir){Fragment(this,this).withDirAdopt(dir,parent,withDir,oppDir);return this;};_.adopt = function(parent,leftward,rightward){Fragment(this,this).adopt(parent,leftward,rightward);return this;};_.disown = function(){Fragment(this,this).disown();return this;};_.remove = function(){this.jQ.remove();this.postOrder('dispose');return this.disown();};});function prayWellFormed(parent,leftward,rightward){pray('a parent is always present',parent);pray('leftward is properly set up',(function(){ // either it's empty and `rightward` is the left end child (possibly empty)
	if(!leftward)return parent.ends[L] === rightward; // or it's there and its [R] and .parent are properly set up
	return leftward[R] === rightward && leftward.parent === parent;})());pray('rightward is properly set up',(function(){ // either it's empty and `leftward` is the right end child (possibly empty)
	if(!rightward)return parent.ends[R] === leftward; // or it's there and its [L] and .parent are properly set up
	return rightward[L] === leftward && rightward.parent === parent;})());} /**
	 * An entity outside the virtual tree with one-way pointers (so it's only a
	 * "view" of part of the tree, not an actual node/entity in the tree) that
	 * delimits a doubly-linked list of sibling nodes.
	 * It's like a fanfic love-child between HTML DOM DocumentFragment and the Range
	 * classes: like DocumentFragment, its contents must be sibling nodes
	 * (unlike Range, whose contents are arbitrary contiguous pieces of subtrees),
	 * but like Range, it has only one-way pointers to its contents, its contents
	 * have no reference to it and in fact may still be in the visible tree (unlike
	 * DocumentFragment, whose contents must be detached from the visible tree
	 * and have their 'parent' pointers set to the DocumentFragment).
	 */var Fragment=P(function(_){_.init = function(withDir,oppDir,dir){if(dir === undefined)dir = L;prayDirection(dir);pray('no half-empty fragments',!withDir === !oppDir);this.ends = {};if(!withDir)return;pray('withDir is passed to Fragment',withDir instanceof Node);pray('oppDir is passed to Fragment',oppDir instanceof Node);pray('withDir and oppDir have the same parent',withDir.parent === oppDir.parent);this.ends[dir] = withDir;this.ends[-dir] = oppDir; // To build the jquery collection for a fragment, accumulate elements
	// into an array and then call jQ.add once on the result. jQ.add sorts the
	// collection according to document order each time it is called, so
	// building a collection by folding jQ.add directly takes more than
	// quadratic time in the number of elements.
	//
	// https://github.com/jquery/jquery/blob/2.1.4/src/traversing.js#L112
	var accum=this.fold([],function(accum,el){accum.push.apply(accum,el.jQ.get());return accum;});this.jQ = this.jQ.add(accum);};_.jQ = $(); // like Cursor::withDirInsertAt(dir, parent, withDir, oppDir)
	_.withDirAdopt = function(dir,parent,withDir,oppDir){return dir === L?this.adopt(parent,withDir,oppDir):this.adopt(parent,oppDir,withDir);};_.adopt = function(parent,leftward,rightward){prayWellFormed(parent,leftward,rightward);var self=this;self.disowned = false;var leftEnd=self.ends[L];if(!leftEnd)return this;var rightEnd=self.ends[R];if(leftward){ // NB: this is handled in the ::each() block
	// leftward[R] = leftEnd
	}else {parent.ends[L] = leftEnd;}if(rightward){rightward[L] = rightEnd;}else {parent.ends[R] = rightEnd;}self.ends[R][R] = rightward;self.each(function(el){el[L] = leftward;el.parent = parent;if(leftward)leftward[R] = el;leftward = el;});return self;};_.disown = function(){var self=this;var leftEnd=self.ends[L]; // guard for empty and already-disowned fragments
	if(!leftEnd || self.disowned)return self;self.disowned = true;var rightEnd=self.ends[R];var parent=leftEnd.parent;prayWellFormed(parent,leftEnd[L],leftEnd);prayWellFormed(parent,rightEnd,rightEnd[R]);if(leftEnd[L]){leftEnd[L][R] = rightEnd[R];}else {parent.ends[L] = rightEnd[R];}if(rightEnd[R]){rightEnd[R][L] = leftEnd[L];}else {parent.ends[R] = leftEnd[L];}return self;};_.remove = function(){this.jQ.remove();this.each('postOrder','dispose');return this.disown();};_.each = iterator(function(yield_){var self=this;var el=self.ends[L];if(!el)return self;for(;el !== self.ends[R][R];el = el[R]) {var result=yield_(el);if(result === false)break;}return self;});_.fold = function(fold,fn){this.each(function(el){fold = fn.call(this,fold,el);});return fold;};}); /**
	 * Registry of LaTeX commands and commands created when typing
	 * a single character.
	 *
	 * (Commands are all subclasses of Node.)
	 */var LatexCmds={},CharCmds={}; /********************************************
	 * Cursor and Selection "singleton" classes
	 *******************************************/ /* The main thing that manipulates the Math DOM. Makes sure to manipulate the
	HTML DOM to match. */ /* Sort of singletons, since there should only be one per editable math
	textbox, but any one HTML document can contain many such textboxes, so any one
	JS environment could actually contain many instances. */ //A fake cursor in the fake textbox that the math is rendered in.
	var Cursor=P(Point,function(_){_.init = function(initParent,options){this.parent = initParent;this.options = options;var jQ=this.jQ = this._jQ = $('<span class="mq-cursor">&#8203;</span>'); //closured for setInterval
	this.blink = function(){jQ.toggleClass('mq-blink');};this.upDownCache = {};};_.show = function(){this.jQ = this._jQ.removeClass('mq-blink');if('intervalId' in this) //already was shown, just restart interval
	clearInterval(this.intervalId);else { //was hidden and detached, insert this.jQ back into HTML DOM
	if(this[R]){if(this.selection && this.selection.ends[L][L] === this[L])this.jQ.insertBefore(this.selection.jQ);else this.jQ.insertBefore(this[R].jQ.first());}else this.jQ.appendTo(this.parent.jQ);this.parent.focus();}this.intervalId = setInterval(this.blink,500);return this;};_.hide = function(){if('intervalId' in this)clearInterval(this.intervalId);delete this.intervalId;this.jQ.detach();this.jQ = $();return this;};_.withDirInsertAt = function(dir,parent,withDir,oppDir){var oldParent=this.parent;this.parent = parent;this[dir] = withDir;this[-dir] = oppDir; // by contract, .blur() is called after all has been said and done
	// and the cursor has actually been moved
	// FIXME pass cursor to .blur() so text can fix cursor pointers when removing itself
	if(oldParent !== parent && oldParent.blur)oldParent.blur(this);};_.insDirOf = function(dir,el){prayDirection(dir);this.jQ.insDirOf(dir,el.jQ);this.withDirInsertAt(dir,el.parent,el[dir],el);this.parent.jQ.addClass('mq-hasCursor');return this;};_.insLeftOf = function(el){return this.insDirOf(L,el);};_.insRightOf = function(el){return this.insDirOf(R,el);};_.insAtDirEnd = function(dir,el){prayDirection(dir);this.jQ.insAtDirEnd(dir,el.jQ);this.withDirInsertAt(dir,el,0,el.ends[dir]);el.focus();return this;};_.insAtLeftEnd = function(el){return this.insAtDirEnd(L,el);};_.insAtRightEnd = function(el){return this.insAtDirEnd(R,el);}; /**
	   * jump up or down from one block Node to another:
	   * - cache the current Point in the node we're jumping from
	   * - check if there's a Point in it cached for the node we're jumping to
	   *   + if so put the cursor there,
	   *   + if not seek a position in the node that is horizontally closest to
	   *     the cursor's current position
	   */_.jumpUpDown = function(from,to){var self=this;self.upDownCache[from.id] = Point.copy(self);var cached=self.upDownCache[to.id];if(cached){cached[R]?self.insLeftOf(cached[R]):self.insAtRightEnd(cached.parent);}else {var pageX=self.offset().left;to.seek(pageX,self);}};_.offset = function(){ //in Opera 11.62, .getBoundingClientRect() and hence jQuery::offset()
	//returns all 0's on inline elements with negative margin-right (like
	//the cursor) at the end of their parent, so temporarily remove the
	//negative margin-right when calling jQuery::offset()
	//Opera bug DSK-360043
	//http://bugs.jquery.com/ticket/11523
	//https://github.com/jquery/jquery/pull/717
	var self=this,offset=self.jQ.removeClass('mq-cursor').offset();self.jQ.addClass('mq-cursor');return offset;};_.unwrapGramp = function(){var gramp=this.parent.parent;var greatgramp=gramp.parent;var rightward=gramp[R];var cursor=this;var leftward=gramp[L];gramp.disown().eachChild(function(uncle){if(uncle.isEmpty())return;uncle.children().adopt(greatgramp,leftward,rightward).each(function(cousin){cousin.jQ.insertBefore(gramp.jQ.first());});leftward = uncle.ends[R];});if(!this[R]){ //then find something to be rightward to insLeftOf
	if(this[L])this[R] = this[L][R];else {while(!this[R]) {this.parent = this.parent[R];if(this.parent)this[R] = this.parent.ends[L];else {this[R] = gramp[R];this.parent = greatgramp;break;}}}}if(this[R])this.insLeftOf(this[R]);else this.insAtRightEnd(greatgramp);gramp.jQ.remove();if(gramp[L].siblingDeleted)gramp[L].siblingDeleted(cursor.options,R);if(gramp[R].siblingDeleted)gramp[R].siblingDeleted(cursor.options,L);};_.startSelection = function(){var anticursor=this.anticursor = Point.copy(this);var ancestors=anticursor.ancestors = {}; // a map from each ancestor of
	// the anticursor, to its child that is also an ancestor; in other words,
	// the anticursor's ancestor chain in reverse order
	for(var ancestor=anticursor;ancestor.parent;ancestor = ancestor.parent) {ancestors[ancestor.parent.id] = ancestor;}};_.endSelection = function(){delete this.anticursor;};_.select = function(){var anticursor=this.anticursor;if(this[L] === anticursor[L] && this.parent === anticursor.parent)return false; // Find the lowest common ancestor (`lca`), and the ancestor of the cursor
	// whose parent is the LCA (which'll be an end of the selection fragment).
	for(var ancestor=this;ancestor.parent;ancestor = ancestor.parent) {if(ancestor.parent.id in anticursor.ancestors){var lca=ancestor.parent;break;}}pray('cursor and anticursor in the same tree',lca); // The cursor and the anticursor should be in the same tree, because the
	// mousemove handler attached to the document, unlike the one attached to
	// the root HTML DOM element, doesn't try to get the math tree node of the
	// mousemove target, and Cursor::seek() based solely on coordinates stays
	// within the tree of `this` cursor's root.
	// The other end of the selection fragment, the ancestor of the anticursor
	// whose parent is the LCA.
	var antiAncestor=anticursor.ancestors[lca.id]; // Now we have two either Nodes or Points, guaranteed to have a common
	// parent and guaranteed that if both are Points, they are not the same,
	// and we have to figure out which is the left end and which the right end
	// of the selection.
	var leftEnd,rightEnd,dir=R; // This is an extremely subtle algorithm.
	// As a special case, `ancestor` could be a Point and `antiAncestor` a Node
	// immediately to `ancestor`'s left.
	// In all other cases,
	// - both Nodes
	// - `ancestor` a Point and `antiAncestor` a Node
	// - `ancestor` a Node and `antiAncestor` a Point
	// `antiAncestor[R] === rightward[R]` for some `rightward` that is
	// `ancestor` or to its right, if and only if `antiAncestor` is to
	// the right of `ancestor`.
	if(ancestor[L] !== antiAncestor){for(var rightward=ancestor;rightward;rightward = rightward[R]) {if(rightward[R] === antiAncestor[R]){dir = L;leftEnd = ancestor;rightEnd = antiAncestor;break;}}}if(dir === R){leftEnd = antiAncestor;rightEnd = ancestor;} // only want to select Nodes up to Points, can't select Points themselves
	if(leftEnd instanceof Point)leftEnd = leftEnd[R];if(rightEnd instanceof Point)rightEnd = rightEnd[L];this.hide().selection = lca.selectChildren(leftEnd,rightEnd);this.insDirOf(dir,this.selection.ends[dir]);this.selectionChanged();return true;};_.clearSelection = function(){if(this.selection){this.selection.clear();delete this.selection;this.selectionChanged();}return this;};_.deleteSelection = function(){if(!this.selection)return;this[L] = this.selection.ends[L][L];this[R] = this.selection.ends[R][R];this.selection.remove();this.selectionChanged();delete this.selection;};_.replaceSelection = function(){var seln=this.selection;if(seln){this[L] = seln.ends[L][L];this[R] = seln.ends[R][R];delete this.selection;}return seln;};});var Selection=P(Fragment,function(_,super_){_.init = function(){super_.init.apply(this,arguments);this.jQ = this.jQ.wrapAll('<span class="mq-selection"></span>').parent(); //can't do wrapAll(this.jQ = $(...)) because wrapAll will clone it
	};_.adopt = function(){this.jQ.replaceWith(this.jQ = this.jQ.children());return super_.adopt.apply(this,arguments);};_.clear = function(){ // using the browser's native .childNodes property so that we
	// don't discard text nodes.
	this.jQ.replaceWith(this.jQ[0].childNodes);return this;};_.join = function(methodName){return this.fold('',function(fold,child){return fold + child[methodName]();});};}); /*********************************************
	 * Controller for a MathQuill instance,
	 * on which services are registered with
	 *
	 *   Controller.open(function(_) { ... });
	 *
	 ********************************************/var Controller=P(function(_){_.init = function(root,container,options){this.id = root.id;this.data = {};this.root = root;this.container = container;this.options = options;root.controller = this;this.cursor = root.cursor = Cursor(root,options); // TODO: stop depending on root.cursor, and rm it
	};_.handle = function(name,dir){var handlers=this.options.handlers;if(handlers && handlers.fns[name]){var mq=handlers.APIClasses[this.KIND_OF_MQ](this);if(dir === L || dir === R)handlers.fns[name](dir,mq);else handlers.fns[name](mq);}};var notifyees=[];this.onNotify = function(f){notifyees.push(f);};_.notify = function(){for(var i=0;i < notifyees.length;i += 1) {notifyees[i].apply(this.cursor,arguments);}return this;};}); /*********************************************************
	 * The publicly exposed MathQuill API.
	 ********************************************************/var API={},Options=P(),optionProcessors={},Progenote=P(),EMBEDS={}; /**
	 * Interface Versioning (#459, #495) to allow us to virtually guarantee
	 * backcompat. v0.10.x introduces it, so for now, don't completely break the
	 * API for people who don't know about it, just complain with console.warn().
	 *
	 * The methods are shimmed in outro.js so that MQ.MathField.prototype etc can
	 * be accessed.
	 */function insistOnInterVer(){if(window.console)console.warn('You are using the MathQuill API without specifying an interface version, ' + 'which will fail in v1.0.0. Easiest fix is to do the following before ' + 'doing anything else:\n' + '\n' + '    MathQuill = MathQuill.getInterface(1);\n' + '    // now MathQuill.MathField() works like it used to\n' + '\n' + 'See also the "`dev` branch (2014–2015) → v0.10.0 Migration Guide" at\n' + '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide');} // globally exported API object
	function MathQuill(el){insistOnInterVer();return MQ1(el);};MathQuill.prototype = Progenote.p;MathQuill.interfaceVersion = function(v){ // shim for #459-era interface versioning (ended with #495)
	if(v !== 1)throw 'Only interface version 1 supported. You specified: ' + v;insistOnInterVer = function(){if(window.console)console.warn('You called MathQuill.interfaceVersion(1); to specify the interface ' + 'version, which will fail in v1.0.0. You can fix this easily by doing ' + 'this before doing anything else:\n' + '\n' + '    MathQuill = MathQuill.getInterface(1);\n' + '    // now MathQuill.MathField() works like it used to\n' + '\n' + 'See also the "`dev` branch (2014–2015) → v0.10.0 Migration Guide" at\n' + '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide');};insistOnInterVer();return MathQuill;};MathQuill.getInterface = getInterface;var MIN=getInterface.MIN = 1,MAX=getInterface.MAX = 2;function getInterface(v){if(!(MIN <= v && v <= MAX))throw 'Only interface versions between ' + MIN + ' and ' + MAX + ' supported. You specified: ' + v; /**
	   * Function that takes an HTML element and, if it's the root HTML element of a
	   * static math or math or text field, returns an API object for it (else, null).
	   *
	   *   var mathfield = MQ.MathField(mathFieldSpan);
	   *   assert(MQ(mathFieldSpan).id === mathfield.id);
	   *   assert(MQ(mathFieldSpan).id === MQ(mathFieldSpan).id);
	   *
	   */function MQ(el){if(!el || !el.nodeType)return null; // check that `el` is a HTML element, using the
	// same technique as jQuery: https://github.com/jquery/jquery/blob/679536ee4b7a92ae64a5f58d90e9cc38c001e807/src/core/init.js#L92
	var blockId=$(el).children('.mq-root-block').attr(mqBlockId);var ctrlr=blockId && Node.byId[blockId].controller;return ctrlr?APIClasses[ctrlr.KIND_OF_MQ](ctrlr):null;};var APIClasses={};MQ.L = L;MQ.R = R;function config(currentOptions,newOptions){if(newOptions && newOptions.handlers){newOptions.handlers = {fns:newOptions.handlers,APIClasses:APIClasses};}for(var name in newOptions) if(newOptions.hasOwnProperty(name)){var value=newOptions[name],processor=optionProcessors[name];currentOptions[name] = processor?processor(value):value;}}MQ.config = function(opts){config(Options.p,opts);return this;};MQ.registerEmbed = function(name,options){if(!/^[a-z][a-z0-9]*$/i.test(name)){throw 'Embed name must start with letter and be only letters and digits';}EMBEDS[name] = options;};var AbstractMathQuill=APIClasses.AbstractMathQuill = P(Progenote,function(_){_.init = function(ctrlr){this.__controller = ctrlr;this.__options = ctrlr.options;this.id = ctrlr.id;this.data = ctrlr.data;};_.__mathquillify = function(classNames){var ctrlr=this.__controller,root=ctrlr.root,el=ctrlr.container;ctrlr.createTextarea();var contents=el.addClass(classNames).contents().detach();root.jQ = $('<span class="mq-root-block"/>').attr(mqBlockId,root.id).appendTo(el);this.latex(contents.text());this.revert = function(){return el.empty().unbind('.mathquill').removeClass('mq-editable-field mq-math-mode mq-text-mode').append(contents);};};_.config = function(opts){config(this.__options,opts);return this;};_.el = function(){return this.__controller.container[0];};_.text = function(){return this.__controller.exportText();};_.latex = function(latex){if(arguments.length > 0){this.__controller.renderLatexMath(latex);if(this.__controller.blurred)this.__controller.cursor.hide().parent.blur();return this;}return this.__controller.exportLatex();};_.html = function(){return this.__controller.root.jQ.html().replace(/ mathquill-(?:command|block)-id="?\d+"?/g,'').replace(/<span class="?mq-cursor( mq-blink)?"?>.?<\/span>/i,'').replace(/ mq-hasCursor|mq-hasCursor ?/,'').replace(/ class=(""|(?= |>))/g,'');};_.reflow = function(){this.__controller.root.postOrder('reflow');return this;};});MQ.prototype = AbstractMathQuill.prototype;APIClasses.EditableField = P(AbstractMathQuill,function(_,super_){_.__mathquillify = function(){super_.__mathquillify.apply(this,arguments);this.__controller.editable = true;this.__controller.delegateMouseEvents();this.__controller.editablesTextareaEvents();return this;};_.focus = function(){this.__controller.textarea.focus();return this;};_.blur = function(){this.__controller.textarea.blur();return this;};_.write = function(latex){this.__controller.writeLatex(latex);this.__controller.scrollHoriz();if(this.__controller.blurred)this.__controller.cursor.hide().parent.blur();return this;};_.cmd = function(cmd){var ctrlr=this.__controller.notify(),cursor=ctrlr.cursor;if(/^\\[a-z]+$/i.test(cmd)){cmd = cmd.slice(1);var klass=LatexCmds[cmd];if(klass){cmd = klass(cmd);if(cursor.selection)cmd.replaces(cursor.replaceSelection());cmd.createLeftOf(cursor.show());this.__controller.scrollHoriz();}else  /* TODO: API needs better error reporting */;}else cursor.parent.write(cursor,cmd);if(ctrlr.blurred)cursor.hide().parent.blur();return this;};_.select = function(){var ctrlr=this.__controller;ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);while(ctrlr.cursor[L]) ctrlr.selectLeft();return this;};_.clearSelection = function(){this.__controller.cursor.clearSelection();return this;};_.moveToDirEnd = function(dir){this.__controller.notify('move').cursor.insAtDirEnd(dir,this.__controller.root);return this;};_.moveToLeftEnd = function(){return this.moveToDirEnd(L);};_.moveToRightEnd = function(){return this.moveToDirEnd(R);};_.keystroke = function(keys){var keys=keys.replace(/^\s+|\s+$/g,'').split(/\s+/);for(var i=0;i < keys.length;i += 1) {this.__controller.keystroke(keys[i],{preventDefault:noop});}return this;};_.typedText = function(text){for(var i=0;i < text.length;i += 1) this.__controller.typedText(text.charAt(i));return this;};_.dropEmbedded = function(pageX,pageY,options){var clientX=pageX - $(window).scrollLeft();var clientY=pageY - $(window).scrollTop();var el=document.elementFromPoint(clientX,clientY);this.__controller.seek($(el),pageX,pageY);var cmd=Embed().setOptions(options);cmd.createLeftOf(this.__controller.cursor);};_.clickAt = function(clientX,clientY,target){target = target || document.elementFromPoint(clientX,clientY);var ctrlr=this.__controller,root=ctrlr.root;if(!jQuery.contains(root.jQ[0],target))target = root.jQ[0];ctrlr.seek($(target),clientX + pageXOffset,clientY + pageYOffset);if(ctrlr.blurred)this.focus();return this;};_.ignoreNextMousedown = function(fn){this.__controller.cursor.options.ignoreNextMousedown = fn;return this;};});MQ.EditableField = function(){throw "wtf don't call me, I'm 'abstract'";};MQ.EditableField.prototype = APIClasses.EditableField.prototype; /**
	   * Export the API functions that MathQuill-ify an HTML element into API objects
	   * of each class. If the element had already been MathQuill-ified but into a
	   * different kind (or it's not an HTML element), return null.
	   */for(var kind in API) (function(kind,defAPIClass){var APIClass=APIClasses[kind] = defAPIClass(APIClasses);MQ[kind] = function(el,opts){var mq=MQ(el);if(mq instanceof APIClass || !el || !el.nodeType)return mq;var ctrlr=Controller(APIClass.RootBlock(),$(el),Options());ctrlr.KIND_OF_MQ = kind;return APIClass(ctrlr).__mathquillify(opts,v);};MQ[kind].prototype = APIClass.prototype;})(kind,API[kind]);return MQ;}MathQuill.noConflict = function(){window.MathQuill = origMathQuill;return MathQuill;};var origMathQuill=window.MathQuill;window.MathQuill = MathQuill;function RootBlockMixin(_){var names='moveOutOf deleteOutOf selectOutOf upOutOf downOutOf'.split(' ');for(var i=0;i < names.length;i += 1) (function(name){_[name] = function(dir){this.controller.handle(name,dir);};})(names[i]);_.reflow = function(){this.controller.handle('reflow');this.controller.handle('edited');this.controller.handle('edit');};}var Parser=P(function(_,super_,Parser){ // The Parser object is a wrapper for a parser function.
	// Externally, you use one to parse a string by calling
	//   var result = SomeParser.parse('Me Me Me! Parse Me!');
	// You should never call the constructor, rather you should
	// construct your Parser from the base parsers and the
	// parser combinator methods.
	function parseError(stream,message){if(stream){stream = "'" + stream + "'";}else {stream = 'EOF';}throw 'Parse Error: ' + message + ' at ' + stream;}_.init = function(body){this._ = body;};_.parse = function(stream){return this.skip(eof)._('' + stream,success,parseError);function success(stream,result){return result;}}; // -*- primitive combinators -*- //
	_.or = function(alternative){pray('or is passed a parser',alternative instanceof Parser);var self=this;return Parser(function(stream,onSuccess,onFailure){return self._(stream,onSuccess,failure);function failure(newStream){return alternative._(stream,onSuccess,onFailure);}});};_.then = function(next){var self=this;return Parser(function(stream,onSuccess,onFailure){return self._(stream,success,onFailure);function success(newStream,result){var nextParser=next instanceof Parser?next:next(result);pray('a parser is returned',nextParser instanceof Parser);return nextParser._(newStream,onSuccess,onFailure);}});}; // -*- optimized iterative combinators -*- //
	_.many = function(){var self=this;return Parser(function(stream,onSuccess,onFailure){var xs=[];while(self._(stream,success,failure));return onSuccess(stream,xs);function success(newStream,x){stream = newStream;xs.push(x);return true;}function failure(){return false;}});};_.times = function(min,max){if(arguments.length < 2)max = min;var self=this;return Parser(function(stream,onSuccess,onFailure){var xs=[];var result=true;var failure;for(var i=0;i < min;i += 1) {result = self._(stream,success,firstFailure);if(!result)return onFailure(stream,failure);}for(;i < max && result;i += 1) {result = self._(stream,success,secondFailure);}return onSuccess(stream,xs);function success(newStream,x){xs.push(x);stream = newStream;return true;}function firstFailure(newStream,msg){failure = msg;stream = newStream;return false;}function secondFailure(newStream,msg){return false;}});}; // -*- higher-level combinators -*- //
	_.result = function(res){return this.then(succeed(res));};_.atMost = function(n){return this.times(0,n);};_.atLeast = function(n){var self=this;return self.times(n).then(function(start){return self.many().map(function(end){return start.concat(end);});});};_.map = function(fn){return this.then(function(result){return succeed(fn(result));});};_.skip = function(two){return this.then(function(result){return two.result(result);});}; // -*- primitive parsers -*- //
	var string=this.string = function(str){var len=str.length;var expected="expected '" + str + "'";return Parser(function(stream,onSuccess,onFailure){var head=stream.slice(0,len);if(head === str){return onSuccess(stream.slice(len),head);}else {return onFailure(stream,expected);}});};var regex=this.regex = function(re){pray('regexp parser is anchored',re.toString().charAt(1) === '^');var expected='expected ' + re;return Parser(function(stream,onSuccess,onFailure){var match=re.exec(stream);if(match){var result=match[0];return onSuccess(stream.slice(result.length),result);}else {return onFailure(stream,expected);}});};var succeed=Parser.succeed = function(result){return Parser(function(stream,onSuccess){return onSuccess(stream,result);});};var fail=Parser.fail = function(msg){return Parser(function(stream,_,onFailure){return onFailure(stream,msg);});};var letter=Parser.letter = regex(/^[a-z]/i);var letters=Parser.letters = regex(/^[a-z]*/i);var digit=Parser.digit = regex(/^[0-9]/);var digits=Parser.digits = regex(/^[0-9]*/);var whitespace=Parser.whitespace = regex(/^\s+/);var optWhitespace=Parser.optWhitespace = regex(/^\s*/);var any=Parser.any = Parser(function(stream,onSuccess,onFailure){if(!stream)return onFailure(stream,'expected any character');return onSuccess(stream.slice(1),stream.charAt(0));});var all=Parser.all = Parser(function(stream,onSuccess,onFailure){return onSuccess('',stream);});var eof=Parser.eof = Parser(function(stream,onSuccess,onFailure){if(stream)return onFailure(stream,'expected EOF');return onSuccess(stream,stream);});}); /*************************************************
	 * Sane Keyboard Events Shim
	 *
	 * An abstraction layer wrapping the textarea in
	 * an object with methods to manipulate and listen
	 * to events on, that hides all the nasty cross-
	 * browser incompatibilities behind a uniform API.
	 *
	 * Design goal: This is a *HARD* internal
	 * abstraction barrier. Cross-browser
	 * inconsistencies are not allowed to leak through
	 * and be dealt with by event handlers. All future
	 * cross-browser issues that arise must be dealt
	 * with here, and if necessary, the API updated.
	 *
	 * Organization:
	 * - key values map and stringify()
	 * - saneKeyboardEvents()
	 *    + defer() and flush()
	 *    + event handler logic
	 *    + attach event handlers and export methods
	 ************************************************/var saneKeyboardEvents=(function(){ // The following [key values][1] map was compiled from the
	// [DOM3 Events appendix section on key codes][2] and
	// [a widely cited report on cross-browser tests of key codes][3],
	// except for 10: 'Enter', which I've empirically observed in Safari on iOS
	// and doesn't appear to conflict with any other known key codes.
	//
	// [1]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#keys-keyvalues
	// [2]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#fixed-virtual-key-codes
	// [3]: http://unixpapa.com/js/key.html
	var KEY_VALUES={8:'Backspace',9:'Tab',10:'Enter', // for Safari on iOS
	13:'Enter',16:'Shift',17:'Control',18:'Alt',20:'CapsLock',27:'Esc',32:'Spacebar',33:'PageUp',34:'PageDown',35:'End',36:'Home',37:'Left',38:'Up',39:'Right',40:'Down',45:'Insert',46:'Del',144:'NumLock'}; // To the extent possible, create a normalized string representation
	// of the key combo (i.e., key code and modifier keys).
	function stringify(evt){var which=evt.which || evt.keyCode;var keyVal=KEY_VALUES[which];var key;var modifiers=[];if(evt.ctrlKey)modifiers.push('Ctrl');if(evt.originalEvent && evt.originalEvent.metaKey)modifiers.push('Meta');if(evt.altKey)modifiers.push('Alt');if(evt.shiftKey)modifiers.push('Shift');key = keyVal || String.fromCharCode(which);if(!modifiers.length && !keyVal)return key;modifiers.push(key);return modifiers.join('-');} // create a keyboard events shim that calls callbacks at useful times
	// and exports useful public methods
	return function saneKeyboardEvents(el,handlers){var keydown=null;var keypress=null;var textarea=jQuery(el);var target=jQuery(handlers.container || textarea); // checkTextareaFor() is called after keypress or paste events to
	// say "Hey, I think something was just typed" or "pasted" (resp.),
	// so that at all subsequent opportune times (next event or timeout),
	// will check for expected typed or pasted text.
	// Need to check repeatedly because #135: in Safari 5.1 (at least),
	// after selecting something and then typing, the textarea is
	// incorrectly reported as selected during the input event (but not
	// subsequently).
	var checkTextarea=noop,timeoutId;function checkTextareaFor(checker){checkTextarea = checker;clearTimeout(timeoutId);timeoutId = setTimeout(checker);}target.bind('keydown keypress input keyup focusout paste',function(e){checkTextarea(e);}); // -*- public methods -*- //
	function select(text){ // check textarea at least once/one last time before munging (so
	// no race condition if selection happens after keypress/paste but
	// before checkTextarea), then never again ('cos it's been munged)
	checkTextarea();checkTextarea = noop;clearTimeout(timeoutId);textarea.val(text);if(text && textarea[0].select)textarea[0].select();shouldBeSelected = !!text;}var shouldBeSelected=false; // -*- helper subroutines -*- //
	// Determine whether there's a selection in the textarea.
	// This will always return false in IE < 9, which don't support
	// HTMLTextareaElement::selection{Start,End}.
	function hasSelection(){var dom=textarea[0];if(!('selectionStart' in dom))return false;return dom.selectionStart !== dom.selectionEnd;}function handleKey(){handlers.keystroke(stringify(keydown),keydown);} // -*- event handlers -*- //
	function onKeydown(e){keydown = e;keypress = null;if(shouldBeSelected)checkTextareaFor(function(e){if(!(e && e.type === 'focusout') && textarea[0].select){textarea[0].select(); // re-select textarea in case it's an unrecognized
	}checkTextarea = noop; // key that clears the selection, then never
	clearTimeout(timeoutId); // again, 'cos next thing might be blur
	});handleKey();}function onKeypress(e){ // call the key handler for repeated keypresses.
	// This excludes keypresses that happen directly
	// after keydown.  In that case, there will be
	// no previous keypress, so we skip it here
	if(keydown && keypress)handleKey();keypress = e;checkTextareaFor(typedText);}function typedText(){ // If there is a selection, the contents of the textarea couldn't
	// possibly have just been typed in.
	// This happens in browsers like Firefox and Opera that fire
	// keypress for keystrokes that are not text entry and leave the
	// selection in the textarea alone, such as Ctrl-C.
	// Note: we assume that browsers that don't support hasSelection()
	// also never fire keypress on keystrokes that are not text entry.
	// This seems reasonably safe because:
	// - all modern browsers including IE 9+ support hasSelection(),
	//   making it extremely unlikely any browser besides IE < 9 won't
	// - as far as we know IE < 9 never fires keypress on keystrokes
	//   that aren't text entry, which is only as reliable as our
	//   tests are comprehensive, but the IE < 9 way to do
	//   hasSelection() is poorly documented and is also only as
	//   reliable as our tests are comprehensive
	// If anything like #40 or #71 is reported in IE < 9, see
	// b1318e5349160b665003e36d4eedd64101ceacd8
	if(hasSelection())return;var text=textarea.val();if(text.length === 1){textarea.val('');handlers.typedText(text);} // in Firefox, keys that don't type text, just clear seln, fire keypress
	// https://github.com/mathquill/mathquill/issues/293#issuecomment-40997668
	else if(text && textarea[0].select)textarea[0].select(); // re-select if that's why we're here
	}function onBlur(){keydown = keypress = null;}function onPaste(e){ // browsers are dumb.
	//
	// In Linux, middle-click pasting causes onPaste to be called,
	// when the textarea is not necessarily focused.  We focus it
	// here to ensure that the pasted text actually ends up in the
	// textarea.
	//
	// It's pretty nifty that by changing focus in this handler,
	// we can change the target of the default action.  (This works
	// on keydown too, FWIW).
	//
	// And by nifty, we mean dumb (but useful sometimes).
	textarea.focus();checkTextareaFor(pastedText);}function pastedText(){var text=textarea.val();textarea.val('');if(text)handlers.paste(text);} // -*- attach event handlers -*- //
	target.bind({keydown:onKeydown,keypress:onKeypress,focusout:onBlur,paste:onPaste}); // -*- export public methods -*- //
	return {select:select};};})(); /***********************************************
	 * Export math in a human-readable text format
	 * As you can see, only half-baked so far.
	 **********************************************/Controller.open(function(_,super_){_.exportText = function(){return this.root.foldChildren('',function(text,child){return text + child.text();});};});Controller.open(function(_){_.focusBlurEvents = function(){var ctrlr=this,root=ctrlr.root,cursor=ctrlr.cursor;var blurTimeout;ctrlr.textarea.focus(function(){ctrlr.blurred = false;clearTimeout(blurTimeout);ctrlr.container.addClass('mq-focused');if(!cursor.parent)cursor.insAtRightEnd(root);if(cursor.selection){cursor.selection.jQ.removeClass('mq-blur');ctrlr.selectionChanged(); //re-select textarea contents after tabbing away and back
	}else cursor.show();}).blur(function(){ctrlr.blurred = true;blurTimeout = setTimeout(function(){ // wait for blur on window; if
	root.postOrder('intentionalBlur'); // none, intentional blur: #264
	cursor.clearSelection().endSelection();blur();});$(window).on('blur',windowBlur);});function windowBlur(){ // blur event also fired on window, just switching
	clearTimeout(blurTimeout); // tabs/windows, not intentional blur
	if(cursor.selection)cursor.selection.jQ.addClass('mq-blur');blur();}function blur(){ // not directly in the textarea blur handler so as to be
	cursor.hide().parent.blur(); // synchronous with/in the same frame as
	ctrlr.container.removeClass('mq-focused'); // clearing/blurring selection
	$(window).off('blur',windowBlur);}ctrlr.blurred = true;cursor.hide().parent.blur();};}); /**
	 * TODO: I wanted to move MathBlock::focus and blur here, it would clean
	 * up lots of stuff like, TextBlock::focus is set to MathBlock::focus
	 * and TextBlock::blur calls MathBlock::blur, when instead they could
	 * use inheritance and super_.
	 *
	 * Problem is, there's lots of calls to .focus()/.blur() on nodes
	 * outside Controller::focusBlurEvents(), such as .postOrder('blur') on
	 * insertion, which if MathBlock::blur becomes Node::blur, would add the
	 * 'blur' CSS class to all Symbol's (because .isEmpty() is true for all
	 * of them).
	 *
	 * I'm not even sure there aren't other troublesome calls to .focus() or
	 * .blur(), so this is TODO for now.
	 */ /*****************************************
	 * Deals with the browser DOM events from
	 * interaction with the typist.
	 ****************************************/Controller.open(function(_){_.keystroke = function(key,evt){this.cursor.parent.keystroke(key,evt,this);};});Node.open(function(_){_.keystroke = function(key,e,ctrlr){var cursor=ctrlr.cursor;switch(key){case 'Ctrl-Shift-Backspace':case 'Ctrl-Backspace':ctrlr.ctrlDeleteDir(L);break;case 'Shift-Backspace':case 'Backspace':ctrlr.backspace();break; // Tab or Esc -> go one block right if it exists, else escape right.
	case 'Esc':case 'Tab':ctrlr.escapeDir(R,key,e);return; // Shift-Tab -> go one block left if it exists, else escape left.
	case 'Shift-Tab':case 'Shift-Esc':ctrlr.escapeDir(L,key,e);return; // End -> move to the end of the current block.
	case 'End':ctrlr.notify('move').cursor.insAtRightEnd(cursor.parent);break; // Ctrl-End -> move all the way to the end of the root block.
	case 'Ctrl-End':ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);break; // Shift-End -> select to the end of the current block.
	case 'Shift-End':while(cursor[R]) {ctrlr.selectRight();}break; // Ctrl-Shift-End -> select to the end of the root block.
	case 'Ctrl-Shift-End':while(cursor[R] || cursor.parent !== ctrlr.root) {ctrlr.selectRight();}break; // Home -> move to the start of the root block or the current block.
	case 'Home':ctrlr.notify('move').cursor.insAtLeftEnd(cursor.parent);break; // Ctrl-Home -> move to the start of the current block.
	case 'Ctrl-Home':ctrlr.notify('move').cursor.insAtLeftEnd(ctrlr.root);break; // Shift-Home -> select to the start of the current block.
	case 'Shift-Home':while(cursor[L]) {ctrlr.selectLeft();}break; // Ctrl-Shift-Home -> move to the start of the root block.
	case 'Ctrl-Shift-Home':while(cursor[L] || cursor.parent !== ctrlr.root) {ctrlr.selectLeft();}break;case 'Left':ctrlr.moveLeft();break;case 'Shift-Left':ctrlr.selectLeft();break;case 'Ctrl-Left':break;case 'Right':ctrlr.moveRight();break;case 'Shift-Right':ctrlr.selectRight();break;case 'Ctrl-Right':break;case 'Up':ctrlr.moveUp();break;case 'Down':ctrlr.moveDown();break;case 'Shift-Up':if(cursor[L]){while(cursor[L]) ctrlr.selectLeft();}else {ctrlr.selectLeft();}case 'Shift-Down':if(cursor[R]){while(cursor[R]) ctrlr.selectRight();}else {ctrlr.selectRight();}case 'Ctrl-Up':break;case 'Ctrl-Down':break;case 'Ctrl-Shift-Del':case 'Ctrl-Del':ctrlr.ctrlDeleteDir(R);break;case 'Shift-Del':case 'Del':ctrlr.deleteForward();break;case 'Meta-A':case 'Ctrl-A':ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);while(cursor[L]) ctrlr.selectLeft();break;default:return;}e.preventDefault();ctrlr.scrollHoriz();};_.moveOutOf =  // called by Controller::escapeDir, moveDir
	_.moveTowards =  // called by Controller::moveDir
	_.deleteOutOf =  // called by Controller::deleteDir
	_.deleteTowards =  // called by Controller::deleteDir
	_.unselectInto =  // called by Controller::selectDir
	_.selectOutOf =  // called by Controller::selectDir
	_.selectTowards =  // called by Controller::selectDir
	function(){pray('overridden or never called on this node');};});Controller.open(function(_){this.onNotify(function(e){if(e === 'move' || e === 'upDown')this.show().clearSelection();});_.escapeDir = function(dir,key,e){prayDirection(dir);var cursor=this.cursor; // only prevent default of Tab if not in the root editable
	if(cursor.parent !== this.root)e.preventDefault(); // want to be a noop if in the root editable (in fact, Tab has an unrelated
	// default browser action if so)
	if(cursor.parent === this.root)return;cursor.parent.moveOutOf(dir,cursor);return this.notify('move');};optionProcessors.leftRightIntoCmdGoes = function(updown){if(updown && updown !== 'up' && updown !== 'down'){throw '"up" or "down" required for leftRightIntoCmdGoes option, ' + 'got "' + updown + '"';}return updown;};_.moveDir = function(dir){prayDirection(dir);var cursor=this.cursor,updown=cursor.options.leftRightIntoCmdGoes;if(cursor.selection){cursor.insDirOf(dir,cursor.selection.ends[dir]);}else if(cursor[dir])cursor[dir].moveTowards(dir,cursor,updown);else cursor.parent.moveOutOf(dir,cursor,updown);return this.notify('move');};_.moveLeft = function(){return this.moveDir(L);};_.moveRight = function(){return this.moveDir(R);}; /**
	   * moveUp and moveDown have almost identical algorithms:
	   * - first check left and right, if so insAtLeft/RightEnd of them
	   * - else check the parent's 'upOutOf'/'downOutOf' property:
	   *   + if it's a function, call it with the cursor as the sole argument and
	   *     use the return value as if it were the value of the property
	   *   + if it's a Node, jump up or down into it:
	   *     - if there is a cached Point in the block, insert there
	   *     - else, seekHoriz within the block to the current x-coordinate (to be
	   *       as close to directly above/below the current position as possible)
	   *   + unless it's exactly `true`, stop bubbling
	   */_.moveUp = function(){return moveUpDown(this,'up');};_.moveDown = function(){return moveUpDown(this,'down');};function moveUpDown(self,dir){var cursor=self.notify('upDown').cursor;var dirInto=dir + 'Into',dirOutOf=dir + 'OutOf';if(cursor[R][dirInto])cursor.insAtLeftEnd(cursor[R][dirInto]);else if(cursor[L][dirInto])cursor.insAtRightEnd(cursor[L][dirInto]);else {cursor.parent.bubble(function(ancestor){var prop=ancestor[dirOutOf];if(prop){if(typeof prop === 'function')prop = ancestor[dirOutOf](cursor);if(prop instanceof Node)cursor.jumpUpDown(ancestor,prop);if(prop !== true)return false;}});}return self;}this.onNotify(function(e){if(e !== 'upDown')this.upDownCache = {};});this.onNotify(function(e){if(e === 'edit')this.show().deleteSelection();});_.deleteDir = function(dir){prayDirection(dir);var cursor=this.cursor;var hadSelection=cursor.selection;this.notify('edit'); // deletes selection if present
	if(!hadSelection){if(cursor[dir])cursor[dir].deleteTowards(dir,cursor);else cursor.parent.deleteOutOf(dir,cursor);}if(cursor[L].siblingDeleted)cursor[L].siblingDeleted(cursor.options,R);if(cursor[R].siblingDeleted)cursor[R].siblingDeleted(cursor.options,L);cursor.parent.bubble('reflow');return this;};_.ctrlDeleteDir = function(dir){prayDirection(dir);var cursor=this.cursor;if(!cursor[L] || cursor.selection)return ctrlr.deleteDir();this.notify('edit');Fragment(cursor.parent.ends[L],cursor[L]).remove();cursor.insAtDirEnd(L,cursor.parent);if(cursor[L].siblingDeleted)cursor[L].siblingDeleted(cursor.options,R);if(cursor[R].siblingDeleted)cursor[R].siblingDeleted(cursor.options,L);cursor.parent.bubble('reflow');return this;};_.backspace = function(){return this.deleteDir(L);};_.deleteForward = function(){return this.deleteDir(R);};this.onNotify(function(e){if(e !== 'select')this.endSelection();});_.selectDir = function(dir){var cursor=this.notify('select').cursor,seln=cursor.selection;prayDirection(dir);if(!cursor.anticursor)cursor.startSelection();var node=cursor[dir];if(node){ // "if node we're selecting towards is inside selection (hence retracting)
	// and is on the *far side* of the selection (hence is only node selected)
	// and the anticursor is *inside* that node, not just on the other side"
	if(seln && seln.ends[dir] === node && cursor.anticursor[-dir] !== node){node.unselectInto(dir,cursor);}else node.selectTowards(dir,cursor);}else cursor.parent.selectOutOf(dir,cursor);cursor.clearSelection();cursor.select() || cursor.show();};_.selectLeft = function(){return this.selectDir(L);};_.selectRight = function(){return this.selectDir(R);};}); // Parser MathBlock
	var latexMathParser=(function(){function commandToBlock(cmd){ // can also take in a Fragment
	var block=MathBlock();cmd.adopt(block,0,0);return block;}function joinBlocks(blocks){var firstBlock=blocks[0] || MathBlock();for(var i=1;i < blocks.length;i += 1) {blocks[i].children().adopt(firstBlock,firstBlock.ends[R],0);}return firstBlock;}var string=Parser.string;var regex=Parser.regex;var letter=Parser.letter;var any=Parser.any;var optWhitespace=Parser.optWhitespace;var succeed=Parser.succeed;var fail=Parser.fail; // Parsers yielding either MathCommands, or Fragments of MathCommands
	//   (either way, something that can be adopted by a MathBlock)
	var variable=letter.map(function(c){return Letter(c);});var symbol=regex(/^[^${}\\_^]/).map(function(c){return VanillaSymbol(c);});var controlSequence=regex(/^[^\\a-eg-zA-Z]/) // hotfix #164; match MathBlock::write
	.or(string('\\').then(regex(/^[a-z]+/i).or(regex(/^\s+/).result(' ')).or(any))).then(function(ctrlSeq){var cmdKlass=LatexCmds[ctrlSeq];if(cmdKlass){return cmdKlass(ctrlSeq).parser();}else {return fail('unknown command: \\' + ctrlSeq);}});var command=controlSequence.or(variable).or(symbol); // Parsers yielding MathBlocks
	var mathGroup=string('{').then(function(){return mathSequence;}).skip(string('}'));var mathBlock=optWhitespace.then(mathGroup.or(command.map(commandToBlock)));var mathSequence=mathBlock.many().map(joinBlocks).skip(optWhitespace);var optMathBlock=string('[').then(mathBlock.then(function(block){return block.join('latex') !== ']'?succeed(block):fail();}).many().map(joinBlocks).skip(optWhitespace)).skip(string(']'));var latexMath=mathSequence;latexMath.block = mathBlock;latexMath.optBlock = optMathBlock;return latexMath;})();Controller.open(function(_,super_){_.exportLatex = function(){return this.root.latex().replace(/(\\[a-z]+) (?![a-z])/ig,'$1');};_.writeLatex = function(latex){var cursor=this.notify('edit').cursor;var all=Parser.all;var eof=Parser.eof;var block=latexMathParser.skip(eof).or(all.result(false)).parse(latex);if(block && !block.isEmpty()){block.children().adopt(cursor.parent,cursor[L],cursor[R]);var jQ=block.jQize();jQ.insertBefore(cursor.jQ);cursor[L] = block.ends[R];block.finalizeInsert(cursor.options,cursor);if(block.ends[R][R].siblingCreated)block.ends[R][R].siblingCreated(cursor.options,L);if(block.ends[L][L].siblingCreated)block.ends[L][L].siblingCreated(cursor.options,R);cursor.parent.bubble('reflow');}return this;};_.renderLatexMath = function(latex){var root=this.root,cursor=this.cursor;var all=Parser.all;var eof=Parser.eof;var block=latexMathParser.skip(eof).or(all.result(false)).parse(latex);root.eachChild('postOrder','dispose');root.ends[L] = root.ends[R] = 0;if(block){block.children().adopt(root,0,0);}var jQ=root.jQ;if(block){var html=block.join('html');jQ.html(html);root.jQize(jQ.children());root.finalizeInsert(cursor.options);}else {jQ.empty();}delete cursor.selection;cursor.insAtRightEnd(root);};_.renderLatexText = function(latex){var root=this.root,cursor=this.cursor;root.jQ.children().slice(1).remove();root.eachChild('postOrder','dispose');root.ends[L] = root.ends[R] = 0;delete cursor.selection;cursor.show().insAtRightEnd(root);var regex=Parser.regex;var string=Parser.string;var eof=Parser.eof;var all=Parser.all; // Parser RootMathCommand
	var mathMode=string('$').then(latexMathParser) // because TeX is insane, math mode doesn't necessarily
	// have to end.  So we allow for the case that math mode
	// continues to the end of the stream.
	.skip(string('$').or(eof)).map(function(block){ // HACK FIXME: this shouldn't have to have access to cursor
	var rootMathCommand=RootMathCommand(cursor);rootMathCommand.createBlocks();var rootMathBlock=rootMathCommand.ends[L];block.children().adopt(rootMathBlock,0,0);return rootMathCommand;});var escapedDollar=string('\\$').result('$');var textChar=escapedDollar.or(regex(/^[^$]/)).map(VanillaSymbol);var latexText=mathMode.or(textChar).many();var commands=latexText.skip(eof).or(all.result(false)).parse(latex);if(commands){for(var i=0;i < commands.length;i += 1) {commands[i].adopt(root,root.ends[R],0);}root.jQize().appendTo(root.jQ);root.finalizeInsert(cursor.options);}};}); /********************************************************
	 * Deals with mouse events for clicking, drag-to-select
	 *******************************************************/Controller.open(function(_){Options.p.ignoreNextMousedown = noop;_.delegateMouseEvents = function(){var ultimateRootjQ=this.root.jQ; //drag-to-select event handling
	this.container.bind('mousedown.mathquill',function(e){var rootjQ=$(e.target).closest('.mq-root-block');var root=Node.byId[rootjQ.attr(mqBlockId) || ultimateRootjQ.attr(mqBlockId)];var ctrlr=root.controller,cursor=ctrlr.cursor,blink=cursor.blink;var textareaSpan=ctrlr.textareaSpan,textarea=ctrlr.textarea;e.preventDefault(); // doesn't work in IE\u22648, but it's a one-line fix:
	e.target.unselectable = true; // http://jsbin.com/yagekiji/1
	if(cursor.options.ignoreNextMousedown(e))return;else cursor.options.ignoreNextMousedown = noop;var target;function mousemove(e){target = $(e.target);}function docmousemove(e){if(!cursor.anticursor)cursor.startSelection();ctrlr.seek(target,e.pageX,e.pageY).cursor.select();target = undefined;} // outside rootjQ, the MathQuill node corresponding to the target (if any)
	// won't be inside this root, so don't mislead Controller::seek with it
	function mouseup(e){cursor.blink = blink;if(!cursor.selection){if(ctrlr.editable){cursor.show();}else {textareaSpan.detach();}} // delete the mouse handlers now that we're not dragging anymore
	rootjQ.unbind('mousemove',mousemove);$(e.target.ownerDocument).unbind('mousemove',docmousemove).unbind('mouseup',mouseup);}if(ctrlr.blurred){if(!ctrlr.editable)rootjQ.prepend(textareaSpan);textarea.focus();}cursor.blink = noop;ctrlr.seek($(e.target),e.pageX,e.pageY).cursor.startSelection();rootjQ.mousemove(mousemove);$(e.target.ownerDocument).mousemove(docmousemove).mouseup(mouseup); // listen on document not just body to not only hear about mousemove and
	// mouseup on page outside field, but even outside page, except iframes: https://github.com/mathquill/mathquill/commit/8c50028afcffcace655d8ae2049f6e02482346c5#commitcomment-6175800
	});};});Controller.open(function(_){_.seek = function(target,pageX,pageY){var cursor=this.notify('select').cursor;if(target){var nodeId=target.attr(mqBlockId) || target.attr(mqCmdId);if(!nodeId){var targetParent=target.parent();nodeId = targetParent.attr(mqBlockId) || targetParent.attr(mqCmdId);}}var node=nodeId?Node.byId[nodeId]:this.root;pray('nodeId is the id of some Node that exists',node); // don't clear selection until after getting node from target, in case
	// target was selection span, otherwise target will have no parent and will
	// seek from root, which is less accurate (e.g. fraction)
	cursor.clearSelection().show();node.seek(pageX,cursor);this.scrollHoriz(); // before .selectFrom when mouse-selecting, so
	// always hits no-selection case in scrollHoriz and scrolls slower
	return this;};}); /***********************************************
	 * Horizontal panning for editable fields that
	 * overflow their width
	 **********************************************/Controller.open(function(_){_.scrollHoriz = function(){var cursor=this.cursor,seln=cursor.selection;var rootRect=this.root.jQ[0].getBoundingClientRect();if(!seln){var x=cursor.jQ[0].getBoundingClientRect().left;if(x > rootRect.right - 20)var scrollBy=x - (rootRect.right - 20);else if(x < rootRect.left + 20)var scrollBy=x - (rootRect.left + 20);else return;}else {var rect=seln.jQ[0].getBoundingClientRect();var overLeft=rect.left - (rootRect.left + 20);var overRight=rect.right - (rootRect.right - 20);if(seln.ends[L] === cursor[R]){if(overLeft < 0)var scrollBy=overLeft;else if(overRight > 0){if(rect.left - overRight < rootRect.left + 20)var scrollBy=overLeft;else var scrollBy=overRight;}else return;}else {if(overRight > 0)var scrollBy=overRight;else if(overLeft < 0){if(rect.right - overLeft > rootRect.right - 20)var scrollBy=overRight;else var scrollBy=overLeft;}else return;}}this.root.jQ.stop().animate({scrollLeft:'+=' + scrollBy},100);};}); /*********************************************
	 * Manage the MathQuill instance's textarea
	 * (as owned by the Controller)
	 ********************************************/Controller.open(function(_){Options.p.substituteTextarea = function(){return $('<textarea autocapitalize=off autocomplete=off autocorrect=off ' + 'spellcheck=false x-palm-disable-ste-all=true />')[0];};_.createTextarea = function(){var textareaSpan=this.textareaSpan = $('<span class="mq-textarea"></span>'),textarea=this.options.substituteTextarea();if(!textarea.nodeType){throw 'substituteTextarea() must return a DOM element, got ' + textarea;}textarea = this.textarea = $(textarea).appendTo(textareaSpan);var ctrlr=this;ctrlr.cursor.selectionChanged = function(){ctrlr.selectionChanged();};ctrlr.container.bind('copy',function(){ctrlr.setTextareaSelection();});};_.selectionChanged = function(){var ctrlr=this;forceIERedraw(ctrlr.container[0]); // throttle calls to setTextareaSelection(), because setting textarea.value
	// and/or calling textarea.select() can have anomalously bad performance:
	// https://github.com/mathquill/mathquill/issues/43#issuecomment-1399080
	if(ctrlr.textareaSelectionTimeout === undefined){ctrlr.textareaSelectionTimeout = setTimeout(function(){ctrlr.setTextareaSelection();});}};_.setTextareaSelection = function(){this.textareaSelectionTimeout = undefined;var latex='';if(this.cursor.selection){latex = this.cursor.selection.join('latex');if(this.options.statelessClipboard){ // FIXME: like paste, only this works for math fields; should ask parent
	latex = '$' + latex + '$';}}this.selectFn(latex);};_.staticMathTextareaEvents = function(){var ctrlr=this,root=ctrlr.root,cursor=ctrlr.cursor,textarea=ctrlr.textarea,textareaSpan=ctrlr.textareaSpan;this.container.prepend('<span class="mq-selectable">$' + ctrlr.exportLatex() + '$</span>');ctrlr.blurred = true;textarea.bind('cut paste',false).focus(function(){ctrlr.blurred = false;}).blur(function(){if(cursor.selection)cursor.selection.clear();setTimeout(detach); //detaching during blur explodes in WebKit
	});function detach(){textareaSpan.detach();ctrlr.blurred = true;}ctrlr.selectFn = function(text){textarea.val(text);if(text)textarea.select();};};_.editablesTextareaEvents = function(){var ctrlr=this,root=ctrlr.root,cursor=ctrlr.cursor,textarea=ctrlr.textarea,textareaSpan=ctrlr.textareaSpan;var keyboardEventsShim=saneKeyboardEvents(textarea,this);this.selectFn = function(text){keyboardEventsShim.select(text);};this.container.prepend(textareaSpan).on('cut',function(e){if(cursor.selection){setTimeout(function(){ctrlr.notify('edit'); // deletes selection if present
	cursor.parent.bubble('reflow');});}});this.focusBlurEvents();};_.typedText = function(ch){if(ch === '\n')return this.handle('enter');var cursor=this.notify().cursor;cursor.parent.write(cursor,ch);this.scrollHoriz();};_.paste = function(text){ // TODO: document `statelessClipboard` config option in README, after
	// making it work like it should, that is, in both text and math mode
	// (currently only works in math fields, so worse than pointless, it
	//  only gets in the way by \text{}-ifying pasted stuff and $-ifying
	//  cut/copied LaTeX)
	if(this.options.statelessClipboard){if(text.slice(0,1) === '$' && text.slice(-1) === '$'){text = text.slice(1,-1);}else {text = '\\text{' + text + '}';}} // FIXME: this always inserts math or a TextBlock, even in a RootTextBlock
	this.writeLatex(text).cursor.show();};}); /*************************************************
	 * Abstract classes of math blocks and commands.
	 ************************************************/ /**
	 * Math tree node base class.
	 * Some math-tree-specific extensions to Node.
	 * Both MathBlock's and MathCommand's descend from it.
	 */var MathElement=P(Node,function(_,super_){_.finalizeInsert = function(options,cursor){ // `cursor` param is only for
	// SupSub::contactWeld, and is deliberately only passed in by writeLatex,
	// see ea7307eb4fac77c149a11ffdf9a831df85247693
	var self=this;self.postOrder('finalizeTree',options);self.postOrder('contactWeld',cursor); // note: this order is important.
	// empty elements need the empty box provided by blur to
	// be present in order for their dimensions to be measured
	// correctly by 'reflow' handlers.
	self.postOrder('blur');self.postOrder('reflow');if(self[R].siblingCreated)self[R].siblingCreated(options,L);if(self[L].siblingCreated)self[L].siblingCreated(options,R);self.bubble('reflow');};}); /**
	 * Commands and operators, like subscripts, exponents, or fractions.
	 * Descendant commands are organized into blocks.
	 */var MathCommand=P(MathElement,function(_,super_){_.init = function(ctrlSeq,htmlTemplate,textTemplate){var cmd=this;super_.init.call(cmd);if(!cmd.ctrlSeq)cmd.ctrlSeq = ctrlSeq;if(htmlTemplate)cmd.htmlTemplate = htmlTemplate;if(textTemplate)cmd.textTemplate = textTemplate;}; // obvious methods
	_.replaces = function(replacedFragment){replacedFragment.disown();this.replacedFragment = replacedFragment;};_.isEmpty = function(){return this.foldChildren(true,function(isEmpty,child){return isEmpty && child.isEmpty();});};_.parser = function(){var block=latexMathParser.block;var self=this;return block.times(self.numBlocks()).map(function(blocks){self.blocks = blocks;for(var i=0;i < blocks.length;i += 1) {blocks[i].adopt(self,self.ends[R],0);}return self;});}; // createLeftOf(cursor) and the methods it calls
	_.createLeftOf = function(cursor){var cmd=this;var replacedFragment=cmd.replacedFragment;cmd.createBlocks();super_.createLeftOf.call(cmd,cursor);if(replacedFragment){replacedFragment.adopt(cmd.ends[L],0,0);replacedFragment.jQ.appendTo(cmd.ends[L].jQ);}cmd.finalizeInsert(cursor.options);cmd.placeCursor(cursor);};_.createBlocks = function(){var cmd=this,numBlocks=cmd.numBlocks(),blocks=cmd.blocks = Array(numBlocks);for(var i=0;i < numBlocks;i += 1) {var newBlock=blocks[i] = MathBlock();newBlock.adopt(cmd,cmd.ends[R],0);}};_.placeCursor = function(cursor){ //insert the cursor at the right end of the first empty child, searching
	//left-to-right, or if none empty, the right end child
	cursor.insAtRightEnd(this.foldChildren(this.ends[L],function(leftward,child){return leftward.isEmpty()?leftward:child;}));}; // editability methods: called by the cursor for editing, cursor movements,
	// and selection of the MathQuill tree, these all take in a direction and
	// the cursor
	_.moveTowards = function(dir,cursor,updown){var updownInto=updown && this[updown + 'Into'];cursor.insAtDirEnd(-dir,updownInto || this.ends[-dir]);};_.deleteTowards = function(dir,cursor){if(this.isEmpty())cursor[dir] = this.remove()[dir];else this.moveTowards(dir,cursor,null);};_.selectTowards = function(dir,cursor){cursor[-dir] = this;cursor[dir] = this[dir];};_.selectChildren = function(){return Selection(this,this);};_.unselectInto = function(dir,cursor){cursor.insAtDirEnd(-dir,cursor.anticursor.ancestors[this.id]);};_.seek = function(pageX,cursor){function getBounds(node){var bounds={};bounds[L] = node.jQ.offset().left;bounds[R] = bounds[L] + node.jQ.outerWidth();return bounds;}var cmd=this;var cmdBounds=getBounds(cmd);if(pageX < cmdBounds[L])return cursor.insLeftOf(cmd);if(pageX > cmdBounds[R])return cursor.insRightOf(cmd);var leftLeftBound=cmdBounds[L];cmd.eachChild(function(block){var blockBounds=getBounds(block);if(pageX < blockBounds[L]){ // closer to this block's left bound, or the bound left of that?
	if(pageX - leftLeftBound < blockBounds[L] - pageX){if(block[L])cursor.insAtRightEnd(block[L]);else cursor.insLeftOf(cmd);}else cursor.insAtLeftEnd(block);return false;}else if(pageX > blockBounds[R]){if(block[R])leftLeftBound = blockBounds[R]; // continue to next block
	else { // last (rightmost) block
	// closer to this block's right bound, or the cmd's right bound?
	if(cmdBounds[R] - pageX < pageX - blockBounds[R]){cursor.insRightOf(cmd);}else cursor.insAtRightEnd(block);}}else {block.seek(pageX,cursor);return false;}});}; // methods involved in creating and cross-linking with HTML DOM nodes
	/*
	    They all expect an .htmlTemplate like
	      '<span>&0</span>'
	    or
	      '<span><span>&0</span><span>&1</span></span>'
	
	    See html.test.js for more examples.
	
	    Requirements:
	    - For each block of the command, there must be exactly one "block content
	      marker" of the form '&<number>' where <number> is the 0-based index of the
	      block. (Like the LaTeX \newcommand syntax, but with a 0-based rather than
	      1-based index, because JavaScript because C because Dijkstra.)
	    - The block content marker must be the sole contents of the containing
	      element, there can't even be surrounding whitespace, or else we can't
	      guarantee sticking to within the bounds of the block content marker when
	      mucking with the HTML DOM.
	    - The HTML not only must be well-formed HTML (of course), but also must
	      conform to the XHTML requirements on tags, specifically all tags must
	      either be self-closing (like '<br/>') or come in matching pairs.
	      Close tags are never optional.
	
	    Note that &<number> isn't well-formed HTML; if you wanted a literal '&123',
	    your HTML template would have to have '&amp;123'.
	  */_.numBlocks = function(){var matches=this.htmlTemplate.match(/&\d+/g);return matches?matches.length:0;};_.html = function(){ // Render the entire math subtree rooted at this command, as HTML.
	// Expects .createBlocks() to have been called already, since it uses the
	// .blocks array of child blocks.
	//
	// See html.test.js for example templates and intended outputs.
	//
	// Given an .htmlTemplate as described above,
	// - insert the mathquill-command-id attribute into all top-level tags,
	//   which will be used to set this.jQ in .jQize().
	//   This is straightforward:
	//     * tokenize into tags and non-tags
	//     * loop through top-level tokens:
	//         * add #cmdId attribute macro to top-level self-closing tags
	//         * else add #cmdId attribute macro to top-level open tags
	//             * skip the matching top-level close tag and all tag pairs
	//               in between
	// - for each block content marker,
	//     + replace it with the contents of the corresponding block,
	//       rendered as HTML
	//     + insert the mathquill-block-id attribute into the containing tag
	//   This is even easier, a quick regex replace, since block tags cannot
	//   contain anything besides the block content marker.
	//
	// Two notes:
	// - The outermost loop through top-level tokens should never encounter any
	//   top-level close tags, because we should have first encountered a
	//   matching top-level open tag, all inner tags should have appeared in
	//   matching pairs and been skipped, and then we should have skipped the
	//   close tag in question.
	// - All open tags should have matching close tags, which means our inner
	//   loop should always encounter a close tag and drop nesting to 0. If
	//   a close tag is missing, the loop will continue until i >= tokens.length
	//   and token becomes undefined. This will not infinite loop, even in
	//   production without pray(), because it will then TypeError on .slice().
	var cmd=this;var blocks=cmd.blocks;var cmdId=' mathquill-command-id=' + cmd.id;var tokens=cmd.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);pray('no unmatched angle brackets',tokens.join('') === this.htmlTemplate); // add cmdId to all top-level tags
	for(var i=0,token=tokens[0];token;i += 1,token = tokens[i]) { // top-level self-closing tags
	if(token.slice(-2) === '/>'){tokens[i] = token.slice(0,-2) + cmdId + '/>';} // top-level open tags
	else if(token.charAt(0) === '<'){pray('not an unmatched top-level close tag',token.charAt(1) !== '/');tokens[i] = token.slice(0,-1) + cmdId + '>'; // skip matching top-level close tag and all tag pairs in between
	var nesting=1;do {i += 1,token = tokens[i];pray('no missing close tags',token); // close tags
	if(token.slice(0,2) === '</'){nesting -= 1;} // non-self-closing open tags
	else if(token.charAt(0) === '<' && token.slice(-2) !== '/>'){nesting += 1;}}while(nesting > 0);}}return tokens.join('').replace(/>&(\d+)/g,function($0,$1){return ' mathquill-block-id=' + blocks[$1].id + '>' + blocks[$1].join('html');});}; // methods to export a string representation of the math tree
	_.latex = function(){return this.foldChildren(this.ctrlSeq,function(latex,child){return latex + '{' + (child.latex() || ' ') + '}';});};_.textTemplate = [''];_.text = function(){var cmd=this,i=0;return cmd.foldChildren(cmd.textTemplate[i],function(text,child){i += 1;var child_text=child.text();if(text && cmd.textTemplate[i] === '(' && child_text[0] === '(' && child_text.slice(-1) === ')')return text + child_text.slice(1,-1) + cmd.textTemplate[i];return text + child.text() + (cmd.textTemplate[i] || '');});};}); /**
	 * Lightweight command without blocks or children.
	 */var Symbol=P(MathCommand,function(_,super_){_.init = function(ctrlSeq,html,text){if(!text)text = ctrlSeq && ctrlSeq.length > 1?ctrlSeq.slice(1):ctrlSeq;super_.init.call(this,ctrlSeq,html,[text]);};_.parser = function(){return Parser.succeed(this);};_.numBlocks = function(){return 0;};_.replaces = function(replacedFragment){replacedFragment.remove();};_.createBlocks = noop;_.moveTowards = function(dir,cursor){cursor.jQ.insDirOf(dir,this.jQ);cursor[-dir] = this;cursor[dir] = this[dir];};_.deleteTowards = function(dir,cursor){cursor[dir] = this.remove()[dir];};_.seek = function(pageX,cursor){ // insert at whichever side the click was closer to
	if(pageX - this.jQ.offset().left < this.jQ.outerWidth() / 2)cursor.insLeftOf(this);else cursor.insRightOf(this);};_.latex = function(){return this.ctrlSeq;};_.text = function(){return this.textTemplate;};_.placeCursor = noop;_.isEmpty = function(){return true;};});var VanillaSymbol=P(Symbol,function(_,super_){_.init = function(ch,html){super_.init.call(this,ch,'<span>' + (html || ch) + '</span>');};});var BinaryOperator=P(Symbol,function(_,super_){_.init = function(ctrlSeq,html,text){super_.init.call(this,ctrlSeq,'<span class="mq-binary-operator">' + html + '</span>',text);};}); /**
	 * Children and parent of MathCommand's. Basically partitions all the
	 * symbols and operators that descend (in the Math DOM tree) from
	 * ancestor operators.
	 */var MathBlock=P(MathElement,function(_,super_){_.join = function(methodName){return this.foldChildren('',function(fold,child){return fold + child[methodName]();});};_.html = function(){return this.join('html');};_.latex = function(){return this.join('latex');};_.text = function(){return this.ends[L] === this.ends[R] && this.ends[L] !== 0?this.ends[L].text():this.join('text');};_.keystroke = function(key,e,ctrlr){if(ctrlr.options.spaceBehavesLikeTab && (key === 'Spacebar' || key === 'Shift-Spacebar')){e.preventDefault();ctrlr.escapeDir(key === 'Shift-Spacebar'?L:R,key,e);return;}return super_.keystroke.apply(this,arguments);}; // editability methods: called by the cursor for editing, cursor movements,
	// and selection of the MathQuill tree, these all take in a direction and
	// the cursor
	_.moveOutOf = function(dir,cursor,updown){var updownInto=updown && this.parent[updown + 'Into'];if(!updownInto && this[dir])cursor.insAtDirEnd(-dir,this[dir]);else cursor.insDirOf(dir,this.parent);};_.selectOutOf = function(dir,cursor){cursor.insDirOf(dir,this.parent);};_.deleteOutOf = function(dir,cursor){cursor.unwrapGramp();};_.seek = function(pageX,cursor){var node=this.ends[R];if(!node || node.jQ.offset().left + node.jQ.outerWidth() < pageX){return cursor.insAtRightEnd(this);}if(pageX < this.ends[L].jQ.offset().left)return cursor.insAtLeftEnd(this);while(pageX < node.jQ.offset().left) node = node[L];return node.seek(pageX,cursor);};_.chToCmd = function(ch){var cons; // exclude f because it gets a dedicated command with more spacing
	if(ch.match(/^[a-eg-zA-Z]$/))return Letter(ch);else if(/^\d$/.test(ch))return Digit(ch);else if(cons = CharCmds[ch] || LatexCmds[ch])return cons(ch);else return VanillaSymbol(ch);};_.write = function(cursor,ch){var cmd=this.chToCmd(ch);if(cursor.selection)cmd.replaces(cursor.replaceSelection());cmd.createLeftOf(cursor.show());};_.focus = function(){this.jQ.addClass('mq-hasCursor');this.jQ.removeClass('mq-empty');return this;};_.blur = function(){this.jQ.removeClass('mq-hasCursor');if(this.isEmpty())this.jQ.addClass('mq-empty');return this;};});API.StaticMath = function(APIClasses){return P(APIClasses.AbstractMathQuill,function(_,super_){this.RootBlock = MathBlock;_.__mathquillify = function(){super_.__mathquillify.call(this,'mq-math-mode');this.__controller.delegateMouseEvents();this.__controller.staticMathTextareaEvents();return this;};_.init = function(){super_.init.apply(this,arguments);this.__controller.root.postOrder('registerInnerField',this.innerFields = [],APIClasses.MathField);};_.latex = function(){var returned=super_.latex.apply(this,arguments);if(arguments.length > 0){this.__controller.root.postOrder('registerInnerField',this.innerFields = [],APIClasses.MathField);}return returned;};});};var RootMathBlock=P(MathBlock,RootBlockMixin);API.MathField = function(APIClasses){return P(APIClasses.EditableField,function(_,super_){this.RootBlock = RootMathBlock;_.__mathquillify = function(opts,interfaceVersion){this.config(opts);if(interfaceVersion > 1)this.__controller.root.reflow = noop;super_.__mathquillify.call(this,'mq-editable-field mq-math-mode');delete this.__controller.root.reflow;return this;};});}; /*************************************************
	 * Abstract classes of text blocks
	 ************************************************/ /**
	 * Blocks of plain text, with one or two TextPiece's as children.
	 * Represents flat strings of typically serif-font Roman characters, as
	 * opposed to hierchical, nested, tree-structured math.
	 * Wraps a single HTMLSpanElement.
	 */var TextBlock=P(Node,function(_,super_){_.ctrlSeq = '\\text';_.replaces = function(replacedText){if(replacedText instanceof Fragment)this.replacedText = replacedText.remove().jQ.text();else if(typeof replacedText === 'string')this.replacedText = replacedText;};_.jQadd = function(jQ){super_.jQadd.call(this,jQ);if(this.ends[L])this.ends[L].jQadd(this.jQ[0].firstChild);};_.createLeftOf = function(cursor){var textBlock=this;super_.createLeftOf.call(this,cursor);if(textBlock[R].siblingCreated)textBlock[R].siblingCreated(cursor.options,L);if(textBlock[L].siblingCreated)textBlock[L].siblingCreated(cursor.options,R);textBlock.bubble('reflow');cursor.insAtRightEnd(textBlock);if(textBlock.replacedText)for(var i=0;i < textBlock.replacedText.length;i += 1) textBlock.write(cursor,textBlock.replacedText.charAt(i));};_.parser = function(){var textBlock=this; // TODO: correctly parse text mode
	var string=Parser.string;var regex=Parser.regex;var optWhitespace=Parser.optWhitespace;return optWhitespace.then(string('{')).then(regex(/^[^}]*/)).skip(string('}')).map(function(text){if(text.length === 0)return Fragment();TextPiece(text).adopt(textBlock,0,0);return textBlock;});};_.textContents = function(){return this.foldChildren('',function(text,child){return text + child.text;});};_.text = function(){return '"' + this.textContents() + '"';};_.latex = function(){var contents=this.textContents();if(contents.length === 0)return '';return '\\text{' + contents + '}';};_.html = function(){return '<span class="mq-text-mode" mathquill-command-id=' + this.id + '>' + this.textContents() + '</span>';}; // editability methods: called by the cursor for editing, cursor movements,
	// and selection of the MathQuill tree, these all take in a direction and
	// the cursor
	_.moveTowards = function(dir,cursor){cursor.insAtDirEnd(-dir,this);};_.moveOutOf = function(dir,cursor){cursor.insDirOf(dir,this);};_.unselectInto = _.moveTowards; // TODO: make these methods part of a shared mixin or something.
	_.selectTowards = MathCommand.prototype.selectTowards;_.deleteTowards = MathCommand.prototype.deleteTowards;_.selectOutOf = function(dir,cursor){cursor.insDirOf(dir,this);};_.deleteOutOf = function(dir,cursor){ // backspace and delete at ends of block don't unwrap
	if(this.isEmpty())cursor.insRightOf(this);};_.write = function(cursor,ch){cursor.show().deleteSelection();if(ch !== '$'){if(!cursor[L])TextPiece(ch).createLeftOf(cursor);else cursor[L].appendText(ch);}else if(this.isEmpty()){cursor.insRightOf(this);VanillaSymbol('\\$','$').createLeftOf(cursor);}else if(!cursor[R])cursor.insRightOf(this);else if(!cursor[L])cursor.insLeftOf(this);else { // split apart
	var leftBlock=TextBlock();var leftPc=this.ends[L];leftPc.disown().jQ.detach();leftPc.adopt(leftBlock,0,0);cursor.insLeftOf(this);super_.createLeftOf.call(leftBlock,cursor);}};_.seek = function(pageX,cursor){cursor.hide();var textPc=fuseChildren(this); // insert cursor at approx position in DOMTextNode
	var avgChWidth=this.jQ.width() / this.text.length;var approxPosition=Math.round((pageX - this.jQ.offset().left) / avgChWidth);if(approxPosition <= 0)cursor.insAtLeftEnd(this);else if(approxPosition >= textPc.text.length)cursor.insAtRightEnd(this);else cursor.insLeftOf(textPc.splitRight(approxPosition)); // move towards mousedown (pageX)
	var displ=pageX - cursor.show().offset().left; // displacement
	var dir=displ && displ < 0?L:R;var prevDispl=dir; // displ * prevDispl > 0 iff displacement direction === previous direction
	while(cursor[dir] && displ * prevDispl > 0) {cursor[dir].moveTowards(dir,cursor);prevDispl = displ;displ = pageX - cursor.offset().left;}if(dir * displ < -dir * prevDispl)cursor[-dir].moveTowards(-dir,cursor);if(!cursor.anticursor){ // about to start mouse-selecting, the anticursor is gonna get put here
	this.anticursorPosition = cursor[L] && cursor[L].text.length; // ^ get it? 'cos if there's no cursor[L], it's 0... I'm a terrible person.
	}else if(cursor.anticursor.parent === this){ // mouse-selecting within this TextBlock, re-insert the anticursor
	var cursorPosition=cursor[L] && cursor[L].text.length;;if(this.anticursorPosition === cursorPosition){cursor.anticursor = Point.copy(cursor);}else {if(this.anticursorPosition < cursorPosition){var newTextPc=cursor[L].splitRight(this.anticursorPosition);cursor[L] = newTextPc;}else {var newTextPc=cursor[R].splitRight(this.anticursorPosition - cursorPosition);}cursor.anticursor = Point(this,newTextPc[L],newTextPc);}}};_.blur = function(cursor){MathBlock.prototype.blur.call(this);if(!cursor)return;if(this.textContents() === ''){this.remove();if(cursor[L] === this)cursor[L] = this[L];else if(cursor[R] === this)cursor[R] = this[R];}else fuseChildren(this);};function fuseChildren(self){self.jQ[0].normalize();var textPcDom=self.jQ[0].firstChild;if(!textPcDom)return;pray('only node in TextBlock span is Text node',textPcDom.nodeType === 3); // nodeType === 3 has meant a Text node since ancient times:
	//   http://reference.sitepoint.com/javascript/Node/nodeType
	var textPc=TextPiece(textPcDom.data);textPc.jQadd(textPcDom);self.children().disown();return textPc.adopt(self,0,0);}_.focus = MathBlock.prototype.focus;}); /**
	 * Piece of plain text, with a TextBlock as a parent and no children.
	 * Wraps a single DOMTextNode.
	 * For convenience, has a .text property that's just a JavaScript string
	 * mirroring the text contents of the DOMTextNode.
	 * Text contents must always be nonempty.
	 */var TextPiece=P(Node,function(_,super_){_.init = function(text){super_.init.call(this);this.text = text;};_.jQadd = function(dom){this.dom = dom;this.jQ = $(dom);};_.jQize = function(){return this.jQadd(document.createTextNode(this.text));};_.appendText = function(text){this.text += text;this.dom.appendData(text);};_.prependText = function(text){this.text = text + this.text;this.dom.insertData(0,text);};_.insTextAtDirEnd = function(text,dir){prayDirection(dir);if(dir === R)this.appendText(text);else this.prependText(text);};_.splitRight = function(i){var newPc=TextPiece(this.text.slice(i)).adopt(this.parent,this,this[R]);newPc.jQadd(this.dom.splitText(i));this.text = this.text.slice(0,i);return newPc;};function endChar(dir,text){return text.charAt(dir === L?0:-1 + text.length);}_.moveTowards = function(dir,cursor){prayDirection(dir);var ch=endChar(-dir,this.text);var from=this[-dir];if(from)from.insTextAtDirEnd(ch,dir);else TextPiece(ch).createDir(-dir,cursor);return this.deleteTowards(dir,cursor);};_.latex = function(){return this.text;};_.deleteTowards = function(dir,cursor){if(this.text.length > 1){if(dir === R){this.dom.deleteData(0,1);this.text = this.text.slice(1);}else { // note that the order of these 2 lines is annoyingly important
	// (the second line mutates this.text.length)
	this.dom.deleteData(-1 + this.text.length,1);this.text = this.text.slice(0,-1);}}else {this.remove();this.jQ.remove();cursor[dir] = this[dir];}};_.selectTowards = function(dir,cursor){prayDirection(dir);var anticursor=cursor.anticursor;var ch=endChar(-dir,this.text);if(anticursor[dir] === this){var newPc=TextPiece(ch).createDir(dir,cursor);anticursor[dir] = newPc;cursor.insDirOf(dir,newPc);}else {var from=this[-dir];if(from)from.insTextAtDirEnd(ch,dir);else {var newPc=TextPiece(ch).createDir(-dir,cursor);newPc.jQ.insDirOf(-dir,cursor.selection.jQ);}if(this.text.length === 1 && anticursor[-dir] === this){anticursor[-dir] = this[-dir]; // `this` will be removed in deleteTowards
	}}return this.deleteTowards(dir,cursor);};});CharCmds.$ = LatexCmds.text = LatexCmds.textnormal = LatexCmds.textrm = LatexCmds.textup = LatexCmds.textmd = TextBlock;function makeTextBlock(latex,tagName,attrs){return P(TextBlock,{ctrlSeq:latex,htmlTemplate:'<' + tagName + ' ' + attrs + '>&0</' + tagName + '>'});}LatexCmds.em = LatexCmds.italic = LatexCmds.italics = LatexCmds.emph = LatexCmds.textit = LatexCmds.textsl = makeTextBlock('\\textit','i','class="mq-text-mode"');LatexCmds.strong = LatexCmds.bold = LatexCmds.textbf = makeTextBlock('\\textbf','b','class="mq-text-mode"');LatexCmds.sf = LatexCmds.textsf = makeTextBlock('\\textsf','span','class="mq-sans-serif mq-text-mode"');LatexCmds.tt = LatexCmds.texttt = makeTextBlock('\\texttt','span','class="mq-monospace mq-text-mode"');LatexCmds.textsc = makeTextBlock('\\textsc','span','style="font-variant:small-caps" class="mq-text-mode"');LatexCmds.uppercase = makeTextBlock('\\uppercase','span','style="text-transform:uppercase" class="mq-text-mode"');LatexCmds.lowercase = makeTextBlock('\\lowercase','span','style="text-transform:lowercase" class="mq-text-mode"');var RootMathCommand=P(MathCommand,function(_,super_){_.init = function(cursor){super_.init.call(this,'$');this.cursor = cursor;};_.htmlTemplate = '<span class="mq-math-mode">&0</span>';_.createBlocks = function(){super_.createBlocks.call(this);this.ends[L].cursor = this.cursor;this.ends[L].write = function(cursor,ch){if(ch !== '$')MathBlock.prototype.write.call(this,cursor,ch);else if(this.isEmpty()){cursor.insRightOf(this.parent);this.parent.deleteTowards(dir,cursor);VanillaSymbol('\\$','$').createLeftOf(cursor.show());}else if(!cursor[R])cursor.insRightOf(this.parent);else if(!cursor[L])cursor.insLeftOf(this.parent);else MathBlock.prototype.write.call(this,cursor,ch);};};_.latex = function(){return '$' + this.ends[L].latex() + '$';};});var RootTextBlock=P(RootMathBlock,function(_,super_){_.keystroke = function(key){if(key === 'Spacebar' || key === 'Shift-Spacebar')return;return super_.keystroke.apply(this,arguments);};_.write = function(cursor,ch){cursor.show().deleteSelection();if(ch === '$')RootMathCommand(cursor).createLeftOf(cursor);else {var html;if(ch === '<')html = '&lt;';else if(ch === '>')html = '&gt;';VanillaSymbol(ch,html).createLeftOf(cursor);}};});API.TextField = function(APIClasses){return P(APIClasses.EditableField,function(_,super_){this.RootBlock = RootTextBlock;_.__mathquillify = function(){return super_.__mathquillify.call(this,'mq-editable-field mq-text-mode');};_.latex = function(latex){if(arguments.length > 0){this.__controller.renderLatexText(latex);if(this.__controller.blurred)this.__controller.cursor.hide().parent.blur();return this;}return this.__controller.exportLatex();};});}; /************************************
	 * Symbols for Advanced Mathematics
	 ***********************************/LatexCmds.notin = LatexCmds.cong = LatexCmds.equiv = LatexCmds.oplus = LatexCmds.otimes = P(BinaryOperator,function(_,super_){_.init = function(latex){super_.init.call(this,'\\' + latex + ' ','&' + latex + ';');};});LatexCmds['≠'] = LatexCmds.ne = LatexCmds.neq = bind(BinaryOperator,'\\ne ','&ne;');LatexCmds.ast = LatexCmds.star = LatexCmds.loast = LatexCmds.lowast = bind(BinaryOperator,'\\ast ','&lowast;'); //case 'there4 = // a special exception for this one, perhaps?
	LatexCmds.therefor = LatexCmds.therefore = bind(BinaryOperator,'\\therefore ','&there4;');LatexCmds.cuz =  // l33t
	LatexCmds.because = bind(BinaryOperator,'\\because ','&#8757;');LatexCmds.prop = LatexCmds.propto = bind(BinaryOperator,'\\propto ','&prop;');LatexCmds['≈'] = LatexCmds.asymp = LatexCmds.approx = bind(BinaryOperator,'\\approx ','&asymp;');LatexCmds.isin = LatexCmds['in'] = bind(BinaryOperator,'\\in ','&isin;');LatexCmds.ni = LatexCmds.contains = bind(BinaryOperator,'\\ni ','&ni;');LatexCmds.notni = LatexCmds.niton = LatexCmds.notcontains = LatexCmds.doesnotcontain = bind(BinaryOperator,'\\not\\ni ','&#8716;');LatexCmds.sub = LatexCmds.subset = bind(BinaryOperator,'\\subset ','&sub;');LatexCmds.sup = LatexCmds.supset = LatexCmds.superset = bind(BinaryOperator,'\\supset ','&sup;');LatexCmds.nsub = LatexCmds.notsub = LatexCmds.nsubset = LatexCmds.notsubset = bind(BinaryOperator,'\\not\\subset ','&#8836;');LatexCmds.nsup = LatexCmds.notsup = LatexCmds.nsupset = LatexCmds.notsupset = LatexCmds.nsuperset = LatexCmds.notsuperset = bind(BinaryOperator,'\\not\\supset ','&#8837;');LatexCmds.sube = LatexCmds.subeq = LatexCmds.subsete = LatexCmds.subseteq = bind(BinaryOperator,'\\subseteq ','&sube;');LatexCmds.supe = LatexCmds.supeq = LatexCmds.supsete = LatexCmds.supseteq = LatexCmds.supersete = LatexCmds.superseteq = bind(BinaryOperator,'\\supseteq ','&supe;');LatexCmds.nsube = LatexCmds.nsubeq = LatexCmds.notsube = LatexCmds.notsubeq = LatexCmds.nsubsete = LatexCmds.nsubseteq = LatexCmds.notsubsete = LatexCmds.notsubseteq = bind(BinaryOperator,'\\not\\subseteq ','&#8840;');LatexCmds.nsupe = LatexCmds.nsupeq = LatexCmds.notsupe = LatexCmds.notsupeq = LatexCmds.nsupsete = LatexCmds.nsupseteq = LatexCmds.notsupsete = LatexCmds.notsupseteq = LatexCmds.nsupersete = LatexCmds.nsuperseteq = LatexCmds.notsupersete = LatexCmds.notsuperseteq = bind(BinaryOperator,'\\not\\supseteq ','&#8841;'); //the canonical sets of numbers
	LatexCmds.N = LatexCmds.naturals = LatexCmds.Naturals = bind(VanillaSymbol,'\\mathbb{N}','&#8469;');LatexCmds.P = LatexCmds.primes = LatexCmds.Primes = LatexCmds.projective = LatexCmds.Projective = LatexCmds.probability = LatexCmds.Probability = bind(VanillaSymbol,'\\mathbb{P}','&#8473;');LatexCmds.Z = LatexCmds.integers = LatexCmds.Integers = bind(VanillaSymbol,'\\mathbb{Z}','&#8484;');LatexCmds.Q = LatexCmds.rationals = LatexCmds.Rationals = bind(VanillaSymbol,'\\mathbb{Q}','&#8474;');LatexCmds.R = LatexCmds.reals = LatexCmds.Reals = bind(VanillaSymbol,'\\mathbb{R}','&#8477;');LatexCmds.C = LatexCmds.complex = LatexCmds.Complex = LatexCmds.complexes = LatexCmds.Complexes = LatexCmds.complexplane = LatexCmds.Complexplane = LatexCmds.ComplexPlane = bind(VanillaSymbol,'\\mathbb{C}','&#8450;');LatexCmds.H = LatexCmds.Hamiltonian = LatexCmds.quaternions = LatexCmds.Quaternions = bind(VanillaSymbol,'\\mathbb{H}','&#8461;'); //spacing
	LatexCmds.quad = LatexCmds.emsp = bind(VanillaSymbol,'\\quad ','    ');LatexCmds.qquad = bind(VanillaSymbol,'\\qquad ','        '); /* spacing special characters, gonna have to implement this in LatexCommandInput::onText somehow
	case ',':
	  return VanillaSymbol('\\, ',' ');
	case ':':
	  return VanillaSymbol('\\: ','  ');
	case ';':
	  return VanillaSymbol('\\; ','   ');
	case '!':
	  return Symbol('\\! ','<span style="margin-right:-.2em"></span>');
	*/ //binary operators
	LatexCmds.diamond = bind(VanillaSymbol,'\\diamond ','&#9671;');LatexCmds.bigtriangleup = bind(VanillaSymbol,'\\bigtriangleup ','&#9651;');LatexCmds.ominus = bind(VanillaSymbol,'\\ominus ','&#8854;');LatexCmds.uplus = bind(VanillaSymbol,'\\uplus ','&#8846;');LatexCmds.bigtriangledown = bind(VanillaSymbol,'\\bigtriangledown ','&#9661;');LatexCmds.sqcap = bind(VanillaSymbol,'\\sqcap ','&#8851;');LatexCmds.triangleleft = bind(VanillaSymbol,'\\triangleleft ','&#8882;');LatexCmds.sqcup = bind(VanillaSymbol,'\\sqcup ','&#8852;');LatexCmds.triangleright = bind(VanillaSymbol,'\\triangleright ','&#8883;'); //circledot is not a not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
	LatexCmds.odot = LatexCmds.circledot = bind(VanillaSymbol,'\\odot ','&#8857;');LatexCmds.bigcirc = bind(VanillaSymbol,'\\bigcirc ','&#9711;');LatexCmds.dagger = bind(VanillaSymbol,'\\dagger ','&#0134;');LatexCmds.ddagger = bind(VanillaSymbol,'\\ddagger ','&#135;');LatexCmds.wr = bind(VanillaSymbol,'\\wr ','&#8768;');LatexCmds.amalg = bind(VanillaSymbol,'\\amalg ','&#8720;'); //relationship symbols
	LatexCmds.models = bind(VanillaSymbol,'\\models ','&#8872;');LatexCmds.prec = bind(VanillaSymbol,'\\prec ','&#8826;');LatexCmds.succ = bind(VanillaSymbol,'\\succ ','&#8827;');LatexCmds.preceq = bind(VanillaSymbol,'\\preceq ','&#8828;');LatexCmds.succeq = bind(VanillaSymbol,'\\succeq ','&#8829;');LatexCmds.simeq = bind(VanillaSymbol,'\\simeq ','&#8771;');LatexCmds.mid = bind(VanillaSymbol,'\\mid ','&#8739;');LatexCmds.ll = bind(VanillaSymbol,'\\ll ','&#8810;');LatexCmds.gg = bind(VanillaSymbol,'\\gg ','&#8811;');LatexCmds.parallel = bind(VanillaSymbol,'\\parallel ','&#8741;');LatexCmds.nparallel = bind(VanillaSymbol,'\\nparallel ','&#8742;');LatexCmds.bowtie = bind(VanillaSymbol,'\\bowtie ','&#8904;');LatexCmds.sqsubset = bind(VanillaSymbol,'\\sqsubset ','&#8847;');LatexCmds.sqsupset = bind(VanillaSymbol,'\\sqsupset ','&#8848;');LatexCmds.smile = bind(VanillaSymbol,'\\smile ','&#8995;');LatexCmds.sqsubseteq = bind(VanillaSymbol,'\\sqsubseteq ','&#8849;');LatexCmds.sqsupseteq = bind(VanillaSymbol,'\\sqsupseteq ','&#8850;');LatexCmds.doteq = bind(VanillaSymbol,'\\doteq ','&#8784;');LatexCmds.frown = bind(VanillaSymbol,'\\frown ','&#8994;');LatexCmds.vdash = bind(VanillaSymbol,'\\vdash ','&#8870;');LatexCmds.dashv = bind(VanillaSymbol,'\\dashv ','&#8867;');LatexCmds.nless = bind(VanillaSymbol,'\\nless ','&#8814;');LatexCmds.ngtr = bind(VanillaSymbol,'\\ngtr ','&#8815;'); //arrows
	LatexCmds.longleftarrow = bind(VanillaSymbol,'\\longleftarrow ','&#8592;');LatexCmds.longrightarrow = bind(VanillaSymbol,'\\longrightarrow ','&#8594;');LatexCmds.Longleftarrow = bind(VanillaSymbol,'\\Longleftarrow ','&#8656;');LatexCmds.Longrightarrow = bind(VanillaSymbol,'\\Longrightarrow ','&#8658;');LatexCmds.longleftrightarrow = bind(VanillaSymbol,'\\longleftrightarrow ','&#8596;');LatexCmds.updownarrow = bind(VanillaSymbol,'\\updownarrow ','&#8597;');LatexCmds.Longleftrightarrow = bind(VanillaSymbol,'\\Longleftrightarrow ','&#8660;');LatexCmds.Updownarrow = bind(VanillaSymbol,'\\Updownarrow ','&#8661;');LatexCmds.mapsto = bind(VanillaSymbol,'\\mapsto ','&#8614;');LatexCmds.nearrow = bind(VanillaSymbol,'\\nearrow ','&#8599;');LatexCmds.hookleftarrow = bind(VanillaSymbol,'\\hookleftarrow ','&#8617;');LatexCmds.hookrightarrow = bind(VanillaSymbol,'\\hookrightarrow ','&#8618;');LatexCmds.searrow = bind(VanillaSymbol,'\\searrow ','&#8600;');LatexCmds.leftharpoonup = bind(VanillaSymbol,'\\leftharpoonup ','&#8636;');LatexCmds.rightharpoonup = bind(VanillaSymbol,'\\rightharpoonup ','&#8640;');LatexCmds.swarrow = bind(VanillaSymbol,'\\swarrow ','&#8601;');LatexCmds.leftharpoondown = bind(VanillaSymbol,'\\leftharpoondown ','&#8637;');LatexCmds.rightharpoondown = bind(VanillaSymbol,'\\rightharpoondown ','&#8641;');LatexCmds.nwarrow = bind(VanillaSymbol,'\\nwarrow ','&#8598;'); //Misc
	LatexCmds.ldots = bind(VanillaSymbol,'\\ldots ','&#8230;');LatexCmds.cdots = bind(VanillaSymbol,'\\cdots ','&#8943;');LatexCmds.vdots = bind(VanillaSymbol,'\\vdots ','&#8942;');LatexCmds.ddots = bind(VanillaSymbol,'\\ddots ','&#8945;');LatexCmds.surd = bind(VanillaSymbol,'\\surd ','&#8730;');LatexCmds.triangle = bind(VanillaSymbol,'\\triangle ','&#9651;');LatexCmds.ell = bind(VanillaSymbol,'\\ell ','&#8467;');LatexCmds.top = bind(VanillaSymbol,'\\top ','&#8868;');LatexCmds.flat = bind(VanillaSymbol,'\\flat ','&#9837;');LatexCmds.natural = bind(VanillaSymbol,'\\natural ','&#9838;');LatexCmds.sharp = bind(VanillaSymbol,'\\sharp ','&#9839;');LatexCmds.wp = bind(VanillaSymbol,'\\wp ','&#8472;');LatexCmds.bot = bind(VanillaSymbol,'\\bot ','&#8869;');LatexCmds.clubsuit = bind(VanillaSymbol,'\\clubsuit ','&#9827;');LatexCmds.diamondsuit = bind(VanillaSymbol,'\\diamondsuit ','&#9826;');LatexCmds.heartsuit = bind(VanillaSymbol,'\\heartsuit ','&#9825;');LatexCmds.spadesuit = bind(VanillaSymbol,'\\spadesuit ','&#9824;'); //not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
	LatexCmds.parallelogram = bind(VanillaSymbol,'\\parallelogram ','&#9649;');LatexCmds.square = bind(VanillaSymbol,'\\square ','&#11036;'); //variable-sized
	LatexCmds.oint = bind(VanillaSymbol,'\\oint ','&#8750;');LatexCmds.bigcap = bind(VanillaSymbol,'\\bigcap ','&#8745;');LatexCmds.bigcup = bind(VanillaSymbol,'\\bigcup ','&#8746;');LatexCmds.bigsqcup = bind(VanillaSymbol,'\\bigsqcup ','&#8852;');LatexCmds.bigvee = bind(VanillaSymbol,'\\bigvee ','&#8744;');LatexCmds.bigwedge = bind(VanillaSymbol,'\\bigwedge ','&#8743;');LatexCmds.bigodot = bind(VanillaSymbol,'\\bigodot ','&#8857;');LatexCmds.bigotimes = bind(VanillaSymbol,'\\bigotimes ','&#8855;');LatexCmds.bigoplus = bind(VanillaSymbol,'\\bigoplus ','&#8853;');LatexCmds.biguplus = bind(VanillaSymbol,'\\biguplus ','&#8846;'); //delimiters
	LatexCmds.lfloor = bind(VanillaSymbol,'\\lfloor ','&#8970;');LatexCmds.rfloor = bind(VanillaSymbol,'\\rfloor ','&#8971;');LatexCmds.lceil = bind(VanillaSymbol,'\\lceil ','&#8968;');LatexCmds.rceil = bind(VanillaSymbol,'\\rceil ','&#8969;');LatexCmds.opencurlybrace = LatexCmds.lbrace = bind(VanillaSymbol,'\\lbrace ','{');LatexCmds.closecurlybrace = LatexCmds.rbrace = bind(VanillaSymbol,'\\rbrace ','}');LatexCmds.lbrack = bind(VanillaSymbol,'[');LatexCmds.rbrack = bind(VanillaSymbol,']'); //various symbols
	LatexCmds.slash = bind(VanillaSymbol,'/');LatexCmds.vert = bind(VanillaSymbol,'|');LatexCmds.perp = LatexCmds.perpendicular = bind(VanillaSymbol,'\\perp ','&perp;');LatexCmds.nabla = LatexCmds.del = bind(VanillaSymbol,'\\nabla ','&nabla;');LatexCmds.hbar = bind(VanillaSymbol,'\\hbar ','&#8463;');LatexCmds.AA = LatexCmds.Angstrom = LatexCmds.angstrom = bind(VanillaSymbol,'\\text\\AA ','&#8491;');LatexCmds.ring = LatexCmds.circ = LatexCmds.circle = bind(VanillaSymbol,'\\circ ','&#8728;');LatexCmds.bull = LatexCmds.bullet = bind(VanillaSymbol,'\\bullet ','&bull;');LatexCmds.setminus = LatexCmds.smallsetminus = bind(VanillaSymbol,'\\setminus ','&#8726;');LatexCmds.not =  //bind(Symbol,'\\not ','<span class="not">/</span>');
	LatexCmds['¬'] = LatexCmds.neg = bind(VanillaSymbol,'\\neg ','&not;');LatexCmds['…'] = LatexCmds.dots = LatexCmds.ellip = LatexCmds.hellip = LatexCmds.ellipsis = LatexCmds.hellipsis = bind(VanillaSymbol,'\\dots ','&hellip;');LatexCmds.converges = LatexCmds.darr = LatexCmds.dnarr = LatexCmds.dnarrow = LatexCmds.downarrow = bind(VanillaSymbol,'\\downarrow ','&darr;');LatexCmds.dArr = LatexCmds.dnArr = LatexCmds.dnArrow = LatexCmds.Downarrow = bind(VanillaSymbol,'\\Downarrow ','&dArr;');LatexCmds.diverges = LatexCmds.uarr = LatexCmds.uparrow = bind(VanillaSymbol,'\\uparrow ','&uarr;');LatexCmds.uArr = LatexCmds.Uparrow = bind(VanillaSymbol,'\\Uparrow ','&uArr;');LatexCmds.to = bind(BinaryOperator,'\\to ','&rarr;');LatexCmds.rarr = LatexCmds.rightarrow = bind(VanillaSymbol,'\\rightarrow ','&rarr;');LatexCmds.implies = bind(BinaryOperator,'\\Rightarrow ','&rArr;');LatexCmds.rArr = LatexCmds.Rightarrow = bind(VanillaSymbol,'\\Rightarrow ','&rArr;');LatexCmds.gets = bind(BinaryOperator,'\\gets ','&larr;');LatexCmds.larr = LatexCmds.leftarrow = bind(VanillaSymbol,'\\leftarrow ','&larr;');LatexCmds.impliedby = bind(BinaryOperator,'\\Leftarrow ','&lArr;');LatexCmds.lArr = LatexCmds.Leftarrow = bind(VanillaSymbol,'\\Leftarrow ','&lArr;');LatexCmds.harr = LatexCmds.lrarr = LatexCmds.leftrightarrow = bind(VanillaSymbol,'\\leftrightarrow ','&harr;');LatexCmds.iff = bind(BinaryOperator,'\\Leftrightarrow ','&hArr;');LatexCmds.hArr = LatexCmds.lrArr = LatexCmds.Leftrightarrow = bind(VanillaSymbol,'\\Leftrightarrow ','&hArr;');LatexCmds.Re = LatexCmds.Real = LatexCmds.real = bind(VanillaSymbol,'\\Re ','&real;');LatexCmds.Im = LatexCmds.imag = LatexCmds.image = LatexCmds.imagin = LatexCmds.imaginary = LatexCmds.Imaginary = bind(VanillaSymbol,'\\Im ','&image;');LatexCmds.part = LatexCmds.partial = bind(VanillaSymbol,'\\partial ','&part;');LatexCmds.infty = LatexCmds.infin = LatexCmds.infinity = bind(VanillaSymbol,'\\infty ','&infin;');LatexCmds.alef = LatexCmds.alefsym = LatexCmds.aleph = LatexCmds.alephsym = bind(VanillaSymbol,'\\aleph ','&alefsym;');LatexCmds.xist =  //LOL
	LatexCmds.xists = LatexCmds.exist = LatexCmds.exists = bind(VanillaSymbol,'\\exists ','&exist;');LatexCmds.nexists = LatexCmds.nexist = bind(VanillaSymbol,'\\nexists ','&#8708;');LatexCmds.and = LatexCmds.land = LatexCmds.wedge = bind(VanillaSymbol,'\\wedge ','&and;');LatexCmds.or = LatexCmds.lor = LatexCmds.vee = bind(VanillaSymbol,'\\vee ','&or;');LatexCmds.o = LatexCmds.O = LatexCmds.empty = LatexCmds.emptyset = LatexCmds.oslash = LatexCmds.Oslash = LatexCmds.nothing = LatexCmds.varnothing = bind(BinaryOperator,'\\varnothing ','&empty;');LatexCmds.cup = LatexCmds.union = bind(BinaryOperator,'\\cup ','&cup;');LatexCmds.cap = LatexCmds.intersect = LatexCmds.intersection = bind(BinaryOperator,'\\cap ','&cap;'); // FIXME: the correct LaTeX would be ^\circ but we can't parse that
	LatexCmds.deg = LatexCmds.degree = bind(VanillaSymbol,'\\degree ','&deg;');LatexCmds.ang = LatexCmds.angle = bind(VanillaSymbol,'\\angle ','&ang;');LatexCmds.measuredangle = bind(VanillaSymbol,'\\measuredangle ','&#8737;'); /*********************************
	 * Symbols for Basic Mathematics
	 ********************************/var Digit=P(VanillaSymbol,function(_,super_){_.createLeftOf = function(cursor){if(cursor.options.autoSubscriptNumerals && cursor.parent !== cursor.parent.parent.sub && (cursor[L] instanceof Variable && cursor[L].isItalic !== false || cursor[L] instanceof SupSub && cursor[L][L] instanceof Variable && cursor[L][L].isItalic !== false)){LatexCmds._().createLeftOf(cursor);super_.createLeftOf.call(this,cursor);cursor.insRightOf(cursor.parent.parent);}else super_.createLeftOf.call(this,cursor);};});var Variable=P(Symbol,function(_,super_){_.init = function(ch,html){super_.init.call(this,ch,'<var>' + (html || ch) + '</var>');};_.text = function(){var text=this.ctrlSeq;if(this[L] && !(this[L] instanceof Variable) && !(this[L] instanceof BinaryOperator) && this[L].ctrlSeq !== "\\ ")text = '*' + text;if(this[R] && !(this[R] instanceof BinaryOperator) && !(this[R] instanceof SupSub))text += '*';return text;};});Options.p.autoCommands = {_maxLength:0};optionProcessors.autoCommands = function(cmds){if(!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)){throw '"' + cmds + '" not a space-delimited list of only letters';}var list=cmds.split(' '),dict={},maxLength=0;for(var i=0;i < list.length;i += 1) {var cmd=list[i];if(cmd.length < 2){throw 'autocommand "' + cmd + '" not minimum length of 2';}if(LatexCmds[cmd] === OperatorName){throw '"' + cmd + '" is a built-in operator name';}dict[cmd] = 1;maxLength = max(maxLength,cmd.length);}dict._maxLength = maxLength;return dict;};var Letter=P(Variable,function(_,super_){_.init = function(ch){return super_.init.call(this,this.letter = ch);};_.createLeftOf = function(cursor){super_.createLeftOf.apply(this,arguments);var autoCmds=cursor.options.autoCommands,maxLength=autoCmds._maxLength;if(maxLength > 0){ // want longest possible autocommand, so join together longest
	// sequence of letters
	var str='',l=this,i=0; // FIXME: l.ctrlSeq === l.letter checks if first or last in an operator name
	while(l instanceof Letter && l.ctrlSeq === l.letter && i < maxLength) {str = l.letter + str,l = l[L],i += 1;} // check for an autocommand, going thru substrings longest to shortest
	while(str.length) {if(autoCmds.hasOwnProperty(str)){for(var i=1,l=this;i < str.length;i += 1,l = l[L]);Fragment(l,this).remove();cursor[L] = l[L];return LatexCmds[str](str).createLeftOf(cursor);}str = str.slice(1);}}};_.italicize = function(bool){this.isItalic = bool;this.jQ.toggleClass('mq-operator-name',!bool);return this;};_.finalizeTree = _.siblingDeleted = _.siblingCreated = function(opts,dir){ // don't auto-un-italicize if the sibling to my right changed (dir === R or
	// undefined) and it's now a Letter, it will un-italicize everyone
	if(dir !== L && this[R] instanceof Letter)return;this.autoUnItalicize(opts);};_.autoUnItalicize = function(opts){var autoOps=opts.autoOperatorNames;if(autoOps._maxLength === 0)return; // want longest possible operator names, so join together entire contiguous
	// sequence of letters
	var str=this.letter;for(var l=this[L];l instanceof Letter;l = l[L]) str = l.letter + str;for(var r=this[R];r instanceof Letter;r = r[R]) str += r.letter; // removeClass and delete flags from all letters before figuring out
	// which, if any, are part of an operator name
	Fragment(l[R] || this.parent.ends[L],r[L] || this.parent.ends[R]).each(function(el){el.italicize(true).jQ.removeClass('mq-first mq-last mq-followed-by-supsub');el.ctrlSeq = el.letter;}); // check for operator names: at each position from left to right, check
	// substrings from longest to shortest
	outer: for(var i=0,first=l[R] || this.parent.ends[L];i < str.length;i += 1,first = first[R]) {for(var len=min(autoOps._maxLength,str.length - i);len > 0;len -= 1) {var word=str.slice(i,i + len);if(autoOps.hasOwnProperty(word)){for(var j=0,letter=first;j < len;j += 1,letter = letter[R]) {letter.italicize(false);var last=letter;}var isBuiltIn=BuiltInOpNames.hasOwnProperty(word);first.ctrlSeq = (isBuiltIn?'\\':'\\operatorname{') + first.ctrlSeq;last.ctrlSeq += isBuiltIn?' ':'}';if(TwoWordOpNames.hasOwnProperty(word))last[L][L][L].jQ.addClass('mq-last');if(!shouldOmitPadding(first[L]))first.jQ.addClass('mq-first');if(!shouldOmitPadding(last[R])){if(last[R] instanceof SupSub){var supsub=last[R]; // XXX monkey-patching, but what's the right thing here?
	// Have operatorname-specific code in SupSub? A CSS-like language to style the
	// math tree, but which ignores cursor and selection (which CSS can't)?
	var respace=supsub.siblingCreated = supsub.siblingDeleted = function(){supsub.jQ.toggleClass('mq-after-operator-name',!(supsub[R] instanceof Bracket));};respace();}else {last.jQ.toggleClass('mq-last',!(last[R] instanceof Bracket));}}i += len - 1;first = last;continue outer;}}}};function shouldOmitPadding(node){ // omit padding if no node, or if node already has padding (to avoid double-padding)
	return !node || node instanceof BinaryOperator || node instanceof SummationNotation;}});var BuiltInOpNames={}; // the set of operator names like \sin, \cos, etc that
	// are built-into LaTeX, see Section 3.17 of the Short Math Guide: http://tinyurl.com/jm9okjc
	// MathQuill auto-unitalicizes some operator names not in that set, like 'hcf'
	// and 'arsinh', which must be exported as \operatorname{hcf} and
	// \operatorname{arsinh}. Note: over/under line/arrow \lim variants like
	// \varlimsup are not supported
	var AutoOpNames=Options.p.autoOperatorNames = {_maxLength:9}; // the set
	// of operator names that MathQuill auto-unitalicizes by default; overridable
	var TwoWordOpNames={limsup:1,liminf:1,projlim:1,injlim:1};(function(){var mostOps=('arg deg det dim exp gcd hom inf ker lg lim ln log max min sup' + ' limsup liminf injlim projlim Pr').split(' ');for(var i=0;i < mostOps.length;i += 1) {BuiltInOpNames[mostOps[i]] = AutoOpNames[mostOps[i]] = 1;}var builtInTrigs= // why coth but not sech and csch, LaTeX?
	'sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'.split(' ');for(var i=0;i < builtInTrigs.length;i += 1) {BuiltInOpNames[builtInTrigs[i]] = 1;}var autoTrigs='sin cos tan sec cosec csc cotan cot ctg'.split(' ');for(var i=0;i < autoTrigs.length;i += 1) {AutoOpNames[autoTrigs[i]] = AutoOpNames['arc' + autoTrigs[i]] = AutoOpNames[autoTrigs[i] + 'h'] = AutoOpNames['ar' + autoTrigs[i] + 'h'] = AutoOpNames['arc' + autoTrigs[i] + 'h'] = 1;} // compat with some of the nonstandard LaTeX exported by MathQuill
	// before #247. None of these are real LaTeX commands so, seems safe
	var moreNonstandardOps='gcf hcf lcm proj span'.split(' ');for(var i=0;i < moreNonstandardOps.length;i += 1) {AutoOpNames[moreNonstandardOps[i]] = 1;}})();optionProcessors.autoOperatorNames = function(cmds){if(!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)){throw '"' + cmds + '" not a space-delimited list of only letters';}var list=cmds.split(' '),dict={},maxLength=0;for(var i=0;i < list.length;i += 1) {var cmd=list[i];if(cmd.length < 2){throw '"' + cmd + '" not minimum length of 2';}dict[cmd] = 1;maxLength = max(maxLength,cmd.length);}dict._maxLength = maxLength;return dict;};var OperatorName=P(Symbol,function(_,super_){_.init = function(fn){this.ctrlSeq = fn;};_.createLeftOf = function(cursor){var fn=this.ctrlSeq;for(var i=0;i < fn.length;i += 1) {Letter(fn.charAt(i)).createLeftOf(cursor);}};_.parser = function(){var fn=this.ctrlSeq;var block=MathBlock();for(var i=0;i < fn.length;i += 1) {Letter(fn.charAt(i)).adopt(block,block.ends[R],0);}return Parser.succeed(block.children());};});for(var fn in AutoOpNames) if(AutoOpNames.hasOwnProperty(fn)){LatexCmds[fn] = OperatorName;}LatexCmds.operatorname = P(MathCommand,function(_){_.createLeftOf = noop;_.numBlocks = function(){return 1;};_.parser = function(){return latexMathParser.block.map(function(b){return b.children();});};});LatexCmds.f = P(Letter,function(_,super_){_.init = function(){Symbol.p.init.call(this,this.letter = 'f','<var class="mq-f">f</var>');};_.italicize = function(bool){this.jQ.html('f').toggleClass('mq-f',bool);return super_.italicize.apply(this,arguments);};}); // VanillaSymbol's
	LatexCmds[' '] = LatexCmds.space = bind(VanillaSymbol,'\\ ','&nbsp;');LatexCmds["'"] = LatexCmds.prime = bind(VanillaSymbol,"'",'&prime;');LatexCmds.backslash = bind(VanillaSymbol,'\\backslash ','\\');if(!CharCmds['\\'])CharCmds['\\'] = LatexCmds.backslash;LatexCmds.$ = bind(VanillaSymbol,'\\$','$'); // does not use Symbola font
	var NonSymbolaSymbol=P(Symbol,function(_,super_){_.init = function(ch,html){super_.init.call(this,ch,'<span class="mq-nonSymbola">' + (html || ch) + '</span>');};});LatexCmds['@'] = NonSymbolaSymbol;LatexCmds['&'] = bind(NonSymbolaSymbol,'\\&','&amp;');LatexCmds['%'] = bind(NonSymbolaSymbol,'\\%','%'); //the following are all Greek to me, but this helped a lot: http://www.ams.org/STIX/ion/stixsig03.html
	//lowercase Greek letter variables
	LatexCmds.alpha = LatexCmds.beta = LatexCmds.gamma = LatexCmds.delta = LatexCmds.zeta = LatexCmds.eta = LatexCmds.theta = LatexCmds.iota = LatexCmds.kappa = LatexCmds.mu = LatexCmds.nu = LatexCmds.xi = LatexCmds.rho = LatexCmds.sigma = LatexCmds.tau = LatexCmds.chi = LatexCmds.psi = LatexCmds.omega = P(Variable,function(_,super_){_.init = function(latex){super_.init.call(this,'\\' + latex + ' ','&' + latex + ';');};}); //why can't anybody FUCKING agree on these
	LatexCmds.phi =  //W3C or Unicode?
	bind(Variable,'\\phi ','&#981;');LatexCmds.phiv =  //Elsevier and 9573-13
	LatexCmds.varphi =  //AMS and LaTeX
	bind(Variable,'\\varphi ','&phi;');LatexCmds.epsilon =  //W3C or Unicode?
	bind(Variable,'\\epsilon ','&#1013;');LatexCmds.epsiv =  //Elsevier and 9573-13
	LatexCmds.varepsilon =  //AMS and LaTeX
	bind(Variable,'\\varepsilon ','&epsilon;');LatexCmds.piv =  //W3C/Unicode and Elsevier and 9573-13
	LatexCmds.varpi =  //AMS and LaTeX
	bind(Variable,'\\varpi ','&piv;');LatexCmds.sigmaf =  //W3C/Unicode
	LatexCmds.sigmav =  //Elsevier
	LatexCmds.varsigma =  //LaTeX
	bind(Variable,'\\varsigma ','&sigmaf;');LatexCmds.thetav =  //Elsevier and 9573-13
	LatexCmds.vartheta =  //AMS and LaTeX
	LatexCmds.thetasym =  //W3C/Unicode
	bind(Variable,'\\vartheta ','&thetasym;');LatexCmds.upsilon =  //AMS and LaTeX and W3C/Unicode
	LatexCmds.upsi =  //Elsevier and 9573-13
	bind(Variable,'\\upsilon ','&upsilon;'); //these aren't even mentioned in the HTML character entity references
	LatexCmds.gammad =  //Elsevier
	LatexCmds.Gammad =  //9573-13 -- WTF, right? I dunno if this was a typo in the reference (see above)
	LatexCmds.digamma =  //LaTeX
	bind(Variable,'\\digamma ','&#989;');LatexCmds.kappav =  //Elsevier
	LatexCmds.varkappa =  //AMS and LaTeX
	bind(Variable,'\\varkappa ','&#1008;');LatexCmds.rhov =  //Elsevier and 9573-13
	LatexCmds.varrho =  //AMS and LaTeX
	bind(Variable,'\\varrho ','&#1009;'); //Greek constants, look best in non-italicized Times New Roman
	LatexCmds.pi = LatexCmds['π'] = bind(NonSymbolaSymbol,'\\pi ','&pi;');LatexCmds.lambda = bind(NonSymbolaSymbol,'\\lambda ','&lambda;'); //uppercase greek letters
	LatexCmds.Upsilon =  //LaTeX
	LatexCmds.Upsi =  //Elsevier and 9573-13
	LatexCmds.upsih =  //W3C/Unicode "upsilon with hook"
	LatexCmds.Upsih =  //'cos it makes sense to me
	bind(Symbol,'\\Upsilon ','<var style="font-family: serif">&upsih;</var>'); //Symbola's 'upsilon with a hook' is a capital Y without hooks :(
	//other symbols with the same LaTeX command and HTML character entity reference
	LatexCmds.Gamma = LatexCmds.Delta = LatexCmds.Theta = LatexCmds.Lambda = LatexCmds.Xi = LatexCmds.Pi = LatexCmds.Sigma = LatexCmds.Phi = LatexCmds.Psi = LatexCmds.Omega = LatexCmds.forall = P(VanillaSymbol,function(_,super_){_.init = function(latex){super_.init.call(this,'\\' + latex + ' ','&' + latex + ';');};}); // symbols that aren't a single MathCommand, but are instead a whole
	// Fragment. Creates the Fragment from a LaTeX string
	var LatexFragment=P(MathCommand,function(_){_.init = function(latex){this.latex = latex;};_.createLeftOf = function(cursor){var block=latexMathParser.parse(this.latex);block.children().adopt(cursor.parent,cursor[L],cursor[R]);cursor[L] = block.ends[R];block.jQize().insertBefore(cursor.jQ);block.finalizeInsert(cursor.options,cursor);if(block.ends[R][R].siblingCreated)block.ends[R][R].siblingCreated(cursor.options,L);if(block.ends[L][L].siblingCreated)block.ends[L][L].siblingCreated(cursor.options,R);cursor.parent.bubble('reflow');};_.parser = function(){var frag=latexMathParser.parse(this.latex).children();return Parser.succeed(frag);};}); // for what seems to me like [stupid reasons][1], Unicode provides
	// subscripted and superscripted versions of all ten Arabic numerals,
	// as well as [so-called "vulgar fractions"][2].
	// Nobody really cares about most of them, but some of them actually
	// predate Unicode, dating back to [ISO-8859-1][3], apparently also
	// known as "Latin-1", which among other things [Windows-1252][4]
	// largely coincides with, so Microsoft Word sometimes inserts them
	// and they get copy-pasted into MathQuill.
	//
	// (Irrelevant but funny story: though not a superset of Latin-1 aka
	// ISO-8859-1, Windows-1252 **is** a strict superset of the "closely
	// related but distinct"[3] "ISO 8859-1" -- see the lack of a dash
	// after "ISO"? Completely different character set, like elephants vs
	// elephant seals, or "Zombies" vs "Zombie Redneck Torture Family".
	// What kind of idiot would get them confused.
	// People in fact got them confused so much, it was so common to
	// mislabel Windows-1252 text as ISO-8859-1, that most modern web
	// browsers and email clients treat the MIME charset of ISO-8859-1
	// as actually Windows-1252, behavior now standard in the HTML5 spec.)
	//
	// [1]: http://en.wikipedia.org/wiki/Unicode_subscripts_andsuper_scripts
	// [2]: http://en.wikipedia.org/wiki/Number_Forms
	// [3]: http://en.wikipedia.org/wiki/ISO/IEC_8859-1
	// [4]: http://en.wikipedia.org/wiki/Windows-1252
	LatexCmds['¹'] = bind(LatexFragment,'^1');LatexCmds['²'] = bind(LatexFragment,'^2');LatexCmds['³'] = bind(LatexFragment,'^3');LatexCmds['¼'] = bind(LatexFragment,'\\frac14');LatexCmds['½'] = bind(LatexFragment,'\\frac12');LatexCmds['¾'] = bind(LatexFragment,'\\frac34');var PlusMinus=P(BinaryOperator,function(_){_.init = VanillaSymbol.prototype.init;_.contactWeld = _.siblingCreated = _.siblingDeleted = function(opts,dir){if(dir === R)return; // ignore if sibling only changed on the right
	// If the left sibling is a binary operator or a separator (comma, semicolon, colon)
	// or an open bracket (open parenthesis, open square bracket)
	// consider the operator to be unary, otherwise binary
	this.jQ[0].className = !this[L] || this[L] instanceof BinaryOperator || /^[,;:\(\[]$/.test(this[L].ctrlSeq)?'':'mq-binary-operator';return this;};});LatexCmds['+'] = bind(PlusMinus,'+','+'); //yes, these are different dashes, I think one is an en dash and the other is a hyphen
	LatexCmds['–'] = LatexCmds['-'] = bind(PlusMinus,'-','&minus;');LatexCmds['±'] = LatexCmds.pm = LatexCmds.plusmn = LatexCmds.plusminus = bind(PlusMinus,'\\pm ','&plusmn;');LatexCmds.mp = LatexCmds.mnplus = LatexCmds.minusplus = bind(PlusMinus,'\\mp ','&#8723;');CharCmds['*'] = LatexCmds.sdot = LatexCmds.cdot = bind(BinaryOperator,'\\cdot ','&middot;','*'); //semantically should be &sdot;, but &middot; looks better
	var Inequality=P(BinaryOperator,function(_,super_){_.init = function(data,strict){this.data = data;this.strict = strict;var strictness=strict?'Strict':'';super_.init.call(this,data['ctrlSeq' + strictness],data['html' + strictness],data['text' + strictness]);};_.swap = function(strict){this.strict = strict;var strictness=strict?'Strict':'';this.ctrlSeq = this.data['ctrlSeq' + strictness];this.jQ.html(this.data['html' + strictness]);this.textTemplate = [this.data['text' + strictness]];};_.deleteTowards = function(dir,cursor){if(dir === L && !this.strict){this.swap(true);this.bubble('reflow');return;}super_.deleteTowards.apply(this,arguments);};});var less={ctrlSeq:'\\le ',html:'&le;',text:'≤',ctrlSeqStrict:'<',htmlStrict:'&lt;',textStrict:'<'};var greater={ctrlSeq:'\\ge ',html:'&ge;',text:'≥',ctrlSeqStrict:'>',htmlStrict:'&gt;',textStrict:'>'};LatexCmds['<'] = LatexCmds.lt = bind(Inequality,less,true);LatexCmds['>'] = LatexCmds.gt = bind(Inequality,greater,true);LatexCmds['≤'] = LatexCmds.le = LatexCmds.leq = bind(Inequality,less,false);LatexCmds['≥'] = LatexCmds.ge = LatexCmds.geq = bind(Inequality,greater,false);var Equality=P(BinaryOperator,function(_,super_){_.init = function(){super_.init.call(this,'=','=');};_.createLeftOf = function(cursor){if(cursor[L] instanceof Inequality && cursor[L].strict){cursor[L].swap(false);cursor[L].bubble('reflow');return;}super_.createLeftOf.apply(this,arguments);};});LatexCmds['='] = Equality;LatexCmds['×'] = LatexCmds.times = bind(BinaryOperator,'\\times ','&times;','[x]');LatexCmds['÷'] = LatexCmds.div = LatexCmds.divide = LatexCmds.divides = bind(BinaryOperator,'\\div ','&divide;','[/]');CharCmds['~'] = LatexCmds.sim = bind(BinaryOperator,'\\sim ','~','~'); /***************************
	 * Commands and Operators.
	 **************************/var scale, // = function(jQ, x, y) { ... }
	//will use a CSS 2D transform to scale the jQuery-wrapped HTML elements,
	//or the filter matrix transform fallback for IE 5.5-8, or gracefully degrade to
	//increasing the fontSize to match the vertical Y scaling factor.
	//ideas from http://github.com/louisremi/jquery.transform.js
	//see also http://msdn.microsoft.com/en-us/library/ms533014(v=vs.85).aspx
	forceIERedraw=noop,div=document.createElement('div'),div_style=div.style,transformPropNames={transform:1,WebkitTransform:1,MozTransform:1,OTransform:1,msTransform:1},transformPropName;for(var prop in transformPropNames) {if(prop in div_style){transformPropName = prop;break;}}if(transformPropName){scale = function(jQ,x,y){jQ.css(transformPropName,'scale(' + x + ',' + y + ')');};}else if('filter' in div_style){ //IE 6, 7, & 8 fallback, see https://github.com/laughinghan/mathquill/wiki/Transforms
	forceIERedraw = function(el){el.className = el.className;};scale = function(jQ,x,y){ //NOTE: assumes y > x
	x /= 1 + (y - 1) / 2;jQ.css('fontSize',y + 'em');if(!jQ.hasClass('mq-matrixed-container')){jQ.addClass('mq-matrixed-container').wrapInner('<span class="mq-matrixed"></span>');}var innerjQ=jQ.children().css('filter','progid:DXImageTransform.Microsoft' + '.Matrix(M11=' + x + ",SizingMethod='auto expand')");function calculateMarginRight(){jQ.css('marginRight',(innerjQ.width() - 1) * (x - 1) / x + 'px');}calculateMarginRight();var intervalId=setInterval(calculateMarginRight);$(window).load(function(){clearTimeout(intervalId);calculateMarginRight();});};}else {scale = function(jQ,x,y){jQ.css('fontSize',y + 'em');};}var Style=P(MathCommand,function(_,super_){_.init = function(ctrlSeq,tagName,attrs){super_.init.call(this,ctrlSeq,'<' + tagName + ' ' + attrs + '>&0</' + tagName + '>');};}); //fonts
	LatexCmds.mathrm = bind(Style,'\\mathrm','span','class="mq-roman mq-font"');LatexCmds.mathit = bind(Style,'\\mathit','i','class="mq-font"');LatexCmds.mathbf = bind(Style,'\\mathbf','b','class="mq-font"');LatexCmds.mathsf = bind(Style,'\\mathsf','span','class="mq-sans-serif mq-font"');LatexCmds.mathtt = bind(Style,'\\mathtt','span','class="mq-monospace mq-font"'); //text-decoration
	LatexCmds.underline = bind(Style,'\\underline','span','class="mq-non-leaf mq-underline"');LatexCmds.overline = LatexCmds.bar = bind(Style,'\\overline','span','class="mq-non-leaf mq-overline"');LatexCmds.overrightarrow = bind(Style,'\\overrightarrow','span','class="mq-non-leaf mq-overarrow mq-arrow-right"');LatexCmds.overleftarrow = bind(Style,'\\overleftarrow','span','class="mq-non-leaf mq-overarrow mq-arrow-left"'); // `\textcolor{color}{math}` will apply a color to the given math content, where
	// `color` is any valid CSS Color Value (see [SitePoint docs][] (recommended),
	// [Mozilla docs][], or [W3C spec][]).
	//
	// [SitePoint docs]: http://reference.sitepoint.com/css/colorvalues
	// [Mozilla docs]: https://developer.mozilla.org/en-US/docs/CSS/color_value#Values
	// [W3C spec]: http://dev.w3.org/csswg/css3-color/#colorunits
	var TextColor=LatexCmds.textcolor = P(MathCommand,function(_,super_){_.setColor = function(color){this.color = color;this.htmlTemplate = '<span class="mq-textcolor" style="color:' + color + '">&0</span>';};_.latex = function(){return '\\textcolor{' + this.color + '}{' + this.blocks[0].latex() + '}';};_.parser = function(){var self=this;var optWhitespace=Parser.optWhitespace;var string=Parser.string;var regex=Parser.regex;return optWhitespace.then(string('{')).then(regex(/^[#\w\s.,()%-]*/)).skip(string('}')).then(function(color){self.setColor(color);return super_.parser.call(self);});};}); // Very similar to the \textcolor command, but will add the given CSS class.
	// Usage: \class{classname}{math}
	// Note regex that whitelists valid CSS classname characters:
	// https://github.com/mathquill/mathquill/pull/191#discussion_r4327442
	var Class=LatexCmds['class'] = P(MathCommand,function(_,super_){_.parser = function(){var self=this,string=Parser.string,regex=Parser.regex;return Parser.optWhitespace.then(string('{')).then(regex(/^[-\w\s\\\xA0-\xFF]*/)).skip(string('}')).then(function(cls){self.htmlTemplate = '<span class="mq-class ' + cls + '">&0</span>';return super_.parser.call(self);});};});var SupSub=P(MathCommand,function(_,super_){_.ctrlSeq = '_{...}^{...}';_.createLeftOf = function(cursor){if(!cursor[L] && cursor.options.supSubsRequireOperand)return;return super_.createLeftOf.apply(this,arguments);};_.contactWeld = function(cursor){ // Look on either side for a SupSub, if one is found compare my
	// .sub, .sup with its .sub, .sup. If I have one that it doesn't,
	// then call .addBlock() on it with my block; if I have one that
	// it also has, then insert my block's children into its block,
	// unless my block has none, in which case insert the cursor into
	// its block (and not mine, I'm about to remove myself) in the case
	// I was just typed.
	// TODO: simplify
	// equiv. to [L, R].forEach(function(dir) { ... });
	for(var dir=L;dir;dir = dir === L?R:false) {if(this[dir] instanceof SupSub){ // equiv. to 'sub sup'.split(' ').forEach(function(supsub) { ... });
	for(var supsub='sub';supsub;supsub = supsub === 'sub'?'sup':false) {var src=this[supsub],dest=this[dir][supsub];if(!src)continue;if(!dest)this[dir].addBlock(src.disown());else if(!src.isEmpty()){ // ins src children at -dir end of dest
	src.jQ.children().insAtDirEnd(-dir,dest.jQ);var children=src.children().disown();var pt=Point(dest,children.ends[R],dest.ends[L]);if(dir === L)children.adopt(dest,dest.ends[R],0);else children.adopt(dest,0,dest.ends[L]);}else var pt=Point(dest,0,dest.ends[L]);this.placeCursor = (function(dest,src){ // TODO: don't monkey-patch
	return function(cursor){cursor.insAtDirEnd(-dir,dest || src);};})(dest,src);}this.remove();if(cursor && cursor[L] === this){if(dir === R && pt){pt[L]?cursor.insRightOf(pt[L]):cursor.insAtLeftEnd(pt.parent);}else cursor.insRightOf(this[dir]);}break;}}};Options.p.charsThatBreakOutOfSupSub = '';_.finalizeTree = function(){this.ends[L].write = function(cursor,ch){if(cursor.options.autoSubscriptNumerals && this === this.parent.sub){if(ch === '_')return;var cmd=this.chToCmd(ch);if(cmd instanceof Symbol)cursor.deleteSelection();else cursor.clearSelection().insRightOf(this.parent);return cmd.createLeftOf(cursor.show());}if(cursor[L] && !cursor[R] && !cursor.selection && cursor.options.charsThatBreakOutOfSupSub.indexOf(ch) > -1){cursor.insRightOf(this.parent);}MathBlock.p.write.apply(this,arguments);};};_.moveTowards = function(dir,cursor,updown){if(cursor.options.autoSubscriptNumerals && !this.sup){cursor.insDirOf(dir,this);}else super_.moveTowards.apply(this,arguments);};_.deleteTowards = function(dir,cursor){if(cursor.options.autoSubscriptNumerals && this.sub){var cmd=this.sub.ends[-dir];if(cmd instanceof Symbol)cmd.remove();else if(cmd)cmd.deleteTowards(dir,cursor.insAtDirEnd(-dir,this.sub)); // TODO: factor out a .removeBlock() or something
	if(this.sub.isEmpty()){this.sub.deleteOutOf(L,cursor.insAtLeftEnd(this.sub));if(this.sup)cursor.insDirOf(-dir,this); // Note `-dir` because in e.g. x_1^2| want backspacing (leftward)
	// to delete the 1 but to end up rightward of x^2; with non-negated
	// `dir` (try it), the cursor appears to have gone "through" the ^2.
	}}else super_.deleteTowards.apply(this,arguments);};_.latex = function(){function latex(prefix,block){var l=block && block.latex();return block?prefix + (l.length === 1?l:'{' + (l || ' ') + '}'):'';}return latex('_',this.sub) + latex('^',this.sup);};_.addBlock = function(block){if(this.supsub === 'sub'){this.sup = this.upInto = this.sub.upOutOf = block;block.adopt(this,this.sub,0).downOutOf = this.sub;block.jQ = $('<span class="mq-sup"/>').append(block.jQ.children()).attr(mqBlockId,block.id).prependTo(this.jQ);}else {this.sub = this.downInto = this.sup.downOutOf = block;block.adopt(this,0,this.sup).upOutOf = this.sup;block.jQ = $('<span class="mq-sub"></span>').append(block.jQ.children()).attr(mqBlockId,block.id).appendTo(this.jQ.removeClass('mq-sup-only'));this.jQ.append('<span style="display:inline-block;width:0">&#8203;</span>');} // like 'sub sup'.split(' ').forEach(function(supsub) { ... });
	for(var i=0;i < 2;i += 1) (function(cmd,supsub,oppositeSupsub,updown){cmd[supsub].deleteOutOf = function(dir,cursor){cursor.insDirOf(this[dir]?-dir:dir,this.parent);if(!this.isEmpty()){var end=this.ends[dir];this.children().disown().withDirAdopt(dir,cursor.parent,cursor[dir],cursor[-dir]).jQ.insDirOf(-dir,cursor.jQ);cursor[-dir] = end;}cmd.supsub = oppositeSupsub;delete cmd[supsub];delete cmd[updown + 'Into'];cmd[oppositeSupsub][updown + 'OutOf'] = insLeftOfMeUnlessAtEnd;delete cmd[oppositeSupsub].deleteOutOf;if(supsub === 'sub')$(cmd.jQ.addClass('mq-sup-only')[0].lastChild).remove();this.remove();};})(this,'sub sup'.split(' ')[i],'sup sub'.split(' ')[i],'down up'.split(' ')[i]);};});function insLeftOfMeUnlessAtEnd(cursor){ // cursor.insLeftOf(cmd), unless cursor at the end of block, and every
	// ancestor cmd is at the end of every ancestor block
	var cmd=this.parent,ancestorCmd=cursor;do {if(ancestorCmd[R])return cursor.insLeftOf(cmd);ancestorCmd = ancestorCmd.parent.parent;}while(ancestorCmd !== cmd);cursor.insRightOf(cmd);}LatexCmds.subscript = LatexCmds._ = P(SupSub,function(_,super_){_.supsub = 'sub';_.htmlTemplate = '<span class="mq-supsub mq-non-leaf">' + '<span class="mq-sub">&0</span>' + '<span style="display:inline-block;width:0">&#8203;</span>' + '</span>';_.textTemplate = ['_'];_.finalizeTree = function(){this.downInto = this.sub = this.ends[L];this.sub.upOutOf = insLeftOfMeUnlessAtEnd;super_.finalizeTree.call(this);};});LatexCmds.superscript = LatexCmds.supscript = LatexCmds['^'] = P(SupSub,function(_,super_){_.supsub = 'sup';_.htmlTemplate = '<span class="mq-supsub mq-non-leaf mq-sup-only">' + '<span class="mq-sup">&0</span>' + '</span>';_.textTemplate = ['^'];_.finalizeTree = function(){this.upInto = this.sup = this.ends[R];this.sup.downOutOf = insLeftOfMeUnlessAtEnd;super_.finalizeTree.call(this);};});var SummationNotation=P(MathCommand,function(_,super_){_.init = function(ch,html){var htmlTemplate='<span class="mq-large-operator mq-non-leaf">' + '<span class="mq-to"><span>&1</span></span>' + '<big>' + html + '</big>' + '<span class="mq-from"><span>&0</span></span>' + '</span>';Symbol.prototype.init.call(this,ch,htmlTemplate);};_.createLeftOf = function(cursor){super_.createLeftOf.apply(this,arguments);if(cursor.options.sumStartsWithNEquals){Letter('n').createLeftOf(cursor);Equality().createLeftOf(cursor);}};_.latex = function(){function simplify(latex){return latex.length === 1?latex:'{' + (latex || ' ') + '}';}return this.ctrlSeq + '_' + simplify(this.ends[L].latex()) + '^' + simplify(this.ends[R].latex());};_.parser = function(){var string=Parser.string;var optWhitespace=Parser.optWhitespace;var succeed=Parser.succeed;var block=latexMathParser.block;var self=this;var blocks=self.blocks = [MathBlock(),MathBlock()];for(var i=0;i < blocks.length;i += 1) {blocks[i].adopt(self,self.ends[R],0);}return optWhitespace.then(string('_').or(string('^'))).then(function(supOrSub){var child=blocks[supOrSub === '_'?0:1];return block.then(function(block){block.children().adopt(child,child.ends[R],0);return succeed(self);});}).many().result(self);};_.finalizeTree = function(){this.downInto = this.ends[L];this.upInto = this.ends[R];this.ends[L].upOutOf = this.ends[R];this.ends[R].downOutOf = this.ends[L];};});LatexCmds['∑'] = LatexCmds.sum = LatexCmds.summation = bind(SummationNotation,'\\sum ','&sum;');LatexCmds['∏'] = LatexCmds.prod = LatexCmds.product = bind(SummationNotation,'\\prod ','&prod;');LatexCmds.coprod = LatexCmds.coproduct = bind(SummationNotation,'\\coprod ','&#8720;');LatexCmds['∫'] = LatexCmds['int'] = LatexCmds.integral = P(SummationNotation,function(_,super_){_.init = function(){var htmlTemplate='<span class="mq-int mq-non-leaf">' + '<big>&int;</big>' + '<span class="mq-supsub mq-non-leaf">' + '<span class="mq-sup"><span class="mq-sup-inner">&1</span></span>' + '<span class="mq-sub">&0</span>' + '<span style="display:inline-block;width:0">&#8203</span>' + '</span>' + '</span>';Symbol.prototype.init.call(this,'\\int ',htmlTemplate);}; // FIXME: refactor rather than overriding
	_.createLeftOf = MathCommand.p.createLeftOf;});var Fraction=LatexCmds.frac = LatexCmds.dfrac = LatexCmds.cfrac = LatexCmds.fraction = P(MathCommand,function(_,super_){_.ctrlSeq = '\\frac';_.htmlTemplate = '<span class="mq-fraction mq-non-leaf">' + '<span class="mq-numerator">&0</span>' + '<span class="mq-denominator">&1</span>' + '<span style="display:inline-block;width:0">&#8203;</span>' + '</span>';_.textTemplate = ['(',')/(',')'];_.finalizeTree = function(){this.upInto = this.ends[R].upOutOf = this.ends[L];this.downInto = this.ends[L].downOutOf = this.ends[R];};});var LiveFraction=LatexCmds.over = CharCmds['/'] = P(Fraction,function(_,super_){_.createLeftOf = function(cursor){if(!this.replacedFragment){var leftward=cursor[L];while(leftward && !(leftward instanceof BinaryOperator || leftward instanceof (LatexCmds.text || noop) || leftward instanceof SummationNotation || leftward.ctrlSeq === '\\ ' || /^[,;:]$/.test(leftward.ctrlSeq)) //lookbehind for operator
	) leftward = leftward[L];if(leftward instanceof SummationNotation && leftward[R] instanceof SupSub){leftward = leftward[R];if(leftward[R] instanceof SupSub && leftward[R].ctrlSeq != leftward.ctrlSeq)leftward = leftward[R];}if(leftward !== cursor[L]){this.replaces(Fragment(leftward[R] || cursor.parent.ends[L],cursor[L]));cursor[L] = leftward;}}super_.createLeftOf.call(this,cursor);};});var SquareRoot=LatexCmds.sqrt = LatexCmds['√'] = P(MathCommand,function(_,super_){_.ctrlSeq = '\\sqrt';_.htmlTemplate = '<span class="mq-non-leaf">' + '<span class="mq-scaled mq-sqrt-prefix">&radic;</span>' + '<span class="mq-non-leaf mq-sqrt-stem">&0</span>' + '</span>';_.textTemplate = ['sqrt(',')'];_.parser = function(){return latexMathParser.optBlock.then(function(optBlock){return latexMathParser.block.map(function(block){var nthroot=NthRoot();nthroot.blocks = [optBlock,block];optBlock.adopt(nthroot,0,0);block.adopt(nthroot,optBlock,0);return nthroot;});}).or(super_.parser.call(this));};_.reflow = function(){var block=this.ends[R].jQ;scale(block.prev(),1,block.innerHeight() / +block.css('fontSize').slice(0,-2) - .1);};});var Vec=LatexCmds.vec = P(MathCommand,function(_,super_){_.ctrlSeq = '\\vec';_.htmlTemplate = '<span class="mq-non-leaf">' + '<span class="mq-vector-prefix">&rarr;</span>' + '<span class="mq-vector-stem">&0</span>' + '</span>';_.textTemplate = ['vec(',')'];});var NthRoot=LatexCmds.nthroot = P(SquareRoot,function(_,super_){_.htmlTemplate = '<sup class="mq-nthroot mq-non-leaf">&0</sup>' + '<span class="mq-scaled">' + '<span class="mq-sqrt-prefix mq-scaled">&radic;</span>' + '<span class="mq-sqrt-stem mq-non-leaf">&1</span>' + '</span>';_.textTemplate = ['sqrt[','](',')'];_.latex = function(){return '\\sqrt[' + this.ends[L].latex() + ']{' + this.ends[R].latex() + '}';};});function DelimsMixin(_,super_){_.jQadd = function(){super_.jQadd.apply(this,arguments);this.delimjQs = this.jQ.children(':first').add(this.jQ.children(':last'));this.contentjQ = this.jQ.children(':eq(1)');};_.reflow = function(){var height=this.contentjQ.outerHeight() / parseFloat(this.contentjQ.css('fontSize'));scale(this.delimjQs,min(1 + .2 * (height - 1),1.2),1.2 * height);};} // Round/Square/Curly/Angle Brackets (aka Parens/Brackets/Braces)
	//   first typed as one-sided bracket with matching "ghost" bracket at
	//   far end of current block, until you type an opposing one
	var Bracket=P(P(MathCommand,DelimsMixin),function(_,super_){_.init = function(side,open,close,ctrlSeq,end){super_.init.call(this,'\\left' + ctrlSeq,undefined,[open,close]);this.side = side;this.sides = {};this.sides[L] = {ch:open,ctrlSeq:ctrlSeq};this.sides[R] = {ch:close,ctrlSeq:end};};_.numBlocks = function(){return 1;};_.html = function(){ // wait until now so that .side may
	this.htmlTemplate =  // be set by createLeftOf or parser
	'<span class="mq-non-leaf">' + '<span class="mq-scaled mq-paren' + (this.side === R?' mq-ghost':'') + '">' + this.sides[L].ch + '</span>' + '<span class="mq-non-leaf">&0</span>' + '<span class="mq-scaled mq-paren' + (this.side === L?' mq-ghost':'') + '">' + this.sides[R].ch + '</span>' + '</span>';return super_.html.call(this);};_.latex = function(){return '\\left' + this.sides[L].ctrlSeq + this.ends[L].latex() + '\\right' + this.sides[R].ctrlSeq;};_.oppBrack = function(opts,node,expectedSide){ // return node iff it's a 1-sided bracket of expected side (if any, may be
	// undefined), and of opposite side from me if I'm not a pipe
	return node instanceof Bracket && node.side && node.side !== -expectedSide && (this.sides[this.side].ch === '|' || node.side === -this.side) && (!opts.restrictMismatchedBrackets || OPP_BRACKS[this.sides[this.side].ch] === node.sides[node.side].ch || ({'(':']','[':')'})[this.sides[L].ch] === node.sides[R].ch) && node;};_.closeOpposing = function(brack){brack.side = 0;brack.sides[this.side] = this.sides[this.side]; // copy over my info (may be
	brack.delimjQs.eq(this.side === L?0:1) // mismatched, like [a, b))
	.removeClass('mq-ghost').html(this.sides[this.side].ch);};_.createLeftOf = function(cursor){if(!this.replacedFragment){ // unless wrapping seln in brackets,
	// check if next to or inside an opposing one-sided bracket
	// (must check both sides 'cos I might be a pipe)
	var opts=cursor.options;var brack=this.oppBrack(opts,cursor[L],L) || this.oppBrack(opts,cursor[R],R) || this.oppBrack(opts,cursor.parent.parent);}if(brack){var side=this.side = -brack.side; // may be pipe with .side not yet set
	this.closeOpposing(brack);if(brack === cursor.parent.parent && cursor[side]){ // move the stuff between
	Fragment(cursor[side],cursor.parent.ends[side],-side) // me and ghost outside
	.disown().withDirAdopt(-side,brack.parent,brack,brack[side]).jQ.insDirOf(side,brack.jQ);brack.bubble('reflow');}}else {brack = this,side = brack.side;if(brack.replacedFragment)brack.side = 0; // wrapping seln, don't be one-sided
	else if(cursor[-side]){ // elsewise, auto-expand so ghost is at far end
	brack.replaces(Fragment(cursor[-side],cursor.parent.ends[-side],side));cursor[-side] = 0;}super_.createLeftOf.call(brack,cursor);}if(side === L)cursor.insAtLeftEnd(brack.ends[L]);else cursor.insRightOf(brack);};_.placeCursor = noop;_.unwrap = function(){this.ends[L].children().disown().adopt(this.parent,this,this[R]).jQ.insertAfter(this.jQ);this.remove();};_.deleteSide = function(side,outward,cursor){var parent=this.parent,sib=this[side],farEnd=parent.ends[side];if(side === this.side){ // deleting non-ghost of one-sided bracket, unwrap
	this.unwrap();sib?cursor.insDirOf(-side,sib):cursor.insAtDirEnd(side,parent);return;}var opts=cursor.options,wasSolid=!this.side;this.side = -side; // if deleting like, outer close-brace of [(1+2)+3} where inner open-paren
	if(this.oppBrack(opts,this.ends[L].ends[this.side],side)){ // is ghost,
	this.closeOpposing(this.ends[L].ends[this.side]); // then become [1+2)+3
	var origEnd=this.ends[L].ends[side];this.unwrap();if(origEnd.siblingCreated)origEnd.siblingCreated(cursor.options,side);sib?cursor.insDirOf(-side,sib):cursor.insAtDirEnd(side,parent);}else { // if deleting like, inner close-brace of ([1+2}+3) where outer
	if(this.oppBrack(opts,this.parent.parent,side)){ // open-paren is
	this.parent.parent.closeOpposing(this); // ghost, then become [1+2+3)
	this.parent.parent.unwrap();} // else if deleting outward from a solid pair, unwrap
	else if(outward && wasSolid){this.unwrap();sib?cursor.insDirOf(-side,sib):cursor.insAtDirEnd(side,parent);return;}else { // else deleting just one of a pair of brackets, become one-sided
	this.sides[side] = {ch:OPP_BRACKS[this.sides[this.side].ch],ctrlSeq:OPP_BRACKS[this.sides[this.side].ctrlSeq]};this.delimjQs.removeClass('mq-ghost').eq(side === L?0:1).addClass('mq-ghost').html(this.sides[side].ch);}if(sib){ // auto-expand so ghost is at far end
	var origEnd=this.ends[L].ends[side];Fragment(sib,farEnd,-side).disown().withDirAdopt(-side,this.ends[L],origEnd,0).jQ.insAtDirEnd(side,this.ends[L].jQ.removeClass('mq-empty'));if(origEnd.siblingCreated)origEnd.siblingCreated(cursor.options,side);cursor.insDirOf(-side,sib);} // didn't auto-expand, cursor goes just outside or just inside parens
	else outward?cursor.insDirOf(side,this):cursor.insAtDirEnd(side,this.ends[L]);}};_.deleteTowards = function(dir,cursor){this.deleteSide(-dir,false,cursor);};_.finalizeTree = function(){this.ends[L].deleteOutOf = function(dir,cursor){this.parent.deleteSide(dir,true,cursor);}; // FIXME HACK: after initial creation/insertion, finalizeTree would only be
	// called if the paren is selected and replaced, e.g. by LiveFraction
	this.finalizeTree = this.intentionalBlur = function(){this.delimjQs.eq(this.side === L?1:0).removeClass('mq-ghost');this.side = 0;};};_.siblingCreated = function(opts,dir){ // if something typed between ghost and far
	if(dir === -this.side)this.finalizeTree(); // end of its block, solidify
	};});var OPP_BRACKS={'(':')',')':'(','[':']',']':'[','{':'}','}':'{','\\{':'\\}','\\}':'\\{','&lang;':'&rang;','&rang;':'&lang;','\\langle ':'\\rangle ','\\rangle ':'\\langle ','|':'|'};function bindCharBracketPair(open,ctrlSeq){var ctrlSeq=ctrlSeq || open,close=OPP_BRACKS[open],end=OPP_BRACKS[ctrlSeq];CharCmds[open] = bind(Bracket,L,open,close,ctrlSeq,end);CharCmds[close] = bind(Bracket,R,open,close,ctrlSeq,end);}bindCharBracketPair('(');bindCharBracketPair('[');bindCharBracketPair('{','\\{');LatexCmds.langle = bind(Bracket,L,'&lang;','&rang;','\\langle ','\\rangle ');LatexCmds.rangle = bind(Bracket,R,'&lang;','&rang;','\\langle ','\\rangle ');CharCmds['|'] = bind(Bracket,L,'|','|','|','|');LatexCmds.left = P(MathCommand,function(_){_.parser = function(){var regex=Parser.regex;var string=Parser.string;var succeed=Parser.succeed;var optWhitespace=Parser.optWhitespace;return optWhitespace.then(regex(/^(?:[([|]|\\\{)/)).then(function(ctrlSeq){ // TODO: \langle, \rangle
	var open=ctrlSeq.charAt(0) === '\\'?ctrlSeq.slice(1):ctrlSeq;return latexMathParser.then(function(block){return string('\\right').skip(optWhitespace).then(regex(/^(?:[\])|]|\\\})/)).map(function(end){var close=end.charAt(0) === '\\'?end.slice(1):end;var cmd=Bracket(0,open,close,ctrlSeq,end);cmd.blocks = [block];block.adopt(cmd,0,0);return cmd;});});});};});LatexCmds.right = P(MathCommand,function(_){_.parser = function(){return Parser.fail('unmatched \\right');};});var Binomial=LatexCmds.binom = LatexCmds.binomial = P(P(MathCommand,DelimsMixin),function(_,super_){_.ctrlSeq = '\\binom';_.htmlTemplate = '<span class="mq-non-leaf">' + '<span class="mq-paren mq-scaled">(</span>' + '<span class="mq-non-leaf">' + '<span class="mq-array mq-non-leaf">' + '<span>&0</span>' + '<span>&1</span>' + '</span>' + '</span>' + '<span class="mq-paren mq-scaled">)</span>' + '</span>';_.textTemplate = ['choose(',',',')'];});var Choose=LatexCmds.choose = P(Binomial,function(_){_.createLeftOf = LiveFraction.prototype.createLeftOf;});LatexCmds.editable =  // backcompat with before cfd3620 on #233
	LatexCmds.MathQuillMathField = P(MathCommand,function(_,super_){_.ctrlSeq = '\\MathQuillMathField';_.htmlTemplate = '<span class="mq-editable-field">' + '<span class="mq-root-block">&0</span>' + '</span>';_.parser = function(){var self=this,string=Parser.string,regex=Parser.regex,succeed=Parser.succeed;return string('[').then(regex(/^[a-z][a-z0-9]*/i)).skip(string(']')).map(function(name){self.name = name;}).or(succeed()).then(super_.parser.call(self));};_.finalizeTree = function(){var ctrlr=Controller(this.ends[L],this.jQ,Options());ctrlr.KIND_OF_MQ = 'MathField';ctrlr.editable = true;ctrlr.createTextarea();ctrlr.editablesTextareaEvents();ctrlr.cursor.insAtRightEnd(ctrlr.root);RootBlockMixin(ctrlr.root);};_.registerInnerField = function(innerFields,MathField){innerFields.push(innerFields[this.name] = MathField(this.ends[L].controller));};_.latex = function(){return this.ends[L].latex();};_.text = function(){return this.ends[L].text();};}); // Embed arbitrary things
	// Probably the closest DOM analogue would be an iframe?
	// From MathQuill's perspective, it's a Symbol, it can be
	// anywhere and the cursor can go around it but never in it.
	// Create by calling public API method .dropEmbedded(),
	// or by calling the global public API method .registerEmbed()
	// and rendering LaTeX like \embed{registeredName} (see test).
	var Embed=LatexCmds.embed = P(Symbol,function(_,super_){_.setOptions = function(options){function noop(){return "";}this.text = options.text || noop;this.htmlTemplate = options.htmlString || "";this.latex = options.latex || noop;return this;};_.parser = function(){var self=this;string = Parser.string,regex = Parser.regex,succeed = Parser.succeed;return string('{').then(regex(/^[a-z][a-z0-9]*/i)).skip(string('}')).then(function(name){ // the chars allowed in the optional data block are arbitrary other than
	// excluding curly braces and square brackets (which'd be too confusing)
	return string('[').then(regex(/^[-\w\s]*/)).skip(string(']')).or(succeed()).map(function(data){return self.setOptions(EMBEDS[name](data));});});};}); /****************************************
	 * Input box to type backslash commands
	 ***************************************/var LatexCommandInput=CharCmds['\\'] = P(MathCommand,function(_,super_){_.ctrlSeq = '\\';_.replaces = function(replacedFragment){this._replacedFragment = replacedFragment.disown();this.isEmpty = function(){return false;};};_.htmlTemplate = '<span class="mq-latex-command-input mq-non-leaf">\\<span>&0</span></span>';_.textTemplate = ['\\'];_.createBlocks = function(){super_.createBlocks.call(this);this.ends[L].focus = function(){this.parent.jQ.addClass('mq-hasCursor');if(this.isEmpty())this.parent.jQ.removeClass('mq-empty');return this;};this.ends[L].blur = function(){this.parent.jQ.removeClass('mq-hasCursor');if(this.isEmpty())this.parent.jQ.addClass('mq-empty');return this;};this.ends[L].write = function(cursor,ch){cursor.show().deleteSelection();if(ch.match(/[a-z]/i))VanillaSymbol(ch).createLeftOf(cursor);else {this.parent.renderCommand(cursor);if(ch !== '\\' || !this.isEmpty())this.parent.parent.write(cursor,ch);}};this.ends[L].keystroke = function(key,e,ctrlr){if(key === 'Tab' || key === 'Enter' || key === 'Spacebar'){this.parent.renderCommand(ctrlr.cursor);e.preventDefault();return;}return super_.keystroke.apply(this,arguments);};};_.createLeftOf = function(cursor){super_.createLeftOf.call(this,cursor);if(this._replacedFragment){var el=this.jQ[0];this.jQ = this._replacedFragment.jQ.addClass('mq-blur').bind('mousedown mousemove', //FIXME: is monkey-patching the mousedown and mousemove handlers the right way to do this?
	function(e){$(e.target = el).trigger(e);return false;}).insertBefore(this.jQ).add(this.jQ);}};_.latex = function(){return '\\' + this.ends[L].latex() + ' ';};_.renderCommand = function(cursor){this.jQ = this.jQ.last();this.remove();if(this[R]){cursor.insLeftOf(this[R]);}else {cursor.insAtRightEnd(this.parent);}var latex=this.ends[L].latex();if(!latex)latex = ' ';var cmd=LatexCmds[latex];if(cmd){cmd = cmd(latex);if(this._replacedFragment)cmd.replaces(this._replacedFragment);cmd.createLeftOf(cursor);}else {cmd = TextBlock();cmd.replaces(latex);cmd.createLeftOf(cursor);cursor.insRightOf(cmd);if(this._replacedFragment)this._replacedFragment.remove();}};});var MQ1=getInterface(1);for(var key in MQ1) (function(key,val){if(typeof val === 'function'){MathQuill[key] = function(){insistOnInterVer();return val.apply(this,arguments);};MathQuill[key].prototype = val.prototype;}else MathQuill[key] = val;})(key,MQ1[key]);})();

/***/ }),
/* 4 */
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
	
	var _parser = __webpack_require__(5);
	
	var _parser2 = _interopRequireDefault(_parser);
	
	var _formatMath = __webpack_require__(9);
	
	var _formatMath2 = _interopRequireDefault(_formatMath);
	
	var _logger = __webpack_require__(6);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _greekLetters = __webpack_require__(10);
	
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _logger = __webpack_require__(6);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _functions = __webpack_require__(8);
	
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
/* 6 */
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports['default'] = ['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'log', 'ln', 'sqrt', 'max', 'min'];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _greekLetters = __webpack_require__(10);
	
	var greekLetters = _interopRequireWildcard(_greekLetters);
	
	var _logger = __webpack_require__(6);
	
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
/* 10 */
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
	
	var _logger = __webpack_require__(6);
	
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