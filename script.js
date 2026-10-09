const display=document.querySelector('#display');
const historyDisplay=document.querySelector('#history');
const buttonContainer=document.querySelector('.button-container');

const operator =['+','-','*','/'];

function appendValue(input){
    if(display.value==="error"){
        display.value="";
    }
    const lastChar=display.value.slice(-1);
    if(display.value==="" && (input==='*'|| input==='/'||input==='.')){
        if(input==='.') display.value='0';
        return;
    }
    if(operator.includes(lastChar)&&operator.includes(input)){
        display.value=display.value.slice(0,-1)+input;
        return;
    }
    if(input=='.'){
        const parts=display.value.split(/[\+|-|*|/]/);
        const currentSegment=parts[parts.length-1];
        if(currentSegment.includes('.')) return;
    }
    display.value+=input;
}
function clearDisplay(){
    display.value='';
    historyDisplay.textContent='';
}
function deleteLast(){
    if(display.value==="Error"){
        display.value="";
        return;
    }
    display.value=display.value.slice(0,-1);
}

function calculate() {
    if (!display.value || display.value === "Error") return;

    const expression = display.value;

    try {
        const result = new Function(`return ${expression}`)();

        if (Number.isFinite(result)) {
            // History me pura equation dikhayein
            historyDisplay.textContent = `${expression} =`;
            // Long decimals ko 6 decimal points tak limit karein
            display.value = Number(result.toFixed(6)).toString();
        } else {
            display.value = "Error";
        }
    } catch (err) {
        display.value = "Error";
    }
}

buttonContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.classList.contains('button')) return;

    const val = target.getAttribute('data-val');
    const action = target.getAttribute('data-action');

    if (val !== null) {
        appendValue(val);
    } else if (action === 'clear') {
        clearDisplay();
    } else if (action === 'delete') {
        deleteLast();
    } else if (action === 'calculate') {
        calculate();
    }
});

// --- 2. Keyboard Support ---
window.addEventListener('keydown', (event) => {
    const key = event.key;

    // Browser console me check karne ke liye ki konsi key dab rahi hai:
    console.log("Pressed key:", key);

    // Numbers aur Basic Operators (+, -, *, /)
    if ((key >= '0' && key <= '9') || ['+', '-', '*', '/'].includes(key) || key === '.') {
        event.preventDefault(); // Default typing block karein taaki double input na ho
        appendValue(key);
    }
    // Enter ya '=' dabane par calculate ho
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Backspace dabane par DEL ho
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
    // Escape ya 'c' / 'C' dabane par Clear ho
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        event.preventDefault();
        clearDisplay();
    }
});