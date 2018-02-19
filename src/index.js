const AlgebraLatex = require('algebra-latex');

let mathFieldSpan = document.getElementById('math-field');
let latexSpan = document.getElementById('latex');
let exprSpan = document.getElementById('expr');
let ansSpan = document.getElementById('ans');
let latexInput;
let algebraObj;
let mathOutput;

let MQ = MathQuill.getInterface(2); // for backcompat

let evaluateLatex;

let config = {
    spaceBehavesLikeTab: true, // configurable
    restrictMismatchedBrackets: true,
    supSubsRequireOperand: true,
    autoCommands: 'pi theta pm sqrt nthroot sum prod coprod',
    autoOperatorNames: 'sin cos tan',
    handlers: {
        edit: function () { // useful event handlers
            var enteredMath = mathField.latex(); // Get entered math in LaTeX format
            latexSpan.textContent = enteredMath; // simple API
            latexInput = mathField.latex(); //storing latex format expression
            algebraObj = new AlgebraLatex(latexInput); //initializing AlgebraLatex
            mathOutput = algebraObj.toMath(); //storing math format expression
            exprSpan.innerHTML = mathOutput;
        },
        enter: function () { evaluateLatex(); }
    }
};
let mathField = MQ.MathField(mathFieldSpan, config);

evaluateLatex = function () {
    try {
        let tree, evl;
        tree = MathExpression.fromLatex(latexInput);
        // evl = tree.evaluate();
        evl = latexeval(latexInput)
        console.log(tree);
        console.log(evl)
        ansSpan.innerHTML = evl;
    } catch (error) {
        console.warn(error);
        ansSpan.innerHTML = "Incorrect Input";
    }

}

$("#eval").off("click").on("click", evaluateLatex);

$("#cmdInputButton").off("click").on("click", () => {
    let text = $("#latexInput1").val();
    // mathField.latex(text); // Renders the given LaTeX in the MathQuill field
    // mathField.latex(); // => '2^{\\frac{3}{2}}'
    // mathField.write(text);
    mathField.cmd(text);

    //    a(text);
    // mathField.MathQuill('write', text.replace('%1', latex)).focus();
});

$("#typeInputButton").off("click").on("click", () => {
    let text = $("#latexInput2").val();
    mathField.typedText(text);
    mathField.focus();
});


$("#writeInputButton").off("click").on("click", () => {
    let text = $("#latexInput3").val();
    mathField.write(text);
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
    var latexrep = [
        [/((?:[\-+]?[0-9]+)|(?:\\left\([^\(\)]+\\right\)))!/ig, 'factorial($1)'],
        [/\\sqrt{([^{}]+)}/ig, 'sqrt($1)'],
        [/\\frac{([^{}]+)}{([^{}]+)}/ig, '(($1)/($2))'],
        [/\\left\|([^\|]*)\\right\|/g, 'abs($1)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\^((?:[\-+]?[0-9\.]+)|(?:{[^{}]+}))/ig, 'pow($1, $2)'],

        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2070/ig, 'pow($1, 0)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B9/ig, 'pow($1, 1)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B2/ig, 'pow($1, 2)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B3/ig, 'pow($1, 3)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2074/ig, 'pow($1, 4)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2075/ig, 'pow($1, 5)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2076/ig, 'pow($1, 6)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2077/ig, 'pow($1, 7)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2078/ig, 'pow($1, 8)'],
        [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2079/ig, 'pow($1, 9)']
    ];

    // Some LaTeX-markings need to be replaced only once.
    var reponce = [
        [/\\sin\^{-1}|\\arcsin|\\asin/ig, 'asin'], // Replace arcsin
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
        [/\\exp1/ig, 'exp(1)'], // Replace Neper's number
        //[/([0-9]+)PI/ig, '$1*PI']
    ]
    var oldexpr = '';

    /*
     * Commas should be replaced from the original input before
     * any of the power functions (or other functions containing
     * commas as separators) are replaced.
     */
    expression = expression.replace(/,/ig, '.');
    // expression = expression.replace(/\\mathrm{e}|\\e|\\text{e}/ig, '\\exp1');

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
        var demoREMOVE="hallua";
        if (Math.hasOwnProperty(word)) {

            return 'Math.' + word;
        } else if (
            (word.toLowerCase() == 'x') ||
            (word.toLowerCase() == 'y') ||
            (word.toLowerCase() == 'z') ||
            (word.toLowerCase() == 't')
        ) return word;
        else {
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

            var s = (new Function('return (' + expression + ')'))();
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
}

/**
 * Adds factorial to Math library.
 * 
 * Implementation doesn't do memorization or any of the numerical
 * accuracy improvements.
 */
Math.factorial = function (num) {
    if ((typeof (num) === 'number') && (num >= 0)) {
        if (num >= 1000) return (Number.POSITIVE_INFINITY); // Javascript's numeric capabilities stop much earlier than this, on the test bench the limit is 170.
        //if ((n===+n) && (n!==(n|0))) return(undefined); // Not defined for decimals. Would require an implementation of the Gamma function.

        var result = 1;
        for (var i = 2; i <= num; i++) result *= i;
        return (result);
    } else return (undefined); // Unprocessed cases.
}

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
       if (ch >= "0" && ch <= "9") { // look for (decimal) number
           j--;
           while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
           if (ch == ".") {
               j--;
               while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
           }
       } else if (ch == ")") { // look for matching opening bracket and function name
           nested = 1;
           j--;
           while (j >= 0 && nested > 0) {
               ch = st.charAt(j);
               if (ch == "(") nested--;
               else if (ch == ")") nested++;
               j--;
           }
           while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
       } else if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") { // look for variable
           j--;
           while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
       } else {
           return "Error: incorrect syntax in " + st + " at position " + j;
       }
       //find right argument
       if (i == st.length - 1) return "Error: missing argument";
       k = i + 1;
       ch = st.charAt(k);
       if (ch >= "0" && ch <= "9" || ch == "-") { // look for signed (decimal) number
           k++;
           while (k < st.length && (ch = st.charAt(k)) >= "0" && ch <= "9") k++;
           if (ch == ".") {
               k++;
               while (k < st.length && (ch = st.charAt(k)) >= "0" && ch <= "9") k++;
           }
       } else if (ch == "(") { // look for matching closing bracket and function name
           nested = 1;
           k++;
           while (k < st.length && nested > 0) {
               ch = st.charAt(k);
               if (ch == "(") nested++;
               else if (ch == ")") nested--;
               k++;
           }
       } else if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") { // look for variable
           k++;
           while (k < st.length && (ch = st.charAt(k)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") k++;
       } else {
           return "Error: incorrect syntax in " + st + " at position " + k;
       }
       st = st.slice(0, j + 1) + "Math.pow(" + st.slice(j + 1, i) + "," + st.slice(i + 1, k) + ")" +
           st.slice(k);
   }
   while ((i = st.indexOf("!")) != -1) {
       //find left argument
       if (i == 0) return "Error: missing argument";
       j = i - 1;
       ch = st.charAt(j);
       if (ch >= "0" && ch <= "9") { // look for (decimal) number
           j--;
           while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
           if (ch == ".") {
               j--;
               while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
           }
       } else if (ch == ")") { // look for matching opening bracket and function name
           nested = 1;
           j--;
           while (j >= 0 && nested > 0) {
               ch = st.charAt(j);
               if (ch == "(") nested--;
               else if (ch == ")") nested++;
               j--;
           }
           while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
       } else if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") { // look for variable
           j--;
           while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
       } else {
           return "Error: incorrect syntax in " + st + " at position " + j;
       }
       st = st.slice(0, j + 1) + "Math.factorial(" + st.slice(j + 1, i) + ")" + st.slice(i + 1);
   }
   return st;
}