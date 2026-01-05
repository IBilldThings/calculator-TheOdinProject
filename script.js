function add(a , b){
    const aDecimal = String(a).includes('.') ? String(a).split('.')[1].length : 0;
    const bDecimal = String(b).includes('.') ? String(b).split('.')[1].length : 0;

    const scale = 10 ** Math.max(aDecimal, bDecimal);
    return (a * scale + b * scale) / scale;
};

function subtract(a , b){
    return a - b;
};

function multiply(a , b){
    return a * b;
};

function divide(a , b){
    if (a === 0 && b === 0){
        return 'Consequences';
    }
    // If length greater than 10, grab length, round until only 10 digits are left on screen
    return a / b;
};

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
                display.textContent = nextNumber;
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
// Doesn't handle long decimals yet
// Does not handle very large numbers that are added / multiplied yet (they break through display)
// No backspace button
// No keyboard support