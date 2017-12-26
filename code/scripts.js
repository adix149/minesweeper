var minesRemaining=-1;
var minesVector=[];
var isFailure=false;
var firstClick=false;
var timeInSec=0;
var gameOver=false;
var totalTime=-1;
var my_int;

function DivBox( row, col ,minesCnt)
{
    minesRemaining=minesCnt;
    minesVector=getRandomMines((row*col),minesCnt);

    var ret = "";
    for( var r = 0; r < row ; r++ )
    {
        for( var c = 0; c < col; c++ )
        {
            var nMines=countMines(r,c,minesVector,row,col);
            ret += '<a href="#">';
            ret += '<div id="'+r+'x'+c+'" class="cell" data-numMines="'+nMines+'" oncontextmenu="return false;" onmouseup="handleClick(event,this,'+r+','+c+','+row+','+col+');">';
            if(minesVector[r*col+c]==1)
            {
                //ret += '*';
            }
            else
            {
                ret += '';
            }

            //ret += (r*col)+c;
            ret += '</div>';
            ret += '</a>';
        }
        
    }
    return ret;
}

function countMines(row,col,minesVector,numRows,numCols) {
   cnt=0;
   if(minesVector[row*numCols+col]==1)
   {
       return -1;
   }
   else
   {
    var adjVect=getadjacentCells(row,col,numRows,numCols)
    for (var i in adjVect) {
        if (adjVect[i] != -1)
        {
            if (minesVector[adjVect[i]]==1)
            {
                cnt++;
            }
        }
    }    

   }
   return cnt;
}
function getadjacentCells(row,col,numRows,numCols)
{
var adjacentVect= [];
    
    //Right 
    adjacentVect.push(getCellNum(row-1,col+1,numRows,numCols));
    adjacentVect.push(getCellNum(row,col+1,numRows,numCols));
    adjacentVect.push(getCellNum(row+1,col+1,numRows,numCols));
    //Left 
    adjacentVect.push(getCellNum(row-1,col-1,numRows,numCols));
    adjacentVect.push(getCellNum(row,col-1,numRows,numCols));
    adjacentVect.push(getCellNum(row+1,col-1,numRows,numCols));
    //Top
    adjacentVect.push(getCellNum(row-1,col,numRows,numCols));
    //Bottom
    adjacentVect.push(getCellNum(row+1,col,numRows,numCols));

return adjacentVect;

}
function getCellNum(row,col,numRows,numCols)
{
    if (isValidCol(col,numCols) && isValidRow(row,numRows))
    {
        return ((row*numCols)+col);
    }
    else
    {
        return -1;
    }
}

function isValidRow(row,numRows)
{
    return ((row>=0) && (row<numRows))
}
function isValidCol(col,numCols)
{
    return ((col>=0) && (col<numCols))
}

function getRandomMines(numCells,numMines) {
    var mineVector= new Array(numCells).fill(0);
    var cnt=0;
    while (cnt<numMines)
    {
    var randVal= Math.floor((Math.random()*numCells));
    if (mineVector[randVal] == 0)
    {
        mineVector[randVal]=1;
        cnt++;
    }
    }
    return mineVector;
}

function levelSelection (element, event){
    if(event.keyCode == 0){
      console.log("click event");
      //alert("click event");
    }else{
      console.log("keyboard event");
      //alert("keyboard event");
      //event.preventDefault();
    }
    if (element.value == "Beginner")
    {
    DoDivBox(8,8,10);
    }
    else if (element.value == "Intermediate")
    {
    DoDivBox(16,16,40);
    }
    else if (element.value == "Expertl")
    {
    DoDivBox(16,30,99);
    }
    stop_timer();
  }


function DoDivBox( row, col ,minesCnt)
{
    minesRemaining=-1;
    minesVector=[];
    isFailure=false;
    firstClick=false;
    timeInSec=0;
    gameOver=false;
    totalTime=-1;
    var obj = document.getElementById("MineTable");
    obj.innerHTML = DivBox( row, col,minesCnt);
    document.getElementById('mRemaining').value= minesRemaining;
    document.documentElement.style.setProperty("--numRows", row);
    document.documentElement.style.setProperty("--numCols", col);

    for( var r = 0; r < row ; r++ )
    {
        for( var c = 0; c < col; c++ )
        {
                var elem=document.getElementById(r+'x'+c); 
                if(elem)
                {
                elem.addEventListener('Fail', function (){revealAllCells (row,col) ;}, false);
                }
        }
    }
    firstClick=false;
    document.getElementById("mTime").innerHTML=0;

 
}

function timer()
{ 
    if (firstClick)
    {
    var sec = 0;
    }
    function pad ( val ) { return val > 9 ? val : "0" + val; }
    my_int = setInterval( function(){
        document.getElementById("mTime").innerHTML=pad(++sec);
    }, 1000);

}
function isGameOver(row,col)
{
    var unVisitedCells=0;
    for( var r = 0; r < row ; r++ )
    {
        for( var c = 0; c < col; c++ )
        {
                var element=document.getElementById(r+'x'+c); 
                if(element)
                {

                    if(element.classList.contains('cell'))
                    {
                        unVisitedCells++;
                    }
                }
        }
    }
    if (unVisitedCells ==0)
    {
        stop_timer();
        totalTime=document.getElementById('mTime').value;
        return true;
    }
    return false;
}
function stop_timer() {
    clearInterval(my_int);
}
function handleClick(event,element,row,col,numRows,numCols) {

    var num=element.getAttribute('data-numMines');
    var rightclick; 
    var leftClick;

    var e = event; 
    if (!e)
    { 
        e.preventDefault();
    }
    if (e.which) 
    {
        rightclick = (e.which == 3); 
        leftClick=(e.button==0 || e.button ==1);
    }
    else if (e.button)
    { 
        rightclick = (e.button == 2);
        leftClick=(e.button==0 || e.button ==1);
    }
    if(rightclick) 
    {
        handleRightClick(element,row,col,numRows,numCols);
    }
    if(leftClick)
    {

        if (!firstClick)
        {
            firstClick=true;
            timer();
        }
        revealCell(element,row,col,numRows,numCols,false);
    }
    gameOver=isGameOver(numRows,numCols);
    if (gameOver && ! isFailure)
    {

    alert("Awesome !!! All mines diffused in "+totalTime+" secs");
    }
}
function handleRightClick(element,row,col,numRows,numCols)
{
    var num=element.getAttribute('data-numMines');
    if(minesRemaining)
    {
    
    var newClass='';
    if(element.classList.contains('cell'))
    {
        $(element).removeClass('cell');
        newClass="cell_flagged_1";
        $(element).addClass(newClass);
        minesRemaining--;
        document.getElementById('mRemaining').value= minesRemaining;
    }
    else if(element.classList.contains('cell_flagged_1'))
    {
        $(element).removeClass('cell_flagged_1');
        newClass="cell_flagged_2";
        $(element).addClass(newClass);
    }
    else if(element.classList.contains('cell_flagged_2'))
    {
        $(element).removeClass('cell_flagged_2');
        newClass="cell";
        $(element).addClass(newClass);
        minesRemaining++;
        document.getElementById('mRemaining').value= minesRemaining;
    }
}


}
function revealCell(element,row,col,numRows,numCols,misFailure) {

    var num=element.getAttribute('data-numMines');
    if(element.classList.contains('cell'))
    {
    $(element).removeClass('cell');
    
    var newClass='';
    var newRow=-1;
    var newCol=-1;
    if (num>=0 && num<=8)
    {
    newClass="cell_clicked_"+num;
    }
    else if (num == -1)
    {
        newClass="cell_mine";
    }
    $(element).addClass(newClass);
    if(num == -1 && !misFailure)
    {
        isFailure=true;
        misFailure=true;
        var event = new Event('Fail');
        // Listen for the event.
       // element.addEventListener('Fail', function (revealAllCells) {numRows,numCols}, false);
        // Dispatch the event.
        element.dispatchEvent(event);
    }

    if (num==0|| misFailure)
    {
        var adjVect=getadjacentCells(row,col,numRows,numCols);
        for (var i in adjVect) {
            if (adjVect[i] != -1)
            {
                RowCol=getRowCol(adjVect[i],numRows,numCols);
                newRow=RowCol[0];
                newCol=RowCol[1];

                var elem=document.getElementById(newRow+'x'+newCol); 
                revealCell(elem,newRow,newCol,numRows,numCols,misFailure)
                //Simulating click
            }
        }        
    }
}

}

function getRowCol(num,numRows,numCols)
{
    row= Math.floor(num / numCols);
    col= num-(row*numCols);
    return ([row,col]);
}

function revealAllCells(numRows,numCols)
{

    for( var r = 0; r < numRows ; r++ )
    {
        for( var c = 0; c < numCols; c++ )
        {
                var elem=document.getElementById(r+'x'+c); 
                revealCell(elem,r,c,numRows,numCols,true)
        }
    }
    alert("Oops! You stepped on the Mine. Refresh to start a new Game");
}
