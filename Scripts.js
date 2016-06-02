function box(flag, mine, clicked, neighborsWithMine){
    this.flag = flag;
    this.mine = mine;
    this.clicked = clicked;
    this.neighborsWithMine = neighborsWithMine;
};

var numberOfMines;
var gameBoard;
var gameBoardWidthAndHeight;

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
        $("#startGame").hide();
        CreateGameBoard(gameBoardWidthAndHeight.width, gameBoardWidthAndHeight.height);
    });
});

function CreateGameBoard(height, width){
    gameBoard = new Array(width)
    for (i=0; i < width; i++)
        gameBoard[i] = new Array(height);
    
    for(var i = 0; i < width; i++){
        $("#canvas").append("<div class='row" + i + "'></div>")
        for(var j = 0; j < height; j++){
            $(".row"+ i).append("<div class='box' id='"+ i + "" + j +"' onClick='CheckForMines(" + i + ", " + j + ")'></div>");           
            gameBoard[i][j] = new box(flag = false, mine = false, clicked = false, neighborsWithMine = 0);
        }
        $("#canvas").append("<br />")
    }
    AssignMines();
    CheckNeighborsWithMines();
    
    ActivateFlagPressing();
};

function ActivateFlagPressing(){
    $(".box").mousedown(function(ev){
        if(ev.which == 3)
        {
            $(this).addClass("flag");
        }
    });
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
                
            if(i-1 >= 0 && j+1 < gameBoardWidthAndHeight.height){
                if(gameBoard[i-1][j+1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(j-1 >= 0){
                if(gameBoard[i][j-1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(j+1 < gameBoardWidthAndHeight.height){
                if(gameBoard[i][j+1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i+1 < gameBoardWidthAndHeight.width && j-1 >= 0){
                if(gameBoard[i+1][j-1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i+1 < gameBoardWidthAndHeight.width){
                if(gameBoard[i+1][j].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
                
            if(i+1 < gameBoardWidthAndHeight.width && j+1 < gameBoardWidthAndHeight.height){
                if(gameBoard[i+1][j+1].mine === true)
                    gameBoard[i][j].neighborsWithMine++;
            }
        }
    }
};

function CheckForMines(x, y){
    
    gameBoard[x][y].clicked = true;
    
    if(gameBoard[x][y].mine === true){
        $("#" + x +""+ y).addClass("clickedMine fa fa-bomb");
        revealAllMines();
    }
    
    else if(gameBoard[x][y].neighborsWithMine === 0){
        checkIfNeighborsIsEmpty(x, y);
        $("#" + x +""+ y).addClass("clicked");
    }
    
    else{
        $("#" + x +""+ y).text(gameBoard[x][y].neighborsWithMine);
        if(gameBoard[x][y].neighborsWithMine === 1)
            $("#" + x +""+ y).addClass("numberBoxOne clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 2)
            $("#" + x +""+ y).addClass("numberBoxTwo clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 3)
            $("#" + x +""+ y).addClass("numberBoxThree clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 4)
            $("#" + x +""+ y).addClass("numberBoxFour clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 5)
            $("#" + x +""+ y).addClass("numberBoxFive clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 6)
            $("#" + x +""+ y).addClass("numberBoxSix clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 7)
            $("#" + x +""+ y).addClass("numberBoxSeven clicked"); 
            
        if(gameBoard[x][y].neighborsWithMine === 8)
            $("#" + x +""+ y).addClass("numberBoxEight clicked"); 
    }
    
    $("#" + x +""+ y).prop("disabled", true);
    
};

function revealAllMines(){
    for(var i = 0; i < gameBoardWidthAndHeight.width; i++){
        for(var j = 0; j < gameBoardWidthAndHeight.height; j++){
            if(gameBoard[i][j].mine === true)
                $("#" + i +""+ j).addClass("clicked mine fa fa-bomb");   
        }
    }    
};

function checkIfNeighborsIsEmpty(x, y){
    if(x-1 >= 0){
        if(gameBoard[x-1][y].mine === false && gameBoard[x-1][y].clicked === false)
            CheckForMines(x-1, y);
    }
        
    if(y-1 >= 0){
        if(gameBoard[x][y-1].mine === false && gameBoard[x][y-1].clicked === false)
            CheckForMines(x, y-1);
    }
        
    if(y+1 < gameBoardWidthAndHeight.height){
        if(gameBoard[x][y+1].mine === false && gameBoard[x][y+1].clicked === false)
            CheckForMines(x, y+1);
    }
        
    if(x+1 < gameBoardWidthAndHeight.width){
        if(gameBoard[x+1][y].mine === false && gameBoard[x+1][y].clicked === false)
            CheckForMines(x+1, y);
    }
};

