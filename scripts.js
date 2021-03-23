
const Player = (name, number) => {
    return {name, number}
}


const player1 = Player('Rob', 1);
const player2 = Player('Ana', 2);


const GameBoard = (() => {

    let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    const modBoard = (board, index, player) => {
        board[index] = player.number;
    };

    return {board, modBoard}
})();


const GameFlow = (() => {
    
    let activePlayer = player1;

    const changeActivePlayer = () => {
        if (GameFlow.activePlayer === player1) {
            GameFlow.activePlayer = player2;
        } else {
            GameFlow.activePlayer = player1;
        } 
    }

    const endCheck = () => {
        winPos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4 ,8], [6, 4, 2]]
        for (i = 0; i < 8; i++) {
            let pos0 = winPos[i][0];
            let pos1 = winPos[i][1];
            let pos2 = winPos[i][2];
            if (GameBoard.board[pos0] === GameBoard.board[pos1] && GameBoard.board[pos0] === GameBoard.board[pos2] && GameBoard.board[pos0] !== 0 && GameBoard.board[pos0] !== 0 && GameBoard.board[pos0] !== 0) {
                console.log('win')
            }
        }
    }

    const play = (index) => {
        GameBoard.modBoard(GameBoard.board, index, GameFlow.activePlayer)

        GameFlow.endCheck()

        GameFlow.changeActivePlayer()
    };

    return {activePlayer, changeActivePlayer, play, endCheck}

})();


const DisplayControler = (() => {

    const HTMLboard = document.querySelectorAll('.row > .col');
    
    const render = () => {
        // recibe el tablero y muestra los simbolos adecuados en pantalla
        let symbol;
        HTMLboard.forEach((element, index) => {
            if (GameBoard.board[index] === 0) {
                symbol = '-';
            } else if (GameBoard.board[index] === 1) {
                symbol = 'x';
            } else if (GameBoard.board[index] === 2) {
                symbol = 'o';
            }
            element.textContent = symbol;
        });
    };
    

    const clickBoard = () => {
        // genera los event listener para clicks en el tablero y llama al game
        // flow avisando
        HTMLboard.forEach((element, index) => {
            
            element.addEventListener('click', ticTacClick);
            
            function ticTacClick(e) {
                GameFlow.play(e['path'][0]['id']);
                render();
                element.removeEventListener('click', ticTacClick);
            }
        });
        
        
    }

    return {render, clickBoard}

})();


DisplayControler.render(GameBoard.board)
DisplayControler.clickBoard()
