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
    autoCommands: 'pi theta pm sqrt sum prod coprod',
    autoOperatorNames: 'sin cos tan',
    handlers: {
        edit: function () { // useful event handlers
            latexSpan.textContent = mathField.latex(); // simple API
            latexInput = mathField.latex(); //storing latex format expression
            algebraObj = new AlgebraLatex(latexInput); //initializing AlgebraLatex
            mathOutput = algebraObj.toMath(); //storing math format expression
            exprSpan.innerHTML = mathOutput;
        },
        enter: function () { evaluateLatex(); }
    }
};
let mathField = MQ.MathField(mathFieldSpan, config);


$("#eval").off("click").on("click", evaluateLatex);

evaluateLatex = function () {
    try {
        let tree = MathExpression.fromLatex(latexInput),
            evl = tree.evaluate();
        console.log(tree);
        console.log(evl)
        ansSpan.innerHTML = evl;
    } catch (error) {
        console.warn(error);
        ansSpan.innerHTML = "Incorrect Input";
    }

}