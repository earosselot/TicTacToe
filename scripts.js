

const Player = (name, number) => {
    return {name, number}
}


if (localStorage.getItem('player1')) {
    let player1 = JSON.parse(localStorage.getItem('player1'));
    let player2 = JSON.parse(localStorage.getItem('player2'));
} else {
    let player1 = Player('Player1', 1);
    localStorage.setItem('player1', JSON.stringify(player1));
    let player2 = Player('Player2', 2);
    localStorage.setItem('player2', JSON.stringify(player2));
}


let player1 = JSON.parse(localStorage.getItem('player1'));
let player2 = JSON.parse(localStorage.getItem('player2'));


const GameBoard = (() => {

    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const modBoard = (index) => {
        // Modifies the game board in the index position with the active Player
        GameBoard.board[index] = GameFlow.activePlayer.number;
    };

    const reset = () => {
        GameBoard.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    return {board, modBoard, reset}
})();


const GameFlow = (() => {
    
    let activePlayer = player1;
    let winner = null;

    const changeActivePlayer = () => {
        if (GameFlow.activePlayer === player1) {
            GameFlow.activePlayer = player2;
        } else {
            GameFlow.activePlayer = player1;   
        };
        DisplayControler.changePlayerArrow();
    };

    const endCheck = () => {
        // Win Check
        winPos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4 ,8], [6, 4, 2]];
        for (i = 0; i < 8; i++) {
            let pos0 = winPos[i][0];
            let pos1 = winPos[i][1];
            let pos2 = winPos[i][2];
            let win = GameBoard.board[pos0] === GameBoard.board[pos1] && GameBoard.board[pos0] === GameBoard.board[pos2] && GameBoard.board[pos0] !== 0;
            if (win) {
                // Here it changesActivePlayer because the endCheck if after the changeActivePlayer on play method.
                // Otherwise there are problems with rendering to the web the result
                GameFlow.changeActivePlayer();
                GameFlow.winner = GameFlow.activePlayer;
                DisplayControler.disableClick();
                DisplayControler.displayResult();
            };
        };

        // Tie Check
        if (!GameBoard.board.includes(0) && !winner)  {
            console.log('tie');
            DisplayControler.displayResult();
        }
    };

    const play = (index) => {
        // Modifies the board, changes the activePlayer and chek for win or tie
        GameBoard.modBoard(index);
        GameFlow.changeActivePlayer()
        GameFlow.endCheck();
        ;
    };

    const reset = () => {
        // Reset everything. It called when Reset Game button is clicked
        GameBoard.reset();
        GameFlow.activePlayer = player1;
        winner = null;
        DisplayControler.render();
        DisplayControler.clickBoard();
        DisplayControler.resetResults();
    };

    return {activePlayer, winner, changeActivePlayer, play, endCheck, reset}

})();


const DisplayControler = (() => {

    const HTMLboard = document.querySelectorAll('#board > .row > .col');
    const HTMLplayer1Name = document.getElementById('player1-card-title');
    const HTMLplayer2Name = document.getElementById('player2-card-title');
    const HTMLplayer1Card = document.getElementById('player1-card');
    const HTMLplayer2Card = document.getElementById('player2-card');
    const HTMLplayer1CardText = document.getElementById('player1-card-text');
    const HTMLplayer2CardText = document.getElementById('player2-card-text');

    const render = () => {
        // Gets the board and put it in the HTML file with symbols and colors (or nothing)
        let symbol;
        HTMLboard.forEach((element, index) => {
            if (GameBoard.board[index] === 0) {
                symbol = '';
                element.classList.add('tile');
            } else if (GameBoard.board[index] === 1) {
                symbol = 'X';
                element.style.color = "rgb(211, 106, 106)";
            } else if (GameBoard.board[index] === 2) {
                symbol = 'O';
                element.style.color = "rgb(102, 102, 226)";  
            };
            element.textContent = symbol;          
        });
    };
    

    function ticTacClick(e) {
        // Gets the id of the clicked cell in the web page. Then plays and render.
        GameFlow.play(e['path'][0]['id']);
        render();
        this.removeEventListener('click', ticTacClick);
    };


    const clickBoard = () => {
        // Add click event listeners for the board boxes.
        HTMLboard.forEach((element) => {   
            element.addEventListener('click', ticTacClick);
        }); 
    };


    const disableClick = () => {
        // Add an event listener for click which removes the previous one. For lock
        // the box once clicked.
        HTMLboard.forEach((element) => {
            element.removeEventListener('click', ticTacClick);
            render();
        }); 
    };

    const displayPlayers = () => {
        // Puts in the webpage the player names and symbol
        HTMLplayer1Name.innerHTML = `<strong>${player1.name} - X</strong>`;
        HTMLplayer2Name.innerHTML = `<strong>${player2.name} - O</strong>`;
    };

    const displayResult = () => {
        // Show the result by changing card bg colors and shows a text
        if (GameFlow.winner === player1) {
            HTMLplayer1Card.classList.add('winner');
            HTMLplayer2Card.classList.add('looser');
            HTMLplayer1CardText.textContent = 'Winner';
            HTMLplayer2CardText.textContent = 'Loser';
        } else if (GameFlow.winner === player2){
            HTMLplayer2Card.classList.add('winner');
            HTMLplayer1Card.classList.add('looser');
            HTMLplayer2CardText.textContent = 'Winner';
            HTMLplayer1CardText.textContent = 'Loser';
        } else {
            HTMLplayer1Card.classList.add('tie');
            HTMLplayer2Card.classList.add('tie');
            HTMLplayer1CardText.textContent = 'Tie';
            HTMLplayer2CardText.textContent = 'Tie';
        }
    };

    const resetResults = () => {
        // Reset the layout colors and text
        HTMLplayer1Card.className = 'card text-center bg-light mb-3';
        HTMLplayer2Card.className = 'card text-center bg-light mb-3';
        HTMLplayer1CardText.innerHTML = '&#8593;';
        HTMLplayer2CardText.innerHTML = '';
    }

    const changePlayerArrow = () => {
        // Rotates activePlayer Arrow
        if (HTMLplayer1CardText.innerHTML) {
            HTMLplayer2CardText.innerHTML = '<strong>&#8593;</strong>';
            HTMLplayer1CardText.innerHTML = '';
        } else {
            HTMLplayer1CardText.innerHTML = '<strong>&#8593;</strong>';
            HTMLplayer2CardText.innerHTML = '';
        }
    }

    return {render, clickBoard, disableClick, displayPlayers, displayResult, resetResults, changePlayerArrow}

})();


// Renders the game for the first time and allow for start playing
DisplayControler.render(GameBoard.board);
DisplayControler.clickBoard();
DisplayControler.displayPlayers();


// Name Change handling. Players will be stored on navegator localStorage.
const PlayerForm = document.forms['players'];
function createPlayers() {
    let player1 = Player(PlayerForm.elements['player1-name'].value, 1);
    let player2 = Player(PlayerForm.elements['player2-name'].value, 2);
    localStorage.setItem('player1', JSON.stringify(player1));
    localStorage.setItem('player2', JSON.stringify(player2));
    DisplayControler.displayPlayers();
};
PlayerForm.addEventListener('submit', createPlayers);


// Reset handling
const ResetButton = document.querySelector('#reset-game');
function ResetGame() {
    GameFlow.reset();
};
ResetButton.addEventListener('click', ResetGame);


