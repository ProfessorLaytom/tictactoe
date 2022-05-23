const board = (() => {
    const _squares = Array.from(document.querySelectorAll('.square'))
    const _board = []
    for (let k = 0; k<9; k++){ //initialize the board array and the data keys for the dom
        _board.push({key:k, value:undefined})
        _squares[k].dataset.key = k
    }

    const updateBoard = (key, value) => {
        _board.forEach(x => x.key == key ? x.value = value : null)
        _squares.forEach(x => x.textContent = x.dataset.key == key ? value: x.textContent)
        return null
    }

    const checkForResult = () =>{ //returns true there is a winner, false if draw and undefined if none of the above
        for (let k = 0; k <= 2; k++){
            if (_board[k*3].value !== undefined && _board[k*3].value === _board[k*3+1].value && _board[k*3].value === _board[k*3+2].value) { //check the rows for win
                return true
            }
            if (_board[k].value !== undefined && _board[k].value === _board[k+3].value && _board[k].value === _board[k+6].value){ //checks the columns
                return true
            }
        }
        if (_board[0].value !== undefined && _board[0].value === _board[4].value && _board[0].value === _board[8].value) { //checks for diagonals
            return true
        }
        if (_board[2].value !== undefined && _board[2].value === _board[4].value && _board[2].value === _board[6].value) {
            return true
        }
        for (let x of _board) { //checks for draw by checking if there are still empty squares
            if (x.value === undefined) {
                return undefined //there is no win nor draw
            }
        }
        return false //none of the above, its a draw
    }

    const test = () =>{
        _board[0].key += 1
        console.log(_board[0].key)
    }
    return {test, checkForResult, updateBoard}
})()

const updateDisplay = (() => {
    const _result = document.createElement('h1');
    const _container = document.querySelector('.container')

    const showResult = (result, _whichTurn) => {
        _result.textContent = result + '' + !_whichTurn
        _container.appendChild(_result)
    }
    return {
        showResult,
    }
})()

const Player = (isHuman, value) => {
    const _squares = Array.from(document.querySelectorAll('.square'))
    const play = () => { 
        if (isHuman) { //listens for the player's choice
            _squares.forEach(x => {
                x.textContent === '' ? x.addEventListener('click',_handleClick) : null 
            })
        } else { //makes a random choice if the opponent is an AI
            const availableSquare = []
            _squares.forEach(x => x.textContent === '' ? availableSquare.push(x.dataset.key) : null)
            const key = availableSquare[Math.floor(Math.random()*availableSquare.length)]
            board.updateBoard(key, value)
        }
    }

    const _handleClick = (e) => { //adds the player's choice and remove the event listeners until the next turn
        board.updateBoard(e.target.dataset.key, value)
        _squares.forEach(x => x.removeEventListener('click',_handleClick))
    } 

    return {
        play,
    }
}

const gameHandler = ((hvh) => { //hvh is human v human, false in case of human v ai, true otherwise
    const _player1 = Player(false, 'X');
    const _player2 = Player(false, 'O')
    let _whichTurn = true // true if it's player1's turn, false otherwise
    let result = undefined
    while (result === undefined) {
        _whichTurn ? _player1.play() : _player2.play()
        _whichTurn = !_whichTurn
        result = board.checkForResult();
    }
    updateDisplay.showResult(result, _whichTurn)

})();