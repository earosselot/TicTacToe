
const Player = (name, number) => {
    return {name, number}
}


const player1 = Player('Rob', 1);
const player2 = Player('Ana', 2);


const GameBoard = (() => {

    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const modBoard = (index) => {
        GameBoard.board[index] = GameFlow.activePlayer.number;
    };

    return {board, modBoard}
})();


const GameFlow = (() => {
    
    let activePlayer = player1;
    let winner = null;

    const changeActivePlayer = () => {
        if (GameFlow.activePlayer === player1) {
            GameFlow.activePlayer = player2;
        } else {
            GameFlow.activePlayer = player1;
        } 
    }

    const endCheck = () => {
        // let winner = null;
        winPos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4 ,8], [6, 4, 2]];
        for (i = 0; i < 8; i++) {
            let pos0 = winPos[i][0];
            let pos1 = winPos[i][1];
            let pos2 = winPos[i][2];
            let win = GameBoard.board[pos0] === GameBoard.board[pos1] && GameBoard.board[pos0] === GameBoard.board[pos2] && GameBoard.board[pos0] !== 0;
            if (win) {
                console.log('win');
                GameFlow.winner = GameFlow.activePlayer;
                console.log(GameFlow.winner.name);
                DisplayControler.disableClick();
                DisplayControler.displayResult();
            }
        }
        if (!GameBoard.board.includes(0) && !winner)  {
            console.log('tie');
            DisplayControler.displayResult();
        }
    }

    const play = (index) => {
        GameBoard.modBoard(index);
        GameFlow.endCheck();
        GameFlow.changeActivePlayer();
    };

    return {activePlayer, winner, changeActivePlayer, play, endCheck}

})();


const DisplayControler = (() => {

    const HTMLboard = document.querySelectorAll('.row > .col');
    const HTMLresult = document.getElementById('result');
    
    const render = () => {
        // recibe el tablero y muestra los simbolos adecuados en pantalla
        let symbol;
        let symbol_class;
        HTMLboard.forEach((element, index) => {
            if (GameBoard.board[index] === 0) {
                symbol = '';
                symbol_class = 'None'
            } else if (GameBoard.board[index] === 1) {
                symbol = 'X';
                symbol_class = 'cross';
            } else if (GameBoard.board[index] === 2) {
                symbol = 'O';
                symbol_class = 'circle';
            }
            element.textContent = symbol;
            element.classList.add(symbol_class);
        });
    };
    

    function ticTacClick(e) {
        GameFlow.play(e['path'][0]['id']);
        render();
        this.removeEventListener('click', ticTacClick);
    }


    const clickBoard = () => {
        // genera los event listener para clicks en el tablero y llama al game
        // flow avisando
        HTMLboard.forEach((element) => {   
            element.addEventListener('click', ticTacClick);
        }); 
    }


    const disableClick = () => {
        HTMLboard.forEach((element) => {
            element.removeEventListener('click', ticTacClick);
            render();
        }); 
    }


    const displayResult = () => {
        if (GameFlow.winner) {
            HTMLresult.textContent = `Congratullations ${GameFlow.winner.name}! You win!`;
        } else {
            HTMLresult.textContent = 'Tie!';
        }
    }

    return {render, clickBoard, disableClick, displayResult}

})();


DisplayControler.render(GameBoard.board);
DisplayControler.clickBoard();
