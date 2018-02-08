const AlgebraLatex = require('algebra-latex');

let mathFieldSpan = document.getElementById('math-field');
let latexSpan = document.getElementById('latex');
let exprSpan = document.getElementById('expr');

let MQ = MathQuill.getInterface(2); // for backcompat
let mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true, // configurable
    handlers: {
        edit: function () { // useful event handlers
            latexSpan.textContent = mathField.latex(); // simple API
            let latexInput = mathField.latex(); //storing latex format expression
            let algebraObj = new AlgebraLatex(latexInput); //initializing AlgebraLatex
            let mathOutput = algebraObj.toMath(); //storing math format expression
            exprSpan.innerHTML = mathOutput;
        }
    }
});
