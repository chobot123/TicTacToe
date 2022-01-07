const gameBoard = (function(){
    const _wrapper = document.querySelector(".wrapper");
    //player factory
    const Player = (decision, marker, turn, winner) => {
        return{
            decision,
            marker,
            turn,
            winner
        }
    }


    //player objects
    let playerOne = Player([], "O", true, false);
    let playerTwo = Player([], "X", false, false);

    //a private grid size static
    const _gridSize = Array(9);

    //ALL win combinations
    const winCombo = 
    [
        [0,1,2],    
        [3,4,5], 
        [6,7,8],
        [0,3,6], 
        [1,4,7], 
        [2,5,8],
        [0,4,8], 
        [2,4,6]
    ];

    //grid variable 
    const grid = document.createElement("div");
    grid.className = "grid";
    _wrapper.appendChild(grid);

    //make 3x3 grid
    function makeGrid(grid) {
        grid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr)";
        grid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr)";
        for(let i = 0; i < _gridSize.length; i++){
            let cell = document.createElement("div");
            cell.className = `cell`;
            cell.classList.add(i);
            cell.innerText = i;
            grid.appendChild(cell);
        }
    }
    makeGrid(grid);

    return {
        playerOne,
        playerTwo,
        winCombo,
        grid,
    }


})();

const playGame = (function(){
    
    /*
        To play the game we need:
            2 players
            'referee' object
            winning combinations
    */
    const grid = gameBoard.grid;
    const playerOne = gameBoard.playerOne; //[], O, TRUE 
    const playerTwo = gameBoard.playerTwo; //[], X, FALSE
    const winCombo = gameBoard.winCombo;
    //referee factory
    const Referee = (turnCount, gameOver, winner) => {
        return {
            turnCount,
            gameOver,
        }
    }

    //referee object
    const gameRef = Referee(0, false, "");

    function takeTurn (){
        for(let i = 0; i< grid.children.length;i++){
            grid.children[i].addEventListener("click", updateTurn);
        }
    }

    let updateTurn = (e) => {
        //find whose turn it is
        //apply the click
        //update 'decision' in player variable
        //go next turn
        //count of total turns goes up
        let cell = e.target;
        let playerOneTurn = playerOne.turn;
        console.log(playerOneTurn)
        if(playerOneTurn === true){
            if(cell.innerText !== "X" && cell.innerText !== "O"){
                cell.innerText = "O";
                playerOne.decision.push(e.target.className.substring(5));
                playerOne.turn = false;
                playerTwo.turn = true;
                gameRef.turnCount++;
            }
        }
        else if(playerOneTurn === false){
            if(cell.innerText !== "X" && cell.innerText !== "O"){
                cell.innerText = "X";
                playerTwo.decision.push(e.target.className.substring(5));
                playerTwo.turn = false;
                playerOne.turn = true;
                gameRef.turnCount++;
            }
        }
        //check if anyone won
        if(gameRef.turnCount > 4){
            console.log(gameRef.turnCount)
            checkScore(playerOne);
            checkScore(playerTwo);
        }
    }
        //use winCombo
    let checkScore = (player) => {
        let count = 0;
        for(let i = 0; i < winCombo.length; i++){
            for(let j = 0; j < winCombo[i].length; j++){
                for(let k = 0; k < player.decision.length; k++){
                    if(player.decision[k] == winCombo[i][j]){
                        console.log(`test`)
                        count++;
                        break;
                    }
                }
                console.log(count);
                if(count === 3){
                    gameRef.gameOver = true; //the game is over
                    player.winner = true; //find winner
                    console.log(player);
                    return;
                }
            }
            count = 0;
        }
    }

    
    takeTurn();



})();
