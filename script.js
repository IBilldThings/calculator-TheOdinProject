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
    // If length greater than 10, grab length, round until only 10 digits are left on screen
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
    console.log(operator, a, b);
    if (!Number.isFinite(a) || !Number.isFinite(b)){
        console.log('No previous Number');
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
        if (!numberBtn.classList.contains('decimal') && numberBtn.classList.contains('number')){
            numberBtn.style.backgroundColor = 'black';
            numberBtn.style.color = 'white';
        }
    });
}

function resetNumberLimit(btns){ // Resets display limit of calculator
    btns.forEach(numberBtn =>{
        if (!numberBtn.classList.contains('decimal') && numberBtn.classList.contains('number')){
            numberBtn.style.backgroundColor = '';
            numberBtn.style.color = '';
        }
    });
}

const btns = document.querySelectorAll('button');
const display = document.querySelector("#display");
let previousBtnText = 'start';
let previousNumber = null;
let currentNumber = '';
let nextNumber = null;
let previousOperation = null;

btns.forEach(btn =>{
    btn.addEventListener('click', (checkButton) => {

        // Clear button functionality
        if (btn.textContent === 'AC'){
            display.textContent = '0';
            display.style.fontSize = '';
            resetNumberLimit(btns);
            previousBtnText = 'start';
            previousNumber = null;
            previousOperation = null;
            currentNumber = '';
            nextNumber = null;
            return 'Cleared';
        }

        // Decimal handling
        if (btn.classList.contains('decimal')){
            if (display.textContent.includes('.')){
                return 'Decimal disabled';
            } else {
                display.textContent += String(btn.textContent);
            }
        }

        // Procedure for if button was a number
        if (btn.classList.contains('number') && previousBtnText != 'start'){
            if (display.textContent.length === 10){ // Display limit reached
                numberLimit(btns);
                console.log('limit');
                return 'limit';
            }
            display.textContent += String(btn.textContent);
        }
        
        // Procedure for the first button
        if (previousBtnText === 'start' && !btn.classList.contains('operation')){
            display.textContent = String(btn.textContent);
            previousBtnText = String(btn.textContent);
        }

        // Procedure for operation buttons
        if (btn.classList.contains('operation')){
            previousNumber = Number(display.textContent);

            if (previousOperation === null){
                previousOperation = btn.textContent;
            }

            nextNumber = operate(previousOperation, currentNumber, previousNumber);

            if (nextNumber === 'Consequences'){ // Divide 0 by 0
                display.textContent = 'Consequences';
                display.style.fontSize = '28px';
                return 'Consequences';
            }

            if (typeof nextNumber === 'number'){
                display.textContent = formatForDisplay(nextNumber);
                currentNumber = nextNumber;
                previousOperation === null;
            } else {
                currentNumber = Number(display.textContent);
            }

            resetNumberLimit(btns);
            previousBtnText = 'start';
        }

    });

    // Button responsiveness
    btn.addEventListener('mousedown', (responsiveClick) => {
        btn.style.backgroundColor = '#177fd4';
        btn.style.borderRadius = '4px';
    });
    btn.addEventListener('mouseup', (responsiveRelease) => {
        btn.style.backgroundColor = '';
    });
});

// If two operations are clicked back to back, a bug occurs. (contributes to equal sign bug)
// Does not handle negative number input
// No backspace button
// No keyboard support