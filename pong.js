//canvas and context

const canvas=document.getElementById('container');
const context=canvas.getContext("2d");
sessionStorage.setItem("winner","None");//winner is stored in session storage,winner is set to none
const ballhit=new Audio("ball_hit.mp3");
//Objects and thier properties

const ball={
    radius : 8,
    positionX : canvas.width/2+8,
    positionY : canvas.height/2+8,
    velocityX : 2,
    velocityY : 2,
    color : 'white'
}

const leftPlayer={
    height : 100,
    width : 10,
    color : 'white',
    player : 'left',
    speed : 2,
    positionX : 10,
    positionY: canvas.height / 2 - 100 / 2
}

const rightPlayer={
    height : 100,
    width : 10,
    color : 'white',
    player :'right',
    speed : 2,
    positionX : canvas.width-20,
    positionY : canvas.height / 2 - 100 / 2
}

//Game and Key state

const game={
    leftScore : 0,
    rightScore : 0,
    turn: 0,
    topScore : 5,
    speedIncreaseHit : 3
}

const keyPressed={
    W : false,
    S : false,
    Up : false,
    Down : false
}

let activated=true;
let hits=0;

//Update and Draw

function drawLeftPlayer(){
    context.beginPath();
    context.fillStyle = leftPlayer.color;
    context.rect(leftPlayer.positionX,leftPlayer.positionY,leftPlayer.width,leftPlayer.height);
    context.fill();
    context.closePath();
}

function drawRightPlayer(){
    context.beginPath();
    context.fillStyle = rightPlayer.color;
    context.rect(rightPlayer.positionX,rightPlayer.positionY,rightPlayer.width,rightPlayer.height);
    context.fill();
    context.closePath();
}

function drawBall(){
    context.beginPath();
    context.fillStyle = ball.color;
    context.arc(ball.positionX,ball.positionY,ball.radius,0,Math.PI*2);
    context.fill();
    context.closePath();
}

function drawAll(){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawLeftPlayer();
    drawRightPlayer();
    drawBall();
}

//movement of paddle

function updateKeyPresses(){
    if(keyPressed['W'] && leftPlayer.positionY>0)leftPlayer.positionY-=leftPlayer.speed;

    if(keyPressed['S'] && leftPlayer.positionY<canvas.height-leftPlayer.height)leftPlayer.positionY+=leftPlayer.speed;

    if(keyPressed['Up'] && rightPlayer.positionY>0)rightPlayer.positionY-=rightPlayer.speed;

    if(keyPressed['Down'] && rightPlayer.positionY<canvas.height-rightPlayer.height)rightPlayer.positionY+=rightPlayer.speed;
}

//repositioning after each turn

function resetBall(){
    ball.positionX=canvas.width/2+8;
    ball.positionY=canvas.height/2+8;

    let velocityX=ball.velocityX;
    let velocityY=ball.velocityY;

    ball.velocityX=0;
    ball.velocityY=0;

    setTimeout(()=>{
        ball.velocityX=-velocityX;
        ball.velocityY=-velocityY;
    },1000) //so as to give to give ball to opposite player
}

//updating the score

function setScore(){
    if(ball.positionX>canvas.width-(rightPlayer.width)){
        game.leftScore++;
        resetBall();
    }
    if(ball.positionX<leftPlayer.width){
        game.rightScore++;
        resetBall();
    }
    
    document.getElementsByClassName('left')[0].textContent=game.leftScore;
    document.getElementsByClassName('right')[0].textContent=game.rightScore;
}

//resetting the game

function resetGame(){
    ball.positionX=0;
    ball.positionY=0;
    game.leftScore=0;
    game.rightScore=0;
    updateDefault();
}

//on game over

function gameOver(){
    if(game.leftScore===game.topScore){
        console.log('Left Wins');
        sessionStorage.setItem('winner',"Left");
        window.location.href="winner.html";
        resetGame();
    }else if(game.rightScore===game.topScore){
        console.log('Right Wins');
        sessionStorage.setItem('winner',"Right");
        window.location.href="winner.html";
        resetGame();
    }
}//this function redirects to winner.html which fetches the winner from session storage and displays it

//ball collision, direction change ,speed increase

function  updateState(){
    if(ball.positionY+ball.radius>=canvas.height || ball.positionY-ball.radius<=0){
        ball.velocityY=-ball.velocityY;
    }
    if(
        (ball.positionX+ball.radius>=canvas.width-(rightPlayer.width+10)) && 
        (ball.positionY>=rightPlayer.positionY && ball.positionY<=(rightPlayer.positionY+rightPlayer.height)) ||
        
        (ball.positionX-ball.radius<=(leftPlayer.width+10)) &&
        (ball.positionY>=leftPlayer.positionY && ball.positionY<=(leftPlayer.positionY+leftPlayer.height))){
            if(activated){
                hits++;
                ball.velocityX=-ball.velocityX;
                ballhit.play();
                collisionTimeLag();
            }
        }
    
    setScore();
    gameOver();

    if(hits==game.speedIncreaseHit){
        hits=0;
        ball.velocityX +=0.2;
        ball.velocityY +=0.2;
        ball.positionX +=0.2;
        ball.positionY +=0.2;
    }
    //move the ball
    ball.positionX += ball.velocityX;
    ball.positionY += ball.velocityY;
}
//just to make sure there is no bug while collision due to increase in speed
function collisionTimeLag(){
    activated=false;
    console.log('Deactivated Collision');
    setTimeout(()=>{
        activated=true;
        console.log('Ready for Collision');
    },1000);
}

//Key Listener

document.addEventListener('keydown',(e) => {
    const code=e.code;
    if(code === 'KeyS') keyPressed['S']=true;
    if(code === 'KeyW') keyPressed['W']=true;
    if(code === 'ArrowUp') keyPressed['Up']=true;
    if(code === 'ArrowDown') keyPressed['Down']=true;
},false);

document.addEventListener('keyup', (e) => {
    const code=e.code;
    if(code === 'KeyS') keyPressed['S']=false;
    if(code === 'KeyW') keyPressed['W']=false;
    if(code === 'ArrowUp') keyPressed['Up']=false;
    if(code === 'ArrowDown') keyPressed['Down']=false;
},false)

//game loop and render
function gameLoop(){
    updateKeyPresses();
    updateState();
    drawAll();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

//support for screen size

function updateDefault(){
    canvas.width=Math.min(window.innerWidth,800);
    canvas.height=Math.min(window.innerHeight,600);

    ball.positionX=canvas.width/2+ball.radius;
    ball.positionY=canvas.width/2+ball.radius;

    leftPlayer.positionY=canvas.height/2-leftPlayer.height/2;

    rightPlayer.positionX=canvas.width-(rightPlayer.width+10);
    rightPlayer.positionY = canvas.height / 2 - rightPlayer.height / 2;
}

function resizeHandler(){
    if(window.innerWidth<560){
        document.getElementsByClassName('small-device')[0].style.display="flex";
        document.getElementsByClassName('canvas-container')[0].style.display="none";
    }
    else{
        document.getElementsByClassName('small-device')[0].style.display="none";
        document.getElementsByClassName('canvas-container')[0].style.display="flex";
    }
    updateDefault();
}

resizeHandler();
window.addEventListener('resize',()=>{resizeHandler()})