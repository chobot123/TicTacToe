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

const GAME_BOARD = (() => {
    let _wrapper = document.querySelector(".wrapper");

    //a private grid size static
    let _gridSize = Array(9);


    //grid variable 
    let grid = document.createElement("div");
    grid.className = "grid";
    _wrapper.appendChild(grid);

    //make 3x3 grid
    function makeGrid(grid) {
        grid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr)";
        grid.style.gridTemplateRows = "repeat(3, minmax(0, 1fr)";
        for(let i = 0; i < _gridSize.length; i++){
            let cell = document.createElement("div");
            cell.className = `cell`;
            cell.classList.add(i);
            grid.appendChild(cell);
        }
    }
    makeGrid(grid);

    return {
        grid,
    }
})();

const PLAY_GAME = (() => {
    const winCondition = document.getElementById("winner")
    //ALL win combinations
    let test = false;
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
    let activePlayer = playerOne;

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

    function makeMove(e) {
        console.log(e.target)
        let cell = e.target;
        let index = cell.className.substring(5);
        checkAvailable(cell);
        toggleTurn();
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
        cell.removeEventListener("click", makeMove);
    }
    let children = grid.children;
    //event listener on click -> Adds player's choice to player decisions array, marks the cell, and increases games total turns by 1
    function takeTurn(){
        for(let i=0; i<children.length;i++){
            let cell = children[i];
            cell.addEventListener("click", makeMove);
        }
    }

    function resetBoard() {
        for(let i=0; i<grid.children.length; i++){
            let cell = grid.children[i];
            cell.innerText = "";
        }
        resetDefault(playerOne);
        resetDefault(playerTwo);
        refDefault(referee);
        winCondition.innerHTML = "";
        takeTurn();
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

    function removePlay (func) {
        for(let i=0; i<children.length;i++){
            let cell = children[i];
            cell.removeEventListener("click", func);
        }
    }

    function endGame() {
        if(referee.tie === true){
            //announce tie
            winCondition.innerHTML = "It's a Tie!";
            //reset game
            removePlay(makeMove);
        }
        if(playerOne.winner === true){
            //anounce winner
            winCondition.innerHTML = "Player One Wins!";
            //reset game
            removePlay(makeMove);
        }


        else if(playerTwo.winner === true){
            //announce p2 wins
            winCondition.innerHTML = "Player Two Wins!";
            //reset game
            removePlay(makeMove);
        }
    }

    takeTurn();
})();