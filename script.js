

const board = (() => {
    let _squares = Array.from(document.querySelectorAll('.square'))
    const _board = []

    for (let k = 0; k<9; k++){ //initialize the board array and the data keys for the dom
        _board.push({key:k, value:undefined})
        _squares[k].dataset.key = k
    }

    const updateBoard = (key, value) => {
        _squares = Array.from(document.querySelectorAll('.square'))
        _board.forEach(x => x.key == key ? x.value = value : null)
        _squares.forEach(x => x.textContent = (x.dataset.key == key ? value : x.textContent))
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

    const resetBoard = (e) => {
        _squares = Array.from(document.querySelectorAll('.square'))
        for (let k = 0; k<9; k++){ //initialize the board array and the data keys for the dom
            _board[k] = {key:k, value:undefined}
            _squares[k].dataset.key = k
            _squares[k].textContent = ''
        }
        gameHandler.match()
    }

    const test = () =>{
        _board[0].key += 1
        console.log(_board[0].key)
    }
    return {test, checkForResult, updateBoard, resetBoard}
})()

const updateDisplay = (() => {
    const _result = document.createElement('h1');
    const _container = document.querySelector('.container')
    const pve = document.querySelector('.pve')
    const pvp = document.querySelector('.pvp')
    const init = document.querySelector('.init')
    const toShow = Array.from(document.querySelectorAll('.to-show'))
    
    const showResult = (toDisplay) => { 
        const toShow = Array.from(document.querySelectorAll('.to-show'))
        toShow.forEach(x => x.classList.add('hidden'))
        _result.textContent = toDisplay 
        _container.appendChild(_result)
        const _restartButton = document.createElement('button')
        _restartButton.textContent = 'Another match ?'
        _container.appendChild(_restartButton)
        _restartButton.addEventListener('click', (e) => location.reload())
    }

    const _startPVP = () => {
        init.classList.add('hidden')
        toShow.forEach(x => x.classList.remove('hidden'))
        start('pvp')
    }
    const _startPVE = () => {
        init.classList.add('hidden')
        toShow.forEach(x => x.classList.remove('hidden'))
        start('pve')
    }
    const initialize = () => {
        pvp.addEventListener('click', _startPVP)
        pve.addEventListener('click', _startPVE)
        console.log('ok')
    }
    
    return {
        showResult, initialize
    }
})()

const Player = (isHuman, value) => {
    let _squares = Array.from(document.querySelectorAll('.square'))
    let played = false;
    const play = (player) => { 
        _squares = Array.from(document.querySelectorAll('.square')) //update the value bcause of the cloning
        if (isHuman) { //listens for the player's choice
            _squares.forEach(x => {
                x.textContent === '' ? x.addEventListener('click',(e) =>_handleClick(e, player)) : null 
            })
        } else { //makes a random choice if the opponent is an AI
            const availableSquare = []
            _squares.forEach(x => x.textContent === '' ? availableSquare.push(x.dataset.key) : null)
            const key = availableSquare[Math.floor(Math.random()*availableSquare.length)]
            board.updateBoard(key, value)
            player.played = true
            gameHandler.nextPlay()
        }
        
    }

    const test = (x) => {
        return () => x*2
    }

    const _handleClick = (e, player) =>{ //adds the player's choice and remove the event listeners until the next turn
            board.updateBoard(e.target.dataset.key, value)
            _squares.forEach(x => x.replaceWith(x.cloneNode(true)))
            player.played = true
            gameHandler.nextPlay()
        
    }

    return {
        play, played, test
    }
}

let clicked = true

const gameHandler = ((hvh) => { //hvh is human v human, false in case of human v ai, true otherwise
    let _squares = Array.from(document.querySelectorAll('.square'))

    const match = () => {
        _squares = Array.from(document.querySelectorAll('.square'))
        const result = board.checkForResult()
        if (result === undefined){
            _player1.play(_player1)
        } else{
            if (result === false) {
                updateDisplay.showResult('Draw')
            }
            else {
                let xCounter = _squares.filter(x=>x.textContent == 'X').length
                let oCounter = _squares.filter(x=>x.textContent == 'O').length //counting xs and os to determine who was the last to play
                console.log({xCounter, oCounter})
                toDisplay = xCounter > oCounter ? 'X wins' : 'O wins'
                updateDisplay.showResult(toDisplay) 
            }
        }
    }

    const nextPlay = (id) => {
        if (_player1.played && !_player2.played) {
            board.checkForResult() === undefined ? _player2.play(_player2) : match()
        }
        if (_player1.played && _player2.played){
            _player1.played = false
            _player2.played = false
            match()
        }
    }

    return {
        match, nextPlay
    }

})();

let _player1 = null
let _player2 = null
const start = (t) => {
    if (t == 'pvp') {
        _player1 = Player(true, 'X');
        _player2 = Player(true, 'O');
        gameHandler.match()
    } else {
        _player1 = Player(true, 'X');
        _player2 = Player(false, 'O');
        gameHandler.match()
    }
}

updateDisplay.initialize()
const resetBtn = document.querySelector('.reset')
const changeContestants = document.querySelector('.change-player')
changeContestants.addEventListener('click', (e) => location.reload())
resetBtn.addEventListener('click', (e) => board.resetBoard())