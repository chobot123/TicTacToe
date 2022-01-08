//player factory
const Player = (decision, marker, winner) => {
    return{
        decision,
        marker,
        winner,
    }
}

//game 'ref' factory
const Referee = (turns, tie, winner, playerOneTurn) => {

    return {
        turns,
        tie,
        playerOneTurn,
    }
}

const GAME_BOARD = (function(){
    const _wrapper = document.querySelector(".wrapper");

    //a private grid size static
    const _gridSize = Array(9);


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

    const test = true;

    console.log(PLAY_GAME)


    return {
        grid,
        test,
    }
})();

const PLAY_GAME = (function(){
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

    const playerOne = Player([], "O", false);
    const playerTwo = Player([], "X", false);
    const referee = Referee(0, false, true); // turns tie playerOneTurn
    const grid = GAME_BOARD.grid;
    let availableCell = false;

    //Player One Picks
    //Board takes input, updates turn count
    //Player Two Picks
    //Board takes input, updates turn count
    //Starting from turn 5, check for 3 in row
    //if there is, referee declares winner
    //else, tie (MAX_TURNS === 9)

    function toggleTurn() {
        (referee.playerOneTurn) ? referee.playerOneTurn = false : referee.playerOneTurn = true;
    }

    function checkAvailable (cell) {
        (cell.innerText !== "X" && cell.innerText !== "O") ? availableCell = true : availableCell = false;
    }

    function checkWin(player) {
        if(referee.turns > 4 && referee.tie === false){
            let count = 0; //count to check 3-in-row

            for(let i = 0; i < winCombo.length; i++){ //go through win combo array
                for(let j = 0; j < winCombo[i].length; j++){ //in each element in each array in win combo
                    for(let k = 0; k < player.decision.length; k++){ //compare with each element in decision
                        if(player.decision[k] == winCombo[i][j]){
                            count++;
                        }
                    }
                }
                console.log(count);
                if(count === 3){

                    player.winner = true;
                    return true;

                }
                count = 0;
            }
        }

        if(referee.turns === 9){
            referee.tie = true;
        }
    }

    //event listener on click -> Adds player's choice to player decisions array, marks the cell, and increases games total turns by 1
    function takeTurn(){
        for(let i=0; i<grid.children.length;i++){
            let cell = grid.children[i];
            cell.addEventListener("click", function(){
                let index = cell.className.substring(5);
                checkAvailable(cell);
                toggleTurn();
                console.log(referee.playerOneTurn)
               if(referee.playerOneTurn === true && availableCell === true){
                   referee.turns++;
                   playerOne.decision.push(index);
                   cell.innerText = playerOne.marker;
                   checkWin(playerOne);
                   endGame();
               }
               else if(referee.playerOneTurn === false && availableCell === true){
                   referee.turns++;
                   playerTwo.decision.push(index);
                   cell.innerText = playerTwo.marker;
                   checkWin(playerTwo);
                   endGame();
                   
               }
            })
        }

    }

    function resetBoard() {
        for(let i=0; i<grid.children.length; i++){
            let cell = grid.children[i];
            cell.innerText = i;
        }
        resetDefault(playerOne);
        resetDefault(playerTwo);
        refDefault(referee);
        console.log(referee);
    }

    function resetDefault(player) {
        player.winner = false;
        player.decision = [];
    }

    function refDefault(referee){
        referee.turns = 0;
        referee.tie = false;
        referee.playerOneTurn = false;
    }

    let btn = document.querySelector(".btncontainer");

    btn.addEventListener("click", resetBoard);

    function endGame() {
        if(referee.tie === true){
            //announce tie
            console.log(`tie game`)
            //reset game
        }
        if(playerOne.winner === true){
            //anounce winner
            console.log(`playerOne Wins!`)
            //reset game
        }


        else if(playerTwo.winner === true){
            //announce p2 wins
            console.log(`player two wins!`)
            //reset game
            resetBoard();
        }
    }
    
    const getWinner = () => {
        return availableCell;
    }

    return {
        getWinner,
    }
})();