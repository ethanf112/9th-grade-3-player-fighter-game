class Character {
  constructor(name, x, y, imageSet) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.sizex = 150;
    this.sizey = 150;
    this.velocityY = 0;
    this.gravity = 2;
    this.isJumping = false;
    this.isAttacking = false;
    this.isAttacking2 = false;
    this.isHit = false; // New flag for getting hit
    this.hitCooldown = 0; // Prevents continuous triggering
    this.state = "idle";
    this.sprites = imageSet;
    this.isMoving = false;

    this.hitbox = {
      x: this.x + 30,
      y: this.y + 30,
      w: this.sizex - 60,
      h: this.sizey - 40
    };
  }

  updateHitbox() {
    this.hitbox.x = this.x + 30;
    this.hitbox.y = this.y + 30;
  } //added size to hitBoxes because they didnt look natural

  move(leftKey, rightKey, other) {
    if (this.isAttacking || this.isHit) return; // Don't move if attacking or hit

    if (keyIsDown(leftKey) && !this.leftBlocked) {
      this.x -= 14;
      this.isMoving = true;
      this.state = "left";
    } else if (keyIsDown(rightKey) && !this.rightBlocked) {
      this.x += 14;
      this.isMoving = true;
      this.state = "right";
      
    } else {
      this.isMoving = false;
      if (!this.isJumping && !this.isAttacking && !this.isHit) {
        this.state = "idle";
      }
    }

    this.updateHitbox();
  }

  jump(jumpKey) {
    if (!this.isJumping && keyIsDown(jumpKey) && !this.isAttacking && !this.isHit) {
      this.velocityY = -30;
      this.isJumping = true;
      this.state = "jump";
    }

    this.updateHitbox();
  }

  applyGravity() {
    if (this.isAttacking || this.isHit) return;
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.velocityY < 0) {
      this.state = "jump";
    } else if (this.velocityY > 0 && this.isJumping) {
      this.state = "fall";
    }

    // Landing
    if (this.y >= 650) {
      this.velocityY = 0;
      this.isJumping = false;
      if (!this.isMoving && !this.isAttacking && !this.isHit) {
        this.state = "idle";
      }
    }

    this.updateHitbox();
  }

  attack(attackKey) {
    if (keyIsDown(attackKey)) {
      this.isAttacking = true;
      this.state = "attack";
    } else {
      this.isAttacking = false;
    }

    this.updateHitbox();
  }
  
  specialMove(specialMoveKey){
    if(keyIsDown(specialMoveKey)){
  this.isAttacking2 = true;
    this.state = "attack2" ;
      
      
      
    }
   else { 
  this.isAttacking2 = false;
     
  } 
}

  getHit(opponent) {
    if (this.isHit || this.hitCooldown > 0) return; // Prevent spam hitting

    if (opponent.isAttacking || opponent.isAttacking2 && this.collidesWith(opponent)) {
      this.isHit = true;
      this.state = "hit"; // Set to a "hit" animation state (add this sprite)
      this.hitCooldown = 10; // Prevent immediate retrigger

      // Apply knockback based on opponent’s position
      if (opponent.x < this.x) {
        this.x += 35; // Knockback to the right
      } else {
        this.x -= 35; // Knockback to the left
      }

      setTimeout(() => {
        this.isHit = false;
        this.state = "idle"; // Reset state after hit animation
      }, 200); // Half a second of hit state
    }
  }
  

  collidesWith(other) {
    return (
      this.hitbox.x < other.hitbox.x + other.hitbox.w &&
      this.hitbox.x + this.hitbox.w > other.hitbox.x &&
      this.hitbox.y < other.hitbox.y + other.hitbox.h &&
      this.hitbox.y + this.hitbox.h > other.hitbox.y
    );
  }
 
  bump(other, other2) {
    this.rightBlocked = false;
    this.leftBlocked = false;
    
    if (this.collidesWith(other)) {
      if (this.x < other.x) {
        this.rightBlocked = true;
        other.leftBlocked = true;
      } else {
        this.leftBlocked = true;
        other.rightBlocked = true;
      }
    }
      
    if (this.collidesWith(other2)) {
      if (this.x < other2.x) {
        this.rightBlocked = true;
        other2.leftBlocked = true;
      } else {
        this.leftBlocked = true;
        other2.rightBlocked = true;
      }
    } 
  }
  

  display() {
    image(this.sprites[this.state], this.x, this.y, this.sizex, this.sizey);
    noFill();
    stroke(255, 0, 0);
    rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
  }

  update() {
    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }
  }
} //this function resets the coolDown every frame in Draw

// Preload images
let sasukeSprites = {};
let ichigoSprites = {};
let NarutoSprites = {};
let map1;
function preload() {
  sasukeSprites.idle = loadImage("SasukeIdle.png");
  sasukeSprites.left = loadImage("SasukeLeft.gif");
  sasukeSprites.right = loadImage("SasukeRight.gif");
  sasukeSprites.attack = loadImage("SasukeSword.gif");
  sasukeSprites.jump = loadImage("SasukeJump.png");
  sasukeSprites.fall = loadImage("SasukeFall.png");
  sasukeSprites.hit = loadImage("SasukeHit.png"); // Add hit sprite

  ichigoSprites.idle = loadImage("IchigoIdleL.gif");
  ichigoSprites.left = loadImage("IchigoLeft.gif");
  ichigoSprites.right = loadImage("IchigoRight.gif");
  ichigoSprites.attack = loadImage("IchigoHeavyL.gif");
  ichigoSprites.jump = loadImage("IchigoJump.png");
  ichigoSprites.fall = loadImage("IchigoFall.gif");
  ichigoSprites.hit = loadImage("IchigoHit.png"); // Add hit sprite
  
  NarutoSprites.idle = loadImage("NarIdle.gif");
  NarutoSprites.left = loadImage("NarLeft.gif");
  NarutoSprites.right = loadImage("NarRight.gif");
  NarutoSprites.attack = loadImage("NarAirAttack.gif");
  NarutoSprites.jump = loadImage("NarJump.png");
  NarutoSprites.fall = loadImage("NarFall.png");
  NarutoSprites.hit = loadImage ("NarHit.png");
  NarutoSprites.attack2 = loadImage ("naruto_8_transparent.png")
   
  map1 = loadImage("dbz.jpg")
}

// Initialize characters
let sasuke;
let ichigo;

function setup() {
  createCanvas(windowWidth, windowHeight);
sasuke = new Character("Sasuke",500, 650, sasukeSprites);
ichigo = new Character("Ichigo", 700, 650, ichigoSprites);
naruto = new Character ("Naruto" , 800, 650,NarutoSprites);
}

function keyPressed() {
  if (key === 'v') {
    let fs = fullscreen();
    fullscreen(!fs); // This works only when triggered by user input
  }
}
  


function keyPressed() {
  if (key === 'v') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  image(map1,0, 0, width, height)

  // Update and check for attack collisions
  sasuke.update();
  ichigo.update();

  sasuke.attack(32);
  ichigo.attack(70);

  sasuke.getHit(ichigo);
  sasuke.getHit(naruto);
  
  ichigo.getHit(sasuke);
  ichigo.getHit(naruto);
  
  naruto.getHit(sasuke);
  naruto.getHit(ichigo);
  // Movement and gravity
  sasuke.move(LEFT_ARROW, RIGHT_ARROW, ichigo);
  sasuke.jump(UP_ARROW);
  sasuke.applyGravity();
  sasuke.bump(ichigo, naruto);

  ichigo.move(65, 68, sasuke);
  ichigo.jump(87);
  ichigo.applyGravity();
  ichigo.bump(sasuke, naruto);

  naruto.specialMove(16)  
  // Display characters
  sasuke.display();
  ichigo.display();
  naruto.display()
  
 sasuke.x = constrain(sasuke.x, 0, width - 150);
   ichigo.x = constrain(ichigo.x, 0, width - 150);
  console.log(windowWidth, windowHeight)
  fill('black')
  text(mouseX + ", " + mouseY, 20, 20)
  
  naruto.move(74, 76, ichigo) // J for left L for right
  naruto.jump(73)
  naruto.attack (71)
  naruto.applyGravity();
  naruto.bump(sasuke, ichigo)
  console.log(naruto.isAttacking2)
  
}
