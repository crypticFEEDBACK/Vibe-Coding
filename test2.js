
function calculateSum() {

    const number1 = Number(
        document.getElementById("num1").value
    );

    const number2 = Number(
        document.getElementById("num2").value
    );

    const result = number1 + number2;

    document.getElementById("result").textContent =
        "Result: " + result;

}

document.getElementById("calculate")
    .addEventListener("click", calculateSum);


