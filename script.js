const operationList = '+-x/=';

function add(a , b){
    const scale = decimalErrorFix(a , b);
    return (a * scale + b * scale) / scale;
};

function subtract(a , b){
    const scale = decimalErrorFix(a , b);
    return (a * scale - b * scale) / scale;
};

function multiply(a , b){
    return a * b;
};

function divide(a , b){
    if (b === 0){
        return 'Consequences';
    }
    return a / b;
};

function decimalErrorFix(a , b){
    const aDecimal = String(a).includes('.') ? String(a).split('.')[1].length : 0;
    const bDecimal = String(b).includes('.') ? String(b).split('.')[1].length : 0;

    return 10 ** Math.max(aDecimal, bDecimal); 
}

function formatForDisplay(value){
    const maxChars = 10;

    if (!Number.isFinite(value)) return 'Error';

    if (Object.is(value, -0)) value = 0;

    // If value fits display
    let s = String(value);
    if (s.length <= maxChars) return s;

    // Fit for decimals
    const abs = Math.abs(value);
    const intDigits = Math.trunc(abs).toString().length; // digits left of decimal
    const sign = value < 0 ? 1 : 0;

    const decimalsAllowed = Math.max(0, maxChars - (sign + intDigits + 1));
    s = value.toFixed(decimalsAllowed);

    // If Integer is too big
    if (intDigits + sign > maxChars) {
        return value.toExponential(Math.max(0, maxChars - (sign + 6))); 
    }

    if (s.length > maxChars) {
        const prec = Math.max(0, maxChars - (sign + 5));
        s = value.toExponential(prec);
    }

    return s.length <= maxChars ? s : s.slice(0, maxChars);

}

function operate(operator, a, b){

    if (!Number.isFinite(a) || !Number.isFinite(b)){
        return 'No previous number';
    };
    
    switch (operator) {
    case '+':
        return add(a, b);
    case '-':
        return subtract(a, b);
    case 'x':
        return multiply(a, b);
    case '/':
        return divide(a, b);
    };
    
}

function numberLimit(btns){ // Limitation for the display of calculator
    btns.forEach(numberBtn =>{
        if (numberBtn.classList.contains('decimal') || numberBtn.classList.contains('number')){
            numberBtn.style.backgroundColor = 'black';
            numberBtn.style.color = 'white';
        }
    });
}

function resetNumberLimit(btns){ // Resets display limit of calculator
    btns.forEach(numberBtn =>{
        if (numberBtn.classList.contains('decimal') || numberBtn.classList.contains('number')){
            numberBtn.style.backgroundColor = '';
            numberBtn.style.color = '';
        }
    });
}

const btns = document.querySelectorAll('button');
const display = document.querySelector("#display");
let currentNumber = null;
let previousOperation = null;
let lastOperation = null;
let lastOperand = null;
let awaitingNextNumber = false;

btns.forEach(btn => {
    btn.addEventListener('click', () => {
    const t = btn.textContent;

    if (t === 'AC') { // Clear button
        display.textContent = '0';
        display.style.fontSize = '';
        resetNumberLimit(btns);

        currentNumber = null;
        previousOperation = null;
        lastOperation = null;
        lastOperand = null;
        awaitingNextNumber = false;

        return;
    }

    if (btn.classList.contains('number')) { // Procedure for numbers
        if (previousOperation === null && lastOperation !== null && awaitingNextNumber) {
        currentNumber = null;
        lastOperation = null;
        lastOperand = null;
        }

        if (awaitingNextNumber || display.textContent === '0') { // handle the first input
        display.textContent = String(t);
        } else {
        if (display.textContent.length === 10) {
            numberLimit(btns);
            return;
        }
        display.textContent += String(t);
        }

        resetNumberLimit(btns);
        awaitingNextNumber = false;
        return;
    }

    if (btn.classList.contains('decimal')) { // Procedure to handle decimals
        if (previousOperation === null && lastOperation !== null && awaitingNextNumber) {
        currentNumber = null;
        lastOperation = null;
        lastOperand = null;
        }

        if (display.textContent.includes('.')) return;

        if (awaitingNextNumber) { // handle the first input
        display.textContent = '0.';
        } else {
        if (display.textContent.length === 10) {
            numberLimit(btns);
            return;
        }
        display.textContent += '.';
        }

        awaitingNextNumber = false;
        return;
    }

    if (!btn.classList.contains('operation')) return;

    if (t !== '=') { // Procedure for operations except for equals
        if (previousOperation !== null && awaitingNextNumber) {
            previousOperation = t;
            return;
        }

        if (currentNumber === null) {
            currentNumber = Number(display.textContent);
            previousOperation = t;
            awaitingNextNumber = true;
            resetNumberLimit(btns);
            return;
        }

        if (previousOperation !== null && !awaitingNextNumber) { // Handling result
            const b = Number(display.textContent);
            const r = operate(previousOperation, currentNumber, b);

            if (r === 'Consequences') {
                display.textContent = 'Consequences';
                display.style.fontSize = '28px';
                return;
            }

            display.style.fontSize = '';
            display.textContent = formatForDisplay(r);
            currentNumber = r;
            lastOperation = previousOperation;
            lastOperand = b;
        }

        previousOperation = t;
        awaitingNextNumber = true;
        resetNumberLimit(btns);
        return;
    }

    if (previousOperation !== null) {
        const b = awaitingNextNumber ? (lastOperand ?? currentNumber) : Number(display.textContent);
        const r = operate(previousOperation, currentNumber, b);

        if (r === 'Consequences') { // Handling result
        display.textContent = 'Consequences';
        display.style.fontSize = '28px';
        return;
        }

        display.style.fontSize = '';
        display.textContent = formatForDisplay(r);

        currentNumber = r;
        lastOperation = previousOperation;
        lastOperand = b;
        previousOperation = null;

        awaitingNextNumber = true;
        resetNumberLimit(btns);
        return;
    }

    if (lastOperation !== null && typeof currentNumber === 'number' && typeof lastOperand === 'number') {
        const r = operate(lastOperation, currentNumber, lastOperand);

        if (r === 'Consequences') {
        display.textContent = 'Consequences';
        display.style.fontSize = '28px';
        return;
        }

        display.style.fontSize = '';
        display.textContent = formatForDisplay(r);
        currentNumber = r;

        awaitingNextNumber = true;
        return;
    }

    currentNumber = Number(display.textContent);
    awaitingNextNumber = true;
    });

    btn.addEventListener('mousedown', () => {
    btn.style.backgroundColor = '#177fd4';
    btn.style.borderRadius = '4px';
    });
    btn.addEventListener('mouseup', () => {
    btn.style.backgroundColor = '';
    });
});





// If two operations are clicked back to back, a bug occurs. (contributes to equal sign bug)
// Does not handle negative number input
// No backspace button
// No keyboard support