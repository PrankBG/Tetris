const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button')
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;
const colors = [
    'colors/orange.png',
    'colors/red.png',
    'colors/purple.png',
    'colors/green.png',
    'colors/blue.png',
    'colors/red.png',
    'colors/orange.png'
];
const colors2 = [
    'orange',
    'red',
    'purple',
    'green',
    'blue',
    'red',
    'orange'
];


//The tetrominoes
const lTetrimino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
];

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
];

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
];

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
];

const zTetrominoMirror = [
    [1, width, width+1, width*2],
    [0, 1, width+1, width+2],
    [1, width, width+1, width*2],
    [0, 1, width+1, width+2]
];

const lTetrominoMirror = [
    [0, 1, width+1, width*2+1],
    [2, width, width+1, width+2],
    [0, width, width*2, width*2+1],
    [0, 1, 2, width]
];

const theTetrominoes = [
    lTetrimino, 
    zTetromino, 
    tTetromino, 
    oTetromino, 
    iTetromino, 
    zTetrominoMirror, 
    lTetrominoMirror
];


let currentPosition = 4;
let currentRotation = 0;

//randomly selected Tetromino and its first rotation
let random = Math.floor(Math.random()*theTetrominoes.length);


let current = theTetrominoes[random][currentRotation];

//draw the Tetromino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundImage = "url('" + colors[random] + "')";
        squares[currentPosition + index].style.backgroundSize = 'contain';
        squares[currentPosition + index].style.opacity = '100%';
    });
    
}

//undraw the Tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundImage = '';
        squares[currentPosition + index].style.opacity = '50%';
    });
}

//assign function to keyCodes
function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    }
    else if (e.keyCode === 38) {
        rotate()
    }
    else if (e.keyCode === 39) {
        moveRight()
    }
    else if (e.keyCode === 40) {
        moveDown()
    }
  }
  document.addEventListener('keydown', control);

//move down function
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    setTimeout (() => {
        freeze();
    }, 500);
}

//freeze function
function freeze() {
    if (current.some(index => squares[currentPosition + index + width]. classList.contains('taken'))) {
       current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        //start a new tetromino falling
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
         addScore();
         gameOver();
         draw();
         displayShape();
    }
}

//move the tetromino left, unless is at the edge or there is blockage
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) {
        currentPosition -=1;
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1;
    }
    
    draw();
  }

//move the tetromino right, unless is at the edge or there is another blockage
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition +index) % width === width - 1)

    if (!isAtRightEdge) {
        currentPosition += 1;
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }

    draw();
}

//rotate the tetromino
function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) { // if the currentRotation gets to 4, make it go back to 0
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

//show up-next tetromino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
const displayIndex = 0;

//the Tetraminoes without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //iTetromino
    [1, displayWidth, displayWidth+1, displayWidth*2], //ztetrominoMirror
    [0, 1, displayWidth+1, displayWidth*2+1] //ltetrominoMirror
];

//display the shape in the mini-grid display
function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundImage = '';
      square.style.border = 'none';
    });
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundImage = "url('" + colors[nextRandom] + "')";
      displaySquares[displayIndex + index].style.backgroundSize = 'contain';
      displaySquares[displayIndex + index].style.border = 'solid 0.1px white';
      console.log(colors[nextRandom]);
    });
  }

//add functionality to the button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } 
    else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }
});

//add score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundImage = '';
                squares[index].style.opacity = '50%';
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

//game over
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
    }
}