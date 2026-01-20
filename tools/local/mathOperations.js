async function mathOperations({ operator, number1, number2 }) {
    let wynik 
    
    switch (operator) {
        case '+':
            wynik = { wynik: number1+number2 }
            break;
        case '-':
            wynik = { wynik: number1-number2}
            break;
        case '*':
            wynik = {wynik: number1* number2}
            break;
        case '/':
            wynik = {wynik: number1 / number2}
            break;
        case '%':
            wynik = {wynik: number1 % number2}
            break

    }
    

    return wynik
     
}

export { mathOperations }