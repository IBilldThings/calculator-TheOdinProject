const operations = '+-x/=';

function add(a , b){
    return a + b;
};

function subtract(a , b){
    return a - b;
};

function multiply(a , b){
    return a * b;
};

function divide(a , b){
    return a / b;
};

function numberLimit(btns){ // Limitation for the display of calculator
    btns.forEach(numberBtn =>{
        if (!numberBtn.classList.contains('number operation decimal') && numberBtn.classList.contains('number')){
            numberBtn.style.backgroundColor = 'black';
            numberBtn.style.color = 'white';
        }
    });
}

function resetNumberLimit(btns){ // Resets display limit of calculator
    btns.forEach(numberBtn =>{
        if (!numberBtn.classList.contains('number operation decimal') && numberBtn.classList.contains('number')){
            numberBtn.style.backgroundColor = '';
            numberBtn.style.color = '';
        }
    });
}

const btns = document.querySelectorAll('button');
const display = document.querySelector("#display");
let previousBtnText = 'start';
let currentNumber = '';

btns.forEach(btn =>{
    btn.addEventListener('click', (checkButton) => {

        if (btn.textContent === 'Clear'){ // Clear button functionality
            display.textContent = '0';
            resetNumberLimit(btns);
            previousBtnText = 'start';
            return 'Cleared';
        }

        if (btn.classList.contains('number') && previousBtnText != 'start'){ // Procedure for if button was a number
            if (display.textContent.length === 10){ // Display limit reached
                numberLimit(btns);
                console.log('limit');
                return 'limit';
            }
            display.textContent += String(btn.textContent);
        }
        
        if (previousBtnText === 'start' && !btn.classList.contains('operation')){ // Procedure for the first button
            display.textContent = String(btn.textContent);
            previousBtnText = String(btn.textContent);
        }

        if (btn.classList.contains('operation')){ // Procedure for operation buttons
            display.textContent = '0';
            resetNumberLimit(btns);
            previousBtnText = 'start';
        }

        currentNumber = display.textContent;
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

// Update display based on the click of number