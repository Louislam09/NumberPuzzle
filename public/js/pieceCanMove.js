let Array1 = [1, 2, 3]
let Array2 = [4, 5, 6]
let Array3 = [7, 8, 9]

let firstDiagonal = [];
let secondDiagonal = [];

function checkDiagonal(Array1, Array2, Array3) {
    for (let d = 0; d < 3; d++) {
        if (d === 0) {
            firstDiagonal[d] = Array1[d];
        } else if (d === 1) {
            firstDiagonal[d] = Array2[d];
        } else {
            firstDiagonal[d] = Array3[d];
        }
    }
    for (let d = 2; d > -1; d--) {
        if (d === 2) {
            secondDiagonal[d] = Array1[d];
        } else if (d === 1) {
            secondDiagonal[d] = Array2[d];
        } else {
            secondDiagonal[d] = Array3[d];
        }
    }

    let firstDiagonalResult = firstDiagonal.reduce((a, b) => a + b);
    let secondDiagonalResult = secondDiagonal.reduce((a, b) => a + b);

    let absValue = Math.abs(firstDiagonalResult - secondDiagonalResult);
    return absValue;

}

console.log(checkDiagonal(a, b, c))
