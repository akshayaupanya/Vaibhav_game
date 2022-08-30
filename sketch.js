var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  boy_running = loadAnimation("boy1.png","boy2.png","boy3.png","boy4.png","boy5.png","boy6.png");
  boy_collided = loadAnimation("boy_collided.png");
  boy_standing = loadAnimation("boy2.png")
  groundImage = loadImage("OIP.jfif");
  backgroundImage = loadImage("background2.jpg");
  
  cloudImage = loadAnimation("bird1.png","bird2.png");
  
  obstacle1 = loadImage("rock_1.png");
  obstacle2 = loadImage("rock_2.png");
  obstacle3 = loadImage("rock_3.png");
  obstacle4 = loadImage("rock_4.png");
  obstacle5 = loadImage("rock_5.png");
  obstacle6 = loadImage("rock_6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600,200);

  var message = "This is a message";
 console.log(message);
 bg = createSprite(300,100,30,20);
  bg.addImage(backgroundImage);
  bg.scale = 1.5;
  
  
  boy = createSprite(50,100,20,50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  

  boy.scale = 1;

 

  
 // ground = createSprite(100,200);
 // ground.addImage("ground",groundImage);
 // ground.scale = 1;
 // ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);

  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,180,400,10);
  invisibleGround.visible = true;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  invisibleBlockGroup = new Group();

  
 // boy.setCollider("rectangle",0,0,boy.width,boy.height);
 // boy.debug = true
  
  score = 0;
  
}

function draw() {
  //image(backgroundImage,300,200,600,200);
  background(0);
  //displaying score
  text("Score: "+ score, 500,60);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
   // ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //if (ground.x < 200){
    //  ground.x = ground.width/2+50;
   // }
    
    //jump when the space key is pressed
    if(keyDown("space")&& boy.y >= 100) {
        boy.velocityY = -4;
        jumpSound.play();
    }
    
    //add gravity
    boy.velocityY = boy.velocityY + 0.2
  console.log(boy.y)
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(boy)){
        //trex.velocityY = -12;
        jumpSound.play();
        //gameState = END;
        //dieSound.play()
       // boy.velocityX =0;
        //boy.velocityY=0;
        boy.changeAnimation("standing",boy_standing);
      
    }
    if(invisibleBlockGroup.isTouching(boy) || boy.y > 200){
      boy.destroy();
      gameState = END
    }
    
  
    
}
   else if(gameState===END){
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      boy.changeAnimation("collided", boy_collided);
    
     
     
     // ground.velocityX = 0;
      boy.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  boy.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    boy.changeAnimation("running",boy_running);
    
   
    
    score = 0;
    
  } 




function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,Math.round(random(100,200)),10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height)
   obstacle.debug = true
   var invisibleBlock = createSprite(200,15);
    invisibleBlock.width = obstacle.width;
    invisibleBlock.height = 2;
    invisibleBlock.x = obstacle.x;
    invisibleBlock.velocityX =  -(6 + score/100);
    invisibleBlock.y=obstacle.y+20;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    invisibleBlock.lifetime = 300
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    invisibleBlockGroup.add(invisibleBlock);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(10,80));
    cloud.addAnimation("cloud",cloudImage);
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

