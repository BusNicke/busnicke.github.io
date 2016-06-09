function box(flag, mine, clicked, neighborsWithMine){
    this.flag = flag;
    this.mine = mine;
    this.clicked = clicked;
    this.neighborsWithMine = neighborsWithMine;
};

var timer = 0;
var numberOfMines = 0;
var gameBoard;
var gameBoardWidthAndHeight;
var gameOver = false;
var numberOfFlags = 0;

$(document).ready(function(){
    $("#startGame").click(function(){
        var widthInput = $("#width").val();
        var heightInput = $("#height").val();
        var checkNumberOfMines = $("#numberOfMines").val();
        
        if(widthInput > 35)
            widthInput = 35;
        if(heightInput > 35)
            heightInput = 35;
            
        gameBoardWidthAndHeight = {
        width: widthInput,
        height: heightInput
        };
        
        if(checkNumberOfMines >= widthInput * heightInput)
            checkNumberOfMines = (widthInput * heightInput)-1;
        numberOfMines = checkNumberOfMines;
        $(".setUpGame").hide();
        CreateGameBoard(gameBoardWidthAndHeight.width, gameBoardWidthAndHeight.height);
        LocalTime();
    });
});

function CreateGameBoard(height, width){
    document.oncontextmenu = function() {return false;};
    
    gameBoard = new Array(width)
    for (i=0; i < width; i++)
        gameBoard[i] = new Array(height);
    
    for(var i = 0; i < width; i++){
        $("#canvas").append("<div class='row" + i + "'></div>")
        for(var j = 0; j < height; j++){
            $(".row"+ i).append("<div class='box' id='"+ i + "t" + j +"' onClick='CheckForMines(" + i + ", " + j + ")'></div>");           
            gameBoard[i][j] = new box(flag = false, mine = false, clicked = false, neighborsWithMine = 0);
        }
        $("#canvas").append("<br />")
    }
    AssignMines();
    CheckNeighborsWithMines();
    UpdateMinesLeft();
    ActivateFlagPressing();
    StartTimer();
};

function StartTimer(){
    var doUpdate = function() {
        $('#timer').each(function() {
            if (gameOver === false) {
                timer++;
                var minutes = Math.floor(timer / 60);
                var seconds = timer % 60;
                if(seconds < 10){
                    seconds = 0 + seconds.toString();
                }
            $(this).html("Time:" + minutes + ":" + seconds);
        }
    });
  };

  setInterval(doUpdate, 1000);
};

function ActivateFlagPressing(){
    $(".box").mousedown(function(ev){
        
        var id = $(this).prop("id").split("t");
        if(ev.which == 3 && gameOver === false)
        {
            if(gameBoard[id[0]][id[1]].flag === true){
                $(this).removeClass("fa fa-flag flag");
                gameBoard[id[0]][id[1]].flag = false;
                numberOfFlags--;
                UpdateMinesLeft();
            }
            else{
                if(gameBoard[id[0]][id[1]].clicked === false){
                    gameBoard[id[0]][id[1]].flag = true;
                    $(this).addClass("fa fa-flag flag");
                    numberOfFlags++;
                    UpdateMinesLeft(); 
                }
            } 
        }
        if(ev.which == 2 && gameOver === false){
            //alert("middlemouse");
            CheckNeighborsForFlags(id[0], id[1]);
        }
    });
};

function CheckNeighborsForFlags(i, j){
    i = parseInt(i);
    j = parseInt(j);
    var neighborsWithFlags = 0;
    if(i-1 >= 0 && j-1 >= 0){
        if(gameBoard[i-1][j-1].flag === true)
            neighborsWithFlags++;
    }
        
    if(i-1 >= 0){
        if(gameBoard[i-1][j].flag === true)
            neighborsWithFlags++;
    }
        
    if(i-1 >= 0 && j+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i-1][j+1].flag === true)
            neighborsWithFlags++;
    }
        
    if(j-1 >= 0){
        if(gameBoard[i][j-1].flag === true)
            neighborsWithFlags++;
    }
        
    if(j+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i][j+1].flag === true)
            neighborsWithFlags++;
    }
        
    if(i+1 < gameBoardWidthAndHeight.height && j-1 >= 0){
        if(gameBoard[i+1][j-1].flag === true)
            neighborsWithFlags++;
    }
        
    if(i+1 < gameBoardWidthAndHeight.height){
        if(gameBoard[i+1][j].flag === true)
            neighborsWithFlags++;
    }
        
    if(i+1 < gameBoardWidthAndHeight.height && j+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i+1][j+1].flag === true)
            neighborsWithFlags++;
    }
    if(neighborsWithFlags === gameBoard[i][j].neighborsWithMine){
        ClickAllNeighbors(i, j);
    }
};

function ClickAllNeighbors(i, j){
    if(i-1 >= 0 && j-1 >= 0){
        if(gameBoard[i-1][j-1].flag === false && gameBoard[i-1][j-1].clicked === false)
            CheckForMines(i-1,j-1);
    }
        
    if(i-1 >= 0){
        if(gameBoard[i-1][j].flag === false && gameBoard[i-1][j].clicked === false)
            CheckForMines(i-1,j);
    }
        
    if(i-1 >= 0 && j+1 < gameBoardWidthAndHeight.height){
        if(gameBoard[i-1][j+1].flag === false && gameBoard[i-1][j+1].clicked === false)
            CheckForMines(i-1,j+1);
    }
        
    if(j-1 >= 0){
        if(gameBoard[i][j-1].flag === false && gameBoard[i][j-1].clicked === false)
            CheckForMines(i,j-1);
    }
        
    if(j+1 < gameBoardWidthAndHeight.height){
        if(gameBoard[i][j+1].flag === false && gameBoard[i][j+1].clicked === false)
            CheckForMines(i,j+1);
    }
        
    if(i+1 < gameBoardWidthAndHeight.width && j-1 >= 0){
        if(gameBoard[i+1][j-1].flag === false && gameBoard[i+1][j-1].clicked === false)
            CheckForMines(i+1,j-1);
    }
        
    if(i+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i+1][j].flag === false && gameBoard[i+1][j].clicked === false)
            CheckForMines(i+1,j);
    }
        
    if(i+1 < gameBoardWidthAndHeight.width && j+1 < gameBoardWidthAndHeight.height){
        if(gameBoard[i+1][j+1].flag === false && gameBoard[i+1][j+1].clicked === false)
            CheckForMines(i+1,j+1);
    }
};

function UpdateMinesLeft(){
    $("#minesLeft").text("Mines left: " + (numberOfMines - numberOfFlags));
};

function AssignMines(){
    for(var i = 0; i < numberOfMines;){
        var ranWidth = Math.floor(Math.random() * gameBoardWidthAndHeight.width);
        var ranHeight = Math.floor(Math.random() * gameBoardWidthAndHeight.height);
        if(gameBoard[ranWidth][ranHeight].mine === false){
            gameBoard[ranWidth][ranHeight].mine = true;
            i++;
        }
    }
};

function CheckNeighborsWithMines(){
    for(var i = 0; i < gameBoardWidthAndHeight.width; i++){
        for(var j = 0; j < gameBoardWidthAndHeight.height; j++){
            if(i-1 >= 0 && j-1 >= 0){
                if(gameBoard[i-1][j-1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i-1 >= 0){
                if(gameBoard[i-1][j].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i-1 >= 0 && j+1 < gameBoardWidthAndHeight.width){
                if(gameBoard[i-1][j+1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(j-1 >= 0){
                if(gameBoard[i][j-1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(j+1 < gameBoardWidthAndHeight.width){
                if(gameBoard[i][j+1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i+1 < gameBoardWidthAndHeight.height && j-1 >= 0){
                if(gameBoard[i+1][j-1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i+1 < gameBoardWidthAndHeight.height){
                if(gameBoard[i+1][j].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i+1 < gameBoardWidthAndHeight.height && j+1 < gameBoardWidthAndHeight.width){
                if(gameBoard[i+1][j+1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
        }
    }
};

function CheckForMines(x, y){
    if(gameOver === false){
        if(gameBoard[x][y].flag === false){
            gameBoard[x][y].clicked = true;
            if(gameBoard[x][y].mine === true){
                $("#" + x +"t"+ y).addClass("clickedMine fa fa-bomb");
                revealAllMines();
                $("#result").addClass("lost");
                $("#result").text("You Lost..");
                gameOver = true;
            }
            
            else if(gameBoard[x][y].neighborsWithMine === 0){
                checkIfNeighborsIsEmpty(x, y);
                $("#" + x +"t"+ y).addClass("clicked");
            }
            
            else{
                $("#" + x +"t"+ y).text(gameBoard[x][y].neighborsWithMine);
                $("#" + x +"t"+ y).addClass("numberBox"+ gameBoard[x][y].neighborsWithMine + " clicked"); 
            }
            
            //$("#" + x +"t"+ y).prop("disabled", true);
            checkWinningCondition();
        }
    }
};

function revealAllMines(){
    for(var i = 0; i < gameBoardWidthAndHeight.width; i++){
        for(var j = 0; j < gameBoardWidthAndHeight.height; j++){
            if(gameBoard[i][j].mine === true)
                $("#" + i +"t"+ j).addClass("clicked mine fa fa-bomb");   
        }
    }    
};

function checkIfNeighborsIsEmpty(i, j){   
     
    if(i-1 >= 0 && j-1 >= 0){
        if(gameBoard[i-1][j-1].mine === false && gameBoard[i-1][j-1].clicked === false)
            CheckForMines(i-1, j-1);
    }
        
    if(i-1 >= 0){
        if(gameBoard[i-1][j].mine === false && gameBoard[i-1][j].clicked === false)
            CheckForMines(i-1, j);
    }
        
    if(i-1 >= 0 && j+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i-1][j+1].mine === false && gameBoard[i-1][j+1].clicked === false)
            CheckForMines(i-1, j+1);
    }
        
    if(j-1 >= 0){
        if(gameBoard[i][j-1].mine === false && gameBoard[i][j-1].clicked === false)
            CheckForMines(i, j-1);
    }
        
    if(j+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i][j+1].mine === false && gameBoard[i][j+1].clicked === false)
            CheckForMines(i, j+1);
    }
        
    if(i+1 < gameBoardWidthAndHeight.height && j-1 >= 0){
        if(gameBoard[i+1][j-1].mine === false && gameBoard[i+1][j-1].clicked === false)
            CheckForMines(i+1, j-1);
    }
        
    if(i+1 < gameBoardWidthAndHeight.height){
        if(gameBoard[i+1][j].mine === false && gameBoard[i+1][j].clicked === false)
            CheckForMines(i+1, j);
    }
        
    if(i+1 < gameBoardWidthAndHeight.height && j+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[i+1][j+1].mine === false && gameBoard[i+1][j+1].clicked === false)
            CheckForMines(i+1, j+1);
    }   
    
};

function checkWinningCondition(){
    var win = true;
    for(var i = 0; i < gameBoardWidthAndHeight.width; i++){
        for(var j = 0; j < gameBoardWidthAndHeight.height; j++){
            if(gameBoard[i][j].mine === false && gameBoard[i][j].clicked === false)
                win = false;
        }
    }
    
    if(win === true){
        $("#result").addClass("win");
        $("#result").text("You WON!");
        gameOver = true;
    }
};