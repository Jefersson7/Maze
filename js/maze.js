var
	canvasMap = document.getElementById("canvasMap"),
	cmapw = canvasMap.width,
	cmaph = canvasMap.height,
	ctxMap = canvasMap.getContext('2d');
var 
	canvasBrick = document.getElementById("canvasBrick"),
	cbw = canvasBrick.width,
	cbh = canvasBrick.height,
	ctxBrick = canvasBrick.getContext('2d'); 
var 
	canvasBall = document.getElementById("canvasBall"),
	cblw = canvasBall.width,
	cblh = canvasBall.height,
	ctxBall = canvasBall.getContext('2d');
var
    canvasText = document.getElementById("canvasText"),
	ctxtw = canvasText.width,
	ctxth = canvasText.height,
	ctxText = canvasText.getContext('2d');

var map = []
var imagenes = new Array();
var finish = false;
var timeRest = 181;
var completedMazes = 0;

var 
		keyUp = false,
		keyDown = false,
		keyLeft = false,
		keyRight = false;
		
		//set them to false
	window.addEventListener('blur', function(event){
		keyUp = false;
		keyDown = false;
		keyLeft = false;
		keyRight = false;
	});
	
	document.addEventListener('keydown', function(event){
		switch(event.keyCode){
			case 38:
				keyUp = true;
				play();
				break;
			case 40:
				keyDown = true;
				play();
				break;
			case 37:
				keyLeft = true;
				play();
				break;
			case 39:
				keyRight = true;
				play();
				break;
		}
	});
	document.addEventListener('keyup', function(event){
		switch(event.keyCode){
			case 38:
				keyUp = false;
				break;
			case 40:
				keyDown = false;
				break;
			case 37:
				keyLeft = false;
				break;
			case 39:
				keyRight = false;
				break;
		}
	});

function duom(){

    var a = parseInt(document.getElementById("height").value);
    var b = parseInt(document.getElementById("width").value);

    mapear(maze(a,b));
}


function maze(x,y) {
    var n=x*y-1;
    if (n<0) {alert("illegal maze dimensions");return;}
    var horiz=[]; for (var j= 0; j<x+1; j++) horiz[j]= [];
    var verti=[]; for (var j= 0; j<y+1; j++) verti[j]= [];
    var here= [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
    var path= [here];
    var unvisited= [];
    for (var j= 0; j<x+2; j++) {
        unvisited[j]= [];
        for (var k= 0; k<y+1; k++)
            unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
    }
    while (0<n) {
        var potential= [[here[0]+1, here[1]], [here[0],here[1]+1],
            [here[0]-1, here[1]], [here[0],here[1]-1]];
        var neighbors= [];
        for (var j= 0; j < 4; j++)
            if (unvisited[potential[j][0]+1][potential[j][1]+1])
                neighbors.push(potential[j]);
        if (neighbors.length) {
            n= n-1;
            next= neighbors[Math.floor(Math.random()*neighbors.length)];
            unvisited[next[0]+1][next[1]+1]= false;
            if (next[0] == here[0])
                horiz[next[0]][(next[1]+here[1]-1)/2]= true;
            else 
                verti[(next[0]+here[0]-1)/2][next[1]]= true;
            path.push(here= next);
        } else 
            here= path.pop();
    }
    return ({x: x, y: y, horiz: horiz, verti: verti});
}

function mapear(m){
	for (var j= 0; j<m.x*2+1; j++) {
	    map[j] = [];
		var line= [];
        if (0 == j%2)
            for (var k=0; k<m.y*2+1; k++)
                if (0 == k%2) 
                    line[k]= 'x';
                else
                    if (j>0 && m.verti[j/2-1][Math.floor(k/2)])
                        line[k]= ' ';
                    else
                        line[k]= 'x';
        else
            for (var k=0; k<m.y*2+1; k++)
                if (0 == k%2)
                    if (k>0 && m.horiz[(j-1)/2][k/2-1])
                        line[k]= ' ';
                    else
                        line[k]= 'x';
                else
                    line[k]= ' ';
        if (0 == j) line[1]= '1';
        if (m.x*2-1 == j) line[2*m.y]= '2';
		for(k=0; k<m.y*2+1; k++){
			map[j].push(line[k]);
		}
    }
}

function drawMaze(){
	mapear(maze(8,15));
	for(var i=0; i<map.length; i++){
		for(var j=0; j<map[i].length; j++){
			var cposx = j * 20;
			var cposy = i * 20;
			if(map[i][j] == "x"){
				ctxMap.drawImage(imagenes[0],cposx,cposy);	
			}	
		}	
	}	
}

function ball(x,y){
	this.x = x;
	this.y = y;
}

ball.prototype.draw = function(){
	ctxBall.drawImage(imagenes[1], this.x*20, this.y*20);	
};

ball.prototype.step = function(){	
	var ballRow = this.y;
	var ballCol = this.x;
	var dx=0, dy=0;
	
	if(keyUp){
		dy = -1;
	}
	if(keyDown){
		dy = 1;	
	}
	if(keyRight){
		dx = 1;	
	}
	if(keyLeft){
		dx = -1;	
	}
	if(ballRow+dy >= 0){
		if(map[ballRow+dy][ballCol+dx] != "x"){
			this.x += dx;
			this.y += dy;
		}
		if(map[ballRow+dy][ballCol+dx] == "2"){
			this.x = 1;
			this.y = 0;
			completedMazes += 1;
			dibujarTexto();
			if(completedMazes == 10){
				pararJuego();
				return;	
			}
			reload();
		}
	}
};

var player = new ball(1,0);

function render(){
	ctxBall.clearRect(0, 0, cblw, cblh);
	player.draw()	
}

function updateTime(){
	if(timeRest == 0 || completedMazes == 10){
		oscurecerPantalla();
		pararJuego();
		return;
	}
	timeRest -= 1;
	dibujarTexto();
	setTimeout("updateTime()", 1000);
}


function play(){
	if(!finish){
		player.step();
		render();
	}
	//startnStopAnimation(play);
}

function loadGame() {
	
	imagenes[0] = new Image();
	imagenes[0].src = "img/brick.png";
	
	imagenes[1] = new Image();
	imagenes[1].src = "img/ball.png";
	imagenes[0].addEventListener("load", function(){
		drawMaze();	
		play();
	});
}

function reload(){
	ctxMap.clearRect(0,0,cmapw, cmaph);
	ctxBall.clearRect(0,0,cblw, cblh);
	drawMaze();
	play();
}

function dibujarTexto(){
	ctxText.fillStyle = "#000000";
	ctxText.clearRect(0,0, ctxtw, ctxth);
	ctxText.font = "bold 20px Tw Cen MT";
	ctxText.fillText("Laberintos Completados : " + 	completedMazes, 20, 337);
	var minutes = Math.floor(timeRest/60);
	var seconds = timeRest % 60;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	if(timeRest <= 10){
		ctxText.fillStyle = "#FF0000";
	}
	ctxText.fillText(minutes + ":" + seconds,400,337);
}

function oscurecerPantalla(){
	ctxText.fillStyle = "#000000";
	canvasMap.style.filter = "contrast(50%)";
	canvasBall.style.filter = "contrast(50%)";
	ctxText.clearRect(0,0, ctxtw, ctxth);
	ctxText.font = "bold 35px Tw Cen MT";
	var x = canvasText.width / 2;
     	var y = canvasText.height / 2;
	ctxText.textAlign = 'center';
	if(timeRest == 0){
		ctxText.fillText("Has perdido", x, y);
	}else{
		ctxText.fillText("Has ganado", x, y);
	}
}

function pararJuego(){
	finish = true;
	window.stop();	
}
loadGame();
updateTime();
/*function startnStopAnimation(func){
	if(!finish){
		rqa = window.requestAnimationFrame(func);
	}
	else { window.cancelAnimationFrame(rqa); }
}*/